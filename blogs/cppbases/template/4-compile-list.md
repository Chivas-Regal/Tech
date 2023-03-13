---
title: 编译期链表
---

::: tip 工具类
这里先存放几个后面好用的工具类  

```cpp
template<int a, int b>
struct Min { // std::min(a, b)
    static const int value = a < b ? a : b;
};
template<int a, int b>
struct Max { // std::max(a, b)
    static const int ret = a > b ? a : b;
};
// flag ? True : False;
template<bool flag, typename True, typename False> struct IF {};
template<typename True, typename False>
struct IF<true, True, False> {
    using ret = True;
};
template<typename True, typename False>
struct IF<false, True, False> {
    using ret = False;
};
```
:::

通过 [模板参数展开](./2-template-unfold.html) 的内容，我们其实很容易感觉到它像一种我们所熟知的数据结构 —— 链表。  
每个链表节点都有一个当前值，一个后继节点。  
在一个期望展开的参数包 `(head, args...)` 中，我们的 `head` 参数就是当前值，`args...` 就是一个被集合起来的后继节点，通过这样的不断单向遍历即可推出所有的节点值。  
再结合 [编译期计算](./3-compile-cal.html) 的内容知道，可以使用元素的结构体也可以进行递归，带上参数包的话，我们即可动手编写一种很新的数据结构 —— **编译期链表**

## 定义链表节点

参数首先设置一个纯参数包的主模板，在后面可以对其进行分裂为 `head, data...` 也可以直接用 `data...`  
并且纯特化出一个空包，即为链表空节点

```cpp
template<int ...data> struct List {};
using Null = List<>;
```

我们从主模板中偏特化出两种正常的链表节点
- 一种是将多个参数分裂为 `head, data...` 的非尾节点
- 另一种是只有一个元素的末尾节点的参数为 `head` 自己
  
  
  
```cpp
template<int head, int ...data>
struct List<head, data...> {
    const static int value = head;
    using next = List<data...>;
    const static int size = 1 + sizeof...(data);
};
template<int head>
struct List<head> {
    const static int value = head;
    const static int size = 1;
    using next = Null;
};
```

测试一下 


```cpp
int main () {
    using list = List<1, 2, 3, 4, 5>;
    std::cout << list::value << std::endl;              // 1
    std::cout << list::next::value << std::endl;        // 2
    std::cout << list::next::next::value << std::endl;  // 3
}
```


## 编译期功能

### 查询下标为 i 的元素

写出这样一个参数为（位置、被查询链表）主模板    

```cpp
template<int pos, class ListObj> struct Pos {};
```

为了构造参数 `List<data...>` ，我们要额外定义一个传入 `pos` 和 `...data` 的模板用其偏特化出 `Pos<pos, List<data...>`       
递归展开内部的话自己的 `ret` 要用子部分 `Pos` 的 `ret` ，子部分参数 （`pos - 1`， `typename List<data...>::next`）  
所以

```cpp
template<int pos, int ...data>
struct Pos<pos, List<data...>> {
    const static int ret = Pos<pos - 1, typename List<data...>::next>::ret;
};
// 注意这里要加 `typename` 因为这个 `List` 还没实例化，编译期不知道这是什么东西
```

递归终点链表不一定为空，所以我们也是对上面的偏特化 `pos = 0`  
让该终点 `ret` 为这个链表的头  

```cpp
template<int ...data>
struct Pos<0, List<data...>> {
    const static int ret = List<data...>::value;
};
```

测试一下

![3bdf2726baff4595c567d4e84fd74e67](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/3bdf2726baff4595c567d4e84fd74e67.png)

### 两链表前后相连

和上面类似，两个链表对象的主模板  
至于合并的时候很简单，就是两个参数包 `L..., R...` 直接拼出 `List<L..., R...>`   

```cpp
template<class ListObj1, class ListObj2> struct Merge {};
template<int ...L, int ...R>
struct Merge<List<L...>, List<R...>> {
    using ret = List<L..., R...>;
};
```

测试：  
![20230313125750](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313125750.png)

### 链表拆分：前 i 个和前 i 个以外

