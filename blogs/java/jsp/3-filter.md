---
title: 过滤器
---

## 功能编写

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

## 注册使用

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