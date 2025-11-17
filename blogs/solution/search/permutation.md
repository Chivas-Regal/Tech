---
title: 全排列
---
###  


## 洛谷P1013_进制位

#### 🔗
<a href="https://www.luogu.com.cn/training/119543#problems"><img src="https://i.loli.net/2021/11/08/Xa4NSThgWH91pZq.png"></a>

#### 💡
这个表的意思是， $\sum\limits_{i=1}^{n-1}\sum\limits_{j=1}^{n-1}\{a[0][i]+a[j][0]=a[i][j]\}$    
由于除加号之外最多有  $n-1$ 个元素，所以其实就是  $n-1$ 进制
由于  $n$ 不是很大，所以可以直接枚举  $n-1$ 的全排列，这个全排列相当于是对每一个单字母的映射  
我们枚举到一个排列对中心的所有结果检查一下就行了，如果可以就输出这一个排列  
  
检查方式其实大可不必模拟进制，如果两个数在一个进制下不一样，那么在别的进制下也不一样，所以我们转成十进制直接看一下等不等就行了  

#### ✅

```cpp
#include <iostream>
#include <map>
#include <vector>
#include <queue>
#include <algorithm>

#define ll long long

using namespace std;

const int N = 15;
int n;
string s[N][N];
vector<char> chr; // 单字符
map<char, int> mp; // 映射
bool flag;

inline bool check ( int i, int j ) { // s[i][0] + s[0][j] = s[i][j] ? 
        int this_num = 0; for ( int k = 0; k < s[i][j].size(); k ++ ) this_num = this_num * (n - 1) + mp[s[i][j][k]];
        int i_num = mp[s[i][0][0]];
        int j_num = mp[s[0][j][0]];
        return this_num == i_num + j_num;
}

inline void Solve () {
        vector<int> vec; for ( int i = 0; i < n - 1; i ++ ) vec.push_back(i);
        do {
                for ( int i = 0; i < n - 1; i ++ ) mp[chr[i]] = vec[i];
                for ( int i = 1; i < n; i ++ ) {
                        for ( int j = 1; j < n; j ++ ) {
                                if ( !check(i, j) ) goto end;
                        }
                }
                flag = true; 
                for ( int i = 0; i < chr.size(); i ++ ) {
                        if ( i ) cout << " ";
                        cout << chr[i] << "=" << vec[i];
                } break; 
                end:;
        } while ( next_permutation ( vec.begin(), vec.end() ) );
}

int main () {
        cin >> n;
        for ( int i = 0; i < n; i ++ ) for ( int j = 0; j < n; j ++ ) cin >> s[i][j];
        for ( int i = 1; i < n; i ++ ) chr.push_back ( s[0][i][0] );
        Solve ();
        if ( flag  ) cout << endl << n - 1 << endl;
        else         cout << "ERROR!" << endl;
}
```


