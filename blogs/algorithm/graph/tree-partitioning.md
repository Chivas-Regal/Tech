---
key: 2021-09-28-树分治
layout: article
title: 树分治
subtitle: 树上路径那么多，你让我求满足条件的？🤔
aside:
  toc: true
sidebar:
  nav: docs-en
categories: 图论
tags: [树]
---


<head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.2/dist/katex.min.css" integrity="sha384-yFRtMMDnQtDRO8rLpMIKrtPCD5jdktao2TV19YiZYWMDkUR5GQZR/NOVTdquEx1j" crossorigin="anonymous">
<link href="https://cdn.jsdelivr.net/npm/katex-copytex@latest/dist/katex-copytex.min.css" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Microsoft/vscode/extensions/markdown-language-features/media/markdown.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Microsoft/vscode/extensions/markdown-language-features/media/highlight.css">
	<style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', 'Droid Sans', sans-serif;
                font-size: 14px;
                line-height: 1.6;
            }
	</style>
        <style>
		.task-list-item { list-style-type: none; } .task-list-item-checkbox { margin-left: -20px; vertical-align: middle; }
	</style>
</head>
<body>
      <div class="mume markdown-preview  ">
      <h2 class="mume-header" id="%E5%88%86%E6%B2%BB">&#x5206;&#x6CBB;</h2>

<p><span style="color: blue;">&#x5F52;&#x5E76;&#x6392;&#x5E8F;&#xFF1A;</span>&#x9012;&#x5F52;&#x5DE6;&#x53F3;&#x5206;&#x522B;&#x6392;&#x5E8F;&#xFF0C;&#x7136;&#x540E;&#x5408;&#x5E76;&#xFF0C;&#x662F;&#x6570;&#x7EC4;&#x7EBF;&#x6027;&#x5206;&#x6CBB;<br>
<mark>&#x70B9;&#x5206;&#x6CBB;&#x5C31;&#x662F;&#x5C06;&#x6570;&#x7EC4;&#x7684;&#x5206;&#x6CBB;&#x6269;&#x5C55;&#x5230;&#x6811;&#x4E0A;</mark></p>
<h2 class="mume-header" id="%E7%82%B9%E5%88%86%E6%B2%BB">&#x70B9;&#x5206;&#x6CBB;</h2>

<h3 class="mume-header" id="%E4%B8%BB%E8%A6%81%E9%97%AE%E9%A2%98">&#x4E3B;&#x8981;&#x95EE;&#x9898;</h3>

<p>&#x7ED9;&#x5B9A;&#x4E00;&#x4E2A;&#x8DEF;&#x5F84;&#x9650;&#x5236;&#xFF0C;&#x6C42;&#x5728;&#x8FD9;&#x4E2A;&#x9650;&#x5236;&#x4E0B;&#x5408;&#x6CD5;&#x7684;&#x8DEF;&#x5F84;</p>
<h3 class="mume-header" id="%E6%80%9D%E6%83%B3">&#x601D;&#x60F3;</h3>

