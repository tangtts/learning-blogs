import {
  computed,
  ComputedRef,
  isRef,
  ref,
  Ref,
  shallowRef,
  toRaw,
  watch,
} from "vue";
import { EventHookOn, createEventHook } from "utils/createEventHook";
import {
  BeforeFetchContext,
  DataType,
  fetchConfig,
  HttpMethod,
  UseFetchOptions,
} from "./types";

function containsProp(obj: object, ...props: string[]) {
  return props.some((k) => k in obj);
}

function isFetchOptions(obj: object): obj is UseFetchOptions {
  return (
    obj &&
    containsProp(
      obj,
      "immediate",
      "refetch",
      "initialData",
      "timeout",
      "beforeFetch",
      "afterFetch",
      "onFetchError",
      "fetch"
    )
  );
}

function headersToObject(headers: HeadersInit | undefined) {
  if (typeof Headers !== "undefined" && headers instanceof Headers)
    return Object.fromEntries([...headers.entries()]);
  return headers;
}

const resolveUnref = <T>(val: Ref<T> | T): T => {
  return unref(val);
};

export type MaybeComputedRef<T> = ComputedRef<T> | T | Ref<T>;

interface UseFetchReturn<T> {
  /**
   * Indicates if the fetch request has finished
   */
  isFinished: Ref<boolean>;

  /**
   * The statusCode of the HTTP fetch response
   */
  statusCode: Ref<number | null>;

  /**
   * The raw response of the fetch response
   */
  response: Ref<Response | null>;

  /**
   * Any fetch errors that may have occurred
   */
  error: Ref<any>;

  /**
   * The fetch response body on success, may either be JSON or text
   */
  data: Ref<T | null>;

  /**
   * Indicates if the request is currently being fetched.
   */
  isFetching: Ref<boolean>;

  /**
   * Abort the fetch request
   */
  abort: () => void;
  execute: (throwOnFailed?: boolean) => Promise<any>;
  onFetchResponse: EventHookOn<Response>;

  onFetchError: EventHookOn;
  onFetchFinally: EventHookOn;

  get(): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
  post(
    payload?: MaybeComputedRef<unknown>,
    type?: string
  ): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
  // type
  json<JSON = any>(): UseFetchReturn<JSON> & PromiseLike<UseFetchReturn<JSON>>;
}

const payloadMapping: Record<string, string> = {
  json: "application/json",
  text: "text/plain",
};

