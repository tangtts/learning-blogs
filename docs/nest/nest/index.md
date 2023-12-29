# nest



## 快捷键

1. 生成完整的 `CRUD` 文件
```bash
nest g resource user
# 不产出测试文件
nest g resource user --no-spec
```
2. 生成守卫
   使用 `--flat` 不会有 `login` 目录,否则会生成
   `login目录` 嵌套 `login.guard.ts`
```bash
nest g guard login --no-spec --flat
```
3. 生成 `Module`
```bash
nest g module redis
``` 
4. 生成 `Service`
```bash
nest g service redis --no-spec
```
5. 去掉测试文件
 > nest-cli.json
 ```json
 "generateOptions": { //[!code ++]
    "spec": false //[!code ++]
  }, //[!code ++]
 ``` 
## DTO / DAO / VO

DTO：Data Transfer Object，数据传输对象
> 客户端传输给服务端的数据对象,服务端传给客户端的数据对象

DAO：Data Access Object，数据访问对象
> 服务端对数据库的访问对象,也就是在 service 中对数据库(CRUD)时传的 参数

VO
> View Object，视图对象,展示在页面上的数据

PO
> Persistent Object，持久化对象,基本上相当于 `entity`


<img src="@backImg/nestCore.jpeg"/>

## IOC / DI

`IOC`(Inverse Of Control) 是控制反转,反转的是对象的创建和调用的

DI 是 `dependency Injection` 依赖注入,因为在容器中有很多对象，对象之间可以相互引用依赖，可以通过 `构造器` 注入，也可以通过 `set` 方式注入，即使用`@Inject`

**ioc 指代的是容器去实例化对象**    
**di 指代的是对象之间相互引用**  

我们把IOC想像成一个容器，程序初始化的时候会扫描 class 上声明的依赖关系，然后把这些 class 都给 new 一个实例放到容器里。  

创建对象的时候，还会把它们依赖的对象注入进去。这种依赖注入的方式叫做 Dependency Injection，简称 DI。本来是手动 new 依赖对象，然后组装起来，现在是声明依赖了啥，等待被注入。

