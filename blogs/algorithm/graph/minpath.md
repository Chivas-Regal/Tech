---
key: 2021-02-15-最短路
layout: article
title: 最短路
subtitle: 一堆点的距离，找两点最短距离？🤔
categories: 图论
tags: [图论]
aside:
  toc: true
sidebar:
  nav: docs-en
---

<br /><br /><br /><br /><br /><br />
回顾：链式前向星(邻接表的数组实现)

```cpp
struct edge{ int nxt, to, dis; }edge[N];
int head[N];
int cnt = 0;

inline void add_edge(int from, int to, int val){
	edge[++cnt] = {head[from], to, val};
	head[from] = cnt;
}

inline void input(){
	for(int i = 1, x, y, z; i <= m; i ++){
		read(x); read(y); read(z);
		add_edge(x, y, z);
	}
}

inline void run(){
	for(int i = 1; i <= n; i ++){
		for(int k = head[k]; ~k; k = edge[k].nxt){
			//
		}
	}
}
```


# DIJKSTRA

## 概念
迪杰斯特拉算法(Dijkstra)是由荷兰计算机科学家狄克斯特拉于1959 年提出的，因此又叫狄克斯特拉算法。是从一个顶点到其余各顶点的最短路径算法，解决的是有权图中最短路径问题。迪杰斯特拉算法主要特点是从起始点开始，采用贪心算法的策略，每次遍历到始点距离最近且未访问过的顶点的邻接节点，直到扩展到终点为止。---《百度百科》
  
## 思想：

<ul>
	<li>按照<span style="color:red;">最短路径长度</span>递增的次序，依次求的——源点到其余各点到最短路径</li>
	<li>先求——最短的那条最短路径</li>
	<li>再求——第二短的最短路径</li>
	<li>......</li>
	<li>依次类推</li>
	<li>......</li>
	<li>最终求出所有的最短路径</li>
</ul>

## 算法变量
Dist[i]表示从起点到i点的最短路总权  
Map[i][j]表示从i点到j点的距离权  

**算法图示**
无向图的储存（邻接矩阵）  

<img src="https://img-blog.csdnimg.cn/c24db20a456941d284372c4c0f82aa46.png">  
转移后：  

<table>
    <tr>
        <th></th> <th>0</th> <th>1</th> <th>2</th> <th>3</th> <th>4</th> <th>5</th>
    </tr>
    <tr>
        <th>0</th> <td></td> <td></td> <td>10</td> <td></td> <td>30</td> <td>100</td>
    </tr>
    <tr>
        <th>1</th> <td></td> <td></td> <td>5</td> <td></td> <td></td> <td></td>
    </tr>
    <tr>
        <th>2</th> <td>10</td> <td>5</td> <td></td> <td>50</td> <td></td> <td></td>
    </tr>
    <tr>
        <th>3</th> <td></td> <td></td> <td>50</td> <td></td> <td>20</td> <td>10</td>
    </tr>
    <tr>
        <th>4</th> <td>30</td> <td></td> <td></td> <td>20</td> <td></td> <td>60</td>
    </tr>
    <tr>
        <th>5</th> <td>100</td> <td></td> <td></td> <td>10</td> <td>60</td> <td></td>
    </tr>
</table>

## dijkstra模拟求最短路

<table>
<tr>
    <th rowspan="2">终点</th> <th colspan="5">Dist[i]</th>
</tr>
<tr>
    <th>i=1</th> <th>i=2</th> <th>i=3</th> <th>i=4</th> <th>i=5</th>
</tr>
<tr>
    <th>V1</th> <td>INF</td> <td>INF</td> <td>INF</td> <td>INF</td> <td>INF</td>
</tr>
<tr>
    <th>V2</th> <td>10</td> <td></td> <td></td> <td></td> <td></td>
</tr>
<tr>
    <th>V3</th> <td>INF</td> <td>60</td> <td>50</td> <td></td> <td></td>
</tr>
<tr>
    <th>V4</th> <td>30</td> <td>30</td> <td></td> <td></td> <td></td>
</tr>
<tr>
    <th>V5</th> <td>100</td> <td>100</td> <td>90</td> <td>60</td> <td></td>
</tr>
<tr>
    <th>Vj</th> <th>V2</th> <th>V4</th> <th>V3</th> <th>V5</th> <th></th>
</tr>
</table>

## 注意事项
	    
如果无向图要建立反边
如果多条路要选择最短
	    
## 松弛操作

```cpp
if(Dis[x] + edge[i].val < Dis[edge[i].to]) 
	Dis[edge[i].to] = Dis[x] + edge[i].val,
	pque.push({edge[i].to, Dis[edge[i].to]});
```
					  
其实就是看看从这个中转站转一下会不会更近

## 整体程序

```cpp
int dis[N];
bool vis[N];
struct node {
        int id, val;
        inline friend bool operator < ( node a, node b ) {
                return a.val > b.val;
        }
};
inline void pre_Dijkstra () {
        for ( int i = 0; i <= n; i ++ ) dis[i] = 0x3f3f3f3f,vis[i] = 0;
        priority_queue<node> pque;
        dis[1] = 0; pque.push({1, 0});
        while ( pque.size() ) {
                node cur = pque.top(); pque.pop();
                if ( vis[cur.id] ) continue; vis[cur.id] = 1;
                for ( int i = head[cur.id]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( dis[to] > dis[cur.id] + edge[i].val ) {
                                dis[to] = dis[cur.id] + edge[i].val; 
				pque.push({to, dis[to]});
                        }
                }
        }
}
```

