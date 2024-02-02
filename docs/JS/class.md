# class

## [🔗class 转 函数](https://babel.docschina.org/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&corejs=3.21&spec=false&loose=false&code_lz=FDD0CpOACdoYwDYEMDOroAUDM0DeMc0AXtALzQCMADIdNAOYCmALgIIAUAlAbPQL51BfOkjQYc0JgA8WTAHYATCQBZ8dRqwBC3XkQ3C4h6IVAhQoaADdkAJyy4KAMwCu8-CwCWAe3kPdYJb0ru5evv48gfTR8L6o3ohMAHSI3gwcLAAWnqhcUdHQWTlJpBQ0-dCCFtG2rC62fjhR_NwgbdUhHj5-APqe8plMtp4sqByoLgBGAMIo6AA00BMADkOz4lzqJtX0EzNzqEnLtt4spwCeq-TQAPKTAFZMHknwtchy4y6rtuvo0ABk_yWXzWByOJzOLEuTEWBB2MTiLFsLg83lsAC58NZkIgXExMXtfqhFgB3YYsZCTRKYpF4xaxeROTwMeqU6mFZFMSrzCr8LgAbnMQWgnic0E-3yJmzuj2eqFYmAhF1WNycn324nmK1BG2aQux9kwamcbi64SNHB6mEi8L6AyGIzGRsWVry8M6YUaKgCBV5FVqLHqXuaHBweSiNnsy2N0HkTBJWBUgqiDPiiRSaQ4ACJALwbgAC96AAP2gTOpWcW0aSPR6x1O3mrAraUWqMqeLCSiiYTLjiu83yhoew8wA5MRh_M4ZZ4TZcfiaDzqvCySM2finDj5Qup8KFC4ALZDVfo2kw5vChlMlm2I8ns-VcPVHDgutQ1ZJZjsa4e7oBeGphLJKk6SUAATJQ2BupYghRIkLDQMs1xxgmOCCtUyzvqwnAPpY_7pkBHDocQ4ZNmIfyYJQWzwVMiCePAJDXOU9DHJ4NhyJo7DMLogjQaREggVIsgKMoWAUbwVFUrR7FsJxPDcUAA&debug=false&forceAllTransforms=false&modules=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Ces2015%2Creact%2Cstage-3%2Ctypescript&prettier=false&targets=&version=7.23.1&externalPlugins=&assumptions=%7B%7D)


```js
class P3 {
  z = 10
  getA(){

  }
}
```
转化为 函数

```js
function P3() {
  this.z = 10;
}

P3.prototype.getA = function () {
  // 实现 getA 方法的逻辑
};

let p = new P3;
p.getA()
```

### 继承

```js
class P4 extends P3 {
  getB(){

  }
}
```

```js
function P4() {
  P3.call(this); // 调用父类构造函数初始化属性
}

P4.prototype = Object.create(P3.prototype); // 设置原型链，继承 P3 的方法
P4.prototype.constructor = P4; // 修复 constructor

P4.prototype.getB = function () {
  // 实现 getB 方法的逻辑
  console.log('p4')
};

let p4 = new P4();
```

## ts 中的 class
### 抽象类
```ts
abstract class V {
  abstract z:number
  abstract getx():string
}

class W extends V {
  z = 10
  getx(): string {
      return ""
  }
}
```
### 接口

```ts

interface A {
  z:number
  getX:(x:number)=> string;
}

class X implements A {
  z = 10
  getX (x: number) {
    return "aa"
  };
}
```