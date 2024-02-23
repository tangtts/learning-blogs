# typeorm
## 安装
```bash
pnpm install --save @nestjs/typeorm typeorm mysql2
```
## 使用
> user.module.ts
```ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ]
})
```

> user.service.ts
```ts
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AppService {
  @InjectRepository(User) // [!code hl]
  private readonly userRepository: Repository<User>; //[!code hl]
}
```

## 更新
可以使用 `update` 和 `insert` 方法，分别是修改和插入的，但是它们不会先 `select` 查询一次。 

而 `save` 方法会先查询一次数据库来确定是插入还是修改。


:::tip
`update` 默认不会返回更新后的值，但是 `save` 会
:::

<img src="@backImg/saveOrUpdate.png"/>

## 删除

1. `delete` 和 `remove` 的区别是，`delete` 直接传 `id`、而 `remove` 则是传入 `entity` 对象。

2. remove 可以触发钩子方法

```js
@AfterRemove()
aftermove(){
  // xxxx
}
```

同样的，`insert` 可以触发钩子方法，但是  save 不会


<img src="@backImg/removeOrDelete.png"/>

## 查询

### where 查询

#### 查询单个条件
使用对象形式
```ts
let r = await this.userRepository.find({
  where:{
    username:"张三"
  }
});
```

#### 查询多个条件

使用 `数组对象` 可以同时查询多个满足条件的记录

```ts
let r = await this.userRepository.find({
  where:[
    {
      username:"张三"
    },{
      username:"李四"
    }
  ]
});
```
#### 查询关联表的属性

```js
let r = await this.userRepository.find({
  relations:{
    profile:true,
    roles:true
  },
  where:[
    {
      username:"张三"
    },
    // 关联表
    profile:{  // [!code hl]
      gender:1 // [!code hl]
    },        // [!code hl]
    roles:{ // [!code hl]
      id:0 // [!code hl]
    } // [!code hl]
  ]
});
```
查找关联表 `profile`,`role` 中的字段

#### 返回部分属性

**返回部分属性，包括关联表**

```js:line-numbers{2-8,18-23}
let r = await this.userRepository.find({
  select:{
    id:true,
    username:true,
    profile:{
      gender:true
    }
  },
  relations:{
    profile:true,
    roles:true
  },
  where:[
    {
      username:"张三"
    },
    // 关联表
    profile:{  
      gender:1 
    },        
    roles:{ 
      id:0 
    } 
  ]
});
```

#### 查询范围

##### LessThan / LessThanOrEqual / MoreThan / MoreThanOrEqual / Equal / Between

小于 / 小于等于 / 大于 / 大于等于 / 等于 / 范围

```ts
let r2 = await this.userRepository.find({
  where: {
    id:LessThan(2)
  }
});
```

##### Not
> 查询非 zs 的用户
```ts
let r = await this.userRepository.find({
  where: {
    username:Not('zs')
  }
});
```

##### In

匹配 一个值是否在给定的数组中

```ts
let r2 = await this.userRepository.find({
  where: {
    username:In(['zs',"李四"])
  }
});
```

#### 模糊查询

##### Like / ILike

:::tip
与普通模式下的区别在于 可以 **只需要输入部分字符**
:::

1. LIKE 操作符用于执行基于模式的字符串匹配。它区分大小写  
2. ILIKE 操作符： ILIKE 操作符也用于执行模式匹配，但它是不区分大小写的。与 LIKE 不同，ILIKE 会忽略字符的大小写
> I 是 ignore
  
<blue>操作符使用通配符 % 和 _ 进行模式匹配，其中 % 表示任意长度的字符串（包括空字符串），_ 表示单个字符。</blue>

```ts
let r1 = await this.userRepository.find({
  where: {
    username:Like('%zs%')  // -- 匹配包含 "zs" 的字符串
    username:Like('zs')  // -- 匹配 "zs"
  }
});


let r1 = await this.userRepository.find({
  where: {
    username:Like('z_') // 匹配 z 后面加一个单字符
  }
});
```

忽略大小写

```ts
let r2 = await this.userRepository.find({
      where: {
        username:ILike('%Zs%')
      }
});
```

