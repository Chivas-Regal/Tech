---
title: 关键点的捕捉
---

## 捕捉作用

给一个可以抠取部分矩阵的首帧并将其抠出  
对每个帧用图像处理（饱和度和色高）处理成特征图像（直方图）  
在总图像中寻找该特征图像——可旋转、可倾斜  

## 捕捉步骤

### 图像处理
  
灰度化图像  
在原图上高斯模糊一次为 `result1` ，在 `result1` 上模糊第二次为 `result2` ，计算矩阵差值得到 `dif`  
将差值归一化（以便观察到哪些地方有差值）  

::: tip 缩小与旋转怎么办
有一定的东西是不变的  

- 缩小：固定占比
- 旋转：对点乘上角度基本可以匹配上（允许误差的存在）

所有点的话数量太大效率太低，于是使用 **关键点**  
:::

关键点为每一个曲线中的两个端点和拐点，这样在提取出来的特征矩阵中特征点较少，提高了灵活匹配性与准确度  


### 程序

```cpp
# include <iostream>
# include <vector>
# include "opencv2/opencv.hpp"
# include "opencv2/core/core.hpp"
# include "opencv2/features2d/features2d.hpp"
# include "opencv2/highgui/highgui.hpp"

# pragma comment(lib, "opencv_core249d.lib")
# pragma comment(lib, "opencv_highgui249d.lib")
# pragma comment(lib, "opencv_imgproc249d.lib")
# pragma comment(lib, "opencv_features2d249d.lib")
# pragma comment(lib, "opencv_nonfree249d.lib")

int main () {
    cv::namedWindow("in", cv::WINDOW_AUTOSIZE);
    cv::namedWindow("out1", cv::WINDOW_AUTOSIZE);
    cv::namedWindow("out2", cv::WINDOW_AUTOSIZE);
    cv::namedWindow("out3", cv::WINDOW_AUTOSIZE);

    cv::Mat img = cv::imread("/Users/snopzyz/Desktop/opencvtest.jpg");
    cv::imshow("in", img);

    cv::Mat gray, out1, out2, dog;
    cv::cvtColor(img, gray, cv::COLOR_BGR2GRAY);
    cv::GaussianBlur(gray, out1, cv::Size(7, 7), 0, 0);
    cv::GaussianBlur(out1, out2, cv::Size(7, 7), 0, 0);
    cv::subtract(out1, out2, dog);
    cv::normalize(dog, dog, 255, 0, cv::NORM_MINMAX);

    cv::imshow("out1", out1);
    cv::imshow("out2", out2);
    cv::imshow("out3", dog);

    cv::Ptr<cv::SiftFeatureDetector> feature = cv::SiftFeatureDetector ::create();
    std::vector<cv::KeyPoint> kp;
    try {
        feature->detect(gray, kp);
        std::cout << kp.size();
    } catch (cv::Exception &e) {
        std::cout << e.msg << std::endl;
    }
    cv::drawKeypoints(gray, kp, img);
    cv::imshow("key-point", img);
    kp.clear();
    cv::waitKey(0);
    cv::destroyAllWindows();
}
```

![20221202234022](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221202234022.png)  
(将图片放大，会看到右下角的图有很多彩色小圈圈，就是关键点)

## 检测思考

从小的往大的走，对于一个尺寸下：
首先从一个地方开始移动矩形框，在路线中匹配度不断升高，而部分进入识别的正确区域时匹配度会升高较快，也就是在移动中不断锁定识别的正确区域
而每次对每一个帧查找完成之后，下一次将会优先搜索这个帧附近的区域，毕竟现实移动也是在这个查找成功的区域内移动  
故在移动较快时会产生脱焦的情况  