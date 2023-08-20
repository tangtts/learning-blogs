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
               <slot name="content">
                <!-- 默认值 -->
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
import { nextTick, ref, computed, reactive, watch, Ref } from "vue";
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
  await nextTick()
  revokeWatermarkUrl()
  watermarkUrl.value = svgToBlobUrl(svgRef.value!.innerHTML)
}

resize()
</script>

<style lang="scss" scoped></style>
