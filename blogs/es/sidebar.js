const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = [
    './0-begin.html',
    './1-painless.html',
    {
        title: '索引',
        collapsable: false,
        children: getChildren('./blogs/es/index')
    },
    {
        title: "文档",
        collapsable: false,
        children: getChildren('./blogs/es/doc')
    },
    {
        title: "集群",
        collapsable: false,
        children: getChildren('./blogs/es/group')
    },
    {
        title: '插件',
        collapsable: false,
        children: getChildren('./blogs/es/plugins')
    },
    {
        title: '常见问题',
        collapsable: false,
        children: getChildren('./blogs/es/most-qa')
    }
]