<template>
  <div v-loading="cardLoading" v-if="" :element-loading-text="$t('public.loadingText')" style="height: 600px">
    <contact-summary-solt v-show="showRightDetail" :loading="loading" class="webchat_summary" v-if="!loading" >
      <template slot="customerSlot">
        <customer-slot
                :customer="customer"
                :custType="custType"
                :currentBusinessObj="currentBusinessObj"
                :isDailog="isDailog"
                :isUnbunding='true'
                @unbundling="unbundling"
                @addCustomer="addCustomer"
                @merged="mergeCustomer"
                @autoPerson="setAutoCustPerson">
        </customer-slot>
      </template>
      <template slot="funTabSlot">
        <fun-tab-slot :tabs="tabs" :activeName="tabActiveName" @changeDetailTab="refreshContent" :urlsStres="urlsStr">
          <template slot="webchatTab">
            <webchat-container :qualityCheck="qualityCheck" :refresh="refresh"></webchat-container>
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
  import ContactPlan from 'components/public-modules/cust-tab-content/contact-plan/'
  import ContactHistory from 'components/public-modules/cust-tab-content/contact-history/'
  import Business from 'components/public-modules/cust-tab-content/business/'
  import OperationLog from 'components/public-modules/cust-tab-content/operation-log/'
  import WebchatContainer from './WebchatContainer.vue'
  import { getCache } from '../../../utils/m7Utils'
  import { isEmpty } from 'lodash'
  import * as gtypes from '../../../store/mutation-types'
  import * as types from '../../../store/modules/webchat/mutation-types'
