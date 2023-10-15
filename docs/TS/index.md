# TS

**TS 基础及类型体操**

## type 和 interface 的区别

:::tip 🚀type 和 interface 的定义区别
`type` 是类型别名  
`interface` 是接口,定义一个新的规则,必须要满足这个规则才能使用

所以`type` 可以定义 `string/boolean` 等基本类型,也可以解释 `type` 合并会报错,`interface` 会自动合并
:::

## 安全

所有的 ts 类型 都是为了安全考虑

```ts
// 示例2
interface A1 {
  name: string;
}

interface A2 {
  name: string;
  age: number;
}
// A的类型为string
type A = A2 extends A1 ? string : number;

const a: A = "this is string";
```

**A1，A2 两个接口，满足 A2 的接口一定可以满足 A1**，所以条件为真，A 的类型取 string

## 函数

### 函数重载

:::info
**函数重载 = 重载签名 + 实现签名 + 函数体**
:::

```ts
interface User {
  name: string;
  age: number;
}
// 重载签名
function test(para: User): number;
function test(para: number, flag: boolean): number;

// 因为 flag 可能没有传值,需要传递 `void`
function test(para: User | number, flag: boolean | void): number {
  return 12;
}

const user = {
  name: "Jack",
  age: 666,
};
// Error: 参数不匹配
const res = test(12, false);
```

:::warning
不需要传参数需要传递 `void/undefined` 类型
:::

<iframe src="https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgKoGdrIN4ChnIhwC2EAXMumFKAOYDc+yct5hArsQEbSMC+uAPSDkgWcTAvvGA-b0CwKrhjsQCMMAD2IZJCoAKAA5wocChmgBKCiE48ojeYuVqNEbXoPnL0ADTIYAGxYUuFRUfCDgQMw5uXlwhEUADtUAuOW8-WmRAe+VAX4DAQptASHNAAnlAHgUPQAB0wEDIvMAkBOQAAwA3FWAAE2rkOQUlVXVNMF19Q2MoZAAfSKsPXxZkAKCQsIIR+qazCyioPAIoCDB2KHUARgAmXAEENSpkdkxBgF4cJiJSCgByAClEAGsnjyYWNgA2AHHRjCZCHDwAIngPkw4OQgCHlQAOpoBYOUAnMqAWUSPIAr5QygHozUEHQAw-1DMLhTiBzpt0Mhbt0tGDvHBoRATPQgA" width="100%" height="600"/>

### 函数兼容

**子类型比父类型更加具体,父类型比子类型更宽泛,子类型可以赋值给父类型,父类型不能赋值给子类型(逆变除外)** 目的是为了安全

#### 可赋值性

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  break(): void;
}

let a: Animal;
let b: Dog;

// 可以赋值，子类型更佳具体，可以赋值给更佳宽泛的父类型
a = b;
// 反过来不行
b = a;
```
可赋值性在联合类型中的特性
```ts
type A = 1 | 2 | 3;
type B = 2 | 3;
let a: A;
let b: B;

// 不可赋值
b = a;
// 可以赋值
a = b;
```
A此处类型更多但是其表达的类型更宽泛，所以A是父类型，B是子类型。

因此b = a不成立（父类型不能赋值给子类型），而a = b成立（子类型可以赋值给父类型）

---
:::tip
**_赋值的主要是赋值的是函数体_**  
形参数量少的可以赋值给形参数量多的,因为形参少，在 **_函数体内_** 只能用到这些形参
:::

#### 逆变

```ts
type Func = (a: string, b: string) => void;

let sum: Func;
// 形参数量比 Func 少
let f1 = (a: string) => {};
// 形参数量比 Func 多，在函数体内可能用到了形参
let f3 = (a: string, b: string, c: string) => {};

sum = f1;
// 错误，函数体还是f3，但是形参是 sum 的
sum = f3;
// sum 的函数体内需要 3 个参数
sum("1", "2");
```

<iframe src="https://www.typescriptlang.org/play?ssl=13&ssc=17&pln=1&pc=1#code/C4TwDgpgBAYgrgOwMYF4oAoCGAuAzsAJwEsEBzAGgCM9CTSBKFAPgDcB7IgEwChuAbCMCi44AW2zxk3APTSogI31AQ8qAHU0DziYBXrWIiRRAiDr9BUAGYBGKGiw1iZRkwDeAXxlylazZJ2AsTUAw-4Ap1QL+KyoDK8oChioD3yoC-AYAUroAMSoBhckoGQkYAzOYYOPjWFNRZdORIVnS2jrzCYumm3FCyUICYqYD30d6BQYAb8YD0ZqnegGLy7Urt5aJQgCFu1SJDaKnVta2A6foDgJBygFRyicYp6ABEJhvkGwBMOxtIG-RAA" width="100%" height="600"/>

#### 协变

:::tip
**_因为有可能拿着这个返回值去做其他事情，不能少个返回值_**
:::

因为赋值赋的是函数体,不能少一个返回值

```ts
type Func = () => { name: string; age: number };

let sum: Func;
let f1 = () => {
  return { name: "zs" };
};
let f2 = () => {
  return { name: "zs", age: 20, gender: 1 };
};

// 报错,少一个返回值
sum = f1;

sum = f2;

