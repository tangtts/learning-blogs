# 组件
模板编译 最终是把模板 -> render返回的结果 -> 虚拟dom(h方法返回的是虚拟dom)   
-> 渲染成真实的dom
```js
const MyComponent = {
  props: {
      a: Number,
      b: Number,
  },
  data() {
      return { name: 'jw', age: 30 }
  },
  render(proxy) {
      return h('div', {}, [
          h('span', proxy.a),
          h('span', proxy.b),
          h('span', proxy.$attrs.c)
      ])
  }
}
//  attrs(组件标签上的属性) , props(我给你传递的自定义属性不在attrs中的)
render(h(MyComponent, { a: 1, b: 2, c: 1 }), app);
```
那么 h 有可能接收一个 对象作为参数，这个对象包含多个属性:
- props 对象
- data 函数
- render 函数  
由于 h 底层使用 `createVNode` ,所以要对 `createVNode` 进行改造
```js
function createVNode(type, props, children = null){
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT // 这个是元素
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT // 这个是组件 //[!code ++]
    : 0;

  const vnode = {
    shapeFlag,
    __v_isVNode: true,
    type, // type 现在是一个对象 //[!code ++]
    props,
    key: props && props.key,
    el: null, // 每个虚拟节点都对应一个真实节点，用来存放真实节点
    children,
    component:null // 组件instance
  }
}
```
在 `render` 方法中的 `patch` 中,要考虑组件的情况
```js
render(vnode, container) {
  if (vnode == null) {
    // ....
  } else {
   //...
    patch(prevVnode, nextVnode, container);//[!code hl]
    container._vnode = nextVnode; // 第一次的渲染的虚拟节点
  }
},
```
```js
   const patch = (n1, n2, container, anchor = null) =>{
    const { shapeFlag } = n2;
     if (shapeFlag & ShapeFlags.COMPONENT) {
      processComponent(n1, n2, container); //[!code ++]
     }
   } 
```


## 处理组件 - processComponent
  分为 挂载/卸载 两个步骤
```js
function processComponent(n1, n2, container) {
  if (n1 == null) {
    mountComponent(n2, container);
  } else {
    patchComponent(n1, n2, container);
  }
}
```
### 挂载组件 - mountComponent
```js
function mountComponent(n2, container) {
  // 1) 给组件生成一个实例 instance
    const instance = (n2.component = createInstance(n2));
    // 2) 初始化实例属性 props attrs slots
    setupComponent(instance);
    // 3) 创建渲染effect
    setupRenderEffect(instance, container);
}
```

#### createInstance

`createInstance` 是创建一个空 instance 实例,有`props`,`slots`,`render`,`vnode` 等属性
:::details createInstance
```js
 function createInstance(n2) {
  const instance = {
    // 组件的实例，用它来记录组件中的属性
    setupState: {},
    state: {},
    isMounted: false, // 是否挂载成功
    vnode: n2, // 组件的虚拟节点
    subTree: null, // 组件渲染的虚拟节点
    update: null, // 用于组件更新的方法
    propsOptions: n2.type.props, // 用户传递的props
    props: {},
    attrs: {},
    slots: {},
    render: null,
    proxy: null, // 帮我们做代理 -> proxyRefs
  };
  return instance;
} 
```
:::

#### setupComponent
`setupComponent` 是执行 `setup` 方法,对 `instance` 的`props` `attrs` `slots` 进行赋值

**同时判断 `setup` 的返回值,如果返回值是对象,则把对象值赋值给 `instance.setupState`
如果是函数,则把函数赋值给 `instance.render`，自己变为 `render` 方法** 

同时要把`data` 里面的值做一个响应式处理 `reactive(data())`

