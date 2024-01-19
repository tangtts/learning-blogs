# String


```java
public class Main {
    public static void main(String[] args) {
        String s = "hello";
        System.out.println(s); // 显示 hello
        s = "world";
        System.out.println(s); // 显示 world
    }
}
```

执行String s = "hello";时，JVM虚拟机先创建字符串"hello"，然后，把字符串变量s指向它：

<pre class="ascii"><code class="language-ascii" style="font-family: JetBrainsMono, &quot;Courier New&quot;, Consolas, monospace;">      s
      │
      ▼
┌───┬───────────┬───┐
│   │  "hello"  │   │
└───┴───────────┴───┘
</code></pre>

紧接着，执行s = "world";时，JVM虚拟机先创建字符串"world"，然后，把字符串变量s指向它：
<pre class="ascii">
<code class="language-ascii" style="font-family: JetBrainsMono, &quot;Courier New&quot;, Consolas, monospace;">      s ──────────────┐
                      │
                      ▼
┌───┬───────────┬───┬───────────┬───┐
│   │  "hello"  │   │  "world"  │   │
└───┴───────────┴───┴───────────┴───┘
</code>
</pre>


:::details 字符串是不可变的,原因如下:

- 安全性： 字符串不可变性提供了一定程度的安全性，防止在多线程环境下发生并发访问和修改冲突。多个线程可以同时共享一个字符串对象，而无需担心其值会被修改。

- 线程安全： 不可变字符串是线程安全的，因为它们的值不能被修改。这意味着多个线程可以自由地共享和访问同一个字符串对象，而无需进行同步操作。

- 哈希值的缓存利用： 字符串的不可变性使得可以缓存字符串的哈希值。这样，在需要频繁使用字符串作为HashMap的键或者在散列集合中进行查找时，可以提高性能。

- 字符串池的利用： 字符串常量池是Java中的一个特性，它可以避免创建重复的字符串对象。由于字符串不可变，可以将相同的字符串实例引用到同一个对象，节省了内存空间。

- 代码优化： 不可变字符串使得编译器和运行时环境可以进行一些优化。例如，对字符串进行连接操作时，编译器可以使用StringBuilder来提高效率，而无需额外的开发人员干预。

尽管不可变字符串可能会导致创建新的字符串对象，但是它们提供了许多优势，如线程安全、安全性、简化代码和性能优化。因此，在Java中将字符串设计为不可变的是经过仔细考虑和权衡的决策。

:::

---- 

如果想要改变,则需要使用 StringBuffer或者StringBuilder,StringBuffer 和 StringBuilder 类的对象能够被多次的修改，并且不产生新的未使用对象


:::tip
StringBuilder 类在 Java 5 中被提出，它和 StringBuffer 之间的最大不同在于 StringBuilder 的方法不是线程安全的（不能同步访问）。

由于 StringBuilder 相较于 StringBuffer 有速度优势，所以多数情况下建议使用 StringBuilder 类。
:::

## 多行字符串
多行字符串前面共同的空格会被去掉
```java
      String s = """
                 SELECT * FROM
                   users
                 WHERE id > 100
                 ORDER BY name DESC
                 """;
```
即

```java
String s = """
...........SELECT * FROM
...........  users
...........WHERE id > 100
...........ORDER BY name DESC
...........""";
```
用 `.` 标注的空格都会被去掉

## StringBuilder

```java
StringBuilder sb = new StringBuilder();
sb.append("acdefghihhhhhh");
// 下标 1 处添加 java 字符串
sb.insert(1,"java");
// 下标 0 处 删除 1 个字符
sb.delete(0,1);
sb.reverse();
System.out.println(sb);
```

## 构建字符串
使用 **`""`** 字符串是一个常量，会放到字符串常量池中,不会重复创建  
但是 使用 `new String` 会重新创建一个对象  
```java
String s = "abc";
String s1 = "abc";
String s2 = new String("abc");
System.out.println(s == s1); // true

System.out.println(s == s2); // false

System.out.println(s.equals(s2)); // true
```
引用类型比较使用 `equals`, 基本类型比较使用 `==`

