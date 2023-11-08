---
title: 基本命令
---

## 基本介绍

docker 命令可以去查阅 [官方文档](https://docs.docker.com/)  
我们下面介绍几个常用的  

- 镜像仓库
  - `docker pull`：从镜像仓库中拉取镜像
  - `docker push`：将做好的镜像推送到镜像仓库中
- 本地镜像
  - `docker images`：查看本地镜像列表
  - `docker rmi`：删除某个本地镜像
  - `docker build`：通过 dockerfile 自己构建镜像打包自己的项目
  - `docker save`：将镜像保存至本地压缩文件
  - `docker load`：将压缩文件加载为镜像
- 容器
  - `docker run`：创建容器并在其中运行镜像
  - `docker stop`：暂停一个容器
  - `docker start`：将停掉的容器进程做启动（注意区分 docker run）
  - `docker ps`：查看当前容器们的运行状态，会给出一个表格
    - CONTAINER ID：容器生成时返回的容器 id 的前一部分，用作标识不同容器
    - IMAGE：容器使用的镜像
    - COMMAND：容器运行时内部的启动命令
    - CREATED：容器创建时间
    - STATUS：容器运行状态
    - PORTS：容器运行的端口映射
    - NAME：容器名称
  - `docker rm`：删除容器
  - `docker logs`：查看容器运行日志
  - `docker exec`：进入到容器内部

## 实践练习

做一下拉取 Nginx 镜像、创建并运行 Nginx 容器

1. **拉取 Nginx 镜像** 

<p></p>  

```sh
docker pull nginx:latest
```

![20231107192737](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107192737.png)

2. **查看本地镜像列表**

<p></p>

```sh
docker images
```

![20231107192822](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107192822.png)

3. **保存 Nginx 镜像为 tar 包**

<p></p>

```sh
docker save -o nginx.tar nginx:latest
```

运行后就会发现当前目录下多了一个 nginx.tar 的包  
![20231107192940](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107192940.png)

4. **删除 Nginx 镜像**

<p></p>

```sh
docker rmi nginx:latest
```

删除后打开列表确定没有 nginx 镜像了  
![20231107193112](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107193112.png)

5. **加载 Nginx 镜像**

<p></p>

```sh
docker load nginx.tar
```

![20231107193219](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107193219.png)

6. **创建运行 Nginx 容器，并查看**

<p></p>

```sh
docker run -d --name nginx -p 80:80 nginx
# 查看现在状态
docker ps
```

![20231107193401](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107193401.png)

如果要查看更清晰的自定义的效果可以加上 `--format` 参数后跟格式字符串  

```sh
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"
```

![20231107201636](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107201636.png)  

当然如果不想每次都写这么长的话可以给这条语句添加 `alias` 别名  

7. **停止容器**

<p></p>

```sh
docker stop nginx
# 查看现在状态，看到的都是启动的容器
docker ps
# 要看到所有的容器要加 -a 参数
docker ps -a
```

![20231107193848](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107193848.png)

8.  **再次启动容器**

<p></p>

```sh
docker start nginx
```

![20231107193937](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107193937.png)

9.  **进入 Nginx 容器**

<p></p>

```sh
docker exec -it nginx bash
```

可以看到执行之后进入到了另一个命令行  
![20231107194034](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107194034.png)

为此我们可以进入 mysql 容器内部操作 mysql  

```sh
docker exec -it mysql bash
mysql -u root -p
...
```

![20231107194713](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107194713.png)

还有一种更方便的我们如果有要执行的命令，直接在容器外部带着命令一起 `exec` 即可。  

```sh
docker exec -it mysql mysql -u root -p
...
```

![20231107194837](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107194837.png)

10. **删除之前的mysql容器**

直接 `docker rm ...` 删除一个运行中的容器会失败  
![20231107194220](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107194220.png)  

需要先暂停再删除  

```sh
docker stop mysql2
docker rm mysql
```

![20231107194249](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107194249.png)

或者带上 `-f` 参数强力删除

```sh
docker rm mysql -f
```

![20231107194338](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107194338.png)

11. **本地浏览器访问nginx**

ip 是 centos 虚拟机的访问网口，port 是容器运行的进程的端口  
![20231107202229](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107202229.png)