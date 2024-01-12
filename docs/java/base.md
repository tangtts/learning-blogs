# 配置项
## 名词解释
### javaSE/javaEE
简单来说，Java SE就是标准版，包含标准的JVM和标准库  
而Java EE是企业版，它只是在Java SE的基础上加上了大量的API和库，以便方便开发Web应用、数据库、消息服务等  
Java EE的应用使用的虚拟机和Java SE完全相同

<img src="@img/javaEE-javaSE.png"/>

### 运行环境
- JDK：Java Development Kit
- JRE：Java Runtime Environment
简单地说，JRE就是运行Java字节码的虚拟机。但是，如果只有Java源码，要编译成Java字节码，就需要JDK，因为JDK除了包含JRE，还提供了编译器、调试器等开发工具。
<img src="@img/jdk-jre.png"/>

### IDE
IDE是集成开发环境：Integrated Development Environment的缩写  
使用IDE的好处在于，可以把编写代码、组织项目、编译、运行、调试等放到一个环境中运行，能极大地提高开发效率


### bean
1. 类要求必须含有无参,公共的构造方法
2. <blue>属性必须私有化, 必须有对应的getter/setter方法</blue>

可以保护属性的安全性


```java
class User{
  private String name;
  private int age;

  public String getName(){
    return name;
  }

  public void setName(String name){
    this.name = name;
  }

 // age 的 bean 方法
  public int getAge(){
    return age;
  }

  public void setAge(int age){
    this.age = age;
  }
}
```
## 模块化
### package
路径中的多个包使用点隔开  
主要功能用于分类管理  
包名一般是为了区分类名,所以一般都是小写  
`java.lang.Object`

### import
- `import` 语句只能使用在 `package` 后, `class` 前  
- 如果同一个包导入大量的类,可使用 `*` 代替包名  
- 如果import 导入了不同包中相同名称的类, 则必须使用全限定名

:::tip
  java.lang 包不需要导入, jvm 自动导入
:::

```java
import java.util.*;

// 全量导入
java.lang.String name = "zs"
// 简写
String name = "zs"

java.util.List list = new java.util.ArrayList();
```

## 基础类型

| 类型 | 默认值 | 取值范围 | 位数 |
| :--: | :--: | :--: |:--: |
| byte | 0 | -128 ~ 127 |8位（1个字节）|
| short | 0 | -32768 ~ 32767 |16位(2个字节)|
| int | 0 | -2147483648 ~ 2147483647 | 32位（4个字节）|
| long | 0L | -9223372036854775808 ~ 9223372036854775807 |64位（8个字节）|
| float | 0.0f | 1.4E-45 ~ 3.4028235E38 |32位（4个字节）|
| double | 0.0d | 4.9E-324 ~ 1.7976931348|64位（8个字节）|
| boolean | false | true/false | --- |
| char | '\u0000' | 0 ~ 65535 | --- |

## 注解

### JsonFormat

序列化和反序列化

如果前端传来的为字符串格式的日期：“2022年07月29日 09时41分22秒”，则需要如下配置：

```java
@JsonFormat(pattern = “yyyy年MM月dd日 HH时mm分ss秒”)
private Date createTime;
```

解析后存入DB中的则为：2022-07-29 09:41:22，而在查询时返回的数据则为：“2022年07月29日 09时41分22秒”


