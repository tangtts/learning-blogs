# 技巧 - js
## 强制传参
```js
// 如果不传参数的话，会直接报错
function throwIfMissing() {
 throw new Error('Missing parameter');
}
 
function foo(mustBeProvided = throwIfMissing()) { 
   return mustBeProvided;
}
```
## 对象设置正反值
```js
obj[obj.up = 0] = "up" // obj[0] = 'up'
// 由于obj 外面的值是等于号右边的值，所以造成 obj[0] = "up"
// 这也是enum 类型的来源
```

## 设置字符串形参
```js
  // 如果传 slow 字符串的话，其实就是传 600 默认值，也可以传固定时间
  let speeds = {
  slow:600,
  fast:500
}

function delay(time){
  time = speeds[time] || time
}
```

## js 中的枚举成员
使用 freeze 保证不会被修改
```js
const userType = Object.freeze({
  child:1,
  adult:2,
  elder"3"
})

if(xx == usertType.child) { }
```

## 变量默认值
```js
num = ++ num || 1
// 因为num 是 undefined 的话，会走后面的 1
// ++undefined s是 NaN，属于 falsy 值
```

## 统一导出
```js
 // 在 home.js 中使用到的 export default
export { default as Home} from "./Home.js"
// 本质是是下面的简写
import { default as Home } from "./Home.js"
export Home
// 在使用是
import {Home} fromr "../xxx"
```