
# git



## 用户名 / 邮箱

#### 设置用户名和邮箱
```bash
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```
这样的话，可以在本地仓库中使用全局的用户名和邮箱。

#### 查看用户名和邮箱   

```bash
git config --global user.name
git config --global user.email
```

或者 git config [key]

```bash
git config user.name
```

## commit message
- feat：新功能(feature(功能))
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动
- upd：更新某功能（不是 feat, 不是 fix）


## git 区域
<img src="@other/git区域.png"/>

- 工作区(working tree): 本地编辑器
- 暂存区(index):git add操作后进入暂存区，可用git status查看
- 本地仓库(repository):git commit 后进入本地仓库


<img src="@other/git目录.png"/>


## git 操作

### (amend)修改上一次
```bash
# 把上一次的commit记录去除，修改commit信息。
git commit --amend
```

```bash
# 此时 commit 信息 变为 '重新修改
# 如果 不加 m 会进入 编辑模式
 git commit --amend -m '重新修改'
``` 
相当于把上一次的 `commit` 给覆盖了
```bash
git add .
git commit --amend --no-edit
```

### git reset 

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
git reset --soft HEAD^n
```

### git revert

当 `git push` 之后，需要回退  

举个例子，当你使用 `a` 分支合并代码到 `b` 分支时，发现 `a` 分支有问题，可以使用 `revert` 取消

```bash
  git revert -n commit-id
```

只会反做commit-id对应的内容，然后重新commit一个信息，不会影响其他的commit内容

反做多个commit-id

```bash
git revert -n commit-idA..commit- idB
```

- 反做commit-idA到commit-idB之间的所有commit
- 注意：使用-n是应为revert后，需要重新提交一个commit信息，然后在推送。如果不使用-n，指令后会弹出编辑器用于编辑提交信息

####  reset 和 revert 的区别  

git reset 是回滚到对应的commit-id，相当于是删除了commit-id以后的所有的提交，并且不会产生新的commit-id记录，如果要推送到远程服务器的话，需要强制推送-f  

git revert 是反做撤销其中的commit-id，然后重新生成一个commit-id。本身不会对其他的提交commit-id产生影响，如果要推送到远程服务器的话，就是普通的操作git push就好了


### git rebase
使用 git rebase –i xxxx（commit编号），此处的编号是合并编号后一个提交的内容开始

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

# 需要带上~,这样可以带上本次，如果没有，不包含自己
git rebase -i fef7e6~

# 进入 编辑页面
# 编辑是从 老 -> 新 进行排序
```
### git commit
合并 add / commit 
```bash
git commit -am "easy"
```
### git stash
```bash
 # 可以填写 stash 信息
 git stash save cool
```
查看所有保存的信息
```bash
git stash list
```
使用对应的索引
```bash
 git stash apply 0
```

### git clone
```bash
git clone --depth 1 https://github.com/dogescript/xxxxxxx.git
```

## 分支
### 添加并且切换分支

创建 `dev` 分支并且切换到 `dev` 分支
```bash
git checkout -b dev
```
相当于

```bash
git branch dev
git checkout dev
```
### 删除分支
**不能再当前分支删除**
```bash
git branch -d dev
```
### 合并分支
会新增一个 commit 
```bash
 # 在 master 分支上合并
git merge dev
```

### 合并其他分支的文件
也就是说合并 `origin/dev` 分支下的 这个文件夹

```bash
 git checkout origin/dev src/views/Board-management/personal-management
```

### 合并其他分支的提交(cherry-pick)

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

也可以使用正则匹配

<blue>一定要在 git bash 上使用</blue>

```bash
git am *.am
```

#### 其他操作

##### 生成单个commit 的 patch
```bash
# 往前1个提交的内容
git format-patch -1 <r1>
```

```bash
# -n指patch数，07fe对应提交的名称, 某次提交（含）之前的几次提交
git format-patch –n 07fe
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
##### 输出到一个文件夹下

```bash
git format-patch -o path/ <r1>..<r2>
```

##### 检查能否应用成功

```bash
 git apply --check  newpatch.patch
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
# 使用指定版本号，因为你可能add多次 
git stash apply 版本号

