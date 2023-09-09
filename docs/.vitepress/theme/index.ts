import theme from "vitepress/dist/client/theme-default/index";
import { ElementPlusContainer } from "@vitepress-demo-preview/component";
import "@vitepress-demo-preview/component/dist/style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./tailwind.postcss";
import { h } from "vue";
// 使用这个让 动态 color 生效
import { twMerge } from "tailwind-merge";
type Color = "red" | "blue" | "green";
const baseColorCompant = (color: Color) => {
  let classes = twMerge(`text-${color}-500`, "font-bold", "mx-2");
  return {
    render() {
      return h(
        "span",
        { class: classes },
        this.$slots.default && this.$slots.default()
      );
    },
  };
};
export default {
  ...theme,
  enhanceApp({ app }) {
    app.use(ElementPlus);
    app.component("demo-preview", ElementPlusContainer);
    app.component("red", baseColorCompant("red"));
    app.component("green", baseColorCompant("green"));
    app.component("blue", baseColorCompant("blue"));
  },
};
