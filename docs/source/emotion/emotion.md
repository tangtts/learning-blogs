# @emotion/css
由于css 没有模块,会造成 css 污染问题, 为了解决css的污染问题

1. emotion是一个用JS编写CSS样式的库
2. 通过生成唯一的CSS选择器来达到CSS局部作用域的效果


```html
   <div id="child">abcd</div>
```

```js
    function insertStyles(serialized) {
      const className = "css" + "-" + serialized.name;
      const rule = "." + className + "{" + serialized.styles + "}";
      const tag = document.createElement("style");
      // 说明是emotion
      tag.setAttribute("data-emotion", "css");
      tag.appendChild(document.createTextNode(rule));
      document.head.appendChild(tag);
    }

    // 生成唯一的css选择器
    function hashString(keys) {
      let val = 10000000;
      for (let i = 0; i < keys.length; i++) {
        val += keys.charCodeAt(i);
      }
      return val.toString(16).slice(0, 6);
    }


    function serializeStyles(args) {
      var styles = '';
      var strings = args[0];
      // 说明是一个对象
      if (strings.raw === undefined) {
        styles += handleInterpolation(strings);
      } else {
        // ["\n  color: red\n  ", raw:["\n  color: red\n  "]]
        styles += strings[0];
      }

      var name = hashString(styles);
      return { name, styles }
    }

    function handleInterpolation(obj) {
      var string = '';
      for (var key in obj) {
        var value = obj[key];
        string += key + ":" + value + ";";
      }
      return string;
    }

    function css(...args) {
      const serialized = serializeStyles(args);
      insertStyles(serialized);
      return "css" + "-" + serialized.name;
    }

    // const className = css({
    //   color: "yellow",
    // });

    const className = css`
      color: red
    `;

    child.classList.add(className);
```

 