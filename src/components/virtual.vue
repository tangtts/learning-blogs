<template>
  <!-- 视口 -->
  <div>
    <div class="relative overflow-y-auto rounded-md mx-auto h-auto bg-red-100" ref="viewport" @scroll="handleScroll">
      <!-- 滚动条 -->
      <div ref="scrollBar"></div>
      <!-- 真实位置 -->
      <div class="absolute top-0 w-full" :style="{ top: offset + 'px' }">
        <div class="bg-blue-400 text-white text-center py-4 mt-2 first:mt-0 rounded" v-for="(item, index) in visiableData"
          :index="item.id" :vid="item.id" ref="itemsRefNode">
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUpdated, PropType, reactive, ref } from 'vue';
import Mock from "mockjs";
const start = ref(0)
const end = computed(() => start.value + 8)
const offset = ref(0)
const size = ref(40)

const originData = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  value: Mock.mock('@cparagraph()')
}))

const virable = ref(true);
const visiableData = computed(() => {
  // 增大预留面积
  // start 值往前移动
  // end 值往后移动
  let _start = start.value - prevCount.value
  let _end = end.value + nextCount.value
  return originData.slice(_start, _end)
})

/**
 * @description 前景预留
 */
const prevCount = computed(() => {
  return Math.min(start.value, 8)
})

/**
 * @description 尾部预留
 * @description 如果 传入 的 items 的数量小于 要 预留(remain)的个数，使用 预留个数
 */
const nextCount = computed(() => {
  return Math.min(end.value, originData.length - end.value)
})

const itemsRefNode = ref<HTMLDivElement[] | null>(null)
const scrollBar = ref<HTMLDivElement | null>(null)

let positions = reactive<any[]>([])


const updatePosition = async () => {
  let nodes = itemsRefNode.value
  nodes && nodes.length && nodes.forEach((node) => {
    let { height } = node.getBoundingClientRect()
    let id = + (node.getAttribute("vid") ?? 0) - 0;

    let oldHeight = positions[id].height;
    let diffHeight = oldHeight - height
    if (diffHeight) {
      positions[id].height = height
      positions[id].bottom = positions[id].bottom - diffHeight // 顶部增加了
      // 后面所有人都需要增加高度
      for (let i = id + 1; i < positions.length; i++) {
        positions[i].top = positions[i - 1].bottom
        positions[i].bottom = positions[i].bottom - diffHeight
      }
    }
  })
  scrollBar.value!.style.height = positions[positions.length - 1].bottom + 'px'
}

onUpdated(() => {
  if (!virable.value) return
  updatePosition()
})

const getIndex = (value: number) => {

  let start = 0, end = positions.length - 1, temp: null | number = null;

  // 二分法
  while (start < end) {
    let middleIndex = parseInt(String((start + end) / 2))
    let middleValue = positions[middleIndex].bottom
    if (middleValue == value) {
      return middleIndex
    } else if (middleValue < value) {
      start = middleIndex + 1
    } else {
      /**    
       *  @examle [1,2,5,6,10,20,50] value = 40 ,返回 50 
       *  
       */
      if (temp == null || temp > middleIndex) {
        temp = middleIndex  // 找到范围
      }
      end = middleIndex - 1
    }
  }
  return temp
}

const viewport = ref<HTMLDivElement | null>(null)

const handleScroll = () => {
  let scrollTop = viewport.value!.scrollTop;
  if (virable.value) {
    // 滚动的距离，计算需要从哪个 item 开始
    start.value = getIndex(scrollTop) || 0

    offset.value = positions[start.value - prevCount.value] ? positions[start.value - prevCount.value].top : 0;

  } else {
    start.value = Math.floor(scrollTop / size.value)
    // 需要把预留出来的偏移量 减去
    // 因为滚动的时候 start 提前了，会有一段时间重复数据
    offset.value = start.value * size.value - prevCount.value * size.value;
  }
}

const cacheList = () => {
  // 先暂时记录一个 缓存高度数组列表
  positions = originData.map((_, index) => ({
    height: size.value,
    top: index * size.value,
    bottom: (index + 1) * size.value
  }))
}


onMounted(() => {
  // 视口高度 是  视口的items 个数 * 每一个的高度  大约值
  viewport.value!.style.height = 8 * size.value + 'px'
  // 设置滚动条的高度，这样才能滚动
  scrollBar.value!.style.height = originData.length * size.value + 'px'
  if (virable.value) {
    cacheList()
  }
})
</script>
