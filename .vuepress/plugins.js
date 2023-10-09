module.exports = [
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
]