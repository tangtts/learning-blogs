# 🐘tree
**[⛰️树形组件-珠峰架构](http://www.zhufengpeixun.com/advance/z-ui/component-5.html)**

**[🔗git 源码](https://github.com/tangtts/vue3-componentsAndHook/tree/master/src/components/tree)**



## 效果
<Tree/>
<script setup>
  import Tree from '../../../src/components/tree.vue'
</script>

:::details 初始数据
```ts
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
```
:::
## 思路
1. 对用户传递的数据进行格式化  
  > **添加`level`表示层级**,**格式化 `label/children` 等自定义属性**转化为统一名称
  - 格式化 自定义 属性
     :::details 格式化属性
      ```ts
        function createTreeOptions(keyField: string, childrenField: string,labelField:string) {
            return {
              getKey<T>(node:T):Key {
                return node[keyField]
              },
              getChildren<T>(node:T):T[] {
                return node[childrenField]
              },
              getLabel<T>(node:T):string{
                return node[labelField]
              }
            }
      }
      const treeOptions = createTreeOptions(props.keyField, props.childrenField,props.labelField)
     ```
    :::
  - 使用递归添加 `level` 表示层级
    :::details 添加层级
      ```ts
      function formatData(data: Tree[] = [], level: number = 0): TreeNode[] {
        return data.map(tree => ({
          label: tree.label, 
          value: tree.value,
          level: level + 1,
          rawData: tree,
          children: tree.children?.length == 0 ? [] : formatData(tree.children, level + 1)
        }))
      }
     ```
    ::: 

  
2. 拍平数据  
> 根据 `expandedKeySet(展开元素的唯一标识)` 返回一个 `computed` 数据   
> 形成`[{key:"1",value:"1"},{key:"1.1",value:"1.1"},{key:"2",vlaue:2.1}]`的这种父子拍平的结构

:::details 拍平数据

```ts:line-numbers{16-29}
        // 需要展开的key,使用 set 结构
const expandedKeySet = ref(new Set<string>(['1', "1.1"]))

const flattenTree = computed(() => {
const expandedKeys = expandedKeySet.value // 需要展开的key
const flattenNodes: TreeNode[] = [] // 真实存放节点
// 格式化后的数据
const nodes = formatedData || []

const stack: TreeNode[] = [] // 临时存放节点的

// 倒序放入
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
```
:::
3. 渲染
   > 层级关系使用 `padding` 来视觉表现
```vue
<div 
    v-for="node in flattenTree" 
    :style="{ 
      paddingLeft: `${node.level * 16}px`,
      color: expandedKeySet.has(node.value) ? '#60a5fa' :''  }" 
      >
        {{ node.label }}
    </div>
``` 

1. 切换状态  
   > 改变 `expandedKeySet` 的状态,即可改变树的渲染结果
```ts
  function toggleNode(node: TreeNode) {
    if(expandedKeySet.value.has(node.value)){
      expandedKeySet.value.delete(node.value)
    }else {
      expandedKeySet.value.add(node.value)
    }
  }
```

## 源码
```vue:line-numbers{104-134}
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
```