// 使用的时候,这两个是必须存在的
sum().age / sum.name;
```

<iframe src="https://www.typescriptlang.org/play?#code/C4TwDgpgBAYgrgOwMYF4oAoCUKB8BvBAQwFsIAuAZ2ACcBLBAcwBpCHyE5iAjCagXwBQAgDYRgUCpzLxkIsVABmARihosuPFGpi41BFAIlyAcgBeFY30GjxCgEyqM2fNuC79moqTJmLLNmR2AAxMbAgAJrxkKlZCAPRxUIClRoCYqUyAiDqAAHKAVHKAK-GAe2qAPAoCksQoykKl5XZAA" width="100%" height="600"/>

### 特点

**`TS` 中只有 `函数参数` 这一处逆变**

:::tip 🚀 逆变/协变
**infer 推导的名称相同并且都处于逆变的位置，可推导出交叉类型**  
**infer 推导的名称相同并且都处于协变的位置，可推导出联合类型**
:::
交叉类型

```ts
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;

type T20 = Bar<{ a: (x: string) => void; b: (x: string) => void }>; // string
type T21 = Bar<{ a: (x: string) => void; b: (x: number) => void }>; // string & number
```

联合类型

```ts
type Foo<T> = T extends () => { a: infer U; b: infer U } ? U : never;

type T10 = Foo<() => { a: string; b: string }>; // string
type T11 = Foo<() => { a: string; b: number }>; // string | number
```

<iframe src="https://www.typescriptlang.org/play?#code/C4TwDgpgBAQghgJwDwBUB8UC8UVQgD2AgDsATAZygG8o4AuKACnwYEtiAzCBKAVQEosGAG4B7VqQDcUAEYNmbTtz6DMI8aSgBfAFBQoAfj56oDYhGHdJOnaEg4ATAAYssREhr0mLKOWAJ2AHNVdQlpOW8GPwDiYKEoMQltNGkAelTffyDbcGgUBwBGV3hkT3kfaKCQhI1w8rMAVwBbGW5qxM0tFP10zJjAqAAyKGJm1oQbG17AeWVADeUc+wAxUVFUDGxcAiIySkZ+NTKodi4eXjqjpVPtQz5TEYsrSbs8gpdsZdW9g9oorNjzyqxZJpDKAwILF5Fd4rJBfNCHMHnUYtZRdEF9IJQAA+IzG3CAA" width="100%" height="600"/>

#### 数组逆变

```ts
interface Array<T> {
  concat(...arg: T[]): T[]; // 这种写法会禁止逆变，不去检测 逆变
  // concat:(...arg:T[])=>T[]
}

let p!: Array<Parent>;
let c!: Array<Child>;
p = c;
```

### 函数扩展

```ts
function getName() {}
namespace getName {
  export const type = "form";
}

console.log(getName.type); // form
```

### 函数对象

```ts
const b = () => "hello";
b.id = false;

// 定义类型
const y: { (): string; id: boolean } = b;

// 可以写成下面的这种
type FunctionWithId = {
  (): string;
  id: boolean;
};

const x: FunctionWithId = b;
```

### 函数泛型

```ts
type ICallBack1 = <T>(item: T, idx: number) => T;

// 使用接口时确定类型，手动传入
type ICallBack<T> = (item: T, idx: number) => T;

//手动传入
let fun: ICallBack<string> = (item, idx) => item;

// 禁止手动传入,因为它的类型就是 T
let fun2: ICallBack1 = (item, idx) => item;

// 当传入一个字符串的时候，T 的类型被确定,返回值是 string 类型
fun2("aaa", 1);
```

`type ICallBack1 = <T>(item: T, idx: number) => void;` 这种是运行时,根据传入 `item` 的类型来自动推导

<iframe src="https://www.typescriptlang.org/play?ssl=12&ssc=36&pln=3&pc=1#code/FDAuE8AcFMAIEkDCBDANqgQsgxgawIywC8sAPACoB8AFAJajQC2AXLOQDSy0AmAHqwDsArowBG0AE4BKYpVgA3APY8A3CAD062IH95QBSugUuNAx8qA300B2HoCztQN4+gaPVAMP+BpI0AVSoAJ5QKaKsMFDhI0mHLgo5EjoGFjZOHn5YYTFJGSI5JVUNdSc3YFRoUFgAMyEBZh90LDxSAGdQCVoBAHMg2BCmdkipBIBvAF8U2EBAz0AjazTXdkADtUAuOUBg7UAQtxtARh1AejM2WA9M7LyBACZClGL-QiJGxma+VspOoA" width="100%" height="600"/>

## 字符串

### 固定后缀字符串

```ts
const sType: {
  [k: `${string}HD`]: any;
} = {
  aHD: "AAA",
};
```

### 字符串分发

```ts
// type T3 = "top-left" | "top-right" | "bottom-left" | "bottom-right"
type T3 = `${"top" | "bottom"}-${"left" | "right"}`;
// type T4 = 1 | "1" | 2 | 3 | "2" | "3"
type T4 = `${1 | 2 | 3}` | 1 | 2 | 3;
```

## 元祖[tuple]

**用于保存定长/定数据类型的数据**

### 可选参数

```ts
type Either2dOr3d = [number, number, number?];
const e: Either2dOr3d = [1, 1];

// 元祖类型，只能有一个数字
let d: [1 | 2 | 3] = [2];
```

### 剩余参数

```ts
type BooleansStringNumber = [...boolean[], string, number];

const f: BooleansStringNumber = ["1", 1];

