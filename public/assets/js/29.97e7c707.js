(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{610:function(t,a,s){"use strict";s.r(a);var n=s(5),r=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"启发式合并"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#启发式合并"}},[t._v("#")]),t._v(" 启发式合并")]),t._v(" "),s("h3",{attrs:{id:"内容"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#内容"}},[t._v("#")]),t._v(" 内容")]),t._v(" "),s("p",[t._v("启发式算法为一类根据人类经验智慧实现的优化算法的统称")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"title"}),s("p",[t._v("一组操作既有两棵树的合并，也有对某个节点的查询"),s("br"),t._v("\n如果我们就纯模拟去写，若所有的树都是一个点，我们有可能会合并出一条链"),s("br"),t._v("\n这样在我们每次查询的时候都是 "),s("span",{staticClass:"katex"},[s("span",{staticClass:"katex-mathml"},[s("math",{attrs:{xmlns:"http://www.w3.org/1998/Math/MathML"}},[s("semantics",[s("mrow",[s("mi",[t._v("O")]),s("mo",{attrs:{stretchy:"false"}},[t._v("(")]),s("mi",[t._v("n")]),s("mo",{attrs:{stretchy:"false"}},[t._v(")")])],1),s("annotation",{attrs:{encoding:"application/x-tex"}},[t._v("O(n)")])],1)],1)],1),s("span",{staticClass:"katex-html",attrs:{"aria-hidden":"true"}},[s("span",{staticClass:"base"},[s("span",{staticClass:"strut",staticStyle:{height:"1em","vertical-align":"-0.25em"}}),s("span",{staticClass:"mord mathnormal",staticStyle:{"margin-right":"0.02778em"}},[t._v("O")]),s("span",{staticClass:"mopen"},[t._v("(")]),s("span",{staticClass:"mord mathnormal"},[t._v("n")]),s("span",{staticClass:"mclose"},[t._v(")")])])])]),t._v(" 的")])]),s("p",[t._v("这里就体现了人类智慧的重要性："),s("br"),t._v("\n我们每次将较小的子树合并给较大的子树，这样我们的查询的路线长度是不会变的，从而达到查询的优化"),s("br"),t._v("\n这便是启发式合并")]),t._v(" "),s("h3",{attrs:{id:"具体应用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#具体应用"}},[t._v("#")]),t._v(" 具体应用")]),t._v(" "),s("p",[t._v("有并查集的合并，将小的集合合并入大的集合")]),t._v(" "),s("div",{staticClass:"custom-block warning"},[s("p",{staticClass:"title"}),s("p",[t._v("与按秩合并不同，按秩合并是将深度较小的合并给深度较大的")])]),s("h2",{attrs:{id:"树上启发式合并"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#树上启发式合并"}},[t._v("#")]),t._v(" 树上启发式合并")]),t._v(" "),s("h3",{attrs:{id:"内容-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#内容-2"}},[t._v("#")]),t._v(" 内容")]),t._v(" "),s("p",[t._v("又称 "),s("span",{staticClass:"katex"},[s("span",{staticClass:"katex-mathml"},[s("math",{attrs:{xmlns:"http://www.w3.org/1998/Math/MathML"}},[s("semantics",[s("mrow",[s("mi",[t._v("d")]),s("mi",[t._v("s")]),s("mi",[t._v("u")]),s("mtext"),s("mi",[t._v("o")]),s("mi",[t._v("n")]),s("mtext"),s("mi",[t._v("t")]),s("mi",[t._v("r")]),s("mi",[t._v("e")]),s("mi",[t._v("e")])],1),s("annotation",{attrs:{encoding:"application/x-tex"}},[t._v("dsu\\;on\\;tree")])],1)],1)],1),s("span",{staticClass:"katex-html",attrs:{"aria-hidden":"true"}},[s("span",{staticClass:"base"},[s("span",{staticClass:"strut",staticStyle:{height:"0.69444em","vertical-align":"0em"}}),s("span",{staticClass:"mord mathnormal"},[t._v("d")]),s("span",{staticClass:"mord mathnormal"},[t._v("s")]),s("span",{staticClass:"mord mathnormal"},[t._v("u")]),s("span",{staticClass:"mspace",staticStyle:{"margin-right":"0.2777777777777778em"}}),s("span",{staticClass:"mord mathnormal"},[t._v("o")]),s("span",{staticClass:"mord mathnormal"},[t._v("n")]),s("span",{staticClass:"mspace",staticStyle:{"margin-right":"0.2777777777777778em"}}),s("span",{staticClass:"mord mathnormal"},[t._v("t")]),s("span",{staticClass:"mord mathnormal",staticStyle:{"margin-right":"0.02778em"}},[t._v("r")]),s("span",{staticClass:"mord mathnormal"},[t._v("e")]),s("span",{staticClass:"mord mathnormal"},[t._v("e")])])])]),t._v(" ，但并不是树上并查集"),s("br"),t._v("\n是一种根据启发式合并扩展出来的思想"),s("br"),t._v("\n首先在启发式合并内有集合大小一说，那么在树上问题中，集合大小就是子树大小"),s("br"),t._v("\n根据子树大小可以划分为轻子树和重子树"),s("br"),t._v("\n这样启发式合并的内容转换过来就是 "),s("mark",[t._v("将轻子树合并入重子树中")])]),t._v(" "),s("h3",{attrs:{id:"实现"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#实现"}},[t._v("#")]),t._v(" 实现")]),t._v(" "),s("div",{staticClass:"custom-block tip"},[s("p",{staticClass:"title"}),s("p",[t._v("如果有一个场景是我们要统计每一个节点子树的信息")])]),s("p",[t._v("我们要利用轻儿子和重儿子，所以首先预处理出来每个点的重儿子")]),t._v(" "),s("p",[t._v("由于是树上问题，所以我们开一个 "),s("code",[t._v("dfs_main (u, fa)")]),t._v(" 记录信息"),s("br"),t._v(" "),s("span",{staticClass:"katex"},[s("span",{staticClass:"katex-mathml"},[s("math",{attrs:{xmlns:"http://www.w3.org/1998/Math/MathML"}},[s("semantics",[s("mrow",[s("mi",[t._v("D")]),s("mi",[t._v("F")]),s("mi",[t._v("S")])],1),s("annotation",{attrs:{encoding:"application/x-tex"}},[t._v("DFS")])],1)],1)],1),s("span",{staticClass:"katex-html",attrs:{"aria-hidden":"true"}},[s("span",{staticClass:"base"},[s("span",{staticClass:"strut",staticStyle:{height:"0.68333em","vertical-align":"0em"}}),s("span",{staticClass:"mord mathnormal",staticStyle:{"margin-right":"0.02778em"}},[t._v("D")]),s("span",{staticClass:"mord mathnormal",staticStyle:{"margin-right":"0.13889em"}},[t._v("F")]),s("span",{staticClass:"mord mathnormal",staticStyle:{"margin-right":"0.05764em"}},[t._v("S")])])])]),t._v(" 是链式递归，我们如果回溯统计，那么两个同级节点中，先进行递归的节点对我们记录的信息会对后递归的节点的信息产生影响，而这两者是互不属于子树的"),s("br"),t._v("\n所以我们一次统计一条链，那么就可以"),s("b",[t._v("只统计重链")])]),t._v(" "),s("p",[t._v("对于一个节点，我们只在回溯时只统计其重儿子（即回溯统计每条重链），轻儿子的答案我们在获取之后，将其造成的影响删除"),s("br"),t._v("\n然后对于一个节点在最后暴力统计其所有轻子树，这样在最坏的情况下离线合并完所有的节点的时间复杂度为 "),s("span",{staticClass:"katex"},[s("span",{staticClass:"katex-mathml"},[s("math",{attrs:{xmlns:"http://www.w3.org/1998/Math/MathML"}},[s("semantics",[s("mrow",[s("mi",[t._v("O")]),s("mo",{attrs:{stretchy:"false"}},[t._v("(")]),s("mi",[t._v("n")]),s("mi",[t._v("l")]),s("mi",[t._v("o")]),s("mi",[t._v("g")]),s("mi",[t._v("n")]),s("mo",{attrs:{stretchy:"false"}},[t._v(")")])],1),s("annotation",{attrs:{encoding:"application/x-tex"}},[t._v("O(nlogn)")])],1)],1)],1),s("span",{staticClass:"katex-html",attrs:{"aria-hidden":"true"}},[s("span",{staticClass:"base"},[s("span",{staticClass:"strut",staticStyle:{height:"1em","vertical-align":"-0.25em"}}),s("span",{staticClass:"mord mathnormal",staticStyle:{"margin-right":"0.02778em"}},[t._v("O")]),s("span",{staticClass:"mopen"},[t._v("(")]),s("span",{staticClass:"mord mathnormal"},[t._v("n")]),s("span",{staticClass:"mord mathnormal",staticStyle:{"margin-right":"0.01968em"}},[t._v("l")]),s("span",{staticClass:"mord mathnormal"},[t._v("o")]),s("span",{staticClass:"mord mathnormal",staticStyle:{"margin-right":"0.03588em"}},[t._v("g")]),s("span",{staticClass:"mord mathnormal"},[t._v("n")]),s("span",{staticClass:"mclose"},[t._v(")")])])])])]),t._v(" "),s("p",[s("strong",[t._v("伪代码")])]),t._v(" "),s("div",{staticClass:"language-cpp line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-cpp"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("dfs")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" fa"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" keep "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("                    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// dfs(当前节点，父节点，是否保留) 记录信息")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("for")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" v in u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("light_son "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("           "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 先进入轻儿子走每条新重链")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" v "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!=")]),t._v(" fa "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("                 \n            "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("dfs")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" v"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("weight_son "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("                "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 进入这条重链继续走")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("dfs")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("weight_son"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("true")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("count")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("sum"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("                      "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 统计出这个点的答案")]),t._v("\n    res"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" sum\n    "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("keep "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v("                       "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 不保留，即为轻儿子，说明这条重链回溯到头了")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("clear")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("u"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("sum"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("                  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 清除这个点对记录值的改变")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br"),s("span",{staticClass:"line-number"},[t._v("10")]),s("br"),s("span",{staticClass:"line-number"},[t._v("11")]),s("br")])]),s("h3",{attrs:{id:"例题"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#例题"}},[t._v("#")]),t._v(" 例题")]),t._v(" "),s("p",[t._v("CodeForces600E_LomsatGelral"),s("br"),t._v(" "),s("a",{attrs:{href:"https://codeforces.com/contest/600/problem/E",target:"_blank",rel:"noopener noreferrer"}},[t._v("题目链接"),s("OutboundLink")],1),s("br"),t._v(" "),s("a",{attrs:{href:"https://tech.chivas-regal.top/blogs/solution/graph/dsuontree.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("题解链接"),s("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=r.exports}}]);