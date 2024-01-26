import { reactive } from "vue";


type StoreOtpions<T> = {
  state?: T
  mutations?: Record<string, (s: T, payload: any) => void>,
  actions?: Record<string, (s: Store<T>,payload?:any) => void>,
  getters?: Record<string, (s: T, getters: StoreOtpions<T>["getters"]) => void>
}

export function createStore<T>(options: StoreOtpions<T> = {}) {
  return new Store<T>(options)
}

function partial(fn, arg) {
  return function () {
    return fn(arg)
  }
}

class Store<T> {
  _state: {
    data: any
  } = {
      data: {}
    };

  _mutations: StoreOtpions<T>["mutations"][] | Record<string, []> = [];
  _actions: StoreOtpions<T>["actions"][] | Record<string, []> = [];

  _wrappedGetters: Record<string,(s:this,getters:StoreOtpions<T>["getters"])=>void>;

  getters:StoreOtpions<T>["getters"]

  constructor(options) {
    this._mutations = Object.create(null)
    this._actions = Object.create(null)
    this._wrappedGetters = Object.create(null)

    const store = this

    const { commit,dispatch } = this;

    this.commit = function boundCommit(type, payload) {
      return commit.call(store, type, payload)
    }

    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload)
    }

    this._state.data = reactive(options.state || {})

    Object.entries(options.mutations).forEach(([fnName, fnValue]) => {
      this.registerMutation(store, fnName, fnValue)
    })

    Object.entries(options.actions).forEach(([fnName, fnValue]) => {
      this.registerAction(store, fnName, fnValue)
    })


    Object.entries(options.getters).forEach(([key, fnValue]) => {
      this.registerGetter(store, key, fnValue)
    })

    this.resetStoreState(store)
  }

  resetStoreState(store){
    store.getters = {}
    const wrappedGetters = store._wrappedGetters
    const computedObj = {}
    const computedCache = {}

    Object.entries(wrappedGetters).forEach(([key,fn])=>{

      computedObj[key] = partial(fn, store)
      console.log("🚀 ~ Store<T> ~ Object.entries ~ computedObj[key]:", computedObj[key]);
      // computedObj[key] = fn(store)
      computedCache[key] = computed(() => computedObj[key]())

      Object.defineProperty(store.getters, key, {
        get: () => computedCache[key].value,
        enumerable: true
      })
    })
  }

  registerGetter(store: Store<T>, key, handler) {

    store._wrappedGetters[key] = function wrappedGetter(store) {
      return handler(store.state, store.getters)
    }
  }

  registerAction(store, type, handler,){
    const entry = store._actions[type] || (store._actions[type] = []);
    entry.push(function wrappedActionHandler (payload) {
      let res = handler.call(store, {
        dispatch: store.dispatch,
        commit: store.commit,
        getters: store.getters,
        state: store.state,
      }, payload)

      if(!res || typeof res.then !== "function"){
        res = Promise.resolve(res)
      }
    })
  }

  registerMutation(store: Store<T>, type, handler) {

    const entry = this._mutations[type] || (this._mutations[type] = [])

    entry.push(function wrappedMutationHandler(payload) {
      handler.call(store, store.state, payload)
    })
  }

  
  get state() {
    return this._state.data
  }

  dispatch(type, payload){
    const entry = this._actions[type]

    if (!entry) {
      return
    }

    const result = entry.length > 1
    ? Promise.all(entry.map(handler => handler(payload)))
    : entry[0](payload)

    return new Promise((resolve) => {
      result.then(res => {
        resolve(res)
      })
    })
  }

  commit(type, payload) {
    const entry = this._mutations[type]

    if (!entry) {
      return
    }

    entry.forEach(function commitIterator(handler) {
      handler(payload)
    })

  }
}