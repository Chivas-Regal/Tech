---
title: Java基本语法扫盲
---

## 访问修饰符

### 访问控制符

| 符号 | 作用 |
| --- | --- |
| $public$ | 共同的，支持跨类或跨包访问 |
| $protect$ | 保护的，支持同一包的类和任何子类访问 |
| $private$ | 私有的，仅可被同一类访问 |
| $default$ | 默认的，只允许同一包中进行访问 |

方法控制继承规则

* 父 ![](https://cdn.nlark.com/yuque/__latex/c0bd9424f7588878c84aa942a378c31c.svg)，子 ![](https://cdn.nlark.com/yuque/__latex/c0bd9424f7588878c84aa942a378c31c.svg)
* 父 ![](https://cdn.nlark.com/yuque/__latex/4ac723cf3eab5d87e5599f47e17f7cdc.svg)，子 ![](https://cdn.nlark.com/yuque/__latex/5235a50f127c0455340f8b87ed4b5eb4.svg)
* 父 ![](https://cdn.nlark.com/yuque/__latex/8d567fd1de30a271cee0e3eef35f16aa.svg)，子不能继承

### 非访问控制符

| 符号 | 作用 |
|-|-|
| $static$ | 静态内容均在程序开始的时候初始化或构建<ul><li>静态变量：一个类（包括子类）的所有实例共享一个变量</li><li>静态方法：不能使用类的非静态变量</li></ul>|
| $final$ | <ul><li>$final$ 变量：显式指定初始值，不可重新赋值</li><li>$final$方法：可以被子类继承但不能重写</li><li>$final$类：不可被继承</li></ul>|
| $abstract$ | <ul><li>抽象类：不能实例化</li><li>抽象方法：不能有，实现由子类完成</li></ul> |
| $synchronized$ | $synchronized$方法同一时间只可被一个线程访问 |
| $transient$ | 被$transient$修饰的成员属性变量可以不被序列化，反序列化时该变量值为$null$ |
| $volatile$ | 修饰的成员变量被访问时强制从共享内存中读取，修改也是写回到共享内存（任何时刻两个不同线程看到的总是变量同一个值） |

抽象方法：

```java
abstract class Base {
    protected int x;
    public abstract void ope ();
    public void print () {
        System.out.println("this.x = " + this.x);
    }
}
class Son extends Base {
    public void ope () {
        this.x = 10;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Son son = new Son();
        son.ope();
        son.print();
    }
}
```
使用案例，输出 `this.x = 10`

## 面向对象

### 继承


一个例子理解四种关键字 `interface`、`extends`、`implements`、`super`

```java
interface If1 {
    public void printInIf1 ();
}
interface If2 {
    public void print ();
}
class Super {
    public void printInIf1 () {
        System.out.println("Same name in If1::printInIf1()");
    }
    public void print () {
        System.out.println("This is Super's' print");
    }
}
class Sub extends Super implements If1, If2 {
    public void print () {
        super.print();
        System.out.println("This is Sub's print");
    }
}

/**
 * --------------- Console Output:
 * Same name in If1::printInIf1()
 * This is Super's' print
 * This is Sub's print
 */
public class Main {
    public static void main(String[] args) throws InsufficientFundsException {
        Sub sub = new Sub();
        sub.printInIf1();
        sub.print();
    }
}
```

这里就是一个子类`Sub`用`extends`继承了`Super`，用`implements`继承了两个`interface`接口类
`Sub`

* print()函数既是对父类`Super`的print()的重写，也是对接口类`If2`的print()的实现
* printInIf1()继承自父类`Super`并已有实现，所以也是变相对接口类`If1`的printInIf1()实现了

### 接口

接口是为了向上转型，防止子类中出现父类没有的方法，多态下父类没法调用
有了接口可以存在一个有很多声明方法的接口父类，子类分别实现所需的方法

## ... 和 ... 的不同

### StringBuilder 和 StringBuffer 的不同

两个都是做字符串修改，但有不同，应结合场景使用

StringBuilder 更快，但线程不安全
StringBuffer 慢，但是线程安全

### 重定向和转发的不同

* 重定向：`response.sendRediret(....html)`
* 转发：`request.getRequestDispatcher("....html").forward(request, response)`

**重定向**

1. 客户端向服务端发送请求，服务端响应让客户端重定向
2. 客户端向目标服务发送请求，得到服务端响应

地址栏改变，request 存储的数据会丢失

**转发**

1. 客户端向服务端请求转发（一次请求）
2. 服务端收到后转发给目标服务（页面），得到目标服务响应
3. 服务端再将得到的响应回送给客户端。

地址栏显示请求页面的地址，request 存储的数据可以保存



## JDBC

主要是注册驱动、打开链接、查询 这三步

```java
// JDBC 核心代码

public class jdbc {
    static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    static final String DB_URL = "jdbc:mysql://localhost:3306/student";

    static final String USER = "root";
    static final String PASS = "@Zhangyize020110";

    public static void main(String[] args) {
        Connection conn = null;
        Statement stmt = null;
        try {
            /* 注册 JDBC 驱动*/
            Class.forName(JDBC_DRIVER);
            /* 打开链接 */
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
            stmt = conn.createStatement();
            /* 查询，获取结果 */
            String sql = "SELECT Sno, Sname, Ssex, Sage, Sdept FROM student";
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                System.out.println(rs.getInt("Sno") + " " + rs.getString("Sname"));
            }
        } catch ....
        .....
```

## 反射

### instanceof

一种运算符，判断变量是否为某个接口/类的一个对象

```java
String str = "string";
boolean result = str instanceof String; // true
```

### 类信息

```java
import java.io.*;
import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.*;

class Person {
    private int age;
    public String name;

    public Person () {
        this.age = 0;
        this.name = null;
    }

    public Person (int age, String name) {
        this.age = age;
        this.name = name;
    }
    private void showAge () {
        System.out.println("I'm " + age + " years old");
    }
    public void showName () {
        System.out.println("My name is " + name);
    }
}

public class Main {
    public static void main(String[] args) throws NoSuchMethodException, NoSuchFieldException, InstantiationException, IllegalAccessException {
        Person person1 = new Person(19, "曾显慧");

        { // 获取 Class
            Class c1 = person1.getClass();
            Class c2 = Person.class;
            try {
                Class c3 = Class.forName("Person");
            } catch (ClassNotFoundException e) {
                System.out.println(e.toString());
            }
            System.out.println("\n--------------\nGetting class ...");
            System.out.println(c1);
        }
        Class _class = Person.class;

        { // 获取类名
            String className = _class.getName();
            System.out.println("\n--------------\nGetting className ...");
            System.out.println(className);
        }

        { // 获取类的 public 属性
            System.out.println("\n--------------\nGetting class's public fields ...");
            for (Field field : _class.getFields()) {
                System.out.println(field.getName());
            }
        }

        { // 获取类的 all 属性
            System.out.println("\n--------------\nGetting class's all fields ...");
            for (Field field : _class.getDeclaredFields()) {
                System.out.println(field.getName());
            }
        }

        { // 获取类的 public 方法
            System.out.println("\n--------------\nGetting class's public methods ...");
            for (Method method : _class.getMethods()) {
                System.out.println(method.getName());
            }
        }

        { // 获取类的 all 方法
            System.out.println("\n--------------\nGetting class's all methods ...");
            for (Method method : _class.getDeclaredMethods()) {
                System.out.println(method.getName());
            }
        }

        {
            System.out.println("\n--------------\nGetting person's name and age ...");
            //获得指定的属性
            Field fname = _class.getField("name");
            //获得指定的私有属性
            Field fage = _class.getDeclaredField("age");
            System.out.println(fname);
            //启用和禁用访问安全检查的开关，值为 true，则表示反射的对象在使用时应该取消 java 语言的访问检查；反之不取消
            fage.setAccessible(true);
            System.out.println(fage);

            System.out.println("\n--------------\nGetting new person and setting age ...");
            // 创建此类对象
            Object person2 = _class.newInstance();
            // 设置 person2 的 age 属性为 21
            fage.set(person2, 21);
            System.out.println(fage.get(person2));
        }

        {
            System.out.println("\n--------------\nGetting person's constructor ...");
            for (Constructor constructor : _class.getConstructors()) {
                System.out.println(constructor);
            }
        }
    }
}

/*
Console Output:

--------------
Getting class ...
class Person

--------------
Getting className ...
Person

--------------
Getting class's public fields ...
name

--------------
Getting class's all fields ...
age
name

--------------
Getting class's public methods ...
showName
wait
wait
wait
equals
toString
hashCode
getClass
notify
notifyAll

--------------
Getting class's all methods ...
showAge
showName

--------------
Getting person's name and age ...
public java.lang.String Person.name
private int Person.age

--------------
Getting new person and setting age ...
21

--------------
Getting person's constructor ...
public Person()
public Person(int,java.lang.String)
*/
```

### 使用

#### IOC:新类+配置文件修改运行时调用的类

**控制反转：将对象的创建控制权由程序转移到外部**

已有`Student`类

```java
// Student.java

public class Student {
    public Student () {
        System.out.println("is constructor()");
    }
    public void show () {
        System.out.println("is show()");
    }
}
```
也有配置文件`config.txt`

```txt
#config.txt

className = Student
methodName = show
```
现在要调用配置文件里面的类和函数，直接通过“字符串名”即可获取到包下面的`Class`以及其`Method`

```java
// Main.java

static Properties properties = new Properties();
public static void main(String[] args) throws IOException, ClassNotFoundException, NoSuchMethodException, InvocationTargetException, InstantiationException, IllegalAccessException {
    /* 加载 config.txt 为了之后的KV解析 */
    properties.load(new FileReader("config.txt"));

    /* 获取 config.txt 内的类 */
    Class<?> configClass = Class.forName(getValue("className"));
    /* 获取 config.txt 内属于 configClass 的函数 */
    Method configMethod = configClass.getMethod(getValue("methodName"));
    /* 执行函数 */
    configMethod.invoke(configClass.getConstructor().newInstance());
}
/* 获取 config.txt 内 key 为 (String)key 的 value */
public static String getValue (String key) throws IOException {
    return properties.getProperty(key);
}
/*
-------- Output
is constructor()
is show()
*/
```
这么做是为了更新的简化

比如我现在要更新`Main`里面做的事，成为一个爱学习的好学生
先发给用户一个新类`Student1.java`

```java
// Student1.java

public class Student1 {
    public Student1 () {
        System.out.println("I'm in school");
    }
    public void show () {
        System.out.println("I'm learning");
    }
}
```
然后修改`config.txt`指向这个新类

```txt
#config.txt

className = Student1
methodName = show
```
再次运行`Main.java`输出

```
I'm in school
I'm learning
```
这样就完成了由配置文件完成的类实例化与方法调用

#### 越过泛型检查

泛型检查在编译期，所以反射可以越过，比如这里可以向`ArrayList<String>`添加`Integer`变量

```java
ArrayList<String> strList = new ArrayList<>();
strList.add("aaa");
strList.add("bbb");

Class<?> listClass = strList.getClass();
Method method = listClass.getMethod("add", Object.class);
method.invoke(strList, 100);

for (Object obj : strList) {
    System.out.println(obj);
}
/*
-------------- Output:
aaa
bbb
100
*/
```
需要警惕的是，这种行为虽然可以让我们的容器里存放任意类型
但是每次要操作里面的元素必须要检查一下是什么类型，不然可能会导致`Integer+String`的行为出现

## Servlet

编写一个`Servlet`类，主要是用来响应登录表单的`post`请求

```java
// LoginServlet.java

package com.zyz.web;

public class LoginServlet extends HttpServlet {
    @Override
    public void init(ServletConfig servletConfig) throws ServletException {
        System.out.println("LoginServlet 初始化");
    }

    // get 请求的响应：强制用 login.html 内的 Post 进行通信
    @Override
    protected void doGet (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=utf-8");
        PrintWriter writer = response.getWriter();
        writer.println("<script>alert('请通过表单进行登录');location.href='/login.html'</script>");
    }

    // post 请求的响应
    @Override
    protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        /* 需要接受 username, password */
        request.setCharacterEncoding("utf-8");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        /* 因为示例，所以不加 JDBC ，使用单一账密 */
        if ("zyz".equals(username) && "123".equals(password)) {
            /* 账密正确，向 welcome.jsp 发送账密并跳转 */
            request.setAttribute("username", username);
            request.setAttribute("password", password);
            request.getRequestDispatcher("welcome.jsp").forward(request, response);
        } else {
            /* 账密错误，跳回 login 界面重新填写 */
            request.getRequestDispatcher("login.html").forward(request, response);
        }
    }

    @Override
    public void destroy() {
        System.out.println("LoginServlet 销毁");
    }
}
```
要用到这个`Servlet`，就要在`/web/WEB-INF/web.xml`下注册

```xml
<!-- web.xml -->
...
    <servlet>
        <servlet-name>login_servlet</servlet-name>
        <servlet-class>com.zyz.web.LoginServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>login_servlet</servlet-name>

      	<!--标签配置访问地址，前端将数据发到这里
      			通过 servlet-map 找到，得知应使用 login_server
      			在 <servlet> 内找到 name 为 login_server 的 servlet，使用其下面标注的 class
      	-->
        <url-pattern>/userlogin</url-pattern>
    </servlet-mapping>
...
```

然后根据我们`Servlet`内成功登录应转发到`welcome.jsp`，编写`welcome.jsp`

```jsp
<!-- welcome.jsp -->
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String username = new String((request.getParameter("username")).getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
    String password = new String((request.getParameter("password")).getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
%>
<html>
<head>
    <title>登录成功页</title>
</head>
<body>
    <h1>登陆成功</h1>
    欢迎 <%=username%> 登录，您的密码是 <%=password%>
</body>
</html>
```

## 网络编程

### 服务端

* 创建`ServerSocket`监听套接字（绑定端口号）
* 设置超时时间
* 创建连接套接字`Socket`，从`ServerSocket.accept()`中获取
* 开启`DataInputStream`和`DataOutputStream`进行收发信息

### 客户端

* 创建套接字`Socket`绑定`ip`和`port`
* 开启`DataInputStream`和`DataOutputStream`进行收发信息

