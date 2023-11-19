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
