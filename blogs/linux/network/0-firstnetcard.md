---
title: 网卡 ip 配置
---

## 网卡

网卡是数据链路层的传输设备，也是我们 `ifconfig` 展示的内容。  
我们用网卡内的 ip 可以向外对指定主机或者设备发送网络数据，而其中的 ip 也分为静态 ip 和动态 ip

### 静态 ip

手动设置的固定的 ip，它会指定好网关等信息，通信时会进行识别，若识别不出来也就是说的配置出了问题，就会收发不了数据。  
但是它的好处就在于是固定的，如果用的是固定了局域网的工作站（比如家用或公司的局域网...），那么网关一般都是不变的，一次设置后就可以一直使用了。  
但缺点也就在于它的配置比较固定，如果外部网络更换 ip，则会导致所有的静态 ip 都无法生效，需要手动再进行一次设置。

### 动态 ip

动态 ip 是服务器自动分配的 ip，它的好处在于你要发数据时它永远都能连得上外网，能一直有一个对外通信的 ip。  
但是这个 ip 会在断开重连时被重新分配，在外部网络环境不稳定或者频繁更换时，我们主动向一个配置了动态 ip 的主机进行通信就会较为困难，需要频繁查看其 ip 并连接。  
比如在集群搭建中常需要每个主机互相知道 ip 地址，倘若都是动态 ip，每一个主机 ip 刷新后这个集群都无法再运作了，都需要网络管理员手动修改配置文件，维护起来较为困难。

### 利弊与选择

利弊上面也说了
- 静态 ip 保证了在已配置的网络中我们都能使用已知的 ip 进行通信，但若出现未配置的外部网络则会导致无法联网
- 动态 ip 保证了在任何网络中我们都能对外通信，但频繁的掉线重启会使得外部对内主动通信较为困难

选择了话如果你的网络环境是固定的或是要配置双向主动通信（固定工作站），那么建议使用静态 ip。  
如果你的网络环境会频繁更换（通勤）或只需要保证对外通信，那么建议使用动态 ip。

动态 ip 在系统中使用默认的就行，配置简单，下面说一下静态 ip 的配法。

## CentOS

第一次用 VMwareFusion 安装 CentOS7 ，在网卡配置上做一下记录  

开机时启动网络适配器中的 ens33（或者别的名字），并将虚拟机网络适配器设置改为桥接  

![20231107123502](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107123502.png)  

并进入 /etc/sysconfig/network-scripts 展开一下找到 ifcfg-ens33 文件（或者是和你在启动时设置的默认网卡一样的名字）  
![20231107123611](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107123611.png)  
修改其中内容 `vi ifcfg-ens33`：     

先观察一下自己电脑上连网后的的网络信息(这里拿我手机热点举例了)  
![20231107132451](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107132451.png)    
根据这些信息，我们设置一下 ifcfg-ens33 中的信息  
![20231107132527](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107132527.png)    
其中主要做修改的地方是：
- 将 BOOTPROTO 设为 static
- 将 ONBOOT 改为 yes 
- 最下面的五行信息
  - 前三行根据自己电脑的网络信息设置，IPADDR 设置同一网路即可
  - 后两行就按这个写

保存后执行 `service network restart`  
查看这个网口的 ip 地址信息  
![20231107133120](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107133120.png)  
并测试外网连通性  
![20231107133150](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107133150.png)

## Ubuntu

跟上面一样将虚拟机网络改为桥接  
然后修改 `/etc/netplan/00-installer-config.yaml` 里面的内容配置静态 ip  

```yaml
network:
  ethernets:
    ens160:                           # 网卡名
      addresses: [192.168.1.111/24]     # 静态 ip 和掩码
      dhcp4: no                         # 是否开启 dhcp
      optional: true
      routes:                         # 网关ip
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8,8.8.4.4]      # DNS  服务器地址
  version: 2
  renderer: networkd                # 网络软件包为 systemd-networkd 还是 Network Manager
```

配置完之后执行命令   

```sh
netplan apply
```

即可生效