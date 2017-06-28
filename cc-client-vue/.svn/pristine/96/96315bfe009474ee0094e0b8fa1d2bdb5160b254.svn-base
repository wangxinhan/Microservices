<template>
  <div class="plan" v-loading="loading" v-if="refresh==='history'&&!loading">
    <div class="zhezhao" :class="listent || edit?'show-zhezhao':'hide-zhezhao'" v-if="callScreen"></div>
    <el-row class="p-filter" >
      <el-col :span="14" class="til">
        <span class="clock">
          <i class="iconfont icon-zongshichang"></i>
        </span>
        共{{count}}条沟通记录
      </el-col>
      <el-col :span="10" class="right">
        <el-dropdown trigger="click" @command="handleCommandTime" menu-align="start">
          <span class="el-dropdown-link">
            时间: <span>{{filterTimeName}}</span><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in time" :command="item.type">{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        &nbsp;&nbsp;&nbsp;
        <el-dropdown @command="handleCommandType" menu-align="start">
          <span class="el-dropdown-link">
          类型: <span>{{filterTypeName}}</span><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in businessType" :command="item.type">{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row v-if="!loading">
      <!-- 录音和备注弹窗开始 -->
      <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('call.listenAudio')" v-model.trim="listent" :size="callScreen?'large':'tiny'" :modal="callScreen?false:true" @close="closeModal" @open="openModal">
        <audio controls="" :src ="recordFile" autoplay preload="auto" id="call-adiuo2" :style="callScreen?'margin:30px 0 30px 24%':'margin:0 0 0 10%'"></audio>
      </el-dialog>
      <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('public.editComments')" v-model.trim="edit" :size="callScreen?'large':'tiny'" :modal="callScreen?false:true">
        <el-input size="small" type="textarea" v-model.trim="comments" :style="callScreen?'padding:30px;width:90%':''"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="edit = false">{{$t('public.cancel')}}</el-button>
          <el-button type="primary" @click="submitEdit">{{$t('public.confirm')}}</el-button>
        </span>
      </el-dialog>
      <el-dialog modal-append-to-body lock-scroll :top="callScreen?'':'10%'" :title="contactHistoryInfo.title" id="contactHistory-dialog" class="bussiness-dialog-padding" :modal="callScreen?false:true" :size="callScreen?'full':''" v-model.trim="contactHistoryInfo.isdealog" @close="off">
        <Bussiness :busId="contactHistoryInfo._id"
                   :showHistory="true"
                   v-if="contactHistoryInfo._id && contactHistoryInfo.labelValue === 1"
                   @event="businessEvent"
        >

        </Bussiness>
        <emailDetails
          :id="contactHistoryInfo._id"
          :lastEmail="lastEmail"
          v-if="contactHistoryInfo._id && contactHistoryInfo.labelValue === 2"
        >

        </emailDetails>
        <webChatView
          :showFlag = "true"
          :chatInformationId ="contactHistoryInfo._id"
          v-if="contactHistoryInfo._id && contactHistoryInfo.labelValue === 3"
        >
        </webChatView>
      </el-dialog>
      <!-- 录音和备注弹窗结束 -->
      <el-col :span="24" class="line">
        <ul class="border">
        <template v-for="con in cons" >
          <li v-if="con.detail==1" class="treat el-col">
            <span class="" :class="con.sclass">
              <span :class="con.type" class="ico">
              <strong class="iconfont" :class="con.type"></strong>
            </span>
            </span>
              <p class="el-col-24" v-if="con.callType=='callin' || con.callType=='callout'"><call-status :status="con.status"></call-status></p>
              <p class="el-col-24" v-else>{{con.status}}</p>
              <h3 class="el-col-12" :class="callScreen?'call-h3':''">
                {{con.sort}}&nbsp;&nbsp;<span :class="[con.type==='icon-gongdan'?'color-green':'']" v-if="con.type ==='icon-gongdan'" @click.stop="isDealog('showBussinessDetails',con._id,'工单明细')">{{con.businessTypeName}}</span>
                <span :class="[con.type==='icon-youjian'?'color-green':'']" v-if="con.type ==='icon-youjian'" @click.stop="isDealog('showEmailDetails',con._id,'邮件详情')">邮件沟通</span>
                <span :class="[con.type==='icon-yidongduan'|| 'icon-yidongduan' || 'icon-hulianwang' || 'icon-wap' || 'icon-weixin' || 'icon-weibo'?'color-green':'']" @click.stop="isDealog('showWebChatDetails',con._id,'会话记录',con.type)"><span v-if="con.type ==='icon-yidongduan'">app咨询</span><span v-if="con.type ==='icon-hulianwang'">网站咨询</span><span v-if="con.type ==='icon-wap'">wap站咨询</span><span v-if="con.type ==='icon-weixinzixun'">微信咨询</span><span v-if="con.type ==='icon-weibo'">微博咨询</span></span>
                <!--<span :class="[con.type==='icon-hulianwang'?'color-green':'']" v-if="con.type ==='icon-hulianwang'">网站咨询</span>-->
                <!--<span :class="[con.type==='icon-wap'?'color-green':'']" v-if="con.type ==='icon-wap'">wap站咨询</span>-->
                <!--<span :class="[con.type==='icon-weixin'?'color-green':'']" v-if="con.type ==='icon-weixin'">微信咨询</span>-->
                <!--<span :class="[con.type==='icon-weibo'?'color-green':'']" v-if="con.type ==='icon-weibo'">微博咨询</span>-->
                <template v-if="con.recordFile && isListent">
                <span class="time" @click.stop="popup(con.recordFile,con.status)">
                  <span class="play">
                    <strong class="pla"></strong>
                  </span>
                  <!-- {{con.callTimeLen}} -->
                </span>
                  <!-- <span :class="con.ico">
                    <strong class="iconfont icon-biaoqing"></strong>
                  </span> -->
                </template>
                </h3>
                <p class="notes el-col-12" v-if="con.comments">
                  <!-- <el-tooltip v-if="con.comments !=='true' && NoEditNote == false" effect="dark" :content="con.comments" placement="right"> -->
                  <strong v-if="con.comments !=='true' && NoEditNote == false" class="iconfont icon-beizhu" @click.stop="editComments(con)"></strong>
                  <i v-if="con.comments !=='true' && NoEditNote == false"></i><span class="detail" v-if="con.comments !=='true' && NoEditNote == false" >{{con.comments}}</span>
                  <!-- </el-tooltip> -->
                  <strong v-if="con.comments == 'true' && NoEditNote == false" class="iconfont icon-beizhu null" @click.stop="editComments(con)"></strong>
                  <strong v-if="NoEditNote == true" class="iconfont icon-beizhu null"></strong>
                </p>
              </li>
              <li v-if="con.detail==2" class="treat">
                <span class="bac"></span>
                <i></i>
                <h3 class="date"><span>{{con.sort}}</span>{{con.status}}</h3>
              </li>
          </template>
        </ul>
      </el-col>
    </el-row>
    <el-row v-if="isLoadMoreShow">
      <el-col :span="24" class="next-page">
        <div class="btn" @click.stop="loadMore"><i class="iconfont icon-shuaxin"><span>{{$t('public.loadMore')}}</span></i></div>
      </el-col>
    </el-row>
    <!--<el-dialog v-model="imgShow" size="full" @close="bigImgClose" :close-on-click-modal="true" :showshow-close="false" custom-class="bigimg">-->
      <!--<div class="img-box" @click.stop="bigImgClose">-->
        <!--<img :src="imgUrl" style="max-width: 100%">-->
      <!--</div>-->
    <!--</el-dialog>-->
  </div>

