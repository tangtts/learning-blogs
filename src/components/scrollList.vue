<template>
  <div ref="container" class="h-56 overflow-y-auto py-4">
    <div class="inner" ref="listEl">
        <div class="text-center text-white bg-blue-400 p-2 border border-solid border-gray-400 rounded mt-2" v-for="d in info.data">
          {{ d }}
        </div>

      <div v-if="info.loading" class="flex items-center justify-center mt-4">
        <el-icon :size="40">
          <Loading />
        </el-icon>
      </div>

      <div v-if="info.finished">
        <el-icon :size="40"><CircleCheck /></el-icon>
      </div>

      <div class="w-full" ref="detectorEl"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Loading,CircleCheck } from "@element-plus/icons-vue"
import { assetsHTML, getRect } from "../utils/elements";
import { onMounted, ref, computed, reactive, unref, nextTick } from "vue";

const container = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const detectorEl = ref<HTMLElement | null>(null);
let scroller: HTMLElement | Window

const isReachBottom = () => {
  const { bottom: containerBottom } = getRect(scroller)
  // 相对于视口来说
  const { bottom: detectorBottom } = getRect(detectorEl.value!)
  return detectorBottom <= containerBottom
}

const handleScroll = async () => {
  // 找到可以滚动的元素
  await nextTick()

  if (info.loading || info.finished ||  !isReachBottom()) {
    return
  }

  load()
}

const getParentScroller = (el: Element) => {
  let parent = el.parentElement;
  while (parent) {
    if (/(auto)|(scroll)/.test(getComputedStyle(parent).overflowY)) {
      return parent
    }
    parent = parent.parentElement;
  }
  return window
}

onMounted(() => {
  scroller = getParentScroller(listEl.value!)
  scroller.addEventListener("scroll", handleScroll)
  handleScroll()
})


let info = reactive<{
  loading: boolean,
  finished: boolean,
  data: number[]
}>({
  loading: false,
  finished: false,
  data: []
});

const load = function () {
  info.loading = true;
  setTimeout(() => {
    for (let i = 0; i < 60; i++) {
      info.data.push(i)
    }
    info.finished = false
    info.loading = false
  }, 1000)
}
</script>

<style lang="scss" scoped></style>
