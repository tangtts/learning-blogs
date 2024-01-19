
# class

拿一条狗来举例，它的状态有：名字、品种、颜色，行为有：叫、摇尾巴和跑。  
软件对象也有状态和行为。软件对象的状态就是属性，行为通过方法体现。  
<blue>类可以看成是创建 Java 对象的模板。</blue>

<img src="@backImg/dog-class.png">


----
在 java 中 权限主要分为 4 种
1. private 私有的,同一个类可以使用
2. default (默认的),当不设置任何权限时, 在同一个包可以使用
3. protected 受保护的,同一个类和子类可以访问
4. public 公共的,同一个类,子类,父类,都可以访问
### main
```java
public static class main (String args[]){
  // ....
 }
```

:::tip
  先有 类,再有对象   
  main方法只能是 static, 如果是成员方法或者构造方法,还要 `new`,可能还要传递不同的参数
:::

## 构造方法

构造方法是类中都有的一个方法,如果没有显式定义, `jvm` 虚拟机会自动生成一个无参的构造方法
一个类可以有多个构造方法。

```java
public class Puppy{
    public Puppy(){
    }
 
    public Puppy(String name){
        // 这个构造器仅有一个参数：name
    }
}
```

```java
class Parent {

}

class Child extends Parent {
  Child(){
    super()
  }
}
```
执行顺序是这样的
1. 先执行对象
2. 然后执行构造函数
 构造函数为了属性初始化, super 必须给父类初始化  

### Override 重写
重写是子类对父类的允许访问的方法的实现过程进行重新编写, 返回值和形参都不能改变。**即外壳不变，核心重写！**
重写的好处在于子类可以根据需要，定义特定于自己的行为。 也就是说子类能够根据需要实现父类的方法。

<img src="@backImg/重载重写2.png"/>
<img src="@backImg/重载重写.png"/>

ts 的 类 只有 重写
```ts
class A {
  run(s:string){
    return s
  }
}

class B extends A {
  // 不能够这样写, ts 只有重写
  run(s:number){ // [!code error]
    return s
  }
}
```

 ## 方法重载

可以根据参数列表(个数,顺序,类型) 不相同

```java
public class User {
  void login(int tel){
    // ....
  }

  void login(String name){
    // ....
  }

  void login(String name, int tel){
    // ....
  }
}
```

## 构造方法

在类的初始值的 时候，会有一个无参构造,构造函数的名称和类名相同  

```java
class Person {
 private String name;
 private int age;

 public Person(String name, int age) {
     this.name = name;
     this.age = age;
 }

 public Person(String name) {
     this.name = name;
     this.age = 12;
 }

 public Person() {
 }
}
```

也可以调用另一个构造方法

```java
class Person {
 private String name;
 private int age;

 public Person(String name, int age) {
     this.name = name;
     this.age = age;
 }

 public Person(String name) {
     this(name, 18); // 调用另一个构造方法Person(String, int)
 }

 public Person() {
     this("Unnamed"); // 调用另一个构造方法Person(String)
 }
}
```



## 封装/继承/多态的理解

2023/12/21 10:18  

> 基于万物皆对象这个概念,才有了 `封装` 这个概念,比如 🖥️电脑,其实就是 `显示器` 和 `主机` 构成的，显示器里面有很多复杂的零部件在工作，我们不需要关心，我们只需要关注显示器暴露出来的开关键和屏幕,只要我们按下开关键，屏幕就能显示出我们想要的东西。
> 所以显示器就是封装了里面「所有的零部件」,我们是无法修改的，只能通过开关键来访问显示器

> 比如有很多牌子的显示器，有横屏，有竖屏， 但是主机只有一个，主机只暴露出了一个端口，只要能满足这个端口，并且有开关键，有屏幕就能算是一个显示器，所以要把这个显示器抽象出来，让横屏 / 竖屏 `继承` 这个类

> `多态` 是根据继承来的，因为显示器继承了原始的显示器父类，然后都能显示，但是显示出来的质量是不一样的，这就是多态。

> `接口` 表示具有某种功能，比如显示器可以 显示, 也可以 发出声音，所以类可以通过实现接口有多种功能，但是只能继承一个父类,因为可以使用 `super` 访问父类，如果有多个父类的话，到底访问的是哪个呢?

> 但是继承也有坏处，坏处就是我自己私有的属性可能被子属性发现，比如有些显示器不想像外界暴露出过多自己的内部信息，所以有了关键字 `public`,`protected`,`private`
## 多态

多态是同一个行为具有多个不同表现形式或形态的能力。  

同一个对象在不同场景下表现出来的不同状态和形态

```java
class Person {
  testPerson(){
    System.out.println("Person")
  }
}

class Boy extends Person {
 testBoy(){
    System.out.println("boy")
  }
}
```

```java
Person p1 = new Person();
p1.testPerson(); 


Person p2 = new Boy();
p2.testPerson();  
p2.testBoy(); // 错误  // [!code error]
```
boy类相当于一个超人，平时是人类，有特殊需要可以变成超人    
person 类型对 boy 进行约束，只能当做人类来用

同一个 `show` 方法，根据不同的对象，有不同的表现形式

