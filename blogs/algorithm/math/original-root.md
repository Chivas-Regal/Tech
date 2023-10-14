---
key: 2021-10-21-new-template
layout: article
title: 阶与原根
aside:
  toc: true
sidebar:
  nav: docs-en
---


# 阶 $\delta_m(a)$

定义： $gcd(a, m)=1\quad\wedge\quad a^{\delta_m(a)}\equiv1(mod\;m)$  
性质：  
- $a^i\not\equiv a^j(mod\;m)\;(1\le i,j\le \delta_m(a))$  
- $a^n\equiv1(mod\;m)\rightarrow\delta_m(a)|n\quad and \quad a^x\equiv a^y(mod\;m)\rightarrow x\equiv y(mod\;\delta_m(a))$  
- $gcd(a,m)=gcd(b,m)=1\rightarrow (\delta_m(ab)=\delta_m(a)\delta_m(b)\quad\Longleftrightarrow\quad gcd(\delta_m(a),\delta_m(b))=1)$  
- $gcd(a,m)=1\rightarrow\delta_m(a^k)=\frac{\delta_m(a)}{gcd(\delta_m(a), k)}$

# 原根$a$

定义： $gcd(a,m)=1\quad\wedge\quad\delta_m(a)=\phi(m)\quad\wedge\quad a^{\phi(m)}\equiv1(mod\; m)$   
判定定理： $\forall p|\phi(m)\quad a^{\frac{\phi(m)}{p}}\not\equiv 1(mod\;m)$  
原根个数： $\phi(\phi(m))$<br>所有原根： $\{minrt^1,minrt^2,...minrt^j,...,minrt^{\phi(m)}\}\quad\wedge\quad gcd(j,\phi(m))=1$   
引理1： $\exists g$ 是模 $m$ 的原根， $g^{p-1}\not\equiv1(mod\;p^2)$  
引理2： $\forall\beta\in N^*\wedge p\not\mid k_\beta,\quad g^{\phi(p^\beta)}=1+p^\beta\times k_\beta$   
原根存在定理： $m=2,4,p^a,2p^a\quad \forall p\in\{ oddprime\}$   

# 证明

## 阶性质一<br>$a^i\not\equiv a^j(mod\;m)\;(1\le i,j\le\delta_m(a))$

反证法  
若 $a^i\equiv a^j(mod\;m)(1\le i, j\le\delta_m(a))$  
则 $a^{i-j}\equiv a^{\delta_m(a)}\equiv 1(mod\;m)$  
$\because\{i,j\}\in\delta_m(a)$  
$\therefore i-j\lt\delta_m(a)$ ，与定义冲突不成立，所以性质成立

## 阶性质二<br>$a^n\equiv1(mod\;m)\rightarrow\delta_m(a)|n\quad and \quad a^x\equiv a^y(mod\;m)\rightarrow x\equiv y(mod\;\delta_m(a))$

$\because a^{\delta_m(a)}\equiv1(mod\; m)\quad\wedge\quad a^x\equiv y\not\equiv1(mod\;m)(x\lt\delta_m(a))$  
$\therefore \prod a^{\delta_m(a)}\equiv a^{\sum\delta_m(a)}\equiv\prod 1\equiv a^n\equiv1(mod\;m)$   
$\therefore\delta_m(a)|n$  
且 $a^x*\prod a^{\delta_m(a)}\equiv a^{x+\sum\delta_m(a)}\equiv y\times1\not\equiv1(mod\; m)$ ，性质二(1)得证  

与上面最后一行类似  
$\because a^{y-x}\equiv 1\equiv a^{\delta_m(a)}(mod\; m)$  
$\therefore \delta_m(a)|(y-x)$  
$\therefore x\equiv y(mod\;\delta_m(a))$ ，性质二(2)得证  

## 阶性质三<br>$gcd(a,m)=gcd(b,m)=1\rightarrow (\delta_m(ab)=\delta_m(a)\delta_m(b)\quad\Longleftrightarrow\quad gcd(\delta_m(a),\delta_m(b))=1)$

必要性  
$\because a^{\delta_m(a)}\equiv1(mod\;m)\;and\;b^{\delta_m(b)}\equiv1(mod\;m)$  
$\therefore(ab)^{lcm(\delta_m(a),\delta_m(b))}\equiv1(mod\;m)$  
$\therefore gcd(a,m)=gcd(b,m)=1\rightarrow gcd(ab,m)=1$  
$\therefore (ab)^{\delta_m(ab)}\equiv1(mod\;m)$  
由于阶性质二得： $\delta_m(ab)|lcm(\delta_m(a),\delta_m(b))$  
$\because\delta_m(ab)=\delta_m(a)\delta_m(b)$  
$\therefore\delta_m(a)\delta_m(b)|lcm(\delta_m(a),\delta_m(b))$  
$\therefore\delta_m(a)\delta_m(b)|lcm(\delta_m(a),\delta_m(b))\rightarrow\delta_m(a)\delta_m(b)=lcm(\delta_m(a),\delta_m(b))\rightarrow gcd(\delta_m(a),\delta_m(b))=1$  

