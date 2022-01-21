---
key: 2021-02-13-BFS
layout: article
title: BFS
subtitle: 跑起图来真的比DFS更丝滑吗？ 🤔
categories: 搜索
tags: [搜索]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 概述
## 概念
bfs常与队列并用，是一种与dfs作用类似但更优秀与高效的算法，不用担心递归爆栈，但在记录路径时较为麻烦，在大数据或只遍历数据时可以尝试使用。

## 树遍历
过程解析：  

<img src="https://i.loli.net/2021/11/25/Yrb21AmxFKJB9q4.png">

层次遍历：1.2.3.4.5.6.7.8.9.10  
bfs理解：(ps:这里右侧为队首)  
首先祖先1入队列，开始bfs（录入：无）  

<body>
<table>
<tr>
<td></td> <td></td> <td></td> <th>1</th>
</tr>
</table>
</body>

判断队列不为空，通过队首1使两个儿子2.3依次入队列，1出去（录入：1、2、3）  

<body>
<table>
<tr>
<td></td> <td></td> <td>3</td> <th>2</th>
</tr>
</table>
</body>

判断队列不为空，通过队首2使4.5入队列，2出去（录入：1、2、3、4、5)  

<body>
<table>
<tr>
<td></td> <td>5</td> <td>4</td> <th>3</th>
</tr>
</table>
</body>

判断队列不为空，通过队首3使6.7入队，3出去（录入：1、2、3、4、5、6、7）  

<body>
<table>
<tr>
<td>7</td> <td>6</td> <td>5</td> <th>4</th>
</tr>
</table>
</body>

判断队列不为空，通过队首4无子结点入队，4出去（录入：1、2、3、4、5、6、7）  

<body>
<table>
<tr>
<td></td> <td>7</td> <td>6</td> <th>5</th>
</tr>
</table>
</body>

判断队列不为空，通过队首5使8入队，5出去（录入：1、2、3、4、5、6、7、8）  

<body>
<table>
<tr>
<td></td> <td>8</td> <td>7</td> <th>6</th>
</tr>
</table>
</body>

判断队列不为空，通过队首6使9.10入队，6出去（录入：1、2、3、4、5、6、7、8、9、10）  

<body>
<table>
<tr>
<td></td> <td>10</td>  <td>9</td> <td>8</td> <th>7</th>
</tr>
</table>
</body>

判断队列不为空，通过队首7无子结点入队，7出去（录入：1、2、3、4、5、6、7、8、9、10）  

<body>
<table>
<tr>
<td></td> <td>10</td> <td>9</td> <th>8</th>
</tr>
</table>
</body>

判断队列不为空，通过队首8无子结点入队，8出去（录入：1、2、3、4、5、6、7、8、9、10）  

<body>
<table>
<tr>
<td></td> <td></td> <td>10</td> <th>9</th>
</tr>
</table>
</body>

判断队列不为空，通过队首9无子结点入队，9出去（录入：1、2、3、4、5、6、7、8、9、10）  

<body>
<table>
<tr>
<td></td> <td></td> <td></td> <th>10</th>
</tr>
</table>
</body>

判断队列不为空，通过队首10无子结点入队，10出去（录入：1、2、3、4、5、6、7、8、9、10）  

<body>
<table>
<tr>
<td></td> <td></td> <td></td> <th></th>
</tr>
</table>
</body>

判断队列为空，结束循环，录入：1、2、3、4、5、6、7、8、9、10，遍历结束  

## 图遍历
<body>
<table>
<tr>
<td>1</td> <td>2</td> <td>3</td>
</tr>
<tr>
<td>4</td> <td>5</td> <td>6</td>
</tr>
<tr>
<td>7</td> <td>8</td> <td>9</td>
</tr>
</table>
</body>
从1走到9（且只能向右或向下），走过的不重复走，下面是队列内部流程展示
<body>
<table>
<tr>
    <td></td> <td></td> <th>1</th>
