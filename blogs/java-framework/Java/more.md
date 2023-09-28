---
title: 语法进阶
---

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

#### IOC: 新类+配置文件修改运行时调用的类

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

