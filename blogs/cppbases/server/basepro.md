---
title: socket 的使用
---

## socket 地址 API

### 网络字节序

由于机器的不同，在储存数据的几个字节的排列顺序也有不同，这使得字节序分为大端字节序和小端字节序  
为了使得数据信息在交互时用统一的格式，网络字节序默认为小端字节序，这就使得我们在上传数据时把字节序改为网络字节序，Linux 提供了下面四个函数  

```cpp
#include <netinet/in.h>
unsigned long int htonl (unsigned long int hostlong);
unsigned short int htons (unsigned short int hostshort);
unsigned long int ntohl (unsigned long int netlong);
unsigned short int ntohs (unsigned short int netshort);
```

这个函数命名拿 `htonl` 举例子，全称 `host to network long` 意为在 `long` 类型下，将主机字节序变成网络字节序  
别的也同理  

### 通用 socket 地址

```cpp
struct sockaddr {
    sa_family_t sa_family; // 地址族
    char sa_data[14];      // 地址值
};
```

地址族和协议族类似，由 `AF_INET` 、`AF_INET6` 和 `AF_UNIX` 可选  
地址值在不同的协议族下有不同的含义  
- `PF_UNIX` 文件路径名，$108$ 字节
- `PF_INET` $16bit$ 端口号和 $32bit$ $IPv4$ 地址，$6$ 字节  
- `PF_INET6` $16bit$ 端口号 $32bit$ 流标识 $126bit$ $IPv6$ 地址，$26$ 字节

### 专用 socket 地址

unix 本地域协议族：

```cpp
struct sockaddr_un {
    sa_family_t sin_family; // 地址族：AF_UNIX
    char sun_path[108];     // 文件路径名
}
```

$IPv4$ 专用：

```cpp
struct in_addr {
    u_int32_t s_addr;       // 网络字节序下的 IPv4 地址
};
struct sockaddr_in {
    sa_family_t sin_family; // 地址族：AF_INET
    u_int16_t sin_port;     // 网络字节序下的端口号
    struct in_addr sin_addr;// IPv4 地址结构体，上有
}
```

$IPv6$ 专用：

```cpp
struct in6_addr {
    unsigned char sa_addr[16];  // 网络字节序下的 IPv6 地址
};
struct sockaddr_in6 {
    sa_family_t sin6_family;    // 地址族：AF_INET6
    u_int16_t sin6_port;        // 网络字节序下的端口号
    u_int32_t sin6_flowinfo;    // 流信息，设置为0 
    struct in6_addr sin6_addr;  // IPv6 地址结构体，上有
    u_int32_t sin6_scope_id;    // （试验阶段
}
```

### 地址转换

通常使用 `in_addr_t inet_addr(const char *ip)` 来将点分十进制形式下的 $IPv4$ 地址变成网络字节序整数表示的 $IPv4$ 地址   
同理 `char* inet_ntoa(struct in_addr in)` 则是反过来的用法   

::: warning
`inet_ntoa` 内部有一个静态变量储存信息，所以不可重入，比如  

```cpp
in_addr addr1, addr2;
inet_aton("1.2.3.4", &addr1);
inet_aton("4.3.2.1", &addr2);
char *val1 = inet_ntoa(addr1);
char *val2 = inet_ntoa(addr2);
std::cout << val1 << std::endl << val2;

/*
Output:
4.3.2.1
4.3.2.1
*/
```
:::

### 综合：初始化

创建一个 $IPv4$ 的 socket 地址，让其指向 $127.0.0.1:8888$

```cpp
sockaddr_in serv_addr;
bzero(&serv_addr, sizeof(serv_addr));
serv_addr.sin_family = AF_INET;
serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
serv_addr.sin_port = htons(8888);
```

## socket 创建与初始化

### 创建

UNIX/Linux 有一种说法：所有东西都是文件  
这里 socket 也不例外，socket 是一个文件描述符，可读可写可控制可关闭，其创建方式为  

```cpp
# include <sys/socket.h>

int sockfd = socket(int domain, int type, int procontrol);
```
其中 `domain` 表示底层协议族，可选参数如下：
- `PF_INET` ：用于 $IPv4$  
- `PF_INET6`：用于 $IPv6$  

`type` 则是服务类型，有：
- `SOCK_STREAM`：流服务，意为使用 $tcp$ 协议
- `SOCK_UGRAM`：数据报，意为使用 $udp$ 协议

`procontrol` 表示在前两个基础上，选择一个具体的协议，这里通常设置为 $0$ 表示使用默认协议  

### 绑定

```cpp
bind(sockfd, (sockaddr*)&serv_addr, sizeof(serv_addr));
```

同样是为了统一，所有专用 socket 地址在这里都要换成通用 socket 地址 `sockaddr`

### 监听

```cpp
listen(sockfd, SOMAXCONN);
```

第二个参数是最大监听队列长度，这里定义为 $128$  

### 接受连接

接受的是客户端的向该 socket 服务器请求的连接，使用函数 `accept` ，会返回一个文件描述符用来表示一个客户端  

```cpp
sockaddr_in clnt_addr;
bzero(&clnt_addr, sizeof(clnt_addr));
socklen_t clnt_addr_len = sizeof(clnt_addr);
int clnt_sockfd = accept(sockfd, (sockaddr*)&clnt_addr, &clnt_addr_len);
```

需要注意的有这里第三个参数需要传地址，使得在这个函数里面会写入地址  
同时 `accept` 会阻塞程序运行，在成功接收到了一个新连接会往下运行

## 连接信息

在创建并初始化一个 socket 服务器后，当被连接的时候将客户端的信息输出出来  

```cpp
std::cout << "new clientfd " << clnt_sockfd << std::endl;
std::cout << "IP: " << inet_ntoa(clnt_addr.sin_addr) << std::endl;
std::cout << "Port: " << ntohs(clnt_addr.sin_port) << std::endl;
```

这样我们的一个基础的服务端就已经写完了，创建一个客户端连接一下试试  

```cpp
// client.cpp

int sockfd = socket(AF_INET, SOCK_STREAM, 0);

sockaddr_in serv_addr;
bzero(&serv_addr, sizeof(serv_addr));
serv_addr.sin_family = AF_INET;
serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
serv_addr.sin_port = htons(8888);

connect(sockfd, (sockaddr*)&serv_addr, sizeof(serv_addr)); 
```

服务端输出：

```txt
new clientfd 4
IP: 127.0.0.1
Port: 62300
```

然后两个程序均结束，运行成功  

## 代码地址

[传送门](https://replit.com/@ChivasRegal/0#server.cpp)