---
layout: life
category : Cocos2d-x
duoshuo: true
date: 2012-09-19
title: cocostudio+滑动+滚动条+按钮
---

	作者: MrZhong
	时间: 2016年09月19日 
	版本: 0.0.1

-----------

	CCControlSlider *slider = NULL;
	CCTableView *tableView = NULL;
	CCSize oneCellSize = ccp(232,95);
	int cellNum = 9;
	CCSize tableViewSize = ccp(220,480);
	bool PersonalInforNewLayer::initVipScrollLayer()
	{
		ui::Layout *Panel_left = dynamic_cast<ui::Layout*>(ui::UIHelper::seekWidgetByName(m_root,"Panel_left"));
		//winSize = CCDirector::sharedDirector()->getWinSize();
		winSize = Panel_left->getContentSize();
		slider = CCControlSlider::create("vip_xl.png","vip_xl.png" ,"vip_la.png");
		slider->setAnchorPoint(ccp(0.5f, 1.0f));
		slider->setMinimumValue( -(oneCellSize.height*cellNum-tableViewSize.height) );   // 单个cell的高度 × cell的总数 - CCTableView的高度
		slider->setMaximumValue(0);
		slider->setPosition(ccp(winSize.width, winSize.height/2+8));
		slider->setRotation(90);
		slider->setValue(-(oneCellSize.height*cellNum-tableViewSize.height)+0);            // 默认为0
		slider->setTag(1);
		//addChild(slider);
		Panel_left->addNode(slider);

		// 监听滑动条
		slider->addTargetWithActionForControlEvents(this, cccontrol_selector(PersonalInforNewLayer::valueChanged), CCControlEventValueChanged);
		slider->setTouchPriority(-1000);
		tableView = CCTableView::create(this, CCSizeMake(oneCellSize.width, tableViewSize.height));
		tableView->setDirection(kCCScrollViewDirectionVertical);
		//tableView->setPosition(ccp(winSize.width/2-30, winSize.height/2-120));
		tableView->setPosition(ccp(3, 5));

		tableView->setDelegate(this);
		tableView->setTag(0);
		//addChild(tableView);
		Panel_left->addNode(tableView);

		tableView->setVerticalFillOrder(kCCTableViewFillTopDown);
		tableView->reloadData();

		return true;
	}

	// 滑动条回调
	void PersonalInforNewLayer::valueChanged( CCObject *sender, CCControlEvent controlEvent )
	{
		m_bTable = false;
		if ( m_bSlider )
		{
			//CCTableView *tableView = (CCTableView *)getChildByTag(0);
			//CCControlSlider *slider = (CCControlSlider *)getChildByTag(1);
			tableView->setContentOffset(CCSizeMake(0, slider->getValue()));
		}
		m_bTable = true;
	}

	// 拖动CCTableView触发
	void PersonalInforNewLayer::scrollViewDidScroll(CCScrollView* view)
	{
		m_bSlider = false;
		if ( m_bTable  )
		{
			//ui::Layout *Panel_left = dynamic_cast<ui::Layout*>(ui::UIHelper::seekWidgetByName(m_root,"Panel_left"));
			//CCTableView *tableView = (CCTableView *)(Panel_left->getChildByTag(0));
			//CCControlSlider *slider = (CCControlSlider *)(Panel_left->getChildByTag(1));
			if (slider && tableView)
			{
				slider->setValue(tableView->getContentOffset().y);
			}
		}
		m_bSlider = true;
	}

	CCSize PersonalInforNewLayer::tableCellSizeForIndex(CCTableView *table, unsigned int idx)
	{
		return CCSizeMake(oneCellSize.width, oneCellSize.height);
	}
	void PersonalInforNewLayer::btnMenuCallback(CCObject *obj)
	{
		int tag = ((CCNode*)obj)->getTag();
		CCLog("btnMenuCallback:%d",tag);
		refreshPanle(tag);
	}

	CCTableViewCell* PersonalInforNewLayer::tableCellAtIndex(CCTableView *table, unsigned int idx)
	{
		CCString *string = CCString::createWithFormat("%d", idx);
		CCTableViewCell *cell = table->dequeueCell();
		if (!cell)
		{
			cell = new CCTableViewCell();
			cell->autorelease();
			//CCLog("idx111111111:%d",idx);
		}
		cell->removeAllChildrenWithCleanup(true);
		cell->setIdx(idx);
		std::string imgName("");
		if (idx+1 < currentVip)
		{
			imgName = "vip_btn2.png";
		}else if (idx+1 == currentVip)
		{
			imgName = "vip_btn1.png";
		}else
		{
			imgName = "vip_blue.png";
		}
		if (0 == currentVip)
		{
			imgName = "vip_blue.png";
		}
		CCSprite *sprite = CCSprite::createWithSpriteFrameName(imgName.c_str());
		CCSprite *sprite2 = CCSprite::createWithSpriteFrameName(imgName.c_str());
		sprite2->setColor(g_pkGame->GetColorLevelDiv2(sprite->getColor()));
		//CCLog("idx2222222:%d",idx);

		CCMenuItemSprite *btnItem = CCMenuItemSprite::create(sprite, sprite2, this, menu_selector(PersonalInforNewLayer::btnMenuCallback));
		btnItem->setPosition(ccp(btnItem->getContentSize().width/2,btnItem->getContentSize().height/2));
		btnItem->setTag(1+cell->getIdx());
		XXScrollViewMenu* menu = XXScrollViewMenu::create(btnItem, NULL);
		menu->setPosition(CCPointZero);
		cell->addChild(menu);
		
		CCString *stringvip = CCString::createWithFormat("publicUI_vip%d.png", idx+1);
		CCSprite *spriteVip = CCSprite::createWithSpriteFrameName(stringvip->getCString());
		spriteVip->setPosition(ccp(btnItem->getContentSize().width/2,btnItem->getContentSize().height/2));
		btnItem->addChild(spriteVip);

		/*CCLabelTTF *label = CCLabelTTF::create(string->getCString(), "Helvetica", 20.0);
		label->setPosition(CCPointZero);
		label->setAnchorPoint(CCPointZero);
		label->setTag(123);
		cell->addChild(label);*/
		return cell;
	}

	unsigned int PersonalInforNewLayer::numberOfCellsInTableView(CCTableView *table)
	{
		return cellNum;
	}


