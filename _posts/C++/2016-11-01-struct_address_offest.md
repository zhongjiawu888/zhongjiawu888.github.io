---
layout: life
category : C++
duoshuo: true
date: 2016-11-01
title: 结构体地址偏移
---

	作者: MrZhong
	时间: 2016年11月01日
	版本: 0.0.1

-----------

关于结构体内存对齐（在没有#pragma pack宏的情况下） ：

原则1、数据成员对齐规则：结构（struct或联合union）的数据成员，第一个数据成员放在offset为0的地方，以后每个数据成员存储的起始位置要从该成员大小的整数倍开始（比如int在32位机为４字节，则要从4的整数倍地址开始存储）。

原则2、结构体作为成员：如果一个结构里有某些结构体成员，则结构体成员要从其内部最大元素大小的整数倍地址开始存储。（struct a里存有struct b，b里有char，int，double等元素，那b应该从8的整数倍开始存储。）

原则3、收尾工作：结构体的总大小，也就是sizeof的结果，必须是其内部最大成员的整数倍，不足的要补齐。


一、没有#pragma pack宏

	#define PRINT_D(intValue)     CCLog(#intValue" is %d\n", (intValue));
	#define OFFSET(struct,member)  ((char *)&((struct *)0)->member - (char *)0)

	typedef struct
	{
		char    sex;//0
		short   score;//2
		int     age;//4
		char name;//8 => size = 8+1+3 = 12
	}student;



	PRINT_D(sizeof(student))
		PRINT_D(OFFSET(student, sex))
		PRINT_D(OFFSET(student, score))
		PRINT_D(OFFSET(student, age))

		PRINT_D(OFFSET(student, name))



	struct A{
		char c1;//0
		int i;//4
		short s;//8
		int j;//12 => size = 12+4 = 16
	}a;


	PRINT_D(sizeof(A))
		PRINT_D(OFFSET(A, c1))
		PRINT_D(OFFSET(A, i))
		PRINT_D(OFFSET(A, s))

		PRINT_D(OFFSET(A, j))



	struct B{
		int i;//0
		int j;//4
		short s;//8
		char c1;//12
	}b;


	PRINT_D(sizeof(B))
		PRINT_D(OFFSET(B, i))
		PRINT_D(OFFSET(B, j))
		PRINT_D(OFFSET(B, s))

		PRINT_D(OFFSET(B, c1))

输出结果：

	sizeof(student) is 12

	OFFSET(student, sex) is 0

	OFFSET(student, score) is 2

	OFFSET(student, age) is 4

	OFFSET(student, name) is 8



	sizeof(A) is 16

	OFFSET(A, c1) is 0

	OFFSET(A, i) is 4

	OFFSET(A, s) is 8

	OFFSET(A, j) is 12



	sizeof(B) is 12

	OFFSET(B, i) is 0

	OFFSET(B, j) is 4

	OFFSET(B, s) is 8

	OFFSET(B, c1) is 10


二、有#pragma pack宏定义：

#pragma pack(2)


	define PRINT_D(intValue)     CCLog(#intValue" is %d\n", (intValue));
	#define OFFSET(struct,member)  ((char *)&((struct *)0)->member - (char *)0)


	typedef struct
	{
		char    sex;//0
		short   score;//前一个成员偏移量0+前一个成员大小1+填充1 = 偏移量2 （填充的大小 要使得最后的偏移量是定义的宏2的整数倍）
		int     age;//前一个偏移量2+前一个成员大小2 = 偏移量4
		char name;//前一个偏移量4+前一个成员大小4 = 偏移量8 ，所以size =最后一个成员偏移量8+最后一个成员大小1 +填充1 = 10
	}student;



	PRINT_D(sizeof(student))
		PRINT_D(OFFSET(student, sex))
		PRINT_D(OFFSET(student, score))
		PRINT_D(OFFSET(student, age))

		PRINT_D(OFFSET(student, name))



	struct A{
		char c1;//0
		int i;//2
		short s;//6
		int j;//8 => size = 8+4 = 12
	}a;


	PRINT_D(sizeof(A))
		PRINT_D(OFFSET(A, c1))
		PRINT_D(OFFSET(A, i))
		PRINT_D(OFFSET(A, s))

		PRINT_D(OFFSET(A, j))



	struct B{
		int i;//0
		int j;//4
		short s;//8
		char c1;//10 + 1 + 1 = 12
	}b;


	PRINT_D(sizeof(B))
		PRINT_D(OFFSET(B, i))
		PRINT_D(OFFSET(B, j))
		PRINT_D(OFFSET(B, s))

		PRINT_D(OFFSET(B, c1))

