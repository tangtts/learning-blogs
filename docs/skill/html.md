# HTML-技巧

## 阻止 `input` 聚焦
使用 `@mousedown.prevent` 阻止默认事件

```html
<el-input type="text"/>
<el-button type="primary" @mousedown.prevent>点击</el-button>
```

## 设置优先级
importance = "high"
如果是js文件使用 preload
```html
<img src="/bigBg.png"width="400"height="500" importance="high" />
```
也可以使用 [fetchpriority](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority)  有效值 有 high low auto  

fetchpriority 属性可以与 link、script、img 以及 iframe 标签一起使用，该属性允许我们在使用这些标签加载资源（例如：样式资源、字体资源、脚本资源、图像资源和 iframe）时指定优先级。

## min-width / min-height 代替 width / height

<img
 style="object-fit:contain"
 src="../assets/img/v2-b28a6ca67d085829cff6050472a688f8_720w.webp"/>

为了避免内容超出容器，我们需要使用 min-height 来替代 height：

```css
.hero {
    min-height: 350px;
}
```

<img 
style="object-fit:contain"
src="../assets/img/v2-71ece957daf24d53df8b57482c42cc0e_720w.webp"/>

使用 width 如果文本过长会溢出
<img 
style="object-fit:contain"
src="../assets/img/v2-418c4d0a017b505130ebd1b25362cf6e_720w.webp"/>
把 width 换成min-width 就不会出现这种现象了：

```css
.button {
  min-width: 100px;
}
```
## 图片上的文字
> 很多场景中，文字会出现在图片之上:  
>大多数的时候，开发者都会考虑在文本和图片之间增一个层，这个层可能是一个纯色层，也能是一渐变层，也可能是一个带有一定透明度的层，为增加文本的可读性


<img 
style="object-fit:contain"
src="../assets/img/v2-bfad4da6374434827e3543cf0043433c_720w.webp"/>



<style scoped lang="scss" module="textOnPicContainer">

