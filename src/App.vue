
<script setup lang="ts">
import drag from "./components/drag.vue";
import Virtual from "./components/virtual.vue";
import date from "./components/upload.vue";
import vDrag from './plugins/drag';

</script>

<template>
  <div>
    <date />
    <span class="text-red-500">asfd</span>
    <Virtual></Virtual>
  </div>
</template>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>