#### 非 where 的 完整查询

```ts
let r = await this.userRepository.find({
  order:{
    username:"ASC"
  },
  // 选择需要返回的字段
  select: ["username"],
  // 关联 roles,而不是 roles 表名
 // 可以使用对象形式
  relations:{  //[!code warning]
    roles:true //[!code warning]
  }, //[!code warning]
  // 可以使用 数组表达，只是没有类型提示
  relations:["roles"], //[!code warning]
  skip: 0,
  take: 10
});
```

```ts
@Entity()
export class User {
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role_relation'
  })
  roles: Role[] //[!code hl]
} 
```

### 组合使用

```ts
let r1 = await this.userRepository.find({
  where: {
    username:Not(Like('zs')), //[!code hl]
    id:Not(MoreThan(10)), //[!code hl]
    username:Not(Equal("About #2")) //[!code hl]
  }
});
```

### findOneOrFail  / findOneByOrFail
`findOneOrFail` 或者 `findOneByOrFail`，如果没找到，会抛一个 `EntityNotFoundError` 的异常：

```ts
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

AppDataSource.initialize().then(async () => {
    try {
        const user = await AppDataSource.manager.findOneOrFail(User, {
            where: {
                id: 666
            }
        });
        console.log(user);
    }catch(e) {
        console.log(e);
        console.log('没找到该用户');
    }
}).catch(error => console.log(error))
```
<img src="@backImg/findOneByOrFail.webp"/>

## 实体

### Column
#### 唯一
```ts
@Column({
 unique:true,
 comment:"名称"
})
name: string;
```
#### enum
```ts
export enum UserRole {
	ADMIN = "admin",
	EDITOR = "editor",
	GHOST = "ghost"
}

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum", //[!code hl]
    enum: UserRole, //[!code hl]
    default: UserRole.GHOST //[!code hl]
  })
  role: UserRole
}
```
#### simple-array
```ts
@Entity()
export class User {
 @PrimaryGeneratedColumn()
 id: number;

 @Column("simple-array") //[!code hl]
 names: string[]; //[!code hl]
}
```
```ts
const user = new User();
user.names = ["Alexander", "Alex", "Sasha", "Shurik"];
```

#### simple-json
```ts
@Entity()
export class User {
 @PrimaryGeneratedColumn()
 id: number;

 @Column("simple-json") //[!code hl]
 profile: { name: string; nickname: string }; //[!code hl]
}
```
```ts
const user = new User();
user.profile = { name: "John", nickname: "Malkovich" };
```

#### Date
设置默认 `Date` 使用 `NOW`
```ts
class IncomeOrCost {
  @Column({
    nullable: false, 
    default: () => 'NOW()',
    comment: "支付时间",
  })
  payTime: Date;
}
```
#### 重命名
使用 `name` 重新命名 `column`
```ts
  @Column({type:'int', name: 'is_finish'}) 
  isFinish: boolean;
```

#### Exclude 排除
`@Exclude` 是属于 `class-transformer`
```ts
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  
@ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
@Exclude({ toPlainOnly: true }) // [!code ++]
user: User;
}
```
把 `user` 给去除掉,特别是一些 敏感信息，可以不返回给客户端  

### JoinColumn

#### 一对一
<blue>你设置@JoinColumn的哪一方，哪一方的表将包含一个 "relation id" 和目标实体表的外键。</blue>

> profile.entity.ts
```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photo: string;
}
```
> user.entity.ts
```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class User {

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
}
```
<img src="@backImg/OneToOne.png"/>

----

如果想关联自己指定属性,需要在 `JoinColumn` 添加 `name` 属性

```ts
@Entity()
export class User {

  @OneToOne(() => Profile)
  // @JoinColumn({name:Profile.name})
  @JoinColumn({name:"pid"})
  profile: Profile;
}
```

如果没有外键的表查询到另一方,需要在这一方的添加 `OneToOne`并且加上参数,告诉 `typeorm`，外键是另一个 `Entity` 的哪个属性

```ts
@Entity()
export class Profile {
  @OneToOne(() => User,(u)=>u.profile)
  profile: Profile;
}
```

#### cascade 级联关系

