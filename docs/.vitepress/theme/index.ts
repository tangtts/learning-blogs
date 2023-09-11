import theme from "vitepress/dist/client/theme-default/index";
import { ElementPlusContainer } from "@vitepress-demo-preview/component";
import "@vitepress-demo-preview/component/dist/style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./tailwind.postcss";
import "./index.css";
import { h } from "vue";
type Color = "red" | "blue" | "green";
const baseColorCompant = (color: Color) => {
  let classes = ["font-bold", "mx-2"];
  if (color == "red") {
    classes.push("text-red-500");
  } else if (color == "green") {
    classes.push("text-green-500");
  } else {
    classes.push("text-blue-500");
  }
  return {
    setup(_, { slots }) {
      return () => {
        return h("span", { class: classes }, slots.default());
      };
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
