---
title: Maven 工程上线跳过测试
---

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