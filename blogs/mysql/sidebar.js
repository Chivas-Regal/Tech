const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = [
    {
        title: 'SQL语句题解',
        collapsable: false,
        children: getChildren('./blogs/mysql/Z-sql-solution')
    }
]