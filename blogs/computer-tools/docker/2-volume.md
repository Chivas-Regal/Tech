---
title: 数据卷
---

假如我们想修改 nginx 容器内的静态资源，先在仓库中找到 [nginx 官方镜像说明](https://hub.docker.com/_/nginx)，看一下里面的地址。  
![20231107204229](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107204229.png)  
找到是在这里，但是进入容器肯定是很难做编辑的，因为这个容器是一个非常迷你的小系统，它不会自动下载和要运行的内容无关的软件包。  
因此我们需要一个可以在容器外面，能与容器内文件双向绑定的功能 —— 数据卷。  

**数据卷是一种虚拟目录，它可以与容器内的目录形成双向绑定，以便于我们修改容器内的资源。**  

## 基本命令

`docker volume `
- `create`：创建数据卷
- `ls`：查看所有数据卷
- `rm`：删除指定数据卷
- `inspect`：查看某个数据卷的详情
- `prune`：清除没有在使用的数据卷

但其实我们不需要专门做 `create`，数据卷在容器创建时用 `-v 数据卷:容器内目录` 进行挂载，如果没有的话会自动创建。  

`docker run ... 数据卷:容器内目录 ...`  

## 使用案例

### Nginx的html静态资源

1. **为了调用 `docker run` **先把旧的 nginx 容器删掉**。  

<p></p>

```sh
docker rm nginx -f
```

2. **重新创建容器运行镜像，同时挂载名为 html 的数据卷**。  

<p></p>

```sh
docker run -d --name nginx -p 80:80 -v html:/usr/share/nginx/html nginx
# 查看一下数据卷列表
docker volume ls
```

![20231107205415](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107205415.png)


3. **寻找数据卷在宿主机中的位置**

<p></p>

```sh
docker volume inspect html
# 返回的是一个 json ，位置在 Mountpoint 中
```

![20231107205606](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107205606.png)

4. **修改对应位置的文件**

进入到对应目录然后展开确认一下是不是我们需要的。  

```sh
cd /var/lib/docker/volumes/html/_data
ls
```

![20231107205910](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107205910.png)

`vim` 进入 index.html 进行修改并保存  

![20231107210025](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107210025.png)

在外部浏览器中查看容器内 nginx 首页  

![20231107210051](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107210051.png)  

修改成功

5. **添加静态资源文件**  

我们可以在这里添加新的文件以做展示，编写一个新的 hello.html 文件。  

```sh
echo "<h1>Hello Docker-Nginx</h1>" >> hello.html
```

然后再在浏览器中访问  

![20231107210408](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107210408.png)

### MySQL初始化配置

`docker inspect <容器名>`：检查某个容器的配置信息  
我们用它检查一下 mysql 的配置中有无 `Mounts` 信息  

运行指令  

```sh
docker inspect mysql
```

![20231107214628](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107214628.png)  
往下翻找打这一项：  
![20231107214719](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107214719.png)  
发现 MySQL 存在自动挂载的匿名数据卷，且是 /var/lib/mysql 这个数据保存的目录。   
这是 MySQL 为了不过度扩大容器体积而将数据文件挂载到外部宿主机中的一种策略。  
但这种匿名卷存在问题就是我如果要更新 MySQL 要删除旧容器，创建新的容器时会使数据卷生成一份新的并且绑定过去，这个旧数据卷没有被利用到，操作起来也十分麻烦。  

我们产生新的需求：基于宿主机实现 MySQL 的数据目录、配置文件、脚本初始化的挂载。  
指令：`docker run ... -v 本地目录:容器内目录 ...`  

将上面说的三种目录都找齐：
- 数据目录：刚刚看的 `/var/lib/mysql`，我们挂载到 `/root/mysql/data`
- 配置文件：在[docker仓库的官方文档](https://hub.docker.com/_/mysql)上找到  
  ![20231107220040](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107220040.png)  
  得知是 `/etc/mysql/conf.d`，我们挂载到 `/root/mysql/init`
- 初始化脚本，和上面一样操作找到这样一栏  
  ![20231107220222](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107220222.png)  
  得知是 `/docker-entrypoint-initdb.d`，我们挂载到 `/root/mysql/conf`

对应脚本为  

```sh
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e TZ=Asia/Shanghai \
  -e MYSQL_ROOT_PASSWORD=123 \
  -v /root/mysql/data:/var/lib/mysql \
  -v /root/mysql/init:/docker-entrypoint-initdb.d \
  -v /root/mysql/conf:/etc/mysql/conf.d \
  mysql
```

这其中不乏有启动时必须要准备好的文件内容