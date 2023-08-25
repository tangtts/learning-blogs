<template>
  <div class="w-[200px] h-40 overflow-hidden mx-auto relative">
    <div class="h-full flex flex-nowrap duration-300 transition-transform" ref="track" 
    :style="{
      width: trackSize + 'px',
      transform: `translateX(${translate}px)`,
      transitionDuration: lockDuration ? `0ms` : `${300}ms`
    }">
      <div :ref="(el) => setItemRefs(el)" class="w-full h-full bg-blue-400 text-white 
      flex items-center justify-center text-2xl" v-for="(item, index) in items" :key="index">
        {{ index }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {nextTickFrame,  assetsHTML } from "../utils/elements"
import { onMounted, ref, computed, reactive, watch, HTMLAttributes } from "vue";
const items = ref(3);
const track = ref<HTMLElement | null>(null);
const translate = ref(0)
const index = ref(0)
const itemRefs = Array<any>();
const size = ref(0)
const lockDuration = ref(false);


const trackSize = computed(() => {
  return items.value * size.value;
})

const autoplay = true;
let timer: number | null = (null);
function stopAutoplay() {
  clearInterval(timer as number);
}


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
  const overRight = translate.value <= -trackSize.value;
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

<style lang="scss" scoped>
.a {
  transform: translateX(100px);
}
</style>
