---
title: 特殊图
---

###  
<hr>

### 牛客2022寒假算法基础集训营2E_小沙的长路

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23477/E"><img src="https://img-blog.csdnimg.cn/16eed0f102a94997bf1dc8b00e7a3b6c.png"></a>

#### 💡
对于最短的最长路，也就是竞赛图，直接使用性质 $n-1$   

对于最长的最长路，考虑半欧拉有向图的性质  
即首尾出度入度相差 $1$ ，别的相等   
以及欧拉图的性质  
即所有点入度等于出度  
注意每个点最多有 $n-1$ 个度   
  
那么对于 $n$ 是偶数， $n-1$ 是奇数，所以我们只能造半欧拉图  
我们别的节点用 $n-2$ 的度来平分入度出度，两个点度为 $n-1$ 来满足上述性质，此时最长路为 $\frac{(n-2)\times(n-2)+2\times(n-1)}{2}$  
对于 $n$ 是奇数，$n-1$ 是偶数，我们完全可以造欧拉图  
我们让每个点度均为 $n-1$ ，那么最长路为 $\frac{n(n-1)}{2}$    

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
int main () {
        ios::sync_with_stdio(false);

        ll n; cin >> n;
        if ( n % 2 == 0 ) {
                ll res1 = n - 1;
                ll res2 = (n - 2) * (n - 2) + 2 * (n - 1);
                cout << res1 << ' ' << res2 / 2 << endl;
        } else {
                ll res1 = n - 1;
                ll res2 = (n - 1) * n;
                cout << res1 << " " << res2 / 2 << endl;
        }
} 
```
<hr>
