# 关于 react
## 绑定事件

需要传递一个函数引用,而不是像原生方法一样传递一个字符串


:::tip
在 React 中，将函数引用作为点击事件的处理程序传递是为了确保在渲染期间不会立即执行该函数。

当你将一个函数引用作为点击事件的处理程序传递给 onClick 属性时，React 会将其保存在内部并在相应的事件发生时调用它。这样可以确保事件处理程序只在需要时才被调用，而不是在渲染期间就被立即执行。
:::

```jsx
  <Button onClick={()=>setTheme('dark')}>todoTheme</Button>
```
原生方法,绑定的是一个字符串,所以需要传递一个函数执行结果
```html
<button onclick="aa()">aaa</button>
<script>
  function aa(){
    console.log(123);
  }
</script>
```