# TS
ts基础及类型体操 
## type 和 interface 的区别

:::tip 🚀type 和 interface 的定义区别
 `type` 是类型别名    
 `interface` 是定义一个新的类型  


 所以`type` 可以定义 `string/boolean` 等基本类型,也可以解释 `type` 合并会报错,`interface` 会合并
:::

安全

```ts
  // 示例2
  interface A1 {
    name: string
  }

  interface A2 {
    name: string
    age: number
  }
  // A的类型为string
  type A = A2 extends A1 ? string : number
  
  const a: A = 'this is string'

```
**A1，A2两个接口，满足A2的接口一定可以满足A1**，所以条件为真，A的类型取string

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
function test(para:User | number,flag : boolean  | void):number{
  return 12
}
const user = {
  name: 'Jack',
  age: 666
};
// Error: 参数不匹配
const res = test(12, false);
```
:::tip
不需要传参数需要传递void/undefined类型
:::
<iframe src="https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgKoGdrIN4ChnIhwC2EAXMumFKAOYDc+yct5hArsQEbSMC+uAPSDkgWcTAvvGA-b0CwKrhjsQCMMAD2IZJCoAKAA5wocChmgBKCiE48ojeYuVqNEbXoPnL0ADTIYAGxYUuFRUfCDgQMw5uXlwhEUADtUAuOW8-WmRAe+VAX4DAQptASHNAAnlAHgUPQAB0wEDIvMAkBOQAAwA3FWAAE2rkOQUlVXVNMF19Q2MoZAAfSKsPXxZkAKCQsIIR+qazCyioPAIoCDB2KHUARgAmXAEENSpkdkxBgF4cJiJSCgByAClEAGsnjyYWNgA2AHHRjCZCHDwAIngPkw4OQgCHlQAOpoBYOUAnMqAWUSPIAr5QygHozUEHQAw-1DMLhTiBzpt0Mhbt0tGDvHBoRATPQgA" width="100%" height="600"/>

### 函数兼容器
目的是为了安全
:::tip
***赋值的主要是赋值的是函数体***
形参数量少的可以赋值给形参数量多的,因为形参少，在函数体内只能用到这些形参
:::

#### 逆变
```ts
type Func= (a:string,b:string)=>void

let sum:Func
// 形参数量比 Func 少
let f1 = (a:string)=>{}
// 形参数量比 Func 多，在函数体内可能用到了形参
let f3 = (a:string,b:string,c:string)=>{}

 sum = f1
 // 错误，函数体还是f3，但是形参是 sum 的
 sum = f3
 // 还得是 三个形参
 f3("1","2","c")
```
<iframe src="https://www.typescriptlang.org/play?ssl=13&ssc=17&pln=1&pc=1#code/C4TwDgpgBAYgrgOwMYF4oAoCGAuAzsAJwEsEBzAGgCM9CTSBKFAPgDcB7IgEwChuAbCMCi44AW2zxk3APTSogI31AQ8qAHU0DziYBXrWIiRRAiDr9BUAGYBGKGiw1iZRkwDeAXxlylazZJ2AsTUAw-4Ap1QL+KyoDK8oChioD3yoC-AYAUroAMSoBhckoGQkYAzOYYOPjWFNRZdORIVnS2jrzCYumm3FCyUICYqYD30d6BQYAb8YD0ZqnegGLy7Urt5aJQgCFu1SJDaKnVta2A6foDgJBygFRyicYp6ABEJhvkGwBMOxtIG-RAA" width="100%" height="600"/>

#### 协变
:::tip
返回值 的个数大于 type 的返回值个数，不会报错  
***因为有可能拿着这个返回值去做其他事情，不能少个返回值***
:::

因为赋值赋的是函数体,不能少一个返回值
```ts
type Func= ()=>{name:string,age:number}

let sum:Func
let f1 = ()=>{ return {name:'zs'}}
let f2 = ()=>{return { name:'zs',age:20,gender:1 }}

// 报错,少一个返回值
sum=f1

sum=f2

// 使用的时候,这两个是必须存在的
sum().age / sum.name 
```
<iframe src="https://www.typescriptlang.org/play?#code/C4TwDgpgBAYgrgOwMYF4oAoCUKB8BvBAQwFsIAuAZ2ACcBLBAcwBpCHyE5iAjCagXwBQAgDYRgUCpzLxkIsVABmARihosuPFGpi41BFAIlyAcgBeFY30GjxCgEyqM2fNuC79moqTJmLLNmR2AAxMbAgAJrxkKlZCAPRxUIClRoCYqUyAiDqAAHKAVHKAK-GAe2qAPAoCksQoykKl5XZAA" width="100%" height="600"/>

### 特点
`TS` 中只有 `函数参数` 这一处逆变  

在逆变位置，可推到出交叉类型
在协变位置，可推导出联合类型

交叉类型
```ts
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;

