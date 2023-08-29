# useFetch
[🔗vueuse-useFetch](https:vueuse.org/core/useFetch/#usefetch)

## 效果

  <div>
    {{ a1 }}
    <el-button @click="executeClick">execute</el-button>
  </div>

<script lang="ts" setup>
  import { useFetch } from "../../../src/functions/useFetch/index";
  import { onMounted, ref, computed, reactive, watch, useAttrs } from "vue";
  const url = new URL('../../../src/functions/useFetch/a.json', import.meta.url).href;
    let a1 = ref("")
    const executeClick = async () => {
      // 同步操作
        const { data } = await useFetch(url, {
          afterFetch: (val) => {
            return val
          }
        }).get().json();
        a1.value = data.value;
    }
  function a() {
    const { data: a, onFetchResponse } = useFetch(url, {
       beforeFetch({ url, options, cancel }) {
        const myToken = "ccc"

        if (!myToken){
          cancel()
        }
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${myToken}`,
        }
        return {
          options,
        }
      },
    })
  onFetchResponse((response) => {
    response.json().then(res => {
      console.log(res)
    })
  })
  a()
}
</script>

## 使用
### 1. 基本使用
 ```ts
 import { useFetch } from '@vueuse/core'
 const { isFetching, error, data } = useFetch(url)
 ```
 ### 异步使用
 ```ts
  const { isFetching, error, data } = await useFetch(url)
 ```
### 手动触发
```ts
  const { execute } = useFetch(url, { immediate: false })
  execute()
```
### 请求拦截器
```ts
  const { data } = useFetch(url, {
  async beforeFetch({ url, options, cancel }) {
    const myToken = await getMyToken()

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
```
### 响应拦截器
```ts
const { data } = useFetch(url, {
  afterFetch(ctx) {
    if (ctx.data.title === 'HxH')
      ctx.data.title = 'Hunter x Hunter' // Modifies the response data

    return ctx
  },
})
```
### 事件
```ts
  const { data: a, onFetchResponse } = useFetch(url)
  onFetchResponse((response) => {
    response.json().then(res => {
      console.log(res)
    })
  })
```

## 思路
合并 defaultConfig 与用户配置和其他细项不再多说,重点是 **`同步获取数据,请求拦截,响应拦截,事件触发`** 这四个方面

### 使用 await 同步请求数据

:::tip 🚀
`await` 是一个关键字, 它表示等待一个表达式, 返回一个 `Promise` 对象  
:::

**🔥🔥🔥其实可以使用普通函数模拟**

```ts
function a(x): PromiseLike<any> {
  return {
    then: function (onfulfilled): Promise<any> {
      return Promise.resolve(onfulfilled(x));
    }
  }
}

async function b() {
  return await a(2)
}

let r = b();
r.then(res => {
  console.log(res)
})
```

能够使用 `await` 的条件是需要函数 **返回一个以 `then`为`key`值,`value` 为返回一个 Promise 的函数的对象**  
由于请求是异步方法,需要等到 **请求完成之后** 才可以触发 `Promise` 的 resolve / reject 方法,需要 `waitUntilFinished` 来在合适的时机触发

```ts
// 配合使用
// return {
//   then(onFulfilled: any, onRejected: any) {
//     return waitUntilFinished().then(onFulfilled, onRejected);
//   },
// }

function until(r: any, v: boolean) {
  return new Promise<void>((resolve) => {
    watch(
      r,
      () => {
        if (v == r.value) {
          resolve();
        }
      },
      {
        immediate: true,
      }
    );
  });
}

function waitUntilFinished() {
  return new Promise<UseFetchReturn<T>>((resolve, reject) => {
    until(isFinished, true) // [!code hl]
      .then(() => resolve(shell)) // [!code hl]
      .catch((error: Error) => reject(error));
    });
  }
```
`waitUntilFinished` 名如其人 **等待直到完成**

核心是 `until` 函数, 使用 `vue` 提供的`watch`,只有当 `unitl` 的**两个参数相等时**,`resolve` 才会触发,`resolve` 触发之后,`waitUntilFinished` 才会返回 `shell`
### 请求拦截/响应拦截
在请求拦截是发生在请求响应之前,可以合并参数,在响应拦截中可以对数据进行处理
```ts
if (config.beforeFetch) {
    Object.assign(context, await config.beforeFetch(context));
}

if (config.afterFetch) {
    // 把 json 之后的数据和 没有 json 后的数据 统一传入
   // 返回 数据解构 data
  ({ data: responseData } = await config.afterFetch({
      data: responseData,
      response: fetchResponse,
  }));
}
```

### 事件触发
使用了发布订阅创建一个工厂函数 `createEventHook` 
```ts
  function createEventHook<T = any>(): EventHook<T> {
  const fns: Set<(param: T) => void> = new Set();

  const off = (fn: (param: T) => void) => {
    fns.delete(fn);
  };

  const on = (fn: (param: T) => void) => {
    fns.add(fn);
    // 切面
    const offFn = () => off(fn);
    return {
      off: offFn,
    };
  };

  const trigger = (param: T) => {
    return Promise.all(Array.from(fns).map((fn) => fn(param)));
  };

  return {
    on,
    off,
    trigger,
  };
}
```
所以使用 `createEventHook` 创建事件
```ts
 const responseEvent = createEventHook<Response>();
//  返回给外界
 const shell = {
  onFetchResponse: responseEvent.on,
 }
 // 当数据请求完成之后
 responseEvent.trigger(responseData);
```

## 源码
<<< ../../../src/functions/useFetch/index.ts{334-356,386 ts:line-numbers}









