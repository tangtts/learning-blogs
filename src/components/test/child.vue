<template>
  <div>
     childe
  </div>
</template>
<script lang="ts" setup>
import { onMounted,ref, computed, reactive, watch } from "vue";

import {useParent} from "../../utils/provider" 
const {parentProvider} =  useParent("abcd")
console.log("🚀 ~ file: child.vue:11 ~ parentProvider:", parentProvider);

</script> 

<style lang="scss" scoped>

</style>
