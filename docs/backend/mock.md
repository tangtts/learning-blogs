# Mock
模拟数据

```bash
  pnpm i mockjs
```

## 拦截数据
如果需要使用 `fetch` 拦截数据

```bash
  import {mockFetch} from 'mockjs-fetch';
  mockFetch(Mock)
```
example:

```ts
Mock.mock("/testMockFetch", {
    code: 0,
    data: {
        total: 47,
        dataList: [
            {
                name: '小茗同学',
                age: 18,
                address: '中国北京朝阳区'
            },
        ],
    },
});

const resp = await fetch('/testMockFetch').then(resp => resp.json());
console.log('输出结果：', resp);
```