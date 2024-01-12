# sql

sql 是不区分大小写的,但是建议还是使用标准的写法，比如 关键字 使用大写


## 表设计的经验
### 命名规范
- 表名、字段名必须使用小写字母或者数字，禁止使用数字开头，禁止使用拼音，并且一般不使用英文缩写。
- 使用下划线命名法

### 选择合适的字段类型

- 尽可能选择存储空间小的字段类型，就好像数字类型的，从tinyint、smallint、int、bigint从左往右开始选择

|类型名称|	说明|	存储需求|
|:---:|:---:|:---:|
|TINYINT	|很小的整数	|1个字节|
|SMALLINT	|小的整数|	2个宇节|
|MEDIUMINT	|中等大小的整数|	3个字节|
|INT (INTEGHR)	|普通大小的整数|	4个字节|
|BIGINT|大整数|	8个字节|

|类型名称| 说明|	存储需求|
|:---:|:---:|:---:|
|TINYINT|	-128〜127|0 〜255|
|SMALLINT|-32768〜32767|	0〜65535|
|MEDIUMINT|	-8388608〜8388607|	0〜16777215|
|INT (INTEGER)|	-2147483648〜2147483647|	0〜4294967295|
|BIGINT|	-9223372036854775808〜9223372036854775807|	0〜18446744073709551615|

### 选择合适的字段长度

:::tip
其实在mysql中，varchar和char类型表示字符长度，而其他类型表示的长度都表示字节长度。比如char(10)表示字符长度是10，而bigint（4）表示显示长度是4个字节，但是因为bigint实际长度是8个字节，所以bigint（4）的实际长度就是8个字节。
:::

我们在设计表的时候，需要充分考虑一个字段的长度，比如一个用户名字段（它的长度5~20个字符），你觉得应该设置多长呢？可以考虑设置为 username varchar（32）

### 尽可能使用not null定义字段

如果没有特殊的理由， 一般都建议将字段定义为 NOT NULL 

- 其次，NULL值存储也需要额外的空间的，它也会导致比较运算更为复杂，使优化器难以优化SQL。
- 如果将字段默认设置成一个空字符串或常量值并没有什么不同，且都不会影响到应用逻辑， 那就可以将这个字段设置为NOT NULL。


### 不搞外键关联，一般都在代码维护

> 外键，也叫FOREIGN KEY，它是用于将两个表连接在一起的键。FOREIGN KEY是一个表中的一个字段（或字段集合），它引用另一个表中的PRIMARY KEY。它是用来保证数据的一致性和完整性的。

- 使用外键存在性能问题、并发死锁问题、使用起来不方便等等。每次做DELETE或者UPDATE都必须考虑外键约束，会导致开发的时候很难受,测试数据造数据也不方便。
- 还有一个场景不能使用外键，就是分库分表。

### 选择合适统一的字符集。

- utf8：支持中英文混合场景，国际通过，3个字节长度
- utf8mb4: 完全兼容utf8，4个字节长度，一般存储emoji表情需要用到它。
- GBK ：支持中文，但是不支持国际通用字符集，2个字节长度
- latin1：MySQL默认字符集，1个字节长度

###  如果你的数据库字段是枚举类型的，需要在comment注释清楚

```sql
`session_status` varchar(2) COLLATE utf8_bin NOT NULL COMMENT 'session授权态 00：在线-授权态有效 01：下线-授权态失效 02：下线-主动退出 03：下线-在别处被登录'
```
如果你的枚举类型在未来的版本有增加修改的话，也需要同时维护到comment。


### 时间的类型选择

