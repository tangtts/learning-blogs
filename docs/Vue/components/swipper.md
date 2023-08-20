# swipper
**轮播组件**

## 效果

<swipper/>

<script setup>
  import swipper from '../../../src/components/swipper.vue'
</script>

内部容器宽度小于外部容器宽度会发生滚动

通过控制内部容器的 `transform` 来控制滚动距离

当滚动到最右边时,需要使用特殊方式处理，才能进行无缝滚动

:::tip
核心在于 `fixPosition` 中对于位置的修正,当 **`滚动到最后一个item`** 的时候,由于设置了第一个 item 滚动到最后 `itemRefs[0]!.style.transform = translateX(${items.value * size.value}px);`,所以容器滚动到第二个元素身上即可
:::

:::info
[**`requestAnimationFrame`**](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame) 在下次重绘之前调用指定的回调函数更新动画  

requestAnimationFrame() 是一次性的。  

在浏览器下次重绘之前继续更新下一帧动画,那么回调函数自身必须再次调用 requestAnimationFrame()  
意思是还可以再执行一次渲染动画
:::
## 源码

```vue:line-numbers{81-84}
<template>
  <div class="w-[200px] h-40 overflow-hidden mx-auto relative">
    <div class="h-full 
        flex 
        flex-nowrap 
        duration-300 
        transition-transform" 
      ref="track" 
      :style="{
        width: trackSize + 'px',
        transform: `translateX(${translate}px)`,
        transitionDuration: lockDuration ? `0ms` : `${300}ms`
      }">
        <div :ref="(el) => setItemRefs(el)" 
          class="w-full 
          h-full 
          bg-blue-400 
          text-white 
          flex 
          items-center 
          justify-center 
          text-2xl" v-for="(item, index) in items" :key="index">
          {{ index }}
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { assetsHTML } from "../utils/elements"
import { onMounted, ref, computed, watch } from "vue";
const items = ref(3);
const track = ref<HTMLElement | null>(null);
const translate = ref(0)
const index = ref(0)
const itemRefs = Array<any>();
const size = ref(0)
const lockDuration = ref(false);

function nextTickFrame(fn: FrameRequestCallback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn)
  })
}

const trackSize = computed(() => {
  return items.value * size.value;
})

const autoplay = true;
let timer: number | null = (null);
function stopAutoplay() {
  clearInterval(timer as number);
}

// 控制index不要越界
function clampIndex(index: number) {
  if (index < 0) {
    return items.value + index
  }

  if (index >= items.value) {
    return index - items.value
  }

  return index
}

const fixPosition = (fn: () => void) => {
  const overLeft = translate.value >= size.value;
  // 父元素滚动到最后一个位置
  const overRight = translate.value <= -trackSize.value; //[!code warning]

  const leftTranslate = 0
  // 去除两个最后的位置，-400
  const rightTranslate = -(trackSize.value - size.value)

  lockDuration.value = true
  // 检测是否有越界情况 越界修正

  if (overRight || overLeft) {
    lockDuration.value = true
    translate.value = overRight ? leftTranslate : rightTranslate
  }

  nextTickFrame(() => {
    lockDuration.value = false
    fn()
  })
}


function next() {
  const currentIndex = index.value
  index.value = clampIndex(currentIndex + 1)

  fixPosition(() => {
    // 已经到了最后一位
    if (currentIndex === items.value - 1) {
      itemRefs[0]!.style.transform = `translateX(${items.value * size.value}px)`;
      translate.value = items.value * -size.value;
    } else {
      translate.value = index.value * -size.value
    }
  })
}



const startAutoplay = () => {
  if (!autoplay || items.value <= 1) {
    return
  }

  let swipItems = [...itemRefs]
  if (swipItems.length !== 0) {
    for (let item of swipItems) {
      (item as HTMLElement).style.transform = `translateX(0px)`
    }
  }

  stopAutoplay()

  timer = window.setTimeout(() => {
    next()
    startAutoplay()
  }, 1000)
}

const setItemRefs = (el: any) => {
  if (el) {
    itemRefs.push(el);
  }
}
onMounted(() => {
  size.value = 200;
  startAutoplay()
})
</script>
```
