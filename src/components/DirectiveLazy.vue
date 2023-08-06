
<script setup lang="ts">

</script>

<template>
  <div class="outer">
    <div class="inner">
      <img   v-Lazy= "'https://img1.baidu.com/it/u=3436797449,3521321307&fm=253&fmt=auto&app=120&f=JPEG?w=1427&h=800'" alt="">
      <img   v-Lazy= "'../public/vite2.svg'" alt="">
    </div>
  </div>
</template>

<style scoped>
.inner{
  height: 200vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
 
} 
.outer{
  height: 100vh;
  overflow: scroll;
}

</style>
