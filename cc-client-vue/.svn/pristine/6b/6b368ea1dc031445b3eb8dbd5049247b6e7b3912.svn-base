<template>
 <div v-if="!cardLoading" class="card" :id="tabType === 'cdr_call'?'cdr_call_id': ''">
    <el-menu
    router
    class="el-menu-vertical-demo" v-if="cardList" @select="handleSelect" :default-active = "defaultActive">
      <el-menu-item style="padding: 0"  v-if="cardList.length>0"  v-for="(item, index) in cardList" :index="handleSplit(item._id, item.CUSTOMER_ID)" :class="{'is-active': isActive === item._id}">
        <div class="phon" :class="{phon_call: tabType === 'cdr_call'}">
          <label v-if="tabType !== 'cdr_call'" class="fake-checkbox" :class="{'visible': batch[tabType].isBatchShow}" v-on:click.stop="">
            <input type="checkbox" :value="item._id" v-model.trim="item.checked" @change="checkThis(item.checked)">
            <span></span>
            <i class="fake-label"></i>
          </label>
          <span class="cust-icon" :class="tabType === 'cdr_call'?'cdr-call-icon':''">
            <customer-avatar
            :status="item.CUSTOMER_STATUS"
            :iscall="isCall"
            :call="item.CONNECT_TYPE"
            :isRead="item.unRead"
            :type="tabType"
              >
            </customer-avatar>
          </span>
          <span class="call">
            <span class="icon-group" v-if="tabType !== 'cdr_call'">
              <i class="icon iconfont icon-biaoji edit-mark" :title="$t('public.remark')" @click.stop="showCallNote(item)"></i>
              <i class="icon iconfont icon-dadianhua" :title="$t('softPhoneBar.callout')" @click.stop="softBarDialoutPopup(item.QUICK_QUERY_NUM)"></i>
            </span>
            <div class="detail-wrap">
              <span class="cust-phone ellipsis" v-if="item.CONNECT_TYPE==='dialout'||item.CONNECT_TYPE==='dialTransfer'" :title="checkHideNum(item.CALLED_NO)">{{checkHideNum(item.CALLED_NO)}}</span>
              <span class="cust-phone ellipsis" :title="checkHideNum(item.CALL_NO)" v-else>{{checkHideNum(item.CALL_NO)}}</span>
              <span v-if="item.PROVINCE==item.DISTRICT" class="city pro-city ellipsis" :title="item.PROVINCE">({{item.PROVINCE}})</span>
              <span v-else class="city pro-city ellipsis" :title="item.PROVINCE+'-'+item.DISTRICT">({{item.PROVINCE}}-{{item.DISTRICT}})</span>
              <i class="icon iconfont icon-zhongyaobiaoji1 key-tag" :title="$t('call.sign')" v-if="item.KEY_TAG && isSameCallID(item.CALL_SHEET_ID)"></i>
              <span class="time" v-if="tabType !== 'cdr_call'">{{callDate(item.OFFERING_TIME).name }}</span>
              <span class="time time2" v-else>{{callDate(item.OFFERING_TIME).name }}</span>
            </div>
            <div class="clearfix">
              <span class="cust-name ellipsis" :title="item.CUSTOMER_NAME || $t('public.unknownCustomer')">{{item.CUSTOMER_NAME || $t('public.unknownCustomer')}}</span>
              <span v-if="tabType !== 'cdr_call'" class="call-time-len"> {{callTimeLen(item.CALL_TIME_LENGTH)}}</span>
            </div>
            <div v-if="tabType !== 'cdr_call'" class="clearfix">
              <span class='fl ellipsis callend-num' v-if="item.CONNECT_TYPE==='dialout'||item.CONNECT_TYPE==='dialTransfer'" :title="item.CALL_NO">{{item.CALL_NO}}</span>
              <span class='fl ellipsis callend-num' :title="item.CALLED_NO" v-else>{{item.CALLED_NO}}</span>
            </div>
            <div class="status clearfix" v-if="tabType !== 'cdr_call'">
              <agent class="ellipsis agent-name" v-if="item.DISPOSAL_AGENT" :id="item.DISPOSAL_AGENT"></agent>
              <span class="queues-name-wrap" v-if="item.ERROR_MEMO">(<queues class="ellipsis queues-name" :exten="item.ERROR_MEMO"></queues>)</span>
            </div>
            <div class="clearfix status-group" v-if="tabType !== 'cdr_call'">
              <call-status :status="item.STATUS" :class="item.STATUS" class="sta fr ellipsis"></call-status>
              <span class="play fr" v-if="item.CALL_TIME_LENGTH && isListent" @click.stop="showListentWindow(item.FILE_SERVER, item.RECORD_FILE_NAME, item.STATUS)"><strong></strong></span>
            </div>
            <div>
              <div v-if="tabType === 'cdr_call'" class="card-call-phone">
                <span :title="$t('call.callinServerNum')">{{item.CALLED_NO}}</span><i class="icon iconfont icon-dailingqu"></i><span class="ellipsis queues-name2" :title="$t('public.queues')">{{item.QUEUE_NAME}}</span>
                <el-tooltip class="item" effect="dark" :content="$t('call.transferMessage', {transferFrom: item.transferFrom, transferTo: item.transferTo})" placement="bottom" v-if="item.transferFrom && item.transferTo">
                  <i class="icon iconfont icon-zhuanjie3 transfer-icon fr"></i>
                </el-tooltip>
              </div>
            </div>
          </span>
        </div>
      </el-menu-item>
    </el-menu>
   <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('call.listenAudio')" v-model.trim="listent" size="tiny" @close="closeModal" @open="openModal">
     <audio controls="" :src ="fileServer + '/' + fileName" autoplay preload="auto" id="call-adiuo" style="margin: 0 0 0 10%;"></audio>
   </el-dialog>
   <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('public.addRemarks')" v-model="callNote" >
      <span>
        <el-input size="small" type="textarea" v-model.trim="customerNote"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="callNote = false" size="small">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" size="small" @click.stop="saveCdrMemo">{{$t('public.confirm')}}</el-button>
      </span>
   </el-dialog>
    <p v-if="tabType=='cdr_call' && !cdrCallData" class="no-call">{{$t('call.callCardWarnLeft')}}</p>
    <no-record v-if="cardList && cardList.length<=0"></no-record>
  <!-- 批处理开始 -->
    <div class="batch_cover" v-show="batch[tabType].isBatchShow"></div>
    <div class="batch_btm" v-show="batch[tabType].isBatchShow"></div>
    <div class="batch" :class="{'show': batch[tabType].isBatchShow}">
      <el-checkbox v-model.trim="batch[tabType].allChecked" @change="checkAll()">{{$t('public.checkAll')}}</el-checkbox>
      <card-batch v-if="batch[tabType].operator"
      :tabType="tabType"
      :batchOperator="batch[tabType]"
      @exportExcel="exportExcel"
      @exportTask="exportTask"
      @checkNone="checkNone"
      ></card-batch>
    </div>
  <!-- 批处理结束 -->
  </div>
