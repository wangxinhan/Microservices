<template>
  <div v-if="getCurrentCallData" v-loading="loading" class="detail-wrap">
    <affix :label="$t('call.callInfo')" class="call-detail">
      <table>
        <tr>
          <td>{{$t('call.callType')}}</td>
          <td>
            <call-type :code="getCurrentCallData.CONNECT_TYPE"></call-type>
          </td>
          <td>{{$t('public.calling')}}</td>
          <td v-if="getCurrentCallData.CONNECT_TYPE === 'normal' || getCurrentCallData.CONNECT_TYPE === 'transfer'">
            {{checkHideNum(getCurrentCallData.CALL_NO)}}
            <i v-if="isToBlackList" class="icon iconfont icon-heimingdan" @click="addCdrBlackList(getCurrentCallData.CALL_NO)"></i>
          </td>
          <td v-else>
            {{getCurrentCallData.CALL_NO}}
            <i v-if="isToBlackList" class="icon iconfont icon-heimingdan" @click="addCdrBlackList(getCurrentCallData.CALL_NO)"></i>
          </td>
          <td>{{$t('public.called')}}</td>
          <td v-if="getCurrentCallData.CONNECT_TYPE === 'dialout' || getCurrentCallData.CONNECT_TYPE === 'dialTransfer'">
            {{checkHideNum(getCurrentCallData.CALLED_NO)}}
            <i v-if="isToBlackList" class="icon iconfont icon-heimingdan" @click="addCdrBlackList(getCurrentCallData.CALLED_NO)"></i>
          </td>
          <td v-else>
            {{getCurrentCallData.CALLED_NO}}
            <i v-if="isToBlackList" class="icon iconfont icon-heimingdan" @click="addCdrBlackList(getCurrentCallData.CALLED_NO)"></i>
          </td>
        </tr>
        <tr>
          <td>{{$t('public.province')}}</td>
          <td>{{getCurrentCallData.PROVINCE}}</td>
          <td>{{$t('public.city')}}</td>
          <td>{{getCurrentCallData.DISTRICT}}</td>
          <td>{{$t('public.satisfaction')}}</td>
          <td>{{getInvestigate}}</td>
        </tr>
        <tr>
          <td>{{$t('public.callTime')}}</td>
          <td>{{getCurrentCallData.OFFERING_TIME}}</td>
          <td>{{$t('call.pickUpTime')}}</td>
          <td>{{getCurrentCallData.BEGIN_TIME}}</td>
          <td>{{$t('call.callTime')}}</td>
          <td>{{ callTimeLen }}</td>
        </tr>
        <tr>
          <td>{{$t('public.callStatus')}}</td>
          <td>
            <call-status :status="status"></call-status>
          </td>
          <td>{{$t('public.handleAgent')}}</td>
          <td class="ellipsis table-agent">
            <agent :id="disposalAgent" :isNum="true"></agent>
          </td>
          <td>{{$t('call.skillGroup')}}</td>
          <td><queues :exten="getCurrentCallData.ERROR_MEMO"></queues></td>
        </tr>
        <tr>
          <td>{{$t('call.queueLen')}}</td>
          <td>{{ queueTimeLen }}</td>
          <td>{{$t('call.sign')}}</td>
          <td colspan="3" v-if="!getCurrentCallData.KEY_TAG"></td>
          <td colspan="3" v-else-if="getCurrentCallData.KEY_TAG&&getCurrentCallData.KEY_TAG===true">
            <span v-if="showKeyTag">{{$t('public.yes')}}&nbsp;&nbsp;&nbsp;</span>
            <el-popover
                    ref="keyTag"
                    placement="top"
                    width="160"
                    v-model="cancleKeyTag">
              <p>是否取消对该通话的标记？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="cancleKeyTag = false">取消</el-button>
                <el-button type="primary" size="mini" @click="sureCancleKeyTag(getCurrentCallData._id)">确定</el-button>
              </div>
            </el-popover>
            <i class="icon iconfont icon-guanbi" v-if="showKeyTag" v-popover:keyTag></i>
          </td>
          <td colspan="3" v-else>{{$t('public.no')}}</td>
        </tr>
        <tr v-if="isListent">
          <td>{{$t('call.callRecording')}}</td>
          <td colspan="5">
            <audio controls="" v-if="getCurrentCallData.STATUS=='voicemail'|| getCurrentCallData.STATUS =='dealing'" v-bind:src ="recordFileName(getCurrentCallData.FILE_SERVER,getCurrentCallData.RECORD_FILE_NAME)" __audio_auto_play=""></audio>
            <audio controls="" v-else src="" __audio_auto_play=""></audio>
            <a v-if='isDownload' class="call_sheet_download_file" :href="recordFileName(getCurrentCallData.FILE_SERVER,getCurrentCallData.RECORD_FILE_NAME)" target="_blank" download>{{$t('call.downloadAudio')}}</a>
          </td>
        </tr>
        <tr>
          <td>{{$t('call.callNote')}}</td>
          <td colspan="5">
            <textarea class="remarks" rows="3"  disabled="" :placeholder="$t('call.callNotePlaceHolder')">{{getCurrentCallData.COMMENTS}}</textarea>
          </td>
        </tr>
      </table>
    </affix>
    <affix :label="$t('call.callLabelAndSQ')" v-if="isMark">
      <div class="sq-label-wrap">
        <span>{{$t('call.SQLabel')}}:</span>
        <span class="sq-label" v-if="allQSLabel.length <= 0">{{$t('call.noSQLabel')}}</span>
        <span class="sq-label" v-else>{{getSQLabelName(getCurrentCallData.SQ_LABEL)}}</span>
      </div>
      <single-label v-if="labelType === 'single'" :callLabel="getCallLabel" :disabled="labelDisabled" :checkLabels="getCurrentCallData.LABELS || []" :callSheetId="getCurrentCallData._id"></single-label>
      <multi-label v-if="labelType === 'multi'" :callLabel="getCallLabel" :disabled="labelDisabled" :checkLabels="getCurrentCallData.LABELS || []" :callSheetId="getCurrentCallData._id"></multi-label>
    </affix>
    <div v-if="getCurrentCallData.ivr_contrail&&getCurrentCallData.ivr_contrail.length>0">
      <affix :label="$t('call.ivrTrajectory')">
        <contrail :ivrData="getCurrentCallData.ivr_contrail" :connectType="getCurrentCallData.CONNECT_TYPE"></contrail>
      </affix>
    </div>
    <div v-if="getCurrentCallData.transfer_contrail&&getCurrentCallData.transfer_contrail.length>0">
        <affix :label="$t('call.transferContrail')" class="call-detail">
          <table>
            <tr>
              <td>{{$t('public.time')}}</td>
              <td>{{$t('call.transferFrom')}}</td>
              <td>{{$t('call.transferAction')}}</td>
              <td>{{$t('call.transferTo')}}</td>
            </tr>
            <tr v-for="item in getCurrentCallData.transfer_contrail">
              <td>{{item.beginTime}}</td>
              <td>{{item.transferFrom}}</td>
              <td>{{$t('call.transferToName',{transferToName: item.transferAction})}}</td>
              <td>{{item.transferTo}}</td>
            </tr>
          </table>
        </affix>
    </div>
  </div>
