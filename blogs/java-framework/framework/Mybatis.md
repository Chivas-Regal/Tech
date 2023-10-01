---
title: Mybatis
---

## 速成

一张db表Student/student

```sql
+-------+--------------+------+-----+---------+-------+
| Field | Type         | Null | Key | Default | Extra |
+-------+--------------+------+-----+---------+-------+
| no    | char(255)    | NO   | PRI | NULL    |       |
| name  | varchar(255) | YES  |     | NULL    |       |
| sex   | varchar(255) | YES  |     | NULL    |       |
| age   | int          | YES  |     | NULL    |       |
| dept  | varchar(255) | YES  |     | NULL    |       |
+-------+--------------+------+-----+---------+-------+
```

配置文件写入连接信息

```properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/Student?userSSL=false
jdbc.username=root
jdbc.password=@Zhangyize020110
```
然后在我们的mybatis核心配置文件中利用这些连接信息初始化dataSource

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

</configuration>
```
接着我们需要配置mybatis的mapper，也是在这个文件里面，但是在此之前需要写好一份数据访问层Dao和 domain表层

```java
// com.snopzyz.domain.Student.java

/*
	只要保证属性和字段能对上即可
    setter、getter、constructor、toString直接拿IDEA生成即可
*/

package com.snopzyz.domain;

public class Student {

    private String no;
    private String name;
    private String sex;
    private int age;
    private String dept;

    public Student(String no, String name, String sex, int age, String dept) {
        this.no = no;
        this.name = name;
        this.sex = sex;
        this.age = age;
        this.dept = dept;
    }

    @Override
    public String toString() {
        return "Student{" +
                "no='" + no + '\'' +
                ", name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                ", age=" + age +
                ", dept='" + dept + '\'' +
                '}';
    }

    public String getNo() {
        return no;
    }

    public void setNo(String no) {
        this.no = no;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }
}
```
还有一份对sql做映射的数据访问层

```java
// com.snopzyz.dao.StudentDao.java

package com.snopzyz.dao;

import ...;

public interface StudentDao {

    @Insert("insert into student(no,name,sex,age,dept)values(#{no},#{name},#{sex},#{age},#{dept})")
    boolean insert (Student student);

    @Delete("delete from student where no=#{no}")
    void deleteByNo (String no);

    @Update("update student set name=#{name},sex=#{sex},age=#{age},dept=#{dept} where no=#{no}")
    void update (Student student);

    @Select("select * from student")
    List<Student> findAll ();

    @Select("select * from student where no=#{no}")
    Student findByNo (String no);

}
```
然后我们就可以往核心配置文件里面添加mapper了

```xml
<!-- mybatis-config.xml -->
...
    <mappers>
        <package name="com.snopzyz.dao"/>
    </mappers>
...
```
至于使用，就是以![](https://cdn.nlark.com/yuque/__latex/5d7413a2b884f62112b8bd11aade23be.svg)为连接会话的建立
其中![](https://cdn.nlark.com/yuque/__latex/f138c5920d4eda79fc8bf0690569f4df.svg)生成工厂的过程中需要加载文件配置类
最后通过![](https://cdn.nlark.com/yuque/__latex/8cd6348f81d9dcb07128947d265d8165.svg)可以调用`getMapper`获取到我们写好的dao层类，来调用sql语句并获取结果
如果是写事件，一定要将![](https://cdn.nlark.com/yuque/__latex/3fa296b8d9b5054972a325510924d343.svg)进行`commit`，因为mybatis是事务驱动，不提交不会产生持久化修改

