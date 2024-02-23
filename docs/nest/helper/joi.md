# joi

## 安装

[官网](https://joi.dev/api/?v=17.12.0#introduction)
```bash
pnpm i joi
```

## 参数
### .required()
<br/>
<blue>所有参数都是非必填</blue>

必选属性，如果需要此校验字段，需要将这个校验规则放到最后面。
```js
let Schema = Joi.object({
  name:Joi.string().required()
});
```
### .pattern()
正则校验

```js
let Schema =Joi.string().pattern(/\d/ig);
```

### .allow()
在校验条件外允许某些值通过

```js
let Schema = Joi.object({
  sex: Joi.string().optional().allow(null,"1234"),
});
```
### .invalid,disallow,not
在校验条件外不允许某些值通过
```js
let info = {
  sex:"100"
};
let Schema = Joi.object({
  sex: Joi.string().invalid("100").required(),
});
```

### .valid / equal
允许的枚举值

```js
let info = {
  sex:"1"
};

let Schema = Joi.object({
  sex: Joi.string().valid("0","1").required(),
});
```

### .default([value])

默认值

【value】:只允许有一个值，但是取值允许为

- 字符串、数字、对象等  
- 使用签名返回默认值的函数，function(**parent要校验的整个对象**)

```js
const generateUsername = (parent) => {
  return parent.firstname.toLowerCase() + '-' + parent.lastname.toLowerCase();
};

const schema = Joi.object({
    username: Joi.string().default(generateUsername),
    firstname: Joi.string(),
    lastname: Joi.string(),
    created: Joi.date().default(Date.now),
    status: Joi.string().default('registered')
})
```

### .when([condition],options)

添加在验证期间评估的条件并在将架构应用于值之前对其进行修改 其实就是：相当于条件判断

```js
// 如果email存在时，判断email是否符合邮箱格式，
// 符合，则判断name字段必填，否则，name属性可以选填
let info = {
  email: "test@163.com",
  name:"long"
};
let Schema = Joi.object({
  email: Joi.string(),
  name: Joi.string().when("email",
    { 
      is:Joi.string().email(),
      then:Joi.string().required()
    })
});
```
`exist()` 是否存在
```js
const schema = {
  a: Joi.any()
      .valid('x')
      .when('b', 
        { is: Joi.exist(), 
          then: Joi.valid('y'), 
          otherwise: Joi.valid('z') 
        })
      .when('c', 
        { is: Joi.number().min(10),
          then: Joi.forbidden() 
        }),
  b: Joi.any(),
  c: Joi.number()
};
```

如果有startTime 那么必须要 endTime;
```js
// 开始时间 会自动格式化 
startTime: Joi.date().min('1-1-1974').max('now'), 

// 结束时间 必须大于开始时间，小于2100-1-1 
endTime: Joi.when(Joi.ref('startTime'), {
   is: Joi.exist(),
  then: Joi.date().max('1-1-2100').required() }), 
```
相当于 switch
```js
const schema = Joi.object({
    a: Joi.number().required(),
    b: Joi.number()
        .when('a', [
            { is: 0, then: 1 },
            { is: 1, then: 2 },
            { is: 2, then: 3, otherwise: 4 }
        ])
});
```

### alternatives(翻译替代品)

```js
const alt = Joi.alternatives().try(Joi.number(), Joi.string());
// Same as [Joi.number(), Joi.string()
```

### min/max/length
- 指定数组中的最小项目数、数字最小值、字符串最小长度
- 指定数组中的最大项目数、数字最大值、字符串最大长度
- 指定所需的确切字符串长度
```js
let info = {
  mobile: "13027711111"
};
let Schema = Joi.object({
  mobile: Joi.string().length(11)
});
```
### .uri([options])
校验uri是否符合规范

```js
// Accept git or git http/https
const schema = Joi.string().uri({
  scheme: [
    'git',
    /git\+https?/
  ]
});
```

### regexp

```js
 const schema2 = Joi.object({
    firstname: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    lastname: Joi.string(),
  })
```
### []
可以是 string类型或者是 number 类型
```js
 const schema2 = Joi.object({
    firstname: Joi.string(),
    access_token: [Joi.string(), Joi.number()],
  })
```


### date

```js
 startTime: Joi.date().min('1-1-1974').max('now'), 
```

## 数字

### number.integer()
只能是一个整数，不能是一个浮点数
```js
const schema = Joi.number().integer();
```
### number.less(limit)

```js
const schema = Joi.number().less(10);
```

对象校验数字

```js
const schema = Joi.object({
  min: Joi.number().less(Joi.ref('max')).required(),
  max: Joi.number().required()
});
```

### number.positive() 正数

```js
const schema2 = Joi.number().positive()

const a2 = schema2.validate(-1); // true
```

## 数组

```js
// 数组中包含某个字段 && 数字 
arrayString: Joi.array().items( 
    // 数组中必须包含 name1 
    Joi.string().label('name1').required(), 
    // 数组中包含数字 
    Joi.number(), 
).required()
```

## 综合例子
```js
const schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    access_token: [
        Joi.string(),
        Joi.number()
    ],

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .with('username', 'birth_year')
    .xor('password', 'access_token')
    .with('password', 'repeat_password').or;
```
- username 必须是一个字符串数字
- email 必须有两个域名，`example.com`,tlds(top-level-domin) 可以在 `com` 或者在 `net` 中选择
- 使用 `with` 方法,那么必须要有 username 和 birth_year 同时存在
- 使用 `xor`(without一样) 方法,那么只能有一个存在
- 如果 password 存在，那么 repeat_password 必须存在，如果 access_token 存在，那么 password 必须不存在
- 使用 `or`,两个可以至少存在一个
校验

```js
const { error, value } = schema.validate({
  username: "1234",
  access_token: "112312",
  birth_year: 2000
});
```
或者

```js
try {
  const value = await schema.validateAsync({ 
    username: 'abc', 
    birth_year: 1994 
  });
}
catch (err) { }
```