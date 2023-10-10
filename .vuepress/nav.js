module.exports = [
    { text: '首页', link: '/', icon: 'reco-home' },
    {
        text: '算法-数据结构',
        items: [
            { text: '理论梳理', link: '/blogs/algorithm/' },
            { text: '解题报告', link: '/blogs/solution/' },
        ],
        icon: 'iconfont icon-suanfa2'
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
        ],
        icon: 'iconfont icon-language-cpp'
    },
    {
        text: 'Java',
        items: [
            { text: '基本语法使用', link: '/blogs/java/javalang/01-base.html' }
        ],
        icon: 'iconfont icon-kafei'
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
        ],
        icon: 'iconfont icon-zuzhijiagou'
    },
    {
        text: '计算机基础',
        items: [
            { text: '数据库', link: '/blogs/databases/' },
            { text: 'Linux', link: '/blogs/linux/' }
        ],
        icon: 'iconfont icon-jisuanjikaifa-copy'
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
]