---
title: SpringBoot 移植环境配置文件
---

用 `.properties`、`.yaml`、`.yml` 来做配置  

## 环境设置

这里以修改运行端口号为例  
springboot 默认运行端口号为 8080 这里给出修改为 80 的方式

1.在给出的 `/src/main/resources/application.properties` 中添加（最优先）

```properties
server.port=80
```

**2.新建 `/src/main/resources/application.yml` 添加**（次优先）

```yml
server:
    port: 80
```

3.新建 `/src/main/resources/application.yaml` 添加（最不优先）

```yaml
server:
    port: 80
```

::: danger 可能在后面新加的文件中无法自动补全，这里给出设置方式：  

1.右上角设置进入 Project Structure  
![20231002124937](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002124937.png)    
2.在Facets选项中点击加号创建Spring并将本项目导入  
![20231002125046](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002125046.png)  
3.点击这个小树叶并添加我们创建的两个配置文件  
![20231002125433](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002125433.png)  
4.点击加号后选择这两个文件后确认  
![20231002125933](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002125933.png)  
  
此时就有了这两个配置文件  
![20231002125956](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002125956.png)  
再使用时就存在自动补全了
:::

## 配置读取

### @Value

yaml 文件格式其实就是一种前缀提取，这里给出数据提取案例  
这是我们的 yaml 文件

```yaml
# application.yaml

lession: SpringBoot

server:
  port: 80

enterprise:
  name: snopzyz
  age: 21
  qq: 1411390466
  subject:
    - C/C++
    - Java后端框架
    - 算法与数据结构
```

对于正常变量，接收的时候将层级关系当成带 `.` 的前缀  
对于数组变量，接收的时候将元素通过下标提取

```java
// Controller.java

...
    @Value("${lession}")
    private String lession;

    @Value("${server.port}")
    private int port;

    @Value("${enterprise.subject[0]}")
    private String subject_00;
...
```

### Environment

当然还有一种自动装配 `Environment` 成员变量，可以通过内置方法 `getProperty` 获取参数（区别于上面，不用加 `${}` ）  

```java
    @Autowired
    private Environment environment;

    @RequestMapping
    public String find () {
        System.out.println(environment.getProperty("enterprise.subject[0]"));
        ...
    }
    ...
```

### ConfigurationProperties(prefix = "")

这种可以利用配置文件中的某个前缀下的变量生成一个 bean  

```java
// Enterprise.java

@Component
@ConfigurationProperties(prefix = "enterprise")
public class Enterprise {
    private String name;
    private int age;
    private String qq;
    private String[] subject;

    ... // setter/getter/tostring
}
```

之后利用自动装配直接在类里面用即可

```java
// Controller.java

@RestController
@RequestMapping("/user")
public class Controller {

    @Autowired
    private Enterprise enterprise;

    @RequestMapping
    public String find () {
        System.out.println(enterprise);
        return "get successfully";
    }
}
```

## 多环境

这里以不同环境不同端口号为例

- $dev$ 环境：开发环境，端口号 $8080$
- $pro$ 环境：生产环境，端口号 $8081$
- $test$ 环境：测试环境，端口号 $8082$

### yml 文件

在一个 yml 文件中区分不同的生产环境用 `---`  

```yml
# application.yml

server:
  port: 8080

---

server:
  port: 8081

---

server:
  port: 8082
```

在每一个里面做标注环境名用 `spring.config.active.on-profile: <环境名>`  
例如开发环境用  

```yml
# application.yml

...

---
spring:
  config:
    activate:
      on-profile: dev
server:
  port: 8080
---

...
```

标注当前使用的环境名需要再开一块儿，用 `spring.profiles.activate: <使用环境名>`  

```yml
# application.yml

spring:
  profiles:
    active: pro
---
# 开发环境

spring:
  config:
    activate:
      on-profile: dev

server:
  port: 8080

---
# 生产环境

spring:
  config:
    activate:
      on-profile: pro

server:
  port: 8081

---
# 测试环境

spring:
  config:
    activate:
      on-profile: test
server:
  port: 8082
```

这样就是使用的生产环境

### properties 文件

在主配置文件中写 `spring.profiles.active=<启用环境名>`  
然后在同级新建一个文件 `application-<环境名>.properties` 里面标注要设置的环境的变量

我这里启用 $dev$ 环境，并令其打开 $8080$ 端口

```properties
# application.properties

spring.profiles.active=dev
```

```properties
# application-dev.properties

server.port=8080
```

## 命令行环境变量

删除除了 yml 配置以外的别的配置  
先打包，然后进入命令行  
只运行  

```sh
java -jar springboot_demo-0.0.1-SNAPSHOT.jar
```

是用我们上一步配的 pro 环境 8081

![20231002195821](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002195821.png)  
(下面的就不演示了，可以自己去找)  

在命令行中按配置文件中相同的参数命名格式，也就是  

```yml
spring:
  profiles:
    active: pro

---

...
```

并加上前缀 `--` 修改环境为 test，端口号将会变为 8082  

```sh
java -jar springboot_demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=test
```

同理我们也可以自定端口号为83，一样用命令行参数的方式 `--server.port=83`

```sh
java -jar springboot_demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=test --server.port=83
```

::: danger 中文打包失败

进入 Settings 后  
选中侧边栏 File Encodings   
在右侧将 Project Encoding 改为 UTF-8

![20231002195014](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231002195014.png)

:::

## Maven 与 Boot 多环境兼容

在 [Maven讲解多环境配置](../Maven.html#多环境配置) 中，我们学过在 pom 文件内配置  
并使用 `<properties>` 来创建变量，这里已经给好了配置，变量仅仅存放要用 boot 打开哪个环境  

```xml
<!-- pom.xml -->

<profiles>
    <!-- 开发环境 -->
    <profile>
        <id>dev</id>
        <properties>
            <profiles.active>dev</profiles.active>
        </properties>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
    </profile>
    <!-- 生产环境 -->
    <profile>
        <id>pro</id>
        <properties>
            <profiles.active>pro</profiles.active>
        </properties>
    </profile>
    <!-- 测试环境 -->
    <profile>
        <id>test</id>
        <properties>
            <profiles.active>test</profiles.active>
        </properties>
    </profile>
</profiles>
```

对于非 Java 类的操作要求加载 Maven 对应的属性，解析 `${}` 占位符  
将 pom 能在 resources 配置文件中使用，引入插件 maven-resources-plugins  

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
    <version>3.3.1</version>
    <configuration>
        <encoding>UTF-8</encoding>
        <useDefaultDelimiters>true</useDefaultDelimiters>
    </configuration>
</plugin>
```

紧接着在 yml 中这样写即可完成 pom.xml 控制环境选择了  
打包时使用命令 `maven package -P <环境名称>` 即可控制环境选择

```yml
# application.yml

spring:
  profiles:
    active: ${profiles.active}
---

...
```

## 多级配置文件

- 打包上线：./ 为 jar 包的所在目录
  * ./config/application.yml（优先级最高）
  * ./application.yml
- 本地开发：classpath 为 resources 目录
  * classpath: config/application.yml
  * classpath: application.yml（优先级最低）