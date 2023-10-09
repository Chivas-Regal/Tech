const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    '/blogs/linux/',
    {
        title: 'Shell编程',
        collapsable: false,
        children: getChildren('./blogs/linux/shell')
    }
]