.textOnPicContainer {
  min-height: 100vh;
  background-color: #557;
  padding: 20px;
  display: grid;
  place-content: center;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  .card {
        background-color: #fff;
        border-radius: 5px;
        border: 1px solid #e8e0e0;
        box-shadow: 0 3px 10px 0 rgb(0 0 0 / 0.3);
        padding: 5px;
        display: grid;
      img {
        max-width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        object-position: center;
        border-radius: 5px;
        vertical-align: top;
      }

     &__content{
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 10px;
        background-image: linear-gradient(to top, rgb(0 0 0 / 0.4), rgb(0 0 0 / 0));
        text-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
        border-radius: 5px;
     }
     &__thumb, 
     &__content,
     &__tag{
      grid-area: 1 / -1;
     }

    &__tag{
      background-color: #2196f3;
      color: #fff;
      padding: 10px 15px;
    }

    &__content{
      z-index: 2;
    }

    &__tag{
      align-self: start;
      justify-self: start;
      z-index: 3;
      margin-top: 2rem;
      border-radius: 0 10rem 10rem 0;
    }
  }

.card:nth-child(1) .card__content {
  background-image: linear-gradient(to top, rgb(0 0 0 / 0.4), rgb(0 0 0 / 0));
}

.card:nth-child(2) .card__content {
  background-image: linear-gradient(to top, rgb(0 0 0 / 0.4), rgb(0 0 0 / 0));
  background-size: 100% 42.5%;
  background-position: left bottom;
  background-repeat: no-repeat;
}

.card:nth-child(3) .card__content {
  background-image: linear-gradient(
    to top,
    hsla(0, 0%, 0%, 0.62) 0%,
    hsla(0, 0%, 0%, 0.614) 7.5%,
    hsla(0, 0%, 0%, 0.596) 13.5%,
    hsla(0, 0%, 0%, 0.569) 18.2%,
    hsla(0, 0%, 0%, 0.533) 22%,
    hsla(0, 0%, 0%, 0.49) 25.3%,
    hsla(0, 0%, 0%, 0.441) 28.3%,
    hsla(0, 0%, 0%, 0.388) 31.4%,
    hsla(0, 0%, 0%, 0.333) 35%,
    hsla(0, 0%, 0%, 0.277) 39.3%,
    hsla(0, 0%, 0%, 0.221) 44.7%,
    hsla(0, 0%, 0%, 0.167) 51.6%,
    hsla(0, 0%, 0%, 0.117) 60.2%,
    hsla(0, 0%, 0%, 0.071) 70.9%,
    hsla(0, 0%, 0%, 0.032) 84.1%,
    hsla(0, 0%, 0%, 0) 100%
  );
}

.card:nth-child(4)::after {
  content: "";
  grid-area: 1 / -1;
  opacity: 0.5;
  background-image: conic-gradient(
    from 90deg at 40% -25%,
    #ffd700,
    #f79d03,
    #ee6907,
    #e6390a,
    #de0d0d,
    #d61039,
    #cf1261,
    #c71585,
    #cf1261,
    #d61039,
    #de0d0d,
    #ee6907,
    #f79d03,
    #ffd700,
    #ffd700,
    #ffd700
  );
}

.card:nth-child(5) .card__content {
  background-image: linear-gradient(
    to right,
    hsl(0, 0%, 0%) 0%,
    hsla(0, 0%, 0%, 0.964) 7.4%,
    hsla(0, 0%, 0%, 0.918) 15.3%,
    hsla(0, 0%, 0%, 0.862) 23.4%,
    hsla(0, 0%, 0%, 0.799) 31.6%,
    hsla(0, 0%, 0%, 0.73) 39.9%,
    hsla(0, 0%, 0%, 0.655) 48.2%,
    hsla(0, 0%, 0%, 0.577) 56.2%,
    hsla(0, 0%, 0%, 0.497) 64%,
    hsla(0, 0%, 0%, 0.417) 71.3%,
    hsla(0, 0%, 0%, 0.337) 78.1%,
    hsla(0, 0%, 0%, 0.259) 84.2%,
    hsla(0, 0%, 0%, 0.186) 89.6%,
    hsla(0, 0%, 0%, 0.117) 94.1%,
    hsla(0, 0%, 0%, 0.054) 97.6%,
    hsla(0, 0%, 0%, 0) 100%
  );
}

.card:nth-child(6) .card__content {
  background-image: radial-gradient(
    ellipse 100% 100% at right center,
    transparent 80%,
    #000
  );
}

.card:nth-child(7) .card__content {
  background-color: rgb(0 0 0 / 0.6);
}

.card:nth-child(8) .card__content {
  background-color: rgba(0, 0, 0, 0.4);
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.8) 100%
  );
}
  .card:nth-child(9)::before {
    content: "";
    grid-area: 1 / -1;
    background-color: #000;
    z-index: -1;
  }
  .card:nth-child(9) .card__thumb {
    opacity: 0.5;
  }

  .card:nth-child(10) .card__content {
    background-color: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(5px);
  }

  .card:nth-child(11) .card__thumb {
    filter: grayscale(1);
  }
}
</style>

<div :class="textOnPicContainer.textOnPicContainer">
  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=1" width="966" height="358" alt="" />
    </div>
  </div>

  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=31" width="966" height="358" alt="" />
    </div>
  </div>

  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=2" width="966" height="358" alt="" />
    </div>
  </div>

  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=3" width="966" height="358" alt="" />
    </div>
  </div>

  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=4" width="966" height="358" alt="" />
    </div>
  </div>

  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=5" width="966" height="358" alt="" />
    </div>
  </div>

  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=6" width="966" height="358" alt="" />
    </div>
  </div>

  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=7" width="966" height="358" alt="" />
    </div>
  </div>

  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=8" width="966" height="358" alt="" />
    </div>
  </div>
  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=9" width="966" height="358" alt="" />
    </div>
  </div>

  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=10" width="966" height="358" alt="" />
    </div>
  </div>
  <div :class="textOnPicContainer.card">
    <div :class="textOnPicContainer.card__tag">
      Must Try
    </div>
    <div :class="textOnPicContainer.card__content">
      <h2>Card Title</h2>
      <p>Some des will go here and I need it to wrap into lines</p>
    </div>
    <div :class="textOnPicContainer.card__thumb">
      <img src="https://picsum.photos/966/358?random=11" width="966" height="358" alt="" />
    </div>
  </div>
</div>