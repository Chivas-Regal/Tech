---
title: 进程定义与初使用
---

::: tip
为了让并发程序独立运行，操作系统配置了一个专门的数据结构：进程控制块（PCB），系统利用 PCB 描述进程活动从而控制进程  
程序段 $+$ 相关数据段 $+$ PCB $=$ 进程实体
:::

## 定义

- 进程是进程实体的运行过程，是系统进行资源分配和调度的一个独立单位
- 进程是程序的一次执行
- 进程是一个程序以及其数据在处理机上顺序执行所发生的活动
- 进程是具有独立功能的程序在一个数据集合上运行的过程，是系统进行资源分配和调度的一个独立单位

**优点：**  
- 有封闭性和可再现性
- 多道程序设计出现后实现了程序的并发执行和资源共享

**缺点：**  
- 切换进程速度较慢
- 数据交换不方便
- 创建和撤销的开销较大

## 基本状态

**创建状态：** 申请一个空白 PCB 并向里面写入用于控制和管理进程的信息，插入就绪队列前为该进程分配运行时必须的资源  
**就绪状态：** 进程已经分配到除CPU以外的所有必要资源。有许多就绪状态的进程会按一定策略排成就绪队列。  
**执行状态：** 已经获得 CPU ，程序正在执行  
**阻塞状态：** 执行进程发生某事件暂时无法继续执行，OS将处理机分给别的就绪进程，受阻进程进入暂停、阻塞、等待、封锁状态，这里也有一个阻塞队列（阻塞原因不同会有多个队列）  
**终止状态：** 先等待操作系统进行善后处理，最后将其 PCB 清零并将其返还给系统  

![20230215155108](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230215155108.png)

## 创建

进程可以由操作系统或者父进程创建，前者创建的进程平等，后者创建的存在继承关系  
父进程创建子进程方式使用 `fork()` 函数，在调用时本线程即分裂，函数返回两次，返回 $0$ 的是子进程，返回正整数的是原进程（父进程） 

```cpp
int main () {
    pid_t pid = fork();
    if (pid == 0) {
        // son
        std::cout << "This is son." << std::endl;
    } else if (pid > 0) {
        // father
        std::cout << "This is father." << std::endl;
    } else {
        // error
        std::cout << "E: Fork error." << std::endl;
    }
}
/*
Output:
This is son.
This is father.
*/
```