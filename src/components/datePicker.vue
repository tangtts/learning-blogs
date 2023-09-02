<template>
  <div class="border border-solid border-red-400 rounded-md my-4 flex justify-between">
    <div class="relative flex-1 cursor-pointer font-bold" v-for="d in data">
      <div class="overflow-y-scroll h-[250px] snap-y snap-mandatory" :ref="getScrollRef">
        <div class="test">
          <div class="h-[50px] snap-center">
          </div>
          <div class="h-[50px] snap-center">
          </div>
          <div class="flex box-border  justify-center items-center h-[50px] snap-center" v-for="(item, index) in d"
            :key="index">
            {{ item }}
          </div>
          <div class="h-[50px] snap-center">
          </div>
          <div class="h-[50px] snap-center">
          </div>
        </div>
      </div>
      <div
        class="absolute left-0 -z-10 right-0 box-border h-[50px] top-[100px] border-gray-600 border-x-0 border-solid border-y">
      </div>

      <div class="absolute inset-0   cursor-pointer pointer-events-none" style="background-image:linear-gradient(
      180deg,
      hsla(0,0%,100%,1),
      hsla(0,0%,100%,0.8),
      hsla(0,0%,100%,0),
      hsla(0,0%,100%,0.8),
      hsla(0,0%,100%,1)
    )">

      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
const years = ref(['2023年', '2024年', '2025年', '2026年', '2027年', '2028年', '2029年', '2030年', '2031年', '2032年'])
const months = ref(['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']);
const yearIndex = ref(0)
const monthIndex = ref(0)
const dates = ref([])
const scrollRefs = ref([])

const isScrollRefIndex = ref(-1)

watch(() => [yearIndex.value, monthIndex.value], ([yearIndex, monthIndex]) => {
  const date = new Date(+years.value[yearIndex].slice(0, -1), +months.value[monthIndex].slice(0, -1), 0).getDate();
  dates.value = Array.from({ length: date }, (_, i) => i + 1)
}, {
  immediate: true
})

const data = computed(() => {
  return [years.value, months.value, dates.value]
})



const findScrollIndex = (e: HTMLElement) => {
  if (!e) return 0
  const scrollTop = e.scrollTop;
  const scrollIndex = scrollTop / 50;
  return scrollIndex
}

const getScrollRef = (el: HTMLElement) => {
  scrollRefs.value.push(el)
}

const handleScroll = () => {
  scrollRefs.value.forEach((scrollRef, index) => {
    if (isScrollRefIndex.value < index) {
      scrollRef.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    }
  })

  if (isScrollRefIndex.value === 0) {
    yearIndex.value = Math.ceil(findScrollIndex(scrollRefs.value[0]))
  } else if (isScrollRefIndex.value === 1) {
    monthIndex.value = Math.ceil(findScrollIndex(scrollRefs.value[1]))
  }
}

onMounted(() => {
  scrollRefs.value.forEach((scrollRef, index) => {
    scrollRef.addEventListener("scroll", () => {
      isScrollRefIndex.value = index
      handleScroll()
    })
  })
})
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
