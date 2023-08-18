import { defineConfig } from "vitepress";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "「🦆TSK的博客」",
  description: "tsk Blog",
  head: [
    ["link", { rel: "icon", href: "/vue.svg" }], 
    ['link', { rel: 'stylesheet', href:'https://unpkg.com/tailwindcss@2.0.4/dist/tailwind.min.css' }]
  ],
  themeConfig: {
    outline: "deep",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "前端",
        items: [
          { text: "HTML", link: "/HTML/标签" },
          { text: "CSS", link: "/CSS/基础" },
          { text: "JS", link: "/JS/window" },
          { text: "TS", link: "/TS/index" },
          { text: "Vue", link: "/Vue/directives/ripple" },
        ],
      },
      {
        text: "后端",
        items: [
          { text: "node", link: "/backend/node" },
          { text: "promise", link: "/backend/promise" },
          { text: "Cookie/session/jwt", link: "/backend/jwt" },
          { text: "任务队列", link: "/backend/任务队列" },
          { text: "加密", link: "/backend/加密" },
        ],
      },
      {
        text: "其他",
        items: [
          { text: "html技巧", link: "/skill/html" },
          { text: "js技巧", link: "/skill/js" },
          { text: "网络", link: "/skill/网络" },
          { text: "正则", link: "/skill/正则" },
          { text: "设计模式", link: "/skill/设计模式" },
          { text: "代码规范", link: "/skill/代码规范" },
          { text: "git", link: "/skill/git" },
          { text: "快捷键", link: "/skill/快捷键" },
          {
            text: "",
            items: [{ text: "uview源码", link: "/source/uview/index" }],
          },
        ],
      },
      {
        text: "算法",
        items: [
          { text: "数组", link: "/algorithm/数组" },
          { text: "hash", link: "/algorithm/hash" },
          { text: "回溯", link: "/algorithm/回溯" },
          { text: "动态规划", link: "/algorithm/动规" },
          { text: "单调栈", link: "/algorithm/单调栈" },
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
          ],
        },
      ],
      JS: [
        {
          collapsed: true,
          text: "JS",
          items: [
            { text: "windowApi", link: "/JS/window" },
            { text: "对象", link: "/JS/对象" },
            { text: "函数", link: "/JS/函数" },
            { text: "数组", link: "/JS/数组" },
            { text: "数字", link: "/JS/数字" },
            { text: "字符串", link: "/JS/字符串" },
            { text: "日期", link: "/JS/日期" },
            { text: "DOM", link: "/JS/DOM" },
          ],
        },
      ],
      Vue: [
        {
          collapsed: true,
          text: "Vue",
          items: [
            {
              text: "指令",
              items: [{ text: "水波纹", link: "/Vue/directives/ripple" }],
            },
            {
              text: "组件",
              items: [
                { text: "树", link: "/Vue/components/tree" },
                { text: "折叠", link: "/Vue/components/collapse" },
                { text: "无限滚动", link: "/Vue/components/scrollList" },
              ],
            },
            {
              text: "插件",
              items: [
                { text: "Lazy", link: "/Vue/plugins/lazy" },
                { text: "loading", link: "/Vue/plugins/loading" },
              ],
            },
            {
              text: "函数",
              items: [
                { text: "clickOutSide", link: "/Vue/functions/clickOutSide" },
              ],
            },
          ],
        },
      ],
      backend: [
        {
          collapsed: true,
          text: "后端",
          items: [
            { text: "node", link: "/backend/node" },
            { text: "promise", link: "/backend/promise" },
            { text: "Cookie/session/jwt", link: "/backend/jwt" },
            { text: "任务队列", link: "/backend/任务队列" },
            { text: "加密", link: "/backend/加密" },
          ],
        },
      ],
      skill: [
        {
          collapsed: true,
          text: "其他",
          items: [
            { text: "html技巧", link: "/skill/html" },
            { text: "js技巧", link: "/skill/js" },
            { text: "网络", link: "/skill/网络" },
            { text: "正则", link: "/skill/正则" },
            { text: "设计模式", link: "/skill/设计模式" },
            { text: "代码规范", link: "/skill/代码规范" },
            { text: "git", link: "/skill/git" },
            { text: "快捷键", link: "/skill/快捷键" },
          ],
        },
      ],
      "source/uview": [
        {
          collapsed: true,
          text: "源码",
          items: [
            {
              text: "uview",
              items: [{ text: "起步", link: "/source/uview/index" }],
            },
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
