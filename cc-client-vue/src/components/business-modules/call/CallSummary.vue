<template>
  <div>
    <contact-summary-solt  v-loading="loading"  v-if="!loading">
      <template slot="customerSlot">
        <customer-slot
          :customer="customer"
          :custType="custType"
          :currentBusinessObj="currentBusinessObj"
          :isDailog="isDailog"
          @merged="mergeCustomer"
          ></customer-slot>
      </template>
      <template slot="funTabSlot">
        <fun-tab-slot :tabs="tabs" :activeName="tabActiveName" @changeDetailTab="handlerChangeTab" :urlsStres="urlsStr">
          <template slot="callDetailTab">
            <call-detail :refresh="refresh"></call-detail>
          </template>
          <template slot="businessTab">
            <business :busId="busId" :refresh="refresh" :cid="cid" :showHistoryTable="true" @event="businessEvent"></business>
          </template>
          <template slot="contactPlanTab">
            <contact-plan :refresh="refresh" :cid="cid"></contact-plan>
          </template>
          <template slot="historyTab">
            <contact-history :refresh="refresh" :cid="cid"></contact-history>
          </template>
          <template slot="changeLogTab">
            <operation-log  :refresh="refresh" :cid="cid"></operation-log>
          </template>
          <template v-for= "(item, index) in tabUrls" :slot="'item' + index + 'Tab'">
            <div class="iframe-wrap">
              <iframe :src="newUrl(item.url)" frameborder="0" scrolling="auto" class="iframe-con"></iframe>
            </div>
          </template>
        </fun-tab-slot>
      </template>
    </contact-summary-solt>
  </div>