# 删除分支
git stash drop
# 删除指定分支
git stash drop 版本号
```
### clone

#### 下载指定分支
这将会把 `yourrepository` 仓库的 `develop` 分支的代码下载到你的本地计算机上
```bash
git clone -b develop https://github.com/yourusername/yourrepository.git
```
#### 修改下载的文件夹
默认使用的是 git 中文件夹

```bash
git clone https://github.com/libgit2/libgit2 mylibgit
```
在本地创建的仓库名字变为 mylibgit。

#### 查看每一个分支的最后一次提交

```bash
git branch -v
```

```bash
  iss53   93b412c fix javascript issue
  * master  7a98805 Merge branch 'iss53'
  testing 782fd34 add scott to the author list in the readmes
```

## gitignore

[glob 模式🔗](#glob-模式)

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
### 忽略所有具有特定名称的文件

忽略所有具有特定名称的文件, 匹配任何名字带有 test 的文件和目录  

如果只写一个 `dist`, **不管嵌套多深,不论是文件还是文件夹** 都会被排除,
会排除`dist`,`a/dist`,和 `b/dist` 

### 斜杠
1. 斜杠在前面
   > 他是以 `.gitignore` 为基础出发, `/dist` 会排除 `dist` 文件或者是 `dist` 文件夹
2. 斜杠在中间
  > `a/dist`,以 `.gitignore`,找 `a` 下面的 `dist` 的文件或者文件夹
3. 斜杠在后面
  > `dist/` 表示只匹配文件夹,不匹配文件，也就是 `dist`,`b/dist` 会被排除,`a/dist`	不会排除 

### 任意字符*
`*.jpg` 会匹配 `a1.jpg` 和 `b1.jpg`和`b2.jpg`  
使用 `b/*.jpg` 无法匹配 `b/dist/b0.jpg`,需要使用 `b/**/*.jpg`,这里的 `**` 表示任意层级

`img*` 这个命令将忽略所有名字以 img 开头的文件和目录。

### 单个字符?
 星号表示多个字符,问号表示一个字符  
 所以 `b/**/?.jpg` 无法匹配 `b/b21.jpg`

### 非!
`upload/**/*.*` 忽略 `upload` 下的所有文件,这样的话 `upload` 目录不会存在  
`!upload/1.txt` 不忽略 `upload/1.txt`,这样的话 `upload` 目录会存在

### 或[]
[abc] 匹配任何一个列在方括号中的字符（这个例子要么匹配一个 a，要么匹配一个 b，要么匹配一个 c）（比如 [0-9] 表示匹配所有 0 到 9 的数字）


### 移除文件
已经 `git add`，则必须要用强制删除选项 -f。
```bash
git rm -f <file-name>
```

另外一种情况是，你想让文件保留在磁盘，但是并不想让 Git 继续跟踪 。

```bash
git rm --cached README
```

可以使用 `glob` 模式

```bash
git rm log/*.log
```

此命令删除 log/ 目录下扩展名为 .log 的所有文件

```bash
git rm *txt
```
该命令为删除以 `txt` 结尾的所有文件。

```bash
git rm [!1-9].txt
```
删除非 `1-9` 的txt

## log查看提交历史

 
|选项|	说明|
|:---:|:---:|
|-p| 按补丁格式显示每个更新之间的差异。|
|--stat | 显示每次更新的文件修改统计信息。|
|--shortstat|只显示 --stat 中最后的行数修改添加移除统计。|
|--name-only|仅在提交信息后显示已修改的文件清单。|
|--oneline|只显示commit信息|

### stat

```bash
git log --stat
```
如果你想看到每次提交的简略的统计信息，你可以使用 --stat 选项
```bash
commit 734df63110fae6db0ebef5daf89f63851d2989b0 (HEAD -> master)
Author: TSK2 <2939117014@qqcom>
Date:   Wed Jan 17 11:14:47 2024 +0800

    修改a

 a.txt | 1 +
 1 file changed, 1 insertion(+)
```

### shortstat

```bash
git log --shortstat
```

```bash
commit 734df63110fae6db0ebef5daf89f63851d2989b0 (HEAD -> master)
Author: TSK2 <2939117014@qqcom>
Date:   Wed Jan 17 11:14:47 2024 +0800

    修改a

 1 file changed, 1 insertion(+)
```


### name-only

```bash
git log ---name-only
```

```bash
commit 734df63110fae6db0ebef5daf89f63851d2989b0 (HEAD -> master)
Author: TSK2 <2939117014@qqcom>
Date:   Wed Jan 17 11:14:47 2024 +0800

    修改a

a.txt
```

### oneline

```bash
git log --oneline
```

```bash
734df63 (HEAD -> master) 修改a
b5a7601 提交b.txt
24c9f3f bcd heihei
```

### 限制 git log 输出的选项

|选项|	说明|
|:---:|:---:|
|-(n)| 仅显示最近的 n 条提交。|
|--since, --after | 仅显示指定时间之后的提交。|
|--until, --before|仅显示指定时间之前的提交。|
|--author,--committer |仅显示指定作者相关的提交。|
|--grep|仅显示含指定关键字的提交(指 commit 中的信息)|

```bash
git log --after="1-15" --before="1-20" --author="TSK" --grep="提"
```
或者是相对地多久以前 "2 years 1 day 3 minutes ago"。
```bash
git log --after="1-15" --after="1 day ago" --grep="提"
```

```bash
git log --graph --oneline --decorate --all
```
```txt
* bd5b85f (HEAD) 合并
* d113ff1 1.txt
* b5f72f2 (dev) 修改为dev
| * 4f7a014 (master) 修改为master
| *   f35e4d1 Merge branch 'dev'
| |\
| |/
|/|
* | 579ea03 dev.txt
| * f98eeca 1.txt
|/
* 734df63 修改a
* b5a7601 提交b.txt
* 24c9f3f bcd heihei
```

## 打标签

### 列出标签

```bash
git tag
```
你也可以使用特定的模式查找标签。

```bash
git tag -l 'v1.8.5*'
v1.8.5
v1.8.5-rc0
v1.8.5-rc1
v1.8.5.4
v1.8.5.5
```
### 创建标签
Git 使用两种主要类型的标签：轻量标签（lightweight）与附注标签（annotated）。

- 一个轻量标签很像一个不会改变的分支 - 它只是一个特定提交的引用。  
- 附注标签是存储在 Git 数据库中的一个完整对象。 
  > 它们是可以被校验的；其中包含打标签者的名字、电子邮件地址、日期时间；还有一个标签信息。  
  > 通常建议创建附注标签，这样你可以拥有以上所有信息；但是如果你只是想用一个临时的标签，或者因为某些原因不想要保存那些信息，轻量标签也是可用的。

#### 附注标签

只需要 `-a`(annotated(带注释的)), `-m` 是对此标签进行简单描述

```bash
$ git tag -a v1.4 -m 'my version 1.4'
$ git tag
v0.1
v1.3
v1.4
```
通过使用 git show 命令可以看到标签信息与对应的提交信息

```bash
$ git show v1.4


tag v1.4
Tagger: Ben Straub <ben@straub.cc>
Date:   Sat May 3 20:19:12 2014 -0700

my version 1.4

commit ca82a6dff817ec66f44342007202690a93763949
Author: Scott Chacon <schacon@gee-mail.com>
Date:   Mon Mar 17 21:52:11 2008 -0700

    changed the version numb
```

#### 轻量标签

轻量标签本质上是将提交校验和存储到一个文件中 - 没有保存任何其他信息。

```bash
$ git tag v1.4-lw
$ git tag
v0.1
v1.3
v1.4
v1.4-lw
v1.5
```

#### 后期打标签

```bash
$ git log --pretty=oneline
166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme
```

假设在 v1.2 时你忘记给项目打标签，也就是在 “updated rakefile” 提交。 你可以在之后补上标签。

```bash
$ git tag -a v1.2 9fceb02

$ git tag
v0.1
v1.2
```

#### 共享标签
git push 命令并不会传送标签到远程仓库服务器上。   
在创建完标签后你必须显式地推送标签到共享服务器上。 这个过程就像共享远程分支一样 - 你可以运行 git push origin [tagname]。

```bash
$ git push origin v1.5
```

如果想要一次性推送很多标签，也可以使用带有 --tags 选项的 git push 命令。 这将会把所有不在远程仓库服务器上的标签全部传送到那里。

```bash
git push origin --tags
```

#### 删除标签

删除本地标签
```bash
git tag - d 标签名称
```
删除远程仓库的标签

```bash
git push origin --delete 标签名称
```

#### 检出标签

> 检出标签的理解 ： 我想在这个标签的基础上进行其他的开发或操作。  
>检出标签的操作实质 ： 就是以标签指定的版本为基础版本，新建一个分支，继续其他的操作。  
> **以标签为基础创建一个新的分支**。

```bash
$ git checkout -b 分支名称 标签名称
```

## Git 别名

 如果不想每次都输入完整的 Git 命令，可以通过 git config 为每一个命令设置一个别名

```bash
 git config --global alias.co checkout
git config --global alias.ci commit

 git config --global alias.unstage 'reset HEAD --'

# 输入 git lg 可以直接打印
 git config --global alias.lg "log --oneline --graph --decorate --all"
```
这会使下面的两个命令等价：

```bash
git unstage fileA
git reset HEAD -- fileA
```

删除别名

```bash
git config --global --unset alias.lg
```
## merge 

它会把两个分支的最新快照（C3 和 C4）以及二者最近的共同祖先（C2）进行三方合并，合并的结果是生成一个新的快照（并提交）。

<img src="@other/basic-merge.png"/>

还有一种方法：你可以提取在 C4 中引入的补丁和修改，然后在 C3 的基础上应用一次。 在 Git 中，这种操作就叫做 变基。 你可以使用 rebase 命令将提交到某一分支上的所有修改都移至另一分支上，

```bash
git checkout experiment
git rebase master
```
<img src="@other/basic-rebase.png"/>

 你创建了一个特性分支 server，为服务端添加了一些功能，提交了 C3 和 C4。 然后从 C3 上创建了特性分支 client，为客户端添加了一些功能，提交了 C8 和 C9。 最后，你回到 server 分支，又提交了 C10。

<img src="@other/interesting-rebase.png"/>

假设你希望将 client 中的修改合并到主分支并发布，但暂时并不想合并 server 中的修改，因为它们还需要经过更全面的测试。 这时，你就可以使用 git rebase 命令的 --onto 选项，选中在 client 分支里但不在 server 分支里的修改（即 C8 和 C9），将它们在 master 分支上重放：

```bash
 git rebase --onto master server client
```
以上命令的意思是：“取出 client 分支，找出处于 client 分支和 server 分支的共同祖先之后的修改，然后把它们在 master 分支上重放一遍”。 这理解起来有一点复杂，不过效果非常酷。

```bash
$ git checkout master
$ git merge client
```

## Glob 模式

`glob` 是一种文件匹配模式，全称 `global`，它起源于 Unix 的 bash shell 中

|通配符|描述|示例|匹配|不匹配|
|:---:|:---:|:---:|:---:|:---:|
|\*|匹配0个或多个字符，包含空串|Law*|Law, Laws和Lawer| La, aw|
|?|匹配1个字符|?at|cat, bat|at|
|[abc]|匹配括号内字符集合中的单个字符|[cb]at|cat, bat|at, bcat
|[a-z]|匹配括号内字符范围中的单个字符|[a-z]at|aat, bat, zat|at, bcat, Bat|
|[^abc]或[!abc]|匹配非括号内字符集合中的单个字符|[!CB]at|cat, bat|Cat, Bat|
|[^a-z]或[!a-z]|匹配非括号内字符范围中的单个字符|[!A-Z]at|aat, bat, zat|Aat, Bat, Zat|
|**|globstar，匹配所有文件和任意层目录，如果**后面紧接着/则只匹配目录，不含隐藏目录|	src/**|	src/a.js, src/b/a.js, src/b/|	src/.hide/a.js|
|`{x, y, ...}`|Brace Expansion，展开花括号内容，支持展开嵌套括号| `a.{png,jp{,e}g}` |a.png, a.jpg, a.jpeg|--|
|?(pattern-list)|匹配0次或1次给定的模式|a.?(txt\|bin)|a., a.txt, a.bin|a|
|*(pattern-list)|匹配0次或多次给定的模式|a.*(txt\|bin)|a., a.txt, a.bin, a.txtbin|a|
|+(pattern-list)|匹配1次或多次给定的模式|a.+(txt\|bin)|a.txt, a.bin, a.txtbin|a., a|
|@(pattern-list)|匹配给定的模式|a.@(txt\|bin)|a.txt, a.bin|a., a.txtbin|
|!(pattern-list)|匹配非给定的模式|a.!(txt\|bin)|a., a.txtbin|a.txt, a.bin|
