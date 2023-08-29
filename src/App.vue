
<script setup lang="ts">

type Item = { id: number, isChosen: boolean }
let d = ref<Item[]>([])
for (let i = 0; i < 14; i++) {
  d.value.push({
    id: i,
    isChosen: false
  })
}

const isMoving = ref(false);

const chosenData = ref([]);
const mouseDown2 = (e: TouchEvent) => {
  isMoving.value = true;
  var touch = e.touches[0];
  var ele = document.elementFromPoint(touch.clientX, touch.clientY);
  if (ele instanceof HTMLElement) {
    let id = +ele.dataset.id
    chosenData.value.push(id);
  }
}

const mouseenter2 = (e: TouchEvent) => {
  var touch = e.touches[0];
  if (isMoving.value) {
    var ele = document.elementFromPoint(touch.clientX, touch.clientY);
    if (ele instanceof HTMLElement) {
      let id = +ele.dataset.id;
      if (id) {
        chosenData.value.push(id);

        d.value = d.value.map((item, index) => {
          if (chosenData.value.includes(index)) {
            item.isChosen = true;
          }
          return item
        })
      }
    }
  }
}

const mouseUp2 = (e: TouchEvent) => {
  var touch = e.changedTouches[0];
  var ele = document.elementFromPoint(touch.clientX, touch.clientY);
  if (ele instanceof HTMLElement) {
    let id = ele.dataset.id;

  }
}

</script>

<template>
  <div>
    <div @touchstart.prevent="mouseDown2" @touchmove.prevent="mouseenter2" @touchend="mouseUp2"
      class="grid grid-cols-7 grid-rows-2 grid-flow-col border border-red-500 h-[200px]">
      <!-- 14个div -->
      <div v-for="i in d" :key="i.id" :data-id="i.id" :class="{ 'bg-red-500': i.isChosen }"
        class="border-gray-200  cursor-pointer border border-solid box-border flex items-center justify-center font-bold text-2xl">
        {{ i.id }}
      </div>
    </div>
  </div>
</template>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>