// 前面只能是 boolean,或者是不填，不能是其他类型
const f: BooleansStringNumber = [false, 1, "1", 1]; //[!code error]
```

### 联合参数

```ts
// 可以不用写最后的布尔值，固定了位置
type StringNumberBooleans = [string | number, number, ...boolean[]];
let s: StringNumberBooleans = ["a", 12];
```

### 命名参数

更加详细介绍

```ts
type StringNumberBooleans = [name: string, age: number];
let s: StringNumberBooleans = ["a", 12];
```

## {} & Object & object

:::info 区别
object：表示任何非原始类型的值，包括对象、数组、函数等,但不包括 null 和 undefined

Object 表示一个 js 的顶级对象,任何时候都不建议使用,只能使用 `Object` 上的公共方法

{} 表示一个空对象,*不允许添加属性*, 是 Object 的实例,和 Object 一样，可以使用 `Object` 上的原型方法,但是没有提示
:::

<iframe src="https://www.typescriptlang.org/play?#code/FDA2FMBcAIHsCMBWAuOTwGNIG5gMdALzQDeAvttAPRXSAQKoKs2gMP+BeXoJ-aghjGD0ZmopjIG8fQNHqeJEWgBtALqUa9ZoAdTQCN+PfP2jDRBYgAoAlEQB8pCtVqMmgX8UFq9Fg0j84gIyVo7s9EB66QwA0PADsAVwBbeHAAJwcQCBh8ACZUAHk7HC148XJZc2Z2bmgUvntNBPFpbPkmZR5C9RKkDN0DQmMszwtrGtTo0uJnDwH2v36uosEREGhY6AAPVDV7YgAiAAtwUFBYJYrAWDkLQHVtQDJvQCY5LkB85UBpzWEmHdsx6LAoaABPZO7lgHdYCNAAE22hkxRnUJs8AHSQWAAZUgEQAlgEAObAcEANwAhqAguAkgAzGJPABeyHImTInmAhLB6JcAAZPD4QFTITD4UjPIToIBquMAUHKAQptAJDmgG+5QCq8oAF40AXJ5MQBi8lxAPfKgFO5QD+8oAKVzOQkAnaYMSlgjFYnH4x4wEIk8nLdFLIYgYBAA" width="100%" height="600"/>

## Class
### 类型
- 当把类直接作为类型时，该类型约束的是该类型必须是类的实例；即该类型获取的是该类上的实例属性和实例方法（也叫原型方法）;
- 当把typeof 类作为类型时，约束的满足该类的类型；即该类型获取的是该类上的静态属性和方法。

具体原因可以[查看🔗](/JS/class.html#class)


类本质是一个函数,成员属性和方法是放置在函数的原型上的

```ts
class People {
  name: number|undefined;
  age: number|undefined;
  constructor() {}
  static a(){}
}

// p1可以正常赋值
const p1: People = new People();

// 等号后面的People报错，类型“typeof People”缺少类型“People”中的以下属性: name, age
// const p2: People = People; //[!code error]


// p3报错，类型 "People" 中缺少属性 "prototype"，但类型 "typeof People" 中需要该属性
// const p3: typeof People = new People(); //[!code error]
// p4可以正常赋值
const p4: typeof People = People;
p4.a
``` 
### 继承

```ts
class Person {
  getP(){
    console.log("Child")
  }
}

class Child extends Person {
  getChild(){
    console.log("Child")
  }
}
```
如果使用 `ts` 限定类型 

```ts
let c:Person = new Child;
// c.getChild() // [!code --]
// c.getP() // [!code ++]
```
如果一个人是超人,就是有超过人类的其他能力  
但是使用 `ts` 约束了它的类型,那么它只能是人类,只能拥有人类的属性  



## 关键字

### NonNullable

去除 null 类型,_主要利用了 TS 的分发类型_

```ts
// 原理
type NonNullable<T> = T & {};
// null | HTMLElement
let ele = document.getElementById("div");
// 去除 null
type D = NonNullable<typeof ele>; // HTMLElement
//只有 HTMLElement
(ele as D).style.color = "red";
```

### is

类型收紧的更加具体

```ts
interface Bird {
  fly: string;
}

interface Fish {
  swim: string;
}

function isBird(val: Bird | Fish): val is Bird {
  return "fly" in val;
}

// 是因为 isBird 返回的是一个 boolean 值，所以才需要一个 is 关键字
function test(a: Bird | Fish) {
  if (isBird(a)) {
    a; // Bird
  } else {
  }
}
```

### satisfies(使满足)

```ts
interface Vibe {
  mood: "happy" | "sad";
}

// vibe.mood: "happy" | "sad"
const vibe: Vibe = {
  mood: "happy",
};

// vibe.mood: "happy"
const vibe = {
  mood: "happy",
} satisfies Vibe; // [!code ++]
```

```ts
type ICustomerImage = {
  height: string;
};

type UserImage = string | ICustomerImage;

interface IUser {
  id: number;
  image: UserImage;
}

const badImage: IUser = {
  id: 1,
  image: "aa",
};

const goodImage = {
  id: 1,
  image: "aa",
} satisfies IUser; // [!code ++]

badImage.image; // 只能获取字符串和 对象的公有方法
goodImage.image; // 就是一个字符串，可以获取字符串的方法
```

### Exclude(排除)

```ts
type Exclude<T, U> = T extends U ? never : T;
```

举例来说

```ts
type A = Exclude<"key1" | "key2", "key2">; // 'key1'
```

利用了条件类型中的分配原则

```ts
type A = `Exclude<'key1' | 'key2', 'key2'>`

// 等价于