从主动创建依赖到被动等待依赖注入，这就是 Inverse Of Control，反转控制。

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```
它有一个 AppService 声明了 @Injectable，代表这个 class **可注入**，那么 nest 就会把它的对象放到 IOC 容器里。


AppController 声明了 @Controller，代表这个 class **可以被注入**，nest 也会把它放到 IOC 容器里。  
注入：在需要用到的地方注入，即使用 `@Inject` 注入（类似于 java 中的 autowired）,也可以通过构造函数注入
> 注入与被注入  
> let a = new A();  
> let b = new B(a);  
> 此时 a 就是注入的对象，b 是被注入的对象  
> 对应的就是 `@Injectable` 和 `@Controller`
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

通过 @Module 声明模块，其中 controllers 是控制器，只能被注入。

providers 里可以被注入，也可以注入别的对象，比如这里的 AppService。


## 🚀module
> 每个模块都有一组紧密相关的**功能 , 相当于封装**

| providers | 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享 |
| --- | --- |
| controllers | 必须创建的一组控制器 |
| imports | 导入模块的列表，这些模块导出了此模块中所需提供者 |
| exports | 由本模块提供并应在其他模块中可用的提供者的子集。 |

### <blue>如果 B 模块中的 service 要使用 A 模块的 service</blue>
1. 需要 A 模块导出 service
2. 在 B 模块中 使用 imports 引入 A 的 module
3. 在 B 模块使用 inject 注入 A 模块 service 即可
备注: **不需要在使用的地方中 `providers` 引入本模块的 service,直接 使用即可**

**❤️如果 `B模块` 不想使用 `imoprt`,可以在 `A模块` 的 `@Module` 上添加 `@Global`,使 `A模块` 成为全局模块,可以直接使用 `exports` 中的 `service`（inject 属性注入，构造函数注入）, 不需要在 `providers` 中引入**

>redis.module.ts
```ts
// @Global()
@Module({
  providers: [ RedisService ],
  exports: [RedisService] // [!code hl]
})
export class RedisModule {}
```

需要使用 `imports` 引入 RedisModule,<blue>如果使用 `@Global` 这一步可以省略</blue>
> session.module.ts
```ts
@Module({
  imports:[RedisModule], // [!code focus]
  providers: [],
  exports: []
})
export class SessionModule {}
```
属性注入
> session.service.ts
```ts
@Injectable()
export class SessionService {
  @Inject(RedisService)
  private readonly redisService: RedisService;
}
```
也可以使用构造器注入

```ts
@Injectable()
export class SessionService {
  constructor(private readonly redisService: RedisService){}
  ;
}
```

### 如果B模块 `service` 之间使用

```ts
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,  // [!code hl]
    {
      provide: 'REDIS_CLIENT',  // [!code hl]
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService] // [!code hl]
})
export class RedisModule {}
```
> RedisService.ts

```ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService { 
  @Inject('REDIS_CLIENT')  // [!code hl]
  private redisClient: RedisClientType;

   async get(key: string) {
    return await this.redisClient.get(key);
  }
}
``` 

### module 的 provider 

#### useClass

```ts
@Module({
  providers:[AppService]
})
```
其实本质是这个
```ts
@Inject(AppService) // 这个 class 就是 token
private readonly appService: AppService;
// 本质
{
  provide: AppService,
  useClass: AppService
}
```
可以改为 字符串

```ts
{
  provide: 'app_service',
  useClass: AppService
}
```
那么需要这样注入，必须提供 `token`
```ts
@Inject('app_service') private readonly appService: AppService
```
#### useValue 

```ts
{
    provide: 'person',
    useValue: {
        name: 'aaa',
        age: 20
    }
}
```
使用
```ts
@Inject('person') private readonly person: {name: string, age: number}
```


#### 指定别名

```ts
{
  provide: 'person4',
  useExisting: 'person2'
}
```
那么注入就要使用 `person2` 这个字符串了



#### useFactory
使用 inject 注入 service,然后可以在 module 的 useFactory 中使用

> Nest 将从 inject 列表中以相同的顺序将实例作为参数传递给工厂函数。

```ts
{
  provide: 'person3',
  useFactory(person: { name: string }, appService: AppService) {
    return {
      name: person.name,
      desc: appService.getHello()
    }
  },
  inject: ['person', AppService]
}
```
在项目中使用
```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // [!code hl]
      useFactory(configService: ConfigService) { // [!code hl]
        return {
          type: "mysql",
          host: configService.get("mysql_server_host"), // [!code hl]
          database: configService.get("mysql_server_database"),
          // ....
        };
      },
    }),
  ],
})
```





## 装饰器
### 内置装饰器

#### 参数装饰器

| @Request() | req | req.query 获取参数 |
| :---: | :---: | :---: |
| @Response() | res |  |
| @Next() | next |  |
| @Session() | req.session |  |
| @Param(key?: string)   | req.params/req.params[key] | xxx/123 |
| @Body(key?: string) | req.body/req.body[key] | 直接获取 body 中的字段 |
| @Query(key?: string) | req.query/req.query[key] | xxx/#?id=123 直接获取参数 |
| @Headers(name?: string)    | req.headers/req.headers[name] | 可以获取 cookie |

##### Param 
```typescript
@Get(':id')
  findOne(@Param('id') id: string) {
    return `find one ${id} coffee`;
  }
```
##### query
```typescript
@Get('query')
  findQueryOne(@Query() query) {
    return `find one ${query.id} query coffees`;
  }
```
可以直接拿到 id 属性
```typescript
@Get('query')
  findQueryOne(@Query("id") id) {
    return `find one ${id} query coffees`;
  }
```

##### `Body`
body 是一个对象
```ts
@Post()
createOne(@Body() body) {
  return body;
}
```

直接拿到 body 中的 name 属性

```typescript
 // 如果这样写，可以直接拿到 body 中的name 属性
@Post()
  createOne(@Body('name') name) {
    return name;
  }
