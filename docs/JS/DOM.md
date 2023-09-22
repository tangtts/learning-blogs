# DOM对象

## [getBoundingClientRect](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
获取元素在视口中的位置
<img src="@img/element-box-diagram.png"/>

:::tip
  该方法返回的 DOMRect 对象中的 width 和 height 属性是包含了 padding 和 border-width 的，而不仅仅是内容部分的宽度和高度
:::

## clientWidth / offsetWidth / scrollWidth / getBoundingClientRect
1. clientWidth 表示元素内部宽度,即只有 width 和 padding,属于自身内部宽度,padding 可以看做自己内部间距
2. offsetWidth 表示元素偏移宽度, 包含可能会导致别的元素偏移的宽度,即 width 和 padding,border
3. [scrollWidth](https://developer.mozilla.org/zh-CN/docs/Web/API/element/scrollWidth) 表示滚动宽度,**包含元素的内边距，但不包括边框，外边距或垂直滚动条**,如果元素没有水平滚动条，则和 clientWidth 是一样的
4. getBoundingClientRect 表示元素在视口中的位置，是经过计算的,上面的几种情况是在 `layout` 布局阶段计算的，但是经过 `transform: scale` 之后,由于 `transform` 是使用 `gpu` 计算的, 需要使用 `getBoundingClientRect` 获取最终结果

**上述 width 只和元素自身属性有关,和父元素无关，及时父元素 `overflow:hidden` 也不会变**

```css
 .box {
      width: 100px;
      height: 100px;
      background-color: red;
      /* 水平居中 */
      margin: 0 auto;
      padding: 10px;
      border: solid 20px;
    }
```

<iframe src="/demo/width.html" width="100%" height="380px"/>

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
## scrollIntoView

```js
dom.scrollIntoView({ 
  behavior: "smooth", 
  block: "end", // 纵向
  inline: "nearest" // 横向
});
```
### block
- 「start」：「默认值」。元素顶部和滚动容器顶部对齐
- 「center」：元素和滚动容器居中对齐
- 「end」：元素底部和滚动容器底部对齐
- 「nearest」：如果已经在视野范围内，就不滚动，否则就滚动到顶部或者底部（哪个更靠近就滚到哪里
「start」 和 「end」分别是顶部对齐和底部对齐，效果等同于
```js
// 以下写法
dom.scrollIntoView({
  block: 'start'
})
dom.scrollIntoView({
  block: 'end'
})
// 等同于
dom.scrollIntoView(true)
dom.scrollIntoView(false)
```

<img src="@img/nearest.png"/>

### 间距
`scroll-margin`是直接设置目前元素上的  
`scroll-padding`它需要设置在滚动容器上  
可以看做 `padding/margin`的区别


```html
 <style>
  .parent {
    height: 300px;
    overflow: auto;
    /* scroll-padding:50px */
  }
  .child {
    height: 100px;
    background-color: rgb(196, 66, 66);
    color: white;
    text-align: center;
    line-height: 100px;
    scroll-margin: 50px;
  }
  .child + .child {
    margin-top: 10px;
  }
</style>
  <div class="parent">
    <div style="height: 100%;">
      <div class="child">1</div>
      <div class="child">2</div>
      <div class="child">3</div>
      <div class="child">4</div>
      <div class="child">5</div>
      <div class="child">6</div>
    </div>
  </div>
  <button id="button">跳转到3</button>
  <script>
    let b = document.getElementById('button');
    b.addEventListener('click', function () {
      let o = document.querySelector('.child:nth-child(3)');
      o.scrollIntoView({
        behavior: "smooth", 
      }); // 滚动到底部
    })
  </script>
```