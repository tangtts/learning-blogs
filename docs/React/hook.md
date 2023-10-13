# hook
## [useContext🔗](https://react.dev/reference/react/useContext#usage) 
`useContext` 是一个 React Hook，它允许你在 React 组件之间共享数据，而不必显式地传递 props。

```jsx {1-4}
export const ThemeContext = 
  createContext<[
    string,React.Dispatch<React.SetStateAction<string>>
  ]>(['',()=>{}]);

function App(){
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={[theme,setTheme]}>
      {/* 路由 */}
    </ThemeContext.Provider>
  )
}
```
在 其他子组件中,使用 `useContext`
```jsx
import {ThemeContext} from "../../App"
export function Theme(){
  const [theme,setTheme] =  useContext(ThemeContext) // [!code hl]
  return (
    <Button onClick={()=>setTheme('dark')}>切换theme</Button>
  )
}
```
可以传递对象，也可以多重嵌套
### 传递对象
```jsx
const CurrentUserContext = createContext(null);
function App(){
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
    {/* todo */}
   </CurrentUserContext.Provider>  
  )
}
```
### 多重嵌套
```jsx
 <ThemeContext.Provider value={theme}>
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      {/* todo */}
    </CurrentUserContext.Provider>
  </ThemeContext.Provider>    
```
## [useDeferredValue🔗](https://zh-hans.react.dev/reference/react/useDeferredValue)
可以延迟更新部分 ui, 在新内容加载完成之前依然显示旧内容。


:::tip
常见的另一种UI模式是推迟更新结果列表，并在新结果准备好之前继续显示先前的结果。  
使用 `useDeferredValue` 来传递查询的延迟版本。
:::

```jsx
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState(''); // [!code hl]
  const deferredQuery = useDeferredValue(query); // [!code hl]
  // 判断是否一样
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

SearchResults.js
```jsx
export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = fetch(`/search?q=${query}`);
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

:::info
在初始渲染期间，返回的 延迟值 与你提供的 值 相同。  

在更新期间，延迟值 会“滞后于”最新的 值。  
具体地说，React 首先会在不更新延迟值的情况下进行重新渲染，然后在后台尝试使用新接收到的值进行重新渲染。
:::


延迟 更新结果列表，并继续显示之前的结果，直到新的结果准备好

<iframe src="https://codesandbox.io/embed/wandering-mountain-3lpyfp?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px;"></iframe>

## useEffect
### cleanup
```jsx
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {   // [!code hl]
      ignore = true; // [!code hl]
    }; // [!code hl]
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

api.js, Bob 出现的时间比其他两位时间要长,当你切换到 `Bob`,然后快速切换到其他两位时,不应该出现错误

```js
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

<iframe 
  src="https://codesandbox.io/embed/wizardly-cori-n2nfwn?autoresize=1&fontsize=14&hidenavigation=1&theme=light"
  style="height: 500px;width: 100%;"></iframe>

竟态问题,网络响应的返回顺序可能和请求的顺序不一致,导致页面渲染错误，和 `vue3` 的 `watch` 的 `cleanup` 一样的效果

### 根据效果的先前状态更新状态
第一种
```js
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // You want to increment the counter every second...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... but specifying `count` as a dependency always resets the interval.
  // ...
}
```
第二种
```js
export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency
  // ...
}
```
- 第一个 useEffect 在组件挂载后和每次 count 发生变化时运行，直接使用 count 的值来进行计算。
- 第二个 useEffect 只在**组件挂载时运行一次**，使用状态更新函数 setCount 来确保每次操作都是基于最新状态的计算。

### 移除不必要的对象依赖
对象每次渲染都不相同, 因为使用的是 `Object.is` 比较, 尽量使用 `string/number/boolean` 这种原始值
```jsx
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 This object is created from scratch on every re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // It's used inside the Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
``` 
## useId
生成唯一 id
```jsx
const x = useId()
``` 
## useImperativeHandle

暴露出部分方法给父组件调用
1. 定义一个 ref 变量,绑定到子组件上
2. 子组件使用 `forwardRef` 包裹
3. 子组件使用 `useImperativeHandle` 暴露出方法

```tsx
 const todoRef = useRef<ReactElement>(null);
 const handleClick = ()=>{
  todoRef.current?.doClick()
 }
  <button type="button" onClick={handleClick}>
    Edit
  </button>

  <Todo ref={todoRef}></Todo>
```

```tsx
export default forwardRef(function Todo(props,ref){
    useImperativeHandle(ref,()=>{
    return {
      doClick(){
        console.log("todoClick",123)
      }
    }
  })
  return (<>
   {/* .... */}
  </>)
})
```

## useLayoutEffect 
<blue>在浏览器绘制之前进行渲染</blue>

