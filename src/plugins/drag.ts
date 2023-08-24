import { DirectiveBinding, ObjectDirective } from "vue";
import { getRect } from "../utils/elements";
const setDragable = (el: HTMLElement) => {
  const hasDargable = el.getAttribute("draggable");
  if (!hasDargable) {
    el.setAttribute("draggable", "true");
  }
};

type DragOptions =
  | {
      left: number;
      top: number;
      bottom: number;
      right: number;
    }
  | {
      x: boolean;
      y: boolean;
    };

const prevPos = reactive({
  x: 0,
  y: 0,
});

const pos = reactive({
  x: 0,
  y: 0,
});

const boundary = reactive({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  x: false,
  y: false,
});

const dragRef = ref<HTMLElement | null>(null);

const getOffset = () => {
  const dragRect = getRect(dragRef.value!);
  const windowRect = getRect(window);

  const top = dragRect.top - windowRect.top;
  const bottom = windowRect.bottom - dragRect.bottom;

  const left = dragRect.left - windowRect.left;
  const right = windowRect.right - dragRect.right;

  const { width, height } = dragRect;
  const { width: windowWidth, height: windowHeight } = windowRect;

  return {
    top,
    bottom,
    left,
    right,
    width,
    height,
    halfWidth: width / 2,
    halfHeight: height / 2,
    windowWidth,
    windowHeight,
  };
};

const getRange = () => {
  const offset = getOffset();
  const x1 = boundary.left;
  const x2 = offset.windowWidth - boundary.right - offset.width;
  const y1 = boundary.top;
  const y2 = offset.windowHeight - boundary.bottom - offset.height;

  return {
    minX: x1,
    minY: y1,
    maxX: x1 < x2 ? x2 : x1,
    maxY: y1 < y2 ? y2 : y1,
  };
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const attract = () => {
  const { halfWidth, halfHeight, top, bottom, left, right } = getOffset();
  const { minX, minY, maxX, maxY } = getRange();

  const leftDistance = left + halfWidth - boundary.left;
  const rightDistance = right + halfWidth - boundary.right;

  const topDistance = top + halfHeight - boundary.top;
  const bottomDistance = bottom + halfHeight - boundary.bottom;

  const nearLeft = leftDistance <= rightDistance;

  const nearTop = topDistance <= bottomDistance;

  if (boundary.x) {
    pos.x = nearLeft ? minX : maxX;
  }
  if (boundary.y) {
    pos.y = nearTop ? minY : maxY;
  }
};

const clampToBoundary = () => {
  const { minX, minY, maxX, maxY } = getRange();
  pos.x = clamp(pos.x, minX, maxX);
  pos.y = clamp(pos.y, minY, maxY);
};

const mounted = (el: HTMLElement, bindings: DirectiveBinding<DragOptions>) => {
  dragRef.value = el;
  Object.assign(boundary, bindings.value);
  setDragable(el);
  el.addEventListener("dragstart", (e: DragEvent) => {
    prevPos.x = e.clientX;
    prevPos.y = e.clientY;
  });

  el.addEventListener("drag", (e: DragEvent) => {
    e.preventDefault();
    const { clientX, clientY } = e;

    const deltaX = clientX - prevPos.x;
    const deltaY = clientY - prevPos.y;

    prevPos.x = clientX;
    prevPos.y = clientY;
    pos.x += deltaX;
    pos.y += deltaY;
    clampToBoundary();
  });

  el.addEventListener("dragend", (e: DragEvent) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    attract();
    el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  });
};

const vDrag: ObjectDirective = {
  mounted,
};

export default vDrag;
