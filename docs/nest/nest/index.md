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
通常情况下，Nest.js会自动处理控制器方法返回的数据并将其转换为响应对象。然而，有时你可能需要更精细地控制响应过程，例如手动设置响应头、状态码或发送特定格式的响应体等。这时，你可以使用@Res({ passthrough: true}) res: Response来获取响应对象并自行操作。
```ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('example')
export class ExampleController {
  @Get()
  exampleRoute(@Res({ passthrough: true }) res: Response) {
    // 对响应对象进行操作
    res.set('Custom-Header', 'Hello');
    res.status(200).json({ message: 'Example response' }); // 如果不传递 passthrough,请求就会挂起
  }
}
```

##### [状态码 HttpCode](https://docs.nestjs.cn/9/controllers?id=%e7%8a%b6%e6%80%81%e7%a0%81)
```typescript
@Post()
@HttpCode(204)  // [!code hl]
@HttpCode(HttpStatus.GONE) // [!code hl]
create() {
  return 'This action adds a new cat';
}
```

##### [Headers](https://docs.nestjs.cn/9/controllers?id=headers)
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
#### [路由参数装饰器](https://docs.nestjs.cn/8/customdecorators?id=%e8%87%aa%e5%ae%9a%e4%b9%89%e8%b7%af%e7%94%b1%e5%8f%82%e6%95%b0%e8%a3%85%e9%a5%b0%e5%99%a8)

定义
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  console.log(data,"data")
  return "jjjj";
});
```
使用自定义装饰器，对 page、参数进行判断
```typescript
@Get("Page")
  findAll(
    @User('page')  @Query('page') page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    // 如果请求中没有提供page参数或page参数的值为undefined，则page将被设置为默认值1
    // 如果请求中没有提供limit参数或limit参数的值为undefined，则limit将被设置为默认值10
    return `Finding cats. Page: ${page}, Limit: ${limit}`;
  }

// Finding cats. Page: jjjj, Limit: 10
```
#### File
##### 安装
```bash
pnpm i multer
pnpm i @types/multer
```

```typescript
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors ,ParseFilePipeBuilder } from "@nestjs/common";

@Post("upload")
@ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Upload file",
    type: UpdateUploadDto,
  })
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ // 限制类型为 png
          fileType: "png",
        })
        // addMaxSizeValidator // 限制大小
        .build({
          fileIsRequired: true, // 文件必填
        })
    )
    file: Express.Multer.File,
  ) {
    console.log(file); // 文件
    return file.size
  }
