---
title: 分治
---

##
<hr>

## NamomoCamp2022春季div1每日一题_好序列

#### 🔗
<a href="http://oj.daimayuan.top/problem/613">![20220326083430](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220326083430.png)</a>

#### 💡
看到这种区间要满足一堆信息判断的，先去想分治  
发现如果一个区间内有出现 $1$ 次的，那么左边界在这个位置左边，右边界在这个位置右边的子区间均满足  
这样涵盖下来，就只剩左右边界都在左侧和都在右侧的情况了  
就可以去分治  
但是分治内暴力处理一遍每个数出现次数肯定是很不优雅也很费时的  
所以我们预处理一下每一个位置的数上一个出现的位置和在一个出现的位置  
然后在分治内从两端同时向中间扫 $[tl:l\to mid,\;\;tr:r\to mid]$ ，去检查我们扫的 $tl,tr$ 是否有满足的，满足的直接去进行递归分治判断  
这样每一次最坏的情况就是走 $\frac{r-l+1}{2}$ 次，时间复杂度 $O(nlogn)$  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e5 + 10;

int n;
int a[N];
int pre[N], nxt[N], id[N];

inline bool dfs_Div ( int l, int r ) {
        if ( l >= r ) return true;

        for ( int tl = l, tr = r; tl <= tr; tl ++, tr -- ) {
                if ( pre[tl] < l && r < nxt[tl] ) 
                        return dfs_Div(l, tl - 1) && dfs_Div(tl + 1, r);
                if ( pre[tr] < l && r < nxt[tr] ) 
                        return dfs_Div(l, tr - 1) && dfs_Div(tr + 1, r);
        }
        return false;
}

inline void Solve () {
        scanf("%d", &n); for ( int i = 0; i <= n; i ++ ) pre[i] = -1, nxt[i] = 0x3f3f3f3f;
        vector<int> nums;
        for ( int i = 1; i <= n; i ++ ) scanf("%d", &a[i]), nums.push_back(a[i]);
        sort ( nums.begin(), nums.end() );
        nums.erase(unique(nums.begin(), nums.end()), nums.end());
        for ( int i = 1; i <= n; i ++ ) a[i] = lower_bound(nums.begin(), nums.end(), a[i]) - nums.begin() + 1;

        for ( int i = 0; i <= n; i ++ ) id[i] = 0;
        for ( int i = 1; i <= n; i ++ ) {
                if ( id[a[i]] ) pre[i] = id[a[i]];
                id[a[i]] = i;
        }
        for ( int i = 0; i <= n; i ++ ) id[i] = 0;
        for ( int i = n; i >= 1; i -- ) {
                if ( id[a[i]] ) nxt[i] = id[a[i]];
                id[a[i]] = i;
        }

        puts(dfs_Div(1, n) ? "non-boring" : "boring");
}

```
<hr>
