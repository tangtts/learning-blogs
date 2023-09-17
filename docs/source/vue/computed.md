# computed
**本质是一个 `effect`,让 `getter` 函数属性收集 `effect`**

<blue>特点：多次获取 <code>computed</code> 的值,<code>get方法</code> 只会执行一次,即懒执行,除非依赖的属性发生了变化</blue>

```js
const state = reactive({ firstname: 'j', lastname: 'w', age: 30 });

const fullname = computed({
    get: () => {
       console.log('computed~~~') // 只会执行一次
       return state.firstname + state.lastname
    },
    set: (val) => {
        console.log(val); 
    }
 })
// 计算属性也是一个effect， 依赖的状态会收集计算属性的effect
// 计算属性会触发他收集的effect
effect(() => { // 计算属性也可以收集effect
  console.log(fullname.value, 'effect')
  console.log(fullname.value, 'effect')
  console.log(fullname.value, 'effect')
  console.log(fullname.value, 'effect')
})

setTimeout(()=>{
  fullname.value = 'jerry'
},1000)
```

## 解析

由于 `computed` 可以接收`函数/对象`,所以要执行参数归一化
```js
  function computed(getterOrOptions) {
  const isGetter = isFunction(getterOrOptions);
  let getter;
  let setter;
  if (isGetter) {
    getter = getterOrOptions;
    setter = () => {
      console.warn("computed is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return new ComputedRefImpl(getter, setter);
}
```
同样的使用类 `ComputedRefImpl` 执行复杂功能

```js
class ComputedRefImpl {
  effect;
  _value;
  dep = new Set();
  _dirty = true;
  constructor(public getter, public setter) {
    // 计算属性就是一个effect 会让getter中的属性收集这个effect
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true; // 让计算属性标记为脏值
        triggerEffects(this.dep);
      }
    });
  }
  
  get value() {
    if (activeEffect) {
      trackEffects(this.dep);
    }
    if (this._dirty) {
      this._dirty = false;
      // 取值让getter执行拿到返回值，作为计算属性的值
      this._value = this.effect.run();
    }
    return this._value;
  }
  set value(val) {
    // 修改时触发setter即可
    this.setter(val);
  }
}
```

底层使用的 `ReactiveEffect`,`ReactiveEffect`接收一个函数`fn` 即 `getter`, 

收集的这个`ReactiveEffect` 是带有 `scheduler` 方法的,所以要对 [`🔗ReactiveEffect`](./reactive.md#effect) 进行修改

```js
  class ReactiveEffect{
    deps = []; 
    constructor(public fn, public scheduler?) {} //[!code ++]
    run(){
        // ...
       activeEffect = this; 
       return this.fn();
    }
 } 
```
----

**当使用`.value` 的时候,会执行 `effect.run`,所以`getter`中的 `reactive/ref` 属性会自动收集此 `ReactiveEffect`** 

### trackEffects
当使用 `.value` 时候,会触发 `trackEffects` 方法 

当前使用 `computed` 的 `effect` 收集 `ComputedRefImpl` 的 `dep`,因为 `computed` 发生了改变,对应的 `effect` 也要发生变化   

<blue>也就是 <code>ref/reactive</code> 收集 computed, <code>computed</code> 收集 <code>effect</code> </blue>

```js
function trackEffects(dep) {
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
```
### triggerEffects
当 `reactive/ref` 发生变化时,由于会触发 `triggerEffects` 方法,在 `triggerEffects` 执行 `scheduler` 中的函数
```js
function triggerEffects(effects) {
      effects = [...effects]; // vue2中的是数组，先拷贝在魂环
      effects.forEach((effect) => {
          if (effect.scheduler) {
            // 应该执行的是scheduler
            effect.scheduler();
          } else {
            effect.run(); 
          }
      });
}
```
当 `scheduler` 触发后,会执行 `ComputedRefImpl` 内部的 `ReactiveEffect` 的`triggerEffects` 方法,把 `dep` 对应的 `effect` 全部执行
```js
new ReactiveEffect(getter, () => {
  if (!this._dirty) {
    this._dirty = true; // 让计算属性标记为脏值
    triggerEffects(this.dep);
  }
})
```
## 懒执行
由于需要判断执行时机,所以使用变量 `_dirty` 判断是否需要执行对应的 `effect`  

`computed`默认执行一次,所以在获取的时候执行一次,然后赋值为 `false`，**后面如果属性不发生变化则不用每次执行**
```js
get value(){
   if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
}
```
当 `ref/reactive` 发生变化时,会触发 `scheduler`,再次让 `_dirty` 改为 `true`,使用`.value` 可以获取最新变化后的值
```js
 if (!this._dirty) {
    this._dirty = true; // 让计算属性标记为脏值
    triggerEffects(this.dep);
 }
```
## 总结
在 `computed` 使用的 `ref/reactive` 会记录带有 `scheduler` 的 `activeEffect`  

在使用 `computed`, 即 `computed.value` 的时候,触发了 `get` 方法中的 `trackEffects(this.dep);`,把 对应的 `effect` 收集到了 `dep` 中,是不带`scheduler`的 `activeEffect`  

----

当 `computed` 里面的属性发生变化的时候,会触发 `scheduler` 函数,此时会触发 `triggerEffects` 方法, `computed` 对应的 `effect` 要执行 `effect.run` 方法,此时 `effect` 的回调函数又会重新执行,再次获取最新的 `computed` 值






