---
title: 安装与入门
---

## 安装与加速

安装 yum 工具与 docker-yum 源

```sh
yum install -y yum-utils
yum-config-manager  --add-repo  http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 安装好了之后会报：repo saved to /etc/yum.repos.d/docker-ce.repo
```

安装 docker  

```sh
yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

docker 启动与安装校验  

```sh
systemctl enable docker # 每次开机自动启动 docker
systemctl start docker # 启动 docker

# 测试
docker images
```
一个空的 docker 若给出 `REPOSITORY TAG ...` 这样的内容，说明 docker 安装成功了

## 阿里云镜像加速

进入阿里云顶栏选择“产品”，下框左侧选择“容器”，右侧选择“容器镜像服务ACR”，进入控制台  
![20231107155356](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107155356.png)   
  
进入镜像加速器找到地址  
![20231107155612](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107155612.png)    

根据下面的操作文档中选择自己的系统进行操作，可以全部复制到自己的控制台  

## 部署操作 

### 部署 MySQL

给出部署 mysql 服务的命令，先跑一下这个命令看看。  

```sh
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123 \
  mysql
```

等待一段下载后命令实行完毕。  
![20231107160109](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107160109.png)  
然后根据你当前虚拟机 ip 创建一个 MySQL 连接试一下。  
![20231107160843](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107160843.png)  
发现能成功连上了，这全部都得益于 docker 的简化启动。  

这么方便是因为 docker 在安装应用时，会从一个公共仓库中将应用的环境、配置、系统函数库以及自己在内的“所有文件”一起下载到一个自建的隔离环境里面，这个公共仓库是[**镜像仓库 Docker Hub**](hub.docker.com)，“所有文件”是指**镜像**，隔离环境是指**容器**。   
国外的镜像仓库很慢，我们前面做的加速就是用了阿里云的国内仓库。  
  
为了检测隔离性我们可以再安转一台 MySQL  
```sh
docker run -d \
  --name mysql2 \
  -p 3307:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123 \
  mysql
```

![20231107182812](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107182812.png)  
此时就成功地又启动了一台，这样我们可以通过多个容器来在同一个主机上部署一个 MySQL 集群。  

### 部署解读

针对我们上面一开始的命令  

```sh
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123 \
  mysql
```

其中 `docker run` 创建容器
- `-d`：后台运行容器
- `--name `：给容器起名字，需唯一
- `-p <容器进程>:<内部进程>`：设置端口映射<br/>我们容器跑在宿主机一个 `<内部进程>` 的进程上。同时容器也相对的算是一个子宿主机，内部有一个虚拟的容器内端口 `<内部进程>` 跑我们安装的服务
- `-e KEY=VALUE`：设置环境变量，不同的镜像需要不同的环境变量
- `mysql`：指定运行的镜像的名字从仓库中下载，规范化应该是 `[repository]:[tag]`，这里也就是 `mysql:5.7`
  - `repository`：镜像名
  - `tag`：镜像版本（默认 latest 代表最新版本）