</template>
<script>
  import Bussiness from '../business/index.vue'
  import CallStatus from 'components/public-modules/cache/CallStatus.vue'
  import { isHasFunc, getCallTimeLength } from '../../../../utils/m7Utils.js'
  import emailDetails from 'components/business-modules/email/emailDetails.vue'
  import webChatView from '../../../business-modules/webchat/webChatView.vue'
  export default {
    name: 'contactHistory',
    data () {
      return {
        loading: true,
        count: 0,
        cons: [],
        contactHistoryInfo: {
          isdealog: false,
          labelValue: 3,
          title: '',
          _id: ''
        },
        lastEmail: {},
        chatInformation: {},
        chatWebObject: {},
        contectHistoryList: {},
        businessType: [
          { type: '', name: this.$t('public.all') },
          { type: 'business', name: this.$t('public.business') },
          { type: 'note', name: this.$t('public.contactPlan') },
          { type: 'chat', name: this.$t('public.webchat') },
          { type: 'email', name: this.$t('public.mail') },
          { type: 'callin', name: this.$t('public.callIn') },
          { type: 'callout', name: this.$t('public.callOut') }
        ],
        time: [
          { type: '', name: this.$t('public.all') },
          { type: 'week', name: this.$t('public.last7Days') },
          { type: 'month', name: this.$t('public.last1Month') },
          { type: 'month3', name: this.$t('public.last3Month') }
        ],
        filterTime: '',
        filterType: '',
        listent: false,
        recordFile: '',
        edit: false,
        editObj: null,
        _id: '',
        comments: '',
        nextPage: 1,
        isLoadMoreShow: false,
        lcafre: 'history',
        NoEditNote: false, // 备注的权限
        isListent: false // 通话录音权限
      }
    },
    components: {
      CallStatus,
      Bussiness,
      emailDetails,
      webChatView
    },
    computed: {
      filterTypeName () {
        let that = this
        return this.businessType.filter(val => {
          return val.type === that.filterType
        })[0].name
      },
      filterTimeName () {
        let that = this
        return this.time.filter(val => {
          return val.type === that.filterTime
        })[0].name
      }
    },
    methods: {
      off () {
        this.contactHistoryInfo._id = ''
        this.fetchData(null)
      },
      businessEvent (eventData) {
        let data = eventData.data
        if (eventData.event !== 'changeBusinessMaster') {
          this.$store.dispatch('getBusinessDetailById', {_id: data._id})
        }
      },

      isDealog (flag, id, title, type) {
        this.contactHistoryInfo.isdealog = true
        if (flag === 'showBussinessDetails') {
          this.$store.dispatch('getBusinessDetailById', {_id: id}).then(() => {
            this.contactHistoryInfo.title = title
            this.contactHistoryInfo.labelValue = 1
//          this.contactHistoryInfo.isTitle = true
            this.contactHistoryInfo._id = id
          })
        } else if (flag === 'showEmailDetails') {
          this.$store.dispatch('getLastEmail', {sessionId: id}).then(() => {
            this.lastEmail = this.$store.state.email.lastEmail
            this.contactHistoryInfo.title = title
            this.contactHistoryInfo.labelValue = 2
            this.contactHistoryInfo._id = id
          })
        } else if (flag === 'showWebChatDetails') {
          this.contactHistoryInfo._id = id
          this.contactHistoryInfo.title = title
          this.contactHistoryInfo.labelValue = 3
//          this.$store.dispatch('queryChatInformationById', {_id: id}).then((resp) => {
//            this.chatInformation = resp.chatSession
//            this.$store.dispatch('popupWebchatById', {_id: id, sid: this.chatInformation.sid}).then((resp) => {
//              this.chatInformation.sName = resp.row.name
//              console.log(resp)
//            })
//          })
//          this.$store.dispatch('queryUserContactHistory', {page: 1, sessionId: id, limit: 10}).then((resp) => {
//            this.contectHistoryList = resp.list
//            console.log(resp)
//          })
        }
      },
      handleCommandTime (command) {
        this.filterTime = command
        this.nextPage = 1
        this.fileContactHistory()
      },
      handleCommandType (command) {
        this.filterType = command
        this.nextPage = 1
        this.fileContactHistory()
      },
      closeModal () {
        let myAudio = document.getElementById('call-adiuo2')
        if (myAudio) {
          if (myAudio.currentSrc) {
            myAudio.pause()
          }
        }
      },
      openModal () {
        let myAudio = document.getElementById('call-adiuo2')
        if (myAudio) {
          if (myAudio.paused) {
            myAudio.currentTime = 0
            if (myAudio.currentSrc) { // url 有地址时
              myAudio.play()
            }
          }
        }
      },
      loadMore () {
        let data = {
          customer: this.cid,
          date: this.filterTime,
          type: this.filterType,
          businessType: '',
          page: ++this.nextPage,
          limit: 10
        }
        this.fetchData(data)
      },
      fileContactHistory () {
        let data = {
          customer: this.cid,
          date: this.filterTime,
          type: this.filterType,
          businessType: '',
          page: 1,
          limit: 10
        }
        this.fetchData(data)
      },
      fetchData (data) {
        if (!data) {
          data = {
            customer: this.cid,
            page: 1,
            limit: 10
          }
          this.loading = true
        }
        return this.$store.dispatch('queryCustomerContactHistory', data).then(val => {
          this.count = val.count
          this.loading = false
          let valArr = []
          let indexArr = []
          let currCount = 0
          for (let key in val.contactHistory) {
            valArr.push(val.contactHistory[key])
            indexArr.push(key)
          }
          let i = 0
          let j = 0
          let cons = []
          for (i = 0; i < indexArr.length; i++) {
            let obj = {}
            for (j = 0; j < valArr[i].length; j++) {
              let item = valArr[i][j]
              let type = item.type
              let sclass = item.status
              let platform = item.platform
              sclass = type === 'business' && item.dispose !== 'complete' ? 'buss' : type === 'callout' && item.status === 'dealing' ? 'callout' : type === 'callin' && (item.status === 'dealing' || item.voicemail) ? 'callin' : type === 'email' && item.status === 'still' ? 'email' : type === 'note' && item.status === 'create' ? 'note' : item.status === 'chating' ? 'webchat' : ''
              type = type === 'business' ? 'gongdan' : type === 'callout' ? 'waihu' : type === 'callin' ? 'huru' : type === 'note' ? 'lianxijihua' : type === 'email' ? 'youjian' : type === 'chat' && platform === 'weixin' ? 'weixinzixun' : type === 'chat' && (platform === 'pc' || platform === 'wap') ? 'hulianwang' : type === 'chat' && platform === 'sdk' ? 'yidongduan' : 'zaixianzixun'
              let comments = item.type === 'business' ? false : item.comments || 'true' // 工单类型不显示备注按钮
              let canComments = !(item.type === 'email' || item.type === 'chat' || (item.type === 'note' && item.status !== 'create')) // 备注：工单无；联系计划（未完成的受权限控制）、通话有权限；在线咨询、邮件只读
              item.comments = item.type === 'note' ? item.comments.replace(/\[[^\]]*\]/, '') : item.comments // 如果是联系计划，从comments里去除时间
              let callTimeLen = item.beginTime && item.endTime ? getCallTimeLength(item.endTime - item.beginTime) : 0
              obj = {
                _id: item._id,
                sort: `${item.time}  ${item.agentName}`,
                status: item.dispose || item.disposeDisplay,
                text: item.comments,
                recordFile: item.recordFile,
                sclass: sclass, // 是灰色还是彩色，业务状态
                type: 'icon-' + type, // 业务类型icon判断
                detail: 1,
                comments: comments,
                canComments: canComments,
                callType: item.type,
                callTimeLen: callTimeLen,
                businessTypeName: item.businessTypeName
              }
              if (item.type === 'callin' || item.type === 'callout') {
                obj.status = item.status
              } else if (item.type === 'business') {
//                obj.status = item.businessTypeName + ' / ' + (item.dispose === 'complete' ? this.$t('public.complete') : obj.status)
                obj.status = (item.dispose === 'complete' ? this.$t('public.complete') : obj.status === 'cancel' ? this.$t('public.bussinessCancel') : obj.status)
              }
              cons.push(obj)
            }
            let is = indexArr[i].split('-')
            obj = {
              sort: `${is[1]}/`,
              status: is[2],
              detail: 2
            }
            cons.push(obj)
          }
          if (this.$store.state.session.user.isAdmin || isHasFunc('func_not_edit_remark_field', this.$store.state.session.user)) {
            this.NoEditNote = true // 禁止联系历史通话备注和联系计划备注的编辑
          }
          if (this.$store.state.session.user.isAdmin || !isHasFunc('func_user_call_sheet_listen_file', this.$store.state.session.user)) {
            this.isListent = true
          }

          if (this.nextPage > 1) {
            let lastObj = this.cons[this.cons.length - 1]
            let hasDate = false
            for (let i = 0; i < cons.length; i++) {
              if (cons[i].sort === lastObj.sort && cons[i].status === lastObj.status) {
                hasDate = true
                break
              }
            }
            if (hasDate) {
              this.cons.pop()
            }
            this.cons.push(...cons)
          } else {
            this.loading = false
            this.cons = cons
          }
          // 计算总数
          this.cons.map(con => {
            if (con.detail === 1) {
              currCount++
            }
          })
          if (currCount < this.count) {
            this.isLoadMoreShow = true
          } else {
            this.isLoadMoreShow = false
          }
        })
      },
      popup (recordFile, status) {
        this.listent = true
        let local = window.location.href // 更换录音访问地址头
        if (local.indexOf('https') > -1) {
          let userPbx = this.$store.state.session.user.pbx
          let pbxList = this.$store.state.session.dicMap.pbx
          for (let i = 0; i < pbxList.length; i++) {
            if (pbxList[i]._id === userPbx) {
              if (recordFile) {
                let newRecordFile = recordFile.substring(recordFile.indexOf('monitor'))
                if (pbxList[i].assDomain) {
                  recordFile = pbxList[i].assDomain + '/' + newRecordFile
                }
              }
            }
          }
        }
        if (status !== 'voicemail' || status !== 'dealing') {  // 只有已接听和已留言才会是有效的录音地址
          this.recordFile = ''
        }
        this.recordFile = recordFile
      },
      editComments (item) {
        if (item.canComments) {
          if (item.callType === 'note') {
            this.comments = item.comments.split(']')[1]
          } else {
            this.comments = item.comments === 'true' ? '' : item.comments
          }
          this.edit = true
          this.editObj = item
        }
      },
      submitEdit () {
        if (this.editObj.callType === 'note') {
          let data = {
            _id: this.editObj._id,
            remark: this.comments,
            notifyTime: this.editObj.comments.split(']')[0].replace('[', ''),
            accountId: this.$store.state.session.user.account,
            userId: this.$store.state.session.user._id,
            customerId: this.cid
          }
          if (this.comments.length > 140) {
            this.$message.error('不能超过140个字符')
            return
          }
          if (this.comments.length === 0) {
            this.$message.error('不能为空')
            return
          }
          this.$store.dispatch('updateCustomerContactPlan', data).then(resp => {
            updateRemark(this.cons, this.editObj._id, this.comments, data.notifyTime)
            this.edit = false
            this.editObj = null
            this.$message.success('修改备注成功')
          })
        } else if (this.editObj.callType === 'callin' || this.editObj.callType === 'callout') {
          let data = {
            CALL_SHEET_ID: this.editObj._id,
            memo: this.comments
          }

          this.$store.dispatch('updateCustomerCdrRemark', data).then(resp => {
            updateRemark(this.cons, this.editObj._id, this.comments)
            this.edit = false
            this.editObj = null
            this.$message.success('修改备注成功')
          })
        }
      }
    },
    props: {
      cid: String,
      refresh: {
        type: String,
        default: null
      },
      callScreen: Boolean
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'history') {
          this.filterTime = ''
          this.filterType = ''
          this.fetchData(null)
          this.nextPage = 1
        }
      },
      $route (to, from) {
        if (this.refresh === 'history' || to.path.split('/')[3] === 'webchat_todo') {
          this.fetchData(null)
          this.nextPage = 1
        }
      },
      cons (cur, old) {
        if (old.length > 10) {
          this.$nextTick(function () {
            // document.getElementById('isSrcollBottom').children[0].children[1].scrollTop = document.getElementById('isSrcollBottom').children[0].children[1].scrollHeight
          })
        }
      }
    },
    created () {
      if (this.refresh === 'history' && this.cid) {
        this.fetchData(null)
      }
    }
  }
  function updateRemark (arr, _id, remark, notifyTime) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]._id === _id) {
        arr[i].text = remark
        if (arr[i].callType === 'note') {
          arr[i].comments = `[${notifyTime}]${remark}`
        } else {
          arr[i].comments = remark
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '../../../../assets/common.styl'
.color-green
  color $c-main
  cursor pointer
.next-page
  text-align center
  margin-bottom 20px
  .np-btn
    width 380px
    background $c-main
    border 1px solid $c-main
.p-filter
  padding 0 12px 12px
  &:before
    content ''
    height 1px
    width calc(100% + 40px)
    position absolute
    top 29px
    left -20px
    border-bottom 1px solid $c-border1
.right
  text-align right
.icon-beizhu
  font-size 14px
  color $c-main
  cursor pointer
.null
  color $cf-gray5
.clock
  display inline-block
  position  relative
  top  1px
  width 14px
  height 16px
  line-height 16px
  margin-right 8px
  .iconfont
    font-size 16px
.el-dropdown-link
  color #4ec5ab
  cursor pointer
.el-button
  /*padding  0*/
  span
    display inline-block
    width  14px
    height 14px
    background #f00
.til
  color $cf-gray4
  font-size 12px
.line
  padding-top  30px
  .treat
    position relative
    padding-left 38px
    margin-left 56px
    border-left 1px solid #d3d3d3
    font-size 0
    min-height 54px
    &:last-child
      min-height 23px
    i
      position absolute
      display inline-block
      width 30px
      border-bottom 1px solid #e6e6e6
      top 23px
      left 8px
    img
      position relative
      top -4px
      margin 0 4px
    span
      display inline-block
    .bac
      height 12px
      width: 54px
      background: #fff
      padding: 2px 0
      position absolute
      left -48px
      top 14px
      &:before
        content ""
        width 12px
        height 12px
        display inline-block
        float right
        border-radius 6px
        background-color #d3d3d3
    .ico
      width: 32px
      height: 32px
      line-height 32px
      position: absolute
      z-index 10
      left: -17px
      top: 4px
      border-radius 50%
      border 1px solid #d4d4d4
      color #d4d4d4
      text-align center
      background #fff
      .iconfont
        font-size 20px
        font-weight normal
    .note
      color #f3a720
      border-color #f3a720
    .callin
      color #44b7b2
      border-color #44b7b2
    .callout
      color #44b7b2
      border-color #44b7b2
    .webchat, .hulianwang, .yidongduan, .weixinzixun
      color #44b7b2
      border-color #44b7b2
    .webchat .icon-diannao
      color #2496d0
      border-color #2496d0
    .webchat .icon-yidongduan
      color #5cc1f6
      border-color #5cc1f6
    .webchat .icon-weixinzixun
      color #85bf52
      border-color #85bf52
    .webchat .icon-weibo
      color #fa7d3c
      border-color #fa7d3c
    .webchat .icon-shouji
      color #29ba9c
      border-color #29ba9c
    .email
      color #d498e9
      border-color #d498e9
    .buss
      color #e3746b
      border-color #e3746b
    .buss .icon-gongdan
      color #fa7d3c
      border-color #fa7d3c
    .note .icon-lianxijihua
      color #f3a720
      border-color #f3a720
    .callout .icon-waihu
      color #44b7b2
      border-color #44b7b2
    .callin .icon-huru
      color #44b7b2
      border-color #44b7b2
    .geton
      border-color #f6b549
      .iconfont
        color #f6b549
    .finish
      border-color #bbb
      .iconfont
        color #bbb
    .by
      border-color #e3746f
      .iconfont
        color #e3746f
    .goline
      border-color #b3b3b3
      .iconfont
        color #b3b3b3
    .get_on
      border-color #45b6b0
      top 22px
      .iconfont
        color #45b6b0
    .last
      background-color #fff
      background-position right top
      height 22px
      top 20px
    p
      font-size 12px
      margin-top 6px
      color $cf-gray3
    .notes
      display inline-block
      padding-top 6px
      display flex
      align-items center
      /*width calc(100% - 400px)*/
      .write
        width 14px
        height 14px
        position relative
        top 2px
        cursor pointer
      .memo
        padding 3px 10px
        margin-left 8px
        color #fff
        background #65bef2
        border-radius 2px
        position relative
        top 2px
        width calc(100% - 50px)
        &:before
          content ''
          width 0px
          height 0px
          border 6px solid transparent
          border-right-color #65bef2
          position absolute
          left -12px
          top 5px
      .detail
        color #fff
        height 20px
        position relative
        text-overflow:ellipsis
        overflow:hidden
        white-space: nowrap
        width calc(100% - 45px)
        padding 0 5px
        border-radius 4px
        line-height 20px
        background #64bef2
      i
        position static
        margin-left 4px
        width 0
        height 0
        border 4px solid #64bef2
        border-color transparent #64bef2 transparent transparent

    h3
      display: inline-block
      padding: 0
      /*width: 340px*/
      font-size 14px
      color $cf-gray0
      /*text-overflow:ellipsis
      overflow:hidden
      white-space: nowrap*/
      span
        display: inline-block
        position: relative
        font-weight: normal
      .time
        bottom 2px
        border-radius 4px
        padding 0 4px
        background #7bcdd2
        font-size 12px
        color #fff
        margin-left 26px
        .play
          width: 14px
          height:14px
          /*margin-right 3px*/
          line-height 14px
          border 1px solid #fff
          border-radius 50%
          .pla
            display inline-block
            width 0
            height 0
            border 4px solid #fff
            border-color:transparent transparent transparent #fff;
            margin-left 5px
            margin-top 3px
      .succes
        margin-left:18px
        width: 20px
        height: 20px
        top: 2px
        .iconfont
          font-size 20px
          color #5cbfba
    .date
      color #fff
      height 24px
      width 70px
      line-height 24px
      background #66bdc7
      text-align center
      border-radius 8px
      margin-top 12px
      span
        font-size 18px
  li
    &:first-child
      border-left 0
      &:before
        content ""
        width 1px
        height 60px
        display inline-block
        position absolute
        top 35px
        left 0
        background-color #d3d3d3
    &:last-child
      margin-bottom: 60px
      height: 20px
  .treat .call-h3 span
    display inline
      h3
        display: inline-block
        padding: 0
        /*width: 340px*/
        font-size 14px
        color #333
        /*text-overflow:ellipsis
        overflow:hidden
        white-space: nowrap*/
        span
          display: inline-block
          position: relative
          font-weight: normal
        .time
          bottom 2px
          border-radius 4px
          padding 0 4px
          background #7bcdd2
          font-size 12px
          color #fff
          margin-left 26px
          .play
            width: 14px
            height:14px
            /*margin-right 3px*/
            line-height 14px
            border 1px solid #fff
            border-radius 50%
            .pla
              display inline-block
              width 0
              height 0
              border 4px solid #fff
              border-color:transparent transparent transparent #fff;
              margin-left 5px
              margin-top 3px
        .succes
          margin-left:18px
          width: 20px
          height: 20px
          top: 2px
          .iconfont
            font-size 20px
            color #5cbfba
      .date
        color #fff
        height 24px
        width 70px
        line-height 24px
        background #7bcdd2
        text-align center
        border-radius 8px
        margin-top 12px
        padding 0
        color #fff
        span
          font-size 18px
    li
      &:first-child
        border-left 0
        &:before
          content ""
          width 1px
          height 60px
          display inline-block
          position absolute
          top 35px
          left 0
          background-color #d3d3d3
      &:last-child
        margin-bottom: 60px
        height: 20px
    .treat .call-h3 span
      display inline
.btn
  cursor pointer
  margin 0 auto
  width 130px
  color #fff
  text-align center
  background-color #1ebc9b
  line-height 30px
  height 30px
  border-radius 5px
  .icon-shuaxin
    display inline-block
    span
      font-size 12px
      float right
      padding-left 5px
.next-page
  padding-bottom 20px
.zhezhao
  position fixed
  top 0px
  left 0
  right 0
  bottom 0
  background #000
  opacity .5
  z-index 12
.hide-zhezhao
  display none
.show-zhezhao
  display block
</style>
