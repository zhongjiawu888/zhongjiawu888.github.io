---
layout: life
category : Functions
duoshuo: true
date: 2016-12-13
title: android ios内嵌网页
---

    作者: MrZhong
    时间: 2016年12月13日
    版本: 0.0.1

-----------

源码整理

一、创建一个cocos界面

//--------------  ActivityLayer.h  ----------------------

    class ActivityLayer:public Layer
    {
    public:
        ActivityLayer();
        virtual ~ActivityLayer();
        static ActivityLayer *create();


    private:
        virtual bool init();

        virtual void onEnter();
        virtual void onExit();

        void handleCloseEvent(Ref* pSender);
        CCRect changeRectToPhone(const CCRect &rt);

    private:
        //活动内嵌网页
        ODUIWebView *m_pActivityWebView;

    };

//--------------  ActivityLayer.cpp ----------------------

    ActivityLayer::ActivityLayer()
    {
    }

    ActivityLayer::~ActivityLayer()
    {
    }

 

    bool ActivityLayer::init()
    {

        auto keyboardListener = EventListenerKeyboard::create();
        keyboardListener->onKeyReleased = CC_CALLBACK_2(ActivityLayer::onKeyReleased, this);
        _eventDispatcher->addEventListenerWithSceneGraphPriority(keyboardListener, this);

        //标题
        auto rootNode = CSLoader::createNode("ActivityLayer.csb");
        addChild(rootNode);

        auto webPanel = static_cast<Layout*>(rootNode->getChildByName("PanelWeb"));
        auto m_pBtnClose = static_cast<Button*>(rootNode->getChildByName("ButtonBack"));
        m_pBtnClose->addClickEventListener(CC_CALLBACK_1(ActivityLayer::handleCloseEvent, this));


        m_pActivityWebView = new ODUIWebView();
        CCRect rtWeb = CCRect(webPanel->getPosition(), webPanel->getContentSize());
        rtWeb = changeRectToPhone(rtWeb);
        m_pActivityWebView->ShowWebView("www.baidui.com"
            , rtWeb.origin.x, rtWeb.origin.y, rtWeb.size.width, rtWeb.size.height);


        return true;
    }

    void ActivityLayer::handleCloseEvent(Ref* pSender)
    {
        m_pActivityWebView->RemoveWebView();
        delete m_pActivityWebView;
        m_pActivityWebView = NULL;
    
    }

    CCRect ActivityLayer::changeRectToPhone(const CCRect &rt)
    {
        CCSize winSize = CCDirector::sharedDirector()->getWinSize();
        float xScale = CCDirector::sharedDirector()->getOpenGLView()->getScaleX();
        float yScale = CCDirector::sharedDirector()->getOpenGLView()->getScaleY();

        return CCRect(rt.origin.x*xScale, (winSize.height - (rt.origin.y + rt.size.height))*yScale, rt.size.width*xScale, rt.size.height*yScale);
    }

    void ActivityLayer::onEnter()
    {
        Layer::onEnter();
    }

    void ActivityLayer::onExit()
    {
        if (m_pActivityWebView)
        {
            m_pActivityWebView->RemoveWebView();
            delete m_pActivityWebView;
            m_pActivityWebView = NULL;
        }
    }

二、平台封装

//--------------  ODUIWebView.h ----------------------

    #pragma once

    #include "cocos2d.h"

    #if(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        #include "../Platform/WebViewClass.h"
    #endif

    USING_NS_CC;

    class ODUIWebView
    {
    public:
        ODUIWebView();

        virtual ~ODUIWebView();

        void ShowWebView(const char* pcUrl, float x, float y, float f32Width, float f32Height, int nLoadCache = 0);

        void UpdateUrl(const char* pcUrl, int nLoadCache = 0, const char* orPcUrl = NULL);

        void RemoveWebView(const char* orPcUrl = NULL);

        bool IsShowWebView();

    private:
    #if(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        CWebView* m_pkIosWebView;
    #endif
        bool m_bIsShowWeb;
    };

