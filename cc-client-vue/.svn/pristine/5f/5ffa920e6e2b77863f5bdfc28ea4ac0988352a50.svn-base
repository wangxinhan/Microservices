<template>
  <div>
    <contact-summary-solt :loading="loading"  ref="businessSummary">
        <template slot="customerSlot" v-if="!loading">
          <customer-slot :customer="customer" :custType="custType" :currentBusinessObj="currentBusinessObj"></customer-slot>
        </template>
        <template slot="funTabSlot" v-if="!loading">
          <fun-tab-slot :tabs="tabs" :activeName="tabActiveName" @changeDetailTab="refreshContent" :urlsStres="urlsStr">
            <template slot="businessTab">
              <business :cid="cId" :busId="busId" tabName="business" :showHistory="true" @event="businessEvent"></business>
            </template>
            <template slot="contactPlanTab">
              <contact-plan :cid="cId" :refresh="refresh"></contact-plan>
            </template>
            <template slot="historyTab">
              <contact-history :cid="cId" :refresh="refresh" ></contact-history>
            </template>
            <template slot="changeLogTab">
              <operation-log :cid="cId" :refresh="refresh"></operation-log>
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
  import ContactSummarySolt from 'components/public-modules/contact-summary/index.vue'
  import CustomerSlot from 'components/public-modules/contact-summary/CustomerSlot'
  import FunTabSlot from 'components/public-modules/contact-summary/FunTab'
  import OperationLog from 'components/public-modules/cust-tab-content/operation-log/'
  import ContactPlan from 'components/public-modules/cust-tab-content/contact-plan/'
  import ContactHistory from 'components/public-modules/cust-tab-content/contact-history/'
  import Business from 'components/public-modules/cust-tab-content/business/'
  export default {
    name: 'BusinessSummary',
    data () {
      return {
        tabsInit: {businessShow: {disabled: false}, plan: {disabled: true}, history: {disabled: true}, changeLog: {disabled: true}, tabUrl: {disabled: false}},
        tabActiveName: 'business',
        loading: true,
        tabType: 'business_undeal',
        customerObj: '',
        urlsStr: [],
        cId: '',
        busId: '',
        refresh: 'business',
        tabUrls: [],
        token: '',
        postData: {
          loginName: this.$store.state.session.user.exten,
          password: this.$store.state.session.user.password
        }
      }
    },
    computed: {
      tabs () {
        if (this.customerObj) {
          this.tabsInit.changeLog.disabled = false
          this.tabsInit.plan.disabled = false
          this.tabsInit.history.disabled = false
        } else {
          this.tabsInit.changeLog.disabled = true
          this.tabsInit.plan.disabled = true
          this.tabsInit.history.disabled = true
        }
        return this.tabsInit
      },
      customer () {
        return this.$store.state.business.current.currentCustomer
      },
      custType () {
        return this.$store.state.business.current.currentCustomer ? 'one' : 'business-del'
      },
      refreshBusRight () {
        return this.$store.state.business.transCache.refreshBusRight
      },
      currentBusinessObj () {
        let rou = this.$route.path.split('/')
        return {
          type: rou[2],
          tabType: rou[3]
        }
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      'refreshBusRight': 'fetchData'
    },
    created () {
      this.fetchData()
    },
    methods: {
      refreshContent (name) {
        this.refresh = name
      },
      businessEvent (eventData) {
//        let event = eventData.event
        let data = eventData.data
        this.busId = data._id
        if (this.$route.path.split('/')[3] === 'business_all') {
          let data2 = {
            _id: this.busId
          }
          this.$store.dispatch('getBusinessDetailById', data2)
          this.$store.dispatch('refreshUndealNum')
          this.$store.commit('business/REFRESH_LEFT', Math.random())
        } else {
          this.$store.dispatch('refreshUndealNum')
          this.$store.commit('business/REFRESH_LEFT', Math.random())
          this.$router.push({ path: '/index/business' })
        }
      },
      fetchData () {
        this.tabActiveName = 'business'
        this.refresh = 'business'
        this.loading = true
        let path = this.$route.path.split('/')
        let type = path[2]
        if (type !== 'business') {
          return
        }
        let tabType = path[3]
        this.tabType = tabType
        let _id = path[4]
        let customerId = path[5]
        let query = {
          type: type,
          tabType: tabType,
          _id: _id,
          customerId: customerId
        }
        let p1 = getBusDetail(this.$store, _id, query)
        let p2 = getCustInfo(this.$store, query)
        let that = this
        Promise.all([p1, p2]).then(function () {
          that.customerObj = that.$store.state.business.current.currentCustomer
          if (that.customerObj) {
            that.cId = that.customerObj._id
          }
          that.busId = _id
          that.loading = false
        })
      },
      newUrl (url) {
        let routes = this.$route.path.split('/')
        let tabType = routes[2]
        let message = 'tabType=' + tabType
        let customer = this.customer || {}
        let sid = customer.sid + '__' + customer.sourceName
        let diaplayName = this.$store.state.session.user.displayName || ''
        let exten = this.$store.state.session.user.exten || ''
        if (customer) {
          let phone = ''
          let email = ''
          let weixin = ''
          if (customer.phone && customer.phone.length > 0) {
            for (let i = 0; i < customer.phone.length; i++) {
              phone += customer.phone[i].tel + ','
            }
            phone = phone.substr(0, phone.lastIndexOf(','))
          }
          if (customer.email && customer.email.length > 0) {
            for (let i = 0; i < customer.email.length; i++) {
              email += customer.email[i].email + ','
            }
            email = email.substr(0, email.lastIndexOf(','))
          }
          if (customer.weixin && customer.weixin.length > 0) {
            for (let i = 0; i < customer.weixin.length; i++) {
              weixin += customer.weixin[i].num + ','
            }
            weixin = weixin.substr(0, weixin.lastIndexOf(','))
          }
          let name = customer.name ? customer.name : ''
          let status = customer.status ? customer.status : ''
          let title = customer.title ? customer.title : ''
          let province = customer.province ? customer.province : ''
          let city = customer.city ? customer.city : ''
          let address = customer.address ? customer.address : ''
          let note = customer.note ? customer.note : ''
          let web = customer.web ? customer.web : ''
          let sex = customer.sex ? customer.sex === 0 ? '男' : '女' : ''
          let age = customer.age ? customer.age : ''
          let birth = customer.birth ? customer.birth : ''
          if (city && province) {
            let list = {}
            let that = this
            this.$store.dispatch('getCache', {type: 'options'}).then(() => {
              let newOptions = that.$store.state.session.dicMap.options
              for (let ind in newOptions) {
                if (newOptions[ind].name === '省市') {
                  list = newOptions[ind].options
                }
              }
              for (let i = 0; i < list.length; i++) {
                if (list[i].key === province) {
                  for (let j = 0; j < list[i].options.length; j++) {
                    if ((list[i].options[j]).key === city) {
                      city = list[i].options[j].name
                    }
                  }
                  province = list[i].name
                }
              }
            })
          }
          if (typeof (customer.web) === 'undefined') {
            message = (message ? message + '&' : '') + 'name=' + name + '&status=' + status + '&title=' + title + '&phone=' + phone + '&email=' + email +
              '&weixin=' + weixin + '&province=' + province + '&city=' + city + '&address=' + address +
              '&note=' + note + '&sex=' + sex + '&age=' + age + '&birth=' + birth + '&displayName=' + diaplayName + '&exten=' + exten
          } else {
            message = (message ? message + '&' : '') + 'name=' + name + '&status=' + status + '&title=' + title + '&phone=' + phone + '&email=' + email +
              '&weixin=' + weixin + '&province=' + province + '&city=' + city + '&address=' + address +
              '&note=' + note + '&web=' + web + '&displayName=' + diaplayName + '&exten=' + exten
          }
          if (sid) {
            if (sid.indexOf('__') !== -1) {
              let id = sid.split('__')[0]
              let name = sid.substring(id.length + 2)
              if (id.lastIndexOf('@') !== -1) {
                let end = id.lastIndexOf('@')
                id = id.substr(0, end)
              }
              if (name.lastIndexOf('@') !== -1) {
                let end = name.lastIndexOf('@')
                name = name.substr(0, end)
              }
              message = message + '&qimoClientId=' + id + '&qimoClientName=' + name
            }
          }
        } else {
          if (sid) {
            if (sid.indexOf('__') !== -1) {
              let id = sid.split('__')[0]
              let name = sid.substring(id.length + 2)
              if (id.lastIndexOf('@') !== -1) {
                let end = id.lastIndexOf('@')
                id = id.substr(0, end)
              }
              if (name.lastIndexOf('@') !== -1) {
                let end = name.lastIndexOf('@')
                name = name.substr(0, end)
              }
              message = message + '&qimoClientId=' + id + '&qimoClientName=' + name + '&displayName=' + diaplayName + '&exten=' + exten
            }
          } else {
            message += '&displayName=' + diaplayName + '&exten=' + exten
          }
        }
        if (this.$store.state.session.account.tokenCheck) {
          if (this.token.token) {
            if (message) {
              message += '&token=' + this.token.token + '&tokenId=' + this.token.tokenId
            } else {
              message = 'token=' + this.token.token + '&tokenId=' + this.token.tokenId
            }
          }
        }
        var parpmUrl = ''
        if (message && url.indexOf('?') === -1) {
          parpmUrl = url + '?' + message
        } else if (message) {
          parpmUrl = url + '&' + message
        } else {
          parpmUrl = url
        }
        if (parpmUrl.indexOf('#') !== -1) {
          parpmUrl = parpmUrl.replace(/#/g, '%23')
        }
        return parpmUrl.replace('http://', '//')
      },
      handlerChangeTab (tabName) {
        this.tabActiveName = tabName
      }
    },
    components: {
      ContactSummarySolt,
      CustomerSlot,
      FunTabSlot,
      Business,
      ContactPlan,
      ContactHistory,
      OperationLog
    },
    beforeMount () {
      this.$store.dispatch('getToken', this.postData).then((token) => {
        this.token = token
        this.$store.dispatch('getCache', {type: 'tabUrlAddress'}).then(() => {
          this.tabUrls = this.$store.state.session.dicMap.tabUrlAddress
          for (let i in this.tabUrls) {
            this.urlsStr.push(this.newUrl(this.tabUrls[i].url.replace('http://', '//')))
          }
        })
      })
    }
  }
  function getBusDetail (store, _id, query) {
    let data = {_id: _id}
    return store.dispatch('getBusinessDetailById', data)
  }
  function getCustInfo (store, query) {
    let queryData = {
      _id: query.customerId,
      type: query.type,
      tabType: query.tabType
    }
    return store.dispatch('queryCustomerInfo', queryData)
  }
</script>
<style rel="stylesheet/stylus" lang="stylus" scoped>
  .iframe-wrap
    height calc(100vh - 178px)
  .iframe-con
    width 100%
    height 100%
</style>
