---
title: Lambda函数式编程
---

::: tip

在开始讲之前先看一个简单的小案例来明白 Lambda 是什么  
一个最简单的排序器，定义规则我们不用在外面做一个专门的实现类来实现 `Comparator` 的 `compare` 方法，而是可以直接这样。  

```java
Comparator<Integer> comparator = (o1, o2) -> o1.compareTo(o2);

List<Integer> list = Arrays.asList(3, 1, 2);
list.sort(comparator);
System.out.println(list); // [1, 2, 3]
```

这样就实现了排序的功能，其中 `(o1, o2) -> o1.compareTo(o2)` 就是 Lambda 表达式，它实现了 `compare` 方法，表示返回 `o1.compareTo(o2)`。  
是不是很简单，下面就详细展开一下。

:::

## 语法

```java
(parameters) -> expression
(parameters) -> {statements;}
```

可以将 Lambda 理解为一个方法，前面 `()` 里面的内容是它的参数，而 `->` 后面的内容则是方法体。  
意思就是，如果在 `->` 后面是没有被花括号包围住的内容，则它必须是一个表达式，返回值就是”这个表达式作为右值时“对应左值的类型，  
而如果 `->` 后面的内容被花括号包围住了，则它必须是完整的语句，是否有返回值取决于是否有 `return`。  
例如上面的案例我们就可以有两种写法：  
- `(o1, o2) -> o1.compareTo(o2)`：上面也说了，返回值就是后面这个语句的结果
- `(o1, o2) -> { return o1.compareTo(o2); }`：这里的返回值就很显而易见是 `return` 后面的内容了

## 作用

**Lambda 所体现出来的函数式编程，本质上是帮我们定义了某个接口类的实例，并实现了该接口中的方法。**  

比如上面的案例中它就是帮我们定义出了 `Comparator` 实例，并实现了它的 `compare` 方法，因此我们可以做一个实验，自己做一个接口，并用 lambda 实例化一个对象。  

```java
interface MyInter {
    public void print(Integer x);
}

public class Main {
    public static void main(String[] args) {
        MyInter myInter = o -> System.out.println(o);
        myInter.print(10); // Output: 10
    }
}
```

这样实例化的 `myInter` 也是可以用的，`o -> System.out.println(o)` 就是帮我们实现了 `print` 这个方法，完成了输出操作。  

## 方法引用

其实上面的 `MyInter` 实例化时的 Lambda 还有更简单的写法  

```java
MyInter myInter = o -> System.out::println;
```

这个和我们之前的输出功能是一样的，因为 **Lambda 表达式可以用 `方法的隶属者::静态方法名` 指向一个已经实现的静态方法**  
为了证明它我们可以再做一个实验：  

```java
public class Main {

    public static void mainPrint(Integer x) {
        x += 10;
        System.out.println(x);
    }

    public static void main(String[] args) {
        MyInter myInter = Main::mainPrint;
        myInter.print(10); // Output: 20
    }
}
```

这样也是可以输出出来结果的，且经过 MainPrint 方法的操作变为了 20。  

