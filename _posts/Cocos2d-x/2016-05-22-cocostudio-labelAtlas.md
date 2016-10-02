---
layout: life
category : Programming Life
duoshuo: true
date: 2016-05-22
title: LabelAtlas标签的切割
---

	作者: MrZhong
	时间: 2016年5月22日
	版本: 0.0.1

-----------

之前有带符合的数字切割功能代码一直写的纠结迷糊，不得其髓，今天正式遇到这两个问题卡了很久，算是搞了个清楚，方才了然。

一、带符合的数字切割

![](/images/studyRes/18.png)


ui::LabelAtlas* moneyLabel = LabelAtlas::create("0",w,h,'/');

参数：w,h  每个图形字符的宽度宽高；
参数4：***startCharMap 首字符，决定了他的切割原理：要从图像文件中获取的第一个字符（其他的字符都以它为起点，因此，这个首字符的确定非常重要，其前面的字符将不会显示，从startCharMap开始按照这个顺序往下排，一格对应一个，程序是从这个首字符后往下切割）***
首字符实际上是对应ascii码表的。

![](/images/studyRes/19.jpg)


所以 不管“."号，还是任意字符’/’，‘X'等，实际上都是：
moneyLabel = LabelAtlas::create("10",w,h,'/');
而不是 ***moneyLabel = LabelAtlas::create("0",w,h,'.');,***
moneyLabel = LabelAtlas::create("0",w,h,'x');等
若要显示 12.34，是 moneyLabel = LabelAtlas::create("12/34",w,h,'/');,
而不是 moneyLabel = LabelAtlas::create("12.34",w,h,'.')；;,
moneyLabel = LabelAtlas::create("12.34",w,h,'/')；
如果图片是0123456789.

要显示12.34，正确代码为：
 moneyLabel = LabelAtlas::create("12：34",w,h,'0')；
由ascll码值 知道 9的下一个符号是"："0，所以要用”：;“才能获得到点".";,

**************

