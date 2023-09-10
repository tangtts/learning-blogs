<template>
  <div>

  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
const a = reactive({ name: 10 })
const a1 = ref({ name: 10 })
let a2 = { age: 20 }
watch(a2, (newValue, oldValue) => {
  console.log(newValue, oldValue)
})
a2.age = 30
</script>
