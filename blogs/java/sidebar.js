const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    '/blogs/java/javalang.html',
    {
        title: '多线程并发技巧',
        collapsable: false,
        children: getChildren('./blogs/java/thread')
    },
    {
        title: 'JSP 技术',
        collapsable: false,
        children: getChildren('./blogs/java/jsp')
    },
    {
        title: '其他',
        collapsable: false,
        children: getChildren('./blogs/java/else')
    }
]