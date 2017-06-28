<template>
  <contact-summary-solt v-if="!loading">
    <template slot="customerSlot">
      <customer-slot
      :customer="customer"
      :currentBusinessObj="currentBusinessObj"
      :callScreen = "callScreen"
      @merged="mergeCustomer"
      :custType="'one'">
      </customer-slot>
    </template>
    <template slot="funTabSlot">
      <fun-tab-slot :tabs="tabs" @changeDetailTab="refreshContent" :activeName="tabActiveName" :urlsStres="urlsStr" :hiddenLine="hiddenLine">
        <template slot="businessTab">
          <business :busId="busId" :cid="cid" :refresh="refresh"  :showHistoryTable="true" v-on:event="businessEvent" :callScreen = "callScreen"></business>
        </template>
        <template slot="contactPlanTab">
          <contact-plan :cid="cid" :refresh="refresh" ></contact-plan>
        </template>
        <template slot="historyTab">
          <contact-history :cid="cid" :refresh="refresh" :callScreen = "callScreen"></contact-history>
        </template>
        <template slot="changeLogTab">
          <operation-log :cid="cid" :refresh="refresh"></operation-log>
        </template>
        <template v-for= "(item, index) in tabUrls" :slot="'item' + index + 'Tab'">
          <div class="iframe-wrap">
            <iframe :src="newUrl(item.url)" frameborder="0" scrolling="auto" class="iframe-con"></iframe>
          </div>
        </template>
      </fun-tab-slot>
    </template>
  </contact-summary-solt>
</template>
<script>
  import ContactSummarySolt from 'components/public-modules/contact-summary/index.vue'
  import CustomerSlot from 'components/public-modules/contact-summary/CustomerSlot'
  import FunTabSlot from 'components/public-modules/contact-summary/FunTab'
  import OperationLog from 'components/public-modules/cust-tab-content/operation-log/'
  import ContactPlan from 'components/public-modules/cust-tab-content/contact-plan/'
  import ContactHistory from 'components/public-modules/cust-tab-content/contact-history/'
  import Business from 'components/public-modules/cust-tab-content/business/'
  function getCustDetail (store, _id, type, tabType) {
    let data = {_id: _id, type: type, tabType: tabType}
    return store.dispatch('queryCustomerInfo', data)
  }
  export default {
    name: 'CustSummary',
    data () {
      return {
        tabs: {plan: true, businessCreate: true, history: true, changeLog: true, tabUrl: true},
        refresh: 'plan',
        tabActiveName: 'plan',
        type: 'customer',
        urlsStr: [],
        postData: {
          loginName: this.$store.state.session.user.exten,
          password: this.$store.state.session.user.password
        },
        tabUrls: '',
        token: '',
        tabType: 'customer_my',
        loading: true,
        newBusiness: 0,
        busId: ''
      }
    },
    props: {
      customerInfo: Object,
      hiddenLine: String,
      callScreen: Boolean
    },
    computed: {
      cid () {
        let cid = ''
        if (this.$route.path.split('/')[2] === 'customer') {
          cid = this.$route.path.split('/')[4]
        }
        // 如果是外呼弹屏的话   路由可能不是任何地方 取不到 id
        if (this.callScreen && this.customerInfo._id) {
          cid = this.customerInfo._id
        }
        return cid
      },
      typeAndCid () {
        return this.$route.path.split('/')[3] + '/' + this.cid
      },
      currentBusinessObj () {
        let rou = this.$route.path.split('/')
        if (this.callScreen) {
          return {
            type: 'cti'
          }
        }
        return {
          type: rou[2] || this.type,
          tabType: rou[3] || this.tabType
        }
      },
      customer () {
        let path = this.$route.path.split('/')
        this.type = path[2]
        this.tabType = path[3]
        if (this.customerInfo && this.callScreen) {
          this.loading = false
          return this.customerInfo
        } else if (this.type === 'customer' && this.tabType) {
          this.loading = false
          return this.$store.state[this.type].current[this.tabType].currentCustomer
        } else {
          this.loading = true
        }
      },
      emptyRight () {
        return this.$store.state.customer.transCache.emptyRight
      }
    },
    methods: {
      refreshContent (name) {
        this.refresh = name
        if (name === 'business') {
          this.busId = ''
        }
      },
      businessEvent (eventData) {
        let data = eventData.data
        this.busId = data._id
        if (eventData.event !== 'changeBusinessMaster') {
          this.$store.dispatch('getBusinessDetailById', {_id: this.busId})
        }
        this.$store.commit('business/REFRESH_CUSTOMER_BUSINESS_HISTORY', this.cid)
      },
      fetchData () {
        this.refresh = 'plan'
        this.loading = true
        let path = this.$route.path.split('/')
        this.type = path[2]
        this.tabType = path[3]
        let _id = ''
        if (path.length >= 5) {
          _id = path[4]
        }
        if (this.type !== 'customer') {
          return null
        }
        this.custType = {
          type: this.type,
          tabType: this.tabType,
          _id: _id || this.customerId
        }
        getCustDetail(this.$store, _id, this.type, this.tabType).then((val) => {
          this.$store.dispatch('getCache', {type: 'custTmpls'}).then(custTmpls => {
            this.loading = false
            this.status = custTmpls[0].status
          })
        })
      },
      newUrl (url) {
        let routes = this.$route.path.split('/')
        let tabType = routes[3]
        let message = 'tabType=' + tabType
        let customer = {}
        customer = this.customer || {}
        let sid = customer.sid + '__' + customer.sourceName
        let diaplayName = this.$store.state.session.user.displayName || ''
        let exten = this.$store.state.session.user.exten || ''
        if (this.customerId) {
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
      mergeCustomer (val) {
        this.$confirm('确定并入这个用户么', '合并用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '成功并入用户!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消并入该用户'
          })
        })
      }
    },
    watch: {
      typeAndCid (cur, old) {
        this.fetchData()
      },
      emptyRight (cur, old) {
        this.$router.push('/index/customer')
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
      let p1 = this.$store.dispatch('getCache', {type: 'tabUrlAddress'}).then(() => {
        this.tabUrls = this.$store.state.session.dicMap.tabUrlAddress
        for (let i in this.tabUrls) {
          this.urlsStr.push(this.newUrl(this.tabUrls[i].url.replace('http://', '//')))
        }
      })
      let p2 = this.$store.dispatch('getToken', this.postData).then((token) => {
        this.token = token
      })
      Promise.all([p1, p2]).then(() => {
        this.fetchData()
        this.loading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .iframe-wrap
    height calc(100vh - 182px)
  .iframe-con
    width 100%
    height 100%
</style>
