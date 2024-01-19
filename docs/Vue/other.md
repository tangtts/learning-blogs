# 其他

**收录 vue 中的小知识点**

## 动态数组 class

```txt
 :class="[
      currentTab == i - 1 && ['bg-red-200 text-blue-800'] //[!code ++]
  ]"
```

## setup 指令

```vue
import vWatermask from "./plugins/watermask";
<div v-watermask="a"></div>
```

## [🔥 自定义 ref](https://cn.vuejs.org/api/reactivity-advanced.html#customref)

> 创建一个自定义的 ref，显式声明对其依赖追踪和更新触发的控制方式。 :::tip ref 机制 在原生的 `ref` 中,当你使用 `ref` 值的时候,**会触发响应式的 `get` 方法,进行依赖收集**  
>  当你修改 `ref` 值的时候,会触发**响应式的 `set` 方法，进行依赖更新**。 :::

**所以自定义 `customRef` 也要 触发 `收集/更新` 的功能**

### 类型

```ts
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>
 type CustomRefFactory<T> = (
   track: () => void,
   trigger: () => void
 ) => {
   get: () => T
   set: (value: T) => void
 }
```

### 示例

```ts
import { customRef } from 'vue'

 export function useDebouncedRef(value, delay = 200) {
   let timeout
   return customRef((track, trigger) => {
     return {
       get() {
        // <!-- 依赖收集 -->
         track() //[!code ++]
         return value
       },
       set(newValue) {
         clearTimeout(timeout)
         timeout = setTimeout(() => {
           value = newValue
          // <!-- 触发依赖更新 -->
           trigger() //[!code ++]
         }, delay)
       }
     }
   })
 }
```

## 定义组件

1. 使用对象字面量

```ts
    const Host = {
      setup() {
        return () =>
          h(component, {
            ...props,
            ...eventListener,
          })
      },
    };
```

2. 使用 render

```ts
    const Host = {
        render() {
         return h(component, {
          ...props,
          ...eventListener,
         })
      },
    }
```

1. 使用 defineComponent 函数包裹 setup

```ts
 const Host = defineComponent({
   setup() {
     return () =>
        h(component, {
         ...props,
         ...eventListener,
       })
   },
 });
```

4. 使用 defineComponent 函数包裹 render

```ts
  const Host = defineComponent({
      render() {
        return h(component, {
          ...props,
          ...eventListener,
        })
      },
  })
```

都可以使用下面的方法创建组件

```ts
function mountInstance(
  component: any,
  props: Record<string, any> = {},
  eventListener: Record<string, any> = {}
): {
  unmountInstance: () => void
} {
  const Host = defineComponent({
    setup() {
      return () =>
        h(component, {
          ...props,
          ...eventListener,
        })
    },
  });
  const { unmount } = mount(Host)
  return { unmountInstance: unmount }
}

import {type ComponentPublicInstance,type Component} from "vue"

interface MountInstance {
  instance: ComponentPublicInstance
  unmount: () => void
}

function mount(component: Component): MountInstance {
  const app = createApp(component)
  const host = document.createElement('div')
  document.body.appendChild(host)

  return {
    instance: app.mount(host),
    unmount() {
      app.unmount()
      document.body.removeChild(host)
    },
  }
}
```

## [命令式组件](https://www.bilibili.com/video/BV1RN41187nW/?spm_id_from=333.999.0.0&vd_source=67f419a9787a4473012af248ace37479)

