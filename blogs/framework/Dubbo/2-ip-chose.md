---
title: Dubbo 多网卡 IP 地址
---

记一次消费者、服务提供者 IP 地址一直连不上的原因。  

```sh
org.apache.dubbo.rpc.RpcException: Failed to invoke the method getByToken in the service com.snopzyz.hello.user.client.service.UserRemoteService. Tried 1 times of the providers [11.249.170.132:20880] (1/1) from the registry 127.0.0.1:2181 on the consumer 192.168.1.8 using the dubbo version 2.7.17. Last error is: Failed to invoke remote method: getByToken, provider: dubbo://11.249.170.132:20880/com.snopzyz.hello.user.client.service.UserRemoteService?anyhost=true&application=com.snopzyz.hello.writer.server&check=false&deprecated=false&dubbo=2.0.2&dynamic=true&generic=false&init=false&interface=com.snopzyz.hello.user.client.service.UserRemoteService&metadata-type=remote&methods=getByToken,getByName,page,listByNames&pid=75067&qos.enable=false&register.ip=192.168.1.8&release=2.7.17&remote.application=com.snopzyz.hello.user-dubbo&retries=0&revision=1.0.0&service.name=ServiceBean:/com.snopzyz.hello.user.client.service.UserRemoteService&side=consumer&sticky=false&timeout=10000&timestamp=1740149435324, cause: org.apache.dubbo.remoting.RemotingException: Channel NettyChannel [channel=[id: 0x54fe7181, L:/11.249.170.132:53834 ! R:/11.249.170.132:20880]] is inactive. Directly return the unFinished request : Request [id=0, version=2.0.2, twoway=true, event=false, broken=false, data=RpcInvocation [methodName=getByToken, parameterTypes=[class java.lang.String]]]
```

看到这个显示的客户端地址是 192.168.1.8，这个 IP 地址咋来的？  

去翻看了一下源码，`org.apache.dubbo.common.utils.NetUtils.getLocalAddress0` 它获取本地ip的逻辑也比较简单。  
其中会有个排除网卡的步骤，会读取这个配置 `System.getProperty("dubbo.network.interface.ignored")`，那就在消费者、提供者的JVM启动参数上都配置一下要排除的网卡名就行了。  

> 哦忘说了，看网卡就去 `ifconfig` 下看就行了

::: danger TODO
怀疑有的网卡有防火墙，待定后面上到公网再试试...
:::

