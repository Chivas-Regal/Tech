---
title: maven
---

## 使用

用来管理项目的，以 pom.xml 做配置（Project Object Model 工程对象模型）

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

## 模块依赖关系

### 冲突

* 同一 pom.xml 配置文件配置了相同依赖的不同版本，靠后的覆盖靠前的
* 同层间接依赖中，相同依赖的不同版本，靠前的覆盖靠后的
* 依赖树的深度越小，越优先

实际使用的时候，idea右侧maven依赖关系，展示出来的是什么版本我们就用什么版本

### 可选依赖

**当前模块所引用的依赖不想给别人用**

对依赖下方写 `<option>false` 标签，可以完成对依赖的隐藏（默认是 `false`

```xml
<!-- pom.xml -->

...
	<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
        <option>true</option>
    </dependency>
  </dependencies>
...
```
当前工程 $A$ 隐藏了某个依赖，当前工程 $A$ 在被别的工程 $B$ 引用时会隐藏这个依赖， $B$ 将无法使用 $A$ 隐藏的依赖  
可用于解决版本冲突  

### 排除依赖

**调用别的模块时不想引用它里面的部分依赖**

在`<dependency>`内使用 `<exclusions></exclusions>`，然后在里面再添加`<exclusion>`后，加入不想引用的依赖坐标即可完成排除

```xml
<!-- pom.xml -->

...
	<dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>5.2.10.RELEASE</version>
      <exclusions>
          <exclusion>
              <groupId>org.springframework</groupId>
              <artifactId>spring-context</artifactId>
          </exclusion>
      </exclusions>
  </dependency>
...
```
这样就完成了对spring-webmvc内的spring-context功能的排除

### 聚合与继承

#### 聚合

使用一个“根”工程来管理多个模块一并更新，这个根工程只有一个pom.xml文件

区别是，我需要在这个根工程的坐标下添加一个 `<packaging>pom</packaging>`
然后利用 `<modules>` 下面建立多个 `<module>` 来管理工程

比如同级下有三个工程 `project1,project2,project3`，有一个`project0`对它们做统一管理

```xml
<!-- pom.xml -->

...
	<groupId>com.snopzyz</groupId>
	<artifactId>project0</artifactId>
	<version>1.0.0</version>
	<packaging>pom</packaging>

	<modules>
    <module>../project1</module>
    <module>../project2</module>
    <module>../project3</module>
  </modules>
...
```
在这个 module 内不管顺序如何，都会以 maven 树中的后序遍历顺序完成更新（先更新叶子结点）

#### 继承

使用一个父工程 `fa-project` 引用了几个依赖，然后在子工程 `son-project` 中继承它后，父工程依赖项中的版本发生变化时，子工程的依赖项版本也自动变化

父工程

```xml
<!-- fa-project/pom.xml -->

...
	<dependencies>
    <dependency>
      <groupId>com.snopzyz</groupId>
      <artifactId>ext-dep1</artifactId>
      <version>1.0.0</version>
    <dependency>
  </dependencies>
...
	<dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.snopzyz</groupId>
        <artifactId>ext-dep2</artifactId>
        <version>1.0.0</version>
      <dependency>
    </dependencies>
  </dependencyManagement>
```
这里意思是我们父工程正常依赖于ext-dep1，然后用依赖管理器管理ext-dep2
区别是，当子工程继承父工程时，一定会依赖ext-dep1，但是依不依赖ext-dep2就需要自己选择了（且不加版本号）

子工程

```xml
<!-- son-project/pom.xml -->

...
	<parent>
    <groupId>com.snopzyz</groupId>
    <artifactId>fa-project</artifactId>
    <version>1.0.0</version>
    <relativePath>../fa-project/pom.xml</relativePath>
  </parent>
...
	<dependencies>
    <dependency>
      <groupId>com.snopzyz</groupId>
      <artifactId>ext-dep2</artifactId>
    <dependency>
  </dependencies>
```
这样就表示我两个都继承，如果子工程下`<dependencies>`内不写ext-dep2，那么就不会继承

### 区别

#### ❓ 聚合与继承的区别