```
#### passthrough
你可能需要更精细地控制响应过程，例如手动设置响应头、状态码或发送特定格式的响应体等。  
这时，你可以使用`@Res({ passthrough: true}) res: Response` 来获取响应对象并自行操作。
```ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('example')
export class ExampleController {
  @Get()
  exampleRoute(@Res({ passthrough: true }) res: Response) {
    // 对响应对象进行操作
    res.set('Custom-Header', 'Hello');
    // 如果不传递 passthrough,请求就会挂起
    res.status(200).json({ message: 'Example response' }); 
  }
}
```
**如果不传递`passthrough: true`,响应就会挂起，Nest 这么设计是为了避免你自己返回的响应和 Nest 返回的响应的冲突**

##### [🔗状态码 HttpCode](https://docs.nestjs.cn/9/controllers?id=%e7%8a%b6%e6%80%81%e7%a0%81)
```typescript
@Post()
@HttpCode(204)  // [!code hl]
@HttpCode(HttpStatus.GONE) // [!code hl]
create() {
  return 'This action adds a new cat';
}
```

##### [🔗Headers](https://docs.nestjs.cn/9/controllers?id=headers)
```typescript
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

##### 错误提示

- BadRequestException 400
- UnauthorizedException 401
- NotFoundException 404
- ForbiddenException 403
 
1. `HttpException`
```typescript
findOne(id: string) {
    const coffee = this.coffees.find((coffee) => coffee.id == +id);
    if (!coffee) {
      //{
      //     "statusCode": 404,
      //     "message": "Coffee #10 not found"
      // }
      throw new HttpException(`Coffee #${id} not found`, HttpStatus.NOT_FOUND); // [!code hl]

       throw new NotFoundException(`Coffee #${id} not found`);// [!code hl]
    }
    return coffee;
  }
