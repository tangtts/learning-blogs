# 技巧 - js
## 强制传参
```js
// 如果不传参数的话，会直接报错
function throwIfMissing() {
 throw new Error('Missing parameter');
}
 
function foo(mustBeProvided = throwIfMissing()) { 
   return mustBeProvided;
}
```
## 对象设置正反值
```js
obj[obj.up = 0] = "up" // obj[0] = 'up'
// 由于obj 外面的值是等于号右边的值，所以造成 obj[0] = "up"
// 这也是enum 类型的来源
```

## 设置字符串形参
```js
  // 如果传 slow 字符串的话，其实就是传 600 默认值，也可以传固定时间
  let speeds = {
  slow:600,
  fast:500
}

function delay(time){
  time = speeds[time] || time
}
```

## js 中的枚举成员
使用 freeze 保证不会被修改
```js
const userType = Object.freeze({
  child:1,
  adult:2,
  elder"3"
})

if(xx == usertType.child) { }
```

## 变量默认值
```js
num = ++ num || 1
// 因为num 是 undefined 的话，会走后面的 1
// ++undefined s是 NaN，属于 falsy 值
```

## 统一导出
```js
 // 在 home.js 中使用到的 export default
export { default as Home} from "./Home.js"
// 本质是是下面的简写
import { default as Home } from "./Home.js"
export Home
// 在使用是
import {Home} fromr "../xxx"
```
## do-while 优化
 有大量的 if 条件语句,可以使用 do while
```js
let flag =false
if(a == 3){
	if(b == 4){
		if(c == 5){
			flag = true
		}
	}
}
// 使用 do while 优化
do {
	if(a !== 3){
		break;
	}
	if(b!== 4){
		break;
	}
	//更加的清楚，如果是在函数中，没有后续条件判断了，可以直接 return 
	// 使用 switch case 就不管用了，Switch 对于单一变量可用
	flag = true
}while(false)
```

## git
### commit message
- feat：新功能(feature(功能))
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动
### 仓库
- 工作区(working tree): 本地编辑器
- 暂存区(index):git add操作后进入暂存区，可用git status查看
- 本地仓库(repository):git commit 后进入本地仓库

### 修改 commit
#### (amend)修改上一次
```bash
# 把上一次的commit记录去除，修改commit信息。
git commit --amend
```

#### git reset 
```bash
# 回退到指定commit，该commit之后的提交内容，保留工作目录，新内容放进暂存区
git reset --soft

# 回退到指定commit，该commit之后的提交内容，工作区和暂存区的内容都被抹掉
git reset --hard

# 不带参数,或带参数–mixed(默认参数)，与git reset --soft 不同，新内容放到工作区
git reset 
git reset --mixed 
```
```bash
# 回到过去的某个版本
git reset --soft 158bd35

#  回退到上一个版本
git reset --soft HEAD^

# 回退N个版本
git reset --soft HEAD~n
```
#### git rebase 
使用git rebase –i xxxx（commit编号），此处的编号是合并编号后一个提交的内容开始
- pick  的意思是要会执行这个 commit
- squash(压扁)  的意思是这个 commit 会被合并到前一个 commit

```txt
首先，这个commitid表示你要进行rebase的base(基)，
也就是在commitId到当前HEAD之间的commit都会被列出来。然后你决定pick哪些 squash哪些
假设 你的commit log类似这样
commit 8 (HEAD)
commit 7
commit 6
commit 5
commit 4
commit 3
commit 2
...

你期望将从4到8的 commit 合并为一个，也就是基于3进行 rebase, 有两种方式，

1：直接 git rebase -i 3
2：相对当前HEAD, 因为3前面有5个 commit，那就是 git rebase -i HEAD~5
```