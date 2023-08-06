
<script setup lang="ts">
import { ref } from "vue";
// import {Loading} from "./plugins/loading"

// const a1 =  Loading({
//   text:"abcd",
//   target:'.outer'
// })

// let x = a1.crateInstance();

// setTimeout(()=>{
//   x.close()
// },1100)
const a = ref(true);

setTimeout(() => {
a.value = false
},1000)
</script>

<template>
  <div class="outer" v-load="a">

  </div>
</template>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease;
}

.mask {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background-color: yellowgreen;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circular {
  width: 50px;
  height: 50px;
  color: aqua;
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.inner {
  height: 200vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

.outer {
  position: relative;
  height: 100vh;
  background-color: red;
}
</style>
