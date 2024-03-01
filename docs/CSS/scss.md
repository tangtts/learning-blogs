# scss


## @import / @use
### @import
#### 运行时
>只有在运行时才去导入文件
```scss
 @import url("xxx.scss")
```
它会原封不动的进行导入,不论这个文件是否存在
#### 编译时
> 会把导入的文件编译到当前文件  
 
> common.scss
```scss
  .a{
    font-size:40px
  }
  $color:red
```
>index.scss
```scss
@import "./common.scss";
.b {
    color: $color
}
```
会被编译为
```css
  .a{
      font-size:40px
   }

  .b {
      color: red
   }
```
**<blue>相当于直接放到顶部位置</blue>**

##### ❔问题
1. 容易混淆, css 也使用 import，但是他是运行时，但是 scss 是编译时
2. 命名冲突,如果多个文件使用了同一变量,后者会覆盖前者
3. 没有私有变量

### @use
自带命名空间,不论嵌套多深,都是 以 <blue>⭐最后文件名</blue> 开头
```scss
@use "common.scss";
.b{
  color:common.$color
}
```
修改命名空间,可以使用 `*`
```scss
@use "common.scss" as a;
.b{
  color:a.$color
}
```
内部变量,外部无法使用，加上 `_`
```scss
$_n:10
```
## 变量
### $
**🐶SCSS中变量名使用中划线或下划线都是指向同一变量的**

1. $border-color 和$border_color 是同一个变量
2. 后定义的会被忽略,但是会执行赋值

```scss
$border-color:#aaa; //声明变量
$border_color:#ccc;

// .a {
//   color: #ccc;
//  }
// 不论是 $border-color 还是 $border_color 都是一样的
  .a{
      color:$border_color;
  }
```

```scss
$bg-image-center:no-repeat center/cover;
.img {
  background:url("xxxx") $bg-image-center
}
```

### [🔗#{}](https://sass-lang.com/documentation/interpolation/)

:::tip
其中 $animal 类似于变量 `var`, 使用变量 `#${xx}`,主要是为了区别普通值和变量值

**如果只有变量，直接使用 `${xx}`,如果有字符串，使用 `${xx}` 会有歧义**
:::

<blue> ⭐将 SassScript 变量嵌入到字符串或选择器中</blue>

作用是引用表达式，这个时候不能使用 ${name}
```scss
@mixin corner-icon($name, $top-or-bottom, $left-or-right) {
  .icon-#{$name} {
    background-image: url("/icons/#{$name}.svg");
    position: absolute;
    #{$top-or-bottom}: 0;
    #{$left-or-right}: 0;
  }
}

@include corner-icon("mail", top, left);
```
生成结果
```css
.icon-mail {
  background-image: url("/icons/mail.svg");
  position: absolute;
  top: 0;
  left: 0;
}
```

也可以写入属性中

```scss
$positionType:(
	top,
	bottom,
	left,
	right
);

@each $position in $positionType{
	.margin-#{$position}-auto {
		margin-#{$position}: auto; // [!code hl]
	}
};
```

## 嵌套

scss识别一个属性以分号结尾时则判断为一个属性  

**🐕以大括号结尾时则判断为一个嵌套属性** 

规则是将外部的属性以及内部的属性通过中划线连接起来形成一个新的属性
1. 属性值嵌套
```scss
li {
    border:1px solid #aaa {
        left:0;
        right:0;
    }
}
```
结果
```css
  li {
    border: 1px solid #aaa;
    border-left: 0;
    border-right: 0;
}
```
2. 属性嵌套
```scss
.info-page {
  margin: auto {
    bottom: 10px;
    top: 2px;
  }
}
```
结果
```css
.info-page {
  margin: auto;
  margin-bottom: 10px;
  margin-top: 2px;
}
```
3. 类名嵌套
  ```scss
  $prefix: fade;
  .#{$prefix}{
     &-enter-active,
     &-leave-active {
        transition: opacity 1.5s;
      }
   }

  .#{$prefix}{
      &-enter-from,
      &-leave-to {
        opacity: 0;
      }
  }
  ```
 结果

 ```css
.fade-enter-active, .fade-leave-active {
   transition: opacity 1.5s;
}

.fade-enter-from, .fade-leave-to {
   opacity: 0;
}
 ```

## [🔗if](https://sass-lang.com/documentation/style-rules/declarations/#hidden-declarations)
```scss
$rounded-corners: false;

.button {
  border: 1px solid black;
  border-radius: if($rounded-corners, 5px, null);
}
```
```css
.button {
  border: 1px solid black;
}
```
## @if
@if 没有括号,if 与 `@if` 不同
```scss
$type: monster;
p {
  @if $type == ocean {
    color: blue;
  } @else if $type == matador {
    color: red;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}
```
配合 `or` 使用

```scss
$alignType: (start, center, end, baseline);

@each $type in $alignType {
  .items-#{$type} {
    @if $type == end or $type == start {
      align-items: flex-#{$type};
    } @else {
      align-items: $type;
    }
  }
}
```


## @each
```scss
@each $animal in puma, sea-slug, egret, salamander {
	.#{$animal}-icon {
		background-image: url('/images/#{$animal}.png');
	}
}

/* 解构  */
@each $animal, $color, $cursor in (puma, black, default),
                                  (sea-slug, blue, pointer),
                                  (egret, white, move) {
  .#{$animal}-icon {
    background-image: url('/images/#{$animal}.png');
    border: 2px solid $color;
    cursor: $cursor;
  }
}
```

