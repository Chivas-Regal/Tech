---
title: 欧拉反演
---
###  


## 洛谷P1447_能量采集

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1447"><img src="https://i.loli.net/2021/11/16/Eqv5o6lbAyBtOXm.png"></a>

#### 💡
这个和仪仗队那个很像啊  
 $(i,j)$ 位置上的点它前面挡住的人数就是  $gcd(i,j)$   
所以我们把柿子抽象出来  
 $\begin{aligned}main(n,m)=&\sum\limits_{i=1}^n\sum\limits_{j=1}^m(2*(i,j)-1)\\=&2\sum\limits_{i=1}^n\sum\limits_{j=1}^m(i,j)-nm\end{aligned}$   
 对于  $solve(n,m)=\sum\limits_{i=1}^n\sum\limits_{j=1}^m(i,j)$   
利用欧拉反演的核心公式  
$n=\sum\limits_{d|n}\phi(d)$   
有  
 $\begin{aligned}&solve(n,m)\\=&\sum\limits_{i=1}^n\sum\limits_{j=1}^m(i,j)\\=&\sum\limits_{i=1}^n\sum\limits_{j=1}^m\sum\limits_{d|(i,j)}\phi(d)\\=&\sum\limits_{d=1}^{mn}\phi(d)\sum\limits_{i=1}^n\sum\limits_{j=1}^m[d|i\wedge d|j]\\=&\sum\limits_{d=1}^{mn}\phi(d)\frac nd\frac md\end{aligned}$ 
   
数不大直接暴力跑就行  

#### ✅

```cpp
namespace Number {
        const int N = 1e5 + 10;
        int phi[N];
        bool not_prime[N];
        vector<int> prime;

        inline void Sieve () {
                not_prime[0] = not_prime[1] = phi[1] = 1;
                for ( int i = 2; i < N; i ++ ) {
                        if ( !not_prime[i] ) 
                                prime.push_back(i),
                                phi[i] = i - 1;
                        for ( int j = 0; j < prime.size() && i * prime[j] < N; j ++ ) {
                                not_prime[i * prime[j]] = 1;
                                if ( i % prime[j] == 0 ) {
                                        phi[i * prime[j]] = phi[i] * prime[j];
                                        break;
                                } else phi[i * prime[j]] = phi[i] * (prime[j] - 1);
                        }
                }
        }
} using namespace Number;

int main () {
        Sieve ();
        int n, m; cin >> n >> m;
        ll res = 0;
        for ( int i = 1; i <= min (m, n); i ++ ) {
                res += (ll)(m / i) * (n / i) * phi[i];
        }
        cout << res * 2 - (ll)n * m << endl;
}
```


