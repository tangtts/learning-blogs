# keep-alive

<blue>插槽必须是一个组件,而且只能有一个,里面缓存的是 真实 dom</blue>

## 使用
```js
const MyComponent1 = {
  name:'xxx1',
  setup(){
      onMounted(()=>{
        console.log('MyComponent1 mounted')
      })
      onUnmounted(()=>{
        console.log('MyComponent1 onUnmounted')
      })
      return {}
  },
  render:()=>h('h1','hello')
}

const MyComponent2 = {
  name:'xxx2',
  setup(){
      onMounted(()=>{
          console.log('MyComponent2 mounted')
      })
      onUnmounted(()=>{
          console.log('MyComponent2 onUnmounted')
      })
      return {}
  },
  render:()=>h('h1','world')
}

// 第一次渲染 MyComponent1
render(h(KeepAlive,{max:2},{
  default:()=>h(MyComponent1)
}),app)

// 第一次渲染 MyComponent2
setTimeout(()=>{
  render(h(KeepAlive,{max:2},{
      default:()=>h(MyComponent2)
  }),app)
},1000)

// 再次渲染 MyComponent1
setTimeout(()=>{
  render(h(KeepAlive,{max:2},{
      default:()=>h(MyComponent1)
  }),app)
},2000)
```

**当渲染之后，获取插槽里面的真实dom,然后缓存起来，当再次渲染的时候，直接从缓存里面取，这样就实现了组件的缓存。**

## 源码
因为要缓存真实 dom,所以使用 `Map` 这种数据结构,同时还需要做到 `LRU`,所以使用 `set` 存储对应真实 dom 的 `key` 值

```ts
const keys = new Set(); // 存储组件的唯一标识
const cache = new Map(); // 缓存的映射表
```
在 `mounted/updated` 时候都需要缓存真实dom
```ts
let pendingCacheKey = null
function toCache() {
  cache.set(pendingCacheKey, instance.subTree); // 缓存的是keep-alive的插槽
}
onMounted(toCache)
onUpdated(toCache)
```
在 `setup` 中把组件的 slot 赋值给 `pendingCacheKey`
```ts
setup(props, { slots }){
  return ()=>{
    // 我们需要再keepalive组件中缓存真实DOM
    const vnode = slots.default()
    // vnode 必须是一个组件， 而且只能有一个
    const key = vnode.type; // 获取到组件对象
    pendingCacheKey = key //[!code hl]
    const cacheVnode = cache.get(key); // 如果有值说明缓存过了
    if (cacheVnode) {
      // LRU 如果访问了旧的组件,需要把这个key删掉,然后放入到尾部
        keys.delete(key);
        keys.add(key);
    } else {
        keys.add(key); // 将组件列入需要缓存的节点中
        if (props.max && keys.size > props.max) {
            // 缓存的个数超过了最大值,移除第一个缓存的组件
            pruneCacheEntry(keys.values().next().value) //[!code hl]
        }
    }
    return vnode  
  }
}
```
:::details pruneCacheEntry 移除组件
```ts
function pruneCacheEntry(key) {
  unmount(cache.get(key))
  keys.delete(key);
  cache.delete(key);
}
```
:::

在执行 `activated/deactivated`时是使用自定义移动逻辑  
```ts
let {createElement,move,unmount:_unmount,patch } = instance.ctx.renderer
const storageContainer = createElement('div');
instance.ctx.activated = function (vnode,container) {
    move(vnode, container)
}
instance.ctx.deactivated = function (vnode) {
    // 在组件卸载过程中会执行此方法，将内容缓存起来，而不是走真正的卸载逻辑
    move(vnode, storageContainer)
}
```
:::details move 移动组件
```ts
function mountComponent(n2, container,anchor,parentComponent) {

  const instance = (n2.component = createInstance(n2, parentComponent));
  
  if (isKeepAlive(n2)) {
    
    instance.ctx.renderer = {
      createElement: hostCreateElement,
      move(vnode, container) {
        hostInsert(vnode.component.subTree.el,container)
      },
      patch,
      unmount
    }
  }
// ...
}
```
:::

```ts
  function processComponent(n1, n2, container,anchor,parentComponent) {
    if (n1 == null) {
      // xx1 -> xx2
      if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
        // keep-alive 不在执行初始化逻辑
        parentComponent.ctx.activated(n2, container)
      } else {
       // ....
      }
    } else {
      // ....
    }
  }
```

```ts
const unmount = (vnode,parentComponent) => {
  const {shapeFlag} = vnode
  // ...

  // 这个组件不应该卸载而是应该缓存起来
  if (shapeFlag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
    return parentComponent.ctx.deactivated(vnode)
  }
  // ...
  remove(vnode)
};
```



:::details 完整代码
```ts
import { onMounted, onUpdated } from "./lifecycle";
import { getCurrentInstance } from "./component"
import { ShapeFlags } from "@vue/shared";

export const KeepAlive = {
    __isKeepAlive: true,
    props: {
        max:Number
    },
    setup(props, { slots }) {
        const keys = new Set(); // 存储组件的唯一标识
        const cache = new Map(); // 缓存的映射表
        const instance = getCurrentInstance();
        let {createElement,move,unmount:_unmount,patch } = instance.ctx.renderer
        // 将卸载的dom 放入到容器中后续可以复用
        const storageContainer = createElement('div');

        // 不会调用组件的一系列的方法
        instance.ctx.activated = function (vnode,container) {
            move(vnode, container)
        }
        instance.ctx.deactivated = function (vnode) {
            // 在组件卸载过程中会执行此方法，将内容缓存起来，而不是走真正的卸载逻辑
            move(vnode, storageContainer)
        }

        let pendingCacheKey = null
        function toCache() {
            cache.set(pendingCacheKey, instance.subTree); // 我要缓存的是keep-alive的插槽
        }
        onMounted(toCache)
        onUpdated(toCache)
        function unmount(vnode) {
            let flag = vnode.shapeFlag
            if (flag & ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE) {
                flag-= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
            }
            if (flag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
                flag-= ShapeFlags.COMPONENT_KEPT_ALIVE
            }
            vnode.shapeFlag = flag
            _unmount(vnode,instance)
        }
        function pruneCacheEntry(key) {
            unmount(cache.get(key))
            keys.delete(key);
            cache.delete(key);
        }
        return () => {
            // 我们需要再keepalive组件中缓存真实DOM
            const vnode = slots.default()
            // vnode 必须是一个组件， 而且只能有一个
            const key = vnode.type; // 获取到组件
            pendingCacheKey = key
            const cacheVnode = cache.get(key); // 如果有值说明缓存过了

            if (cacheVnode) { // 1 -> 2 -> 1
                vnode.component = cacheVnode.component;
                vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE  
                keys.delete(key);
                keys.add(key); // 将最新访问的放到尾部
            } else {
                keys.add(key); // 将组件列入需要缓存的节点中
                if (props.max && keys.size > props.max) {
                    // 缓存的个数超过了最大值
                   pruneCacheEntry(keys.values().next().value)
                }
            }
            // 组件在卸载的时候不是要真的卸载
            vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
            return vnode

        }
    }
}

// 判断当前虚拟节点是不是keepalive的虚拟节点
export const isKeepAlive = vnode => vnode.type.__isKeepAlive
```
:::
