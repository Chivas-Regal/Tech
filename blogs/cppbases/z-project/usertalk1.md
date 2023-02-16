---
title: 跨局域网聊天工具（一问一答）
---

## 功能

这里希望实现一个类似于 $QQ$ 的通讯设备  
通讯双方为客户端和服务端，客户端在请求连接服务端的时候需要先登录（注册），账号和密码对应上了就可以进行聊天了  
聊天方式为客户端一句，服务端一句，一端发送了一句话，另一端会原封不动收到这句话

## 技术
（纯C++实现）  
- 基于 `Socket` 的 `Reactor` 模式高性能服务器，`epoll` 实现 I/O 复用
- 借助阿里云服务器公网完成跨局域网通信
- 连接 `mysql` 管理可通讯账号

## 运行过程

[这里](../server/bepack.html) 的时序图画了纯后台的服务器运行模式  
[这里](../mysql/mysqlmanager.md) 讲解了c++连接 mysql 操作表的方式  
下面介绍在服务器运行之外的一个客户端对服务端信息传递的部分：    
  
登录发生在这个客户端初次连接时，这个时候客户端应先选择注册还是登录，并将选择信息传递给服务端，这样两端可以保持要么同时处理登录要么同时处理注册，服务端核心函数为 `Server::handleLoginEvent`     
- 登录：客户端每次发完账号和密码交给服务端验证，服务端返回“正确”或者“失败”，客户端根据返回值来决定是重新登录还是直接进入对话模式
- 注册：客户端发完账号、密码、重复密码后，自行验证密码和重复密码是否一致，一致的话提交给服务端直接进入对话，服务端将信息塞入 mysql 

（由于在服务端内也存在一套循环机制，所以如果脱离客户端强行破解则无法结束服务端的循环，不会对服务端产生伤害）  
在登录或者注册成功后，本 `Server` 对象内 `clntChannel` 的回调函数将会是 `Server::handleReadEvent`  
  
至于对话，就是简单的客户端先 `send` 一句，服务端 `recv` 阻塞运行直到收到客户端发送的信息，然后是服务端 `send` 客户端阻塞  

## 项目结构及使用  

### 结构

一套是 `Server` 端，一套是 `Client` 端，两者分开运行  
`Server/src` 内存放的是服务器的连接和运行模式  
`Server/usrinfo` 内存放的是服务端管理可通讯账号的接口  
`Server/server.cpp` 启动服务器    
`Client/src` 用于开启 Socket  
`Client/client.cpp` 用于连接服务端并与其对话  

### 使用
  
在运行之前需要手动配置几样东西，在这些文件中均用尖括号表示出来了  
- `/Server/src/Acceptor.cpp` 的第 $5$ 行  
- `/Server/usrinfo/SqlManager.h` 的第 $10,11,13$ 行  
- `/Client/client.cpp` 的第 $20$ 行   


然后要创建一个数据库，里面放一张 `server_user` 表，只有两列：`account` 和 `password` ，这样即可把数据库信息填入上面的 `SqlManager.h` 中了    
  
关于阿里云购买服务器使用公网以及 frp 的配置网上教程很多，这里就不赘述了  

本项目的 `Server` 和 `Client` 可以放在不同局域网的不同主机上  
在公网服务器上运行 `frps` 然后再 `server`端服务器上运行 `frpc`  
先运行 `Server/server.cpp` 再运行 `Client/client.cpp`    
命令参考：  

```
g++ src/Acceptor.cpp src/Channel.cpp src/Epoll.cpp src/EventLoop.cpp src/InetAddress.cpp src/Server.cpp src/Socket.cpp src/util.cpp usrinfo/SqlManager.cpp usrinfo/StudentInfo.cpp usrinfo/UserInfo.cpp server.cpp -o server -lmysqlclient && ./server

g++ src/InetAddress src/Socket.cpp src/util.cpp client.cpp -o client && ./client
```

### 演示

首先阿里云服务器启动 `frp`  
![20230215214336](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230215214336.png)  
  
然后装 `Server` 端的主机启动 `frp`  
![20230215214430](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230215214430.png)  
同时阿里云服务器接到响应显示：  
![20230215214502](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230215214502.png)  
  
紧接着运行 `Server/server.cpp`  
再运行 `Client/client.cpp` （此时 Server 端会发送一个 "client fd <一个数字> login"    
然后进入登录环节，查一下我们的用户表：  
![](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/!%5B20230216085851%5D(httpsraw.githubusercontent.comTequila-AvagePicGoBedsmaster20230216085851.png).png)
然后进行登录  
![20230216085812](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230216085812.png)  
这里先错输入了一个不存在的账号密码，然后会反馈一个失败码，继续重新输入信息  
  
下面是成功登录并进入对话的展示  
![20230216090552](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230216090552.png)
![20230216090615](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230216090615.png)

  
另外一个功能，注册，尝试一下  
![20230216090816](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230216090816.png)  
这里也是先尝试了一下重复密码和原来密码不同的效果，重新输入信息，相同后服务端反馈了一个 `Successfully insert!`  
我们看一下服务端那边的数据库  
![20230216090928](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230216090928.png)  
成功录上了，我们下次就可以继续用这个号了   

## 源代码地址

[传送门](https://github.com/Chivas-Regal/CppLearn/tree/main/UserTalk1)