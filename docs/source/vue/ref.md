# ref 原理

本质和 `reactive` 一样,把当前 `dep`  与 `activeEffect` 绑定,当触发 `get/set` 时,追踪触发 `activeEffect`

**一个 `ref` 可能会被多个 `effect` 使用,`ref` 不仅接收`原始值`,还可以接收 `引用值`**
```js
let x = ref(0);
let y = ref({name:"zs"});

effect(()=>{
  app.innerHTML =  x.value 
  app2.innerHTML =  y.value.name
})

effect(()=>{
  app2.innerHTML = x.value
})
x.value = 1
```
## 解析
使用工厂模式创建类 - `RefImpl`  

由于 `ref` 可能会被多个 `effect` 使用,所以使用 `Set`  存储`activeEffect`, 当 `ref` 变化时,触发多个 `activeEffect` 重新执行

```js
function ref(value) {
  return new RefImpl(value);
}

class RefImpl {
  _value;
  dep = new Set();
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }
  get value() {
     if (activeEffect) {
      trackEffects(this.dep); //[!code hl]
    }
    return this._value;
  }
  set value(newVal) {
    if (newVal !== this.rawValue) {
      this.rawValue = newVal;
      this._value = toReactive(newVal);
      triggerEffects(this.dep); //[!code hl]
    }
  }
}
```

<blue> 如果 <code>rawValue</code> 是一个对象，需要使用 <code>reactive</code> 包裹,原因后面再说</blue>  

```js
function toReactive(source) {
  return isObject(source) ? reactive(source) : source;
}
```
在 `effect` 回调函数内部,只要使用 `.value`，会触发 `get` 方法,从而执行`trackEffects` 函数

```js
function trackEffects(dep) {
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
```
当修改 `.value`时触发 `set` 方法时,会执行 `triggerEffects` 函数

```js
function triggerEffects(effects) {
  if (effects) {
    effects = [...effects]; 
    effects.forEach((effect) => {
      // 当前正在执行的和现在要执行的是同一个我就屏蔽掉
      if (activeEffect !== effect) {
         effect.run(); 
      }
    });
  }
}
```

## 为何要对对象使用 `reactive` 包裹
```js
const a = ref({name:"zs"})
effect(() => {
   app.innerHTML = a.value.name
})
setTimeout(() => {
  a.value.name = 'xxx'
}, 1000)
```
其实只触发了`ref` 的 `get` 方法,只是对象的属性发生了变化,而不是引用发生了变化,所以需要使用 `reactive` 包裹对象,从而触发 `effect`
## 为何 `ref` 可以更改引用地址,还能保留响应式
```js
const a = ref({name:"zs"})
a.value = {age:18}
effect(() => {
 app.innerHTML = a.value.age
})
setTimeout(() => {
  a.value.age = 19
},1000)
```
**因为 `ref` 并不是使用的 `porxy` 监控属性变化**   
 当 `a.value` 引用地址发生改变时即 `a.value = {age:18}`, 触发 `set` 方法,执行`this._value = toReactive(newVal)`  
 当使用 `a.value.age` 时,返回`this._value`, 同时 `dep` 开始追踪 `a` 对应的 `activeEffect` 实例,整个过程和引用地址修改无关

 ## toRef / toRefs

```js
class ObjectRefImpl {
  constructor(public object, public key) {}
  get value() {
    return this.object[this.key];
  }
  set value(val) {
    this.object[this.key] = val;
  }
}
```

```js
function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}
```

```js
function toRefs(object) {
  let res = {};
  for (let key in object) {
    res[key] = toRef(object, key);
  }
  return res;
} 
 ```
 



