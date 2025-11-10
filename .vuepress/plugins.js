const {OauthConfig} = require('./dif-env-config.js')

module.exports = [

    /* 数学公式 */
    [
        '@vite/vuepress-plugin-mathjax',
        {
            target: 'chtml',
            showError: false
        }
    ],

    [ '@vuepress-reco/extract-code' ], 
    /* 流程图 */
    [ 'flowchart' ],

    /* ```mermaid */
    [ 'mermaidjs' ],

    [ '@vuepress-reco/extract-code' ],


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

    /* 评论系统 */
    [
        '@vssue/vuepress-plugin-vssue',
        // vssue 参数，其他参数请前往 .vuepress/theme/components/Page.vue 内直接在属性下修改
        {
            /* 设置平台，github-v4自动解析@vssue/api-github-v4包 */
            plateform: 'github',
            /* 仓库拥有者 */
            owner: 'Tequila-Avage',
            /* 仓库 */
            repo: 'TechCrComments',
            /* 在 个人的Settings/DeveloperSettings/OAthorKey 下 */
            clientId: OauthConfig.clientId,
            clientSecret: OauthConfig.clientSecret,
            /* 自动创建评论 */
            autoCreateIssue: false
        }
    ],

    [
        '@vuepress/register-components',
        {
            components: [
                {
                    name: 'Valine',
                    path: '/.vuepress/theme/components/Valine.vue'
                },
                {
                    name: 'CodeGroup',
                    path: '/.vuepress/theme/components/CodeGroup/index.vue'
                },
                {
                    name: 'CodeGroupItem',
                    path: '/.vuepress/theme/components/CodeGroup/CodeGroupItem.vue'
                }
            ]
        }
    ],
    
    /* CodeGroup markdown语法插件 */
    [
        require('./theme/components/CodeGroup/markdown-plugin.js')
    ]
]