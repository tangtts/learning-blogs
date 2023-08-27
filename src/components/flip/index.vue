<template>
  <div class="container">
    <div class="action">
      <el-button type="success" @click="changePage('cardListFlip')"> card 动画</el-button>
      <el-button type="warning" @click="changePage('itemsListFlip')"> 列表动画</el-button>
      <el-button @click="changePage('picFlip')"> 图片动画</el-button>
      <p class="tip">当前动画: <span class="name"> {{ PageName }} </span></p>
    </div>

    <TransitionGroup name="list">
      <cardListFlip v-show="whichPageShow.cardListFlip" key="cardListFlip" />
      <itemsListFlip v-show="whichPageShow.itemsListFlip" key="itemsListFlip" />
      <picFlip v-show="whichPageShow.picFlip" key="picFlip" />
    </TransitionGroup>
  </div>
</template>
<script lang="ts" setup>
import picFlip from "./pic.vue"
import cardListFlip from "./cardList.vue"
import itemsListFlip from "./liList.vue";
import { onMounted, ref, computed, reactive, watch, Transition } from "vue";

type PageName = "picFlip" | 'cardListFlip' | 'itemsListFlip'

const radio = ref('picFlip')
const whichPageShow = reactive<Record<PageName, boolean>>({
  picFlip: false,
  cardListFlip: true,
  itemsListFlip: false
})
const changePage = (PageName: PageName) => {
  radio.value = PageName
  for (const key in whichPageShow) {
    if (key == PageName) {
      whichPageShow[key] = true
    } else {
      whichPageShow[key as keyof typeof whichPageShow] = false
    }
  }
}
const PageName = computed(() => {
  return whichPageShow.picFlip ? '图片动画' : whichPageShow.cardListFlip ? 'card 动画' : '列表动画'
})

</script>
<style lang="scss" scoped>

.action {
  @apply space-x-4 border-solid border-blue-400 p-2 bg-slate-100 rounded-md;

  .tip {
    @apply inline-block font-bold text-gray-600;

    .name {
      @apply text-blue-500 font-bold border-2 border-blue-300 p-2 bg-white rounded-md cursor-pointer border-solid;

      &:hover {
        @apply bg-blue-500 text-white border-white
      }
    }
  }

}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-100%);;
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>