```

2. `NotFoundException`
```typescript
findOne(id: string) {
    const coffee = this.coffees.find((coffee) => coffee.id == +id);
    if (!coffee) {
      //{
      //     "statusCode": 404,
      //     "message": "Coffee #10 not found"
      // }
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }
```

### 自定义装饰器
#### [🔗路由参数装饰器](https://docs.nestjs.cn/8/customdecorators?id=%e8%87%aa%e5%ae%9a%e4%b9%89%e8%b7%af%e7%94%b1%e5%8f%82%e6%95%b0%e8%a3%85%e9%a5%b0%e5%99%a8)

定义,使用 `createParamDecorator`, `data` 里面的是使用装饰器传递的参数
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext)
  => {
    const request = ctx.switchToHttp().getRequest();
    console.log(data,"data")  // "page"
    return "jjjj";
});
```
使用自定义装饰器@User，对 page 参数进行判断,使用  
```typescript
@Get("Page")
  findAll(
    @User('page') @Query('page') page: number, //[!code hl]
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
  // 如果请求中没有提供limit参数或limit参数的值为undefined，则limit将被设置为默认值10
    return `Finding cats. Page: ${page}, Limit: ${limit}`;
  }

// Finding cats. Page: jjjj, Limit: 10
```
#### [🔗File](https://docs.nestjs.com/techniques/file-upload)
##### 安装
```bash
pnpm i multer
pnpm i @types/multer
```

使用 `FileInterceptor`直接保存到 `my-uploads` 下
```typescript
import { ensureDir } from "fs-extra";
import multer, { diskStorage } from "multer";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        // 添加保存目录
        destination:async function (req, file, cb) {
          // 确保有这个目录
          await  ensureDir("my-uploads");
          cb(null, path.join(process.cwd(), "my-uploads"));
        },
        // 添加文件名
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() +
            "-" +
            file.originalname;
          cb(null, file.fieldname + "-" + uniqueSuffix);
        },
      }),
    })
  )
  @Post("upload")
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ // 限制类型为 png
          fileType: "png",
        })
        // addMaxSizeValidator // 限制大小
        .build({
          fileIsRequired: true, // 文件必填
        })
    ) file: Express.Multer.File,
    @Body() body,
  ) {
    // file 保存 file 字段对应的文件
    // 其他属性放在了 body 上
  }
```
:::details 前端代码
```ts
async function formData4() {
    const data = new FormData();
    data.set('name','光');
    data.set('age', 20);
    data.set('aaa', fileInput.files[0]);
    data.set('bbb', fileInput.files[1]);
    data.set('ccc', fileInput.files[2]);
    data.set('ddd', fileInput.files[3]);

    const res = await axios.post('http://localhost:3000/ddd', data);
    console.log(res);
}
```
:::

可以在 `uploadFile` 上添加校验

```ts
@UploadedFile(
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1000 }),
      new FileTypeValidator({ fileType: 'image/jpeg' }),
    ],
  }),
)
file: Express.Multer.File,
```
也可以使用 `build` 进行联合

```ts
@UploadedFile(
  new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'jpeg',
    })
    .addMaxSizeValidator({
      maxSize: 1000
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
)
file: Express.Multer.File,
```
在 `main.ts` 中配置静态资源
```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
app.useStaticAssets(join(__dirname,"..","my-uploads"),{
 prefix:"/static"
})
```
可以访问
```bash
http://localhost:3000/static/aaa.png
```


### [🔗装饰器聚合](https://docs.nestjs.cn/8/customdecorators?id=%e8%a3%85%e9%a5%b0%e5%99%a8%e8%81%9a%e5%90%88)
> 多个装饰器的组合,使用 `applyDecorators` 函数包裹所需要的装饰器
```typescript
import { applyDecorators } from '@nestjs/common';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' })
  );
}
```
```typescript
@Get('users')
@Auth('admin') // [!code hl]
findAllUsers() {}
```



## 路由守卫(gurad)

Guard 是路由守卫的意思，可以用于在调用某个 Controller 之前判断权限，返回 true 或者 false 来决定是否放行

<img src="@backImg/guard.webp"/>

### 路由守卫获取自定义装饰器

`SetMetadata` 属于元编程
> custom-decorator.ts
定义自定义装饰器 `require-login`
```ts
import { SetMetadata } from "@nestjs/common";
export const RequireLogin = () => SetMetadata('require-login', true);
```

在 `controller` 中使用自定义装饰器

```ts
@Controller('a')
@RequireLogin() // [!code ++]
export class AController {
  constructor(private readonly aService: AService) {}
}
```
注册守卫, 因为要在守卫中使用 `自定义装饰器` 的属性
> app.module.ts
```ts
import { APP_GUARD } from "@nestjs/core";

providers: [
  AppService,
  {
    provide: APP_GUARD,
    useClass: LoginGuard,
  },
]
```

`this.reflector` 反射器

> LoginGuard.ts
```ts
import { Request } from "express"
declare module 'express' {
  interface Request {
    user: {
      username: string;
      roles: Role[]
    }
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
 
    const requireLogin = this.reflector.getAllAndOverride("require-login", [ // [!code hl]
      context.getClass(), // [!code hl]
      context.getHandler(), // [!code hl]
    ]); // [!code hl]

    if (!requireLogin) {
      return true;
    }

    const authorization = request.header('authorization') || '';  // [!code hl]

    const bearer = authorization.split(' '); // [!code hl]
    
    if(!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }

    const token = bearer[1];

    try {
      const info = this.jwtService.verify(token);  // [!code hl]
      request.user = info.user;  // [!code hl]
      return true;
    } catch(e) {
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
```

### 路由守卫使用 `service`

在 `user.module.ts` 导出 `UserService`

```ts
@Module({
  // ....
  exports:[UserService],
})
export class UserModule {}
```
然后使用 `Inject` 注入到 `Guard` 中
> PermissionGuard.ts
```ts
import { UserService } from "./user/user.service";

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) // [!code hl]
  private userService: UserService;

  // UserService 中的方法
  const roles = await this.userService.findRolesByIds( // [!code hl]
    request.user.roles.map(item => item.id) // [!code hl]
  ); // [!code hl]
}
```

### 局部使用

```ts
@UseGuards(LoginGuard)
aa(){
  this.testService.test();
}
```
### 全局使用

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new LoginGuard());
```
或者
```ts
import { APP_GUARD } from "@nestjs/core";

