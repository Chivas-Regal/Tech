const {getChildren} = require('vuepress-sidebar-atuo')

module.exports = [
    './',
    {
        title: 'C++ 与 Python',
        collapsable: false,
        children: getChildren('./blogs/mixprogram/cpp-python')
    }

]