</template>
<script>
  import Affix from 'components/ui-modules/affix/Affix'
  import SingleLabel from 'components/business-modules/call/SingleLabel'
  import MultiLabel from 'components/business-modules/call/MultiLabel'
  import Contrail from 'components/business-modules/call/Contrail'
  import { getCallTimeLength, getAllUseSingleCallLabel, getAllUseMultiCallLabel, isHasFunc, checkHideTel, deepClone, getSingleOrMultiLabelNameById } from '../../../../utils/m7Utils.js'
  import Agent from 'components/public-modules/cache/Agent'
  import Queues from 'components/public-modules/cache/Queues'
  import CallStatus from 'components/public-modules/cache/CallStatus'
  import CallType from 'components/public-modules/cache/CallType'
  function getCallDetail (store, _id, type) {
    let data = {data: _id, type: type}
    return store.dispatch('getSelectedCallInfo', data)
  }
  export default {
    name: 'CallDetail',
    data () {
      return {
        getCurrentCallData: null,
        disposalAgent: '',
        status: '',
        isListent: false,
        isDownload: false,
        isToBlackList: false,
        isMark: false,
        labelDisabled: false,
        loading: true,
        labelType: '', // 判断是显示单标签还是多级标签的标志
        allQSLabel: [],
        cancleKeyTag: false,
        showKeyTag: true
      }
    },
    props: {
      refresh: String
    },
    components: {
      Affix,
      SingleLabel,
      MultiLabel,
      Contrail,
      Agent,
      CallStatus,
      CallType,
      Queues
    },
    computed: {
      callTimeLen () {
        return getCallTimeLength(this.getCurrentCallData.CALL_TIME_LENGTH)
      },
      queueTimeLen () {
        return getCallTimeLength(this.getCurrentCallData.QUEUE_TIME_LENGTH)
      },
      getCallLabel () {
        let labelType = this.$store.state.call.transCache.callLabelType
        let allLabel = deepClone(this.$store.state.session.dicMap.callLabel)
        if (allLabel === -1) {
          allLabel = []
        }
        let routeArry = this.$route.path.split('/')
        let tabType = routeArry[3]
        if (tabType === 'cdr_all') { // 所有通话里面不能打标签
          this.labelDisabled = true
        }
        let multiObj = this.$store.state.call.transCache.multiLabel
        let singleObj = this.$store.state.call.transCache.singleLabel
        if (multiObj.allLabels && labelType === 'multi') { // 能取多标签并且状态是多级
          return multiObj
        } else if (singleObj.singleLabel && labelType === 'single') { // 能取单标签并且状态是单级
          return singleObj.singleLabel
        } else { // 取不到标签，重新往call里面存单标签和多标签
          let singleObj = getAllUseSingleCallLabel(allLabel)
          this.$store.commit('call/SET_CALL_SINGLE_LABEL', singleObj)
          let multiObj = getAllUseMultiCallLabel(allLabel)
          this.$store.commit('call/SET_CALL_MULTI_LABEL', multiObj)
          if (labelType === 'single') {
            return singleObj.singleLabel
          } else if (labelType === 'multi') {
            return multiObj
          }
        }
      },
      getInvestigate () {
        let options = this.$store.state.session.dicMap.investigate
        for (let i = 0; i < options.length; i++) {
          if (this.getCurrentCallData.INVESTIGATE === options[i].value) {
            return options[i].name
          }
          return ''
        }
      }
    },
    methods: {
      sureCancleKeyTag (id) { // 移除通话标记
        let lastData = {CALL_SHEET_ID: id}
        this.$store.dispatch('removeKeyTag', lastData).then((req) => {
          this.cancleKeyTag = false
          this.showKeyTag = false // 隐藏表格中的字段
          this.$store.commit('call/SET_SHOW_KEY_TAG', id) // 隐藏卡片中的icon
        })
      },
      getSQLabelName (id) {
        return getSingleOrMultiLabelNameById(this.allQSLabel, id)
      },
      fetchData () {
        let routeArry = this.$route.path.split('/')
        let _id = routeArry[4]
        this._id = routeArry[4]
        let tabType = routeArry[3]
        this.loading = true
        getCallDetail(this.$store, _id, tabType).then((val) => {
          this.getCurrentCallData = this.$store.state.call.current[tabType].callInfo
          this.disposalAgent = this.getCurrentCallData.DISPOSAL_AGENT
          this.status = this.getCurrentCallData.STATUS
          this.loading = false
        })
      },
      recordFileName (server, name) {
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
        return server + '/' + name
      },
      checkHideNum (num) {
        return checkHideTel(num, this.$store.state.session.user)
      },
      addCdrBlackList (phoneNum) {
        let numPattern = new RegExp(/^((\d{11,12})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/)
        if (!numPattern.test(phoneNum)) {
          this.$message.error(this.$t('call.phoneNumNoRight'))
          return false
        }
        this.$confirm(this.$t('call.blackListConfirm'), this.$t('public.tip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then(() => {
          let data = {}
          data.PBX = this.$store.state.session.user.pbx
          data.Account = this.$store.state.session.user.account
          data.BlackNum = phoneNum
          data.Type = '1'
          let displayName = this.$store.state.session.user.displayName
          let exten = this.$store.state.session.user.exten
          data.Memo = this.$t('customer.memo', {displayName, exten})
          let routeArry = this.$route.path.split('/')
          let tabType = routeArry[3]
          let lastData = {data: data, type: tabType}
          this.$store.dispatch('saveBlackList', lastData)
        })
      }
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'callDetail') {
          this.fetchData()
        }
      }
    },
    beforeMount () {
      if (this.$store.state.session.user.isAdmin || !isHasFunc('func_user_call_sheet_listen_file', this.$store.state.session.user)) {
        this.isListent = true // 禁止听录音权限
        if (this.$store.state.session.user.isAdmin || !isHasFunc('func_user_call_sheet_download_file', this.$store.state.session.user)) {
          this.isDownload = true // 禁止下载录音权限
        }
      }
      if (!isHasFunc('func_not_allow_add_blacklist', this.$store.state.session.user)) {
        this.isToBlackList = true // 禁止加入黑名单权限
      }
      if (isHasFunc('func_mark_cdr', this.$store.state.session.user)) {
        this.isMark = true // 通话标签权限
      }
      this.fetchData()
      let labelType = this.$store.state.call.transCache.callLabelType
      this.labelType = labelType
      let sqLabels = this.$store.state.session.dicMap.sqLabels
      if (!sqLabels) { // 若取到了便不再发送请求
        this.$store.dispatch('getCache', {type: 'sqLabels'}).then((req) => {
          this.allQSLabel = req
        })
      } else {
        this.allQSLabel = sqLabels
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/common.styl'
  .call-detail table
    bors(1px,#ddd)
    width 100%
    border-collapse collapse
    tr
      height 40px
      border-bottom 1px solid #e7e7eb
      td
        padding 10px
        color #000
        &:nth-of-type(even)
          color #333
    tr:nth-of-type(even) td
      background #f4f5f9
    tr:hover td
      background #f5f5f5
  .call-detail table tr:nth-last-child(1)
    border-bottom none
  .remarks
    border-radius 3px
    width 100%
    margin-top 9px
    box-sizing border-box
    color #999
    padding 4px 6px
    background #fafafa
    bors(1px,#ddd)
  .detail-wrap
    color $cf-gray1
  .icon
    cursor pointer
  .table-agent
    max-width 5em
  .sq-label
    padding-left 10px
  .sq-label-wrap
    padding-bottom 16px
  .icon-guanbi
    font-size 12px
    font-weight bold
</style>
