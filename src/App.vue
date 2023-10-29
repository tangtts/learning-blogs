<template>
  <div>
    <el-button @click="toggleHeight">切换高度</el-button>
    {{ count }}
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
const count = ref(0);


function animate(duration, from, to, onProgress) {
  let value = from;
  let speed = (to - from) / duration;
  let startTime = Date.now();
  function _run() {
    let now = Date.now();
    const time = now - startTime;
    if (time >= duration) {
      value = to;
      onProgress?.(value)
      return
    }
    value = from + speed * time;
    onProgress?.(value)
    requestAnimationFrame(_run)
  }
  _run()
}

const toggleHeight = () => {
  animate(1000, 1000, 0, (value: number) => {
    count.value = +value.toFixed(2);
  })
}

</script>
