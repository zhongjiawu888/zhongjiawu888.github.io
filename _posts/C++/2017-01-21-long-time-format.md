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

-----------

#include <time.h>  	

1.时间戳转格式化

		int timeSec = 1384936600;
		time_t t;
		struct tm *p /*= new struct tm()*/;
		//t = 1384936600;
		t = (time_t)timeSec;
		p = gmtime(&t);
		char s[200];
		strftime(s, sizeof(s), "%H:%M", p);
		//strftime(s, sizeof(s), "%Y-%m-%d %H:%M:%S", p);  
		//delete(p);

2.格式化转时间戳

    struct tm* tmp_time = (struct tm*)malloc(sizeof(struct tm));  
    strptime("20131120","%Y%m%d",tmp_time);  
    time_t t = mktime(tmp_time);  
    printf("%ld\n",t);  
    free(tmp_time);