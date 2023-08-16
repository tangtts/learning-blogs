# clickOutside
是否点击了元素外部

```ts
export type UseClickOutsideTarget = Element | Ref<Element | undefined | null> | (() => Element)

function useOutSideClick(target: UseClickOutsideTarget, listener: EventListener) {
  const el = typeof target === 'function' ? target() : unref(target);

  const handler = (e: MouseEvent) => {

    if (el && !el.contains(e.target as Node)) {
      listener(e)
    }
  }
  document.addEventListener("click", handler)
}

onMounted(() => {
  useOutSideClick(a, (e) => {
    console.log(e)
  })
})
```