## 补：记录路径  

我们想用Dijkstra松弛的时候记录一下路径，可以设计每个点的前驱是哪个点  
如果设计的是后继的话，由于一个点可能会更新很多个出发点发射出去的最短路  
所以后继不能单独表示从出发点到谁的最短路，所以我们要倒着设置，也就是前驱  
  
当然我们还想求到 $x$ 的哪一条边是最短路径的边  
这个可以在设置一个数组，记录前向星的编号  
无向图中由于每次加边都是成对加边，边的编号为奇数 $i$ 时，它和 $i+1$ 表示的是同一条边  

```cpp
int pre[N];        // pre[i]: i的前驱是pre[i]
int short_edge[N]; // short_edge[i]：到i点的边中，那一条边是最短路径的边

int to = edge[i].to;
if ( dis[to] > dis[cur.id] + edge[i].val ) {
	dis[to] = dis[cur.id] + edge[i].val; pque.push({to, dis[to]});
	pre[to] = cur.id;                       // cur.id -> to
	if ( i & 1 ) short_edge[to] = i;        // 记录是哪条边（正边）
	else         short_edge[to] = i - 1;    // 记录是哪条边（正边）
}
```


# FLoyd(插点法，经典DP)

>求任意两点的最短路
可以采用的算法：DIJKSTRA？FLoyd!


```cpp
for(int k = 1; k <= n; k ++)        //插入点在外层循环很重要！
	for(int i = 1; i <= n; i ++)
		for(int j = 1; j <= n; j ++)
			dis[i][j] = MIN(dis[i][j], dis[i][k] + dis[k][j]);
```
				     
## 算法思想
				     
从i到j的只经过<span style="color: red;">前k个点</span>的最短路径<br />
	    
## 算法特点
	    
简单、粗暴、易于实现、可以解决<span style="color: red;">负权</span>  
且拥有独有的优势：  
乍一看可能 $O(n^3)$ 的复杂度很难解决很多问题  
但如果是**动态多源最短路**  
我们每次加入新点的时候都可以在 $O(n^2)$ 的复杂度下完成所有点的更新
	    
## 难点思考
	    
<span style="color: red;">三重循环是否可以任意交换顺序？</span><br />
如果k放里面的话，我们在MIN更新中用到的dis[i][k]、dis[k][j]不一定是最优解，因为前面并没有更新过

# Bellman-Ford

```cpp
//数据存储结构？
for(int k = 1; k < n; k ++){       //n - 1个阶段，每个阶段的效果？
	for(int i = 1; i <= m; i ++){  //每个阶段，对所有边尝试松弛
		dis[v[i]] = MIN(dis[v[i]], dis[u[i]] + w[i]);
	}
}
```

## 算法思想
	    
一共n个点，所构成最短一条最多n-1条边<br />
每次松弛都只能完善m个中的一部分边<br />
要想完善完所有m条边<br />
我们要对<span style="color:red;">所有的边</span>进行n-1次松弛操作
	    
## 算法特点：
	    
简洁、可以解决<span style="color:red;">负权负环</span>的情况<br />
>其实并不一定需要n-1轮，如果前面的点都没做过松弛操作，那么这一趟松弛操作并不会更新，就不需要继续进行（冒泡排序思想）

## 难点思考
	    
如何检测是否存在负环？<br />
如果在某两点内走会不断减权，那么就有负环<br />

```cpp
for(int k = 1; k <= n - 1; k ++)
	for(int i = 1; i <= m; i ++)
		dis[v[i]] = MIN(dis[v[i]], dis[u[i]] + w[i]);

//正常情况下，做了n-1趟松弛操作后整个图的最优解就稳定了，如果还有可以松弛的，就是负环
int flag = 0;
for(int i = 1; i <= m; i ++)
	if(dis[v[i]] > dis[u[i]] + w[i]) flag = 1;
if(flag) ... //有负环的情况
```

# Bellman_Ford算法队列优化（SPFA）
	    
## 基本思想
	    
每次仅对最短路程发生变化了的点的相邻边执行松弛操作<br />
<span style="color:red;">问题：</span>如何知道当前哪些点的最短路程发生了变化呢？<br />
<span style="color:red;">方案：</span>采用“队列“维护
	    
## 具体操作
	    
先把起点加进队列中，然后松弛和起点相连的所有边，如果松弛成功且该点不在队列中，那么就把这个点入队。然后依次取出队列中每一个点进行松弛，直到队列为空。

```cpp
inline void SPFA(int u){
	que.push(u); vis[u] = 1;
	while(que.size()){
		int x = que.front(); que.pop(); vis[x] = 0;
		for(int i = head[x]; ~i; i = edge[i].nxt){
			int y = edge[i].to;
			if(dis[x] + edge[i].val < dis[y]){
				dis[y] = dis[x] + edge[i].val;
				if(!vis[y]) vis[y] = 1, que.push(y);
			}
		}
	}
}
```

# 优缺点总结
							  
<span style="color:red;">DIJKSTRA</span><br />
优点：大数据单源最短路求解<br />
缺点：负环不能求<br />
<span style="color:red;">FLoyd</span><br />
优点：擅长求任意两点最短路<br />
缺点：时间复杂度高<br />
<span style="color:red;">Bellman-Ford(SPFA)</span><br />
优点：求负环问题<br />
缺点：最坏情况复杂度高