type A = `Exclude<'key1', 'key2'>` | `Exclude<'key2', 'key2'>`

// =>

type A = ('key1' extends 'key2' ? never : 'key1') | ('key'2 extends 'key2' ? never : 'key2')

// =>

// never是所有类型的子类型
type A = 'key1' | never = 'key1'
```

### Extract(提取)

```ts
type Extract<T, U> = T extends U ? T : never;
```

### ReturnType

```ts
type MyReturnType<T extends Function> = T extends (...args: any) => infer R
  ? R
  : never;
```

### keyof

遍历
:::info
如果 T 里面是 类型的集合，T[P]返回的就是类型
T 里面是 具体的值，那么 T[P]返回的就是具体的值
:::

```ts
type ExcludeType<T extends Array<any>, K extends string | number | boolean> = {
  [P in keyof T]: T[P] extends K ? never : T[P];
}[number];
```

对多个对象进行遍历

```ts
type Merge<F extends Record<string, any>, S extends Record<string, any>> = {
  [K in keyof F | keyof S]: K extends keyof S
    ? S[K]
    : K extends keyof F
    ? F[K]
    : never;
};
```

重新映射

1. Uppercase 转大写
2. Lowercase
3. Capitalize 首字母大写
4. Uncapitalize 转小写

```ts
type G1<T> = {
  // 交叉类型限制 类型 相当于取的交集，因为 Capitalize 只接受 string
  // as 重新映射
  [k in keyof T as `get${Capitalize<k & string>}`]?: () => T[k];
};
```

### lookup(查找)

```ts
type D1 = {
  a: never;
  b: never;
  c: string;
};

// 使用 keyof 的意思是 Pick 后面只能使用 'a' | 'b' |'c'
type OmitNever<T> = Pick<
  T,
  { [P in keyof T]: T[P] extends never ? never : P }[keyof T]
>; // { 'name':'zs',age :12 }['name' | 'age'] 'zs'

type Me = { name: "阿宝哥"; city: "XM" }["name" | "city"];
type Me = "阿宝哥" | "XM"; // 先生成映射类型后再利用Lookup Types

interface Example {
  a: string;
  b: boolean;
}

// 可以是 布尔也可以是 字符串
let D: Example["b" | "a"] = false;
```

### infer

infer 只能在条件类型的 extends 子句中，推断的类型变量需要可以在条件类型的 true 分支中引用。

infer 可以指代一个类型，也可以是具体的值

:::danger
元组成员必须全部具有或全部不具有名称
:::

```ts
// 代表的是一个值
type TrimLeft<V extends string> = V extends ` ${infer R}` ? R : V;
let c: TrimLeft<" abcd"> = "abcd";

// [1, 2, 5, 3, 6]
type L = Flatten<[[1, 2, 5, 3], 6]>;

// 不断递归
type Flatten<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : T;
```

具名

```ts
// R 指代的第一个字符，infer _ 没有用到
type First<T extends any[]> = T extends [infer R, ...infer _] ? R : never;

// First<[() => 123, { a: string }] == ()=>123

// 具名元祖类型
type First<T extends any[]> = T extends [F: infer R, ...args: infer _]
  ? R
  : never;
```

指代类型

```ts
type MyParameters<V extends Function> = V extends (s: infer P) => any
  ? P
  : never;

let c: MyParameters<(a: string) => string> = "";
```

### InstanceType

```ts
type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;
```

```ts
class MyClass {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  getName() {
    return this.name;
  }
}
type MyInstanceType = InstanceType<typeof MyClass>;

const instance: MyInstanceType = new MyClass("Alice", 30);
```

## any / unknown
### keyof any 为啥是 string | number | symbol
因为 keyof 本意是提取key值,key 的类型只能是 string / number / symbol

:::info
unknown 是 top type  
any 有时候是 top type，有时候是 bottom type
:::


顶级类型

```ts
type x2 = string extends unknown ? true : false; // true
type x2 = string extends any ? true : false; // true
```

any 是 bottom type

```ts
let x: any = 1;
x = [];
```

## 分配条件类型（Distributive Conditional Types）

:::tip ✈️✈️✈️
对于使用 extends 关键字的条件类型（即上面的三元表达式类型），如果 **_extends 前面的参数_** 是一个 _泛型类型_，当传入该参数的是 _联合类型_，则使用分配律计算最终的结果。

分配律是指，将联合类型的联合项拆成单项，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。
:::

满足两个要点即可适用分配律:

1. 参数是泛型类型
2. 代入参数的是联合类型

```ts
type P<T> = T extends "x" ? string : number;
type A3 = P<"x" | "y">; // A3的类型是 string | number
```

#### 防止条件判断中的分配

:::tip 🚀 防止条件判断中的分配
被 **数组、元组或 Promise** 等包装
:::

禁止分发

```ts{13-15}
// 元祖类型
type WrappedTuple<T> = [T] extends [boolean] ? "Y" : "N";
// 数组类型
type WrappedArray<T> = T[] extends boolean[] ? "Y" : "N";
// Promise
type WrappedPromise<T> = Promise<T> extends Promise<boolean> ? "Y" : "N";
​

type T1 = WrappedTuple<number | boolean>; // "N"
type T2 = WrappedArray<number | boolean>; // "N"
type T3 = WrappedPromise<true | false>; // "Y"

// 重要
type NoDistrubate<T> = T & {}
type UnionAsset<T> =  NoDistrubate<T> extends boolean ? true :false
// 没有分发
type s = UnionAsset<true | false>  // true

