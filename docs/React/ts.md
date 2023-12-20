# ts 在 react 的使用
## 定义 children 类型
### [React.ReactNode🔗](https://react.dev/learn/typescript#typing-children)

`React.ReactNode` 包含的范围更广

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```
```ts
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;

type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
```

类组件的 render 成员函数会返回 ReactNode 类型的值，而且 PropsWithChildren 类型中指定的 children 类型也是 ReactNode。

```tsx
const Comp: FunctionComponent = props => <div>{props.children}</div> 
// children?: React.ReactNode

type PropsWithChildren<P> = P & {
  children?: ReactNode;
}
```

### React.ReactElement
它只包括 JSX 元素，而不包括 JavaScript 原始类型，如 string 或 number:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```
```ts
type Key = string | number

interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
  type: T;
  props: P;
  key: Key | null;
}
```



## Style Props 
```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## forwardRef

>todo.tsx
```ts
export default forwardRef(function Todo(props,ref) {
   useImperativeHandle(ref,()=>{
    return {
      doClick(){
        console.log("todoClick",123)
      }
    }
  })
})
```
> main.ts
```tsx
import {RefObject } from 'react'

const todoRef:RefObject<{
  doClick():void
}> = useRef(null);

const handleClick = () => {
  if (todoRef.current) {
    todoRef.current.doClick();
  }
};
```