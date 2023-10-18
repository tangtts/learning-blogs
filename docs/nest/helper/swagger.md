# swagger
## 安装
```bash
pnpm install --save @nestjs/swagger
```
## 使用
然后在 main.ts 添加这样一段代码
```ts
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
async function bootstrap() {
 const config = new DocumentBuilder()
    .setTitle("Test example")
    .setDescription("The API description")
    .setVersion("1.0")
    .addTag("test")
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("doc", app, document);

  // ....
}
```

访问 `http://localhost:3000/doc`

## 描述请求

### get query
```ts
// 描述这个接口
@ApiOperation({ summary: '测试 aaa',description: 'aaa 描述' })

@ApiQuery({
    name: 'a1',
    type: String,
    description: 'a1 param',
    required: false,
    example: '1111',
})
@ApiQuery({
    name: 'a2',
    type: Number,
    description: 'a2 param',
    required: true,
    example: 2222,
})

// 描述返回值
@ApiResponse({
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String
})

@GEt('aaa')
async aaa(@Query() a1: string, @Query() a2: number) {
    return 'aaa';
}
```
<img src="@backImg/swaggerQuery.webp" />

### get param

```ts
@ApiOperation({ summary: '测试 bbb',description: 'bbb 描述' })
@ApiResponse({
    status: HttpStatus.OK,
    description: 'bbb 成功',
    type: String
})
@ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'id 不合法'
})
@ApiParam({
    name: 'id',
    description: 'ID',
    required: true,
    example: 222,
})
@Get('bbb/:id')
bbb(@Param('id') id: number) { // [!code hl]
    console.log(id);
    if(id !== 111) {
      throw new UnauthorizedException();
    }
    return 'bbb success';
}
```

### post

```ts

export class CccDto {
    aaa: string;
    bbb: number;
    ccc: Array<string>;
}

export class CccVo {
    aaa: number;
    bbb: number;
}

@Post('ccc')
ccc(@Body('ccc') ccc: CccDto) {
    console.log(ccc);

    const vo = new CccVo();
    vo.aaa = 111;
    vo.bbb = 222;
    return vo;
}
```
<img src="@backImg/dtovo.webp" />

1. dto 是 data transfer object，用于参数的接收。

2. vo 是 view object，用于返回给视图的数据的封装。

3. 而 entity 是和数据库表对应的实体类。

```ts
@ApiOperation({summary:'测试 ccc'})
@ApiResponse({
    status: HttpStatus.OK,
    description: 'ccc 成功',
    type: CccVo
})
@ApiBody({
  type: CccDto
})
@Post('ccc')
ccc(@Body('ccc') ccc: CccDto) {
  const vo = new CccVo();
  vo.aaa = 111;
  vo.bbb = 222;
  return vo;
}
```
```ts
export class CccDto {
    @ApiProperty({ name: 'aaa', enum: ['a1', 'a2', 'a3'], maxLength: 30, minLength: 2, required: true})
    aaa: string;

    @ApiPropertyOptional({
       name: 'bbb', 
       maximum: 60, 
       minimum: 40, 
       default: 50, // 默认值
       example: 55,
       })
    bbb: number;

    @ApiProperty({ name: 'ccc' })
    ccc: Array<string>;
}
```

## tag分组
比如 controller 是 xxx 开头的，那可以用 @ApiTags 来分组到 xxx。
<img src="@backImg/controllTag.webp" />
也可以添加在 handler 上：
<img src="@backImg/handlerTag.webp" />
<img src="@backImg/nestTag.webp" />

## 添加验证

```ts
const config = new DocumentBuilder()
    .setTitle('Test example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('test')
    .addBasicAuth({
      type: 'http',
      name: 'basic',
      description: '用户名 + 密码'
    })
    .addCookieAuth('sid', {
      type: 'apiKey',
      name: 'cookie',
      description: '基于 cookie 的认证'
    })
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
      name: 'bearer'
    })
    .build();
```

```ts
 @ApiBearerAuth('bearer')
 @ApiCookieAuth('cookie')
 @ApiBasicAuth('basic')
```