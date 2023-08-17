# Collapes
**折叠面板高度**

## 效果

<CollapseItem>
    lorem
</CollapseItem>

<script setup>
  import CollapseItem from "../../../src/components/CollapseItem.vue";
</script>

## 思路
通过 `v-show` 控制显示隐藏
1. 当打开面板的时候
   1. 设置 `height` 为 "空字符串"
   2. 设置 `v-show` 为 `true`,此时还没有渲染
   3. 使用 `requestAnimationFrame`回调中 获取元素的高度 `offsetHeight`,设置高度为`0px`
   4. 再上一个的 `requestAnimationFrame` 的回调中继续使用 `requestAnimationFrame`,把 高度设置为 `offsetHeight`
2. 关闭面板的时候
   从高度 `offsetHeight` 滚动到 `0px` 

## 核心代码
```ts
const openPanel = () => {
  if (!contentEl.value) return
  if (showContent.value) return;
  (contentEl.value as unknown as HTMLElement).style.height = "";
  showContent.value = true;

  requestAnimationFrame(() => {
    if (!contentEl.value) return
    const { offsetHeight } = contentEl.value;
    (contentEl.value as unknown as HTMLElement).style.height = "0px";
    requestAnimationFrame(() => {
      (contentEl.value as unknown as HTMLElement).style.height = offsetHeight + 'px';
    })
  })
}

const closePanel = () => {
  if (!contentEl.value) return
  const { offsetHeight } = contentEl.value
  contentEl.value.style.height = offsetHeight + 'px'
  requestAnimationFrame(() => {
    ; (contentEl.value as HTMLDivElement).style.height = 0 + 'px'
  })
}
```

## 源码
```vue
<template>
  <div>
      <p @click="toggle">title</p>
      <div v-show="showContent" class="content" ref="contentEl" @transitionend="transitionend">
        <div>
          <slot />
        </div>
      </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
const showContent = ref(false);
const contentEl = ref<HTMLElement | null>(null);

const isShow = ref(false);
watch(isShow, (value) => {
  if (value) openPanel()
  else closePanel()
})

const transitionend = () => {
  if (!isShow.value) {
    showContent.value = false;
  }
}

const toggle = () => {
  isShow.value = !isShow.value
}

const openPanel = () => {
  if (!contentEl.value) return
  if (showContent.value) return;
  (contentEl.value as unknown as HTMLElement).style.height = "";
  showContent.value = true;

  requestAnimationFrame(() => {
    if (!contentEl.value) return
    const { offsetHeight } = contentEl.value;
    (contentEl.value as unknown as HTMLElement).style.height = "0px";
    requestAnimationFrame(() => {
      (contentEl.value as unknown as HTMLElement).style.height = offsetHeight + 'px';
    })
  })
}

const closePanel = () => {
  if (!contentEl.value) return
  const { offsetHeight } = contentEl.value
  contentEl.value.style.height = offsetHeight + 'px'
  requestAnimationFrame(() => {
    ; (contentEl.value as HTMLDivElement).style.height = 0 + 'px'
  })
}

</script>

<style lang="scss" scoped>
.content {
  overflow: hidden;
  transition: height 0.25s;
}
</style>


```


