
<template>
<div class="merge">
  <div class="m-title">
    合并客户
  </div>
  <div class="merge-content">
  <main>
    <div class="m-tag">
      <h3>说明:</h3>
      <p>1.选择要合并的两个客户，并确定合并方向(客户A合并到客户B)。</p>
      <p>2.合并时会保留客户B的数据，其中客户B中未填的客户信息由客户A补充,同时客户A的联系记录等信息也会合并到客户B中，合并后将删除A客户。</p>
    </div>
    <div class="m-cust">
      <div class="m-cust-go">
        <span class="mc-name" >
          <span class="mc-name__span">{{customerA.name}}</span>
          <el-button class="mc-query" type="text" @click.stop="dialogTableVisible('a')">
            <i class="iconfont icon-sousuo"></i>
          </el-button>
        </span>
      </div>
      <span class="goto">合并到</span>
      <div class="m-cust-to">
        <span class="mc-name">
          <span class="mc-name__span">{{customerB.name}}</span>
          <el-button class="mc-query" type="text"  @click.stop="dialogTableVisible('b')">
          <i class="iconfont icon-sousuo"></i>
          </el-button>
        </span>

      </div>
      <div class="m-cust-scan">
        <el-button class="mc-query" type="success" @click="isFormFun" :disabled="btn">合并预览</el-button>
      </div>
      <el-dialog modal-append-to-body lock-scroll top="10%" title="选择客户" class="customer-dialog" v-model.trim="isDalog" v-if="isDalog">
        <add-customer
          :isBlight = "false"
          :isTitle = "false"
          :labelValue = "6"
          :isDalog = "isDalog"
          :clearnTable="clearnTable"
          :reSize="true"
          :heightSize = "560"
          @merge="mergeCustomer"
        ></add-customer>
      </el-dialog>
    </div>
    <div class="merg-form" v-if="isMergeForm">
      <edit-cus
        :custInfo="mergedCustInfo"
        :editCustType ="'update'"
        :isMergeCustomer = "true"
        :currentBusinessObj = "currentBusinessObj"
        @editCust='updateCustomer'
      ></edit-cus>
    </div>
  </main>
  </div>
