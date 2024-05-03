# redis

在 `pom` 引入
```js
 <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
  </dependency>
```

使用

```java
import org.springframework.data.redis.core.StringRedisTemplate;

@Service
public class AuthorizeServiceImpl {
    @Resource
    StringRedisTemplate template;

}
```

## key

```java
template.hasKey(key)
```
## 过期时间  

### getExpire 
获取过去时间，以 s 为单位
```java
import java.util.concurrent.TimeUnit;
template.getExpire(key, TimeUnit.SECONDS)
```

## get

- get
  
 ```java
String BBB = (String) redisTemplate.opsForValue().get("BBB");
``` 

- getAndSet
> 获取key对应的值，如果key存在则修改,不存在则新增

```java
redisTemplate.opsForValue().getAndSet("BBB", "心情");
```

- increment
> 以指定增量的方式将Long值存储在变量中，返回最新值
```java
redisTemplate.opsForValue().increment("AAA",2);
``` 


## set

- set(K key, V value)

```java
redisTemplate.opsForValue().set("BBB","你好");
```
- set(K key, V value, Duration timeout)
  
```java
redisTemplate.opsForValue().set("BBB","你好", Duration.ofMinutes(1));
```

- set(K var1, V var2, long var3, TimeUnit var5)
> 和上文效果一致
```java
redisTemplate.opsForValue().set("BBB","你好", 1, TimeUnit.MINUTES);
```

- setIfAbsent(K var1, V var2);
  > 如果key不存在则新增，key存在不做任何操作
  > 其他方式与上文一致，只不过是 set 换成 setIfAbsent
```java
redisTemplate.opsForValue().setIfAbsent("BBB", "好的");
```

## 删除

```java
 redisTemplate.delete(key)
```