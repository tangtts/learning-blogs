import { defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import vueJsx from "@vitejs/plugin-vue-jsx";
export default defineConfig({
  vite: {
    plugins: [
      AutoImport({
        imports: ["vue"],
        resolvers: [],
        dts: fileURLToPath(new URL("auto-imports.d.ts", import.meta.url)),
      }),
      vueJsx(),
    ],
    resolve: {
      alias: {
        utils: fileURLToPath(new URL("../../src/utils", import.meta.url)),
        "@": fileURLToPath(new URL("../../src", import.meta.url)),
        "@img": fileURLToPath(new URL("../assets/img", import.meta.url)),
        "@backImg": fileURLToPath(
          new URL("../assets/backendImg", import.meta.url)
        ),
        "@other": fileURLToPath(new URL("../assets/other", import.meta.url)),
      },
    },
  },
  title: "「🦆TSK的博客」",
  description: "tsk Blog",
  head: [["link", { rel: "icon", href: "/B.Duck.svg" }]],
  themeConfig: {
    outline: "deep",
    nav: [
      {
        text: "前端",
        items: [
          { text: "HTML", link: "/HTML/标签", activeMatch: "/HTML/标签" },
          { text: "CSS", link: "/CSS/基础", activeMatch: "/CSS/基础" },
          { text: "JS", link: "/JS/window", activeMatch: "/JS/window" },
          { text: "TS", link: "/TS/index", activeMatch: "/TS/index" },
          { text: "Vue", link: "/Vue/directives/ripple", activeMatch: "/Vue/" },
          { text: "React", link: "/React/ts", activeMatch: "/React/" },
        ],
      },
      {
        text: "后端",
        items: [
          { text: "node", link: "/backend/node", activeMatch: "/backend/node" },
          {
            text: "promise",
            link: "/backend/promise",
            activeMatch: "/backend/promise",
          },
          {
            text: "Cookie/session/jwt",
            link: "/backend/jwt",
            activeMatch: "/backend/jwt",
          },
          {
            text: "任务队列",
            link: "/backend/任务队列",
            activeMatch: "/backend/任务队列",
          },
          { text: "加密", link: "/backend/加密", activeMatch: "/backend/加密" },
          { text: "mock", link: "/backend/mock", activeMatch: "/backend/mock" },
          { text: "nest", link: "/nest/nest/index", activeMatch: "/nest/" },
          { text: "java", link: "/java/base", activeMatch: "/java/base" },
        ],
      },
      {
        text: "其他",
        items: [
          { text: "html技巧", link: "/skill/html", activeMatch: "/skill/html" },
          { text: "js技巧", link: "/skill/js", activeMatch: "/skill/js" },
          { text: "网络", link: "/skill/网络", activeMatch: "/skill/网络" },
          { text: "正则", link: "/skill/正则", activeMatch: "/skill/正则" },
          {
            text: "设计模式",
            link: "/skill/设计模式",
            activeMatch: "/skill/设计模式",
          },
          {
            text: "代码规范",
            link: "/skill/代码规范",
            activeMatch: "/skill/代码规范",
          },
          { text: "git", link: "/skill/git", activeMatch: "/skill/git" },
          {
            text: "快捷键",
            link: "/skill/快捷键",
            activeMatch: "/skill/快捷键",
          },
          {
            text: "",
            items: [
              { text: "英语", link: "/skill/英语", activeMatch: "/skill/英语" },
            ],
          },
          {
            text: "",
            items: [
              {
                text: "工具包",
                link: "/skill/工具包",
                activeMatch: "/skill/工具包",
              },
            ],
          },
        ],
      },
      {
        text: "算法",
        items: [
          {
            text: "数组",
            link: "/algorithm/数组",
            activeMatch: "/algorithm/数组",
          },
          {
            text: "hash",
            link: "/algorithm/hash",
            activeMatch: "/algorithm/hash",
          },
          {
            text: "回溯",
            link: "/algorithm/回溯",
            activeMatch: "/algorithm/回溯",
          },
          {
            text: "动态规划",
            link: "/algorithm/动规",
            activeMatch: "/algorithm/动规",
          },
          {
            text: "单调栈",
            link: "/algorithm/单调栈",
            activeMatch: "/algorithm/单调栈",
          },
          {
            text: "链表",
            link: "/algorithm/链表",
            activeMatch: "/algorithm/链表",
          },
          {
            text: "工作算法",
            link: "/algorithm/工作算法",
            activeMatch: "/algorithm/工作算法",
          },
        ],
      },
      {
        text: "源码",
        items: [
          {
            text: "vue源码",
            link: "/source/vue/reactive",
            activeMatch: "/source/vue",
          },
          {
            text: "emotion源码",
            link: "/source/emotion/emotion",
            activeMatch: "/source/emotion",
          },
        ],
      },
    ],
    sidebar: {
      HTML: [
        {
          text: "HTML",
          collapsed: true,
          items: [
            { text: "标签", link: "/HTML/标签" },
            { text: "BFC", link: "/HTML/BFC" },
            { text: "包含块", link: "/HTML/包含块" },
            { text: "像素", link: "/HTML/像素" },
            { text: "其他", link: "/HTML/其他" },
          ],
        },
      ],
      CSS: [
        {
          text: "CSS",
          collapsed: true,
          items: [
            { text: "基础知识", link: "/CSS/基础" },
            { text: "scss", link: "/CSS/scss" },
            { text: "canvas", link: "/CSS/canvas" },
            { text: "svg", link: "/CSS/svg" },
          ],
        },
      ],
      JS: [
        {
          text: "JS",
          collapsed: true,
          items: [
            { text: "windowApi", link: "/JS/window" },
            { text: "对象", link: "/JS/对象" },
            { text: "函数", link: "/JS/函数" },
            { text: "数组", link: "/JS/数组" },
            { text: "数字", link: "/JS/数字" },
            { text: "字符串", link: "/JS/字符串" },
            { text: "日期", link: "/JS/日期" },
            { text: "DOM", link: "/JS/DOM" },
            { text: "class", link: "/JS/class" },
          ],
        },
      ],
      React: [
        {
          text: "React",
          items: [
            {
              text: "ts",
              link: "/React/ts",
            },
            {
              text: "hook",
              link: "/React/hook",
            },
            {
              text: "关于",
              link: "/React/other",
            },
          ],
        },
      ],
      Vue: [
        {
          text: "Vue",
          items: [
            {
              text: "指令",
              collapsed: false,
              items: [{ text: "水波纹", link: "/Vue/directives/ripple" }],
            },
            {
              text: "组件",
              collapsed: false,
              items: [
                { text: "🌲树", link: "/Vue/components/tree" },
                { text: "折叠", link: "/Vue/components/collapse" },
                { text: "无限滚动", link: "/Vue/components/scrollList" },
                { text: "无限滚动2", link: "/Vue/components/InfiniteScroll" },
                { text: "轮播", link: "/Vue/components/swipper" },
                { text: "图片预览", link: "/Vue/components/imgPreview" },
                { text: "水印", link: "/Vue/components/watermark" },
                { text: "tab", link: "/Vue/components/tab" },
                { text: "drag", link: "/Vue/components/drag" },
                { text: "虚拟滚动", link: "/Vue/components/虚拟滚动" },
                { text: "flip", link: "/Vue/components/flip" },
                { text: "日历", link: "/Vue/components/日历" },
                { text: "剪裁图片", link: "/Vue/components/剪裁图片" },
                { text: "上传图片", link: "/Vue/components/上传图片" },
                { text: "放大镜", link: "/Vue/components/放大镜" },
                { text: "日期选择器", link: "/Vue/components/日期选择器" },
                { text: "🎠countTo", link: "/Vue/components/countTo" },
              ],
            },
            {
              text: "插件",
              collapsed: false,
              items: [
                { text: "Lazy", link: "/Vue/plugins/lazy" },
                { text: "loading", link: "/Vue/plugins/loading" },
              ],
            },
            {
              text: "函数",
              collapsed: false,
              items: [
                { text: "clickOutSide", link: "/Vue/functions/clickOutSide" },
                { text: "消息条", link: "/Vue/functions/snackBar" },
                { text: "useStorage", link: "/Vue/functions/useStorage" },
                { text: "useFetch", link: "/Vue/functions/useFetch" },
              ],
            },
            { text: "其他", link: "/Vue/other" },
          ],
        },
      ],
      nest: [
        { text: "nest", link: "/nest/nest/index" },
        { text: "typeorm", link: "/nest/helper/typeorm" },
        { text: "swagger", link: "/nest/helper/swagger" },
        { text: "校验", link: "/nest/helper/校验" },
        { text: "jwt", link: "/nest/helper/jwt" },
        { text: "config", link: "/nest/helper/config" },
      ],
      backend: [
        {
          text: "后端",
          collapsed: true,
          items: [
            { text: "node", link: "/backend/node" },
            { text: "promise", link: "/backend/promise" },
            { text: "Cookie/session/jwt", link: "/backend/jwt" },
            { text: "任务队列", link: "/backend/任务队列" },
            { text: "加密", link: "/backend/加密" },
            { text: "mock", link: "/backend/mock" },
          ],
        },
      ],
      java: [
        { text: "基础", link: "/java/base" },
        {
          text: "api",
          collapsed: true,
          items: [
            { text: "class", link: "/java/api/class" },
            { text: "时间", link: "/java/api/date" },
            { text: "数字", link: "/java/api/number" },
            { text: "数组", link: "/java/api/array" },
            { text: "字符串", link: "/java/api/string" },
            { text: "错误", link: "/java/api/错误" },
            { text: "集合", link: "/java/api/集合" },
          ],
        },
      ],
      skill: [
        {
          text: "其他",
          collapsed: true,
          items: [
            { text: "html技巧", link: "/skill/html" },
            { text: "js技巧", link: "/skill/js" },
            { text: "网络", link: "/skill/网络" },
            { text: "正则", link: "/skill/正则" },
            { text: "设计模式", link: "/skill/设计模式" },
            { text: "代码规范", link: "/skill/代码规范" },
            { text: "git", link: "/skill/git" },
            { text: "快捷键", link: "/skill/快捷键" },
            { text: "英语", link: "/skill/英语" },
            { text: "面试", link: "/skill/面试" },
          ],
        },
      ],
      "source/vue": [
        {
          text: "",
          collapsed: true,
          items: [
            { text: "reactive原理", link: "/source/vue/reactive" },
            { text: "ref原理", link: "/source/vue/ref" },
            { text: "computed原理", link: "/source/vue/computed" },
            { text: "watch原理", link: "/source/vue/watch" },
            { text: "h", link: "/source/vue/h" },
            { text: "renderer", link: "/source/vue/renderer" },
            { text: "render", link: "/source/vue/render" },
            { text: "组件", link: "/source/vue/component" },
            { text: "生命周期", link: "/source/vue/lifecycle" },
            { text: "插槽", link: "/source/vue/slots" },
            { text: "异步组件", link: "/source/vue/defineAsyncComponent" },
            { text: "provide/inject", link: "/source/vue/provide" },
            { text: "keepAlive", link: "/source/vue/keepAlive" },
          ],
        },
      ],
    },
    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
    search: {
      provider: "algolia",
      options: {
        appId: "TOPK106WWZ",
        apiKey: "50b82dd45925c0f9623ca6461c459a40",
        indexName: "tsk",
      },
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/tangtts/learning-blogs" },
      {
        icon: {
          svg: '<svg t="1690806613078" class="icon" viewBox="0 0 1272 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2313" width="36" height="36"><path d="M729.641 165.277l-95.314-75.152-99.563 78.527-5.179 4.16 104.742 83.503 105.09-83.503-9.776-7.535z m361.212 291.472L634.065 816.943l-456.498-359.99-67.442 54.174 523.94 413.118 524.23-413.35-67.442-54.146zM634.065 485.96L385.478 290.006l-67.412 54.117 315.97 249.168 316.29-249.4-67.413-54.146L634.065 485.96z" p-id="2314" fill="#8a8a8a"></path></svg>',
        },
        link: "https://juejin.cn/user/308289423282296",
        ariaLabel: "掘金",
      },
    ],
  },
});