编译期没有返回值，要想一个对象变两个对象，两个参数对象，其中有一个传空链表，被拆分的链表向其填入 `num` 个元素  
每一步的下一步都像合并的时候，`List<L..., List<R...>::value>` ，然后右链表后推 `List<R...>::next`  
指两个参数 `_L, _R` 分别代表下一步的 `_L, _R` ，最后一步 `num = 0` 就返回参数就行了

```cpp
template<int num, class ListObj1, class ListObj2> struct Split {}; // 主模板
template<int num, int ...L, int ...R>
struct Split<num, List<L...>, List<R...>> {
    using next = Split<num - 1, List<L..., List<R...>::value>, typename List<R...>::next>; // 下一步
    using _L = next::_L;
    using _R = next::_R;
};
template<int ...L, int ...R> // 偏特化的最终态
struct Split<0, List<L...>, List<R...>> {
    using _L = List<L...>;
    using _R = List<R...>;
};
```

测试：  
![20230313131236](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313131236.png)  
![20230313131301](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313131301.png)

### 链表插入1：头插法

和拼接一样，传入 `val, ...data` 偏特化出 `val, List<data...>` 后，构造出来的为 `List<val, data...>`

```cpp
template<int val, class ListObj> struct PushFront {};
template<int val, int ...data>
struct PushFront<val, List<data...>> {
    using ret = List<val, data...>;
};
```

测试：  
![20230313151458](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313151458.png)

### 链表插入2：尾插法

和上面一样，不再赘述  

### 链表插入3：在下标为 i 的位置插入 j

