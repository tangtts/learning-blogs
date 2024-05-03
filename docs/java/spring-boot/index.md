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
## serverlet

### get

#### 直接传递参数

```bash
?from=1&size=2
```

```java
/*
	 * 功能描述：测试GetMapping
	 * @param from
	 * @param size
	 * @return
	 **/
	@GetMapping()
	public Object pageUser(int from,int size) {
		params.put("from", from);
		params.put("size", size);
		return params;
	}
```
### 请求参数设置默认值

使用 `RequestParam` 可以设置默认值，也可以使用 `name` 重命名

```java
@GetMapping()
public Object pageUser(@RequestParam(defaultValue="0",name="page") int from,int size) {
		params.put("from", from);
		params.put("size", size);
		return params;
	}
```
因为有`name`,所以使用 page
```bash
?page=1&size=2
```

## post

```java
//相当于定义一个POJO
public class User {
 
	private int age;
	private String name;
	
	public int getAge() {
		return age;
	}
	
	public void setAge(int age) {
		this.age=age;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name=name;
	}
}
```

```java
	@RequestMapping("/v1/save_user")
	public Object saveUser(@RequestBody User user) {
		params.clear();
		params.put("user",user);
		return params;
	}
```

[推荐](https://springdoc.cn/spring-boot/using.html#using.spring-beans-and-dependency-injection)

推荐使用构造函数注入

```java
@Service
public class MyAccountService implements AccountService {

    private final RiskAssessor riskAssessor;

    public MyAccountService(RiskAssessor riskAssessor) {
        this.riskAssessor = riskAssessor;
    }
}
```
如果一个Bean有多个构造函数，你需要用 @Autowired 注解来告诉Spring该用哪个构造函数进行注入。

```java
@Service
public class MyAccountService implements AccountService {

    private final RiskAssessor riskAssessor;

    private final PrintStream out;

    @Autowired
    public MyAccountService(RiskAssessor riskAssessor) {
        this.riskAssessor = riskAssessor;
        this.out = System.out;
    }

    public MyAccountService(RiskAssessor riskAssessor, PrintStream out) {
        this.riskAssessor = riskAssessor;
        this.out = out;
    }
}
```
> 上面示例中通过构造器注入的 riskAssessor 字段被标识为了 final，表示一旦Bean创建这个字段就不被改变了。这也是我们推荐的做法。


注入 

```java
 @Value("${name}")
 private String name;
```
application.properties
```js
name  = "zs"
```

可以引用，也可以使用占位符


(属性占位符)[https://springdoc.cn/spring-boot/features.html#features.external-config.files.property-placeholders]
```js
app.name=MyApp
app.description=${app.name} is a Spring Boot application written by ${x:Unknown}
```

> 假设 x 属性没有在其他地方设置，app.description 的值将是 MyApp is a Spring Boot application written by Unknown。

:::info
你应该始终使用占位符中的属性名称的规范形式（仅使用小写字母的kebab-case）来引用它们。 这将允许Spring Boot使用与宽松绑定 @ConfigurationProperties 时相同的逻辑。

例如，${demo.item-price} 将从 application.properties 文件中获取 demo.item-price 和 demo.itemPrice 形式的属性，以及从系统环境中获取 DEMO_ITEMPRICE 。 如果你用 ${demo.itemPrice} 的话， demo.item-price 和 DEMO_ITEMPRICE 就不会被考虑。
:::

使用配置项

这个 `my.main-project.person` 是在配置文件的前缀词
```java
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "my.main-project.person")
public class MyPersonProperties {

    private String firstName;

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
}
```
对以上的代码来说，以下的属性名称都可以使用。

my.main-project.person.first-name

Kebab 风格（短横线隔开），建议在 .properties 和 YAML 文件中使用。

my.main-project.person.firstName

标准的驼峰语法。

my.main-project.person.first_name

下划线，这是一种用于 .properties 和 YAML 文件的替代格式。

MY_MAINPROJECT_PERSON_FIRSTNAME

大写格式，在使用系统环境变量时建议使用大写格式。

使用


```java
class A {
    private final MyProperties properties;

    public DemoApplication(MyProperties properties) {
        this.properties = properties;
    }
}

      System.out.println(properties.getName());
```

添加校验

```java
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties("app")
@Validated
@Getter
@Setter
public class MyProperties {

    private String name;

    @NotNull
    @Max(10)
    @Min(0)
    private  Integer age;

}
```
:::info
如果你确实想使用 @Value，我们建议你使用属性名称的规范形式（仅使用小写字母的kebab-case）来引用属性名称。 这将允许Spring Boot使用与 宽松绑定 @ConfigurationProperties 时相同的逻辑。

例如，@Value("${demo.item-price}") 将从 application.properties 文件中获取 demo.item-price 和 demo.itemPrice 形式，以及从系统环境中获取 DEMO_ITEMPRICE。 如果你用 @Value("${demo.itemPrice}") 代替，demo.item-price 和 DEMO_ITEMPRICE 将不会被考虑。
:::