- date ：表示的日期值, 格式yyyy-mm-dd,范围1000-01-01 到 9999-12-31，3字节
- time ：表示的时间值，格式 hh:mm:ss，范围-838:59:59 到 838:59:59，3字节
- datetime：表示的日期时间值，格式yyyy-mm-dd hh:mm:ss，范围1000-01-01 00:00:00到9999-12-31 23:59:59```,8字节，跟时区无关
- timestamp：表示的时间戳值，格式为yyyymmddhhmmss，范围1970-01-01 00:00:01到2038-01-19 03:14:07，4字节，跟时区有关
- year：年份值，格式为yyyy。范围1901到2155，1字节

推荐优先使用datetime类型来保存日期和时间，因为存储范围更大，且跟时区无关

### 1:N 关系的设计

日常开发中，1对多的关系应该是非常常见的。比如一个班级有多个学生，一个部门有多个员工等等。这种的建表原则就是： 在从表（N的这一方）创建一个字段，以字段作为外键指向主表（1的这一方）的主键。示意图如下:

<img src="@backImg/1对N外键.webp"/>

学生表是多（N）的一方，会有个字段class_id保存班级表的主键。当然，**一班不加外键约束哈，只是单纯保存这个关系而已**。  

有时候两张表存在N:N关系时，我们应该消除这种关系。通过增加第三张表，把N:N修改为两个 1:N。比如图书和读者，是一个典型的多对多的关系。一本书可以被多个读者借，一个读者又可以借多本书。我们就可以设计一个借书表，包含图书表的主键，以及读者的主键，以及借还标记等字段。


## database
### 创建 

```sql
CREATE DATABASE TEST;
```

### 进入

```sql
use test;
```

## 表
### 创建 table
**🏮是 属性名 属性类型 属性约束 注释 的集合**
```sql
CREATE TABLE student (
 id int primary key auto_increment comment "id", 
 name varchar(50) not null comment "学生名",
 gender varchar(10) not null comment "性别",
 age int not null comment "年龄",
 class varchar(50) not null comment "班级名",
 score int not null COMMENT "分数"
) charset=utf8mb4
```
在 SQL 中，我们有如下约束：

- NOT NULL - 指示某列不能存储 NULL 值。
- UNIQUE - 保证某列的每行必须有唯一的值。
- PRIMARY KEY - NOT NULL 和 UNIQUE 的结合。确保某列（或两个列多个列的结合）有唯一标识，有助于更容易更快速地找到表中的一个特定的记录。
- FOREIGN KEY - 保证一个表中的数据匹配另一个表中的值的参照完整性。
- CHECK - 保证列中的值符合指定的条件。
  > age int check( age > 0 && age <= 120) comment "年龄"
- DEFAULT - 规定没有给列赋值时的默认值。

#### 添加约束

```sql
CREATE TABLE Persons
(
    P_Id int NOT NULL,
    LastName varchar(255) NOT NULL,
    PRIMARY KEY (P_Id)  // [!code hl]
    FOREIGN KEY (P_Id) REFERENCES Persons(P_Id) // [!code hl]
)
```
当表已被创建时，如需在 "P_Id" 列创建 PRIMARY KEY 约束
```sql
ALTER TABLE Persons ADD PRIMARY KEY (P_Id)
```
当表已被创建时，如需在 添加 外键约束
```sql
ALTER TABLE Orders ADD FOREIGN KEY (P_Id) REFERENCES Persons(P_Id)
```

添加 default 约束
```sql
CREATE TABLE Persons
(
    P_Id int NOT NULL,
    Address varchar(255),
    City varchar(255) DEFAULT 'Sandnes' //[!code hl]
)
```
```sql
ALTER TABLE Persons ALTER City SET DEFAULT 'SANDNES'
```

#### 修改约束（alter / modify）
> alter 改变 ， modify 修改
> alter: 常指轻微的改变，强调基本上保持原物、原状的情况下所进行的部分改变
> modify: 强调起限定作用的变化或变更。指细小的变化，常含“缓和、降调”的意味
```sql
-- 在一个已创建的表的 "Age" 字段中添加 NOT NULL 约束
ALTER TABLE Persons MODIFY Age int NOT NULL;
-- 在一个已创建的表的 "Age" 字段中删除 NOT NULL 约束
ALTER TABLE Persons MODIFY Age int NULL
```

修改类型，由以前的 int 转变为 `varchar`
```sql
ALTER TABLE employee MODIFY age varchar(10)
```

#### 删除约束（alter / drop）
由于 主键只有一个，不需要指定列名
```sql
ALTER TABLE Persons DROP PRIMARY KEY
```
删除 DEFAULT 约束
> alter table 用于修改表,alter column 用于修改 列名
```sql 
ALTER TABLE Persons ALTER City DROP DEFAULT
```
删除 FOREIGN KEY 约束
```sql
ALTER TABLE Orders DROP FOREIGN KEY fk_PerOrders
```





### 修改列(ALTER TABLE)

`ALTER TABLE` 语句用于在已有的表中添加、删除或修改列
#### 添加列

```sql
ALTER TABLE table_name ADD column_name datatype(类型)
```
添加一列 c 并设置默认值为 0
```sql
alter TABLE employee add c int default 0
```


### 删除表

```sql
drop table if exists student;
-- 也可以简化
drop table student
```

## 查询 where
`select` 就是 `find` 操作，*可以看做数组的 `find` 方法*  
`from` 是源数组  
`select` 是解构变量，如果是 `*` 则是不解构  
`where` 就是 `find` 判断条件  

多个表相当于多个数组在 `find `内部  

聚合函数可以想象为自己编写的一个函数，可以把多个值聚合成一个值，如求和、求平均值、求最大值、求最小值等

```sql
select avg(e.salary) from emp e, dept d where e.dept_id = d.id and d.name = "研发部"
```

### 全部 
第一个是数据库名字 第二个是数据表名
```sql
SELECT * FROM test.student;
```
### 指定查询列
只查询 name，score 字段
```sql
SELECT name,score FROM student;
```
#### 查询列重命名（as）
在列名之后使用 `as`
```sql
SELECT name as "名字",score as "分数" FROM student;
```
使用 `CONCAT` 连接多个字段，并且 `as` 为另一个字段名
```sql
SELECT name, CONCAT(url, ', ', alexa, ', ', country) AS site_info FROM Websites;
```

#### 表别名（as）
把 `Websites` 表重命名为 `w`
```sql
SELECT w.name, a.count FROM Websites AS w, access_log AS a  WHERE a.site_id=w.id and w.name="菜鸟教程";
```
把 `employee` 重命名为 `e`
```sql
select  e.age  from  employee  as e where e.name = "王五";
```

### 去重distinct 

```sql
select class from student;
```
<img src="@backImg/查询.png"/>

使用去重

```sql
select distinct class from student;
```
<img src="@backImg/查询2.png"/>

### 带条件

#### 带一个查询条件
使用 `where`
```sql
SELECT name as "名字",score as "分数",age FROM student where age > 18;
```

#### 多个查询条件
使用 `and` 连接多个查询条件 
```sql
select name as '名字',class as '班级' from student where gender='男' and score >= 90;
```

### 模糊查询

#### LIKE
使用 `%` 代表任意字符，使用 `_` 代表一个字符
```sql
-- 可以查询 张三 张十三
SELECT name as "名字",score as "分数",age FROM student where name like "%三";
```

```sql
-- 只能查询 张三
SELECT name as "名字",score as "分数",age FROM student where name like "_三";
```
和 `not` 搭配使用

```sql
select * from  employee where name not Like("%三")
```

#### REGEXP
以 `张` 或者 `李` 开头
```sql
 select  * from  employee where name REGEXP '^[张李]';
