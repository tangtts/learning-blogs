# nginx

## 特点

1. 事件驱动&异步非阻塞
   > 事件驱动思想是实现 异步非阻塞特性 的一个重要手段,事件驱动的I/O模型中，程序不必阻塞等待I/O操作的完成，也无需为每个请求创建一个线程，从而提高了系统的并发处理能力和响应速度。
2. proxy cache（服务端缓存）
   > nginx 服务器在接收到被代理服务器的响应数据之后，一方面将数据传递给客户端，另一方面根据proxy cache的配置将这些数据缓存到本地硬盘上。当客户端再次访问相同的数据时，nginx服务器直接从硬盘检索到相应的数据返回给用户，从而减少与被代理服务器交互的时间。

3. 反向代理
   > 通过反向代理，可以隐藏真正的服务，增加其安全性，同时便于统一管理处理请求，另外可以很容易的做负载均衡，更好的面对高并发的场景。
  
<img src="@backImg/nginx-反向代理.webp"/>


## nginx.exe

```bash
start nginx.exe 
```
快速停止服务
```bash
  nginx.exe -s stop	  
```
优雅的 停止服务
```bash
nginx.exe -s quit
```
重新加载 配置文件，这命令可以不用停止nginx
```bash
nginx.exe -s reload
```

 重新打开日志文件

 ```bash
 nginx.exe -s reopen
 ```

 找到 nginx 所在位置

 ```bash
whereis nginx
 ```

检查nginx语法
 ```bash
./nginx -t
 ```


## 模块
各模块的功能作用如下描述：

1. 全局模块： **配置影响 nginx 全局的指令**，比如运行 nginx 的用户名，nginx 进程 pid 存放路径，日志存放路径，配置文件引入，worker进程数等。
2. events块： **配置影响nginx服务器或与用户的网络连接**。比如每个进程的最大连接数，选取哪种事件驱动模型（select/poll epoll或者是其他等等nginx支持的）来处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。
3. http块： **可以嵌套多个server，配置代理，缓存，日志格式定义等绝大多数功能和第三方模块的配置**。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。
4. server块： 配置虚拟主机的相关参数比如域名端口等等，一个http中可以有多个server。
5. location块： 配置url路由规则
6. upstream块： 配置上游服务器的地址以及负载均衡策略和重试策略等等

