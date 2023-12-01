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

## 应用

看完上面的，我们这里给出几个常见的应用场景来加快对 Lambda 应用的理解。

### 1. Thread线程的创建

正常创建线程时可以使用 Runnable 的实例作为运行参数，Runnable 是一个接口，实例化只需要实现里面的 `run()` 方法。  

```java
Thread thread = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello Thread");
    }
});
thread.start();

/**
 * 控制台输出：
 * 
 * Hello Thread
 */
```

而我们学了上面的 Lambda 实现接口方法，可以用 `() -> { ... }` 来替代里面的 `new Runnable() {...}`  

```java
Thread thread = new Thread(() -> {
    System.out.println("Hello Thread");
});
thread.start();
```

### 2. 集合的 forEach 遍历

`forEach` 的原型是这样的  

```java
public void forEach(     
    java.util.function.Consumer<? super T> action 
)
```

内部是一个 `Cunsumer` 接口，我们尝试用 `new` 实现后会产生一个空的需要实现的 `accept` 方法，正常写是这样的  

```java
List<String> list = Arrays.asList("snopzyz", "demo", "snopzyz1");
list.forEach(new Consumer<String>() {
    @Override
    public void accept(String s) {
        if (s.startsWith("snopzyz")) {
            System.out.println("Hello " + s);
        }
    }
});
```

这段代码是找到了每一个以 "snopzyz" 开头的字符串并输出，既然是个接口自然也可以用 Lambda 实现  

```java
List<String> list = Arrays.asList("snopzyz", "demo", "snopzyz1");
list.forEach(s -> {
    if (s.startsWith("snopzyz")) {
        System.out.println("Hello " + s);
    }
});
```

### 3. 集合的排序

不管是 `Collections` 的静态 `sort(..)` 方法还是 `List` 实例的 `sort` 方法，都可以填入一个 `Collectors` 参数，它也是一个可以被实现的接口

```java
List<Integer> list = Arrays.asList(3, 1, 2);
list.sort(new Comparator<Integer>() {
    @Override
    public int compare(Integer o1, Integer o2) {
        return o1.compareTo(o2);
    }
});
```

这样 `list` 最后就会变为 `[1, 2, 3]` 这样的升序内容  
用 Lambda 实现一下 compare ，由于该方法有返回值，我们可以直接写不带 `{}` 的表达式  

```java
List<Integer> list = Arrays.asList(3, 1, 2);
list.sort((o1, o2) -> o1.compareTo(o2));
```

### 4. 集合的归约

这里以求和做演示，当然可以用 `forEach` 遍历累加，但是 stream 流中有一个 `reduce` 方法，它有两个参数
- `T identity`：起始值
- `BinaryOperator<T> accumulator`：进行归约操作设定的接口 

比如下面这个 

```java
List<Integer> list = Arrays.asList(3, 1, 2);
int sum = list.stream().reduce(0, new BinaryOperator<Integer>() {
    @Override
    public Integer apply(Integer integer, Integer integer2) {
        return integer + integer2;
    }
});
System.out.println(sum);
```

意思就是遍历每一个元素，每遇到一个就执行 `identity = accumulator.apply(identity, item)`  
这样就完成了从 0 开始累加每一个集合元素，用 Lambda 实现 BinaryOperator 有  

```java
List<Integer> list = Arrays.asList(3, 1, 2);
int sum = list.stream().reduce(0, (a, b) -> a + b);
System.out.println(sum);
```

### 5. 集合的分类

假设我们有一个集合 `[1, 2, 3, 4]` ，我们要对奇偶进行分组进 Map 中  
stream 流的 collect 方法中，可以使用 `Collectors` 的静态方法 `groupBy`  
它里面需要实现 `Function` 接口的 `apply` 方法，返回值为“对于当前遍历到的元素，需要将其分为哪一个组”  
根据上面的需要，我们根据奇偶分组  

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4);
Map<String, List<Integer>> map = list.stream().collect(Collectors.groupingBy(new Function<Integer, String>() {
    @Override
    public String apply(Integer integer) {
        if (integer % 2 == 0) {
            return "偶数";
        } else {
            return "奇数";
        }
    }
}));
System.out.println(map);
// {偶数=[2, 4], 奇数=[1, 3]}
```

接口就用 Lambda ，然后结合三目运算来简化一下代码  

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4);
Map<String, List<Integer>> map = list.stream().collect(Collectors.groupingBy(i -> i % 2 == 0 ? "偶数" : "奇数"));
System.out.println(map);
```

一样完成了上面的内容