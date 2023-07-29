# windowAPI

主要是记录 windowAPI 的使用

## defer / async

defer 和 async 都是异步加载

defer 具有推迟的意思,就是说当 Dom 树加载完毕之后执行，可以获取真实的 dom
async 是只自己加载完毕，就立即执行，会阻塞 dom 的渲染

<img src="./../assets/img/test.3ca4a381.png"/>

## Promise

## all

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

## race

```vue
<script setup>
import { ref } from "vue";
let race = ref("");

Promise.race([]).then(res => {
  race.value = res;
});
</script>
```

<p>Promise.race([])的结果是:{{race}}</p>

## [URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)

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
```js
   var searchParams = new URLSearchParams("key1=value1&key2=value2");
   // key1,value1
   // key2,value2
   for (var pair of searchParams.entries()) {
     console.log(pair[0] + ", " + pair[1]);
   }

  var url = new URL('https://example.com?foo=1&bar=2');
  // url.search = foo=1&bar=2
  var params = new URLSearchParams(url.search);
  console.log(params.toString())
```

### 方法

#### append

```js
let url = new URL('https://example.com?foo=1&bar=2');
let params = new URLSearchParams(url.search.slice(1));

//添加第二个 foo 搜索参数。
params.append('foo', 4);
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
let url = new URL('https://example.com?foo=1&bar=2');
let params = new URLSearchParams(url.search.slice(1));

params.has('bar') === true; //true

```
#### keys
```js
// 建立一个测试用 URLSearchParams 对象
var searchParams = new URLSearchParams("key1=value1&key2=value2");

// 输出键值对
for(var key of searchParams.keys()) {
  console.log(key);
}
```
#### values
```js
// 创建一个测试用 URLSearchParams 对象
var searchParams = new URLSearchParams("key1=value1&key2=value2");

// 输出值
for(var value of searchParams.values()) {
  console.log(value);
}
```
### [URL.createObjectURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL_static)

```js
objectURL = URL.createObjectURL(object);
```
:::info
object
用于创建 URL 的 File 对象、Blob 对象或者 MediaSource 对象。
返回值
一个DOMString包含了一个对象 URL，该 URL 可用于指定源 object的内容。
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
}
```
### [FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)
:::info
FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。  

----
其中 File 对象可以是来自用户在一个\<input>元素上选择文件后返回的FileList对象，也可以来自拖放操作生成的 DataTransfer对象
:::


#### 方法
##### FileReader.readAsDataURL()
开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个 **data: URL** 格式的 **Base64 字符串**以表示所读取文件的内容。

##### FileReader.readAsText()
开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个字符串以表示所读取的文件内容。

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
### JSON.stringify
```js
console.log(JSON.stringify({ x: 5, y: 6 }));
// Expected output: "{"x":5,"y":6}"

console.log(JSON.stringify([new Number(3), new String('false'), new Boolean(false)]));
// Expected output: "[3,"false",false]"

console.log(JSON.stringify({ x: [10, undefined, function(){}, Symbol('')] }));
// Expected output: "{"x":[10,null,null,null]}"

console.log(JSON.stringify(new Date(2006, 0, 2, 15, 4, 5)));
// Expected output: ""2006-01-02T15:04:05.000Z""
```
#### 描述
`JSON.stringify()` 将值转换为相应的 JSON 格式：
- 转换值如果有 toJSON() 方法，使用其返回值
- 布尔值、数字、字符串的包装对象在序列化过程中会自动转换成对应的原始值
- 函数、undefined和Symbol 单独转化返回 `undefined`,如果出现在 **数组** 中，转化为 null
- 循环引用会报错
- Date类型调用 `toString`,转化为字符串
- NaN、infinite 和 null 转化 为 null

```js
JSON.stringify([new Number(1), new String("false"), new Boolean(false)]);
// '[1,"false",false]'

JSON.stringify({x: undefined, y: Object, z: Symbol("")});
// '{}'

JSON.stringify([undefined, Object, Symbol("")]);
// '[null,null,null]'

JSON.stringify({[Symbol("foo")]: "foo"});
// '{}'

var obj = {
  foo: 'foo',
  toJSON: function () {
    return 'bar';
  }
};
JSON.stringify(obj);      // '"bar"'
JSON.stringify({x: obj}); // '{"x":"bar"}'

```

### Json.parse
```js
JSON.parse('123') // 可以
JSON.parse("abcd132") // 失败,没有引号  // [!code error]
JSON.parse('"abcd132"') //[!code ++]  
// 可以，因为 abcd132 必须限定为一个字符串
var str = '{"name":"小明","age":18}'
// 不能是 
var str = "{'name':'小明', 'age':18}"

// 不能用逗号结尾
JSON.parse("[1, 2, 3, 4, ]");
JSON.parse('{"foo" : 1, }');
```

