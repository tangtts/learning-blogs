import { Ref } from "vue";

export interface OnFetchErrorContext<T = any, E = any> {
  error: E;
  data: T | null;
}

export interface BeforeFetchContext {
  url: string;
  options: RequestInit;
  cancel: () => void;
}

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
  data:any,
  method: HttpMethod;
  type: DataType;
  payload: unknown;
  payloadType?: string;
  signal?: AbortSignal;
}