</tr>
</table>
</body>
<body>
<table>
<tr>
    <td></td> <td>4</td> <th>2</th>
</tr>
</table>
</body>

<body>
<table>
<tr>
    <td>5</td> <td>3</td> <th>4</th>
</tr>
</table>
</body>

<body>
<table>
<tr>
    <td>7</td> <td>5</td> <th>3</th>
</tr>
</table>
</body>

<body>
<table>
<tr>
    <td>6</td> <td>7</td> <th>5</th>
</tr>
</table>
</body>

<body>
<table>
<tr>
    <td>8</td> <td>6</td> <th>7</th>
</tr>
</table>
</body>

<body>
<table>
<tr>
    <td></td> <td>8</td> <th>6</th>
</tr>
</table>
</body>

<body>
<table>
<tr>
    <td></td> <td>9</td> <th>8</th>
</tr>
</table>
</body>

<body>
<table>
<tr>
    <td></td> <td></td> <th>9</th>
</tr>
</table>
</body>

<body>
<table>
<tr>
<td></td> <td></td> <th></th>
</tr>
</table>
</body>
遍历结束

## 线性遍历

[HDU测试链接](http://acm.hdu.edu.cn/showproblem.php?pid=1548)


用样例说明先，下面为队列内部展示：  
起点1层进队  

<body>
<table>
<tr>
<th>1</th>
</tr>
</table>
</body>

1层没法使-3层进队，于是4层进队，1层出队  

<body>
<table>
<tr>
<th>4</th>
</tr>
</table>
</body>

4层没法使6层进队，2层进队，4层出队  

<body>
<table>
<tr>
<th>2</th>
</tr>
</table>
</body>

2层没法使-1层入队，5层入队，二层出队  

<body>
<table>
<tr>
<th>5</th>
</tr>
</table>
</body>

5层达到，结束  

```cpp
#include <stack>
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <cstring>
#include <cmath>
#include <cstdio>
#include <queue>
#define rep1(i, a, n) for (int i = a; i <= n; i++)
#define rep2(i, a, n) for (int i = a; i >= n; i--)
#define mm(a, b) memset(a, b, sizeof(a))
#define elif else if
typedef long long ll;
const int INF = 0x7FFFFFFF;
using namespace std;
struct node//每一层的数据
{
    int level;//层数
    int steps;//最少步数
};
int N;//楼高
int start, target;//记录起点与终点
int num[205];//每一层的可移动数字
int vis[205];//记录是否走过这一层（基础剪枝）

void bfs()
{
    queue<node> q;//为每一次的起点提供可选的空间
    node cur, next;//本次的结构体与下一次的结构体
    
    //先将一套完整的起点入队
    cur.level = start;
    cur.steps = 0;
    q.push(cur);
    vis[start] = 1;//记录一下起点走过了
    
    while(!q.empty())//队内元素不为空就继续
    {
        cur = q.front();//先把栈首的拿出来用
        q.pop();
        
        if(cur.level==target) //特判是否是目标层
        {
            printf("%d\n", cur.steps);
            return;
        }

        //按向上按键
        next.level = cur.level + num[cur.level];//下一个能到的层
        next.steps = cur.steps + 1;//到达下一个层所用的步数
        if(next.level<=N&&!vis[next.level])//满足条件就记录一下然后入栈
            vis[next.level] = 1, q.push(next);

        //按向下按键
        next.level = cur.level - num[cur.level];//下一个能到的层
        next.steps = cur.steps + 1;//到达下一个层所用的步数
        if(next.level>=1&&!vis[next.level])//满足条件就记录一下然后入栈
            vis[next.level] = 1, q.push(next);
    }
    
    printf("-1\n");//空了也没法到，就输出-1
    return;
}

int main()
{
    while(scanf("%d",&N)==1,N)
    {
        mm(vis, 0);//初始化vis记录数组
        scanf("%d%d", &start, &target);
        rep1(i, 1, N) scanf("%d", &num[i]);
        bfs();
    }
    return 0;
}


```
