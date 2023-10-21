---
home: true
heroImage: /hero.png
heroImageStyle: {
  maxWidth: '200px',
  width: '100%',
  display: block,
  margin: '0 auto 5rem',
  margin-top: '5rem',
  background: '#fff',
  borderRadius: '50%',
}
bgImageStyle: {
  height: '450px'
}
isShowTitleInHome: false
actionText: '快速开始 →'
actionLink: '/blogs/algorithm/'

features:
- title: 算法与数据结构
  children:
  - title: 动态规划
    details: 通过把原问题分解为子问题的方式求解的一类方法，一般需要根据限制列出状态，并通过一系列的决策（转移方程）将子阶段递推至父阶段
    link: blogs/algorithm/dpp/line-DP.html
    icon: iconfont icon-a-376
  - title: 数据结构
    details: 一种数据的组织形态，常见的基础数据结构有二叉树、哈希表等，通过组织数据来完成优化存储、优化读写等行为，作出数据结构常常需要合理的建模能力
    link: blogs/algorithm/data-structure/captain-mo.html
    icon: iconfont icon-relation
  - title: 数学
    details: 从数字01开始，到极限、三维、多项式...，计算机的很多问题都可以抽象转移成数学公式，通过对数学公式的一步步化简可以更精妙地看到问题的本质
    link: blogs/algorithm/math/ballandbox.html
    icon: iconfont icon-shuxue
  - title: 图论
    details: 多种节点、多种连边、多种权值来形成一份图论的问题，常见的有最短路、匹配、网络流等，对于每个节点将邻点的数据进行汇总可以得到总图的很多信息
    link: blogs/algorithm/graph/2-sat.html
    icon: iconfont icon-ditu
  - title: 搜索
    details: 深度优先搜索像是走迷宫一样走到死胡同后再返回走另一条路，广度优先搜索则类似水流的扩展，以多路并发开始，到找到终点为止，两者都是优雅的暴力
    link: blogs/algorithm/search/bfs.html
    icon: iconfont icon-bianlihang-
  - title: 字符串
    details: 以多种多个字符组织形成的一连串的形式，常见问题有回文串、循环串等，需要找到串与串的共同点来完成各种各样的匹配算法
    link: blogs/algorithm/string/kmp.html
    icon: iconfont icon-string
  - title: 杂项
    details: 这里存储了无法归类的一些算法，主要是写题中的一些技巧比如悬线法找矩阵中最大的同符号子矩阵这种，在杂项中也会存放一些黑科技算法
    link: blogs/algorithm/else/suspendedline.html
    icon: iconfont icon-qita1
    
- title: 计算机原理技术
  children:
  - title: C/C++
    details: 是针对于计算机原理来编程，深入底层挖掘的利器，既有C的底层支持也有各种便于开发的新特性语法糖，也是作者认真学习的第一份语言
    link: blogs/cppbases/0begin/0enviroment.html
    icon: iconfont icon-language-cpp
  - title: Linux
    details: 一种高度自由与定制化的操作系统，支持各种丰富的终端命令，秉持”一切皆是文件“原则也有更为快捷的文件配置方式，常用于服务器
    link: https://tech.chivas-regal.top/blogs/linux/
    icon: iconfont icon-linux

- title: 后端技能点
  children:
  - title: MySQL
    details: 一种列存储的磁盘数据库，为数据提供了强大的安全性保证，其内置的B+Tree也保证了读写的效率，且其提供的SQL语句可以实现复杂的逻辑功能
    link: blogs/mysql/Z-sql-solution/create-tables-query.html
    icon: iconfont icon-mysql
  - title: Redis
    details: KV 化的非关系型内存数据库，支持多种数据结构完成储存数据，以高速为特点作为缓存数据库与各种磁盘数据库相配合，在工程开发中十分常见
    link: blogs/redis/begin.html
    icon: iconfont icon-Redis-session
  - title: SSM
    details: 是三种主流框架Spring、SpringMVC、Mybatis的结合，以Spring为桥梁整合出各种功能模块，是开发各种业务代码的基础框架
    link: blogs/framework/Spring/0-ioc.html
    icon: iconfont icon-MYBATIS
  - title: SpringBoot
    details: 是SSM的升级，通过将各种服务功能与环境配置写入pom文件中，以最少的代码开发出最完善的功能，也是当前时代最常用的Web应用开发框架
    link: blogs/framework/SpringBoot/0-firstquick.html
    icon: iconfont icon-bxl-spring-boot
- title: 前端技能点
  children:
  - title: Vuepress
    details: 一种知识文档快速建立的框架，只需要编写md文件并且按自己喜好设计好侧边/顶栏的json后便可自动解析为文档网站，辅以强大多样的插件支持
    link: blogs/front/vuepress/0-thememove.html
    icon: iconfont icon-Vue

---

## 网页与作者

这里是一位 20 级 ACMer 使用 vuepress 搭建的网页，作者对算法、底层、前后端都极为感兴趣，且都会去学习。  
学习到的东西有一大部分会储存在这里，希望能将这里做得十分丰富   

作者大三退队后走的是 C++ 后端的路线，主体为服务端与存储的开发，自己设计制作了一个 （内存：LRU+MemTable）+（持久化：LSM-Tree） 的 KV 数据库。    
目前在学习 Java 中 ......  
持续更新内容： 
- 算法与数据结构的理论知识与解题报告（xxx算法以及它的好题讲解...）
- C++ 各种知识块（模板元、并发编程、内存管理等...）
- 工具组件（如内存池、消息队列等...）
- 前后端框架探究与实用性介绍（xxx框架完成xxx功能 ...）

</div>

## 阅读建议

由于这里的大部分图片都以 github 仓库作为图床，建议挂载 vpn 浏览，否则可能会出现图片无法阅览的情况。

## 指路

[本人生活博客](https://blog.chivas-regal.top)  
[宝贝学习博客](https://demooo.top)

::: tip
:::: details 联系方式私戳👇这里   

<br>
<br>
<br>

<div style="width: 100%; display: flex; justify-content: center;">
<div style="width: 30%; margin: 10%;">
  <h2 align="center">WeChat</h2>  
  <img src="./.vuepress/public/person_wechat.png" style="width: 100%;"/> 
</div>
<div style="width: 30%; margin: 10%;">   
  <h2 align="center">QQ</h2>  
  <img src="./.vuepress/public/qq.png" style="width: 100%;"/>
</div>
</div>
<br>
<br>
<br>

::::