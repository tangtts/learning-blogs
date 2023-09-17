# reactive原理
:::info
  **首先要使用 `reactive` 属性,必须要在 `effect` 函数内部, 编译后每一个组件都是由一个`effect`包裹**
:::
##  使用
<red>本质是发布订阅模式</red>
当 `reactive` 的属性发生变化时,要通知所有的观察者,即 `effect` 内部回调函数要重新执行  

```js
const data = { name: 'jw', age: 30, flag: true }
const state = reactive(data);

effect(()=>{
   app1.innerHTML = state.flag ? state.name : state.age
})

 setTimeout(() => {
  state.flag = false; // 会显示age
}, 1000)
```

## effect
effect 接受一个函数,函数会自动执行一次  
如果在函数内部使用了 `reactive` 对象,当 `reactive` 的属性发生变化时,会再次自动执行该函数    

**所以要把 `effect` 与 `reactive` 属性关联起来**

定义 **全局变量 `activeEffect`** 不断的指向执行的  `effect`,`effect` 有可能是嵌套,所以要记录父级`effect`
```js
// 全局变量
let activeEffect = undefined;

class ReactiveEffect{
  constructor(public fn) {}
  parent = undefined;
  deps = []; // effect中要记录哪些属性是在effect中调用的
  run(){
    // 当运行的时候 我们需要将属性和对应的effect关联起来
    // 利用js是单线程的特性，先放在全局，在取值
    try {
      this.parent = activeEffect;
      // 全局变量指向 当前effect实例
      activeEffect = this;  // [!code hl]
      cleanupEffect(this);
      return this.fn(); // 触发属性的get
  } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
}

function effect(fn) {
// 将用户的函数，拿到变成一个响应式的函数
const _effect = new ReactiveEffect(fn);
// 默认让用户的函数执行一次
_effect.run();
}
```
每次执行 `effect` 的时候,都会创建一个 `ReactiveEffect` 实例,并且 `activeEffect` 指向此实例  

当执行 `_effect.run()` 时,会执行 `fn` 函数

## reactive 原理
在 `reactive` 中,使用 `Proxy` 进行代理访问源对象的访问
```js
  function reactive(target){
    // 必须保证是一个对象
    if (!isObject(target)) {
      return target;
    }
    const proxy = new Proxy(target, mutableHandlers);
    return proxy
  }
```
其中在 `mutableHandlers` 会使用 `get/set` 访问器属性代理访问源对象
## 依赖收集 get / set
```js
const mutableHandlers = {
  get(target, key, recevier) {
    track(target, key);
    return Reflect.get(target, key, recevier);
  }

  set(target, key, value, recevier) {
    let oldValue = target[key];
    let flag = Reflect.set(target, key, value, recevier);
    if (value !== oldValue) {
      trigger(target, key, value, oldValue);
    }
    return flag;
  },
}
```


### get触发 track
当触发 `reactive` 的 `get` 访问器时,会执行 `track` 方法,收集依赖
```js
const targetMap = new WeakMap();

function track(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    // 收集全局变量 activeEffect
    dep.add(activeEffect); //[!code hl]
    activeEffect.deps.push(dep); //[!code hl]
  }
```
使用 `weakMap` 收集 `target`,在 `target` 上的 `key` 对应的 `set` 中添加 `activeEffect`,同时 `activeEffect.deps` 也在收集对应的 `dep`  

**`target` 与 `activeEffect` 形成了相互依赖,target 对应的 set 收集 `activeEffect`,`activeEffect` 的 `deps` 收集 `dep`**

### set触发 trigger

```js
//  { name: 'jw', age: 30 } -> {name => [effect,effect]}
function trigger(target, key) {
  // 找到effect执行即可
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let effects = depsMap.get(key);
  if (effects) {
    effects = [...effects]; 
    effects.forEach((effect) => {
      if (activeEffect !== effect) {
        effect.run();  //[!code hl]
      }
    });
  }
}
```
当触发 `reactive` 的 `set` 访问器时,会执行 `trigger` 方法,触发依赖的 `effect`
执行 `effect.run` 方法,会再次执行 `fn`

## 小技巧
### 如何避免重复 `reactive`  
当 `reactive` 执行时,会判断 `target` 是否已经 `reactive` 过,如果已经 `reactive` 过,不再执行 `reactive`
 ```js
let x = { name: 'zs' }
let y = reactive(x)
let r = reactive(y)
console.log(y == r) // true
```
 代码如下:
```js
enum ReactiveFlags {
  "IS_REACTIVE" = "__v_isReactive",
}

function reactive(target){
  if (target[ReactiveFlags.IS_REACTIVE]) {
      return target;
    }
    // ...
}

const proxy = new Proxy(target, {
  get(target, key, recevier) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
  }
});
```


