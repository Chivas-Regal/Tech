const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    './',
    {
        title: '包装',
        collapsable: false,
        children: getChildren('./blogs/source-code-jdk/package')
    },
    {
        title: '流',
        collapsable: false,
        children: getChildren('./blogs/source-code-jdk/stream')
    },
    {
        title: '元编程',
        collapsable: false,
        children: getChildren('./blogs/source-code-jdk/metacode')
    }
]