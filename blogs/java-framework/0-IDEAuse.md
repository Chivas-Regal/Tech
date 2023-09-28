---
title: IDEA 各项环境配置与使用
---

添加JAR包
======

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694251470545-40f5f113-6d8f-438f-988a-034b06be1d38.png)

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694251539127-3e98b947-a787-484a-8a63-5f6d7d01039c.png)

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694251561728-beb25976-54a0-418e-aec5-87406a940774.png)

然后选择.jar位置，open即可

创建 Web 工程
=========

工程框架搭建
------

1. 在起始界面点击 **New Project**
2. 修改工程配置（除了 **Name** 之外别的都一样即可）
3. 点击右下角 **Create** 创建

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694317484552-8af76410-6de4-477d-a03f-53018a6287df.png)

进入工程代码编辑页面后

1. 点击右上角的 **设置**
2. 点击下拉选项中的 **Project Structure**

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694317783574-a367ee43-3a95-4a92-961b-fdc488b5f236.png)

进入 Project Structure 页面后

1. 选中左侧侧边栏中的 **Project** （不过一般都是默认跳进来的）
2. 将 **Language level** 设置为和 **SDK** 相当的版本

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694317886671-eea4784e-d1aa-47d4-b1dc-f3aacac29183.png)

1. 再选中左侧菜单栏中的 **Modules**
2. 点击第二竖栏左上角的 **加号**
3. 在下拉菜单栏中选择最下面的 **Web** ，点击创建

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694323821811-a95f5036-04f7-4449-a854-eb9bedead2a6.png)

创建好了 Web 模块，然后

1. 点击左侧侧边栏中的 **Artifacts**
2. 点击第二竖栏左上角的 **加号**
3. 在下拉单中选择 **Web Application: Exploded/From Modules...**
4. 弹出的窗口直接选择 **OK**

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694326377256-4874cdee-7f97-4a5d-afe6-1b9f7f3afc81.png)

工件创建好之后是这样的，其中 **Name** 可以做修改

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694324394184-594910f1-c6d8-4984-b48a-ce734031287d.png)

**然后点击 Apply ！！！这一步一定要进行**

项目成品图如下

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694324518830-2d758ccd-84ce-4702-92eb-fe0aa9c9b22d.png)

Tomcat 服务器配置
------------

项目结构接着上面的来

1. 打开顶栏右边运行标志旁的运行选项
2. 在下拉菜单中选择 **Edit Configurations...**

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694324726270-7943d982-a7f1-402f-a6a9-c542503b01c2.png)

进入 Run/Debug Configurations 后

1. 点击左上角的 **加号**
2. 在下拉菜单中往下翻找到 **Tomcat Server** 展开后点击 **Local**

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694324949011-86d14296-b566-42e0-bb30-997de83bb33d.png)

创建了 **Tomcat Server** 后进入配置

1. （可以选择修改名字 **Name** ）
2. 点击 **Server** 下的第一行 **Application server** 右侧的 **Configure**
3. 进入后设置 **Tomcat Home** 为自己 tomcat 的文件夹
4. 点击 **OK**

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694325064005-867ba9b8-1e70-4d38-8be7-f6ef0cf71c1f.png)

完成 **Server** 的设置后

1. 点击菜单栏中Server旁边的 **Deployment**
2. 点击下方框面中左上角的 **加号**
3. 在下拉栏中选定 **Artifact...**

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694325225108-a8ded648-2d65-4b1d-a3d1-844b0635ab3a.png)

添加后是这样

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694325297612-ebccd155-5761-402e-950f-af07ccd18b00.png)

工件添加完成后

1. 回到刚刚的 **Server** 中
2. 在配置列表中找到 **On 'Update' action** 和 **On frame deactivation**
3. 将他们的值都设置为 **Update classes and resources**

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694325416380-b07367f7-fead-4a48-bf43-15955bf925a5.png)

**然后点击 Apply ！！！这一步一定要进行**

测试使用
----

1. 在工程的 `/web` 目录下创建文件 `index.html`

<p></p>

```xml
<!-- /web/index.html -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    Hello Tomcat!
</body>
</html>
```
2. 修改 `/web/WEB-INF/web.xml`

<p></p>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!-- 主要是添加了这一部分，初始页面为 index.html -->
    <welcome-file-list>
        <welcome-file>/index.html</welcome-file>
    </welcome-file-list>
