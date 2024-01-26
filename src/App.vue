<template>
  <div>
    {{ count }} - {{doubleCount}}
    <el-button @click="increment">
      +
    </el-button>

    <el-button @click="decrement">
      -
    </el-button>
    <div id="abcd">

    </div>

  </div>
</template>
<script lang="tsx" setup>

import { computed,nextTick,onMounted } from 'vue';



import { createStore } from "@/store"

const { commit, state, getters,dispatch } = createStore({
  state: {
    count: 0,
    age: "111"
  },
  getters:{
    age(state){
      return state.age
    },
    doubleCount(state){
      return  state.count * 2
    }
  },
  actions:{
    upload({commit}){
      commit("increment",10)
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

const count = computed(() => {
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
  dispatch("upload",20)
}
</script>
