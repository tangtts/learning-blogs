import { MaybeRef, Stoppable } from "../functions/useFetch2/types";
import { WatchOptions, WatchSource } from "vue";

export type EventHookOn<T = any> = (fn: (param: T) => void) => {
  off: () => void;
};
export type EventHookOff<T = any> = (fn: (param: T) => void) => void;
export type EventHookTrigger<T = any> = (param: T) => Promise<unknown[]>;

export interface EventHook<T = any> {
  on: EventHookOn<T>;
  off: EventHookOff<T>;
  trigger: EventHookTrigger<T>;
}

export function createEventHook<T = any>(): EventHook<T> {
  const fns: Set<(param: T) => void> = new Set();

  const off = (fn: (param: T) => void) => {
    fns.delete(fn);
  };

  const on = (fn: (param: T) => void) => {
    fns.add(fn);
    const offFn = () => off(fn);

    return {
      off: offFn,
    };
  };

  const trigger = (param: T) => {
    return Promise.all(Array.from(fns).map((fn) => fn(param)));
  };

  return {
    on,
    off,
    trigger,
  };
}

export interface TimeoutFnOptions {
  /**
   * Start the timer immediate after calling this function
   *
   * @default true
   */
  immediate?: boolean;
}

export function containsProp(obj: object, ...props: string[]) {
  return props.some((k) => k in obj);
}

export const isClient = typeof window !== "undefined";

export function useTimeoutFn(
  cb: (...args: unknown[]) => any,
  interval: MaybeRef<number>,
  options: TimeoutFnOptions = {}
): Stoppable {
  const { immediate = true } = options;

  const isPending = ref(false);

  let timer: number | null = null;

  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function stop() {
    isPending.value = false;
    clear();
  }

  function start(...args: unknown[]) {
    clear();
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      timer = null;
      // eslint-disable-next-line n/no-callback-literal
      cb(...args);
    }, unref(interval)) as unknown as number;
  }

  if (immediate) {
    isPending.value = true;
    if (isClient) start();
  }

  return {
    isPending,
    start,
    stop,
  };
}

export interface UntilToMatchOptions {
  /**
   * Milliseconds timeout for promise to resolve/reject if the when condition does not meet.
   * 0 for never timed out
   *
   * @default 0
   */
  timeout?: number

  /**
   * Reject the promise when timeout
   *
   * @default false
   */
  throwOnTimeout?: boolean

  /**
   * `flush` option for internal watch
   *
   * @default 'sync'
   */
  flush?: WatchOptions['flush']

  /**
   * `deep` option for internal watch
   *
   * @default 'false'
   */
  deep?: WatchOptions['deep']
}

export function promiseTimeout(
  ms: number,
  throwOnTimeout = false,
  reason = 'Timeout',
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout)
      setTimeout(() => reject(reason), ms)
    else
      setTimeout(resolve, ms)
  })
}

export function until<T extends unknown[]>(r: WatchSource<T> | MaybeRef<T>): any
export function until<T>(r: WatchSource<T> | MaybeRef<T>):any
export function until<T>(r: any): any {
  let isNot = false

  function toMatch(
    condition: (v: any) => boolean,
    { flush = 'sync', deep = false, timeout, throwOnTimeout }: UntilToMatchOptions = {},
  ): Promise<void> {
    let stop: Function | null = null
    const watcher = new Promise<void>((resolve) => {
      stop = watch(
        r,
        (v) => {
          if (condition(v) === !isNot) {
            stop?.()
            resolve()
          }
        },
        {
          flush,
          deep,
          immediate: true,
        },
      )
    })

    const promises = [watcher]
    if (timeout) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout).finally(() => {
          stop?.()
        }),
      )
    }

    return Promise.race(promises)
  }

  function toBe<P>(value: MaybeRef<P | T>, options?: UntilToMatchOptions) {
    return toMatch(v => v === unref(value), options)
  }

  function toBeTruthy(options?: UntilToMatchOptions) {
    return toMatch(v => Boolean(v), options)
  }

  function toBeNull(options?: UntilToMatchOptions) {
    return toBe<null>(null, options)
  }

  function toBeUndefined(options?: UntilToMatchOptions) {
    return toBe<undefined>(undefined, options)
  }

  function toBeNaN(options?: UntilToMatchOptions) {
    return toMatch(Number.isNaN, options)
  }

  function toContains(
    value: any,
    options?: any,
  ) {
    return toMatch((v) => {
      const array = Array.from(v as any)
      return array.includes(value) || array.includes(unref(value))
    }, options)
  }

  function changed(options?:any) {
    return changedTimes(1, options)
  }

  function changedTimes(n = 1, options?:any) {
    let count = -1 // skip the immediate check
    return toMatch(() => {
      count += 1
      return count >= n
    }, options)
  }

  if (Array.isArray(unref(r))) {
    const instance = {
      toMatch,
      toContains,
      changed,
      changedTimes,
      get not() {
        isNot = !isNot
        return this
      },
    }
    return instance
  }
  else {
    const instance = {
      toMatch,
      toBe,
      toBeTruthy,
      toBeNull,
      toBeNaN,
      toBeUndefined,
      changed,
      changedTimes,
      get not() {
        isNot = !isNot
        return this
      },
    }

    return instance
  }
}