</template>
<script>
  function getToken (store, data) {
    return store.dispatch('getToken', data)
  }
  import ContactSummarySolt from 'components/public-modules/contact-summary/index.vue'
  import CustomerSlot from 'components/public-modules/contact-summary/CustomerSlot'
  import FunTabSlot from 'components/public-modules/contact-summary/FunTab'
  import OperationLog from 'components/public-modules/cust-tab-content/operation-log/'
  import ContactPlan from 'components/public-modules/cust-tab-content/contact-plan/'
  import ContactHistory from 'components/public-modules/cust-tab-content/contact-history/'
  import Business from 'components/public-modules/cust-tab-content/business/'
  import CallDetail from 'components/public-modules/cust-tab-content/call-detail'
  import callApi from '../../../store/api/call'
  import { isEmpty } from 'lodash'
  export default {
    name: 'CallSummary',
    data () {
      return {
        tabActiveName: 'callDetail',
        loading: true,
        refresh: 'callDetail',
        bussinessType: 'call',
        // cid: '',
        isDailog: true,
        tabUrls: '',
        urlsStr: [],
        token: '',
        postData: {
          loginName: this.$store.state.session.user.exten,
          password: this.$store.state.session.user.password
        },
        newBusiness: 0,
        busId: ''
      }
    },
    computed: {
      cid () {
        let routes = this.$route.path.split('/')
        let tabType = routes[3]
        let currentCustomer = this.$store.state.call.current[tabType].currentCustomer
        if (currentCustomer) {
          return currentCustomer._id
        } else {
          return ''
        }
      },
      customer () {
        let routes = this.$route.path.split('/')
        if (routes[2] === 'call') {
          let tabType = routes[3]
          let currentCustomer = this.$store.state.call.current[tabType].currentCustomer
          let tel = ''
          let callInfo = this.$store.state.call.current[tabType].callInfo
          if (callInfo.CONNECT_TYPE === 'normal' || callInfo.CONNECT_TYPE === 'transfer') {
            tel = callInfo.CALL_NO
          } else {
            tel = callInfo.CALLED_NO
          }
          let phone = {phone: [{tel, memo: ''}]}
          return isEmpty(currentCustomer) ? phone : currentCustomer
        } else {
          this.loading = true
        }
      },
      custType () {
        let routes = this.$route.path.split('/')
        if (routes[2] === 'call') {
          let tabType = routes[3]
          return this.$store.state.call.current[tabType].currentCustomer ? 'one' : 'unk'
        } else {
          this.loading = true
        }
      },
      currentBusinessObj () {
        // 传递给客户模块的业务信息
        let routes = this.$route.path.split('/')
        if (routes[2] === 'call') {
          let tabType = routes[3]
          let callId = routes[4]
          return {tabType: tabType, type: this.bussinessType, callId: callId}
        } else {
          this.loading = true
        }
      },
      tabs () {
        let routes = this.$route.path.split('/')
        let tabType = routes[3]
        if (routes[2] === 'call') {
          let customer = this.$store.state.call.current[tabType].currentCustomer
          let tabs1 = {callDetail: {disabled: false}, businessShow: {disabled: true}, plan: {disabled: true}, history: {disabled: true}, changeLog: {disabled: true}, tabUrl: {disabled: false}}
          let tabs2 = {callDetail: {disabled: false}, businessShow: {disabled: false}, plan: {disabled: false}, history: {disabled: false}, changeLog: {disabled: false}, tabUrl: {disabled: false}}
          return isEmpty(customer) ? tabs1 : tabs2
        }
      }
    },
    watch: {
      $route (to, form) {
        let routes = to.path.split('/')
        if (routes[2] === 'call' || routes[4]) {
          this.fetchData()
        } else {
          this.loading = true
        }
      }
    },
    components: {
//      ContactSummary
      ContactSummarySolt,
      CustomerSlot,
      FunTabSlot,
      Business,
      ContactPlan,
      ContactHistory,
      OperationLog,
      CallDetail
    },
    methods: {
      businessEvent (eventData) {
        let data = eventData.data
        this.busId = data._id
        if (eventData.event !== 'changeBusinessMaster') {
          this.$store.dispatch('getBusinessDetailById', {_id: this.busId})
        }
        this.$store.commit('business/REFRESH_CUSTOMER_BUSINESS_HISTORY', this.cid)
      },
      fetchData () {
        this.tabActiveName = 'callDetail'
        this.refresh = 'callDetail'
        let routes = this.$route.path.split('/')
        let tabType = routes[3]
        let callSheetId = routes[4]
        this.loading = true
        if (routes[2] !== 'call' || !routes[4]) {
          return
        }
        let data = { data: routes[4], type: routes[3] }
        let p1 = this.$store.dispatch('relocationCustomer', data)
        let promises = [p1]
        // p2 是为了 newUrl 时有callInfo
        if (!this.$store.state.call.current[tabType].callInfo) {
          let p2 = callApi.queryCallList({_id: callSheetId})
          promises.push(p2)
        }
        Promise.all(promises).then(([res1, res2]) => {
          if (res2 && res2.list && res2.list[0]) {
            this.$store.state.call.current[tabType].callInfo = res2.list[0]
          }
          this.loading = false
        })
      },
      newUrl (url) {
        let routes = this.$route.path.split('/')
        let tabType = routes[3]
        let arrToStr = function (arr, field) {
          if (!Array.isArray(arr)) {
            return ''
          }
          let str = ''
          for (let i = 0; i < arr.length; i++) {
            str += arr[i][field] + ','
          }
          if (str.indexOf(',') !== -1) {
            str = str.substring(0, str.lastIndexOf(','))
          }
          return str
        }
        let callInfo = this.$store.state.call.current[tabType].callInfo || {}
        let agents = this.$store.state.session.dicMap.agents
        let agent = {}
        for (let j = 0; j < agents.length; j++) {
          if (agents[j]._id === callInfo.DISPOSAL_AGENT) {
            agent = agents[j]
          }
        }
        url += '?tabType=call' + '&displayName=' + (agent.displayName || '') + '&exten=' + (agent.exten || '')
        if (callInfo.CUSTOMER_ID && callInfo.CUSTOMER_ID !== '' && callInfo.CUSTOMER_ID !== '00000000000000000000' && this.currentCustomer !== {}) {
          let currentCustomer = this.customer
          let custStatusName = this.$store.state.session.dicMap.custTmpls[0].status[currentCustomer.status]
          url += '&name=' + (currentCustomer.name || '') + '&phone=' + arrToStr(currentCustomer.phone, 'tel') + '&status=' + (custStatusName || '') + '&title=' + (currentCustomer.title || '') + '&email=' + arrToStr(currentCustomer.email, 'email') +
            '&weixin=' + arrToStr(currentCustomer.weixin, 'num') + '&province=' + (currentCustomer.province || '') + '&city=' + (currentCustomer.city || '') + '&address=' + (currentCustomer.address || '') + '&note=' + (currentCustomer.note || '') +
            '&web=' + (currentCustomer.web || '')
        }
        if (this.$store.state.session.account.tokenCheck) {
          url += '&token=' + (this.token.token || '') + '&tokenId=' + (this.token.tokenId || '')
        }
        return url.replace('http://', '//')
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
        this.$store.dispatch('callLocationCustomer', data)
        this.isDailog = false
        this.$message({
          type: 'success',
          message: this.$t('customer.succMerge')
        })
      },
      handlerChangeTab (tabName) {
        this.tabActiveName = tabName
        this.refresh = tabName
        if (tabName === 'business') {
          this.busId = ''
        }
      }
    },
    created () {
      this.fetchData()
    },
    beforeMount () {
      let p1 = this.$store.dispatch('getCache', {type: 'tabUrlAddress'}).then(() => {
        this.tabUrls = this.$store.state.session.dicMap.tabUrlAddress
        for (let i in this.tabUrls) {
          this.urlsStr.push(this.newUrl(this.tabUrls[i].url.replace('http://', '//')))
        }
      })
      let p2 = getToken(this.$store, this.postData).then((token) => {
        this.token = token
      })
      let p3 = this.$store.dispatch('getCache', {type: 'custTmpls'}).then(() => {
      })
      let p4 = this.$store.dispatch('getCache', {type: 'agents'}).then(() => {
      })
      Promise.all([p1, p2, p3, p4]).then(() => {
        this.loading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .iframe-wrap
    height calc(100vh - 188px)
  .iframe-con
    width 100%
    height 100%
</style>
