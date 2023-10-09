const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = [
    './',
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
]