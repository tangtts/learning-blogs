# 面试

## 任务执行顺序
```js
setTimeout(() => {
  console.log(1)
},0)

// 宏任务
setImmediate(() => {
  console.log(2)
})

//微任务
process.nextTick(() => {
  console.log(3)
})

new Promise((resolve, reject) => {
  console.log(4)
  resolve(4)
}).then(() => {
  console.log(5)
})

console.log(6)
```

465321，这个顺序不一定，`process.nextTick` 处于当前所有任务结束之后，又开始新一轮任务之前