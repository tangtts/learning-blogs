import { defineStore } from "./createStore";

export const useCounterStore = defineStore("name",{
  state:()=>{
    return {
      counter:0
    }
  },
  getters:{
    doubleCount(){
      return this.counter * 2
    }
  },
  actions:{
    add(){
      this.counter++
    }
  }
})