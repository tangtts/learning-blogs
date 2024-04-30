
```ts
// 定义一个 __awaiter 函数，用于接收两个参数：thisArg 和 generator
var __awaiter = function (thisArg, generator) {

  function adopt(value) {
    return new Promise(function (resolve) {
      resolve(value);
    });
  }

  return new Promise(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ?
        // 已经结束
        resolve(result.value) :
        // 接着调用
        adopt(result.value).then(fulfilled, rejected);
    }

    // 

    // generator 本身是一个 yield，然后执行，返回一个生成器
    // 所以 generator 变为了一个Generator
    step((generator = generator.apply(thisArg, [])).next());
  });
};

```

相当于 

```ts
function *a(){
  yield b();
}

function b(){
  return 1
}

let generator =  a(1);
generator
```

```ts
// 定义一个 a 函数，用于返回一个 Promise 对象
function a(x) {
  return __awaiter(this, function* () {
    // 使用 yield 关键字，调用 b 函数，传入一个参数：12，并将返回值赋值给变量 r
    let r = yield b(12);
    // 打印变量 r 的值
    console.log(r + x);
  });
}

// 定义一个 b 函数，用于接收一个参数：x，并返回 x 的值
function b(x) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(x);
    })
  })
}

// 调用 a 函数
a(1)

```