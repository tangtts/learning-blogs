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


## 数组和集合的区别

### 数组
1. 数组一旦创建，在java中规定，长度不可变。（数组长度不可变） 
2. java中的数组要求数组中元素的类型统一
3. 数组在内存方面存储的时候，内存地址连续。 这是数组存储元素的特点（特色）。数组实际上是一种简单的数据结构。


### 集合
1. 集合长度是可以改变的
2. 集合默认其中所有元素都是Object
3. 无法直接获取数组实际存储的元素个数，length用来获取数组的长度，但可以通过size（）直接获取集合实际存储的元素个数



## 方法

### toString
返回真实的 数组结构,而不是地址
```java
int[] is = {3,5,2,4,1};
System.out.println(Arrays.toString(is)); // [3, 5, 2, 4, 1]
```
### sort
正序排序

```java
Arrays.sort();
```
### binarySearch
二分查找 下标
:::info
  二分查找，前提是数组有序
:::
```java
int x =  Arrays.binarySearch(is,5);
```
### equals

比较两个数组的对应的元素是否相等
```java
int[] is = {3,5,2,4,1};
int[] is1 = {3,5,2,1,4};
System.out.println(Arrays.equals(is, is1));
```
可以比较局部

```java
int[] is = {1,2,3,4,5};
int[] is2 = {1,2,3,4,5,6};

System.out.println(Arrays.equals(is, 0, 5, is2, 0, 5));  
```

### asList
将数组转换成集合




```java
List<Integer> integers = Arrays.asList(1, 2, 3, 4);

System.out.println(integers.indexOf(2));
```

## 排序

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
