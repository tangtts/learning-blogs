import theme from "vitepress/dist/client/theme-default/index";
import { ElementPlusContainer } from "@vitepress-demo-preview/component";
import "@vitepress-demo-preview/component/dist/style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./tailwind.postcss";
import { h } from "vue";
type Color = 'red' | 'blue' | 'green'
const baseColorCompant = (color:Color)=>{
  return {
    render() {
      return h(
        "span",
        { class: [`text-${color}-600`, "font-bold","mx-2"] },
        this.$slots.default && this.$slots.default()
      );
    },
  }
}
export default {
  ...theme,
  enhanceApp({ app }) {
    app.use(ElementPlus);
    app.component("demo-preview", ElementPlusContainer);
    app.component("red",baseColorCompant('red'));
    app.component("green", baseColorCompant('green'));
    app.component("blue", baseColorCompant('blue'));
  },
};
