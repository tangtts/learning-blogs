<template>
  <div>
  <p>当前位移距离:{{indicatorX}}</p>
  <p>当前选中下标:{{currentTab}}</p>
  <div class="w-[400px] overflow-hidden tab-bar mx-auto bg-blue-400 text-gray-200 rounded-sm shadow-md shadow-orange-200">
    <div class="overflow-x-auto relative flex gap-2 flex-nowrap h-10 cursor-pointer" ref="scroller">
      <div v-for="i of tabs" :key="i" class="flex-1 h-full  px-4 
      flex justify-center items-center text-white  font-bold min-w-fit" :class="[
        currentTab == i - 1 && ['bg-red-200 text-blue-800']]" :ref="setDom" @click="tab(i - 1)">
        选项{{ i }}
      </div>
      <div class="h-1 absolute bottom-0  bg-green-300 transition-transform duration-200" :style="{
        transform: `translateX(${indicatorX}px)`,
        width: `${tabDom[currentTab]?.offsetWidth}px`
      }">
      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
const tabs = ref(10)
import { scrollTo, linear } from "../utils/elements"
const tabDom = ref<Array<HTMLElement | null>>([]);
const scroller = ref<HTMLElement | null>(null);

const currentTab = ref(0);

const indicatorX = ref(0)

const setDom = (el: any) => {
  tabDom.value.push(el)
}

const moveIndicator = (tab: HTMLElement) => {
  console.log(tab.offsetLeft, tab)
  if (!scroller.value) return;
  indicatorX.value = tab.offsetLeft;
}

const scrollToCenter = (tab: HTMLElement) => {
  if (!scroller.value) return;
  const left: number = tab.offsetLeft + tab.offsetWidth / 2 - scroller.value.offsetWidth / 2;
  scrollTo(scroller.value, {
    left,
    animation: linear
  })
}

const tab = (i: number) => {
  currentTab.value = i;

  const tab = tabDom.value[i];
  if (!tab) return

  moveIndicator(tab)
  scrollToCenter(tab)
}
</script>

<style lang="scss" scoped>
.tab-bar {
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
