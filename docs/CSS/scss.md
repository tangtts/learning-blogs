# scss
:::tip
其中 $animal类似于变量var,使用变量#${xx},主要是为了区别普通值和变量值   
如果只有变量，直接使用${xx}

scss 尽可能的简洁
:::

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