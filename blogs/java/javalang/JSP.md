---
title: JSP 技术
---

JSP 语法
======

JSP 解析代码
--------

```jsp
<!-- 待转 JSP 代码 -->

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
  <html>
    <head>
      <title>Title</title>
    </head>
    <body>
      <% int x=5; %>
      <%! int x=7; %>
      <%! int getX(){return x;}%>
      <%=x%><br/>
      <%=getX()%>
    </body>
</html>
```
输出内容为：`5 7`

```java
// 转换后的 Java 代码

public final class test_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent,
                 org.apache.jasper.runtime.JspSourceImports {

 int x=7;
 int getX(){return x;}

 /*忽略与这个例子无关的代码*/

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
      throws java.io.IOException, javax.servlet.ServletException {

     /*忽略与这个例子无关的代码*/

      out.write("\r\n");
      out.write("<html>\r\n");
      out.write("<head>\r\n");
      out.write("    <title>Title</title>\r\n");
      out.write("</head>\r\n");
      out.write("<body>\r\n");
 int x=5;
      out.write('\r');
      out.write('\n');
      out.write('\r');
      out.write('\n');
      out.write('\r');
      out.write('\n');
      out.print(x);
      out.write("<br/>\r\n");
      out.print(getX());
      out.write("\r\n");
      out.write("</body>\r\n");
      out.write("</html>\r\n");

      /*忽略与这个例子无关的代码*/

  }
}
```
根据上面的示例可以对应出下面的语法含义

JSP 脚本
------

`<% ... %>`内部在`\_jspService()`函数内

JSP 声明
------

`<%! ... %>`内部声明的在 <jsp文件名>\_jsp 类的成员中

JSP 表达式
-------

`<%= ... %>`表示在`\_jspService()`内进行输出

JSP 指令
------

`<%@ ... %>`设置页面相关属性
示例：

* `<%@ page contentType="text/html;charset=UTF-8" %>`：指定当前页面的内容类型为HTML，并设置字符编码为UTF-8。
* `<%@ include file="header.jsp" %>`：包含名为header.jsp的JSP文件。
* `<%@ taglib uri="http://example.com/mytaglib" prefix="mytag" %>`：引入自定义标签库，URI指定标签库的位置，prefix指定标签库的前缀。

JSP 行为
------

|  |  |
| --- | --- |
| **语法** | **描述** |
| jsp:include | 用于在当前页面中包含静态或动态资源 |
| jsp:useBean | 寻找和初始化一个JavaBean组件 |
| jsp:setProperty | 设置 JavaBean组件的值 |
| jsp:getProperty | 将 JavaBean组件的值插入到 output中 |
| jsp:forward | 从一个JSP文件向另一个文件传递一个包含用户请求的request对象 |
| jsp:plugin | 用于在生成的HTML页面中包含Applet和JavaBean对象 |
| jsp:element | 动态创建一个XML元素 |
| jsp:attribute | 定义动态创建的XML元素的属性 |
| jsp:body | 定义动态创建的XML元素的主体 |
| jsp:text | 用于封装模板数据 |

JSP 隐含对象
--------

|  |  |
| --- | --- |
| **对象** | **描述** |
| request | **HttpServletRequest**类的实例 |
| response | **HttpServletResponse**类的实例 |
| out | **PrintWriter**类的实例，用于把结果输出至网页上 |
| session | **HttpSession**类的实例 |
| application | **ServletContext**类的实例，与应用上下文有关 |
| config | **ServletConfig**类的实例 |
| pageContext | **PageContext**类的实例，提供对JSP页面所有对象以及命名空间的访问 |
| page | 类似于Java类中的this关键字 |
| exception | **exception** 类的对象，代表发生错误的 JSP 页面中对应的异常对象 |

JSP 控制语句
--------

```java
// 分支、循环实例

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
    <head>
        <title>$Title$</title>
    </head>
    <body>
        <p>这是每一周的第<%=day%>天</p>
        <!-- 分支语句 -->
        <%! int day = 1; %>
        <h1>IF...ELSE</h1>
        <% if (day <= 5) { %>
            <p>工作日</p>
        <% } else { %>
            <p>休息日</p>
        <% } %>

        <!-- Switch 分支语句 -->
        <h1>SWITCH</h1>
        <%
            switch (day) {
                case 1:
                    out.println("星期一");
                    break;
                case 2:
                    out.println("星期二");
                    break;
                case 3:
                    out.println("星期三");
                    break;
                case 4:
                    out.println("星期四");
                    break;
                case 5:
                    out.println("星期五");
                    break;
                case 6:
                    out.println("星期六");
                    break;
                default:
                    out.println("星期天");
            }
        %>

        <!-- 循环语句 -->
        <h1>FOR</h1>
        <% for (int headSize = 2; headSize <= 4; headSize ++) { %>
            <h<%=headSize%>><%=headSize%>号标题</h<%=headSize%>>
        <% } %>
        <h1> WHILE </h1>
        <% int headSize = 2; %>
        <% while (headSize <= 4) { %>
            <h<%=headSize%>><%=headSize%>号标题</h<%=headSize%>>
            <% headSize ++; %>
        <% } %>
    </body>
</html>
```
输出结果

