# linux


查看所有端口占用
```bash
netstat -tlnp
```

<img src="@other/netstat.png"/>

## 文件操作

### 新增文件（touch）
```bash
touch 文件名
```
### 删除文件(rm)

```bash
rm 文件名              //删除当前目录下的文件
rm -f 文件名           //删除当前目录的的文件（不询问）
```

### 编辑文件（vi、vim）

```bash
#打开需要编辑的文件
 vi 文件名              
```
进入后，操作界面有三种模式：命令模式（command mode）、插入模式（Insert mode）和底行模式（last line mode）

1. 命令模式
   - 刚进入文件就是命令模式，通过方向键控制光标位置，
   - 使用命令"dd"删除当前整行
   - 使用命令"/字段"进行查找
   - 按"i"在光标所在字符前开始插入
   - 按"a"在光标所在字符后开始插入
   - 按"o"在光标所在行的下面另起一新行插入
   - 按"："进入底行模式
2. 插入模式
     - 此时可以对文件内容进行编辑，左下角会显示 "-- insert --""
     - 按"ESC"进入底行模式
  底行模式
     - 退出编辑：      :q
     - 强制退出：      :q!
     - 保存并退出：    :wq

1. 操作步骤示例 
     1. 保存文件：按"ESC" -> 输入":" -> 输入"wq",回车     //保存并退出编辑
     2. 取消操作：按"ESC" -> 输入":" -> 输入"q!",回车     //撤销本次修改并退出编辑
2. 补充 
     1. vim +10 filename.txt                   //打开文件并跳到第10行
     2. vim -R /etc/passwd                     //以只读模式打开文件


### 删除当前行

```bash
d + d
```

### 查找关键词
在只读模式下
```bash
/ + 关键词
```
查找下一个 `n`

### 查看文件

```bash
# 查看文件最后一屏内容
cat a.txt 
```


暂停屏幕输出
```bash
ctrl +  s
```

恢复屏幕输出
```bash
ctrl +  q
```
清屏
```bash
ctrl + l
```
快速移动光标，a 是首字母，e 是结尾
```bash
ctrl + a / ctrl + e
```
结束正在运行的程序

```bash
ctrl + c
```
结束或者退出 shell
```bash
ctrl + d
```



## 目录

### 切换目录（cd）

```bash
# 切换到根目录
  cd /      
  # 切换到根目录下的bin目录
  cd /bin              
  # 切换到上一级目录 或者使用命令：cd ..
  cd ../               
  # 切换到home目录
  cd ~                 
  # 切换到上次访问的目录
  cd -                 
  # 切换到本目录下的名为xx的文件目录，如果目录不存在报错
  cd xx(文件夹名)       
  # 可以输入完整的路径，直接切换到目标目录，输入过程中可以使用tab键快速补全
  cd /xxx/xx/x        
```

```bash
 # 查看当前目录下的所有目录和文件
  ls                   
  # 查看当前目录下的所有目录和文件（包括隐藏的文件）
  ls -a                
  # 列表查看当前目录下的所有目录和文件（列表查看，显示更多信息），与命令"ll"效果一样
  ls -l                
  # 查看指定目录下的所有目录和文件
  ls /bin             
```   

### 创建目录（mkdir）
```bash
#在当前目录下创建一个名为tools的目录
mkdir tools          
#在指定目录下创建一个名为tools的目录
mkdir /bin/tools     
```

### 删除文件
	-r 就是向下级文件夹递归，全部删除。
	-f 就是强制删除。
```bash
# 删除文件夹：
# 例如：删除/etc/nginx/log目录以及其下所有文件、文件夹
	rm -rf /etc/nginx/log
# 删除文件：
# 例如：强制删除/etc/nginx/log/access.log文件
rm -f /etc/nginx/log/access.log
```
### 修改目录（mv）

```bash
#修改目录名，同样适用与文件操作
  mv 当前目录名 新目录名        
#将/usr/tmp目录下的tool目录剪切到/opt目录下面
  mv /usr/tmp/tool /opt       
#递归剪切目录中所有文件和文件夹
  mv -r /usr/tmp/tool /opt    
```

### 拷贝目录（cp）

```bash
# 将/usr/tmp目录下的tool目录复制到 /opt目录下面
  cp /usr/tmp/tool /opt       
# 递归剪复制目录中所有文件和文件夹
  cp -r /usr/tmp/tool /opt  
```


```bash
#详细信息
ll 
# 不是详细信息
ls  
# 查看隐藏文件
ls -a
# 创建文件
touch a/b
# 创建文件夹
mkdir

# 当前目录
pwd
# 查看文件内容
cat 文件名
```

## 打包/解压

### 打包文件

```shell
# 压缩文件
zip -r test.zip file
# 解压文件
unzip -d /home/hepingfly/abc/ mytxt.zip
```

>tar [选项] [-f 压缩包名] 源文件或目录  
> 选项：   
​> -c：打包  
​> -f：指定压缩包的文件名。压缩包的扩展名是用来给管理员识别格式的，所以一定要正确指定扩展名。  
>​ -v：显示打包文件过程  

```bash
# 压缩文件
tar -cvf test.tar abd.txt bcd.txt 
```

> tar [选项] 压缩包  
> 选项： 
​> -x：解打包  
​> -f：指定压缩包的文件名  
​> -v：显示解打包文件过程

```bash
tar -xvf test.tar abd.txt bcd.txt -C /usr // 指定解压的位置
```

### yum

```bash
# 说明：安装插件命令
  yum install httpd      # 使用yum安装apache 
  yum update httpd       # 更新apache 
  yum remove httpd       # 卸载/删除apache 
```

## 系统管理

### 防火墙操作
```bash
 ##centos7 防火墙操作
  systemctl start firewalld  // 开启防火墙
  systemctl status firewalld.service     //查看防火墙状态
  systemctl stop firewalld.service       //关闭运行的防火墙
  systemctl disable firewalld.service    //永久禁止防火墙服务
```

```bash
firewall-cmd --zone=public --list-ports // 查询已开放的端口列表
netstat -apn | grep  80 端口号 // 查询指定端口是否开放
firewall-cmd --query-port=80/tcp // 查询指定端口是否已开
```

当服务器未安装 netstat 工具时，查看端口监听状态会提示如下报错 “command not found”。

```bash
yum install net-tools
```



```bash
firewall-cmd --add-port=80/tcp --permanent // 添加指定需要开放的端口
firewall-cmd --reload // 重载入添加的端口
firewall-cmd --permanent --remove-port=123/tcp // 移除指定端口：
````

### 查看网络

```bash
ifconfig
```

### 查看进程
```bash  
ps -ef         //查看所有正在运行的进程
```

### 结束进程

```bash
kill pid       //杀死该pid的进程
kill -9 pid    //强制杀死该进程   
```

### 查看链接

```bash
ping IP        //查看与此IP地址的连接情况
netstat -an    //查看当前系统端口
netstat -an | grep 8080     //查看指定端口
```