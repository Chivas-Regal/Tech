const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    {
        title: '设计模式',
        collapsable: false,
        children: getChildren('./blogs/dev-spec/pattern')
    }
]