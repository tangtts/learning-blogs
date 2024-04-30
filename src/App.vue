<template>
  <div>
    {{ count }} - {{ doubleCount }}
    <el-button @click="increment">
      +
    </el-button>

    <el-button @click="decrement2">
      -
    </el-button>
    <div id="abcd">
      {{count}}
    </div>

  </div>
</template>
<script lang="tsx" setup>

import { computed, nextTick, onMounted, ref } from 'vue';



let { value: { count } } = ref({ count: 0 });

// 直接通过包装过的响应式对象修改 count 的值


const decrement2 = ()=>{
  count++;
}



import { createStore } from "@/store"

const { commit, state, getters, dispatch } = createStore({
  state: {
    count: 0,
    age: "111"
  },
  getters: {
    age(state) {
      return state.age
    },
    doubleCount(state) {
      return state.count * 2
    }
  },
  actions: {
    upload({ commit }) {
      commit("increment", 10)
    }
  },
  mutations: {

    increment(state, payload) {
      state.count += payload;
    },

    decrement(state, payload) {
      state.count -= payload
    }
  }
})

const count2 = computed(() => {
  return state.count
})

const doubleCount = computed(() => {
  return getters.doubleCount
})


const increment = () => {
  commit('increment', 1)
  commit('increment', 1)
  commit('increment', 1)
}

const decrement = () => {
  commit('decrement', 1)
  dispatch("upload", 20)
}
</script>
