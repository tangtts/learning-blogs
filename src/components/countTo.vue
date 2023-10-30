<template>
  <div>
    <el-button @click="start" type="primary">启动</el-button>
    <el-button @click="pause" type="danger">暂停</el-button>
    <el-button @click="restart" type="warning">重新启动</el-button>
    总共:{{ count }} 当前 {{ now }}
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const count = ref(1000);
const now = ref(0);
let t = null;

const pause = () => {
  cancelAnimationFrame(t)
}

const restart = () => {
  now.value = 0;
  start()
}

/**
 * 本质是数字的变化，数字的变化 = 开始位置 + 速度 + 运动了多长时间
 * 速度 = (结束位置 - 开始位置) / 总时间
 * 运动时长 = 现在的时间 - 开始的时间
 * @param duration 
 * @param from 
 * @param to 
 * @param onProgress 
 */


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
    t = requestAnimationFrame(_run)
  }
  _run()
}

const start = () => {
  animate(100000, now.value, count.value, (value: number) => {
    now.value = +value.toFixed(2);
  })
}

</script>
