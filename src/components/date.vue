<template>
  <div class="date-picker">
    <el-switch class="ml-4" active-text="单选" inactive-text="多选" size="large" active-value="date" inactive-value="range"
      v-model="dateType"></el-switch>
    <header class="header">
      <div @click="addOrMinus('year', '-')">
        👈🏿👈🏿
      </div>
      <div class="mx-4" @click="addOrMinus('month', '-')">
        👈
      </div>
      <span class="header"> {{ tempTime.year }} 年 / {{
        tempTime.month + 1
      }}月 / {{ tempTime.date }}</span>
      <div class="mx-4" @click="addOrMinus('month', '+')">
        👉
      </div>
      <div @click="addOrMinus('year', '+')">
        👉🏿👉🏿
      </div>
    </header>
    <main>
      <header class="weekContainer">
        <div class="cell week" v-for="(week, index) of weeks" :key="index">
          {{ week }}</div>
      </header>

      <div>
        <div v-for="row of 6" :key="row" class="row">
          <span @click="chooseData(getCurrentDate(row, col))" v-for="col of 7" :key="col" :class="['cell', {
            isRange: dateType == 'range' ? isRange(getCurrentDate(row, col)) : false,
            isActive: dateType == 'range' ? isActive(getCurrentDate(row, col)) : false,
          }]">
            <span :class="['date',
              {
                isCurrentMonth: isCurrentMonth(getCurrentDate(row, col)),
                isToday: isToday(getCurrentDate(row, col)),
                isSelect: dateType == 'date' ? isSelect(getCurrentDate(row, col)) : false,
              }
            ]"> {{ getCurrentDate(row, col).getDate() }}</span>
          </span>
        </div>

      </div>
    </main>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, reactive, watch } from "vue";

const weeks = ["日", "一", "二", "三", "四", "五", "六"];


const defaultDate = ref<Date>(new Date)
type DateType = "date" | "range"
const dateType = ref<DateType>('range')


const getCurrentDate = (row: number, col: number): Date => {
  return visableData.value[(row - 1) * 7 + (col - 1)]
}

const isCurrentMonth = (date: Date) => {
  return tempTime.year == date.getFullYear() && tempTime.month == date.getMonth()
}

const isToday = (date: Date) => {
  const now = new Date();
  return now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth() && now.getDate() == date.getDate()
};

// TODO 单选 / 多选
const isSelect = (date: Date) => {
  return tempTime.year == date.getFullYear() && tempTime.month == date.getMonth() && tempTime.date == date.getDate()
}

const isRange = (date: Date) => {
  let arr = chooseDateArr.value, min = Math.min(...arr), max = Math.max(...arr), time = date.getTime();
  return min <= time && time <= max
}

const isActive = (date: Date) => {
  let arr = chooseDateArr.value, time = date.getTime();
  return arr.includes(time)
}

const addOrMinus = (monthOryear: "month" | "year", addOrMinus: "+" | "-") => {
  let time = new Date(tempTime.year, tempTime.month, tempTime.date);

  type N = `${"year" | "month"}${"+" | "-"}`
  let map = new Map<N, Function>([])
  map.set('year+', function () {
    tempTime.year = time.getFullYear() + 1;
  })
  map.set('year-', function () {
    tempTime.year = time.getFullYear() - 1;
  })

  map.set('month+', function () {
    let m = time.getMonth() + 1;
    const c = time.setMonth(m);
    tempTime.month = new Date(c).getMonth();
  })

  map.set('month-', function () {
    let m = time.getMonth() - 1;
    const c = time.setMonth(m);
    tempTime.month = new Date(c).getMonth();
  })

  let fn = map.get(`${monthOryear}${addOrMinus}`);
  fn?.()
}

let chooseDateArr = ref<number[]>([])

function chooseData(date: Date) {

  const time = date.getTime()
  if (dateType.value == 'date') {
    return defaultDate.value = date
  }

  if (chooseDateArr.value.length == 0) {
    chooseDateArr.value.push(time)
  } else if (chooseDateArr.value.length == 1) {
    // 如果最小值小于 当前传入的值，说明最大值是这个最小值
    let min = chooseDateArr.value.at(0) || 0;
    if (min < time) {
      chooseDateArr.value.push(time)
    } else {
      chooseDateArr.value.unshift(time)
    }
  } else {
    // 已经有两个值了,保证最小值在第一位
    let min = chooseDateArr.value.at(0) || 0;
    if (time < min) {
      chooseDateArr.value.shift()
      chooseDateArr.value.unshift(time)
    } else {
      chooseDateArr.value.pop();
      chooseDateArr.value.push(time);
    }
  }
}

function convertDateToObj(date: Date | string | number) {
  if (typeof date == "string" || typeof date == "number") {
    date = new Date(date);
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate()
  }
};

// 创建一个不断页面切换显示的year,会一直改变
let tempTime = reactive({
  year: convertDateToObj(defaultDate.value).year,
  month: convertDateToObj(defaultDate.value).month,
  date: convertDateToObj(defaultDate.value).date
});

watch(() => defaultDate.value, (newVal) => {
  tempTime.year = convertDateToObj(newVal).year;
  tempTime.month = convertDateToObj(newVal).month;
  tempTime.date = convertDateToObj(newVal).date;
})


let timeArr: Date[] = []
const ONE_DAY_TIME = 24 * 60 * 60 * 1000;

let visableData = computed(() => {
  // 直接循环 42 个
  timeArr = []
  let times = new Date(tempTime.year, tempTime.month, tempTime.date);
  let year = times.getFullYear()
  let month = times.getMonth();
  // 1号是周几
  let currentMonthFirstDay = new Date(year, month, 1)
  // 当前月第一天是周几
  let currentMonthFirstDayDate = currentMonthFirstDay.getDay() ?? 7;
  // 当前月第一天的毫秒数
  let currentMonthFirstDayTime = currentMonthFirstDay.getTime();

  // 向前推这么多天
  let frontDays = currentMonthFirstDayTime - currentMonthFirstDayDate * ONE_DAY_TIME;

  for (let i = 0; i < 42; i++) {
    timeArr.push(new Date(frontDays + i * ONE_DAY_TIME))
  }
  return timeArr
});
</script>
<style lang="scss" scoped>
.date-picker {
  @apply w-[700px] m-auto shadow-lg shadow-blue-500 box-border rounded-lg py-4;

  .header {
    @apply select-none flex justify-center py-4 items-center text-gray-500 font-bold text-lg;
  }

  .icon {
    @apply w-[38px] inline-block cursor-pointer px-2;
  }

  .weekContainer {
    @apply flex justify-evenly items-center py-2;
  }

  .row {
    @apply flex justify-evenly items-center;
  }

  .cell {
    @apply text-black text-center text-lg flex-1 h-[40px] flex cursor-pointer justify-center items-center;

    &.isRange {
      @apply rounded-none bg-gray-200;
    }

    &.isActive {
      @apply bg-blue-200;
    }

    .date {

      @apply w-[40px] aspect-square flex items-center justify-center;

      &:not(.isCurrentMonth) {
        @apply text-gray-400;
      }

      &.week {
        @apply cursor-pointer text-black;
      }

      &.isToday {
        @apply rounded-full text-blue-500 font-bold;
      }

      &.isSelect {
        @apply bg-blue-400 text-white rounded-full;
      }

      // 只有是当前月才有 hover 效果
      &:hover:is(.isCurrentMonth):not(.isSelect) {
        @apply text-blue-300;
      }
    }
  }
}
</style>
