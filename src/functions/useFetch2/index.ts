// 引入vue的类型
import type { ComputedRef, Ref } from "vue";
// 引入自定义的类型
import type { EventHookOn, Fn, MaybeRef, Stoppable } from "./types";
// 引入工具函数
import {
  containsProp,
  createEventHook,
  until,
  useTimeoutFn,
} from "utils/createEventHook";
// 引入vue的函数
import { computed, isRef, ref, shallowRef, unref, watch } from "vue";

// 定义返回的接口
export interface UseFetchReturn<T> {
  /**
   * 表示fetch请求是否已经完成
   */
  isFinished: Ref<boolean>;

  /**
   * HTTP fetch响应的statusCode
   */
  statusCode: Ref<number | null>;

  /**
   * fetch响应的原始响应
   */
  response: Ref<Response | null>;

  /**
   * 可能发生的fetch错误
   */
  error: Ref<any>;

  /**
   * fetch响应体，可能是JSON或者文本
   */
  data: Ref<T | null>;

  /**
   * 表示请求是否正在被获取
   */
  isFetching: Ref<boolean>;

  /**
   * 表示fetch请求是否可以被中止
   */
  canAbort: ComputedRef<boolean>;

  /**
   * 表示fetch请求是否被中止
   */
  aborted: Ref<boolean>;

  /**
   * 中止fetch请求
   */
  abort: Fn;

  /**
   * 手动调用fetch
   * (默认不抛出错误)
   */
  execute: (throwOnFailed?: boolean) => Promise<any>;

  /**
   * fetch请求完成后触发
   */
  onFetchResponse: EventHookOn<Response>;

  /**
   * fetch请求错误后触发
   */
  onFetchError: EventHookOn;

  /**
   * fetch完成后触发
   */
  onFetchFinally: EventHookOn;

  // 方法
  get(): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
  post(
    payload?: MaybeRef<unknown>,
    type?: string
  ): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
  put(
    payload?: MaybeRef<unknown>,
    type?: string
  ): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
  delete(
    payload?: MaybeRef<unknown>,
    type?: string
  ): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
  patch(
    payload?: MaybeRef<unknown>,
    type?: string
  ): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
  head(
    payload?: MaybeRef<unknown>,
    type?: string
  ): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
  options(
    payload?: MaybeRef<unknown>,
    type?: string
  ): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;

  // 类型
  json<JSON = any>(): UseFetchReturn<JSON> & PromiseLike<UseFetchReturn<JSON>>;
  text(): UseFetchReturn<string> & PromiseLike<UseFetchReturn<string>>;
  blob(): UseFetchReturn<Blob> & PromiseLike<UseFetchReturn<Blob>>;
  arrayBuffer(): UseFetchReturn<ArrayBuffer> &
    PromiseLike<UseFetchReturn<ArrayBuffer>>;
  formData(): UseFetchReturn<FormData> & PromiseLike<UseFetchReturn<FormData>>;
}

// 定义数据类型
type DataType = "text" | "json" | "blob" | "arrayBuffer" | "formData";
// 定义HTTP方法
type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

// 定义payload映射
const payloadMapping: Record<string, string> = {
  json: "application/json",
  text: "text/plain",
  formData: "multipart/form-data",
};

export interface BeforeFetchContext {
  /**
   * 当前请求的计算url
   */
  url: string;

  /**
   * 当前请求的请求选项
   */
  options: RequestInit;

  /**
   * 取消当前请求
   */
  cancel: Fn;
}

// 定义AfterFetchContext接口
export interface AfterFetchContext<T = any> {
  response: Response;

  data: T | null;
}

// 定义OnFetchErrorContext接口
export interface OnFetchErrorContext<T = any, E = any> {
  error: E;

  data: T | null;
}

// 定义UseFetchOptions接口
export interface UseFetchOptions {
  /**
   * Fetch函数
   */
  fetch?: typeof window.fetch;

  /**
   * 使用`useFetch`时会自动运行fetch
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * 当以下情况发生时会自动重新获取：
   * - 如果URL是一个ref，当URL改变时
   * - 如果payload是一个ref，当payload改变时
   *
   * @default false
   */
  refetch?: MaybeRef<boolean>;

  /**
   * 请求完成前的初始数据
   *
   * @default null
   */
  initialData?: any;

  /**
   * 超时后中止请求的毫秒数
   * `0`表示使用浏览器默认
   *
   * @default 0
   */
  timeout?: number;

  /**
   * fetch请求发送前立即运行
   */
  beforeFetch?: (
    ctx: BeforeFetchContext
  ) =>
    | Promise<Partial<BeforeFetchContext> | void>
    | Partial<BeforeFetchContext>
    | void;

  /**
   * fetch请求返回后立即运行
   * 在任何2xx响应后运行
   */
  afterFetch?: (
    ctx: AfterFetchContext
  ) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>;

  /**
   * Will run immediately after the fetch request is returned.
   * Runs after any 4xx and 5xx response
   */
  onFetchError?: (ctx: {
    data: any;
    response: Response | null;
    error: any;
  }) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext>;
}

