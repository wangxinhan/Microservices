## 列表卡片组件
#### UI 效果
![列表卡片]

#### 组件介绍
卡片按业务分为
A通话列表卡片（来电、我、全部）
B在线咨询列表卡片（待处理、全部）
C客户列表卡片（我的、联系计划、全部）
D工单列表卡片（待领取、我的、全部）

#### 依赖组件
* [组件名称1](/file path 1/)
* [组件名称2](/file path 2/)
* [组件名称3](/file path 3/)

#### 依赖接口
* 接口 /api/***

#### 使用方法
**1. 使用默认参数**

```html
<card></card>
```

**2. 使用全部参数**

引用组件
```html
<card
  :cardList="cardList"
  :type="type"
  :count="count"
></card>
```

Vue 实例 data
```javascript

```A电话列表卡片
data: {
    name: '张三'
    _id: '8b1771c0-741a-11e6-9afe-53c50de1972b',
    note: '备注',
    status: 'statu0',
    owner: 'ed9f3d80-786e-11e5-bf49-b37141d621d3',
    action: '联系计划',
}
```

#### 参数说明
* type：字符串、必选。业务类型customer、business、webchat、call
* CALL_ID：字符串、必选。通话id
* CONNECT_TYPE：字符串、必选。呼叫类型
* CUSTOMER_NAME：字符串、必选。客户名称
* DISTRICT：字符串、必选。电话归属地
* owner：字符串、非必选。所属人无则为无所属人
* RECORD_FILE_NAME：字符串、非必选。通话录音地址
* STATUS：字符串、必选。（已接听、IVR）
* OFFERING_TIME： 字符串、必选。某某时间
* END_TIME：字符串、必选。挂机时间
* COMMENTS：字符串、非必选。备注
* 其他等等


```C客户列表卡片
data: {
	name: '张三'
	_id: '8b1771c0-741a-11e6-9afe-53c50de1972b',
	note: '备注',
	status: 'statu0',
	owner: 'ed9f3d80-786e-11e5-bf49-b37141d621d3',
	action: '联系计划',
}
```

#### 参数说明
* type：字符串、必选。业务类型customer、business、webchat、call
* _id：字符串、非必选。客户id
* note：字符串、非必选。客户备注
* status：字符串、非必选。系统默认10种状态，无则未知客户
* owner：字符串、非必选。所属人无则为无所属人
* action：字符串、非必选。联系计划



#### 更新日志
* 版本：0.0.1，日期：2016/12/22，描述：创建文档

#### 维护人员
刘婧