```
不能以 `张` 或者 `李` 开头

```sql
 select  * from  employee where name REGEXP '^[^张李]';
```
以 `A-H` 之间开头
```sql
select  * from  employee where name REGEXP '^[A-H]';
```


### 运算符

#### in

相当于 数组的 `includes`

```sql
SELECT name , score  FROM student where class in ("一班","二班");
```
#### not in

```sql
SELECT name , score  FROM student where class not in ("一班","二班");
```

#### between and  / not between and
在一个区间
```sql
select * from student where age between 18 and 20;
```

#### and / or / not

```sql
Select * from emp where sal > 2000 and sal < 3000;
```

or

```sql
Select * from emp where sal > 2000 or comm > 500;
```

not

```sql
select * from emp where not sal > 1500;
```

```sql
SELECT * FROM employee WHERE age = 50 or age = 60 and name = "张三";
```

```sql
SELECT * FROM employee WHERE (age = 50 or age = 60) and not name = "张三";
```
> 因为运算符有优先级 `() > not > and > or`

#### is null /is not null
判断是否为 null

```sql
Select * from emp where comm is not null;
```

#### all
满足所有条件
<img src="@other/sqlAll.png"/>

#### any

满足其中一个条件
<img src="@other/sqlAny.png"/>



### 🏮子查询

想查询学生表中成绩最高的学生的姓名和班级名称

先查询最高分：

```sql
SELECT MAX(score) FROM student;
```

得知 这个学生分数为 `95`, 再查询这个分数为这个最高分的学生：

```sql
SELECT name, class FROM student WHERE score = 95;
```
合并

```sql
SELECT name, class FROM student WHERE score = (SELECT MAX(score) FROM student);
```
查询成绩高于全校平均成绩的学生记录

```sql
SELECT * FROM student WHERE score > (SELECT AVG(score) FROM student);
```

<blue> 也就是说 子查询出来的结果可以被被父查询使用 </blue>

```sql
 SELECT * FROM employee where age = (select Max( age ) from employee where department_id = 2);
