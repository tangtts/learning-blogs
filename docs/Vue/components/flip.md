# Flip
[🔗思路来源-掘金](https://juejin.cn/post/6844903772968206350)  
[🔗mdn-animate](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animate)
## 概念

<red>FLIP</red>是<red> First、Last、Invert 和 Play</red>四个单词首字母的缩写

---

- <red>First</red>，
  > 指的是在动画开始之前，记录当前元素的位置和尺寸,可以使用 `getBoundingClientRect()` 这个 API来处理


- <red>Last</red>
  > 动画结束之后那一刻元素的位置和尺寸信息  


- <red>Invert</red>
  > 计算元素第一个位置（First）和最后一个位置（Last）之间的 **[位置/大小]** 变化, 然后使用这些数字做一定的计算，让元素进行移动（通过 transform来改变元素的位置和尺寸），从而创建它位于第一个位置（初始位置）的一个错觉

:::tip
  即，一上来直接让元素处于动画的结束状态，然后使用 transform 属性将元素反转回动画的开始状态（这个状态的信息在 First步骤就拿到了
:::


- <red>Play</red>：
> 将元素反转（**假装在first位置**），设置 transform 为 none，因为失去了 transform的约束，所以元素肯定会往本该在的位置（即动画结束时的那个状态）进行移动，也就是last的位置，如果给元素加上 transition的属性，那么这个过程自然也就是以一种动画的形式发生了

---


**简单来说:**
 1. 获取初始位置
 2. 获取结束位置,此时还未渲染到页面上
 3. 使用 `transform` 回到初始位置
 4. 执行动画,回到结束位置



:::tip
在<blue> vue </blue>中，获取最新的<green> dom </green>使用的是<red> 调用nextTick之后 </red>
:::

---

## 基础用法
>

<ClientOnly>
  <flip></flip>
</ClientOnly>

<script setup>
  import flip from "../../../src/components/flip/index.vue" 
</script>

## 举例
**以 cardList 举例**
当向 `cards` 添加数据的时候,我们先要记录此时的 `dom` 此时的位置信息
- 然后执行添加数据的操作
- 获取`dom` 此时的位置信息
- 计算`dom` 此时的位置信息与初始位置的差值
- 执行动画效果

比如 dom 结果为:
```vue
  <div v-for="card of cards" :card="card.id"  :ref="setCardRef">
    xxxx
  </div>
```
使用 <red>cards</red> 作为数据池,同时使用 <red>id</red> 标记这个dom,使用 <red>ref</red> 记录dom的引用

1. 记录dom信息,<blue>也就是 First 阶段</blue>
```ts
const prev = Array.from(cardRefs.value);
type Position = Record<string,{
    left: number;
    top: number;
    node: INode;
}>
function recordPosition(nodes: INode[]):Position {
  return nodes.reduce((prev, node) => {
    const rect = node.getBoundingClientRect();
    const { left, top } = rect;
    // 即 :card 属性,id
    prev[node.attributes.card.value] = { left, top, node };
    return prev;
  }, {} as Position);
}


// 记录 位置也就是 First 阶段
const prevRectMap = recordPosition(prev);
```
2. 执行操作
   ```ts
   // 添加数据
   cards.value.unshift(createMock())
   // 删除数据
   cards.value = cards.value.filter(card => card != c)
   ```
3. 再次获取 dom 信息,<blue>last 阶段</blue>  
   当执行操作之后, 在 `nextTick` 之后，可以获取<red>最新的 dom 结果</red>,并记录
   ```ts
    await nextTick();
    const currentRectMap = recordPosition(prev);
   ```
 4. 计算位置的差值,<blue>Invert阶段</blue>
   ```ts
      Object.keys(prevRectMap).forEach((node) => {
      const currentRect = currentRectMap[node];
      const prevRect = prevRectMap[node];

      // 反转阶段
      const invert = {
        left: prevRect.left - currentRect.left,
        top: prevRect.top - currentRect.top,
      };
    }
  ```  
 5. <blue>play 阶段</blue>
   ```ts
    const keyframes = [
      {
          transform: `translate(${invert.left}px, ${invert.top}px)`,
      },
      { transform: "translate(0, 0)" },
    ];

    const options = {
      duration: 300,
      easing: "cubic-bezier(0,0,0.32,1)",
    };

    currentRect.node?.animate(keyframes, options);
   ```  
## 源码
**以Card 举例**

```vue
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

```