```shell
# 指定工作进程的个数，默认是1个。具体可以根据服务器cpu数量进行设置
# 比如cpu有4个，可以设置为4。如果不知道cpu的数量，可以设置为auto。 nginx会自动判断服务器的cpu个数，并设置相应的进程数
worker_processes  1;

# 日志输出级别有debug、info、notice、warn、error、crit可供选择，其中，debug输出日志最为最详细，而crit输出日志最少
error_log  logs/error.log  info; # 指定error日志位置和日志级别


events {
    accept_mutex on;   # 设置网路连接序列化，防止惊群现象发生，默认为on
    
    # Nginx支持的工作模式有select、poll、kqueue、epoll、rtsig和/dev/poll，其中select和poll都是标准的工作模式，kqueue和epoll是高效的工作模式，不同的是epoll用在Linux平台上，而kqueue用在BSD系统中，对于Linux系统，epoll工作模式是首选
    use epoll;
    
    # 用于定义Nginx每个工作进程的最大连接数，默认是1024。
    worker_connections  1024; 
}

# 对HTTP服务器相关属性的配置如下 

http { 
  # 引入文件类型映射文件
  include  mime.types;
  # 如果没有找到指定的文件类型映射 使用默认配置
  default_type  application/octet-stream;

   # 日志格式设定 
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
     
  # 设置日志输出路径以及 日志级别
  access_log  logs/access.log  main; 

 # 开启零拷贝 省去了内核到用户态的两次copy故在文件传输时性能会有很大提升
  sendfile        on;

 # 数据包会累计到一定大小之后才会发送，减小了额外开销，提高网络效率
  tcp_nopush     on; 

 # 设置nginx服务器与客户端会话的超时时间。
 # 超过这个时间之后服务器会关闭该连接，客户端再次发起请求，则需要再次进行三次握手。
  keepalive_timeout  65;

 # 开启压缩功能，减少文件传输大小，节省带宽。
  gzip  on; 

  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
  sendfile_max_chunk 100k;

  # 设置字符集
  charset utf-8;
}
```
配置你的上游服务（即被nginx代理的后端服务）的 ip 和端口/域名
```shell
upstream backend_server { 
    server 172.30.128.65:8080;
    server 172.30.128.65:8081 backup; #备机
}
```
```shell
 server {
    listen       80; #nginx服务器监听的端口
    server_name  localhost; #监听的地址 nginx服务器域名/ip 多个使用英文逗号分割
    access_log  logs/host.access.log  main; # 设置日志输出路径以及 级别，会覆盖http指令块的access_log配置
 # location用于定义请求匹配规则。 以下是实际使用中常见的3中配置（即分为：首页，静态，动态三种）


 # 第一种：直接匹配网站根目录，通过域名访问网站首页比较频繁，使用这个会加速处理
 location = / {  
       root   html; # 静态资源文件的根目录
       index  index.html index.htm; # 静态资源文件名称 比如：网站首页html文件
  }

# 第二种：静态资源匹配
# 假设把静态文件我们这里放到了 usr/local/nginx/webroot/static/目录下
location ^~ /static/ {
   # 访问 ip:80/static/xxx.jpg后，将会去获取/url/local/nginx/webroot/static/xxx.jpg 文件并响应
   alias /webroot/static/; 
}

 # 第二种的另外一种方式：拦截所有 后缀名是gif,jpg,jpeg,png,css.js,ico这些 类静态的的请求，让他们都去直接访问静态文件目录即可
location ~* \.(gif|jpg|jpeg|png|css|js|ico)$ {
    root /webroot/static/;
 }

 # 第三种：用来拦截非首页、非静态资源的动态数据请求，并转发到后端应用服务器 
   location / {
    # 🚩请求转向 upstream 是 backend_server 指令块所定义的服务器列表
      proxy_pass http://backend_server; 
      deny 192.168.3.29; #拒绝的ip （黑名单）
      allow 192.168.5.10; #允许的ip（白名单）
}

 # 定义错误返回的页面，凡是状态码是 500 502 503 504 总之50开头的都会返回这个 根目录下html文件夹下的50x.html文件内容
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
      root   html;
  }

# 一般我们实际使用中有很多配置，通常的做法并不是将其直接写到nginx.conf文件，
  include /etc/nginx/conf.d/*.conf;  

}
```

## location 路由匹配规则
1. 空 无修饰符的前缀匹配，匹配前缀是 你配置的（比如说你配的是 /aaa） 的url
1. = 精确匹配
2. ~ 正则表达式模式匹配，区分大小写
3. ~* 正则表达式模式匹配，不区分大小写
4. ^~ ^~类型的前缀匹配，类似于无修饰符前缀匹配，不同的是，如果匹配到了，那么就停止后续匹配
5. / 通用匹配，任何请求都会匹配到（只要你域名对，所有请求通吃！）


### 空

<img src="@backImg/nginx-前缀匹配.webp"/>

```js
http://www.locatest.com/exactmatch      ✅ 200
http://www.locatest.com/exactmatch？    ✅ 200
http://www.locatest.com/exactmatch/     ❌ 404
http://www.locatest.com/exactmatchmmmm  ❌ 404
http://www.locatest.com/EXACTMATCH      ❌ 404
```

### ^~ 

<img src="@backImg/nginx-前缀匹配2.webp"/>

```js
curl http://www.locatest.com/exactprefixmatch     ✅ 200
curl http://www.locatest.com/exactprefixmatch/    ✅ 200
curl http://www.locatest.com/exactprefixmatch?    ✅ 200
curl http://www.locatest.com/exactprefixmatchmmm  ✅ 200
curl http://www.locatest.com/exactprefixmatch/mmm ✅ 200
curl http://www.locatest.com/aaa/exactprefixmatch ❌ 404
curl http://www.locatest.com/EXACTPREFIXMATCH     ❌ 404
```

### ^~/

<img src="@backImg/nginx-前缀匹配3.webp"/>

