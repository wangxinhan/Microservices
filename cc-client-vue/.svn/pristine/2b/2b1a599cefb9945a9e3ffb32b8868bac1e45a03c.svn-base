<template >
<div class="phone-bar">
   <span class="no-link-state fl phone-state" v-if ='noLinkSign'>
      {{ctiUiDesc}}
   </span>
  <div class="phone-state free" :class="[currentStyle]" v-else>
    <div v-if="ctiShowNumber" class="group-wrap">
      <span class="fr">{{mtime}}</span>
      <el-dropdown menu-align="start" @command="changeCdrStatus" class="fr" trigger="click">
        <span class="stateSpan">
          {{ctiUiDesc}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for=" status in phoneBarStauts " :command="status.key">{{status.value}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div v-else>
      <span class="fr">{{mtime}}</span>
      <el-dropdown menu-align="start" @command="changeCdrStatus" trigger="click">
        <span>
          {{ctiUiDesc}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for=" status in phoneBarStauts " :command="status.key">{{status.value}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="callingNum" v-if="ctiShowNumber">
      <span>{{checkHideNum(callingNum)}}</span>
      <span>{{calleeArea}}</span>
    </div>
  </div>
  <el-popover ref="call-history"  placement="bottom" width="300" trigger="click" v-model="callVisible" @show="showCallHistoryPopover">
    <div class="dialout_wrap" id="auto_complete_dialout">
      <el-row class="border-grid">
        <el-col :span="21" class="tac">
          <el-autocomplete
            class="inline-input"
            v-model="phoneNum"
            :fetch-suggestions="querySearch"
            :placeholder="$t('sms.enterNumToSearch')"
            @keyup.native.enter="softBarDialoutPopup"
            :trigger-on-focus="false"
            ></el-autocomplete>
        </el-col>
      </el-row>
      <div class="dialout_button_wrap dialout-button-wrap" @click.stop="softBarDialoutPopup">
        <div class="icon iconfont icon-dianhua"></div>
      </div>
    </div>
    <div class="history-wrap">
      <ul class="history-item">
        <li v-for="item in callList">
          <i :class="'call_'+item.CONNECT_TYPE"></i>
          <div class="history-time">{{item.OFFERING_TIME.substring(11,16)}} {{item.OFFERING_TIME.substring(5, 7)}}/{{item.OFFERING_TIME.substring(8, 10)}}</div>
          <div v-if="item.CONNECT_TYPE=='dialout' || item.CONNECT_TYPE=='dialTransfer'" class="history-dialout" @click.stop="softBarDialoutPopup(item.CALLED_NO)">
            <div class="history-name" :title="item.CUSTOMER_NAME">{{item.CUSTOMER_NAME}}</div>
            <div class="history-phone" :title="checkHideNum(item.CALLED_NO)">(<span>{{checkHideNum(item.CALLED_NO)}}</span>)</div>
          </div>
          <div v-else class="history-dialout" @click.stop="softBarDialoutPopup(item.CALL_NO)">
            <div class="history-name" :title="item.CUSTOMER_NAME">{{item.CUSTOMER_NAME}}</div>
            <div class="history-phone" :title="checkHideNum(item.CALL_NO)">(<span>{{checkHideNum(item.CALL_NO)}}</span>)</div>
          </div>
        </li>
      </ul>
    </div>
  </el-popover>
  <el-popover ref="send-sms" v-model="smsvisible" placement="bottom" width="300" trigger="click" @show="showSmsPopover">
    <div class="send-sms" id="smsWrapPane">
      <h3>{{$t('sms.sendSms')}}
        <el-tooltip class="item" effect="dark" :content="$t('sms.smsWarnText')" placement="right">
           <i class="icon-question"></i>
        </el-tooltip>
      </h3>
      <div class="input-wrap">
        <input type="text" v-model="form.smsPhoneNum" @keyup.enter="sendSms" :placeholder="$t('sms.enterYourPhone')">
        <span class="send-btn" @click.stop="sendSms">{{$t('email.send')}}</span>
      </div>
      <p>{{$t('sms.choiseTemplte')}}</p>
      <template>
        <el-select size="small" v-model="selectedsms" :placeholder="$t('public.pleasePick')" @change="changeout">
          <el-option
            class="sms-select-option"
            v-for="item in smsTemplates"
            :label="item.displayname"
            :value="item.num" v-bind:value="item.num">
          </el-option>
        </el-select>
      </template>
      <div class="warp-pre" id="smsContentPane" v-if="cursmstemplate" v-html="cursmstemplate.contented">
      </div>
      <p class="warp-pre" v-if="cursmstemplate">{{cursmstemplate.signname}}</p>
      <p class="warn-text" v-html="$t('sms.reciprocalNum')"></p>
      <p class="warn-text2" v-html="$t('sms.smsPagingNum')"></p>
      <el-checkbox v-model="closedSms" class="smscheck-btn">{{$t('sms.afterSendClose')}}</el-checkbox><br>
      <el-button type="primary" size="small" @click.stop="reset" class="sms-reset">{{$t('public.reset')}}</el-button>
      <el-button type="primary" size="small" @click.stop="smsvisible = false" class="sms-closed">{{$t('webchat.close')}}</el-button>
    </div>
  </el-popover>
  <div class="phone_bar_btn">
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.callout')" placement="bottom" v-show="dialout">
       <span class="call icon iconfont icon-dianhua" v-show="dialout" @click.stop="getCallList" :callList="callList" v-popover:call-history>
    </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.hangup')" placement="bottom" v-show="hangup">
    <span class="hangup" @click.stop="phoneHangup">
      <i class="iconfont icon-guaduan1"></i>
    </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.phoneHold')" placement="bottom"  v-show="hold">
      <span class="hold" @click.stop="phoneHold">
        <i class="iconfont icon-baochi"></i>
        <!--保持通话-->
      </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.phoneUnhold')" :openDelay="200" transition="fade-leave" placement="bottom" v-show="recover">
      <span class="recover"  @click.stop="phoneUnhold">
        <i class="icon iconfont icon-huifu"></i>
        <!--恢复通话-->
      </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.transfer')" :openDelay="200" transition="fade-leave" placement="bottom"  v-show="transfer" >
      <span class="transfer">
        <transfer :transferData="transferData" :peers="peers" :showTransferDialog="showTransferDialog" :isCloseTransfer="transfer"></transfer>
        <!--转接-->
      </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.consultThreeWay')" :openDelay="200" transition="fade-leave" placement="bottom" v-show="consultThreeWayCall" >
       <span class="consult3way"  @click.stop="phoneThreewaycall('912345')">
        <i class="icon iconfont icon-sanfanghuihua"></i>
        <!--转三方通话-->
      </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.phoneTransfer')" :openDelay="200" transition="fade-leave" placement="bottom" v-show="consultTransfer" >
      <span class="consult-transfer" @click.stop="phoneTransfer('912345', 'number')">
        <i class="icon iconfont icon-zixun"></i>
        <!--转接咨询-->
      </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.threeWay')" :openDelay="200" transition="fade-leave" placement="bottom" v-show="threeway">
      <span class="3way">
        <!--三方通话-->
         <i class="icon iconfont icon-sanfanghuihua"></i>
      </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.consult')" :openDelay="200" transition="fade-leave" placement="bottom"  v-show="consult">
      <span class="consult">
        <consult :transferData="transferData" :peers="peers" :showConsultDialog="showConsultDialog" :isCloseConsult="consult"></consult>
      </span>
      <!--咨询-->
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.phoneStopConsult')" :openDelay="200" transition="fade-leave" placement="bottom"  v-show="stopConsult">
      <span class="stopConsult" @click.stop="phoneStopConsult">
        <i class="icon iconfont icon-quxiaozixun"></i>
        <!--结束咨询-->
      </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="ivr" placement="bottom"  v-show="ivrMenu">
      <span class="ivr" style="color:#999" @click.stop="getIvrMenu">
        <turn-ivr :ivrData="ivrData" :isCloseIvrMenu="ivrMenu"></turn-ivr>
        <!--ivr-->
      </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('softPhoneBar.getInvestigate')" :openDelay="200" transition="fade-leave" placement="bottom"  v-show="Investigate">
      <span class="investigate" @click.stop="getInvestigate">
        <investigate :investData="investData" :isCloseInvestigate="Investigate"></investigate>
       <!--满意度调查-->
      </span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('public.SMS')" :openDelay="200" transition="fade-leave" placement="bottom" v-show="sms">
      <span class="sms icon iconfont icon-duanxin1" id="megSms"  @click.stop="getSmsTemplate" v-popover:send-sms></span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" :content="$t('public.callLabel')" :openDelay="200" transition="fade-leave" placement="bottom"  v-show="setCallLabel">
      <span class="mark">
          <div>
          <i class="icon iconfont icon-dabiaoqian" @click.stop="getMark"> </i>
          <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('public.callLabel')" v-model="calllabel"  class="call-label phonebar-label-dialog">
              <single-label v-if="labelType ==='single'" :callLabel="getSingleLabel" :phoneBarFlag="phoneBarFlag"></single-label>
              <multi-label v-if="labelType ==='multi'" :callLabel="getMultiLabel" :checkLabels="checkLabels" :phoneBarFlag="phoneBarFlag"></multi-label>
          </el-dialog>
        </div>
        <!--打标签-->
      </span>
    </el-tooltip>
    <div><waiting  :waitState="waitState" :showTransferCancelDialog="showTransferCancelDialog"></waiting></div>
    <div id="call_screen_wrap" class="customer-dialog"v-if="getCallCustomerDetail">
      <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('cti.dialoutWinow')" v-model.trim="callScreen" :close-on-click-modal="false" class="el-dailog__customize" size="large" @close="closeCallScreen">
        <template v-if="callScreen">
          <cust-summary v-if="onlyOneCust"
            :customerInfo="customerInfo"
            :hiddenLine = 'hiddenLine'
            :callScreen = 'callScreen'
            :currentBusinessObj = "currentBusinessObj"
            ></cust-summary>
          <add-customer v-if="multiCust"
            :labelValue = "labelValue"
            :isDailog = "true"
            :reSize = "true"
            :isDalog = "callScreen"
            :popupPhoneNumber = "popupPhoneNumber"
            :currentBusinessObj = "currentBusinessObj"
            :custInfo = "custInfo"
            :bindCustomer = 'bindCustomer'
            @merge="MergeCust"
            @addCustomer="addCustomer"
            @changeCustomeLabelValue="changeCustomeLabelValue"
            ></add-customer>
          <edit-cust v-if="updateCust"
            :editCustType ="update"
            :custInfo = "updateCustInfo"
            :isBlight = "false"
            :isDailog = "true"
            :currentBusinessObj = "currentBusinessObj"
            :callBackAdd = 'callBackAdd'
            @editCust='updateCustomer'
            @callBackAddCust = 'callBackAddCust'
            ></edit-cust>
        </template>
      </el-dialog>
    </div>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('cti.dialoutWinow')" v-model.trim="dialoutUrl" :close-on-click-modal="false" size="large">
      <template>
        <iframe :src="getScreenUrl" frameborder="0" class="diaoutUrl"></iframe>
      </template>
    </el-dialog>
  </div>
</div>
</template>
<script>
  import Transfer from './Transfer.vue'
  import TurnIvr from './TurnIvr.vue'
  import Consult from './Consult.vue'
  import Investigate from './Investigate.vue'
  import Waiting from './Waiting.vue'
  import AddCustomer from '../../business-modules/customer/AddCustomer.vue'
  import CustSummary from '../../business-modules/customer/CustSummary.vue'
  import EditCust from '../../business-modules/customer/AddCus.vue'
  import SingleLabel from '../../business-modules/call/SingleLabel.vue'
  import MultiLabel from '../../business-modules/call/MultiLabel.vue'
  import {matchingOperator, getAllUseSingleCallLabel, checkHideTel, getAllUseMultiCallLabel, deepClone} from '../../../utils/m7Utils'
  let form = {
    smsPhoneNum: '',
    // callingNum: '',
    cursmsontent: ''
  }
  export default {
    name: 'PhoneBar',
    data () {
      return {
        value: '',
        hiddenLine: 'hide-line',
        form: {
          smsPhoneNum: '',
          smsTemplateVar1: '',
          smsTemplateVar2: '',
          value: ''
        },
        getSingleLabel: [],
        getMultiLabel: {},
        bindCustomer: {  // 绑定已存在客户的数据
          searchShow: true,
          custObj: {},
          form: {}
        },
        phoneBarFlag: true,
        phoneNum: '',
        newPhoneNum: '',
        smsvisible: false,
        callVisible: false,
        cursmstemplate: '',
        onlyOneCust: false,
        callScreen: false,
        dialoutUrl: false,
        selectedsms: '',
//        customerInfo: '',
        smsTemplates: '',
        calllabel: false,
        closedSms: false,
        multiCust: false,
        labelValue: 0,
        autoCompleteFlag: true,
        callBackAdd: false,
        popupPhoneNumber: '',
        currentBusinessObj: {
          type: 'customer',
          tabType: 'customer_my'
        },
        custInfo: {phone: [{tel: '', memo: ''}]},
        update: 'update',
        updateCust: false,
        updateCustInfo: {},
        labelType: '', // 判断是显示单标签还是多级标签的标志
        callList: [],
        checkLabels: []
      }
    },
    components: {
      Transfer,
      TurnIvr,
      Consult,
      Investigate,
      Waiting,
      AddCustomer,
      CustSummary,
      SingleLabel,
      MultiLabel,
      EditCust
    },
    methods: {
      addCustomer (val) {
        val.callId = this.$store.state.cti.globalLet.screenCallSheetId
        val.dealSrc = 'dialPopup'
        val.actionType = 'self'
        val.callTel = this.newPhoneNum
        this.$store.dispatch('addCustomer', val).then((form) => {
          this.$data.multiCust = false
          this.$data.updateCust = false
          this.$store.commit('CURRENT_CUST_INFO', form.data)
          this.$data.onlyOneCust = true
        })
      },
      showCallHistoryPopover () {
        this.smsvisible = false // 外呼气泡出来时隐藏sms气泡
        this.callVisible = true
      },
      showSmsPopover () {
        this.callVisible = false // sms气泡出来时隐藏外气泡
        this.smsvisible = true
      },
      callBackAddCust (val) { // 外呼弹窗的更新客户信息界面回到新增界面
        this.multiCust = true
        this.updateCust = false
        this.onlyOneCust = false
      },
      updateCustomer (form) {
        form.type = this.currentBusinessObj.type
        form.tabType = this.currentBusinessObj.tabType
        form.callId = this.currentBusinessObj.callId
        this.$store.dispatch('updateCustomer', form).then((resp) => {
          if (!resp) {
            return
          }
          this.updateCust = false
          this.multiCust = false
          this.onlyOneCust = true
          let data = {
            customerId: form._id,
            callId: this.$store.state.cti.globalLet.screenCallSheetId,
            phone: this.newPhoneNum,
            dealSrc: 'dialPopup',
            sessionId: this.$store.state.session.sessionId
          }
          this.$store.dispatch('callScreenLocationCustomer', data).then(resp => {
            this.isDailog = false
            this.$message({
              type: 'success',
              message: this.$t('customer.succMerge')
            })
          })
        })
      },
      closeCallScreen () {
        let node = document.getElementById('close_custom_detail')
        if (node) {
          node.click()
        }
      },
      changeCustomeLabelValue (label) {
        this.labelValue = label.labelValue
      },
      updateSmsNum () {
        let pane = document.getElementById('smsContentPane')
        let paneWrap = document.getElementById('smsWrapPane')
        if (pane) {
          let span = pane.getElementsByClassName('smsTemplateVar')
          if (span) {
            let self = this
            for (var j = 0; j < span.length; j++) {
              span[j].onkeyup = function (cur) {
                self.$store.dispatch('getCache', {type: 'smsSign', id: self.cursmstemplate.sign}).then(curSign => {
                  let content = self.cursmstemplate.content
                  let textCount = self.$store.state.sms.textCount
                  let smsSplitBaseNum = self.$store.state.sms.smsSplitBaseNum
                  let sign = curSign.name
                  let signLen = sign ? sign.length : 0
                  let varLength = self.cursmstemplate.vars * 3
                  let nodeList = paneWrap.getElementsByClassName('smsTemplateVar')
                  let fenzi = paneWrap.getElementsByClassName('fenzi')
                  let fenmu = paneWrap.getElementsByClassName('fenmu')
                  let pagingNum = paneWrap.getElementsByClassName('pagingNum')
                  let inputCount = 0
                  paneWrap.getElementsByClassName('warn-text')[0].style.display = 'block'
                  for (let i = 0; i < nodeList.length; i++) {
                    inputCount += nodeList[i].innerHTML.length
                  }
                  if (fenzi && fenzi.length > 0) {
                    let fenziNum = textCount - signLen + varLength - content.length - inputCount
                    let curElement = cur.srcElement
                    if (fenziNum < 0) {
                      curElement.innerHTML = curElement.innerHTML.substr(0, curElement.innerHTML.length + fenziNum)
                      inputCount = inputCount + fenziNum
                      fenziNum = 0
                    }
                    fenzi[0].innerHTML = fenziNum
                  }
                  if (fenmu && fenmu.length > 0) {
                    fenmu[0].innerHTML = textCount - signLen
                  }
                  if (pagingNum && pagingNum.length > 0) {
                    if ((inputCount + content.length - varLength + signLen) > smsSplitBaseNum) {
                      let n = 1
                      let nc = parseInt((inputCount + content.length - varLength + signLen - smsSplitBaseNum) / smsSplitBaseNum)
                      let nv = (inputCount + content.length - varLength + signLen - smsSplitBaseNum) % smsSplitBaseNum
                      n += nc
                      if (nv > 0) {
                        n += 1
                      }
                      pagingNum[0].innerHTML = n
                      paneWrap.getElementsByClassName('warn-text2')[0].style.display = 'block'
                    } else {
                      pagingNum[0].innerHTML = 1
                    }
                  }
                })
              }
            }
          }
        }
      },
      checkHideNum (num) {
        return checkHideTel(num, this.$store.state.session.user)
      },
      MergeCust (val) {
        this.$data.multiCust = false
//        this.$data.customerInfo = val.custInfo
        this.$store.commit('CURRENT_CUST_INFO', val.custInfo)
        let phoneArr = val.custInfo.phone
        let phoneFlag = false
        if (phoneArr) {
          for (let i = 0; i < phoneArr.length; i++) {
            if (phoneArr[i].tel === this.newPhoneNum) {
              phoneFlag = true
              break
            } else {
              phoneFlag = false
            }
          }
        }
        if (phoneFlag) { // 点击保存按钮之后直接合并客户
          let data = {
            customerId: val._id,
            callId: this.$store.state.cti.globalLet.screenCallSheetId,
            phone: this.newPhoneNum,
            dealSrc: 'dialPopup',
            sessionId: this.$store.state.session.sessionId
          }
          this.$store.dispatch('callScreenLocationCustomer', data).then(resp => {
            this.isDailog = false
            this.$message({
              type: 'success',
              message: this.$t('customer.succMerge')
            })
            this.$data.onlyOneCust = true
          })
        } else {  // 点击保存之后展示更新客户界面，再点保存才真正保存为客户，也可以返回上一个界面
          this.updateCust = true
          this.onlyOneCust = false
          this.callBackAdd = true
          let newPhoneObj = {tel: this.newPhoneNum, memo: ''}
          // 当这个用户没有电话时，没有phone字段
          //
          if (!val.custInfo.phone) {
            val.custInfo.phone = []
          }
          val.custInfo.phone.push(newPhoneObj)
          this.updateCustInfo = val.custInfo
        }
      },
      sendSms () {
        this.form.smsPhoneNum = this.$store.state.call.transCache.megNum ? this.$store.state.call.transCache.megNum : this.form.smsPhoneNum
        let sendphone = this.form.smsPhoneNum
        let pane = document.getElementById('smsContentPane')
        let nodeList = pane.getElementsByClassName('smsTemplateVar')
        let committmpl = {}
        committmpl.operatorStrategy = this.cursmstemplate.operatorStrategy
        committmpl.content = this.cursmstemplate.content
        committmpl.sendType = 'template'
        committmpl.num = sendphone
        committmpl.templateid = this.cursmstemplate._id
        committmpl.template = committmpl.content
        committmpl.vars = nodeList.length
        committmpl.templateSign = this.cursmstemplate.templateSign
        let smsChannelLen = 0
        if (this.cursmstemplate.smsChannel) {
          smsChannelLen = this.cursmstemplate.smsChannel.length
        }
        if (committmpl.operatorStrategy) {
          let param = matchingOperator(sendphone)
          committmpl.smsChannel = this.cursmstemplate[param]
        } else if (smsChannelLen > 0) {
          committmpl.smsChannel = this.cursmstemplate.smsChannel[0]
        } else {
          this.$message.error(this.$t('sms.channelerror'))
          return
        }
        for (let i = 0; i < nodeList.length; i++) {
          let j = i + 1
          committmpl['smsTemplateVar' + j] = this.delSpecialChar(nodeList[i].innerHTML)
          committmpl.content = committmpl.content.replace('{' + j + '}', nodeList[i].innerHTML)
        }
        committmpl.content = this.delSpecialChar(committmpl.content)
        var patrn = /^(13[0-9]{9})|(15[0-9][0-9]{8})|(18[0-9][0-9]{8})|(17[0-9][0-9]{8})|(14[0-9][0-9]{8})$/
        if (!patrn.exec(sendphone)) {
          this.$message.error(this.$t('sms.phonenumerror'))
          return
        }
        if (this.cursmstemplate.signname === '') {
          this.$message.error(this.$t('sms.sendphonenameerror'))
          return
        }
        this.$store.dispatch('sendsms', committmpl).then(req => {
          if (req.success) {
            this.$message.success(this.$t('sms.sendsuccess'))
          } else {
            this.$message.error(this.$t('sms.sendfail'))
          }
          if (this.closedSms) { // 若不勾选发送后关闭窗口
            this.smsvisible = false
          }
        })
      },
//      将英文引号替换成中文
      delSpecialChar (content) {
        content = content.replace(/\\'/g, "'")
        content = content.replace(/\\"/g, '"')
        let contentarr = content.split('"')
        let str = ''
        let str2 = ''
        for (var j = 0; j < contentarr.length - 1; j++) {
          str += contentarr[j] + (j % 2 ? '”' : '“')
        }
        str += contentarr[j]
        contentarr = str.split("'")
        for (var m = 0; j < contentarr.length - 1; m++) {
          str2 += contentarr[m] + (m % 2 ? '’' : '‘')
        }
        str2 += contentarr[m]
        let reg1 = new RegExp('<[^<]*>', 'gi')
        str2 = str2.replace(reg1, '')
        let reg2 = new RegExp('</', 'gi')
        str2 = str2.replace(reg2, '')
        if (str2.substr(str2.length - 1, 1) === '\\' && str2.substr(str2.length - 2, 2) !== '\\\\') {
          str2 = str2 + '\\'
        }
        return str2
      },
      changeout (option) {
        for (let k = 0; k < this.smsTemplates.length; k++) {
          if (this.smsTemplates[k].num === option) {
            this.cursmstemplate = this.smsTemplates[k]
            document.getElementById('smsWrapPane').getElementsByClassName('warn-text')[0].style.display = 'none'
            document.getElementById('smsWrapPane').getElementsByClassName('warn-text2')[0].style.display = 'none'
          }
        }
      },
      reset () {
        Object.assign(this.form, form)
        let nodeList = document.getElementsByClassName('smsTemplateVar')
        for (let i = 0; i < nodeList.length; i++) {
          nodeList[i].innerHTML = ''
        }
        this.closedSms = false
      },
      changeData (event) {
        this.$data.form.smsTemplateVar1 = event.srcElement.innerHTML
      },
      getCallList () {
        let data = {
          DISPOSAL_AGENT: this.$store.state.session.sessionId,
          page: 1,
          pageSize: 10,
          type: 'cdr_my',
          phoneBar: true
        }
        this.$store.dispatch('queryCallList', data).then((resp) => {
          if (resp) {
            this.callList = resp.slice(0, 5)
          }
        })
      },
      phonenumRember (phoneNum) {
        if (phoneNum === '') {
          return
        }
        if (typeof phoneNum === 'object') { // input 为空，直接enter的情况
          return
        }
        let phoneCookie = window.localStorage.getItem('phoneNum') || ''
        let phoneNumArr = phoneCookie.split('%3B')
        let arrLength = phoneNumArr.length
        let sameFlag = false
        if (arrLength !== 0) {
          for (let j in phoneNumArr) {
            if (phoneNum === phoneNumArr[j]) {
              sameFlag = true
            }
          }
        }
        if (!sameFlag) {
          if (arrLength < 5 && arrLength !== 0) {
            let savedNum = phoneNumArr[0]
            for (let i in phoneNumArr) {
              if (i > 0) {
                savedNum = savedNum + '%3B' + phoneNumArr[i]
              }
            }
            phoneNum = phoneNum.trim() + '%3B' + savedNum
          } else if (arrLength === 5) {
            phoneNum = phoneNum.trim() + '%3B' + phoneNumArr[0] + '%3B' + phoneNumArr[1] + '%3B' + phoneNumArr[2] + '%3B' + phoneNumArr[3]
          }
          window.localStorage.setItem('phoneNum', phoneNum)
        }
      },
      softBarDialoutPopup (historyNum) {
        if (typeof historyNum === 'object') { // input 为空，直接enter的情况
          historyNum = ''
        }
        let phoneNum = historyNum || this.$data.phoneNum.trim()
        if (window.sessionStorage.ques_phoneNum) {
          phoneNum = window.sessionStorage.ques_phoneNum
        }
        this.callVisible = false
        this.phonenumRember(phoneNum)
        this.restaurants = this.loadAll()
        this.newPhoneNum = phoneNum
        this.bindCustomer.form = {'field': 'phone', 'combox': this.newPhoneNum, 'custType': 'call', 'page': 1, 'limit': 10}
        // this.callingNum = phoneNum
        this.$store.dispatch('phoneDialout', {phoneNum: phoneNum}).then((res) => {
          window.sessionStorage.ques_phoneNum = ''
        })
      },
      /**
       *  挂机
       */
      phoneHangup () {
        this.$store.dispatch('phoneHangup')
      },
      /**
       *  保持
       */
      phoneHold () {
        this.$store.dispatch('phoneHold')
      },
      phoneUnhold () {
        this.$store.dispatch('phoneUnhold')
      },
      phoneStopConsult () {
        this.$store.dispatch('phoneStopConsult')
      },
      phoneTransfer (num, mode) {
        this.$store.dispatch('phoneTransfer', {phoneNum: num, mode: mode})
      },
      phoneThreewaycall (num) {
        this.$store.dispatch('phoneThreewaycall', num)
      },
      querySearch (queryString, cb) {
        let restaurants = this.restaurants
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0)
        }
      },
      loadAll () {
        let num = window.localStorage.getItem('phoneNum') || ''
        if (!num) {
          this.autoCompleteFlag = false // 不出现autcomplete提示框
        } else {
          this.autoCompleteFlag = true
        }
        let numArr = num.split('%3B')
        let numObj = []
        for (let i = 0; i < numArr.length; i++) {
          numObj.push({'value': numArr[i]})
        }
        return numObj
      },
      changeBusyType (dropdownItem) {
        this.$data.call.busyType = dropdownItem
      },
      changeCdrStatus (command) { // 切换软电话条状态
        let isBusy = true
        if (command === '0') {
          isBusy = false
        }
        let data = {
          isBusy: isBusy,
          busyType: command
        }
        this.$store.dispatch('phoneSetBusy', data)
      },
      getSmsTemplate () {
        this.form.smsPhoneNum = this.$store.state.call.transCache.megNum ? this.$store.state.call.transCache.megNum : this.form.smsPhoneNum
        this.$store.dispatch('getselectsms').then((smsselsect) => {
          if (smsselsect) {
            this.smsTemplates = smsselsect
            this.cursmstemplate = this.smsTemplates[0]
            if (this.smsTemplates[0]) {
              this.selectedsms = this.smsTemplates[0].num
            }
          }
        })
      },
      getInvestigate () {
        this.$store.dispatch('getInvestigate')
      },
      getIvrMenu () {
        this.$store.dispatch('getIvrMenu')
      },
      getMark () {
//        this.$store.dispatch('getMark')
        this.$data.calllabel = true
        this.getAllUseCallLabeles()
      },
      getAllUseCallLabeles () {
        let labelType = this.$store.state.call.transCache.callLabelType
        let allLabel = deepClone(this.$store.state.session.dicMap.callLabel)
        if (allLabel === -1) {
          allLabel = []
        }
        let singleObj = getAllUseSingleCallLabel(allLabel) // 每次都要重新存，不然子组件检测不到变化
        this.$store.commit('call/SET_CALL_SINGLE_LABEL', singleObj)
        let multiObj = getAllUseMultiCallLabel(allLabel)
        this.$store.commit('call/SET_CALL_MULTI_LABEL', multiObj)
        if (labelType === 'single') {
          this.getSingleLabel = singleObj.singleLabel
        } else if (labelType === 'multi') {
          this.getMultiLabel = multiObj
          let labelIdObj = JSON.parse(window.localStorage.getItem('labelIdObj'))
          if (labelIdObj) {
            let newCallId = this.$store.state.cti.globalLet.currentCallSheetId
            if (newCallId) { // 前提要先先取到当前的通话id
              let localCallId = labelIdObj.callId
              if (newCallId !== localCallId) { // 当前id和本地存储的id不一致时，重新储存
                window.localStorage.setItem('labelIdObj', JSON.stringify({'callId': newCallId, 'labelIdArray': []}))
              }
              let obj = JSON.parse(window.localStorage.getItem('labelIdObj'))
              if (obj) {
                if (obj.labelIdArray) {
                  this.checkLabels = obj.labelIdArray
                } else {
                  this.checkLabels = []
                }
              }
            }
          }
        }
      }
    },
    mounted () {
      this.restaurants = this.loadAll()
      this.$store.dispatch('initPhone')
    },
    computed: {
      customerInfo () {
        return this.$store.state.cti.currentCustInfo
      },
      getScreenUrl () { // 外呼对接url
        let url = this.$store.state.cti.globalLet.callScreen
        if (url) {
          this.dialoutUrl = true
          return url.replace('http://', '//')
        } else {
          return ''
        }
      },
      getCallCustomerDetail () { // 外呼弹屏判断是否定位到客户
        let obj = this.$store.state.cti.globalLet.callCustomerDetail
        let flag = this.$store.state.cti.globalLet.callFlag
        if (flag) {
          if (obj.CUSTOMER_TYPE) {
            if (obj.CUSTOMER_TYPE === 'unk') {
              this.$data.multiCust = true
              this.$data.onlyOneCust = false
              this.$data.updateCust = false
              this.$data.labelValue = 3
              this.$data.popupPhoneNumber = ''
              if (!this.newPhoneNum && this.$store.state.cti.globalLet.callingNum) {
                this.bindCustomer.form = {'field': 'phone', 'combox': this.$store.state.cti.globalLet.callingNum, 'custType': 'call', 'page': 1, 'limit': 10}
              }
              this.$data.custInfo.phone[0].tel = this.newPhoneNum || this.$store.state.cti.globalLet.callingNum
            } else if (obj.CUSTOMER_TYPE === 'one') {
              this.$data.multiCust = false
              this.$data.updateCust = false
//            this.$data.customerInfo = obj.list
              this.$store.commit('CURRENT_CUST_INFO', obj.list)
              this.$data.popupPhoneNumber = ''
              this.$data.onlyOneCust = true
            } else if (obj.CUSTOMER_TYPE === 'multi') {
              this.$data.onlyOneCust = false
              this.$data.multiCust = true
              this.$data.updateCust = false
              this.$data.labelValue = 6

              if (!this.newPhoneNum && this.$store.state.cti.globalLet.callingNum) {
                this.bindCustomer.form = {'field': 'phone', 'combox': this.$store.state.cti.globalLet.callingNum, 'custType': 'call', 'page': 1, 'limit': 10}
              }
              this.$data.popupPhoneNumber = this.newPhoneNum || this.$store.state.cti.globalLet.callingNum
              this.$data.custInfo.phone[0].tel = this.newPhoneNum || this.$store.state.cti.globalLet.callingNum
            }
            this.$data.callScreen = true
//            this.$store.commit('CALL_CUSTOMER_DETAIL', {})
            this.$store.commit('SCREEN_FLAG', false)
            return true
          }
        } else {
          this.$data.callScreen = false
          return false
        }
      },
      ctiUiDesc () { // 通话状态
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let busyType = this.$store.state.cti.globalLet.busyType
        let busyTyPeName = this.$store.state.cti.globalLet.busyTypeName[busyType]
        if (currentState === 'peerstate') {
          return busyTyPeName
        } else {
          return this.$store.state.cti.globalLet._cti_ui_desc[currentState]
        }
      },
      noLinkSign () {
        // 未连接状态
        if (this.$store.state.cti.globalLet._cti_currentState === 0) {
          return true
        } else {
          return false
        }
      },
      currentStyle () {
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let busyType = this.$store.state.cti.globalLet.busyType
        if (currentState === 'peerstate') {
          return 'bustype_' + busyType
        } else {
          return 'currentState'
        }
      },
      dialout () { // 是否显示外呼按钮
        let currentState = this.$store.state.cti.globalLet._cti_currentState
        let stateDescription = this.$store.state.cti.globalLet._cti_stateDescription[currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          stateDescription = ctiExtenState
        }
        let dialout = this.$store.state.cti.globalLet._cti_phoneBar_state[stateDescription].dialout
        return dialout ? 1 : 0
      },
      sms () { // 是否显示短信按钮
        let allFun = this.$store.state.session.user.allFun
        if (allFun.indexOf('func_sort_phone_bar_send_sms') !== -1) {
          let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
          let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
          if (ctiExtenState !== '') {
            currentState = ctiExtenState
          }
          let sms = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].sms
          return sms ? 1 : 0
        } else {
          return 0
        }
      },
      setCallLabel () { // 是否显示打标签按钮
        let allFun = this.$store.state.session.user.allFun
        if (allFun.indexOf('func_mark_cdr') !== -1) {
          let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
          let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
          if (ctiExtenState !== '') {
            currentState = ctiExtenState
          }
          let setCallLabel = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].setCallLabel
          if (!setCallLabel) { // 当用户挂断电话的时候，关闭打标签的弹窗
            this.$data.calllabel = false
          }
          return setCallLabel ? 1 : 0
        } else {
          return 0
        }
      },
      ivrMenu () { // 是否显示IVR按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let ivrMenu = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].ivrMenu
        return ivrMenu ? 1 : 0
      },
      hangup () { // 是否显示挂断按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let hangup = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].hangup
        return hangup ? 1 : 0
      },
      hold () { // 是否显示保持按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let hold = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].hold
        return hold ? 1 : 0
      },
      recover () { // 是否显示恢复按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let recover = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].recover
        return recover ? 1 : 0
      },
      transfer () { // 是否显示转接按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let transfer = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].transfer
        return transfer ? 1 : 0
      },
      consult () { // 是否显示咨询按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let consult = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].consult
        return consult ? 1 : 0
      },
      stopConsult () { // 是否显示结束咨询按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let stopConsult = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].stopConsult
        return stopConsult ? 1 : 0
      },
      Investigate () { // 是否显示满意度按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let Investigate = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].Investigate
        return Investigate ? 1 : 0
      },
      consultThreeWayCall () { // 是否显示咨询三方会话按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let consultThreeWayCall = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].consultThreeWayCall
        return consultThreeWayCall ? 1 : 0
      },
      consultTransfer () { // 是否显示咨询转接按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let consultTransfer = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].consultTransfer
        return consultTransfer ? 1 : 0
      },
      threeway () { // 是否显示三方会话按钮
        let currentState = this.$store.state.cti.globalLet._cti_stateDescription[this.$store.state.cti.globalLet._cti_currentState]
        let ctiExtenState = this.$store.state.cti.globalLet._cti_extenState
        if (ctiExtenState !== '') {
          currentState = ctiExtenState
        }
        let threeway = this.$store.state.cti.globalLet._cti_phoneBar_state[currentState].threeway
        return threeway ? 1 : 0
      },
      mtime () { // 软电话条计时
        return this.$store.state.cti.globalLet.mtime
      },
      transferData () {  // 咨询，转接数据
        let currentExten = this.$store.state.session.user.exten
        let transferData = []
        let phoneQueues = this.$store.state.cti.globalLet.phone_queues
        let phonePeers = this.$store.state.cti.globalLet.phone_peers
        for (let key in phoneQueues) {
          let queue = {
            queueId: phoneQueues[key].queueId,
            queueName: phoneQueues[key].DisplayName,
            idleAgentCount: phoneQueues[key].idleAgentCount,
            children: []
          }
          if (phoneQueues[key].idleAgentCount > 0) {
            let members = phoneQueues[key].members
            for (let key in members) {
              let child = {}
              for (let peer in phonePeers) {
                if (members[key] === phonePeers[peer].sipNo) {
                  if (currentExten !== phonePeers[peer].exten) {
                    child.exten = phonePeers[peer].exten
                    child.DisplayName = phonePeers[peer].DisplayName
                    queue.children.push(child)
                    break
                  }
                }
              }
            }
          }
          transferData.push(queue)
        }
        return transferData
      },
      peers () { // 坐席信息
        let phonePeer = this.$store.state.cti.globalLet.phone_peers
        let peers = []
        for (let key in phonePeer) {
          let peer = {
            exten: phonePeer[key].exten,
            DisplayName: phonePeer[key].DisplayName + '[' + phonePeer[key].exten + ']'
          }
          peers.push(peer)
        }
        return peers
      },
      ctiShowNumber () { // 软电话条是否显示号码
        return this.$store.state.cti.globalLet._cti_showNumber
      },
      investData () { // 满意度数据
        let investData = []
        let investList = this.$store.state.cti.globalLet.investigatelist
        let allFun = this.$store.state.session.user.allFun
        if (allFun.indexOf('func_investigate_default_option_hide') === -1) {
          investData.push({DisplayName: this.$t('cti.defaultSati'), Exten: ''}) // 默认满意度
        }
        if (investList) {
          for (let key in investList) {
            investData.push({
              DisplayName: investList[key].DisplayName,
              Exten: investList[key].Exten
            })
          }
        }
        return investData
      },
      ivrData () { // IVR数据
        let ivrMenu = this.$store.state.cti.globalLet.ivrMenu
        let ivrData = []
        if (ivrMenu) {
          for (let key in ivrMenu) {
            ivrData.push({
              DisplayName: ivrMenu[key].DisplayName,
              Exten: ivrMenu[key].Exten
            })
          }
        }
        return ivrData
      },
      waitState () { // 转接或者是咨询后的等待ing
        let waitState = this.$store.state.cti.globalLet.waitSate
        return waitState
      },
      showTransferDialog () {
        let showTransferDialog = this.$store.state.cti.globalLet.showTransferDialog
        return showTransferDialog
      },
      showConsultDialog () {
        let showConsultDialog = this.$store.state.cti.globalLet.showConsultDialog
        return showConsultDialog
      },
      showTransferCancelDialog () {
        let showTransferCancelDialog = this.$store.state.cti.globalLet.showTransferCancelDialog
        return showTransferCancelDialog
      },
      calleeArea () { // 号码归属地
        let area = this.$store.state.cti.globalLet.calleeArea
        if (area.indexOf(' ') !== -1) {
          area = area.replace(/\s/ig, '')
        }
        return area
      },
      callingNum () {
        return this.$store.state.cti.globalLet.callingNum
      },
      phoneBarStauts () {
        let busyTypeName = this.$store.state.cti.globalLet.busyTypeName
        let phoneBarStatus = []
        for (let key in busyTypeName) {
          if (key !== '99') {
            let tempPhoneBarStatus = {key: key, value: busyTypeName[key]}
            phoneBarStatus.push(tempPhoneBarStatus)
          }
        }
        return phoneBarStatus
      }
    },
    beforeMount () {
      let labelType = this.$store.state.call.transCache.callLabelType
      this.labelType = labelType
    },
    beforeUpdate () {
      this.updateSmsNum()
      let pane = document.getElementById('auto_complete_dialout')
      if (pane) {
        let inputNode = pane.getElementsByClassName('el-input__inner')[0]
        if (inputNode) {
          inputNode.focus()
        }
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../../assets/common.styl"
.phone-bar
  float left
  width calc(100vw - 65px - 198px - 350px)
  padding-top 7px
  font-size 16px
  line-height 28px
  .el-dropdown
    color $cf-white
    cursor pointer
    vertical-align top
    font-size 12px
  .phone-state
    float left
    width 180px
    height 28px
    padding 5px 18px
    border-radius 19px
    color $cf-white
    font-size 12px
  .phone-state.free
    background #FF6161
  .phone_bar_btn
    display flex
    padding-left 16px
    span
      display inline-block
      border 1px solid $c-main
      border-radius 50%
      margin-right 6px
      width 34px
      height 34px
      cursor pointer
      font-size 16px
      text-align center
      line-height 34px
      color $c-main
.dialout_wrap,.input-wrap
  bors(1px,#1abc9b)
  border-radius 2px
  position relative
  .icon-dianhua
    font-size 24px
    height 30px
    line-height 30px
    text-align center
    color #fff
  .dialout_button_wrap
    position absolute
    right 0
    top 0
    cursor pointer
    background-color #1abc9b
    width 44px
    height 30px
.input-wrap input
  height 30px
  width 250px
  border 0
  padding-left 4px
  font-size 12px
.history-item li
  white-space nowrap
  padding-top 10px
  min-width 250px
  @extend .font14
  div
    display inline-block
  .history-time
    color $cf-gray4
  .history-dialout
    color #7FD9C7
    padding-left 6px
    cursor pointer
  .history-name
    max-width 5em
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
    vertical-align bottom
  .history-phone span
    display inline-block
    max-width 7em
    white-space nowrap
    text-overflow ellipsis
    overflow hidden
    vertical-align bottom
.send-sms
  color $cf-gray1
  font-size 12px
  .icon-question:after
    icon-ques()
  >p
    line-height 2.5
  .warn-text
    line-height 2
    display none
  .warn-text2
    line-height 1.5
    margin-bottom 10px
    display none
.send-btn
  display block
  background-color #1abc9b
  width 44px
  height 30px
  line-height 30px
  text-align center
  color $cf-white
  float right
  cursor pointer
.input-wrap
  margin-top 20px
#smsContentPane
  padding-top $padding10
[class^='call_']
  font-family "iconfont" !important
  font-size 12px
  font-style normal
  -webkit-font-smoothing antialiased
  display inline-block
  margin-right 4px
.call_dialout:before,.call_dialTransfer:before
  content "\e64f"
  color#44B7AE
.call_normal:before,.call_transfer:before
  content "\e674"
  color #F5A628
.phone-bar .phone-state.bustype_0
  background #1EBC9B
.phone-bar .phone-state.currentState
  background #FF9100
.screen-wrap
  text-align left
  width 100%
  height 100%
  .addCustomer
    border-bottom 0
  .func-tab .el-tabs__header
    border 0
.callingNum
  color #fff
  text-align right
  max-width 100%
  white-space nowrap
  text-overflow ellipsis
  overflow hidden
  line-height 1.5
  span
    font-size 14px
.group-wrap
  font-size 12px
  line-height 1
  &:after
    content ''
    clear both
    display block
    overflow hidden
    height 0
.stateSpan
  margin-right 10px
.call-label
  text-align left
.iconfont
  font-size 18px
.smscheck-btn
  color $cf-gray4
  margin-bottom 10px
.sms-reset
  background #7bcdd2
  border 1px solid #7bcdd2
  margin 0 20px 0 20px
.sms-closed
  background #1abb9c
  border 1px solid #1abb9c
  margin-right 20px
.sms-reset,.sms-closed
  width 110px
  height 30px
  font-size 14px
.sms-tem
  line-height 2
  word-break break-all
.pagingNum
  color #1abb9c
.fenzi
  color #7bcdd2
.fenmu
  color #f08294
.sms-select-option
  max-width 500px
  height auto
  word-wrap break-word
  white-space normal
.warp-pre
  word-wrap break-word
  white-space normal
  line-height 24px
#call_screen_wrap .el-dialog .el-dialog__body .summary
  height 352px
.diaoutUrl
  width 100%
  height 100%
  min-height 420px
.phone-bar .no-link-state
  width 90px
  text-align center
  margin-left 90px
  background #ff6161
</style>
