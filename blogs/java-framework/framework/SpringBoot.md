---
title: SpringBoot
---

## 入门案例

### 迅速生成

第一个程序配置在 Java/IDEA配置使用 中已有，这里教一下如果没有 IDEA 如何创建 SpringBoot 项目

进入 <https://start.spring.io/>，按我们第一个配置程序的内容设定

![20230928194007](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928194007.png)

然后创建即可，便会下载一个创建好了的压缩包，我们把这个压缩包解压并用 vscode 打开
运行其中的 SpringbootDemoApplicaiton.java 程序，即可开启 springboot\_demo 的 web 项目

### 快速启动

> 为了前端能简单启动 SpringBoot 程序，启用了运行 jar 包即可运行程序的方式

- 从右侧找到 maven 动作，将其打包 package  
![20231001221355](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231001221355.png)  
- 在 target 中找到生成的 jar 包  
![20231001221444](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231001221444.png)  
- 在终端中调用 `java -jar <jar包路径>` 直接运行  
![20231001221557](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231001221557.png)  

这边已经启动了，我们在 postman 中测试一下

![20231001221710](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231001221710.png)

测试成功

## SpringBoot 依赖

### 依赖项溯源

在工程 pom.xml 文件中，存在父工程的 pom.xml
  
```xml
<!-- springboot_demo/pom.xml -->

...
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.7.16</version>
</parent>
...
```

这个父工程也有它的父工程

```xml
<!-- spring-boot-starter-parent-2.7.16/pom.xml -->

...
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-dependencies</artifactId>
    <version>2.7.16</version>
</parent>
...
```

在 spring-boot-dependencies 中存在一系列的变量与依赖管理

```xml
<!-- spring-boot-dependencies-2.7.16/pom.xml -->

...
<!--变量，主要是一些版本号-->
<properties>
...
    <junit.version>4.13.2</junit.version>
...
</properties>
<!-- 依赖管理，主要是一些利用上面变量作为版本号的依赖 -->
<dependencyManagement> 
...
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>${junit.version}</version>
    </dependency>
...
</dependencyManagement>
<build...>
...
```

有了这些，我们在自己的工程的 `<dependencies>` 中只需要加上所需的依赖不需要加版本即可  
  
然后是我们工程 pom 中的两个依赖

```xml
<!-- springboot_demo/pom.xml -->
...
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
...
```

其中第二个依赖就是一些 spring-test 依赖  
第一个依赖中存在 `spring-web`、`spring-webmvc`、`spring-boot-starter-tomcat`  
这三个帮助我们开发 web 程序，并且内置了一个 tomcat 服务器便于我们启动

而在 SpringbootDemoApplication 中

```java
// SpringbootDemoApplication.java

@SpringBootApplication
public class SpringbootDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootDemoApplication.class, args);
    }

}
```

SpringApplication的启动会根据 pom.xml 中的配置来启动程序  
比如我存在 web ，那启动会作为一个 web 服务器启动

### 依赖项变更-tomcat切换jetty

由于 springboot 的祖先级 pom 都是官方配好的只读的，我们不能利用可选依赖，使用排除依赖  
找到 pom.xml 中 web 那一块  
将其 tomcat 排除掉，然后在下面再添加一个 jetty 的依赖

```xml
<!-- springboot_demo/pom.xml -->

...
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <!-- 排除项 -->
    <exclusions>
        <exclusion>
            <!-- 排除 tomcat 依赖 -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- 加入 jetty -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
...
```

maven 刷新一下，少了 tomcat 多了 jetty  
![20231002102317](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002102317.png)  
运行起来就可以发现是用的 jetty  
![20231002102401](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002102401.png)  
postman 也正常交互了  
![20231002102437](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002102437.png)

## 基础配置

用 `.properties`、`.yaml`、`.yml` 来做配置  

### 环境设置

这里以修改运行端口号为例  
springboot 默认运行端口号为 8080 这里给出修改为 80 的方式

1.在给出的 `/src/main/resources/application.properties` 中添加（最优先）

```properties
server.port=80
```

**2.新建 `/src/main/resources/application.yml` 添加**（次优先）

```yml
server:
    port: 80
```

3.新建 `/src/main/resources/application.yaml` 添加（最不优先）

```yaml
server:
    port: 80
```

::: danger 可能在后面新加的文件中无法自动补全，这里给出设置方式：  

1.右上角设置进入 Project Structure  
![20231002124937](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002124937.png)    
2.在Facets选项中点击加号创建Spring并将本项目导入  
![20231002125046](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002125046.png)  
3.点击这个小树叶并添加我们创建的两个配置文件  
![20231002125433](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002125433.png)  
4.点击加号后选择这两个文件后确认  
![20231002125933](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002125933.png)  
  
此时就有了这两个配置文件  
![20231002125956](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002125956.png)  
再使用时就存在自动补全了
:::

### 配置读取

#### @Value

yaml 文件格式其实就是一种前缀提取，这里给出数据提取案例  
这是我们的 yaml 文件

```yaml
# application.yaml

lession: SpringBoot

server:
  port: 80

enterprise:
  name: snopzyz
  age: 21
  qq: 1411390466
  subject:
    - C/C++
    - Java后端框架
    - 算法与数据结构
```

对于正常变量，接收的时候将层级关系当成带 `.` 的前缀  
对于数组变量，接收的时候将元素通过下标提取

```java
// Controller.java

...
    @Value("${lession}")
    private String lession;

    @Value("${server.port}")
    private int port;

    @Value("${enterprise.subject[0]}")
    private String subject_00;
...
```

#### Environment