<p><img src="https://i.loli.net/2021/09/28/6PbvQBg3aLcYUiT.png"><br><br>
&#x4E00;&#x4E2A;&#x70B9;&#x4E0A;&#x6302;&#x4E86;&#x51E0;&#x68F5;&#x5B50;&#x6811;&#xFF0C;&#x5B50;&#x6811;&#x5185;&#x90E8;&#x95EE;&#x9898;<span style="color: red;">&#x9012;&#x5F52;</span>&#x53BB;&#x89E3;&#xFF0C;&#x5B50;&#x6811;&#x4E4B;&#x95F4;&#x7684;&#x95EE;&#x9898;&#x8FDB;&#x884C;<span style="color: red;">&#x5408;&#x5E76;</span><br></p>
<blockquote>
<p>&#x8FB9;&#x5206;&#x6CBB;&#xFF1A;<br><br>
<img src="https://i.loli.net/2021/09/28/xVv6WJTrBR5fFlH.png"><br><br>
&#x7528;&#x4E00;&#x4E2A;&#x8FB9;&#x8FDB;&#x884C;&#x62C6;&#x5206;&#x7136;&#x540E;&#x5206;&#x522B;&#x505A;<br></p>
</blockquote>
<p>&#x5BF9;&#x4E8E;&#x83CA;&#x82B1;&#x56FE;&#xFF0C;&#x8FB9;&#x5206;&#x6CBB;&#x8981;&#x5206;&#x6210;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>n</mi></mrow><annotation encoding="application/x-tex">n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">n</span></span></span></span>&#x5C42;&#xFF0C;&#x800C;&#x70B9;&#x5206;&#x6CBB;&#x53EF;&#x4EE5;&#x5206;&#x6210;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>l</mi><mi>o</mi><mi>g</mi><mi>n</mi></mrow><annotation encoding="application/x-tex">logn</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8888799999999999em;vertical-align:-0.19444em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">n</span></span></span></span>&#x5C42;&#xFF08;&#x901A;&#x8FC7;&#x9009;&#x91CD;&#x5FC3;&#xFF09;</p>
<blockquote>
<p><mark>&#x91CD;&#x5FC3;&#x7684;&#x6027;&#x8D28;&#xFF1A;&#x6BCF;&#x7528;&#x91CD;&#x5FC3;&#x62C6;&#x5206;&#x4E00;&#x5C42;&#xFF0C;&#x6700;&#x5927;&#x8FDE;&#x901A;&#x5757;&#x70B9;&#x6570;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>&#x2264;</mo><mfrac><mi>n</mi><mn>2</mn></mfrac></mrow><annotation encoding="application/x-tex">\le \frac n2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7719400000000001em;vertical-align:-0.13597em;"></span><span class="mrel">&#x2264;</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1.040392em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.695392em;"><span style="top:-2.6550000000000002em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">&#x200B;</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span>&#xFF0C;&#x4E5F;&#x5C31;&#x662F;&#x9664;2</mark></p>
</blockquote>
<p>&#x56E0;&#x6B64;&#x6700;&#x591A;&#x9012;&#x5F52;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>l</mi><mi>o</mi><mi>g</mi><mi>n</mi></mrow><annotation encoding="application/x-tex">logn</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8888799999999999em;vertical-align:-0.19444em;"></span><span class="mord mathnormal" style="margin-right:0.01968em;">l</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">n</span></span></span></span>&#x5C42;&#xFF0C;&#x6700;&#x5927;&#x8FDE;&#x901A;&#x5757;&#x4F1A;&#x6210;&#x4E3A;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1</mn></mrow><annotation encoding="application/x-tex">1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.64444em;vertical-align:0em;"></span><span class="mord">1</span></span></span></span><br>
&#x53EF;&#x4EE5;&#x7406;&#x89E3;&#x4E3A;&#xFF0C;&#x9009;&#x5B9A;&#x91CD;&#x5FC3;&#x540E;&#x6BCF;&#x4E2A;&#x5757;&#x5927;&#x5C0F;&#x90FD;&#x4E0D;&#x4F1A;&#x592A;&#x5927;&#xFF0C;&#x90FD;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>&#x2264;</mo><mfrac><mi>n</mi><mn>2</mn></mfrac></mrow><annotation encoding="application/x-tex">\le \frac n2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7719400000000001em;vertical-align:-0.13597em;"></span><span class="mrel">&#x2264;</span><span class="mspace" style="margin-right:0.2777777777777778em;"></span></span><span class="base"><span class="strut" style="height:1.040392em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.695392em;"><span style="top:-2.6550000000000002em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">2</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight">n</span></span></span></span></span><span class="vlist-s">&#x200B;</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span></p>
<p>&#x90A3;&#x4E48;&#x6211;&#x4EEC;&#x53EF;&#x4EE5;&#x4E00;&#x5C42;&#x5C42;&#x5730;&#x9012;&#x5F52;&#x4E0B;&#x53BB;&#x8FDB;&#x884C;&#x9009;&#x8FB9;&#xFF0C;&#x65F6;&#x95F4;&#x590D;&#x6742;&#x5EA6;&#x4E5F;&#x4F1A;&#x5927;&#x5927;&#x7F29;&#x5C0F;</p>
<h3 class="mume-header" id="%E8%BF%87%E7%A8%8B">&#x8FC7;&#x7A0B;</h3>