//--------------  ODUIWebView.cpp ----------------------

    #include "ODUIWebView.h"
    #define ANDROID_PACKAGE_NAME "com/odao/fish/AdaoFish"

    #if(CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    #include "platform\android\jni\JniHelper.h"
    #include <jni.h>
    #endif

    ODUIWebView::ODUIWebView() : m_bIsShowWeb(false)
    {
    #if(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        m_pkIosWebView = nullptr;
        if (!m_pkIosWebView) {
            m_pkIosWebView = new CWebView;
        }
    #endif
    }

    ODUIWebView::~ODUIWebView()
    {
    #if(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        if (m_pkIosWebView) {
            delete m_pkIosWebView;
            m_pkIosWebView = nullptr;
        }
    #endif
    }

    void ODUIWebView::ShowWebView( const char* pcUrl, float x, float y, float f32Width, float f32Height, int nLoadCache)
    {
    #if(CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)

        JniMethodInfo t;
        jobject activityObj;

        if (JniHelper::getStaticMethodInfo(t, ANDROID_PACKAGE_NAME, "GetJavaActivity", "()Ljava/lang/Object;"))
        {
            activityObj = t.env->CallStaticObjectMethod(t.classID, t.methodID);
        }

        if (JniHelper::getMethodInfo(t, ANDROID_PACKAGE_NAME, "DisplayWebView", "(IIIIIJLjava/lang/String;)V"))
        {
            int jX = (int)x;
            jint jY = (int)y;
            jint jWidth = (int)f32Width;
            jint jHeight = (int)f32Height;
            jint jLoadCache = nLoadCache;
            jlong jaddress = (unsigned long)this;

            jstring jmsg2 = t.env->NewStringUTF(pcUrl);

            t.env->CallVoidMethod(activityObj, t.methodID, jX, jY, jWidth, jHeight, jLoadCache, jaddress, jmsg2);
        }

        if (JniHelper::getMethodInfo(t, ANDROID_PACKAGE_NAME, "UpdateURL", "(Ljava/lang/String;IJLjava/lang/String;)V"))
        {
            jstring jmsg = t.env->NewStringUTF(pcUrl);
            jint jLoadCache = nLoadCache;
            jlong jaddress2 = (unsigned long)this;
            t.env->CallVoidMethod(activityObj, t.methodID, jmsg, nLoadCache, jaddress2, jmsg);
        }
    #endif
    #if(CC_TARGET_PLATFORM == CC_PLATFORM_WIN32) 

    #endif

    #if(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        float winX = Director::getInstance()->getWinSize().width;
        float winY = Director::getInstance()->getWinSize().height;

        if ((winX == 960 && winY == 640) ||
            (winX == 1136 && winY == 640) ||
            (winX == 2048 && winY == 1536))
        {
            x /= 2.0f;
            y /= 2.0f;
            f32Width /= 2.0f;
            f32Height /= 2.0f;
        }
        m_pkIosWebView->ShowWebView(pcUrl, x, y, f32Width, f32Height);
    #endif
        m_bIsShowWeb = true;
    }

    void ODUIWebView::UpdateUrl( const char* pcUrl, int nLoadCache, const char* orPcUrl)
    {
    #if(CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
        JniMethodInfo t;
        jobject activityObj;

        if (JniHelper::getStaticMethodInfo(t, ANDROID_PACKAGE_NAME, "GetJavaActivity", "()Ljava/lang/Object;"))
        {
            activityObj = t.env->CallStaticObjectMethod(t.classID, t.methodID);
        }

        if (JniHelper::getMethodInfo(t, ANDROID_PACKAGE_NAME, "UpdateURL", "(Ljava/lang/String;IJLjava/lang/String;)V"))
        {
            jstring jmsg = t.env->NewStringUTF(pcUrl);
            jint jLoadCache = nLoadCache;
            jstring jmsg2 = t.env->NewStringUTF(orPcUrl);
            jlong jaddress = (unsigned long)this;
            t.env->CallVoidMethod(activityObj, t.methodID, jmsg, nLoadCache, jaddress, jmsg2);
        }
    #endif

    #if(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
        m_pkIosWebView->UpdateUrl(pcUrl);
    #endif
    }

    void ODUIWebView::RemoveWebView(const char* orPcUrl)
    {
        if (m_bIsShowWeb)
        {
    #if(CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
            JniMethodInfo t;
            jobject activityObj;

            if (JniHelper::getStaticMethodInfo(t, ANDROID_PACKAGE_NAME, "GetJavaActivity", "()Ljava/lang/Object;"))
            {
                activityObj = t.env->CallStaticObjectMethod(t.classID, t.methodID);
            }

            if (JniHelper::getMethodInfo(t, ANDROID_PACKAGE_NAME, "RemoveWebView", "(JLjava/lang/String;)V"))
            {
                jstring jmsg = t.env->NewStringUTF(orPcUrl);
                jlong jaddress = (unsigned long)this;
                t.env->CallVoidMethod(activityObj, t.methodID, jaddress, jmsg);
            }
    #endif

    #if(CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
            m_pkIosWebView->RemoveWebView();
    #endif
            m_bIsShowWeb = false;
        }
    }

    bool ODUIWebView::IsShowWebView()
    {
        return m_bIsShowWeb;
    }   

