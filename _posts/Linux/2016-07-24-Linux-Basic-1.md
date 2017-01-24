---
layout: life
category : Linux
duoshuo: true
date: 2016-07-24
title: Linux基础一
---

	作者: MrZhong
	时间: 2016年7月24日
	版本: 0.0.1

-----------


# 一、Linux的发展

x86架构
c语言
gcc
GNU计划
多任务，多使用者
a.网络服务器 www Mail Server File Server
b.较低硬件资源 ,前调省电
c.关键任务的应用，金融数据库，大型企业网络环境
d.嵌入式系统

# 二、磁盘

1.磁盘的连接方式
A.主机提供2个IDE介面，一个IDE排线连接2个IDE装置
B.这2个IDE介面通常称为IDE1(primary)和IDE2(secondary)，每条排线上面的IDE装置可以被区分为Master与Slave

![](/images/studyRes/4.jpg)

![](/images/studyRes/5.jpg)

2.IDE装置档名

![](/images/studyRes/6.jpg)

e.g
假设你的主机仅有一颗IDE介面的磁碟，而这一颗磁碟接在IDE2的Master上面，请问他在Linux操作系统里面的装置档名为何？
答：比较上表的装置档名对照，IDE2的Master之装置档名为/dev/hdc

3.磁盘分区

![](/images/studyRes/7.jpg)

A.磁盘的第一个磁区记录了2个重要的信息

a.Master Boot Record(MBR):主要启动记录区，可以安装启动管理程序的地方，有446 byte
b.partion table:分割表，记录整颗硬盘分割的状态，有64 byte.

B.磁盘分区表

![](/images/studyRes/8.jpg)

a.在分割表所在的64 byte容量中，总共分为4组记录区，每组记录区记录了该区段的起始和结束磁柱号码。

b.这4个记录区被称为主要（Primary)或延伸（Extended)分割槽。

c.默认的分割表仅能写入4组分割资讯.

d.分割槽的最小单位为磁柱（cylinder)

4、主要分割槽、延伸分割槽、逻辑分割槽

a.主要分割与延伸分配最多可以有4组（硬盘的限制）
b.延伸分割最多只能有一个（操作系统的限制）
c.逻辑分割槽是由延伸分割槽持续分割出来的分割槽
d.延伸分割槽无法格式化,主要分割槽和逻辑分割槽作为数据存取。
e.逻辑分割的数量依据操作系统而不同，在Linux系统中，IDE硬盘最多有59个逻辑分割（5号到63号），STATE硬盘则有11个逻辑分割（5号到15号）

4、MBR与启动流程

A.BIOS与CMOS
a.CMOS是记录各项硬件参数且嵌入在主板上的存储器
b.BIOS是一个写入到主板上的一个软件程序，计算机系统启动的时候主动运行的第一个程序。
c.BIOS会依据使用者的配置去取得能够启动的硬盘， 并且到该硬盘里面去读取第一个磁区的MBR位置。 MBR这个仅有446 bytes的硬盘容量里面会放置最基本的启动管理程序， 此时BIOS就功成圆满，而接下来就是MBR内的启动管理程序的工作了。
d.这个启动管理程序的目的是在加载(load)核心文件， 由於启动管理程序是操作系统在安装的时候所提供的，所以他会认识硬盘内的文件系统格式，因此就能够读取核心文件， 然后接下来就是核心文件的工作，启动管理程序也功成圆满，之后就是大家所知道的操作系统的任务啦！

简单描述为：
a.BIOS:启动主动运行的程序，会识别第一个可启动的装置
b.MBR:第一个可启动装置的第一个磁区内的主要启动记录区块，内含启动管理程序
e.boot loader:一个可读取核心文件来运行的软件
d.核心文件：开始操作系统的功能。。。

B.Boot Loader
a.提供菜单
b.加载核心文件
c.转交其他loader

C.
a.每个分割槽都拥有自己的启动磁区（boot sector)
b.实际可启动的核心文件是放置到各分割槽内的
c.loader只会认识自己的系统槽内的可启动核心文件，以及其他loader而已
d.loader可直接指向或间接将管理权转交给另一个管理程序。

5、目录结构

A.树结构

![](/images/studyRes/9.jpg)

B.挂载

![](/images/studyRes/10.jpg)

# 三、文本命令

1.登陆

A.[guest-I4hw4r@ubuntu:~$]

a.guset-I4hw4r:目前用户的账号
b.ubuntu:主机名，只取一个小数点前的字母（实际是ubuntu.xxx.xxx）
c.~:目前所在的目录（家目录），是一个变量，例：root的家目录是/root,所以~代表/root

B.bc 计算器
a.保留小数位数：scale=3

C.时间日期 
a.date
b cal [month] [year]

![](/images/studyRes/11.jpg)

D.数据同步写入磁盘：sync

a.一般账号用户所升级的硬盘数据就仅有自己的数据， 不像root可以升级整个系统中的数据

E.关机

a. shutdown -h now 立刻关机
b. shutdown -h 20:30 在20：30关机，若今天时间已过，则隔天关机
c. shutdown -h +10 系统10分钟后自动关机
d. shutdown -r now 重启
e. shutdown - r +30 'The system will reboot' 系统30分后重启，并显示后面的信息给所有在线的使用者

F.求助
A.
a. man date
b.man -f man 查找系统中哪些跟man命令有关说明文件
c.man -k man
查找系统中说明文件中只要man这个关键词就列出来

B.在线求助 info

![](/images/studyRes/12.jpg)

a.info info

G.语系的支持
a.echo $LANG 显示目前支持的语系
b LANG=en-US

# 四、文件权限与目录配置

文件权限

A.10个字符的意义

a.

![](/images/studyRes/13.ppg)

![](/images/studyRes/14.jpg)

.第一个字符代表【目录、文件或链接文件】
eg.
d：表示目录
-：表示文件
l：表示连接档
b：表示装置文件里面的可供存储的接口设备
c：表示装置文件里面的串行端口设备，例如键盘、鼠标

c.剩下的9个字符，以3个为一组

![](/images/studyRes/15.jpg)

eg.
第一组表示【文件拥有者的权限】
第二组表示【同群组的权限】
第三组表示【其他非本群组权限】


2、修改文件权限

a.chgrp :改变文件所属群组
chgrg [-R] dirname/filename
-R:目录内所有文件

![](/images/studyRes/16.png)

b.chown:改变文件拥有者

![](/images/studyRes/17.png)

c.chmod:改变文件的权限，SUID,SGID,SBIT等特性
r:4
w:2
x:1
owner = rwx = 4+2+1=7

eg.
chmod 777 test
若要修改test权限变成[-rwxr-xr--],则
[4+2+1][4+0+1][4+0+0]即
chomd 754 test



**************

