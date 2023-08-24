
<script setup lang="ts">
import Snackbar from "./components/Snackbar/Snackbar.vue";
import Snackbar2 from "./components/Snackbar/Snackbar.tsx";
let s = 1
const mountInstance = (component: Component,props:object = {})=>{
        const app = createApp(h(component,{...props}))
        const host = document.createElement('div')
        app.mount(host)
        document.body.appendChild(host)
      }

</script>

<template>
  <div>
    <el-button @click="mountInstance(Snackbar)">adfasf</el-button>
    <el-button @click="Snackbar2({
      content: s,
      onclose: () => {
        console.log('abcd')
      }
    })">点击</el-button>
  </div>
</template>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}
</style>

