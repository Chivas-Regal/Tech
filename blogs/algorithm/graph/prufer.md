---
layout: article
key: 2021-11-03-new-template
title: Prufer编码
subtitle: 图论的东西，最后沦落为树上计数？🤔
aside:
  toc: true
sidebar:
  nav: docs-en
categories: 图论
tags: [图论]
---

# $Prufer$ 序列
用于对<span style="color: red;">无向无根树</span>与一个<span style="color: red;">数列</span>的<mark>双射</mark>  
# 树 $\rightarrow$ $Prufer$
## 步骤
$1.$ 找编号最小的叶节点  
$2.$ 输出与这个叶节点相连的编号  
$3.$ 删去这个叶节点  
  
## 模拟
我们创建这样一棵树的 $Prufer$ 编码  
<img src="https://img-blog.csdnimg.cn/90c86e748bc04446b472c219b6d6102f.png" width="300px">
<table>
	<tr>
		<th>图示</th><th>找编号最小的叶节点</th><th>输出与该节点相连的编号</th><th rowspan="7">删去该叶节点</th>
	</tr>
	<tr>
		<td height="100px"><img src="https://img-blog.csdnimg.cn/d5c78b4cb9554ea885e243e41a82671b.png" width="100px"></td><td>$1$</td><td>$3$</td>
	</tr>
	<tr>
		<td height="100px"><img src="https://img-blog.csdnimg.cn/66ae1ea2403e421da31cf9b6cfa533a7.png" width="100px"></td><td>$2$</td><td>$5$</td>
	</tr>
	<tr>
		<td height="100px"><img src="https://img-blog.csdnimg.cn/d8f05b94463c4b5db4eab1de9e7b5138.png" width="100px"></td><td>$3$</td><td>$4$</td>
	</tr>
	<tr>
		<td height="100px"><img src="https://img-blog.csdnimg.cn/4c01925a489947a09b16a4ce8e12fcfe.png" width="100px"></td><td>$4$</td><td>$5$</td>
	</tr>
	<tr>
		<td colspan="3">剩两个不输出</td>
	</tr>
</table>  
那么构造出来的 $Prufer$ 编码就是 $\{3,5,4,3\}$

## 线性构造
从小到大枚举 $j$ 表示编号<span style="color: red;">最小的度数为1</span>的点  
一旦走到一个度数为 $1$ 的点，这个就是最小的叶节点，输出它的相连节点同时删除它  
此时最多又暴露出一个点 $x$  
$1.$ $x\gt j$ ，<mark>不用管</mark>，反正会继续向上枚举  
$2.$ $x\lt j$ ， $j$ 本身就是最小的，新来了一个比 $j$ 更小的，那么<mark>新叶节点就是最小的</mark>  

## 程序  

```cpp
namespace Prufer {
        int f[N]; // 每个节点的父亲节点
        int d[N]; // 度数
        int p[N]; // prufer编码
        inline void Tree2Prufer () {
	        for ( int i = 1; i < n; i ++ )
                        cin >> f[i],
                        d[f[i]] ++;
                for ( int i = 1, j = 1; i <= n - 2; j ++ ) {
                        while ( d[j] ) j ++; // 直到找到一个叶子结点
                        p[ i ++ ] = f[j];    // 这个叶子结点是最小的
                        while ( i <= n - 2 && /*在prufer范围内*/
                                -- d[p[i - 1]] == 0 && /*之前叶子结点删去后的度数*/ 
                                p[i - 1] < j ) /*满足这个点比上一个删去的叶子结点小*/
                                p[ i ++ ] = f[p[i - 1]]; // 新prufer是上一次删去的叶子节点的父亲
                }
        }
}
```

