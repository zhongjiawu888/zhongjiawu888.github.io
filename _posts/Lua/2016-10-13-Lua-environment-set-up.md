---
layout: life
category : Lua
duoshuo: true
date: 2016-10-13
title: Lua项目
---

	作者: MrZhong
	时间: 2016年10月13日
	版本: 0.0.1

-----------

# 一、Cocos2d-x 3.12 PC环境搭建和创建工程 

下载Cocos2d-x引擎后，需要配置下面四个环境变量：
 
* •COCOS_CONSOLE_ROOT: 
cocos控制台路径，用于新建、构建和发行工程。
* •NDK_ROOT:NDK根目录
* •ANDROID_SDK_ROOT:  SDK根目录
* •ANT_ROOT:  ANT根目录

这些变量可以通过引擎根目录的setup.py来配置，打开引擎根目录，运行setup.py，一步步输入下面路径：
 
        ->COCOS_CONSOLE_ROOT : 
        F:\Cocos2d-x\tools\cocos2d-console\bin
         ->NDK_ROOT : F:\Android\android-ndk-r9b
         ->ANDROID_SDK_ROOT :  F:\Android\sdk
         ->ANT_ROOT :  F:\Android\ant\bin
 

配置好之后就可以在环境变量看到添加了这些NDK_ROOT等路径

使用cocos2d-console这个工具来创建和构建工程，这个工具提供了下面几个功能：
 
* •new 创建一个新的工程
* •compile 编译当前工程，生成二进制文件
* •deploy 发布程序到一个平台
* •run 编译和发布，和运行程序


**************

