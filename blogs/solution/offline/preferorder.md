---
title: 多维偏序
---
###  


## 二维

### AcWing2849_老C的任务

#### 🔗
<a href="https://www.acwing.com/problem/content/2849/"><img src="https://i.loli.net/2021/10/03/wqlsa1oPUgYFIJC.png"></a>

#### 💡
这道题和[Stars](https://github.com/Chivas-Regal/ACM/blob/main/Code/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/%E6%A0%91%E7%8A%B6%E6%95%B0%E7%BB%84/Stars.md)那道题很像  
其实都是在(<=x, <=y)上做文章  
但是这道题有一个特殊的地方就是要求区间  
那么可以想到前缀和->二维前缀和  
只需要将要查的矩形的四个点也传入要排序的数组中  
并标记为id=1(查询)，id=0(插入)  
那么就需要多出第三维（<=id）  
但是id我们每次求得只有前面id=0的点，所以一个变量就够了
  
**解法1:树状数组**  
如果当前遍历到的点是查询点的话就不update，而是query，查询后塞到查询的结构体中。否则update  
然后对一个查询结构体内的传进的四次query进行排序，最大的就是右下角的点，中等的是左下右上，最小的是左上  
然后用二维前缀和计算的方式进行计算即可  
**解法2:归并排序**  
就对查询点加一个val，在归并到时候对第二维进行排序  
然后双指针扫描固定，中途累加，如果是插入点就+1，否则+0，然后j的位置移动的时候加上这个sum即可  

#### ✅
**解法1:树状数组**  

```cpp
const ll N = 1e5 + 10, M = 1e6 + 10;
struct Qry { // 询问
        ll x1, y1, x2, y2;
        ll k;
        ll res[4];
}q[N];
struct Node { // 点
        ll x, y, v; // 坐标，点权
        ll id; // 编号
}nd[M];
ll tr[M]; // 树状数组
bool isqry[M]; // 记录这个点是不是询问点，如果是询问点就要拔出
ll whichqry[M]; // 属于哪一个询问
ll n, m;
ll k; // 点个数
vector<ll> nums; // 对y离散化

inline ll get_Id ( ll x ) { return lower_bound(nums.begin(), nums.end(), x) - nums.begin() + 1; }
inline ll lowbit ( ll x ) { return x & -x; }
inline void update ( ll id, ll val ) {
        while ( id < M ) tr[id] += val, id += lowbit(id);
}
inline ll query ( ll id ) {
        ll res = 0;
        while ( id ) res += tr[id], id -= lowbit(id);
        return res;
}

int main () {
        scanf("%lld%lld", &n, &m);
        for ( ll i = 0, x, y, z; i < n; i ++ ) {
                scanf("%lld%lld%lld", &x, &y, &z);
                nd[k] = {x, y, z, M - 1}; k ++;
                nums.push_back(y);
        }
        for ( ll i = 0, x1, y1, x2, y2; i < m; i ++ ) {
                scanf("%lld%lld%lld%lld", &x1, &y1, &x2, &y2);
                q[i] = {x1, y1, x2, y2};
                isqry[k] = true; whichqry[k] = i; nd[k] = {x1 - 1, y1 - 1, 1, k}; k ++;
                isqry[k] = true; whichqry[k] = i; nd[k] = {x2,     y2,     1, k}; k ++;
                isqry[k] = true; whichqry[k] = i; nd[k] = {x1 - 1, y2,     1, k}; k ++;
                isqry[k] = true; whichqry[k] = i; nd[k] = {x2,     y1 - 1, 1, k}; k ++;
                nums.push_back(y1 - 1); nums.push_back(y2 - 1); nums.push_back(y2); nums.push_back(y1);
        }
        sort ( nums.begin(), nums.end() );
        nums.erase(unique(nums.begin(), nums.end()), nums.end());
        
        sort ( nd, nd + k, [&](Node a, Node b){
                if ( a.x != b.x ) return a.x < b.x;
                if ( a.y != b.y ) return a.y < b.y;
                return a.id > b.id;
        });
        for ( ll i = 0; i < k; i ++ ) {
                if ( !isqry[nd[i].id] ) { // 不是查询
                        update (get_Id(nd[i].y), nd[i].v); // 更新
                } else {
                        ll thisqry = whichqry[nd[i].id]; // 这个点是哪个查询
                        q[thisqry].res[q[thisqry].k ++] = query(get_Id(nd[i].y)); // 对这个询问的一个res加入一个前缀和
                }
        }
        for ( ll i = 0; i < m; i ++ ) {
                sort ( q[i].res, q[i].res + 4, greater<ll>() ); 
                printf("%lld\n", q[i].res[0] - q[i].res[1] - q[i].res[2] + q[i].res[3]); // 二维区间和
        }
}
```
**解法2:归并排序**
```cpp
const int N = 1e5 + 10, M = 5e5 + 10;
int n, m;
struct Data { 
        int a, b, c;
        int isQry, whichQry, sgn;
        ll sum;
}q[M], w[M];
ll res[N];

inline void merge_Sort ( int l, int r ) {
        if ( l >= r ) return;
        int mid = (l + r) >> 1;
        merge_Sort (l, mid); merge_Sort (mid + 1, r);
        int i = l, j = mid + 1, k = 0;
        ll sum = 0;
        while ( i <= mid && j <= r )
                if ( q[i].b <= q[j].b ) sum += !q[i].isQry * q[i].c, w[k ++] = q[i ++];
                else                    q[j].sum += sum,             w[k ++] = q[j ++];
        while ( i <= mid ) sum += !q[i].isQry * q[i].c, w[k ++] = q[i ++];
        while ( j <= r )   q[j].sum += sum,             w[k ++] = q[j ++];
        for ( i = l, j = 0; j < k; i ++, j ++ ) q[i] = w[j];
}

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> m;
        for ( int i = 0; i < n; i ++ )
                cin >> q[i].a >> q[i].b >> q[i].c;
        int k = n;
        for ( int i = 0; i < m; i ++ ) {
                int x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
                q[k ++] = {x1 - 1, y1 - 1, 0, 1, i, 1};
                q[k ++] = {x1 - 1, y2,     0, 1, i, -1};
                q[k ++] = {x2,     y1 - 1, 0, 1, i, -1};
                q[k ++] = {x2,     y2,     0, 1, i, 1};
        }
        sort ( q, q + k, [&](Data a, Data b) {
                if ( a.a != b.a ) return a.a < b.a;
                if ( a.b != b.b ) return a.b < b.b;
                return a.isQry < b.isQry;
        });
        merge_Sort ( 0, k - 1 );
        for ( int i = 0; i < k; i ++ )
                if ( q[i].isQry )
                        res[q[i].whichQry] += q[i].sum * q[i].sgn;
        for ( int i = 0; i < m; i ++ ) cout << res[i] << endl;
        return 0;
}
```



## 三维

### 洛谷P4390_Mokia

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4390"><img src="https://s2.loli.net/2022/01/08/2rqsQxUKJlPb3oM.png"></a>

#### 💡
带了修改时间的[《老C的任务》](https://github.com/Chivas-Regal/ACM/blob/main/Code/%E7%A6%BB%E7%BA%BF%E7%AE%97%E6%B3%95/%E5%A4%9A%E7%BB%B4%E5%81%8F%E5%BA%8F/%E4%BA%8C%E7%BB%B4%E5%81%8F%E5%BA%8F/AcWing2849_%E8%80%81C%E7%9A%84%E4%BB%BB%E5%8A%A1.md)  
那么就俨然成为了一道三维偏序问题（第三维：修改时间  
  
做法一样，我们设置一个时间递进器  
对于加人，我们就在这个该时刻的这个  $(x,y)$ 添加一个信息  
对于查询，由于是二维，我们依旧用二维前缀和的方式，将二维区间和的四个信息分别设置  $\pm1$ 然后我们在记录  $res[q[i].which\_qry]$ 时就可以累加  $q[i].sgn\times q[i].res$ ，由于查询要查四个数据，我们可以放在连续时刻的四个信息里面  
而我们这三维关系就是对于  $i$ 和  $j$ ， $q[i].x\le q[j].x\wedge q[i].y\le q[j].y\wedge q[i].t<q[j].t$   
第二维  $y$ 用归并  
第三维  $t$ 在归并中用树状数组即可  


#### ✅

```cpp
const int N = 2e6 + 10;

namespace TreeArray {
        int tr[N];
        inline int lowbit ( int x ) { return x & -x; }
        inline void update ( int x, int v ) {
                while ( x < N ) tr[x] += v, x += lowbit(x);
        }
        inline int query ( int x ) {
                int res = 0;
                while ( x > 0 ) res += tr[x], x -= lowbit(x);
                return res;
        }
} using namespace TreeArray;

struct node {
        int x, y, v, t;
        int is_qry, which_qry, sgn;
        ll res;
        inline friend bool operator < ( node a, node b ) {
                if ( a.x != b.x ) return a.x < b.x;
                if ( a.y != b.y ) return a.y < b.y;
                return a.t < b.t;
        }
} q[N], w[N];
int tim = 1, qryid;
ll res[N];

inline void merge_Sort (int l, int r) {
        if ( l >= r ) return;
        int mid = (l + r) >> 1;
        merge_Sort(l, mid); merge_Sort(mid + 1, r);

        int i, j, k;

        i = l, j = mid + 1, k = 0;
        while ( i <= mid && j <= r ) {
                if ( q[i].y <= q[j].y ) update(q[i].t, q[i].v), w[k ++] = q[i ++];
                else q[j].res += query(q[j].t), w[k ++] = q[j ++];
        }
        while ( i <= mid ) update(q[i].t, q[i].v), w[k ++] = q[i ++];
        while ( j <= r ) q[j].res += query(q[j].t), w[k ++] = q[j ++];
        for ( i = l; i <= mid; i ++ ) update(q[i].t, -q[i].v);
        for ( i = l, j = 0; j < k; i ++, j ++ ) q[i] = w[j];
}

inline void Solve () {
        int op; while ( cin >> op, op != 3 ) {
                if ( op == 1 ) {
                        int x, y, a; cin >> x >> y >> a; x ++, y ++;
                        q[tim] = {x, y, a, tim, 0}; tim ++;
                } else if ( op == 2 ) {
                        int x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2; x1 ++, y1 ++, x2 ++, y2 ++;
                        q[tim] = {x2,     y2,     0, tim, 1, qryid, 1,  0}; tim ++;
                        q[tim] = {x1 - 1, y2,     0, tim, 1, qryid, -1, 0}; tim ++;
                        q[tim] = {x2,     y1 - 1, 0, tim, 1, qryid, -1, 0}; tim ++;
                        q[tim] = {x1 - 1, y1 - 1, 0, tim, 1, qryid, 1,  0}; tim ++;
                        qryid ++;
                }
        } 
        sort ( q + 1, q + tim ); 
        merge_Sort (1, tim - 1);
        for ( int i = 1; i < tim; i ++ ) {
                if ( q[i].is_qry ) {
                        res[q[i].which_qry] += q[i].res * q[i].sgn;
                }
        }
        for ( int i = 0; i < qryid; i ++ ) {
                cout << res[i] << endl;
        }
}
```



### AcWing2817_三维偏序

#### 🔗
<a href="https://www.acwing.com/problem/content/2817/"><img src="https://i.loli.net/2021/10/05/AXjtPNe9C2L7siQ.png"></a>

#### 💡
本题中要处理一下相同的data，即三维均相等的元素    
则每一个data的权值都是这个数出现的个数  
  
首先对.a排序，然后我们用归并一步步合并两个区间  
在合并区间的时候，两个指针中左区间的指针每走一次都代表出现一个比当前右指针位置严格小的，就向后移动1同时在树状数组内更新这个点的权值  
右指针走之前累加一下它之前的树状数组前缀  
  
最后在计算答案时，就是将相同的数的个数加到最后一个具有代表性的点`q[i].res + q[i].cnt - 1`，因为他们的权值也会是相同的，所以要加上`q[i].cnt`    

#### ✅

```cpp
const int N = 1e5 + 10, M = 2e5 + 10;
struct Data {
        int a, b, c;
        int cnt, res;
        inline friend bool operator < (Data a, Data b) {
                if ( a.a != b.a ) return a.a < b.a;
                if ( a.b != b.b ) return a.b < b.b;
                return a.c < b.c;
        }
        inline friend bool operator == ( Data a, Data b) {
                return a.a == b.a && a.b == b.b && a.c == b.c;
        }
}q[N], w[N];
int res[N], n, m;

namespace TreeArray {
        int tr[M];
        inline int lowbit ( int x ) { return x & -x; }
        inline void update ( int x, int val ) { while ( x < M ) tr[x] += val, x += lowbit(x); }
        inline int query ( int x ) { int res = 0; while ( x > 0 ) res += tr[x], x -= lowbit(x); return res; }
} using namespace TreeArray;

inline void merge_Sort ( int l, int r ) {
        if ( l >= r ) return;
        int mid = (l + r) >> 1;
        merge_Sort ( l, mid ); merge_Sort ( mid + 1, r );

        int i = l, j = mid + 1, k = 0;
        while ( i <= mid && j <= r )
                if ( q[i].b <= q[j].b ) update ( q[i].c, q[i].cnt ), w[k ++] = q[i ++];
                else                    q[j].res += query ( q[j].c ), w[k ++] = q[j ++];
        while ( i <= mid ) update ( q[i].c, q[i].cnt ), w[k ++] = q[i ++];
        while ( j <= r )   q[j].res += query ( q[j].c ), w[k ++] = q[j ++];
        for ( int i = l; i <= mid; i ++ ) update ( q[i].c, -q[i].cnt );
        for ( int i = l, j = 0; j < k; j ++, i ++ ) q[i] = w[j];
}

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> m;
        for ( int i = 0; i < n; i ++ )
                cin >> q[i].a >> q[i].b >> q[i].c,
                q[i].cnt = 1;
        sort ( q, q + n );
        int k = 1;
        for ( int i = 1; i < n; i ++ ) 
                if ( q[i] == q[k - 1] ) q[k - 1].cnt ++;
                else                    q[k ++] = q[i];
        merge_Sort ( 0, k - 1 );
        for ( int i = 0; i < k; i ++ )
                res[q[i].res + q[i].cnt - 1] += q[i].cnt;
        for ( int i = 0; i < n; i ++ )
                cout << res[i] << endl;
}
```



### AcWing2821_动态逆序对

#### 🔗
<a href="https://www.acwing.com/problem/content/2821/"><img src="https://i.loli.net/2021/10/05/SFb4XtJDf6WPsmT.png"></a>

#### 💡
下标一维，权值一维  
可以利用删除的顺序构建出一个时间轴，那么时间戳就是第三维  
我们可以先求出对于T[j]代表的数构成的逆序对数量  
在获取答案的时候时间戳从小到大进行累加得到每一个删前的答案  
  
下标本就排好了，所以不需要对这个维进行排序  
时间戳我们可以反着建，不删的数最小，这样的话所有没有被删掉的数的时间戳都比当前数要小，就可以直接求树状数组前缀  
  
对于逆序对，在区间被分成两半时  
1.i在前，j在后，a[i]>=a[j]，那么我们每次找的是比a[j]大的，可以两个指针从后往前遍历  
2.i在后，j在前，a[i]<=a[j]，那么我们每次找的是比a[j]小的，可以两个指针从前往后遍历  
然后再合并一下区间即可  

#### ✅


```cpp
const int N = 1e5 + 10;
int n, m;
struct Data {
        int a, t, res; // 权值、修改时间戳
}q[N], w[N];
ll res[N]; // 时间戳对应的逆序对数
int pos[N]; // 这个数出现的位置

namespace TreeArray {
        int tr[N];
        inline int lowbit ( int x ) { return x & -x; }
        inline void update ( int x, int val ) { while ( x < N ) tr[x] += val, x += lowbit(x); }
        inline int query ( int x ) { int res = 0; while ( x > 0 ) res += tr[x], x -= lowbit(x); return res; }
} using namespace TreeArray;

inline void merge_Sort ( int l, int r ) {
        if ( l >= r ) return;
        int mid = ( l + r ) >> 1;
        merge_Sort ( l, mid ); merge_Sort ( mid + 1, r );
        
        int i, j, k;
        i = mid, j = r; // i前j后，a[i]>=a[j] 
        while ( i >= l && j >= mid + 1 )
                if ( q[i].a >= q[j].a ) update (q[i].t, 1), i --;
                else                    q[j].res += query ( q[j].t ), j --;
        while ( i >= l )       update ( q[i].t, 1 ), i --;
        while ( j >= mid + 1 ) q[j].res += query ( q[j].t ), j --;
        for ( int k = l; k <= mid; k ++ ) update ( q[k].t, -1 ); 

        i = mid + 1, j = l; // i后j前，a[i]<=a[j]
        while ( i <= r && j <= mid )
                if ( q[i].a <= q[j].a ) update ( q[i].t, 1 ), i ++;
                else                    q[j].res += query ( q[j].t ), j ++;
        while ( i <= r )   update ( q[i].t, 1 ), i ++;
        while ( j <= mid ) q[j].res += query ( q[j].t ), j ++;
        for ( int k = mid + 1; k <= r; k ++ ) update ( q[k].t, -1 );

        i = l, j = mid + 1, k = 0;
        while ( i <= mid && j <= r )
                if ( q[i].a <= q[j].a ) w[k ++] = q[i ++];
                else                    w[k ++] = q[j ++];
        while ( i <= mid ) w[k ++] = q[i ++];
        while ( j <= r )   w[k ++] = q[j ++];

        for ( i = 0, j = l; i < k; i ++, j ++ )  q[j] = w[i];
}

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> m;
        for ( int i = 0; i < n; i ++ )
                cin >> q[i].a,
                pos[q[i].a] = i;

        int k = n;
        for ( int i = 0, x; i < m; i ++ ) 
                cin >> x,
                q[pos[x]].t = k --,
                pos[x] = -1;
        for ( int i = 0; i < n; i ++ )
                if ( pos[q[i].a] != -1 ) q[i].t = k --;
        
        merge_Sort ( 0, n - 1 );
        for ( int i = 0; i < n; i ++ ) res[q[i].t] = q[i].res;
        for ( int i = 2; i <= n; i ++ ) res[i] += res[i - 1]; // 时间戳的值进行累加
        for ( int i = 0, j = n; i < m; i ++, j -- ) cout << res[j] << endl;
}

```


