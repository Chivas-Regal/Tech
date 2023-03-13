---
title: 编译期归并排序
---

## 运行期归并排序

回忆一下正常的归并排序是怎么写的  
**参数**：虽然大多为 `int l, int r` ，实际目的是锁定出来一个数组，因此参数可以理解为数组  
**出口**：数组为空或者只有一个元素时不用排，直接出  
**入口**：对半分出两个数组，分别进入排序  
**操作**：两数组的顺序合并  

```cpp
std::vector<int> a;
void Sort (int l, int r) {
    if (l >= r) return;

    int mid = (l + r) >> 1;
    Sort(l, mid); Sort(mid + 1, r);
    std::vector<int> b;
    int i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) b.push_back(a[i ++]);
        else b.push_back(a[j ++]);
    }
    while (i <= mid) b.push_back(a[i ++]);
    while (j <= r) b.push_back(a[j ++]);
    for (i = l; i <= r; i ++) a[i] = b[i - l];
}
int main () {
    a = {5, 4, 1, 6, 3, 2};
    Sort(0, a.size() - 1);
    for (int i : a) 
        std::cout << i << " "; 
}
/*
Output:
1 2 3 4 5 6
*/
```

## 编译期归并排序

排序的对象用我们 [这里](./4-compile-list.html) 声明好的编译期链表

### 操作：两升序数组升序合并

这个是归并的核心，但我们在前面链表删除中应该已经有回溯递归的思想了  
在这里我们依然用回溯递归来完成操作  
升序合并时先提出两者最小值，这样我们大致要判断一下提的是谁的，才能看子阶段是谁变成自己的 `next`  
相信子阶段给出的链表是正确的，我们直接合并这个最小值和子阶段返回的链表  

```cpp
template<class ListObj1, class ListObj2> struct MergeBySort {};
template<int ...L, int ...R>
struct MergeBySort<List<L...>, List<R...>> {
    const static int __MIN_VALUE = Min<List<L...>::value, List<R...>::value>::value;
    // 子阶段
    using next = IF<
        List<L...>::value <= List<R...>::value,
        MergeBySort<typename List<L...>::next, List<R...>>, // 左被用了一个
        MergeBySort<List<L...>, typename List<R...>::next>  // 右被用了一个 
    >::ret;
    // 合并最小值和子阶段链表
    using ret = typename PushFront<__MIN_VALUE, typename next::ret>::ret;
};
```

![20230313193014](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313193014.png)


### 整体：拆分排序后升序合并

和归并一样，我们将一个链表拆成两个链表，并将他们分别进入归并排序  
信任排序的结果，用我们写好的升序合并两升序链表进行合并，即可得到排序后的链表，将它设置为返回值供上层使用  
偏特化出口，即只有一个元素的链表没有必要排序，返回值为自己即可  

```cpp
template<class ListObj> struct Sort {};
template<int ...data>
struct Sort<List<data...>> {
    using ret = MergeBySort< // 合并两排序链表
        typename Sort<typename Split<List<data...>::size / 2, List<>, List<data...>>::_L>::ret, // 对左半链表排序
        typename Sort<typename Split<List<data...>::size / 2, List<>, List<data...>>::_R>::ret  // 对右半链表排序
    >::ret;
};
template<int data>
struct Sort<List<data>> {
    using ret = List<data>;
};
```

![20230313192922](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230313192922.png)


## 源代码

```cpp
// 对两个升序链表升序合并
template<class ListObj1, class ListObj2> struct MergeBySort {};
template<int ...L, int ...R>
struct MergeBySort<List<L...>, List<R...>> {
    const static int __MIN_VALUE = Min<List<L...>::value, List<R...>::value>::value;
    using next = IF<
        List<L...>::value <= List<R...>::value,
        MergeBySort<typename List<L...>::next, List<R...>>,
        MergeBySort<List<L...>, typename List<R...>::next>
    >::ret;
    using ret = typename PushFront<__MIN_VALUE, typename next::ret>::ret;
};
template<int ...data>
struct MergeBySort<Null, List<data...>> {
    using ret = List<data...>;
};
template<int ...data>
struct MergeBySort<List<data...>, Null> {
    using ret = List<data...>;
};
// 归并排序
template<class ListObj> struct Sort {};
template<int ...data>
struct Sort<List<data...>> {
    using ret = MergeBySort<
        typename Sort<typename Split<List<data...>::size / 2, List<>, List<data...>>::_L>::ret,
        typename Sort<typename Split<List<data...>::size / 2, List<>, List<data...>>::_R>::ret
    >::ret;
};
template<int data>
struct Sort<List<data>> {
    using ret = List<data>;
};
```