充分性  
上同，略证 $\delta_m(ab)|lcm(\delta_m(a),\delta_m(b))$  
$gcd(\delta_m(a),\delta_m(b))\rightarrow lcm(\delta_m(a),\delta_m(b))=\delta_m(a)\times\delta_m(b)$  
$\therefore \delta_m(ab)|\delta_m(a)\delta_m(b)$  
又 $\because(ab)^{\delta_m(ab)}\equiv(ab)^{\delta_m(a)\delta_m(b)}\equiv(a^{\delta_m(a)})^{\delta_m(b)}(b^{\delta_m(b)})^{\delta_m(a)}\equiv1(mod\; m)$  
$\therefore\delta_m(a)|\delta_m(ab)\;and\;\delta_m(b)|\delta_m(ab)\rightarrow\delta_m(a)\delta_m(b)|\delta_m(ab)$  
综上 $\therefore \delta_m(ab)|\delta_m(a)\delta_m(b)\;and\;\delta_m(a)\delta_m(b)|\delta_m(ab)\rightarrow\delta_m(ab)=\delta_m(a)\delta_m(b)$

## 阶性质四<br>$gcd(a,m)=1\rightarrow\delta_m(a^k)=\frac{\delta_m(a)}{gcd(\delta_m(a), k)}$

$(a^k)^{\delta_m(a^k)}\equiv a^{k\delta_m(a^k)}\equiv1(mod\;m)\rightarrow \delta_m(a)|k\delta_m(a^k)\rightarrow\frac{\delta_m(a)}{gcd(\delta_m(a),k)}|\delta_m(a^k)$  
$(a^k)^{\frac{\delta_m(a)}{gcd(\delta_m(a),k)}}\equiv(a^{\delta_m(a)})^{\frac k{gcd(\delta_m(a),k)}}\equiv a^{\delta_m(a)}\equiv1(mod\;m)\rightarrow \delta_m(a^k)|\frac{\delta_m(a)}{gcd(\delta_m(a),k)}$  
$\therefore\delta_m(a^k)=\frac{\delta_m(a)}{gcd(\delta_m(a),k)}$


## 原根判定定理<br>$\forall p|\phi(m)\quad a^{\frac{\phi(m)}{p}}\not\equiv1(mod\;m)$

设对于这种条件下， $\exists a$ 不是模 $m$ 的原根  
则 $\exists t\lt\phi(m)\quad a^t\equiv1(mod\;m)$  
$\because Bézout's\;identity$ $\therefore\exists x,y\quad xt-y\phi(m)=gcd(t,\phi(m))\rightarrow xt=gcd(t,\phi(m))+y\phi(m)$  
$a^t\equiv a^{kt}\equiv a^{gcd(t,\phi(m))+y\phi(m)}\equiv a^{gcd(t,\phi(m))}\times a^{y\phi(m)}\equiv1(mod\;m)$  
$\because Euler\;Theorem$ ， $\therefore a^{\phi(m)}\equiv1(mod\;m)\rightarrow a^{gcd(t,\phi(m))}\equiv1(mod\;m)$  
$\because gcd(t,\phi(m))|\phi(m)\quad \wedge\quad gcd(t,\phi(m))\le t\lt \phi(m)$  
$\therefore\exists p|\phi(m)\wedge p\in\{oddprime\},\quad gcd(t,\phi(m))=\frac{\phi(m)}{p}$  
$\therefore a^{gcd(t,\phi(m))}\equiv a^{\frac{\phi(m)}{p}}\equiv1(mod\;m)$ 矛盾  
$\therefore$ 假设不成立

## 原根个数<br>$\phi(\phi(m))$<br>所有原根<br>$\{minrt^1,minrt^2,...minrt^j,...,minrt^{\phi(m)}\}\quad\wedge\quad gcd(j,\phi(m))=1$

若 $\exists m$ 的原根$a$，阶性质四 $\rightarrow \delta_m(a^k)=\frac{\delta_m(a)}{gcd(\delta_m(a),k)}=\frac{\phi(m)}{gcd(\phi(m),k)}$  
$\therefore gcd(\phi(m),k)=1\rightarrow\delta_m(a^k)=\phi(m)\rightarrow\delta_m(a^k)$ 也是模 $m$ 的原根  
$\sum[gcd(k,\phi(m))=1]=\phi(\phi(m))$



