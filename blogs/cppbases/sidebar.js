const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = [
    './',
    {
        title: '起步',
        collapsable: false,
        children: getChildren('./blogs/cppbases/0begin/')
    },
    {
        title: '新特性',
        collapsable: false,
        children: getChildren('./blogs/cppbases/new-features/')
    },
    {
        title: '内存管理',
        collapsable: false,
        children: getChildren('./blogs/cppbases/memory/')
    },
    {
        title: '多线程',
        collapsable: false,
        children: getChildren('./blogs/cppbases/threads/')
    },
    {
        title: '多进程',
        collapsable: false,
        children: getChildren('./blogs/cppbases/process/')
    },
    {
        title: '模板元编程',
        collapsable: false,
        children: getChildren('./blogs/cppbases/template/')
    },
    {
        title: 'MySQL',
        collapsable: false,
        children: getChildren('./blogs/cppbases/mysql/')
    },
    {
        title: 'Web编程',
        collapsable: false,
        children: getChildren('./blogs/cppbases/web/')
    },
    {
        title: '服务器开发',
        collapsable: false,
        children: getChildren('./blogs/cppbases/server/')
    },
    {
        title: '项目实践',
        collapsable: false,
        children: getChildren('./blogs/cppbases/z-project/')
    }
]