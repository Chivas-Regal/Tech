const {getChildren} = require("vuepress-sidebar-atuo")
const path = require('path')
module.exports = {
  title: "Chivas-Regal",
  description: 'Technology Stack',
  dest: './public',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  plugins: [
      [ 'flowchart' ],
      [ 'mermaidjs' ],
      [ 
          '@vite/vuepress-plugin-mathjax' ,
          {
              target: 'svg',
              presets: '\def\lr#1#2#3{\left#1#2\right#3}'
          }
      ],
      [ 'markdown-it-mathjax3' ],
      [
          'vuepress-plugin-sponsor',
          {
              theme: 'drinks',
              alipay: '/zhifubaby.png',
              wechat: '/wechat.png',
              duration: 2000
          }
      ],
      [
        // 一键复制
        'one-click-copy',
        {
          copySelector: [
            'div[class*="language-"] pre',
            'div[class*="aside-code"] aside'
          ],
          copyMessage: '白嫖成功',
          toolTipMessage: '立即白嫖',
          duration: 1250
        }
      ],
  ],
  theme: 'reco',
  sidebarDepth: 3,
  themeConfig: {
    mode: 'light',
    nav: [
        { text: '首页', link: '/', icon: 'reco-home' },
        {
            text: '技术文档',
            items: [
                { text: '算法', link: '/blogs/algorithm/' },
                { text: '题解', link: '/blogs/solution/' }
            ],
            icon: 'reco-document'
        },
        {
            text: '个人',
            items: [
                { text: 'Github', link: 'https://github.com/Chivas-Regal', icon: 'reco-github' },
                { text: 'WeChat', link: './person-wechat.md', icon: 'reco-wechat' },
                { text: 'CodeForces', link: 'https://codeforces.com/profile/Chivas_Regal', icon: 'reco-api' }
            ],
            icon: 'reco-account'
        }
    ],
    sidebar: {
        '/blogs/algorithm/': [
            {
                title: '动态规划',
                collapsable: true,
                children: getChildren('./blogs/algorithm/dpp/')
            },
            {
                title: '数据结构',
                collapsable: true,
                children: getChildren('./blogs/algorithm/data-structure/')
            },
            {
                title: '数学',
                collapsable: true,
                children: getChildren('./blogs/algorithm/math/')
            },
            {
                title: '图论',
                collapsable: true,
                children: getChildren('./blogs/algorithm/graph/')
            },
            {
                title: '搜索',
                collapsable: true,
                children: getChildren('./blogs/algorithm/search/')
            },
            {
                title: '字符串',
                collapsable: true,
                children: getChildren('./blogs/algorithm/string/')
            },
            {
                title: '杂项',
                collapsable: true,
                children: getChildren('./blogs/algorithm/else/')
            }
        ],
        '/blogs/solution/': [
            '/blogs/solution/',
            {
                title: '基础算法',
                collapsable: true,
                children: getChildren('./blogs/solution/base/')
            },
            {
                title: '数据结构',
                collapsable: true,
                children: getChildren('./blogs/solution/datastructure/')
            },
            {
                title: '动态规划',
                collapsable: true,
                children: getChildren('./blogs/solution/dp/')
            },
            {
                title: '数学',
                collapsable: true,
                children: getChildren('./blogs/solution/math/')
            },
            {
                title: '计算几何',
                collapsable: true,
                children: getChildren('./blogs/solution/geometry/')
            },
            {
                title: '图论',
                collapsable: true,
                children: getChildren('./blogs/solution/graph/')
            },
            {
                title: '杂项',
                collapsable: true,
                children: getChildren('./blogs/solution/else/')
            },
            {
                title: '离线算法',
                collapsable: true,
                children: getChildren('./blogs/solution/offline/')
            },
            {
                title: '搜索',
                collapsable: true,
                children: getChildren('./blogs/solution/search/')
            },
            {
                title: '字符串',
                collapsable: true,
                children: getChildren('./blogs/solution/string/')
            },
        ],
    },
    subSidebar: 'auto',
    logo: '/logo.png',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: 'Chivas-Regal',
    // 作者头像
    authorAvatar: '/avatar.png',
    // 备案号
    record: 'xxxx',
    // 项目开始时间
    startYear: '2017'
    /**
     * 密钥 (if your blog is private)
     */

    // keyPage: {
    //   keys: ['your password'],
    //   color: '#42b983',
    //   lineColor: '#42b983'
    // },

    /**
     * valine 设置 (if you need valine comment )
     */

    // valineConfig: {
    //   appId: '...',// your appId
    //   appKey: '...', // your appKey
    // }
  },
  markdown: {
    lineNumbers: true,
    extendMarkdown: md => {
            md.set({
                html: true
            });
            // md.use(require('markdown-it-katex'))
            // md.use(require('markdown-it-mathjax3'), { tex: {tags: 'ams'} })
        }
    },
    head: [
        ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css' }],
        ['link', { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" }]
    ]
  }
