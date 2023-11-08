---
title: ssh 远程连接
---

## 配置文件

/etc/ssh/sshd_config  

修改主配置文件，打开下面 key 的注释并设置值
- `PermitRootLogin`：是否允许 root 登录
- `PermitEmptyPasswords`：是否允许空密码登录
- `PasswordAuthentication`：是否允许密码登录

## 防火墙设置

- 添加端口：`firewall-cmd --zone=public --add-port=22/tcp --permanent`
- 规则生效：`firewall-cmd --reload`
- 查看开放的端口：`firewall-cmd --list-ports`

## 启动 ssh

- 重启：`service sshd restart`
- 开机启动：`service sshd enable`

## 远程登录

如果你已经配置好了一个内/公网ip，即可在另一台机器上测试一下  
![20231107125401](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231107125401.png)  
这样就表示登陆成功  

