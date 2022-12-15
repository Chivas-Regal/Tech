---
title: 数据传输
---

## HTML传给cgi

在 `html` 中应该有一个可以发送数据的表单：  

```html
<!-- main.html -->

...
<form action='./main.cgi' method='post' target='_blank'>
    ...
</form>
...
```

在表单里面的元素，可以通过 `value` 将数据传递给 `main.cpp` ，当然也应当有一个 `submit` 的按钮，作为表单的提交  

对于 `main.cpp` 如何获取此 `value` ，首先这个标签元素应该有一个唯一的 `name`  
然后 `.cgi` 通过   

```cpp
// main.cpp 

...
cgicc::Cgicc formData;
cgicc::form_iterator fit = formData.getElement("要获取的标签的name");
...
```

此时 `**fit` 就是那个 `html` 中对应吗 `name` 标签的 `value` 值，是一个字符串  

### 输入框

```html
    <input type='text' name='input'/>
```

这样它的 `value` 即为输入文本，对于 `cgi` 接收直接用  

```cpp
cgicc::Cgicc formData;
cgicc::form_iterator fit = formData.getElement("input");
if (!fit->isEmpty() && fit != (*formData).end()) {
    std::cout << **fit << std::endl;
}
```

### 复选框

```html
    <input type="checkbox" name="one" value="on" /> 1
    <input type="checkbox" name="two" value="on" /> 2
```

```cpp
cgicc::Cgicc formData;
cgicc::form_iterator fit_one = formData.queryCheckbox("one");
cgicc::form_iterator fit_two = formData.queryCheckbox("two");
std::cout << "选择的数据有：\n";
if (fit_one) std::cout << "1\n";
if (fit_two) std::cout << "2\n";
```

---

别的基本上都是 `getElement()` 直接获取，用法和上面的类似

## cgi传递给cgi

这个东西是思考项目的数据传递的时候发现的，本意想让 `cgi` 传递数据给 `html` ，不过没怎么找到教程。但是既然 `cgi` 是输出 `html` 然后进行解析，那么理论上就支持传递数据这种事情，尝试一下  

```cpp
// main.cpp

...
std::cout << "<form action='./main.cgi' method='post' target='_blank'>\n";
std::cout << "    <input type='text' name='input'/>\n";
std::cout << "    <input type='submit' value='提交'/>\n";
std::cout << "</form>\n";

cgicc::Cgicc formData;
cgicc::form_iterator fit = formData.getElement("input");
if (!fit->isEmpty() && fit != (*formData).end()) {
    std::cout << **fit << std::endl;
}
...
```

![20221215235904](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221215235904.png)  
![20221215235929](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221215235929.png)  

嗯事实证明是可行的，且点击完按钮之后会重新进入到本页面，每次传递只会进行一次