---
title: Stream基础与API手册
---

先看一下流能做什么吧

```java
List<Integer> list = IntStream.range(1, 5).boxed().collect(Collectors.toList());
// list: [1, 2, 3, 4]

list.addAll(list);
Collections.shuffle(list);
// list: 打乱后的 [1, 1, 2, 2, 3, 3, 4, 4]

Map<Integer, Integer> map = list.stream()
        // 过滤出偶数
        .filter(x -> x % 2 == 0)
        // 去重
        .distinct()
        // 除以 2
        .map(x -> x / 2)
        // 收集结果，key=x*2，value=x
        .collect(Collectors.toMap(x -> x * 2, x -> x));
// map: {2:1, 4:2}
```

这就是经典的使用场景了，通过流提供的大量API操作，可以快速生成或是对容器数据进行各种变更。  

## “流”设计理念

Stream流可以说是[设计模式——管道模式](../../dev-spec/pattern/36-pipeline.html)的最佳实践了。  
把一系列的数据比作水流，Stream操作则是管道，**一个一个**数据/实例从起点（示例中的 `list.stream()`）经过各种中间操作（示例中的 `filter`、`distinct`...）达至终点（示例中的 `collect`）。  
把 “一个一个” 重点标记的原因是，并非是每一步操作（filter）等所有数据执行完后才进入下一步操作（distinct）执行，而是只针对当前一条数据，走完所有的流操作。待当前一条数据到达终点后，再从头开始处理下一条数据。  

这里可以通过“在每一个流操作执行过程中，输出当前操作数据”来进行验证。  

```java
System.out.println(list);
list.stream()
        // 过滤出偶数
        .filter(x -> {
            boolean res = x % 2 == 0;
            System.out.printf("x=%s, filter, res=%s\n", x, res);
            return res;
        })
        // 去重
        .distinct()
        // 除以 2
        .map(x -> {
            Integer res = x / 2;
            System.out.printf("x=%s, map, res=%s\n", x, res);
            return res;
        })
        // 切换使用forEach终端节点输出
        .forEach(x -> {
            System.out.printf("x=%s, forEach\n", x);
        })
/* 输出内容
[2, 2, 1, 3, 4, 3, 1, 4]
x=2, filter, res=true
x=2, map, res=1
x=1, forEach
x=2, filter, res=true
x=1, filter, res=false
x=3, filter, res=false
x=4, filter, res=true
x=4, map, res=2
x=2, forEach
x=3, filter, res=false
x=1, filter, res=false
x=4, filter, res=true
*/
```

输出解释，原 list 内容：`[2, 2, 1, 3, 4, 3, 1, 4]`

- i=0，原数据=2时，能通过过滤与去重，参与全流程操作，输出
    - `x=2, filter, res=true`
    - `x=2, map, res=1`
    - `x=1, forEach`
- i=1，原数据=2，仅参与 filter 和 distinct 过程，无法通过去重，输出
    - `x=2, filter, res=true`
- i=2，原数据=1，仅参与 filter 过程，无法通过 filter，输出
    - `x=1, filter, res=false`
- ... 剩余的就不多说了，规律是一样的

这是大多数数据流转方式，也有一些特殊的如 `.sorted()` 操作，需要拿到前置操作后的所有数据才会执行，并且如果使用并行流的话整体的顺序又会有些差别。  
好奇的话可以自己去试一下，后面的章节会结合源码讲一下。  

## API手册

### 流创建操作

| 方法 | 说明 | 示例 |
|------|------|------|
| Collection.stream() | 从集合创建流 | `list.stream()` |
| Collection.parallelStream() | 从集合创建并行流 | `list.parallelStream()` |
| Arrays.stream(T[]) | 从数组创建流 | `Arrays.stream(new int[]{1,2,3})` |
| Stream.of(T...) | 从可变参数创建流 | `Stream.of(1, 2, 3)` |
| Stream.empty() | 创建空流 | `Stream.empty()` |
| Stream.generate(Supplier) | 无限流（生成） | `Stream.generate(Math::random)` |
| Stream.iterate(T, UnaryOperator) | 无限流（迭代） | `Stream.iterate(0, n -> n + 1)` |
| Stream.iterate(T, Predicate, UnaryOperator) | 有限迭代流（Java 9+） | `Stream.iterate(0, n -> n < 10, n -> n + 1)` |
| IntStream.range(int, int) | 整数范围流（不含结束） | `IntStream.range(1, 10)` |
| IntStream.rangeClosed(int, int) | 整数范围流（含结束） | `IntStream.rangeClosed(1, 10)` |
| Files.lines(Path) | 从文件读取行 | `Files.lines(Paths.get("file.txt"))` |
| String.chars() | 字符串转IntStream | `"abc".chars()` |
| Pattern.splitAsStream(String) | 正则分割为流 | `Pattern.compile(",").splitAsStream("a,b,c")` |
| Stream.concat(Stream, Stream) | 连接两个流 | `Stream.concat(stream1, stream2)` |
| Stream.builder() | 构建器模式创建流 | `Stream.<String>builder().add("a").build()` |