<br/>

> 想象一下悬停时出现在某个元素旁边的 tooltip。如果有足够的空间，tooltip 应该出现在元素的上方，但是如果不合适，它应该出现在下面。为了让 tooltip 渲染在最终正确的位置，你需要知道它的高度（即它是否适合放在顶部）。

要做到这一点，你需要分两步渲染：

1. 将 tooltip 渲染到任何地方（即使位置不对）。
2. 测量它的高度并决定放置 tooltip 的位置。
3. 把 tooltip 渲染放在正确的位置。
  
所有这些都需要在浏览器重新绘制屏幕之前完成。你不希望用户看到 tooltip 在移动。调用 useLayoutEffect 在浏览器重新绘制屏幕之前执行布局测量：

```jsx
function Tooltip() {
  const ref = useRef(null);
  // 你还不知道真正的高度
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // 现在重新渲染，你知道了真实的高度
  }, []);

  // ... 在下方的渲染逻辑中使用 tooltipHeight ...
}
```
下面是这如何一步步工作的：

1. Tooltip 使用初始值 tooltipHeight = 0 进行渲染（因此 tooltip 可能被错误地放置）。
2. React 将它放在 DOM 中，然后运行 useLayoutEffect 中的代码。
3. useLayoutEffect 测量 了 tooltip 内容的高度，并立即触发重新渲染。
4. 使用实际的 tooltipHeight 再次渲染 Tooltip（这样 tooltip 的位置就正确了）。
5. React 在 DOM 中对它进行更新，浏览器最终显示出 tooltip。
   

<iframe src="https://codesandbox.io/embed/xenodochial-david-fqqcr5?autoresize=1&fontsize=14&hidenavigation=1&theme=light" style="height: 500px;width: 100%;"></iframe>


## useMemo/memo
useMemo 可以优化处理子组件的渲染。如果有复杂的计算,如果依赖值没有发生变化,不会重新计算



```js
const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
```
如果你确定子组件渲染过慢,可以使用 `memo` 包裹，只有当 props 变化时才重新渲染
```jsx
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

但是，如果是这样写的话, `filterTodos` 会每次创建一个新的数组, 即使它没有改变。

```jsx
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... so List's props will never be the same, and it will re-render every time */}
      <List items={visibleTodos} />
    </div>
  );
}
```
由于传入的每次**对象字面量都不相同**,所以 `List` 使用 `memo` 不会起作用。

可以使用 `useMemo`,也就是如果依赖没发生变化, 返回的 `visibleTodos` 不会有变化

```jsx
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...so as long as these dependencies don't change...
  );

  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```
### 缓存函数

```jsx
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```
看起来过于笨重，可以使用 `useCallback`
```jsx
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```
上面的两个例子是完全等价的，好处是 `useCallback` 防止你额外创建一个嵌套函数

## useReducer
```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init);
```
在 `reducer` 函数中两个参数,一个是当前`state`,另一个是 `dispatch` 传递的 `action`  
`action` 可以是任何类型


```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 }); //[!code hl]
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' }); //[!code hl]
  }

  function handleInputChange(e) {
    dispatch({ //[!code hl]
      type: 'changed_name', //[!code hl]
      nextName: e.target.value//[!code hl]
    }); //[!code hl]
  }
}
  // ...
```

:::tip
**状态时只读的,不要修改对象 / 数组**  
**如果你的现在引用和上一个引用的是同一个对象,react 不会更新**
```js
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': { 
      // 🚩 Don't mutate an object in state like this:
      state.age = state.age + 1; // [!code --]
      return state; // [!code --]
    }

     case 'incremented_age': {
      // ✅ Instead, return a new object
      return { // [!code ++]
        ...state, // [!code ++]
        age: state.age + 1 // [!code ++]
      }; // [!code ++]
    }
  }
}
```
:::

## useRef
它能让你引用一个不需要渲染的值 

**除了 初始化外 不要在渲染期间写入 或者读取 ref.current。这会使你的组件的行为不可预测。**

```js
function MyComponent() {
  // ...
  // 🚩 不要在渲染期间写入 ref
  myRef.current = 123;
  // ...
  // 🚩 不要在渲染期间读取 ref
  return <h1>{myOtherRef.current}</h1>;
}
```
你可以在 事件处理程序或者 effects 中读取和写入 ref。
```js
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ 你可以在 effects 中读取和写入 ref
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ 你可以在事件处理程序中读取和写入 ref
    doSomething(myOtherRef.current);
  }
  // ...
}
```

### 通过 ref 操作 DOM 
<blue>当 React 创建 DOM 节点并将其渲染到屏幕时，React 将会把 DOM 节点设置为你的 ref 对象的 current 属性。</blue>

```jsx
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null)
  function handleClick() {
    inputRef.current.focus();
  }
  return <input ref={inputRef} />;  
}
```
### 使用组件中的 dom

```jsx
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => { // [!code hl]
  return <input {...props} ref={ref} />; // [!code hl]
}); // [!code hl]

