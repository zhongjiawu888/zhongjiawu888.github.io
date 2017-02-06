---
layout: life
category : Other
duoshuo: true
date: 2016-10-04
title: github+jekyll博客搭建
---

	作者: MrZhong
	时间: 2010年10月4日
	版本: 0.0.1

-----------

# 一、github与jekyll

github是一个具有版本管理功能的代码仓库，每个项目都有一个主页，列出项目的源文件，github设计了Pages功能，允许用户自定义项目首页，用来替代默认的源码列表。所以，github Pages可以被认为是用户编写的、托管在github上的静态网页。github提供模板，允许站内生成网页，但也允许用户自己编写网页，然后上传。这种上传并不是单纯的上传，而是会经过Jekyll程序的再处理。

Jekyll是一个静态站点生成器，它会根据网页源码生成静态文件。它提供了模板、变量、插件等功能，所以实际上可以用来编写整个网站。


在本地编写符合Jekyll规范的网站源码，然后上传到github，由github生成并托管整个网站。
这种做法的好处是：

	免费，无限流量。
	享受git的版本管理功能，不用担心文章遗失。

你只要用自己喜欢的编辑器写文章就可以了，其他事情一概不用操心，都由github处理。
它的缺点是：
	
	有一定技术门槛，你必须要懂一点git和网页开发。
	它生成的是静态网页，添加动态功能必须使用外部服务，
	比如评论功能就只能用disqus。
	它不适合大型网站，因为没有用到数据库，每运行一次都
	必须遍历全部的文本文件，网站越大，生成时间越长。

# 二、环境搭建

1.在github 上 Create a new Repository,**注意 Repository name必须是username.github.io**

2.安装git.exe,生成SSH KEY,打开C:\Users\Administrator\.ssh\id_rsa.pub全选复制，在github上增加SSH key。

![](/images/studyRes/39.jpg)

3.jekylly 安装

下载了一个ruby git devkit工具包，运行setpath.cmd，并配置下系统环境

![](/images/studyRes/40.jpg)

命令行下输入ruby -v 检测是否安装成功：接下来运行

	ruby dk.rb install。


最后在cmd 窗口中，进入到username.github.io目录，输入命令开始安装 

		gem install Jekyll 

国内的网络环境需要耐心等待会儿，如果一直不行，求助于万能的淘宝，http://ruby.taobao.org/是淘宝搭建的ruby gems镜像。：

	~ $ gem sources --remove https://rubygems.org/
	~ $ gem sources -a https://ruby.taobao.org/
	~ $ gem sources -l
		*** CURRENT SOURCES ***
		https://ruby.taobao.org


2.clone代码：

	~ $ git clone https://github.com/username/username.github.io

	https://github.com/Mr-Zhong/zhongjiawu.github.io.git

进入到刚才clone的目录，写一个hello world，或者下载模版代码

	~ $ cd username.github.io
	~ $ echo "Hello World" > index.html
	~ $ git add --all
	~ $ git commit -m "Initial commit"
	~ $ git push -u origin master

3.浏览器里访问一下：http://username.github.io

4.如果是在本地测试开发，cmd命令窗口进入项目目录username.github.io中，运行

	jekyll build 编译会生成一个新目录文件夹_site
	jekyll server 启动本地服务器

最后浏览器里访问一下：http://localhost:4000

# 三、遇到的问题

	jekyll 3.2.1 | Error:  Only one usage of each
	socket address (protocol/network
	ddress/port) is normally permitted. - bind(2)
	这是因为4000端口号被占用，解决方法
	Cmd命令：
	netstat -ano，列出所有端口的情况 找到pid 4000
	tasklist|findstr "4000"，回车，查看是哪个进程或者程序
	占用了4000端口，结果是：svchost.exe
	打开任务管理，结束进程即可。


如果系统中有一些配置文件在服务器上做了配置修改,然后后续开发又新添加一些配置项的时候,

在发布这个配置文件的时候,会发生代码冲突:

error: Your local changes to the following files would be overwritten by merge:
        protected/config/main.php
Please, commit your changes or stash them before you can merge.

如果希望保留生产服务器上所做的改动,仅仅并入新配置项, 处理方法如下:

git stash
git pull
git stash pop
然后可以使用Git diff -w +文件名 来确认代码自动合并的情况.



反过来,如果希望用代码库中的文件完全覆盖本地工作版本. 方法如下:

git reset --hard
git pull
其中git reset是针对版本,如果想针对文件回退本地修改,使用

[plain] view plain copy 在CODE上查看代码片派生到我的代码片
git checkout HEAD file/to/restore


# 四，发布内容。

现在，这个简单的Blog就可以发布了。先把所有内容加入本地git库。

	　　$ git add .
	　　$ git commit -m "first post"

然后，前往github的网站，在网站上创建一个名为jekyll_demo的库。接着，再将本地内容推送到github上你刚创建的库。注意，下面命令中的username，要替换成你的username。

　　$ git remote add origin https://github.com/username/jekyll_demo.git
　　$ git push origin gh-pages

上传成功之后，等10分钟左右，访问http://username.github.com/jekyll_demo/就可以看到Blog已经生成了（将username换成你的用户名）。


# 五，绑定域名。

如果你不想用http://username.github.com/jekyll_demo/这个域名，可以换成自己的域名。
具体方法是在repo的根目录下面，新建一个名为CNAME的文本文件，里面写入你要绑定的域名，比如example.com或者xxx.example.com。
如果绑定的是顶级域名，则DNS要新建一条A记录，指向204.232.175.78。如果绑定的是二级域名，则DNS要新建一条CNAME记录，指向username.github.com（请将username换成你的用户名）。此外，别忘了将_config.yml文件中的baseurl改成根目录"/"。
至此，最简单的Blog就算搭建完成了。

# 六、参考文档

[http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html][1]

[http://jekyll.com.cn/][1]

[1]:http://www.ruanyifeng.com/blog/2012/08/blogging_with_jekyll.html

[2]:http://jekyll.com.cn/


**************

