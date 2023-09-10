# canvas
**主要是 api 的使用**

```js
var canvas = document.getElementById('canvas');;
const cxt = canvas.getContext('2d');
```
## 线条
### 1.线条颜色
```js
  cxt.strokeStyle = '#000';
```
### 2. 线条宽度
```js
  cxt.lineWidth = 4;
```
## 图形
**图形是基于线条的**, 需要先设置线条颜色, 宽度, 然后才能绘制图形
**最后使用 `cxt.stroke()`绘制**
### 1.圆形
```js
cxt.arc(150, 150, 100, 0, 2 * Math.PI);
```
| 参数1     | 参数2     | 参数3 | 参数4    | 参数5    |
| --------- | --------- | ----- | -------- | -------- |
| 圆心x坐标 | 圆心y坐标 | 半径  | 起始角度 | 终止角度 |
### 2. arcTo
```js
cxt.moveTo(20,20);           // 创建开始点
cxt.lineTo(100,20);          // 创建水平线
cxt.arcTo(150,20,150,70,50); // 创建弧
cxt.lineTo(150,120);         // 创建垂直线
cxt.stroke();
```
<img src="img/arcTo.webp"/>





## 文字
### 1.大小及字体
```js
  cxt.font = "20px serif";
```
### 2.颜色
```js
  cxt.fillStyle = 'red';
```
### 3.填充文字
```js
  cxt.fillText("Hello World", 107, 150);
```
| 参数1 | 参数2             | 参数3             |
| ----- | ----------------- | ----------------- |
| 文字  | 文字绘制的x轴起点 | 文字绘制的y轴起点 |

##

```html
<!DOCTYPE html>
<head>
<body>
  <canvas id="canvas" width="300" height="300"></canvas>
  <script>
    var can = document.getElementById("canvas");
    const cxt = can.getContext("2d");
    cxt.moveTo(20, 20);           // 创建开始点
    cxt.lineTo(100, 20);          // 创建水平线
    cxt.arcTo(150, 20, 150, 70, 50); // 创建弧
    cxt.lineTo(150, 120);         // 创建垂直线
    cxt.stroke();
    cxt.beginPath()
    cxt.strokeStyle = '#000';
    cxt.arc(150, 150, 100, 0, 2 * Math.PI);
    cxt.stroke();
    cxt.beginPath();
    cxt.lineWidth = 4;
    cxt.strokeStyle = '#ffa500';
    cxt.fillStyle = 'red';
    cxt.font = "20px serif";
    cxt.fillText("Hello World", 107, 150);
    cxt.arc(150, 150, 100, Math.PI / 4, 2 * Math.PI);
    cxt.stroke();
  </script>
</body>
</html>
```