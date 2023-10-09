const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    './',
    {
        title: '起步',
        collapsable: false,
        children: getChildren('./blogs/machine-vision/0gobegin')
    },
    {
        title: '基础理论',
        collapsable: false,
        children: getChildren('./blogs/machine-vision/base')
    },
    // {
    //     title: '算法实现',
    //     collapsable: false,
    //     children: getChildren('./blogs/machine-vision/algorithm')
    // },
    {
        title: '项目实践',
        collapsable: false,
        children: getChildren('./blogs/machine-vision/project')
    }
]