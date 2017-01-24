---
layout: life
category : Functions
duoshuo: true
date: 2016-12-07
title: C++调用Android应用集合
---

    作者: MrZhong
    时间: 2016年12月07日
    版本: 0.0.1

-----------

一、拨打电话

1.c++ 调用 Java

    string PlatformAndroid::onCallPhone()
    {
        std::string str = "";

    #if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

        JniMethodInfo t;
        jstring i;
        if (JniHelper::getStaticMethodInfo(t,
            ANDROID_PACKAGE_NAME,
            "onCallPhone",
            "()Ljava/lang/String;"))
        {
            i = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID);
            str = JniHelper::jstring2string(i);
            t.env->DeleteLocalRef(t.classID);
        }
    #endif
        return str;
    }

2.java 代码实现

	（1）声明
		public final static int HANDLER_GOTO_PHONENUM = 101;//
		public static Handler mWXHandler = null;
		public static Activity m_pkActInstance; = null;
	 （2）实现
		在主activity的onCreate方法中监听handle

		mWXHandler = new Handler(getMainLooper()) {
			public void handleMessage(Message msg) {
				switch (msg.what) {
				case HANDLER_GOTO_PHONENUM:{
					Intent intent = new Intent(Intent.ACTION_CALL,Uri.parse("tel:400-006-6363"));  
					m_pkActInstance.startActivity(intent);          
					break;
				}

    定义方法 onCallPhone()

    public static String onCallPhone()
    {
        
        Message msg = new Message(); 
         msg.what = HANDLER_GOTO_PHONENUM; 
         mWXHandler.sendMessage(msg);   
        return "";
    }   



二、调用手机默然浏览器
  
    public static String openBrowser()
    {
         Intent intent = new Intent();
         intent.setAction("android.intent.action.VIEW");
         Uri content_url = Uri.parse("http://www.baidu.com");
         intent.setData(content_url);
         m_pkActInstance.startActivity(intent);
        return "";
    } 