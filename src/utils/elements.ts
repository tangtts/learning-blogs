import { unref } from "vue";
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
    requestAnimationFrame(fn);
  });
}

interface ScrollToOptions {
  top?: number;
  left?: number;
  duration?: number;
  animation: (progress: number) => number;
}

function scrollTo(
  element: HTMLElement,
  { top = 0, left = 0, duration = 300, animation }: ScrollToOptions
): Promise<void> {
  const startTime = Date.now();

  const scrollTop = element.scrollTop;
  const scrollLeft = element.scrollLeft;

  return new Promise((resolve) => {
    const frame = () => {
      const progress = (Date.now() - startTime) / duration;
      if (progress < 1) {
        const nextTop = scrollTop + (top - scrollTop) * animation(progress);
        const nextLeft = scrollLeft + (left - scrollLeft) * animation(progress);
        element.scrollTo(nextLeft, nextTop);
        requestAnimationFrame(frame);
      } else {
        element.scrollTo(left, top);
        // 说明已经结束了
        resolve();
      }
    };
    requestAnimationFrame(frame);
  });
}

const linear = (val: number) => val;

const cubic = (value: number): number => value ** 3;

const easeInOutCubic = (value: number): number =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

export {
  getRect,
  assetsHTML,
  nextTickFrame,
  scrollTo,
  linear,
  cubic,
  easeInOutCubic,
};