export default function Form() {
  const inputRef = useRef(null); // [!code hl]

  function handleClick() {
    inputRef.current.focus(); // [!code hl]
  }

  return (
    <>
      <MyInput ref={inputRef} />    // [!code hl]
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}

```

## useState

1. set 函数 **仅更新 *下一次* 渲染的状态变量**。如果在调用 set 函数后读取状态变量，则 仍会得到在调用之前显示在屏幕上的旧值。
2. **如果你提供的新值与当前 state 相同（由 Object.is 比较确定），React 将 跳过重新渲染该组件及其子组件。**


可以传递函数/字面量
```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
}
```
:::tip
调用 set 函数 不会 改变已经执行的代码中当前的 state

```js
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```
它只影响 下一次 渲染中 useState 返回的内容。
:::

假设 age 为 42，这个处理函数三次调用 setAge(age + 1)
```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```
点击一次后，age 将只会变为 43 而不是 45！这是因为调用 set 函数 不会更新 已经运行代码中的 age 状态变量。因此，每个 setAge(age + 1) 调用变成了 setAge(43)。

```js
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

这里，a => a + 1 是更新函数。它获取 **待定状态** 并从中计算 **下一个状态**。
React 将更新函数放入 队列 中。然后，在下一次渲染期间，它将按照相同的顺序调用它们：

- a => a + 1 将接收 42 作为待定状态，并返回 43 作为下一个状态。
- a => a + 1 将接收 43 作为待定状态，并返回 44 作为下一个状态。
- a => a + 1 将接收 44 作为待定状态，并返回 45 作为下一个状态。

### 传递函数

**建议只传递函数引用,而不是传递函数调用。** [避免重复创建初始状态🔗](https://zh-hans.react.dev/reference/react/useState#avoiding-recreating-the-initial-state)
```jsx
const [todos, setTodos] = useState(createInitialTodos()); // [!code --]
const [todos, setTodos] = useState(createInitialTodos); // [!code ++]
```
<blue>当传递一个函数时，useState 只会在初始化时调用一次,当 组件 更新时不会重新执行。</blue>

### 使用 key 重置状态 

在 渲染列表 时，你经常会遇到 key 属性。然而，它还有另外一个用途。  

**你可以 通过向组件传递不同的 key 来重置组件的状态。**  

在这个例子中，重置按钮改变 version 状态变量，我们将它作为一个 key 传递给 Form 组件。当 key 改变时，React 会从头开始重新创建 Form 组件（以及它的所有子组件），所以它的状态被重置了。  

<iframe src="https://codesandbox.io/embed/jolly-burnell-qxdkpg?fontsize=14&hidenavigation=1&theme=light"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="jolly-burnell-qxdkpg"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## createPortal 
`createPortal` 允许你将 JSX 作为 children 渲染至 DOM 的不同部分

```jsx
import { createPortal } from 'react-dom';

<div>
  <p>这个子节点被放置在父节点 div 中。</p>
  {createPortal(
    <p>这个子节点被放置在 document body 中。</p>,
    document.body
  )}
</div>
```

## lazy
`lazy` 能够让你在组件第一次被渲染之前延迟加载组件的代码。
```jsx
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

## forwardRef
`forwardRef` 允许你的组件使用 ref 将一个 DOM 节点暴露给父组件

### [将 DOM 节点暴露给父组件🔗](https://zh-hans.react.dev/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component)

默认情况下，每个组件的 DOM 节点都是私有的。然而，有时候将 DOM 节点公开给父组件是很有用的，比如允许对它进行聚焦。如果你想将其公开，可以将组件定义包装在 `forwardRef()` 中：

```jsx
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```
你将在 props 之后收到一个 ref 作为第二个参数。将其传递到要公开的 DOM 节点中：
```jsx
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

### 暴露方法而不是 DOM 节点 

可以使用一个被称为 命令式句柄（imperative handle） 的自定义对象来暴露一个更加受限制的方法集，而不是暴露整个 DOM 节点。为了实现这个目的，你需要定义一个单独的 ref 来存储 DOM 节点：

```jsx
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

将收到的 ref 传递给 useImperativeHandle 并指定你想要暴露给 ref 的值：

```jsx:line-numbers{6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

**如果某个组件得到了 MyInput 的 ref，则只会接收到 { focus, scrollIntoView } 对象，而不是整个 DOM 节点。这可以让 DOM 节点暴露的信息限制到最小。**
