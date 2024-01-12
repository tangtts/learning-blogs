# spring-boot

## 接口
需要在类上使用 `RestController`,然后在方法上使用对应的 `接口名称`
```java
@RestController
public class User {
  @Value("${email.age}")
  private Integer age;
// 需要在启动类所在的包下面
  @RequestMapping("/hello")
  public Integer getInfo(){
    return this.age;
  }
}
```

## 注解

### Bean 注册

| 注解        | 说明                 | 位置                                    |
| ----------- | -------------------- | --------------------------------------- |
| @Component  | 声明bean的基础注解   | 不属于以下三类时，使用此注解            |
| @Controller | @Component的衍生注解 | 控制器类                                |
| @Service    | @Component的衍生注解 | 业务类                                  |
| @Repository | @Component的衍生注解 | 数据访问类上(由于与mybatis整合，用的少) |

## 配置项
### 自定义配置
> resource/application.yml
```yml
email:
  user: 2939117014
  age: 10000
#  数组

hobby:
  - 打篮球
  - 打豆豆
  - 打游戏  
```
使用

```java
public class User {
  @Value("${email.age}")
  private Integer age;

  public Integer getAge(){
    return  this.age;
   }
}
```
## 拦截器

请求之前使用 `preHandle`,请求之后使用 `afterCompletion`

```java
@Component
public class LoginInterceptor implements HandlerInterceptor {

  @Autowired
  private StringRedisTemplate stringRedisTemplate;

     @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception { // [!code hl]

        // 令牌验证
        String token = request.getHeader("Authorization");
        //验证token
        try {
            //从redis中获取相同的token
            ValueOperations<String, String> operations = stringRedisTemplate.opsForValue();
            String redisToken = operations.get(token);

            if (redisToken == null){
                //token已经失效了
                throw new RuntimeException();
            }

            Map<String, Object> claims = JwtUtil.parseToken(token);

            //把业务数据存储到ThreadLocal中
            ThreadLocalUtil.set(claims);
            //放行
            return true;
        } catch (Exception e) {
            //http响应状态码为401
            response.setStatus(401);
            //不放行
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception { // [!code hl]
        //清空ThreadLocal中的数据
        ThreadLocalUtil.remove();
    }
}
```

注册使用

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //登录接口和注册接口不拦截
        registry.addInterceptor(loginInterceptor).excludePathPatterns("/user/login","/user/register");
    }
}
```

