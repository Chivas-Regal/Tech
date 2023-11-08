---
title: 网络
---

**Docker 会在宿主机上搭建一个虚拟网口，默认容器都是以桥接的形式连接到这个网桥上。**  

调用 `docker inspect` 后跟随便一个容器名，找到给出的如下信息  
![20231108210953](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108210953.png)  
并且在执行 `ip a` 时看到有如下的展开  
![20231108211027](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108211027.png)  
这都说明我们 Docker 搭建了一个名为 docker0 的网口，容器在配置中自己的 ip 和网关都和它有联系。  

且我们尝试在一个容器中 ping 另一个容器的 ip 地址也是可以 ping 通的，但是每次这个 ip 都是顺序分配的不固定，我们要构建自定义的网络来让它们互相访问。

## 自定义网络

加入自定义网络的容器才可以互相访问，我们的命令均为  
`docker network ` +   
  
命令|说明
-|-
`create` | 创建一个网络
`ls` | 查看所有网络
`rm` | 删除指定网络
`purn` | 清除未使用的网络
`connect` | 使指定容器加入某网络
`disconnect` | 使指定容器离开某网络
`inspect` | 查看网络详情 

我们现在将 mysql 和 nginx 都加入一个名为 snopzyz 的网桥  

1. **创建 snopzyz 网桥**  

<p></p>

```sh
docker network create snopzyz
```

![20231108212305](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108212305.png)  
此时这里多出了一个 NAME=snopzyz 的 docker 网络，同时我们再看一样宿主机的网口信息  

```sh
ip a
```

多出了这样一个网口，就是我们的 snopzyz 网口  

![20231108212407](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108212407.png)

2. **将 nginx 和 mysql 加入网络**  

<p></p>

```sh
# 将已有的 nginx 加入
docker network connect snopzyz nginx
# 将已有的 mysql 删掉，以创建时加入
docker run -d --name mysql -p 3306:3306 -e TZ=Asia/Shanghai -e MYSQL_ROOT_PASSWORD=123 --network snopzyz mysql
```

我们检查一下是否装入  
![20231108213411](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108213411.png)  
都在 172.18.0 中，成功加入

## 多容器协作

我们之前在 [自制镜像](./3-self-dockerfile.html#镜像构建案例) 中给出过一个简单的项目部署  
这里给出一个加入了 mysql 连接的部署  

先给之前创建的 mysql 容器添加数据，[这里是 sql 文件](./static/reggie-mysql.sql)  

我们将《瑞吉外卖》丐版加到容器内  
配置文件连接到 mysql 链接这样写  
![20231108221159](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108221159.png)  
mysql 作为 host 名是因为我们可以同一网络的容器内通过容器名通信，也就意味着我们把 hostname 换做 mysql 即可自动访问同一网络下的名为 mysql 的容器，也就是我们之前创建的容器    

然后将项目打包，打包后的放在 [这里](./static/reggie.jar) 可以直接获取  

做好 Dockerfile 后与 jar 包一起放在 /root/reggie 目录下  

```dockerfile
# 基础镜像
FROM fabric8/java-alpine-openjdk8-jdk
# 设定时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# 拷贝 jar 包
COPY ./reggie.jar /app.jar
# 入口
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

部署镜像并以 snopzyz 为网络启动  
![20231108221637](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108221637.png)  

启动后访问 `http://[虚拟机ip]:8081/backend/page/login/login.html`    
  
![20231108221808](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231108221808.png)  
点击登录即可进入，说明我们已经连接上了 mysql 且访问到了其中的员工列表才能通过