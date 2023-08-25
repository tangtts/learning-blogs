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

const getRandomInt = (min:number, max:number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const shuffle = (arr:number[]) => {
  let ret = arr.slice();
  for (let i = 0; i < ret.length; i++) {
    let j = getRandomInt(0, i);
    [ret[i], ret[j]] = [ret[j], ret[i]];
  }
  return ret;
};

export {
  throttle,
  getRandomInt,
  shuffle
}