---
title: Bean 的隔离控制
---

在既有 SpringMvcConfig 也有 SpringConfig 时，如何将 Bean 的管理分离是一个问题
例如我的包 com.snopzyz 下，有 config、controller、service、dao，那么我如果两个都写 ComponentScan("com.snopzyz") 的话则会造成 Bean 的重叠，做法如下

* 第一种做法：将组件扫描更精准，也就是调用 com.snopzyz.dao, com.snopzyz.service 这样的管理
* 第二种做法：采用 exclude 排除过滤器，方式如下
 
<p></p>
 
```java
// SpringConfig.java

@ComponentScan(
        value = "com.snopzyz",                  // 扫描 com.snopzyz 下的包，
        excludeFilters = @ComponentScan.Filter( // 除了
            type = FilterType.ANNOTATION,       // 以注解为
            classes = Controller.class          // Controller 的 Bean
        )                                       // 不扫描。
)                                               // 别的都扫描
public class SpringConfig {
}
```
 然后我们有了 SpringConfig ，我们 ServletContainersInitConfig 里面的另一个方法就用一样的方式将其加入管理器中

```java
// ServletContainersInitConfig.java

public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    ...
    @Override
    public WebApplicationContext createRootApplicationContext() {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringConfig.class);
        return ctx;
    }
    ...
}
```

这里有一个简化开发的语法糖，只需要继承 AbstractAnnotationConfigDispatcherServletInitializer ，便可直接提供类即可完成创建，不用创建别的实例对象再注册返回（但是作为学习还是推荐用第一种，可以帮助我们学习加载过程，这个只作为了解和后期开发）

```java
// ServletContainersInitConfig.java

public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{SpringConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringMvcConfig.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }
}
```