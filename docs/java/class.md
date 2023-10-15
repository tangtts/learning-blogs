
# class

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

## 静态方法

针对具体对象的属性称之为成员属性  
针对具体对象的方法称之为成员方法  

静态方法只和类相关，不与具体对象有关

*比如:鸟类能飞，而不是具体的某一只鸟能飞*

## 传值