当然还有一种自动装配 `Environment` 成员变量，可以通过内置方法 `getProperty` 获取参数（区别于上面，不用加 `${}` ）  

```java
    @Autowired
    private Environment environment;

    @RequestMapping
    public String find () {
        System.out.println(environment.getProperty("enterprise.subject[0]"));
        ...
    }
    ...
```

#### ConfigurationProperties(prefix = "")

这种可以利用配置文件中的某个前缀下的变量生成一个 bean  

```java
// Enterprise.java

@Component
@ConfigurationProperties(prefix = "enterprise")
public class Enterprise {
    private String name;
    private int age;
    private String qq;
    private String[] subject;

    ... // setter/getter/tostring
}
```

之后利用自动装配直接在类里面用即可

```java
// Controller.java

@RestController
@RequestMapping("/user")
public class Controller {

    @Autowired
    private Enterprise enterprise;

    @RequestMapping
    public String find () {
        System.out.println(enterprise);
        return "get successfully";
    }
}
```

### 多环境

这里以不同环境不同端口号为例

- $dev$ 环境：开发环境，端口号 $8080$
- $pro$ 环境：生产环境，端口号 $8081$
- $test$ 环境：测试环境，端口号 $8082$

#### yml 文件

在一个 yml 文件中区分不同的生产环境用 `---`  

```yml
# application.yml

server:
  port: 8080

---

server:
  port: 8081

---

server:
  port: 8082
```

在每一个里面做标注环境名用 `spring.config.active.on-profile: <环境名>`  
例如开发环境用  

```yml
# application.yml

...

---
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8080
---

...
```

标注当前使用的环境名需要再开一块儿，用 `spring.profiles.activate: <使用环境名>`  

```yml
# application.yml

spring:
  profiles:
    active: pro
---
# 开发环境

spring:
  config:
    activate:
      on-profile: dev

server:
  port: 8080

---
# 生产环境

spring:
  config:
    activate:
      on-profile: pro

server:
  port: 8081

---
# 测试环境

spring:
  config:
    activate:
      on-profile: test
server:
  port: 8082
```

这样就是使用的生产环境

#### properties 文件

在主配置文件中写 `spring.profiles.active=<启用环境名>`  
然后在同级新建一个文件 `application-<环境名>.properties` 里面标注要设置的环境的变量

我这里启用 $dev$ 环境，并令其打开 $8080$ 端口

```properties
# application.properties

spring.profiles.active=dev
```

```properties
# application-dev.properties

server.port=8080
```

### 命令行环境变量

删除除了 yml 配置以外的别的配置  
先打包，然后进入命令行  
只运行  

```sh
java -jar springboot_demo-0.0.1-SNAPSHOT.jar
```

是用我们上一步配的 pro 环境 8081

![20231002195821](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002195821.png)  
(下面的就不演示了，可以自己去找)  

在命令行中按配置文件中相同的参数命名格式，也就是  

```yml
spring:
  profiles:
    active: pro

---

...
```

并加上前缀 `--` 修改环境为 test，端口号将会变为 8082  

```sh
java -jar springboot_demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=test
```

同理我们也可以自定端口号为83，一样用命令行参数的方式 `--server.port=83`

```sh
java -jar springboot_demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=test --server.port=83
```

::: danger 中文打包失败

进入 Settings 后  
选中侧边栏 File Encodings   
在右侧将 Project Encoding 改为 UTF-8

![20231002195014](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002195014.png)

:::

### Maven 与 Boot 多环境兼容

在 [Maven讲解多环境配置](../Maven.html#多环境配置) 中，我们学过在 pom 文件内配置  
并使用 `<properties>` 来创建变量，这里已经给好了配置，变量仅仅存放要用 boot 打开哪个环境  

```xml
<!-- pom.xml -->

<profiles>
    <!-- 开发环境 -->
    <profile>
        <id>dev</id>
        <properties>
            <profiles.active>dev</profiles.active>
        </properties>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
    </profile>
    <!-- 生产环境 -->
    <profile>
        <id>pro</id>
        <properties>
            <profiles.active>pro</profiles.active>
        </properties>
    </profile>
    <!-- 测试环境 -->
    <profile>
        <id>test</id>
        <properties>
            <profiles.active>test</profiles.active>
        </properties>
    </profile>
</profiles>
```

对于非 Java 类的操作要求加载 Maven 对应的属性，解析 `${}` 占位符  
将 pom 能在 resources 配置文件中使用，引入插件 maven-resources-plugins  

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
    <version>3.3.1</version>
    <configuration>
        <encoding>UTF-8</encoding>
        <useDefaultDelimiters>true</useDefaultDelimiters>
    </configuration>
</plugin>
```

紧接着在 yml 中这样写即可完成 pom.xml 控制环境选择了  
打包时使用命令 `maven package -P <环境名称>` 即可控制环境选择

```yml
# application.yml

spring:
  profiles:
    active: ${profiles.active}
---

...
```

### 多级配置文件

- 打包上线：./ 为 jar 包的所在目录
  * ./config/application.yml（优先级最高）
  * ./application.yml
- 本地开发：classpath 为 resources 目录
  * classpath: config/application.yml
  * classpath: application.yml（优先级最低）

## 第三方整合

### 整合 junit

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

### 整合 SSM

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

## 前端结合

做的和我们 [SpringMVC+SSM+前端](./SpringMVC.html#ssm-前端加入) 是一样的效果  
但是 config 包全都不用写了  
页面静态访问资源控制按框架目录格式定好了，静态资源放在 `resources/static` 下  
然后在 com.snopzyz.dao.BookDao 上面加一个我们上面说的 `@Mapper` 就行了  
这是目录结构  

 ![20231003210752](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231003210752.png)