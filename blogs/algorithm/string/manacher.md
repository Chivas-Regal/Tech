---
key: 2021-03-01-Manacher
layout: article
title: Manacher
subtitle: 找回文字符串？🤔
categories: 字符串
tags: [字符串]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 😀概念
Manacher算法又称马拉车算法，是求回文串的快速算法，其中核心思想是利用已知的来求得未知的。

# 😀思路
回文串有一个性质，就是比如"abacaba"这样一个命名为s的回文串，其中心是s[3]='c'，将其设为主回文串。
左边以s[0]为中心的回文长度=右边匹配的s[6]为中心的回文长度=1
左边以s[1]为中心的回文长度=右边匹配的s[5]为中心的回文长度=3
左边以s[2]为中心的回文长度=右边匹配的s[4]为中心的回文长度=1
易得以s[s.size()-1-i]为中心的回文长度等于以s[i]为中心的回文长度
这种性质可以帮我们摆脱大量数据运行

# 😀过程
在回文串的判定时奇回文串和偶回文串的判断方式不同，我们要将原回文串两两之间与两边各插入一个字符'#'来帮我们取消这种差异（均为奇数个），同时我们要添加哨兵'@'来防止我们越0这个位置扩展导致RE
设id为主回文串的中心下标，mx为主回文串的右边界，p[i]为以i为中心的回文串半径
我们命名一个s字符串并完成插入，并初始化每个位置为中心的回文串半径为0（下面深色框代表主串中心位置）
<table>
<tr>
    <td>@</td><td>#</td> <td>a</td><td>#</td><td>c</td><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>

1.开始时使用中心扩展求得s[0]为中心的回文串半径p[0]为1，此时mx=p[0]+0=0，id=0
<table>
<tr>
    <th>@</th><td>#</td> <td>a</td><td>#</td><td>c</td><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <th>1</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
2.发现在i=1时i>=mx，所以我们要更新p[i]为1，往外部中心扩展后p[i]不变，但p[i]+i=2（此小回文串右边界）超过了主回文串的右边界mx，所以设置i为新的id，mx更新为p[i]+i=2
<table>
<tr>
    <td>@</td><th>#</th> <td>a</td><td>#</td><td>c</td><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><th>1</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
3.在i=2时跟（2）一样，但在中心扩展的过程后发现p[i=2]=2，所以mx=4，id=2
<table>
<tr>
    <td>@</td><td>#</td> <th>a</th><td>#</td><td>c</td><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><th>2</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
4.i=3 < 4，所以是在当前主串内，利用回文串的性质，我们可以得到p[3]=p[1]=1
<table>
<tr>
    <td>@</td><td>#</td> <th>a</th><td>#</td><td>c</td><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><th>2</th><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
5.i=4时>=mx，所以应更新为1，中心扩展完p[4]=4，p[4]+4=8>mx，所以id=4，mx=8
<table>
<tr>
    <td>@</td><td>#</td> <td>a</td><td>#</td><th>c</th><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><td>2</td><td>1</td><th>4</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
6.i=5、6,p[i]在左边的对应均小于等于mx即p[i]+i<=mx，所以均可以完全照搬
<table>
<tr>
    <td>@</td><td>#</td> <td>a</td><td>#</td><th>c</th><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><td>2</td><td>1</td><th>4</th><td>1</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
7.i=7时，p[i]先求得与边界的距离为1，在中心扩展后p[7]=3，p[7]+i>mx，所以更新主串id=7，mx=10
<table>
<tr>
    <td>@</td><td>#</td> <td>a</td><td>#</td><td>c</td><td>#</td><td>a</td><th>#</th><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><td>2</td><td>1</td><td>4</td><td>1</td><td>2</td><th>3</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
