# 生命周期
生命周期只能在 `setup` 中使用 
## 使用
可以在生命周期中获取 `instance`
```js
function useLifycycle() {
  onMounted(() => {
    const instance = getCurrentInstance();
    console.log(instance,20)
  })
  onMounted(() => {
    console.log('挂载完成')
  })
  onUpdated(() => {
    console.log('更新完成')
  })
  onUnmounted(() => {
    console.log('卸载完成')
  })
}

const MyComponent = {
  setup(){
     useLifycycle()
  }
}
```
## 工厂函数构建生命周期函数
使用工厂方法批量创建函数  

```ts
const enum Lifecycles {
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u',
  BEFOREUNMOUNT = 'bum',
  UNMOUNTED = 'um'
}

function createHook(type) {
  // hook是用户传递的函数
  return (hook,target = currentInstance) => {
    // 通过闭包缓存变量
    if (target) {
      const hooks = target[type] || (target[type] = [])
      const wrapper = () => { // 事件订阅 保存执行信息
          setCurrentInstance(target)
          hook()
          setCurrentInstance(null)
      }
      hooks.push(wrapper); // hook中的currentInstance
    }
  }
}

const onBeforeMount = createHook(Lifecycles.BEFORE_MOUNT)
const onMounted = createHook(Lifecycles.MOUNTED)
const onBeforeUpdate = createHook(Lifecycles.BEFORE_UPDATE)
const onUpdated = createHook(Lifecycles.UPDATED)
const onBeforeUnmount = createHook(Lifecycles.BEFOREUNMOUNT)
const onUnmounted =createHook(Lifecycles.UNMOUNTED)
```

<blue>需要在生命周期中获取 <code>instance</code>, setup 只执行一次, 为了在setup执行完毕还能获取<code>instance</code> , 所以使用闭包延长生命周期</blue>

```js
let currentInstance = null;
const setCurrentInstance = (instance) => currentInstance = instance
const getCurrentInstance = () => currentInstance;

if (setup) {
    setCurrentInstance(instance)
    const setupResult = setup(){}
    // 执行完销毁 instance
    setCurrentInstance(null) //[!code hl]
}
```



## 执行时机

```js
function setupRenderEffect(instance, container) {
  const componentUpdateFn = () => {
    const {m,bm} = instance
    if (!instance.isMounted) {
      // 初次渲染
      bm && invokeHooks(bm) // [!code ++]
      const subTree = instance.render.call(instance.proxy, instance.proxy);
      instance.subTree = subTree;
      patch(null, subTree, container,null,instance); // 创建父子关系
      instance.isMounted = true;
      m && invokeHooks(m) // [!code ++]
    } else {
      const {bu,u} = instance
      // 组件更新 ，自身的状态变了要更新子树
      let next = instance.next;
      if (next) {
        // 渲染前的更新
        updateComponentPreRender(instance, next);
      }
      bu && invokeHooks(bu) // [!code ++]
      const subTree = instance.render.call(instance.proxy, instance.proxy);
      patch(instance.subTree, subTree, container);

      u && invokeHooks(u) // [!code ++]
      instance.subTree = subTree;
    }
  };
  const effect = new ReactiveEffect(
    componentUpdateFn,
    () => queueJob(instance.update) // 我们将这个更新逻辑
  );
  const update = (instance.update = effect.run.bind(effect));
  update();
}

// 卸载函数
const unmount = (vnode) => {
  // 后面要卸载的元素可能不是元素
  const {shapeFlag} = vnode
  if (vnode.type === Fragment) { // 如果是文档碎片
      return unmountChildren(vnode.children)
  }
  // 如果是组件 移除的事subTree 
  if (shapeFlag & ShapeFlags.COMPONENT) {
    // 删除前
    const { bum, um } = vnode.component //[!code ++]
    bum && invokeHooks(bum);
    unmount(vnode.component.subTree)
    um && invokeHooks(um); //[!code ++]
    return 
  }
  hostRemove(vnode.el);
};
```

:::details invokeHooks
```js
const invokeHooks = fns => {
  for (let i = 0; i < fns.length; i++){
    fns[i]()
  }
}
```
:::

第一次创建时,直接把 type 挂载了 currentInstance,所以在 instance 有 m/bm
```js
  function createHook(type) {
  return (hook,target = currentInstance) => {
      // 通过闭包缓存变量
      if (target) {
          const hooks = target[type] || (target[type] = []) //[!code hl]
          const wrapper = () => { 
            // ...
          }
          hooks.push(wrapper); // hook中的currentInstance
      }
  }
}
```
第二次时,由于已经在 setup 执行了生命周期函数,所以 instance 上已经挂载了 `m/bm/u/bu` 等, component 就有了 `m/bm/u/bu` 这些方法
```js
// 创建时
const instance = (n2.component = createInstance(n2, parentComponent));
// 更新时
const instance = (n2.component = n1.component);
```
**所以可以看到有些生命周期是在 instance 上挂载的,有些是在 component 上挂载的**