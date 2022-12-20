---
title: 文件扫描与调整
---



## 成品展示

![](http://1308117710.vod2.myqcloud.com/eddbaa7fvodcq1308117710/a7b5be92243791577507021980/Z8cYnGA1zJMA.png)

## 功能

在一张对文件随手拍下的图片中，快速找到图片中的纸质文件  
将其通过水平或者竖直矫正以及利用透视将它变成正常可视的图像呈现出来  
也可以识别其他的方形文件  

## 思路

首先看一下**原图**：  
![20221205162432](http://1308117710.vod2.myqcloud.com/eddbaa7fvodcq1308117710/030dc7a1243791577508679822/f0.png)

### 图片预处理

首先需要将图片变成一个易于处理的状态  
转变成灰度图，高斯模糊去一下噪声，再边缘检测一下变成二值图，把二值图膨胀一下  

```cpp
// src 源图像，dst 目标图像
dst = src;
cv::cvtColor(dst, dst, cv::COLOR_RGB2GRAY); // 灰度图
cv::GaussianBlur(dst, dst, cv::Size(11, 11), 3, 0, cv::BORDER_DEFAULT); // 高斯滤波
cv::Canny(dst, dst, 25, 75); // 边缘检测
cv::Mat kernel = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(2, 2)); // 膨胀核
cv::dilate(dst, dst, kernel); // 膨胀

// dst 即为结果
```

当然这里的有的是要灵活修改的，比如如果图片中噪点过强过大，需要对高斯滤波器大小变大，否则变小。当然过大的话可能会导致有的边缘检测不出来   
还有膨胀核大小，过大可能会导致线条过粗使得部分需要检测的图形被干扰  

**处理后的图：**  
![20221205162644](http://1308117710.vod2.myqcloud.com/eddbaa7fvodcq1308117710/b14135f4243791577507452902/f0.png)

### 轮廓线与识别

在这样一个处理后的二值图，我们可以找到这里面最大的一个四边形  
找到之前需要识别这里的所有封闭图形，采用轮廓线提取的方式

```cpp
std::vector<std::vector<cv::Point> > contours; // 轮廓线
std::vector<cv::Vec4i> hierarchy; // 轮廓线关系下标
cv::findContours(img, contours, hierarchy, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_SIMPLE);
```

注意到四边形它的逼近曲线也一定是四边形，所以我们扫描所有的轮廓线，对当前轮廓线构造一个逼近曲线，看看这个逼近曲线的点数是否为 $4$ ，如果是的话，说明当前这是一个四边形  
我们从这些四边形中找到最大的那个四边形即可  
当然有优化的地方就是我们可以提前考虑面积的下界，来取消识别一些轮廓线

```cpp
int maxArea = 0;
for (const std::vector<cv::Point> &contour : contours) {
    int area = cv::contourArea(contour); // 轮廓线面积
    if (area < 800 || area < maxArea) continue; // 设定扫描下界
    int peri = cv::arcLength(contour, true); // 轮廓线周长
    std::vector<cv::Point> approxCurve; // 相似多边形
    cv::approxPolyDP(contour, approxCurve, 0.02 * peri, true); // 逼近出相似多边形
    if (approxCurve.size() != 4) continue; // 多边形如果不是四边形，就不考虑了
  	// 维护最大四边形
    maxArea = area;
    biggestContour = contour;
}

// biggestContour 即为结果
```

我们用 `drawContours` 抠一下 `biggest` 内的部分看一下  
![20221205162842](http://1308117710.vod2.myqcloud.com/eddbaa7fvodcq1308117710/bab8cb1b243791577507870059/f0.png)  

成功了

### 透视矫正

我们可以将我们上面提取出来的 `biggest` 和一个 `w,h` ，将这个四边形轮廓透视到 `{0.0f, 0.0f}, {0.0f, h}, {w, 0.0f}, {w, h}`  
但在此之前我们要将这个四边形的四个点调整一下顺序  
分析一下我们透视到的四个点都有什么特征  

- `{0.0f, 0.0f}`：`x + y` 最小
- `{0.0f, h}`：`x - y` 最小
- `{w, 0.0f}`：`y - x` 最大
- `{w, h}`：`x + y` 最大

故我们对这四个点可以这样调整顺序即可

```cpp
// points 是原四点，newPoints 是新四点
std::vector<cv::Point> newContour;
std::vector<int> add, sub; // {x+y} {x-y}
for (const cv::Point &pt : contour) {
    add.push_back(pt.x + pt.y);
    sub.push_back(pt.x - pt.y);
}
// 按特上面说的特征依次插入
newContour.push_back(contour[std::min_element(add.begin(), add.end()) - add.begin()]);
newContour.push_back(contour[std::min_element(sub.begin(), sub.end()) - sub.begin()]);
newContour.push_back(contour[std::max_element(sub.begin(), sub.end()) - sub.begin()]);
newContour.push_back(contour[std::max_element(add.begin(), add.end()) - add.begin()]);
contour = newContour; 

// newContour 为结果
```

得到这四个点，我们将它们和我们的目标四点进行透视变换  

```cpp
// src 是源图像，{w = 420, h = 596}(A4纸)
cv::Point2f last[4] = {contour[0], contour[1], contour[2], contour[3]};
cv::Point2f aftr[4] = {{0.0f, 0.0f}, {0.0f, h}, {w, 0.0f}, {w, h}};
cv::Mat matrix = cv::getPerspectiveTransform(last, aftr);
cv::warpPerspective(src, dst, matrix, cv::Size(w, h));
 
// 此时 dst 为结果图像
```

### 最后
![20221205163042](http://1308117710.vod2.myqcloud.com/eddbaa7fvodcq1308117710/b8205184243791577507739829/f0.png)

完成



## 整体代码

```cpp
#include <bits/stdc++.h>
#include <opencv2/opencv.hpp>

// 图片预处理
void borderDetect (const cv::Mat &src, cv::Mat &dst); // 输入图像 src，输出图像 dst

// 轮廓线与识别
void contourDetect (const cv::Mat &src, std::vector<cv::Point> &biggestContour); // 输入图像 src，输出识别出来的四边形轮廓线 biggestContour

// 调整顺序
void reOrder (std::vector<cv::Point> &contour); // 对 contour 内的顺序进行调整后再传出来

// 透视变换
void perspectiveAdj (const cv::Mat &src, cv::Mat &dst, const std::vector<cv::Point> &contour, float w, float h); // src 变成一个 w*h 的矩形，四个角为原先的 contour 

int main () {
    cv::Mat img = cv::imread("/Users/snopzyz/CLionProjects/FileScan/Resources/paper.jpg");
    cv::Mat borderimg;
    borderDetect(img, borderimg);

    std::vector<cv::Point> biggestContour;
    contourDetect(borderimg, biggestContour);
    reOrder(biggestContour);
    perspectiveAdj(img, img, biggestContour, 420, 596);

    cv::imshow("img", img);
    cv::waitKey(0);
}




void borderDetect (const cv::Mat &src, cv::Mat &dst) {
    dst = src;
    cv::cvtColor(dst, dst, cv::COLOR_RGB2GRAY);
    cv::GaussianBlur(dst, dst, cv::Size(11, 11), 3, 0, cv::BORDER_DEFAULT);
    cv::Canny(dst, dst, 25, 75);
    cv::Mat kernel = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(2, 2));
    cv::dilate(dst, dst, kernel);
}

void contourDetect (const cv::Mat &src, std::vector<cv::Point> &biggestContour) {
    std::vector<std::vector<cv::Point>> contours;
    std::vector<cv::Vec4i> hierarchy;
    cv::findContours(src, contours, hierarchy, cv::RETR_TREE, cv::CHAIN_APPROX_NONE);

    int maxArea = 0;
    for (const std::vector<cv::Point> &contour : contours) {
        int area = cv::contourArea(contour);
        if (area < 800 || area < maxArea) continue;
        int peri = cv::arcLength(contour, true);
        std::vector<cv::Point> approxCurve;
        cv::approxPolyDP(contour, approxCurve, 0.02 * peri, true);
        if (approxCurve.size() != 4) continue;
        maxArea = area;
        biggestContour = contour;
    }
}

void reOrder (std::vector<cv::Point> &contour) {
    std::vector<cv::Point> newContour;
    std::vector<int> add, sub;
    for (const cv::Point &pt : contour) {
        add.push_back(pt.x + pt.y);
        sub.push_back(pt.x - pt.y);
    }
    newContour.push_back(contour[std::min_element(add.begin(), add.end()) - add.begin()]);
    newContour.push_back(contour[std::min_element(sub.begin(), sub.end()) - sub.begin()]);
    newContour.push_back(contour[std::max_element(sub.begin(), sub.end()) - sub.begin()]);
    newContour.push_back(contour[std::max_element(add.begin(), add.end()) - add.begin()]);
    contour = newContour;
}

void perspectiveAdj (const cv::Mat &src, cv::Mat &dst, const std::vector<cv::Point> &contour, float w, float h) {
    cv::Point2f last[4] = {contour[0], contour[1], contour[2], contour[3]};
    cv::Point2f aftr[4] = {{0.0f, 0.0f}, {0.0f, h}, {w, 0.0f}, {w, h}};
    cv::Mat matrix = cv::getPerspectiveTransform(last, aftr);
    cv::warpPerspective(src, dst, matrix, cv::Size(w, h));
}
```

