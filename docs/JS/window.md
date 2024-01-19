# windowAPI

主要是记录 windowAPI 的使用

## defer / async

defer 和 async 都是异步加载

- defer 具有推迟的意思,就是说当 Dom 树加载完毕之后执行，可以获取真实的 dom
- async 具有异步的意思,是自己异步加载，加载完毕之后就立即执行，会阻塞 dom 的渲染

<img src="@img/test.3ca4a381.png"/>

```js
<script async src="js/vendor/jquery.js"></script>

<script async src="js/script2.js"></script>

<script async src="js/script3.js"></script>
```
### async
:::tip
三者的调用顺序是不确定的。  
jquery.js 可能在 script2 和 script3 之前或之后调用，如果这样，后两个脚本中依赖 jquery 的函数将产生错误，因为脚本运行时 jquery 尚未加载
:::
### defer
:::tip
添加 defer 属性的脚本将**按照在页面中出现的顺序加载**，
因此第二个示例可确保 jquery.js 必定加载于 script2.js 和 script3.js 之前，
同时 script2.js 必定加载于 script3.js 之前。

:::
脚本调用策略小结：
- 如果脚本无需等待页面解析，且无依赖独立运行，那么应使用 async。
- 如果脚本需要等待页面解析，且**依赖于其它脚本**，调用这些脚本时应使用 defer，将关联的脚本按所需顺序置于 HTML 中。

### preload

:::tip
提供一种声明式的命令,让浏览器提前加载资源(加载后并不执行),在需要执行的时候再执行
- 将加载和执行分离开，不阻塞渲染和 document 的 onload 事件
- 提前加载指定资源，不再出现依赖的 font 字体隔了一段时间才刷出
:::
#### 使用 HTTP 响应头的 Link 字段创建
如我们常用到的 antd 会依赖一个 CDN 上的 font.js 字体文件，我们可以设置为提前加载，以及有一些模块虽然是按需异步加载，但在某些场景下知道其必定会加载的，则可以设置 preload 进行预加载，如：

```html
<link rel="preload" as="font"   href="https://at.alicdn.com/t/font_zck90zmlh7hf47vi.woff">

<link rel="preload" as="script" href="https://a.xxx.com/xxx/PcCommon.js">

<link rel="preload" as="script" href="https://a.xxx.com/xxx/TabsPc.js">
```
#### 如何区分 preload 和 prefetch
**⭐一个是预执行，另一个是预请求**
- preload 是告诉浏览器页面必定需要的资源，浏览器一定会加载这些资源;不管资源是否被使用
- prefetch 是告诉浏览器页面可能需要的资源，浏览器不一定会加载这些资源(有空闲时加载)
#### 避免错用 preload 加载跨域资源
若 css 中有应用于已渲染到 DOM 树的元素的选择器，且设置了 @font-face 规则时，会触发字体文件的加载。而字体文件加载中时，DOM 中的这些元素，是处于不可见的状态。对已知必加载的 font 文件进行预加载，除了有性能提升外，更有体验优化的效果。

在我们的场景中，已知 antd.css 会依赖 font 文件，所以我们可以对这个字体文件进行 preload:
```html
<link rel="preload" as="font" href="https://at.alicdn.com/t/font_zck90zmlh7hf47vi.woff">
```
然而我发现这个文件加载了两次：
<img src="@img/v2-49ecba5aac6bbbd1fac6fd4789905f2b_720w.png"/>

原因是对跨域的文件进行 preload 的时候，我们必须加上 crossorigin 属性：
```html
  <link rel="preload" as="font" crossorigin href="https://at.alicdn.com/t/font_zck90zmlh7hf47vi.woff">
```

####  Dns-prefetch(dns预获取) 
是尝试在请求资源之前解析域名。 仅对跨域域上的 DNS 查找有效
<img src="@img/image.png"/>

## Promise

### all

```vue
<script setup>
import { ref } from "vue";
let all = ref([]);

Promise.all([]).then(res => {
  all.value = res;
});
</script>
```

