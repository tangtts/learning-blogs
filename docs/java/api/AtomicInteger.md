# AtomicInteger

```java
AtomicInteger atomicInteger = new AtomicInteger();
````
- 获取和赋值
```java
atomicInteger.get(); //获取当前值
atomicInteger.set(999); //设置当前值
```

```java

 public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(0); // [!code hl]
        // 0
        System.out.println(atomicInteger.get());

        int expectedValue = 123;
        int newValue      = 234;
        Boolean b =atomicInteger.compareAndSet(expectedValue, newValue);
        // false
        System.out.println(b);
        // 0 
        System.out.println(atomicInteger);
    }
```

```java

public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(123); // [!code hl]
        // 123
        System.out.println(atomicInteger.get());

        int expectedValue = 123;
        int newValue      = 234;
        Boolean b =atomicInteger.compareAndSet(expectedValue, newValue);
        // true
        System.out.println(b); // [!code hl]
        // 234
        System.out.println(atomicInteger); // [!code hl]

    }
```

由上可知该方法表示，atomicInteger的值与expectedValue相比较，如果不相等，则返回false,
atomicInteger原有值保持不变；如果两者相等，则返回true,atomicInteger的值更新为newValue


`getAndAdd / addAndGet` 和 ` decrementAndGet / getAndDecrement` 的区别，如果不传值，默认为 1

```java
AtomicInteger atomicInteger = new AtomicInteger(123);
System.out.println(atomicInteger.get());  //  --123

System.out.println(atomicInteger.getAndAdd(10)); //  --123 获取当前值，并加10
System.out.println(atomicInteger.get());  // --133


// add 在前
System.out.println(atomicInteger.addAndGet(10)); // --143 先加10 后获取
```