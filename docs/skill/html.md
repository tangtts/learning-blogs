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
