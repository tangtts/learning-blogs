# watermark
**水印**

## 介绍
和别的地方的水印使用 `canvas` 不同，这里使用 `css` 实现，所以水印的样式可以自定义，并且可以和页面元素一起布局。同时可以使用自定义插槽`name=content`自定义样式

---

原理是获取 `svg`的内容，本身的 `svg` 不需要显示, 然后通过 `createObjectURL` 把内容转换成 `blob`，然后通过 `css` 设置 `background-image` 属性，实现水印。

## 效果

<script setup>
import watermark from "../../../src/components/watermark.vue"
</script>

<watermark>
      abcd
    <template #content>
      <span style="font-size: 20px; color: #7986cb">ABCD</span>
    </template>
</watermark>

## 核心源码
```vue:line-numbers{11,66}
<template>
  <div class="relative h-[200px]">
    <slot/>
      <div 
      class="absolute w-full h-full inset-0 text-gray-200"
      :style="{
        backgroundImage: `url(${watermarkUrl})`,
        zIndex: 10,
        height: '200px'
      }">
      <!-- 不需要显示 -->
        <div ref="svgRef" v-show="false">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            :viewBox="`0 0 ${100} ${100}`" :width="`${100}`" :height="`${100}`" :style="{
              padding: `0 ${0}px ${0}px 0`,
              opacity: 0.5,
            }">
            <foreignObject
            x="0" 
            y="0" 
            :width="100" 
            :height="100">
              <div xmlns="http://www.w3.org/1999/xhtml" :style="{
                transform: `translate(${0}px, ${0}px) rotate(${-22}deg)`,
                transformOrigin: 'center',
              }">
                <!-- 默认值 -->
               <slot name="content">
                  <span :style="{  fontSize: `${14}px`, color: 'red' }">{{content}}</span>
                </slot>
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, reactive, watch, Ref } from "vue";
const watermarkUrl = ref("");

defineProps({
  content:{
    type:String,
    default:"abbr"
  }
})
const svgRef: Ref<SVGElement | null> = ref(null)
function revokeWatermarkUrl() {
  if (watermarkUrl.value) {
    URL.revokeObjectURL(watermarkUrl.value)
  }
}

function svgToBlobUrl(svgStr: string) {
  const svgBlob = new Blob([svgStr], {
    type: 'image/svg+xml',
  })
  return URL.createObjectURL(svgBlob)
}

const resize = async function () {
  // DOM 更新之后才可以获取样式
  await nextTick()
  revokeWatermarkUrl()
  watermarkUrl.value = svgToBlobUrl(svgRef.value!.innerHTML)
}

resize()
</script>
```


