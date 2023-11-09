---
title: 自制镜像
---

镜像是系统库、文件等环境以及项目打包出来的”压缩包“，可以通过镜像来完成项目的迅速部署。  
镜像是有层级关系的
1. 基础镜像包含了函数库、环境、配置文件等，相当于项目部署的平台（如 ubuntu20.04:latest）
2. ...中间是很多层的自定义配置，比如 Java 项目就应当安装 jre 拷贝 jar 包等等...
3. 启动入口是用来根据入口在容器创建时启动我们的镜像

这些不同的层会以压缩包的形式放入仓库中，每当使用的时候按顺序从仓库中加载环境，完全构建一个镜像不需要我们一个个压缩和拷贝，需要用到一种文件 `Dockerfile`  

## Dockerfile 语法

### 介绍 

一个类似于 shell 的脚本文件  
下面是指令的介绍，更多指令在[这里](https://docs/docker.com/engine/reference/builder)  

指令|说明|示例
-|-|-
FROM|指定基础镜像|`FROM centos:7`
ENV|设置环境变量供后面指令使用|`ENV key value`
COPY|拷贝本地文件到镜像的指定目录|`COPY ./jre11.tar.gz /tmp`
RUN|执行shell命令|`RUN tar -zxvf /tmp/jre11.tar.gz && EXPORTS path=/tmp/jre11:$path`
ENTRYPOINT|镜像中应用的启动命令，容器运行时调用|`ENTRYPOINT java -jar xx.jar`

### 文件演示

我们做了一个调用 ubuntu:16.04 环境下 java8 的应用程序 docker-demo  
主要就是先指定基础环境 $\rightarrow$ 加一些

```dockerfile
# 指定基础镜像
FROM ubuntu:16.04
# 配置环境变量
ENV JAVA_DIR=/usr/local
# 将项目中 jdk 和 java 项目的包拷贝到镜像中指定位置
COPY ./jdk8.tar.gz $JAVA_DIR/
COPY ./docker-demo.jar /tmp/app.jar
# 安装 jdk
RUN cd $JAVA_DIR && tar -xf ./jdk8.tar.gz && mv ./jdk1.8.0_144 ./java8
# 配置环境变量
ENV JAVA_HOME=$JAVA_DIR/java8
ENV PATH=$PATH:$JAVA_HOME/bin
# 入口
ENTRYPOINT ["java", "-jar", "/app.java"]
```

当然也有已经做好的 jdk 镜像，我们以它为基础镜像构建项目部署就方便了很多  

```dockerfile
# 基础镜像
FROM openjdk:11.0-jre-buster
# 拷贝 jar 包
COPY ./docker-demo.jar /app.jar
# 入口
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

这样就可以很简单地制作好一个镜像了。  

## 镜像构建案例

如果已经做好了 dockerfile，可以用下面的命令来构建镜像：  

```sh
docker build -t myImage:1.0 .
# 解读为：docker 生成镜像 起名 [repository]:[tag] Dockerfile所在目录
```

<a href="https://github.com/Chivas-Regal/Tech/raw/main/static/docker/docker-demo.jar" download>这里<Badge type="tip" text="download" vertical="top" /></a>做了一个非常简单的 SpringBoot 程序  
功能就是接收到 `/demo/{name}` 的请求，响应一个 `Hello {name} !` 的字符串  
然后我们在这个 jar 包同级目录下做一个 Dockerfile  

```Dockerfile
# 基础镜像
FROM fabric8/java-alpine-openjdk8-jdk
# 拷贝 jar 包
COPY ./docker-demo.jar /app.jar
# 入口
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

做好的文件目录如下  
![20231108205603](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108205603.png)  

然后我们分别执行命令（这里将 docker-demo 文件夹放到了 /root 下）    

```sh
# 进入到带有 dockerfile 的目录下
cd /root/docker-demo
# 构建镜像，名为 docker-demo，版本是 1.0
docker build -t docker-demo:1.0 .
# 检测本地是否存在该镜像
docker images
# 用该镜像运行容器，容器名为dd
docker run -d --name dd -p 8080:8080 docker-demo:1.0
```
![20231108205817](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108205817.png)  

然后在浏览器做我们刚刚的那个访问，格式为 `http://[你的虚拟机ip]:8080/demo/{请求路径变量}`  
这里以 `http://xxx.xx.xx.x:8080/demo/good` 举例    

![20231108210019](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108210019.png)  
成功得到了我们想要的响应  


