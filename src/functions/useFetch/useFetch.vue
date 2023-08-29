<template>
  <div>
    {{ a1 }}
    <el-button @click="executeClick">execute</el-button>
  </div>
</template>
<script lang="ts" setup>
import { useFetch } from "./index";
import { onMounted, ref, computed, reactive, watch, useAttrs } from "vue";

// await 有点问题
const url = new URL('./a.json', import.meta.url).href;

function a() {
  const { data: a, onFetchResponse } = useFetch(url, {
    async beforeFetch({ url, options, cancel }) {
      const myToken = "ccc"

      if (!myToken)
        cancel()

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${myToken}`,
      }

      return {
        options,
      }
    },
  })
  onFetchResponse(async (response) => {
    console.log("🚀 ~ file: useFetch.vue:43 ~ onFetchResponse ~ response:", response);
    console.log(response)
  })
}
a()

function after() {
  const { data } = useFetch(url, {
    afterFetch(ctx) {
      console.log(ctx, "ctxxxxx")
      if (ctx.data.title === 'HxH')
        ctx.data.title = 'Hunter x Hunter' // Modifies the response data
      return ctx
    },
  })
}
after()
function error() {
  const { data } = useFetch(url, {
    onFetchError(ctx) {
      // ctx.data can be null when 5xx response
      if (ctx.data === null)
        ctx.data = { title: 'Hunter x Hunter' } // Modifies the response data

      ctx.error = new Error('Custom Error') // Modifies the error

      return ctx
    },
  })
  console.log(data.value, "error")
}


setTimeout(async () => {
  const r = await useFetch(url)
  console.log("🚀 ~ file: useFetch.vue:82 ~ setTimeout ~ data:", r.data.value);
  // const { execute, abort } = useFetch(url, { immediate: false })

  // execute()
  // abort()
  //  onFetchResponse()
})

let a1 = ref(0)
const executeClick = async () => {
  console.log(4564)
  const { data, execute } = await useFetch(url, {
    afterFetch: (val) => {
      return val
    },
    immediate: true
  })
  console.log(data.value, "data")
}


</script>

<style lang="scss" scoped></style>
