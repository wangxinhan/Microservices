<template>
  <div>
    <div v-if="popIframe" class="iframe-wrap">
      <iframe :src="popIframeUrl" frameborder="0"></iframe>
    </div>
    <div v-else>
      <contact-summary-solt  v-if="!loading">
        <template slot="customerSlot">
          <customer-slot
            :customer="customer"
            :custType="custType"
            :currentBusinessObj="currentBusinessObj"
            @merged="mergeCustomer"
            ></customer-slot>
        </template>
        <template slot="funTabSlot">
          <fun-tab-slot :tabs="tabs" :activeName="tabActiveName" @changeDetailTab="handlerChangeTab" :urlsStres="urlsStr">
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
              <operation-log :refresh="refresh" :cid="cid"></operation-log>
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
  import { isEmpty } from 'lodash'
  import customerApi from '../../../store/api/customer'
  export default {
    name: 'CdrCallSummary',
    data () {
      return {
        tabActiveName: 'businessShow',
        loading: false,
        cid: '',
        custType: '',
        iframeUrl: this.$store.state.call.transCache.megNum,
        popIframe: false,
        refresh: 'business',
        bussinessType: 'call',
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
    watch: {
      '$route': 'fetchData'
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
    computed: {
      popIframeUrl () {
        let url = this.$store.state.call.transCache.megNum
        if (url) {
          this.popIframe = true
          return url.replace('http://', '//')
        } else {
          return ''
        }
      },
      currentBusinessObj () {
        // 传递给客户模块的业务信息
        let routes = this.$route.path.split('/')
        let tabType = routes[3]
        return {tabType: tabType, type: this.bussinessType}
      },
      tabs () {
        let customer = this.$store.state.call.current.cdr_call.currentCustomer
        let tabs1 = {businessShow: {disabled: true}, plan: {disabled: true}, history: {disabled: true}, changeLog: {disabled: true}, tabUrl: true}
        let tabs2 = {businessShow: true, plan: true, history: true, changeLog: true, tabUrl: true}
        return isEmpty(customer) ? tabs1 : tabs2
      },
      customer () {
        return this.$store.state.call.current.cdr_call.currentCustomer || null
      }
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
      },
      fetchData () {
        let routes = this.$route.path.split('/')
        this.$emit('routeChange', routes[3])
        let callSheetId = this.$route.path.split('/')[4]
        let callInfo = null
        let list = this.$store.state.call.callList.cdr_call.list || JSON.parse(window.sessionStorage.callList || '[]')
        if (callSheetId) {
          this.$store.commit('call/SET_READ', callSheetId)
          this.$store.commit('call/COUNT_UNREAD_CDR')
        }
        if (!list || list.length === 0) {
          this.$router.push('/index/call/cdr_call')
          return
        }
        for (let i = 0; i < list.length; i++) {
          if (list[i]._id === callSheetId) {
            callInfo = list[i]
          }
        }
        let tel = ''
        if (callInfo) {
          tel = callInfo.CALL_NO
          if (callInfo.CUSTOMER_ID && callInfo.CUSTOMER_ID !== '00000000000000000000') {
            customerApi.queryCustomerInfo({_id: callInfo.CUSTOMER_ID}).then(
              resp => {
                this.$store.commit('call/SET_CUSTOMER_INFO', {data: resp.data, callSheetId: callInfo._id})
                let custObj = this.$store.state.call.current.cdr_call.currentCustomer
                if (custObj) {
                  this.customer = custObj
                  this.cid = this.customer._id
                }
              }
            )
          } else {
            customerApi.queryCustomerList({phone: tel})
              .then(
              response => {
                if (response.success) {
                  if (response.list && response.list.length === 1) {
                    customerApi.queryCustomerInfo({_id: response.list[0]._id})
                      .then(res1 => {
                        if (res1.success && res1.data) {
                          this.$store.commit('call/SET_CUSTOMER_INFO', {data: res1.data, callSheetId: callInfo._id})
                          this.customer = this.$store.state.call.current.cdr_call.currentCustomer
                          this.cid = this.customer._id
                        }
                      })
                  } else if (response.list && response.list.length > 1) {
                    let autoCust = {
                      autoCustObj: {
                        list: response.list,
                        count: response.list.length || 0
                      },
                      autoCustLength: response.list.length || 0
                    }
                    this.$store.commit('call/SET_AUTO_CUST', {callSheetId: callInfo._id, autoCust})
                  }
                }
              }
            )
          }
          this.custType = callInfo.CUSTOMER_TYPE
          if (this.$store.state.call.transCache.megNum) {
            this.popIframe = true
            return
          }
          if (this.custType === 'unk') {
            this.tabActiveName = ''
            this.$router.push('/index/call/cdr_call/add/' + tel + '/3/' + callInfo._id + '?flag=add')
          } else if (this.custType === 'one') {
            this.tabActiveName = 'business'
          } else if (this.custType === 'multi') {
            this.$router.push('/index/call/cdr_call/add/' + tel + '/6/' + callInfo._id + '?flag=add')
          }
        }
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
        let callInfo = {}
        if (this.$store.state.call.current[tabType] && this.$store.state.call.current[tabType].callInfo) {
          callInfo = this.$store.state.call.current[tabType].callInfo
        }
        let currentCustomer = this.customer
        url += '?tabType=normal&originCallNo=' + (callInfo.CALL_NO || '') + '&originCalledNo=' + (callInfo.CALLED_NO || '') + '&queue=' + (callInfo.ERROR_MEMO || '') + '&offeringTime=' + (callInfo.OFFERING_TIME || '') +
          '&callerProvince=' + (callInfo.PROVINCE || '') + '&callerCity=' + (callInfo.DISTRICT || '') + '&callSheetId=' + (callInfo.CALL_SHEET_ID || '') + '&Agent=' + (callInfo.Agent || '') +
          '&RingTime=' + (callInfo.RingTime || '') + '&queueName=' + (callInfo.QUEUE_NAME || '') + '&ivrkey=' + (callInfo.ivrkey || '') + '&loginName=' + this.$store.state.session.user.loginName +
          '&exten=' + this.$store.state.session.user.exten + '&displayName=' + this.$store.state.session.user.displayName + '&tabType=call'
        if (currentCustomer) {
          let custStatusName = this.$store.state.session.dicMap.custTmpls[0].status[currentCustomer.status]
          url += '&name=' + (currentCustomer.name || '') + '&status=' + (custStatusName || '') + '&title=' + (currentCustomer.title || '') + '&phone=' + arrToStr(currentCustomer.phone, 'tel') + '&email=' + arrToStr(currentCustomer.email, 'email') +
            '&weixin=' + arrToStr(currentCustomer.weixin, 'num') + '&province=' + (currentCustomer.province || '') + '&city=' + (currentCustomer.city || '') + '&note=' + (currentCustomer.note || '') +
            '&web=' + (currentCustomer.web || '')
        }
        if (this.$store.state.session.account.tokenCheck) {
          url += '&token=' + (this.token.token || '') + '&tokenId=' + (this.token.tokenId || '')
        }
        return url.replace('http://', '//')
      }
    },
    beforeMount () {
      this.fetchData()
      this.$store.dispatch('getCache', {type: 'tabUrlAddress'}).then(() => {
        this.tabUrls = this.$store.state.session.dicMap.tabUrlAddress
        for (let i in this.tabUrls) {
          this.urlsStr.push(this.newUrl(this.tabUrls[i].url.replace('http://', '//')))
        }
      })
      getToken(this.$store, this.postData).then((token) => {
        this.token = token
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .iframe-wrap
    height calc(100vh - 54px)
  iframe
    height 100%
    width 100%
</style>
