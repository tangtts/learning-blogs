declare module "vuex" {
  const commit: (type: string, payload: any) => void;
  const state: any
  export {
    commit,
    state
  }
}

// declare module "@vue/runtime-core" {
//   interface ComponentCustomOptions {
//     store?: Store<any>;
//   }
// }