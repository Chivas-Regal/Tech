---
title: IoC 容器控制反转
---

## IOC 容器介绍

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

## 📚 第一个Spring程序

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

## bean实例化

有三种实例化方式

* 构造方法
* 静态工厂
* 实例工厂
* 实例工厂简化——FactoryBean

### 构造方法

在IoC容器介绍与spring\_01\_quickstart就已经有了，就是利用默认的无参构造完成实例化

### 静态工厂

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
### 实例工厂

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
### 实例工厂简化——FactoryBean

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

## bean生命周期

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

## 多依赖注入

### setter 注入

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
### 构造器注入

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

### 注入方式选择

强制依赖（必须要赋值的属性）使用构造器注入
可选依赖（可以为空的属性）使用setter注入

### 集合注入

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

## 自动装配

在`bean`标签内设置属性`autowire=""`，可选的一般用以下两种

* 按类型：`byType`
* 按名称：`byName`

优先级低于setter注入和构造器注入

### 按类型

最常用的，这意味着在该`bean`之前必须要有其所依赖的类型的`bean`  
如存在类 `class A { public B val; }`  
则在`xml`内在写`A`的`bean`之前，必须要写唯一的一个`B`的`bean`  

### 按名称

意味着在该`bean`之前必须要有其所依赖的名称的`bean`（类型也需要能对上）  
还是上面的类，那么我们在写`A`的`bean`之前，必须要写一个类型为`B`名称为`val`的`bean`  
  
按名称好处是可以给类写多个同类型成员了，但坏处是提高了代码的耦合性  

## properties 文件读取

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