<p>&#x5BF9;&#x4E8E;&#x4E00;&#x4E2A;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>n</mi></mrow><annotation encoding="application/x-tex">n</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">n</span></span></span></span>&#x4E2A;&#x70B9;&#x7684;&#x6811;&#xFF0C;&#x603B;&#x5171;&#x6709;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msubsup><mi>C</mi><mi>n</mi><mn>2</mn></msubsup></mrow><annotation encoding="application/x-tex">C_n^2</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.061108em;vertical-align:-0.247em;"></span><span class="mord"><span class="mord mathnormal" style="margin-right:0.07153em;">C</span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8141079999999999em;"><span style="top:-2.4530000000000003em;margin-left:-0.07153em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mathnormal mtight">n</span></span></span><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight">2</span></span></span></span><span class="vlist-s">&#x200B;</span></span><span class="vlist-r"><span class="vlist" style="height:0.247em;"><span></span></span></span></span></span></span></span></span></span>&#x6761;&#x8DEF;&#x5F84;<br>
<b><span style="color: red;">&#x5C06;&#x8DEF;&#x5F84;&#x5206;&#x7C7B;:</span></b><br>
1.&#x4E24;&#x70B9;&#x90FD;&#x5728;&#x4E00;&#x4E2A;&#x5B50;&#x6811;&#x5185;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>&#x2192;</mo></mrow><annotation encoding="application/x-tex">\rightarrow</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.36687em;vertical-align:0em;"></span><span class="mrel">&#x2192;</span></span></span></span><span style="color: blue;">&#x9012;&#x5F52;&#x5904;&#x7406;&#x5B50;&#x6811;&#x5373;&#x53EF;</span><br>
2.&#x5176;&#x4E2D;&#x4E00;&#x4E2A;&#x70B9;&#x662F;&#x91CD;&#x5FC3;(&#x8FB9;&#x754C;&#x60C5;&#x51B5;)<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>&#x2192;</mo></mrow><annotation encoding="application/x-tex">\rightarrow</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.36687em;vertical-align:0em;"></span><span class="mrel">&#x2192;</span></span></span></span><span style="color: blue;">&#x4ECE;&#x91CD;&#x5FC3;&#x5F00;&#x59CB;&#x5411;&#x5B50;&#x6811;&#x904D;&#x5386;&#xFF0C;&#x6C42;&#x5B50;&#x6811;&#x5185;&#x6EE1;&#x8DB3;&#x6761;&#x4EF6;&#x7684;&#x70B9;</span><br>
3.&#x4E24;&#x70B9;&#x4E0D;&#x5728;&#x4E00;&#x4E2A;&#x5B50;&#x6811;&#x5185;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>&#x2192;</mo></mrow><annotation encoding="application/x-tex">\rightarrow</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.36687em;vertical-align:0em;"></span><span class="mrel">&#x2192;</span></span></span></span><span style="color:blue;">&#x662F;&#x5B50;&#x6811;&#x95F4;&#x7684;&#x95EE;&#x9898;&#xFF0C;&#x53EF;&#x4EE5;&#x6C42;&#x5B8C;&#x6BCF;&#x4E2A;&#x5B50;&#x6811;&#x7684;&#x8282;&#x70B9;&#x540E;&#xFF0C;&#x8FDB;&#x884C;&#x4E0D;&#x540C;&#x5B50;&#x6811;&#x8282;&#x70B9;&#x4E4B;&#x95F4;&#x6309;&#x6761;&#x4EF6;&#x8FDB;&#x884C;&#x5339;&#x914D;</span></p>
<h3 class="mume-header" id="%E7%AE%97%E6%B3%95%E6%A1%86%E6%9E%B6">&#x7B97;&#x6CD5;&#x6846;&#x67B6;</h3>

<p>|--&#x6C42;&#x91CD;&#x5FC3;<br>
|--&#x5220;&#x91CD;&#x5FC3;<br>
|--&#x5206;&#x6CBB;<br>
|----&#x5B50;&#x6811;&#x5185;&#x9012;&#x5F52;<br>
|----&#x5B50;&#x6811;&#x95F4;&#x5408;&#x5E76;<br>
|----&#x8FDB;&#x5165;&#x4E0B;&#x4E00;&#x5C42;</p>
<h3 class="mume-header" id="%E4%BE%8B%E9%A2%98">&#x4F8B;&#x9898;</h3>

<p>&#x4F8B;&#x9898;1&#xFF1A;AcWing252 &#x6811;<br>
<a href="https://www.acwing.com/problem/content/description/254/">&#x9898;&#x76EE;&#x5730;&#x5740;</a><br>
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/%E6%A0%91%E5%88%86%E6%B2%BB/%E7%82%B9%E5%88%86%E6%B2%BB/%E6%A0%91.md">&#x9898;&#x89E3;&#x5730;&#x5740;</a></p>
<p>&#x4F8B;&#x9898;2&#xFF1A;AcWing264 &#x6743;&#x503C;<br>
<a href="https://www.acwing.com/problem/content/266/">&#x9898;&#x76EE;&#x5730;&#x5740;</a><br>
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/%E6%A0%91%E5%88%86%E6%B2%BB/%E7%82%B9%E5%88%86%E6%B2%BB/%E6%9D%83%E5%80%BC.md">&#x9898;&#x89E3;&#x5730;&#x5740;</a></p>
<h2 class="mume-header" id="%E7%82%B9%E5%88%86%E6%A0%91">&#x70B9;&#x5206;&#x6811;</h2>