:::details setupComponent
```js
export let currentInstance = null;
const setCurrentInstance = (instance) => currentInstance = instance
const getCurrentInstance = () => currentInstance

function setupComponent(instance) {
  let { type, props } = instance.vnode;
  const publicProperties = {
    $attrs: (instance) => instance.attrs,
    $props: (instance) => instance.props,
  };

 // 把所有的访问器属性都挂载到组件实例上
  instance.proxy = new Proxy(instance, {
  get(target, key) {
    const { state, props, setupState } = target;
    if (key in state) {
      return state[key];
    } else if (key in setupState) {
      return setupState[key];
    } else if (key in props) {
      return props[key];
    }
    const getter = publicProperties[key];
    if (getter) {
      return getter(instance); // 将instance传递进去
    }
  },
  set(target, key, value) {
    const { state, props, setupState } = target;
    if (key in state) {
      state[key] = value;
      return true;
    } else if (key in setupState) {
      setupState[key] = value;
      return true;
    } else if (key in props) {
      console.warn(
        // 组件不能修改属性了
        `mutate prop ${key as string} not allowed, props are readonly`
      );
      return false;
    }
    return true;
  },
});

initProps(instance, props);
initSlots(instance,children)
// 🔥 用户编写的setup方法
const setup = type.setup; 
if (setup) {
  setCurrentInstance(instance)
  const setupResult = setup(instance.props, { //[!code hl]
    attrs: instance.attrs, // 完成
    emit: (eventName, ...args) => {
      // onMyEvent  onMyEvent
      let handler =
        props[`on${eventName[0].toUpperCase()}${eventName.slice(1)}`];
      handler && handler(...args);
    },
    slots: instance.slots,
    expose: () => {},
  });
  setCurrentInstance(null)
  // 🔥 判断setup的返回值是否是
  if (isObject(setupResult)) { //[!code hl]
    // 返回的是setup提供的数据源头
    instance.setupState = proxyRefs(setupResult); //[!code hl]
  } else if (isFunction(setupResult)) {
    // 如果是函数的话,则变为 render 方法
    instance.render = setupResult; //[!code hl]
  }
}

const data = type.data;
if (data) {
  instance.state = reactive(data()); //[!code hl]
}
!instance.render && (instance.render = type.render);
}
```
如果用户传入了 `{a,b,c}`,但是组件使用 `props` 接收了 `a,b`属性,那么 `c` 会被放在 `attrs`属性上
```js
function initProps(instance, rawProps) {
  const props = {};
  const attrs = {};
  const options = instance.propsOptions || {};
  if (rawProps) {
    for (let key in rawProps) {
      if (key in options) {
        props[key] = rawProps[key];
      } else {
        attrs[key] = rawProps[key];
      }
    }
  }
  // 属性是响应式的，属性变化了 会造成页面更新
  instance.props = reactive(props); // 属性会被变成响应式  props也可以不是响应式的
  instance.attrs = attrs;
}

function initSlots(instance, children) {
  instance.slots = children
}
```
拆包,如果是 `ref` 则直接返回 `.value`,如果是设置值,如果是`ref`,则设置 `.value`
```js
function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, recevier) {
      let r = Reflect.get(target, key, recevier);
      return r.__v_isRef ? r.value : r;
    },
    set(target, key, value, recevier) {
      const oldValue = target[key];
      if (oldValue.__v_isRef) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, recevier);
      }
    },
  });
}
```
:::
#### 🚀setupRenderEffect

```js
// 3) 创建渲染effect
setupRenderEffect(instance, container);
```
**由于更新状态要重新渲染，所以需要创建一个渲染 `effect`**  
把 `effect.run` 绑定给 `instance.update` 方法上,以便后续更新使用  
 

第一次渲染,即 `instance.isMounted == false`,
1. 把 `instance.render` 的 this 指向 `instance.proxy`,并且传入 `instance.proxy` 作为 `render` 参数,*这样不论是 this 还是参数都是可以指向 `instance.proxy`*

2. 对于 `instance.proxy` 的返回值 虚拟 dom 即 `subTree` 执行 `patch` 挂载


当组件更新时，`instance.isMounted == true`,需要对把上一次的 vnode 和 这一次的 vnode 做一个比对,执行 `patch(旧vnode,新vnode)` 

```js
data(){
  return {name:'zs',age:18}
}
render(proxy){
  // 可以使用 this
  return h('div', {}, [h('span', proxy.a), h('span', proxy.b), h('span', proxy.$attrs.c)])
}
```

