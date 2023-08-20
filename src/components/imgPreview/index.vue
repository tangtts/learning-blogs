<template>
  <div :teleport="teleport" v-if="popupShow">
    <img :src="url" />
  </div>
</template>
<script lang="ts" setup>

import { onMounted, ref, computed, reactive, watch } from "vue";

const props = withDefaults(defineProps<{
  url: string
  onclosed?: Function,
  teleport?: string,
  show?:boolean
}>(), {
  show:false,
  url: '',
  teleport: 'body',
  onclosed: () => { }
})


const popupShow = ref(false)
watch(
  () => props.show,
  (newShow) => {
    popupShow.value = newShow
  },
  { immediate: true }
)

</script>

<style lang="scss" scoped></style>
