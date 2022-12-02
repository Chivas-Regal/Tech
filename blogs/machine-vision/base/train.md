---
title: 训练与分类
---

## 级联分类器

`type: CascadeClassifier`  
训练出多个分类器，强强联手，最终形成正确率很高的级联分类器   

### 检测方式

$Haar$ 算法对图片多区域、多尺度检测  

- 多区域：对图片分块，然后全部进行检测
- 多尺度：不断初始化搜索窗口的 `size` 进行检测，从小窗口涌动判定人脸中提取出的特征是否能够满足所有训练好的强分类器的检测，不断扩大，在重复检测相同人脸时进行区域合并

会输出很多的子窗口，在筛选式级联分类器下不断被每个检点筛选（抛弃/通过）  

#### 检测函数

```cpp
cv::detectMultiScale (
    const Mat &image,
    vector& objects,
    double scaleFactor = 1.1,
    int minNeighbors,
    int flag,
    cvSize
)
```

#### 参数分析

- `image`：输入的灰度图像
- `objects`：得到的被检测物体的矩形框向量组
- `sdcaleFactor`：尺度参数，决定两个不同大小的窗口扫描之间有多大跳跃。设置过大可以减少计算时间，但可能会错过某个大小的人脸。
- `minNeighbors`：每个级联举行应保留的临近个数，默认为 $3$ 意味着至少三次重叠检测才可以认为人脸存在。
- `flags`：
    - `CV_HAAR_DO_CANNY_PRUNING`：分类器跳过平滑区域
    - `CV_HAAR_SCALE_IMAGE`：不缩放分类器，而是缩放图像
    - `CV_HAAR_FIND_BIGGEST_OBJECTS`：返回最大目标
    - `CV_HAAR_DO_ROUGH_SEARCH`：在任何窗口发现第一个候选者就结束寻找
- `cvSize()`：寻找人脸的最小区域。



### 训练加载

声明级联分类器并用 $opencv$ 内置的训练内容加载   

```cpp
cv::CascadeClassifier cascade;
cascade.load("/.../opencv-4.5.0/data/haarcascades/haarcascade_frontalface_alt.xml");
```  
  
也可以直接  
  
```cpp
cv::CascadeClassifier cascade = cv::CascadeClassifier("/.../opencv-4.5.0/data/haarcascades/haarcascade_frontalface_alt.xml");
```

