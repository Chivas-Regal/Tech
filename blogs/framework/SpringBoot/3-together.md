---
title: SpringBoot 整合第三方资源
---

## 整合 junit

在依赖中只保留这两个

```xml
<!-- pom.xml -->

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

然后这里写好了 `/service/UserService.java` 和 `/service/impl/UserServiceImpl.java`  

```java
// UserService.java

public interface UserService {
    public void save ();
}

```

```java
// UserServiceImpl.java

@Service
public class UserServiceImpl implements UserService {

    @Override
    public void save () {
        System.out.println("service save ...");
    }
}
```

在 `/test` 下的某个包的测试类，测试 `main` 中对应包下的配置类 `SpringbootDemoApplication` 所在的包以及子包下所有的类      

比如现在已有的 `com/snopzyz/SpringbootDemoAplicationTest.java`   
定位到 `/com/snopzyz` 下的配置类 `com.snopzyz.SpringbootDemoApplicaiton` ，所在包为 `com.snopzyz`  
那么测试类只可以测试 `com.snopzyz` 下的类  

```java
// SpringbootDemoApplicationTests.java

@SpringBootTest
class SpringbootDemoApplicationTests {

    @Autowired
    private UserService userService;

    @Test
    void saveTest() {
        userService.save();
    }

}
```

若这个测试类放在了 `/com.snopzyz1` 的位置，那么它可以用注解定位到 SpringbootDemoApplication 并测试它所在包下面的类（不常用）  

```java
package com.snopzyz1;

@SpringBootTest(classes = SpringbootDemoApplication.class)
class SpringbootDemoApplicationTests {
...
```

## 整合 SSM

虽然是整合 SSM 但是 Spring 和 SpringMVC 在之前的使用中都已经有了，所以这里重点只有 Mybatis  

项目创建时勾选这两个依赖

![20231003171705](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231003171705.png)

由于 SpringBoot 已经整合好了 Mybatis 的配置数据连接，所以我们需要做的只有两件事：  
- 设置连接 mybatis 的 datasource
- 编写被代理实现的接口类 BookDao

**datasource** 只在 application.yml 中设置就行了  

```yml
# application.yml

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/learn_info
    username: 'root'
    password: 'xxxxxxxxxxxxx'
```

::: tip druid 的使用 

先导入 druid 坐标

```xml
<!-- pom.xml -->

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.16</version>
</dependency>
```
在配置文件中将 type 设置为 DruidDataSource

```yml
# application.yml

spring:
  datasource:
    ...
    type: com.alibaba.druid.pool.DruidDataSource
```

这样就行了

:::

**代理实现接口**的编写和之前基本一致  
先来一个 domain 类  

```java
// Book.java
public class Book {

    private int id;
    private String name;
    private String type;
    private String description;
    ...
}
```

然后是我们的 `Dao` 接口，这里需要加一个 `@Mapper` 来告诉 SpringBoot 这个接口要做代理实现    

```java
// BookDao.java
@Mapper
public interface BookDao {

    @Select("SELECT * FROM tbl_book WHERE id=#{id}")
    public Book findById (int id);
}
```

最后拿测试跑一下代码看看结果  

```java
@SpringBootTest
class SpringBootSsmApplicationTests {

    @Autowired
    private BookDao bookDao;

    @Test
    void findByIdTest () {
        System.out.println(bookDao.findById(2));
    }

}
```

![20231003175013](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231003175013.png)

运行成功

::: danger 2.4.2 版本及以前 MySql 的时区报错

将 url 后面加上 `?serverTimezone=UTC`  
也就是  
  
```yml
spring:
  datasource:
    ...
    url: jdbc:mysql://localhost:3306/learn_info?serverTimezone=UTC
    ...
```

:::

## 整合前端静态资源

做的和我们 [SpringMVC+SSM+前端](./SpringMVC.html#ssm-前端加入) 是一样的效果  
但是 config 包全都不用写了  
页面静态访问资源控制按框架目录格式定好了，静态资源放在 `resources/static` 下  
然后在 com.snopzyz.dao.BookDao 上面加一个我们上面说的 `@Mapper` 就行了  
这是目录结构  

 ![20231003210752](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231003210752.png)