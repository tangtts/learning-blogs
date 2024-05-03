import { getCurrentInstance, reactive, inject, watch } from "vue";

function isObject(value) {
  return typeof value === "object" && value !== null;
}
function merge(target, partialState) {
  for (const key in partialState) {
    const targetValue = target[key];
    const subPatch = partialState[key];
    if (isObject(targetValue) && isObject(subPatch)) {
      target[key] = merge(targetValue, subPatch);
    } else {
      target[key] = subPatch; // 如果不需要合并直接用新的覆盖掉老的即可
    }
  }
  return target;
}


import { PiniaSymbol } from ".";
export function defineStore(id, options) {
  return function () {
    // 判断是否有 store
    let currentInstance = getCurrentInstance();
    const pinia = currentInstance && (inject(PiniaSymbol) as any);

    if (!pinia._s.has(id)) {
      const { state, actions, getters = {} } = options;

      const localState = reactive(state() || {});

      const partialStore = {
        $patch: function (partialStateOrMutator) {
          if (typeof partialStateOrMutator === "function") {
            partialStateOrMutator(localState); // 将当前的store的状态传递到函数中
          } else {
            merge(localState, partialStateOrMutator);
          }
        },
        $subscribe(callback) {
          watch(localState, (state) => {
            callback({ id }, state);
          });
        },
      };

      const mergeStore = Object.assign(
        localState,
        partialStore,

        actions,
        Object.keys(getters).reduce((computeds, getterKey) => {
          computeds[getterKey] = computed(() => {
            const store = pinia._s.get(id); // 当前的store
            return getters[getterKey].call(store);
          });
          return computeds;
        }, {})
      );

      pinia._s.set(id, mergeStore);
    }
    return pinia._s.get(id);
  };
}