type T20 = Bar<{ a: (x: string) => void; b: (x: string) => void }>; // string
type T21 = Bar<{ a: (x: string) => void; b: (x: number) => void }>;  // string & number
```

联合类型
```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type T10 = Foo<{ a: string; b: string }>; // string
type T11 = Foo<{ a: string; b: number }>; // string | number
```
<iframe src="https://www.typescriptlang.org/play?#code/C4TwDgpgBAQghgJwDwBUB8UC8UVQgD2AgDsATAZygG8o4AuKACnwYEtiAzCBKAVQEosGAG4B7VqQDcUAEYNmbTtz6DMI8aSgBfAFBQoAfj56oDYhGHdJOnaEg4ATAAYssREhr0mLKOWAJ2AHNVdQlpOW8GPwDiYKEoMQltNGkAelTffyDbcGgUBwBGV3hkT3kfaKCQhI1w8rMAVwBbGW5qxM0tFP10zJjAqAAyKGJm1oQbG17AeWVADeUc+wAxUVFUDGxcAiIySkZ+NTKodi4eXjqjpVPtQz5TEYsrSbs8gpdsZdW9g9oorNjzyqxZJpDKAwILF5Fd4rJBfNCHMHnUYtZRdEF9IJQAA+IzG3CAA" width="100%" height="600"/>

#### 数组逆变
```ts
interface Array<T> {
	concat(...arg:T[]):T[] // 这种写法会禁止逆变，不去检测 逆变
	// concat:(...arg:T[])=>T[]
}

let p!:Array<Parent>;
let c!:Array<Child>;
p = c
```
#### 函数扩展
```ts
function getName(){}
namespace getName {
    export const type = 'form'
}

console.log(getName.type)
```
#### 函数泛型


```ts
type ICallBack1 = <T>(item: T, idx: number) => T;

// 使用接口时确定类型，手动传入 
type ICallBack<T> = (item: T, idx: number) => T;

//手动传入
let fun:ICallBack<string> = (item,idx)=>item

// 禁止手动传入,因为它的类型就是 T  
let fun2:ICallBack1 =(item,idx)=>item

// 当传入一个字符串的时候，T 的类型被确定,返回值是 string 类型
fun2("aaa",1)
```

`type ICallBack1 = <T>(item: T, idx: number) => void;` 这种是运行时,根据传入 `item` 的类型来自动推导

<iframe src="https://www.typescriptlang.org/play?ssl=12&ssc=36&pln=3&pc=1#code/FDAuE8AcFMAIEkDCBDANqgQsgxgawIywC8sAPACoB8AFAJajQC2AXLOQDSy0AmAHqwDsArowBG0AE4BKYpVgA3APY8A3CAD062IH95QBSugUuNAx8qA300B2HoCztQN4+gaPVAMP+BpI0AVSoAJ5QKaKsMFDhI0mHLgo5EjoGFjZOHn5YYTFJGSI5JVUNdSc3YFRoUFgAMyEBZh90LDxSAGdQCVoBAHMg2BCmdkipBIBvAF8U2EBAz0AjazTXdkADtUAuOUBg7UAQtxtARh1AejM2WA9M7LyBACZClGL-QiJGxma+VspOoA" width="100%" height="600"/>

## 字符串
### 固定后缀字符串
```ts
const sType :{
  [k:`${string}HD`]:any
}  = {
  aHD:"AAA"
}
```
### 字符串分发
```ts
type T3 = `${'top' | 'bottom'}-${'left' | 'right'}`;

type T4 = `${1 | 2 | 3}` | 1 | 2 | 3 ;
```

## 元祖[tuple]
**用于保存定长/定数据类型的数据**
### 可选参数
```ts
type Either2dOr3d = [number, number, number?];
const e:Either2dOr3d = [1,1]


// 元祖类型，只能有一个数字
let d:[1 | 2 |3] = [2]
```
### 剩余参数
```ts
type BooleansStringNumber = [...boolean[], string, number];

const f:BooleansStringNumber = ['1',1]

