# @interface

注解 @interface 不是接口是 **注解类**，使用 @interface 自定义注解时，自动继承了java.lang.annotation.Annotation接口。

> 就是不能定义 public @interface A extends B 这样的形式，必须裸的，只能是 public @interface A 形式
>




```java
//定义带成员变量注解MyTag
@Rentention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD) // [!code hl]
public @interface MyTag{
  //定义两个成员变量，以方法的形式定义
  String name();
  int age() default 20;
}

```
`@Target` 该参数声明这个注解可以加在上面位置，只能在类上、或只能在方法上
```java
public enum ElementType {
    TYPE,               /* 类、接口（包括注释类型）或枚举声明  */

    FIELD,              /* 字段声明（包括枚举常量）  */

    METHOD,             /* 方法声明  */

    PARAMETER,          /* 参数声明  */

    CONSTRUCTOR,        /* 构造方法声明  */

    LOCAL_VARIABLE,     /* 局部变量声明  */

    ANNOTATION_TYPE,    /* 注释类型声明  */

    PACKAGE             /* 包声明  */
}
```
**在使用 该注解的地方，需要给属性赋值，如果属性定义时，带有default，则可以不用赋值，age可以不用赋值，而name必须赋值：**

```java
//使用
public class Test{
  @MyTag(name="test")
  public void info(){}
}
```