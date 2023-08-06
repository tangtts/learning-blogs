import {
  App,
  Component,
  DirectiveBinding,
  h,
  ObjectDirective,
  ref,
  Transition,
  withDirectives,
  vShow,
  createApp,
  nextTick,
} from "vue";

interface Option {
  text?: string;
  fullscreen?: boolean;
  background?: string;
  customClass?: string;
  duration?: number;
  target?: Element | string;
  onClose?: Function;
}

interface HTMLElementWidthClose extends HTMLElement {
  close: Function;
}

// 服务形式
function Loading(option: Option) {
  let resolvedOption = resolveOption(option);

  // 格式化 option
  function resolveOption(
    option: Option
  ): Required<Option>{
    return {
      text: option.text ?? "loading",
      fullscreen: option.fullscreen ?? false,
      background: option.background ?? "rgba(0,0,0,0.5)",
      customClass: option.customClass ?? "",
      duration: option.duration ?? 400,
      target: option.target || '',
      onClose: option.onClose ?? (() => {}),
    };
  }

  // 创建实例
  function crateInstance() {
    // 如果没有就是 el
    const afterLeaveFlag = ref(true);
    let afterLeaveTimer: number;

    const handleAfterLeave = () => {
      afterLeaveFlag.value = false;
      loadingInstance.unmount();
      vm.$el?.parentNode?.removeChild(vm.$el);
    };

    const close = () => {
      afterLeaveFlag.value = true;
      clearTimeout(afterLeaveTimer);
      resolvedOption.onClose();
      afterLeaveTimer = window.setTimeout(
        handleAfterLeave,
        resolvedOption.duration
      );
    };

    const elLoadingComponent: Component = {
      setup: () => {
        return () => {
          const spinnerText = h("p", [resolvedOption.text]);
          const spinner = h(
            "svg",
            {
              class: "circular",
              viewBox: "0 0 50 50",
            },
            [
              h("circle", {
                class: "path",
                cx: "25",
                cy: "25",
                r: "20",
                fill: "none",
              }),
            ]
          );
          return h(
            Transition,
            {
              name: "fade",
              onAfterLeave: handleAfterLeave,
            },
            {
              default: () =>
                withDirectives(
                  h(
                    "div",
                    {
                      class: [resolvedOption.customClass, "mask"],
                    },
                    [spinner, spinnerText]
                  ),
                  [[vShow, afterLeaveFlag]]
                ),
            }
          );
        };
      },
    };

    const loadingInstance = createApp(elLoadingComponent);
    const vm = loadingInstance.mount(document.createElement("div"));

    nextTick(() => {
      if (typeof resolvedOption.target == "string") {
        let parent = document.querySelector(resolvedOption.target);
        if (parent) {
          parent.appendChild(vm.$el);
        }
      }else {
        resolvedOption.target.appendChild(vm.$el);
      }
    });

    return {
      close,
    };
  }

  function add(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value !== true) return;
    resolvedOption.target = el;
    const { close } = crateInstance();
    (el as any).close = close;
  }

  function update(el: HTMLElementWidthClose, binding: DirectiveBinding) {
    if (binding.value == false) {
      el.close?.();
    } else {
      resolvedOption.target = el;
      crateInstance();
    }
  }

  return {
    add,
    update,
    crateInstance,
  };
}

const loading = {
  install: function (app: App, option: Option) {
    const loading = Loading(option);
    app.directive("load", {
      mounted: loading.add.bind(loading),
      updated: loading.update.bind(loading),
    });
  },
};

export { Loading };

export default loading;
