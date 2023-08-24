<template>
  <div>
      <div @click="toggle" style="cursor: pointer;">标题</div>
      <div v-show="showContent" class="content" ref="contentEl" @transitionend="transitionend">
        <div>
          <slot />
        </div>
      </div>
  </div>
</template>
<script lang="ts" setup>
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
    console.log("🚀 ~ file: CollapseItem.vue:42 ~ requestAnimationFrame ~ offsetHeight:", offsetHeight);
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

