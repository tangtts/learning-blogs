<template>
  <div>
    <Teleport to="body">
      <transition name="fade">
        <div v-if="show" class="w-4/5 py-3 mx-auto bg-blue-500 text-white text-center">
          abcdefg
        </div>
      </transition>
    </Teleport>
    <el-button @click="show = !show" type="primary">toggle</el-button>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
const show = ref(true);

</script>

<style lang="scss" scoped>
// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 5s;
// }
// .fade-enter-from,.fade-leave-to{
//   opacity:0;
// }
$prefix: fade;
.#{$prefix}{

  &-enter-active,
  &-leave-active {
    transition: opacity 1.5s;
  }
}

.#{$prefix}{
  &-enter-from,
  &-leave-to {
     opacity: 0;
  }
}
</style>
