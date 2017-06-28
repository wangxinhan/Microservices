<template>
  <div class="wrap moniter-table">
    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.callNumMonitorList')}}</span></h3>-->
    <affix :label="$t('monitor.callNumMonitorList')" style="margin-top: 36px;">
      <div class="con">
        <div class="tip">{{$t('monitor.concurrent')}}<span class="concurrent-num">{{concurrent}}</span></div>
        <el-table
          class="moniter-table-xhide"
          :data="phoneServiceNos"
          stripe>
          <el-table-column
            prop="serviceNo"
            :label="$t('monitor.serviceNum')"
            width="">
          </el-table-column>
          <el-table-column
            prop="inCalls"
            :label="$t('monitor.externalCallToday')"
            width="">
          </el-table-column>
          <el-table-column
            prop="inLost"
            :label="$t('monitor.externalCallTodayMiss')"
            width="">
          </el-table-column>
          <el-table-column
            prop="inComplete"
            :label="$t('monitor.externalCallTodayAnswer')"
            width="">
          </el-table-column>
        </el-table>
      </div>
    </affix>

    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.multiChannelMonitorList')}}</span></h3>-->
    <affix :label="$t('monitor.multiChannelMonitorList')">
      <el-table
        class="moniter-table-xhide"
        :data="multiChannel"
        stripe>
        <el-table-column
          prop="name"
          :label="$t('monitor.serviceNum')"
          width="">
        </el-table-column>
        <el-table-column
          prop="newSession"
          :label="$t('monitor.sessionNumToday')"
          width="">
        </el-table-column>
        <el-table-column
          prop="accessSession"
          :label="$t('monitor.sessionNumTodayGet')"
          width="">
        </el-table-column>
        <el-table-column
          prop="closeSession"
          :label="$t('monitor.sessionNumTodayAnswer')"
          width="">
        </el-table-column>
      </el-table>
    </affix>

    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.CallSkillMonitorList')}}</span></h3>-->
    <affix :label="$t('monitor.CallSkillMonitorList')">
      <el-table
        class="moniter-table-xhide"
        :data="phoneQueues"
        stripe>
        <el-table-column
          prop="queueName"
          :label="$t('monitor.skillGroupName')"
          width="">
        </el-table-column>
        <el-table-column
          prop="idleAgentCount"
          :label="$t('monitor.spareAgent')"
          width="">
        </el-table-column>
        <el-table-column
          prop="totalAgentCount"
          :label="$t('monitor.checkInAgent')"
          width="">
        </el-table-column>
        <el-table-column
          prop="queueWaitCount"
          :label="$t('monitor.queueNumber')"
          width="">
          <template scope="scope">
            <div v-if="scope.row.queueWaitCount > 0" style="color:red;">{{scope.row.queueWaitCount}}</div>
            <div v-else>{{scope.row.queueWaitCount}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="linkCalls"
          :label="$t('monitor.connectCallNumToday')"
          width="">
        </el-table-column>
      </el-table>
    </affix>

    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.multiChannelSkillMonitorList')}}</span></h3>-->
    <affix :label="$t('monitor.multiChannelSkillMonitorList')">
      <el-table
        class="moniter-table-xhide"
        :data="multiChannelSkill"
        stripe>
        <el-table-column
          prop="DisplayName"
          :label="$t('monitor.skillGroupName')"
          width="">
        </el-table-column>
        <el-table-column
          prop="autoClaimDisplay"
          :label="$t('monitor.openAutoReceiveAgent')"
          width="">
        </el-table-column>
        <el-table-column
          prop="checkInAgent"
          :label="$t('monitor.checkInAgent')"
          width="">
        </el-table-column>
        <el-table-column
          prop="waitClaim"
          :label="$t('monitor.waitingSessionNum')"
          width="">
          <template scope="scope">
            <div v-if="scope.row.waitClaim > 0" style="color:red;">{{scope.row.waitClaim}}</div>
            <div v-else>{{scope.row.waitClaim}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="manualSession"
          :label="$t('monitor.connectSessionNum')"
          width="">
        </el-table-column>
      </el-table>
    </affix>

    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.outCallMonitorList')}}</span></h3>-->
    <affix :label="$t('monitor.outCallMonitorList')">
      <el-table
        stripe
        class="moniter-table-xhide"
        :data="phone_accountCalls">
        <el-table-column
          prop="outCalls"
          :label="$t('monitor.outCallSum')"
          width="">
        </el-table-column>
        <el-table-column
          prop="outComplete"
          :label="$t('monitor.outCallSuccess')"
          width="">
        </el-table-column>
      </el-table>
    </affix>

    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.agentMonitorList')}}</span></h3>-->
    <affix :label="$t('monitor.agentMonitorList')">
      <div class="Seats">
        <el-row>
          <el-col :span="1" class="search-label">{{$t('public.agent')}}：</el-col>
          <el-col :span="5">
            <el-select size="small" v-model="agent" placeholder="请选择" @change="change" filterable>
              <el-option
                label="全部"
                value="">
              </el-option>
              <el-option
                v-for="item in allAgent"
                :label="item.displayName + '['+ item.exten + ']'"
                :value="item._id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <div class="checkbox-wrap">
              <el-checkbox v-model="includeSubordinate">显示已选座席下级</el-checkbox>
            </div>
          </el-col>
          <el-col :span="2" >
            <div class="search-label fr">{{$t('monitor.agentState')}}：</div>
          </el-col>
          <el-col :span="5">
            <el-select size="small" v-model="state" placeholder="请选择">
              <el-option
                v-for="item in phoneBarStauts"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <div class="config">
              <i class="iconfont icon-peizhi"></i><span class="tex" @click="config">配置显示表头</span>
            </div>
          </el-col>
          <div class="clear10"></div>
        </el-row>
        <el-table
          class = "table"
          max-height = "500"
          :data="monitorAgent"
          stripe>
          <el-table-column
            prop="agentName"
            :label="$t('public.agent')"
            sortable
            width=""
          >
          </el-table-column>
          <el-table-column
            prop="agentNo"
            :label="$t('public.jobNumber')"
            sortable
            width=""
          >
          </el-table-column>
          <el-table-column
            prop="answerStyle"
            :label="$t('monitor.answerMode')"
            width=""
          >
          </el-table-column>
          <el-table-column
            prop="state"
            :label="$t('public.state')"
            sortable
            :sort-method="sortMethod"
            width=""
          >
            <template scope="scope">
              <div style="margin-left: 10px" class="phone-state" ><span v-html="scope.row.state.color"></span>{{scope.row.state.content}}</div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in monitorHeader"
            v-if="item.show === true"
            :prop="item.name"
            :label="item.displayname"
            sortable
            width=""
          >
          </el-table-column>
          <el-table-column
            :context="_self"
            prop="operate"
            :label="$t('public.operate')">
            <template scope="scope">
              <el-popover trigger="hover" placement="right" class="agent-monitor-btn">
                <div style="text-align: center; margin: 0">
                  <div><el-button size="mini" type="text" @click="ctiUiListen(scope.row.operate)" class="listen" :disabled="scope.row.operate.buttonState.listen.disabled" v-if="scope.row.operate.buttonState.listen.show">监听</el-button></div>
                  <!--<el-button size="mini" :disabled="true" >监听</el-button><br>-->
                  <div><el-button size="mini" type="text" @click="ctiUiEndListen(scope.row.operate)" class="endListen"  v-if="!scope.row.operate.buttonState.listen.show">结束监听</el-button></div>
                  <div><el-button size="mini" type="text" @click="ctiUiForceHangup(scope.row.operate)" class="forceHangup" :disabled="scope.row.operate.buttonState.forceHangup.disabled" v-if="scope.row.operate.buttonState.forceHangup.show">强拆</el-button></div>
                  <!--<el-button size="mini" :disabled="true">强拆</el-button><br>-->
                  <div><el-button size="mini" type="text" @click="ctiUiLoot(scope.row.operate)" class="loot" :disabled="scope.row.operate.buttonState.loot.disabled" v-if="scope.row.operate.buttonState.loot.show">抢接</el-button></div>
                  <!--<el-button size="mini" :disabled="true">抢接</el-button><br>-->
                  <div><el-button size="mini" type="text" @click="ctiUiKick(scope.row.operate)" class="kick" :disabled="scope.row.operate.buttonState.kick.disabled" v-if="scope.row.operate.buttonState.kick.show">签出</el-button></div>
                  <!--<el-button size="mini" :disabled="true">签出</el-button><br>-->
                  <div><el-button size="mini" type="text" @click="ctiUiPick(scope.row.operate)" class="pick" :disabled="scope.row.operate.buttonState.pick.disabled" v-if="scope.row.operate.buttonState.pick.show">签入手机</el-button></div>
                  <!--<el-button size="mini" :disabled="true">签入手机</el-button><br>-->
                  <div><el-button size="mini" type="text" @click="ctiUiPick(scope.row.operate, 'gateway')" class="pickGateway" :disabled="scope.row.operate.buttonState.pickGateway.disabled" v-if="scope.row.operate.buttonState.pickGateway.show">签入SIP话机</el-button></div>
                  <!--<el-button size="mini" :disabled="true">签入SIP话机</el-button>-->
                </div>
                <div slot="reference">
                  <el-button type="text" size="small" icon="more"></el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <span style="display:none;">{{monitorAgent}}</span>
      </div>
    </affix>

    <header-option :show="isShow" :option="headOptionsShow"  :noDrag="headOptionsNoShow" type="im_monitor_agent" v-on:close="close"></header-option>
    <el-dialog modal-append-to-body lock-scroll top="10%" title="提示" v-model="dialogFormVisible">
      <div class="moniter-dialog">
        <div class="dialog-title">不能对没有直线号码的座席做签入操作</div>
        <el-row :gutter="15">
          <el-col :span="20">
            <el-form :model="form" :label-position="'left'" label-width="180px">
              <el-form-item :label="formLabel">
                <el-input size="small" v-model="form.mobile" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="4"></el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="saveLocalNumForPhonePick">保存并签入</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
//  let todayIncoming = $t('monitor.todayIncoming')
  import {getCache, deepClone} from '../../../utils/m7Utils.js'
  import {showCountDown} from '../../../utils/workflowUtils.js'
  import {imMonitorGetQueueAutoClaimAgents, ctiUicontrolMonitor, renderAutoClaimDispaly, ctiUiDisplayStatus, ctiUiGetQueuePeer, imMonitorGetQueueAgents, ctiUiDisplayExtenType} from '../../../utils/monitor.js'
  import headerOption from '../report/base/headerOption.vue'
  import affix from './../../ui-modules/affix/Affix.vue'
  export default {
    name: 'monitorTable',
    data () {
      return {
        concurrent: 0,
        visible2: false,
        agent: '',
        allAgent: [],
        allState: {},
        state: '',
        includeSubordinate: false,
        selectState: [],
        monitorPeerDisplay: [],
        ctiUiMonitorTimers: [],
        timer: '',
        isShow: false,
        headOptionsShow: [],
        dialogFormVisible: false,
        formLabel: '为sss[8001]设置直线号码',
        form: {
          _id: '',
          mobile: ''
        },
        headOptionsNoShow: [{'name': 'agentName', displayname: '座席', 'order': 1, 'show': true}, {'name': 'agentNo', displayname: '工号', 'order': 2, 'show': true}, {'name': 'answerStyle', displayname: '接听方式', 'order': 3, 'show': true}, {'name': 'state', displayname: '状态', 'order': 4, 'show': true}]
      }
    },
    computed: {
      currentAgentState () {
        return this.$store.state.monitor.agentStateChange.random
      },
      monitorAgent () {
        let selectAgent = this.change(this.agent)
        let state = this.state
        let arr = this.monitorPeerDisplay
        let result = []
        result = arr.filter(function (item) {
          let filter1 = false
          let filter2 = false
          if (selectAgent.indexOf(item.userId) !== -1) {
            filter1 = true
          }
          if (state === '') {
            filter2 = true
          } else {
            if (state === item.state.content) {
              filter2 = true
            } else {
              filter2 = false
            }
          }
          if (filter1 && filter2) {
            return true
          } else {
            return false
          }
        })
        return result
      },
      multiChannel () {
        let data = this.$store.state.monitor.table.MultiChannel
        let array = []
        for (var i in data) {
          array.push(data[i])
        }
        return array
      },
      multiChannelSkill () {
        let data = this.$store.state.monitor.table.MultiChannelSkill
        let array = []
        for (var i in data) {
          let item = {}
          item.DisplayName = data[i].DisplayName
          item.manualSession = data[i].manualSession
          item.waitClaim = data[i].waitClaim
          item.checkInAgent = imMonitorGetQueueAgents(data[i])
          item.autoClaimDisplay = imMonitorGetQueueAutoClaimAgents(data[i])
          array.push(item)
        }
        return array
      },
      phoneQueues () {
        let data = this.$store.state.cti.globalLet.phone_queues
        let array = []
        for (var i in data) {
          var data1 = {}
          Object.assign(data1, data[i])
          if (data[i].totalAgentCount !== 0) {
            data1.totalAgentCount = data1.totalAgentCount + ctiUiGetQueuePeer(data[i], this.$store.state)
          }
          data1.linkCalls = data1.totalCalls - data1.abadonedCalls
          array.push(data1)
        }
        return array
      },
      phoneServiceNos () {
        let data = this.$store.state.cti.globalLet.phone_serviceNos
        let array = []
        for (var i in data) {
          var data1 = {}
          Object.assign(data1, data[i])
          if (data[i].displayName !== '') {
            data1.serviceNo = data[i].serviceNo + '(' + data[i].displayName + ')'
          }
//          data1.outLost = data[i].outCalls - data[i].outComplete
          array.push(data1)
        }
        return array
      },
      phone_accountCalls () {
        let data = this.$store.state.cti.globalLet.phone_accountCalls
        let array = []
        for (var i in data) {
          array.push(data[i])
        }
        return array
      },
      monitorHeader () {
        let data = deepClone(this.$store.state.monitor.tableHeader.agent.Config) || []
        let arr = [
          { displayname: '会话领取数', name: 'sessionAccessCount', order: '12', show: true },
          { displayname: '主动会话数', name: 'inviteSessionCount', order: '13', show: true },
          { displayname: '当前会话数', name: 'autoStatus', order: '14', show: true },
          { displayname: '在线会话领取', name: 'averageFirstResponseTimeLength', order: '15', show: true },
          { displayname: '邮件会话领取', name: 'mailAutoStatus', order: '16', show: false }
        ]
        for (let i = 0; i < arr.length; i++) {
          let one = data.filter((item, index) => {
            if (item.displayname === arr[i].displayname) {
              data[index].name = arr[i].name
              return true
            } else {
              return false
            }
          })
          if (one.length === 0) {
            data.push(arr[i])
          }
        }
        return data
      },
      phoneBarStauts () {
        let busyTypeName = this.$store.state.cti.globalLet.busyTypeName
        let phoneBarStatus = [{key: '', value: '全部'}]
        for (let key in busyTypeName) {
          if (key !== '99') {
            let tempPhoneBarStatus = {key: busyTypeName[key], value: busyTypeName[key]}
            phoneBarStatus.push(tempPhoneBarStatus)
          }
        }
        let obj1 = {key: '在线', value: '在线'}
        let obj2 = {key: '签出', value: '签出'}
        let obj3 = {key: '离线接听', value: '离线接听'}
        phoneBarStatus.push(obj1)
        phoneBarStatus.push(obj2)
        phoneBarStatus.push(obj3)
        return phoneBarStatus
      }
    },
    components: {
      headerOption,
      affix
    },
    watch: {
      currentAgentState (newValue) {
        let im = this.$store.state.monitor.table.agentMonitor
        let phonePeer = this.$store.state.cti.globalLet.phone_peers
        let newV = this.$store.state.monitor.agentStateChange.userId
        let selectAgent = this.change(this.agent)
        if (selectAgent.indexOf(newV) === -1) {
          return
        }
        let data = this.monitorPeerNew(im[newV], phonePeer[newV])
        let index = -1
        for (let i = 0; i < this.monitorPeerDisplay.length; i++) {
          if (this.monitorPeerDisplay[i].userId === newV) {
            index = i
            break
          } else {
            index = -1
          }
        }
        if (index === -1) {
          this.monitorPeerDisplay.push(data)
        } else {
          this.monitorPeerDisplay.splice(index, 1, data)
        }
      }
    },
    methods: {
      sortMethod (a, b) {
        let x = a.state.content.replace(' ', '')
        let y = b.state.content.replace(' ', '')
        return x.localeCompare(y)
      },
      ctiUiListen (data) {
        let peer = this.$store.state.cti.globalLet.phone_peers[data.userId]
        if (peer == null) {
          this.$message.error(this.$t('cti.chanSpyFailed'))
          return
        }
        if (this.$store.state.cti.globalLet.phone_data.busyType === '0') {
          this.$message.error(this.$t('cti.busyBeforeSpy'))
          return
        }
        if (this.$store.state.cti.globalLet.phone_data.extenType === 'none') {
          this.$message.error(this.$t('cti.spyWithLoginTypes'))
          return
        }
        if (peer.userId === this.$store.state.cti.globalLet.phone_data.userId) {
          this.$message.error(this.$t('cti.noSpyUserSelf'))
          return
        }
        if (peer.callStatus !== 'webcall' && peer.callStatus !== 'inner' &&
          peer.callStatus !== 'normal' && peer.callStatus !== 'dialout' &&
          peer.callStatus !== 'dialTransfer' && peer.callStatus !== 'transfer') {
          this.$message.error(this.$t('cti.statusForbidSpy'))
          return
        }
        this.$store.dispatch('phoneListen', data.channel).then((response) => {
          for (let i = 0; i < this.monitorPeerDisplay.length; i++) {
            let item = this.monitorPeerDisplay[i]
            if (item.userId === data.userId) {
              this.monitorPeerDisplay[i].operate.buttonState.listen = {disabled: true, show: false}
              this.monitorPeerDisplay[i].operate.buttonState.loot = {disabled: true, show: false}
            }
          }
        })
      },
      ctiUiEndListen (data) {
        this.$store.dispatch('phoneHangup').then((response) => {
          for (let i = 0; i < this.monitorPeerDisplay.length; i++) {
            let item = this.monitorPeerDisplay[i]
            if (item.userId === data.userId) {
              this.monitorPeerDisplay[i].operate.buttonState.listen = {disabled: false, show: true}
              this.monitorPeerDisplay[i].operate.buttonState.loot = {disabled: false, show: true}
            }
          }
        })
      },
      ctiUiForceHangup (data) {
        if (data.pbx === this.$store.state.cti.globalLet.phone_data.pbx_in_ip) {
          this.$store.dispatch('phoneHangupChannel', data.channel).then((response) => {
          })
        } else {
          this.$store.dispatch('phoneHangupChannelFromPbx', data).then((response) => {
          })
        }
      },
      ctiUiLoot (data) {
        this.$store.dispatch('phoneLoot', data.linkedChannel).then((response) => {
        })
      },
      ctiUiKick (data) {
        this.$store.dispatch('phoneKick', data.userId).then((response) => {
        })
      },
      ctiUiPick (data, extenType) {
        let dataPick = {
          userId: data.userId,
          extenType: extenType
        }
        this.$store.dispatch('phonePick', dataPick).then((response) => {
          if (response != null && !response.Local) {
            let userInfo = this.$store.state.cti.globalLet.phone_peers[data.userId]
            this.formLabel = '为' + userInfo.DisplayName + '[' + userInfo.exten + ']设置直线号码'
            this.form._id = data.userId
            this.dialogFormVisible = true
          }
        })
      },
      saveLocalNumForPhonePick () {
        this.$store.dispatch('saveLocalNumForPhonePick', this.form).then((response) => {
          this.dialogFormVisible = false
          this.form._id = ''
          this.form.mobile = ''
        })
      },
      change (selectAgent) {
        var agents = []
        let agentList = this.allAgent
        if (selectAgent === '') {
          this.allAgent.forEach(function (item) {
            agents.push(item._id)
          })
        } else {
          agents.push(selectAgent)
        }
        if (this.includeSubordinate) {
          let getAgent = function (pid) {
            for (var i = 0; i < agentList.length; i++) {
              var obj = agentList[i]
              if (obj.parentId && obj.parentId === pid) {
                agents.push(obj._id)
                getAgent(obj._id)
              }
            }
          }
          getAgent(selectAgent)
        }
        return agents
      },
      monitorPeerNew (im, phone) {
        let ctiUiDesc = this.$store.state.cti.globalLet._cti_ui_desc
        let phoneData = this.$store.state.cti.globalLet.phone_data
        let onePeer = phone
        let item = im
        if (!onePeer) {
          return {}
        }
        let agentName = onePeer.DisplayName ? onePeer.DisplayName : ''
        let agentNo = onePeer.exten
        let answerStyle = ctiUiDisplayExtenType(onePeer)
        let state = ctiUiDisplayStatus(onePeer, ctiUiDesc, phoneData)
//          let stateTime = onePeer.DialoutTimeLength
        let dealingTime = showCountDown(onePeer.DialoutTimeLength)
        let queueName = onePeer.queueName ? onePeer.queueName : ''
        let customerNo = onePeer.callNo
        let answerCount = onePeer.InComplete
        let dealingCount = onePeer.OutCalls
        let dealingSuccessCount = onePeer.OutComplete
        let sessionAccessCount = item.claim ? item.claim : 0
        let inviteSessionCount = item.invitsession ? item.invitsession : 0
        let autoStatus = item.dealing ? item.dealing : 0
        let averageFirstResponseTimeLength = this.$t(renderAutoClaimDispaly(item.autoClaim))
        let mailAutoStatus = this.$t(renderAutoClaimDispaly(item.mailAutoClaim))
        let buttonState = ctiUicontrolMonitor(onePeer, phoneData)
        let operate = {channel: onePeer.channel, userId: onePeer.userId, pbx: onePeer.pbx, linkedChannel: onePeer.linkedChannel, buttonState}
        let stateTimeNum = ''
        let stateTime = ''
        if (onePeer.login && onePeer.timestamp) {
          var date = new Date()
          var identity = date.valueOf()
          var oldTime = ((identity - phoneData.currentServerTime) - parseFloat(onePeer.timestamp) * 1000) / 1000
          if (oldTime < 0) {
            oldTime = 0
          }
          stateTimeNum = oldTime
          stateTime = showCountDown(oldTime * 1000)
        } else {
        }
        return {userId: onePeer.userId, agentName, agentNo, answerStyle, state, stateTimeNum, stateTime, dealingTime, queueName, customerNo, answerCount, dealingCount, dealingSuccessCount, sessionAccessCount, inviteSessionCount, autoStatus, averageFirstResponseTimeLength, mailAutoStatus, operate}
      },
      timeChange () {
        let self = this
        this.timer = window.setInterval(function () {
          for (let i = 0; i < self.monitorPeerDisplay.length; i++) {
            if (self.monitorPeerDisplay[i].stateTimeNum !== '') {
              self.monitorPeerDisplay[i].stateTime = showCountDown((self.monitorPeerDisplay[i].stateTimeNum++) * 1000)
            }
          }
        }, 1000)
      },
      config () {
        this.$store.dispatch('getReportTableHeader', 'im_monitor_agent').then((res) => {
          let config = res.Config || []
          let arr = [
            { displayname: '会话领取数', name: 'sessionAccessCount', order: '12', show: true },
            { displayname: '主动会话数', name: 'inviteSessionCount', order: '13', show: true },
            { displayname: '当前会话数', name: 'autoStatus', order: '14', show: true },
            { displayname: '在线会话领取', name: 'averageFirstResponseTimeLength', order: '15', show: true },
            { displayname: '邮件会话领取', name: 'mailAutoStatus', order: '16', show: false }
          ]
          for (let i = 0; i < arr.length; i++) {
            let one = config.filter((item, index) => {
              if (item.displayname === arr[i].displayname) {
                config[index].name = arr[i].name
                return true
              } else {
                return false
              }
            })
            if (one.length === 0) {
              config.push(arr[i])
            }
          }
          res.Config.splice(0, 4)
          this.headOptionsShow = res
          this.isShow = !this.isShow
        })
      },
      close (data) {
        this.isShow = false
        if (data === 'save') {
          this.$store.dispatch('getReportTableHeader', 'im_monitor_agent').then((res) => {
            this.$store.commit('monitor/TABLEHEADER_AGENT', {data: res})
          })
        }
      }
    },
    beforeMount () {
      this.allAgent = getCache('agents')
      let im = this.$store.state.monitor.table.agentMonitor
      let phonePeer = this.$store.state.cti.globalLet.phone_peers
      for (var n in phonePeer) {
        this.monitorPeerDisplay.push(this.monitorPeerNew(im[n], phonePeer[n]))
      }
      this.timeChange()
      this.$store.dispatch('getConcurrent').then(() => {
        this.$data.concurrent = this.$store.state.cti.globalLet.limits
      })
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../assets/common.styl';
  .wrap
    padding 0 15px 20px
    overflow auto
    .con
      width 98%
      margin 0 auto
      .el-table
        width 100%
    .Seats
      width 98%
      margin 0 auto
      .el-table
        width 100%
      .el-row
        height 48px
        border 1px solid #dedede
        border-bottom none
        padding 8px 0 0 20px
        line-height 24px
    .tip
      height 48px
      border 1px solid #dedede
      border-bottom none
      padding-left 20px
      line-height 48px
      .concurrent-num
        display inline-block
        width 20px
        height 20px
        background #7cccd3
        text-align center
        line-height 20px
        margin-left 8px
        border-radius 10px
  .el-table
    width 98%
    margin 0 auto
    .cell
      color #a6a6a6
  .checkbox-wrap
    padding 4px 0 0 10px
  .search-label
    padding 4px 0 0 0
  .config
    padding 6px 0 0 0
    .tex
      margin-left 10px
      position relative
      top -2px
      cursor pointer
      &:hover
        color #1abb9c
    .iconfont
      fontSize 18px
      color #27c0a4
  .title
      color #000
      margin 28px 0 18px 0
      font-weight normal
      position relative
      .sign
        position relative
        width 12px
        height 12px
        background #7ccdd1
        display inline-block
        z-index 3
      .text
        position relative
        display inline-block
        padding 0 8px 0 10px
        background #fff
        z-index 3
      &:after
        content ""
        display inline-block
        width 100%
        left 0
        border-bottom 1px dashed #a6a6a6
        position absolute
        top 12px
  .phone-state
    position relative
  .moniter-dialog
    padding 10px
    .dialog-title
      font-size 14px
      padding 15px 0
</style>
