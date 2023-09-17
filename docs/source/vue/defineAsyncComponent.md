# [异步组件](https://cn.vuejs.org/api/general.html#defineasynccomponent)

## 类型
```ts
function defineAsyncComponent(
  source: AsyncComponentLoader | AsyncComponentOptions
): Component

type AsyncComponentLoader = () => Promise<Component>

interface AsyncComponentOptions {
  loader: AsyncComponentLoader
  loadingComponent?: Component
  errorComponent?: Component
  delay?: number
  timeout?: number
  suspensible?: boolean
  onError?: (
    error: Error,
    retry: () => void,
    fail: () => void,
    attempts: number
  ) => any
}
```

## 源码

```ts
import { ref } from "@vue/reactivity";
import { h } from "./h";
import { Fragment } from "./createVNode";
import { isFunction } from "@vue/shared";
export function defineAsyncComponent(options) {
  if (isFunction(options)) {
    options.loader = options;
  }
  return {
    setup() {
      const { loader } = options;
      let Comp = null;
      const loaded = ref(false);
      const error = ref(false);
      const loading = ref(false);

      if (options.timeout) {
        setTimeout(() => {
          error.value = true; // 时间到了就失败了
        }, options.timeout);
      }
      if (options.delay) {
        setTimeout(() => {
          loading.value = true; // 时间到了就失败了
        }, options.delay);
      }

      function load() {
        return loader() // 1)
          .then((c) => {
            Comp = c.default ? c.default : c;
            loaded.value = true;
          })
          .catch((err) => {
              if (options.onError) {
                  return new Promise((resolve, reject) => { // 2)
                      const retry = () => resolve(load()) // 递归调用
                      const fail = () => reject(err)
                      options.onError(err,retry,fail)
                })
            }
            error.value = true;
          });
      }
      load();
      return () => {
        if (loaded.value) {
          return h(Comp);
        } else if (error.value && options.errorComponent) {
          return h(options.errorComponent);
        } else if (loading.value && options.loadingComponent) {
          return h(options.loadingComponent);
        }
        return h(Fragment, []);
      };
    },
  };
}
```