三、Android实现

    public static Activity m_pkActInstance;
    private LinearLayout m_kWebLayout = null;
    private WebView m_kWebView = null;
    private Map<Long, Map<String, WebView> > m_kWebViewMap;
    private Map<Long, Map<String, LinearLayout> > m_kWebLayoutMap;
    

    onCreate方法：
    m_pkActInstance = this;
    m_kWebViewMap = new HashMap<Long, Map<String,WebView> >();
    m_kWebLayoutMap  = new HashMap<Long, Map<String, LinearLayout> >();

    public static Object GetJavaActivity() {
        Log.d("What", "GetJavaActivity");
        return m_pkActInstance;
    }
    
    public void DisplayWebView(final int x, final int y, final int width, final int height, final int nLoadCache, final long address, final String url) {
        
        this.runOnUiThread(new Runnable() {
            public void run() {
                
                //Map<Integer, Map<String, WebView> >
                Map<String, WebView> valueMap = m_kWebViewMap.get(address);
                Map<String, LinearLayout> valueLayoutMap = m_kWebLayoutMap.get(address);
                
                if(null == valueLayoutMap) {
                    m_kWebLayout = new LinearLayout(m_pkActInstance);
                    m_pkActInstance.addContentView(m_kWebLayout, new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.FILL_PARENT));
                    valueLayoutMap = new HashMap<String, LinearLayout>();
                    valueLayoutMap.put(url, m_kWebLayout);
                    m_kWebLayoutMap.put(address, valueLayoutMap);
                }
                else {
                    LinearLayout weblayout = valueLayoutMap.get(url);
                    
                    if(null == weblayout) {
                        m_kWebLayout = new LinearLayout(m_pkActInstance);
                        m_pkActInstance.addContentView(m_kWebLayout, new LayoutParams(LayoutParams.FILL_PARENT,LayoutParams.FILL_PARENT));
                        valueLayoutMap.put(url, m_kWebLayout);
                    }
                    else {
                        m_kWebLayout = weblayout;
                    }
                }
                
            
                if(null == valueMap) {
                    m_kWebView = new WebView(m_pkActInstance);
                    m_kWebLayout.addView(m_kWebView);
                    
                    valueMap = new HashMap<String, WebView>();
                    valueMap.put(url, m_kWebView);
                    
                    m_kWebViewMap.put(address, valueMap);
                }
                else {
                    WebView webView = valueMap.get(url);
                    
                    if(null == webView) {
                        m_kWebView = new WebView(m_pkActInstance);
                        valueMap.put(url, m_kWebView);
                        m_kWebLayout.addView(m_kWebView);
                    }
                    else {
                        m_kWebView = webView;
                    }
                }
                
                Log.d("DisplayWebView-----", url);
                
                LinearLayout.LayoutParams linearParams = (LinearLayout.LayoutParams) m_kWebView.getLayoutParams();
                linearParams.leftMargin = x;
                linearParams.topMargin = y;
                linearParams.width = width;
                linearParams.height = height;
                
                m_kWebView.setBackgroundColor(0);
            
                int screenDensity = getResources().getDisplayMetrics().densityDpi ;   
                WebSettings.ZoomDensity zoomDensity = WebSettings.ZoomDensity.FAR ;   
                switch (screenDensity){   
                case DisplayMetrics.DENSITY_LOW :  
                    zoomDensity = WebSettings.ZoomDensity.CLOSE;  
                    break;  
                case DisplayMetrics.DENSITY_MEDIUM:  
                    zoomDensity = WebSettings.ZoomDensity.MEDIUM;  
                    break;  
                case DisplayMetrics.DENSITY_HIGH:  
                    zoomDensity = WebSettings.ZoomDensity.FAR;  
                    break ;  
                default:
                     zoomDensity = WebSettings.ZoomDensity.FAR;  
                    break ;  
                }  
                //m_kWebView.getSettings().setDefaultZoom( WebSettings.ZoomDensity.MEDIUM);  
                m_kWebView.getSettings().setDefaultZoom( zoomDensity); 
                
                m_kWebView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
                m_kWebView.getSettings().setAppCacheEnabled(false);
                m_kWebView.getSettings().setUseWideViewPort(true); 
                m_kWebView.getSettings().setLoadWithOverviewMode(true);
                m_kWebView.getSettings().setJavaScriptEnabled(true);
                m_kWebView.getSettings().setLayoutAlgorithm(LayoutAlgorithm.NORMAL); 
                
                m_kWebView.setLayoutParams(linearParams);
                
                m_kWebView.setBackgroundColor(0); // 设置背景色  
                Drawable a = m_kWebView.getBackground();
                
                if(a != null) {
                    a.setAlpha(0); // 设置填充透明度 范围：0-255
                }
                else {
                    Log.d("What", "null null null null null!");
                }
                m_kWebView.setWebViewClient(new WebViewClient(){
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, String url)
                    {
                        Log.d("What", "url: "+url);
                        return false;  
                    }
                    
                });
            }
        });
    }

    public void UpdateURL(final String url, final int nLoadCache, final long address, final String orUrl) {
        this.runOnUiThread(new Runnable() {
            public void run() {
                if(null != orUrl && !orUrl.isEmpty()) {
                    Map<String, WebView> valueMap = m_kWebViewMap.get(address);
                    
                    if(null != valueMap) {
                        WebView webView = valueMap.get(orUrl);
                        if(null != webView) {
                            m_kWebView = webView;
                            m_kWebView.loadUrl(url);
                        }
                    }
                }
                else
                {
                    m_kWebView.loadUrl(url);
                }
            }
        });
    }

    public void RemoveWebView() {
        this.runOnUiThread(new Runnable() {
            public void run() {
                if (m_kWebView != null)
                {
                    for(Object a : m_kWebLayoutMap.keySet()){  
                        for(Object b : m_kWebLayoutMap.get(a).keySet()) {
                            m_kWebLayout = m_kWebLayoutMap.get(a).get(b);
                            for(Object o : m_kWebViewMap.keySet()){  
                                for(Object u : m_kWebViewMap.get(o).keySet()) {
                                    m_kWebLayout.removeView(m_kWebViewMap.get(o).get(u));  
                                    m_kWebViewMap.get(o).get(u).destroy();
                                    if(m_kWebViewMap.get(o).get(u) == m_kWebView) {
                                        m_kWebView = null;
                                    }
                                }  
                            }
                        }
                    }
                    
                    m_kWebViewMap.clear();
                    
                    if (m_kWebView != null)
                    {
                        for(Object a : m_kWebLayoutMap.keySet()){  
                            for(Object b : m_kWebLayoutMap.get(a).keySet()) {
                                m_kWebLayout = m_kWebLayoutMap.get(a).get(b);
                                m_kWebLayout.removeView(m_kWebView);
                                m_kWebView.destroy();
                                m_kWebView = null;
                            }
                        }
                    }
                    
                    getGLSurfaceView().requestFocus();
                }
            }
        });
    }