## @while
```scss
$i: 6;
@while $i > 0 {
  .item-#{$i} { 
    width: 2em * $i;
   }

  $i: $i - 2;
}
```

## @mixin

:::tip
混合指令（Mixin）用于定义可重复使用的样式，**避免了使用无语义的 class**，这也是和函数不同的地方
:::

```scss
@mixin clearfix {
  display: inline-block;
  &:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}

/*使用 @include*/
.page-title {
  @include clearfix;
  padding: 4px;
  margin-top: 10px;
}
```

### 传参
```scss
@mixin sexy-border($color, $width:1in) {
  border: {
    color: $color;
    width: $width;
    style: dashed;
  }
}
p { @include sexy-border(blue, 1in); }
```
#### 使用默认参数

```scss
p { 
  @include sexy-border($color: blue);
}

h1 { 
  @include sexy-border($color: blue, $width: 2in); 
}
```
#### 多参数扩展运算符
```scss
@mixin colors($text, $background, $border) {
  color: $text;
  background-color: $background;
  border-color: $border;
}

$values: #ff0000, #00ff00, #0000ff;
.primary {
  @include colors($values...);
}
```
#### 配合@content
```scss
$color: white;
@mixin colors($color: blue) {
  background-color: $color;
  @content;
  border-color: $color;
}

.colors {
 @include colors { 
  color: $color;
 }
  // 也可以  // [!code warning]
  @include colors(yellow) { // [!code warning]
    color: $color; // [!code warning]
   } // [!code warning]
}
```
不传递参数为

```scss
$color: white;
@mixin colors($color: blue) {
  background-color: $color;
  @content;
  border-color: $color;
}

.colors {
 @include colors { 
  color: $color;
 }
}

// 编译结果为
.colors {
  background-color: blue;
  color: white;
  border-color: blue;
}
```


传递参数编译为 css
```scss
/*编译为  */
$color: white;
@mixin colors($color: blue) {
  background-color: $color;
  @content;
  border-color: $color;
}


.colors {
  @include colors(yellow) { 
    color: $color; // [!code ++]
    border-radius:10px;
  } 
}

// 编译为
.colors {
  background-color: yellow; // [!code ++]
  color: white;
  border-radius: 10px;
  border-color: yellow; // [!code ++]
}
```
## @function 
动态的返回值
```scss
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar { width: grid-width(5); }
```

```scss
$background-color:(
	 jerry: #0989cb,
	 beth: #000,
	 matt: #02bba7
);
	
@function colors ($color){
  @if not map-has-key($background-color,$color){
     @warn "No color found for`#{$color}` in map "
   };
	@return map-get($map:$background-color , $key:$color)
  // 简写方式
  @return map-get($background-color,$color) // [!code ++]
};

.jerryColor {
  color: colors(jerry)
}
```

## @for 

**through是[1-3]，to 是 [1-3)**

```scss
@for $i from 1 through 3 {
 .item-#{$i} {
   width: 2em * $i; 
  }
}
```
## map

在 scss 中,map 可以使用 `()` 来表示,同时数组也可以使用 `()` 来表示

**map 使用的是 k:v 结构，数组使用的 v**

`map-get` 表示从 map 中取出某一项    
`type-of` 判断类型  
`nth` 表示从 数组中取出某一项  
```scss
$map:(
 phone:(red,green),
 pad:black
);

@mixin responseTo($breakname){
  $bg:map-get($map,$breakname);
  
   @if type-of($bg) == 'list' {
    $background:nth($bg,1);
    $fontColor:nth($bg,2);
    .color{
      background:$background;
      color:$fontColor;
    }
   }
   @else{
    .color{
      background:$bg;
      color:$bg;
    }
  }
};

.c{
 @include responseTo(phone)
}
```
## percentage

```scss
@function row($col){
  @return percentage( 1 / $col);
}

@for $i from 1 through 6 {
  .col-#{$i}{
    width:row($i);
  }
}
```
```css
.col-1 {
  width: 100%;
}

.col-2 {
  width: 50%;
}

.col-3 {
  width: 33.3333333333%;
}

.col-4 {
  width: 25%;
}

.col-5 {
  width: 20%;
}

.col-6 {
  width: 16.6666666667%;
}
```

## type-of
### number
```scss
type-of(0) // number
type-of(1px) // number
```

### string
```scss
type-of(a)   // string
type-of("a") // string
```

### bool
```scss
type-of(true) // bool
type-of(0<1) // bool
```

### color
```scss
type-of(rgba(1,2,3,.3))       // color
type-of(rgb(1,2,3))           // color
type-of(#fff)                 // color
type-of(red)                  // color
```

### list(sass.list=js.array)
```scss
// 需要加括号
type-of((1px,2px,3px))        // list
type-of((1px 2px 3px rgba(0,0,0,.3))) // list
```

### map(sass.map=js.json)
```scss
type-of((a:1px,b:2px))    // map
```

### math

:::tip
如果 `key` 值为颜色属性的话,需要加上 `引号`
:::
```scss
@use "sass:math";

$colors:(
 success: varibleColors.$successColor,
 warning: varibleColors.$warningColor,
 "red":red
);
$numbers: 50 100 200 300 400 500 600 700 800 900;


@each $colorType,$color in $colors {
	@each $number in $numbers {
		.text-#{$colorType}-#{$number}{
			color:darken($color: $color, $amount: math.div($number , 100)) //[!code hl]
		}
	} 
}
```