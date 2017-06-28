<template>
  <div class="emil-summary" v-loading="cardLoading" :element-loading-text="$t('public.loadingText')" style="height: 600px">
    <contact-summary-solt v-if="!loading">
      <template slot="customerSlot">
        <customer-slot
                :customer="customer"
                :custType="custType"
                :currentBusinessObj="currentBusinessObj"
                :isDailog="isDailog"
                :isUnbunding='true'
                @unbundling="unRelation"
                @addCustomer="addCustomer"
                @merged="mergeCustomer">
        </customer-slot>
      </template>
      <template slot="funTabSlot">
        <fun-tab-slot :tabs="tabs" :activeName="tabActiveName" @changeDetailTab="refreshContent">
          <template slot="emailTab">
            <email-container :refresh="refresh"></email-container>
          </template>
          <template slot="businessTab">
            <business :busId="busId" :cid="customerId" :refresh="refresh" :showHistoryTable="true" @event="businessEvent"></business>
          </template>
          <template slot="contactPlanTab">
            <contact-plan :cid="customerId" :refresh="refresh"></contact-plan>
          </template>
          <template slot="historyTab">
            <contact-history :cid="customerId" :refresh="refresh"></contact-history>
          </template>
          <template slot="changeLogTab">
            <operation-log :cid="customerId" :refresh="refresh"></operation-log>
          </template>
        </fun-tab-slot>
      </template>
    </contact-summary-solt>
  </div>