四、IOS实现

//============ ODUIWebView_IOS.h ==================    

    #pragma once

    #import <Foundation/Foundation.h>

    @interface ODUIWebView_IOS : NSObject <UIWebViewDelegate>
    {
        UIWebView* m_webview;
    }

    - (void)ShowWebView_x:(float)x y:(float)y width:(float) widht height:(float)height;

    - (void)UpdateURL:(const char*)url;

    - (void)RemoveWebView;

    @end   

//============ ODUIWebView_IOS.mm ==================      

    #import "ODUIWebView_IOS.h"
    #include "cocos2d.h"
    #import "platform/ios/CCEAGLView-ios.h"

    @implementation ODUIWebView_IOS


    - (void)ShowWebView_x:(float)x y:(float)y width:(float) widht height:(float)height
    {
        if (!m_webview)
        {
            m_webview = [[UIWebView alloc] initWithFrame:CGRectMake(x, y, widht, height)];
            [m_webview setDelegate:self];

            auto view = cocos2d::Director::getInstance()->getOpenGLView();
            CCEAGLView *eaglview = (CCEAGLView *)view->getEAGLView();
            
            [eaglview addSubview:m_webview];
            [m_webview release];
            
            m_webview.backgroundColor = [UIColor clearColor];
            m_webview.opaque = NO;
            m_webview.scalesPageToFit = YES;
            
            for (UIView *aView in [m_webview subviews])  
            { 
                if ([aView isKindOfClass:[UIScrollView class]])  
                { 
                    UIScrollView* scView = (UIScrollView *)aView;
                    
                    [scView setShowsHorizontalScrollIndicator:NO];

                    for (UIView *shadowView in aView.subviews)  
                    {
                        if ([shadowView isKindOfClass:[UIImageView class]]) 
                        { 
                            shadowView.hidden = YES;
                        } 
                    } 
                } 
            }  
        }
    }

    - (void)UpdateURL:(const char*)url
    {
        NSString *request = [NSString stringWithUTF8String:url];
        [m_webview loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:request] 
                                                cachePolicy:NSURLRequestReloadIgnoringLocalCacheData 
                                            timeoutInterval:60]];
        [m_webview setScalesPageToFit:YES];
    }

    - (void)RemoveWebView
    {
        if (m_webview != nil)
        {
            [m_webview stopLoading];
            [m_webview setDelegate:nil];
            [m_webview removeFromSuperview];
            //[m_webview setDelegate:nil];
            m_webview = nil;
        }
    }

    - (void)dealloc
    {
        NSLog(@"Web view dealloc");
        [super dealloc];
    }

    #pragma mark - WebView
    - (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType
    {
        return true;
    }

    - (void)webViewDidStartLoad:(UIWebView *)webView
    {
        CCLOG("webViewDidStartLoad");
    }

    - (void)webViewDidFinishLoad:(UIWebView *)webView
    {
        CCLOG("webViewDidFinishLoad");
    }

    - (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error
    {
        CCLOG("didFailLoadWithError");
    }

    @end 