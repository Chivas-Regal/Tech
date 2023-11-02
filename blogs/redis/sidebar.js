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
        title: '代码化设计',
        collapsable: false,
        children: getChildren('./blogs/redis/program')
    },
    {
        title: '实况灾难与解决',
        collapsable: false,
        children: getChildren('./blogs/redis/true-error')
    },
    {
        title: 'SpringCache + Redis 注解化缓存',
        collapsable: false,
        children: getChildren('./blogs/redis/springcache-redis')
    }
]