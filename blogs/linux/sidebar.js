const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    '/blogs/linux/',
    {
        title: '网络管理',
        collapsable: true,
        children: getChildren('./blogs/linux/network')
    },
    {
        title: 'Shell编程',
        collapsable: false,
        children: getChildren('./blogs/linux/shell')
    }
]