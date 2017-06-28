<template>
  <div :class="!phoneBarFlag?'clear-wrap':''">
    <div class="zhezhao" :class="checkSingleLabel?'show-zhezhao':'hide-zhezhao'" v-if="flag === 'QC'"></div>
    <div class="box-wrap">
      <span class="label-title">{{$t('public.callLabel')}}：</span>
      <div class="label-contain" v-if="callLabel.length <=0">{{$t('call.noCallLabel')}}</div>
      <div class="label-contain" v-else>
        <ul class="ul-name clearfix">
          <!--是多级标签并且不是停用的-->
          <li v-for ='item in checkLabels' v-if="item.indexOf('@') > -1 && trunLableNameById(item)">{{trunLableNameById(item)}}</li>
        </ul>
        <div :class="hasMulti?'has-multi':''">
          <div v-for="item in groupCallLabel" class="label-clear">
            <label class="label-box">
              <input type="checkbox" v-model.trim="item.checked" :disabled="disabled" :name="item._id" :value="item._id" @change="changeCallLabel(item._id,item.name,item.checked)"><span class="label-text">{{item.name}}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <el-button type="primary" v-if="!phoneBarFlag && getTabType === 'cdr_my' || getTabType === 'cdr_all'&&!phoneBarFlag" :class="getTabType === 'cdr_all'?'opera-left': ''" class="fr" size="small" @click.stop="checkOperationLog">{{$t('call.checkOperate')}}</el-button>
    <el-dialog :title="$t('public.changeLog')" v-model="checkOpearaDialog" class='call-label-dialog'>
      <div v-if="operaHistory&&operaHistory.length<=0" class="no-opera">{{$t('call.noOperate')}}</div>
      <operation-log v-else :labelOperaHistory = 'operaHistory'></operation-log>
    </el-dialog>
    <el-dialog :title="$t('public.tip')" v-model="checkSingleLabel" :modal="flag==='QC'?false:true" :show-close="false" :close-on-click-modal="false">
      <span>{{$t('call.replaceMultiLabel')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleWarning">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="warningCheckLabel">{{$t('public.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getSingleOrMultiLabelNameById, getCache } from '../../../utils/m7Utils.js'
  import OperationLog from 'components/public-modules/cust-tab-content/operation-log/'
  export default {
    name: 'SingleLabel',
    data () {
      return {
        checkOpearaDialog: false,
        hasMulti: false,
        checkSingleLabel: false,
        interimId: '',
        interimName: '',
        cancleFlag: false,
        cancleArr: []
      }
    },
    props: {
      callLabel: Array,
      checkLabels: Array,
      callSheetId: String,
      disabled: Boolean,
      flag: String,
      phoneBarFlag: Boolean
    },
    computed: {
      groupCallLabel () {
        let all = this.callLabel
        let check = []
        if (this.phoneBarFlag) {
          let labelIdObj = window.localStorage.getItem('labelIdObj')
          let newCallId = this.$store.state.cti.globalLet.currentCallSheetId
          if (newCallId) { // 前提要先先取到当前的通话id
            let localCallId = labelIdObj.callId
            if (newCallId !== localCallId) { // 当前id和本地存储的id不一致时，重新储存
              window.localStorage.setItem('labelIdObj', JSON.stringify({'callId': newCallId, 'labelIdArray': []}))
            }
          }
          if (labelIdObj) {
            labelIdObj = JSON.parse(labelIdObj)
            let callId = this.$store.state.cti.globalLet.currentCallSheetId
            if (labelIdObj.callId === callId) {
              check = labelIdObj.labelIdArray
            }
          }
        } else {
          check = this.checkLabels
        }
        let cancleArr = this.cancleArr
        let newCallLabel = []
        for (let item in all) {
          newCallLabel.push(all[item])
          newCallLabel[item].checked = false
          for (let checkItem in check) {
            if (check[checkItem] === all[item]._id) {
              newCallLabel[item].checked = true
              break
            }
          }
          for (let cancleItem in cancleArr) { // 为了弹框点击取消的时候，回退到单标签没有选中的状态
            if (cancleArr[cancleItem] === all[item]._id) {
              newCallLabel[item].checked = false
              break
            }
          }
        }
        return newCallLabel
      },
      getTabType () {
        let routeArry = this.$route.path.split('/')
        let tabType = routeArry[3]
        return tabType || ''
      },
      getServerUrl () {
        let pbxid = this.$store.state.session.user.pbx
        let curpbx = ''
        let assDomain = ''
        if (pbxid) {
          curpbx = getCache('pbx', pbxid)
          assDomain = curpbx.assAddr
        }
        return assDomain
      }
    },
    methods: {
      getAllCheck () {
        return this.groupCallLabel.filter(item => item.checked).map(item => item._id)
      },
      trunLableNameById (item) { // 通话标签id来匹配标签名字,取之前打过标签的名字
        if (!item) {
          return ''
        }
        let usedLabel = []
        if (item.indexOf('@') !== -1) { // 判断是不是多级
          this.hasMulti = true
          usedLabel = item.split('@') // @1@2@3拆分为数组
          usedLabel.pop()
        } else {
          this.hasMulti = false
        }
        let labelName = ''
        let allMultiLabel = this.$store.state.call.transCache.multiLabel.allLabels
        for (var j = 0; j < usedLabel.length; j++) {
          if (getSingleOrMultiLabelNameById(allMultiLabel, usedLabel[j])) {
            labelName += getSingleOrMultiLabelNameById(allMultiLabel, usedLabel[j]) + '>'
          }
        }
        labelName = labelName.substring(0, labelName.length - 1)
        return labelName
      },
      changeCallLabel (id, name, flag) {
        if (flag && this.hasMulti) { // 选中并且还有多级标签时
          this.checkSingleLabel = true // 打开确认窗口
          this.interimId = id // 把id和name临时存储起来
          this.interimName = name
          return
        }
        if (this.cancleFlag) { // 弹框点击了取消按钮，不再发送请求
          return
        }
        let data = {}
        let nameArr = []
        let opArr = []
        let operation = ''
        if (flag === true) {
          operation = 'add'
        } else {
          operation = 'delete'
        }
        opArr.push(id)
        nameArr.push(name)
        if (this.phoneBarFlag) {
          let labelId = ''
          let labelIdArray = []
          let operateId = id + '##'
          let operateArr = []
          operateArr.push(operateId)
          let CheckIds = this.getAllCheck()
          for (let i = 0; i < CheckIds.length; i++) {
            labelId += CheckIds[i] + '##'
            labelIdArray.push(CheckIds[i])
          }
          let phoneData = this.$store.state.cti.globalLet.phone_data
          let phoneBarData = {
            Channel: phoneData._curChannel,
            pbx: phoneData.pbx_in_ip,
            operation: operation,
            label_op: operateArr,
            url: this.getServerUrl,
            callSheetId: this.$store.state.cti.globalLet.currentCallSheetId,
            value: 'LABELS' + labelId,
            name: nameArr
          }
          this.$store.dispatch('markCallSheetThroughCall', phoneBarData).then((resp) => {
            let labelIdObj = {
              callId: phoneBarData.callSheetId,
              labelIdArray: labelIdArray
            }
            window.localStorage.setItem('labelIdObj', JSON.stringify(labelIdObj))
          })
        } else {
          data.operation = operation
          data.label_op = opArr
          data.name = nameArr
          data.label = this.getAllCheck()
          data.callSheetId = this.callSheetId
          let lastData = {data: data, type: this.getTabType}
          if (this.flag === 'QC') {
            delete lastData.type
            lastData.data.flag = 'QC'
            this.$store.commit('singleLabelChange/qualityCheck')
          }
          this.$store.dispatch('markCallSheet', lastData)
        }
      },
      warningCheckLabel () {
        let data = {}
        let nameArr = []
        let opArr = []
        let operation = 'recover'
        opArr.push(this.interimId)
        nameArr.push(this.interimName)
        data.operation = operation
        data.label_op = opArr
        data.name = nameArr
        data.label = this.getAllCheck()
        data.callSheetId = this.callSheetId
        this.checkLabels = [] // 清空之前选中的多级标签
        this.checkLabels.push(this.interimId)
        this.cancleArr = [] // 清空点击取消之后存进去的cancleArr
        this.hasMulti = false
        let lastData = {data: data, type: this.getTabType}
        if (this.flag === 'QC') {
          delete lastData.type
          lastData.data.flag = 'QC'
          this.$store.commit('singleLabelChange/qualityCheck')
        }
        this.$store.dispatch('markCallSheet', lastData).then((resp) => {
          if (resp) {
            this.checkSingleLabel = false // 关闭窗口
          }
        })
      },
      cancleWarning () { // 取消单标签覆盖多级标签
        this.checkSingleLabel = false
        this.cancleFlag = true
        let id = this.interimId
        this.cancleArr.push(id)
      },
      checkOperationLog () {
        let lastData = {data: {callSheetId: this.callSheetId}, type: this.getTabType}
        this.$store.dispatch('getCallLabelOPHistory', lastData).then((resp) => {
          if (resp.success) {
            let list = resp.history.reverse()
            this.operaHistory = list
            this.checkOpearaDialog = true
          } else {
            this.$message.error(this.$t('call.getOperateFail'))
          }
        })
      }
    },
    components: {
      OperationLog
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .clear-wrap
    padding-top 16px
    &:after
      display block
      content ''
      clear both
  .label-box
    position relative
    float left
    input
      sing-inp()
    input:checked+span
      sing-sped()
    input+span
      sing-sp()
    input:checked+span
      &:after
        sing-af()
      &:before
        sing-be()
  input[disabled]
    cursor not-allowed
  .label-clear
    float left
    &:after
      display block
      content ''
      clear both
  .ul-name
    li
      border 1px solid #ccc
      min-width 6em
      height 26px
      box-sizing border-box
      line-height 26px
      max-width 35em
      display block
      border-radius 3px
      text-align center
      position relative
      float left
      padding 0 10px
      margin 0px 20px 16px 0
  .clearfix:after
    display block
  .has-multi
    border-top 1px solid #efeef3
    padding-top 16px
  .zhezhao
    display none
    position absolute
    top 0
    left 0
    right 0
    bottom 0
    background #000
    opacity .5
    z-index 6
  .hide-zhezhao
    display none
  .show-zhezhao
    display block
  .label-title
    width 5em
    position absolute
    top 0
    let 0
  .box-wrap
    position relative
  .label-contain
    margin-left 6em
</style>
