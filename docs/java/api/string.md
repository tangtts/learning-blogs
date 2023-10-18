# String

字符串是不可变的,原因如下:


- 安全性： 字符串不可变性提供了一定程度的安全性，防止在多线程环境下发生并发访问和修改冲突。多个线程可以同时共享一个字符串对象，而无需担心其值会被修改。

- 线程安全： 不可变字符串是线程安全的，因为它们的值不能被修改。这意味着多个线程可以自由地共享和访问同一个字符串对象，而无需进行同步操作。

- 哈希值的缓存利用： 字符串的不可变性使得可以缓存字符串的哈希值。这样，在需要频繁使用字符串作为HashMap的键或者在散列集合中进行查找时，可以提高性能。

- 字符串池的利用： 字符串常量池是Java中的一个特性，它可以避免创建重复的字符串对象。由于字符串不可变，可以将相同的字符串实例引用到同一个对象，节省了内存空间。

- 代码优化： 不可变字符串使得编译器和运行时环境可以进行一些优化。例如，对字符串进行连接操作时，编译器可以使用StringBuilder来提高效率，而无需额外的开发人员干预。

尽管不可变字符串可能会导致创建新的字符串对象，但是它们提供了许多优势，如线程安全、安全性、简化代码和性能优化。因此，在Java中将字符串设计为不可变的是经过仔细考虑和权衡的决策。

---- 

如果想要改变,则需要使用 StringBuffer或者StringBuilder,StringBuffer 和 StringBuilder 类的对象能够被多次的修改，并且不产生新的未使用对象


:::tip
StringBuilder 类在 Java 5 中被提出，它和 StringBuffer 之间的最大不同在于 StringBuilder 的方法不是线程安全的（不能同步访问）。

由于 StringBuilder 相较于 StringBuffer 有速度优势，所以多数情况下建议使用 StringBuilder 类。
:::

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