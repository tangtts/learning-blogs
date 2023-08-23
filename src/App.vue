
<script setup lang="ts">
import drag from "./components/drag.vue";
import vDrag from './plugins/drag';
</script>

<template>
  <div>
    <!-- <div class="w-12 h-12 bg-red-600"
         v-drag="{left:0,top:0,bottom:0,right:0}"></div>

         <div class="w-12 h-12 bg-red-600"
         v-drag="{x:true}"></div> -->

         <div class="w-12 h-12 bg-red-600"
         v-drag="{y:true}"></div>
    <drag/>
  </div>
</template>
<style lang="scss">

body {
  margin: 0;
  padding: 0;
}
</style>