### 中间操作

**转换操作**

| 方法 | 类型 | 说明 | 示例 |
|------|------|------|------|
| map(Function) | 无状态 | 元素一对一转换 | `stream.map(String::toUpperCase)` |
| mapToInt(ToIntFunction) | 无状态 | 转换为IntStream | `stream.mapToInt(String::length)` |
| mapToLong(ToLongFunction) | 无状态 | 转换为LongStream | `stream.mapToLong(Long::parseLong)` |
| mapToDouble(ToDoubleFunction) | 无状态 | 转换为DoubleStream | `stream.mapToDouble(Double::parseDouble)` |
| flatMap(Function) | 无状态 | 元素一对多转换（扁平化） | `stream.flatMap(list -> list.stream())` |
| flatMapToInt(Function) | 无状态 | 扁平化为IntStream | `stream.flatMapToInt(s -> s.chars())` |
| flatMapToLong(Function) | 无状态 | 扁平化为LongStream | `stream.flatMapToLong(...)` |
| flatMapToDouble(Function) | 无状态 | 扁平化为DoubleStream | `stream.flatMapToDouble(...)` |
| mapMulti(BiConsumer) | 无状态 | 更高效的flatMap（Java 16+） | `stream.mapMulti((e, consumer) -> {...})` |

**过滤操作**

| 方法 | 类型 | 说明 | 示例 |
|------|------|------|------|
| filter(Predicate) | 无状态 | 过滤元素 | `stream.filter(n -> n > 10)` |
| distinct() | 有状态 | 去重（基于equals） | `stream.distinct()` |
| limit(long) | 有状态/短路 | 限制元素数量 | `stream.limit(10)` |
| skip(long) | 有状态 | 跳过前N个元素 | `stream.skip(5)` |
| takeWhile(Predicate) | 无状态/短路 | 获取满足条件的元素直到不满足（Java 9+） | `stream.takeWhile(n -> n < 10)` |
| dropWhile(Predicate) | 无状态 | 丢弃满足条件的元素直到不满足（Java 9+） | `stream.dropWhile(n -> n < 10)` |

**排序操作**

| 方法 | 类型 | 说明 | 示例 |
|------|------|------|------|
| sorted() | 有状态 | 自然排序 | `stream.sorted()` |
| sorted(Comparator) | 有状态 | 自定义排序 | `stream.sorted(Comparator.reverseOrder())` |

**其他**

| 方法 | 类型 | 说明 | 示例 |
|------|------|------|------|
| peek(Consumer) | 无状态 | 查看元素（调试用） | `stream.peek(System.out::println)` |
| parallel() | 无状态 | 转为并行流 | `stream.parallel()` |
| sequential() | 无状态 | 转为串行流 | `stream.sequential()` |
| unordered() | 无状态 | 去除有序约束 | `stream.unordered()` |
| onClose(Runnable) | 无状态 | 流关闭时执行 | `stream.onClose(() -> {...})` |


### 终端操作

**匹配操作**

| 方法 | 短路 | 说明 | 返回值 | 示例 |
|------|------|------|--------|------|
| anyMatch(Predicate) | 是 | 任意一个满足 | `boolean` | `stream.anyMatch(n -> n > 10)` |
| allMatch(Predicate) | 是 | 全部满足 | `boolean` | `stream.allMatch(n -> n > 0)` |
| noneMatch(Predicate) | 是 | 全部不满足 | `boolean` | `stream.noneMatch(n -> n < 0)` |

