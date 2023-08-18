import {unref} from "vue"
type MaybeElement = Ref<HTMLElement> | HTMLElement;

function assetsHTML<T extends Ref<HTMLElement | null> | HTMLElement | null>(
  el: T
): asserts el is NonNullable<T> {
  let el2 = unref(el);
  if (!el2) {
    throw new Error("element is null");
  }
}

function getRect(el: MaybeElement | Window): DOMRect {
  el = unref(el);
  if (el instanceof Window) {
    const width = el.innerWidth;
    const height = el.innerHeight;
    const rect = {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      width,
      height,
    };
    return {
      ...rect,
      toJSON: () => rect,
    };
  }
  return el.getBoundingClientRect();
}

 function nextTickFrame(fn: FrameRequestCallback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(fn)
  })
}

export { getRect,assetsHTML,nextTickFrame };