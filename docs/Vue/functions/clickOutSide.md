# clickOutside
是否点击了元素外部  
主要是利用了 `e.composedPath().includes(el)` 判断点击位置
## 效果
<ClientOnly>
  <div class="outer" v-click-outside="close">
    <p> isOutSide:{{ position.isOutSide }}</p>
    <p> x:{{ position.x }}</p>
    <p> y:{{ position.y }}</p>
  </div>

<script lang="ts" setup>
  import { onMounted, ref, computed, reactive, watch } from "vue";
  import { ObjectDirective, FunctionDirective } from "vue"
  const position = reactive({
    isOutSide: false,
    x: 0,
    y: 0
  })
  const vClickOutside: FunctionDirective<HTMLElement, Function> = function (el, bindings) {
      window.addEventListener('click', e => {
        if (e.composedPath().includes(el)) {
          position.isOutSide = true;
          bindings.value(e)
        } else {
          position.isOutSide = false;
        }
        position.x = e.x;
        position.y = e.y;
      })
    }
    const close = (e: MouseEvent) => {
      console.log('执行回调函数', e)
    }
</script>

<style lang="scss" scoped>
  .outer {
    @apply flex justify-evenly items-center flex-col w-[200px] h-[200px] bg-green-500 text-white font-bold text-xl rounded-md mx-auto;
  }
</style>
</ClientOnly>

## 源码
```ts
export type UseClickOutsideTarget = Element | Ref<Element | undefined | null> | (() => Element)

function useOutSideClick(target: UseClickOutsideTarget, listener: EventListener) {
  const el = typeof target === 'function' ? target() : unref(target);

  const handler = (e: MouseEvent) => {

    if (el && !el.contains(e.target as Node)) {
      listener(e)
    }
  }
  document.addEventListener("click", handler)
}

onMounted(() => {
  useOutSideClick(a, (e) => {
    console.log(e)
  })
})
```