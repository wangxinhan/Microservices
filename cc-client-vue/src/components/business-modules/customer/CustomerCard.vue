<template>
  <div v-if="!loading" class="customer-card">
    <el-menu
      :default-active = "defaultActive"
      @select="handleSelect"
      :router="active">
      <el-menu-item class="card" style="padding: 0" v-for="(item, index) in cardList" :index="handleSplit(item._id)"
      :class="{'is-active': $route.path.split('/')[4] === item._id}">
        <div class="cust-type">
          <label class="fake-checkbox" :class="{'visible': batch[tabType].isBatchShow}" v-on:click.stop="">
            <input type="checkbox" :value="item._id" v-model.trim="item.checked" @change="checkThis(item.checked)">
            <span></span>
            <i class="fake-label"></i>
          </label>
          <span class="ct">
              <customer-avatar :status="item.status" :isRead="item.isRead" :paddingSize="8" :size="24"></customer-avatar>
          </span>
        </div>
        <div :class="['info', tabType==='customer_plan'?'cust-plan__info':'']">
          <ul>
            <li><h4>{{ item.name }}({{ status(item.status) }})</h4></li>
            <li v-if="tabType==='customer_plan'"><span class="action">{{item.action||'无'}}</span></li>
            <li v-else><span class="action">{{item.title||'无'}}</span></li>
          </ul>
        </div>
        <div :class="['remark', tabType==='customer_plan'?'remark__paln':'']">
          <span :class="['date', notifyTimeClass(item.notifyTime)]"
                v-if="tabType==='customer_plan'">
          {{item.notifyTime.split(':')[0]}}:{{item.notifyTime.split(':')[1]}}</span>
          <div  class="cust-allmy-content" v-else>
            <span class="date">{{item.lastUpdateTime.split(' ')[0]}}</span>
             <span v-if="tabType==='customer_all'" class="cust-all-owner">{{custOwner(item)}}</span>
          </div>
        </div>
      </el-menu-item>
    </el-menu>
    <no-record v-if="cardList && cardList.length<=0"></no-record>
  <!-- 批处理开始 -->
    <div class="batch_cover" v-show="batch[tabType].isBatchShow"></div>
    <div class="batch_btm" v-show="batch[tabType].isBatchShow"></div>
    <div class="batch" :class="{'show': batch[tabType].isBatchShow}">
      <el-checkbox v-model.trim="batch[tabType].allChecked" @change="checkAll()">{{$t('public.checkAll')}}</el-checkbox>
      <card-batch v-if="batch[tabType].operator"
      :tabType="tabType"
      :batchOperator="batch[tabType]"
      @checkNone="checkNone"
      @deleteCustomer="deleteCustomer"
      @exportCustomer="exportCustomer"
      @exportCustomerCdr="exportCustomerCdr"
      @exportBatchMonitor="exportBatchMonitor"
      @cancelCustomerContactPlan="cancelCustomerContactPlan"
      @editStatus="editStatus"
      @custConvert="custConvert"
      @assignCustomer="assignCustomer"
      ></card-batch>
    </div>
    <update-status-dialog
      :isUpStaDialog = "isUpStaDialog"
      @cancelAndSubmit="upStaDialogClose"
      :count="batchCount"
    >
    </update-status-dialog>
    <customer-conversion
      :isCusCvDialog = "isCusCvDialog"
      @cancelAndSubmit="cusCvDialogClose"
      :count="batchCount"
    ></customer-conversion>
    <assign-customer
      :isAssignDialog = "isAssignDialog"
      @cancelAndSubmit="assignDialogClose"
      :count="batchCount"
    >
    </assign-customer>
  <!-- 批处理结束 -->
  </div>
