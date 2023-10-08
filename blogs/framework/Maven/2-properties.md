---
title: 属性参数在多场合下应用
---

为了简化编写、修改相同的版本号，诞生了属性

```xml
<!-- pom.xml -->

...
	<properties>
    <spring.version>5.2.10.RELEASE</spring.version>
  </properties>
...
	<dependencies>
    <dependency>
      ...
      <version>${spring.version}</version>
    </dependency>
  </dependencies>
...
```
如果这份属性想给自己以及继承自己的子工程下 所有的 resources 文件使用
这里以想把 jdbc.url 在 pom 中写好，然后给 resources 下的 jdbc.properties 使用

![20231002215043](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215043.png)

这个是工程目录，先在父工程的pom.xml中把属性设置好，然后用build设置resource生效路径

```xml
<!-- fa-project/pom.xml -->

...
	<properties>
      <jdbc.url>jdbc:mysql://localhost:3306/learn_info?useSSL=false</jdbc.url>
  </properties>

  <build>
      <resources>
          <resource>
              <directory>${project.basedir}/src/main/resources</directory>
              <filtering>true</filtering>
          </resource>
      </resources>
  </build>
...
```
然后子工程中继承一下

```xml
<!-- son-project/pom.xml -->

...
	<parent>
    <groupId>com.snopzyz</groupId>
    <artifactId>fa-project</artifactId>
    <version>1.0-SNAPSHOT</version>
  </parent>
...
```
在 resources 的 jdbc.properties 中就写一个看看效果

```properties
# son-project/src/main/resources/jdbc.properties

jdbc.url = ${jdbc.url}
```
挨个打包后，在`~/.m2/repository/com/snopzyz/son-project`的 jar 包中找到这个 jdbc.properties 看看数据

![20231002215056](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215056.png)

可以看到内容已经变动过了，完成

## 多环境配置

可能不同的环境需要不同的属性，比如：

* 开发环境用 127.0.0.1/learn\_info 数据库
* 发布环境用 127.1.1.1/learn\_info 数据库
* 测试环境用 127.2.2.2/learn\_info 数据库

那么我们之前的属性就要将其给不同的开发环境做出区别

开发环境集合在 xml 中用`profiles`标签，然后对一个开发环境做`profile`
命名用`id`，属性就和我们上面的一样用`properties`

```xml
<!-- son-project/pom.xml -->

...
<profiles>
    <!-- 开发环境 env_develop -->
    <profile>
        <id>env_develop</id>
        <properties>
            <jdbc.url>jdbc:mysql://127.0.0.1:3306/learn_info?useSSL=false</jdbc.url>
        </properties>
        <!-- 设置为默认开发环境 -->
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
    </profile>
    <!-- 发布环境 env_release -->
    <profile>
        <id>env_release</id>
        <properties>
            <jdbc.url>jdbc:mysql://127.1.1.1:3306/learn_info?useSSL=false</jdbc.url>
        </properties>
    </profile>
    <!-- 测试环境 env_test -->
    <profile>
        <id>env_test</id>
        <properties>
            <jdbc.url>jdbc:mysql://127.2.2.2:3306/learn_info?useSSL=false</jdbc.url>
        </properties>
    </profile>
</profiles>

<build>
    <resources>
        <resource>
            <directory>${project.basedir}/src/main/resources</directory>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>
...
```
在我们用终端发布的时候，调用命令

```sh
mvn install -P <环境名称>
```
比如

```sh
mvn install -P env_release
```
不加 `-P` 的时候就是用的我们这里默认的开发环境

在 IDEA 中调用命令可以采用：

1. 点击这个按钮

![20231002215110](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215110.png)

2. 在弹窗的右上角选我们想运行的模块

![20231002215116](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215116.png)

3. 然后在输入框内执行想要调用的指令（可以发现指令是有历史记录的），点击回车即可运行

![20231002215123](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215123.png)