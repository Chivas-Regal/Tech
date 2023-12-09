const {getChildren} = require('vuepress-sidebar-atuo')
const {mGetChildren} = require('../../.vuepress/selffunc')

module.exports = [
    './',
    {
        title: 'Kafka',
        collapsable: false,
        children: getChildren('./blogs/mq/Kafka/')
    }
]