# 其他
**收录vue中的小知识点**

---

- 动态数组class
  ```raw
   :class="[
        currentTab == i - 1 && ['bg-red-200 text-blue-800'] //[!code ++]
    ]"
  ```
- setup 指令
  ```raw
  import vWatermask from "./plugins/watermask";
  <div v-watermask="a"></div>
  ```