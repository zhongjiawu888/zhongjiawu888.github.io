---
layout: life
category : Sdk Programming
duoshuo: true
date: 2016-08-11
title: android微信登录SDK接入笔记
---

	作者: MrZhong
	时间: 2016年8月11日
	版本: 0.0.1

-----------


从微信开发官网下载demo后，里面有自带一个签名key:debug.keystore，密码是:android，使用demo的签名包可以正常登录，分享到朋友圈发送数据，可供调试。官网文档也比较清楚。

 

 [官网开发文档链接](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419317851&token=&lang=zh_CN)


 移动应用微信登录是基于OAuth2.0协议标准构建的微信OAuth2.0授权登录系统。

## 一、基本流程：

> 1、首先需要注册微信开放平台，然后获取开发者认证。审批通过之后再创建一个移动应用同样还是需要审批。通过之后就可以给这个应用添加微信授权登陆以及相应功能了。这里移动应用审批通过之后会给你两个参数，一个叫AppId，一个叫Secret。这两个参数在后面用的到。

 
> 2、应用签名

 		![](/images/studyRes/1.jpg)

> 3、在需要微信授权的项目中导入微信的第三方JAR包

 
> 4、尤其注意在包名相应目录下新建一个wxapi目录。说的是在包名相应目录下建一个wxapi目录。也就是是包名目录的子目录，千万不要直接在src下面建个包就完了。

 ![](/images/studyRes/2.jpg)
 
## 二、关于第三方登录

 
[参考文档链接](http://wiki.mob.com/%e7%ac%ac%e4%b8%89%e6%96%b9%e7%99%bb%e5%bd%95/)

 
1、第三方登录的定义

> 1.所谓的第三方登录，就是利用用户在第三方平台上已有的账号来快速完成自己应用的登录或者注册的功能。而这里的第三方平台，一般是已经有大量用户的平台，如国内的新浪微博、QQ空间，微信，外国的Facebook、twitter等等。第三方登录不是一个具体的接口，而是一种思想或者一套步骤。
要实现第三方登录，首先你需要选择一个第三方平台。新浪微博和QQ空间都是好的选择，这些平台拥有大量的用户，而且还开放了API，供我们调用接入。

>2、具备获取用户资料或至少可以进行授权验证,其实ShareSDK已经支持了超过20种这样子的平台，完全足够你选择使用。

2、第三方登录实现方法

>选择好平台以后，现在思考下面的问题：
你的应用是否具备独立账户系统？
这个问题是第三方登录时接口选择的重要标准。如果你选择“是”，则意味着你的应用只是需要第三方平台的用户，而不是他们的账户验证功能——也就是“要数据，不要功能”。而如果你选择“否”，则表示你实际上是’“要功能，不要数据（用户）”’。对于ShareSDK来说，前者你的入口方法是showUser(null)，而后者是authorize()。那么下面我分情况解释两种接入方式的步骤。

要数据，不要功能
如果你的应用拥有用户系统，就是说你的应用自己就有注册和登录功能，使用第三方登录只是为了拥有更多用户，那么你可以依照下面的步骤来做：

 1、用户触发第三方登录事件

 2、showUser(null)请求授权用户的资料（这个过程中可能涉及授权操作）

 3、如果onComplete()方法被回调，> 将其参数Hashmap代入你应用的Login流程

 4、否则提示错误，调用removeAccount()方法，删除可能的授权缓存数据

 5、Login时客户端发送用户资料中的用户ID给服务端

 6、服务端判定用户是已注册用户，则引导用户进入系统，否则返回特定错误码

 7、客户端收到“未注册用户”错误码以后，代入用户资料到你应用的Register流程

 8、Register时在用户资料中挑选你应用的注册所需字段，并提交服务端注册

 9、服务端完成用户注册，成功则反馈客户端引导用户进入系统

 10、否则提示错误，调用removeAccount()方法，删除可能的授权缓存数据

要功能，不要数据,如果你的应用不具备用户系统，而且也不打算维护这个系统，那么你可以依照下面的步骤来做：

1、用户触发第三方登录事件

2、调用platfor> m.getDb().getUserId()请求用户在此平台上的ID

3、如果用户ID存> 在，则认为用户是合法用户，允许进入系统；否则调用authorize()

4、authorize()方> 法将引导用户在授权页面输入帐号密码，然后目标平台将验证此用户

5、如果onComplete(> )方法被回调，表示授权成功，引导用户进入系统

6、否则提示错误，调用> removeAccount()方法，删除可能的授权缓存数据
 
实例代码

```sh
	private void authorize(Platform plat) {
	if (plat == null) {
	popupOthers();
	return;
	}

	if(plat.isValid()) {

	String userId = plat.getDb().getUserId();

	if (userId != null) {

	UIHandler.sendEmptyMessage(MSG_USERID_FOUND, this);

	login(plat.getName(), userId, null);

	return;

	}

	}

	plat.setPlatformActionListener(this);

	// true不使用SSO授权，false使用SSO授权

	plat.SSOSetting(true);

	plat.showUser(null);

	}
```
上面的代码是当用户触发第三方登录按钮的时候的处理。plat.isValid()判断指定平台是否已经完成授权，如果已经完成授
权，ShareSDK的用户数据库应该已经存在userId，因此代码尝试获取userId，如果得到的为null，当作为授权，否则用此ID来执行登
录。如果此平台没有完成授权，则调用plat.showUser(null)方法来获取用户资料。

获取用户资料以后，并不能立刻用来注册，因为可能只是因为授权时间太久导致AccessToken过期，因此完成授权以后需要先将userId发送给你应用的服务端进行检查，如果服务端发现确实没有注册过，才引导客户端进入注册页面。

 
[Demo项目下载地址（提取码：61d4）](http://yunpan.cn/c6DkA88RrRMPV )


**************

