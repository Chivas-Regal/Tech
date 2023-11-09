---
title: 基本语法
---


## JSP 解析代码

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

## JSP 脚本

`<% ... %>`内部在`\_jspService()`函数内

## JSP 声明

`<%! ... %>`内部声明的在 <jsp文件名>\_jsp 类的成员中

## JSP 表达式

`<%= ... %>`表示在`\_jspService()`内进行输出

## JSP 指令

`<%@ ... %>`设置页面相关属性
示例：

* `<%@ page contentType="text/html;charset=UTF-8" %>`：指定当前页面的内容类型为HTML，并设置字符编码为UTF-8。
* `<%@ include file="header.jsp" %>`：包含名为header.jsp的JSP文件。
* `<%@ taglib uri="http://example.com/mytaglib" prefix="mytag" %>`：引入自定义标签库，URI指定标签库的位置，prefix指定标签库的前缀。

## JSP 行为

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

## JSP 隐含对象

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

## JSP 控制语句

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