<h3 class="mume-header" id="%E4%B8%BB%E8%A6%81%E9%97%AE%E9%A2%98-1">&#x4E3B;&#x8981;&#x95EE;&#x9898;</h3>

<p>&#x7ED9;&#x5B9A;&#x4E00;&#x4E2A;&#x70B9;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">x</span></span></span></span>&#x548C;&#x4E00;&#x4E2A;&#x70B9;&#x9650;&#x5236;&#xFF0C;&#x6C42;&#x5728;&#x8FD9;&#x4E2A;&#x9650;&#x5236;&#x5185;&#x7684;&#x6240;&#x6709;&#x70B9;&#x548C;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">x</span></span></span></span>&#x4E4B;&#x95F4;&#x7684;&#x8DEF;&#x5F84;</p>
<h3 class="mume-header" id="%E6%80%9D%E6%83%B3-1">&#x601D;&#x60F3;</h3>

<p>&#x53C8;&#x53EB;&#x52A8;&#x6001;&#x70B9;&#x5206;&#x6CBB;&#xFF0C;&#x4E3B;&#x8981;&#x8FD8;&#x662F;&#x901A;&#x8FC7;&#x70B9;&#x5206;&#x6CBB;&#x7684;&#x601D;&#x60F3;</p>
<p>&#x4F46;&#x5728;&#x8FD9;&#x91CC;&#x5B50;&#x6811;&#x95F4;&#x95EE;&#x9898;&#x53EF;&#x4EE5;&#x901A;&#x8FC7;&#x4E00;&#x4E9B;&#x7B97;&#x6CD5;&#x76F4;&#x63A5;&#x6C42;&#x5F97;&#xFF0C;&#x6240;&#x4EE5;<span style="color: red;">&#x5408;&#x5E76;&#x7684;&#x8FC7;&#x7A0B;&#x53EF;&#x4EE5;&#x76F4;&#x63A5;&#x6C42;</span>&#xFF0C;&#x90A3;&#x4E48;&#x5C31;&#x53EA;&#x9700;&#x8981;&#x6784;&#x5EFA;&#x4E00;&#x4E2A;<span style="color: red;">&#x9012;&#x5F52;&#x65B9;&#x5411;</span><br>
&#x90A3;&#x4E48;&#x6211;&#x4EEC;&#x9700;&#x8981;&#x5BF9;&#x8FD9;&#x4E2A;&#x6811;&#x56FE;&#x5EFA;&#x7ACB;&#x4E00;&#x4E2A;&#x7ED3;&#x6784;&#xFF0C;&#x5728;&#x8FD9;&#x4E2A;&#x7ED3;&#x6784;&#x4E0B;&#x6211;&#x4EEC;&#x4E0D;&#x9700;&#x8981;&#x5BF9;&#x6240;&#x6709;&#x7684;&#x5B50;&#x6811;&#x6784;&#x5EFA;&#x91CD;&#x5FC3;<br>
&#x6211;&#x4EEC;&#x53EA;&#x9700;&#x8981;&#x5728;&#x4E00;&#x6B65;&#x6B65;<span style="color: red;">&#x9501;&#x5B9A;</span>&#x70B9;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">x</span></span></span></span>&#x7684;&#x4F4D;&#x7F6E;&#x7684;&#x65F6;&#x5019;&#xFF0C;&#x5BF9;&#x91CD;&#x5FC3;&#x4E00;&#x6B65;&#x6B65;&#x5EFA;&#x7ACB;<br>
&#x90A3;&#x4E48;&#x5C31;&#x53EF;&#x4EE5;&#x4E00;&#x6B21;<span style="color: red;">&#x9884;&#x5904;&#x7406;</span>&#x5B58;&#x8FDB;&#x6240;&#x6709;&#x7684;&#x91CD;&#x5FC3;&#xFF0C;&#x5B58;&#x91CD;&#x5FC3;&#x7684;&#x7ED3;&#x6784;&#x88AB;&#x79F0;&#x4E3A;&#x70B9;&#x5206;&#x6811;&#xFF0C;&#x53EA;&#x4E0D;&#x8FC7;&#x6BCF;&#x4E2A;&#x5B50;&#x6811;&#x7684;&#x6839;&#x8282;&#x70B9;&#x662F;&#x5B83;&#x7684;&#x91CD;&#x5FC3;<br>
&#x7136;&#x540E;&#x6211;&#x4EEC;&#x5C31;&#x53EF;&#x4EE5;&#x5728;&#x9501;&#x5B9A;&#x70B9;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">x</span></span></span></span>&#x7684;&#x65F6;&#x5019;&#xFF0C;&#x5B50;&#x6811;&#x95F4;&#x7528;&#x7B97;&#x6CD5;&#x5C31;&#x53EF;&#x4EE5;&#x8F7B;&#x677E;&#x6C42;&#x5F97;&#xFF0C;&#x7136;&#x540E;&#x5229;&#x7528;&#x6C42;&#x5230;&#x7684;&#x9012;&#x5F52;&#x65B9;&#x5411;&#xFF0C;&#x4E00;&#x5C42;&#x4E00;&#x5C42;&#x5411;&#x4E0B;&#x6C42;&#x5B50;&#x6811;&#x95F4;&#x95EE;&#x9898;</p>
<h3 class="mume-header" id="%E8%BF%87%E7%A8%8B-1">&#x8FC7;&#x7A0B;</h3>

