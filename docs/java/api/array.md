# 数组

## 定义
数组是存储**同一种数据类型**的一组数据的集合。

:::tip
  必须是同一种数据类型
:::

### 定义数字数组类型
不限制数组长度
```java
int[] nums = {5, 3, 2, 1, 4};
int[] nums = new int[]{5, 3, 2, 1, 4};
```

### 定义字符串数组类型
```java
String[] names = {"zs",'lisi'};
String[] names = new String[]{"zs",'lisi'};
```

### 二维数组

```java
String[][] names = new String[3][3];
names[0][1] = "zs"
```



## 方法

### 冒泡排序
，abcde，第一次循环，把最大的数放到最后，第二次循环，把第二大的数放到倒数第二位，依次类推。
```java
 for (int j = 0; j < nums.length; j++) {
      for (int i = 0; i < nums.length - 1 - j; i++) {
        int num1 = nums[i];
        int num2 = nums[i + 1];

        if (num1 > num2) {
          nums[i] = num2;
          nums[i + 1] = num1;
        }
      }
    }
```

### 选择排序
每一次找到最大的值,把最后的值与找到的最大的值进行交换

```java
int[] x = {1,3,2,4,5};
for (int j = 0; j < x.length; j++) {
  int maxIndex = 0;
  for (int i = 1; i < x.length - j; i++) {
    if(x[i] > x[maxIndex]){
        maxIndex = i;
    }
    int num1 = x[x.length-1-j];
    int num2 = x[maxIndex];
    x[x.length-1-j] = num2;
    x[maxIndex] = num1;
  }
}
```
