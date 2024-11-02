const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    './',
    {
        title: '包装',
        collapsable: false,
        children: getChildren('./blogs/source-code-jdk/package')
    }
]