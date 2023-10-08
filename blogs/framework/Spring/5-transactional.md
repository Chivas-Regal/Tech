---
title: Spring 事务
---

## 银行转钱案例

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

## Service 负面例子

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

## 解决方案

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

## 事务传播行为

![20230928193538](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193538.png)

用类似于这样的方式来设置：`@Transactional(propagation= Propagation.REQUIRES\_NEW)`