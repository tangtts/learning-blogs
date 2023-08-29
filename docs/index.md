---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "🦆 好大鸭"
  text: "TSK 个人博客"
  tagline: 📓 记录知识, 记录成长
  actions:
    - theme: brand
      text: 🦌 前端
      link: /HTML/标签
    - theme: alt
      text: 🔥 后端
      link: /backend/node
  image:
    src: /B.Duck.svg
    alt: 网页的logo图标
features:
  - icon: 🛠️
    title: 💻 前端
    link: /HTML/标签
    details: 🟧HTML、🟥CSS、🟨JS、🟦TS、🟩VUE、REACT ...

  - icon: ⚽
    title: 💾 后端
    link: /backend/node
    details: 🚀 Nest、🐬Mysql、🥦Redis...
  - icon: 🔥
    title: ❤️ 其他
    link: /skill/html
    details:  设计模式，代码规范，函数编程...
---

<style>
:root {
  --activeColor:#5672cd;
  --vp-c-green:var(--activeColor);
  --vp-button-brand-active-bg:var(--activeColor);
  --vp-button-brand-hover-bg:var(--activeColor);
  --vp-custom-block-tip-text:var(--activeColor);
  --vp-c-green:var(--activeColor);
  --vp-c-green-lighter:var(--activeColor);
  --vp-button-brand-bg:var(--activeColor);
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, var(--activeColor) 30%, #ccc);
  --vp-home-hero-image-background-image: linear-gradient(to top, #fee023 30%, #ebe9e07d 50%);
  --vp-home-hero-image-filter: blur(60px);
}
</style>