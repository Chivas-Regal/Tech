---
title: ac自动机
---

### 
<hr>

## 洛谷P4052_文本生成器

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4052">![20221010215054](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221010215054.png)</a>

#### 💡
正难则反，这个是让我们求含有可读文本的串数，我们可以尝试求一下不含有可读文本的串数  
可读文本会在自动机插入时的所有尾节点被标记，同时含有可读文本的也可能是以被标记节点为后缀的串  
故首先对自动机 $trie$ 部分插入时的尾部标记为 $1$ ，一个串如果后缀是可读文本那么自己也不行，故要 $or$ 上自己的 $fail$ 指向的标记  
既然是计数，就在这个自动机上 $dp$   
设置 $dp[i][j]$ 表示文本长度为 $i$ ，到节点 $j$ 的目标数量  
在自动机上往下走并转移，即枚举长度，枚举节点 $u$ ，枚举 $26$ 个子节点 $v$ ，如果 $v,u$ 被标记那么都不转移，否则令 $dp[i][v]+=dp[i-1][u]$   
最后统计 $dp[m][i]$ 中 $i$ 没有被标记的数量和  
用 $26^m$ 减去它即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 6010;
const int mod = 1e4 + 7;

struct AcAutoMaton {
    int ct, root;
    int fa[N], to[N][26];
    bool mark[N];
    inline AcAutoMaton () {
        ct = root = 1;
    }
    inline void insert (string s) {
        int p = root;
        for (char c : s) {
            if (!to[p][c - 'A']) to[p][c - 'A'] = ++ct;
            p = to[p][c - 'A'];
        }
        mark[p] = true;
    }
    inline void build (vector<string> v) {
        for (string it : v) insert(it);
        for (int i = 0; i < 26; i ++) to[0][i] = root;
        queue<int> que; que.push(root);
        while (!que.empty()) {
            int u = que.front(); que.pop();
            for (int i = 0; i < 26; i ++) {
                if (to[u][i]) {
                    fa[to[u][i]] = to[fa[u]][i];
                    mark[to[u][i]] |= mark[fa[to[u][i]]];
                    que.push(to[u][i]);
                } else {
                    to[u][i] = to[fa[u]][i];
                }
            }
        }
    }
} acam;

int dp[110][N];

int main () {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m; cin >> n >> m;
    vector<string> v(n); for (string &it : v) cin >> it;

    acam.build(v);

    dp[0][1] = 1;
    for (int i = 1; i <= m; i ++) {
        for (int j = 1; j <= acam.ct; j ++) {
            for (int c = 0; c < 26; c ++) {
                if (!acam.mark[j] && !acam.mark[acam.to[j][c]]) {
                    (dp[i][acam.to[j][c]] += dp[i - 1][j]) %= mod;
                }
            }
        }
    }

    int res = 1;
    for (int i = 0; i < m; i ++) res = res * 26 % mod;
    for (int i = 1; i <= acam.ct; i ++) {
        (res -= dp[m][i]) %= mod;
    }
    cout << (res % mod + mod) % mod << endl;
}
```
<hr>
