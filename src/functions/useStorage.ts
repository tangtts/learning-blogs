import {
  computed,
  ComputedRef,
  getCurrentInstance,
  isReactive,
  Ref,
  ref,
  toRaw,
  toRefs,
  watch,
} from "vue";
export type Config = {
  type: "localStorage" | "sessionStorage";
  prefix: string;
  expire: number;
};
export type StoreStorage = {
  key: string;
  val: { value: string; time: number; expire: number };
};
interface IStorage {
  setStorage(key: string, value: any, expire: number): void;
  getStorage(key: string): void;
  getAllStorage: ComputedRef<StoreStorage[]>;
  autoAddPrefix(k: string): string;
  removeStorage(k: string): void;
  clearStorage(): void;
  hasStorage(k: string): boolean;
  getStorageLength(): number;
}

export function useStorage(
  options: Config = { type: "localStorage", prefix: "", expire: 1 }
): IStorage {
  options = isReactive(options) ? toRaw(options) : options;

  let defaultConfig: Config = {
    type: "localStorage",
    prefix: "",
    expire: 1,
  };

  options = { ...defaultConfig, ...options };
  const storeArrRef = ref<StoreStorage[]>([]);

  /**
   * @description 设置stoage
   * @param {string} key  - 键值
   * @param {any} value
   * @param {number} expire - 过期时间
   * @example storage.setStorage("a",12)
   * @returns {string | null}
   */

  function setStorage(key: string, value: any, expire: number = 0): void {
    if (value === "" || value === null || value === undefined) {
      value = null;
    }
    if (expire && (isNaN(expire) || expire < 1))
      throw new Error("Expire must be a number");

    (expire ??= options.expire) * 1000;
    let data = {
      value, // 存储值
      time: Date.now(), //存值时间戳
      expire, // 过期时间
    };

    window[options.type].setItem(key, JSON.stringify(data));
    // 如果有最新的相同key值，替换原来的data
    let old = storeArrRef.value.findIndex(k => k.key == key);
    if (old == -1) {
      storeArrRef.value.push({ key, val: data });
    } else {
      storeArrRef.value[old] = { key, val: data };
    }
  }

  /**
   * @description 获取单个Key,没有直接返回null
   * @example storage.getStorage("a")
   * @returns {string | null}
   */
  function getStorage(key: string) {
    // key 不存在判断
    if (
      !window[options.type].getItem(key) ||
      JSON.stringify(window[options.type].getItem(key)) === "null"
    ) {
      return null;
    }
    // 优化 持续使用中续期
    const storage = JSON.parse(window[options.type].getItem(key)!);
    let nowTime = Date.now();
    // 只要当前时间 大于 当时保存的时间 + 过期时间 说明过期
    // 时间戳与 秒 相差 1000
    if (storage.expire && storage.time + options.expire * 1000 < nowTime) {
      removeStorage(key);
      return null;
    } else {
      // 未过期期间被调用 则自动续期 进行保活
      setStorage(key, storage.value, storage.expire);
      return storage.value;
    }
  }

  const getAllStorage = computed(() => {
    let len = window[options.type].length;
    storeArrRef.value = [];
    for (let i = 0; i < len; i++) {
      // 获取key 索引从0开始
      let getKey = window[options.type].key(i);
      // 获取key对应的值
      if (getKey) {
        let getVal = window[options.type].getItem(getKey)!;
        try{
          storeArrRef.value.push({ key: getKey, val: JSON.parse(getVal) });
        }catch {

        }
      }
    }

    return storeArrRef.value;
  });

  function autoAddPrefix(key: string) {
    const prefix = options.prefix ?? "";
    return prefix + key;
  }

  function removeStorage(key: string) {
    window[options.type].removeItem(autoAddPrefix(key));
    storeArrRef.value = storeArrRef.value.filter(item => item.key !== key);
  }

  function clearStorage() {
    window[options.type].clear();
    storeArrRef.value = [];
  }

  function hasStorage(k: string) {
    if (window[options.type].getItem(k)) {
      return true;
    }
    return false;
  }

  function getStorageLength() {
    return storeArrRef.value.length || window[options.type].length;
  }

  return {
    setStorage,
    getStorage,
    getAllStorage,
    autoAddPrefix,
    removeStorage,
    clearStorage,
    hasStorage,
    getStorageLength,
  };
}
