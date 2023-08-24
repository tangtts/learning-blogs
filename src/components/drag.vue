
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
  attract()
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