</web-app>
```
3. 点击运行按钮运行项目

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694325978396-d3d0d000-890b-4b39-a61a-52e194ef3e53.png)

运行成功

### 问题1：运行右下角报 ... catalina.sh ... Permission Denied

打开终端，进入配置 tomcat 的文件夹的 /bin 下，执行 `chmod 777 \*.sh`

手动添加 libraries
==============

比如一个没导入`servlet-api.jar`包的目录，想一次把 tomcat 内的所有 jar 包导入，按如下步骤

1. 找到 **tomcat 包下的 lib**
2. 将其**复制粘贴到 IDEA 工程**下
3. **右键该lib目录**
4. **添加为Library（并设置别名）**

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694338038100-2978b3b5-3986-4472-87a2-951f466d8585.png)

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694338166773-a1e71eda-0c62-4b1d-852b-5324f10670a4.png)

Spring搭建
========

整体就是以下四步

1. 导入Spring坐标
2. 定义Spring管理的类与接口
3. 创建Spring配置文件，配置对应类为被管理的bean
4. 初始化容器，从容器中获取bean

步骤细致化说明如下：

1. 创建新工程：在 **Build system** 栏选择 **Maven**
2. 进去后在 **pom.xml** 下添加这些东西 导入Spring坐标

<p></p>

```xml
<!-- pom.xml -->

...
	<dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.10.RELEASE</version>
        </dependency>
    </dependencies>
...
```
3. 可能出现报错，在最右侧打开 **Maven** 后刷新，等一会儿它会自己装好依赖
![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694415989992-70e76e1e-a915-4818-a310-e4649d77981c.png)
4. 先写好几个简单的测试接口与类 定义Spring管理的类（接口）

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694417622298-a22a5c6e-9e5d-4453-9e23-6c5556b3d2d0.png)

这里给出六个文件的内容

<p></p>

```java
// com.itheima.dao.impl.BookDaoImpl.java

package com.itheima.dao.impl;

import com.itheima.dao.BookDao;

public class BookDaoImpl implements BookDao {
    @Override
    public void save () {
        System.out.println("book dao save ...");
    }
}
```

```java
// com.itheima.dao.BookDao.java

package com.itheima.dao;

public interface BookDao {
    public void save ();
}
```

```java
// com.itheima.service.impl.BookServiceImpl.java

package com.itheima.service.impl;

import com.itheima.dao.BookDao;
import com.itheima.service.BookService;

public class BookServiceImpl implements BookService {

    private BookDao bookDao;

    @Override
    public void save () {
        System.out.println("book service save ...");
        bookDao.save();
    }

    public void setBookDao (BookDao bookDao) {
        this.bookDao = bookDao;
    }
}
```

```java
// com.itheima.service.BookService.java

package com.itheima.service.impl;

import com.itheima.dao.BookDao;
import com.itheima.service.BookService;

public class BookServiceImpl implements BookService {

    private BookDao bookDao;

    @Override
    public void save () {
        System.out.println("book service save ...");
        bookDao.save();
    }

    public void setBookDao (BookDao bookDao) {
        this.bookDao = bookDao;
    }
}
```
5. 右键 **resources** 文件夹，选择如下内容 创建Spring配置文件，配置对应类为被管理的bean
![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1694416043273-f80d8c11-ede8-4d07-8520-f0e08f1bfa27.png)
6. 在新打开的文件`/resources/applicationContext.xml`内填写如下内容

<p></p>

```xml
...
    <!--配置bean-->
    <!--
        bean 标签  ： 配置 bean
        id 属性    ： 给 bean 起名
        class 属性 ： 给 bean 定义类型
    -->
    <bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl"/>

    <!--配置service-->
    <bean id="bookService" class="com.itheima.service.impl.BookServiceImpl">
        <!--配置 server 与 dao 的关系-->
        <!--
            property 标签 ： 配置当前 bean 属性
            name 属性     ： 配置哪一个具体属性
            ref 属性      ： 参照哪一个 bean
        -->
        <property name="bookDao" ref="bookDao"/>
    </bean>
...
```
7. 新建 Java 文件 `App2` 来使用我们的 IoC.bean 初始化容器，从容器中获取bean

<p></p>

```java
// com.itheima.App2.java

package com.itheima;

import com.itheima.dao.BookDao;
import com.itheima.service.BookService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App2 {
    public static void main(String[] args) {
        // 3. 获取 IoC 容器
        ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
//        // 4. 获取 bean
//        BookDao bookDao = (BookDao) ctx.getBean("bookDao");
//        bookDao.save();
        BookService bookService = (BookService) ctx.getBean("bookService");
        bookService.save();
    }
}

/*
--------------- Output:
book service save ...
book dao save ...
*/
```
SpringMVC 搭建
============

过程详解
----

1. 新建 maven 项目
2. 按上面创建 web 工程的方式加入 WEB-INF 以及 tomcat8（tomcat10不能用javax，所以先不使用）
3. 在 pom.xml 中导入如下配置

<p></p>

```xml
<dependencies>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.tomcat.maven</groupId>
            <artifactId>tomcat7-maven-plugin</artifactId>
            <version>2.1</version>
            <configuration>
                <port>8081</port> <!--看tomcat监听的是什么内容-->
                <path>/</path>
            </configuration>
        </plugin>
    </plugins>