```js
  function setupRenderEffect(instance, container) {
    const componentUpdateFn = () => {
      // 初次渲染
      if (!instance.isMounted) {
        const subTree = instance.render.call(instance.proxy, instance.proxy); // [!code hl]
        instance.subTree = subTree;
        patch(null, subTree, container);
        instance.isMounted = true;
      } else {
        // 组件更新 ，自身的状态变了要更新子树
        let next = instance.next;
        if (next) {
          // 渲染前的更新
          updateComponentPreRender(instance, next);
        }
        const subTree = instance.render.call(instance.proxy, instance.proxy);
        patch(instance.subTree, subTree, container);
        instance.subTree = subTree;
      }
    };

    const effect = new ReactiveEffect( // [!code hl]
      componentUpdateFn,
      // 多个更新合并成一个统一执行
      () => queueJob(instance.update)
    );
    const update = (instance.update = effect.run.bind(effect));
    update();
  }
```
:::details queueJob 异步更新
```js
  const queue = [];
let isFlushing = false;
const resolvePromise = Promise.resolve();

// 调度函数 实现异步渲染
export function queueJob(job) {
  if (!queue.includes(job)) {
    // 将任务放到队列中
    queue.push(job);
  }
  if (!isFlushing) {
    isFlushing = true;
    resolvePromise.then(() => {
      isFlushing = false;
      let arr = queue.slice(0);
      queue.length = 0; // 在执行的时候可以继续像queue中添加任务
      for (let i = 0; i < arr.length; i++) {
        const job = arr[i];
        job();
      }
      arr.length = 0;
    });
  }
}
```
:::

### 组件更新 - patchComponent
```js
  function processComponent(n1, n2, container) {
    if (n1 == null) {
      mountComponent(n2, container);
    } else {
      patchComponent(n1, n2, container); 
    }
  }
```
组件的prop属性发生变化,插槽更新就要走到 `patchComponent`  

```js
function patchComponent(n1, n2, container) {
  const instance = (n2.component = n1.component);
  // 判断是否需要更新,主要判断 prop 是否相同
  if (shouldComponentUpdate(n1, n2)) {
    // 挂载最新的虚拟节点
    instance.next = n2; //[!code hl]
    instance.update();
  }
  // updateProps(instance, prevProps, nextProps);
}
```
:::details shouldComponentUpdate

```js

function shouldComponentUpdate(n1, n2) {
  const prevProps = n1.props;
  const nextProps = n2.props;

  return hasChangedProps(prevProps, nextProps);
}


function hasChangedProps(prevProps, nextProps) {
  const nextKeys = Object.keys(nextProps);
  const prevKeys = Object.keys(prevProps);
  if (nextKeys.length != prevKeys.length) {
    // 如果传递的属性个数不一致说明有变化
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    // 如果值不一样说明变化
    const key = nextKeys[i];

    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
```
:::

在 `vnode`上 挂载 `instance.next`,执行 `instance.update` 更新组件,就会重新走到
`componentUpdateFn`,然后执行:
```js
let next = instance.next;
if (next) {
  // 更新新老虚拟节点的 props / slots 等
  updateComponentPreRender(instance, next);
}
```

:::details updateComponentPreRender
```js
function updateComponentPreRender(instance, next) {
  instance.next = null;
  instance.vnode = next; // 这里为了保证vnode是最新
  updateProps(instance.props, next.props);
   // instance.slots = next.children; 万一用户在setup中解构了slots 一直使用解构的
  // 会导致render方法重新调用 获取的是老的slots
  Object.assign(instance.slots, next.children); // props 比较
}
```
:::
更新 props
:::details updateProps
```js
function updateProps(prevProps, nextProps) {
  // 组件自己不能更新属性，但是在父组件中可以更新属性（原本的props就是proxy）
  // 除了属性之外还有attrs要考虑
  for (const key in nextProps) {
    // instance.props = nextProps 丧失响应式
    prevProps[key] = nextProps[key]; // instance.props.count = 新的值
  }
  for (const key in prevProps) {
    if (!(key in nextProps)) {
      delete prevProps[key];
    }
  }
}
```
