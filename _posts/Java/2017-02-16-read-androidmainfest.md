---
layout: life
category : Java
duoshuo: true
date: 2014-02-16
title: 读取AndroidManifest.xml中<meta-data>元素的value

---

	作者: MrZhong
	时间: 2014-02-16
	版本: 0.0.1

-----------



Android 开发中：

在AndroidManifest.xml中，<meta-data>元素可以作为子元素，

被包含在<activity>、<application> 、<service>和<receiver>元素中，

不同的父元素，在应用时读取的方法也不同。

1 ：在Activity应用<meta-data>元素。

      xml代码段：
      
     <activity...>
     
         <meta-data android:name="data_Name" android:value="hello my activity"></meta-data>
         
      </activity>

      Java代码段：
      
 	    ApplicationInfo appInfo = m_pkActInstance.getPackageManager()
                .getApplicationInfo(m_pkActInstance.getBaseContext().getPackageName(),
        PackageManager.GET_META_DATA);
        
      String msg =info.metaData.getString("data_Name");
      Log.d(TAG, " msg == " + msg );

2：在application应用<meta-data>元素。

     xml代码段：
     
    <application...>
         <meta-data android:value="hello my application" android:name="data_Name"></meta-data>
     </application>

     java代码段：
     
      ApplicationInfo appInfo = this.getPackageManager()
                                    .getApplicationInfo(getPackageName(),
                            PackageManager.GET_META_DATA);
      String msg=appInfo.metaData.getString("data_Name");
      Log.d(TAG, " msg == " + msg );

3：在service应用<meta-data>元素。

     xml代码段：
     <service android:name="MetaDataService">
        <meta-data android:value="hello my service" android:name="data_Name"></meta-data>
     </service>

     java代码段：
     ComponentName cn=new ComponentName(this, MetaDataService.class);
     ServiceInfo info=this.getPackageManager()
                          .getServiceInfo(cn, PackageManager.GET_META_DATA);
      String msg=info.metaData.getString("data_Name");
      Log.d(TAG, " msg == " + msg );

4: 在receiver应用<meta-data>元素。

   xml代码段:
   
    <receiver android:name="MetaDataReceiver">
            <meta-data android:value="hello my receiver" android:name="data_Name"></meta-data>
            <intent-filter>
                <action android:name="android.intent.action.PHONE_STATE"></action>
            </intent-filter>
    </receiver>
    
   java代码段：
   
    ComponentName cn=new ComponentName(context, MetaDataReceiver.class);
    ActivityInfo info=context.getPackageManager()
                             .getReceiverInfo(cn, PackageManager.GET_META_DATA);
    String msg=info.metaData.getString("data_Name");
    Log.d(TAG, " msg == " + msg );
    
    注意：如果   date_Name 后的 value是数字 ，则使用 getInt，否则 msg为 null
    
        String msg=info.metaData.getString("data_Name");
            int msg=appInfo.metaData.getInt("ODAO_SUB_CHANNEL");
            //getString("ODAO_SUB_CHANNEL");
        Log.d("1111111111111111", " msg == " + String.valueOf(msg) );
        
        
    