## 引理1<br> $\exists g$ 是模 $m$ 的原根， $g^{p-1}\not\equiv1(mod\;p^2)$

设 $g$ 是模 $m$ 的原根，且 $(g+p)^{p-1}$ 满足条件<br>$\begin{aligned}(g+p)^{p-1}&\equiv C_{p-1}^0g^{p-1}+C_{p-2}^1g^{p-1}p\\&\equiv g^{p-1}+p(p-1)g^{p-2}\\&\equiv p^2g^{p-2}+g^{p-1}-pg^{p-2}\\&\equiv0+1-pg^{p-2}\\&\not\equiv1(mod\;p^2)\end{aligned}\\$



## 引理2<br>$\forall\beta\in N^*\wedge p\not\mid k_\beta,\quad g^{\phi(p^\beta)}=1+p^\beta\times k_\beta$

$\beta=1$ 显然成立<br>设对 $\beta$ 成立，需证对 $\beta+1$ 也成立<br>$\begin{aligned}g^{\phi(p^{\beta+1})}&=g^{\phi(p^\beta\times p)}\\&=g^{\phi(p^\beta)p}\\&=(1+p^\beta\times k_\beta)^p\\&\equiv1+p^{\beta+1}\times k_\beta(mod\;p^{\beta+2})\end{aligned}$<br>结合 $p\not\mid k_\beta$ 成立

## 原根存在定理<br>$m=2,4,p^a,2p^a\quad \forall p\in\{ oddprime\}$

### $m=2,4$

显然，证略

### $m=p^a$

对于 $p$

由阶性质三的必要性证明 $gcd(a,m)=gcd(b,m)=1\rightarrow \delta_m(ab)|lcm(\delta_m(a),\delta_m(b))$  
即 $\exists c,\;\delta_m(c)=lcm(\delta_m(a),\delta_m(b))$  
对 $1\sim p-1$ 两两进行 $lcm$ 并做入上转化得： $\exists c,\;\delta_p(c)=lcm(\delta_p(1),\delta_p(2),...,\delta_p(p-1))$  
$\therefore\forall j\in\{1,2,...,p-1\},\quad \delta_p(j)|\delta_p(c)$  
是 $x^{\delta_p(c)}\equiv1(mod\; p)$ 的根  
$\because Lagrange\;theorem\rightarrow\delta_p(c)\le\phi(p)$  
$\because Fermat's\;little\;theorem\rightarrow\delta_p(c)\ge\phi(p)$  
$\therefore\delta_p(c)=\phi(p)$  
$\therefore c$ 是模 $p$ 的原根  



对于 $p^a$

$\because Euler\;Theorem,\quad\therefore\delta_{p^a}(g)\mid p^{\alpha-1}(p-1)$<br>设 $\delta_{p^\alpha}(g)=p^{\alpha-1}(p-1),\quad 1\le\beta\le \alpha$<br>由引理一二 $\longrightarrow g^{\phi(p^\beta)}\equiv1+p^\beta\times k_\beta\not\equiv1(mod\;p^{\beta+1})\longrightarrow g^{\delta_{p^\alpha}(g)}\not\equiv1(mod\;p^{\beta+1})$ <br>$g^{\delta_{p^\alpha}(g)}\equiv1(mod\;p^{\alpha})\rightarrow\beta\ge\alpha$<br>$\therefore\beta=\alpha$<br>$\therefore\delta_{p^\alpha}(g)=p^{\alpha-1}(p-1)=\phi(p^\alpha)$<br>$\therefore g$ 是模 $p^\alpha$ 的原根

### $m=2p^a$

$\because \phi(p^a)=\phi(2p^a)$<br>$\therefore$ 得证





# 原根求法

首先要判断一个数是否有原根  

这个可以通过预处理得到（在欧拉筛的时候顺带最后根据 $prime$ 数组推一遍就行  

```cpp
has_rt[2] = has_rt[4] = 1;
for ( ll i = 1; i < prime.size(); i ++ ) {
        for ( ll j = 1; j * prime[i] < N; j *= prime[i] ) has_rt[j * prime[i]] = 1;
        for ( ll j = 2; j * prime[i] < N; j *= prime[i] ) has_rt[j * prime[i]] = 1;
}
```



