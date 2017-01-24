---
layout: life
category : Linux
duoshuo: true
date: 2016-08-01
title: Linux基础二
---

	作者: MrZhong
	时间: 2016年8月1日
	版本: 0.0.1

-----------


# 五、目录与路径

1、特殊目录

.   此层目录
..  上一层目录
-   前一个工作目录
~   【目前使用者身份】所在的家目录
~account    代表account这个使用者的家目录


2、目录相关操作

A.  cd :change director
B.  pwd [-P]: print working directory 
显示目前的目录

pwd 显示的是实际de工作目录，-P显示出确实的路径，而非使用连接路径

C.  mkdir 创建一个新的目录

mkdir [-m] 配置文件的权限
e.g. 创建权限为 rwx--x--x的test目录
mkdir -m 711 test

mkdir [-p] 将所需要的目录递回创建(多层目录的创建)
e.g. 
mkdir test1/test2/test3

D.  rmdir 删除一个空的目录

rmdir [-p] 连同上一级空的目录一起删除

E.mv 移动

3、检查文件的内容（读档）

cat
tac
nl
more
less
head
tail
od

4、文件记录的时间参数3种
access time(atime)
status time(ctime)
modification time(mtime)

5、
a.新建文件/目录时，新文件的默认权限使用 umask 来规范。默认目录完全权限为drwxrwxrwx， 文件则为-rw-rw-rw-。
b.文件具有SUID的特殊权限时，代表当使用者运行此一binary程序时，在运行过程中使用者会暂时具有程序拥有者的权限
c.文件目录具有SGID的特殊权限时，代表使用者在这个目录底下新建的文件之群组都会与该目录的群组名称相同。
d.目录具有SBIT的特殊权限时，代表在该目录下使用者创建的文件只有自己与root能够删除！


# 六、文件系统

1、文件压缩

a.gzip zcat


b.bzip2 bzcat

2、打包命令
tar

# 七、Bash

a.由于核心在内存中是受保护的区块，因此必须要透过[Shell]将输入的命令与 Kernel 沟通，好让 Kernel 可以控制硬件来正确无误的工作

b.文字接口的 shell 在各大 distribution 都一样；远程管理时文字接口速度较快； shell 是管理 Linux 系统非常重要的一环，因为 Linux 内很多控制都是以 shell 撰写的。

c.系统合法的 shell 均写在 /etc/shells 文件中

d.用户默认登陆取得的 shell 记录于 /etc/passwd 的最后一个字段

e.bash 的功能主要有：命令编修能力；命令与文件补全功能；命令别名配置功能；工作控制、前景背景控制；程序化脚本；通配符

f.变量主要有环境变量与自定义变量，或称为全局变量与局部变量

g.bash 的配置文件主要分为 login shell 与 non-login shell。login shell 主要读取 /etc/profile 与 ~/.bash_profile， non-login shell 则仅读取 ~/.bashrc

# 八、Shell Scripts

shell script 是利用 shell 的功能所写的一个『程序 (program)』，这个程序是使用纯文字档，将一些 shell 的语法与命令(含外部命令)写在里面， 搭配正规表示法、管线命令与数据流重导向等功能，以达到我们所想要的处理目的

**************

