---
title: 位运算
---

###
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
