# renderer

## 自定义渲染器 - createRenderer
创建自定义渲染器,可以针对小程序,canvas传入自己的渲染逻辑
```js
const renderer = createRenderer({
  insert(element, container) {
    container.appendChild(element)
  },
  createElement(element) {
    return document.createElement(element)
  },
  setElementText(element, text) {
    element.innerHTML = text
  }
  //....
})

const VDom = h('div')
renderer.render(VDom,app)
```
如果是浏览器平台, 也可以使用 `render` 方法直接进行渲染,内部也是使用 `createRenderer` 方法

```js
function render(vdom, container) {
  const { render } = createRenderer(renderOptions);
  render(vdom, container);
}
```
### `renderOptions`
 封装了一些`dom` 操作和对属性变化的操作

```js
const  renderOptions = {
  remove(el) {
    const parent = el.parentNode;
    if (parent) {
      return parent.removeChild(el);
    }
  },
  createElement(type) {
    return document.createElement(type);
  },
  createText(text) {
    return document.createTextNode(text);
  },
  // .... 其他的 dom 操作
  ...patchProp // 对属性的操作
}
```
### patchProp 
属性变化的操作
```js
function patchProp(el, key, prevValue, nextValue) {
  // 属性的初始化和更新 ： 对于初始化 prevValue：null
  // {style:{color:red}} -> el.style[key] = value
  if (key === "style") {
    return patchStyle(el, prevValue, nextValue);
  } else if (key === "class") {
    return patchClass(el, nextValue);
    // {class:"abc"} -> el.className(class,'')
  } else if (/^on[^a-z]/.test(key)) {
    return patchEvent(el, key, nextValue);
    // onClick  -> addEventListener()
  } else {
    return patchAttr(el, key, nextValue);
  }
}
```
::: details patchStyle patchClass patchAttr
```js
function patchStyle(el, prevValue, nextValue) {
  // 旧的{color:red},  新的{background:red，color:blue}
  const style = el["style"];
  if (nextValue) {
    // 用新的样式覆生效所有的style
    for (let key in nextValue) {
      style[key] = nextValue[key];
    }
  }
  if (prevValue) {
    for (let key in prevValue) {
      if (nextValue[key] == null) {
        style[key] = null;
      }
    }
  }
}

function patchClass(el, nextValue) {
  // class:"abc" class:"abc bcd efg"
  if (nextValue == null) {
    el.removeAttribute("class");
  } else {
    el.className = nextValue;
  }
}

function patchAttr(el, key, nextValue) {
  if (nextValue == null) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, nextValue);
  }
}
```
:::
重点是对 <blue>事件的处理<code> patchEvent </code></blue> 
#### patchEvent
:::info
 对于事件而言，我们并不关心之前是什么，而是用最新的结果  

 通过一个自定义的变量,绑定这个变量,后续更改变量对应的值
:::

1. `<div @click="a"/>` 变为了 `<div @click="b">`,换绑事件
2. `<div @click="a"/>` 变为了 `<div>`,删除事件
3. `<div>` 变为了 `<div @click="a">`,添加事件

```js
  function patchEvent(el, eventName, nextValue){
    const invokers = el._vei || (el._vei = {});
    const exists = invokers[eventName];
    // 换绑事件
    if(exists && nextValue){
      exists.val = nextValue; 
    }else {
      const name = eventName.slice(2).toLowerCase();
      // 删除事件
      if(exists){
        el.removeEventListener(name, exists);
        invokers[eventName] = null;
      }else {
        // 添加事件
        const invoker = (invokers[eventName] = createInvoler(nextValue));
        el.addEventListener(name, invoker);
      }
    }
  }
// 可以看做函数切片
function createInvoler(val) {
  const invoker = (e) => invoker.val(e);
  invoker.val = val;
  return invoker;
}
```
以第一次 `div` 添加 `click` 举例:
```js
const invokers = div._evi = {};
// 函数当做对象使用 
const invoker = (e) => invoker.val(e);
invoker.val = a;
invokers['click'] = invoker;
```
函数当做对象使用,原理简化:
```js
 const div = {};
 const invokers = (div._evi = {});
 // 此时 invoker.val 并不知道指向的地址
 const invoker = e => invoker.val(e);//[!code hl]
 // 用户绑定的方法
 invoker.val = function () {
   return { name: "zs" };
 };
 invokers["click"] = invoker;
 // 相当于函数调用
 div.x = invoker;
 let r = div.x();
 console.log(r) // {name: "zs"}
 console.log(div) // {_evi: {click: {val: ƒ}}}
```
## 默认 `render`
接收两个参数 `vdom` 和 `container`
```js
function render(vdom, container) {
  const { render } = createRenderer(renderOptions);
  render(vdom, container);
}
```  
通过 `createRenderer` 的返回值调用 [`render`](./render.md) 方法
