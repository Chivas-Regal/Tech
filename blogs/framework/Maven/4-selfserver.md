---
title: 私服工具的使用
---

私服是本地仓库与中央仓库的中间层仓库，下载软件 [nexus](https://help.sonatype.com/repomanager3/product-information/download) ，进入 bin 目录下，调用命令 `./nexus run`
在建立完成后进入 localhost:8081 即可操作私服

## 本地仓库访问私服权限

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
## 本地工程发布到私服

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

