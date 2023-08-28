# useLocalStorage

[🔗vueuse-useLocalStorage](https://vueuse.org/core/useLocalStorage/)

> 基于 [localeStorage/sessionStorage] 封装的本地存储 hook


## 功能

1. 对 `localStorage` 或者 `sessionStorage` 进行操作
2. 设置 `setStorage`,使用 `prefix` 添加前缀，使用 `expire` 设置过期时间
3. 获取单个 `getStorage`,获取所有 `getAllStorage`,`getStorage`获取的时候，可以判断是否过期，如果过期直接删除,如果没有过期，自动续期，进行保活
4. 判断是否有 `hasStorage`
5. 删除 `removeStorage`

## 思路

主要是过期时间当使用 `setStorage`的时候，会判断参数是否有 `expire` 属性, 如果没有的话,`expire` 设置为 0,如果有的话，`expire`设置为 `expire * 1000` 即 `(expire ??= options.expire) * 1000;`存储的数据结构为

```js
let data = {
      value, // 存储值
      time: Date.now(), //存值时间戳
      expire, // 过期时间
    };
```

当使用 `getStorage` 获取值的时候,获取当前时间戳，如果当前时间戳大于过期时间，则删除，否则，续期，即 `time = Date.now();`,如果小于,则进行重置过期时间

```ts
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
```
## 源码
<<< ../../../src/functions/useStorage.ts
