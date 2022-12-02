---
title: 人脸识别
---

## 思路

首先使用分类器对 `opencv` 内置的训练集进行分类训练  
然后打开摄像头，对每一帧作为图像进行处理  
使用训练好的分类器将在图像内识别到的人脸的矩形向量存放到 `vector<Rect>` 内  
将 `vector<Rect>` 内的每一个矩形向量提出，用其大小和坐标绘画出一个圆，即可圈出来(图像 $\to$ 视频)中的人脸

## 程序

```cpp
# include <iostream>
# include <opencv2/opencv.hpp>

void detectFace (
    cv::Mat &img, // 作画图像
    cv::CascadeClassifier &cascade, // 分类器
    double scale // 缩放大小
);

int main () {
    cv::VideoCapture capture(0);
    if (!capture.isOpened()) {
        std::cout << "Error: can't open the camera!" << std::endl;
        return -1;
    }

    // 初始化级联分类器
    cv::CascadeClassifier cascade = cv::CascadeClassifier("/<opencv安装地址>/opencv-4.5.0/data/haarcascades/haarcascade_frontalface_alt.xml");

    while (1) {
        cv::Mat frame; capture >> frame;

        // 缩放图像方便处理
        double scale = 1.2;
        cv::Mat smallImg(frame.rows / scale, frame.cols / scale, CV_8UC1);
        cv::resize(frame, frame, smallImg.size(),0,0,cv::INTER_LINEAR);

        detectFace(frame, cascade, 2);

        int key = cv::waitKey(10);
        if (key == 'q' || key == 'Q') break;
    }
    return 0;
}

void detectFace (
        cv::Mat &img,
        cv::CascadeClassifier &cascade,
        double scale
    ) {

    // 人脸向量
    std::vector<cv::Rect> faces;

    cv::Mat gray, smallImg(cvRound(img.rows / scale), cvRound(img.cols / scale), CV_8UC1);
    cv::cvtColor(img, gray, cv::COLOR_BGR2GRAY); // 灰度化到 gray
    cv::resize(gray, smallImg, smallImg.size(), 0, 0, cv::INTER_LINEAR); // 缩放到 smallImg
    cv::equalizeHist(smallImg, smallImg); // 直方图均质化 smallImg （可以视作增加对比度

    // 识别 smallImg 后放到 faces 里面
    cascade.detectMultiScale(smallImg, faces, 1.1, 5, cv::CASCADE_SCALE_IMAGE, cv::Size(30, 30));

    // 圆圈颜色
    const static cv::Scalar colors[] = {
        CV_RGB(0, 0, 255),
        CV_RGB(0, 128, 255),
        CV_RGB(0, 255, 255),
        CV_RGB(0, 255, 0),
        CV_RGB(0, 255, 128),
        CV_RGB(255, 0, 0),
        CV_RGB(255, 128, 0),
        CV_RGB(255, 255, 0)
    };
    int color_idx = 0;
    // 在识别到的人脸一圈画圆
    for (const cv::Rect &it : faces) {
        double aspect_ratio = (double)it.width / it.height;
        if (0.75 < aspect_ratio && aspect_ratio < 1.3) {
            cv::Point center = cv::Point(cvRound((it.x + it.width * 0.5) * scale), cvRound((it.y + it.height * 0.5) * scale));
            int radius = cvRound((it.width + it.height) * 0.25 * scale);
            cv::circle(img, center, radius, colors[(color_idx ++) % 8], 3, 8, 0);
        } else {
            cv::Point p1 = cv::Point(cvRound(it.x * scale), cvRound(it.y * scale));
            cv::Point p2 = cv::Point(cvRound((it.x + it.width - 1) * scale), cvRound((it.y + it.height - 1) * scale));
            cv::rectangle(img, p1, p2, colors[(color_idx ++) % 8], 3, 8, 0);
        }
    }

     cv::imshow("result", img);
}
```