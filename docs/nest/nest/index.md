# nest

## nest 快捷键

1. 生成
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

## 过滤器/拦截器

### 全局过滤器
其他也是一样的
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