</template>
<script>
  import ContactSummarySolt from 'components/public-modules/contact-summary/index.vue'
  import CustomerSlot from 'components/public-modules/contact-summary/CustomerSlot'
  import FunTabSlot from 'components/public-modules/contact-summary/FunTab'
  import ContactPlan from 'components/public-modules/cust-tab-content/contact-plan/'
  import ContactHistory from 'components/public-modules/cust-tab-content/contact-history/'
  import Business from 'components/public-modules/cust-tab-content/business/'
  import EmailContainer from './EmailContainer.vue'
  import OperationLog from 'components/public-modules/cust-tab-content/operation-log/'
  import { isEmpty } from 'lodash'
  export default {
    name: 'EmailSummary',
    data () {
      return {
        tabsInit: {
          email: {disabled: false},
          businessCreateBeforePlan: {disabled: true},
          plan: {disabled: true},
          history: {disabled: true},
          changeLog: {disabled: false}
        },
        refresh: 'email',
        tabActiveName: 'email',
        tabType: 'email_todo',
        isDailog: true,
        loading: false,
        cardLoading: false, // 从卡片点击到右边的时候的加载
        customerId: '',
        currentEmail: '',
        newBusiness: 0,
        busId: ''
      }
    },
    computed: {
      tabs () {
        let currentCustomer = this.$store.state.email.current[this.tabType].currentCustomer
        if (isEmpty(currentCustomer)) {
          this.tabsInit.businessCreateBeforePlan.disabled = true
          this.tabsInit.plan.disabled = true
          this.tabsInit.history.disabled = true
          this.tabsInit.changeLog.disabled = true
        } else {
          this.tabsInit.businessCreateBeforePlan.disabled = false
          this.tabsInit.plan.disabled = false
          this.tabsInit.history.disabled = false
          this.tabsInit.changeLog.disabled = false
        }
        return this.tabsInit
      },
      currentBusinessObj () {
        // 传递给客户模块的业务信息
        let dealSrc = this.tabType === 'email_todo' ? 'popupEmail' : 'relocationEmail'
        let currSession = this.$store.state.email.current[this.tabType].currentSession
        let callId = currSession._id || ''
        return {dealSrc: dealSrc, callId: callId, tabType: this.tabType, type: 'email'}
      },
      customer () {
        let currCustomer = this.$store.state.email.current[this.tabType].currentCustomer
        this.customerId = currCustomer._id || ''
        let currSession = this.$store.state.email.current[this.tabType].currentSession
        let addr = ''
        if (!isEmpty(currSession)) {
          addr = currSession.from.addr
        }
        return isEmpty(currCustomer) ? {email: [{email: addr, memo: ''}]} : currCustomer
      },
      custType () {
        let currCustomer = this.$store.state.email.current[this.tabType].currentCustomer
        return isEmpty(currCustomer) ? 'unk' : 'one'
      }
    },
    watch: {
      $route (to, form) {
        if (to.path.split('/')[2] === 'email') {
          this.fetchData()
        }
      }
    },
    created () {
      this.fetchData()
    },
    methods: {
      businessEvent (eventData) {
        let data = eventData.data
        this.busId = data._id
        if (eventData.event !== 'changeBusinessMaster') {
          this.$store.dispatch('getBusinessDetailById', {_id: this.busId})
        }
        this.$store.commit('business/REFRESH_CUSTOMER_BUSINESS_HISTORY', this.customerId)
      },
      fetchData () {
        this.loading = true
        this.refresh = 'email'
        let path = this.$route.path.split('/')
        let type = path[2]
        if (type !== 'email' || path.length <= 3) {
          this.cardLoading = false
          return
        }
        this.cardLoading = true
        this.$emit('routeChange', this.tabType)
        let tabType = path[3]
        let _id = path[4]
        this.tabType = tabType
        let fromEmail = ''
        // 翻页后该数据获取不到
        this.$store.state[type][type + 'List'][this.tabType].list.forEach(function (item) {
          if (item._id === _id) {
            fromEmail = item.from.addr
          }
        })

        const f1 = getEmailDetail(this.$store, _id, fromEmail, this.tabType)
        const f2 = getEmailHistory(this.$store, _id, this.tabType)
        let that = this
        Promise.all([f1, f2]).then((val) => {
          that.loading = false
          that.cardLoading = false
        })
        if (this.tabType === 'email_todo') {
          this.$store.dispatch('refreshLeakNum', {_id: _id})
        }
      },
      addCustomer (val) {
        let currentCustomer = val.customerInfo
        delete val.customerInfo
        let currentSession = this.$store.state.email.current[this.tabType].currentSession
        if (!isEmpty(currentSession) && !isEmpty(currentSession.from.addr)) {
          this.$store.dispatch('updateCurrentEmailListCustomer', {addr: currentSession.from.addr, customer: currentCustomer})
        }
      },
      handlerChangeTab (tabName) {
        this.tabActiveName = tabName
      },
      mergeCustomer (val) {
        let data = {
          customerId: val._id,
          callId: this.$route.params.id,
          custName: val.name,
          customer: val.custInfo,
          submenu: this.tabType,
          sessionId: this.$route.path.split('/')[4]
        }
        return this.$store.dispatch('locationCustomerForEmail', data).then(val2 => {
          this.isDailog = false
          this.$message({
            type: 'success',
            message: '成功并入用户!'
          })
          let currentSession = this.$store.state.email.current[this.tabType].currentSession
          if (!isEmpty(currentSession) && !isEmpty(currentSession.from.addr)) {
            this.$store.dispatch('updateCurrentEmailListCustomer', {addr: currentSession.from.addr, customer: val.custInfo})
          }
        })
      },
      refreshContent (name) {
        this.refresh = name
        if (name === 'business') {
          this.busId = ''
        }
      },
      unRelation () {
        let self = this
        this.$confirm('此操作将解除关联客户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.deleteCustomerImRelation()
        }).catch(() => {})
      },
      deleteCustomerImRelation () {
        let currentSession = this.$store.state.email.current[this.tabType].currentSession
        if (!isEmpty(currentSession) && !isEmpty(currentSession.from.addr)) {
          let data = {
            customerId: this.customerId,
            email: currentSession.from.addr
          }
          this.$store.dispatch('deleteCustomerImRelationForMail', data)
        }
      }
    },
    components: {
      ContactSummarySolt,
      CustomerSlot,
      FunTabSlot,
      Business,
      ContactHistory,
      EmailContainer,
      ContactPlan,
      OperationLog
    }
  }
  function getEmailDetail (store, _id, fromEmail, submenu) {
    let data = {_id: _id, fromEmail: fromEmail, submenu}
    return store.dispatch('popupEmail', data)
  }
  function getEmailHistory (store, sessionId, submenu) {
    let data = {sessionId: sessionId, submenu}
    return store.dispatch('loadEmailHistory', data)
  }
</script>
<style lang="stylus" scoped>
</style>
