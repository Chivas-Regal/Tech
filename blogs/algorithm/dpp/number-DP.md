---
key: 2021-08-01-数位DP
layout: article
title: 数位DP
subtitle: 在数字上跑DP？🤔
categories: 动态规划
tags: [动态规划]
aside:
  toc: true
sidebar:
  nav: docs-en
---

> **导引问题：**  
> <span style="color: red;">题目描述</span>  
> 有一个1到n的数字序列，这个序列对应某种值x，如果当前数字序列包含子序列"49"，x就增加一个点。现在已知数字N，请问这个序列最终值是多少  
> <span style="color: red;">Input</span>  
> 2  
> 50  
> 500  
> <span style="color: red;">Output</span>  
> 1  
> 15
  
在信奥中，有一类<span style="color: red;">与数位有关的区间统计问题</span>，这类问题往往具有比较浓厚的数学味道，无法暴力求解（<span style="color:red;">TLE</span>）,<span style="color:red;">需要在数位上进行递推</span>(状态转移)等操作。  

# 基础知识
## 满足减法
如果 $f(L, R)$ 表示区间 $[L, R]$ 之间的答案  
则：  
$f(L, R) = f(0, R) - f(0, L - 1)$  
> 有点像前缀和的思想

## 高低枚举  
对于一个 $\lt n$ 的数，从高位到低位肯定会出现 $\lt n$ 的某一位  
$\begin{matrix}
\text{例如：十进制数}&n=58\; &\\
&x=49\; &\text{此时x的十位}\lt n\\
&x =51\; &\text{此时x的个位}\lt n
\end{matrix}$

## 前缀的用途
以 1234 为例，<span style="color: red;">控制上界枚举</span>  
比他小的一共有：  
<span style="color: red;">0</span>000 - <span style="color: red;">0</span>999 ：1000&nbsp;&nbsp;&nbsp;&nbsp;个  
1<span style="color: red;">0</span>00 - 1<span style="color: red;">1</span>99 ： 2 * 100个  
12<span style="color: red;">0</span>0 - 12<span style="color: red;">2</span>9 ： 3 * 10&nbsp;&nbsp;个  
123<span style="color: red;">0</span> - 123<span style="color: red;">3</span> ： 4 * 1&nbsp;&nbsp;&nbsp;&nbsp;个  
<span style="color: red;">1234(本身)</span> &nbsp;&nbsp;： 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个

# 基本思想和方法

## 预处理  
以上题为例，定义dp数组的含义如下  
$dp[i][0]$ : 长度为i，且不含有49  
$dp[i][1]$ : 长度为i，且不含有49，且最高位为9  
$dp[i][2]$ : 长度为i，且含有49  

## 状态转移方程
$dp[0][0] = 1; dp[0][1] = dp[0][2] = 0;$  
$dp[i][0] = 10 * dp[i - 1][0] - dp[i - 1][1]$  // 在前面加0～9的数字，减掉在9前面加4  
$dp[i][1] = dp[i - 1][0]$ // 最高位加9  
$dp[i][2] = 10 * dp[i - 1][2] + dp[i - 1][1]$ // 在本来含有49的前面加任意数，或者在9前面加4
$b[i]$ 保存n的第i位的值  

## 程序设计（记忆化DFS）
针对导引问题  
  
```cpp
/*
is_max : 上界，表示 "这一位枚举数字是否达到了当前数"
is4 : 上一位是不是4
*/

inline ll DFS ( int n, bool is4, bool is_max ) {
        if ( !n ) return 1;
        if ( !is_max && dp[n][is4] != -1 ) return dp[n][is4];
    
        ll res = 0;
        int m = is_max ? b[n] : 9;
        for ( int i = 0; i <= m; i ++ ) {
                if ( !(is4 && i == 9) ) res += DFS (n - 1, i == 4, is_max && i == m );
        }
        if ( !is_max ) dp[n][is4] = res;
        return res;
}
```

## 模板

```cpp
int dp[len][/*状态*/], b[10]; // dp数组要根据实际情况决定用几维的数组，b数组用来保存数字位
inline int DFS( int pos, int state, bool is_max ) { // 可以根据需要增加state参数的数量
        if ( pos == 0 ) return 1;
        if ( !is_max && ~dp[pos][state] ) return dp[pos][state];
        int end = is_max ? b[pos] : 9; // 如果前面放满了就只能循环到 b[pos]，否则到9
        int res = 0;
        for ( int i = 0; i <= end; i ++ ) {
            if ( /*满足某种条件*/ ) res += DFS (pos - 1, state, is_max && i == end ) ; // 最后一个参数：前面都放满，本位又最大
        }
        if ( !is_max ) dp[pos][state] = res;
        return res;
}
```

## 设计思路

以模板：不可出现二位数 $\alpha\beta$  

<table>
        <tr>
                <th>参数</th><th colspan="2">当前枚举到了第几位、高一位的数是几、前面的数有没有贴边行走(最大)</th><th>{</th>
        </tr>
        <tr>
                <td></td> <th>出口</th><td>n = 0 时即为初始值，构造一下值为1<br>若没有贴边行走，且记录该点就能返回记录</td><td></td>
        </tr>
        <tr>
                <td></td> <th>主体</th><td>设置一个该位可枚举到的最大值，若贴边行走就1，否则为9<br>从0向上枚举数字，若枚举到上一位构造的 α 和这一位的 β ，跳过<br>否则继续向低位递归( n - 1, 枚举到的数，在这一位上是否依然贴边行走)累加res</td><td></td>
        </tr>
        <tr>
                <td></td> <th>记录</th><td>若不贴边就是记录一下（因为若都是最大那么只有与原数相等这一种情况）</td><td></td>
        </tr>
        <tr>
                <td></td> <th>返回</th><td>返回记录内容</td><td></td>
        </tr>
        <tr>
                <th>}</th>
        </tr>
</table>




# 例题
> <span style="color: red;">题目描述:</span>  
> 为了消除出租车司机和乘客的心理障碍，杭州交管局将确保推出的出租车新牌号<span style="color: red">不含不吉利的数字</span>（含有4或62的号码称为不吉利）  
> 任务：对于每次给出的一个牌照区间号，推断出交管局今次又要实际给出多少辆新的士车上牌照了  
> <span style="color: red;">Input</span>:  
> 1 100  
> 0 0  
> <span style="color: red;">Output</span>:    
> 80

```cpp
int dp[10][10], b[10];

inline int DFS ( int n, int t, bool is_max ) {

        if ( !n ) return 1;
        if ( !is_max && dp[n][t] != -1 ) return dp[n][t];

        int res = 0;
        int m = is_max ? b[n] : 9;
        for ( int i = 0; i <= m; i ++ ) {
                if ( i != 4 && !(t == 6 && i == 2) ) 
                        res += DFS(n - 1, i, is_max && i == m ); 
        }
        if ( !is_max ) dp[n][t] = res;
        return res;
}
inline int solve ( int x ) {
        int len = 0;
        for ( len = 0; x; x /= 10 ) b[++len] = x % 10;
        return DFS(len, 0, true);
}
int main () {
        int n, m;
        memset(dp, -1, sizeof(dp));
        while ( cin >> n >> m, n && m ) {
                cout << solve(m) - solve(n - 1) << endl;
        }
}
```
