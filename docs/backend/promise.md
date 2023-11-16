# Promise

**promise 源码实现**

## 基础

```js
const p = new Promise((resolve, reject) => {
  resolve(1);
});

p.then(res => {
  console.log(res, "res");
});
```

Promise 是一个 类，接受一个 Executor 执行器  
执行器 第一个参数 是 成功的回调, 第二个参数是 失败的回调

**Promise 有三个状态，PENGDING, FULFILLED, REJECTED，并且不能修改,所以不能是内部
属性**

类还有一个 then 方法,接收一个 函数， 同时把成功的回调的 return 值作为参数

## 同步

```js
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;
    // 状态
    this.status = PENDING;

    const fulfilled = value => {
      if (this.status == PENDING) {
        this.value = value;
        this.status = FULFILLED;
      }
    };

    const rejected = reason => {
      if (this.status == PENDING) {
        this.reason = reason;
        this.status = REJECTED;
      }
    };

    executor(fulfilled, rejected);
  }
  then(onFulfilled, onRejected) {
    if (this.status == FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status == REJECTED) {
      onRejected(this.reason);
    }
  }
}
```

可以支持同步，但是对于 异步就 没办法了  
由于 then 执行完毕， resolve 可能还没执行

```js
const p = new Promise((resolve, reject) => {
  resolve(1); // [!code --]
  setTimeout(() => {
    resolve(1); // [!code ++]
  }, 1000); // [!code ++]
});
```

## 支持异步

发布订阅模式

```js
class Promise {
  constructor(executor) {
    this.value = undefined;
    this.reason = undefined;

    this.onFulfilledCallbacks = []; // [!code ++]
    this.onRejectedCallbacks = []; // [!code ++]

    const fulfilled = value => {
      if (this.status == PENDING) {
        this.value = val;
        this.status = FULFILLED;
        this.onFulfilledCallbacks.forEach(fn => fn()); // [!code ++]
      }
    };

    const rejected = value => {
      if (this.status == PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallbacks.forEach(fn => fn()); // [!code ++]
      }
    };
  }

  then(onFulfilled, onRejected) {
    if (this.status == PENDING) {
      // 也可以直接 Push onRejected,但是这样无法做其他操作
      this.onRejectedCallbacks.push(() => {  // [!code ++]
        onRejected(this.reason);// [!code ++]
      });// [!code ++]

      this.onFulfilledCallbacks.push(() => { // [!code ++]
        onFulfilled(this.value);  // [!code ++]
      });// [!code ++]
    }
  }
}
```
当执行 `then` 的时候,只是把 `then` 里面的回调函数传入对应的 `函数池` 里面,  
当 `Promise` 状态改变的时候,会依次执行 `函数池` 里面的函数，此时的 `value` 是最新的 值

```js
let v = 10;

let arr = [];
arr.push(()=>{
  console.log(v) // 20
})

v = 20;
arr.forEach(f=>f())
```
⭐函数懒执行,只有当执行的时候,才会计算 `v` 的值
## 防止报错

```js
const p1 = new Promise((resolve, reject) => {
  throw new Error("");
});
```

```js
class Promise {
  constructor(executor) {
    try {  // [!code ++]
      executor();
    } catch (e) {
      rejected(e);
    }
  }
}
```

## resolve 中嵌套 Promise

resolve 里面嵌套 promise,以里面的 promise 的结果为最终结果

```js
new Promise((resolve, reject) => {
  resolve(
    new Promise(resolve => {
      resolve(1);
    })
  );
}).then(res => {
  console.log(res); // 1
});

// 失败的以失败的结果为主
new Promise((resolve, reject) => {
  resolve(
    new Promise((resolve, rej) => {
      rej(1);
    })
  );
})
  .then(res => {
    console.log(res); 
  })
  .catch(e => {
    console.log(e); // 1
  });
```

```js
class Promise {
  constructor(executor) {
    const onFulfilled = val => {
      if (this.status == PENGING) {
        // 由于状态不会发生变化,只会有一次机会,
        // 如果是 reject,那么一直都是 reject
        if (val instanceof Promise) {  //[!code ++]
          return val.then(onFulfilled, onRejected); //[!code ++]
        }//[!code ++]

        this.value = val;
        this.status = FULFILLED;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };
  }
}
```

## then 链的链式调用

判断 then 中的返回值  

返回一个promise
```js
new Promise((resolve, reject) => {
  resolve(2);
})
  .then(res => {
    console.log(res);
    return new Promise(resolve => {
      resolve(10);
    });
  })
  .then(e => {
    console.log(e);  // 10
  });
```

返回一个普通值

```js
new Promise((resolve, reject) => {
  resolve(2);
})
  .then(res => {
    console.log(res); // 2
    return 1; // 1
  })
  .then(e => {
    // 以上一个的返回值为下一个then 的结果
    console.log(e); // 1
  });
```

```js
class Promise {
  // x 是上一个 then 获取的 返回值
  // 需要根据 x 来判断 是否是 原始值 或者 Promise

  // 需要 Promise 自身和 then 的返回值作为对比，避免死循环
  then(onFulfilled, onRejected) {
    let promise2 = new Promise((resolve, reject) => {
      if (this.status == FULFILLED) {
        // then 里面可能是普通值，也可能是 new Error
        // resolve 是一个函数 是fulfilled

        // 但是 Promise 是同步的，获取不到 Promise2
        // 所以使用 异步
        setTimeout(() => {
          try {
            // 上一个 promise的返回结果，
            // 如果是 promise,还需要找到 promise 的结果
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject); // [!code ++]
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.status == REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      if (this.status == PENDING) {
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              console.log(e, "e");
              reject(e);
            }
          });
        });
        this.onFulfilledCallbacks.push(() => {
          //个人感觉这个地方不需要 包装
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise2;
  }
}
```