```java
public class Test {
 public static void main(String[] args) {
   show(new Cat());  // 以 Cat 对象调用 show 方法
   show(new Dog());  // 以 Dog 对象调用 show 方法
             
   Animal a = new Cat();  // 向上转型  
   a.eat();               // 调用的是 Cat 的 eat
   Cat c = (Cat)a;        // 向下转型  
   c.work();        // 调用的是 Cat 的 work
}  
         
 public static void show(Animal a)  {
   a.eat();  
     // 类型判断
     if (a instanceof Cat)  {  // 猫做的事情 
         Cat c = (Cat)a;  
         c.work();  
     } else if (a instanceof Dog) { // 狗做的事情 
         Dog c = (Dog)a;  
         c.work();  
     }  
 }  
}
 
abstract class Animal {  
  abstract void eat();  
}  
  
class Cat extends Animal {  
 public void eat() {  
    System.out.println("吃鱼");  
 }  
 public void work() {  
    System.out.println("抓老鼠");  
 }  
}  
  
class Dog extends Animal {  
 public void eat() {  
     System.out.println("吃骨头");  
 }  
 public void work() {  
     System.out.println("看家");  
 }  
}
```
## 封装
实现细节部分包装、隐藏起来的方法
封装可以被认为是一个保护屏障，防止该类的代码和数据被外部类定义的代码随机访问。  
封装最主要的功能在于我们能修改自己的实现代码，而不用修改那些调用我们代码的程序片段。  

```java
public class Person {
 private String name;
 private int age;
}
```

这段代码中，将 `name` 和 `age` 属性设置为私有的，只能本类才能访问，其他类都访问不了，如此就对信息进行了隐藏

```java
public class Person{
 private String name;
 private int age;
​
 public int getAge(){
   return age;
 }
​
 public String getName(){
   return name;
 }
​
 public void setAge(int age){
   this.age = age;
 }
​
 public void setName(String name){
   this.name = name;
 }
}
```
可以修改内部变量,外界是无法感知的，只要对外暴露的方法名不变即可

如果不封装，很有可能失去安全性，因为改变属性的值没有一个统一的入口，而且无法预测  

比如
```java
cat.height = 0
```
使用封装，可以保护属性的安全
```java
public void setHeight(int height){
  if(height>9){
    this.height = height;
  }
}
```
我们可以将属性标记为 `private`, 把 `getter` 和 `setter` 标记为 `public`

## 静态方法

针对具体对象的属性称之为成员属性  
针对具体对象的方法称之为成员方法  

静态方法只和类相关，不与具体对象有关    

成员方法可以访问静态属性，静态方法无法访问成员属性

*比如:鸟类能飞，而不是具体的某一只鸟能飞*


```java
static  public class Chinese {
 void w(){
    // 
     Chinese.eat(); //[!code hl]
     System.out.println("w");
 }

 static void eat(){
      // w 报错
      w() // [!code error]
     System.out.println("eat");
 }
}
```

## 枚举类

```java
enum Color {
   RED, 
   GREEN, 
   BLUE;
}
```
- values 返回枚举类中所有的值
- ordinal 返回枚举类中声明的顺序
```java
Color C = Color.BLUE;
Color[] arr = Color.values();

for (Color col : arr) {
   // 查看索引
   System.out.println(col.ordinal());
   System.out.println(col);
}
```
自定义类

```java
enum Season {
  //1、提供当前枚举类的对象的，多个对象之间用","隔开，末尾对象";"结束
  SPRING("春天", "春暖花开"),
  SUMMER("夏天", "夏日炎炎"),
  AUTUMN("秋天", "秋高气爽"),
  WINTER("冬天", "冰天雪地");
  //2、声明Season对象的属性
  private final String seasonName;
  private final String seasonDesc;

  //3、私有化类的构造器
  private Season(String seasonName, String seasonDesc) {
      this.seasonName = seasonName;
      this.seasonDesc = seasonDesc;
  }
}
```

```java
Season s = Season.AUTUMN;
// 秋高气爽
System.out.println(s.seasonDesc);
```

```java
enum InputUserNameEnum{

  USERNAME(1), // [!code hl]

  PHONE(2);   // [!code hl]

  private final Integer value;

  Integer value() {
    return value;
  }

  InputUserNameEnum(Integer value) {
    this.value = value;
  }
}
```
可以设置值，可以获取值
```java
InputUserNameEnum inputUserNameEnum = null;
inputUserNameEnum = InputUserNameEnum.PHONE;

System.out.println(inputUserNameEnum.value());
```


## 抽象类
人类要吃饭，中国人用筷子，欧美人用刀叉，只能抽象

:::tip
在 Java 中抽象类表示的是一种继承关系，一个类只能继承一个抽象类，而一个类却可以实现多个接口。  
如果一个类包含抽象方法，那么该类必须是抽象类。  
抽象类中不一定包含抽象方法，但是有抽象方法的类必定是抽象类
:::
```java
abstract class Person {
 void a(){
  System.out.println("a");
 }
 abstract void eat();
}
```

```java
class Chinese extends Person {
  @Override
  void eat() {
      a()
      System.out.println("eat");
  }
}
```

## 内部类
> js 没有内部类的说法
在类内部的类，就是内部类。
```java
class OuterClass {
   class InnterClass {
       void eat(){
           System.out.println("eat");
       }
   }
}
```
使用
```java
OuterClass x2 = new OuterClass();
OuterClass.InnterClass x3 = x2.new InnterClass();
x3.eat();
```

### 匿名内部类

```java
public class Hello { 

Runnable r = new Runnable() {
      public void run() {
          System.out.println("Hello"+w.getA());
      }
  };
r.run();
}
```

### 静态内部类

```java
public class Main {
    public static void main(String[] args) {
        Outer.StaticNested sn = new Outer.StaticNested();
        sn.hello();
    }
}

class Outer {
    private static String NAME = "OUTER";

    private String name;

    Outer(String name) {
        this.name = name;
    }

    static class StaticNested {
        void hello() {
            System.out.println("Hello, " + Outer.NAME);
        }
    }
}
```