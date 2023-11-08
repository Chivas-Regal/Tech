const {getChildren} = require("vuepress-sidebar-atuo")

module.exports = [
    {
        title: 'Git',
        collapsable: false,
        children: getChildren('./blogs/computer-tools/git/')
    },
    {
        title: 'Docker',
        collapsable: false,
        children: getChildren('./blogs/computer-tools/docker/')
    }
]