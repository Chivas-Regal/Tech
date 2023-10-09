const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = [
    './',
    {
        title: 'Redis',
        collapsable: false,
        children: getChildren('./blogs/databases/redis')
    },
    {
        title: 'SQL语句题解',
        collapsable: false,
        children: getChildren('./blogs/databases/Z-sql-solution')
    }
]