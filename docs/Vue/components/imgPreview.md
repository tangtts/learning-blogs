# 图片预览函数式组件


可以添加 `mask`

## 使用
```vue
<script setup>
import { computed, ref, unref } from 'vue';
import {previewImage} from "../../../src/components/imgPreview/index"
const imgs = [
  "https://varlet.gitee.io/varlet-ui/varlet_icon.png",
  "https://varlet.gitee.io/varlet-ui/cat.jpg",
  "https://varlet.gitee.io/varlet-ui/cat2.jpg",
  "https://varlet.gitee.io/varlet-ui/cat3.jpg",
];
// 为了演示避免重复
let prev = -1;
function random():number{
  let now = Math.floor(Math.random()*(imgs.length));
  if(prev == now){
    return random();
  }else {
    prev = now
    return now
  }
};
</script>
<template>
  <div class="imgPreviewContainer">
    <el-button type="warning" @click="previewImage(imgs[random()])">点击</el-button>
  </div>
</template>
```

<script setup>
import { computed, ref, unref } from 'vue';
import {previewImage} from "../../../src/components/imgPreview/index"
const imgs = [
  "https://varlet.gitee.io/varlet-ui/varlet_icon.png",
  "https://varlet.gitee.io/varlet-ui/cat.jpg",
  "https://varlet.gitee.io/varlet-ui/cat2.jpg",
  "https://varlet.gitee.io/varlet-ui/cat3.jpg",
];
let prev = -1;
function random(){
  let now = Math.floor(Math.random()*imgs.length);
  if(prev == now){
    random();
  }
  prev = now
  return now
}
</script>
<div class="imgPreviewContainer">
    <el-button class="mb-2" type="warning" @click="previewImage(imgs[random()])">点击</el-button>
</div>

## 解析
重点在于 `mgPreview/index` 中的 `previewImage`方法  
1. 引入 `Preview` 组件
2. 通过 `mountInstance` 生成实例，并返回 `unmounted` 方法，方便以后卸载当前实例
3. 通过使用响应式数据 `show` 改变 `Preview` 组件的显示隐藏
4. 通过 `teleport` 将 `Preview` 组件挂载到 `body` 节点下
   
:::tip 🚀🚀🚀
  重点在于 `mountInstance` 生成实例，并返回 `unmounted` 方法，方便以后卸载当前实例
:::  

## 源码
```ts:line-numbers
import { Component, TeleportProps } from "vue";
import Preview from "./index.vue";
import {h,reactive,createApp } from "vue"

interface MountInstance {
  instance: Component;
  unmount: () => void;
}

type ImagePreviewOptions = {
  url: string;
  show?: boolean;
  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
  teleport?: TeleportProps["to"];
};

function mount(component: Component): MountInstance {
  const app = createApp(component);
  const host = document.createElement("div");
  // 为了满足 vitepress
  const container = document.querySelector('.imgPreviewContainer') || document.body
  container.appendChild(host);

  return {
    instance: app.mount(host),
    unmount() {
      app.unmount();
      container.removeChild(host);
    },
  };
}

function mountInstance(
  component: Component,
  props: Record<string, any> = {},
  eventListener: Record<string, any> = {}
) {
  const Host = {
    setup() {
      return () =>
        h(component, {
          ...props,
          ...eventListener,
        });
    },
  };
  const { unmount } = mount(Host);
  return {
    unmountInstance: unmount,
  };
}

const reactiveImagePreviewOptions: ImagePreviewOptions = reactive({
  url: "",
  show: false,
  teleport: document.querySelector('.imgPreviewContainer') || "body",
});

export function previewImage(url: string) {
  // 先把上一次的卸载掉
  previewImage.close();
  reactiveImagePreviewOptions.url = url;
  const { unmountInstance } = mountInstance(
    Preview,
    reactiveImagePreviewOptions,
    {
      onClosed: () => {
        unmountInstance();
      },
    }
  );
  // 挂载上一次的 unmountInstance
  reactiveImagePreviewOptions.onClose = unmountInstance;
  reactiveImagePreviewOptions.show = true;
}

previewImage.close = function () {
  reactiveImagePreviewOptions.show = false;
  // 第一次没有closed 方法
  reactiveImagePreviewOptions.onClose?.();
};
```
