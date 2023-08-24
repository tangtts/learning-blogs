<script setup lang="ts">
import { computed, ref } from 'vue';

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

  // 格式化后的数据
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
  if(expandedKeySet.value.has(node.value)){
    expandedKeySet.value.delete(node.value)
  }else {
    expandedKeySet.value.add(node.value)
  }
}
</script>

<template>
  展开的节点:{{[...expandedKeySet]}}
  <div class="border border-blue-400 border-solid rounded-md p-4 mt-2">
    <div 
    class="cursor-pointer text-lg hover:text-red-600"
    v-for="node in flattenTree" 
    :style="{ 
      paddingLeft: `${node.level * 16}px`,
      color: expandedKeySet.has(node.value) ? '#60a5fa' :''  }" :key="node.value" @click="toggleNode(node)">
        {{ node.label }}
    </div>
  </div>
</template>