```
子查询必须返回一个 **数字**

子查询在 select、insert、update、delete 里都可以用。

####  exists / not exists
相当于一个判断条件
##### exists 
返回存在的记录

```sql
SELECT name FROM department
    WHERE  EXISTS (
        SELECT * FROM employee WHERE department.id = employee.department_id
    );
```

##### not exists

```sql
SELECT name FROM department
    WHERE not EXISTS (
        SELECT * FROM employee WHERE department.id = employee.department_id
    );
```

### 流程控制语句

#### if
```sql
SELECT name,if(score >=60,"及格","不及格") as "是否及格" from student;
```
<img src="@backImg/if运算.png"/>


#### if null

```sql
SELECT 
  last_name,
  salary * (1 + IFNULL(commission_pct, 0)) * 12 "年工资" 
FROM
  employees ;
```

#### case when
case  +  (when 条件语句 then 结果) (when 条件语句 then 结果) else as "xxx"
```sql
SELECT 
  score, 
  CASE
    WHEN score >=90 
        THEN '优秀' 
    WHEN score >=60 
        THEN '良好' 
    ELSE '差' 
  END AS '档次' 
FROM student;
```

<img src="@backImg/case运算.png"/>

#### case exp
```sql
SELECT 
  last_name,
  department_id,
  CASE
    department_id 
    WHEN 10 
    THEN salary * 1.1 
    WHEN 20 
    THEN salary * 1.2 
    WHEN 30 
    THEN salary * 1.3 
    ELSE salary * 1.4 
  END "工资"
FROM
  employees ;
