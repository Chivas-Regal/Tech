const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    {
        title: 'Java 语法使用',
        collapsable: false,
        children: getChildren('./blogs/java/javalang')
    },
    {
        title: '其他',
        collapsable: false,
        children: getChildren('./blogs/java/else')
    }
]