**查找操作**

| 方法 | 短路 | 说明 | 返回值 | 示例 |
|------|------|------|--------|------|
| findFirst() | 是 | 查找第一个元素 | `Optional<T>` | `stream.findFirst()` |
| findAny() | 是 | 查找任意一个元素 | `Optional<T>` | `stream.findAny()` |

**聚合操作**

| 方法 | 短路 | 说明 | 返回值 | 示例 |
|------|------|------|--------|------|
| count() | 否 | 计数 | `long` | `stream.count()` |
| max(Comparator) | 否 | 最大值 | `Optional<T>` | `stream.max(Integer::compareTo)` |
| min(Comparator) | 否 | 最小值 | `Optional<T>` | `stream.min(Integer::compareTo)` |
| reduce(BinaryOperator) | 否 | 归约（无初始值） | `Optional<T>` | `stream.reduce(Integer::sum)` |
| reduce(T, BinaryOperator) | 否 | 归约（有初始值） | `T` | `stream.reduce(0, Integer::sum)` |
| reduce(U, BiFunction, BinaryOperator) | 否 | 归约（并行流用） | `U` | `stream.reduce(0, (a,b)->a+b, Integer::sum)` |

**遍历操作**

| 方法 | 短路 | 说明 | 返回值 | 示例 |
|------|------|------|--------|------|
| forEach(Consumer) | 否 | 遍历（无序） | `void` | `stream.forEach(System.out::println)` |
| forEachOrdered(Consumer) | 否 | 遍历（有序） | `void` | `stream.forEachOrdered(System.out::println)` |

**收集操作**

| 方法 | 短路 | 说明 | 返回值 | 示例 |
|------|------|------|--------|------|
| collect(Collector) | 否 | 收集到容器 | `R` | `stream.collect(Collectors.toList())` |
| collect(Supplier, BiConsumer, BiConsumer) | 否 | 自定义收集 | `R` | `stream.collect(ArrayList::new, List::add, List::addAll)` |
| toArray() | 否 | 转为Object数组 | `Object[]` | `stream.toArray()` |
| toArray(IntFunction) | 否 | 转为指定类型数组 | `T[]` | `stream.toArray(String[]::new)` |
| toList() | 否 | 转为不可变List（Java 16+） | `List<T>` | `stream.toList()` |


### Collectors 收集器

**基础收集器**

| 收集器 | 说明 | 示例 |
|--------|------|------|
| toList() | 收集到List | `collect(toList())` |
| toSet() | 收集到Set | `collect(toSet())` |
| toCollection(Supplier) | 收集到指定集合 | `collect(toCollection(ArrayList::new))` |
| toUnmodifiableList() | 收集到不可变List（Java 10+） | `collect(toUnmodifiableList())` |
| toUnmodifiableSet() | 收集到不可变Set（Java 10+） | `collect(toUnmodifiableSet())` |

**Map收集器**

| 收集器 | 说明 | 示例 |
|--------|------|------|
| toMap(Function, Function) | 转为Map | `collect(toMap(k -> k, v -> v))` |
| toMap(Function, Function, BinaryOperator) | 转为Map（处理重复key） | `collect(toMap(k->k, v->v, (v1,v2)->v1))` |
| toMap(Function, Function, BinaryOperator, Supplier) | 转为指定Map | `collect(toMap(k->k, v->v, (v1,v2)->v1, TreeMap::new))` |
| toUnmodifiableMap(...) | 转为不可变Map（Java 10+） | `collect(toUnmodifiableMap(k->k, v->v))` |
| toConcurrentMap(...) | 转为并发Map | `collect(toConcurrentMap(k->k, v->v))` |

**字符串收集器**

| 收集器 | 说明 | 示例 |
|--------|------|------|
| joining() | 连接字符串 | `collect(joining())` |
| joining(CharSequence) | 连接字符串（分隔符） | `collect(joining(", "))` |
| joining(CharSequence, CharSequence, CharSequence) | 连接字符串（分隔符+前后缀） | `collect(joining(", ", "[", "]"))` |

**统计收集器**

