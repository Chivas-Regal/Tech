---
title: 信息传输
---

## 读写函数

```cpp
# include <sys/types.h>
# include <sys/socket.h>

ssize_t recv(int sockfd, void *buf, size_t len, int flags);
ssize_t send(int sockfd, const void *buf, size_t len, int flags);
```

这两个函数配套是阻塞的，即 `recv` 在接收到信息后才会继续进行代码  
参数中的 `buf` 和 `len` 分别为指定缓冲区的位置和大小  
`flags` 通常设为 $0$ ，为数据收发提供额外的控制，具体功能如下：  

- `send`
  - `0` 相当于 `write()`
  - `MSG_DONTROUTE` 目标主机在本地网络中，不用查路由表
  - `MSG_DONTWAIT` 单个 I/O 设置为非阻塞
  - `MSG_OOB` 发送的是外带信息
- `recv`
  - `0` 相当于 `read()`
  - `MSG_DONTWAIT`
  - `MSG_OOB`
  - `MSG_PEEK` 可以查看可读的信息，在接收数据后不会将这些数据丢失 
  - `MSG_WAITALL` 通知内核直到读到请求的数据字节数时，才返回。

## 使用方案

可以各用一个 `while(true)` 来进行一句一句的发送，即客户端一句服务端收到后返回给客户端    
依靠 `recv` 的阻塞机制即可  

```cpp
// server.cpp

...
while (true) {
    char buf[BUF_SIZE]; 
    memset(buf, '\0', BUF_SIZE);
    int ret = recv(clnt_sockfd, buf, sizeof(buf), 0);
    std::cout << "message from fd " << clnt_sockfd << " : " << buf << std::endl;
    send(clnt_sockfd, buf, sizeof(buf), 0);
}
...
```

```cpp
...
while (true) {
    char buf[BUF_SIZE];
    int ret;

    memset(buf, '\0', sizeof(buf));
    std::cin >> buf;
    ret = send(sockfd, buf, sizeof(buf), 0);
    
    memset(buf, '\0', sizeof(buf));
    ret = recv(sockfd, buf, sizeof(buf), 0);
    std::cout << "message from server is: " << buf << std::endl;
}
...
```