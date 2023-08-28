import { Ref } from "vue";
export type Fn = () => void;
export interface Stoppable {
  /**
   * A ref indicate whether a stoppable instance is executing
   */
  isPending: Ref<boolean>;

  /**
   * Stop the effect from executing
   */
  stop: Fn;

  /**
   * Start the effects
   */
  start: Fn;
}

export interface OnFetchErrorContext<T = any, E = any> {
  error: E;
  data: T | null;
}
export type MaybeRef<T> = T | Ref<T>;
export interface BeforeFetchContext {
  url: string;
  options: RequestInit;
  cancel: () => void;
}
export type EventHookOn<T = any> = (fn: (param: T) => void) => {
  off: () => void;
};
export type EventHookOff<T = any> = (fn: (param: T) => void) => void;
export type EventHookTrigger<T = any> = (param: T) => void;
export interface AfterFetchContext<T = any> {
  response: Response;

  data: T | null;
}

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export type DataType = "text" | "json" | "blob" | "arrayBuffer" | "formData";

export interface UseFetchOptions {
  immediate?: boolean;
  refetch?: Ref<boolean> | boolean;

  initialData?: any;

  timeout?: number;

  beforeFetch?: (
    ctx: BeforeFetchContext
  ) =>
    | Promise<Partial<BeforeFetchContext> | void>
    | Partial<BeforeFetchContext>;

  afterFetch?: (
    ctx: AfterFetchContext
  ) => Promise<Partial<AfterFetchContext>> | Partial<AfterFetchContext>;

  onFetchError?: (ctx: {
    data: any;
    response: Response | null;
    error: any;
  }) => Promise<Partial<OnFetchErrorContext>> | Partial<OnFetchErrorContext>;
}

export interface fetchConfig extends RequestInit {
  data: any;
  method: HttpMethod;
  type: DataType;
  payload: unknown;
  payloadType?: string;
  signal?: AbortSignal;
}
