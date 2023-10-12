const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    {
        title: 'Vuepress框架调配',
        collapsable: false,
        children: getChildren('./blogs/front/vuepress')
    },
]