**resolvePromise**

```js
function resolvePromise(promise2, x, resolve, reject) {
  let called = false;
  if (x == promise2) return new TypeError("一样");

  // 判断返回结果
  if ((typeof x == "object" && x != null) || typeof x == "function") {
    // let x = {}
    // Object.defineProperty( x, 'then', {
    //   get(){
    //     throw new Error
    //   }
    // })
    // x.then
    try {
      // 判断 x 是否是 promise
      then = x.then;
      if (typeof then == "function") {
        // { then :function }
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            // 万一 y 还是 Promise  知道不是 Promise
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            // 失败直接结束
            reject(r);
          }
        );
      } else {
        // 返回值不是一个 promise
        // x = {a:1}
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 返回了一个普通值
    resolve(x);
  }
}
```

## 忽略 then 中的参数

```js
const p1 = new Promise((resolve, reject) => {
  reject(1);
});
// 只是把 数据 传递给 p2,没必要 写 在p1里面 在过一遍
let p2 = p1.then(null, null);

p2.then(data => {
  console.log(data);
});
```

```js
class Promise {
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled == "function" ? onFulfilled : v => v;
    onRejected =
      typeof onRejected == "function"
        ? onRejected
        : e => {
            throw e;
          };
  }
}
```

## 辅助方法

### resolve 

```js
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    resolve(value);
  });
};
```

### finally

无论什么状态都可以往下执行,并且保留以前的状态

```js
Promise.prototype.finally = function (callback){ 
  return this.then(
    data => {   
      // 保留以前的状态
      return Promise.resolve(callback()).then(() => data )}, 
    err => {
      return Promise.resolve(callback()).then(() => {throw err})});
```

### race
如果传入了一个空数组, 因为是 `arr.length == 0`,所以不会执行 `resolve`,所以只能返回 一个 `pending` 的 `promise`
```js
let PromiseArr = [P1, P2, P3];
function Race(arr) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < arr.length; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
}
```

## 完整代码

```js
const PENGING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function resolvePromise(promise2, x, resolve, reject) {
  if (x == promise2) return new TypeError("循环引用");
  let then, called;
  //  2.3.3 x 是函数或者对象
  if (x != null && (typeof x == "object" || typeof x == "function")) {
    // 2.3.3.2 异常直接reject
    try {
      // 2.3.3.1 then 为 x.then
      then = x.then;

      // 2.3.3.3 判断函数
      if (typeof then == "function") {
        // 2.3.3.3 x 作为 this
        // 相当于 x.then(function(y){},function(r){})
        then.call(
          x,
          function (y) {
            // 2.3.3.3.4.1 已经调用过，直接忽略掉
            if (called) return;
            called = true;
            // 2.3.3.3.1 如果是 resolve，则继续往下判断是否是 promise
            resolvePromise(promise2, y, resolve, reject);
          },
          function (r) {
            // 2.3.3.3.4.1 已经调用过，直接忽略掉
            if (called) return;
            called = true;
            // 2.3.3.3.2 如果是 reject ，直接停止判断
            reject(r);
          }
        );
      } else {
        // 不是函数，只是一个普通对象
        resolve(x);
      }
    } catch (e) {
      // 2.3.3.2 异常直接reject
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 普通值直接返回
    resolve(x);
  }
}

class Promise {
  constructor(executor) {
    //
    this.value = undefined;
    this.reason = undefined;
    this.status = PENGING;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const onFulfilled = val => {
      if (this.status == PENGING) {
        if (val instanceof Promise) {
          return val.then(onFulfilled, onRejected);
        }

        this.value = val;
        this.status = FULFILLED;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    };
    const onRejected = reason => {
      if (this.status == PENGING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    // 默认执行一次
    executor(onFulfilled, onRejected);
  }
  then(onFulfilled, onRejected) {
    // 默认值
    onFulfilled = typeof onFulfilled == "function" ? onFulfilled : v => v;
    onRejected = typeof onRejected == "function" ? onRejected: e => { throw e; };

    let promise2 = new Promise((resolve, reject) => {
      if (this.status == FULFILLED) {
        try {
          let x = onFulfilled(this.value);
          setTimeout(() => {
            resolvePromise(promise2, x, resolve, reject);
          });
        } catch (err) {
          reject(err);
        }
      }
      if (this.status == REJECTED) {
        try {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (err) {
          reject(err);
        }
      }
      if (this.status == PENGING) {
        this.onFulfilledCallbacks.push(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      }
    });
    return promise2;
  }
  catch(callback) {
    this.then(null, callback);
  }
  static resolve(val) {
    return new Promise((resolve, rejcet) => {
      resolve(val);
    });
  }
  static reject(err) {
    return new Promise((resolve, rejcet) => {
      rejcet(err);
    });
  }
  static all(arr) {
    return new Promise((resolve, rejcet) => {
      let len = arr.length,
        ret = [];
      arr.forEach((val, idx) => {
        Promise.resolve(val).then(res => {
          ret[idx] = res;
          if (--len == 0) {
            resolve(ret);
          }
        }, rejcet);
      });
    });
  }
  static race(arr) {
    return new Promise((resolve, reject) => {
      arr.forEach(val => {
        Promise.resolve(val).then(resolve, reject);
      });
    });
  }
  finally(callback) {
    // value
    return this.then(
      value => this.resolve(callback()).then(() => value),
      reason =>
        this.resolve(callback()).then(() => {
          throw reason;
        })
    );
  }
}
```
