<template>
<div :class="['addCustomer', 'customer-dialog', reSize ? 'resize-dialog': 'resize-customer']">
  <div class="title" v-show="isTitle">
    <span v-if="isTag" class="tag">{{$t('customer.defineCustomer')}}</span>
    <div class="raido-item">
      <el-radio-group  v-model.trim="labelValue" @change="tab('merge')">
        <el-radio size="small" v-if="isAdd"  :label="3">{{$t('customer.addCustomer')}}</el-radio>
        <el-radio size="small" v-if="isMerge" :label="6">{{$t('customer.mergeCustomer')}}</el-radio>
      </el-radio-group>
    </div>
  </div>
  <component :is="typeCustomer"
  @change-merge="mergeCust"
  :select="select"
  :tel="tel"
  :isDailog="isDailog"
  :isDalog="isDalog"
  :custInfo="customer"
  :jumpMerge = "jumpMerge"
  :bindCustomer="bindCustomer"
  :currentBusinessObj="currentBusiness"
  :isBlight='isBlight'
  :clearnTable="clearnTable"
  @addCustomerSuccess="addCustomerSuccess"
  @editCust="addCustomer"
  @closeDialog="closeDialog">
  </component>
</div>
</template>
<script>
  import addcus from './AddCus'
  import merge from './Merge'
  export default {
    name: 'AddCustomer',
    data () {
      return {
        typeCustomer: 'addcus',
        tel: '',
        // 当点击合并客户的模态框时 传值确认是否为true
        clickFlag: '',
        // 从增加页面跳转到合并页面 jumpMerge
        customer: this.custInfo,
        currentBusiness: this.currentBusinessObj,
        form: null,
        maxHeight: 'calc(100vh - 250px)',
        radio: this.labelValue || 3
      }
    },
    props: {
      // 判断该组件是否使用子啊模态框里面
      isDailog: {
        type: Boolean,
        default: false
      },
      // 判断模态框的显示
      isDalog: Boolean,
      select: String,
      // 单选的label显示
      isTag: {
        type: Boolean,
        default: true
      },
      // 定位客户显示
      isMerge: {
        type: Boolean,
        default: true
      },
      // 添加客户显示
      isAdd: {
        type: Boolean,
        default: true
      },
      // 加入黑名单显示
      isBlight: {
        type: Boolean,
        default: true
      },
      // 整个单选不显示
      isTitle: {
        type: Boolean,
        default: true
      },
      bindCustomer: {
        type: Object,
        default: null
      },
      labelTitle: String,
      // 填写给客户信息的表单
      custInfo: Object,
      clickType: String,
      labelValue: {
        type: Number,
        default: 0
      },
      reSize: {
        type: Boolean,
        default: false
      },
      // 各个业务的相关信息
      currentBusinessObj: Object,
      phoneBarForm: Object
    },
    computed: {
      jumpMerge () {
        return (this.clickFlag === 'merge' || this.labelValue === 6 || this.$route.path.split('/')[2] === 'call') && this.isDailog && this.isTitle
      }
    },
    components: {
      addcus,
      merge
    },
    watch: {
      labelValue (cur, old) {
        this.radio = cur
      },
      // 当点击新增客户时，isDalog值会为true 在合并客户那里初始不了from 当点击合并客户radio时，列表不初始化
      isDalog (cur, pre) {
        if (this.radio === 3 && cur) {
          this.$set(this.bindCustomer, 'form', {})
        }
      }
    },
    methods: {
      addCustomerSuccess () {
        this.$emit('addCustomerSuccess')
      },
      addCustomer (form) {
        if (this.$route.path.split('/')[3] === 'cdr_call') {
          let _id = this.$route.params.id
          form.callId = _id
          form.dealSrc = 'popup'
          form.actionType = 'self'
          form.callTel = this.$route.params.tel
          this.$store.dispatch('addCustomer', form).then((currentCustomer) => {
            this.$router.push(`/index/call/cdr_call/${_id}/cdr`)
            this.$store.commit('call/UPDATE_CURRENT_CUSTOMER_INFO', {customer: currentCustomer.data, callId: _id})
          })
        } else {
          this.$emit('addCustomer', form)
        }
      },
      tab (clickFlag) {
        this.clickFlag = clickFlag
        if (this.radio === 3) {
          this.typeCustomer = addcus
          if (this.$route.path.split('/')[3] === 'cdr_call' && !this.isDailog) {
            this.customer = {phone: [{tel: this.tel, memo: ''}]}
          }
        } else if (this.radio === 6) {
          this.typeCustomer = merge
        }
        let lable = {
          labelValue: this.labelValue,
          title: this.labelTitle
        }
        this.$emit('changeCustomeLabelValue', lable)
      },
      mergeCust (val) {
        if (this.$route.path.split('/')[3] === 'cdr_call') {
          if (val.custInfo) {
            let callId = this.$route.params.id
            let tel = this.$route.params.tel
            if (val.custInfo.phone && val.custInfo.phone.length > 0) {
              let exists = false
              val.custInfo.phone.forEach(function (obj) {
                if (obj.tel === tel) {
                  exists = true
                }
              })
              if (!exists) {
                val.custInfo.phone.push({tel: tel, memo: ''})
              }
            }
            // val.custInfo.phone.push({tel: this.$route.params.tel, memo: ''})
            this.$store.dispatch('callUpdateCustomer', {callId: callId, customer: val.custInfo}).then(
              res => {
                if (!res) {
                  return
                }
                this.$store.commit('call/UPDATE_CURRENT_CUSTOMER_INFO', {callId: callId, customer: val.custInfo})
                if (callId) {
                  this.$router.push('/index/call/cdr_call/' + callId + '/cdr')
                }
                let newData = {
                  customerId: val.custInfo._id,
                  callId: callId,
                  phone: tel,
                  dealSrc: 'popup'
                }
                this.$store.dispatch('callScreenLocationCustomer', newData).then(resp => {
                  this.isDailog = false
                  this.$message({
                    type: 'success',
                    message: this.$t('customer.succMerge')
                  })
                })
              }
            )
          }
        } else {
          this.$emit('merge', val)
        }
      },
      closeDialog (val) {
        this.$emit('closeDialog', false)
      }
    },
    beforeMount () {
      if (this.$route.path.split('/')[3] === 'cdr_call') {
        let tel = this.$route.params.tel
        this.currentBusiness = {
          type: 'customer',
          tabType: 'customer_my'
        }
        if (this.$route.params.label === '3') {
          this.labelValue = 3
          this.customer = {phone: [{tel: tel, memo: ''}]}
          this.tel = tel
        } else if (this.$route.params.label === '6') {
          this.labelValue = 6
          this.tel = tel
        }
      }
      this.radio = this.labelValue
      this.tab()
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .resize-customer
    // 单个页面的时候需要这个高度值
    height calc(100vh - 56px)
  .resize-dialog
    height 430px
  .addCustomer
    position relative
    .title
      background-color $cf-white
      line-height 39px
      height 39px
      color $cf-gray1
      border-bottom 1px solid $c-border1
      .raido-item
        display inline-block
        margin-left 20px
    span
      &:first-child
        margin-left 20px
        margin-right 30px
</style>