- 弹窗组件

  ### 使用

  ```ts
    showMsg('要显示的消息',(close)=>{
      console.log("确定")
      close() // 关闭弹窗
    })
  ```

  ### 定义

  showMsg.js

  在 messageBox 需要 msg props,同时 emit("click")事件

  ```js
  import messageBox from '../component/messageBox.vue'

    function showMsg(msg,callback){
      const div = document.createElement('div');
      const app = createApp(messageBox,{
        msg,
        onClick:()=>{
          callback(()=>{
            app.unmount(div) // 卸载组件,防止内存泄漏
            div.remove() // 删除dom
          }) // 关闭弹窗
        }
      })
      document.body.appendChild(div)
      app.mount(div)
    }
  ```

  ### 定义函数组件

  为了**高内聚/低耦合**, 可以进一步改写 `messageBox.vue` 为 js 文件,

  使用 `render` 方法渲染组件,使用 jsx 创建 vNode  
   **在 `render` 方法的形参中解构出 `$props` 和 `$emit` 属性**

  ```js
    const MessageBox = {
      props:{
        msg:{
          type:String,
          required:true
        },
      },
      render(ctx){
        const {$props,$emit} = ctx  //[!code hl]
        return <div class="modal">
            <div class="box">
              <div class="text">{$props.msg}</div> //[!code hl]
              <button onClick={$emit('onClick')}>确定</button>
            </div>
          </div>
      }
    }
  ```

  ### 完整代码

  [@styils/vue](https://styils.github.io/styils/)

  <<< ../../src/components/msg.tsx{tsx:line-numbers}
    
## [静态文件的动态访问](https://www.douyin.com/user/self?modal_id=7269754701720112444)

<img src="@img/动态访问普通写法.png"/>
<img src="@img/原始动态访问结果.png"/>

**原因是打包之后路径发生变化**
### 会发生 vite 自动转换路径的情况
1. css 中的静态路径
2. img 中的 src 静态路径 (非 v-bind)
3. 使用 `import()` 语句，打包之后会附带一个 js 文件
### 解决办法
1. 直接当做一个模块引用
   返回的是打包之后的路径 
  <img src="@img/动态访问办法1.png"/>
1. 使用 `import` 语句, 打包之后会附带一个js文件
  <img src="@img/动态访问办法2.png"/>
1. 使用 `URL`
  > 其中 `import.meta.url` 代表了当前模块  
  > `new URL('./xxx.jpg', import.meta.url)` 代表当前模块的相对路径

  <img src="@img/动态访问办法3.png"/>
     
## 在 `.vue`文件中使用 `tsx`
`lang` 直接定义为 `tsx`
```vue
 <template>
   <div>
     <Fn :a="1" />
   </div>
 </template>
 <script lang="tsx" setup>
   const Fn = ({ a }) => {
     return <div>{a}afdfaf</div>;
   };
 </script>
```
## css 文件

### JS 中使用 `SCSS` 变量

<blue> 必须定义为 `module` 格式</blue>

> index.module.scss
```scss
$title:red;

:export {
  title:$title
}
```
使用
```vue
<script setup>
export default {
  import config from "./index.module.scss"
  // {title: 'red'}
  console.log("🚀 ~ file: App.vue:10 ~ config:", config);
}
</script>
```
### SCSS 使用 JS 变量

```js
const currentBgColor = ref('#333333')
const currentTextColor = ref('#FFFFFF')
```

```ts
const onBtnClick = (bgColor: string, textColor: string) => {
  currentBgColor.value = bgColor
  currentTextColor.value = textColor
}
```
```scss
  .example {
    --textColor: v-bind(currentTextColor);
    --bgColor: v-bind(currentBgColor);
    color: var(--textColor);
    background: var(--bgColor);
  }
```

## 注册
### 全局注册
> x-ui.ts
```ts
const components = [
  Button,
  Icon
]

const install = (app: App) =>{
  comonents.forEach(component=>{
    app.component(component.name,component)
  })
}

export default {
  install
}
```
> main.ts

```ts
import Xui from "./x-ui"
app.use(Xui)
```
### 局部注册
> vue-shim.d.ts
```ts
declare module '*.vue' {
  import { DefineComponent,App } from 'vue';
  const component: ReturnType<typeof DefineComponent> & {
    install(app: App): void;
  };
  
  export default component;
}
```

## --host

```js
"dev": "vite --host=0.0.0.0",
```
你可以将 Vite 服务器设置为监听所有可用的网络接口，而不仅仅是默认的本地回环地址（127.0.0.1）