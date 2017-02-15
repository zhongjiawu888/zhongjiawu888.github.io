---
layout: life
category : Lua
duoshuo: true
date: 2017-02-15
title: cocos2d-x lua绑定自定义的c++类
---

	作者: MrZhong
	时间: 2017-02-15
	版本: 0.0.1

-----------
一、开发环境 cocos2d-x-3.1.2，进入cocos2d-x-3.12\tools\tolua，按照README.mddown安装环境 其中PYTHON_BIN 设置C:\Python27\python.exe

android-ndk 我这里用的是 android-ndk-r9d


二、步骤


把要绑定的c++类GameConf.h和GameConf.cpp 放在 cocos2d-x-3.12\cocos 路径 下


进入cocos2d-x-3.12\tools\tolua，拷贝一个 cocos2dx_spine.ini，命名buyu_gameConf.ini 修改以下5个：

    1.第一行 [buyu_gameConf]

    2.prefix = buyu_gameConf

    3.target_namespace = buyu

    4.headers = %(cocosdir)s/cocos/GameConf.h

    5.skip = 
    
    
接着拷贝genbindings.py,命名buyu_gameConf.py修改

        cmd_args = {
					'buyu_gameConf.ini' : ('buyu_gameConf', 'lua_buyu_gameConf_auto'), \
        }
        
        
运行 buyu_gameConf.py

出现 Generating lua bindings succeeds.则绑定成功,输出目录为 cocos2d-x-3.12\cocos\scripting\lua-bindings\auto
