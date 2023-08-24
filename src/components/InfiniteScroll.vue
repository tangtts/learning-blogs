<template>
  <div class="outer">
    <ul class="list" :infinite-scroll-delay="300" :infinite-scroll-distance="20" :infinite-scroll-immediate="true"
      :infinite-scroll-disabled="disabled" v-infinite-scroll="load">
      <li v-for="i in count" class="list-item">{{ i }}</li>
    </ul>
    <p v-if="loading" class="tip">加载中...</p>
    <p v-if="noMore" class="tip">没有更多了</p>
  </div>
</template>
<script setup lang="ts">
import { throttle } from "../utils/helpers"
import { getOverScrollEle } from "../utils/elements"
import { computed, DirectiveBinding, nextTick, ref } from 'vue';
import type { ObjectDirective } from "vue"

let count = ref(2),
  loading = ref(false)
const noMore = computed(() => {
  return count.value >= 20
})
/**
 * 0. 设置默认值
 * 1. 获取元素身上的属性
 * 1. 找到父级元素container 有 overflow 为 auto 或者 scroll
 * 2. 如果有 immediate，那么就立即充满高度，handleScroll
 * 3. 当container 发生滚动的时候，handleScroll 执行节流函数，时间为 delay
 * 4. handleScroll 判断是否触底，如果 el.scrollTop + el.offsetHeight + distance 的高度是否小于 scrollHeight
 * 5. 如果已经 等于，需要把 scroll 解绑
 * 6. 如果没有，需要执行 load 函数
 * 7. 监听 disabled 的变化，如果为 true，解绑
 */

const SCOPE = 'infinite-scroll'


type InfiniteScrollEl = HTMLElement & {
  [SCOPE]: {
    container: HTMLElement
    delay: number // export for test
    cb: Function
    onScroll: () => void
    observer?: MutationObserver,
  }
}

type Option = {
  delay: number
  "immediate": boolean,
  "disabled": boolean,
  "distance": number,
}
type OptionKeys = Array<keyof Option>;

let defaultOption: Option = {
  "delay": 500,
  "immediate": true,
  "disabled": false,
  "distance": 0,
}

function getScrollOptions(el: HTMLElement): Option {
  return ((Object.keys(defaultOption) as OptionKeys).reduce((map, key) => {
    // 去除 infinite-scroll-
    const attrVal = el.getAttribute(`infinite-scroll-${key}`);

    let value;
    if (attrVal) {
      value = attrVal;
    } else {
      value = defaultOption[key]
    }
    // 字符串类型需要转换成布尔类型
    value = value === 'false' ? false : value;
    ; (map[key] as any) = value;

    return map
  }, {} as Option))

};



function handleScroll(el: InfiniteScrollEl, fn: Function) {
  const { observer, container } = el[SCOPE]
  const { disabled, distance } = getScrollOptions(el);

  if (disabled) return;
  //  说明已经触底
  if (container.scrollTop + container.clientHeight + Number(distance) >= container.scrollHeight) {
    fn()
  } else {
    // 如果是 immediate 模式，则会有observe
    if (observer) {
      observer.disconnect()
      delete el[SCOPE].observer
    }
  }
}

const vInfiniteScroll: ObjectDirective<InfiniteScrollEl, Function> = {

  async mounted(el, bindings) {
    const {value: cb } = bindings
    await nextTick();

    let { delay, immediate } = getScrollOptions(el);
    let container = getOverScrollEle(el);
    if (!container) return;
    let onScroll = handleScroll.bind(null, el, cb)

    el[SCOPE] = {
      container,
      onScroll,
      delay,
      cb
    }

    if (immediate) {
      let observe = new MutationObserver(onScroll)
      el[SCOPE].observer = observe
      // subtree 可选
      // 当为 true 时，将会监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target
      observe.observe(container, {
        childList: true, // 儿子节点
        subtree: true // 儿子的儿子
      })
      onScroll()
    }
    container.addEventListener("scroll", throttle(onScroll.bind(null, el), delay))
  },

  unmounted(el) {
    const { onScroll, container } = el[SCOPE]
    if (container) {
      container.removeEventListener("scroll", onScroll)
      el[SCOPE].observer?.disconnect();
      delete el[SCOPE].observer
    }
  }
}

const disabled = computed(() => {
  return loading.value || noMore.value
})

const load = () => {
  loading.value = true
  setTimeout(() => {
    count.value += 2
    loading.value = false
  }, 1000)
}

</script>
<style lang="scss" scoped>
.outer {
  @apply overflow-auto h-[500px] bg-blue-200 w-full rounded-md;

  .list {
    @apply list-none p-0 m-0;

    .list-item {
      @apply h-[80px] mb-2 bg-green-400 text-white font-bold flex cursor-pointer rounded-md justify-center items-center;
    }
  }

  .tip {
    @apply text-gray-700 text-center m-2 font-bold
  }
}
</style>