---
title: 启发式合并
---

###
<hr>

## CCPC2021湘潭省赛J_Stacks

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=6947">![20220912202407](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220912202407.png)</a>

#### 💡
首先注意到在一次次的搬运过程中，有的栈会被搬空。且如果是都往同一个栈里面搬的话，复杂度也就是 $O(n)$ 的。  
那么就可以联想到让少的往大的里面搬，也是一种启发式合并。  
**问题一：正反**  
但是如果本身是大的往少的搬，如果反过来的话位置、顺序都会错误，但是无非就是颠倒的问题，毕竟不管怎么搬，都是一个栈的栈顶对着另一个栈的栈顶  
所以只会出现反着的情况，我们可以利用尾指针的形式，在“存在数字的栈”后面存放一个标记，表示这个栈是正着的还是反着的  
由于一个栈在搬到另一个栈上面的时候它必然会反过来，所以如果被搬运的栈是反的，就可以直接从底往顶加入、否则从顶往底加    
且如果搬运到的栈也是反的，就应该被加到栈底，用优先队列实现即可  
（搬的时候就直接暴力就行）  
那么问题就是怎么决定这个栈是否被标记为反栈，如果它是被搬运的，但是变成了别的栈搬到它上面，这样就要将它尾部的标记 $~rev$ 重载一下，定为 $~rev$   
**问题二：位置**  
还有一个问题是，如果 $u$ 的栈搬到 $v$ ，但是变成了 $v$ 的栈搬到 $u$ ，这样 $v$ 的真实位置就变了，所以存一个 $pos[]$ 数组，表示这个栈的真实位置在哪，在搬后将 $pos[v]=pos[u]$ ，且 $pos[u]$ 要重置为 $u$ 本身  
  
这样一次操作就结束了  
每次搬少的分析一下最坏情况是所有栈的元素数量差 $1$ ，从最小的一步步往上，但是这样栈只会有 $\sqrt n$ 个，元素的和为 $n$ ，所以操作数也是 $O(n)$ 的  
故总复杂度为 $O(n)$ ，结束   

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
int pos[100005];
set<int> st; // 所有含栈元素的位置

int n, m;
deque<int> vec[100005];

inline void move (int u, int v) {
    // 存在为空
    if (st.lower_bound(u) == st.end() || *st.lower_bound(u) != u) return;
    if (st.lower_bound(v) == st.end() || *st.lower_bound(v) != v) {
        pos[v] = pos[u];
        vec[pos[v]].back() ^= 1;
        pos[u] = u;
        st.insert(v); st.erase(u);
        return;
    }
    
    int a, b, c; // a中元素向b搬运，c表示操作是否反了
    if (vec[pos[u]].size() > vec[pos[v]].size()) a = pos[v], b = pos[u], c = 1;
    else a = pos[u], b = pos[v], c = 0;

    // 取出反栈标记
    int ca = vec[a].back(); vec[a].pop_back();
    int cb = vec[b].back(); vec[b].pop_back();
    if (!ca) {
        for (int i = vec[a].size() - 1; i >= 0; i --) {
            if (!cb) vec[b].push_back(vec[a][i]);
            else vec[b].push_front(vec[a][i]);
        }
    } else {
        for (int i = 0; i < vec[a].size(); i ++) {
            if (!cb) vec[b].push_back(vec[a][i]);
            else vec[b].push_front(vec[a][i]);
        }
    }
    vec[a].clear();
    vec[b].push_back(c ^ cb);
    
    if (c) {
        pos[v] = pos[u];
        pos[u] = u;
    }
    st.insert(v); st.erase(u);
}
inline void Solve () {
    st.clear();
    for (int i = 1; i <= n; i ++) vec[i].clear();
    for (int i = 1; i <= n; i ++) vec[i].push_back(i), vec[i].push_back(0), st.insert(i), pos[i] = i;
    while (m --) {
        int u, v; scanf("%d%d", &u, &v);
        move(u, v);
    }

    for (int i = 1; i <= n; i ++) { 
        if (st.lower_bound(i) == st.end() || *st.lower_bound(i) != i) {
            puts("0");
        } else {
            printf("%d", (int)vec[pos[i]].size() - 1);
            if (!vec[pos[i]].back()) {
                for (int j = vec[pos[i]].size() - 2; j >= 0; j --) printf(" %d", vec[pos[i]][j]);
            } else {
                for (int j = 0; j < vec[pos[i]].size() - 1; j ++) printf(" %d", vec[pos[i]][j]);
            } puts("");
        }
    }
}
```
<hr>
