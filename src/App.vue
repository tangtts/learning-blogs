<template>
  <div>
    <el-button @click="toggleHeight">切换高度{{ isShow }}</el-button>
    <div class="rounded-md overflow-hidden transition-all duration-1000 h-0" ref="c">
      <div class="bg-red-100 h-[60px] py-2 border border-solid" v-for="item in 10" :key="item">
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
const c = ref<HTMLElement | null>(null)
const isShow = ref(false);
watch(isShow, (val) => {
  if (val) {
    openPanel()
  } else {
    closePanel()
  }
})



const openPanel = () => {
  const el = c.value as HTMLElement;
  el.style.height = 'auto';
  let h = el.offsetHeight;
  el.style.height = '0px';
  requestAnimationFrame(() => {
    el.style.height = h + 'px'
  })

  // showContent.value = true
  // requestAnimationFrame(() => {
  //   let h = el.offsetHeight;
  //   el.style.height = '0px';
  //   requestAnimationFrame(() => {
  //     el.style.height = h + 'px'
  //   })
  // })
}
const closePanel = () => {
  const el = c.value as HTMLElement;
  el.style.height = '0px'
}
const toggleHeight = () => {
  isShow.value = !isShow.value;
}

</script>
