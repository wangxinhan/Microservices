# 相关业务模块的客户信息显示
----------------------

### 涉及模块
  - 工单，在线客服，客户，通话，邮件，未接详情
  - 需要传入参数 props
    - customer(对应业务的客户信息)
    - custType(one(一个), del(已删除), multi（多个),(unk)未知),
    - currentBusinessObj 相关业务信息 必须属性有 type（业务类型） tabType(业务下的不同模块)，还可以传些业务相关
    -@unbundling 邮件和im 解绑用户的
    -@merged
    -

### 使用方法
****1，客户卡片的使用方法****

import CustomerSlot from 'components/public-modules/contact-summary/CustomerSlot'// 引入组件
  components: {
      CustomerSlot
    }// 初始化
  <customer-slot
  :custType="one/unk"
  :customer="customer"
  ></customer-slot>// custType 区分是未知用户还是已定位客户 customer 有客户则传没客户只传custType就可以

****2，在线客服和邮件卡片的使用方法****

<customer-slot
  custType="one/unk"
  :customer="customer"
  ></customer-slot>
  // custType 区分是未知用户还是已定位客户 customer 有客户则传没客户只传custType就可以

****3，通话卡片的使用方法****

<customer-slot
  custType="one/unk/multi/del"
  custId=""
  :customer="customer"
  ></customer-slot>
  // 已定位一个客户的只穿customer就行，多个匹配用户传custId，和 custType='multi' 删除用户传 custId 和 custType = 'del' 未知用户只传 custType=unk就行

****4，工单卡片的使用方法****

<customer-slot
  custType="one/unk/multi/del"
  custId=""
  :customer="customer"
  ></customer-slot>
  // 已定位一个客户的只穿customer就行，多个匹配用户传custId，和 custType='multi' 删除用户传 custId 和 custType = 'del' 未知用户只传 custType=unk就行

****5，未接详情卡片的使用方法****

<customer-slot
  custType="one/unk/multi/del"
  custId=""
  :customer="customer"
  ></customer-slot>
  // 已定位一个客户的只穿customer就行，多个匹配用户传custId，和 custType='multi' 删除用户传 custId 和 custType = 'del' 未知用户只传 custType=unk就行
### 更新日志
* 日期：2016-12-21，
* 创建人：zlx





