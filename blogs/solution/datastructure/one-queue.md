---
title: 单调队列
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

## CodeForces1195D_OpenStreetMap

#### 🔗
<a href="https://codeforces.com/contest/1195/problem/E">![20220708164100](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220708164100.png)</a>

#### 💡
这是一个二维的区间查询，思考两维可不可以分开处理  
已知所有行最小值的最小值就是整个矩阵的最小值，那么我们可以先对矩阵进行列压缩，每一个位置 $(i,j)$ 表示从它开始向右数 $b$ 个的最小值，也就是 $\min\limits_{k=j}^{j+b-1}h_{i,k}$ ，然后再对压缩完列之后的矩阵进行行压缩，方法同理。  
这样构造出来的最终矩阵里面所有数值的和就是答案。  
$nm$ 有点大，如何快速获取到这个区间 $min$ ，由于已经固定了子矩阵大小 $a\times b$ ，所以对于每一个位置它在一维区间上要求的是它向后固定长度的范围，这满足单调队列，从右往左使用单调队列即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e7 + 10;
int n, m, a, b;
ll g[N], x, y, z;
 
ll f[3003][3003]; // 列压缩完的矩阵
ll s[3003][3003]; // 行压缩完的矩阵
 
inline ll h (int x, int y) {
        return g[(x - 1) * m + y - 1];
}
 
int main () {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);
 
        cin >> n >> m >> a >> b;
        cin >> g[0] >> x >> y >> z;
        for (int i = 1; i < N; i ++) g[i] = (g[i - 1] * x % z + y) % z;
 
        for (int i = 1; i <= n; i ++) {
                deque<pair<ll, ll> > deq;
                for (int j = m; j >= 1; j --) {
                        while (!deq.empty() && deq.front().first >= j + b) deq.pop_front();
                        if (deq.empty()) f[i][j] = h(i, j);
                        else f[i][j] = min(deq.front().second, h(i, j));
                        while (!deq.empty() && deq.back().second >= h(i, j)) deq.pop_back();
                        deq.push_back({j, h(i, j)});
                }
        }
        for (int j = 1; j <= m - b + 1; j ++) {
                deque<pair<ll, ll> > deq;
                for (int i = n; i >= 1; i --) {
                        while (!deq.empty() && deq.front().first >= i + a) deq.pop_front();
                        if (deq.empty()) s[i][j] = f[i][j];
                        else s[i][j] = min(deq.front().second, f[i][j]);
                        while (!deq.empty() && deq.back().second >= f[i][j]) deq.pop_back();
                        deq.push_back({i, f[i][j]});
                }
        }
        ll res = 0;
        for (int i = 1; i <= n - a + 1; i ++) {
                for (int j = 1; j <= m - b + 1; j ++) {
                        res += s[i][j];
                } 
        }
        cout << res << endl;
}
```
<hr>
