/// <reference types="vite/client" />
declare module "mockjs" {
  const mock: Function;
  const Random: any;
  export { mock, Random };
}

declare module "mockjs-fetch" {
  const mockFetch: Function;
  export { mockFetch };
}

interface M {
  name: string;
}
