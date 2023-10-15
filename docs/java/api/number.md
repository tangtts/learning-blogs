# 数字
## 类型
### 转化

即将大范围的整数转型为小范围的整数。强制转型使用(类型)，例如，将`int`强制转型为`short`

```java
int i = 12345;
short s = (short) i; // 12345
```

## int
### 除法
两个整数相除只能得到结果的整数部分
```java
int x = 12345 / 67  // 184
int y = 12345 % 67; // 12345÷67 的余数是17
```

## float
### 类型提升
如果参与运算的两个数其中一个是整型，那么整型可以自动提升到浮点型:
```java
int n = 5;
double d = 1.2 + 24.0 / n; 
System.out.println(d); // 6.0
```
### 溢出
```java
double d1 = 0.0 / 0; // NaN
double d2 = 1.0 / 0; // Infinity
double d3 = -1.0 / 0; // -Infinity
```

###



