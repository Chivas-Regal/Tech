const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    './0-IDEAuse',
    {
        title: 'Maven',
        collapsable: false,
        children: getChildren('./blogs/framework/Maven')
    },
    {
        title: 'Spring',
        collapsable: false,
        children: getChildren('./blogs/framework/Spring')
    },
    {
        title: 'SpringMVC',
        collapsable: false,
        children: getChildren('./blogs/framework/SpringMVC')
    },
    {
        title: 'Mybatis',
        collapsable: false,
        children: getChildren('./blogs/framework/Mybatis')
    },
    {
        title: 'MybatisPlus',
        collapsable: false,
        children: getChildren('./blogs/framework/MybatisPlus')
    },
    {
        title: 'SpringBoot',
        collapsable: false,
        children: getChildren('./blogs/framework/SpringBoot')
    }
]