providers: [
  AppService,
  {
    provide: APP_GUARD,
    useClass: LoginGuard,
  },
]
```
**之前这种方式是手动 new 的 Guard 实例，不在 IoC 容器里,而用 provider 的方式声明的 Guard 是在 IoC 容器里的，可以注入别的 provider**

<img src="@backImg/guard2.webp"/>

## 中间件(Middleware)

中间件的使用和 `AOP` 分不开的，AOP 的好处是可以把一些通用逻辑分离到切面中，保持业务逻辑的纯粹性，这样切面逻辑可以复用，还可以动态的增删。  

同样的 中间件就是为了处理一些通用逻辑，比如日志，权限，错误处理等等。

> 中间件是在路由处理程序 **之前** 调用的函数。 **中间件函数可以访问请求和响应对象**，
> 以及应用程序请求响应周期中的 next() 中间件函数。 next() 中间件函数通常由名为 next 的变量表示

简单使用

```ts
app.use(function(req: Request, res: Response, next: NextFunction) {
  console.log('before', req.url);
  next();
  console.log('after');
})
```

:::tip
可以在 `函数` 中或在具有 `@Injectable()` 装饰器的类中实现自定义 Nest 中间件
:::

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// 函数式中间件
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
};

// 类式中间件
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request2...');
    next();
  }
}
```
定义成 类式中间件 的原因是可以被注入

```ts
import { AppService } from './app.service';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AaaMiddleware implements NestMiddleware {

  @Inject(AppService) // [!code ++]
  private readonly appService: AppService; // [!code ++]

  use(req: Request, res: Response, next: () => void) {
    console.log('-------' + this.appService.getHello()); // [!code ++]
    next();
    console.log('after');
  }
}
```

### 全局使用
```typescript
import { logger,LoggerMiddleware } from 'src/middleware/logger.middleware';
// 只接受函数
app.use(logger,new LoggerMiddleware().use)
```
### 单个使用
**中间件不能在 @Module() 装饰器中列出。**
我们必须使用模块类的 **configure()** 方法来设置它们。
包含中间件的模块必须实现 **NestModule** 接口。
```typescript
@Module({
  imports: [CatsModule],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 可以写入一个类
    consumer.apply(logger).forRoutes(UsersController) //[!code hl]
    // 写入一个urls
    consumer.apply(logger).forRoutes("users") //[!code hl]
    consumer.apply(logger,LoggerMiddleware).forRoutes("users") //[!code hl]
    
    consumer.apply(logger,LoggerMiddleware). 
    forRoutes({path:"users/*",method:RequestMethod.POST}) //[!code hl]

  }
}
```

### middleware 与 interceptor 的区别

middleware 和 interceptor 功能类似，但也有不同，interceptor 可以拿到目标 class、handler 等，也可以调用 rxjs 的 operator 来处理响应，更适合处理具体的业务逻辑。

middleware 更适合处理通用的逻辑。

## 错误处理(ExceptionFilter)
### [异常请求过滤器](https://docs.nestjs.cn/8/exceptionfilters?id=%e5%bc%82%e5%b8%b8%e8%bf%87%e6%bb%a4%e5%99%a8-1)
>   负责捕获作为 `HttpException` 类实例的异常，并为它们设置自定义响应逻辑。

使用装饰器 `@Catch` 装饰过滤器类，并**指定要捕获的异常类型**。  
`@Catch(HttpException)` 就是捕捉 `HttpException` 异常


```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';


@Catch(HttpException) // [!code hl]
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
```

### 自定义异常 
 UnLoginException
```ts
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class UnLoginException{ // [!code hl]
  message: string;

  constructor(message?){
    this.message = message;
  }
}

@Catch(UnLoginException)
export class UnloginFilter implements ExceptionFilter { // [!code hl]
  catch(exception: UnLoginException, host: ArgumentsHost) { // [!code hl]
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.UNAUTHORIZED).json({
      code: HttpStatus.UNAUTHORIZED,
      message: 'fail',
      data: exception.message || '用户未登录'
    }).end();
  }
}
```

