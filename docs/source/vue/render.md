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
`render` 接收 `null` 或者是 `虚拟dom` , 如果是 null, 则是卸载组件

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
把生成的 `vnode`  放入到 `container._vnode` 属性上
```js
render(vnode,container){
  if (vnode == null){
   // ...unmount
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
### 🚀patch
如果不是相同节点，直接删除，然后重新生成虚拟dom
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
#### mountElement 初始化逻辑
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

数组节点执行 `mountChildren` , `container` 变为父元素,递归调用 `patch` 方法,因为数组里面有可能是嵌套 「数组/文本」 
```js
   const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      // 递归调用patch方法 创建元素
      patch(null, children[i], container);
    }
  };
```
#### 🔥 patchElement

<blue>说明是相同节点或者是相同的key值,进入更新环节</blue>  

由于 vnode.el 已经存在,所以 n2 直接复用真实dom,[🔗patchProps](./renderer.md#patchprop)
```js
const patchElement = (n1, n2, container) => {
    // 更新逻辑
    let el = (n2.el = n1.el); // [!code hl]
    patchProps(n1.props || {}, n2.props || {}, el);
    patchChildren(n1, n2, el);
};
```
**核心重点 `patchChildren`, `children` 前后有以下情况**

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

## 🔥 diff 算法
### 头部比较
<blue>获取新老节点的长度,从头比较新老节点,如果是 <code>isSameVnde</code> 继续<code>patch</code></blue> 

**i 表示有多少个相同节点**
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

### 尾部比较
尾部比较,获取最近的不相同的位置   
**e1,e2 表示新老节点去除尾部相同节点的长度**
<img src="@img/diff-2.png"/>

```js
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
### 数组长度不一致,新节点大于老节点 挂载
<blue>新节点比老节点长度长,需要挂载</blue>      
<br/>
<blue>🔥新节点需要挂载到下一个节点前面,否则会错乱</blue>  
<img src="@img/diff-3.png"/>
<img src="@img/diff-4.png"/>

```js
// (a b) 原来节点
// (a b) c  现在节点
// i = 2, e1 = 1, e2 = 2 // length-1

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
### 数组长度不一致,老节点大于新节点 + 卸载

<blue>同样的,老节点的长度要比新节点的长度要长，需要卸载多余的节点</blue>

<img src="@img/diff-5.png" />
<img src="@img/diff-6.png"/>

```js
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
### 中间序列
<blue>对新节点构建出形如: <code>{index:vnode}</code> 的 <code>Map</code>,然后遍历老节点,判断是否有可以复用的节点</blue>
<img src="@img/diff-7.png"/>

```js
// a b [c d e] f g
// a b [e c d h] f g
// i = 2, e1 = 4, e2 = 5
const s1 = i; // s1 -> e1
const s2 = i; // s2 -> e2
 // 将新的元素做成一个映射表，去老的里面找
const keyToNewIndexMap = new Map();
for (let i = s2; i <= e2; i++) {
    const nextChild = c2[i];
    keyToNewIndexMap.set(nextChild.key, i); // [!code hl]
}
```
遍历老节点判断是否有可用的节点,如果没有,就要把老节点删除,如果有,直接复用  

```js
const toBePatcheded = e2 - s2 + 1;
// newIndexToOldMapIndex 对应的位置就是老索引 + 1
const newIndexToOldMapIndex = new Array(toBePatcheded).fill(0);

for (let i = s1; i <= e1; i++) {
    const prevChild = c1[i];
    let newIndex = keyToNewIndexMap.get(prevChild.key); // 获取新的索引
    if (newIndex == undefined) {
        unmount(prevChild); // 老的有 新的没有直接删除
    } else { 
        // a b [c d e] f g 
        // a b [e c d h] f g
       // 老索引 + 1 
        // c = 2 + 1,d = 3 + 1,e = 4 + 1,h = 0
       // 复用新节点,需要 减去头部重复的节点数量,不能从0开始,和头部节点相同了
        newIndexToOldMapIndex[newIndex - s2] = i + 1; // [!code hl]
         // 只是比较了属性，还需要移动位置
        patch(prevChild, c2[newIndex], container); // [!code hl]
    }
}

```

### 上一步只更新属性，这一次移动并挂载
[🔗最长递增子序列视频课程](https://www.javascriptpeixun.cn/p/t_pc/course_pc_detail/video/v_6364732ee4b01126ea9fff95?product_id=p_634f5ab1e4b0a51fef2ad55f&content_app_id=&type=6)
<img src="@img/diff-8.png"/>

```js
// 最长递增子序列
// 如果 newIndexToOldMapIndex = [5,3,4,0]，那么最长递增子序列是 [1,2]
// 老节点的序列是:[0,1,2,3]
// 从最长递增子序列的尾部与老节点进行比对,
// 第一次是 3，需要移动
// 第二次是 2，不需要移动
// 第三次是 1，不需要移动
const cressingIndexMap = getSeq(newIndexToOldMapIndex);
let lastIndex = cressingIndexMap.length - 1; // 从末尾找最后一项

for (let i = toBePatched - 1; i >= 0; i--) {
  const anchorIndex = s2 + i; //从末尾插入 h
  const child = c2[anchorIndex];
  const insertAnchor = c2[anchorIndex + 1]?.el;
  // 说明是一个新元素
  if (newIndexToOldMapIndex[i] === 0) {
    patch(null, child, el, insertAnchor);
  } else {
    if (cressingIndexMap[lastIndex] === i) {
      // 不做移动,跳过节点
      lastIndex--;
    } else {
      hostInsert(child.el, el, insertAnchor);
    }
  }
}
```
:::details 最长递增子序列
```js
function getSeq(arr) {
  const result = [0];
  const len = arr.length;
  let resultLastIndex;
  let start;
  let end;
  let middle = 0;
  let p = arr.slice(0).fill(0);
  for (let i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI != 0) {
      resultLastIndex = result[result.length - 1];
      if (arr[resultLastIndex] < arrI) {
        result.push(i);
        p[i] = resultLastIndex;
        continue;
      }
      start = 0;
      end = result.length - 1;
      while (start < end) {
        middle = Math.floor((start + end) / 2);
        if (arr[result[middle]] < arrI) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      if (arrI < arr[result[end]]) {
        p[i] = result[end - 1];
        result[end] = i;
      }
    }
  }
  let i = result.length;
  let last = result[i - 1];
  while (i-- > 0) {
    result[i] = last;
    last = p[last];
  }
  return result;
}
```
:::
