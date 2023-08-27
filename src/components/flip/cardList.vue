<template>
  <div>
    <div class="mt-4">
      <el-button type="primary" @click="add">增加</el-button>
      <el-button type="warning" @click="shuffle">乱序</el-button>
      <el-button type="danger" @click="delChoose">删除</el-button>
    </div>
    <div class="row">
      <div v-for="card of cards" :card="card.id" :key="card.id" class="card" :ref="setCardRef">
        <div class="head">
          <ul>
            <li>name: {{ card.name }}</li>
            <li>email: {{ card.email }}</li>
            <li>address: {{ card.county }}</li>
          </ul>
          <el-checkbox size="large" v-model="card.status" />
        </div>
        <div class="content">
          <span>date:{{ card.datetime }}</span>
          <el-button type="danger" :icon="Delete" circle @click="del(card)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Mock from "mockjs";
import { onMounted, ref, computed, reactive, nextTick, VNode } from "vue";
// 乱序方法
import { shuffle as shuffleArr } from "utils/helpers";
import {
  Delete,
} from '@element-plus/icons-vue'
interface INode extends HTMLDivElement {
  attributes: { card: { value: number } } & HTMLDivElement['attributes']
}

type IMock = {
  name: string;
  county: string;
  email: string;
  id: number;
  datetime: string;
  status:boolean
}
function createMock() {
  let t = {
    name: '@name',
    county: '@county(true)',
    email: '@email',
    id: '@increment(0)',
    datetime: '@datetime',
  }
  return {
    ...Mock.mock(t),
    status: false
  }
}

let m:IMock = createMock()
const cards = ref([m]);
const cardRefs = ref<INode[]>([])

// 增加
const add = () => {
  scheduleAnimation(() => {
    cards.value.unshift(createMock())
  })
}
// 删除单个
const del = (c:IMock) => {
  scheduleAnimation(() => {
    cards.value = cards.value.filter(card => card != c)
  })
}
// 删除多个
const delChoose = () => {
  scheduleAnimation(() => {
    cards.value = cards.value.filter(card => !card.status)
  })
}
// 乱序
const shuffle = () => {
  scheduleAnimation(() => {
    cards.value = shuffleArr(cards.value) ;
  });
}

async function scheduleAnimation(update: Function) {
  // 也就是 First 阶段
  const prev = Array.from(cardRefs.value);
  // 记录 位置
  const prevRectMap = recordPosition(prev);
  update()
  // 此时还没有渲染
  await nextTick();
  // last 阶段
  const currentRectMap = recordPosition(prev);
  Object.keys(prevRectMap).forEach((node) => {

    const currentRect = currentRectMap[node];
    const prevRect = prevRectMap[node];

    // 反转阶段
    const invert = {
      left: prevRect.left - currentRect.left,
      top: prevRect.top - currentRect.top,
    };
    const keyframes = [
      {
        transform: `translate(${invert.left}px, ${invert.top}px)`,
      },
      { transform: "translate(0, 0)" },
    ];

    // play 阶段
    const options = {
      duration: 300,
      easing: "cubic-bezier(0,0,0.32,1)",
    };
    currentRect.node?.animate(keyframes, options);
  })
}

type Position = Record<string,{
    left: number;
    top: number;
    node: INode;
  }>

function recordPosition(nodes: INode[]):Position {
  return nodes.reduce((prev, node) => {
    const rect = node.getBoundingClientRect();
    const { left, top } = rect;
    // 即 :card 属性
    prev[node.attributes.card.value] = { left, top, node };
    return prev;
  }, {} as Position);
}


const setCardRef = (el:any) => {
  el && cardRefs.value.push(el)
}
</script>

<style lang="scss" scoped>
.row {
  @apply grid grid-cols-2 gap-4 mt-4
}

.card {
  @apply min-h-[180px] bg-blue-50 rounded-md flex shadow-md p-2 drop-shadow flex-col text-blue-400 font-bold transition cursor-pointer;

  &:hover {
    @apply shadow-xl
  }

  .head {
    @apply border-b-2 pb-4 border-gray-200 flex justify-between
  }

  li {
    @apply mt-2 text-orange-400
  }

  .content {
    @apply flex mt-auto justify-between items-center
  }
}
</style>