![20230928194054](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928194054.png)

JavaBean
========

创建 Bean
-------

在`/src`下创建包`com.chivasregal.main`，然后编写`Bean`

![20230928194101](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928194101.png)

```java
// Animal.java

package com.chivasregal.main;

public class Animal {
    private int legs;
    private String sound;

    public Animal() {
    }

    public void setLegs(int var1) {
        this.legs = var1;
    }

    public void setSound(String var1) {
        this.sound = var1;
    }

    public int getLegs() {
        return this.legs;
    }

    public String getSound() {
        return this.sound;
    }
}

```
使用 Bean
-------

### 变量定义

**模板：**`<jsp:useBean id="<变量名>" class="<绝对类位置>"/>`

**示例：**`<jsp:useBean id="animal" class="com.chivasregal.main.Animal"/>`

**解释：**`Animal animal = new Animal();`

### 变量 set 属性

**模板：**`<jsp:setProperty name="<变量名>" property="<待set属性>" value="<set后的值>"/>`

**示例：**`<jsp:setProperty name="animal" property="legs" value="2"/>`

**解释：**`animal.setLegs(2)`

### 变量 get 属性

**模板：**`<jsp:getProperty name="<变量名>" property="<待get属性>"/>`

**示例：**`<jsp:getProperty name="animal" property="legs"/>`

**解释：**`animal.getLegs()`

示例
--

根据上面的 Bean ，写出下面`.jsp`代码

```html
<!-- bean-use.jsp -->

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>JavaBean使用实例</title>
</head>
<body>
    <h1>JavaBean使用实例</h1>
    <jsp:useBean id="animal" class="com.chivasregal.main.Animal"/>
    <jsp:setProperty name="animal" property="legs" value="2"/>
    <jsp:setProperty name="animal" property="sound" value="哼哼哼哼"/>
    <p>输出信息...</p>
    <p>我是zxh！我有 <jsp:getProperty name="animal" property="legs"/> 条腿，我叫起来“<jsp:getProperty name="animal" property="sound"/>”的，我是小猪！</p>
</body>
</html>
```
打开网页结果如下

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1693902448541-500d46ca-a178-48c9-9c26-ae76ff90c50c.png)

表单数据传输 GET/POST
===============

发送端`<form>`标签

* `page`属性指定发送和跳转的目标页面
* `method`属性指定发送的方法（GET/POST）

比如有一份表单

```html
...
				<form action="get_main.jsp" method="GET">
            名字：<input type="text" name="name"/>
            <br>
            腿数：<input type="text" name="legs"/>
            <br>
            声音：<input type="text" name="voice"/>
            <br>
            物种：<input type="text" name="type"/>
            <br>
            <input type="submit" value="提交"/>
        </form>
...
```
就表示该表单在提交时向`get\_main.jsp`发送数据并完成跳转，方法为`GET`（如果`...method="POST"`说明方法为`POST`）
然后表单需要填写并发送四个数据 name、legs、voice、type

接收端主要是通过方法`request.getParameter(...)`来实现接收的
对于上面表单，`get\_main.jsp`内可以嵌入这样的`java`代码

```html
...
	<%
      String name = request.getParameter("name");
      String legs = request.getParameter("legs");
      String voice = request.getParameter("voice");
      String type = request.getParameter("type");
    %>
...
```
就可以完成了数据的接收

当然如果是`POST`发送为了防止中文乱码要写成如下形式

```java
String name = new String((request.getParameter("name")).getBytes("ISO-8859-1"), "UTF-8");
```
过滤器
===

功能编写
----

过滤器一般根据页面信息、uri等来进行页面禁访或强制跳转，典型例子如：加密文章、登录页面

在`/src/com.chivasregal.filter/`下创建`LoginFilter.java`

```java
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter("/LoginFilter")
public class LoginFilter implements Filter {
    public LoginFilter () {
        System.out.println("实例化Filter");
    }
    public void destroy () {
        System.out.println("销毁Filter");
    }
    public void doFilter (ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
        System.out.println("进入Filter");
        HttpServletRequest httpServletRequest = (HttpServletRequest)request;
        HttpServletResponse httpServletResponse = (HttpServletResponse)response;
        String uri = httpServletRequest.getRequestURI();
        if (uri.contains("get") || uri.contains("post"))
            chain.doFilter(request, response);
        else {
            httpServletResponse.sendRedirect(httpServletRequest.getContextPath() + "/form-msg/post.html");
        }
    }

    public void init (FilterConfig fConfig) throws ServletException {
        System.out.println("初始化Filter");
    }
}
```
这四个函数均为生命周期函数，这四个实现后的抽象方法将被顺序调度
主过滤函数为`doFilter()`，它通过内置参数`chain`来链式对下一个页面进行过滤
内部搭配`HttpServletResponse.sendRedirect`可以完成对页面的重定向（进入`login`页面）

