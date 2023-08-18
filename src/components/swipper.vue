<template>
  <div class="w-full h-40 bg-red-100 overflow-hidden">
    <div class="h-full flex flex-nowrap duration-300" ref="track" :style="{
      width: trackSize + 'px',
      transform: `translateX(${translate}px)`
    }">
      <div ref="itemRefs" class="w-full h-full bg-blue-400 text-white 
      flex items-center justify-center text-2xl" v-for="(item, index) in items" :key="index">
        {{ index }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTickFrame, assetsHTML } from "utils/elements"
import { onMounted, ref, computed, reactive, watch } from "vue";
const items = ref(3);
const track = ref<HTMLElement | null>(null);
const translate = ref(0)
const index = ref(0)
const itemRefs = ref<(HTMLElement | null)[]>([]);

const trackSize = computed(() => {
  return items.value * size.value;
})

const autoplay = true;
let timer: number | null = (null);
function stopAutoplay() {
  clearInterval(timer as number);
}

function next() {

  nextTickFrame(() => {

    // 当前下标 0,1,
    const currentIndex = index.value

    // 已经到了最后一位
    if (currentIndex === items.value - 1) {
      index.value = 0;

      // if ((itemRefs.value)[0]) {
      //   (((itemRefs.value)[0]) as HTMLElement).style.transform = `translateX(${(items.value) * size.value}px)`;
      // }

      translate.value = index.value * -size.value
    } else {
      index.value++;
      translate.value = index.value * -size.value
    }
  })
}

const size = ref(0)

const startAutoplay = () => {
  if (!autoplay || items.value <= 1) {
    return
  }

  stopAutoplay()

  timer = window.setTimeout(() => {
    next()
    startAutoplay()
  }, 1000)
}


onMounted(() => {
  size.value = document.body.clientWidth;
  startAutoplay()
})
</script>

<style lang="scss" scoped>
.a{
  transform: translateX(100px);
}
</style>
