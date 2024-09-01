const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = [
    './0-begin.html',
    {
        title: '索引库与文档',
        collapsable: false,
        children: getChildren('./blogs/es/index-doc')
    },
    {
        title: "文档数据检索",
        collapsable: false,
        children: getChildren('./blogs/es/search')
    },
    {
        title: '插件',
        collapsable: false,
        children: getChildren('./blogs/es/plugins')
    }
]