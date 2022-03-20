---
title: 博弈论
---
###  
<hr>

## 贪心

### ARC137C_DistinctNumbers

#### 🔗
<a href="https://atcoder.jp/contests/arc137/tasks/arc137_c?lang=en">![20220320185041](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220320185041.png)</a>

#### 💡
乍一看确实很像尼姆博弈，但是每次只能选最大的数这个条件我们很难处理  
于是思考能不能使用这个限制去求解  
在双人下，先手可以看看是否可以用这个限制去卡掉次手  
  
那么如果 $a_n$ 变成比 $a_{n-1}$ 小的为必败态，那么 $Alice$ 必胜  
如果 $a_n$ 变成比 $a_{n-1}$ 小的为必胜态，那么考虑是否可以让自己必胜，那便是强制次手走到那一步，即让 $a_n= a_{n-1}+1$  
这个是需要 $a_n\ge a_{n-1}+2$ 的  
那么这个条件下先手必胜  
  
如果不满足这个条件，那么就是每次让 $a_n-1$ ，看一下 $a_n-(n-1)$ 是否为奇数即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
inline void read_Array ( int *a, int beg, int end ) { for ( int i = beg; i <= end; i ++ ) cin >> a[i]; }
inline void print_Array ( int *a, char c, int beg, int end ) { for ( int i = beg; i <= end; i ++ ) cout << a[i] << c; }
 
const int N = 3e5 + 10;
 
int main () {
        cin.tie(0)->sync_with_stdio(0);
        cin.exceptions(cin.failbit);
 
        int n; cin >> n;
        int a[n + 10]; read_Array(a, 1, n);
 
        sort ( a + 1, a + n + 1 );
        if ( a[n] - a[n - 1] >= 2 ) {
                cout << "Alice";
        } else if ( (a[n] - (n - 1)) & 1 ) {
                cout << "Alice";
        } else {
                cout << "Bob" << endl;
        }
}
```
<hr>


## 棋盘

### HDU2021多校(9)2_AnotherBoardGame

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=7067"><img src="https://i.loli.net/2021/10/19/JHXG4zTjqxS1lDs.png"></a>

#### 💡
首先看一眼数据量，1e18，....想想都知道不能模拟和递归  
  
首先考虑一个人游戏的进行方案（以第一个人为例  
1.到达这一行最大的值  
2.让第二个人可以到达的最小的值最大  
  
由于每一个人的目的都是上面的两种，所以游戏模式将会很固定，即第一个人只会走到最小值最大的那一列，第二个人只会走到最大值最小的那一列  
由于第二个人的走向会被上一步中第一个人控制，所以只用考虑最后是谁走的  
那么就判断一下k的奇偶即可  
  
**首先特判1**  
即第一个人走到第一行中最大的位置  
**然后是奇数**  
代表第一个人走最后一步，那么他的行为将会受到第二个人的限制，即只能走到最小的行最大值  
当然他也可以提前结束游戏，所以与第一个点比较一下  
**然后是偶数**  
代表第二个人走最后一步，那么他的行为将会受到第一个人的限制，即只能走到最大的最小值  
当然第一个人如果看出来了情况不妙也可以提前结束游戏，所以与第一个点比较一下  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const ll N = 1e5 + 10;
ll n, m, k;
vector<vector<ll> > g; // 存图，1e5*1e5硬开内存可能会炸
ll min_maxRow, max_minCol;

int main() {
        ios::sync_with_stdio(false);
        ll cass; cin >> cass; while ( cass -- ) {
                g.clear();
                cin >> n >> m >> k;
                for ( ll i = 0; i < n; i ++ ) {
                        vector<ll> cur;
                        for ( ll j = 0, x; j < m; j ++ ) 
                                cin >> x,
                                cur.push_back(x);
                        g.push_back(cur);
                }
                min_maxRow = 1e18, max_minCol = 0; // 最小的行最大值和最大的行最小值
                for ( ll i = 0; i < n; i ++ ) {
                        ll maxRow = 0;
                        for ( ll j = 0; j < m; j ++ ) maxRow = max ( maxRow, g[i][j] );
                        min_maxRow = min ( min_maxRow, maxRow );
                }
                for ( ll j = 0; j < m; j ++ ) {
                        ll minCol = 1e18;
                        for ( ll i = 0; i < n; i ++ ) minCol = min ( minCol, g[i][j] );
                        max_minCol = max ( max_minCol, minCol );
                }

                if ( k == 1 ) { // 走第一行
                        ll res = 0;
                        for ( ll j = 0; j < m; j ++ ) res = max ( res, g[0][j] );
                        cout << res << endl;
                } else if ( k & 1 ) {
                        cout << max(min_maxRow, g[0][0]) << endl;
                } else {
                        cout << max(max_minCol, g[0][0]) << endl;
                }
        }
}
```

<hr>
