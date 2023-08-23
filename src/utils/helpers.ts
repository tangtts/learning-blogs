function throttle(fn:Function, delay = 200) {
  let timer: null | number = null
  let flag = true
  return () => {
    if (!flag) return
    flag = false
    const args = arguments
    timer = setTimeout(() => {
      flag = true
      clearTimeout(timer!)
      fn.apply(window, args)
    }, delay)
  }
}
export {
  throttle
}