// 前面只能是 boolean,或者是不填，不能是其他类型
const f:BooleansStringNumber = [false,1,'1',1] //[!code error]
```
### 联合参数
```ts
// 可以不用写最后的布尔值，固定了位置
type StringNumberBooleans = [string | number, number, ...boolean[]];
let s:StringNumberBooleans = ["a",12]
```
### 命名参数
```ts
type StringNumberBooleans= [name:string,age:number] 
let s:StringNumberBooleans = ["a",12]
```
## {} & Object & object

:::info
object：表示任何非原始类型的值，包括对象、数组、函数等，  
但不包括 null 和 undefined  

Object 表示一个 js 的全局对象,任何时候都不建议使用  

{} 是Object 的实例,和 Object 一样
:::

<iframe src="https://www.typescriptlang.org/play?#code/FDA2FMBcAIHsCMBWAuOTwGNIG5gMdALzQDeAvttAPRXSAQKoKs2gMP+BeXoJ-aghjGD0ZmopjIG8fQNHqeJEWgBtALqUa9ZoAdTQCN+PfP2jDRBYgAoAlEQB8pCtVqMmgX8UFq9Fg0j84gIyVo7s9EB66QwA0PADsAVwBbeHAAJwcQCBh8ACZUAHk7HC148XJZc2Z2bmgUvntNBPFpbPkmZR5C9RKkDN0DQmMszwtrGtTo0uJnDwH2v36uosERGKhoAA9UNXtiACIAC3BQUFhFisBYOQtAdW1AMm9AJjkuQHzlQGnNYSZt2zHosCmAT2TupYB3WAjQABMtz13mIcThcrjcCt1NJMYAAvZDkcSLACGi2AQA" width="100%" height="600"/>


## 关键字
### NonNullable
去除 null 类型,*主要利用了 TS 的分发类型*
```ts
// 原理
type NonNullable<T> = T & {}
// null | HTMLElement
let ele = document.getElementById("div");
// 去除 null
type D =  NonNullable<typeof ele> // HTMLElement
//只有 HTMLElement
(ele as D).style.color= 'red';
```

### is
类型收紧 的 更加具体
```ts
interface Bird {
  fly:string
}

interface Fish {
  swim:string
}

function isBird(val:Bird | Fish):val is Bird {
  return "fly" in val
}

// 是因为 isBird 返回的是一个 boolean 值，所以才需要一个 is 关键字
function test(a:Bird | Fish){
  if(isBird(a)){
    a // Bird
  }else {
    
  }
}
```
### satisfies(使满足)
```ts
interface Vibe {
  mood: "happy" | "sad";
}

// vibe.mood: "happy" | "sad"
const vibe: Vibe = {  // [!code --]
  mood: "happy",      // [!code --]
};                    // [!code --]  


// vibe.mood: "happy"
const vibe = { // [!code ++]
  mood: "happy",// [!code ++]
} satisfies Vibe;// [!code ++]
```

```ts
type ICustomerImage = {
  height: string
}

type UserImage = string | ICustomerImage

interface IUser  {
  id:number
  image: UserImage
}

const badImage:IUser = {
  id:1,
  image:"aa"
}

const goodImage = {
  id:1,
  image:"aa"
} satisfies IUser

badImage.image // 只能获取字符串和 对象的公有方法
goodImage.image // 就是一个字符串，可以获取字符串的方法
```

## any / unknown

:::info
unknown 是 top type
any 有时候是 top type，有时候是 bottom type
:::

顶级类型
```ts
type x2 = string extends unknown ? true : false // true
type x2 = string extends any ? true : false // true
```
any 是bottom type
```ts
let x:any = 1;
x = []
```
### 分配条件类型（Distributive Conditional Types）

:::tip
对于使用extends关键字的条件类型（即上面的三元表达式类型），如果**extends前面的参数**是一个*泛型类型*，当传入该参数的是*联合类型*，则使用分配律计算最终的结果。  

分配律是指，将联合类型的联合项拆成单项，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。
:::

满足两个要点即可适用分配律:  
1. 参数是泛型类型
2. 代入参数的是联合类型
```ts
  type P<T> = T extends 'x' ? string : number;
  type A3 = P<'x' | 'y'>  // A3的类型是 string | number
```
#### 防止条件判断中的分配

:::info 🚀防止条件判断中的分配
  被 **数组、元组或 Promise** 等包装
:::

```ts
// 分发
type Naked<T> = T extends boolean ? "Y" : "N";
type T0 = Naked<number | boolean>; // "N" | "Y"
```
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



### Exclude
```ts
type Exclude<T, U> = T extends U ? never : T
```
举例来说
```ts
type A = Exclude<'key1' | 'key2', 'key2'> // 'key1'
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
### Extract
```ts
type Extract<T, U> = T extends U ? T : never;
```
### ReturnType
```ts
type MyReturnType<T extends Function>= T extends (...args:any)=>infer R ? R : never
```