注册使用
----

上面第四行使用了`@WebFilter("/LoginFilter")`，我们在`/web/WEB-INF/web.xml`里面加入

```html
...
<!--    过滤器：未登录的 Login 页面跳转 + 别的所有页面隐藏 -->
    <filter>
        <filter-name>login_filter</filter-name>
        <filter-class>com.chivasregal.filter.LoginFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>login_filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
</web-app>
```
这个实例是复用了之前表单传输演示，运行起来后会发现所有`uri`中不含`post/get`的页面跳转`/form-msg/post.html`，然后提交表单

Cookie
======

Cookie是一种键值对组，在`response`内

一个简单登录页面：

```html
<!-- Login.html -->

...
		<form action="main.jsp" method="post">
        username: <input type="text" name="username"/>
        <br>
        password: <input type="text" name="password"/>
        <br>
      <input type="submit" value="Login">
    </form>
...
```
和信息接收与 Cookie 填入

```jsp
<!-- main.jsp -->

<%@ page import="java.net.URLDecoder" %><%--
  Created by IntelliJ IDEA.
  User: snopzyz
  Date: 2023/9/6
  Time: 08:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String username = new String((request.getParameter("username")).getBytes("ISO-8859-1"), "UTF-8");
    String password = new String((request.getParameter("password")).getBytes("ISO-8859-1"), "UTF-8");
    Cookie un_cookie = new Cookie("username", username);
    Cookie pw_cookie = new Cookie("password", password);
    /* 设置过期时间 */
    un_cookie.setMaxAge(60 * 60 * 24);
    pw_cookie.setMaxAge(60 * 60 * 24);
    /* 将这两对 Cookie 加入请求头中 */
    response.addCookie(un_cookie);
    response.addCookie(pw_cookie);
%>
<html>
<head>
    <title>Title</title>
</head>
<body>
    <h1>设置 Cookie</h1>
    <ul>
        <li><p><b>username:</b>
            <%=username%>
        </p></li>
        <li><p><b>password:</b>
            <%=password%>
        </p></li>
    </ul>

    <%
        Cookie cookie = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            out.println("<h1>查找Cookie的KV</h1>");
            for (int i = 0; i < cookies.length; i ++) {
                cookie = cookies[i];
                out.println("参数名：" + cookie.getName() + " <br>");
                out.println("参数值：" + URLDecoder.decode(cookie.getValue(), "utf-8") + " <br>");
                out.println("--------------------------------------------------<br>");
            }
        } else {
            out.println("<h1>没有发现Cookie</h1>");
        }
    %>
</body>
</html>

```
Session
=======

所有浏览器都支持的是 Session，而 jsp 隐含对象里面有一个全局的 session，可以调用`.setAttribute(String key, T value);` 来完成键值对的填入
并通过`.getAttribute(String key)`进行提取
用`.setMaxInactiveInterval(int sec)`设置过期时间

比如这里有一个登录页面

```html
<!-- login.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>用户登录</title>
</head>
<body>
    <!-- 主要是填写 uname 和 upwd 后传递给 session.jsp -->
    <form action="session.jsp" method="post">
        <table border="1px" cellpadding="0" cellspacing="0">
            <tr><td colspan="2" align="center">用户登录</td></tr>
            <tr>
                <td>用户名：</td>
                <td><input type="text" name="uname"/></td>
            </tr>
            <tr>
                <td>密码：</td>
                <td><input type="text" name="upwd"/></td>
            </tr>
            <tr><td colspan="2" align="center"><input type="submit" value="登录"/></td></tr>
        </table>
    </form>
</body>
</html>
```
然后`session.jsp`是一个中间处理文件，主要是将`uname`和`upwd`接收并放入session中（后期也可以实现账密判断）

```jsp
<!-- session.jsp -->

...
	<%
        session.setMaxInactiveInterval(90);
        String username = new String((request.getParameter("uname")).getBytes("ISO-8859-1"), "UTF-8");
        String password = new String((request.getParameter("upwd")).getBytes("ISO-8859-1"), "UTF-8");
        session.setAttribute("username", username);
        session.setAttribute("password", password);
        response.sendRedirect("message.jsp"); // 跳转到 message.jsp
    %>
...
```
跳转到的`message.jsp`就是用来展示用户信息了，直接提取全局的session即可

```jsp
<!-- message.jsp -->

...
    <%
      out.println("session_id:" + session.getId() + "<br>");
      out.println("username:" + session.getAttribute("username") + "<br>");
      out.println("password:" + session.getAttribute("password") + "<br>");
    %>
...
```
这样在`login.html`输入账密，会在`message.jsp`内展示，如果![](https://cdn.nlark.com/yuque/__latex/becf2ee11f0ea47116617db940197004.svg)秒不刷新它自己就重置了