可以这样使用
```ts
@UseFilters(UnloginFilter) // 捕获
throw new UnLoginException("没有登录") // 抛出
```
可以用自定义 Exception Filter 捕获内置的或者自定义的 Exception。

### [任意异常](https://docs.nestjs.cn/8/exceptionfilters?id=%e6%8d%95%e8%8e%b7%e5%bc%82%e5%b8%b8)
> 为了捕获每一个未处理的异常(不管异常类型如何)，将 @Catch() 装饰器的参数列表设为空

:::info
不仅可以捕获 `http`中 的错误，也可以捕获 ` throw new Error('12131')` 这种错误
:::
```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```
### 单个使用
```typescript
@UseFilters(HttpExceptionFilter) // [!code hl]
@UseFilters(new HttpExceptionFilter()) // [!code hl]
@Post('login')
async login(@Body() param: CreateUserDto): Promise<any> {
  return this.userService.login(param);
}
```
### 全局使用
```typescript
 app.useGlobalFilters(new HttpExceptionFilter());
```
或者使用 `APP_FILTER` 这种有一个好处是可以注入其他服务

```ts
@Module({
  provide: APP_FILTER,
  useClass: UnloginFilter
})
```

```ts
@Catch(HttpException)
export class UnloginFilter implements ExceptionFilter {
  @Inject(AppService)
  private service: AppService;
}
```


## [管道(pipe)](https://docs.nestjs.cn/8/pipes)
> 从一侧流入，经过处理，再从另一侧流出  
> 有两个作用，**一个是进行验证，一个是转化**  

### 内置管道

- ValidationPipe
> 首先它只接受一个值并立即返回相同的值，其行为类似于一个标识函数

```typescript

// 其中 whiteList 可以去除不存在于 FindOneParams 的字段
// transform 可以把 id 从 字符串转为 数字

/**
  class FindOneParams {
    @IsNumberString() // "1" 字符串数字
    id: number;
  }
*/

@UsePipes(new ValidationPipe({ whitelist: true }))
  @Post()
  // ValidationPipe 会对 请求体 进行 验证
  findOne(@Body() body: FindOneParams) {
    console.log(body); // true
    return "This action returns a user";
  }
```

- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
 
ParseArrayPipe 例子
> 相同字段自动转为数组形式
```typescript
findAll(@Query(
    'category', 
	   new ParseArrayPipe({ optional: true })) categories: string[]
  ) {
  // 参数重复出现如：/cats?category=small&category=medium&category=large
    console.log(categories); // 输出: ['small', 'medium', 'large']
    return 'Finding cats by categories';
}
```
对 body 进行 验证
```typescript
class P {
  @IsNumberString() // "1" 字符串数字
  id: number;
}

@Post("array")
  createBulk(
	@Body(  
      new ParseArrayPipe({ items: P })) createUserDtos: P[] // [!code hl]
	 ) {
    console.log(createUserDtos[1].id);
    return "This action adds new users";
}
```


- ParseEnumPipe  
> 127.0.0.1/cat/type/small 或者是 mdium large


```typescript

enum CatType {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}
// type X =`${CatType}` 也就是 "small" | "medium" | "large"
@Get('type/:type')
  findOne(@Param('type', new ParseEnumPipe(CatType)) type:`${CatType}`) {
    // 参数type的值将会被解析为CatType枚举类型
    console.log(type); // 可能的值: CatType.Small, CatType.Medium, CatType.Large

    return `Finding cat of type: ${type}`;
  }
```
#### 自定义内置错误码

```ts
@Query("id", new ParseIntPipe({
    // 可以自定义错误码 
    errorHttpStatusCode: 400,  // [!code --]
    exceptionFactory: (err)=>{
      // 自定义错误消息和错误码
      console.log(err) 
      throw new HttpException("XX"+err,HttpStatus.BAD_REQUEST) // [!code ++]
    }
  }))
```

