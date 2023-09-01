<template>
  <div class="tableBox">
    <div  class="relative flex flex-col border border-solid rounded border-red-200"
    :style="{ height: columnHeight + 'px' }"
      >
      <div 
      class="overflow-y-hidden" 
      
      @touchstart="mouseEnter"
      @touchmove="mouseMove"
      @touchend="mouseLeave"
      
      >
        <div ref="scrollRef" :style="{ transform: `translateY(${-translate}px)` }">
          <div :style="{ height: optionHeight + 'px' }" v-for="d in data" :key="d">
            {{ d }} {{translate}}
          </div>
        </div>
      </div>

      <div class="absolute w-full border border-solid border-green-500" :style="{
        top: top + 'px',
        height: optionHeight + 'px'
      }">

      </div>
      <div class="absolute top-0 left-0  bg-no-repeat" style="background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4)),
    linear-gradient(0deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4));
    background-position:top,bottom;" :style="{ backgroundSize: `100% ${(columnHeight - optionHeight) / 2}px` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
function getTranslateY(el: HTMLElement) {
  const { transform } = getComputedStyle(el)
  return +transform.slice(transform.lastIndexOf(',') + 2, transform.length - 1)
}
const scrollRef = ref<HTMLElement | null>(null);

const translate = ref(0)
const prev = ref(0)
const data = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const optionHeight = ref(50);
const optionCount = ref(6);

const mouseEnter = () => {
  translate.value = getTranslateY(scrollRef.value as HTMLElement)
  console.log("🚀 ~ file: App.vue:50 ~ mouseEnter ~ translate.value:", translate.value);
}
const mouseMove = (e: TouchEvent) => {
  const { clientY } = e.touches[0];
  const deltaY =  clientY - prev.value;
  prev.value = clientY;
  translate.value += deltaY
  console.log("🚀 ~ file: App.vue:56 ~ mouseMove ~ translate.value:", translate.value);
}
const mouseLeave = (e: TouchEvent) => {
  const distance = translate.value;
  const { clientY } = e.changedTouches[0];
  const deltaY = clientY - distance;
  translate.value += deltaY;
  let index = 0;
  index =  Math.floor(clientY / optionHeight.value)
  translate.value = index * optionHeight.value
}





const columnHeight = computed(() => {
  return optionCount.value * optionHeight.value
})

const top = computed(() => {
  return (optionCount.value * optionHeight.value) / 2 - optionHeight.value / 2
})



</script>

<style scoped lang="scss"></style>

