<template>
  <div>
    
    <div id="abcd">
      {{count}}
    </div>

  </div>
</template>
<script lang="tsx" setup>

import { computed, nextTick, onMounted, ref } from 'vue';



let { value: { count } } = ref({ count: 0 });

// 直接通过包装过的响应式对象修改 count 的值


import {useCounterStore} from "./pinia/pin"







</script>
