<template>
  <div>
    parent
    <Child />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
import Child from "./child.vue"
import { useChildren } from "../../utils/provider"
const { bindChildren } = useChildren("abcd")
bindChildren({
  a: 1,
  b: 2,
  c: 3
})
</script>

<style lang="scss" scoped></style>