:::tip
这个 `cascade` 不是数据库的那个级联，而是告诉 `typeorm` 当你增删改一个 `Entity` 的时候，是否级联增删改它关联的 `Entity`
:::

<img src="@backImg/cascade.webp"/>




#### 一对多 `oneToMany` / `ManyToOne`
<br/>
<blue>一对多的关系只可能是在多的那一方保存外键</blue>  
<br/> 

第一个参数是目标实体类，第二个参数是关系名称，第三个参数是关系类型( `eager` )

```ts
@Entity()
class User {
@OneToMany(() => Task, (task) => task.user, { eager: false })
  tasks: Task[];
}
```
只有当访问 `tasks` 时才会查询 `Task` 实体,如果 `{ eager: true }` 会自动执行查询  

让我们以User 和 Post 实体为例。 User 可以拥有多张 Post，但每张 Post 仅由一位 user 拥有。

> user.entity.ts
```ts
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];
}
```
> post.entity.ts
```ts
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.posts)
  user: User;
}
```

<img src="@backImg/ManyToOne.png"/>

:::info

**你会发现 user 中 没有关于 post 的信息**  


对于一对多关系中的一方（例如 User 实体），
通常不需要在数据库中显式地存储关联实体（例如 Post）的外键（即 post_id）。
这是因为在一对多关系中，多方实体（Post）通常会包含一个表示关联到一方实体（User）的外键。
在本例中，Post 实体有一个指向 User 的外键 **user_id**

通过将外键放在多方实体中，可以更轻松地访问和管理一对多关系。
通过查询多方实体（Post），我们可以轻松获取与之关联的一方实体（User），而无需在一方实体（User）中存储关联的多方实体（Post）的外键。

因此，在示例中，User 实体没有包含 post_id 列，而是通过 Post 实体的 user_id 外键来建立和访问一对多关系。
:::

```ts
createUserWithPosts(name: string, postTitles: string[]): Promise<User> {
  const user = new User();
  user.name = name;

  const posts = postTitles.map(title => {
    const post = new Post();
    post.title = title;
    post.user = user;
    return post;
  });
  user.posts = posts;
  return this.userRepository.save(user);
}
```
```ts
async findPostsByUserId(userId: number): Promise<Post[]> {
  const user = await this.userRepository.findOne(userId, { relations: ['posts'] });
  return user.posts;
}
```

### 如何使用关系id而不加入关系
> profile.entity.ts
```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photo: string;
}
```
> user.entity.ts
```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => Profile)
  @JoinColumn()
  profile: Profile;
}
```
当加载没有profile加入的用户时，你将无法在用户对象中获得有关个人资料的任何信息， 甚至个人资料 ID：

```ts
User {
  id: 1,
  name: "Umed"
}
```

但有时您想知道此用户的"profile id"是什么，而不加载此用户的全部个人资料。 要做到这一点，你只需要使用@Column向实体添加另一个属性完全命名为自己关系创建的列。 例如：

> user.entity.ts
```ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })  //[!code ++]
  profileId: number; //[!code ++]

  @OneToOne(type => Profile)
  @JoinColumn()
  profile: Profile;
}
```

```ts
User {
  id: 1,
  name: "Umed",
  profileId: 1
}
```


### JoinTable

**<blue>通过 `JoinTable` 会多生成一个关联表,不会多生成一列</blue>**

> Album.entitity.ts
```ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(type => Photo, photo => photo.albums)
  @JoinTable()
  photos: Photo[];
}
```
> Photo.entity.ts
```ts
export class Photo {
  /// ... other columns

  @ManyToMany(type => Album, album => album.photos)
  albums: Album[];
}
```
运行后，ORM 将创建album_photos_photo_albums_联结表。    

```
+-------------+--------------+----------------------------+
|                album_photos_photo_albums                |
+-------------+--------------+----------------------------+
| album_id    | int(11)      | PRIMARY KEY FOREIGN KEY    |
| photo_id    | int(11)      | PRIMARY KEY FOREIGN KEY    |
+-------------+--------------+----------------------------+
```
也可以更改
```ts
  @ManyToMany(type => Photo, photo => photo.albums)
  @JoinTable({name:"album_photos"})
  photos: Photo[];
```

