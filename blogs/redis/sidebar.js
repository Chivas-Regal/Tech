const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    './begin.html',
    {
        title: '数据类型',
        collapsable: false,
        children: getChildren('./blogs/redis/datatype')
    },
    {
        title: '单机数据可靠性与并发性',
        collapsable: false,
        children: getChildren('./blogs/redis/longer')
    },
    {
        title: '多机数据库',
        collapsable: false,
        children: getChildren('./blogs/redis/group')
    },
    {
        title: '可调用 API',
        collapsable: false,
        children: getChildren('./blogs/redis/program')
    }
]