// 定义CreateFetchOptions接口
export interface CreateFetchOptions {
  /**
   * 将被添加到所有url前的基础URL
   */
  baseUrl?: MaybeRef<string>;

  /**
   * useFetch函数的默认选项
   */
  options?: UseFetchOptions;

  /**
   * fetch请求的选项
   */
  fetchOptions?: RequestInit;
}

/**
 * !!!重要!!!
 *
 * 如果你更新了UseFetchOptions接口，请确保更新这个对象
 * 包括新的选项
 */
function isFetchOptions(obj: object): obj is UseFetchOptions {
  return containsProp(
    obj,
    "immediate",
    "refetch",
    "initialData",
    "timeout",
    "beforeFetch",
    "afterFetch",
    "onFetchError"
  );
}

// 将headers转换为对象
function headersToObject(headers: HeadersInit | undefined) {
  if (headers instanceof Headers)
    return Object.fromEntries([...headers.entries()]);

  return headers;
}

// 创建fetch函数
export function createFetch(config: CreateFetchOptions = {}) {
  const _options = config.options || {};
  const _fetchOptions = config.fetchOptions || {};

  // 使用工厂模式创建fetch函数
  function useFactoryFetch(url: MaybeRef<string>, ...args: any[]) {
    const computedUrl = computed(() =>
      config.baseUrl ? joinPaths(unref(config.baseUrl), unref(url)) : unref(url)
    );

    let options = _options;
    let fetchOptions = _fetchOptions;

    // 将属性合并到一个对象中
    if (args.length > 0) {
      if (isFetchOptions(args[0])) {
        options = { ...options, ...args[0] };
      } else {
        fetchOptions = {
          ...fetchOptions,
          ...args[0],
          headers: {
            ...(headersToObject(fetchOptions.headers) || {}),
            ...(headersToObject(args[0].headers) || {}),
          },
        };
      }
    }

    if (args.length > 1 && isFetchOptions(args[1]))
      options = { ...options, ...args[1] };

    return useFetch(computedUrl, fetchOptions, options);
  }

  return useFactoryFetch as typeof useFetch;
}

