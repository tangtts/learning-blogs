# watch

`watch` 可以接收一个普通对象,也可以接收一个`函数`
watch 可以接收的有
1. isRef
2. isReactive
3. isArray
4. isFunction
除此之外,无法使用,比如 `普通对象`,`reactive的某一个值`...

## 解析
```js
function watch(source, cb, options: any = {}) {
  doWatch(source, cb, options);
}
```
:::tip
  对 source 进行判断,如果 source 是 ref 或者 reactive 的某一个值,那么就直接使用 getter 获取值,如果 source 是数组,那么就遍历数组,然后使用 getter 获取值,如果 source 是函数,那么就直接使用 source 作为 getter
:::
```js
function doWatch(source, cb, options) {
  let getter;
  if(isRef(source)){
    getter = ()=>source.value;
  }
  else if (isReactive(source)) {
    getter = () => traverse(source);
  }
  else if(Array.isArray(source)){
    getter = () => source.map(item => {
      if(isRef(item)){
         return s.value
      }else if(isReactive(item)){
         return traverse(s)
      }else if(isFunction(item)){
        return item
      }else {
        return item
      }
    })
  }
  else if (isFunction(source)) {
    getter = source;
  }
}
```
如果是`reactive`,则需要每个属性都要对当前 `effect` 进行捕获,性能不高
```js
function traverse(source, seen = new Set()) {
  if (!isObject(source)) {
    return source;
  }
  if (seen.has(source)) {
    return source;
  }
  seen.add(source);
  for (let k in source) {
    // 这里访问了对象中的所有属性
    traverse(source[k], seen);
  }
  return source;
}
```
<blue><code> watch</code>本质也是一个 <code>ReactiveEffect</code> </blue>  

```js
const effect = new ReactiveEffect(getter, job);
if (options.immediate) {
  job();
}
oldValue = effect.run();
```
当不是`immediate` 的时候,执行 `effect.run`,那么 `getter` 方法会执行, `ref/reactive` 开始依赖追踪
当`ref/reactive` 发生变化时,由于传入了 `scheduler`, 会执行 `job` 方法, 然后 `effect.run` 方法会再次执行, 获取最新的值

```js
const newValue = effect.run();
cb(newValue, oldValue, onCleanup);
oldValue = newValue;
```

## cleanup 函数的作用
在 `watch` 中,会出现`竞态`问题

```js
const state = reactive({ n: 0 });
const map = {
  1: { timer: 3000, returnVal: 'abc' },
  2: { timer: 2000, returnVal: 'bcd' }
}

function getData(newVal) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(map[newVal].returnVal)
      }, map[newVal].timer)
    })
}

```
```js
watch(() => state.n, async (newVal, oldVal, onCleanup) => {
  let r = await getData(newVal)
  app.innerHTML = r
}

state.n++;
state.n++
```
当`state.n`发生变化之后,`watch` 会执行,但是第一个接口还没有返回,第二个接口就已经执行了,导致`app.innerHTML` 两秒之后显示的是 `bcd`,等到第三秒转到了 `abc`

所以要避免这种情况发生,就要在执第二个getData函数的时候，把第一个给屏蔽掉  

<blue>可以使用闭包</blue>

```js
watch(() => state.n, async (newVal, oldVal, onCleanup) => {
  let flag = true

  onCleanup(function () {
    flag = false
  })

  let r = await getData(newVal)
  flag && (app.innerHTML = r)
})
```
相当于下面的这种写法：
```js
const map = {
  1: { timer: 1000, returnVal: "abc" },
  2: { timer: 2000, returnVal: "bcd" },
  3: { timer: 2000, returnVal: "efg" },
};

function getData(newVal) {
  return new Promise((resolve, reject) => {
     setTimeout(() => {
       resolve(map[newVal].returnVal);
     }, map[newVal].timer);
   });
}

let i = 0;

let clean;
const onCleanup = fn => {
  if (clean) clean();
  clean = fn;
};

function doWatch(cb) {
   cb(onCleanup);
}
// 第一次执行
doWatch(async onCleanup => {
  let flag = true
  onCleanup(function () {
    flag = false
  })
  let r = await getData(++i)
  console.log(r, flag, "flag")// abc false flag
  flag && (app.innerHTML = r)
})
// 第二次执行
doWatch(async onCleanup => {
   let flag = true
   onCleanup(function () {
     flag = false
   })
   let r = await getData(++i)
   console.log(r, flag, "flag") // bcd true flag
   flag && (app.innerHTML = r)
})
// 第三次执行
doWatch(async onCleanup => {
   let flag = true
   onCleanup(function () {
     flag = false
   })
   let r = await getData(++i)
   console.log(r, flag, "flag") // bcd true flag
   flag && (app.innerHTML = r)
})
```
第一次执行 `doWatch` 函数中的 `onCleanup` 里面传入的函数赋值给了 `clean`  

第二次执行的时候,把上一次的 `clean` 执行了,也就是把上一次的 `flag` 给修改了;同时把这一次的回调函数赋值给了`clean`

每一次执行都把上一次的 `clean` 执行了,也就是把上一次的 `flag` 给修改了;同时把这一次的回调函数赋值给了`clean`,等到 `await` 结果返回的时候,已经成 false 了