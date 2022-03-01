---
title: 鸽巢原理
---

###
<hr>

#

#### 🔗
<a href="http://oj.daimayuan.top/problem/456">![20220301130404](https://raw.githubusercontent.com/Chivas-Regal/BedsOfPic/master/20220301130404.png?token=AS2QXVBU6LXJUJIKUSPYNTLCDWUYE)</a>

#### 💡
$n$ 个数，范围很明显了，这里最多有 $n$ 个不同的模数  
考虑前缀和，一共有 $n$ 个前缀和，如果出现 $0$ 那么就直接输出这个前缀即可  
有可能没有 $0$ ，那么 $n$ 个前缀和要用 $n-1$ 个数就必然存在两个前缀和相同  
相同的两个前缀和减出来的区间和为 $0$ ，也能满足  
  
所以每次算前缀和，如果为 $0$ 直接输出，否则查看是否之前存在过这个前缀和，如果存在过，就从上一个该前缀和下标 $+1$ 一直到当前位置  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e5 + 10;
int n, a[N];
int id[N], sum;

int main () {
	ios::sync_with_stdio(false);
    
	cin >> n;
	for ( int i = 1; i <= n; i ++ ) {
		cin >> a[i];
		sum = (sum + a[i]) % n;
		if ( sum == 0 ) {
			cout << i << endl;
			for ( int j = 1; j <= i; j ++ ) cout << j << " ";
			cout << endl;
			return 0;
		}
		if ( id[sum] ) {
			cout << i - id[sum] << endl;
			for ( int j = id[sum] + 1; j <= i; j ++ ) cout << j << " ";
			return 0;
		}
		id[sum] = i;
	}
}
```
<hr>