//=====================XXScrollViewMenu.h===============================

	#pragma once

	#include "cocos2d.h"

	USING_NS_CC;

	//当拖动距离小于一定数值的时候，我们可以认为发生了点击事件
	#define XX_TOUCH_DISTANCE 20

	class XXScrollViewMenu : public CCMenu
	{
	public:

		static XXScrollViewMenu* create();
		static XXScrollViewMenu* create(CCMenuItem* item, ...);
		static XXScrollViewMenu* createWithArray(CCArray* pArrayOfItems);
		static XXScrollViewMenu* createWithItems(CCMenuItem *firstItem, va_list args);

		virtual void registerWithTouchDispatcher();

		virtual bool ccTouchBegan(CCTouch* touch, CCEvent* event);
		virtual void ccTouchEnded(CCTouch* touch, CCEvent* event);
		virtual void ccTouchCancelled(CCTouch *touch, CCEvent* event);
		virtual void ccTouchMoved(CCTouch* touch, CCEvent* event);
	private:

		CCPoint startPosition;
	};


//=====================XXScrollViewMenu.cpp===============================

	#include "XXScrollViewMenu.h"

	XXScrollViewMenu* XXScrollViewMenu::create()
	{
		return XXScrollViewMenu::create(NULL, NULL);
	}

	XXScrollViewMenu * XXScrollViewMenu::create(CCMenuItem* item, ...)
	{
		va_list args;
		va_start(args,item);

		XXScrollViewMenu *pRet = XXScrollViewMenu::createWithItems(item, args);

		va_end(args);

		return pRet;
	}

	XXScrollViewMenu* XXScrollViewMenu::createWithArray(CCArray* pArrayOfItems)
	{
		XXScrollViewMenu *pRet = new XXScrollViewMenu();
		if (pRet && pRet->initWithArray(pArrayOfItems))
		{
			pRet->autorelease();
		}
		else
		{
			CC_SAFE_DELETE(pRet);
		}

		return pRet;
	}

	XXScrollViewMenu* XXScrollViewMenu::createWithItems(CCMenuItem* item, va_list args)
	{
		CCArray* pArray = NULL;
		if( item )
		{
			pArray = CCArray::create(item, NULL);
			CCMenuItem *i = va_arg(args, CCMenuItem*);
			while(i)
			{
				pArray->addObject(i);
				i = va_arg(args, CCMenuItem*);
			}
		}

		return XXScrollViewMenu::createWithArray(pArray);
	}

	void XXScrollViewMenu::registerWithTouchDispatcher()
	{
		CCDirector* pDirector = CCDirector::sharedDirector();
		pDirector->getTouchDispatcher()->addTargetedDelegate(this, 0, false);
	}

	bool XXScrollViewMenu::ccTouchBegan( CCTouch* touch, CCEvent* event )
	{
		startPosition = touch->getLocation(); 
		return CCMenu::ccTouchBegan(touch,event);
	}

	void XXScrollViewMenu::ccTouchEnded( CCTouch* touch, CCEvent* event )
	{
		CCPoint position = touch->getLocation();

		
		if (((position.y - startPosition.y) * (position.y - startPosition.y) + (position.x - startPosition.x) * (position.x - startPosition.x)) <= 20 * 20)
		{
			CCMenu::ccTouchEnded(touch,event);
		}
		else
		{
			if (m_pSelectedItem)
			{
				m_pSelectedItem->unselected();
				//m_pSelectedItem->activate();
			}
			m_eState = kCCMenuStateWaiting;
		}
	}

	void XXScrollViewMenu::ccTouchCancelled( CCTouch *touch, CCEvent* event )
	{
		CCMenu::ccTouchCancelled(touch,event);
	}

	void XXScrollViewMenu::ccTouchMoved( CCTouch* touch, CCEvent* event )
	{
		CCMenu::ccTouchMoved(touch,event);
	}









**************