```

### 限制 limit
limit 第一个参数是起始索引(查询页码 - 1) * 每页记录数，第二个参数要返回的数量  
如果是第一页，可以省略
```sql
-- 0 可以省略
select * from student limit 0,5;
```
从第7条开始返回，返回 5条
```sql
select * from student limit 6,5;
```

### 排序order by

:::info
 `asc(ascend)` 升序, `desc(descend)` 降序, 如果不写默认升序排列    
 升序降序都是从下标0计数,升序是 [1,2,3,4],降序是 [4,3,2,1]
:::

order by 指定根据 score 升序排列，如果 score 相同再根据 age 降序排列  

```sql
select name,score,age from student order by score asc,age desc;
```

### 分组 groupby

`GROUP BY` 语句用于结合聚合函数，根据一个或多个列对结果集进行分组,类似于 `lodash` 的 `groupby`

<img src="@backImg/groupBy.png"/>

相当于先分组，然后计算分组之后每个组的值

:::info
 在分组的列上我们可以使用 COUNT, SUM, AVG,等函数
:::

```sql
SELECT class as '班级', AVG(score) AS '平均成绩' FROM student group by class;
```

#### 过滤 having
在 SQL 中增加 HAVING 子句原因是，WHERE 关键字无法与聚合函数一起使用。


```sql
select class, count(*) as count from student group by class  having count = 6;
```
执行顺序： where > 聚合函数 > having  
分组之后，查询的字段一般为 **聚合函数和分组字段**，查询其他字段无意义

:::tip where 和 having 的区别
1. 执行时机不同，`where` 是分组之前进行过滤，不满足 `where` 条件不参与分组，而 `having` 是分组之后对结果进行过滤
2. 判断条件不同，`where` 不能对聚合函数进行判断，而 `having` 可以
:::

查询年龄小于45的员工，并根据工作地址分组，获取员工数量大于等于3的工作地址
```sql
select workaddress,count(*) address_count from emp where age < 45 group by workaddress having address_count >=3
```
先 使用 where，然后计算 count，最后 使用 having


### 内置函数

#### 常用的聚合函数
- AVG() - 返回平均值
- COUNT() - 返回行数
- FIRST() - 返回第一个记录的值
- LAST() - 返回最后一个记录的值
- MAX() - 返回最大值
- MIN() - 返回最小值
- SUM() - 返回总和
- ROUND() - 对某个数值字段进行指定小数位数的四舍五入
- NOW() - 返回当前的系统日期和时间
- FORMAT() - 格式化某个字段的显示方式

<blue>聚合函数是对一列作为整体进行计算，null 不参与运算</blue>
<br/>
<br/>


#### AVG 平均

```sql
SELECT class as '班级', AVG(score) AS '平均成绩' FROM student group by class;
```

#### count
COUNT() 函数返回匹配指定条件的行数（NULL 不计入）。  

计算 age = 18 的总人数
```sql
select count(*) as "总人数" from student where age = 18
```

```sql
-- 查询班级中有多少学生
select class, count(*) as count from student group by class;
-- 也可以跟排序
select class, count(*) as count from student group by class order by count asc;
```
|class|count|
|---|---|
|一班|7|
|二班|6|
|三班|8|


计算 "access_log" 表中不同 site_id 的记录数
```sql
SELECT COUNT(DISTINCT site_id) AS nums FROM access_log;
```

#### avg/max/min/count/sum

```sql
select avg(score) as "平均成绩",max(score) as "最大成绩", min(score) as "最小成绩" ,count(*) as "总人数" , sum(score) as "总成绩" from student
```

#### 数值 
ROUND、CEIL、FLOOR、ABS、MOD(取余)
```sql
SELECT ROUND(1.234567, 2), CEIL(1.234567), FLOOR(1.234567), ABS(-1.234567), MOD(5, 2);
```
<img src="@backImg/数值运算.webp"/>

#### 日期函数
对日期、时间进行处理，比如 DATE、TIME、YEAR、MONTH、DAY、DATEDIFF(date1,date2)*时间间隔*、CURDATE(当前日期)、CURTIME(当前时间)、NOW

```sql
SELECT YEAR('2023-06-01 22:06:03') as "year", MONTH('2023-06-01 22:06:03') as "month",DAY('2023-06-01 22:06:03') as "day",DATE('2023-06-01 22:06:03') as "date", TIME('2023-06-01 22:06:03') as "time";
```
<img src="@backImg/日期运算.png"/>

##### 格式化日期
```sql
SELECT DATE_FORMAT('2022-01-01', '%Y年%m月%d日') as "date";
```
<img src="@backImg/格式化日期.webp"/>

```sql
-- 2017-08-10
SELECT STR_TO_DATE("August 10 2017", "%M %d %Y");
```

## 执行顺序

<img src="@other/sql执行顺序.png"/>

```sql
select e.name ename,e.age eage from emp e where e.age > 15 order by eage asc;
```
先执行 `from`, 后执行 `where`，然后执行 `select`，然后执行 `orderby`(所以可以使用 select 的别名)，最后执行 `limit`
## 插入

```sql
INSERT INTO student (name, gender, age, class, score)
    VALUES 
        ('张三', '男',18, '一班',90),
        ('李四', '女',19, '二班',85),
        ('王五', '男',20, '三班',70),
        ('赵六', '女',18, '一班',95);
