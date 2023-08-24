# scss
:::tip
其中 $animal类似于变量var,使用变量#${xx},主要是为了区别普通值和变量值   
如果只有变量，直接使用${xx}

scss 尽可能的简洁
:::

## 变量
### $
SCSS中变量名使用中划线或下划线都是指向同一变量的

1. $border-color 和$border_color 是同一个变量
2. 后定义的会被忽略,但是会执行赋值

```scss
  $border-color:#aaa; //声明变量
  $border_color:#ccc;

   //  .a {
   //    color: #ccc;
  //    }
  // 不论是 $border-color 还是 $border_color 都是一样的
  .a{
      color:$border_color;
  }
 
```
### [#{}](https://sass-lang.com/documentation/interpolation/)

**将 SassScript 表达式的结果嵌入到 CSS 块中**

作用是引用表达式   

这个时候不能使用 ${name}
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

:::tip
插值对于将值 ***注入字符串*** 非常有用，但除此之外，它在SassScript表达式中很少需要。  
您绝对不需要仅在属性值中使用变量。不用写作 color: #{$accent}，您可以写作  color: $accent！
:::

## 嵌套

scss识别一个属性以分号结尾时则判断为一个属性  
以大括号结尾时则判断为一个嵌套属性  
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

## [隐藏变量](https://sass-lang.com/documentation/style-rules/declarations/#hidden-declarations)
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
  .item-#{$i} { width: 2em * $i; }
  $i: $i - 2;
}
```

## @mixin

:::tip
混合指令（Mixin）用于定义可重复使用的样式，避免了使用无语意的 class，这也是和函数不同的地方
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
#### 使用关键词参数

:::info
虽然不够简明，但是阅读起来会更方便。关键词参数给函数提供了更灵活的接口，以及容易调用的参数。关键词参数可以打乱顺序使用，如果使用默认值也可以省缺
:::

```scss
p { @include sexy-border($color: blue); }
h1 { @include sexy-border($color: blue, $width: 2in); }
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
  @include colors { color: $color; }
  // 也可以
  @include colors(yellow) { color: $color; } // [!code ++]
}

/*编译为  */
.colors {
  background-color: blue;
  color: white;
  border-color: blue;
}

.colors {
  background-color: yellow; // [!code ++]
  color: white;
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
    @return map-get($background-color,$color) 
};

.jerryColor {
  color: colors(jerry)
}
```
## @if
@if 没有括号
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
## @for 
through是[1-3]，to 是 [1-3)
```scss
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
```