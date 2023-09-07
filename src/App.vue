<template>
  <div>

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