## [🔗querybuilder](https://typeorm.bootcss.com/select-query-builder)

### 使用 repository 创建 QueryBuilder
```js
import { getRepository } from "typeorm";

const user = await getRepository(User)
  .createQueryBuilder("user")
  .where("user.id = :id", { id: 1 })
  .getOne();
```

### 获取值

```js
const timber = await getRepository(User)
  .createQueryBuilder("user")
  .where("user.id = :id OR user.name = :name", { id: 1, name: "Timber" })
  .getOne();
```
要从数据库中获取所有用户，请使用getMany

使用查询构建器查询可以获得两种类型的结果：entities 或 raw results。  
大多数情况下，你只需要从数据库中选择真实实体，例如 users。 为此，你可以使用getOne和getMany。 


 **但有时你需要选择一些特定的数据，比方说所有sum of all user photos。 此数据不是实体，它称为原始数据。 要获取原始数据，请使用getRawOne和getRawMany。**

```js
const { sum } = await getRepository(User)
  .createQueryBuilder("user")
  .select("SUM(user.photosCount)", "sum")
  .where("user.id = :id", { id: 1 })
  .getRawOne();
  // 结果会像这样: [{ id: 1, sum: 25 }, { id: 2, sum: 13 }, ...]
```

### 使用参数来转义数据

因为有可能被 SQL 注入。 安全的方法是使用这种特殊的语法：where（"user.name =name"，{name:"Timber"}），其中name是参数名，值在对象中指定： {name:"Timber"}。

```js
.where("user.name = :name", { name: "Timber" })
```
还可以提供一组值，并使用特殊的扩展语法将它们转换为SQL语句中的值列表：

```js
// WHERE user.name IN ('Timber', 'Cristal', 'Lina')
.where("user.name IN (:...names)", { names: [ "Timber", "Cristal", "Lina" ] })
```
### 添加WHERE表达式

```js
createQueryBuilder("user")
  .where("user.firstName = :firstName", { firstName: "Timber" })
  .andWhere("user.lastName = :lastName", { lastName: "Saw" });
```
将会生成以下 SQL 语句：
```sql
SELECT ... FROM users user WHERE user.firstName = 'Timber' AND user.lastName = 'Saw'
```

你可以使用Brackets将复杂的WHERE表达式添加到现有的WHERE中：

```js
createQueryBuilder("user")
    .where("user.registered = :registered", { registered: true })
    .andWhere(new Brackets(qb => {
        qb.where("user.firstName = :firstName", { firstName: "Timber" })
          .orWhere("user.lastName = :lastName", { lastName: "Saw" })
```
将会生成以下 SQL 语句：

```sql
SELECT ... FROM users user WHERE user.registered = true AND (user.firstName = 'Timber' OR user.lastName = 'Saw')
```
### orderBy

```js
createQueryBuilder("user")
  .orderBy("user.name")
  .addOrderBy("user.id");
```
还可以使用排序字段作为一个 map：

```js
createQueryBuilder("user").orderBy({
  "user.name": "ASC",
  "user.id": "DESC"
});
```

### 获取生成的sql查询语句

```js
const users = await createQueryBuilder("user")
  .where("user.firstName = :firstName", { firstName: "Timber" })
  .orWhere("user.lastName = :lastName", { lastName: "Saw" })
  .printSql()
  .getMany();
```
此查询将返回 users 并将使用的 sql 语句打印到控制台。

### 使用分页

```js
const users = await getRepository(User)
  .createQueryBuilder("user")
  .leftJoinAndSelect("user.photos", "photo")
  .skip(5)
  .take(10)
  .getMany();
```

### 查询部分字段

```js
const users = await getRepository(User)
  .createQueryBuilder("user")
  .select(["user.id", "user.name"])
  .getMany();
```
这只会选择User的id和name。

### 例子
<img src="@backImg/queryBuilder1.png"/>
<br/>

多个条件可以这样简化
<img src="@backImg/queryBuilder2.png"/>

## leftjoin / innerjoin

<img src="@backImg/leftOrInnerJoin.png"/>
