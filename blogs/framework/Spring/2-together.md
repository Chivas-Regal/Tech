---
title: Spring 整合第三方资源
---

## spring整合mybatis

这里着重就是用spring的纯注解将mybatis的配置文件也化为注解并导入
首先是项目配置文件里面的坐标

```xml
<!-- pom.xml -->

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.2.10.RELEASE</version>
</dependency>

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.16</version>
</dependency>

<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.6</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.21</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.2.10.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>1.3.0</version>
</dependency>
```
然后是 Spring 注解配置类那一套

```java
// SpringConfig.java

@Configuration
@ComponentScan("com.snopzyz")
@PropertySource("classpath:jdbc.properties")
public class SpringConfig {
}
```
这些完成之后我们分析一下 Mybatis 配置文件和使用方式 [参考这里](https://www.yuque.com/chivasregal/vhwl6i/bqogv3rw7afm0owo)

```xml
<!-- mybatis-config.xml -->

<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>

    <properties resource="jdbc.properties"/>

    <environments default="mysql">
        <environment id="mysql">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <package name="com.snopzyz.dao"/>
    </mappers>
</configuration>
```
这里`<configuration>`标签内的部分是大头

* `<properties>`我们已经在 SpringConfig.java 中导入过了
* `<environments>`中主要是建立JDBC连接数据库的，我们可以额外写一个 **JdbcConfig.java** 类生成druidDataSource 连接池
* `<mappers>`建立 sql 语句映射，我们额外写一个 **MybatisConfig.java** 生成 Mapper... 对象

使用部分，为了获取到 SqlSession 我们要有 SqlSessionFactory 来取出会话  
其中在 **MybatisConfig.java** 中利用 SqlSessoinFactoryBean 对象加载 druid 连接池返回后，Spring容器会自动帮我们造出 SqlSession  
而 druid 连接池我们可以直接通过 JdbcConfig 的引用类型注入方法获取  
  
有了思路，下面是代码设计  

```java
// JdbcConfig.java

package com.snopzyz.config;

import ...;

public class JdbcConfig {

    @Value("${jdbc.driver}")
    private String driver;
    @Value("${jdbc.url}")
    private String url;
    @Value("${jdbc.username}")
    private String username;
    @Value("${jdbc.password}")
    private String password;

    /* 设置 druid 信息，返回 druid 连接池 */
    @Bean
    public DruidDataSource dataSource () {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setDriverClassName(driver);
        druidDataSource.setUrl(url);
        druidDataSource.setUsername(username);
        druidDataSource.setPassword(password);
        return druidDataSource;
    }
}
```

```java
// MybatisConfig.java

package com.snopzyz.config;

import ...;

public class MybatisConfig {

    /* 参数自动装配 JdbcConfig.java 内返回 DataSource 的函数，获取 druid 信息
       并返回 SqlSessionFactoryBean 对象给 IoC 容器，生成 SqlSession         */
    @Bean
    public SqlSessionFactoryBean sqlSessionFactoryBean (DataSource dataSource) {
        SqlSessionFactoryBean ssf = new SqlSessionFactoryBean();
        ssf.setDataSource(dataSource);
        return ssf;
    }

    /* 利用生成的 SqlSessoin 通过 Mapper 扫描获取 package 下的所有 Mapper */
    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer () {
        MapperScannerConfigurer msc = new MapperScannerConfigurer();
        msc.setBasePackage("com.snopzyz.dao");
        return msc;
    }
}
```
然后将这两个类通过`@Import`导入进 SpringConfig.java 即可  
  
接下来就是和正常 Spring 框架一样的使用方法  

```java
// App.java

import ...;

public class App {
    public static void main(String[] args) throws IOException {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
        UserDao userDao = (UserDao)ctx.getBean(UserDao.class);
        for (User user : userDao.findAll()) {
            System.out.println(user);
        }
    }
}
```

## spring 整合 junit

首先是导入坐标

```xml
<!-- pom.xml -->

<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>5.2.10.RELEASE</version>
</dependency>
```
然后在`/src/test/`目录下编写测试类`StudentServiceTest.java`，其中需要加的注解有

* 使用Spring整合Junit专用的类加载器 `@RunWith(SpringJUnit4ClassRunner.class)`
* 标注Spring配置类 `@ContextConfiguration(classes = SpringConfig.class)`
* 要被测试的类作为成员属性并使用自动装配
* 测试的方法上面添加`@Test`标注

<p></p>

```java
// StudentServiceTest.java

package com.snopzyz.service;

import ...

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class StudentServiceTest {

    @Autowired
    private StudentService studentService;

    @Test
    public void testFindAll () {
        System.out.println(studentService.findAll());
    }

    @Test
    public void testFindByNo () {
        System.out.println(studentService.findByNo("542007230126"));
    }
}
```