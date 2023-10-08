---
title: 注解化编程
---

## 注解定义bean

* 使用@Component定义bean

<p></p>

```java
@Component("bookDao")
public class BookDaoImpl implements BookDao {
}
@Component
public class BookServiceImpl implements BookService {
}
```
* 核心配置文件中通过组件扫描加载bean

<p></p>

```xml
<context:component-scan base-package="com.snopzyz"/>
```
* Spring提供三个衍生注解，和@Component作用一样但是可以用来做开发方向的区分
+ @Controller：用于表现层bean定义
+ @Service：用于业务层bean定义
+ @Repository：用于数据层bean定义

<p></p>

```java
@Repository("bookDao")
public class BookDaoImpl implements BookDao {
}
@Service
public class BookServiceImpl implements BookService {
}
```

## 纯注解开发配置

纯注解就是取消`xml`配置文件，换成了用「类+注解」表示配置  
如下面的`xml`文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
            http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context
            http://www.springframework.org/schema/context/spring-context.xsd
       "
>
    <context:component-scan base-package="com.snopzyz"/>
</beans>
```
将外壳转换成类的注解`@Configuration`，将里面的组件扫描标签换成注解`@ComponentScan({"com.snopzyz.dao", "com.snopzyz.service"})`（这里只是表达一下，ComponentScan的参数是字符串数组）  
那么上面的`xml`就可以替换成我们自己写的类  

```java
// SpringConfig.java

package com.snopzyz.config;

import ...;

@Configuration
@ComponentScan({"com.snopzyz.dao", "com.snopzyz.service"})
public class SpringConfig {
}
```
在运行程序调用时只需要将声明改成如下形式，别的都不用变

```java
ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
```
## bean注解配置

之前我们讲bean的生命周期和作用域的设置，这里也可以用注解完成

* Scope 表示了是单例还是多例
* PostConstruct 表示的是构造之后执行的内容
* PreDestory 表示的是销毁之前执行的内容

<p></p>

```java
@Repository("bookDao")
@Scope("singleton")
public class BookDaoImpl implements BookDao {
    @Override
    public void save() {
        System.out.println("book dao save ...");
    }

    @PostConstruct
    public void init () {
        System.out.println("init ...");
    }
    @PreDestroy
    public void destory () {
        System.out.println("destory ...");
    }
}
```
## 依赖注入

**非基本类型**使用自动装配`@Autowaired`+bean名称查询`@Qualifier(...)`，之前我们在`SpringConfig`类写过ComponentScan，那么这里名称查询就是从扫描的bean组件里面找的，具体注入方式如下

```java
// BookServiceImpl.java

public class BookServiceImpl implements BookService {
    @Autowired
    @Qualifier("bookDao")
    private BookDao bookDao;
...
```
基本类型使用`@Value()`设置

```java
// BookServiceImpl.java

...
	@Value("good")
    private String name;
```
这里值的内容可以换成我们 .properties 配置文件内容，这里已有一份配置文件 serviceInfo.properties

```properties
serviceName = snopzyz
```
需要先在`SpringConfig`文件用`@PropertySource`注册才可以使用

```java
// SpringConfig.java

...
@PropertySource("serviceInfo.properties")
public class SpringConfig {
}
```
然后我们上面的`name`就可以这样给出其初始`Value`

```java
// BookServiceImpl.java

...
	@Value("${serviceName}")
    private String name;
```

## 第三方bean管理

这里拿druid做演示，建议再开一个配置类，并对要返回bean的方法做`@Bean`注解

```java
// JdbcConfig.java

package com.snopzyz.config;

import ...;

public class JdbcConfig {
    @Bean("druidSource")
    public DataSource dataSource () {
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName("com.mysql.jdbc.Driver");
        ds.setUrl("jdbc:mysql://localhost:3306/student");
        ds.setUsername("root");
        ds.setPassword("@Zhangyize020110");
        return ds;
    }
}
```
然后在主配置文件中拿`@Import`导入这个类即可

```java
// SpringConfig.java

@Import(JdbcConfig.class)
public class SpringConfig {
}
```
这样我们在主程序中想要调用这个bean的时候就可以根据这个bean的名字直接调用

```java
// App.java

...
	DataSource dataSource = (DataSource) ctx.getBean("druidSource");
...
```

## 第三方bean依赖注入

**基本类型**通过成员变量完成
**引用类型**通过参数传递完成（放在参数里，会按类型自动装配）

```java
// JdbcConfig.java

package com.snopzyz.config;

import ...;

public class JdbcConfig {

    @Value("com.mysql.jdbc.Driver")
    private String driver;
    @Value("jdbc:mysql://localhost:3306/student")
    private String url;
    @Value("root")
    private String userName;
    @Value("@Zhangyize020110")
    private String password;

    @Bean("druidSource")
    public DataSource dataSource (BookDao bookDao) {
        System.out.println(bookDao);
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName(driver);
        ds.setUrl(url);
        ds.setUsername(userName);
        ds.setPassword(password);
        return ds;
    }
}

```