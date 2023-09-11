# h

## 参数
h 可以接收 两个参数 / 三个参数 
- <blue>两个参数的情况</blue>
  1. h('div', h('span'))
  2. h('div', { style: { color: 'red' } })
  3. h('div','hello')
  4. h('div', [h('span'), h('span')])
- <blue>三个参数情况</blue>
  1. h('div', {}, 'hello')
  2. h('div', {}, h('span'))
  3. h('div', {}, [h('span'), h('span')])
- <blue>多个参数</blue>
  1. h('div', {}, h('span'), h('span'), h('span'), h('span'))
  
需要对参数进行 `归一化`,归一成 `type,props,children` 三个参数,由 `createVNode` 集中处理,`createVNode` 要求 `children` 是一个「文本 / 数组」

```js
 function h(type, propsOrChildren?, children?){
  let len = arguments.length;
  // 参数
  if(len == 2){
    // ....
  }else {
    // ...
  }
 } 
```
### 参数等于2
参数等于2的情况,第二个参数可能是一个对象 / 一个文本 / 一个数组 / 一个对象 / 一个 h

对于文本/数组来说,children 就是文本/数组

对于对象来说,需要区分是 `h('div', h('span'))` 还是 `h('div', { style: { color: 'red' } })` 

```js
    if (len == 2) {
    // createVNode 要求孩子不是文本就是一个数组
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        // const VDom = h('div', h('span'))
        return createVNode(type, null, [propsOrChildren]);
      }
      // const VDom = h('div', { style: { color: 'red' } })
      return createVNode(type, propsOrChildren,null);
    } else {
      // const VDom = h('div','hello')
      // const VDom = h('div', [h('span'), h('span')])
      return createVNode(type, null, propsOrChildren);
    }
  }
```
### 参数大于2

```js
if (len > 3) {
    // const VDom = h('div', {}, h('span'), h('span'), h('span'), h('span'))
    children = Array.from(arguments).slice(2);
} else {
    // const VDom = h('div', {}, h('span'))
    if (len == 3 && isVNode(children)) {
      children = [children];
    }
}
```

## createVNode

```js
export function isVNode(val) {
  return !!(val && val.__v_isVNode);
}

export function isSameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}

export function createVNode(type, props, children = null) {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;
  const vnode = {
    shapeFlag,
    __v_isVNode: true,
    type,
    props,
    key: props && props.key,
    el: null, // 每个虚拟节点都对应一个真实节点，用来存放真实节点的后续更新的时候会产生新的虚拟节点，比较差异更新真实DOM
    children,
  };
  if (children) {
    let type = 0;
    if (Array.isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN;
    } else {
      type = ShapeFlags.TEXT_CHILDREN;
    }
    vnode.shapeFlag |= type;
  }
  return vnode;
}
```

```ts
export const enum ShapeFlags {
  ELEMENT = 1, // 元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 2
  STATEFUL_COMPONENT = 1 << 2, // 4
  TEXT_CHILDREN = 1 << 3, // 文本孩子
  ARRAY_CHILDREN = 1 << 4, // 数组孩子
  SLOTS_CHILDREN = 1 << 5, // 组件的插槽
  TELEPORT = 1 << 6, // 传送门组件
  SUSPENSE = 1 << 7, // SUSPENSE组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // keep-alive
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}
```
### << |  &
#### << 无符号左移运算符，左操作数的值向左移动右操作数指定的位数。
```  
> 0000000001  -> 1  
> 0000000010; -> 2  
> 0000000100  -> 4  
```

#### [按位或 |](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) 
>按位或（|）运算符在其中一个或两个操作数对应的二进制位为 1 时，该位的结果值为 1

```
0000000001   
|  
0000000100  
=  
0000000101
```

#### [按位与 &](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_AND) 
> 按位与（&）运算符在两个操作数对应的二进位都为 1 时，该位的结果值才为 1   
```
0000000101  
&   
0000000001  
=  
0000000001
```


