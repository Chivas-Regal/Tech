---
title: 启动网卡配置
---

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