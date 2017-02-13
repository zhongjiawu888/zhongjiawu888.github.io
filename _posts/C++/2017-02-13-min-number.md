---
layout: life
category : C++
duoshuo: true
date: 2014-02-13
title: 3个数中求最小数
---

	作者: MrZhong
	时间: 2014-02-13
	版本: 0.0.1

-----------
       
   3个数中i,j,k(i,j,k有可能为0) 求最小数min  ，并且min不等于 0
       
       int min;

        min = ((i < j) ? (i < k ? i : k) : (j < k ? j : k));

        if (min == 0)
        {
          if (i == 0)
          {
            min = j < k ? j : k;
          }
          else if (j == 0)
          {
            min = i < k ? i : k;
          }
          else if (k == 0)
          {
            min = i < j ? i : j;
          }
        }
        
        
//一下是游戏中的逻辑了，忽视......

        if (min == i)
        {
          m_currentLockPaoTag = 1;
        }
        else if (min == j){
          m_currentLockPaoTag = 2;
        }
        else if (min == k){
          m_currentLockPaoTag = 3;
        }
        else{
          m_currentLockPaoTag = 1;
        }
        
        