聚合用于快速构建（一处编译，多处编译）
继承用于快速配置（一处依赖版本修改，多处依赖版本修改）

聚合是在当前模块配置关系，可以知道都有哪些模块参与聚合
继承是在子模块中配置关系，父模块无法知道都是谁继承自己

#### ❓ 依赖与继承的区别

依赖：工程 $A$ 会将被依赖工程 $B$ 下的所有依赖 $B.dependencies$ 全部进行依赖  
继承：子工程会依赖父工程的依赖，同时父工程依赖管理器下的依赖必须由子工程手动依赖才可完成

## 属性

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

### 多环境配置

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

## 跳过测试

![20231002215133](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215133.png)

这样的目录下，有两个工程功能类 Dao 和 Service ，以及它对应的两个测试类

先打包一下

![20231002215139](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215139.png)

看到这个说明我们用的是 maven-surefire-plugin 的 3.0.0 版本
在插件中在 `<build><plugins></plugins></build>` 配置一下这个插件

```xml
<!-- pom.xml -->

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.0.0</version>
    <configuration>
        <!--
      			 如果这里是 true 代表跳过所有的测试类
      			 现在是跳过任意包下的 ServiceTest.java ，仅保留 Dao 的测试
        -->
        <skip>false</skip>
        <!-- 除了 -->
        <excludes>
            <!-- 除了任意包下的 ServiceTest.java 类不测试 -->
            <exclude>**/ServiceTest.java</exclude>
        </excludes>
    </configuration>
</plugin>
```
再点击下载会只有 Dao 的相关测试

![20231002215151](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215151.png)

## 私服

私服是本地仓库与中央仓库的中间层仓库，下载软件 [nexus](https://help.sonatype.com/repomanager3/product-information/download) ，进入 bin 目录下，调用命令 `./nexus run`
在建立完成后进入 localhost:8081 即可操作私服

### 本地仓库访问私服权限

我们先新建两个仓库作为 SNAPSHOT 和 RELEASE  

![20231002215208](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215208.png)

列表选择maven2(hosted)，设置这三个地方

![20231002215215](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215215.png)

![20231002215221](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215221.png)

另一个 release 版本的也同理

然后点击进入 maven-public 仓库组，在最下面将这两个仓库放入管理

![20231002215228](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215228.png)

紧接着需要在 maven 本地仓库配置里面加入私服设定

1. 在`<servers>`内添加`<server>`，目标为两个仓库
  
<p></p>
  
```xml
<!-- <mavenPath>/conf/settings.xml -->

...
  <server>
    <id>snopzyz-snapshot</id>
    <username>admin</username>
    <password>admin</password>
  </server>
  <server>
    <id>snopzyz-release</id>
    <username>admin</username>
    <password>admin</password>
  </server>
...
```
2. 在镜像`<mirror>`内加入仓库组配置
  
<p></p>
  
```xml
<!-- <mavenPath>/conf/settings.xml -->

...
  <mirror>
    <id>maven-public</id>
    <mirrorOf>*</mirrorOf>
    <url>http://localhost:8081/repository/maven-public/</url>
  </mirror>
...
```
### 本地工程发布到私服

在工程的 pom 文件中加入下面内容

```xml
<!-- pom.xml -->

<distributionManagement>
    <!-- 发布版本的仓库 -->
    <repository>
        <id>snopzyz-release</id>
        <url>http://localhost:8081/repository/snopzyz-release/</url>
    </repository>
    <!-- 快照版本的仓库 -->
    <snapshotRepository>
        <id>snopzyz-snapshot</id>
        <url>http://localhost:8081/repository/snopzyz-snapshot/</url>
    </snapshotRepository>
</distributionManagement>
```
也可以只写发布版也可以只写快照版，这取决于要发布什么版本的，和本工程版本挂钩

![20231002215238](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215238.png)

然后点击 deploy 后即可去私服中查找，这里发布快照版

![20231002215245](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215245.png)

可以看到私服中已经存在了

::: danger 如果 idea 依旧无法发布，检查一下这里是否为对应路径

![20231002215252](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002215252.png)

:::