```

## enum(枚举)

### 扩展

```ts
enum Seasons {
  Spring = "Spring",
  Summer = "Summer",
}

namespace Seasons {
  export let Autum = "Autum";
  export let Winter = "Winter";
}

let s = Seasons.Autum; //[!code ++]
```

编译结果是:

```js
var Seasons;
(function (Seasons) {
  Seasons["Spring"] = "Spring";
  Seasons["Summer"] = "Summer";
})(Seasons || (Seasons = {}));

(function (Seasons) {
  Seasons.Autum = "Autum";
  Seasons.Winter = "Winter";
})(Seasons || (Seasons = {}));
```

### 获取 enum 的 key / value

```ts
enum Status {
  SUCCESS = "success",
  DANGER = "danger",
  WARNING = "warning",
}
```

#### 获取枚举的 key 类型

```ts
type StatusKey = keyof typeof Status;
// 'SUCCESS' | 'DANGER' | 'WARNING'

const keyArr: StatusKey[] = ["SUCCESS", "DANGER"]; // passed
```

#### 获取枚举的 value 类型

```ts
type StatusVal = `${Status}`;
// 'success' | 'danger' | 'warning'

const valArr: StatusVal[] = ["success", "danger", "warning"]; // passed
```

## assets

保证后续代码的安全执行,可以在后面推导出具体的类型

```ts
function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(message);
  }
}
```

assets NonNullable

```ts
function assertNonNull<T>(obj: T): asserts obj is NonNullable<T> {
  if (obj === null || obj === undefined) {
    throw new Error("Assertion failed: Object is null or undefined");
  }
}
```

assets number[]

```ts
function assertNumberArray(value: unknown): asserts value is number[] {
  if (!(value as any[]).every(item => typeof item === "number")) {
    throw new Error();
  }
}
```

## as(重新映射)

```ts{8}
interface Person {
  name:string
  age:number
  address:string
}

type PickKeysByValues<T extends object,U>={
  [K in keyof T as T[K] extends U ? never : K]:T[K]
}

type C = PickKeysByValues<Person,string>
```



## 类型声明文件
### 声明对象
```ts
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);
let count = myLib.numberOfGreetings;
```

使用 `namespace` 以key-value形式声明
```ts
  declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
```
### 声明变量/函数
可以以 `var/let/const` 声明变量
```ts
declare var foo1: number;
declare let foo2: boolean;
declare const foo: string;
```
可以声明函数，顺便还有类型重载
```ts
declare function foo3(s: string): string;
declare function foo3(s: number): number;
```

### 声明 class
```ts
  const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();
// 静态方法
Greeter.showGreeting2()

class SpecialGreeter extends Greeter {
  constructor() {
    super("Very special greetings");
  }
}
```
```ts
  declare class Greeter {
  constructor(greeting: string);
  greeting: string;
  showGreeting(): void;
  static showGreeting2():void
}
```

### 定义 module
```ts
import {mock,IMock} from "Mock"
mock({
  "@name": "asdf",
  "@type":12321
})
```
和其他类型一样,需要 export 导出
```ts
declare module "Mock" {
  export interface IMock {
    "@name": string;
    "@type": number;
  }
  function mock(option: Partial<IMock>): void;
  export { mock };
}
```
### 全局类型
只需要在 `.d.ts` 中不加 `export` 即是全局
```ts
interface IMock {
  "@name": string;
  "@type": number;
}

type x = 1 | 2 | 3;
``` 
## 其他
### Element / HTMLElement 的区别
```ts
let F:HTMLElement  = document.createElement("div"); 
let F1:Element  = document.createElement("div"); 
F1.style //[!code error]
F.style
```
```ts
interface HTMLElement extends Element, ElementCSSInlineStyle, ElementContentEditable, GlobalEventHandlers, HTMLOrSVGElement {
   hidden: boolean;
   readonly offsetHeight: number;
   readonly offsetLeft: number;
   click(): void;

   addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
   
   removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
}

interface ElementCSSInlineStyle {
    readonly attributeStyleMap: StylePropertyMap;
    readonly style: CSSStyleDeclaration;
}
```
所以 `HTMLElement` 是 `Element` 的子集

## 类型体操

### lookup (0062)

本质是把 Animal 中取出 type 值相等的

```ts
interface Cat {
  type: "cat";
  breeds: "Abyssinian" | "Shorthair" | "Curl" | "Bengal";
}

interface Dog {
  type: "dog";
  breeds: "Hound" | "Brittany" | "Bulldog" | "Boxer";
  color: "brown" | "white" | "black";
}

type Animal = Cat | Dog;

type cases = [
  Expect<Equal<LookUp<Animal, "dog">, Dog>>,
  Expect<Equal<LookUp<Animal, "cat">, Cat>>
];
```

```ts
//满足分发, 会进行分发
type Extract<T, U> = T extends U ? T : never;

type LookUp<U extends { type: string }, T> = T extends U["type"]
  ? Extract<U, { type: T }>
  : never;
```

### 获取必填属性(0057)

```ts
type cases = [
  Expect<Equal<GetRequired<{ foo: number; bar?: string }>, { foo: number }>>,
  Expect<
    Equal<GetRequired<{ foo: undefined; bar?: undefined }>, { foo: undefined }>
  >
];
```

Required 只能接收一个大的类型

```ts
//  type Required<T> = {
//     [P in keyof T]-?: T[P];
// };

