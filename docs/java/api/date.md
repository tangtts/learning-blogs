# 时间

世界标准时间: 格林威治时间(GMT) Greenwish Mean Time
## 获取时间戳
```java
System.currentTimeMillis();
```
## 获取当前时间

### 获取时间戳
```java
SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss");
Date date = new Date(System.currentTimeMillis());
System.out.println(formatter.format(date)); // 2023-10-14 at 15:08:43

```
### new Date
```java
Date date = new Date(); 
// this object contains the current date value 
SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
System.out.println(formatter.format(date)); // 2023-10-14 15:09:33  
```
### LocalDate
LocalDate 只是一个日期，没有时间。 这意味着我们只能获得当前日期，但没有一天的具体时间
```java
LocalDate date = LocalDate.now(); // get the current date 

DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");  
System.out.println(date.format(formatter)); // 14-10-2023 
```

### LocalTime
LocalTime 与 LocalDate 相反，它只代表一个时间，没有日期。 这意味着我们只能获得当天的当前时间,而不是实际日期

```java
LocalTime time = LocalTime.now(); // get the current time  

DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm:ss");  
System.out.println(time.format(formatter)); // 15:11:10
```

### LocalDateTime
最后一个是 LocalDateTime，也是 Java 中最常用的 Date / Time 类，代表前两个类的组合 – 即日期和时间的值

```java
LocalDateTime dateTime = LocalDateTime.now(); // get the current date and time  

DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");  
System.out.println(dateTime.format(formatter)); // 4-8-2021 00:27:20  
```


## 格式化时间
### SimpleDateFormat
> 可以接收 Date 类型，也可以接收 long 类型
```java
SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss");

formatter.format(System.currentTimeMillis()) // 2023-09-20 at 22:43:32
```

```java
SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss");
Date date = new Date(System.currentTimeMillis());

formatter.format(date) // 2023-09-20 at 22:43:32
```

## 修改时间
### Calendar
1. 单个修改
```java
Calendar c =  Calendar.getInstance();
Date d =  new Date();
c.setTime(d); // 设置时间

// 修改时间
c.set(Calendar.YEAR,2023);
c.set(Calendar.MONTH,9);
c.set(Calendar.DAY_OF_MONTH,10);


// 获取时间戳
c.getTimeInMillis()
int year = c.get(Calendar.YEAR);
int month = c.get(Calendar.MONTH);
System.out.println(year +"," +month); // 2023,9
```

2. 批量修改
```java
Calendar c =  Calendar.getInstance();
Date d =  new Date();
c.setTime(d);

c.set(2013, 5, 4, 13, 44, 51);
 SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss");
 System.out.println(formatter.format(c.getTime())); // 2013-06-04 at 13:44:51
```
3. add
```java
Calendar c =  Calendar.getInstance();
c.add(Calendar.MONTH,-1); // 往后退一个月
c.add(Calendar.YEAR,1); //往前推一年
```