# $Prufer\rightarrow$ 树  
## 步骤 $\And$ 线性构造
根据已给的编码，我们可以<mark>得到每个节点有几个儿子</mark>  
即除了最后一个点之外，<span style="color: red;">每个点的儿子个数就是它在编码中的出现次数</span>  
我们可以<mark>模拟“ 树 $\rightarrow Prufer$ ”的构造方式</mark>，只不过我们建树都是在确定一个（也就是上一种构造删边）时建边的    
仍然<mark>从小到大</mark>枚举，当枚举到一个儿子个数为 $0$ 的节点 $x$ 时便是能确定这个是它在树中<span style="color: red;">第一个删去</span>的  
同时也是第一个编码的子节点，那就说明</span style="color: red;">第一个编码就是 $x$ 的父节点</span>，于是建边  
假装将这个小的叶子节点删去，那么就需要<mark>对 $x$ 的子节点数量减 $1$</mark>  
在“ 树 $\rightarrow Prufer$ ”中我们删点后会出现的情况在这里<span style="color: red;">也会出现</span>  
所以一样的流程进行判断即可  
## 模拟
我们创建这么一个 $Prufer$ 编码的树   
$\{3,5,4,5\}$  
  
首先确定每个节点的子节点数量  
<table>
		<tr><th>节点</th><th>子节点数量</th></tr>
		<tr><td>$1$</td><td>$0$</td></tr>
		<tr><td>$2$</td><td>$0$</td></tr>
		<tr><td>$3$</td><td>$1$</td></tr>
		<tr><td>$4$</td><td>$1$</td></tr>
		<tr><td>$5$</td><td>$2$</td></tr>
		<tr><td>$6$</td><td>$1$</td></tr>
		</table>
		  
然后开始按上面说的模拟构造
<table>
	<tr>
		<th>节点-子节点数量</th><th>得到叶子结点</th><th>建树</th>
	</tr>
	<tr>
		<td><table>
		<tr><th>节点</th><th>子节点数量</th></tr>
		<tr><td><span style="color: red;"> $1$ </span></td><td> $0$ </td></tr>
		<tr><td> $2$ </td><td> $0$ </td></tr>
		<tr><td>$3$</td><td>$1$<span style="color: red;"> $-1$</span></td></tr>
		<tr><td>$4$</td><td>$1$</td></tr>
		<tr><td>$5$</td><td>$2$</td></tr>
		<tr><td>$6$</td><td>$1$</td></tr>
		</table></td>
		<td>$1$</td><td height="100px"><img src="https://img-blog.csdnimg.cn/13fadacd9c714678b8bfc152a950b352.png" width="100px"></td>
	</tr>
	<tr>
		<td><table>
		<tr><th>节点</th><th>子节点数量</th></tr>
		<tr><td><span style="color: red;">$2$</span></td><td>$0$</td></tr>
		<tr><td>$3$</td><td>$0$</td></tr>
		<tr><td>$4$</td><td>$1$</td></tr>
		<tr><td>$5$</td><td>$2$<span style="color: red;">$-1$</span></td></tr>
		<tr><td>$6$</td><td>$1$</td></tr>
		</table></td>
		<td>$2$</td><td height="100px"><img src="https://img-blog.csdnimg.cn/e9ebb9c20ad84d5da753cbdf54d8ac45.png" width="100px"></td>
	</tr>
	<tr>
		<td><table>
		<tr><th>节点</th><th>子节点数量</th></tr>
		<tr><td>$3$</td><td>$0$</td></tr>
		<tr><td>$4$</td><td>$1$<span style="color: red;">$-1$</span></td></tr>
		<tr><td>$5$</td><td>$1$</td></tr>
		<tr><td>$6$</td><td>$1$</td></tr>
		</table></td>
		<td>$3$</td><td height="100px"><img src="https://img-blog.csdnimg.cn/28333b66e7f34bb2a1f8c506fac6b295.png" width="100px"></td>
	</tr>
	<tr>
		<td><table>
		<tr><th>节点</th><th>子节点数量</th></tr>
		<tr><td>$4$</td><td>$0$</td></tr>
		<tr><td>$5$</td><td>$1$<span style="color: red;">$-1$</span></td></tr>
		<tr><td>$6$</td><td>$1$</td></tr>
		</table></td>
		<td>$4$</td><td height="100px"><img src="https://img-blog.csdnimg.cn/e8e915c6761d4b9cac63c37d68f7d462.png" width="100px"></td>
	</tr>
	<tr>
		<td><table>
		<tr><th>节点</th><th>子节点数量</th></tr>
		<tr><td>$5$</td><td>$0$</td></tr>
		<tr><td>$6$</td><td>$1$</td></tr>
		</table></td>
		<td>最后 $5，6$ 连边</td><td height="100px"><img src="https://img-blog.csdnimg.cn/0a453e126090471ebe3fa7eee902df0b.png" width="100px"></td>
	</tr>
