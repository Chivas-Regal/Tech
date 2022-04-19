---
title: 概率DP
---

###
<hr>

## 牛客挑战赛59B_游戏

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/11199/B">![20220416171956](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220416171956.png)</a>

#### 💡
考虑第 $i$ 个人在什么条件下才可以取胜  
  
首先他如果出石头，后面的可以遇到出石头的也可以遇到出剪刀的  
<b>即所有的 $j>i$ ，$j$ 必须平局或者败给 $i$   
所有的 $j<i$ ，$j$ 必须败给 $i$ </b>   
那么对于前者我们做三个后缀积表示后缀出 $12/23/13$ 的可能性积  
然后三个前缀 $dp$ 表示 $[1,i]$ 出 $1/2/3$  赢到 $i$ 的概率和    
  
转移方式为：$[1,i-1]$ 赢过 $i$ ，他们可以让 $i$ 选一样的或者输给 $[1,i-1]$ 的 ，$i$ 赢过 $[1,i-1]$ 那么 $[1,i-1]$ 只能输给 $i$       
```cpp
dp1[i] = dp1[i - 1] * (a1[i] + a2[i]) + a1[i] * dp2[i - 1]
dp2[i] = dp2[i - 1] * (a2[i] + a3[i]) + a2[i] * dp3[i - 1]
dp3[i] = dp3[i - 1] * (a3[i] + a1[i]) + a3[i] * dp1[i - 1]
``` 

那么对于 $i$ 赢的情况就可以用上面说的情况做解了  
  
#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
int main () {
        int n; cin >> n;
        vector<string> s(n); for (string &i : s) cin >> i;
        vector<modint> a1(n + 2, 0), a2(n + 2, 0), a3(n + 2, 0);
        vector<modint> suf12(n + 2, 0), suf13(n + 2, 0), suf23(n + 2, 0);
        for (int i = 1; i <= n; i ++) {
                int num = 0; for (char j : s[i - 1]) num += j == '1';
                for (int j = 0; j < 3; j ++) {
                        if (j == 0)       a1[i] = (modint)(s[i - 1][j] == '1') / num;
                        else if (j == 1)  a2[i] = (modint)(s[i - 1][j] == '1') / num;
                        else              a3[i] = (modint)(s[i - 1][j] == '1') / num;
                }
        }
        suf12[n + 1] = suf23[n + 1] = suf13[n + 1] = 1;
        for (int i = n; i >= 1; i --) {
                suf12[i] = suf12[i + 1] * (a1[i] + a2[i]);
                suf13[i] = suf13[i + 1] * (a1[i] + a3[i]);
                suf23[i] = suf23[i + 1] * (a2[i] + a3[i]);
        }

        vector<modint> dp1(n + 2, 0), dp2(n + 2, 0), dp3(n + 2, 0);
        dp1[0] = dp2[0] = dp3[0] = 1;
        for (int i = 1; i <= n; i ++) {
                if (i == 1) {
                        dp1[i] = a1[i];
                        dp2[i] = a2[i];
                        dp3[i] = a3[i];
                        continue;
                }
                dp1[i] = dp1[i - 1] * (a1[i] + a2[i]) + a1[i] * dp2[i - 1];
                dp2[i] = dp2[i - 1] * (a2[i] + a3[i]) + a2[i] * dp3[i - 1];
                dp3[i] = dp3[i - 1] * (a3[i] + a1[i]) + a3[i] * dp1[i - 1];
        }
        for (int i = 1; i <= n; i ++) {
                modint res = 0;
                if (a1[i] > 0) res += dp2[i - 1] * a1[i] * suf12[i + 1];
                if (a2[i] > 0) res += dp3[i - 1] * a2[i] * suf23[i + 1];
                if (a3[i] > 0) res += dp1[i - 1] * a3[i] * suf13[i + 1];
                cout << res << " ";
        }
}
```
<hr>
