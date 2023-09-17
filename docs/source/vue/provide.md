# provide/inject


**初始化的时候,如果父组件有 provide,就在父组件的 provide 基础上加上自己的 provides**  

**等到第二次的时候,已经不一样了,使用自己的 provides,而不是父组件的**

```ts
import { currentInstance } from "./component";

export function provide(key, value) {
    if (!currentInstance) return;
    // 父亲的 + 新的自己的 = 上级所有的provides
    const prarentProvides = currentInstance.parent.provides
    let provides = currentInstance.provides; //每个人都应该有自己的provides

    // 如果自己和父亲共享了一个 就根据这个provides 创建一个新的
     if (prarentProvides === provides) {
        provides = currentInstance.provides = Object.create(provides) //[!code hl]
     }
    provides[key] = value
}
export function inject(key, defaultVal) {
    if (!currentInstance) return;
    const provides = currentInstance.parent.provides
    if (provides && (key in provides)) {
        return provides[key]
    } else {
        return defaultVal
    }
}
```
本质是这样的
```js
let parent = {
  provides: {
    name: "zs",
  },
};

let currentInstance = {
  provides: parent.provides,
  parent,
};

let childCurrentInstance = {
  provides: currentInstance.provides,
  parent:currentInstance.parent,
};

// 父组件创建
function provide(key, value) {
  const prarentProvides = currentInstance.parent && currentInstance.parent.provides;
  let provides = currentInstance.provides;

// 如果自己和父亲共享了一个 就根据这个provides 创建一个新的
  if (prarentProvides === provides) {
    provides = currentInstance.provides = Object.create(provides);
  }

  provides[key] = value;
}
provide("aaa", 10);

// 子组件接收
function inject(key, defaultVal) {
  const provides = childCurrentInstance.parent.provides
  if (provides && (key in provides)) {
      return provides[key]
  } else {
      return defaultVal
  }
}

let x = inject('name')
console.log(x)
```