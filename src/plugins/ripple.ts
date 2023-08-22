import { type Directive, type DirectiveBinding } from "vue";
import "../styles/ripple.scss"
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
    }, 200);
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

  // 半径
  const radius = Math.sqrt(clientWidth ** 2 + clientHeight ** 2) / 2;
  // 宽高
  const size = radius * 2;

  // 在父元素内相对父元素的点击的坐标
  const localX: number = event.clientX - left;
  const localY: number = event.clientY - top;

  // 生成的div移动的距离,元素的中心
  const centerX: number = clientWidth / 2 - radius;
  const centerY: number = clientHeight / 2 - radius;

  // 容器移动到 点击的位置内部的中心
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
    ripple.style.opacity = `0`;
    ripple.style.transform = `translate(${x}px, ${y}px) scale3d(.3,.3,.3)`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    setStyles(this);
    this.appendChild(ripple);
    window.setTimeout(() => {
      ripple.style.transform = `translate(${centerX}px, ${centerY}px) scale3d(1, 1, 1)`;
      ripple.style.opacity = `.25`;
      setTimeout(() => {
        _ripple.removeRipple();
      }, 200);
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
