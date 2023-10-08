const {getChildren} = require("vuepress-sidebar-atuo")
const path = require('path');
const shiki = require('shiki');

module.exports = {
  title: "Chivas-Regal",
  description: 'Technology Stack',
  dest: './public',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
  ],
  plugins: [
      [ '@vuepress-reco/extract-code' ], 
      /* 流程图 */
      [ 'flowchart' ],

      /* ```mermaid */
      [ 'mermaidjs' ],

      [ '@vuepress-reco/extract-code' ],

      /* 数学公式 */
      [ 
          '@vite/vuepress-plugin-mathjax' ,
          {
              target: 'svg',
              presets: '\def\lr#1#2#3{\left#1#2\right#3}'
          }
      ],
      [ 
          'markdown-it-mathjax3',
          {
              tex: {
                  inlineMath :[['$', '$'], ['\\(', '\\)']]
              },
              svg: {
                  FontCache: 'global'
              }
          }
      ],

      /* 支付页面 */
      [
          'vuepress-plugin-sponsor',
          {
              theme: 'drinks',
              alipay: '/zhifubaby.png',
              wechat: '/wechat.png',
              duration: 2000
          }
      ],

      /* 一键复制 */
      [
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

      /* sitemap */
      [
        'sitemap',
        {
          hostname: 'https://tech.chivas-regal.top/'
        }
      ],

      /* 谷歌analytics（一个拦截访问量的功能） */
      [
        '@vuepress/google-analytics',
        {
            'ga': 'G-XDVY2G9SS5'
        }
      ],

      [
        "prismjs",
        {
            "theme": "solarizedlight"
        }
      ]
  ],
  theme: 'reco',
  sidebarDepth: 5,
  themeConfig: {
    mode: 'light',
    nav: [
        { text: '首页', link: '/', icon: 'reco-home' },
        {
            text: '算法-数据结构',
            items: [
                { text: '理论梳理', link: '/blogs/algorithm/' },
                { text: '解题报告', link: '/blogs/solution/' },
            ]
        },
        {
            text: 'C/C++',
            items: [
                {
                    text: '特性/语法', items: [
                        { text: '基本开发', link: '/blogs/cppbases/' },
                        { text: '混合编程', link: '/blogs/mixprogram/' },
                    ]
                },
                { 
                    text: '模式识别', items: [
                        { text: '机器视觉', link: '/blogs/machine-vision/' }
                    ]
                },
            ]
        },
        {
            text: 'Java',
            items: [
                { text: '基本语法使用', link: '/blogs/java/javalang/01-base.html' }
            ]
        },
        {
            text: '常用框架',
            items: [
                { text: 'Maven', link: '/blogs/framework/Maven/0-desc.html' },
                { text: 'Spring', link: '/blogs/framework/Spring/0-ioc.html' },
                { text: 'SpringMVC', link: '/blogs/framework/SpringMVC/0-quickstart.html' },
                { text: 'Mybatis', link: '/blogs/framework/Mybatis/0-quickstart.html' },
                { text: 'MybatisPlus', link: '/blogs/framework/MybatisPlus/0-quickstart.html' },
                { text: 'SpringBoot', link: '/blogs/framework/SpringBoot/0-firstquick.html' },
                
            ]
        },
        {
            text: '计算机基础',
            items: [
                { text: '数据库', link: '/blogs/databases/' },
                { text: 'Linux', link: '/blogs/linux/' }
            ]
        },
        {
            text: '个人',
            items: [
                { text: '开发', items: [
                        { text: 'Github', link: 'https://github.com/Chivas-Regal' }
                ]},
                { text: '社交', items:[
                        { text: 'We-Chat', link: '/person-wechat.html' }
                ]},
                { text: 'CodeForces', items: [
                        { text: 'Pepsi__Cola', link: 'https://codeforces.com/profile/Pepsi__Cola'},
                        { text: 'Chivas_Regal', link: 'https://codeforces.com/profile/Chivas_Regal'},
                ]}
            ],
            icon: 'reco-account'
        }
    ],
    sidebar: {
        '/blogs/algorithm/': [
            '/blogs/algorithm/',
            {
                title: '动态规划',
                collapsable: false,
                children: getChildren('./blogs/algorithm/dpp/')
            },
            {
                title: '数据结构',
                collapsable: false,
                children: getChildren('./blogs/algorithm/data-structure/')
            },
            {
                title: '数学',
                collapsable: false,
                children: getChildren('./blogs/algorithm/math/')
            },
            {
                title: '图论',
                collapsable: false,
                children: getChildren('./blogs/algorithm/graph/')
            },
            {
                title: '搜索',
                collapsable: false,
                children: getChildren('./blogs/algorithm/search/')
            },
            {
                title: '字符串',
                collapsable: false,
                children: getChildren('./blogs/algorithm/string/')
            },
            {
                title: '杂项',
                collapsable: false,
                children: getChildren('./blogs/algorithm/else/')
            }
        ],
        '/blogs/solution/': [
            '/blogs/solution/',
            {
                title: '起步',
                collapsable: false,
                children: getChildren('./blogs/solution/0gobegin/')
            },
            {
                title: '基础算法',
                collapsable: false,
                children: getChildren('./blogs/solution/base/')
            },
            {
                title: '数据结构',
                collapsable: false,
                children: getChildren('./blogs/solution/datastructure/')
            },
            {
                title: '动态规划',
                collapsable: false,
                children: getChildren('./blogs/solution/dp/')
            },
            {
                title: '数学',
                collapsable: false,
                children: getChildren('./blogs/solution/math/')
            },
            {
                title: '计算几何',
                collapsable: false,
                children: getChildren('./blogs/solution/geometry/')
            },
            {
                title: '图论',
                collapsable: false,
                children: getChildren('./blogs/solution/graph/')
            },
            {
                title: '杂项',
                collapsable: false,
                children: getChildren('./blogs/solution/else/')
            },
            {
                title: '离线算法',
                collapsable: false,
                children: getChildren('./blogs/solution/offline/')
            },
            {
                title: '搜索',
                collapsable: false,
                children: getChildren('./blogs/solution/search/')
            },
            {
                title: '字符串',
                collapsable: false,
                children: getChildren('./blogs/solution/string/')
            },
        ],
        '/blogs/cppbases/': [
            '/blogs/cppbases/',
            {
                title: '起步',
                collapsable: false,
                children: getChildren('./blogs/cppbases/0begin/')
            },
            {
                title: '新特性',
                collapsable: false,
                children: getChildren('./blogs/cppbases/new-features/')
            },
            {
                title: '内存管理',
                collapsable: false,
                children: getChildren('./blogs/cppbases/memory/')
            },
            {
                title: '多线程',
                collapsable: false,
                children: getChildren('./blogs/cppbases/threads/')
            },
            {
                title: '多进程',
                collapsable: false,
                children: getChildren('./blogs/cppbases/process/')
            },
            {
                title: '模板元编程',
                collapsable: false,
                children: getChildren('./blogs/cppbases/template/')
            },
            {
                title: 'MySQL',
                collapsable: false,
                children: getChildren('./blogs/cppbases/mysql/')
            },
            {
                title: 'Web编程',
                collapsable: false,
                children: getChildren('./blogs/cppbases/web/')
            },
            {
                title: '服务器开发',
                collapsable: false,
                children: getChildren('./blogs/cppbases/server/')
            },
            {
                title: '项目实践',
                collapsable: false,
                children: getChildren('./blogs/cppbases/z-project/')
            }
        ],
        '/blogs/mixprogram/': [
            '/blogs/mixprogram/',
            {
                title: 'C++ 与 Python',
                collapsable: false,
                children: getChildren('./blogs/mixprogram/cpp-python')
            }
        ],
        '/blogs/databases/': [
            '/blogs/databases/',
            {
                title: 'Redis',
                collapsable: false,
                children: getChildren('./blogs/databases/redis')
            },
            {
                title: 'SQL语句题解',
                collapsable: false,
                children: getChildren('./blogs/databases/Z-sql-solution')
            }
        ],
        '/blogs/linux/': [
            '/blogs/linux/',
            {
                title: 'Shell编程',
                collapsable: false,
                children: getChildren('./blogs/linux/shell')
            }
        ],
        '/blogs/machine-vision/': [
            '/blogs/machine-vision/',
            {
                title: '起步',
                collapsable: false,
                children: getChildren('./blogs/machine-vision/0gobegin')
            },
            {
                title: '基础理论',
                collapsable: false,
                children: getChildren('./blogs/machine-vision/base')
            },
            // {
            //     title: '算法实现',
            //     collapsable: false,
            //     children: getChildren('./blogs/machine-vision/algorithm')
            // },
            {
                title: '项目实践',
                collapsable: false,
                children: getChildren('./blogs/machine-vision/project')
            }
        ],
        '/blogs/java/': [
            {
                title: 'Java 语法使用',
                collapsable: false,
                children: getChildren('./blogs/java/javalang')
            }
        ],
        '/blogs/framework/': [
            '/blogs/framework/0-IDEAuse',
            {
                title: 'Maven',
                collapsable: false,
                children: getChildren('./blogs/framework/Maven')
            },
            {
                title: 'Spring',
                collapsable: false,
                children: getChildren('./blogs/framework/Spring')
            },
            {
                title: 'SpringMVC',
                collapsable: false,
                children: getChildren('./blogs/framework/SpringMVC')
            },
            {
                title: 'Mybatis',
                collapsable: false,
                children: getChildren('./blogs/framework/Mybatis')
            },
            {
                title: 'MybatisPlus',
                collapsable: false,
                children: getChildren('./blogs/framework/MybatisPlus')
            },
            {
                title: 'SpringBoot',
                collapsable: false,
                children: getChildren('./blogs/framework/SpringBoot')
            }
        ]
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
        ['link', { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" }],
    ]
  }
