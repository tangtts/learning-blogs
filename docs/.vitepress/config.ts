import { defineConfig } from "vitepress";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "「🦆TSK的博客」",
  description: "tsk Blog",
  head: [["link", { rel: "icon", href: "/vue.svg" }]],
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
        ],
      },
      {
        text: "后端",
        items: [
          {text:"node",link:"/backend/node"},
          {text:"promise",link:"/backend/promise"},
          {text:"Cookie/session/jwt",link:"/backend/jwt"},
          {text:"任务队列",link:"/backend/任务队列"},
        ],
      },
      {
        text: "其他",
        items: [
          { text: "html技巧", link: "/skill/html" },
          { text: "js技巧", link: "/skill/js" },
          { text: "正则", link: "/skill/正则" },
          { text: "代码规范", link: "/skill/代码规范" },
          { text: "git", link: "/skill/git" },
          { text: "快捷键", link: "/skill/快捷键" },
        ],
      },
      {text:"算法",link:"/algorithm/算法"},
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
            { text: "浏览器", link: "/JS/浏览器" },
            { text: "对象", link: "/JS/对象" },
            { text: "函数", link: "/JS/函数" },
            { text: "数组", link: "/JS/数组" },
            { text: "数字", link: "/JS/数字" },
            { text: "字符串", link: "/JS/字符串" },
            { text: "日期", link: "/JS/日期" },
          ],
        },
      ],
      backend:[
        {
          collapsed: true,
          text: "后端",
          items:[
            {text:"node",link:"/backend/node"},
            {text:"promise",link:"/backend/promise"},
            {text:"Cookie/session/jwt",link:"/backend/jwt"},
            {text:"任务队列",link:"/backend/任务队列"},
          ],
        }
      ],
      skill: [
        {
          collapsed: true,
          text: "其他",
          items: [
            { text: "html技巧", link: "/skill/html" },
            { text: "js技巧", link: "/skill/js" },
            { text: "正则", link: "/skill/正则" },
            { text: "代码规范", link: "/skill/代码规范" },
            { text: "git", link: "/skill/git" },
            { text: "快捷键", link: "/skill/快捷键" },
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
      { icon:{
        svg:'<svg t="1690806613078" class="icon" viewBox="0 0 1272 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2313" width="36" height="36"><path d="M729.641 165.277l-95.314-75.152-99.563 78.527-5.179 4.16 104.742 83.503 105.09-83.503-9.776-7.535z m361.212 291.472L634.065 816.943l-456.498-359.99-67.442 54.174 523.94 413.118 524.23-413.35-67.442-54.146zM634.065 485.96L385.478 290.006l-67.412 54.117 315.97 249.168 316.29-249.4-67.413-54.146L634.065 485.96z" p-id="2314" fill="#8a8a8a"></path></svg>'
      }, link: "https://juejin.cn/user/308289423282296",ariaLabel:"掘金" },
    ],
  },
});
