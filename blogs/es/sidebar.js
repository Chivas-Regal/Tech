const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = [
    './0-begin.html',
    {
        title: '索引库与文档',
        collapsable: false,
        children: getChildren('./blogs/es/index-doc')
    },
    {
        title: "JavaAPI-RestClient",
        collapsable: false,
        children: getChildren('./blogs/es/restclient')
    },
    {
        title: '插件',
        collapsable: false,
        children: getChildren('./blogs/es/plugins')
    }
]