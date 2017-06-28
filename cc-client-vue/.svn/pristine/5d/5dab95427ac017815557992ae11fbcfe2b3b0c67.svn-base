# 国际化
----------------------

### 语言环境


### 组件介绍
全局状态语言包。

### 依赖组件
* 无

### 依赖接口


### 使用方法
**1. 使用默认参数**

```html
{{$t('login.forget')}}
<el-tab-pane :label="$t('public.callDetails')" name="first"></el-tab-pane>(eg:在线客服等tab，pleaceholder等)
```
**2. 使用全部参数**

```html

```

Vue 实例 data

```javascript

  this.alert($t('login.forget')), {
  confirmButtonText: this.$t('login.forget'),
  title: this.$t('login.forget')
  }
  （具体事例见登录页密码错误时）

```
  callback(new Error($t('login.forget')))

```
### 后台返回字段（暂不处理,后台返回是啥就展现啥）
 （若以后后台统一返回error是key的形式可按如下方法处理）
 methods: {
  cdrList () {
          let datalist = this.$store.state.customer.customerList
          if (datalist.list) {//请求成功有数据时
            return datalist
          } else {
            this.$message(this.$t('login.' + datalist.message ))//请求失败，error时
            return false
          }
        }
  },
  beforeMount () {
       this.cdrList()
     }
### 参数说明
* uuid：字符串

### 更新日志
* 版本：0.0.1
* 日期：2016-12-20，
* 描述：创建文档

### 维护人员
 [xxxx](xxxx)

