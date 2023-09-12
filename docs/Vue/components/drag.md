# drag

**吸附效果**

## 效果

<ClientOnly>
  <Drag/>
</ClientOnly>

<script setup>
import Drag from '../../../src/components/drag.vue'
</script>

## 思路

:::tip 
使用`h5`新的 `API` - `draggable`使 元素能够拖拽使用 `dragstart` 和 `drag` 和 `dragend` 事件对应 拖拽过程中的 `开始/进行/结束`;  
使用`transform:translate(pox.x,pos.y)` 使元素移动  
:::

1. 在 **_拖拽开始_** 的时候, 获取元素当前的位置, 并使用变量 `prevPos` 记录下来;
2. 在 **_拖拽过程_** 的时候,不断的计算偏移量 `e.clientX - prevPos.x/e.clientY - prevPos.y`,并且赋值给 `pos.x/pos.y`,使元素不断的移动;同时使用 `prevPos` 记录 `e.clientX/e.clientY`
3. 在 **_拖拽结束_** 的时候, 获取 `e.clientX/e.clientY`, 并判断 `e.clientX/e.clientY` 的位置距离父元素的边界距离,然后设置 `pos.x/pos.y` 使元素进行贴近父元素边界

---

### 重点:计算距离父元素的边界距离

当`dragend`的时候计算位置

1. 获取 父元素和当前元素 的位置信息及尺寸使用 `getBoundingClientRect` 获取元素大小及相对于视口的位置
2. 根据上一步的结果获取 边界位置 <img src="@img/drag1.png" />

边界位置即 `parentWidth - width / parentHeight - height`不能比这个更大,不能比 `0` 更小 
:::details 偏移量
```ts
const getOffset = () => {
  const dragRect = getRect(dragRef.value!)
  const parentRect = getRect(getParentEl(dragRef.value!))

  const top = dragRect.top - parentRect.top
  const bottom = parentRect.bottom - dragRect.bottom;
  const left = dragRect.left - parentRect.left
  const right = parentRect.right - dragRect.right;
  const { width, height } = dragRect
  const { width: parentWidth, height: parentHeight } = parentRect

  return {
    top,
    bottom,
    left,
    right,
    width,
    height,
    halfWidth: width / 2,
    halfHeight: height / 2,
    parentWidth: parentWidth,
    parentHeight: parentHeight,
  }
}
```
:::

:::details 边界代码
```ts
  const getRange = () => {
  const offset = getOffset()
  const x1 = boundary.left
  const x2 = offset.parentWidth - boundary.right - offset.width
  const y1 = boundary.top
  const y2 = offset.parentHeight - boundary.bottom - offset.height

  return {
    minX: x1,
    minY: y1,
    maxX: x1 < x2 ? x2 : x1,
    maxY: y1 < y2 ? y2 : y1,
  }
}
```
:::

3. 判断结束距离与边界位置的距离,并移动到最近的边界位置

- 距离左边的距离:`dragRect.left - parentRect.left + dragRect.width/2`
- 距离右边的距离:`parentRect.right - dragRect.right - dragRect.width/2`
- 距离上边的距离:`dragRect.top - parentRect.top + dragRect.height/2`
- 距离下边的距离:`parentRect.bottom - dragRect.bottom - dragRect.height/2`

当 左边的距离<= 右边的距离时,移动到左边,使用边界位置的最小值 `0`  
 当 右边的距离<= 左边的距离时,移动到右边,使用边界位置的最大值 `parentWidth - width`  
 上下同理
 :::details 移动代码
 ```ts
 const attract = () => {
  const { halfWidth, halfHeight, top, bottom, left, right } = getOffset()

  const { minX, minY, maxX, maxY } = getRange();

  const leftDistance = left + halfWidth - boundary.left;
  const rightDistance = right + halfWidth - boundary.right

  const topDistance = top + halfHeight - boundary.top
  const bottomDistance = bottom + halfHeight - boundary.bottom

  const nearLeft = leftDistance <= rightDistance;

  const nearTop = topDistance <= bottomDistance;

  pos.x = nearLeft ? minX : maxX;
  pos.y = nearTop ? minY : maxY
}
 ```
 :::

## 源码

```vue
<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { getRect, nextTickFrame } from "../utils/elements";
const prevPos = {
  x: 0,
  y: 0
}
const pos = reactive({
  x: 0,
  y: 0
})
const dragRef = ref<HTMLElement | null>(null)

const getParentEl = (el:HTMLElement)=>{
  return el.parentElement || window
}

const getOffset = () => {
  const dragRect = getRect(dragRef.value!)
  const parentRect = getRect(getParentEl(dragRef.value!))

  const top = dragRect.top - parentRect.top
  const bottom = parentRect.bottom - dragRect.bottom;
  const left = dragRect.left - parentRect.left
  const right = parentRect.right - dragRect.right;
  const { width, height } = dragRect
  const { width: parentWidth, height: parentHeight } = parentRect

  return {
    top,
    bottom,
    left,
    right,
    width,
    height,
    halfWidth: width / 2,
    halfHeight: height / 2,
    parentWidth: parentWidth,
    parentHeight: parentHeight,
  }
}
const boundary = reactive({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

const getRange = () => {
  const offset = getOffset()
  const x1 = boundary.left
  const x2 = offset.parentWidth - boundary.right - offset.width
  const y1 = boundary.top
  const y2 = offset.parentHeight - boundary.bottom - offset.height

  return {
    minX: x1,
    minY: y1,
    maxX: x1 < x2 ? x2 : x1,
    maxY: y1 < y2 ? y2 : y1,
  }
}

// 重点
const attract = () => {
  const { halfWidth, halfHeight, top, bottom, left, right } = getOffset()

  const { minX, minY, maxX, maxY } = getRange();

  const leftDistance = left + halfWidth - boundary.left;
  const rightDistance = right + halfWidth - boundary.right

  const topDistance = top + halfHeight - boundary.top
  const bottomDistance = bottom + halfHeight - boundary.bottom

  const nearLeft = leftDistance <= rightDistance;

  const nearTop = topDistance <= bottomDistance;

  pos.x = nearLeft ? minX : maxX;
  pos.y = nearTop ? minY : maxY
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

const clampToBoundary = () => {
  const { minX, minY, maxX, maxY } = getRange()
  pos.x = clamp(pos.x, minX, maxX)
  pos.y = clamp(pos.y, minY, maxY)
}


const dragstart = (e: DragEvent) => {
  const { clientX, clientY } = e
  prevPos.x = clientX;
  prevPos.y = clientY;
}

const drag = (e: DragEvent) => {
  e.preventDefault();
  if (!dragRef.value) return;
  const { clientX, clientY } = e

  const deltaX = clientX - prevPos.x;
  const deltaY = clientY - prevPos.y;

  prevPos.x = clientX
  prevPos.y = clientY;
  pos.x += deltaX
  pos.y += deltaY
  clampToBoundary()
}

const dragend = (e: DragEvent) => {
  e.preventDefault()
  pos.x = e.clientX
  pos.y = e.clientY
  attract() //[!code ++]
}

</script>

<template>
<!-- <Teleport to="body"> -->
<div class="w-full h-[200px] bg-blue-200">
  <div class="z-20 duration-150 bg-red-400 w-10 h-10" draggable="true" ref="dragRef" :style="{
    transform: `translate(${pos.x}px, ${pos.y}px)`
  }" @drag="drag" @dragend="dragend" @dragstart="dragstart">

  </div>
</div>
<!-- </Teleport> -->
</template>
<style lang="scss"></style>
```