</template>
<script type="text/javascript">
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
//  import CallNote from 'components/business-modules/call/CallNote'
  import CallStatus from 'components/public-modules/cache/CallStatus'
  import CardBatch from 'components/public-modules/card/CardBatch'
  import NoRecord from 'components/public-modules/card/NoRecord'
  import Queues from 'components/public-modules/cache/Queues'
  import Agent from 'components/public-modules/cache/Agent'
  import { _getSearchCondition, isHasFunc, isHasMenu, getCallTimeLength, formatShortTime, checkHideTel, getStrLength, getFormatDateTime, deepClone } from '../../../utils/m7Utils.js'
  export default {
    name: 'CallCard',
    props: {
      loading: Boolean,
      cardList: Array,
      type: String,
      tabType: String,
      condition: Object,
      clearChecked: String
    },
    data () {
      return {
//        active: true, // 是否使用路由
        cardLoading: true,
        sameId: false,
        checked: false,
        isCheckbox: false,
        isCall: true,
        isListent: false,
        listent: false,
        fileServer: '',
        defaultActive: '',
        fileName: '',
        customerNote: '',
        callNote: false,
        callSheetId: '',
        batch: {
          cdr_call: {
            batchItem: [],
            allChecked: false,
            isBatchShow: false,
            checkedCount: 0
          },
          cdr_my: {
            batchItem: [],
            allChecked: false,
            isBatchShow: false,
            checkedCount: 0,
            operator: [
              {name: 'public.export', class: 'icon-daochu1', action: 'exportExcel'},
              {name: 'public.exportTask', class: 'icon-piliang', action: 'exportTask'}
            ]
          },
          cdr_all: {
            batchItem: [],
            allChecked: false,
            isBatchShow: false,
            checkedCount: 0,
            operator: [
              {name: 'public.export', class: 'icon-daochu1', action: 'exportExcel'},
              {name: 'public.exportTask', class: 'icon-piliang', action: 'exportTask'}
            ]
          }
        }
      }
    },
    computed: {
      isActive () {
        if (this.tabType === 'cdr_call') {
          return this.$route.path.split('/')[7] || this.$route.path.split('/')[4] // 没有定位到客户取第7个，定位到客户取第4个
        } else {
          return this.$route.path.split('/')[4]
        }
      },
      getKeyTagArr () { // CALL_SHEET_ID
        return this.$store.state.call.transCache.showKeyTagArr
      },
      cdrCallData () {
        let cdrCall = this.$store.state.call.callList.cdr_call.list
        if (cdrCall && cdrCall.length > 0) {
          return true
        }
      }
    },
    methods: {
      callType (type) {
        return {CONNECT_TYPE: type}
      },
      isSameCallID (_id) {
        let arr = this.getKeyTagArr
        let flag = true
        if (arr.length > 0) {
          for (let i = 0; i < this.getKeyTagArr.length; i++) {
            if (this.getKeyTagArr[i] === _id) { // 只有id相同的时候才会去除通话标记
              flag = false
              break
            } else {
              flag = true
            }
          }
        }
        return flag
      },
      closeModal () {
        let myAudio = document.getElementById('call-adiuo')
        if (myAudio) {
          if (myAudio.currentSrc) {
            myAudio.pause()
          }
        }
      },
      openModal () {
        let myAudio = document.getElementById('call-adiuo')
        if (myAudio) {
          if (myAudio.paused) {
            myAudio.currentTime = 0
            if (myAudio.currentSrc) { // url 有地址时
              myAudio.play()
            }
          }
        }
      },
      showCallNote (item) {
        this.callNote = true
        this.customerNote = item.COMMENTS || ''
        this.callSheetId = item.CALL_SHEET_ID || ''
      },
      saveCdrMemo () {
        this.callNote = false
        let data = {}
        data.CALL_SHEET_ID = this.callSheetId
        data.memo = this.customerNote
        if (getStrLength(data.memo) > 700) {
          this.$message.error(this.$t('call.limitChineseCharacters'))
          return
        }
        let routeArry = this.$route.path.split('/')
        let tabType = routeArry[3]
        let currentCallId = routeArry[4] || ''
        let lastData = {data: data, type: tabType, currentCallId: currentCallId}
        let allArr = this.$store.state.call.callList[tabType].list
        this.$store.dispatch('saveCdrMemo', lastData).then(resp => {
          updateRemark(allArr, this.callSheetId, this.customerNote)
        })
      },
      softBarDialoutPopup (historyNum) {
        this.$store.dispatch('phoneDialout', {phoneNum: historyNum})
      },
      callTimeLen (length) {
        return getCallTimeLength(length)
      },
      checkHideNum (num) {
        return checkHideTel(num, this.$store.state.session.user)
      },
      callDate (time) {
        return formatShortTime(time)
      },
      getChecked () { // 单选获取数组
        return this.cardList.filter(item => item.checked).map(item => item._id)
      },
      checkThis (checked) { // 单个选中传送数组和展示批量
        let checkedArr = this.getChecked()
        let isBatchShow = checkedArr.length > 0
        this.batch[this.tabType].allChecked = checkedArr.length === this.$store.state.call.callList[this.tabType].count
        this.batch[this.tabType].batchItem = checkedArr
        this.batch[this.tabType].isBatchShow = isBatchShow
        this.batch[this.tabType].checkedCount = checkedArr.length
      },
      checkAll () { // 全选&取消全选
        console.log(this.tabType)
        this.batch[this.tabType].isBatchShow = this.batch[this.tabType].allChecked
        this.cardList.forEach((item) => {
          item.checked = this.batch[this.tabType].allChecked
        })
        this.batch[this.tabType].checkedCount = this.batch[this.tabType].allChecked ? this.$store.state.call.callList[this.tabType].count : 0
      },
      checkNone () {
        this.batch[this.tabType].allChecked = false
        this.batch[this.tabType].batchItem = []
        this.batch[this.tabType].isBatchShow = false
        this.cardList.forEach((item) => {
          item.checked = false
        })
      },
      exportExcel () {
        let data = {}
        let sessionId = this.$store.state.session.user._id
        if (this.tabType === 'cdr_my') {  // 判断导出我的通话记录
          this.condition.DISPOSAL_AGENT = sessionId
        }
        let query = _getSearchCondition(this.batch[this.tabType].allChecked, this.batch[this.tabType].batchItem, sessionId, this.condition)
        let condition = deepClone(query)
        let offerTime = query.OFFERING_TIME
        if (offerTime) {
          if (Array.isArray(offerTime) && offerTime.length === 2) {
            if (offerTime[0] && offerTime[1]) { // condition.OFFERING_TIME = {} 的时候，后台查询没有数据
              condition.OFFERING_TIME = {}
              if (offerTime[0] instanceof Date) {
                condition.OFFERING_TIME.$gte = getFormatDateTime(offerTime[0])
              }
              if (offerTime[1] instanceof Date) {
                condition.OFFERING_TIME.$lte = getFormatDateTime(offerTime[1])
              }
            } else {
              condition.OFFERING_TIME = null
            }
          } else {
            condition.OFFERING_TIME = null
          }
        }
        condition.accountId = this.$store.state.session.account.account
        condition.type = 'CdrExport'
        condition.dataDB = this.$store.state.session.account.dataDB
        condition.user = sessionId
        condition.cdrExportType = 'call_sheet_advanced_query'
        data.Method = 'exportCdr'
        data.Query = condition
        if (this.$store.state.session.user.isAdmin || isHasFunc('func_not_allow_public_record', this.$store.state.session.user)) {
          condition.isPermissions = true
        }
        this.$store.dispatch('exportCdrExcel', {'data': data, 'type': this.tabType}).then(() => {
          // 成功后重置全选
          delete condition.accountId
          delete condition.type
          delete condition.dataDB
          delete condition.user
          delete condition.cdrExportType
          delete condition.isPermissions
          if (this.tabType === 'cdr_my') { // 避免删除全部通话里面的agent
            this.condition.DISPOSAL_AGENT = ''
          }
          this.checkNone()
        })
      },
      exportTask () {
        let sessionId = this.$store.state.session.user._id
        let query = _getSearchCondition(this.batch[this.tabType].allChecked, this.batch[this.tabType].batchItem, sessionId, this.condition)
        let condition = deepClone(query)
        let offerTime = query.OFFERING_TIME
        if (offerTime) {
          if (Array.isArray(offerTime) && offerTime.length === 2) {
            if (offerTime[0] && offerTime[1]) { // condition.OFFERING_TIME = {} 的时候，后台查询没有数据
              condition.OFFERING_TIME = {}
              if (offerTime[0] instanceof Date) {
                condition.OFFERING_TIME.$gte = getFormatDateTime(offerTime[0])
              }
              if (offerTime[1] instanceof Date) {
                condition.OFFERING_TIME.$lte = getFormatDateTime(offerTime[1])
              }
            } else {
              condition.OFFERING_TIME = null
            }
          } else {
            condition.OFFERING_TIME = null
          }
        }
        if (this.tabType === 'cdr_my') {
          condition.DISPOSAL_AGENT = sessionId
        }
        if (!condition.OFFERING_TIME) {
          delete condition.OFFERING_TIME
        }
        condition.isPermissions = false
        if (this.$store.state.session.user.isAdmin || isHasFunc('func_not_allow_public_record', this.$store.state.session.user)) {
          condition.isPermissions = true
        }
        this.$store.dispatch('addExportMonitorTask', condition).then(() => {
          // 成功后重置全选
          delete condition.isPermissions
          delete condition.OFFERING_TIME
          this.checkNone()
        })
      },
      // 按照 卡片的_id不同设置不同路由
      handleSplit (index, custmoerId, obj) {
        let path = ''
        if (this.tabType === 'cdr_call') {
          path = '/index/' + this.type + '/' + this.tabType + '/' + index + '/cdr?flag=list'
        } else {
          path = '/index/' + this.type + '/' + this.tabType + '/' + index
        }
        return path
      },
      handleSelect (index) {
        this.$emit('changeCardItem')
      },
      showListentWindow (server, name, status) {
        let local = window.location.href
        if (local.indexOf('https') > -1) { // 更换录音访问地址头
          let userPbx = this.$store.state.session.user.pbx
          let pbxList = this.$store.state.session.dicMap.pbx
          for (let i = 0; i < pbxList.length; i++) {
            if (pbxList[i]._id === userPbx) {
              if (server) {
                if (pbxList[i].assDomain) {
                  server = pbxList[i].assDomain
                }
              }
            }
          }
        }
        this.listent = true
        if (status === 'voicemail' || status === 'dealing') { // 只有已接听和已留言才会是有效的录音地址
          this.fileServer = server
          this.fileName = name
        }
      }
    },
    watch: {
      // clearChecked 变化 再次执行
      clearChecked: 'checkNone'
    },
    components: {
      CustomerAvatar,
//      CallNote,
      CallStatus,
      CardBatch,
      NoRecord,
      Queues,
      Agent
    },
    beforeMount () {
      let callValue = '' // this.item.STATUS
      this.$store.dispatch('getDicCacheName', {type: 'callStatus', value: callValue}).then((req) => {
        this.cardLoading = false
        if (this.$store.state.session.user.isAdmin || !isHasFunc('func_user_call_sheet_listen_file', this.$store.state.session.user)) {
          this.isListent = true
        }
      })
      if (!isHasMenu('call_sheet_export_monitor_task', this.$store.state.session.user)) {
        // 提交批量导出录音任务
        this.batch.cdr_all.operator = [{name: 'public.export', class: 'icon-daochu1', action: 'exportExcel'}]
        this.batch.cdr_my.operator = [{name: 'public.export', class: 'icon-daochu1', action: 'exportExcel'}]
      }
      if (!isHasFunc('func_export_cdr', this.$store.state.session.user)) {
        // 导出通话记录/录音
        this.batch.cdr_all.operator = [{name: 'public.exportTask', class: 'icon-piliang', action: 'exportTask'}]
        this.batch.cdr_my.operator = [{name: 'public.exportTask', class: 'icon-piliang', action: 'exportTask'}]
      }
      if (!isHasMenu('call_sheet_export_monitor_task', this.$store.state.session.user) && !isHasFunc('func_export_cdr', this.$store.state.session.user)) {
        // 导出通话记录/录音和提交批量导出录音任务都没有权限时
        this.batch.cdr_all.operator = []
        this.batch.cdr_my.operator = []
      }
        // 当页面刷新时保持通话详情来电列表的显示
      if (window.sessionStorage.callList) {
        let list = JSON.parse(window.sessionStorage.callList)
        this.$store.dispatch('callItemPush', list)
      }
    },
    updated () {
      let arr = this.$route.path.split('/')
      if (arr.length < 3) { // tab切换到来电模块时不要让第一个click
        return
      }
      if (arr[7]) { // 在来电列表的时候新接入一个来电
        if (JSON.parse(window.sessionStorage.getItem('call')).url.indexOf(arr[7]) <= -1) {
          this.sameId = false
        }
      }
      if (arr[3] === 'cdr_call') { // 有2个选中状态时
        let demo = this.$el.getElementsByClassName('el-menu-vertical-demo')[0]
        if (demo) {
          let activeLen = this.$el.getElementsByClassName('is-active').length
          if (activeLen && activeLen > 1) {
            this.sameId = false
          }
        }
      }
      if (this.sameId) { // 避免定位不到客户路由死循环的问题
        return
      }
      if (arr[3] === 'cdr_call') {
        if (this.$route.query.flag === 'notify' || this.$route.query.flag === 'add') {
          if (arr[7]) {
            this.sameId = true
          } else {
            this.sameId = false
          }
          setTimeout(() => {
            let cdrList = this.$store.state.call.callList.cdr_call.list
            let cdrListLen = ''
            if (cdrList) {
              cdrListLen = cdrList.length
            }
            if (cdrListLen >= 1) {
              let node = this.$el.getElementsByClassName('phon_call')[0]
              if (node) {
                node.click()
              }
            }
          }, 1000)
        }
      }
    }
  }
  function updateRemark (arr, _id, remark) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === _id) {
        arr[i].COMMENTS = remark
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .card
    height 100%
  .el-menu-item
    height auto
    line-height inherit
  .el-menu-item.is-active
    .phon
      background-color #e8f5fc
  .phon
    &:hover
      background-color #e8f5fc
    &:hover >.el-checkbox, &:hover >label
      visibility visible
  .el-checkbox
      visibility hidden
  .e-ch-show
      visibility visible
  .phon
    padding 10px 8px
    height 86px
    border-bottom 1px solid #efeef3
    box-sizing border-box
    background-color #fff
    display flex
    cursor pointer
    align-items center
    color #000
    position relative
    line-height 1
    span
      display inline-block
    .cust-icon
      height 46px
      border-radius 50%
      position relative
      margin  -6px 10px 0 0px
      i
        display inline-block
        width 22px
        height 22px
        position absolute
        top 30px
        left 26px
        background #0f0
    .cdr-call-icon
      margin  10px 10px 0 0px
    .call
      flex 3
      display inline-block
      .clearfix:after
        display block
      span
        font-size 12px
        border-radius 3px
      span.play
        width 18px
        height 18px
        border 1px solid #1abb9c
        margin 0 10px 0 0
        border-radius 50%
        strong
          display inline-block
          width 0
          height 0
          border 4px solid #1abb9c
          border-color transparent transparent transparent #1abb9c
          margin 5px 0px 1px 8px
      .sta
        color #fff
        max-width 5em
        padding 0 10px
        text-align center
        height 20px
        line-height 20px
    .time
      flex 1
      float right
    .status-group
      position absolute
      bottom 10px
      right 10px
    .detail-wrap
      height 16px
      line-height 16px
      &:after
        content ''
        display block
        clear both
        overflow hidden
    span.cust-name
      max-width 15em
      padding 3px 6px 6px 0
      font-size 14px
    span.cust-phone
      max-width 10em
      padding-right 4px
    .icon-group
      display none
      height 16px
      float right
  .phon_call
    padding-left 8px
  .el-menu-item:hover
    .time,.call-time-len
      display none
    .time.time2
      display inline-block
    .icon-group
      display inline
      .edit-mark
        margin-right 12px
      i
        color #18BB9B
  .no-call
    color #a6a6a6
    text-align left
    padding 20px 0 0 10px
.pro-city
  max-width 10em
.key-tag
  color #ff4949
.call-time-len
  float right
.time,.call-time-len,.card-call-phone
  color $cf-gray4
.status .agent-name,.queues-name-wrap,.callend-num
  color $cf-gray3
.callend-num
  max-width 11em
.agent-name
  padding-top 3px
.agent-name,.queues-name
  max-width 7em
.queues-name2
  max-width 14em
.agent-name,.queues-name,.callend-num,.queues-name2
  vertical-align bottom
.agent-name,.queues-name-wrap
  padding-right 4px
.transfer-icon
  color #1ebc9b
</style>
