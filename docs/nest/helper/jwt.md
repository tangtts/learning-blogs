# jwt

## 安装
```bash
pnpm i @nestjs/jwt
```

## 使用

```ts:line-numbers{10-18}
import { ValidationPipe } from "@nestjs/common";
import { Response } from 'express'; // [!code hl]

@Post("login")
async login(
    @Body(ValidationPipe) createUserDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const foundUser = await this.userService.login(createUserDto);
    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          // 在user 实体中有 id 这个字段
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      res.setHeader("token", token);
    }
  }
```

校验  
`login-guard.ts` 文件  

**因为 `typescript` 里同名 `module` 和 `interface` 会自动合并，可以这样扩展类型**

```ts
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';


declare module 'express' {
  interface Request {
    user: {
      username: string;
      id: string
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

    const authorization = request.header('authorization') || '';

    const bearer = authorization.split(' '); // [!code hl] // 获取 token
    
    if(!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }

    const token = bearer[1]; // [!code hl] // 拿到真实 token

    try {
      const info = this.jwtService.verify(token); // [!code hl]
      request.user = info.user; // [!code hl] // 把用户信息存入 request 对象中
      return true; 
    } catch(e) {
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
```