# Cookie Session jwt
HTTP 是一个无状态的协议
## sessionStorage 和  localeStorage
:::tip 相同点
都不可以跨域，刷新页面都还在
:::

:::tip 不同点
当你切换页面的时候，切换 tab 时，需要使用sessionStorage
因为 sessionStorage 是会话级存储，**在不同的 tab 会存储不同的数据,虽然是同一个域名**  

使用 localeStorage 的话，如果访问 **源`origin`不变**,那么就会一直存在浏览器中


:::
比如
两个页面都是 `http://127.0.0.1:5500/a.html`

一个 `sessionStorage` 可以使 `c = 1`,另一个是 `c = 2 `
但是 `localeStorage` 设置之后`a = 5`,只要刷新之后,另一个页面也会变为 `a = 5`;

---

所以有这种情况  

有两个tab  
a：从 列表页面到 详情页面，使用 localeStorage 存储 a 页面的数据  
b：从 列表页面到 详情页面，使用 localeStorage 存储 b 页面的数据  
当 a 刷新的时候，获取的是 b 存储的数据，获取的是最后一次  
使用 sessionStorage 存储不同的


## cookie
**默认cookie 不支持跨域**，但是可以支持父子域名  
cookie 设置到请求头上，所以有大小限制，不能超过 4k  
只要访问服务器，js 文件也会带有cookie
### cookie 篡改
:::info
cookie可以在浏览器中被篡改，所以需要加密  
比如有 name = "zs"
同时还会设置 name.sig = "zafdasdf"
这样的话，当服务端获取到了 name 和 name.sig 会判断是否有过修改
:::

**Domain 可以指定带cookie 的子域名,特别在单点登录上有使用  
以.jd.com 结尾,那么可以在 .a.jd.com 中可以获得这个cookie**


path 是域名下的那个路径可以访问 / 代表所有,如果设置了/sessionWeb/,只能在本域名下的/sessionWeb/才能访问

maxAge 代表过期时间,默认是 -1,关闭浏览器时过期,如果是 0,表示删除 这个 cookie  

httpOnly 代表只能通过 http修改，无法通过 document.cookie  修改，但是可以直接修改在浏览器里  

comment 该 Cookie 的用处说明，浏览器显示Cookie信息的时候显示该说明。

<img src="@img/cookie.png"/>

## Session
Session 的会话管理
1. 客户端使用 用户名密码 进行认证
2. 服务端生成并存储 Session，将 SessionID 通过 Cookie 返回给客户端
3. 客户端访问需要认证的接口时在 Cookie 中携带 SessionID
4. 服务端通过 SessionID 查找 Session 并进行鉴权，返回给客户端需要的数据

缺点:

- [🔗`csrf`(跨站请求伪造)](../skill/网络.html#csrf) 验证 `referer`

- 当使用多台服务器后，`session` 不能只存储在一个服务器上，所以一种方案是 `session` 复制, 一个 `session` 发生改变, 所有服务器的 `session` 同步发生变化，另一种方案是 存储在 `redis` 中，需要 `session` 去 `redis` 中查询
-  `cookie` 存在跨域，a.xxx.com 和 b.xxx.com 这种还好，可以把 `cookie` 存在一级域名(xxx.com)上,而且 `ajax` 需要设置 `withCredentials` 为  `true`,后端代码设置请求头 `Access-Control-Allow-Origin` 不能为 `*`

## jwt(json web tokens)
*bearer 持票人*  
其实和 加密的 cookie 很相似，但是 cookie 不能跨域，token 可以随便传递，而且自带加密

优点 :  
- 服务端不需要存储和用户鉴权有关的信息,降低了系统架构复杂度，避免了大量的数据库和缓存查询，降低了业务接口的响应延迟 
- Cookie是不允许跨域访问的，token支持

缺点:   
- JWT Token 一旦签发，就会在有效期内一直可用，无法在服务端废止,可以配合 redis 删除
- 正常情况下要比 session_id 更大，需要消耗更多流量，挤占更多带宽

:::tip 加密encode
1. part1: 头部是 { typ: JWT,alg:'HS256'} 的 **base64** 类型和加密算法
2. part2: payload 的 **base64**
3. footer 是 (part1+ . + part2) + secret 的加密
返回 part1 + . + part2 + . + part3
:::

:::tip 解密decode
把 content 解析成 3 部分 [ part1,part2,part3] = content.split('.')  
把 part1 和 part2 和 secret 继续加密和 part3 进行比较
:::

```js
const crypto = require("crypto");
const jwt = {
  // 转 base64
  ToBase64(content) {
    return Buffer.from(JSON.stringify(content)).toString("base64url");
  },
  // 加密签名
  sign(content, secret) {
    return crypto
      .createHmac("sha256", secret)
      .update(content)
      .digest("base64url");
  },
  // 头部是固定格式,转 base64
  // payload 转 base64
  // sign = 加密(头部 + "." + payload,secret)
  // return 头 + . + payload + . + sign
  encode(payload, secret) {
    let part1 = this.ToBase64({ typ: "JWT",alg:'HS256' });
    let part2 = this.ToBase64(payload);
    let part3 = this.sign(`${part1}.${part2}`, secret);
    return `${part1}.${part2}.${part3}`;
  },
  decode(content, secret) {
    let [part1, part2, part3] = content.split(".");
    const res = this.sign(`${part1}.${part2}`, secret);
    if(res == part3){
      return  JSON.parse(Buffer.from(part2,"base64url").toString())
    }
    return false;
  },
};
const secret = "zf";
let res = jwt.encode({ use: 1 }, secret);
let d = jwt.decode(res, "zf");
// eyJ0eXAiOiJKV1QifQ.eyJ1c2UiOjF9.Oca_dPc0nuRbxQLRVSavRuHiqM3pV3fbSb16761c2SY
console.log(d);
```