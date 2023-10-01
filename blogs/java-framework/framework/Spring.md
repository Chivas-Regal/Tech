---
title: Spring
---

## 容器

### IOC 容器介绍

由 new 产生对称转换为由 IOC 容器提供对象，[具体 IOC 简单使用参考这里](https://www.yuque.com/chivasregal/vhwl6i/apkfzx0o71xpp800#IOC: 新类+配置文件修改运行时调用的类)
其管理的对象叫做 Bean
在容器中建立bean与bean之间依赖关系的过程称为依赖注入（DI）

例如如下已经在IOC容器内绑定过 service 依赖于 dao

```java
// 业务层实现

public class BookServiceImpl implements BookService {
    private BookDao bookDao;
    public void save () {
        bookDao.save();
    }
}
```

```java
// 数据层实现

public class BookDaoImpl implements BookDao {
    public void save () {
        System.out.println("book dao save ...");
    }
}
```
这里业务层第二行代码就可以直接使用，完成解耦

但是想要使用这样的类与类之间的依赖关系，我们需要有Spring配置文件

```xml
<!-- /resources/applicationContext.xml -->

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
            name 属性     ： 配置哪一个具体属性（bookService内的成员实例名）
            ref 属性      ： 参照哪一个 bean
        -->
        <property name="bookDao" ref="bookDao"/>
    </bean>
...
```
bean属性还可以设置lazy-init，如果为true，则说明是延迟加载，否则都是在容器实例化那一刻立即加载

具体使用请看下一节：第一个 Spring 程序

### 📚 第一个Spring程序

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
  
![20230928193413](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193413.png)  
  
4. 先写好几个简单的测试接口与类 定义Spring管理的类（接口）  
  
![20230928193419](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193419.png)  
  
这里给出六个文件的内容

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

    // 为Spring配置文件传递对象提供set方法
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
![20230928193429](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193429.png)
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
            name 属性     ： 配置哪一个具体属性（bookService内的成员实例名）
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
        // 4. 获取 bean
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

### bean实例化

有三种实例化方式

* 构造方法
* 静态工厂
* 实例工厂
* 实例工厂简化——FactoryBean

#### 构造方法

在IoC容器介绍与spring\_01\_quickstart就已经有了，就是利用默认的无参构造完成实例化

#### 静态工厂

是一种工厂类存在静态生产方法来构造需要的bean实例
比如存在工厂

```java
// StaticDaoFactory.java

package com.snopzyz.factory;

import ...;

public class StaticDaoFactory {
    public static BookDao getBookDao () {
        System.out.println("Static daoFactory construct bookDao ...");
        return new BookDaoImpl();
    }
}
```
但是要让Spring知道应该调用谁，需要在Spring配置文件中指明「要调用的工厂类」与「该类对应的生产方法」
那么在我们之前创建的配置文件`/resources/applicationContext.xml`中添加如下内容

```xml
<bean
  id="bookDao"
  class="com.snopzyz.factory.StaticDaoFactory"
  factory-method="getBookDao"
/>
```
#### 实例工厂

是一种工厂类存在非静态生产方法来构造需要的bean实例
比如存在工厂

```java
// InstanceDaoFactory.java

package com.snopzyz.factory;

import ...;

public class InstanceDaoFactory {

    public BookDao getBookDao () {
        System.out.println("Instance daoFactory construct bookDao ...");
        return new BookDaoImpl();
    }
}
```
由于是非静态，要调用它首先要在Spring配置文件内实例化一个工厂bean
然后再利用这个已有的bean，和其生产方法构造出我们要用的实例，具体编写如下

```xml
<!-- 实例化工厂 bean ，名字为 bookDaoFactory -->
<bean
  id="bookDaoFactory"
  class="com.snopzyz.factory.InstanceDaoFactory"
/>
<!-- 利用已实例化的工厂 bean，调用 bookDaoFactory.getBookDao() -->
<bean
  id="bookDao"
  factory-method="getBookDao"
  factory-bean="bookDaoFactory"
/>
```
#### 实例工厂简化——FactoryBean

上面的实例工厂有一个最大的问题就是bean冗余，多实例化了一个工厂bean
Spring存在一个接口供我们用，`FactoryBean`
这是一个泛型类，尖括号里面放我们要生产的对象，用`getObject()`获取对象，`getObjectType()`获取类名

```java
// InstanceDaoFactoryBean.java

package com.snopzyz.factory;

import ...;

public class InstanceDaoFactoryBean implements FactoryBean<BookDao> {
	/* 获取对象 */
    @Override
    public BookDao getObject() throws Exception {
        System.out.println("Instance daoFactoryBean construct bookDao ...");
        return new BookDaoImpl();
    }
	/* 获取类名 */
    @Override
    public Class<?> getObjectType() {
        return BookDao.class;
    }
	/* bean 是否为单例模式 */
    @Override
    public boolean isSingleton() {
        return true;
    }
}
```
这样在配置文件中我们用和“构造方法”相似的方式就可以实例化bean了

```xml
<bean id="bookDao" class="com.snopzyz.factory.InstanceDaoFactoryBean"/>
```

### bean生命周期

**第一种方式**

给 dao 的 bean 设置两个方法分别表示创建和销毁，然后在`xml`中用属性`init-method`和`destory-method`调用

```java
// BookDao.java

package com.snopzyz.dao.impl;

import com.snopzyz.dao.BookDao;

public class BookDaoImpl implements BookDao {
    @Override
    public void save () {
        System.out.println("book dao save ...");
    }

    public void init () {
        System.out.println("BookDao init ...");
    }

    public void destory () {
        System.out.println("BookDao destory ...");
    }
}

```

```xml
<bean
  id="bookDao"
  class="com.snopzyz.dao.impl.BookDaoImpl"
  init-method="init"
  destroy-method="destory"
/>
```
**第二种方式**

给 service 的 bean 类继承`InitializingBean`和`DisposableBean`接口

```java
package com.snopzyz.service.impl;

import ...;

public class BookServiceImpl implements BookService, InitializingBean, DisposableBean {

    private BookDao _bookDao;

    @Override
    public void save () {
        System.out.println("book service save ...");
        bookDao.save();
    }

    // 为Spring配置文件传递对象提供set方法
    public void set_bookDao (BookDao _bookDao) {
        System.out.println("book service set dao ...");
        this._bookDao = _bookDao;
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("book service destory ...");
    }

    // 所有属性全部被set 之后的方法
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("book service after properties set ...");
    }
}
```

```xml
<bean id="bookService" class="com.snopzyz.service.impl.BookServiceImpl">
    <property name="_bookDao" ref="bookDao"/>
</bean>
```

**需要注意的是，如果bean是多例模式，那么Spring只管理它的创建，但不管理它的销毁**

### 多依赖注入

#### setter 注入

现在这个类有以下四个成员，并把他们的`set()`函数都写好

```java
public class BookServiceImpl implements BookService {
    private String dbName;
    private int connectionNumber;
    private BookDao bookDao1;
    private BookDao bookDao2;
    ...
}
```
在`xml`里面这么写即可完成注入

```xml
...
  	<!-- 为了下面的使用，这里实例化两个 bean -->
		<bean id="bookDao1" class="com.snopzyz.dao.impl.BookDaoImpl"/>
    <bean id="bookDao2" class="com.snopzyz.dao.impl.BookDaoImpl"/>

    <bean id="bookService" class="com.snopzyz.service.impl.BookServiceImpl">
        <!-- 基本数据类型用 value -->
        <property name="dbName" value="mysql"/>
        <property name="connectionNumber" value="10"/>
        <property name="bookDao1" ref="bookDao1"/>
        <property name="bookDao2" ref="bookDao2"/>
    </bean>
...
```
#### 构造器注入

换了一个方式，写了个构造函数

```java
public BookServiceImpl(String dbName, int connectionNumber, BookDao bookDao1, BookDao bookDao2) {
    this.dbName = dbName;
    this.connectionNumber = connectionNumber;
    this.bookDao1 = bookDao1;
    this.bookDao2 = bookDao2;
}
```
配置文件书写

* 在`xml`里面需要把`<property...`改成`<constructor-arg...`
要注意的是，这个标签的 name 属性指的是构造函数的形参名
问题是“与程序高度耦合”

<p></p>

```xml
...
	<constructor-arg name="dbName" value="mysql"/>
...
```
* 把`name`属性换成`type`，后跟类型
问题是“如果有多个同类型形参，无法识别”

<p></p>

```xml
...
	<constructor-arg type="String" value="mysql"/>
...
```
* 把`type`属性换成`index`，后跟参数位置

<p></p>

```xml
...
	<constructor-arg index="0" value="mysql"/>
...
```

#### 注入方式选择

强制依赖（必须要赋值的属性）使用构造器注入
可选依赖（可以为空的属性）使用setter注入

#### 集合注入

可以注入单个变量，现在需要注入一整个集合/容器，比如有这么一个java类

```java
// BookServiceImpl.java

public class BookServiceImpl implements BookService {

    private int[] serviceArray;
    private List<Integer> serviceList;
    private Set<String> serviceSet;
    private Map<String, String> serviceMap;
    private Properties serviceProperties;

    public void setServiceArray(int[] serviceArray) {
        this.serviceArray = serviceArray;
    }

    public void setServiceList(List<Integer> serviceList) {
        this.serviceList = serviceList;
    }

    public void setServiceSet(Set<String> serviceSet) {
        this.serviceSet = serviceSet;
    }

    public void setServiceMap(Map<String, String> serviceMap) {
        this.serviceMap = serviceMap;
    }

    public void setServiceProperties(Properties serviceProperties) {
        this.serviceProperties = serviceProperties;
    }

    @Override
    public void save() {
        System.out.println("serviceArray : " + Arrays.toString(serviceArray));
        System.out.println("serviceList : " + serviceList);
        System.out.println("serviceSet : " + serviceSet);
        System.out.println("serviceMap : " + serviceMap);
        System.out.println("serviceProperties : " + serviceProperties);
    }
}
```
它的注入也有专门的方式，下面从上到下就分别介绍了`Array`、`List`、`Set`、`Map`、`Properties`的注入方式

```xml
<bean id="bookService" class="com.snopzyz.service.impl.BookServiceImpl">

    <property name="serviceArray">
        <array>
            <value>1</value>
            <value>3</value>
            <value>2</value>
        </array>
    </property>

    <property name="serviceList">
        <list>
            <value>1</value>
            <value>3</value>
            <value>2</value>
        </list>
    </property>

    <property name="serviceSet">
        <set>
            <value>zyz</value>
            <value>zxh</value>
            <value>zyz</value>
        </set>
    </property>

    <property name="serviceMap">
        <map>
            <entry key="country" value="china"/>
            <entry key="province" value="henan"/>
            <entry key="city" value="zhengzhou"/>
        </map>
    </property>

    <property name="serviceProperties">
        <props>
            <prop key="country">chine</prop>
            <prop key="province">henan</prop>
            <prop key="city">zhengzhou</prop>
        </props>
    </property>

</bean>
```
这里面的`key`和`value`如果不是基本类型，要换成`ref`来引用之前声明过的`bean`

### 自动装配

在`bean`标签内设置属性`autowire=""`，可选的一般用以下两种

* 按类型：`byType`
* 按名称：`byName`

优先级低于setter注入和构造器注入

#### 按类型

最常用的，这意味着在该`bean`之前必须要有其所依赖的类型的`bean`  
如存在类 `class A { public B val; }`  
则在`xml`内在写`A`的`bean`之前，必须要写唯一的一个`B`的`bean`  

#### 按名称

意味着在该`bean`之前必须要有其所依赖的名称的`bean`（类型也需要能对上）  
还是上面的类，那么我们在写`A`的`bean`之前，必须要写一个类型为`B`名称为`val`的`bean`  
  
按名称好处是可以给类写多个同类型成员了，但坏处是提高了代码的耦合性  

### properties 文件读取

有一个`UserDaoImpl`类，里面有两个`String`的成员：`username`和`password`  

对其有一个配置文件 UserDao.properties  

```properties
userdao.username = zyz
userdao.password = @Zhangyize020110
```
要使用这个配置文件，Spring的xml首先要使用context命名空间，后面加载文件需要用这个命名空间里面的标签

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
       ">
```
其中相对于之前加第四行的内容，以及第八第九行的内容  
  
然后载入这个文件  

```xml
<context:property-placeholder location="UserDao.properties"/>
```
要加载多个配置文件的话，在location属性的双引号内用逗号分隔文件名  
  
加载所有的属性配置文件，可以用`classpath:\*.properties`  
  
加载依赖jar包的配置文件，可以用`classpath\*:\*.properties`  
  
之后就可以利用`${<key>}`来获取里面的`<value>`，比如上述类我们这里  
  
```xml
<bean id="userDao" class="com.snopzyz.dao.impl.UserDaoImpl">
    <property name="username" value="${userdao.username}"/>
    <property name="password" value="${userdao.password}"/>
</bean>
```

## 注解

### 注解定义bean

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

### 纯注解开发配置

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
### bean注解配置

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
### 依赖注入

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

### 第三方bean管理

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

### 第三方bean依赖注入

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
## 整合

### spring整合mybatis

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

### spring 整合 junit

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

## 📚 上层内容代码案例

整体使用案例置入 Github 中，通过[点击这里](https://github.com/Chivas-Regal/JavaLearn/tree/main/spring_01)查看

## AOP

### 面向切面编程介绍

**连接点：程序执行过程中的任意位置**，SpringAOP中可理解为方法的执行

**切入点：匹配连接的式子**，可以是一个具体方法，也可以是通过某种特性匹配的多个方法，比如所有`save()`方法、所有以get开头的方法、所有以Dao结尾的接口的方法、所有只有一个参数的方法

**通知：切入点执行的操作，也是共性功能**

**通知类：定义通知的类**

**切面：描述通知和切入点的对应关系**

### 第一个 AOP 程序

这里我们有一个 BookDao 类，我们预期在其执行方法 update() 之前先输出当前系统时间

项目结构如下

![20230928193500](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193500.png)

其中 BookDao 类里有一个 update() 函数自己会输出 `book update ...` ，然后 App 也是正常的对容器中 BookDao 这个bean的 update() 方法调用，就不展示了  
  
说明一下 SpringConfig，与之前不同的是我这里需要标注使用注解开发AOP，要加上`@EnableAspectJAutoProxy`

```java
// SpringConfig.java

@Configuration
@ComponentScan("com.snopzyz")
@EnableAspectJAutoProxy
public class SpringConfig {
}
```
然后AOP类MyAdvice

* 它是一个 bean ，那就要 `@Component`
* 它是一个 AOP ，那就要 `@Aspect`
* 其方法要有通知、切入点
+ 我们需要的通知是输出系统时间的方法
+ 我们需要的切入点需要注解 `@PointCut()` ，是匹配BookDao的update()，式子就是 `execution(void com.snopzyz.dao.BookDao.update()`
+ 然后将通知和切入点进行绑定，在通知方法上面加上`@Before(切入点方法)`

下面是整体的实现

```java
// MyAdvice.java

@Component
@Aspect
public class MyAdvice {

    @Pointcut("execution(void com.snopzyz.dao.BookDao.update())")
    public void pt () {}

    @Before("pt()")
    public void method () {
        System.out.println(System.currentTimeMillis());
    }

}
```

### Spring-AOP 原理-

利用代理，在初始化bean时判断是否能够匹配上任意切入点

* 匹配失败创建对象
* 匹配成功创建原始对象（目标对象）的代理对象

获取 bean 如果是代理对象的话，根据代理对象的运行模式运行原始方法与增强的内容完成操作

验证就接着我们上一节的程序来，我们在 App 中输出一下 bookDao 和 bookDao.getClass()

```java
// App.java

public class App {
    public static void main(String[] args) {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
        BookDao bookDao = ctx.getBean(BookDao.class);
        System.out.println(bookDao);
        System.out.println(bookDao.getClass());
    }
}
/*
================== Output
com.snopzyz.dao.BookDao@29d80d2b
class com.snopzyz.dao.BookDao$$EnhancerBySpringCGLIB$$feb6a66a
*/
```
会发现 bookDao 的 toString 是被做 Spring 了一次重写，但 getClass 就是代理对象的
但是还有一点要注意的是，这个代理对象是继承或者组合了原始对象，其实例 boolDao 运算 `bookDao instanceof BookDao` 返回的是 `true`

### AOP 切入点表达式

由几部分组成：动作关键字、访问修饰符（可以省略）、返回值、包名、类/接口名、方法名、参数、异常名（可以省略）
比如例子就是

```java
@execution(public User com.snopzyz.service.UserService.findByNo(String))
```
切入点表达式

* `\*`：匹配单个独立的任意符号（必须要有）

<p></p>

```java
execution(public * com.snopzyz.*.UserService.find*(*))
```
匹配 com.snopzyz 包下任意包中的 UserService 类或接口中所有 find 开头的带有一个参数的方法

* `..`：匹配多个连续的任意符号（可以没有）

<p></p>

```java
execution(public User com..UserService.findById(..))
```
匹配 com 包下的任意包中的 UserService 类或接口中所有名称为 findById 的方法

* `+`：专用于匹配子类类型

<p></p>

```java
execution(* *..*Service+.*(..))
```
匹配任意包下的以 Service 结尾的子类或中任意名称任意参数任意返回值的方法

再来看个疯狂的

```java
execution(* *..*(..))
```
表示匹配任意包下任意类的任意参数任意返回值的方法，也就是所有方法（一般不这么写

有个常用的

```java
execution(* com.snopzyz.*.*Service.find*(..))
```
给所有 com.snopzyz 下的业务层类的 find 开头方法加 AOP

**书写技巧**

* 所有代码按照标准规范开发，否则以下技巧全部失效
* 描述切入点**通常描述接口**，而不描述实现类
* 访问控制修饰符针对接口开发均采用public描述（**可省略访问控制修饰符描述**）
* 返回值类型对于增删改类使用精准类型加速匹配，对于查询类使用\*通配快速描述
* **包名书**写**尽量不使用..**匹配，效率过低，常用\*做单个包描述匹配，或精准匹配
* **接口名**/类名书写名称与模块相关的**采用\*匹配**，例如UserService书写成\*Service，绑定业务层接口名
* **方法名**书写以**动词**进行**精准匹配**，名词采用\*匹配，例如getByld书写成getBy\*，selectAIl书写成selectAIl
* 参数规则较为复杂，根据业务方法灵活调整
* 通常**不使用异常**作为**匹配**规则

### 通知类型

#### 前置与后置

根据上面例子的我们很容易知道这里要怎么写

```java
@Before("pt()")
public void methodBefore () {
    System.out.println("before ... ");
}

@After("pt()")
public void methodAfter () {
    System.out.println("after ... ");
}
```
#### 环绕（重点）

这个是最重要的，使用注解`@Around(切入点)`完成，有几个注意事项

##### 返回值

环绕因为可能增强有返回值的方法，所以我们要用 **Object 类型**捕捉返回值并在环绕通知方法中返回

##### 异常

由于被增强的方法可能会抛异常，所以这里也要**用**`**throws Throwable**`**进行捕获**

##### 参数

因为是环绕前后都有，我们需要设置切入时机，这里的工具类为 **ProceedingJoinPoint**

##### 调用时机

利用我们上面的 ProceedingJoinPoint ，**调用其 proceed() 方法**就相当于执行了原始方法，注意根据上面说的返回值这里也要用 Object 捕获，就算没有返回值

```java
@Around("pt()")
public Object Around (ProceedingJoinPoint pjp) throws Throwable {
    System.out.println("around before ...");
    Object ret = pjp.proceed();
    System.out.println("around after ...");
    return ret;
}
```
#### 返回之后

`@AfterReturning(切入点)`

#### 抛出异常之后

`@AfterThrowing(切入点)`

### 通知获取数据

我们现在将 BookDao 类内方法改成如下内容：

```java
// BookDao.java

@Repository
public class BookDao {
    public String save (String name, int id) {
        System.out.println("book save ... " + name + " " + id);
        return "good";
    }
}
```
只是一个简单的返回固定串，中间正常是有 book 信息 (name, id) 的解析，这里就不设计了

假设存在场景：**要将 name 转换成大写、id 往后平移 100**，这就可以利用 AOP 把这些 save() 有关方法全部添加参数转换，核心思想是**通知方法中先修改参数再进行调用**，步骤如下

1. 设置切入点、通知、切面 ...
2. 在 save 相关通知方法中用 ProceedingJoinPoint 取出参数，并做修改
3. 在 ProceedingJoinPoint 对象中使用连接点 proceed 方法时传入修改后的参数

<p></p>

```java
// BookAdvice.java

public class BookAdvice {
    @Pointcut("execution(String com.snopzyz.dao.BookDao.save(..))")
    public void pt () {}

    @Around("pt()")
    public Object Around (ProceedingJoinPoint pjp) throws Throwable {
        /* 获取参数 */
        Object[] args = pjp.getArgs();

        System.out.println("before ...");

        /* 修改参数 */
        String name = (String)args[0];
        int id = (Integer)args[1] + 100;

        /* 用已有参数调用连接点 */
        Object ret = pjp.proceed(new Object[]{name.toUpperCase(), id});

        System.out.println("after ...");
        return ret;
    }
}
```
此时我们在 App.java 中调用输出如下

```java
// App.java

ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
BookDao bookDao = ctx.getBean(BookDao.class);
System.out.println(bookDao.save("NowYouGood", 66));

/*
================== Output
before ...
book save ... NOWYOUGOOD 166
after ...
good
*/
```
如果需要在 AfterReturning 通知方法中获取返回值，只需要将其置为参数，并在注解中标注返回给这个参数

```java
/* 切入点是 pt()，返回值赋给参数 ret */
@AfterReturning(value = "pt()", returning = "ret")
public void AfterReturning (String ret) {
    System.out.println("afterReturning advice ... " + ret);
}
```
注意这里如果要加 JoinPoint 参数的话，必须要设置为第一个参数，也就是 `(JoinPoint jp, String ret)`

## Spring事务

### 银行转钱案例

现在有表

```
+-------+-------------+------+-----+---------+-------+
| Field | Type        | Null | Key | Default | Extra |
+-------+-------------+------+-----+---------+-------+
| name  | varchar(20) | YES  |     | NULL    |       |
| money | int         | YES  |     | NULL    |       |
+-------+-------------+------+-----+---------+-------+
```
转钱需要控制的 Sql 增强方法下的数据控制层，也就是我们之前学的 UserDao，现在我有两个更新钱数的方法，一加一减

```java
// UserDao.java

@Repository
public interface UserDao {

    @Update("update user_save set money=money+#{money} where name=#{name}")
    public void AddMoney (@Param("name")String name, @Param("money")int money);

    @Update("update user_save set money=money-#{money} where name=#{name}")
    public void DelMoney (@Param("name")String name, @Param("money")int money);
}
```
下面展示业务层调用的问题

### Service 负面例子

正常想法，业务层调用一加钱一减钱

```java
// BankService.java

@Service
public class BankService {

    @Autowired
    private UserDao userDao;

    public void transaction (String in, String out, int money) {
        userDao.AddMoney(in, money);
        userDao.DelMoney(out, money);
    }
}
```
但是有问题，如果加钱和减钱中间出错抛出异常了，那么这个方法执行下来只会加不会减

### 解决方案

事务通过 commit 和 callback 来保证原子性，让函数如果执行不到返回那就回滚撤销操作

首先要在 SpringConfig 中开启事务管理

```java
// SpringConfig.java

@EnableTransactionManagement
...
public class SpringConfig {
    ...
```
然后我们这里使用 jdbc 的事务管理方案，将事务管理器调用 druid 连接池初始化后作为 bean 返回给 Spring 容器管理

```java
// JdbcConfig.java

@Bean
public PlatformTransactionManager transactionManager (DataSource dataSource) {
    DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
    transactionManager.setDataSource(dataSource);
    return transactionManager;
}
```
这样事务管理器就注册好了，在我们需要作为事务原子化的方法前面加上注解`@Transactional`

```java
// BankService.java

@Service
public class BankService {

    @Autowired
    private UserDao userDao;

    @Transactional
    public void transaction (String in, String out, int money) {
        userDao.AddMoney(in, money);
        int a = 1 / 0;
        userDao.DelMoney(out, money);
    }
}
```
这样中间出异常，前面的也会进行回滚到原始状态，不出现异常的话就执行完
但是只有两种异常类会回滚，Error 和运行时异常

### 事务传播行为

![20230928193538](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193538.png)

用类似于这样的方式来设置：`@Transactional(propagation= Propagation.REQUIRES\_NEW)`