<script setup>
import {ref} from "vue"
let all = ref([])
Promise.all([]).then(res=>{
  all.value = res
})

let race = ref('')
Promise.race([]).then(res=>{
  race.value = res
})
</script>
<p>Promise.all([])的结果是:{{all}}</p>

### race

```vue
<script setup>
import { ref } from "vue";
let race = ref("");

Promise.race([]).then(res => {
  race.value = res;
});
</script>
```

<p>Promise.race([])的结果是:{{race}}即:一个`pending`状态</p>

### await
[🔗await使用](../Vue/functions/useFetch.html#使用-await-同步请求数据)  

**可以模拟,只需要返回一个 `then` 函数**
```js
  function a() {
  return {
    then(onFull) {
      return onFull(10);
    },
  };
}

async function b() {
  return await a();
}

b().then(
  res => {
    console.log(res); // 10
  }
);
```
### [🔗any](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

返回第一个 `成功` 的 `promise`，如果 `失败` 不管  

与 `race` 不同的是，`race` 是返回第一个完成的 `promise`，不管他是不是 `成功` 或者是 `失败`

```js
const pErr = new Promise((resolve, reject) => {
  reject("总是失败");
});

const pSlow = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "最终完成");
});

const pFast = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "很快完成");
});

Promise.any([pErr, pSlow, pFast]).then((value) => {
  console.log(value);
  // pFast 第一个兑现
});
```

## [🔗URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)

返回一个`iterator`，可以有 `values`,`keys`,`entries`

### 传入参数

1. 传入对象

```js
var params4 = new URLSearchParams({ foo: 1, bar: 2 });
console.log(params4.toString()); // foo=1&bar=2
```

2. 传入 `entries`

```js
var params3 = new URLSearchParams([
  ["foo", 1],
  ["bar", 2],
]);
console.log(params3.toString()); // // foo=1&bar=2
```

3. 传入字符串
有没有问号都无所谓，因为它会自动去除
```js
var searchParams = new URLSearchParams("?key1=value1&key2=value2");
// var searchParams = new URLSearchParams("key1=value1&key2=value2"); 

for (var pair of searchParams.entries()) {
  // key1,value1
  // key2,value2
  console.log(pair[0] + ", " + pair[1]);
}

var url = new URL("https://example.com?foo=1&bar=2");
// url.search = foo=1&bar=2
var params = new URLSearchParams(url.search);
console.log(params.toString());
```

### 方法

#### append

```js
let url = new URL("https://example.com?foo=1&bar=2");
let params = new URLSearchParams(url.search.slice(1));

//添加第二个 foo 搜索参数。
params.append("foo", 4);
//查询字符串变成：'foo=1&bar=2&foo=4'
```

#### get

```js
let params = new URLSearchParams("name=Jonathan&age=18");
let name = params.get("name"); // is the string "Jonathan"
let age = parseInt(params.get("age"), 10); // is the number 18
let address = params.get("address"); // null
```

#### has

```js
let url = new URL("https://example.com?foo=1&bar=2");
let params = new URLSearchParams(url.search.slice(1));

params.has("bar") === true; //true
```

#### keys

```js
// 建立一个测试用 URLSearchParams 对象
var searchParams = new URLSearchParams("key1=value1&key2=value2");

// 输出键值对
for (var key of searchParams.keys()) {
  console.log(key);
}
```

#### values

```js
// 创建一个测试用 URLSearchParams 对象
var searchParams = new URLSearchParams("key1=value1&key2=value2");

// 输出值
for (var value of searchParams.values()) {
  console.log(value);
}
```

### 和 URL 的关系

```js
const urlObj = new URL(location.href);
urlObj.searchParams.get("cccc")

urlObj.searchParams instanceof URLSearchParams // true
```
```js
const urlObj = new URLSearchParams(location.search);
urlObj.get("cccc")
```

<img src="@img/urlSearchParam.png"/>

## Blob
Blob 对象表示一个**不可变、原始数据的类文件对象**。它的数据可以按**文本或二进制的格式进行读取**，也可以转换成 ReadableStream 来用于数据操作  

Blob 表示的不一定是 JavaScript 原生格式的数据。File 接口基于 Blob，继承了 blob 的功能并将其扩展以支持用户系统上的文件

```js
const obj = { hello: "world" };
const blob = new Blob([JSON.stringify(obj)], {
  type: "application/json",
});
```
### 从 blob 中提取数据
```js
const text = await new Response(blob).text();
```
或者
```js
const text = await blob.text();
```
或者
```js
const reader = new FileReader();
reader.addEventListener("loadend", () => {
  // reader.result 包含被转化为类型化数组的 blob 中的内容
});
reader.readAsArrayBuffer(blob);
```

## [URL.createObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL_static)

```js
objectURL = URL.createObjectURL(object);
```

:::info
object
用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象。
返回值
一个 DOMString 包含了一个对象 URL，该 URL 可用于指定源 object 的内容。
:::

:::warning
内存管理
在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使你已经用相同的对象作为参数创建过。当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法来释放。
:::

```js
var img = document.createElement("img");
// createObjectURL会生成一个 localhost:8080/xxxxx
img.src = window.URL.createObjectURL(files[i]);
img.height = 60;
img.onload = function () {
  window.URL.revokeObjectURL(this.src);
};
```

### [FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)

:::info
FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。

---

其中 File 对象可以是来自用户在一个\<input>元素上选择文件后返回的 FileList 对象，也可以来自拖放操作生成的 DataTransfer 对象
:::

#### 方法

##### FileReader.readAsDataURL()

开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个 **data: URL** 格式的 **Base64 字符串**以表示所读取文件的内容。

##### FileReader.readAsText()

开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个字符串以表示所读取的文件内容。

### [🚀structuredClone](https://developer.mozilla.org/zh-CN/docs/Web/API/structuredClone)

```js {6}
// Create an object with a value and a circular reference to itself.
const original = { name: "MDN" };
original.itself = original;

// Clone it
const clone = structuredClone(original);

console.assert(clone !== original); // the objects are not the same (not same identity)
console.assert(clone.name === "MDN"); // they do have the same values
console.assert(clone.itself === clone); // and the circular reference is preserved
```

## JSON

### JSON 的类型

1. string
2. number
3. object
4. array
5. null
6. boolean

### JSON.stringify

```js
console.log(JSON.stringify({ x: 5, y: 6 }));
// Expected output: "{"x":5,"y":6}"

console.log(
  JSON.stringify([new Number(3), new String("false"), new Boolean(false)])
);
// Expected output: "[3,"false",false]"

console.log(JSON.stringify({ x: [10, undefined, function () {}, Symbol("")] }));
// Expected output: "{"x":[10,null,null,null]}"

console.log(JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)));
// Expected output: ""2006-01-02T15:04:05.000Z""
```

#### 描述

`JSON.stringify()` 将值转换为相应的 JSON 格式：

- 转换值如果有 toJSON() 方法，使用其返回值
- 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值
- 函数、undefined 和 Symbol 单独转化返回 `undefined`,如果出现在 **数组** 中，转化为 null
- 循环引用会报错
- Date 类型调用 `toString`,转化为字符串
- NaN、infinite 和 null 转化 为 null

```js
JSON.stringify([new Number(1), new String("false"), new Boolean(false)]);
// '[1,"false",false]'

JSON.stringify({ x: undefined, y: Object, z: Symbol("") });
// '{}'

JSON.stringify([undefined, Object, Symbol("")]);
// '[null,null,null]'

JSON.stringify({ [Symbol("foo")]: "foo" });
// '{}'

var obj = {
  foo: "foo",
  toJSON: function () {
    return "bar";
  },
};
JSON.stringify(obj); // '"bar"'
JSON.stringify({ x: obj }); // '{"x":"bar"}'
```

### Json.parse

```js
JSON.parse("123"); // 可以
JSON.parse("abcd132"); // 失败,没有引号  // [!code error]
JSON.parse('"abcd132"'); //[!code ++]
// 可以，因为 abcd132 必须限定为一个字符串
var str = '{"name":"小明","age":18}';
// 不能是
var str = "{'name':'小明', 'age':18}";

// 不能用逗号结尾
JSON.parse("[1, 2, 3, 4, ]");
JSON.parse('{"foo" : 1, }');
```

## Error

### RangeError

创建一个 error 实例，表示错误的原因：数值变量或参数超出其有效范围

### ReferenceError

无效引用 ReferenceError（引用错误） 对象代表当一个不存在的变量被引用时发生的错误。

```js
(function (arg) {})(abcde); // abcde 并不存在，使用了一个不存在的变量
```

### SyntaxError

当 Javascript 语言解析代码时,Javascript 引擎发现了 不符合语法规范的 tokens 或 token 顺序时抛出

```js
[1,2,3].forEach(item=>console.log(item);)
// VM714:1 Uncaught SyntaxError: missing ) after argument list
```

### TypeError

变量或参数不属于有效类型  
当传入函数的操作数或参数的类型并非操作符或函数所预期的类型时，将抛出一个 TypeError 类型错误

```js
// 1. 不是一个有效函数
var abcdf = 123;
abcdf();

// 2. 不属于有效类型
a.push(231);
var a = [];
```
##  捕获错误
### 捕获Promise错误
```js
window.addEventListener("unhandledrejection", event => {
	// 要阻止默认事件，否则还是有错误
	event.preventDefault();
	console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
})

function a() {
	new Promise((resolve, reject) => {
		reject(12);
	});
}
a();
``` 

## 事件

### dragover/drop

:::tip
必须要阻止 元素的 dragover 默认事件，默认事件是打开文件
:::

```vue{4}
<div
  style="width:100px;height:100px;background-color: yellow;"
  @drop="drop"
  @dragover.prevent
  draggable="true">
</div>
<script lang="ts" setup>
  const drop = (e) => {
    console.log(e, "drop")
    e.target.appendChild(dragged);
  }
</script>
```

### 事件捕获
默认是 `false`,冒泡事件
:::info
**事件执行先捕获，后冒泡,但是不执行绑定的函数，否则怎么捕获呢？等遇到父级元素的`cature`之后在执行**
捕获就像捕鱼一样，从上往下执行  
第三个参数传递 **true 使用捕获模式**，先从 window,然后到 people  
:::

:::tip
在 掘金/知乎 这种外链，可以使用这种
:::

```js{6-8}
// 可以有效阻止某些用户没有权限
// 如果想阻拦全局a标签的跳转，使用e.preventDefault
window.addEventListener(
  "click",
  function (e) {
    console.log("window", e.target.nodeName);
    e.stopPropagation();
    e.preventDefault();
  },
  true
);

document.getElementById("people").addEventListener("click", () => {
  console.log("people");
});
```
<iframe src="/demo/冒泡.html" width="100%" height="400"></iframe>

### 阻止事件执行
```js
let abortController = new  AbortController()

inner.addEventListener("click",function(){
  console.log("inner")
},{
  signal:abortController.signal
})

setTimeout(()=>{
  abortController.abort()
},2000)
```
### mouseenter & mouseover

<iframe src="/demo/mouseEnter.html" width="100%" height="400"></iframe>

## [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。

:::tip
 若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 requestAnimationFrame()。requestAnimationFrame() 是一次性的。
:::


举个栗子：

假设屏幕每隔16.7ms刷新一次，而setTimeout每隔10ms设置图像向左移动1px， 就会出现如下绘制过程：

1. 第0ms: 屏幕未刷新，等待中，setTimeout也未执行，等待中；
2. 第10ms: 屏幕未刷新，等待中，setTimeout开始执行并设置图像属性left=1px；
2. 第16.7ms: 屏幕开始刷新，屏幕上的图像向左移动了1px， setTimeout 未执行，继续等待中；
2. 第20ms: 屏幕未刷新，等待中，setTimeout开始执行并设置left=2px;
3. 第30ms: 屏幕未刷新，等待中，setTimeout开始执行并设置left=3px;
4. 第33.4ms:屏幕开始刷新，屏幕上的图像向左移动了3px， setTimeout未执行，继续等待中；
…

从上面的绘制过程中可以看出，屏幕 *`没有更新left=2px`* 的那一帧画面，图像直接从 `1px` 的位置跳到了 `3px` 的的位置，这就是丢帧现象，这种现象就会引起动画卡顿。

```js
var start = null;
var element = document.getElementById('SomeElementYouWantToAnimate');
element.style.position = 'absolute';
 
function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  element.style.left = Math.min(progress / 10, 200) + 'px';
  if (progress < 2000) {
    // 不断的自我调用，因为是一次性的
    window.requestAnimationFrame(step); // [!code ++]
  }
}
 
window.requestAnimationFrame(step);
```

**下次重绘之前继续更新下一帧动画**

:::tip  requestAnimationFrame 嵌套
使用两个嵌套的 `requestAnimationFrame` 是为了确保回调函数 cb 在下一帧渲染之前执行。这样做的目的是为了优化性能和动画的流畅度。

如果只使用一个 `requestAnimationFrame`，那么回调函数 cb 将会在下一帧渲染时执行。但是，由于 JavaScript 是单线程的，如果在同一帧中执行的任务过多，可能会导致页面卡顿或动画不流畅。

通过嵌套两个 `requestAnimationFrame`，可以将回调函数的执行时间分散到两个连续的帧中。第一个 `requestAnimationFrame` 会在当前帧结束时调用，而第二个 `requestAnimationFrame` 会在下一帧开始时调用。这样可以确保回调函数 cb 在下一帧渲染之前执行，从而提高性能和动画的流畅度。

因此，使用两个嵌套的 `requestAnimationFrame` 是为了确保回调函数在下一帧渲染之前执行，以优化性能和动画的流畅度。
:::


```ts
function nextTickFrame(fn: FrameRequestCallback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn)
  })
}
```

## [encodeURIComponent](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)/[encodeURI](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)

:::tip
与 encodeURI() 相比，此函数会编码更多的字符，包括 URI 语法的一部分。
:::

encodeURIComponent 转义除了如下所示外的所有字符：

不转义的字符：  A-Z a-z 0-9 - _ . ! ~ * ' ( )
```js
var set1 = ";,/?:@&=+$"; // 保留字符
var set2 = "-_.!~*'()"; // 不转义字符
var set3 = "#"; // 数字标志
var set4 = "ABC abc 123"; // 字母数字字符和空格

console.log(encodeURI(set1)); // ;,/?:@&=+$
console.log(encodeURI(set2)); // -_.!~*'()
console.log(encodeURI(set3)); // #
console.log(encodeURI(set4)); // ABC%20abc%20123 (空格被编码为 %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log(encodeURIComponent(set2)); // -_.!~*'()
console.log(encodeURIComponent(set3)); // %23
console.log(encodeURIComponent(set4)); // ABC%20abc%20123 (空格被编码为 %20)

```

## [URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)

<img src="@img/URL.webp" style="margin-bottom:10px"/>

```js
let s = new URL(
"http://zs:123456@localhost:8080/directorPerformance/todo?id=1#name=zs#age=5"
);

console.log(s)
```

<img src="@img/url.png" style="margin-bottom:10px"/>


<iframe
  height="280"
  width="100%"
  frameborder="1"
  src="//unpkg.com/javascript-playgrounds@^1.0.0/public/index.html?#data=%7B%22code%22%3A%22let%20s%20%3D%20new%20URL(%5Cn%20%20%5C%22http%3A%2F%2Fzs%3A123456%40localhost%3A8080%2FdirectorPerformance%2Ftodo%3Fid%3D1%23name%3Dzs%23age%3D5%5C%22)%3B%5Cn%20%20console.log(s)%22%7D"
></iframe>

### 属性
- search  
指示 URL 的参数字符串；如果提供了任何参数，则此字符串包括所有参数，并以开头的`"?"`开头 字符。

- searchParams 只读  
URLSearchParams对象，可用于访问`search`中找到的各个查询参数。
```js
// https://some.site/?id=123
const parsedUrl = new URL(window.location.href);
console.log(parsedUrl.searchParams.get("id")); // "123"
```
- hash
包含'#'的USVString，后跟 URL 的片段标识符。

- pathname
以 '/' 起头紧跟着 URL 文件路径的 DOMString。


### 静态方法
createObjectURL()  
返回一个DOMString ，包含一个唯一的 blob 链接（该链接协议为以 blob:，后跟唯一标识浏览器中的对象的掩码）。

revokeObjectURL()  
销毁之前使用URL.createObjectURL()方法创建的 URL 实例。

### 可写

```js
function constructURL(param) {
  const { category, limit, userId } = param;
  const baseURL = "https://fakestoreapi.com/products";
  const url = new URL(baseURL);
  const params = new URLSearchParams();

  // 添加参数，更改 url
  if (category) url.pathname += `/category/${category}`;
  if (limit) params.append('limit', Number(limit).toString());
  if (userId) params.append('userId', Number(userId).toString());

  // 可读可写
  url.search = params.toString();
  return url.toString();
}

let r = constructURL({
  category: 'mugs',
  limit: 10,
  userId: 1
})

// https://fakestoreapi.com/products/category/mugs?limit=10&userId=1
console.log(r); 
```

<iframe
  height="500"
  width="100%"
  frameborder="1"
  src="https://unpkg.com/javascript-playgrounds@1.2.3/public/index.html#data=%7B%22code%22%3A%22function%20constructURL(param)%20%7B%5Cn%20%20const%20%7B%20category%2C%20limit%2C%20userId%20%7D%20%3D%20param%3B%5Cn%20%20const%20baseURL%20%3D%20%5C%22https%3A%2F%2Ffakestoreapi.com%2Fproducts%5C%22%3B%5Cn%20%20const%20url%20%3D%20new%20URL(baseURL)%3B%5Cn%20%20const%20params%20%3D%20new%20URLSearchParams()%3B%5Cn%5Cn%20%20if%20(category)%20url.pathname%20%2B%3D%20%60%2Fcategory%2F%24%7Bcategory%7D%60%3B%5Cn%20%20if%20(limit)%20params.append('limit'%2C%20Number(limit).toString())%3B%5Cn%20%20if%20(userId)%20params.append('userId'%2C%20Number(userId).toString())%3B%5Cn%2F%2F%20%E5%8F%AF%E8%AF%BB%E5%8F%AF%E5%86%99%5Cn%20%20url.search%20%3D%20params.toString()%3B%5Cn%20%20return%20url.toString()%3B%5Cn%7D%5Cnlet%20r%20%3D%20constructURL(%7B%5Cn%20%20category%3A%20'mugs'%2C%5Cn%20%20limit%3A%2010%2C%5Cn%20%20userId%3A%201%5Cn%7D)%5Cnconsole.log(r)%3B%22%7D"
></iframe>





## IntersectionObserver

```js
var observer = new IntersectionObserver(callback[, options])
```
options:
-  root
   监听元素的祖先元素的element 对象,其边界盒作为视口
- rootMargin
  距离边界盒的一组偏移量,类型为字符串,与margin相同,默认值是 `0px 0px 0px 0px`

- threshold 
  一个包含阈值的列表，按升序排列，列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。当监听对象的任何阈值被越过时，都会生成一个通知（Notification）。如果构造器未传入值，则默认值为 0。 
  
```js
// Register IntersectionObserver
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // Add 'active' class if observation target is inside viewport
    if (entry.intersectionRatio > 0) {
      entry.target.classList.add("active");
    }
    // Remove 'active' class otherwise
    else {
      entry.target.classList.remove("active");
    }
  });
});

// Declares what to observe, and observes its properties.
const boxElList = document.querySelectorAll(".box");
boxElList.forEach((el) => {
  io.observe(el);
});

```
## == 比较规则
1. 两端类型相同,比较值
2. 只要存在`NaN`,返回`false`
3. `undefined` 和 `null` 只有与自身比较，或者互相比较，返回 `true`
4. ⭐<blue>两端都是原始类型，转化为数字</blue>
   ```js
    var a = "a"
    console.log(a == 1) // false
    //a 转化为数字是 NaN, NaN 比较任何值都是false
   ``` 
5. ⭐<blue>一端是原始类型，一端是对象类型，把对象转换成原始类型后进行第一步</blue>
   :::tip 对象转原始类型
    1. 先使用 `[Symbol.toPrimitive]` 方法,判断是否可以获取到原始值
    2. 调用 `valueOf` 方法,是否可以获取原始值
    3. 调用 `toString` 方法,是否可以获取原始值
   ::: 

`[Symbol.toPrimitive]` 接受 3 个参数 ，分别是 `default`,`string` 和 `number` ,有一些明确是用 `string` 或者是 `number`

string
- window.alert(obj)
- 模板字符串 `${obj}`
- test[obj] = 123

number

- 一元(+obj) 
- \- ,*,/, > < 关系运算符
- Math.pow / String.prototype.slice 内部方法

default
- 二元加(obj + obj2)
- ==  != 

**如果有 `[Symbol.toPrimitive]` 优先使用**
```js
let  obj = {
  value:10,
  [Symbol.toPrimitive](hint){
    console.log(hint)
    return 2
  },
  toString(){
    return this.value + 10;
  },
  valueOf(){
    return this.value + 20;
  }
}

let x0 = obj == 1;
x0 // hint default

let x =  obj + 1;
x // hint default

let x2 =  obj + ''
x2 // hint default

let x3 =  +obj
x3 // hint number
```

如果没有

```js
let  obj = {
  value:10,
  toString(){
    return this.value + 10;
  },
  valueOf(){
    return this.value + 20;
  }
}


// true
let x0 = obj == 30;

// 31
let x =  obj + 1;

// "30" 
let x2 =  obj + ''

// 30
let x3 =  +obj

//'20'
let x4 = `${obj}`
```
**除非特别是 string,否则使用 valueOf**

<iframe src="https://unpkg.com/javascript-playgrounds@1.2.5/public/index.html#data=%7B%22code%22%3A%22let%20%20obj%20%3D%20%7B%5Cn%20%20value%3A10%2C%5Cn%20%20toString()%7B%5Cn%20%20%20%20return%20this.value%20%2B%2010%3B%5Cn%20%20%7D%2C%5Cn%20%20valueOf()%7B%5Cn%20%20%20%20return%20this.value%20%2B%2020%3B%5Cn%20%20%7D%5Cn%7D%5Cn%5Cn%5Cn%2F%2F%20true%5Cnlet%20x0%20%3D%20obj%20%3D%3D%2030%3B%5Cnconsole.log(x0)%5Cn%5Cn%2F%2F%2031%5Cnlet%20x%20%3D%20%20obj%20%2B%201%3B%5Cnconsole.log(x)%5Cn%2F%2F%20%5C%2230%5C%22%20%5Cnlet%20x2%20%3D%20%20obj%20%2B%20''%5Cnconsole.log(x2)%5Cn%5Cn%2F%2F%2030%5Cnlet%20x3%20%3D%20%20%2Bobj%5Cnconsole.log(x3)%5Cn%5Cn%2F%2F'20'%5Cnlet%20x4%20%3D%20%60%24%7Bobj%7D%60%5Cnconsole.log(x4)%22%7D"
 height="800"
  width="100%"
  frameborder="1"
 ></iframe>

## + 相加规则

###  `[1,2] + {n:1}`
 ```js
   [1,2].valueOf = [1,2] //  非原始值
   [1,2].toString = "1,2" // 原始值
   ({n:1}).valueOf() = {n:1} //非原始值
   ({n:1}).toString() = "[object Object]" // 原始值
   "1,2[object Object]" // [!code hl]
 ``` 

<img src="@img/相加效果.png"/>

## 循环
### for 循环
使用 `label` 语法,可以退出外层 `for` 循环
```js
outer:for(let i =0;i<10;i++){
  inner:for(let j = 0;j< 10;j++){
    if(j == 5){
      break outer;
    }
    console.log(j) // [1,2,3,4,5]
  }
}
```
## Reflect
<blue>⭐调用对象的基本方法</blue>
什么是基本方法

<img src="@img/reflect.png" style='height:400px'/>

```js
let o = {}
o.a = 1
```
此时会触发会触发外层方法,外层方法触发 对象深处的 `[[set]]` 方法

使用 `Object.keys` 这种暴露出来的方法的时候，外层方法会做出判断,会把 `enumerable` 或者 `symbol` 属性进行拦截
```js
let obj = { a: 1, b: 2, c: 3 };

  Object.defineProperty(obj, 'd', {
    value: 4,
    enumerable: false
  })

  console.log("🚀", Object.keys(obj)); // [a,b,c]

  console.log("🚀 ", Reflect.ownKeys(obj));// [a,b,c,d]
```
但是使用 `Reflect` 直接操作的是 `基本方法`,不会遭到拦截

再举一个例子

```js
let obj = {
 a: 1, 
 b: 2, 
 get c() {
   return this.a + this.b;
 }
};
console.log("🚀", obj.c); // 3
```
由于外层方法把 `this` 已经确定,所以 `obj.c` 为 `3`  
但是使用 `Reflect`,可以改变 `this`指向
```js
let r = Reflect.get(obj, "c", { a: 2, b: 5 })
console.log(r) // 7
```
### 在 proxy 中的使用

使用 `target[key]` 读取的 this 是原始对象 `obj`,而不是代理对象，不会触发 `proxy` 的 get 方法
```js
  let obj = {
    a: 1,
    b: 2,
    get c() {
      console.log(this) // { obj }
      return this.a + this.b;
    }
  };

  let p = new Proxy(obj, {
    get(target, key) {
      // 使用这种方式读取的 obj.c 中的 this是原始对象
      return target[key]
    }
  })
```
使用 `reflect` 读取,第三个参数 可以更改 this 指向

```js
let obj = {
 a: 1, b: 2, get c() {
   console.log(this)
   return this.a + this.b;
 }
};

let p = new Proxy(obj, {
 get(target, key) {
   console.log(key) //c,a,b
   return Reflect.get(target, key, p); // [!code hl]
 }
})

p.c
```
但是直接传入proxy 返回值  `p` 不够灵活,使用 `receiver`

```js
 get(target, key,receiver) {
   console.log(key) //c,a,b
   return Reflect.get(target, key, receiver); // [!code hl]
 }
```

## ⭐for循环执行顺序

```js
for(let i = 0; i < 100; i++){}
```
编译器会这么执行
1. 创建变量 i，并赋值为 0
2. 只要 i 小于 100 就执行
3. 每次遍历结束后 +1

## [🔗falsy](https://developer.mozilla.org/zh-CN/docs/Glossary/Falsy)

假值（falsy，有时写为 falsey）是在 `Boolean` 上下文中认定为 `false` 的值。

**JavaScript 在需要用到布尔类型值的上下文中使用强制类型转换将值转换为布尔值，例如条件语句和循环语句。**

1. 0
2. false
3. undefined
4. null
5. NaN
6. ''

```js
if (undefined) {
  // 执行不到这里
}

if (0) {
  // 执行不到这里
}

if (NaN) {
  // 执行不到这里
}

if ("") {
  // 执行不到这里
}

// && 只有当 第一个参数是 true 时才会走到下一个变量处
console.log(false && "dog"); // false

console.log(0 && "dog"); // 0
```

## 创建对象

```js
Dog mydog = new Dog();
```
1. 创建一个空间并命名为 mydog
2. 分配堆对象 Dog
3. 把 Dog 的引用给 mydog