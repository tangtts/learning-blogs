# render

```js
const VDom1 = h('div', [
  h('div', { key: 'd' }, 'd'),
  h('div', { key: 'e' }, 'e'),
  h('div', { key: 'a' }, 'a'),
  h('div', { key: 'a' }, 'b'),
  h('div', { key: 'c' }, 'c'),
])

const VDom2 = h('div', [
  h('div', { key: 'a' }, 'a'),
  h('div', { key: 'a' }, 'b'),
  h('div', { key: 'c' }, 'c'),
])

render(VDom1, app);

setTimeout(() => {
  render(VDom2, app);
}, 1000)

setTimeout(() => {
  render(null, app);
}, 2000)
```
`render` 接收 `null` 或者是 `虚拟dom` , null 是卸载组件

## render
### null 卸载组件
```js
render(vnode,container){
  if (vnode == null){
    unmount(container._vnode);
  }else {
  // ...
  }
}
```
调用 `unmount` 即调用 `removeChild`方法
```js
unmount = (vnode) => {
  remove(vnode.el);
};
remove(el) {
    const parent = el.parentNode;
    if (parent) {
      return parent.removeChild(el);
    }
},
```
### 挂载元素
```js
render(vnode,container){
  if (vnode == null){
   // ...
  }else {
    // 上一次没有挂载的虚拟节点
    const prevVnode = container._vnode || null;
    const nextVnode = vnode;
    patch(prevVnode, nextVnode, container);
    container._vnode = nextVnode; // 第一次的渲染的虚拟节点
  }
}
```
核心方法 `patch`
#### patch
```js
function isSameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}

const patch = (n1, n2, container, anchor = null) => {
  // n1 和 n2 是不是相同的节点，如果不是相同节点直接删掉换新的
  if (n1 && !isSameVnode(n1, n2)) {
    // 删除之前的 继续走初始化流程
    unmount(n1);
    n1 = null; 
  }
  if (n1 == null) {
    // 初始化逻辑
    mountElement(n2, container, anchor);
  } else {
    // 不是初始化，意味更新
    patchElement(n1, n2, container);
  }
};
```
#### mountElement
挂载元素,元素可能是数组/文本,<blue>把挂载之后的真实dom 绑定到 vnode.el 上</blue>
```js
const mountElement = (vnode, container, anchor) => {
  const { type, props, shapeFlag, children } = vnode;
  //  先创建父元素,把创建出来的真实dom挂载到 vnode.el 上
  let el = (vnode.el = hostCreateElement(type)); //[!code hl]
  // 给父元素增添属性
  if (props) {
    for (let key in props) {
      hostPatchProp(el, key, null, props[key]);
    }
  }
  // 区分子节点类型
  if (ShapeFlags.ARRAY_CHILDREN & shapeFlag) {
    // 是数组节点
    mountChildren(children, el);
  } else {
    // 文本节点
    hostSetElementText(el, children);
  }
  // 插入到父元素中
  hostInsert(el, container, anchor); // 将元素插入到父级中
};
```
container 变为父元素,递归调用patch方法,因为 数组里面有可能是嵌套数组/文本
```js
   const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      // 递归调用patch方法 创建元素
      patch(null, children[i], container);
    }
  };
```
#### patchElement

<blue>说明是相同节点相同的key值,进入更新环节</blue>  