</template>
<script>
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import CardBatch from 'components/public-modules/card/CardBatch'
  import { isAllowDeleteCustomer, isAllowExportCustomer, isAllowAssignCustomer, isNotAllowEditStatus, isAllowConvertCustomer, isAllowExportCustomerCdr, isAllowExportBatchMonitor, getNotifyDate } from '../../../utils/customerUtils.js'
  import UpdateStatusDialog from './UpdateStatusDialog'
  import CustomerConversion from './CustomerConversion'
  import NoRecord from 'components/public-modules/card/NoRecord'
  import AssignCustomer from './AssignCustomer'
  export default {
    name: 'CustomerCard',
    props: {
      cardList: Array,
      type: String,
      tabType: String,
      clearChecked: String,
      count: Number,
      condition: Object
    },
    data () {
      return {
        agents: null,
        custCategorys: null,
        // 批处理更新客户状态模态框出现的控制
        isUpStaDialog: false,
        // 批处理转移客户模态框
        isCusCvDialog: false,
        isAssignDialog: false,
        batchCount: 0,
        loading: true,
        active: true,
        defaultActive: '',
        dbType: '',
        batch: {
          customer_my: {
            batchItem: [],
            allChecked: false,
            isBatchShow: false,
            checkedCount: 0,
            operator: []
          },
          customer_plan: {
            batchItem: [],
            allChecked: false,
            isBatchShow: false,
            checkedCount: 0,
            operator: []
          },
          customer_all: {
            batchItem: [],
            allChecked: false,
            isBatchShow: false,
            checkedCount: 0,
            operator: []
          }
        }
      }
    },
    watch: {
      cardList () {
        this.defaultActive = this.$route.path
      },
      // clearChecked 变化 再次执行
      clearChecked: 'checkNone'
    },
    components: {
      CustomerAvatar,
      CardBatch,
      UpdateStatusDialog,
      CustomerConversion,
      NoRecord,
      AssignCustomer
    },
    methods: {
      notifyTimeClass (date) {
        return getNotifyDate(date).type
      },
      // 按照 卡片的_id不同设置不同路由
      handleSplit (index) {
        return '/index/' + this.type + '/' + this.tabType + '/' + index
      },
      handleSelect (index) {
        this.$emit('changeCardItem')
      },
      status (status) {
        let cs = this.$store.state.session.dicMap.custTmpls[0].status[status]
        if (cs) {
          return cs
        } else {
          return this.$t('customer.deleteStatus')
        }
      },
      custOwner (item) {
        if (this.tabType === 'customer_all') {
          for (let i = 0; i < this.agents.length; i++) {
            if (this.agents[i]._id === item.owner) {
              return this.agents[i].displayName
            }
          }
          for (let i = 0; i < this.custCategorys.length; i++) {
            if (this.custCategorys[i]._id === item.categoryId) {
              return this.custCategorys[i].cName.split('[')[0]
            }
          }
          return this.$t('customer.noOwner')
        }
      },
      getChecked () { // 单选获取数组
        return this.cardList.filter(item => item.checked).map(item => item._id)
      },
      checkThis (checked) { // 单个选中传送数组和展示批量
        let checkedArr = this.getChecked()
        let isBatchShow = checkedArr.length > 0
        this.batch[this.tabType].allChecked = checkedArr.length === this.$store.state.customer.customerList[this.tabType].count
        this.batch[this.tabType].batchItem = checkedArr
        this.batch[this.tabType].isBatchShow = isBatchShow
        this.batch[this.tabType].checkedCount = checkedArr.length
      },
      checkAll () { // 全选&取消全选
        this.batch[this.tabType].isBatchShow = this.batch[this.tabType].allChecked
        this.cardList.forEach((item) => {
          item.checked = this.batch[this.tabType].allChecked
        })
        this.batch[this.tabType].checkedCount = this.batch[this.tabType].allChecked ? this.$store.state.customer.customerList[this.tabType].count : 0
      },
      checkNone () {
        this.batch[this.tabType].allChecked = false
        this.batch[this.tabType].batchItem = []
        this.batch[this.tabType].isBatchShow = false
        this.cardList.forEach((item) => {
          item.checked = false
        })
      },
      transferData (condition) {
        let data = {}
        for (let key in condition) {
          if (condition[key] && condition[key].length > 0) {
            data[key] = condition[key]
          }
        }
        delete data.page
        delete data.limit
        return data
      },
      deleteCustomer () {
        let data = {
          dbType: this.dbType
        }
        let count
        if (this.batch[this.tabType].allChecked) {
          Object.assign(data, this.transferData(this.condition))
          count = this.count
        } else {
          let ids = this.getChecked()
          data._id = { $in: ids }
          count = ids.length
        }
        let deleteCustomerMessageWithLength = 'customer.deleteCustomerMessageWithLength'
        if (count > 500) {
          deleteCustomerMessageWithLength = 'customer.deleteCustomerMessageWithLength500'
          if (count > 10000) {
            deleteCustomerMessageWithLength = 'customer.deleteCustomerMessageWithLength10000'
          }
          this.delConfirm({
            confirmCentent: deleteCustomerMessageWithLength,
            confirmTitle: 'customer.deleteCustomerRemindOne',
            data: data,
            count,
            del: 'customer.deleteCustomerMessageOne',
            flag: 'next'
          }).then(val => {
            if (!val) {
              this.delConfirm({
                confirmCentent: deleteCustomerMessageWithLength,
                confirmTitle: 'customer.deleteCustomerRemindTwo',
                data: data,
                count: count,
                del: 'customer.deleteCustomerMessageTwo',
                btn: 'customer.deleteCustomerButtonTwo',
                flag: 'next'
              }).then(val => {
                if (!val) {
                  this.delConfirm({
                    confirmCentent: deleteCustomerMessageWithLength,
                    confirmTitle: 'customer.deleteCustomerRemindThree',
                    data: data,
                    count: count,
                    del: 'customer.deleteCustomerMessageThree',
                    btn: 'customer.deleteCustomerButtonThree',
                    flag: 'lastConfirm'
                  })
                }
              })
            }
          })
        } else {
          this.delConfirm({
            confirmCentent: deleteCustomerMessageWithLength,
            confirmTitle: 'customer.deleteCustomer',
            data: data,
            count: count,
            del: 'customer.deleteCustomerMessageOne',
            flag: 'lastConfirm'
          })
        }
      },
      delConfirm (data) {
        return this.$confirm(this.$t(data.confirmCentent, { length: data.count, next: this.$t(data.del) }), this.$t(data.confirmTitle), {
          confirmButtonText: this.$t(data.btn) || this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then((v) => {
          if (data.flag !== 'lastConfirm') {
            return false
          } else {
            return this.$store.dispatch('deleteCustomer', data.data).then(() => {
              // 成功后重置批量选择
              this.checkNone()
              this.$store.commit('customer/EMPTY_RIGHT')
              this.$message({
                type: 'success',
                message: this.$t('customer.deleteCustomerSuccess')
              })
            })
          }
        }).catch((err) => {
          if (err === 'cancel') {
            return 'cancel'
          }
        })
      },
      exportCustomer () {
        let exportFun = 'exportCustomer'
        let data = {
          Method: 'exportCustomer2In',
          Query: {
            dbType: this.dbType,
            menu: this.tabType
          }
        }
        if (this.batch[this.tabType].allChecked) {
          if (this.count > 1000000) {
            this.$message({
              type: 'error',
              message: this.$t('customer.exportCustomerOver1000000')
            })
            return
          }
          if (this.count > 10000) {
            data.Method = 'exportCustomer'
            exportFun = 'exportCustomerMore'
          }
          Object.assign(data.Query, this.transferData(this.condition))
        } else {
          let ids = this.getChecked()
          data.Query._id = { $in: ids }
        }

        this.$store.dispatch(exportFun, data).then(() => {
          if (this.batch[this.tabType].allChecked && this.count > 10000) {
            this.$message({
              type: 'success',
              message: this.$t('customer.exportCustomerOver10000')
            })
          }
          // 成功后重置批量选择
          this.checkNone()
        })
      },
      editStatus () {
        if (this.batch[this.tabType].allChecked) {
          if (this.count > 10000) {
            this.$message({
              type: 'error',
              message: this.$t('customer.batchUpdateOver10000')
            })
            return
          }
          this.batchCount = this.count
        } else {
          let ids = this.getChecked()
          this.batchCount = ids.length
        }
        this.isUpStaDialog = !this.isUpStaDialog
      },
      upStaDialogClose (obj) {
        if (obj.type === 'cancel' || obj.type === 'close') {
          this.isUpStaDialog = obj.bool
          return
        }

        let data = {
          query: {
            dbType: this.dbType
          },
          status: obj.status,
          total: this.batchCount
        }

        if (this.batch[this.tabType].allChecked) {
          Object.assign(data.query, this.transferData(this.condition))
        } else {
          let ids = this.getChecked()
          data.query._id = { $in: ids }
        }
        this.$store.dispatch('batchUpdateCustomerStatus', data).then(() => {
          this.isUpStaDialog = obj.bool
          this.checkNone()
        })
      },
      custConvert () {
        if (this.batch[this.tabType].allChecked) {
          if (this.count > 10000) {
            this.$message({
              type: 'error',
              message: this.$t('customer.batchUpdateOver10000')
            })
            return
          }
          this.batchCount = this.count
        } else {
          let ids = this.getChecked()
          this.batchCount = ids.length
        }
        this.isCusCvDialog = !this.isCusCvDialog
      },
      cusCvDialogClose (obj) {
        if (obj.type === 'cancel' || obj.type === 'close') {
          this.isCusCvDialog = obj.bool
          return
        }

        let data = {
          query: {
            dbType: this.dbType
          },
          categoryId: obj.categoryId,
          total: this.batchCount
        }

        if (this.batch[this.tabType].allChecked) {
          Object.assign(data.query, this.transferData(this.condition))
        } else {
          let ids = this.getChecked()
          data.query._id = { $in: ids }
        }
        this.$store.dispatch('batchUpdateCustomerCategory', data).then(() => {
          this.isCusCvDialog = obj.bool
          this.checkNone()
          this.$router.push('/index/customer')
        })
      },
      assignCustomer () {
        if (this.batch[this.tabType].allChecked) {
          if (this.count > 10000) {
            this.batchCount = 10000
          } else {
            this.batchCount = this.count
          }
        } else {
          let ids = this.getChecked()
          this.batchCount = ids.length
        }
        this.isAssignDialog = !this.isAssignDialog
      },
      assignDialogClose (obj) {
        if (obj.type === 'cancel' || obj.type === 'close') {
          this.isAssignDialog = obj.bool
          return
        }

        let data = {
          query: {
            dbType: this.dbType
          },
          owners: obj.owners
        }

        if (this.batch[this.tabType].allChecked) {
          Object.assign(data.query, this.transferData(this.condition))
          data.total = this.count
        } else {
          let ids = this.getChecked()
          data.query._id = { $in: ids }
          data.total = ids.length
        }

        this.$store.dispatch('assignCustomer', data).then(() => {
          this.isAssignDialog = obj.bool
          // 成功后重置批量选择
          this.checkNone()
        })
      },
      exportCustomerCdr () {
        let data = {
          Method: 'exportCustomerCdr',
          Query: {
            dbType: this.dbType,
            menu: this.tabType
          }
        }

        if (this.batch[this.tabType].allChecked) {
          if (this.count > 10000) {
            this.$message({
              type: 'error',
              message: this.$t('customer.exportCustomerCdrOver10000')
            })
            return
          }
          Object.assign(data.Query, this.transferData(this.condition))
        } else {
          let ids = this.getChecked()
          data.Query._id = { $in: ids }
        }

        this.$store.dispatch('exportCustomerCdr', data).then(() => {
          // 成功后重置批量选择
          this.checkNone()
        })
      },
      exportBatchMonitor () {
        let data = {
          dbType: this.dbType
        }

        if (this.batch[this.tabType].allChecked) {
          if (this.count > 10000) {
            this.$message({
              type: 'error',
              message: this.$t('customer.exportMonitorTaskOver10000')
            })
            return
          }
          Object.assign(data, this.transferData(this.condition))
        } else {
          let ids = this.getChecked()
          data._id = { $in: ids }
        }
        this.$store.dispatch('addCustomerExportMonitorTask', data).then(() => {
          // 成功后重置批量选择
          this.checkNone()
        })
      },
      cancelCustomerContactPlan () {
        let data, count

        if (this.batch[this.tabType].allChecked) {
          if (this.count > 10000) {
            this.$message({
              type: 'error',
              message: this.$t('customer.batchUpdateOver10000')
            })
            return
          }
          data = {
            query: {},
            total: this.count
          }
          count = this.count
          Object.assign(data.query, this.transferData(this.condition))
        } else {
          let ids = this.getChecked()
          data = {
            query: {
              _id: { $in: ids }
            },
            total: ids.length
          }
          count = ids.length
        }

        this.$confirm(this.$t('customer.cancelContactPlanMessageWithLength', { length: count }), this.$t('public.cancelPlan'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then((v) => {
          return this.$store.dispatch('cancelCustomerContactPlan', data).then(() => {
            // 成功后重置批量选择
            this.checkNone()
          })
        }).catch(err => {
          if (err === 'cancel') {}
        })
      }
    },
    beforeMount () {
      let p1 = this.$store.dispatch('getCache', {type: 'custTmpls'})
      let p2 = this.$store.dispatch('getCache', { type: 'agents' })
      let p3 = this.$store.dispatch('getCache', { type: 'custCategorys' })
      Promise.all([p1, p2, p3]).then(([custTmpls, agents, custCategorys]) => {
        let user = this.$store.state.session.user
        let batchOperators = []
        if (isAllowDeleteCustomer(user)) {
          batchOperators.push({ name: 'public.delete', class: 'icon-shanchu', action: 'deleteCustomer' })
        }
        if (isAllowExportCustomer(user)) {
          batchOperators.push({ name: 'public.export', class: 'icon-daochu1', action: 'exportCustomer' })
        }
        if (isAllowAssignCustomer(user)) {
          batchOperators.push({ name: 'public.assign', class: 'icon-fenpei', action: 'assignCustomer' })
        }
        if (!isNotAllowEditStatus(user)) {
          batchOperators.push({ name: 'public.editStatus', class: 'icon-beizhu', action: 'editStatus' })
        }
        if (isAllowConvertCustomer(user)) {
          batchOperators.push({ name: 'public.custConvert', class: 'icon-zhuanhuan', action: 'custConvert' })
        }
        if (isAllowExportCustomerCdr(user)) {
          batchOperators.push({ name: 'public.exportCALL', class: 'icon-daochu', action: 'exportCustomerCdr' })
        }
        if (isAllowExportBatchMonitor(user)) {
          batchOperators.push({ name: 'public.exportTask', class: 'icon-piliang', action: 'exportBatchMonitor' })
        }
        batchOperators.push({ name: 'public.cancelPlan', class: 'icon-quxiaolianxijihua', action: 'cancelCustomerContactPlan' })
        for (let key in this.batch) {
          this.batch[key].operator = batchOperators
        }
        if (custTmpls.length <= 0) { // 新开的账户，没有数据
          return
        }
        this.dbType = custTmpls[0]._id
        this.agents = agents || []
        this.custCategorys = custCategorys
        this.loading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common.styl"
.customer-card
  height 100%
.el-menu-item
  height auto
  line-height inherit
  padding 0
.el-menu-item.is-active
  background-color #e8f5fc
.card:hover
.card:active
  background-color #e8f5fc
  label
    visibility visible
.el-checkbox
  visibility hidden
.e-ch-show
  visibility visible
label
  visibility hidden
label.visible
  visibility visible
.card
  width 100%
  height 60px
  border-bottom 1px solid $c-border1
  background-color $cf-white
  display flex
  cursor pointer
  padding 0
  .cust-type
    display flex
    margin 0 10px
    align-items center
    .el-checkbox
      visibility hidden
    .e-ch-show
      visibility visible
    .ct
      display inline-block
      margin 0 auto
  .info
    flex 1
    display flex
    align-items center
    margin-right 10px
    li
      margin-bottom 2px
      h4
        @extend .ellipsis
        font-weight 400
        max-width 14em
        color #000
      span
        display block
        @extend .ellipsis
        max-width 16em
        color $cf-gray3
  // flex 设为1 其他两个固定是自动张开填充
  .cust-plan__info
    flex 1
    display flex
    align-items center
    li
      h4
        max-width 10em
      span
        max-width 10em
  .remark
    display flex
    padding-top 8px
    justify-content flex-end
    color $cf-gray4
    margin-right 8px
    .cust-allmy-content
      display flex
      flex-direction column
      .cust-all-owner
        display inline-block
        text-align right
        max-width 5em
        @extend .ellipsis
    .date
      width 100%
      text-align right
      line-height 20px
      margin-bottom 2px
    .today-action
      color #f4a524
    .overdue
      color #fd7777
    .usable
      color #999
.visible .fake-label
  height 60px
</style>
