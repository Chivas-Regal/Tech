---
title: 概率复杂度
---

###
<hr>

## HDU2021多校9H_IntegersHaveFriends2.0

#### 🔗
<a href="https://vjudge.net/contest/461349#problem/H">![20221113230203](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113230203.png)</a>

#### 💡
这意思就是找 $a[]$ 中最大的整数组满足存在一个 $m$ 令组中内容模 $m$ 同余  
分析两个数同余的性质 $x\equiv y\rightarrow x-y\equiv 0$  
所以一个基本的内容是，这个数组中所有的奇数模 $2$ 同余，所有偶数模 $2$ 同余  
最大的组一定不小于 $\frac n2$ 个数，所以选一个数在最大组中的概率不低于 $\frac 12$  
而根据我们上面推的同余性质，发现是两个数作差，而选两个数不是全都在最大组中的概率为 $\frac 34$  
发现其实如果随机选 $30$ 次两个数，我们就基本上肯定能找到两个在最大组中的数  
故随机选两个数 $a_i,a_k$ ，然后对差求一下质因数，拿这个质因数 $p$ 去看有多少个 $j$ 满足 $a_j\equiv a_i(mod\;p)$  
跑三十次即可  

#### ✅
```cpp
const int N = 3e6 + 10;
vector<int> prime;
int ntp[N];

inline void Sieve () {
    ntp[0] = ntp[1] = 1;
    for (int i = 2; i < N; i ++) {
        if (!ntp[i]) prime.push_back(i);
        for (int j = 0; j < prime.size() && 1ll * prime[j] * i < N; j ++) {
            ntp[i * prime[j]] = 1;
            if (i % prime[j] == 0) break;
        }
    }
}

int n;
ll a[N];

inline int get (ll mod, ll els) {
    int res = 0;
    for (int i = 1; i <= n; i ++) res += a[i] % mod == els;
    return res;
}
inline void Solve () {
    scanf("%d", &n);
    for (int i = 1; i <= n; i ++) scanf("%lld", &a[i]);
    int res = 1;
    for (int _ = 0; _ < 30; _ ++) {
        int i = 0, j = 0;
        while (i == j) i = rand() % n + 1, j = rand() % n + 1;
        ll dif = llabs(a[i] - a[j]);
        for (int p : prime) {
            if (1ll * p * p > dif) break;
            if (dif % p == 0) {
                res = max(res, get(p, a[i] % p));
                while (dif % p == 0) dif /= p;
            }
        }
        if (dif > 1) res = max(res, get(dif, a[i] % dif));
    }
    printf("%d\n", res);
}
int main () {
    srand(time(NULL));
    Sieve();
    int cass; scanf("%d", &cass); while (cass --) {
        Solve();
    }
}
```
<hr>
