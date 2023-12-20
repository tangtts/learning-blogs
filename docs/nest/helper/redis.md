# redis
## 安装
```bash
pnpm i redis
```

## 使用
> redis / redis.module
```ts
import { Global, Module } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { createClient } from "redis";
import { ConfigService } from "@nestjs/config";


@Global()
@Module({
  exports:[RedisService],
  providers: [
    RedisService,
    {
      inject:[ConfigService],
      provide: "REDIS_CLIENT",
      async useFactory(configService:ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('redis_server_host'),
            port: configService.get('redis_server_port'),
          },
          database: configService.get('redis_server_db'),  // redis 的 database 就是一个命名空间的概念
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class RedisModule {}
```
> redis / redis.service

```ts
import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";

@Injectable()
export class RedisService {
  @Inject("REDIS_CLIENT")
  private readonly redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
```
> app.module.ts

```ts
@Module({
  imports: [RedisModule]
})
```
其他模块使用

```ts
@Controller("email")
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly redisService: RedisService  // [!code hl]
  ) {}}
```

