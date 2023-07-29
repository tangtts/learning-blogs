
# BFC

## 什么是 BFC(Block formatting context)
  是一块独立的渲染区域, `BFC` 主要指的是 `block-level box` 层级的元素的表现形式

 ### 什么是Box

 在页面上，是由 一个一个 的 `Box` 堆砌而成, 元素的类型 和 `display` 的属性，决定了 `Box` 的类型，不同的 `Box`,会参与不同的 `Formatting Context` ,因此在不同的 `Box` 中会有不同的 **渲染方式**

- block-level box
  - display 属性为 block, list-item, table 的元素，会生成 block-level box。并且参与 block fomatting context；
- inline-level box
  - display 属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box。并且参与 inline formatting context

### Formatting Context
它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。  
最常见的 `Formatting context` 有 `Block fomatting context` (简称BFC) 和 `Inline formatting context` (简称IFC)。

:::tip
BFC 是一个独立的布局环境，其中的元素布局是不受外界的影响，并且在一个BFC中，块盒与行盒（行盒由一行中所有的内联元素所组成）都会垂直的沿着其父元素的边框排列。
:::

## BFC 布局规则
1. box 的垂直方向由 `margin` 决定,属于 **同一个BFC** 的 margin 会发生折叠
2. BFC 的区域不会和 `float` 重叠
3. 计算 `float` 的高度时，`float` 元素的高度会被计算在内
4. BFC 是一个独立的容器,里面的子元素不会影响到 外面

## 如何创建 BFC
1. float的值不是none
2. position的值不是static或者relative
3. display的值是inline-block、table-cell、flex、table-caption或者inline-flex
4. overflow的值不是visible


### 例子
#### 例子1 - margin合并
```html
  <style>
       P:is(.BFC-P) {
          color: #f55;
          background: yellow;
          width: 200px;
          line-height: 100px;
          text-align:center;
          margin: 30px;
      }
  </style>
  <body>
      <p class="BFC-P">看看我的 margin是多少</p>
      <p class="BFC-P">看看我的 margin是多少</p>
  </body>
```


  <style>
       P:is(.BFC-P) {
          color: #f55;
          background: yellow;
          width: 200px;
          line-height: 100px;
          text-align:center;
          margin: 30px;
      }
  </style>
  <body>
      <p class="BFC-P">看看我的 margin是多少</p>
      <p class="BFC-P">看看我的 margin是多少</p>
  </body>

::: tip
 根据第一条, 在同一个BFC中，两个相邻的 Box 会发生margin重叠, 为了防止合并, 我们可以再加一个 `BFC`
:::  

```html {3}

  <body>
      <p class="BFC-P">看看我的 margin是多少</p>
      <div style="overflow:hidden"> 
      <p class="BFC-P">看看我的 margin是多少</p>
      </div>
  </body>
```

<body>
      <p class="BFC-P">看看我的 margin是多少</p>
      <div style="overflow:hidden">
      <p class="BFC-P">看看我的 margin是多少</p>
      </div>
  </body>

#### 例子2 与float不相交

```html {5}
<style>
    .BFC-left {
        width: 100px;
        height: 150px;
        float: left; /* [!code ++] */
        background: rgb(139, 214, 78);
        text-align: center;
        line-height: 150px;
        font-size: 20px;
    }
    .BFC-left {
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
</style>
<body>
    <div class="BFC-left">LEFT</div>
    <div class="BFC-right">RIGHT</div>
</body>
```

<style>
    .BFC-left {
        width: 100px;
        height: 150px;
        float: left;
        background: rgb(139, 214, 78);
        text-align: center;
        line-height: 150px;
        font-size: 20px;
    }
 
    .BFC-right {
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
</style>
<body>
    <div class="BFC-left">LEFT</div>
    <div class="BFC-right">RIGHT</div>
</body>

:::tip
BFC的区域不会与float box重叠。
:::

```css {2}
  .BFC-right {
        overflow:hidden;  /* [!code focus] */
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
```
<style>
    .BFC-left {
        width: 100px;
        height: 150px;
        float: left;
        background: rgb(139, 214, 78);
        text-align: center;
        line-height: 150px;
        font-size: 20px;
    }
 
    .BFC-right2 {
       overflow: hidden;
        height: 300px;
        background: rgb(170, 54, 236);
        text-align: center;
        line-height: 300px;
        font-size: 40px;
    }
</style>
<body>
    <div class="BFC-left">LEFT</div>
    <div class="BFC-right2">RIGHT</div>
</body>

### 清除浮动。
当我们不给父节点设置高度，子节点设置浮动的时候，会发生高度塌陷，这个时候我们就要清除浮动。

```html
<style>
    .BFC-parent {
      border: 5px solid rgb(91, 243, 30);
      width: 300px;
    }
    
    .BFC-child { /* [!code focus] */
        border: 5px solid rgb(233, 250, 84); 
        width:100px;
        height: 100px;
        float: left; /* [!code focus] */
    }
</style>
<body>
    <div class="BFC-parent">
        <div class="BFC-child"></div>
        <div class="BFC-child"></div>
    </div>
</body>
```

<style>
    .BFC-parent {
      border: 5px solid rgb(91, 243, 30);
      width: 300px;
    }
    
    .BFC-child {
        border: 5px solid rgb(233, 250, 84);
        width:100px;
        height: 100px;
        float: left;
    }
    .BFC-clear{
      clear:both /* 需要清除浮动*/
    }
</style>
<body>
    <div class="BFC-parent">
        <div class="BFC-child"></div>
        <div class="BFC-child"></div>
    </div>
    <div class="BFC-clear"></div>
</body>

:::tip
计算BFC的高度时，浮动元素也参与计算。
:::

```html {5}
<style>
    .BFC-parent { /* [!code focus] */
        border: 5px solid rgb(91, 243, 30);
        width: 300px;
        overflow: hidden; /* [!code focus] */
    }
</style>

```
<style>
    .BFC-parent2 {
        border: 5px solid rgb(91, 243, 30);
        width: 300px; 
        overflow: hidden;  
    }
    
    .child {
        border: 5px solid rgb(233, 250, 84);
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="BFC-parent2">
        <div class="child"></div>
        <div class="child"></div>
    </div>
</body>

::: tip 
🚀 `BFC` 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素   
当 `BFC`外部存在浮动时，不与浮动元素重叠    
当 `BFC` 内部有浮动时，为了不影响外部元素的布局，`BFC` 计算高度时会包括浮动的高度
:::