1. 第一次是普通对象,没有 `ReactiveFlags.IS_REACTIVE`,所以是 false
2. 第二次再去 `reactive`,传入的是 `proxy` 过的对象,所以会触发 `get` 访问器,返回 `true`


<iframe
  height="800"
  width="100%"
  frameborder="1"
  src="//unpkg.com/javascript-playgrounds@^1.0.0/public/index.html?#data=%7B%22code%22%3A%22let%20ReactiveFlags%20%3D%20%7B%5Cn%20%20%20%20%20%20%5C%22IS_REACTIVE%5C%22%3A%20%5C%22__v_isReactive%5C%22%2C%5Cn%20%20%20%20%7D%5Cn%5Cn%20%20%20%20function%20reactive(target)%20%7B%5Cn%20%20%20%20%20%20%2F%2F%20%E7%AC%AC%E4%B8%80%E6%AC%A1%E6%98%AF%E6%99%AE%E9%80%9A%E5%AF%B9%E8%B1%A1%2C%E8%BA%AB%E4%B8%8A%E6%B2%A1%E6%9C%89%20ReactiveFlags.IS_REACTIVE%20%E5%B1%9E%E6%80%A7%2C%E5%BE%80%E4%B8%8B%E6%89%A7%E8%A1%8C%5Cn%20%20%20%20%20%20%2F%2F%20%E7%AC%AC%E4%BA%8C%E6%AC%A1%E6%98%AF%20proxy%2C%E5%86%8D%E6%AC%A1%E8%AE%BF%E9%97%AE%20ReactiveFlags.IS_REACTIVE%20%E5%B1%9E%E6%80%A7%2C%E4%BC%9A%E8%A7%A6%E5%8F%91%20get%20%E8%AE%BF%E9%97%AE%E5%99%A8%5Cn%20%20%20%20%20%20%2F%2F%20if%20(target%5BReactiveFlags.IS_REACTIVE%5D)%20%7B%5Cn%20%20%20%20%20%20%2F%2F%20%20%20return%20target%3B%5Cn%20%20%20%20%20%20%2F%2F%20%7D%5Cn%20%20%20%20%20%20console.log(target)%5Cn%20%20%20%20%20%20if%20(target%5BReactiveFlags.IS_REACTIVE%5D)%20%7B%5Cn%20%20%20%20%20%20%20%20return%20target%3B%5Cn%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%2F%2F%20...%5Cn%20%20%20%20%20%20const%20proxy%20%3D%20new%20Proxy(target%2C%20%7B%5Cn%20%20%20%20%20%20%20%20get(target%2C%20key%2C%20recevier)%20%7B%5Cn%5Cn%20%20%20%20%20%20%20%20%20%20if%20(key%20%3D%3D%3D%20ReactiveFlags.IS_REACTIVE)%20%7B%5Cn%20%20%20%20%20%20%20%20%20%20%20%20console.log(1213)%5Cn%20%20%20%20%20%20%20%20%20%20%20%20return%20true%3B%5Cn%20%20%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%20%20%20%20console.log('get'%2C%20target)%5Cn%20%20%20%20%20%20%20%20%20%20return%20Reflect.get(target%2C%20key%2C%20recevier)%3B%5Cn%20%20%20%20%20%20%20%20%7D%5Cn%20%20%20%20%20%20%7D)%3B%5Cn%20%20%20%20%20%20return%20proxy%5Cn%20%20%20%20%7D%5Cn%20%20%20%20let%20x%20%3D%20%7B%20name%3A%20'zs'%20%7D%5Cn%20%20%20%20let%20y%20%3D%20reactive(x)%5Cn%20%20%20%20let%20r%20%3D%20reactive(y)%22%7D"
></iframe>

### 避免对同一个对象 `reactive` 两次
 ```js
let x = { name: 'zs' }
let y = reactive(x)
let r = reactive(x) 
console.log(y == r) // true
```
```js
  const reactiveMap = new WeakMap(); // 防止内存泄露的
   // 防止同一个对象被代理两次，返回的永远是同一个代理对象
  let exitstingProxy = reactiveMap.get(target);
  if (exitstingProxy) {
    return exitstingProxy;
  }
  // 返回的是代理对象
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
```

## 全局属性 `activeEffect` 引用变化问题
更改 `activeEffect` 引用,并不会影响`dep`已经存储 `activeEffect` 的值    
因为 `push` 的是一个引用,当 `a` 重新赋值时,`a`的引用地址发生了变化,但是存储的引用地址还是原来的

```js
let a = null;
let o = {
  c: []
}
a = { name: "zs" }
o.c.push(a)
a = { name: "lisi" }
o.c.push(a)
console.log(o.c) //[{name:'zs'},{name:'lisi'}]
```








