#表单输入组件

### 组件介绍

所有表单的基础组件，一共有四种样式，自带验证逻辑，并对外暴露若干接口。

### 依赖

- vue-validator
- vue-validator-manage
- underscore
- util.validator:验证依赖
- api:异步验证依赖

###使用方法

```html
<rm-input title="金额"
        subtitle="(选填)"
        placeholder="请填写"
        fieldname="aaa"
        :rules="rules"
        :async="async"
        fieldset="aaa">
</rm-input>
<br>
<rm-input
        category="only-button"
        title="期望"
        :rules="rules"
        :async="async"
        button-text="额度"
        tip="默认提示"
        placeholder="请填写"
        fieldname="bbb"
        fieldset="bbb">
</rm-input>
<br>
```
```javascript
 import rmInput from 'fin-rm/input-base';
 import {validator} from 'fin-fg/util';
 let async=validator.custom.async;
 let phone=validator.custom.phone;
 var vm = new Vue({
    data: {
        rules: {
            required: { rule: true, message: '请填写详细地址' },
            phone
        },
        async
    },
    components: {
        rmInput
    }
});

```

##props

|prop|类型|说明|默认|
|---|---|---|---|
|type|string|表单类型|text|
|category|string|表单分类`''/'header-button'/'only-button'/'only-header'`|`''`|
|inputCss|string|底层表单输入框类名|`''`|
|header|string|头部文字|`''`|
|icon|boolean|头部是否有那个icon|false
|title|string|input左边文字|`''`
|subtitle|string|input左边小字|`''`
|placeholder|string|输入框的placeholder|`''`
|buttonText|string|按钮文案|按钮
|disabled|Boolean|button是否disable|false
|readonly|Boolean|输入框是否只读|false
|min|Number|input的min|
|max|Number|input的max|
|maxlength|Number|input的maxlength|
|value|string|input的value|`''`
|fieldname|string|表单域名字|`''`
|fieldset|string|验证项名字|`''`

##events

- icon-click:icon：header上面图标点击事件
- button-click：按钮点击事件


----

##验证相关

###异步验证

####props

|props|类型|说明|
|---|---|---|
|async|Object|异步验证规则|

#####async配置

|键名|类型|说明|必填|
|---|---|---|---|
|apiName|string|请求接口名|是|
|trigger|string|触发时机:可选`'blur'/'input'/''/'close'`| 否
|time|number|多少ms请求,默认800|否
|before|Function|提交数据之前钩子，如果返回为false,则不请求数据|否
|rule|Function|根据返回的结果，返回验证结果，true表示验证成功|是
|success|Function|验证成功要做的事|否
|error|Function|验证失败要做的事|否
|message|Object/string|如果传入字符串代表错误信息；传入对象则格式为`{ success: '',error: '',loading: '请求中'}`|是

####methods

- startAsync：立即验证
- delayAsync: 延时验证，参数为数字，代表多少毫秒开启异步验证
- closeAsync：关闭异步验证

###同步验证

####props

|props|类型|说明|
|---|---|---|
|rules|Object|同步验证规则|
默认逻辑：
**实时开启实时同步验证**
而错误提示是有条件的，下面任意一种都将显示错误信息
- 如果值为脏值
- 如果反省时有值
- 异步验证无效时

###显示效果

####props

|props|类型|说明|
|---|---|---|
|tip|string|表单下面的默认提示文字|
|topError|string|错误状态：`''/'true'/'false'`|
|topLoading|boolean|是否显示loading,默认为true|

####methods

- closeLoading:关闭默认的loading效果
- openLoading：打开默认的loading效果
- showError：强制显示错误提示
- closeError：强制关闭错误提示
- defaultError：默认的错误提示逻辑

####events

'show-error-message': 强制开启错误提示

### 更新日志

* 版本：0.0.1，日期：2017/04/10，描述：创建文档

### 维护人员


