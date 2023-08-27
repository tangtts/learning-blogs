<template>
  <div class="container" @mouseover="boxShow = true" @mouseout="boxShow = false" @mousemove="onMouseMove" ref="container">

    <img :src="img" />
    <!-- 遮罩层 -->
    <div class="mask" ref="mask" v-show="boxShow" />

    <!-- 大图片 -->
    <div class="big-img_box" ref="bigImgBox" v-show="boxShow">
      <img class="big-img" ref="bigImg" :src="img" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { assetsHTML } from "@/utils/elements";
import { ref } from "vue";
const img = ref("https://img.alicdn.com/imgextra/i3/1917047079/O1CN01lkG2pf22AEUi1owve_!!1917047079.png_430x430q90.jpg")
const container = ref<HTMLElement | null>(null);

const mask = ref<HTMLElement | null>(null);
const bigImg = ref<HTMLElement | null>(null)

const bigImgBox = ref<HTMLElement | null>(null);
const boxShow = ref(false);
// 最外层可以mouse 的盒子

const onMouseMove = (e: MouseEvent) => {
  assetsHTML(container.value)
  assetsHTML(mask.value)
  assetsHTML(bigImg.value)
  assetsHTML(bigImgBox.value)
  //NOTE: 在 vue.express 上这个不生效，在真实页面上生效
  // let x = e.clientX - container.value.offsetLeft;
  // let y = e.clientY - container.value.offsetTop;
  // let maskRefX = x - mask.value.offsetWidth / 2;
  // let maskRefY = y - mask.value.offsetHeight / 2;

  let x = e.clientX - container.value.getBoundingClientRect().left;
  let y = e.clientY - container.value.getBoundingClientRect().top;
  // 如果不减去 1/2，鼠标在右下方
  let maskRefX = x - mask.value.offsetWidth / 2;
  let maskRefY = y - mask.value.offsetHeight / 2;

  // maskRef的x最大移动距离
  let maskRefXMaxMove = container.value.offsetWidth - mask.value.offsetWidth;
  let maskRefYMaxMove = container.value.offsetHeight - mask.value.offsetHeight;

  // 大图片的最大移动距离
  let bigImgXMaxMove =
    bigImgBox.value.offsetWidth - bigImg.value.offsetWidth;

  let bigImgYMaxMove =
    bigImgBox.value.offsetHeight - bigImg.value.offsetHeight;


  // 限制移动距离  
  if (maskRefX <= 0) {
    maskRefX = 0;
  } else if (maskRefX >= maskRefXMaxMove) {
    maskRefX = maskRefXMaxMove;
  }

  if (maskRefY <= 0) {
    maskRefY = 0;
  } else if (maskRefY >= maskRefYMaxMove) {
    maskRefY = maskRefYMaxMove;
  }

  mask.value.style.left = maskRefX + "px";
  mask.value.style.top = maskRefY + "px";


  // 大盒子的移动x =  (小盒子水平移动的x / 可移动的宽度) * 最大移动距离
  let bixImgXMove = (maskRefX / maskRefXMaxMove) * bigImgXMaxMove;
  let bixImgYMove = (maskRefY / maskRefYMaxMove) * bigImgYMaxMove;


  bigImg.value.style.left = bixImgXMove + "px";
  bigImg.value.style.top = bixImgYMove + "px";
};
</script>
<style scoped>
.container {
  @apply w-[430px] aspect-square relative border border-gray-200
}

.mask {
  @apply absolute w-[200px] aspect-square bg-blue-200 opacity-50 cursor-move top-0 left-0;
}

.big-img_box {
  @apply absolute w-[500px] aspect-square top-0 left-[480px] bg-white overflow-hidden border border-gray-500;
}

.big-img {
  @apply absolute left-0 top-0;
  max-width: inherit;
  width: 120%;
}
</style>
