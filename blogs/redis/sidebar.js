const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    './begin.html',
    {
        title: '数据类型',
        collapsable: false,
        children: getChildren('./blogs/redis/datatype')
    },
    {
        title: '多机数据库',
        collapsable: false,
        children: getChildren('./blogs/redis/group')
    }
]