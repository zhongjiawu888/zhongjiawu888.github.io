---
layout: life
category : C++
duoshuo: true
date: 2017-01-21
title: 时间戳和格式化互转
---

	作者: MrZhong
	时间: 2017-01-21
	版本: 0.0.1
	
	版本: 0.0.2 （注意32位与64位）跨平台
-----------

#include <time.h>  
#include <stdio.h>  
#ifdef WIN32  
#include <sys/timeb.h>  
#else  
#include <sys/time.h>  
#endif  

1.时间戳转格式化

		time_t  t;
		struct tm *p /*= new struct tm()*/;
		//t = 1384936600;
		t = (time_t)timeSec;
		p = localtime(&t);
		char s[200];
		strftime(s, sizeof(s), "%H:%M", p);
		//delete(p);
		//char ss[200];
		//strftime(ss, sizeof(ss), "%Y-%m-%d %H:%M:%S", p);

		struct tm *p2 /*= new struct tm()*/;
		time_t t2 = (time_t)timeEndSec;
		p2 = localtime(&t2);
		char s2[200];
		strftime(s2, sizeof(s2), "%H:%M", p2);
		//delete(p2);
				
		
		
		

2.格式化转时间戳

    struct tm* tmp_time = (struct tm*)malloc(sizeof(struct tm));  
    strptime("20131120","%Y%m%d",tmp_time);  
    time_t t = mktime(tmp_time);  
    printf("%ld\n",t);  
    free(tmp_time);
