const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    './',
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
]