| 收集器 | 说明 | 返回值 | 示例 |
|--------|------|--------|------|
| counting() | 计数 | `Long` | `collect(counting())` |
| summingInt(ToIntFunction) | 求和 | `Integer` | `collect(summingInt(Integer::intValue))` |
| summingLong(ToLongFunction) | 求和 | `Long` | `collect(summingLong(Long::longValue))` |
| summingDouble(ToDoubleFunction) | 求和 | `Double` | `collect(summingDouble(Double::doubleValue))` |
| averagingInt(ToIntFunction) | 平均值 | `Double` | `collect(averagingInt(Integer::intValue))` |
| averagingLong(ToLongFunction) | 平均值 | `Double` | `collect(averagingLong(Long::longValue))` |
| averagingDouble(ToDoubleFunction) | 平均值 | `Double` | `collect(averagingDouble(Double::doubleValue))` |
| summarizingInt(ToIntFunction) | 统计摘要 | `IntSummaryStatistics` | `collect(summarizingInt(Integer::intValue))` |
| summarizingLong(ToLongFunction) | 统计摘要 | `LongSummaryStatistics` | `collect(summarizingLong(Long::longValue))` |
| summarizingDouble(ToDoubleFunction) | 统计摘要 | `DoubleSummaryStatistics` | `collect(summarizingDouble(Double::doubleValue))` |

**极值收集器**

| 收集器 | 说明 | 返回值 | 示例 |
|--------|------|--------|------|
| maxBy(Comparator) | 最大值 | `Optional<T>` | `collect(maxBy(Integer::compareTo))` |
| minBy(Comparator) | 最小值 | `Optional<T>` | `collect(minBy(Integer::compareTo))` |

**分组收集器**

| 收集器 | 说明 | 返回值 | 示例 |
|--------|------|--------|------|
| groupingBy(Function) | 分组 | `Map<K, List<T>>` | `collect(groupingBy(String::length))` |
| groupingBy(Function, Collector) | 分组+下游收集器 | `Map<K, D>` | `collect(groupingBy(String::length, counting()))` |
| groupingBy(Function, Supplier, Collector) | 分组+指定Map+下游收集器 | `Map<K, D>` | `collect(groupingBy(k->k, TreeMap::new, toList()))` |
| groupingByConcurrent(...) | 并发分组 | `ConcurrentMap` | `collect(groupingByConcurrent(String::length))` |

**分区收集器**

| 收集器 | 说明 | 返回值 | 示例 |
|--------|------|--------|------|
| partitioningBy(Predicate) | 分区 | `Map<Boolean, List<T>>` | `collect(partitioningBy(n -> n % 2 == 0))` |
| partitioningBy(Predicate, Collector) | 分区+下游收集器 | `Map<Boolean, D>` | `collect(partitioningBy(n->n%2==0, counting()))` |

**归约收集器**

| 收集器 | 说明 | 返回值 | 示例 |
|--------|------|--------|------|
| reducing(BinaryOperator) | 归约 | `Optional<T>` | `collect(reducing(Integer::sum))` |
| reducing(T, BinaryOperator) | 归约（有初始值） | `T` | `collect(reducing(0, Integer::sum))` |
| reducing(U, Function, BinaryOperator) | 映射后归约 | `U` | `collect(reducing(0, String::length, Integer::sum))` |

**组合收集器**

| 收集器 | 说明 | 示例 |
|--------|------|------|
| collectingAndThen(Collector, Function) | 收集后再处理 | `collect(collectingAndThen(toList(), Collections::unmodifiableList))` |
| mapping(Function, Collector) | 映射后收集 | `collect(groupingBy(k->k, mapping(String::toUpperCase, toList())))` |
| filtering(Predicate, Collector) | 过滤后收集（Java 9+） | `collect(groupingBy(k->k, filtering(s->s.length()>2, toList())))` |
| flatMapping(Function, Collector) | 扁平化后收集（Java 9+） | `collect(groupingBy(k->k, flatMapping(s->s.chars().boxed(), toList())))` |
| teeing(Collector, Collector, BiFunction) | 双收集器（Java 12+） | `collect(teeing(summingInt(i->i), counting(), (sum, count) -> sum/count))` |


### IntStream/LongStream/DoubleStream 特有

**创建方法**

