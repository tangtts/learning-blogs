# 插槽
只有在组件内才算插槽,传入 `createVnode` 的第三个参数

<blue>插槽本质是一个对象函数,在 render 函数中找到对应的函数,然后执行</blue>

```js
const MyComponent = {
  setup() {
        useLifycycle()
      return {
          title:"asdfasd"
      }
  },
  render(proxy) {
      return h(Fragment, [
          h('div', proxy.$slots.header('header')),
          h('div', proxy.$slots.default()),
          h('div', proxy.$slots.footer())
      ])
  }
}

render(h(MyComponent, {}, {
  default: () => h('div', 'default'),
  header: (title) => h('h1', title),
  footer: () => h('footer', 'footer')
}), app)
```
`createVNode` 如果传入了一个对象,就是插槽
```js
function createVNode(type, props, children = null){
  if (children) {
    let type = 0;
    if (Array.isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN;
    } else if (isObject(children)){
        type = ShapeFlags.SLOTS_CHILDREN; // $slots 可以获取到属性
    } else {
      type = ShapeFlags.TEXT_CHILDREN;
    }
    vnode.shapeFlag |= type;
  }
}
```
同时,在 [`🔗setupComponent`](./component.md#挂载组件-mountcomponent) 函数中,把 `slot` 挂载到 `instance.slots` 上

```js

function initSlots(instance, children) {//[!code ++]
  instance.slots = children//[!code ++]
}//[!code ++]

function setupComponent(instance){
  const publicProperties = {
    //...
    $slots: (instance) => instance.slots //[!code ++]
  };

  const setup = type.setup; 
  const setupResult = setup(instance.props, {
      // ...
      slots: instance.slots,  //[!code ++]
    });
  initSlots(instance,children) //[!code ++]
}
```
在 `render` 中传递了`instance.proxy`
```js
const subTree = instance.render.call(instance.proxy, instance.proxy);
patch(instance.subTree, subTree, container);
```
**所以在下面的 `render` 函数中的 `$slots` 就是 `instance.slots`,也即传入的 对象函数**
```js
render(proxy) {
    return h(Fragment, [
        h('div', proxy.$slots.header('header')),
        h('div', proxy.$slots.default()),  
        h('div', proxy.$slots.footer())
    ])
}
```
<blue>对于作用域插槽,其实本质是一个回调函数的调用</blue>

## 编译代码

父元素使用,接收了一个形参叫count,一般情况下会使用解构
```html
<template #header={count}>
</template>  
```
<img src="@img/slot1.png" />
<img src="@img/slot2.png" />

----

**子元素创建,传入了一个对象作为参数,现在只有一个count 属性**
<img src="@img/slot3.png" />
<img src="@img/slot4.png" />