```
> UpdateUploadDto.ts
```ts
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUploadDto  {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file:Express.Multer.File;
}
```

使用 `FileInterceptor`直接保存到my-uploads 下
```typescript
import { ensureDir } from "fs-extra";
import multer, { diskStorage } from "multer";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

  @ApiOperation({
    summary: "上传头像",
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination:async function (req, file, cb) {
          // 确保有这个目录
          await  ensureDir("my-uploads");
          cb(null, path.join(process.cwd(), "my-uploads"));
        },
        filename: function (req, file, cb) {
          file.originalname = Buffer.from(file.originalname, "latin1").toString(
            "utf8"
          );
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
    @Req() req: UploadDTO,
    @Body() uploadDTO: UploadDTO,
    @UploadedFile() file
  ) {
    // console.log(req.file,"fa",uploadDTO.name)
  }
```



### [装饰器聚合](https://docs.nestjs.cn/8/customdecorators?id=%e8%a3%85%e9%a5%b0%e5%99%a8%e8%81%9a%e5%90%88)
> 多个装饰器的组合
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

## 过滤器/拦截器

### 路由守卫获取自定义装饰器

> custom-decorator.ts
定义自定义装饰器 `require-login`
```ts
import { SetMetadata } from "@nestjs/common";
export const  RequireLogin = () => SetMetadata('require-login', true);
```

在 `controller` 中使用自定义装饰器

```ts
@Controller('a')
@RequireLogin() // [!code ++]
export class AController {
  constructor(private readonly aService: AService) {}
}
```
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
> LoginGuard.ts
```ts
import {Request} from "express"
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
> PermissionGuard.ts
```ts
import { UserService } from "./user/user.service";

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  // UserService 中的方法
  const roles = await this.userService.findRolesByIds( // [!code hl]
    request.user.roles.map(item => item.id) // [!code hl]
  ); // [!code hl]
}
```

## 🚀module
> 每个模块都有一组紧密相关的**功能 , 相当于封装**

| providers | 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享 |
| --- | --- |
| controllers | 必须创建的一组控制器 |
| imports | 导入模块的列表，这些模块导出了此模块中所需提供者 |
| exports | 由本模块提供并应在其他模块中可用的提供者的子集。 |

🚀 <blue>如果别的 service 要使用本模块的 service</blue>
1. 需要本模块导出 service
2. 在需要的模块中 使用 imports 引入本模块的 module
3. 在需要的地方使用 inject 注入 本模块 service 即可

如果别的模块不想使用 `imoprt`,可以在本模块的 `module` 上添加 `@Global`,使本模块成为全局模块

>redis.module.ts
```ts
// @Global()
@Module({
  providers: [ RedisService ],
  exports: [RedisService] // [!code hl]
})
export class RedisModule {}
```

需要使用 `imports` 引入 RedisModule,<blue>如果使用 Global 这一步可以省略</blue>
> session.module.ts
```ts
@Module({
  imports:[RedisModule], // [!code focus]
  providers: [],
  exports: []
})
export class SessionModule {}
```

> session.service.ts
```ts
@Injectable()
export class SessionService {
  @Inject(RedisService)
  private redisService: RedisService;
}
```

## 中间件
> 中间件是在路由处理程序 **之前** 调用的函数。 **中间件函数可以访问请求和响应对象**，
> 以及应用程序请求响应周期中的 next() 中间件函数。 next() 中间件函数通常由名为 next 的变量表示


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

 ## 错误处理
### [异常请求过滤器](https://docs.nestjs.cn/8/exceptionfilters?id=%e5%bc%82%e5%b8%b8%e8%bf%87%e6%bb%a4%e5%99%a8-1)
>   负责捕获作为 `HttpException` 类实例的异常，并为它们设置自定义响应逻辑。

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
### 单个控制
```typescript
@UseFilters(HttpExceptionFilter)
@UseFilters(new HttpExceptionFilter())
@Post('login')
async login(@Body() param: CreateUserDto): Promise<any> {
  return this.userService.login(param);
}
```
### 全局控制
```typescript
 app.useGlobalFilters(new HttpExceptionFilter());
```


## [管道](https://docs.nestjs.cn/8/pipes)
> 从一侧流入，经过处理，再从另一侧流出  
> 有两个作用，**一个是进行验证，一个是转化**  

### 内置管道

- ValidationPipe
> 首先它只接受一个值并立即返回相同的值，其行为类似于一个标识函数

```typescript

// - 其中 whiteList 可以去除不存在于 FindOneParams 的字段
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
  // @Body(new ParseArrayPipe({ items: CreateUserDto }))
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
class FindOneParams {
  @IsNumberString() // "1" 字符串数字
  id: number;
}

@Post("array")
  createBulk(
	@Body(  
   new ParseArrayPipe({ items: FindOneParams }))
   createUserDtos: FindOneParams[]
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

全局使用
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

## 拦截器

- 在函数执行之前/之后绑定**额外的逻辑**
- 转换从函数返回的结果
- **转换**从函数抛出的异常
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
  new LoggingInterceptor());
```
#### 单个使用
```typescript
@Controller('coffee')
@UseInterceptors(new LoggingInterceptor())
export class CoffeeController {
  constructor(private readonly coffeesService: CoffeeService) {}
}
```

## ArgumentHost 和 ExecutionContext 类
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
