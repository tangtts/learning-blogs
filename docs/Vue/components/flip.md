# Flip
[🔗思路来源-掘金](https://juejin.cn/post/6844903772968206350)  
[🔗mdn-animate](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/animate)

---

<red>FLIP</red>是<red> First、Last、Invert 和 Play</red>四个单词首字母的缩写,

---

<red>First</red>，指的是在动画开始之前，记录当前元素的位置和尺寸,可以使用 `getBoundingClientRect()` 这个 API来处理

---

<red>Last</red>动画结束之后那一刻元素的位置和尺寸信息  

---

<red>Invert</red>：计算元素第一个位置（First）和最后一个位置（Last）之间的 **[位置/大小]** 变化, 然后使用这些数字做一定的计算，让元素进行移动（通过 transform来改变元素的位置和尺寸），从而创建它位于第一个位置（初始位置）的一个错觉

:::tip
  即，一上来直接让元素处于动画的结束状态，然后使用 transform 属性将元素反转回动画的开始状态（这个状态的信息在 First步骤就拿到了
:::

---

<red>Play</red>：将元素反转（**假装在first位置**），设置 transform 为 none，因为失去了 transform的约束，所以元素肯定会往本该在的位置（即动画结束时的那个状态）进行移动，也就是last的位置，如果给元素加上 transition的属性，那么这个过程自然也就是以一种动画的形式发生了

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



---

# 基础用法
>

<ClientOnly>
  <flip></flip>
</ClientOnly>

<script setup>
  import flip from "../../../src/components/flip/cardList.vue" 
</script>


<details>

<summary>以card列表举例</summary>

```vue{84-112,115-122}
<template>
  <div class="container">
    <div class="action">
      <button class="btn btn-add" @click="add">增加</button>
      <button class="btn btn-shuffle" @click="shuffle">乱序</button>
      <button class="btn btn-delete" @click="delChoose">删除</button>
    </div>
    <div class="row">
      <div v-for="card of cards" :card="'card' + card.id" :key="card.id" class="card" :ref="setCardRef">
        <div class="head" @click="card.status = !card.status">
          <ul>
            <li>name: {{ card.name }}</li>
            <li>email: {{ card.email }}</li>
            <li>address: {{ card.county }}</li>
          </ul>
          <base-checkbox v-model="card.status" />
        </div>
        <div class="content">
          <span>date:{{ card.datetime }}</span> <button @click="del(card)" class="btn btn-delete">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Mock from "mockjs";
import { onMounted, ref, computed, reactive, nextTick, VNode } from "vue";
import { shuffle as shuffleArr } from "./utils"
import baseCheckbox from "../base/checkbox/index.vue"
interface IMock extends Mock.mockOption {
  status: boolean
}

interface INode extends HTMLDivElement {
  attributes: { card: { value: number } } & HTMLDivElement['attributes']
}

function createMock(): IMock {
  let t: Mock.mockOption = {
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

let m: IMock = createMock()
const cards = ref<IMock[]>([m]);
const cardRefs = ref<INode[]>([])

// 新增
const add = () => {
  scheduleAnimation(() => {
    cards.value.unshift(createMock())
  })
}

// 删除单个
const del = (c: IMock) => {
  scheduleAnimation(() => {
    cards.value = cards.value.filter(card => card != c)
  })
}

// 多选删除
const delChoose = () => {
  scheduleAnimation(() => {
    cards.value = cards.value.filter(card => !card.status)
  })
}

// 乱序
const shuffle = () => {
  scheduleAnimation(() => {
    cards.value = shuffleArr(cards.value);
  });
}

async function scheduleAnimation(update: Function) {
  const prev = Array.from(cardRefs.value);
  // 形成以前的 dom 结构Map
  const prevRectMap = recordPosition(prev);
  update()
  await nextTick();
  // 由于是dom 复用, 更新之后获取最新的dom结构，此时页面尚未渲染
  const currentRectMap = recordPosition(prev);
  Object.keys(prevRectMap).forEach((node) => {
    const currentRect = currentRectMap[node];
    const prevRect = prevRectMap[node];
// 比较 老节点的位置 - 新节点，意味着要退回到初始位置
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
    const options = {
      duration: 300,
      easing: "cubic-bezier(0,0,0.32,1)",
    };
    currentRect.node?.animate(keyframes, options);
  })
}

// 传入节点，返回节点位置
function recordPosition(nodes: INode[]) {
  return nodes.reduce((prev, node) => {
    const rect = node.getBoundingClientRect();
    const { left, top } = rect;
    prev[node.attributes.card.value] = { left, top, node };
    return prev;
  }, [{} as any]);
}


const setCardRef = (el) => {
  el && cardRefs.value.push(el)
}

</script>
```
</details>