| 方法 | 说明 | 示例 |
|------|------|------|
| range(int, int) | 范围流（不含结束） | `IntStream.range(1, 10)` |
| rangeClosed(int, int) | 范围流（含结束） | `IntStream.rangeClosed(1, 10)` |
| of(int...) | 从可变参数创建 | `IntStream.of(1, 2, 3)` |
| generate(IntSupplier) | 无限流 | `IntStream.generate(() -> 1)` |
| iterate(int, IntUnaryOperator) | 迭代流 | `IntStream.iterate(0, n -> n + 1)` |

**统计方法**

| 方法 | 说明 | 返回值 | 示例 |
|------|------|--------|------|
| sum() | 求和 | `int/long/double` | `intStream.sum()` |
| average() | 平均值 | `OptionalDouble` | `intStream.average()` |
| max() | 最大值 | `OptionalInt/Long/Double` | `intStream.max()` |
| min() | 最小值 | `OptionalInt/Long/Double` | `intStream.min()` |
| summaryStatistics() | 统计摘要 | `IntSummaryStatistics` | `intStream.summaryStatistics()` |

**转换方法**

| 方法 | 说明 | 示例 |
|------|------|------|
| boxed() | 装箱为Stream | `intStream.boxed()` |
| mapToObj(IntFunction) | 转为对象流 | `intStream.mapToObj(String::valueOf)` |
| asLongStream() | 转为LongStream | `intStream.asLongStream()` |
| asDoubleStream() | 转为DoubleStream | `intStream.asDoubleStream()` |


### 并行流相关

| 方法/属性 | 说明 | 示例 |
|-----------|------|------|
| parallelStream() | 创建并行流 | `list.parallelStream()` |
| parallel() | 转为并行流 | `stream.parallel()` |
| sequential() | 转为串行流 | `stream.sequential()` |
| isParallel() | 判断是否并行 | `stream.isParallel()` |
| 系统属性 | 设置并行度 | -Djava.util.concurrent.ForkJoinPool.common.parallelism=4 |


### Optional 相关方法

| 方法 | 说明 | 示例 |
|------|------|------|
| isPresent() | 是否有值 | `optional.isPresent()` |
| isEmpty() | 是否为空（Java 11+） | `optional.isEmpty()` |
| get() | 获取值（可能抛异常） | `optional.get()` |
| orElse(T) | 有值返回值，否则返回默认值 | `optional.orElse("default")` |
| orElseGet(Supplier) | 有值返回值，否则执行Supplier | `optional.orElseGet(() -> "default")` |
| orElseThrow() | 有值返回值，否则抛异常 | `optional.orElseThrow()` |
| orElseThrow(Supplier) | 有值返回值，否则抛自定义异常 | `optional.orElseThrow(IllegalStateException::new)` |
| ifPresent(Consumer) | 有值则执行 | `optional.ifPresent(System.out::println)` |
| ifPresentOrElse(Consumer, Runnable) | 有值执行Consumer，否则执行Runnable（Java 9+） | `optional.ifPresentOrElse(v->..., ()->...)` |
| filter(Predicate) | 过滤 | `optional.filter(s -> s.length() > 5)` |
| map(Function) | 映射 | `optional.map(String::toUpperCase)` |
| flatMap(Function) | 扁平化映射 | `optional.flatMap(s -> Optional.of(s.toUpperCase()))` |
| or(Supplier) | 有值返回自身，否则返回Supplier提供的Optional（Java 9+） | `optional.or(() -> Optional.of("default"))` |
| stream() | 转为Stream（Java 9+） | `optional.stream()` |


### Stream 特性标识（StreamOpFlag）

| 标识 | 说明 |
|------|------|
| DISTINCT | 元素唯一 |
| SORTED | 已排序 |
| ORDERED | 有序 |
| SIZED | 已知大小 |
| SHORT_CIRCUIT | 短路操作 |


### 短路操作完整列表

**中间短路操作**

| 操作 | 说明 |
|------|------|
| limit(n) | 只取前n个元素 |
| takeWhile(Predicate) | 取满足条件的元素直到遇到不满足的（Java 9+） |

**终端短路操作**

| 操作 | 说明 |
|------|------|
| findFirst() | 找到第一个就返回 |
| findAny() | 找到任意一个就返回 |
| anyMatch(Predicate) | 任意一个满足就返回true |
| allMatch(Predicate) | 遇到第一个不满足就返回false |
| noneMatch(Predicate) | 遇到第一个满足就返回false |