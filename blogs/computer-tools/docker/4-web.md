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

先给之前创建的 mysql 容器添加数据  

```sh
# 进入 mysql 容器
docker exec -it mysql mysql -u root -p
输入密码> ...

# 执行 sql 语句创建 sqlproject 库并导入 sqlproject.user 表
CREATE DATABASE sqlproject;
USE sqlproject;
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint(0) NOT NULL COMMENT '主键',
  `username` varchar(20) NOT NULL COMMENT '用户名',
  `password` varchar(20) NOT NULL COMMENT '密码'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_bin COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

# 给 sqlproject.user 表添加数据
INSERT INTO `user` VALUES
    (1, 'admin', '123'),
    (2, 'snopzyz', '123456'),
    (3, 'demo', '654321');
```

然后创建一个 chivasregal 网络并将其 `connect` 进去  

接着我们做一个丐版 springboot 项目的 jar 加到容器内  
配置文件连接到 mysql 链接这样写  
![20231109110350](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231109110350.png)  
mysql 作为 host 名是因为我们可以同一网络的容器内通过容器名通信，也就意味着我们把 hostname 换做 mysql 即可自动访问同一网络下的名为 mysql 的容器，也就是我们之前创建的容器    

然后将项目打包，打包后的放在 <a href="../../../static/docker/sqlproject.jar" download>这里</a> 可以直接获取  

做好 Dockerfile 后与 jar 包一起放在 /root/sqlproject 目录下  

```dockerfile
# 基础镜像
FROM fabric8/java-alpine-openjdk8-jdk
# 设定时区
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# 拷贝 jar 包
COPY ./sqlproject.jar /app.jar
# 入口
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

部署镜像并以 chivasregal 为网络启动  
![20231109114706](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231109114706.png)  

启动后访问 `http://[虚拟机ip]:8081/user/list`    
  
![20231109114732](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231109114732.png)  
这样就说明成功访问到了我们之前调用 sql 语句填入的数据  


## 问题解决

### 虚拟机挂起后再恢复，容器自定义网络在外部无法连接

在虚拟机挂起后主机重启等情况后可能会出现之前自定义的网桥在 `ip a` 下没有 ip 地址  

![20231109122109](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231109122109.png)   

此时连上这个网桥的容器内的程序启动时，我们也无法在我们自己的主机下访问。  

![20231109122039](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231109122039.png)

访问也会超时失败
![20231109122143](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231109122143.png)  

**解决办法：重启 docker**  

```sh
systemctl restart docker
```

ip 网桥恢复  

![20231109131007](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231109131007.png)

访问页面恢复

![20231109131143](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231109131143.png)