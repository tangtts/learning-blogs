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

## 添加元素

```ts
type x = React.ComponentPropsWithoutRef<"div">; // [!code ++]
type z = React.ComponentProps<"div"> //[!code --] 
type y = React.HtmlHTMLAttributes<"div"> // [!code --]
```
**使用 ComponentPropsWithoutRef 可以更好地管理函数组件的 props 类型，并提供更好的类型检查。**

`type x = React.ComponentPropsWithoutRef<typeof Test>;` 可以把 Test 组件的 prop 抽离出来


## Props

```ts
import React from 'react'

interface Props {
  name: string;
  color: string;
}

type OtherProps = {
  name: string;
  color: string;
}

// Notice here we're using the function declaration with the interface Props
function Heading({ name, color }: Props): React.ReactNode {
  return <h1>My Website Heading</h1>
}

// Notice here we're using the function expression with the type OtherProps
const OtherHeading: React.FC<OtherProps> = ({ name, color }) =>
  <h1>My Website Heading</h1>
```
使用函数声明式写法，返回 `React.ReactNode`  
使用函数表达式写法，返回 `React.FC`    

通常，在 React 和 TypeScript 项目中编写 Props 时，请记住以下几点：

1. 始终使用 TSDoc 标记为你的 Props 添加描述性注释 /** comment */。
2. 无论你为组件 Props 使用 type 还是 interfaces ，都应始终使用它们
3. 如果 props 是可选的，请适当处理或使用默认值。

```ts
import React from 'react'

type Props = {
   /** color to use for the background */
  color?: string;
   /** standard children prop: accepts any valid React Node */
  children: React.ReactNode;
   /** callback function passed to the onClick handler*/
  onClick: ()  => void;
}

const Button: React.FC<Props> = ({ children, color = 'tomato', onClick }) => {
   return <button style={{ backgroundColor: color }} onClick={onClick}>{children}</button>
}
```

## 事件
### 处理表单事件

```ts
import React from 'react'

const MyInput = () => {
  const [value, setValue] = React.useState('')

  // 事件类型是“ChangeEvent”
  // 我们将 “HTMLInputElement” 传递给 input
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  return <input value={value} onChange={onChange} id="input-example"/>
}
```

## hooks

### useReducer 

```ts
import { useReducer } from "react";

const initialState = { count: 0 }; // [!code hl]

type ACTIONTYPE = // [!code hl]
  | { type: "increment"; payload: number }
  | { type: "decrement"; payload: string };

function reducer(state: typeof initialState, action: ACTIONTYPE) { // [!code hl]
  switch (action.type) {
    case "increment":
      return { count: state.count + action.payload };
    case "decrement":
      return { count: state.count - Number(action.payload) };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement", payload: "5" })}>
        -
      </button>
      <button onClick={() => dispatch({ type: "increment", payload: 5 })}>
        +
      </button>
    </>
  );
}
```

### useRef

```ts
function Foo() {
  // - If possible, prefer as specific as possible. For example, HTMLDivElement
  //   is better than HTMLElement and way better than Element.
  // - Technical-wise, this returns RefObject<HTMLDivElement>
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Note that ref.current may be null. This is expected, because you may
    // conditionally render the ref-ed element, or you may forget to assign it
    if (!divRef.current) throw Error("divRef is not assigned");

    // Now divRef.current is sure to be HTMLDivElement
    doSomethingWith(divRef.current);
  });

  // Give the ref to an element so React can manage it for you
  return <div ref={divRef}>etc</div>;
}
```

### useImperativeHandle
```ts
// Countdown.tsx

// Define the handle types which will be passed to the forwardRef
export type CountdownHandle = { // [!code hl]
  start: () => void;
};

type CountdownProps = {};

const Countdown = forwardRef<CountdownHandle, CountdownProps>((props, ref) => { //[!code hl]
  useImperativeHandle(ref, () => ({
    // start() has type inference here
    start() {
      alert("Start");
    },
  }));

  return <div>Countdown</div>;
});
```

```ts
// The component uses the Countdown component

import Countdown, { CountdownHandle } from "./Countdown.tsx";

function App() {
  const countdownEl = useRef<CountdownHandle>(null); // [!code hl]

  useEffect(() => {
    if (countdownEl.current) {
      // start() has type inference here as well
      countdownEl.current.start();
    }
  }, []);

  return <Countdown ref={countdownEl} />;
}
```

### Custom Hooks 
[const](https://devblogs.microsoft.com/typescript/announcing-typescript-3-4/#const-assertions)
```ts
import { useState } from "react";

export function useLoading() {
  const [isLoading, setState] = useState(false);
  const load = (aPromise: Promise<any>) => {
    setState(true);
    return aPromise.finally(() => setState(false));
  };
  return [isLoading, load] as const; // infers [boolean, typeof load] instead of (boolean | typeof load)[]
}
```
### context

```ts
import { createContext } from "react";

type ThemeContextType = "light" | "dark";

const ThemeContext = createContext<ThemeContextType>("light");
```

```ts
import { useState } from "react";

const App = () => {
  const [theme, setTheme] = useState<ThemeContextType>("light");

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  );
};
```
Call useContext to read and subscribe to the context.
```ts
import { useContext } from "react";

const MyComponent = () => {
  const theme = useContext(ThemeContext);

  return <p>The current theme is {theme}.</p>;
};
```