```js
curl http://www.locatest.com/regexmatch      ✅ 200
curl http://www.locatest.com/regexmatch/     ❌ 404
curl http://www.locatest.com/regexmatch?     ✅ 200
curl http://www.locatest.com/regexmatchmmm   ❌ 404
curl http://www.locatest.com/regexmatch/mmm  ❌ 404
curl http://www.locatest.com/REGEXMATCH      ❌ 404
curl http://www.locatest.com/aaa/regexmatch  ❌ 404
curl http://www.locatest.com/bbbregexmatch   ❌ 404
```

### ~*

<img src="@backImg/nginx-前缀匹配4.webp"/>

可以看到这次 `curl www.locatest.com/REGEXMATCH` 是可以匹配上的，说明 ~* 确实是不区分大小写的。

如果非要给修饰符排个序的话就是酱样子： = > ^~ > 正则 > 无修饰符的前缀匹配 > /

### 反向代理

<img src="@backImg/nginx-反向代理配置.webp"/>

**重点**

这样可以代理
```shell
 location /backend {
    proxy_pass  http://127.0.0.1:3000/test2;
}
```
或者
/backend/ 和 代理的域名 都必须要加 "/"

```shell
upstream myProxy_pass {
    server 127.0.0.1:8080;
 }

location /backend/ {
   proxy_pass http://myProxy_pass/;
 }
```

`location` 尾部使用 `/` 匹配符合以后，还要继续往下搜索

## 负载策略

1. 轮训 
   每个请求会按时间顺序逐一分配到不同的后端服务器,
   在轮询中，如果服务器down掉了，会自动剔除该服务器
   **缺省配置就是轮询策略**
2. weight
   在轮询策略的基础上指定轮询的几率 
   权重越高分配到的请求越多 
3. ip_hash
 只要我不换ip,就会转移到固定的服务下

> 命中几率是81或者82的两倍
```shell
 upstream proxy_pass {
    server 10.154.97.119:80 weight = 2;
    server 10.154.97.119:81;
    server 10.154.97.119:82;
}
```
## 动静分离
将不常修改且访问频繁的静态文件，放到nginx本地静态目录

```shell
# 图片缓存时间设置
location ~ .*.(gif|jpg|jpeg|png|bmp|swf)${
   expires 10d;
}

#JS和CSS缓存时间设置
# 动静分离反向代理配置（多路由指向不同的服务端或界面）
location ~ .*.(js|css)?${
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    expires 1h;
}
```

其实也是普通的拦截

```shell
 location /epri {
    alias   epri;
}
```
或者
```shell
location /epri {
  alias  epri/;
}
```

epri 目录与 `conf` 平级，可以访问 `http://localhost/epri/static/css/862.583036db.css` 来访问 `epri` 文件夹下的 `static` 文件夹下的 `css` 文件夹下的 `css` 文件

## root / alias

1. 使用root，实际的路径就是：root值 + location值。
2. 使用alias，实际的路径就是：alias值。


有一张图片，它在服务器的路径是：`/var/www/app/static/a.jpg`

```shell
 location /homepage {
   alias "/usr/local/Cellar/nginx/1.19.7/html/html/";
   index index.html;
 }
```

:::tip
**location 匹配的 `path` 目录如果后面不带"/"，那么访问的 url 地址中这个 path 目录后面 加不加"/"不影响访问，访问时它会自动加上"/";**  

**但是如果 location 匹配的 path 目录后面加上"/"，那么访问的 url 地址中这个 path 目录 **必须要加上"/"**，访问时它不会自动加上"/"。如果不加上"/"，访问就会失败！**

对应的上面 `epri` 的情况 
:::

alias 中文意思别名，这个和root最大区别就是 **不会进行拼接**

```shell
location /static { # 注意一般 alias的 url都不带后边的/
  alias /usr/local/nginx/test/; # 使用alias时  这里的目录最后边一定要加/ 否则就404
}
```


## 单页面应用刷新404问题
```shell
 location / {
    try_files $uri $uri/ /index.html;
 }
```
其中 `$uri` 代表的就是 请求路径

## 配置跨域请求

