import { Directive, DirectiveBinding, Component } from "vue";
import watermark from "../components/watermark.vue";


// v-watermask = "abcd"
function mounted(el: HTMLElement, binding: DirectiveBinding) {
  const loadingInstance = createApp(
    h(watermark, {
      content:binding.value,
    })
  );
  const vm = loadingInstance.mount(document.createElement("div"));

  el.appendChild(vm.$el);
}

const WaterMask: Directive = {
  mounted
};
export default WaterMask;
