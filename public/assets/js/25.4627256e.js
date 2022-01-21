(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{574:function(a,s,r){"use strict";r.r(s);var t=r(13),e=Object(t.a)({},(function(){var a=this,s=a.$createElement,r=a._self._c||s;return r("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[r("h1",{attrs:{id:"概念"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#概念"}},[a._v("#")]),a._v(" 概念：")]),a._v(" "),r("p",[a._v("生成树：一个有 n 个结点的连通图的生成树是原图的连通子图，且包含原图中的所有 n 个结点。"),r("br"),a._v("\n最小生成树：一个有 n 个结点的连通图的生成树是原图的极小连通子图，且包含原图中的所有 n 个结点，并且有保持图连通的最少的边。一个连通图至少存在一棵最小生成树包含权最小的一边")]),a._v(" "),r("p",[a._v("之所以要放在与并查集一起更新，是因为很多最小生成树题判断回路和其他功能会用到并查集，两者关系挺大的")]),a._v(" "),r("h1",{attrs:{id:"图解"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#图解"}},[a._v("#")]),a._v(" 图解：")]),a._v(" "),r("p",[a._v("完全图：")]),a._v(" "),r("div",{staticClass:"language-mermaid line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-mermaid"}},[r("code",[r("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("graph")]),a._v(" TB"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|1|")]),a._v("B\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|3|")]),a._v("C\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|2|")]),a._v("D\nC"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|8|")]),a._v("D\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|4|")]),a._v("C\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|5|")]),a._v("D\n")])]),a._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[a._v("1")]),r("br"),r("span",{staticClass:"line-number"},[a._v("2")]),r("br"),r("span",{staticClass:"line-number"},[a._v("3")]),r("br"),r("span",{staticClass:"line-number"},[a._v("4")]),r("br"),r("span",{staticClass:"line-number"},[a._v("5")]),r("br"),r("span",{staticClass:"line-number"},[a._v("6")]),r("br"),r("span",{staticClass:"line-number"},[a._v("7")]),r("br")])]),r("p",[r("em",[a._v("下面的树中虚线表示不连通，实线表示连通")]),r("br"),a._v("\n生成树1：边权和22")]),a._v(" "),r("div",{staticClass:"language-mermaid line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-mermaid"}},[r("code",[r("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("graph")]),a._v(" TB"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("-.-")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|1|")]),a._v("B\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|3|")]),a._v("C\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|2|")]),a._v("D\nC"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|8|")]),a._v("D\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|4|")]),a._v("C\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|5|")]),a._v("D\n")])]),a._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[a._v("1")]),r("br"),r("span",{staticClass:"line-number"},[a._v("2")]),r("br"),r("span",{staticClass:"line-number"},[a._v("3")]),r("br"),r("span",{staticClass:"line-number"},[a._v("4")]),r("br"),r("span",{staticClass:"line-number"},[a._v("5")]),r("br"),r("span",{staticClass:"line-number"},[a._v("6")]),r("br"),r("span",{staticClass:"line-number"},[a._v("7")]),r("br")])]),r("p",[a._v("生成树2：边权和20")]),a._v(" "),r("div",{staticClass:"language-mermaid line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-mermaid"}},[r("code",[r("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("graph")]),a._v(" TB"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("-.-")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|1|")]),a._v("B\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|3|")]),a._v("C\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("-.-")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|2|")]),a._v("D\nC"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|8|")]),a._v("D\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|4|")]),a._v("C\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|5|")]),a._v("D\n")])]),a._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[a._v("1")]),r("br"),r("span",{staticClass:"line-number"},[a._v("2")]),r("br"),r("span",{staticClass:"line-number"},[a._v("3")]),r("br"),r("span",{staticClass:"line-number"},[a._v("4")]),r("br"),r("span",{staticClass:"line-number"},[a._v("5")]),r("br"),r("span",{staticClass:"line-number"},[a._v("6")]),r("br"),r("span",{staticClass:"line-number"},[a._v("7")]),r("br")])]),r("p",[a._v("生成树3：边权和15")]),a._v(" "),r("div",{staticClass:"language-mermaid line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-mermaid"}},[r("code",[r("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("graph")]),a._v(" TB"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("-.-")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|1|")]),a._v("B\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|3|")]),a._v("C\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("-.-")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|2|")]),a._v("D\nC"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|8|")]),a._v("D\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|4|")]),a._v("C\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("-.-")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|5|")]),a._v("D\n")])]),a._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[a._v("1")]),r("br"),r("span",{staticClass:"line-number"},[a._v("2")]),r("br"),r("span",{staticClass:"line-number"},[a._v("3")]),r("br"),r("span",{staticClass:"line-number"},[a._v("4")]),r("br"),r("span",{staticClass:"line-number"},[a._v("5")]),r("br"),r("span",{staticClass:"line-number"},[a._v("6")]),r("br"),r("span",{staticClass:"line-number"},[a._v("7")]),r("br")])]),r("p",[a._v("最小生成树：边权和6")]),a._v(" "),r("div",{staticClass:"language-mermaid line-numbers-mode"},[r("pre",{pre:!0,attrs:{class:"language-mermaid"}},[r("code",[r("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("graph")]),a._v(" TB"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|1|")]),a._v("B\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|3|")]),a._v("C\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("---")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|2|")]),a._v("D\nC"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("-.-")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|8|")]),a._v("D\nB"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("-.-")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|4|")]),a._v("C\nA"),r("span",{pre:!0,attrs:{class:"token arrow operator"}},[a._v("-.-")]),r("span",{pre:!0,attrs:{class:"token label property"}},[a._v("|5|")]),a._v("D\n")])]),a._v(" "),r("div",{staticClass:"line-numbers-wrapper"},[r("span",{staticClass:"line-number"},[a._v("1")]),r("br"),r("span",{staticClass:"line-number"},[a._v("2")]),r("br"),r("span",{staticClass:"line-number"},[a._v("3")]),r("br"),r("span",{staticClass:"line-number"},[a._v("4")]),r("br"),r("span",{staticClass:"line-number"},[a._v("5")]),r("br"),r("span",{staticClass:"line-number"},[a._v("6")]),r("br"),r("span",{staticClass:"line-number"},[a._v("7")]),r("br")])]),r("h2",{attrs:{id:"kruskal算法过程"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#kruskal算法过程"}},[a._v("#")]),a._v(" kruskal算法过程：")]),a._v(" "),r("p",[a._v("用结构体存（点1，点2，边权）"),r("br"),a._v("\n每次选取最短一边做树枝（但要判断是否构成了回路，有回路就跳过），做n-1个树枝"),r("br"),a._v("\n判断回路：并查集")])])}),[],!1,null,null,null);s.default=e.exports}}]);