type GetRequired<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};

type y = GetRequired<{ foo: number; bar?: string }>;
```

### 获取可选的 key 值

```ts
type cases = [
  Expect<Equal<OptionalKeys<{ a: number; b?: string }>, "b">>,
  Expect<Equal<OptionalKeys<{ a: undefined; b?: undefined }>, "b">>,
  Expect<
    Equal<
      OptionalKeys<{ a: undefined; b?: undefined; c?: string; d?: null }>,
      "b" | "c" | "d"
    >
  >,
  Expect<Equal<OptionalKeys<{}>, never>>
];
```

两种方式

1. 上文中的 `Required` 取反
   ```ts
   type OptionalKeys<T> = keyof Optional<T>;
   // 判断元素是否在 必填项中
   type Optional<T> = {
     [K in keyof T as T[K] extends Required<T>[K] ? never : K]: T[K];
   };
   ```
2. 判断是否与 `Omit` 之后的相同
   **K 写在形参里面还要再写一遍,因为是需要分发**

   ```ts
   type OptionKeys<T, K = keyof T> = K extends keyof T
     ? Omit<T, K> extends T
       ? K
       : never
     : never;

   interface Person {
     name: string;
     age?: number;
   }

   type G = OptionKeys<Person>; // age
   ```

   原因是,必填项可以继承自 `Person`,如果使用 `Omit` 忽略之后还能 extends T,则说明是 可选

   ```ts
   // {
   //    name: string;
   // }

   type L = Omit<Person, "age">;
   // true
   type X2 = L extends Person ? true : false;

   // {
   //    age: number | undefined;
   // }
   type L = Omit<Person, "name">;
   // false
   type X2 = L extends Person ? true : false;
   ```

### 设置 readOnly

```ts
type cases = [
  Expect<Alike<MyReadonly2<Todo1>, Readonly<Todo1>>>,
  // todo1 / todo2 都设置为 readonly
  Expect<Alike<MyReadonly2<Todo1, "title" | "description">, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, "title" | "description">, Expected>>
];

interface Todo1 {
  title: string;
  description?: string;
  completed: boolean;
}

interface Todo2 {
  readonly title: string;
  description?: string;
  completed: boolean;
}