</table>  
这样树就建出来了  

## 程序 
基本上就是上一种构造的反向构造，就不过多赘述了  

```cpp
namespace Prufer {
        int f[N], d[N], p[N];
        inline void Prufer2Tree () {
                for ( int i = 1; i <= n - 2; i ++ )
                        cin >> p[i],
                        d[p[i]] ++;
                p[n - 1] = n;
                for ( int i = 1, j = 1; i < n; i ++, j ++ ) {
                        while ( d[j] ) j ++;
                        f[j] = p[i];
                        while ( i < n - 1 && -- d[p[i]] == 0 && p[i] < j ) f[p[i]] = p[i + 1], i ++;
                }
        }
}
```


# 性质

>主要是使用下面几个性质实现树上计数  

<br>
<mark>$1.$ $Prufer$ 编码与无根树形成双射</mark><br><b>证明：</b>
比较明显了， $Prufer$ 编码就是这么引出的 （也写不出反例了<br><br>    
   
<mark>$2.$ 一棵 $n$ 个节点构成的无向完全图的生成树个数有 $n^{n-2}$ 个</mark><br><b>证明：</b>  
对于一个 $Prufer$ 编码，它每个位置能有 $n$ 个数都可以选择，编码长度为 $n-2$   
则总个数有 $n^{n-2}$ 个放置方式<br><br>  
  
<mark>$3.$ 度数为 $d_i$ 的节点在 $Prufer$ 编码中会出现 $d_i-1$ 次</mark><br><b>证明：</b><br>它的 $d_i-1$ 个子节点要被删去，每次都会输出一次它，则一共有 $d_i-1$ 次<br><br><mark>$3-推论.$ 对于一个已知度数序列 $d_{[1,n]}$ 它可以形成的无根树数量为 $\frac{(n-2)!}{\prod\limits_{i=1}m(d_i-1)!}$</mark><br><b>证明:</b>  
长度为 $n-2$ 的全排列有 $(n-2)!$ 个  
由于每个 $d_i$ 出现 $d_i-1$ 次，则每个 $d_i$ 会重复 $(d_i-1)!$ 次  
在整个 $(n-2)!$ 全排列中去重 $(d_i-1)!$ 得到 $\frac{(n-2)!}{\prod\limits_{i=1}m(d_i-1)!}$   
<mark>别的性质还有待发掘...</mark>  

# 例题  
洛谷P6086 【模板】 $Purfer$ 序列  
<a href="https://www.luogu.com.cn/problem/P6086">题目地址</a>  
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/Prufer%E7%BC%96%E7%A0%81/%E6%B4%9B%E8%B0%B7P6086_%E3%80%90%E6%A8%A1%E6%9D%BF%E3%80%91Prufer%20%E5%BA%8F%E5%88%97.md">题解地址</a>
  
洛谷P4981 父子  
<a href="https://www.luogu.com.cn/problem/P4981">题目地址</a>  
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E6%95%B0%E5%AD%A6/%E7%BB%84%E5%90%88%E6%95%B0%E5%AD%A6/%E6%8E%92%E5%88%97%E7%BB%84%E5%90%88/%E6%B4%9B%E8%B0%B7P4981_%E7%88%B6%E5%AD%90.md">题解地址</a>
  
洛谷P2290 [HNOI2004]树的计数  
<a href="https://www.luogu.com.cn/problem/P2290">题目地址</a>  
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E6%95%B0%E5%AD%A6/%E7%BB%84%E5%90%88%E6%95%B0%E5%AD%A6/%E6%8E%92%E5%88%97%E7%BB%84%E5%90%88/%E6%B4%9B%E8%B0%B7P2290_%E6%A0%91%E7%9A%84%E8%AE%A1%E6%95%B0.md">题解地址</a>
  
AcWing2418 光之大陆  
<a href="https://www.acwing.com/problem/content/2420/">题目地址</a>  
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E6%95%B0%E5%AD%A6/%E7%BB%84%E5%90%88%E6%95%B0%E5%AD%A6/%E6%8E%92%E5%88%97%E7%BB%84%E5%90%88/AcWing2418_%E5%85%89%E4%B9%8B%E5%A4%A7%E9%99%86.md">题解地址</a>
  