//  import { escapeChatHtml } from '../../../utils/webchat.js'
  export default {
    name: 'WebChatSummary',
    data () {
      return {
        tabsInit: {webchat: {disabled: false}, businessCreateBeforePlan: {disabled: true}, plan: {disabled: true}, history: {disabled: true}, tabUrl: {disabled: false}, changeLog: {disabled: false}},
        tabActiveName: 'webchat',
        tabType: 'webchat_todo',
        customerId: '',
        isDailog: true,
        loading: true,
        cardLoading: false, // 从卡片点击到右边的时候的加载
        sessionId: '',
        autoCustPerson: '',
        urlsStr: [],
        tabUrls: '',
        sid: '',
        token: '',
        custByAuto: '',
        refresh: 'webchat',
        postData: {
          loginName: this.$store.state.session.user.exten,
          password: this.$store.state.session.user.password
        },
        newBusiness: 0,
        busId: '',
        qualityCheck: false  // 和质检进行区分
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      $route (to, form) {
        if (to.path.split('/')[2] === 'webchat') {
          this.fetchData()
        } else {
          this.loading = true
        }
      }
    },
    computed: {
      tabs () {
        if (this.customerId) {
          this.tabsInit.businessCreateBeforePlan.disabled = false
          this.tabsInit.plan.disabled = false
          this.tabsInit.history.disabled = false
          this.tabsInit.changeLog.disabled = false
        } else {
          this.tabsInit.businessCreateBeforePlan.disabled = true
          this.tabsInit.plan.disabled = true
          this.tabsInit.history.disabled = true
          this.tabsInit.changeLog.disabled = true
        }
        return this.tabsInit
      },
      currentBusinessObj () {
        // 传递给客户模块的业务信息
        let dealSrc = ''
        let callId = this.sessionId
        if (this.tabType === 'webchat_todo') {
          dealSrc = 'popupWebchat'
        } else {
          dealSrc = 'relocationWebchat'
        }
        return {dealSrc: dealSrc, callId: callId, tabType: this.tabType, type: 'webchat'}
      },
      customer () {
        // todo webchat_todo列表里的定位客户的时候,这里没有执行,原因未知
        let currCustomer = {}
        if (this.$route.path.split('/')[2] === 'webchat') {
          if (this.tabType === 'webchat_todo' || this.tabType === 'webchat_all') {
            currCustomer = this.$store.state.webchat.current[this.tabType].currentCustomer || {}
          }
        } else {
          this.loading = true
        }
        this.customerId = currCustomer._id || ''
        let noCustomer = isEmpty(currCustomer)
        if (!noCustomer) {
          updateCurrentWebchatList(this.$store, this.sid, currCustomer)
        }
        let phone = this.$store.state.webchat.autoCust[this.sessionId].autoCustPhone || ''
        let name = this.$store.state.webchat.autoCust[this.sessionId].autoCustName || ''
        let person = this.autoCustPerson
        this.$set(this, 'custByAuto', {name: name, phone: [{area: '', memo: person, tel: phone}]})
        return noCustomer ? this.custByAuto : currCustomer
      },
      custType () {
        let currCustomer = null
        if (this.$route.path.split('/')[2] === 'webchat') {
          if (this.tabType === 'webchat_todo' || this.tabType === 'webchat_all') {
            currCustomer = this.$store.state.webchat.current[this.tabType].currentCustomer
          }
        }
        let noCustomer = isEmpty(currCustomer)
        return noCustomer ? 'unk' : 'one'
      },
      showRightDetail () {
        let path = this.$route.path.split('/')
        this.tabType = path[3]
        if (this.tabType === 'webchat_todo') {
          let showRightDetail = this.$store.state.webchat.current.webchat_todo.showRightDetail
          !showRightDetail ? this.$router.push('/index/webchat/webchat_todo') : ''
          return showRightDetail
        } else {
          return true
        }
      }
    },
    beforeMount () {
      this.fetchData()
      this.$store.dispatch('getCache', {type: 'tabUrlAddress'}).then(() => {
        this.tabUrls = this.$store.state.session.dicMap.tabUrlAddress
        for (let i in this.tabUrls) {
          this.urlsStr.push(this.newUrl(this.tabUrls[i].url).replace('http://', '//'))
        }
      }).then(() => {
        getToken(this.$store, this.postData).then((token) => {
          this.token = token
        })
      })
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
        this.refresh = 'webchat'
        let path = this.$route.path.split('/')
        let type = path[2]
        if (type !== 'webchat' || path.length <= 3) {
          this.cardLoading = false
          return
        }
        let webchatList = this.$store.state.webchat.webchatList[path[3]].list
        let flag = true
        webchatList.forEach((item) => {
          if (item._id === path[4]) {
            flag = false
          }
        })
        if (flag) {
          return
        }
        this.$store.commit(types.SET_RIGHTDETAL_FLAG, {data: true})
        this.cardLoading = true
        this.tabType = path[3]
        let _id = path[4]
        this.sessionId = _id
        this.$emit('routeChange', this.tabType)
        let sid = ''
        let self = this
        // 翻页后该数据获取不到
        this.$store.state[type][type + 'List'][this.tabType].list.forEach(function (data) {
          if (data._id === _id) {
            sid = data.sid || ''
            self.sid = data.sid
            self.customerId = data.custId || ''
          }
        })

        if (this.tabType === 'webchat_todo') {
          this.tabActiveName = this.$store.state.webchat.current[this.tabType].funTabInfo[_id] || 'webchat' // 回显funTab
          this.refresh = this.tabActiveName
          let currentSession = this.$store.state.webchat.current[this.tabType].currentSession[_id]
          let currentHistory = this.$store.state.webchat.current[this.tabType].messageList[_id]
          if (currentSession && currentHistory) {
            // 切换后重新赋值webchat_todo下面的currentCustomer
            this.$store.commit(gtypes.SET_CURRENT_CUSTOMER, {data: this.$store.state.webchat.current[this.tabType].currentSession[_id].currentCustomer, type: 'webchat', tabType: 'webchat_todo', businessId: _id})
            this.cardLoading = false
            this.loading = false
            dealWebchatMsg(this.$store, {_id: _id, tabType: this.tabType})
            this.$store.commit(types.QUERY_WEBCHAT_CURRENT_SESSION, {_id: _id, tabType: this.tabType})
            this.sid = this.$store.state.webchat.current[this.tabType].currentSession[this.sessionId].sid || ''
            return
          }
        } else {
          this.tabActiveName = 'webchat'
          this.refresh = this.tabActiveName
        }
        let info = {
          autoCustName: '',
          autoCustPhone: '',
          autoCustLength: -1
        }
        this.$store.commit('webchat/AUTO_CUST_INFO', {sessionId: _id, data: info})
        const f1 = getWebchatDetail(this.$store, _id, sid, this.tabType)
        const f2 = getChatInfoById(this.$store, _id, this.tabType)
        const f3 = getWebchatUserHistory(this.$store, _id, this.tabType)
        const f4 = dealWebchatMsg(this.$store, {_id: _id, tabType: this.tabType}) // 更新会话未读数
        let that = this
        Promise.all([f1, f2, f3, f4]).then(function () {
          if (that.tabType === 'webchat_todo') {
            let toPeer = that.$store.state.webchat.current[that.tabType].chatInfoById[_id].toPeer || ''
            let chatStatus = that.$store.state.webchat.current[that.tabType].chatInfoById[_id].status || ''
            if (chatStatus === 'changePeer') {
  //          加载会话的时候加载流转信息，但是流转消息的数据欠缺，暂时中止
              let mailQueues = getCache('mailQueues')
              let queueDisplayName = ';'
              let flag = false
              for (let i = 0; i < mailQueues.length; i++) {
                if (mailQueues[i].Exten === toPeer) {
                  queueDisplayName = mailQueues[i].DisplayName
                  flag = true
                }
              }
              if (flag) {
                let platform = ''
                let sid = ''
                if (that.tabType === 'webchat_todo') {
                  platform = that.$store.state.webchat.current[that.tabType].chatInfoById[_id].platform || ''
                  sid = that.$store.state.webchat.current[that.tabType].chatInfoById[_id].sid || ''
                } else {
                  platform = that.$store.state.webchat.current[that.tabType].chatInfoById.platform || ''
                  sid = that.$store.state.webchat.current[that.tabType].chatInfoById.sid || ''
                }
                let data = {
                  type: 'out',
                  platform: platform,
                  sid: sid,
                  message: '用户流转进了【' + queueDisplayName + '】技能组',
                  _id: _id,
                  contentType: 'text',
                  content: '用户流转进了【' + queueDisplayName + '】技能组',
                  status: 'changePeer'
                }
                that.$store.commit(types.UPDATE_WEBCHAT_MESSAGE_LIST, data)
                console.log(data)
              }
            }
          }
          that.cardLoading = false
          that.loading = false
        })
      },
      addCustomer (val) {
        delete val.data
        // 写自己添加完客户后相关逻辑
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
        return this.$store.dispatch('locationCustomer', data).then(val2 => {
          this.isDailog = false
          this.$message({
            type: 'success',
            message: '成功并入用户!'
          })
          let sid = null
          if (this.tabType === 'webchat_todo') {
            sid = this.$store.state.webchat.current[this.tabType].currentSession[this.sessionId].sid || ''
          } else {
            sid = this.$store.state.webchat.current[this.tabType].currentSession.sid || ''
          }
          updateCurrentWebchatList(this.$store, sid, val.custInfo)
        })
      },
      refreshContent (name) {
        this.refresh = name
        this.tabActiveName = name
        if (this.tabType === 'webchat_todo') {
          this.$store.dispatch('saveFunTabInfo', {sessionId: this.sessionId, funTabActiveName: name}).then(() => {
            this.refresh = name
            this.tabActiveName = name
          })
        }
        if (name === 'business') {
          this.busId = ''
        }
      },
      unbundling () {
        this.$confirm('此操作将解除关联客户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.unbundlingFun()
        }).catch(() => {})
      },
      unbundlingFun () {
//        let self = this
//        let sid = ''
        let sName = ''
        let sessionId = this.$route.path.split('/')[4]
        if (this.tabType === 'webchat_todo') {
          sName = this.$store.state.webchat.current[this.tabType].chatInfoById[sessionId].sName
        } else if (this.tabType === 'webchat_all') {
          sName = this.$store.state.webchat.current[this.tabType].chatInfoById.sName
        }
        this.$store.dispatch('deleteCustomerImRelation', {customerId: this.customer._id, sessionId: sessionId, sid: this.sid, sName: sName})
      },
      setAutoCustPerson (value) {
        this.autoCustPerson = value
      },
      newUrl (url) {
        let routes = this.$route.path.split('/')
        let tabType = routes[3]
        let message = 'tabType=' + tabType
        let customer = {}
        if (tabType === 'webchat_todo') {
          customer = this.$store.state.webchat.current[this.tabType].currentSession[this.sessionId] || {}
        } else if (tabType === 'webchat_all') {
          customer = this.$store.state.webchat.current[this.tabType].currentSession || {}
        } else {
          customer = {}
        }
        let sid = customer.sid + '__' + customer.sourceName || ''
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
//          if (status) {
//            if (status === 'status0') {
//              status = '普通客户'
//            } else if (status === 'status1') {
//              status = '银牌客户'
//            }else if (status === 'status2') {
//              status = '金牌客户'
//            }else {
//              status = 'VIP客户'
//            }
//          }
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
      }
    },
    components: {
      ContactSummarySolt,
      CustomerSlot,
      FunTabSlot,
      Business,
      ContactPlan,
      ContactHistory,
      WebchatContainer,
      OperationLog
    }
  }
  function updateCurrentWebchatList (store, sid, currentCustomer) {
    store.dispatch('updateCurrentWebchatListCustomer', {sid: sid, customer: currentCustomer})
  }
  function getWebchatDetail (store, _id, sid, submenu) {
    let data = {_id: _id, sid: sid, submenu: submenu}
    return store.dispatch('popupWebchat', data)
  }
  function getChatInfoById (store, _id, submenu) {
    let data = {
      cust_id: '',
      queryHistory: true,
      submenu: submenu,
      _id: _id
    }
    return store.dispatch('queryChatInfoById', data)
  }
  function getWebchatUserHistory (store, sessionId, submenu) {
    let data = {
      page: 1,
      limit: 10,
      sessionId: sessionId,
      submenu: submenu
    }
    return store.dispatch('queryUserHistory', data)
  }
  function dealWebchatMsg (store, data) {
    return store.dispatch('dealMsg', data)
  }
</script>
<style lang="stylus" scoped>
  .iframe-wrap
    height calc(100vh - 188px)
  .iframe-con
    width 100%
    height 100%
</style>
