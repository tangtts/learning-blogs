import { type Directive, type DirectiveBinding } from "vue";

interface RippleOptions {
  removeRipple: any;
  color?: string;
  disabled?: boolean;
  tasker?: number | null;
}

interface RippleHTMLElement extends HTMLElement {
  _ripple?: RippleOptions;
}

interface RippleStyles {
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  size: number;
}
const ANIMATION_DURATION = 250;

function removeRipple(this: RippleHTMLElement) {
  const _ripple = this._ripple as RippleOptions;

  const task = () => {
    const ripples: NodeListOf<RippleHTMLElement> =
      this.querySelectorAll(".var-ripple");
    console.log("🚀 ~ file: ripple.ts:30 ~ task ~ ripples:", ripples);
    if (!ripples.length) {
      return;
    }

    const lastRipple: RippleHTMLElement = ripples[ripples.length - 1];

    window.setTimeout(() => {
      lastRipple.style.opacity = `0`;

      window.setTimeout(
        () => lastRipple.parentNode?.removeChild(lastRipple),
        ANIMATION_DURATION
      );
    }, 300);
  };

  _ripple.tasker ? window.setTimeout(task, 30) : task();
}

function computeRippleStyles(
  element: RippleHTMLElement,
  event: MouseEvent
): RippleStyles {
  // 获取元素的位置
  const { top, left } = element.getBoundingClientRect();
  // 获取元素的宽高
  const { clientWidth, clientHeight } = element;

  // 斜边的一半
  const radius = Math.sqrt(clientWidth ** 2 + clientHeight ** 2) / 2;

  const size = radius * 2;

  // 在父元素内相对父元素的点击的坐标
  const localX: number = event.clientX - left;
  const localY: number = event.clientY - top;

  // 生成的div移动的距离
  const centerX: number = (clientWidth - size) / 2;
  const centerY: number = (clientHeight - size) / 2;

  // 移动点击的坐标
  const x: number = localX - size / 2;
  const y: number = localY - size / 2;

  return { x, y, centerX, centerY, size };
}

function setStyles(element: RippleHTMLElement) {
  const { zIndex, position } = getComputedStyle(element);
  element.style.overflow = "hidden";
  position === "static" && (element.style.position = "relative");
  zIndex === "auto" && (element.style.zIndex = "1");
}

function createRipple(this: RippleHTMLElement, event: MouseEvent) {
  const _ripple = this._ripple as RippleOptions;
  _ripple.removeRipple();

  const task = () => {
    const { x, y, centerX, centerY, size }: RippleStyles = computeRippleStyles(
      this,
      event
    );

    const ripple: RippleHTMLElement = document.createElement("div");

    ripple.classList.add("var-ripple");
    ripple.style.opacity = `0.25`;
    ripple.style.transform = `translate(${x}px, ${y}px) scale3d(.4,.4,.4)`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;

    setStyles(this);
    this.appendChild(ripple);

    window.setTimeout(() => {
      ripple.style.transform = `translate(${centerX}px, ${centerY}px) scale3d(4, 4, 4)`;
      ripple.style.opacity = `.25`;

      setTimeout(() => {
        _ripple.removeRipple();
      }, ANIMATION_DURATION);
    }, 20);
  };
  _ripple.tasker = window.setTimeout(task, 30);
}
function mounted(
  el: RippleHTMLElement,
  binding: DirectiveBinding<RippleOptions>
) {
  el._ripple = {
    tasker: null,
    ...(binding.value ?? {}),
    removeRipple: removeRipple.bind(el),
  };
  el.addEventListener("click", createRipple, { passive: true });
}

const Ripple: Directive = {
  mounted,
};
export default Ripple;
