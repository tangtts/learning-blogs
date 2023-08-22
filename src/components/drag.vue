
<script setup lang="ts">
import { computed, ref, unref } from 'vue';
const prevPos = {
  x: 0,
  y: 0
}
const pos = reactive({
  x:0,
  y:0
})
const dragRef = ref<HTMLElement | null>(null)

const dragstart = (e: DragEvent) => {
  const { clientX, clientY } = e
  console.log("🚀 ~ file: drag.vue:16 ~ dragstart ~ clientX:", clientX);
  prevPos.x = clientX;
  prevPos.y = clientY;
}
const drag = (e: DragEvent) => {
  e.preventDefault();
  console.log(4565)
  if (!dragRef.value) return;
  const { clientX, clientY } = e

  const deltaX = clientX - prevPos.x
  const deltaY = clientY - prevPos.y

  prevPos.x = clientX;
  prevPos.y = clientY;

  pos.x =  deltaX;
  pos.y =  deltaY;

  dragRef.value.style.transform = `translate(${clientX}px, ${clientY}px)`
  // dragRef.value.style.left = pos.x + 'px'
  // dragRef.value.style.top = pos.y + 'px'
}

</script>

<template>
  <Teleport to="body">
    <div class="z-20 duration-150 bg-red-400 w-10 h-10"
    draggable="true"
    ref="dragRef" 
    @dragend="drag" 
    @dragstart="dragstart"
      >
      <!-- <el-button type="ssuccess" >点击</el-button> -->
    </div>
  </Teleport>
</template>
<style lang="scss"></style>

