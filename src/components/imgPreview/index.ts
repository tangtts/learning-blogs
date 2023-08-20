import { Component, TeleportProps } from "vue";
import Preview from "./index.vue";
import {h,reactive,createApp } from "vue"

interface MountInstance {
  instance: Component;
  unmount: () => void;
}

export function mount(component: Component): MountInstance {
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

type ImagePreviewOptions = {
  url: string;
  show?: boolean;
  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
  teleport?: TeleportProps["to"];
};

const reactiveImagePreviewOptions: ImagePreviewOptions = reactive({
  url: "",
  show: false,
  teleport: document.querySelector('.imgPreviewContainer') || "body",
});
export function previewImage(url: string) {
  previewImage.close();
  // 用户传递的默认数据

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
  reactiveImagePreviewOptions.onClose = unmountInstance;
  reactiveImagePreviewOptions.show = true;
}

previewImage.close = function () {
  reactiveImagePreviewOptions.show = false;
  reactiveImagePreviewOptions.onClose?.();
};