</build>
```
这是我们的项目结构

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695208111102-ed015c42-98b1-41e1-9ecc-e0b99761bb4a.png)

SpringMvcConfig 主要做的是和我们之前配置 Spring 配置类做的事情一样

```java
// SpringMvcConfig.java

@Configuration
@ComponentScan("com.snopzyz.controller")
public class SpringMvcConfig {
}
```
ServletContainersInitConfig 主要做的是和 Tomcat 进行连接，然后

* 将配置文件指向 SpringMvcConfig
* 给出工程在 web 上访问的根路径，拦截这个路径下的所有请求由 SpringMvc 的 Bean 来管理

<p></p>

```java
// UserController.java

/* 继承 AbstractDispatcherServletInitializer 来完成 Tomcat 的沟通
   如果还有别的类继承了则会报错无法启动 */
public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    /* 将配置文件指向 SpringMvcConfig */
    @Override
    public WebApplicationContext createServletApplicationContext() {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringMvcConfig.class);
        return ctx;
    }
	/* 根路径就是web总工程的根路径 */
    @Override
    public String[] getServletMappings() {
        return new String[]{"/"};
    }

    @Override
    public WebApplicationContext createRootApplicationContext() {
        return null;
    }
}
```
UserController 则是我们设计的表现层类，用作接受数据并返回数据

```java
// UserController.java

@Controller
public class UserController {
	/* 发送数据发送给 save，比如从浏览器打开 /localhost:<端口号>/<工程名>/save
 	   这里会返回字符串 */
    @RequestMapping("/save")
    @ResponseBody
    public String save () {
        System.out.println("user save ...");
        return "{'info' : 'chivas-regal'}";
    }
}
```
![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695210053363-a3fb69ec-0306-496c-a817-441f0bb7eea7.png)

这样运行之后给路径下加个 /save 就会获取到这样的数据

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695209224215-e264e68d-6fb3-426e-a7fb-ccc3b9ec221a.png)

并且在编辑器那边也会有输出

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695209245681-10bc7ad2-a81b-436c-9119-ee9fabde6924.png)

问题说明
----

### 问题1：tomcat10.X

tomcat10 对这套无法使用，因为 tomcat10 交给 eclipse 管理，不能使用 javax 而是换了套名字 jaka...

### 问题2：进入 .../save 后报404

大概率是因为没有将本工程后端内容加入输出导致的，进入 Project Structure

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695209308794-a0f87088-0b1c-4ddb-83ca-0512e2595fc1.png)

选中左侧的 Artifacts，然后选择对应的工程 Artifact，右击要加入输出的 Element（在右侧），然后选择 Pull Into Output Root ，再 Apply 即可

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695209365830-a466c1a6-7706-4d0d-b3bc-e46771812375.png)

SpringBoot 搭建
=============

1. 侧边栏选择 Spring Initializr
2. 右边写好如下形式，其中 Java 的版本不能比 JDK 的版本高
3. package name 删掉后面的
4. Packaging 选择 Jar 包

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695785544413-fcab6303-584c-4b63-8732-5bf508480dc6.png)

5. 选择2.xx版本的SpringBoot
6. 点击 Web 下拉框选择 Spring Web

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695793969509-8ff97fdb-59bf-492b-b5f3-285a1672035d.png)

7. 删掉除了 src 和 pom.xml 以外的所有内容
8. 写一个简单的控制器类

<p></p>

```java
// com.snopzyz.controller.Controller.java

@RestController
@RequestMapping("/user")
public class Controller {

    @RequestMapping("/{id}")
    public String findById (@PathVariable int id) {
        System.out.println("(id) => " + id);
        return "Hello SpringBoot by " + id;
    }
}
```
9. 直接运行

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695802778218-5e42d7f8-d8e3-409a-bdf5-0400624b7b7d.png)

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695802769966-33951ed8-4c0b-497d-a9bc-9c69ffb9d58b.png)

问题1：源发行版17，需要目标发行版17
--------------------

Modules.Languagelevel 修改为 8

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695784458949-fde6405b-f8ef-406b-918d-caf9eeb9c3ed.png)

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1695784521587-4afae54f-ce23-47ec-ba82-07b6771023d7.png)

找到工程的 pom 文件，找到其中 properties 的 java.version，修改为 8

```xml
<!-- pom.xml -->

...
	<properties>
		<java.version>8</java.version>
	</properties>
...
```