### [自定义转化管道](https://docs.nestjs.cn/8/pipes?id=%e8%bd%ac%e6%8d%a2%e7%ae%a1%e9%81%93)
> 实现 `PipeTransform` 接口
```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```
### 局部使用

```ts
@Get('ccc')
ccc(@Query('num', ValidatePipe) num: number) {
    return num + 1;
}
```

### 全局使用
```typescript
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // 可以做类型转化
      transform: true,
      // forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
```


## 拦截器(Interceptor)

- 在函数执行之前/之后绑定**额外的逻辑**
- 转换从函数返回的结果
- **转换**从函数抛出的异常

<img src="@backImg/interceptor.webp"/>

### 实现

执行 `handle` 方法执行了下面的函数才会执行

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```
转化null 值
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(value => value === null ? '' : value ));
  }
}
```
### 使用
#### 全局使用
```typescript
app.useGlobalInterceptors(
  new TransformInterceptor(),
  new LoggingInterceptor()
);
```
#### 单个使用
```typescript
@Controller('coffee')
@UseInterceptors(new LoggingInterceptor())
export class CoffeeController {
  constructor(private readonly coffeesService: CoffeeService) {}
}
```

## aop 顺序

<img src="@backImg/aop顺序.webp"/>

:::tip 🏮
Middleware 是 Express 的概念，在最外层，到了某个路由之后，会先调用 Guard，Guard 用于判断路由有没有权限访问，然后会调用 Interceptor，对 Contoller 前后扩展一些逻辑，在到达目标 Controller 之前，还会调用 Pipe 来对参数做检验和转换。所有的 HttpException 的异常都会被 ExceptionFilter 处理，返回不同的响应。
:::

## ArgumentHost 和 ExecutionContext 类

<img src="@backImg/argumentHost.webp"/>

ExecutionContext 是 ArgumentHost 的子类，扩展了 getClass、getHandler 方法。  


中间件用的是 `ArgumentHost`类

```typescript
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';


@Catch(AaaException)
export class AaaFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    
    if(host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      response
        .status(500)
        .json({
          aaa: exception.aaa,
          bbb: exception.bbb
        });
    } else if(host.getType() === 'ws') {

    } else if(host.getType() === 'rpc') {

    }
  }
}

```

`ExecutionContext` 比 `ArgumentHost`多两个方法
`getClass` 和 `getHandler`  

因为 Guard、Interceptor 的逻辑可能要根据目标 class、handler 有没有某些装饰而决定怎么处理。

使用 getHandler 可以找到对应的函数角色，并使用 reflector 获取元信息
```typescript
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from './role';

@Injectable()
export class AaaGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext, // [!code hl]
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler()); // [!code hl]

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user && user.roles?.includes(role));
  }
}
```

## 循环依赖
> DddService
```ts
import { Injectable } from '@nestjs/common';
import { CccService } from './ccc.service';

@Injectable()
export class DddService {
  constructor(private cccService: CccService) {}

  ddd() {
      return this.cccService.ccc()  + 'ddd';
  }
}
```
> CccService 

```ts
import { Injectable } from '@nestjs/common';
import { DddService } from './ddd.service';

@Injectable()
export class CccService {
  constructor(private dddService: DddService) {}

  ccc() {
      return 'ccc';
  }

  eee() {
      return this.dddService.ddd() + 'eee';
  }
}
```
> appService

```ts
import { Injectable } from '@nestjs/common';
import { CccService } from './ccc.service';
import { DddService } from './ddd.service';

@Injectable()
export class AppService {
  constructor(private cccService: CccService, private dddService: DddService){}

  getHello(): string {
    return this.dddService.ddd() + this.cccService.eee();
  }
}
```
<img src="@backImg/循环依赖.webp"/>

**通过 `forwardRef` 解决**
<img src="@backImg/循环依赖1.webp"/>
分别使用 forwardRef
<img src="@backImg/循环依赖2.webp"/>