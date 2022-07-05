---
title: 单调队列优化
---

###
<hr>

## 省赛2022江苏C_JumpAndTreasure

#### 🔗
<a href="https://codeforces.com/gym/103743/problem/C">![20220605163310](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220605163310.png)</a>

#### 💡
看见倍数，知道这是一个埃氏筛的复杂度写法  
如果 $x=1$ ，那么能感受到对于 $i$ ，要查询 $[i-p,i-1]$ 之间的最大 $dp$ ，这个问题就很明显可以单调队列优化了  
拓展到 $x>1$ 也是一样可以优化   
那么就是和 [洛谷P1440_求m区间内的最小值](https://www.luogu.com.cn/problem/P1440) 是一样的写法  
维护一个值用作队列里面的单调关键字，维护一个下标维护队首元素要 $\ge i-p$   
然后每次插入用队首与 $a_i$ 去更新的 $\{dp_i,i\}$ 即可   
如果当前位置距离 $n+1$ 不超过 $p$ 了就可以维护我们预处理的最大值了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e6 + 10;
ll res[N], dp[N];
int a[N], n, q, p;
 
int main () {
        scanf("%d%d%d", &n, &q, &p);
        for (int i = 1; i <= n; i ++) scanf("%d", &a[i]);
 
        deque<pair<int, ll> > que;
        for (int i = 1; i <= p; i ++) {
                res[i] = -1e18;
                que.clear();
                que.push_back({0, 0});
                for (int j = i; j <= n; j += i) {
                        while (!que.empty() && que.front().first < j - p) que.pop_front();
                        if (que.empty()) dp[j] = a[j];
                        else dp[j] = que.front().second + a[j];
                        while (!que.empty() && que.back().second <= dp[j]) que.pop_back();
                        que.push_back({j, dp[j]});
                        if (j + p > n) res[i] = max(res[i], dp[j]);
                }
        }
 
        for (int i = 0; i < q; i ++) {
                int x; scanf("%d", &x);
                if (x > p) puts("Noob");
                else printf("%lld\n", res[x]);
        }
}
```
<hr>