interface Expected {
  readonly title: string;
  readonly description?: string;
  completed: boolean;
}
```

先把所有的参数都变为`readonly`，再与后面的进行交叉

```ts{4}
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [P in K]: T[P]
} & {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

原因

```ts
// {
//   z:string
// }

type X3 = {
  readonly z: string;
} & {
  z: string;
};

type C<T> = {
  [k in keyof T]: T[k];
};

// 交叉类型是一个是马老师的粉丝,一个是蔡徐坤的粉丝,他们共有的粉丝是交叉类型
type g3 = C<X3>;
```

### flatten

深度数组展开

```ts
type cases = [
  Expect<Equal<Flatten<[]>, []>>,
  Expect<Equal<Flatten<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,

  Expect<Equal<Flatten<[1, [2]]>, [1, 2]>>,

  Expect<Equal<Flatten<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, 5]>>,
  Expect<
    Equal<
      Flatten<[{ foo: "bar"; 2: 10 }, "foobar"]>,
      [{ foo: "bar"; 2: 10 }, "foobar"]
    >
  >
];
```

递归查询

```ts
type Flatten<T extends any[]> = T extends [infer First, ...infer RT]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<RT>]
    : [First, ...Flatten<RT>]
  : [];
```

### StringToUnion

```ts
Expect<Equal<StringToUnion<''>, never>>,
  Expect<Equal<StringToUnion<'t'>, 't'>>,
  Expect<Equal<StringToUnion<'hello'>, 'h' | 'e' | 'l' | 'l' | 'o'>>,
  Expect<Equal<StringToUnion<'coronavirus'>, 'c' | 'o' | 'r' | 'o' | 'n' | 'a' | 'v' | 'i' | 'r' | 'u' | 's'>>,
```

使用 | 手动联合

```ts
type StringToUnion<T extends string> = T extends `${infer K}${infer Rest}`
  ? K | StringToUnion<Rest>
  : never;
```

### merge

```ts
type Foo = {
  a: number;
  b: string;
};
type Bar = {
  b: number;
  c: boolean;
};

type cases = [
  Expect<
    Equal<
      Merge<Foo, Bar>,
      {
        a: number;
        b: number;
        c: boolean;
      }
    >
  >
];
```

```ts
type Merge<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? T[K]
    : K extends keyof U
    ? U[K]
    : never;
};
```

### as

```ts
interface Person {
  name: string;
  age: number;
}
// getName:()=>string
type G1<T> = {
  // 交叉类型限制 类型 相当于取的交集，因为 Capitalize 只接受 string
  // as 重新映射
  [k in keyof T as `get${Capitalize<k & string>}`]?: () => T[k];
};

let l: G1<Person> = {
  getAge: () => 12,
  getName: () => "2",
};
```

### 字符串联合类型 和 string 合并

```ts
type C = "sm" | "md" | Omit<string, "sm" | "md">; // 不能 string，
// 否则 sm 和  md 不生效
let g: C = "aaa";
let f: C = "sm";
```

### 两个对象取交集

要理解 `Extract` 的作用  
`type Extract<T,U> = T extends U ? T : never`

```ts
let person1 = {
  name: "zhufeng",
  age: 11,
  address: "回龙观",
};
let person2 = {
  address: "回龙观",
};

type InterSection<T extends object, K extends object> = Pick<
  T,
  Extract<keyof T, keyof K>
>;

// {
//   address: string;
// }
type InterSectionPerson = InterSection<typeof person1, typeof person2>;
```

### 数组转联合类型

使用 `Array`

```ts
type ElementOf<T> = T extends Array<infer R> ? R : any;

type TupleToUnion = ElementOf<[string, number, boolean]>; // 使用 infer
// string | number | boolean
```

### Filter

```ts
type Filter<T, U extends keyof any, F extends any[] = []> = T extends [
  infer L,
  ...infer R
]
  ? L extends U
    ? Filter<R, U, [...F, L]>
    : Filter<R, U, F>
  : F; // 说明已经遍历完毕

type x = Filter<["a", false, 1, "dev"], string>;
```

### 🚩 联合转交叉

在 逆变 中可以联合转交叉
在 `T extends  any` 中使用了分发

```ts
type UnionToIntersection<T> = (
  T extends any ? (arg: T) => void : never
) extends (arg: infer U) => void
  ? U
  : never;

type Eg9 = UnionToIntersection<{ key1: string } | { key2: number }>;
```

### 🚩 可选 key

1. 第一种写法

```ts
type OptionalKeys<T> = {
  [P in keyof T]: {} extends Pick<T, P> ? P : never;
}[keyof T];
```

2. 第二种写法
   ```ts
   type OptionalKeys<T, P extends keyof T = keyof T> = P extends keyof T
     ? T[P] extends {}
       ? P
       : never
     : never;
   ```
3. 第三种写法

   ```ts
   type RequiredKey<T> = { [P in keyof T]-?: T[P] };

   type OptionKeys<T> = {
     [K in keyof T as T[K] extends RequiredKey<T>[K] ? never : K]: T[K];
   };
   ```

   原理

```ts
// false
type Eg2 = {} extends { key1: string } ? true : false;
// Eg3 = true
type Eg3 = {} extends { key1?: string } ? true : false;
```

### Promise 数组

:::tip
keyof 一个数组 是一个 0 | 1 | 2
:::

```ts
type N = [number, string, boolean];

type C<T> = {
  [K in keyof T]: Promise<T[K]>;
  // keyof 一个数组  也是返回一个 数组
};

let PromiseAry: C<N> = [
  Promise.resolve(2),
  Promise.resolve("a"),
  Promise.resolve(false),
];
```

不能使用 `type x =  Promise<N[number]>`,否则会变成
`type x = Promise<string | number | boolean>`

### 🚩ParseQueryString

```ts
type MergeValues<One, Other> = One extends Other ? One : [One, Other];

type MergeParams<
  OneParam extends Record<string, any>,
  OtherParam extends Record<string, any>
> = {
  [Key in keyof OneParam | keyof OtherParam]: Key extends keyof OneParam
    ? Key extends keyof OtherParam
      ? // 既存在于 oneParam ，又存在于 OtherParam
        MergeValues<OneParam[Key], OtherParam[Key]>
      : OneParam[Key]
    : Key extends keyof OtherParam
    ? OtherParam[Key]
    : never;
};

// 把 string 改成对象 -->
type ParseParam<Param extends string> =
  Param extends `${infer Key}=${infer Value}`
    ? {
        [K in Key]: Value; // 必须使用 K in Key
      }
    : {};

type ParseQueryString<Str extends string> =
  Str extends `${infer Param}&${infer Rest}`
    ? MergeParams<ParseParam<Param>, ParseQueryString<Rest>>
    : ParseParam<Str>; // 这个是最后一位 c = 3 可以直接换成 { c : 3 }

type ParseQueryStringResult = ParseQueryString<"a=1&a=2&b=2&c=3">;
```

简写

```ts
type Split<
  T,
  str extends string = "",
  Res extends any[] = []
> = T extends `${infer L}${str}${infer R}`
  ? Split<R, str, [...Res, L]>
  : [...Res, T];

type Z2 = Split<"a=1&b=2&c=3", "&">;

// [a=1,b=2,c=3] 转成 {a:1,b:2,c:3}
type Z3 = {
  [K in Z2[number] as Split<K, "=">[0]]: Split<K, "=">[1];
};
```

### 表达式重载

```ts
type Example = {
  (x: number): number;
  (x: string): string;
};

const c: Example = (a: any) => a;
c("any");
```

```ts
const is: {
  (name: string, state: boolean): string | number;
  (name: string): number | string;
} = (name: string, args?: boolean) => {
  if (args === false) {
    return name;
  } else {
    return 0;
  }
};

is("a", false);
```

```ts
interface Counter {
  (): void;
  count: number;
}
// 原理很简单
// const 定义的是固定的值 const a:string = 'a'
// const 关键字确保不会发生对变量进行重新分配，并且只保证该字面量的严格类型

// let 定义的是可变的 let a:string = 'a' 那么 a 是string
// let 扩展为更通用的类型，并允许将其重新分配给该类型的其他值
const c203 = (): Counter => {
  const c = () => {}; // 这个地方 let 报错
  c.count = 20;
  return c;
};
```

## 应用

### 对象合并

```ts
const pt = { x: 666, y: 888 };

const id = { name: "semlinker" };
// 可以获取所有属性
const x = { ...pt, ...id };

// 或者使用 Object.assign
let z = {};
const x = Object.assign(z, pt, id);
z; // [!code error]
x; //[!code ++]
```

### 联合交叉

```ts
interface ILogInUserProps {
  isLogin: boolean;
  name: string;
  age: number;
}

interface IUnLoginUserProps {
  isLogin: boolean;
  from: string;
  sex: 0 | 1;
}

type f = (ILogInUserProps | IUnLoginUserProps) & { city: string };

let a: f = {
  isLogin: false,
  name: "123",
  age: 12,
  city: "",
};
```

### 可选部分属性

先把其中的不需要可选的属性使用 `Omit` 提取出来,再使用 `Partial`把可选属性变为可选

```ts
interface User {
  name: string;
  age: number;
  hobby: string;
}

// 拿出其他值 & 让这两个值 变成可选
type C<T, S extends keyof T> = Omit<T, S> & Partial<Pick<T, S>>;

type d = Computed<C<User, "age" | "hobby">>;
```

### 🚩 获取对象的 key 值

`K extends keyof S` 是为了分发

```ts
// 遍历对象，取其中的key 值
// T 是对象,如果 F 有值的话
type Path<
  S,
  F extends string = "",
  K extends keyof S = keyof S
> = K extends keyof S
  ? S[K] extends object
    ? Path<S[K], `${F}${F extends "" ? "" : "."}${K & string}`, keyof S[K]>
    : // {name:"zs"} 非嵌套对象
      `${F}${F extends "" ? "" : "."}${K & string}`
  : any;

function fn<S>(schema: S): (path: Path<S>) => void {
  return path => {};
}

const i = fn({
  home: {
    toolbar: {
      title: "title",
      welcome: "welcome",
    },
  },
  login: {
    userName: "用户名",
    age: 20,
  },
});

i("home.toolbar.welcome");
```

<iframe width="100%" height="600px"
src="https://www.typescriptlang.org/play?#code/FAguE8AcFMAIAUCGoAWAeAygGgGK2gB6jQB2AJgM6wWgBOAliQOawC8sA5B1gNL5GlKsANbRwAewBmsDGxFipM2AD45fQsXJVRE6bID8sYLBkBtHgF1+moeIBGAK2gBjULENJUmcxawADABIAbxwAX2C8DUEqLndODgAuDgA6DnCgvgAyajpGJlC-LB1FDB9lY1gEwJD0yIEteLjYhNgAImTW9KychmYClsQScABuECNgSQBXEld6cRJYSRJMZQAKCmcUaABbRBaMAEoW1chkFBbPdAxlA7ZVADdxejJYIIraaFBJ2gXT1DvXqFRqEQM55jRYPQ5EtVm8THtWgBGABMAGZUa0sBUUOJttAWnCTLBQOJxAAbOyIWgEipE4n0UBk-FtUAMpmY2lEgDu0DJYLxLVaPL5uOgHLpoSxJklFTJ4iYjBpdMmFGgtAAcogBW1ABSugHYjQCwKuKiYgmMzkQAGKWwGWhA6jYD0VatHF45Ik8mU2jJYX8sUHIA"/>

### 🚩url search 转对象

```ts
const str = "/name?age=12&name=zs";
let s = {
  name: "zs",
  age: "12",
};

// 就是拆分,把以前的结果放前面，后面依次添加
type SplitStr<
  T extends string,
  str extends string = "?",
  Res extends string[] = []
> = T extends `${infer L}${str}${infer R}`
  ? SplitStr<R, str, [...Res, L]>
  : [...Res, T];

// type SecondQuery = ["?","age=12&name=zs"]
type SecondQuery = SplitStr<typeof str, "?">[1];
// type ThirdQuery = ["age=12", "name=zs"]
type ThirdQuery = SplitStr<SecondQuery, "&">;

type QueryParams = {
  [K in ThirdQuery[number] as SplitStr<K, "=">[0]]: SplitStr<K, "=">[1];
};

const obj10: QueryParams = {
  age: "12",
  name: "zs",
};
```

### 对象重载

```ts
type Props = {
  name: string;
} & (
  | {
      gender: "male";
      salary: number;
    }
  | {
      gender: "female";
      weight: number;
    }
);

let s: Props = {
  name: "zs",
  gender: "female",
  weight: 100,
};

let s2: Props = {
  name: "zs",
  gender: "male",
  salary: 100,
};
```
### 字符串拼接
 此处必须使用拼接的这种形式,如果使用相加的形式，会转变成字符串
```ts
  const addOrMinus = (monthOryear: "month" | "year", addOrMinus: "+" | "-") => {
  let time = new Date(tempTime.year, tempTime.month, tempTime.date);

  type N = `${"year" | "month"}${"+" | "-"}`
  let map = new Map<N, Function>([])
  map.set('year+', function () {
    tempTime.year = time.getFullYear() + 1;
  })
  map.set('year-', function () {
    tempTime.year = time.getFullYear() - 1;
  })

  map.set('month+', function () {
    let m = time.getMonth() + 1;
    const c = time.setMonth(m);
    tempTime.month = new Date(c).getMonth();
  })

  map.set('month-', function () {
    let m = time.getMonth() - 1;
    const c = time.setMonth(m);
    tempTime.month = new Date(c).getMonth();
  })

  let fn = map.get(`${monthOryear}${addOrMinus}`); //[!code hl]
  fn?.()
}
```

### 不允许传入某种类型

使用 `never` 来控制传入类型
```ts
function log<T>(x:T extends number ? never : T){ }

log(10) //[!code error] // 类型 number 的参数不能赋给类型“never”的参数
log({})
log("10")
```