### keyof
遍历
:::info
如果 T 里面是 类型的集合，T[P]返回的就是类型
T 里面是 具体的值，那么 T[P]返回的就是具体的值
:::
```ts
type ExcludeType<T extends Array<any>,K extends string | number | boolean> = {
  [P in keyof T]:T[P] extends K ? never : T[P]
}[number]
```
对多个对象进行遍历
```ts
type Merge<F extends Record<string, any>, S extends Record<string, any>> = {
  [K in keyof F | keyof S]: K extends keyof S ? S[K] : K extends keyof F ? F[K] : never
}
```
重新映射
```ts
type G1<T> = {
  // 交叉类型限制 类型 相当于取的交集，因为 Capitalize 只接受 string
  // as 重新映射
  // Uppercase 转大写
  // Lowercase
  // Capitalize 首字母大写
  // Uncapitalize 转小写
  [k in keyof T as `get${Capitalize<k & string>}`]?:()=>T[k]
}
```
### lookup(查找)
```ts
type D1 = {
 a: never;
 b: never;
 c: string;
}

// 使用 keyof 的意思是 Pick 后面只能使用 'a' | 'b' |'c'
type OmitNever<T> = Pick<T, { [P in keyof T]: T[P] extends never ? never : P}[keyof T]>;  // { 'name':'zs',age :12 }['name' | 'age'] 'zs' 


type Me = { name: "阿宝哥", city: "XM" } ["name" | "city"]
type Me = "阿宝哥" | "XM" // 先生成映射类型后再利用Lookup Types


interface Example {
  a: string;
  b: boolean;
}
 
// 可以是 布尔也可以是 字符串
let D:Example["b" | "a"]= false 
```

### infer
infer只能 在条件类型的 extends 子句中，推断的类型变量需要可以在条件类型的 true 分支中引用。

infer 可以指代一个类型，也可以是具体的值

使用 inter P 让 ts 自己推导出函数的参数类型，并将推导的结果存到类型P上

:::danger
元组成员必须全部具有或全部不具有名称
:::

```ts
// 代表的是一个值
 type TrimLeft<V extends string> = V extends ` ${infer R}` ? R : V;
 let c:TrimLeft<" abcd"> = "abcd"

// [1, 2, 5, 3, 6]
type L = Flatten<[[1,2,5,3],6]>

// 不断递归	
type Flatten<T extends any[]> = T extends [infer F, ...infer R] ? F extends any[] ?
	[...Flatten<F>, ...Flatten<R>] : [F, ...Flatten<R>] : T
```
具名
```ts
// R 指代的第一个字符，infer _ 没有用到
type First<T extends any[]> = T extends [infer R, ...infer _] ? R : never

<First<[() => 123, { a: string }]>, () => 123>>

// 具名元祖类型
type First<T extends any[]> = T extends [F:infer R, ...args:infer _] ? R : never
```
指代类型
```ts
 type MyParameters<V extends Function> = V extends (s:infer P)=>any ? P :never;

 let c:MyParameters< (a:string)=>string > = ""
```
### InstanceType
```ts
type InstanceType<T extends abstract new (...args: any) => any> = T extends abstract new (...args: any) => infer R ? R : any;
```

```ts
class MyClass {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  getName(){
    return this.name
  }
}
type MyInstanceType = InstanceType<typeof MyClass>;

const instance: MyInstanceType = new MyClass("Alice", 30);
```

## enum(枚举)

### 扩展
1. 
```ts
enum Seasons {
  Spring = 'Spring',
  Summer = 'Summer'
}

namespace Seasons{
  export let Autum = 'Autum';
  export let Winter = 'Winter'
}
let s =  Seasons.Autum //[!code ++]
```
编译结果是:
```js
var Seasons;
(function (Seasons) {
    Seasons["Spring"] = "Spring";
    Seasons["Summer"] = "Summer";
})(Seasons || (Seasons = {}));

(function (Seasons) {
    Seasons.Autum = 'Autum';
    Seasons.Winter = 'Winter';
})(Seasons || (Seasons = {}));
```

### 获取 enum 的 key /value
```ts
enum Status {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
}
```
####  获取枚举的 key 类型
```ts
type StatusKey = keyof typeof Status; 
// 'SUCCESS' | 'DANGER' | 'WARNING'

const keyArr: StatusKey[] = ['SUCCESS', 'DANGER']; // passed
```
####  获取枚举的 value 类型
```ts
type StatusVal = `${Status}`;
// 'success' | 'danger' | 'warning'

const valArr: StatusVal[] = ['success', 'danger', 'warning'];  // passed
```
### assets
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
  if (!((value as any[]).every(item => typeof item === 'number'))) {
    throw new Error();
  }
}
```
## as
重定向
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

