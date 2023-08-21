
<script setup lang="ts">
import { computed, ref, unref } from 'vue';
import { previewImage } from "./components/imgPreview/index"
const imgs = [
  "https://varlet.gitee.io/varlet-ui/varlet_icon.png",
  "https://varlet.gitee.io/varlet-ui/cat.jpg",
  "https://varlet.gitee.io/varlet-ui/cat2.jpg",
  "https://varlet.gitee.io/varlet-ui/cat3.jpg",
];
let prev = -1;
function random(): number {
  let now = Math.floor(Math.random() * (imgs.length));
  if (prev == now) {
    return random();
  } else {
    prev = now
    return now
  }
};

function c() {
  let r = previewImage(imgs[random()])
  return r
}
const a = ref('abcd');
setTimeout(()=>{
  a.value = "efg"
},1000)
import vRipple from "./plugins/ripple"
</script>

<template>
  <div>
    <div v-ripple class="h-32 bg-gray-200 w-32 mx-auto"></div>
    <el-button type="warning" @click="c">点击</el-button>
    <!-- <scrollList/> -->
  </div>
</template>
<style>
body{
  margin: 0;
  padding: 0;
}
.var-ripple{
  @apply absolute inset-0 bg-red-200
}
</style>

