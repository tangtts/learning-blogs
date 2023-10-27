# io
输入输出流

## File 
file 接收一个文件路径，返回一个File对象
```java
File file = new File("D:\\workspace\\test\\data2\\txt.txt");
```

### exists
判断文件是否存在
```java
file.exists()
```
### isDirectory / isFile
判断是文件夹还是文件

```java
file.isFile()
file.isDirectory()
```
如果是文件夹,可以通过 `list()` 方法获取文件夹下的所有文件
```java
if(file.isDirectory()){
  String[] list = file.list();
  for (String s : list) {
      System.out.println(s);
  }
}
```
#### 文件信息
```java
System.out.println(file.getName());
System.out.println(file.length());
System.out.println(file.lastModified());
System.out.println(file.getAbsolutePath());
```

### mkdirs创建文件夹
```java
file.mkdirs();
```
### createNewFile 创建文件

```java
file.createNewFile();
```

## 例子

```java
File file = new File("D:\\workspace\\test\\data2\\txt.txt");

if(file.exists()){
  System.out.println("文件对象存在");
  if(file.isFile()){
    System.out.println(file.getName());
    System.out.println(file.length());
    System.out.println(file.lastModified());
    System.out.println(file.getAbsolutePath());
  }else  if(file.isDirectory()){
    String[] list = file.list();
    for (String s : list) {
        System.out.println(s);
    }
  }
}else  {
// file.mkdirs();
  file.createNewFile();
}
```

