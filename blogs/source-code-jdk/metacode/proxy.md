---
title: 动态代理
---

::: tip
最近研究 mybatis 是怎么将 mapper 的方法结合着 .xml 的 sql 进行绑定的，发现里面有很多动态代理的调用学了学，看了看源码，记录一下。
:::

## Demo

```java
public class LoggerInvocationHandler implements InvocationHandler {

    // 被代理的真实对象
    private Object target;

    public LoggerInvocationHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
      	// 前置输出参数
        String methodDesc = String.format("[LOGGER] %s#%s",
                target.getClass().getName(),
                method.getName());
        System.out.println(methodDesc + ", args:" +
                (args==null||args.length==0
                        ? "EMPTY"
                        : StringUtils.join(Arrays.stream(args).map(Object::toString).collect(Collectors.toList()), ',')));
				// 执行真实方法
        Object ret = method.invoke(target, args);
      	// 后置输出返回值
        System.out.println(methodDesc + ", return:" + ret);
      	
      	return ret;
    }
}


public interface Subject {
    public void doSomething ();
}
public class RealSubject implements Subject {
    @Override
    public void doSomething () {
        System.out.println("RealSubject doSomething() ...");
    }
}


public class Main {

    public static void main(String[] args) {
      	// 接收到方法转发的处理器
        RealSubject realSubject = new RealSubject();
        LoggerInvocationHandler handler = new LoggerInvocationHandler(realSubject);

      	// 动态代理类
        Subject subject = (Subject) Proxy.newProxyInstance(
                RealSubject.class.getClassLoader(),
                RealSubject.class.getInterfaces(),
                handler
        );
        subject.doSomething();
    }

}
```


输出：

```
[LOGGER] com.snopzyz.code4learn.动态代理.RealSubject#doSomething, args:EMPTY
RealSubject doSomething() ...
[LOGGER] com.snopzyz.code4learn.动态代理.RealSubject#doSomething, return:null
```

## 源码分析代理逻辑

下面从 JDK 源码入手，围绕 Demo 中调用的 java.lang.reflect.Proxy#newProxyInstance 方法内的逻辑进行讲解

其中

- java.lang.reflect.Proxy#getProxyClass0
    - java.lang.reflect.WeakCache#get
        - java.lang.reflect.WeakCache.Factory#get（从supplier.get那一行来的）
            - java.lang.reflect.Proxy.ProxyClassFactory#apply
                - sun.misc.ProxyGenerator#generateProxyClass
                    - java.lang.reflect.ProxyGenerator#generateClassFile

生成了个名为 “com.sun.proxy.$Proxy0” 这样的类，有 newProxyInstance 中 interfaces 中所有的方法  
在 `methods.add(generateConstructor());` 一行可以看到，加了一个参数为 InvocationHandler 的构造方法  
并通过 `dout.writeShort(cp.getClass(superclassName));` 标注父类是 java.lang.reflect.Proxy  
并通过

```java
// u2 interfaces_count;
dout.writeShort(interfaces.length);
// u2 interfaces[interfaces_count];
for (Class<?> intf : interfaces) {
    dout.writeShort(cp.getClass(dotToSlash(intf.getName())));
}
```


标注是实现自 newProxyInstance 中的 interface

因此 newProxyInstance 中的 `Class<?> cl = getProxyClass0(loader, intfs);` cl 是一个继承了 Proxy、实现了 Subject（我Demo中的类名）的类  
因此该方法返回值 `return cons.newInstance(new Object[]{h});` 可以被强转成 Subject，但同时它又的确是 Proxy 的子类



**那么Proxy的方法被执行时是怎么发到InvocationHandler中的？**  
这个问题可以从上面最后一个方法 java.lang.reflect.ProxyGenerator#generateClassFile 继续往下看。

```java
// 遍历代理接口，将接口方法添加到代理类中
for (Class<?> intf : interfaces) {
    for (Method m : intf.getMethods()) {
        if (!Modifier.isStatic(m.getModifiers())) {
            addProxyMethod(m, intf);
        }
    }
}
```


在这里的 addProxyMethod 中会将interface的所有方法收录进一个成员变量 proxyMethods 中，然后在下面实际将这些方法添加进代理类的方法中时

```java
for (List<ProxyMethod> sigmethods : proxyMethods.values()) {
    for (ProxyMethod pm : sigmethods) {
        // add static field for method's Method object
        fields.add(new FieldInfo(pm.methodFieldName, "Ljava/lang/reflect/Method;", ACC_PRIVATE | ACC_STATIC));
        // generate code for proxy method and add it
        methods.add(pm.generateMethod());
    }
}
```


在这里面的 generateMethod 就是生成实际方法的过程，generateMethod 中从 `out.writeShort(cp.getInterfaceMethodRef("java/lang/reflect/InvocationHandler", "invoke", "(Ljava/lang/Object;Ljava/lang/reflect/Method;" + "[Ljava/lang/Object;)Ljava/lang/Object;"));` 这一行就可以看出，生成的每个实际方法，都是只有一个 invocationHandler.invoke 的调用，没有其他内容了。

等于说 Demo 中的 subject 对象，它真实的类被定义成下面这样

```java
package com.sun.proxy;

public class $Proxy0 extend Proxy implements Subject {
    // 存储每个方法的Method对象
    // ...... hasCode、equals、toString 就不多说了
    private static Method m4;  // doSomething
    
    // 静态代码块初始化Method对象
    static {
        try {
            // ...... 一样不说  hasCode 这些了
            m4 = Class.forName("com.动态代理学习.Subject").getMethod("doSomething");
        } catch(NoSuchMethodException | ClassNotFoundException e) {
            throw new NoSuchMethodError(e.getMessage());
        }
    }
    
    // 构造方法必须调用父类构造器
    public $Proxy0(InvocationHandler h) {
        super(h);
    }
    
    // 实现接口方法
    public void doSomething() {
        try {
            // 调用InvocationHandler的invoke方法
            super.h.invoke(
                this,           // 代理对象本身
                m4,             // doSomething方法对象
                null            // 无参数
            );
        } catch (Throwable e) {
            // 处理异常
            throw new UndeclaredThrowableException(e);
        }
    }
    
    // ......
}
```

所以说代理类是方法的转发，但我更想用一个歧义不大的名词：“代替”。

## 总结

动态代理是指用 Proxy.newProxyInstance 动态生成一个对象

- 类：继承自 Proxy、实现自newProxyInstance参数2(interfaces)

- 对象：传入了参数3(invocationHandler)进行构造

这个对象中所有来自 interfaces 的方法名保留，内容都替换成 invocationHandler.invoke。

从而做到：调用 newProxyInstance 方法的返回对象的任何方法时，都会只去执行 invocationHandler.invoke

## 应用

正如开头所说，mybatis 的动态代理，它在 spring bean 加载时将 xml 的 sql 解析出来，并和 selectOne、delete 这样的方法通过动态代理绑定。这些方法