由于 vnode.el 已经存在,所以n2直接复用真实dom,[patchProps可以查看这里](./renderer.md#patchprop)
```js
const patchElement = (n1, n2, container) => {
    // 更新逻辑
    let el = (n2.el = n1.el); // [!code hl]
    patchProps(n1.props || {}, n2.props || {}, el);
    patchChildren(n1, n2, el);
};
```
#### 核心重点 patchChildren

| 新儿子 | 旧儿子 |         操作方式          |
| :----: | :----: | :-----------------------: |
|  文本  |  数组  | 删除老儿子，设置文本内容  |
|  文本  |  文本  |       更新文本即可        |
|  文本  |   空   | 更新文本即可 与上面的类似 |
|  数组  |  数组  |         diff算法          |
|  数组  |  文本  |    清空文本，进行挂载     |
|  数组  |   空   |   进行挂载 与上面的类似   |
|   空   |  数组  |       删除所有儿子        |
|   空   |  文本  |         清空文本          |
|   空   |   空   |         无需处理          |

## diff 算法
### sync from start

<img src="@img/diff-1.png"/>

```js
 h('div',[
     h('li', { key: 'a' }, 'a'),
     h('li', { key: 'b' }, 'b'),
     h('li', { key: 'c' }, 'c')
 ]) : 
 h('div',[
     h('li', { key: 'a' }, 'a'),
     h('li', { key: 'b' }, 'b'),
     h('li', { key: 'd' }, 'd'),
     h('li', { key: 'e' }, 'e')
 ])
```
```js
const patchKeydChildren = (c1, c2, container) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    // 1. sync from start
    // (a b) c
    // (a b) d e
    while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (isSameVnode(n1, n2)) {
            patch(n1, n2, container)
        } else {
            break;
        }
        i++;
    }
}
```
### sync from end
<img src="@img/diff-2.png"/>

```js
// 2. sync from end
// a (b c)
// d e (b c)
while (i <= e1 && i <= e2) {
    const n1 = c1[e1];
    const n2 = c2[e2];
    if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container);
    } else {
        break;
    }
    e1--;
    e2--;
}
```
### common sequence + mount
<img src="@img/diff-3.png"/>
<img src="@img/diff-4.png"/>

```js
// 3. common sequence + mount
// (a b)
// (a b) c
// i = 2, e1 = 1, e2 = 2
// (a b)
// c (a b)
// i = 0, e1 = -1, e2 = 0
if (i > e1) { // 说明有新增 
    if (i <= e2) { // 表示有新增的部分
        // 先根据e2 取他的下一个元素  和 数组长度进行比较
        const nextPos = e2 + 1;
        const anchor = nextPos < c2.length ? c2[nextPos].el : null;
        while (i <= e2) {
            patch(null, c2[i], container, anchor);
            i++;
        }
    }
}
```
### common sequence + unmount

<img src="@img/diff-5.png"/>
<img src="@img/diff-6.png"/>


```js
// 4. common sequence + unmount
// (a b) c
// (a b)
// i = 2, e1 = 2, e2 = 1
// a (b c)
// (b c)
// i = 0, e1 = 0, e2 = -1
else if (i > e2) {
    while (i <= e1) {
        unmount(c1[i])
        i++
    }
}
```
### unknown sequence
<blue>build key:index map for newChildren</blue>
<img src="@img/diff-7.png"/>

```js
// 5. unknown sequence
// a b [c d e] f g
// a b [e c d h] f g
// i = 2, e1 = 4, e2 = 5
const s1 = i;
const s2 = i;
const keyToNewIndexMap = new Map();
for (let i = s2; i <= e2; i++) {
    const nextChild = c2[i];
    keyToNewIndexMap.set(nextChild.key, i);
}
```
loop through old children left to be patched and try to patch
```js
const toBePatched = e2 - s2 + 1;
const newIndexToOldMapIndex = new Array(toBePatched).fill(0);
for (let i = s1; i <= e1; i++) {
    const prevChild = c1[i];
    let newIndex = keyToNewIndexMap.get(prevChild.key); // 获取新的索引
    if (newIndex == undefined) {
        unmount(prevChild); // 老的有 新的没有直接删除
    } else {
        newIndexToOldMapIndex[newIndex - s2] = i + 1;
        patch(prevChild, c2[newIndex], container);
    }
}
```

### move and mount
<img src="@img/diff-8.png"/>

```js
for (let i = toBePatched - 1; i >= 0; i--) {
    const nextIndex = s2 + i; // [ecdh]   找到h的索引 
    const nextChild = c2[nextIndex]; // 找到 h
    let anchor = nextIndex + 1 < c2.length ? c2[nextIndex + 1].el : null; // 找到当前元素的下一个元素
    if (newIndexToOldMapIndex[i] == 0) { // 这是一个新元素 直接创建插入到 当前元素的下一个即可
        patch(null, nextChild, container, anchor)
    } else {
        // 根据参照物 将节点直接移动过去  所有节点都要移动 （但是有些节点可以不动）
        hostInsert(nextChild.el, container, anchor);
    }
}
```