// 定义useFetch函数
export function useFetch<T>(
  url: MaybeRef<string>
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
export function useFetch<T>(
  url: MaybeRef<string>,
  useFetchOptions: UseFetchOptions
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;
export function useFetch<T>(
  url: MaybeRef<string>,
  options: RequestInit,
  useFetchOptions?: UseFetchOptions
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>>;

export function useFetch<T>(
  url: MaybeRef<string>,
  ...args: any[]
): UseFetchReturn<T> & PromiseLike<UseFetchReturn<T>> {
  // 检查是否支持中止
  const supportsAbort = typeof AbortController === "function";

  let fetchOptions: RequestInit = {};

  let options: UseFetchOptions = {
    immediate: true,
    refetch: false,
    timeout: 0,
  };

  // 定义内部配置接口
  interface InternalConfig {
    method: HttpMethod;
    type: DataType;
    payload: unknown;
    payloadType?: string;
  }
  
  // 初始化内部配置
  const config: InternalConfig = {
    method: "GET",
    type: "text" as DataType,
    payload: undefined as unknown,
  };

  // 处理参数
  if (args.length > 0) {
    if (isFetchOptions(args[0])) options = { ...options, ...args[0] };
    else fetchOptions = args[0];
  }

  if (args.length > 1) {
    if (isFetchOptions(args[1])) options = { ...options, ...args[1] };
  }

  const { fetch = window.fetch, initialData, timeout } = options;

  // 创建事件钩子
  const responseEvent = createEventHook<Response>();
  const errorEvent = createEventHook<any>();
  const finallyEvent = createEventHook<any>();

  const isFinished = ref(false);
  const isFetching = ref(false);
  const aborted = ref(false);
  const statusCode = ref<number | null>(null);
  const response = shallowRef<Response | null>(null);
  const error = shallowRef<any>(null);
  const data = shallowRef<T | null>(initialData);

  const canAbort = computed(() => supportsAbort && isFetching.value);

  let controller: AbortController | undefined;
  let timer: Stoppable | undefined;

  // 定义中止函数
  const abort = () => {
    if (supportsAbort && controller) controller.abort();
  };

  // 定义加载函数
  const loading = (isLoading: boolean) => {
    isFetching.value = isLoading;
    isFinished.value = !isLoading;
  };

  // 如果有超时，创建超时函数
  if (timeout) timer = useTimeoutFn(abort, timeout, { immediate: false });

  // 定义执行函数
  const execute = async (throwOnFailed = false) => {
    loading(true);
    error.value = null;
    statusCode.value = null;
    aborted.value = false;
    controller = undefined;

    // 如果支持中止，创建中止控制器
    if (supportsAbort) {
      controller = new AbortController();
      controller.signal.onabort = () => (aborted.value = true);
      fetchOptions = {
        ...fetchOptions,
        signal: controller.signal,
      };
    }

    // 默认的fetch选项
    const defaultFetchOptions: RequestInit = {
      method: config.method,
      headers: {},
    };

    // 如果有payload，处理headers和body
    if (config.payload) {
      const headers = headersToObject(defaultFetchOptions.headers) as Record<
        string,
        string
      >;
      if (config.payloadType)
        headers["Content-Type"] =
          payloadMapping[config.payloadType] ?? config.payloadType;

      defaultFetchOptions.body =
        config.payloadType === "json"
          ? JSON.stringify(unref(config.payload))
          : (unref(config.payload) as BodyInit);
    }

    let isCanceled = false;
    const context: BeforeFetchContext = {
      url: unref(url),
      options: fetchOptions,
      cancel: () => {
        isCanceled = true;
      },
    };

    // 如果有beforeFetch选项，运行beforeFetch
    if (options.beforeFetch)
      Object.assign(context, await options.beforeFetch(context));

    // 如果被取消或者没有fetch，停止加载并返回
    if (isCanceled || !fetch) {
      loading(false);
      return Promise.resolve(null);
    }

    let responseData: any = null;

    // 如果有超时，开始计时器
    if (timer) timer.start();

    // 返回一个新的Promise
    return new Promise<Response | null>((resolve, reject) => {
      fetch(context.url, {
        ...defaultFetchOptions,
        ...context.options,
        headers: {
          ...headersToObject(defaultFetchOptions.headers),
          ...headersToObject(context.options?.headers),
        },
      })
        .then(async (fetchResponse) => {
          response.value = fetchResponse;
          statusCode.value = fetchResponse.status;

          // 获取响应数据
          responseData = await fetchResponse[config.type]();

          if (
            options.afterFetch &&
            statusCode.value >= 200 &&
            statusCode.value < 300
          )
            ({ data: responseData } = await options.afterFetch({
              data: responseData,
              response: fetchResponse,
            }));

          data.value = responseData;

          // see: https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
          if (!fetchResponse.ok) throw new Error(fetchResponse.statusText);

          responseEvent.trigger(fetchResponse);
          return resolve(fetchResponse);
        })
        .catch(async (fetchError) => {
          let errorData = fetchError.message || fetchError.name;

          if (options.onFetchError)
            ({ data: responseData, error: errorData } =
              await options.onFetchError({
                data: responseData,
                error: fetchError,
                response: response.value,
              }));
          data.value = responseData;
          error.value = errorData;

          errorEvent.trigger(fetchError);
          if (throwOnFailed) return reject(fetchError);

          return resolve(null);
        })
        .finally(() => {
          loading(false);
          if (timer) timer.stop();
          finallyEvent.trigger(null);
        });
    });
  };

  watch(
    () => [unref(url), unref(options.refetch)],
    () => unref(options.refetch) && execute(),
    { deep: true }
  );

  const shell: UseFetchReturn<T> = {
    isFinished,
    statusCode,
    response,
    error,
    data,
    isFetching,
    canAbort,
    aborted,
    abort,
    execute,

    onFetchResponse: responseEvent.on,
    onFetchError: errorEvent.on,
    onFetchFinally: finallyEvent.on,
    // method
    get: setMethod("GET"),
    put: setMethod("PUT"),
    post: setMethod("POST"),
    delete: setMethod("DELETE"),
    patch: setMethod("PATCH"),
    head: setMethod("HEAD"),
    options: setMethod("OPTIONS"),
    // type
    json: setType("json"),
    text: setType("text"),
    blob: setType("blob"),
    arrayBuffer: setType("arrayBuffer"),
    formData: setType("formData"),
  };

  function setMethod(method: HttpMethod) {
    return (payload?: unknown, payloadType?: string) => {
      if (!isFetching.value) {
        config.method = method;
        config.payload = payload;
        config.payloadType = payloadType;

        // watch for payload changes
        if (isRef(config.payload)) {
          watch(
            () => [unref(config.payload), unref(options.refetch)],
            () => unref(options.refetch) && execute(),
            { deep: true }
          );
        }

        // Set the payload to json type only if it's not provided and a literal object is provided
        // The only case we can deduce the content type and `fetch` can't
        if (
          !payloadType &&
          unref(payload) &&
          Object.getPrototypeOf(unref(payload)) === Object.prototype
        )
          config.payloadType = "json";

        return shell as any;
      }
      return undefined;
    };
  }

  function waitUntilFinished() {
    return new Promise<UseFetchReturn<T>>((resolve, reject) => {
      until(isFinished)
        .toBe(true)
        .then(() => resolve(shell))
        .catch((error:Error) => reject(error));
    });
  }

  function setType(type: DataType) {
    return () => {
      if (!isFetching.value) {
        config.type = type;
        return {
          ...shell,
          then(onFulfilled: any, onRejected: any) {

            return waitUntilFinished().then(onFulfilled, onRejected);
          },
        } as any;
      }
      return undefined;
    };
  }

  if (options.immediate) setTimeout(execute, 0);

  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilFinished().then(onFulfilled, onRejected);
    },
  };
}

function joinPaths(start: string, end: string): string {
  if (!start.endsWith("/") && !end.startsWith("/")) return `${start}/${end}`;

  return `${start}${end}`;
}
