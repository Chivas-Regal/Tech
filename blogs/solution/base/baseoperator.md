---
title: 位运算
---

###
<hr>

## 牛客2022寒假算法基础集训营4K_小红的真真假假签到题题

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23479/K"><img src="https://img-blog.csdnimg.cn/6fc08de6a4cc42d493ed9bd838c4b980.png"></a>

#### 💡
要求子串，且 $1$ 的个数不同  
那么我们让 $x$ 化为 $01$ 串后两段 $x$ 拼在一起即可  
方便下其实左移 $30$ 为后腾出充足的位置在补上 $x$ 即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```python
x = int(input())
print(x << 30 | x)
```
<hr>


## ABC238D_ANDandSUM

#### 🔗
<a href="https://atcoder.jp/contests/abc238/tasks/abc238_d"><img src="https://img-blog.csdnimg.cn/af7ca7acb9924ca2b06a4d7d26ef0811.png"></a>

#### 💡
首先 $\&$ 下两个数在 $a$ 含 $1$ 的位置上都至少是 $1$ ，所以 $s$ 至少是 $a+a$   
这是首先的特判  
多出来的部分我们设置为 $dir$ ，$dir$ 可以通过 $x$ 或 $y$ 都是 $0$ 的位置让其中一个变成 $1$ 但是不能都变，不然 $\&$ 就会改变，当然 $1$ 的位置是变不了的    
所以只要 $dir$ 和 $a$ 不存在有一位两者都为 $1$ 即可  
即 $dir\&a=0$   

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
inline void Solve () {
        ll a, s; cin >> a >> s;
        if ( a + a > s ) cout << "No" << endl;
        else {
                ll dir = s - (a + a);
                if ( dir & a ) cout << "No" << endl;
                else           cout << "Yes" << endl;
        }
}
```
<hr>

## CodeForces1635D_InfiniteSet

#### 🔗
<a href="https://codeforces.com/contest/1635/problem/D"><img src="https://img-blog.csdnimg.cn/d44a4c18fe324c4caebd7a0cd3dc29c4.png"></a>

#### 💡
$2x+1$ 为奇，$4x$ 为偶  
若 $a<b$，$a\in[a]$ 且 $b\in[a]$ 且 $a$ 可变为 $b$ ，删去 $b$ ，称为去重  
去重操作从大到小，对数的奇偶性进行向下修正，直到为偶数且模 $4$ 不为 $0$ 停止，如果向下修正时当前数已经存在，那么需要删掉    
去重后，剩下的所有在变化中将毫不相干  
  
注意 $2^p$ 说明是一个二进制问题  
考虑一下，对于  
$$1_2\left\{\begin{aligned}
&\stackrel{\times2+1}{\longrightarrow}11_2\\
&\stackrel{\times4}{\longrightarrow}100_2
\end{aligned}\right.$$ 
可以看出，一个 $x$ 位的数可以推到 $x+1$ 位与 $x+2$ 位  
阶梯问题，所以是 $fibonacci$  
那么对于一个有 $sz$ 位的数，可以变化出 $p$ 位以下的有 $p-sz+1$ 位  
即 $fibonacci$ 前缀和 $sum[p-sz+1]$  
对去重后的所有数累加即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e5 + 10;
const int mod = 1e9 + 7;
ll n, p;
set<ll> st;
vector<ll> a;

ll fibo[N];

int main () {
        ios::sync_with_stdio(false);
        fibo[1] = fibo[2] = 1;
        for ( int i = 3; i < N; i ++ ) fibo[i] = (fibo[i - 1] + fibo[i - 2]) % mod;
        for ( int i = 2; i < N; i ++ ) fibo[i] = (fibo[i] + fibo[i - 1]) % mod; // fibonacci 前缀和

        cin >> n >> p;
        for ( int i = 0; i < n; i ++ ) {
                ll x; cin >> x;
                st.insert(x);
                a.push_back(x);
        }
        // 去重
        sort ( a.begin(), a.end(), greater<ll>() );
        a.erase(unique(a.begin(), a.end()), a.end());
        for ( int i = 0; i < a.size(); i ++ ) {
                if ( *st.lower_bound(a[i]) != a[i] ) continue;

                ll cur = a[i];
                bool flag = false;
                while ( cur ) {
                        if ( cur & 1 ) cur = (cur - 1) / 2; // 反式 *2+1
                        else {
                                if ( cur % 4 ) break; // 化不下去了
                                else cur /= 4; // 反式 *4
                        }
                        if ( *st.lower_bound(cur) == cur ) { // [a]内存在
                                flag = true;
                                break;
                        }
                }
                if ( flag ) st.erase(a[i]);
        }
        // 逐个累加
        ll res = 0;
        for ( auto i : st ) {
                ll tmp = i;
                ll sz = 0; while ( tmp ) sz ++, tmp /= 2; 
                if ( p >= sz ) (res += fibo[p - sz + 1]) %= mod;
        }
        cout << res << endl;
}
```
<hr>

