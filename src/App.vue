
<script setup lang="ts">
import drag from "./components/drag.vue";
import Virtual from "./components/virtual.vue";
import useFetch from "./functions/useFetch2/useFetch.vue";
import vDrag from './plugins/drag';

function a(x): PromiseLike<any> & { a: string, b: number } {
  return {
    a: '1',
    b: 2,
    then: async function (onfulfilled): PromiseLike<any> {
      // return await onfulfilled(10)
      console.log("🚀 ~ file: App.vue:13 ~ a ~ onfulfilled:", onfulfilled);
      return new Promise((resolve) => resolve(100)).then((res) => onfulfilled(res));
      return Promise.resolve(onfulfilled(x));
    }
  }
}

async function b() {
  return await a(2)
}
let r = b()
r.then(res => {
  console.log(res)
})

</script>

<template>
  <div>
    <useFetch />
    <span class="text-red-500">asfd</span>
    <Virtual></Virtual>
  </div>
</template>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>