我们先把链表拆成前 $i$ 个元素链表和非前 $i$ 个元素链表，对后面链表头插 $j$ ，再将两链表拼一起  
（就像 [fhq-treap的插入](https://tech.chivas-regal.top/blogs/algorithm/data-structure/fhqtreap.html#%E6%8F%92%E5%85%A5) ，爷青回力） 

```cpp
template<int pos, int val, class ListObj> struct Insert {};
template<int pos, int val, int ...data> 
struct Insert<pos, val, List<data...>> {
    using ret = Merge<
        typename Split<pos, List<>, List<data...>>::_L,
        typename PushFront<val, typename Split<pos, List<>, List<data...>>::_R>::ret
    >::ret;
};
```

![20230313164932](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313164932.png)

### 链表删除1：删去下标为 i 的元素

和上面思想类似，删去下标为 $i$ 的，相当于 $i$ 以前的内容形成的链表 和 $i+1$ 以后的内容形成的链表拼在一起  
（还不懂参考 [fhq-treap的删除](https://tech.chivas-regal.top/blogs/algorithm/data-structure/fhqtreap.html#%E5%88%A0%E9%99%A4)）  

```cpp
template<int pos, class ListObj> struct DelPosOne {};
template<int pos, int ...data>
struct DelPosOne<pos, List<data...>> {
    using ret = Merge<
        typename Split<pos, List<>, List<data...>>::_L,
        typename Split<pos + 1, List<>, List<data...>>::_R
    >::ret;
};
```

![20230313153613](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313153613.png)

### 链表删除2：删去下标在 [i,j] 的元素

和上面基本一致，只不过换成拼接 $i$ 以前的和 $j+1$ 以后的  

```cpp
template<int posl, int posr, class ListObj> struct DelPosRange {};
template<int posl, int posr, int ...data>
struct DelPosRange<posl, posr, List<data...>> {
    using ret = Merge<
        typename Split<posl, List<>, List<data...>>::_L,
        typename Split<posr + 1, List<>, List<data...>>::_R
    >::ret;
};
```

![20230313154028](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313154028.png)

### 子链表提取：提取下标在 [i,j] 的元素

由上面我们可以引入这个功能，先将原链表非前 $i$ 个元素的内容提出来 `Split<i, List<>, List<data...>>::_R`  
然后对这个链表提出来前 $j-i+1$ 个元素

```cpp
template<int posl, int posr, class ListObj> struct SubList {};
template<int posl, int posr, int ...data>
struct SubList<posl, posr, List<data...>> {
    using ret = Split<
        posr - posl + 1,
        List<>,
        typename Split<posl, List<>, List<data...>>::_R
    >::_L;
};
```

![20230313154908](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313154908.png)

### 链表删除3：删去一个值为 i 的元素

这个就上了点难度了，之前基本上都是父阶段 `ret` 直接等于子阶段 `ret` ，然后让子阶段的参数一直在变最后偏特化出来 `ret` 为其中一个参数  
换句话说就是我们获取到的 `ret` 其实最终状态偏特化下的一个没有被特化的参数  
这就像我们递归中  

```cpp
int ret = 0;
void gcd (int a, int b) {
    ret = a;
    if (!b) {
        return;
    } else {
        gcd(b, a % b);
    }
}
```

在这里这种思想似乎需要加一个无关参数保存着我们丢弃的链表，或者再叠一层复杂度一个个 `Pos` 获取，这都是我们不想看到的  
现在看递归的理解力，**我们保证自己做的是对的，然后相信子阶段是对的并且用好子阶段的返回**  
在不是出口也就是 `List<data...>::value != i` 时， 我们如果子阶段的 `ret` 是一个正确的返回，那我们 `List<data...>::value` 和 `ret` 拼在一起也是正确的  
决定我们对不对的地方就是出口处也就是 `List<data...>::value == i` 时应该删掉 `List<data...>::value` 并且不再用后面的 `ret` 了，这样就满足了只删除一个  

```cpp
template<int val, class ListObj> struct DelNumOne {};
template<int val, int ...data>
struct DelNumOne<val, List<data...>> {
    using next = DelNumOne<val, typename List<data...>::next>; // 下一步
    using ret = IF<
        val == List<data...>::value, 
        // true，出口，删掉一个 value 即返回后继节点
        typename List<data...>::next, 
        // false的话，用当前节点接上下一步的返回链表
        typename PushFront<List<data...>::value, typename next::ret>::ret 
    >::ret;
};
// 因为一直用 next ，特化出来一个空链表
template<int val>
struct DelNumOne<val, Null> {
    using ret = Null;
};
```

![20230313163726](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313163726.png)

### 链表删除4：删去所有值为 i 的元素

这个和上面的区别就仅在：当 `val == List<data...>::value` 时，不是出口，但我们依然不能要 `List<data...>::value` ，所以就只是返回 `next::ret` 就行了  

```cpp
template<int val, class ListObj> struct DelNumAll {};
template<int val, int ...data>
struct DelNumAll<val, List<data...>> {
    using next = DelNumAll<val, typename List<data...>::next>;
    using ret = IF<
        val == List<data...>::value,
        typename next::ret,
        typename PushFront<List<data...>::value, typename next::ret>::ret
    >::ret;
};
template<int val>
struct DelNumAll<val, Null> {
    using ret = Null;
};
```

![20230313163846](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313163846.png)

### 链表修改：将下标为 i 的元素替换为 j 

上面的思想这里也可以用  
当出口的时候我们头插 $j$ 入后继节点  
否则我们头插 `List<data...>::value` 入下一步的返回  

```cpp
template<int pos, int val, class ListObj> struct Modify {};
template<int pos, int val, int ...data>
struct Modify<pos, val, List<data...>> {
    using next = Modify<pos - 1, val, typename List<data...>::next>;
    using ret = IF<
        pos == 0,
        typename PushFront<val, typename List<data...>::next>::ret,
        typename PushFront<List<data...>::value, typename next::ret>::ret
    >::ret;
};
template<int pos, int val>
struct Modify<pos, val, Null> {
    using ret = Null;
};
```

![20230313163637](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313163637.png)

（没了吧...有了再更

## 完整代码

```cpp
template<int a, int b>
struct Min {
    static const int value = a < b ? a : b;
};
template<int a, int b>
struct Max {
    static const int value = a > b ? a : b;
};
template<bool flag, typename True, typename False> struct IF {};
template<typename True, typename False>
struct IF<true, True, False> {
    using ret = True;
};
template<typename True, typename False>
struct IF<false, True, False> {
    using ret = False;
};
// 链表节点
template<int ...> struct List {};
template<int head, int ...data>
struct List<head, data...> {
    const static int value = head;
    using next = List<data...>;
    const static int size = 1 + sizeof...(data);
};
using Null = List<>;
template<int head>
struct List<head> {
    const static int value = head;
    using next = Null;
    const static int size = 1;
};
// 查询下标为 pos 的元素
template<int pos, class ListObj> struct Pos {};
template<int pos, int ...data>
struct Pos<pos, List<data...>> {
    const static int ret = Pos<pos - 1, typename List<data...>::next>::ret;
};
template<int ...data>
struct Pos<0, List<data...>> {
    const static int ret = List<data...>::value;
};
// 两链表前后相连
template<class ListObj1, class ListObj2> struct Merge {};
template<int ...L, int ...R>
struct Merge<List<L...>, List<R...>> {
    using ret = List<L..., R...>;
};
// 链表拆分：前 num 个和前 num 个以外
template<int num, class ListObj1, class ListObj2> struct Split {};
template<int num, int ...L, int ...R>
struct Split<num, List<L...>, List<R...>> {
    using next = Split<num - 1, List<L..., List<R...>::value>, typename List<R...>::next>;
    using _L = next::_L;
    using _R = next::_R;
};
template<int ...L, int ...R>
struct Split<0, List<L...>, List<R...>> {
    using _L = List<L...>;
    using _R = List<R...>;
};
// 子链表提取：提取下标在 [posl, posr] 的元素
template<int posl, int posr, class ListObj> struct SubList {};
template<int posl, int posr, int ...data>
struct SubList<posl, posr, List<data...>> {
    using ret = Split<
        posr - posl + 1,
        List<>,
        typename Split<posl, List<>, List<data...>>::_R
    >::_L;
};
// 链表插入1：头插法
template<int val, class ListObj> struct PushFront {};
template<int val, int ...data>
struct PushFront<val, List<data...>> {
    using ret = List<val, data...>;
};
// 链表插入2：尾插法
template<int val, class ListObj> struct PushBack {};
template<int val, int ...data>
struct PushBack<val, List<data...>> {
    using ret = List<data..., val>;
};
// 链表插入3：在下标为 pos 的位置插入 val
template<int pos, int val, class ListObj> struct Insert {};
template<int pos, int val, int ...data> 
struct Insert<pos, val, List<data...>> {
    using ret = Merge<
        typename Split<pos, List<>, List<data...>>::_L,
        typename PushFront<val, typename Split<pos, List<>, List<data...>>::_R>::ret
    >::ret;
};
// 链表删除1：删去下标为 pos 的元素
template<int pos, class ListObj> struct DelPosOne {};
template<int pos, int ...data>
struct DelPosOne<pos, List<data...>> {
    using ret = Merge<
        typename Split<pos, List<>, List<data...>>::_L,
        typename Split<pos + 1, List<>, List<data...>>::_R
    >::ret;
};
// 链表删除2：删去下标在 [posl, posr] 的元素
template<int posl, int posr, class ListObj> struct DelPosRange {};
template<int posl, int posr, int ...data>
struct DelPosRange<posl, posr, List<data...>> {
    using ret = Merge<
        typename Split<posl, List<>, List<data...>>::_L,
        typename Split<posr + 1, List<>, List<data...>>::_R
    >::ret;
};
// 链表删除3：删去一个值为 val 的元素
template<int val, class ListObj> struct DelNumOne {};
template<int val, int ...data>
struct DelNumOne<val, List<data...>> {
    using next = DelNumOne<val, typename List<data...>::next>;
    using ret = IF<
        val == List<data...>::value,
        typename List<data...>::next,
        typename PushFront<List<data...>::value, typename next::ret>::ret
    >::ret;
};
template<int val>
struct DelNumOne<val, Null> {
    using ret = Null;
};
// 链表删除4：删去所有值为 i 的元素
template<int val, class ListObj> struct DelNumAll {};
template<int val, int ...data>
struct DelNumAll<val, List<data...>> {
    using next = DelNumAll<val, typename List<data...>::next>;
    using ret = IF<
        val == List<data...>::value,
        typename next::ret,
        typename PushFront<List<data...>::value, typename next::ret>::ret
    >::ret;
};
template<int val>
struct DelNumAll<val, Null> {
    using ret = Null;
};
// 链表修改：修改下标为 pos 的元素为 val
template<int pos, int val, class ListObj> struct Modify {};
template<int pos, int val, int ...data>
struct Modify<pos, val, List<data...>> {
    using next = Modify<pos - 1, val, typename List<data...>::next>;
    using ret = IF<
        pos == 0,
        typename PushFront<val, typename List<data...>::next>::ret,
        typename PushFront<List<data...>::value, typename next::ret>::ret
    >::ret;
};
template<int pos, int val>
struct Modify<pos, val, Null> {
    using ret = Null;
};
```
