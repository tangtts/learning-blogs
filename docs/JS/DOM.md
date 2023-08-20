# DOM对象

## [getBoundingClientRect](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
获取元素在视口中的位置
<img src="./../assets/img/element-box-diagram.png"/>

:::tip
  该方法返回的 DOMRect 对象中的 width 和 height 属性是包含了 padding 和 border-width 的，而不仅仅是内容部分的宽度和高度
:::

## append & appendChlid
### append
是比appendChild更加新的api,可以传入多个参数，还可以传入文本，但是没有返回值
```js
let div = document.createElement("div")
let p = document.createElement("p")
div.append(p)

console.log(div.childNodes) // NodeList [ <p> ]

// 插入文本
let div = document.createElement("div")
div.append("Some text")

console.log(div.textContent) // "Some text"

// 传入多个参数
let div = document.createElement("div")
let p = document.createElement("p")
div.append("Some text", p)

console.log(div.childNodes) // NodeList [ #text "Some text", <p> ]
```
### appendChild
如果将被插入的节点已经存在于当前文档的文档树中，那么 appendChild() 只会将它从原先的位置移动到新的位置，这意味着，一个节点不可能同时出现在文档的不同位置，如果想保留，使用 `Node.cloneNode()` 创建一个副本，再将副本附加到目标父节点下

:::danger
appendChild() 返回的是被附加的子元素,不支持多参数，不支持 string
:::

```js
// 创建一个新的段落元素 <p>，然后添加到 <body> 的最尾部
var p = document.createElement("p");
document.body.appendChild(p);
```