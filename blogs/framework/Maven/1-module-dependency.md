---
title: 模块间的依赖关系
---

## 冲突

* 同一 pom.xml 配置文件配置了相同依赖的不同版本，靠后的覆盖靠前的
* 同层间接依赖中，相同依赖的不同版本，靠前的覆盖靠后的
* 依赖树的深度越小，越优先

实际使用的时候，idea右侧maven依赖关系，展示出来的是什么版本我们就用什么版本

## 可选依赖

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

## 排除依赖

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

## 聚合与继承

### 聚合

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

### 继承

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

## 区别

### ❓ 聚合与继承的区别

聚合用于快速构建（一处编译，多处编译）
继承用于快速配置（一处依赖版本修改，多处依赖版本修改）

聚合是在当前模块配置关系，可以知道都有哪些模块参与聚合
继承是在子模块中配置关系，父模块无法知道都是谁继承自己

### ❓ 依赖与继承的区别

依赖：工程 $A$ 会将被依赖工程 $B$ 下的所有依赖 $B.dependencies$ 全部进行依赖  
继承：子工程会依赖父工程的依赖，同时父工程依赖管理器下的依赖必须由子工程手动依赖才可完成