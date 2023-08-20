
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
import watermark from './components/watermark.vue';
import vWatermask from "./plugins/watermask";
const a = ref('abcd');
setTimeout(()=>{
  a.value = "efg"
},1000)
</script>

<template>
  <div>
    <div v-watermask="a"></div>
    <watermark>
      abcd
      <template #content>
      <span style="font-size: 20px; color: #7986cb">Varlet UI</span>
    </template>
    </watermark>
    <el-button type="warning" @click="c">点击</el-button>
    <!-- <scrollList/> -->
  </div>
</template>
<style></style>

