
<script setup lang="ts">
import { computed, ref, unref } from 'vue';

interface Tree {
  value: number | string
  label: string
  children?: Tree[]
}

const data: Tree[] = [
  {
    label: 'Level one 1',
    value: '1',
    children: [
      {
        label: 'Level two 1-1',
        value: '1.1',
        children: [
          {
            value: '1.1.1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 2',
    value: '2',
    children: [
      {
        label: 'Level two 2-1',
        value: '2.1',
        children: [
          {
            value: '2.1.1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        label: 'Level two 2-2',
        value: '2.2',
        children: [
          {
            value: '2.2.1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    label: 'Level one 3',
    value: '3',
    children: [
      {
        label: 'Level two 3-1',
        value: '3.1',
        children: [
          {
            value: '3.1.1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        label: 'Level two 3-2',
        value: '3.2',
        children: [
          {
            value: '3.2.1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
]

// 格式化 data,形成 
interface TreeNode {
  label: string
  value: any
  level: number,
  rawData: any,
  children: TreeNode[]
}

const expandedKeySet = ref(new Set<string>(['1', "1.1"]))

function formatData(data: Tree[] = [], level: number = 0): TreeNode[] {
  return data.map(tree => ({
    label: tree.label,
    value: tree.value,
    level: level + 1,
    rawData: tree,
    children: tree.children?.length == 0 ? [] : formatData(tree.children, level + 1)
  }))
}
const formatedData = formatData(data)

// 拍平数组
const flattenTree = computed(() => {
  const expandedKeys = expandedKeySet.value // 需要展开的key
  const flattenNodes: TreeNode[] = [] // 真实存放节点

  const nodes = formatedData || []

  const stack: TreeNode[] = [] // 临时存放节点的


  for (let i = nodes.length - 1; i >= 0; --i) {
    stack.push(nodes[i]) // 节点2 节点1
  }

  // 深度遍历
  while (stack.length) {
    const node = stack.pop(); // 拿到节点1

    if (!node) continue

    flattenNodes.push(node); // 将节点1入队列

    if (expandedKeys.has(node.value)) { // 如果需要展开
      const children = node.children
      if (children) {
        const length = children.length; // 将节点1的儿子  child3 child2 child1入栈
        for (let i = length - 1; i >= 0; --i) {
          stack.push(children[i])
        }
      }
    }
  }
  return flattenNodes
})


function toggleNode(node: TreeNode) {
  if (expandedKeySet.value.has(node.value)) {
    expandedKeySet.value.delete(node.value)
  } else {
    expandedKeySet.value.add(node.value)
  }
}
import Calendar from './components/Calendar.vue';
import CollapseItem from './components/CollapseItem.vue';
import { createNamespace } from "utils/components"
const { classes, n } = createNamespace("button")

const a = ref<HTMLElement | null>(null);

export type UseClickOutsideTarget = Element | Ref<Element | undefined | null> | (() => Element)

function useOutSideClick(target: UseClickOutsideTarget, listener: EventListener) {
  const el = typeof target === 'function' ? target() : unref(target);

  const handler = (e: MouseEvent) => {

    if (el && !el.contains(e.target as Node)) {
      listener(e)
    }
  }

  document.addEventListener("click", handler)
}
onMounted(() => {
  useOutSideClick(a, (e) => {
    // console.log(e)
  })
})

</script>

<template>
  <div>
    <CollapseItem>
      egfadfasd
      </CollapseItem>

      <div class="a" style="margin-top: 100px;">

      </div>
    <div class="a" ref="a">

    </div>



    <div v-ripple :class="classes(n(),
      n('$--box'),
      [true, 'a', 'b'])">
      abcd
    </div>
    <Calendar />
    <!-- <div v-for="node in flattenTree" 
    :style="{ 
      paddingLeft: `${node.level * 16}px`,
      color: expandedKeySet.has(node.value) ? 'blue' :''  }" :key="node.value" @click="toggleNode(node)">
      {{ node.label }}
    </div> -->
  </div>
</template>
<style>
.a {
  width: 100px;
  height: 100px;
  background-color: red;
}



.var-button {
  width: 100px;
  height: 100px;
  background-color: #ccc;
}

:root {
  --ripple-cubic-bezier: cubic-bezier(0.68, 0.01, 0.62, 0.6);
  --ripple-color: currentColor;
}

.var-button {
  width: 100px;
  height: 100px;
  background-color: #ccc;
}

.var-ripple {
  position: absolute;
  transition: transform 0.2s var(--ripple-cubic-bezier), opacity 0.14s linear;
  top: 0;
  left: 0;
  border-radius: 50%;
  opacity: 0;
  will-change: transform, opacity;
  pointer-events: none;
  z-index: 100;
  background-color: var(--ripple-color);
}
</style>

