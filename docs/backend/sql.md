# sql

sql 是不区分大小写的


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
- DEFAULT - 规定没有给列赋值时的默认值。

#### 添加约束

```sql
CREATE TABLE Persons
(
    P_Id int NOT NULL,
    LastName varchar(255) NOT NULL,
    PRIMARY KEY (P_Id)  // [!code hl]
)
```
当表已被创建时，如需在 "P_Id" 列创建 PRIMARY KEY 约束
```sql
ALTER TABLE Persons ADD PRIMARY KEY (P_Id)
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
撤销 DEFAULT 约束
```sql 
ALTER TABLE Persons ALTER City DROP DEFAULT
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

#### 删除约束（alter / deop）
```sql
ALTER TABLE Persons DROP PRIMARY KEY
```

#### 外键约束（FOREIGN KEY / REFERENCES）
添加外键约束
```sql
CREATE TABLE Orders
(
O_Id int NOT NULL,
P_Id int,
PRIMARY KEY (O_Id),
FOREIGN KEY (P_Id) REFERENCES Persons(P_Id)
)
```
当 "Orders" 表已被创建时，如需在 "P_Id" 列创建 FOREIGN KEY 约束
```sql
ALTER TABLE Orders ADD FOREIGN KEY (P_Id) REFERENCES Persons(P_Id)
```
撤销 FOREIGN KEY 约束
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


### 删除

```sql
drop table if exists student;
-- 也可以简化
drop table student
```

## 查询 where

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

#### is null

```sql
Select * from emp where comm is null;
```


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

### 集合

### 限制
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
对日期、时间进行处理，比如 DATE、TIME、YEAR、MONTH、DAY

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

#### 条件语句
##### if
```sql
SELECT name,if(score >=60,"及格","不及格") as "是否及格" from student;
```
<img src="@backImg/if运算.png"/>

##### case
case  +  (when 条件语句 then 结果) (when 条件语句 then 结果) else as "xxx"
```sql
SELECT name, score, CASE WHEN score >=90 THEN '优秀' WHEN score >=60 THEN '良好' ELSE '差' END AS '档次' FROM student;
```
<img src="@backImg/case运算.png"/>


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


## update
如果省略了 `WHERE` 子句,所有的数据都会更新
```sql
UPDATE Websites SET alexa='5000', country='USA' WHERE name='菜鸟教程';
```

## delete

```sql
DELETE FROM Websites WHERE name='Facebook' AND country='USA';
```