8.i=8、9时，p[i]+i未超过mx且与右边界的距离>=左边对应，所以复制左边对应的得p[8]=2,p[9]=1
<table>
<tr>
    <td>@</td><td>#</td> <td>a</td><td>#</td><td>c</td><td>#</td><td>a</td><th>#</th><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><td>2</td><td>1</td><td>4</td><td>1</td><td>2</td><th>3</th><td>2</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
9.i=10时>=mx，所以p[i]初始化为1，中心扩展得p[i]=4，p[i]+4=14>mx，更新主串id=10，mx=14
<table>
<tr>
    <td>@</td><td>#</td> <td>a</td><td>#</td><td>c</td><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><th>b</th><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><td>2</td><td>1</td><td>4</td><td>1</td><td>2</td><td>3</td><td>2</td><td>1</td><th>4</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
10.i=11时复制即可
<table>
<tr>
    <td>@</td><td>#</td> <td>a</td><td>#</td><td>c</td><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><th>b</th><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><td>2</td><td>1</td><td>4</td><td>1</td><td>2</td><td>3</td><td>2</td><td>1</td><th>4</th><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
11.i=12时复制得p[i]=2，但在中心扩展后p[i]=6,p[i]+i=18>mx，所以更新主串id=12，mx=18
<table>
<tr>
    <td>@</td><td>#</td> <td>a</td><td>#</td><td>c</td><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><th>a</th><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><td>2</td><td>1</td><td>4</td><td>1</td><td>2</td><td>3</td><td>2</td><td>1</td><td>4</td><td>1</td><th>6</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
</tr>
</table>
12.右边的自行复制即可
<table>
<tr>
    <td>@</td><td>#</td> <td>a</td><td>#</td><td>c</td><td>#</td><td>a</td><td>#</td><td>a</td><td>#</td><td>b</td><td>#</td><th>a</th><td>#</td><td>b</td><td>#</td><td>a</td><td>#</td>
</tr>
<tr>
    <td>1</td><td>1</td><td>2</td><td>1</td><td>4</td><td>1</td><td>2</td><td>3</td><td>2</td><td>1</td><td>4</td><td>1</td><th>6</th><td>1</td><td>4</td><td>1</td><td>2</td><td>3</td>
</tr>
</table>
13.结束。

我们一直担心的一种情况并未发生，但的确是可以算作一种特殊情况的，就是当本该复制的数超过了其与右边界的距离时，我们应该选择小的来定义，比如
<table>
<tr>
    <td>...</td><td>i</td><th>id</th><td>i</td><td>mx</td>
</tr>
    <td>...</td><td>3</td><th>3</th><td>0</td><td>0</td>
</table>
我们在复制的时候，mx-i=1,p[id*2-i]=3，所以我们要使p[i]=1然后再中心扩展，才能保证主串中心点移植到它身上

# 😀Manacher函数

```cpp
string Manacher(string s)
{
    int len = s.size();

    //-------------------------------------------插入处理（防止奇偶影响）
    string ss = "$#";
    rep1(i, 0, len - 1) ss += s[i], ss += "#";
    //---------------------------------------------

    vector<int> p(ss.size(), 0);//储存以i为中心时回文串长度
    int id = 0, mx = 0;//id储存当前主回文串中心位置，mx储存当前主回文串右边界
    int res_center = 0, res_len = 0;//储存最长回文串的中心点与长度
    rep1(i, 0, ss.size() - 1)
    {
        p[i] = i < mx ? min(p[2 * id - i], mx - i) : 1;//判断i是否到达当前主回文串右边界

        while(ss[i+p[i]]==ss[i-p[i]])//中心扩展更新回文串长度
            ++p[i];
        
        if(mx<i+p[i])//判断是否内部回文串右边界超出主回文串右边界，超出的话改变主回文串为当前回文串
            mx = i + p[i], id = i;

        if(res_len<p[i])//更新哪个是最大回文串
            res_len = p[i], res_center = i;
    }

    //返回最大回文串，若想返回长度return res_len即可
    return s.substr((res_center - res_len) / 2, res_len - 1);
}
```