既然所有的原根都是最小原根 $minrt$ 的整数幂且一共就 $\phi(\phi(m))$ 个  
那么我们可以先求出来 $minrt$ 然后通过遍历 $1\to \phi(m)$ 获取所有的原根  
对于最小的原根我们可以从 $1$ 往后枚举，根据原根判定定理去查询（对于 $\phi(m)$ 的质因数我们也可以通过预处理实现

```cpp
vector<ll> sep;
inline void Seperator ( ll x ) {
        x = phi[x];
        for ( ll i = 2; i * i <= x; i ++ ) {
                if ( x % i == 0 ) sep.push_back(i);
                while ( x % i == 0 ) x /= i;
        }
        if ( x > 1 ) sep.push_back(x);
}
inline bool Check ( ll x, ll n ) {
        if ( ksm ( x, phi[n], n ) != 1 ) return 0;
        for ( ll i = 0; i < sep.size(); i ++ ) if ( ksm ( x, phi[n] / sep[i], n ) == 1 ) return 0;
        return 1;
}
inline ll get_Min_Rt ( ll x ) {
        for ( ll i = 1; i <= x; i ++ ) if ( Check ( i, x ) ) return i;
        return 0;
}
```

 然后根据这个 $minrt$ 求得所有的原根

```cpp
vector<int> rt;
inline void get_All_Rt ( ll minrt, ll n ) {
        ll cur = 1;
        for ( ll i = 1; i <= phi[n]; i ++ ) {
                cur = cur * minrt % n;
                if ( gcd(i, phi[n]) == 1 ) rt.push_back(cur);
        }
}
```

这样我们就成功获取啦  



**总程序**

```cpp
const ll N = 1e6 + 10;

namespace Number {
        bool has_rt[N], not_prime[N];
        vector<ll>prime;
        ll phi[N];
        inline void Sieve () {
                not_prime[0] = not_prime[1] = phi[1] = 1;
                for ( ll i = 2; i < N; i ++ ) {
                        if ( !not_prime[i] ) 
                                phi[i] = i - 1,
                                prime.push_back(i);
                        for ( ll j = 0; j < prime.size() && i * prime[j] < N; j ++ ) {
                                not_prime[i * prime[j]] = 1;
                                if ( i % prime[j] == 0 ) {
                                        phi[i * prime[j]] = phi[i] * prime[j];
                                        break;
                                } else phi[i * prime[j]] = phi[i] * (prime[j] - 1);
                        }
                }
                has_rt[2] = has_rt[4] = 1;
                for ( ll i = 1; i < prime.size(); i ++ ) {
                        for ( ll j = 1; j * prime[i] < N; j *= prime[i] ) has_rt[j * prime[i]] = 1;
                        for ( ll j = 2; j * prime[i] < N; j *= prime[i] ) has_rt[j * prime[i]] = 1;
                }
        }
        inline ll ksm ( ll a, ll b, ll mod ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1;} return res; }
        inline ll gcd ( ll a, ll b ) { return b ? gcd(b, a % b) : a; }

        vector<ll> sep, rt;
        inline void Seperator ( ll x ) {
                x = phi[x];
                for ( ll i = 2; i * i <= x; i ++ ) {
                        if ( x % i == 0 ) sep.push_back(i);
                        while ( x % i == 0 ) x /= i;
                }
                if ( x > 1 ) sep.push_back(x);
        }
        inline bool Check ( ll x, ll n ) {
                if ( ksm ( x, phi[n], n ) != 1 ) return 0;
                for ( ll i = 0; i < sep.size(); i ++ ) if ( ksm ( x, phi[n] / sep[i], n ) == 1 ) return 0;
                return 1;
        }
        inline ll get_Min_Rt ( ll x ) {
                for ( ll i = 1; i <= x; i ++ ) if ( Check ( i, x ) ) return i;
                return 0;
        }
        inline void get_All_Rt ( ll minrt, ll n ) {
                ll cur = 1;
                for ( ll i = 1; i <= phi[n]; i ++ ) {
                        cur = cur * minrt % n;
                        if ( gcd(i, phi[n]) == 1 ) rt.push_back(cur);
                }
        }
}using namespace Number;

int main () {
        ios::sync_with_stdio(false); Sieve ();
        ll cass; cin >> cass; while ( cass -- ) {
                ll n; cin >> n; // 求n的原根
                if ( has_rt[n] ) { // 有原根
                        rt.clear(); sep.clear();
                        Seperator ( n );
                        get_All_Rt ( get_Min_Rt(n), n ); 
                        sort ( rt.begin(), rt.end() );
                        cout << rt.size() << endl;
                        for ( auto i : rt ) cout << i << " ";
                        cout << endl;
                } else { // 无原根
                        cout << 0 << endl << endl;
                }
        }
}
```









