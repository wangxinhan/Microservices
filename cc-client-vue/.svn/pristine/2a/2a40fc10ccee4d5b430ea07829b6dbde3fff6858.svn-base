# 客户头像组件化
----------------------

### 涉及模块
工单，在线客服，客户，通话

### 使用方法
****1，客户卡片的使用方法****

import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'// 引入组件
  components: {
      CustomerAvatar
    }// 初始化
  <customer-avatar :status="item.status" :size="30"></customer-avatar>// 往组件中传后台返回的status,以及自定义头像大小

****2，在线客服卡片的使用方法****

<customer-avatar :status="item.status" :size="30" :isim=true :im="{userStatus:item.userStatus,platform:item.platform}"></customer-avatar>
//其中userStatus为是否在线 platform为来源

****3，通话卡片的使用方法****

<customer-avatar :status="item.status" :size="30" :call="{CONNECT_TYPE:item.CONNECT_TYPE}"></customer-avatar>

****4，工单卡片的使用方法****

<customer-avatar :status="item.status" :size="30"></customer-avatar>

### 更新日志
* 日期：2016-12-21，
* 创建人：liyl