</div>
</template>
<script>
  import addCustomer from '../../business-modules/customer/AddCustomer.vue'
  import EditCus from '../../business-modules/customer/AddCus.vue'
  import { deepClone } from '../../../utils/m7Utils.js'
  export default {
    name: 'MergeCustomers',
    data () {
      return {
        isForm: false,
        radio: 0,
        btn: false,
        isMergeForm: false,
        isDalog: false,
        isresult: true,
        isShowHearder: false,
        tableData: [],
        multipleSelection: [],
        input: '',
        clearnTable: false,
        customerTag: '',
        currentBusinessObj: {
          type: 'customer',
          tabType: 'customer_my'
        },
        customerA: {name: '客户A', _id: 'a'},
        customerB: {name: '客户B', _id: 'b'},
        mergedCustInfo: {},
        select: 'phone',
        loading: true,
        tabType: ''
      }
    },
    methods: {
      updateCustomer (form) {
        let custA = deepClone(this.customerA.custInfo)
        let custB = deepClone(this.customerB.custInfo)
        this.tabType = form.owner === this.$store.state.session.sessionId ? 'customer_my' : 'customer_all'
        form.type = 'customer'
        form.tabType = this.tabType
        form.id = custB._id
        form.custAId = custA._id
        form.custBId = custB._id
        this.$store.dispatch('mergeCustomer', form).then(() => {
          this.$router.push(`/index/customer/merge`)
          this.customerA = { name: '客户A', _id: 'a' }
          this.customerB = { name: '客户B', _id: 'b' }
          this.isMergeForm = false
        })
      },
      mergeCustomer (val) {
        this.isDalog = false
        this.customerTag === 'a' ? this.customerA = val : this.customerB = val
        if (this.customerA._id === this.customerB._id) {
          // this.$alert.title = ''
          // this.$alert('请不要合并同一个客户')
          this.$message({
            message: '请不要合并同一个客户',
            type: 'warning'
          })
          this.customerTag === 'a' ? this.customerA = {name: '请选择A客户', _id: 'a'} : this.customerB = {name: '请选择B客户', _id: 'b'}
        }
      },
      dialogTableVisible (arg) {
        this.isDalog = true
        this.btn = false
        this.customerTag = arg
      },
      isFormFun () {
        this.btn = true
        this.isMergeForm = true
        if (this.customerA._id !== 'a' && this.customerB._id !== 'b') {
          let custA = deepClone(this.customerA.custInfo)
          let custB = deepClone(this.customerB.custInfo)
          // 归属
          if (custB.owner === 'NA' && custB.categoryId === 'NA') {
            custB.owner = custA.owner
            custB.categoryId = custA.categoryId
          }
          delete custA.owner
          delete custA.categoryId
          // 电话
          if (custA.phone && custB.phone) {
            custB.phone = [...custB.phone, ...custA.phone]
          } else if (!custB.phone || custB.phone.length === 0) {
            custB.phone = custA.phone
          }
          delete custA.phone
          // 邮箱
          if (custA.email && custB.email) {
            custB.email = [...custB.email, ...custA.email]
          } else if (!custB.email || custB.email.length === 0) {
            custB.email = custA.email
          }
          delete custA.email
          // 微信
          if (custA.weixin && custB.weixin) {
            custB.weixin = [...custB.weixin, ...custA.weixin]
          } else if (!custB.winxin || custB.winxin.length === 0) {
            custB.weixin = custA.weixin
          }
          delete custA.weixin
          // 附件
          if (!custB.attachs || custB.attachs.length === 0) {
            custB.attachs = custA.attachs
          }
          delete custA.attachs

          this.mergedCustInfo = Object.assign({}, custA, custB)

          this.isForm = true
        } else {
          // this.$alert.title = ''
          // this.$alert('请选完所有需要合并的客户')
          this.isMergeForm = false
          this.btn = false
          this.$message({
            message: '请选完所有需要合并的客户',
            type: 'warning'
          })
        }
      }
    },
    watch: {
      isDalog (cur, pre) {
        if (!cur) {
          this.clearnTable = true
        } else {
          this.isMergeForm = false
        }
      }
    },
    components: {
      addCustomer,
      EditCus
    },
    beforeMount () {
      let tab = this.$route.path.split('/')[2]
      let tabType = this.$route.params.tabType
      if (tab === 'call') {
        this.input = this.$store.state[tab].current[tabType].callInfo.CALLED_NO
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common.styl"
  .merge
    .merge-content
      height calc(100vh - 184px)
      padding-right 5.5%
      overflow-y auto
      margin 30px 0 0 30px
    .m-title
      border-bottom 1px solid $c-border1
      height 39px
      background $cf-white
      line-height 39px
      padding-left 24px
      font-size 16px
      color $cf-gray1
    .m-tag
      color #00c7d1
      border-radius 6px
      margin-bottom 30px
    .m-cust
      text-align left
      display flex
      .m-cust-go
      .m-cust-to
        .mc-query
          position absolute
          top -6px
          right 8px
          i
            color #ccc
            font-size 20px
            font-weight 200
      .m-cust-go
        flex 3
        cursor not-allowed
      .goto
        color #00c7d1
        line-height 30px
        flex 1
      .m-cust-to
        flex 3
        cursor not-allowed
      .m-cust-scan
        flex 1
        .mc-query
          background-color $c-main
          height 30px
          line-height 10px
          border-color $c-main
      .mc-name
          position relative
          border 1px solid $c-border1
          border-radius 4px
          padding 0 32px 0 6px
          display inline-block
          line-height 36px
          min-width 190px
          height 30px
          color $cf-gray1
          line-height 30px
          .mc-name__span
            display inline-block
            max-width 14em
            @extend .ellipsis
</style>