```

## 多表

### 行子查询

```sql
select * from emp where (salary,managerid) = (12500,1)
```
一行多列
```sql
select * from emp where (salary,managerid) = (select salary,managerid from emp where name = "张无忌")
```


### 内连接

隐式内连接

```sql
select 字段 from 表1,表2 where 条件
```

```sql
select emp.name,dept.name from emp,dept where emp.id = dept.id
```

显式内连接

```sql
select 字段 from 表1 [inner] join 表2 on 条件;
```
```sql
select e.name,d.name from emp e inner join dept d on e.id = d.id;
```
内连接返回多表除 `null` 的部分

### 外连接
#### 左外连接

```sql
select 字段 from 表1 left join 表2 on 条件;
```
```sql
select e.name,d.name from emp e left outer join dept d on e.id = d.id;
```

### 自连接

```sql
select 字段列表 from 表A 别名A JOIN 表A 别名B on where xxx
```
这一张表可以看做两张表
<img src="@other/sql自连接1.png"/>
查询自己领导
<img src="@other/sql自连接2.png"/>

### 一对一

#### join On

<blue> JOIN 子句用于把来自两个或多个表的行 [结合起来]，基于这些表之间的共同字段。</blue>

 <blue>谁是左表，谁是基础表</blue>

<img src="@backImg/user.png"/>
<img src="@backImg/card.png"/>

```sql
-- 指定显示的列，并给 id_card 表的 id 起个 card_id 的别名。
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    JOIN id_card ON user.id = id_card.user_id;
```

这里用到了 JOIN ON，也就是连接 user 和 id_card 表，关联方式是 user.id = id_card.user_id，也就是 id_card 表中的外键关联 user 表的主键。

<img src="@backImg/user_card.png"/>

### left/right

默认是 INNER JOIN 是只返回两个表中能关联上的数据。 

LEFT JOIN 是额外返回左表中没有关联上的数据。  

RIGHT JOIN 是额外返回右表中没有关联上的数据。  

**在 FROM 后的是左表，JOIN 后的表是右表**

#### right
```sql
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    RIGHT JOIN id_card ON user.id = id_card.user_id;
```
<img src="@backImg/rightJoin.png"/>

#### left
```sql
SELECT user.id, name, id_card.id as card_id, card_name 
    FROM user
    LEFT JOIN id_card ON user.id = id_card.user_id;
```
<img src="@backImg/leftJoin.png"/>


- CASCADE： 主表主键更新，从表关联记录的外键跟着更新，主表记录删除，从表关联记录删除

- SET NULL：主表主键更新或者主表记录删除，从表关联记录的外键设置为 null

- RESTRICT：只有没有从表的关联记录时，才允许删除主表记录或者更新主表记录的主键 id

### 多表中间表

```sql
create table student_course (
    id int auto_increment primary key comment "主键",
    studentId int not null comment "学生id",
    courseId int not null comment "课程id",
    constraint fl_courseid foreign key(courseId) references course(id),
    constraint fl_studentId foreign key(studentId) references student(id)
)
```

## 并发

<img src="@other/事务并发问题.png"/>


### 脏读
一个事务还没 commit，另一个事务已经读取了，但是第一个事务还有可能要回滚
<img src="@other/事务并发问题-脏读.png"/>

### 不可重复读
一个事务读取，另一个事务更新并提交，此时第一个事务再次读取，但是已经发生了变化
<img src="@other/事务并发问题-不可重复读.png"/>

### 幻读
一个事务查询发现没有，另一个事务更新并提交，此时第一个事务插入数据，但是已经发现已经存在了，再次读取发现仍然没有（因为已经解决了不可重复读的问题）
<img src="@other/事务并发问题-幻读.png"/>

### 解决办法

对号表示依旧会出现的问题
<img src="@other/事务并发问题-解决办法.png"/>

查看

```sql
select @@transaction_isolation
```
修改

```sql
set [session | global] transaction isolation level [read uncommitted | read committed | repeatable read | serializable]
```

```sql
set session transaction isolation level read committed;
```

## update
如果省略了 `WHERE` 子句,所有的数据都会更新
```sql
UPDATE Websites SET alexa='5000', country='USA' WHERE name='菜鸟教程';
```

## delete

```sql
DELETE FROM Websites WHERE name='Facebook' AND country='USA';
```