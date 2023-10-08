
# git
## git 操作
### commit message
- feat：新功能(feature(功能))
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动

### commit 提交
```bash
  # 不用加引号，随便写
  git commit -a -m 
```
### 仓库
- 工作区(working tree): 本地编辑器
- 暂存区(index):git add操作后进入暂存区，可用git status查看
- 本地仓库(repository):git commit 后进入本地仓库


### 修改

#### git restore
```bash
# 取消暂存区的修改，文件的修改会回到工作区。
git restore --staged <文件名>
```
```bash
# 可以将工作区的修改取消
git restore <文件名>
```
#### git checkout 
```bash
# 也可以将工作区的修改取消。
git checkout <文件名>
```

#### (amend)修改上一次
```bash
# 把上一次的commit记录去除，修改commit信息。
git commit --amend
```
```bash
# 此时 commit 信息 变为 '重新修改
# 如果 不加 m 会进入 编辑模式
 git commit --amend -m '重新修改'
```

#### git reset 
```bash
# 将暂存区的所有文件恢复到工作区
git reset HEAD
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
*i 是interactive(交互式 / 互动)*  
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
例子:
```bash
  # git log
# messageId
	# 76fb07   最后一次
	# fef7e6 	 最二次
	# fef7e6   第一次

# 需要带上^,这样可以带上本次，如果没有，不包含自己
git rebase -i fef7e6^
# 进入 编辑页面
# 编辑是从 老 -> 新 进行排序
# 可以使用 e (edit) / r(reword(改写))
# 如果使用了 e

# 使用 git commit --amend -m 需要改变的内容
git commit --amend -m 再次修改
	# 执行 git rebase --continue
git rebase --continue

# 如果使用了 r
	# 会进入另一个 编辑页面
	# 修改之后不用 git rebase
```

## 分支
### 查看
```bash
 git branch -a
# * master
```
### 添加分支
```bash
 git branch dev
#   dev
# * master
```
### 切换分支
```bash
git checkout dev
```
### 添加并且切换分支
```bash
git checkout -b dev
```
### 删除分支
不能再当前分支删除
```bash
git branch -d dev
```
### 合并分支
```bash
 # 在 master 分支上合并
git merge dev
```
### 合并其他分支的文件
也就是说合并 `origin/dev` 分支下的 这个文件夹
```bash
 git checkout origin/dev src/views/Board-management/personal-management/performance-management 
```
### 合并其他分支的这一次的提交

在 `dev` 分支下,有一个 `commitId` 为 `123456`  

在 `Q` 分支下,使用:
```bash
 git cherry-pick 123456
```
可以把其他分支的 `commit` 合并到本分支

### 添加其他分支的文件
比如在 `02` 分支下, 修改了文件,需要在 `03` 分支下同步,那么在 02 分支下使用
```bash
# 从最近一次打起
git format-patch HEAD^
# 最近的二个patch内容
git format-patch HEAD^^
```
同上
```bash
git format-patch -1
git format-patch -2
```

会生成一个 `02.patch` 文件   
把这个文件放到 `03` 根目录下  
在 `03` 分支下,使用 
```bash
git am 02.patch
```

#### 其他操作

##### 生成单个commit 的 patch
```bash
#生成单个commit的patch
git format-patch -1 <r1>
```
##### 生成某commit以来的修改patch
```bash
 #生成某commit以来的修改patch（不包含该commit）
 git format-patch <r1>  
```
##### 生成两个commit间的修改的patch
```bash
 #生成两个commit间的修改的patch
git format-patch <r1>..<r2>  
```

### 暂存分支
```bash
# 在 dev 分支 开发，突然要切换回 master 分支
# 在 dev 分支,暂存，不用 add
git stash 
# 查看分支
git stash list
# 使用分支,并且删除 ，和 数组 pop 一样
git stash pop
# 使用分支，但不删除
git stash apply
# 删除分支
git stash drop
```
## gitignore

``` 
├─ dist
│	 ├─ 1.md
├─ a
│  ├─ dist.md
│  ├─ a1.jpg
│  └─ a2.md
└─ b
   ├─ dist
	 │  ├─ b1.jpg
   ├─ b2.jpg
   └─ b21.jpg
```	 
### 单独文字
如果只写一个 `dist`, **不管嵌套多深,不论是文件还是文件夹** 都会被排除,
会排除`dist`,`a/dist`,和 `b/dist`

### 斜杠
1. 斜杠在前面
   > 他是以 `.gitignore` 为基础出发, `/dist` 会排除 `dist` 文件或者是 `dist` 文件夹
2. 斜杠在中间
  > `a/dist`,以 `.gitignore`,找 `a` 下面的 `dist` 的文件或者文件夹
3. 斜杠在后面
  > `dist/` 表示只匹配文件夹,不匹配文件，也就是 `dist`,`b/dist` 会被排除,`a/dist`	不会排除 
### *
`*.jpg` 会匹配 `a1.jpg` 和 `b1.jpg`和`b2.jpg`  
使用 `b/*.jpg` 无法匹配 `b/dist/b0.jpg`,需要使用 `b/**/*.jpg`,这里的 `**` 表示多重层级

### ?
 星号表示多个字符,问号表示一个字符  
 所以 `b/**/?.jpg` 无法匹配 `b/b21.jpg`

### !
表示 非  
`upload/**/*.*` 忽略 `upload` 下的所有文件,这样的话 `upload` 目录不会存在  
`!upload/1.txt` 不忽略 `upload/1.txt`,这样的话 `upload` 目录会存在
