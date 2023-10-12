---
title: 前提 -- theme模块转移
---

这一篇是所有事情的前提，先说一下我们的 theme 模块在哪  
如果你是原生态 vuepress 用户，是 node_modules/@vuepress 这个目录  
如果你是和我一样的 vuepress-theme-reco 用户，是 node_modules/vuepress-theme-reco 这个目录  

这套文档框架都有一个 .vuepress 的文件夹，我们将我们找到的 theme 模块粘贴到 .vuepress 文件夹下并改名为 theme  
然后你的博客就会自动使用 .vuepress/theme 下的文件来完成页面解析  

::: tip 为什么不直接在 node_modules 里面修改  

如果你本地开发然后全部上传，或者你直接 ssh 连接你的网站服务器完成开发的话当我没说  
但多数都是传到托管平台前用 .gitignore 消除掉了 node_modules 不然会很慢  
到了服务器之后会再执行一次 build 或者 init 来重构 node_modules   
你如果直接修改 node_modules 的话也就你本地能看  

:::
  

下面就都以 vuepress-theme-reco 的调整为例，原生 vuepress 用户的 theme 模块类似  
然后来说一下重点要关注的几个文件夹  

```
/.vuepress
  /theme
    /components
    /fonts
    /layouts
    /styles
    ....
```

只有这四个，分别存放了：
- `/components` ：主要构成页面的组件比如 `Home.vue`、`Page.vue`、`Navbar.vue`、`Sidebar.vue` 等
- `/fonts` ：主要是一些 icon 图标文件，你可以直接在里面添加你希望作为离线静态资源的字体文件
- `/layouts` ：一些无关紧要的页面组件比如 `404.vue`  
- `/styles` ：与页面搭配的公共提出来的样式 `stylus`

后面我们在做调整的时候就围绕这份 theme 模块进行修改  