### 字符串

字符串本质是一个字符数组，在字符串常量创建之后，它的值不能改变。

```java
char[] cs =  {'a','中'};
String s = new String(cs);
System.out.println(s); // a中
```

### 字节

**如果是普通的英文字符，一个字节一个字符对应，如果是汉字，则需要三个字节一个字符对应。**

```java 
byte[] bs = {-28,-72,-83,-27,-101,-67};
String s1 = new String(bs);
System.out.println(s1);
```

#### 字符获取字节
```java
String str = "中";
byte[] bytes = str.getBytes();
System.out.println(Arrays.toString(bytes)); // [-28, -72, -83]
```

```java
String str = "a";
byte[] bytes = str.getBytes();
System.out.println(Arrays.toString(bytes)); // [97]
```
<img src="@backImg/javaChar.png">



## 方法

### toCharArray

```java
String s = "acd";
char[] str = s.toCharArray();
str[0] = 'h';
System.out.println(str); // hcd
```
### charAt
字符串不能直接使用 `s[0]` 的形式
```java
String s = "acd";
s.charAt(0) // 'a'
```

### indexOf/lastIndexOf

```java
String s = "acd";
s.indexOf("a") // 0
s.lastIndexOf('a')
```
### contains
包含字符

```java
String s = "acd";
s.contains("a")
```
### startsWith/endWith

```java
String s = "acd";
System.out.println(s.startsWith("a")); // true
System.out.println(s.endsWith("a")); // false
```
### isEmpty
判断是否为空字符
```java
String s = "acd";
System.out.println(s.isEmpty());
```
### concat
拼接字符,使用 `+` 号拼接不行
```java
String s = "acd";
String s1 = "acd";
String s2 = s.concat(s1); // acdacd
```
### trim
去除首尾空格
```java
String s = "acd";
s.trim();
```

### replace
必须有变量去接收返回值
```java
String s = "acd";
s = s.repalce("a","x")
```
### replaceAll
可以写正则
```java
String s = "acd";
String s1 = "acd";
String s2 = s.concat(s1);
s2 =  s2.replaceAll("a|c","x");
System.out.println(s2);
```

### 比较

#### equals

```java
String s = "a";
String s1 = "A";
System.out.println(s.equals(s1)); // false
```

#### equalsIgnoreCase
忽略大小写
```java
String s = "a";
String s1 = "A";
System.out.println(s.equalsIgnoreCase(s1));
```
#### compareTo / compareToIgnoreCase
比较 Unicode 
```java
byte b1 = 'a';
byte b2 = 'A';
System.out.println(b1); // 97
System.out.println(b2);; // 65
```

```java
System.out.println(s.compareTo(s1)); // 32

System.out.println(s.compareToIgnoreCase(s1)); // 0
```
## StringUtils



### isEmpty
判断字符是否为空,但是不包含空格

```java
isEmpty(null)------true
isEmpty("")------true
isEmpty(" ")------false
isEmpty("aa")----false
```
源码
```java
public static boolean isEmpty(String str) {
   return str == null || str.length() == 0;
}
```

### isBlank
去除空格之后再去判断
```java
isBlank(null)------true
isBlank(" ")------true
isBlank(" ")------true
isBlank("      ")------true
isBlank("\t \n \f \r")------true      //制表符、换行符、换页符和回车符
isBlank("qqqq")------false
```
源码
```java
public static boolean isBlank(String str) {
  int strLen;
  if (str != null && (strLen = str.length()) != 0) {
      for(int i = 0; i < strLen; ++i) {// 判断字符是否为空格、制表符、tab
          if (!Character.isWhitespace(str.charAt(i))) {
              return false;
          }
      }
      return true;
  } else {
      return true;
  }
}
```
