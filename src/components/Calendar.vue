<template>
  <div class="mt-4">
    <p class="text-2xl text-center leading-7 flex items-center justify-center">
      <span @click="changeMonth(-1)"><el-icon size="40">
          <ArrowLeftBold />
        </el-icon> </span>

    <p class="select-none"> {{ formatData.year }} 年 {{ formatData.month }} 月</p>
    <span @click="changeMonth(+1)"><el-icon size="40">
        <ArrowRightBold />
      </el-icon> </span>
    </p>

    <header class="flex justify-evenly font-bold text-blue-400 h-[50px] items-center">
      <span class="flex-1 text-center" v-for="day of days" :key="day">
        {{ day }}
      </span>
    </header>

    <div class="h-4/5 overflow-y-scroll">
      <div class="flex flex-wrap">
        <div class="date" :class="[
          date.disabled && 'disabled',
          isInclude(date) && 'selected',
          isRange(date) && 'range'
        ]" @click="clickHandler(date)" v-for="date of formatData.date" :key="date.day">
          <p>{{ date.day }} </p>
          <p> {{ getBottomInfo(date) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue"
import { ref, computed } from "vue";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let current = ref(dayjs())
let currentDays = computed(() => current.value.daysInMonth());

type ItemDate = {
  day: number,
  week: number,
  disabled: boolean,
  date: Date,
}


type monthConfig = {
  date: ItemDate[],
  month: number,
  year: number,
};

type Mode = "single" | "range"
let mode: Mode = "range";


const changeMonth = (addOrMinus: number) => {
  current.value = dayjs(current.value).add(addOrMinus, 'month')
}



const isInclude = (date: ItemDate) => {
  return selected.value.includes(dayjs(date.date).format("YYYY-MM-DD"))
}

const isRange = (date: ItemDate) => {
  return selected.value.length == 2 && dayjs(dayjs(date.date).format('YYYY-MM-DD')).isBetween(selected.value[0], selected.value[1])
}

const getBottomInfo = (date: ItemDate) => {
  const d = dayjs(date.date).format("YYYY-MM-DD")
  if (mode == "range" && selected.value.length > 0) {
    if (selected.value[0] == d)
      return "开始"
  }
  if (selected.value.length > 1) {
    if (selected.value[1] == d) {
      return "结束"
    }
  }
}

const selected = ref<string[]>([])
const clickHandler = (date: ItemDate) => {
  if (date.disabled) return
  const innerDate = dayjs(date.date).format("YYYY-MM-DD")
  if (mode == "single") {
    selected.value = [innerDate]
  } else if (mode == "range") {
    // 超过两个
    if (selected.value.length == 0) {
      selected.value = [innerDate]
    } else {
      const existsDate = selected.value[0];
      if (dayjs(innerDate).isBefore(existsDate)) {
        selected.value = [innerDate, selected.value[1]]
      } else if (dayjs(innerDate).isAfter(existsDate)) {
        selected.value = [existsDate, innerDate]
      }
    }
  }
}

const formatData = computed<monthConfig>(() => {
  return ({
    date: Array.from({ length: currentDays.value }, (_, day) => {
      day = day + 1;

      const week = current.value.date(day).day()
      const date = current.value.date(day).format('YYYY-MM-DD');
      let config = {
        day,
        week,
        disabled:
        dayjs().isAfter(
            dayjs(current.value).format('YYYY-MM-DD')
          ,"date"),
        date: new Date(date),
        month: current.value.month() + 1
      }
      return config
    }),
    month: current.value.month() + 1,
    year: current.value.year()
  })
})


</script>

<style lang="scss" scoped>
.date {
  @apply flex p-1 box-border items-center aspect-square justify-center text-lg flex-col hover:cursor-pointer;
  width: calc(100% / 7);

  // disabeld 和 select 不添加 hover 样式
  &:is(.range):hover {
    @apply text-red-100 text-2xl;
  }

}

.disabled {
  @apply bg-slate-200
}

.selected {
  @apply bg-blue-600 hover:bg-blue-700;
}

.range {
  @apply bg-indigo-200 hover:bg-indigo-400
}</style>
