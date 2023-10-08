---
title: 标准数据层开发
---

|功能|MP接口|
|-|-|
|新增|`int insert(T t)`|
|删除|`int deleteById(Serializable id)`|
|修改|`int updateById(T t)`|
|根据id查询|`T selectById(Serializable id)`|
|查询全部|`List<T> selectList()`|
|分页查询|`IPage<T> selectPage(IPage<T> page)`|
|按条件查询|`IPage<T> selectPage(Wrapper<T> queryWrapper)`|

## CRUD 使用

其中修改操作的参数 T ，我们 set 入 id 后，仅需要再 set 需要修改的字段（属性），别的不修改的 MP 会为其进行保留  
比如有行 `id=1, name='abc', type='char', description='lowerchar'`  
我们进行  
```java
@AutoWired
private BookDao bookDao;

...

    Book book = new Book();
    book.setId(1);
    book.setName("aaa");
    bookDao.updateById(book);
...
```

即可修改为 `id=1, name='aaa', type='char', description='lowerchar'`  
而不是像我们之前手动写会直接传入 null  

## ✅ 简化开发：lombok 简化 POJO 实体类开发  

我们 POJO 实体类里面不想自己写或者自己快捷键生成 `getter、setter、constructor` 等方法，均可以利用注解来完成

导入 lombok 坐标

```xml
<!-- pom.xml -->

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

在想自动生成方法的类上面加上下面这样的注解  

```java
// Book.java

/* 无参构造 */
@NoArgsConstructor
/* 全参构造 */
@AllArgsConstructor
/* getter */
@Getter
/* setter */
@Setter
/* toString */
@ToString
/* equals、hashCode */
@EqualsAndHashCode

... // 还有很多别的自动生成的方法

public class Book {
    ...
```

但是似乎也很长，加一个 `@Data` 可以替代这里除了构造方法之外的另外几个注解  

```java
@Data
public class Book {
    ...
```