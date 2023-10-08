---
title: 第一个 SpringBoot 程序
---

## 迅速生成

第一个程序配置在 Java/IDEA配置使用 中已有，这里教一下如果没有 IDEA 如何创建 SpringBoot 项目

进入 <https://start.spring.io/>，按我们第一个配置程序的内容设定

![20230928194007](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928194007.png)

然后创建即可，便会下载一个创建好了的压缩包，我们把这个压缩包解压并用 vscode 打开
运行其中的 SpringbootDemoApplicaiton.java 程序，即可开启 springboot\_demo 的 web 项目

## 快速启动

> 为了前端能简单启动 SpringBoot 程序，启用了运行 jar 包即可运行程序的方式

- 从右侧找到 maven 动作，将其打包 package  
![20231001221355](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231001221355.png)  
- 在 target 中找到生成的 jar 包  
![20231001221444](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231001221444.png)  
- 在终端中调用 `java -jar <jar包路径>` 直接运行  
![20231001221557](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231001221557.png)  

这边已经启动了，我们在 postman 中测试一下

![20231001221710](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231001221710.png)

测试成功