export  function useFetch<T>(
  url: string,
  args?: Partial<UseFetchOptions>
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> {
  let config: UseFetchOptions & fetchConfig = {
    data: {},
    method: "GET",
    type: "text",
    payload: undefined as unknown,
    immediate: true,
    refetch: false,
  };

  // 与用户 传入的类型进行合并
  if (args && isFetchOptions(args)) {
    config = { ...config, ...args };
  }

  /**
   * @description 是否在 loading 状态
   * @param {boolean} isLoading
   */
  const loading = (isLoading: boolean) => {
    isFetching.value = isLoading;
    isFinished.value = !isLoading;
  };

  let controller: AbortController | undefined;

  /**
   * @description abort 取消请求，在 fetch 的 signal属性 注入controller.signal
   */
  const abort = () => {
    controller?.abort();
    controller = new AbortController();
    controller.signal.onabort = () => (aborted.value = true);
    config = {
      ...config,
      signal: controller.signal,
    };
  };

  /** @type {EventHook<Response>} responseEvent，事件触发 */
  const responseEvent = createEventHook<Response>();
  const errorEvent = createEventHook<any>();
  const finallyEvent = createEventHook<any>();

  const aborted = ref(false);
  const statusCode = ref<number | null>(null);
  const response = shallowRef<Response | null>(null);
  const error = shallowRef<any>(null);

  const data = shallowRef(config.data || {});

  const isFinished = ref(false);
  const isFetching = ref(false);

  let execute = async (throwOnFailed = false) => {
    loading(true);
    error.value = null;
    statusCode.value = null;
    aborted.value = false;
    data.value = null;

    if (config.payload) {
      if (config.payloadType) {
        (config.headers as any)["Content-Type"] =
          payloadMapping[config.payloadType] ?? config.payloadType;
      }

      const payload = resolveUnref(config.payload);

      // 如果 payloadType 时 json 就先 JSON.stringify
      config.body =
        config.payloadType === "json"
          ? JSON.stringify(payload)
          : (payload as BodyInit);
    }

    let isCanceled = false;

    const context: BeforeFetchContext = {
      url: resolveUnref(url),
      options: config,
      cancel: () => {
        isCanceled = true;
      },
    };

    // 把用户的与当前的 context 合并
    if (config.beforeFetch) {
      Object.assign(context, await config.beforeFetch(context));
    }

    // 如果调用了 cancel 函数,就停止
    if (isCanceled || !fetch) {
      loading(false);
      return Promise.resolve(null);
    }

    /** @type {json / text} 格式化后的真实数据 */
    let responseData: any = null;

    console.log("abcd");
    return new Promise<Response | null>((resolve, reject) => {
      fetch(context.url, {
        ...context.options,
        headers: {
          ...headersToObject(config.headers),
          ...headersToObject(context.options?.headers),
        },
      })
        .then(async (fetchResponse) => {
          // 保留初始数据
          response.value = fetchResponse;
          statusCode.value = fetchResponse.status;

          responseData = await fetchResponse[config.type]();

          if (!fetchResponse.ok) {
            data.value = config.data || null;
            throw new Error(fetchResponse.statusText);
          }

          if (config.afterFetch) {
            // 把 json 之后的数据和 没有 json 后的数据 统一传入
            // 返回 数据解构  data
            ({ data: responseData } = await config.afterFetch({
              data: responseData,
              response: fetchResponse,
            }));
          }
          data.value = responseData;
          responseEvent.trigger(fetchResponse);
          return resolve(fetchResponse);
        })
        .catch(async (fetchError) => {
          let errorData = fetchError.message || fetchError.name;

          if (config.onFetchError)
            ({ error: errorData } = await config.onFetchError({
              data: responseData,
              error: fetchError,
              response: response.value,
            }));
          error.value = errorData;

          errorEvent.trigger(fetchError);

          if (throwOnFailed) return reject(fetchError);

          return resolve(null);
        })
        .finally(() => {
          loading(false);

          finallyEvent.trigger(null);
        });
    });
  };

  const refetch = ref(config.refetch);

  watch([refetch, ref(url)], ([refetch]) => refetch && execute(), {
    deep: true,
  });

  if (config.immediate) {
    setTimeout(execute, 0);
  }

  const shell: UseFetchReturn<T> = {
    isFinished,
    statusCode,
    response,
    error,
    data,
    isFetching,
    abort,
    execute,
    // 会返回一个 off 事件
    onFetchResponse: responseEvent.on,
    onFetchError: errorEvent.on,
    onFetchFinally: finallyEvent.on,
    // method
    get: setMethod("GET"),
    post: setMethod("POST"),

    // type
    json: setType("json"),
  };

  function setMethod(method: HttpMethod) {
    return (payload?: unknown, payloadType?: string) => {
      if (!isFetching.value) {
        config.method = method;
        config.payload = payload;
        config.payloadType = payloadType;

        // watch for payload changes

        watch(
          () => config.payload,
          () => execute()
        );

        const rawPayload = resolveUnref(config.payload);
        // Set the payload to json type only if it's not provided and a literal object is provided and the object is not `formData`
        // The only case we can deduce the content type and `fetch` can't
        if (
          !payloadType &&
          rawPayload &&
          Object.getPrototypeOf(rawPayload) === Object.prototype &&
          !(rawPayload instanceof FormData)
        )
          config.payloadType = "json";
      }
      return {
        ...shell,
        then(onFulfilled: any) {
          return new Promise(onFulfilled);
        },
      } as any;
    };
  }

  function until(r: any) {
    function toBe(v) {
     return new Promise<void>((resolve) => {
        watch(
          r,
          () => {
            if (v == r.value) {
              resolve();
            }
          },
          {
            immediate: true,
          }
        );
      });
    }
    return {
      toBe,
    };
  }

  function waitUntilFinished() {
    return new Promise<UseFetchReturn<T>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => resolve(shell))
        .catch((error: Error) => reject(error));
    });
  }

  function setType(type: DataType) {
    return () => {
      if (!isFetching.value) {
        config.type = type;

        watch(
          () => config.type,
          () => execute()
        );

        return {
          ...shell,
          then(onFulfilled: any, onRejected: any) {
            return waitUntilFinished().then(onFulfilled, onRejected);
            return Promise.resolve().then(onFulfilled, onRejected);
          },
        } as any;
      }
      return {
        ...shell,
        then(onFulfilled: any, onRejected: any) {
          return waitUntilFinished().then(onFulfilled, onRejected);
          return Promise.resolve().then(onFulfilled, onRejected);
        },
      } as any;
    };
  }
  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilFinished().then(onFulfilled, onRejected);
    },
  };
}
