const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = [
    {
        title: 'git',
        collapsable: false,
        children: getChildren('./blogs/computer-tools/git/')
    }
]