<p>&#x6BCF;&#x4E00;&#x5C42;&#x53EF;&#x4EE5;&#x5C06;&#x8DE8;&#x4E2D;&#x5FC3;&#xFF08;&#x4E5F;&#x5C31;&#x662F;&#x5B50;&#x6811;&#x95F4;&#x95EE;&#x9898;&#xFF09;&#x76F4;&#x63A5;&#x6C42;&#x5F97;<br>
&#x7136;&#x540E;&#x5411;&#x4E0B;&#x9501;&#x5B9A;&#x70B9;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">x</span></span></span></span><br>
<img src="https://i.loli.net/2021/09/28/GZ1rnP83hTMkIbs.png"><br>
&#x76F4;&#x5230;x&#x5C31;&#x662F;&#x8FD9;&#x4E00;&#x5C42;&#x7684;&#x91CD;&#x5FC3;&#xFF0C;&#x5C31;&#x76F4;&#x63A5;&#x66B4;&#x529B;&#x6C42;&#x5F97;&#x4E0E;&#x5176;&#x4ED6;&#x5B50;&#x6811;&#x4E2D;&#x6EE1;&#x8DB3;&#x7684;&#x70B9;&#x5373;&#x53EF;</p>
<h3 class="mume-header" id="%E7%AE%97%E6%B3%95%E6%A1%86%E6%9E%B6-1">&#x7B97;&#x6CD5;&#x6846;&#x67B6;</h3>

<p>|--&#x9884;&#x5904;&#x7406;&#x51FA;&#x91CD;&#x5FC3;&#x6811;&#x56FE;(&#x6BCF;&#x4E00;&#x5C42;&#x91CD;&#x5FC3;&#x70B9;&#x4E0B;&#x70B9;&#x6240;&#x6709;&#x5B50;&#x6811;&#x70B9;&#xFF0C;&#x6BCF;&#x4E00;&#x4E2A;&#x70B9;&#x5728;&#x6BCF;&#x4E00;&#x5C42;&#x6240;&#x5728;&#x7684;&#x5B50;&#x6811;&#x5173;&#x7CFB;&#x548C;&#x5B83;&#x7684;&#x7236;&#x4EB2;&#x8282;&#x70B9;)<br>
|--&#x5411;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">x</span></span></span></span>&#x9501;&#x5B9A;&#xFF08;&#x679A;&#x4E3E;&#x7236;&#x4EB2;&#x70B9;&#xFF09;<br>
|----&#x8BA8;&#x8BBA;&#x8FB9;&#x7684;&#x60C5;&#x51B5;<br>
|----&#x7B97;&#x6CD5;&#x5408;&#x5E76;&#x522B;&#x7684;&#x540C;&#x7EA7;&#x5B50;&#x6811;<br>
|--&#x8FDB;&#x5165;<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi></mrow><annotation encoding="application/x-tex">x</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.43056em;vertical-align:0em;"></span><span class="mord mathnormal">x</span></span></span></span>&#x6240;&#x5728;&#x5B50;&#x6811;&#xFF08;&#x7EBF;&#x6027;&#x4E0B;&#x4E00;&#x4E2A;&#x679A;&#x4E3E;&#xFF09;</p>
<h3 class="mume-header" id="%E4%BE%8B%E9%A2%98-1">&#x4F8B;&#x9898;</h3>

<p>AcWing2226 &#x5F00;&#x5E97;<br>
<a href="https://www.acwing.com/problem/content/description/2228/">&#x9898;&#x76EE;&#x5730;&#x5740;</a><br>
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/%E6%A0%91%E5%88%86%E6%B2%BB/%E7%82%B9%E5%88%86%E6%A0%91/%E5%BC%80%E5%BA%97.md">&#x9898;&#x89E3;&#x5730;&#x5740;</a></p>

      </div></body>