```shell
server {
    listen   80;
    location / {
        # 服务器默认是不被允许跨域的。
        # 配置`*`后，表示服务器可以接受所有的请求源（Origin）,即接受所有跨域的请求
        add_header Access-Control-Allow-Origin *;
        
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        
        # 发送"预检请求"时，需要用到方法 OPTIONS ,所以服务器需要允许该方法
        # 给OPTIONS 添加 204的返回，是为了处理在发送POST请求时Nginx依然拒绝访问的错误
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

## 开启gzip压缩

```shell
# gzip模块设置
#开启gzip压缩输出
 gzip on;    
#最小压缩文件大小          
 gzip_min_length 1k;  
#压缩缓冲区 
 gzip_buffers 4 16k;    
#压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
 gzip_http_version 1.0; 
#压缩等级
 gzip_comp_level 2;     
 
  # 设置什么类型的文件需要压缩
 gzip_types text/plain application/x-javascript text/css application/xml;
 
  # 用于设置使用Gzip进行压缩发送是否携带“Vary:Accept-Encoding”头域的响应头部
  # 主要是告诉接收方，所发送的数据经过了Gzip压缩处理
 gzip_vary on;
```

## rewrite

1. last:  本条规则匹配完成后，继续向下匹配新的location URI 规则。
2. break:  本条规则匹配完成即终止，不再匹配后面的任何规则。
3. redirect:  返回302临时重定向，浏览器地址会显示跳转新的URL地址。
4. permanent:  返回301永久重定向。浏览器地址会显示跳转新的URL地址

```bash
# 临时（redirect）重定向配置
location /temp_redir {
    rewrite ^/(.*) https://www.baidu.com redirect;
}
# 永久重定向（permanent）配置
location /forever_redir {
  rewrite ^/(.*) https://www.baidu.com permanent;
}

# rewrite last配置
location /1 {
  rewrite /1/(.*) /2/$1 last;
}
location /2 {
  rewrite /2/(.*) /3/$1 last;
}
```


## 常见内部变量

几个常见配置项：

1. $remote_addr 与 $http_x_forwarded_for 用以记录客户端的ip地址；
2. $remote_user ：用来记录客户端用户名称；
3. $time_local ： 用来记录访问时间与时区；
4. $request ： 用来记录请求的url与http协议；
5. $status ： 用来记录请求状态；成功是200；
6. $body_bytes_s ent ：记录发送给客户端文件主体内容大小；
7. $http_referer ：用来记录从那个页面链接访问过来的；
8. $http_user_agent ：记录客户端浏览器的相关信息
9. $uri 包含请求的文件名和路径，不包含包含“?”或“#”等参数
10. $request_uri 包含请求的文件名和路径及所有参数
    > http://localhost/exactmatch/10?id=3  
    > uri = /exactmatch/10  
    > $request_uri = /exactmatch/10?id=3


安装全局命令


我们刚安装nginx后,使用需要先找到sbin文件夹下的nginx,
执行命令要输入路径 ./nginx

直接输入命令

```bash
ln -s /usr/local/nginx/sbin/nginx /usr/local/bin/
```
ln –s 源文件 目标文件夹  
源文件: /usr/local/nginx/sbin/nginx 就是nginx位置  
目标文件夹: /usr/local/bin/ 就是环境变量目录  


重启失败  
重新指定配置文件。
```bash
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

> 这是一个用于启动 Nginx 服务器的命令，下面是各部分的解释：

> - `/usr/local/nginx/sbin/nginx`: 这部分指定了 Nginx 可执行文件的路径。通常情况下，Nginx 可执行文件位于 `/usr/local/nginx/sbin/nginx` 这个路径下。通过执行这个可执行文件，可以启动 Nginx 服务器。

> - `-c /usr/local/nginx/conf/nginx.conf`: 这部分是通过命令行参数指定了 Nginx 使用的配置文件路径。`-c` 表示后面跟着配置文件的路径，这里指定的是 `/usr/local/nginx/conf/nginx.conf`，即 Nginx 的配置文件所在的路径。Nginx 在启动时会读取这个配置文件来加载配置信息。

> 因此，执行 `/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf` 这个命令会启动 Nginx 服务器，并且告诉 Nginx 服务器在启动时要加载指定的配置文件 `/usr/local/nginx/conf/nginx.conf`。

然后执行

```bash
  nginx -s reload
```
