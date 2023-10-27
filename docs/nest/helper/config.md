# config 配置文件

## 安装
```bash
pnpm install --save @nestjs/config
```
## 使用

### 1.使用 .env 文件

```ts
aaa=1
bbb=2
```
在 `AppModule` 中引入

```ts
@module({
  imports: [ConfigModule.forRoot({
     envFilePath: ".env"
  })],
})
```

在 `AppController` 里注入 `ConfigService` 来读取配置

```ts
export class AppController {
  @Inject(ConfigService)
  private configService: ConfigService;
}
```

### 2.函数

> config.ts
```ts
export default async () => {
  const dbPort = await 3306;
  return {
      port: parseInt(process.env.PORT, 10) || 3000,
      db: {
        host: 'localhost',
        port: dbPort
      }
  }
}
```
在 `AppModule` 中引入 `config.ts`
```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      load:[config],
    })
  ]
})
```
### 3.ormconfig.json
默认会自动寻找 `ormconfig.json` 文件
> ormconfig.json
```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "test",
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": true
}
```

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot()],
})
export class AppModule {}
```

## 设置默认值

```ts
@Controller("app")
export class AppController{
 @Inject(ConfigService) //[!code hl]
 private configService: ConfigService; //[!code hl]

 @Get("cat")
  cat(@Res({ passthrough: true }) res: Response): string {

  // 设置默认值 为 1
  const dbHost = this.configService.get<string>('aaa',1); //[!code hl]

    // 如果是对象嵌套
  console.log(this.configService.get("a.b.c")) //[!code hl]

  return this.appService.cat()
  }
}
```

## 多个配置文件
```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
    })
  ]
})
```

## 共享

如果别的模块也需要用到 config, 需要添加 `isGlobal:true`

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load:[config],
      envFilePath:".env",
    }),
  ]
})
```
## main.ts 中使用
```ts
import { ConfigService } from "@nestjs/config";
const configService =  app.get(ConfigService)
await app.listen(configService.get('nest_server_port'));
```
##  在 module 中使用
```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // [!code hl]
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // [!code hl]
      useFactory(configService: ConfigService) { // [!code hl]
        return {
          type: "mysql",
          host: configService.get("mysql_server_host"),
          port: configService.get("mysql_server_port"),
          username: configService.get("mysql_server_username"),
          password: configService.get("mysql_server_password"),
          database: configService.get("mysql_server_database"),
          synchronize: true,
          logging: true,
          entities: [],
          poolSize: 10,
          connectorPackage: "mysql2",
          extra: {
            authPlugin: "sha256_password",
          },
        };
      },
    }),
  ],
 // ...
})
export class AppModule {}

```


## 局部使用
通过 `ConfigModule.forFeautrue` 来注册局部配置

BbbModule 
```ts
import { Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forFeature(() => { //[!code hl]
      return { //[!code hl]
        ddd: 222 //[!code hl]
      } //[!code hl]
    }) //[!code hl]
  ],
  controllers: [BbbController],
  providers: [BbbService]
})
export class BbbModule {}
```

`BbbController` 里读取

```ts
@Get()
findAll() {
    return {
      ccc: this.configService.get('aaa.bbb.ccc'),
      ddd: this.configService.get('ddd')
    }
}
```

## 定义ts 类型  

设置 infer 属性为true后，ConfigService#get方法将根据接口自动推断属性类型

```ts
interface EnvironmentVariables {
  PORT: number;
  TIMEOUT: string;
}

// somewhere in the code
constructor(private configService: ConfigService<EnvironmentVariables>) {
  const port = this.configService.get('PORT', { infer: true });

  // TypeScript Error: this is invalid as the URL property is not defined in EnvironmentVariables
  const url = this.configService.get('URL', { infer: true });
}
```

或者

```ts
 const configModel = () => ({
  env: process.env.APP_ENV,
  database: {
    url: process.env.DB_URL,
  },
  jwt:{
    secret:process.env.JWT_SECRET,
    signOptions:{
      expiresIn:process.env.JWT_EXPIRES_IN,
    }
  }
});
export default configModel;

/**
 * type ReturnConfigurationType = {
  env: string | undefined;
  database: {
    url: string | undefined;
  };
  jwt: {
    secret: string | undefined;
    signOptions: {
      expiresIn: string | undefined;
    };
 */
export type ReturnConfigurationType = ReturnType<typeof configModel>;

export type ObjectType<T = ReturnConfigurationType,R extends string = '',K = keyof T> = 
K extends keyof T ?
T[K] extends object ? ObjectType<T[K],`${R}${R extends "" ? "" : '.'}${K & string}`,keyof T[K]>
:`${R}${R extends "" ? "" : '.'}${K & string}` :any;

type Computed<T> = {
  [K in keyof T]:T[K]
} 

export type ConfigurationType = Computed<ObjectType>
```

```ts
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private configService: ConfigService<Record<ConfigurationType,unknown>>
  ) {}
  // 可以获取到提示
const dbHost = this.configService.get<string>("jwt.signOptions.expiresIn")
}
```

  