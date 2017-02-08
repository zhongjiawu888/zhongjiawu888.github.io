---
layout: life
category : C++
duoshuo: true
date: 2017-01-20
title: 玩家金币(long long)保留2位小数处理
---

	作者: MrZhong
	时间: 2016年12月29日
	版本: 0.0.1
	
-----------

资源图片：.0123456789

函数：

	struct NumData
	{
		int n;//0：万一下，，1：万，2亿
		std::string str;
		NumData()
		{
			n = 0;
			str = "0";
		}
	};


	NumData GetNumber(long long u64Number)
	{
		static char s_acBuffer[1024] = { 0 };
		static FireCrackersMgr::NumData s_numData;
		if (u64Number < 10000)
		{
			sprintf(s_acBuffer, "%lld", u64Number);
			s_numData.n = 0;

		}
		else if (u64Number < 100000000)//万
		{
			float num = u64Number / 10000.0f;
			num = ((int)(num * 100)) / 100.0;//不四舍五入处理;

			char nnnn[20] = { 0 };
			sprintf(nnnn, "%.1f", num);
			sprintf(s_acBuffer, "%s", nnnn);
			s_numData.n = 1;

		}
		else if (u64Number < 1000000000000ull)//亿
		{
			float num = u64Number / 100000000.0f;
			num = ((int)(num * 100)) / 100.0;//不四舍五入处理;

			char nnnn[20] = { 0 };
			sprintf(nnnn, "%.1f", num);
			sprintf(s_acBuffer, "%s", nnnn);
			s_numData.n = 2;
		}
		else//万亿
		{
			u64Number /= 1000000000000ull;
			sprintf(s_acBuffer, "%lld", u64Number);
			s_numData.n = 3;
		}
		s_numData.str = s_acBuffer;

		replace_all(s_numData.str, ".", "/");// .替换成/

		return s_numData;
	}


	std::string replace_all(std::string&  str, const std::string& old_value, const std::string&   new_value)
	{
		while (true)   {
			string::size_type   pos(0);
			if ((pos = str.find(old_value)) != string::npos)
				str.replace(pos, old_value.length(), new_value);
			else   break;
		}
		return   str;
	}小数	
	


cocos:

	LabelAtlas * pBasePointNum = LabelAtlas::create("0", "hongbaonum.png", 51, 69, '/');
	pBasePointNum->setString(str);
	
	
小数处理
		char arrCh[250];//100
		sprintf(arrCh, "%.2f", num / 100.f);
		log("hong bao::");

		std::string str = arrCh;
		log("hong bao::%lld,%s", num, str.c_str());	

-----------
