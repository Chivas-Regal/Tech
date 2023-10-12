---
title: Vssue 评论模块的装配
---

前面那些细枝末节的都不说，也就是 Github OAuth 的 clientId,clientSecret 的申请  
这里给出一下安装方式和 config.js 的配置内容吧  

```sh
# 安装 vssue
npm install @vssue/vuepress-plugin-vssue
npm install @vssue/api-github-v4 # 或者 npm install @vssue/api-github-v3
```

```js
// .vuepress/config.js

module.exports = {
  plugins: {
    '@vssue/vuepress-plugin-vssue': {
      platform: 'github-v4', //v3的platform是github，v4的是github-v4
      // 其他的 Vssue 配置
      owner: 'OWNER_OF_REPO', //github账户名
      repo: 'NAME_OF_REPO', //github一个项目的名称
      clientId: 'YOUR_CLIENT_ID',//注册的Client ID
      clientSecret: 'YOUR_CLIENT_SECRET',//注册的Client Secret
      autoCreateIssue:true // 自动创建评论，默认是false，最好开启，这样首次进入页面的时候就不用去点击创建评论的按钮了。
    },
  },
};
```

现在就是通过**修改源码**简化配置的问题：

1. 如何定义一个默认的位置供我们放置评论区
2. 如何使评论区不用每次都设置 key 还能保持隔离

## 设置评论区默认位置

对于第一个问题，找到我们对应 theme 下的 Page.vue 文件  
这个文件帮助我们构建出我们文章的 html Page  

我们这里想要放到 ”前后文章链接“ 的下面，分析一下源码找到了这样一段：  

```vue
<!-- Page.vue -->
...
    <ModuleTransition delay="0.24">
      <div class="page-nav" v-if="recoShowModule && (prev || next)">
        <p class="inner">
          <span v-if="prev" class="prev">
            <router-link v-if="prev" class="prev" :to="prev.path">
              {{ prev.title || prev.path }}
            </router-link>
          </span>
          <span v-if="next" class="next">
            <router-link v-if="next" :to="next.path">
              {{ next.title || next.path }}
            </router-link>
          </span>
        </p>
      </div>
    </ModuleTransition>
...
```

这里有着 `prev` 和 `next` 变量数据，那这一块儿就一定是前后文章链接部分了  
我们模仿着作出其下面的内容来植入我们的 Vssue 模块（用它自带的样式与设置为中文）  

```vue
<!-- Page.vue -->
...
	<!-- Vssue评论插件 -->
    <ModuleTransition delay="0.32">
      <Vssue 
        class="theme-default-content content__default"
        :options="{ local: 'zh'}" 
      />
    </ModuleTransition>
...
```

## 设置文章相互隔离的 key

由于不设置的话会在 Github 仓库下创建一个全局的 issue 供我们放置评论区  
于是不同页面的评论区互相都能看见  
但是每一个页面都手动设置 key 的话太过繁琐，如何令页面评论区不同呢

页面不同的元素有：路径、标题、...，这里以**路径**为例  
vue路由中存在这样一个成员信息：`instance.$route.path` ，它就表示了当前的页面网址，把它放到我们的返回值中并在上面调用  

```js
<!-- Page.vue -->
export default defineComponent ({

	...

	setup (props, ctx) {
		const pagePath = computed(() => {
      return (
        instance.$route.path
      )
    })

    return {
			...,
			pagePath,
			...
		}
	}
})
```

在上面调用的时候加上 `key` 与 `title`  这两个属性  

```vue
<!-- Page.vue -->
...  
	<!-- Vssue评论插件 -->
    <ModuleTransition delay="0.32">
      <Vssue 
        class="theme-default-content content__default" 
        :options="{ local: 'zh'}" 
        :key="pagePath"
        :title="pagePath"
      />
    </ModuleTransition>
...
```

