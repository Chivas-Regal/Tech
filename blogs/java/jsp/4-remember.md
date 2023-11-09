---
title: HTTP 记忆化
---

## Cookie

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

## Session

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

