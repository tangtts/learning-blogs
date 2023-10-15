# 数组

## 定义
数组是存储**同一种数据类型**的一组数据的集合。

:::tip
  必须是同一种数据类型
:::

```java
int[] nums = {5, 3, 2, 1, 4};
int [] nums = new int[]{5, 3, 2, 1, 4};
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

