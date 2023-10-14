---
key: 2021-11-29-xuanxianfa
layout: article
title: 悬线法
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 导引问题  
一个 $01$ 矩阵，求最大的全为 $1$ 的子矩阵   

# 悬线法

## 作用

求满足某个构造条件的最大的子矩阵

## 思想

对于每个满足要求的子矩阵，都有一个底边，底边上必定会存在点  
那么我们就求一下以每个点作为底边上某个点的时候，可以形成的最大满足要求的矩阵  
对于每一个点 $(i,j)$ ，我们用一根竖着的线（高度为纵向满足要求的最高点）往左右移动，直到移动到最大的满足要求的左右边界  

## 定义

$h[i][j]：$ $(i,j)$ 这个点往上拉线，线的顶端能到的最高点  
$lft[i][j]：$ 从 $(i,j)$ 往上拉线之后，这根线能够移动到的最左点  
$rgt[i][j]：$ 从 $(i,j)$ 往上拉线之后，这根线能够移动到的最右点  

## 求法
  
首先如果 $(i,j)$ 满足要求， $lft[i][j]$ 和 $rgt[i][j]$ 都应设为当前的横坐标 $j$ ，同时 $h[i][j]$ 设为 $1$   
如果不满足的话就都是 $0$ 就好  
  
然后就是朴素的递推扩展    
如果左侧满足的话： $lft[i][j]=lft[i][j-1]$  
如果右侧满足的话： $rgt[i][j]=rgt[i][j+1]$  
如果上侧满足的话： $h[i][j]=h[i-1][j]+1$  
  
但是要注意，如果出现这种情况  
$$\begin{matrix}
&1&1&1&1&1&1&1\\
&1&1&0&1&0&1&1\\
&0&1&1&x&1&1&0\\
&&&&...
\end{matrix}\qquad(x=1)$$  
这样的话 $x$ 向上拉的线会被第二层两侧的 $0$ 挡住，但是它左侧右侧都会让它继续延伸  
那么如果上侧也满足要求的话， $x$ 点是需要从上面延伸的继承并比较下来的    
即：  
$lft[i][j]=max(lft[i-1][j],lft[i][j])$  
$rgt[i][j]=min(rgt[i-1][j],rgt[i][j])$  

# 程序
  
```cpp
const int N = 1e3 + 10;
int Map[N][N];
int lft[N][N], rgt[N][N], up[N][N];

int main () {

        int n, m; cin >> n >> m;
        for ( int i = 1; i <= n; i ++ ) for ( int j = 1; j <= m; j ++ ) cin >> Map[i][j];

        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j <= m; j ++ )     lft[i][j] = rgt[i][j] = j * (Map[i][j] == 1), up[i][j] = (Map[i][j] == 1);
                for ( int j = 2; j <= m; j ++ )     if ( Map[i][j] && Map[i][j - 1] ) lft[i][j] = lft[i][j - 1]; 
                for ( int j = m - 1; j >= 0; j -- ) if ( Map[i][j] && Map[i][j + 1] ) rgt[i][j] = rgt[i][j + 1]; 
                if ( i >= 2 ) 
                        for ( int j = 1; j <= m; j ++ ) 
                                if ( Map[i][j] && Map[i - 1][j] ) 
                                        up[i][j] = up[i - 1][j] + 1,
                                        lft[i][j] = max(lft[i][j], lft[i - 1][j]),
                                        rgt[i][j] = min(rgt[i][j], rgt[i - 1][j]);
        }
        int res1 = 0, // 正方形
            res2 = 0; // 长方形
        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j <= n; j ++ ) {
                        res1 = max(res1, min(up[i][j], rgt[i][j] - lft[i][j] + 1) * min(up[i][j], rgt[i][j] - lft[i][j] + 1) ),
                        res2 = max(res2, up[i][j] * (rgt[i][j] - lft[i][j] + 1)); 
                }
        }
        cout << res1 << endl << res2 << endl;
}
```
