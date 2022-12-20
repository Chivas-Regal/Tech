---
title: 图像操作
---

## 视频的生成

视频是由一帧一帧的图像构成  
首先打开默认摄像头 `VideoCapture cap(0);`   
然后使用循环对帧进行读取和打印  

```cpp
cv::Mat frame;
while (true) {
  	cap >> frame;
  	cv::imshow("output", frame); // 显示图像
}
```

## 画圆函数

### 函数原型

```cpp
cvCircle (
	cv::Mat img,
  cvPoint center,
  int radius,
  cvScalar color,
  int thickness = 1,
  int lineType = 8,
  int shift = 0
)
```

### 参数分析

- `img`：源图像
- `center`：圆心坐标
- `radius`：圆半径
- `color`：圆的颜色
- `thickness`：正数表示线条粗细程度，负数表示圆是否被填充
- `line_type`：线条类型
    - $8$ 联通线条<br>![](https://gss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/d043ad4bd11373f05ada557ba30f4bfbfaed0468.jpg)
    - $4$ 联通线条<br>![](https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=9ebd7e55870a19d8cb568c0303caaeb3/64380cd7912397ddf346bfe05e82b2b7d0a28712.jpg)
- `shift`：圆心点坐标与小数点位数

## 膨胀函数

使用像素邻域内的局部极大运算符来膨胀一张图片

```cpp
void cv::dilate (
	cv::InputArray src, // 源图像，通道数量任意，但是深度必须是 CV_8U,CV_16U,CV_16S,CV_32F,CV_64F 其中之一
  cv::OutputArray dst, // 目标图像，类型、尺寸必须与 src 相同  
  cv::InputArray kernel, // 膨胀核，NULL 表示中旬 3*3 的核
  cv::Point anchor = cv::Point(-1, -1), // 锚的位置，(-1,-1)默认为中心
  int iterations = 1, // 迭代使用 erode() 的次数
  int borderType = cv::BORDER_CONSTANT, // 推断图像外部像素的某种边界模式
  const cv::Scalar &borderValue = cv::morphologyDefaultBorderValue() // 一般不管
)
```

## 滤波器

是对图像进行平滑处理（也称模糊处理）的工具  
可以有效减少图像中的噪声  

### 线性滤波器

```cpp
void cv::blur (
  const cv::Mat &src, // 源图像
  cv::Mat &dst, // 目标图像
  cv::Size ksize, // 滤波器大小
  cv::Point anchor = cv::Point(-1, -1), // 锚点，可省略
  int borderType = BORDER_DEFAULT // 推断边缘像素，可省略
);
```

### 高斯滤波

```cpp
void cv::GaussianBlur (
	const cv::Mat &src,
  cv::Mat &dst,
  cv::Size ksize,
 	double sigmaX, // x方向的标准差，0为系统自动计算
  double sigmaY, // y方向的标准差，0为系统自动计算
  int borderType = BORDER_DEFAULT
)
```

这里说明一下 `ksize` 这个东西，首先其两个坐标的大小都必须是奇数，比如 $3\times 3$ 、$5\times 5$ 这类，这样才能在这个滤波器内找到中心点  


## 空间滤波

### 滤波过程

就是在滤波器大小内，求一下每一个数值的平均，设为中心点的数值

对所有滤波器大小的子矩阵逐个扫描，最后得到所有位置的数值，就是滤波结束的图像

### 相关、卷积

- 相关：和上述滤波过程一样，滤波核逐个扫描，计算像素点点积
- 卷积：虽然也是逐个扫描求点积，但是要先将滤波核旋转 $180^{\circ}$  



## 轮廓线

### 提取轮廓线

```cpp
void findContours (
  cv::Mat image,
  std::vector<std::vector<cv::Point>> &contours, 
  std::vector<cv::Vec4i> &hierarchy, 
  int mode, 
  int method, 
  cv::Point offset = Point()
);
```

- `image`：提取轮廓的图像，可以是灰度图，但更常见的是二值图（经过边缘检测算子处理过的图像）
- `contours`：提取出的轮廓，存放多个向量，子向量存放了一个轮廓的点集，父向量为所有的轮廓
- `hierarchy`：存放了多个 `vector<int, 4>` ，`[0]` 存放的上一个轮廓的索引，`[1]` 存放下一个轮廓的索引，`[2]` 存放父轮廓索引，`[3]` 存放嵌套轮廓索引
- `mode` 轮廓检测模式
  - `CV_RETR_EXTERNAL` 只检测最外围轮廓
  - `CV_RETR_LIST` 检测所有轮廓，但**彼此独立** ，不存在父子轮廓
  - `CV_RETR_CCOMP` 检测所有轮廓，并建立**两个等级**，所有内部轮廓只属于顶层轮廓
  - `CV_RETR_TREE` 检测所有轮廓，并建立一棵**等级树**，有完整的父子关系
- `method` 轮廓近似方法
  - `CV_CHAIN_APPROX_NONE` 轮廓所有连续点均传入
  - `CV_CHAIN_APPROX_SIMPLE` 仅保存轮廓拐点
- `offset` 轮廓的偏移量

### 绘制轮廓线

```cpp
void cv::drawContours (
	cv::Mat &src,
  const std::vector<std::vector<cv::Point>> &contours,
  const int contoursidx,
	const Scalar_<double> &color
  int thickness = 1,
  int lineType = LINE_8
)
```

- `src` 源图像
- `contours` 所有提取出的轮廓线的集合
- `contoursidx` 第几条轮廓线，表示 `contours[contoursidx]`
- `color` 绘制颜色
- `thickness` 绘制线条粗细，负数表示内部填充
- `lineType` [线条类型](数据类型##线条类型)

### 轮廓线长度

```cpp
float cv::arcLength (
	const std::vector<cv::Point> &contour, 
  bool closed
)
```

- `contour` 轮廓线
- `closed` 是否封闭

### 封闭轮廓线面积

```cpp
int cv::contourArea (
	const std::vector<cv::Point> &contour
)
```

- `contour` 轮廓线

## 逼近曲线

```cpp
void cv::approxPolyDP (
  const std::vector<std::vector<cv::Point> > &curve,
  std::vector<cv::Point> &approxCurve,
  double epslion,
  bool closed
);
```

- `curve` 一条轮廓线
- `approxCurve` 生成的近似多边形的顶点
- `epslion` 逼近精度，即原曲线和近似曲线的最大距离
- `closed` 若为真，说明曲线封闭，否则不封闭

## 透视变换

### 由四点计算透视

```cpp
cv::Mat cv::getPerspectiveTransform (
	cv::Point2f* src, 
  cv::Point2f* dst
)
```

- `src` 原先四点
- `dst` 目标四点

### 图像变换

```cpp
void cv::warpPerspective(
  const cv::Mat &src, 
  cv::Mat &dst, 
  const cv::Mat &M, 
  cv::Size dsize, 
  int flags = INTER_LINEAR, 
  int borderMode = BORDER_CONSTANT, 
  const Scalar& borderValue = Scalar()
)
```

- `src` 源图像
- `dst` 目标图像
- `M` 透视变换矩阵
- `dsize` 目标图像的大小
- `flags` 目标图像的插值方式
- `borderMode` 图像边界处理方式
- `borderValue` 边界颜色