# 提示消息-函数式

**可以提示消息**

## 效果

```vue
<el-button type="primary" @click="Snackbar({
      content:s++,
      onclose:()=>{
        console.log('abcd')
      }
})">点击</el-button>

<script setup>
  let s = 0
  import Snackbar from "../../../src/components/Snackbar/Snackbar.tsx";
</script>
```

<ClientOnly>
<el-button type="primary" @click="Snackbar({
      content:'',
      onclose:()=>{
        console.log('abcd')
      }
})">点击</el-button>

<script setup>
  import Snackbar from "../../../src/components/Snackbar/Snackbar.tsx";
</script>
</ClientOnly>

## 思路

组件很简单,使用函数`Snackbar`,接收用户传递的参数,然后渲染组件

### 重点-使用函数组件

1. 创建一个函数组件
   ```ts
    const TransitionGroupHost: Component = {
        setup(){
          return ()=>{
            const snackbarList = [];
             return (
              <Teleport to={isVitepress() ? '.VPNav':  'body' }>
                <TransitionGroup>
                  {snackbarList}
                </TransitionGroup>
              </Teleport>
             )
            }
        }
    }
   ```
   `setup` 如果返回的是一个函数,则返回值会当做一个组件  
   如果返回的是一个对象,返回值会被当做属性
2. 渲染组件  
    当生成组件 `TransitionGroupHost`之后,就应该是渲染组件了  
    使用 `mountInstance(TransitionGroupHost)`

    ```ts
      const mountInstance = (component: Component,props:object = {})=>{
        const app = createApp(h(component,{...props})) // 应用实例
        const host = document.createElement('div')
         app.mount(host) // 挂载应用
        document.body.appendChild(host)
      }
    ```

## 源码
```ts
import { mountInstance } from "utils/components"
import { reactive, Teleport, Transition, TransitionGroup } from "vue"
import "./index.scss";
import { isVitepress } from "@/utils/elements";

type SnackbarOptions = {
  show?: boolean,
  content: string | number,
  onclose?: () => void
}
type UniqSnackbarOptions = {
  id: number
  reactiveSnackOptions: Required<SnackbarOptions>
}


let uniqSnackbarOptions: Array<UniqSnackbarOptions> = reactive<UniqSnackbarOptions[]>([])

const removeUniqOption = (element: Element) => {
  const id = element.getAttribute('data-id')
  const option = uniqSnackbarOptions.find((option) => option.id === Number(id))
  if (!option) return;
  option.reactiveSnackOptions.onclose?.()
}
let isMount = false
let sid = 0
const TransitionGroupHost: Component = {
  setup() {
    return () => {
      const snackbarList = uniqSnackbarOptions.map(({ id, reactiveSnackOptions }) => {
        const style = {
          marginTop: '15px',
        } as any;

        setTimeout(() => {
          reactiveSnackOptions.show = false
        }, 2000)

        return (
          <Transition name="fade" key={id}
            onAfterLeave={removeUniqOption}>
            {
              reactiveSnackOptions.show ? <div key={id} data-id={id} style={style} class="w-2/5 py-3 mx-auto bg-blue-500 text-white text-center">
                {id}
              </div> : <div></div>
            }
          </Transition>
        )
      })
      return (
        <Teleport to={isVitepress() ? '.VPNav':  'body' }>
          <TransitionGroup>
            {snackbarList}
          </TransitionGroup>
        </Teleport>
      )
    }
  }
}

export default function Snackbar(options: SnackbarOptions) {

  let reactiveSnackOptions = reactive<UniqSnackbarOptions['reactiveSnackOptions']>({
    show: false,
    onclose: () => { },
    ...options
  });

  reactiveSnackOptions.show = true;

  if (!isMount) {
    isMount = true
    mountInstance(TransitionGroupHost)
  }
  const uniqSnackbarOptionItem: UniqSnackbarOptions = {
    id: sid++,
    reactiveSnackOptions,
  }

  uniqSnackbarOptions.push(uniqSnackbarOptionItem)
}

```    
