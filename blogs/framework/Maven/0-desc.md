---
title: Maven 整体介绍
---

Maven 是用来管理项目的，以 pom.xml 做配置（Project Object Model 工程对象模型）

其标注当前工程的有三个标签

`<groupId></groupId>` 内写本工程的所属组织
`<artifactId></artifactId>` 内写本工程名
`<version></version>` 内写本工程的版本

这些是用来发布到 maven 仓库的坐标，对应的我们想用一个工程可以通过导入依赖坐标来完成

比如导入 SpringWebMVC 的坐标

```xml
<!-- pom.xml -->

...
	<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
    </dependency>
  </dependencies>
...
```
我们如果有一个工程

```xml
<!-- pom.xml -->

<groupId>com.snopzyz</groupId>
<artifactId>user-system</artifactId>
<version>1.0.0</version>
```
可以将其发布到仓库内，然后我们在别的工程想用这个模块的时候，在`<dependencies>`导入该坐标即可完成使用