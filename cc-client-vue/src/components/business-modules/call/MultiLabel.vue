<template>
  <div class="font12 clearfix multi-label clear-wrap">
    <div class="zhezhao" :class="checkMultiLabel?'show-zhezhao':'hide-zhezhao'" v-if="flag === 'QC'"></div>
    <div class="box-wrap">
      <span class="label-title">{{$t('public.callLabel')}}：</span>
      <div class="label-right" v-if="callLabel.firstStepLabel.length <=0">{{$t('call.noCallLabel')}}</div>
      <div class="label-right" v-else>
        <ul class="clearfix">
          <!--是单击标签并且不是停用的标签-->
          <li v-for="item in checkLabels"  class="label-clear" v-if="item.indexOf('@') <= -1 && getSingleName(item)">
            <label class="label-box">
              <input type="checkbox" checked disabled="disabled" :value="item"><span class="label-text">{{getSingleName(item)}}</span>
            </label>
          </li>
        </ul>
        <ul class="ul-name clearfix">
          <!--是多级标签并且不是停用的标签-->
          <li v-for ='item in checkLabels' v-if="item.indexOf('@') > -1 && trunLableNameById(item)">{{trunLableNameById(item)}}<p v-if= "getTabType !== 'cdr_all'" @click="removeMultiLabel(item)">X</p></li>
        </ul>
        <div class="clearfix has-single">
          <el-select size="small" v-if= "phoneBarFlag || getTabType !== 'cdr_all'" class= 'label-select fl' v-model="multifirst" :placeholder="$t('public.pleasePick')"  @change = 'changeCallLabelSelect'>
            <el-option checked value="1">{{$t('public.pleasePick')}}</el-option>
            <el-option
                    v-if = 'callLabel'
                    v-for="item in callLabel.firstStepLabel"
                    :label="item.name"
                    :value="item"
                    :key="item"
                    >
            </el-option>
          </el-select>
          <el-select size="small" v-if= "phoneBarFlag || getTabType !== 'cdr_all'" class="label-select fl" v-model="multiSecond" :placeholder="$t('public.pleasePick')" @change="changeCallLabelSelect">
            <el-option checked value="2">{{$t('public.pleasePick')}}</el-option>
            <el-option
                    v-if = 'callLabel'
                    v-for="item in getNewSecondLabel"
                    :label="item.name"
                    :value="item"
                    :key="item"
                    >
            </el-option>
          </el-select>
          <el-select size="small" v-if= "phoneBarFlag || getTabType !== 'cdr_all'" class="label-select fl" v-model="multiThird" :placeholder="$t('public.pleasePick')" @change="changeCallLabelSelect">
            <el-option checked value="3">{{$t('public.pleasePick')}}</el-option>
            <el-option
                    v-if = 'callLabel'
                    v-for="item in getNewThirdLabel"
                    :label="item.name"
                    :value="item"
                    :key="item"
                    >
            </el-option>
          </el-select>
          <div class="btn-group fl">
            <el-button type="primary" class="fl" size="small" v-if="phoneBarFlag || getTabType !== 'cdr_all'" @click.stop="addMultiCallLabel(false)">添加</el-button>
            <el-button type="primary" v-if="!phoneBarFlag && getTabType === 'cdr_my' || getTabType === 'cdr_all'&&!phoneBarFlag" :class="getTabType === 'cdr_all'?'opera-left': ''" class="fr" size="small" @click.stop="checkOperationLog">{{$t('call.checkOperate')}}</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('public.changeLog')" v-model="checkOpearaDialog" class='call-label-dialog'>
      <div v-if="operaHistory&&operaHistory.length<=0" class="no-opera">{{$t('call.noOperate')}}</div>
      <operation-log v-else :labelOperaHistory = 'operaHistory'></operation-log>
    </el-dialog>
    <el-dialog :title="$t('public.tip')" v-model="checkMultiLabel" size="tiny" :show-close="false" :close-on-click-modal="false" :modal="flag==='QC'?false:true">
      <span>{{$t('call.replaceSingleLabel')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkMultiLabel=false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="addMultiCallLabel(true)">{{$t('public.confirm')}}</el-button>
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
        multifirst: '',
        multiSecond: '',
        multiThird: '',
        secondStepLabel: [],
        thirdStepLabel: [],
        firstId: '',
        secondId: '',
        thirdId: '',
        firstName: '',
        secondName: '',
        thirdName: '',
        opearLabel: [],
        operaHistory: [],
        checkOpearaDialog: false,
        hasSingle: false,
        checkMultiLabel: false
      }
    },
    props: {
      callLabel: Object,
      checkLabels: Array || [],
      callSheetId: String,
      disabled: Boolean,
      flag: String,
      phoneBarFlag: Boolean,
      qcResectLabel: Boolean
    },
    watch: {
      qcResectLabel: 'qcResectLabeles'
    },
    computed: {
      getNewSecondLabel () {
        return this.secondStepLabel
      },
      getNewThirdLabel () {
        return this.thirdStepLabel
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
      restSelect () {
        this.multifirst = '' // 重置下拉框
        this.multiSecond = ''
        this.multiThird = ''
        this.secondStepLabel = [] // 下级清空初始化
        this.thirdStepLabel = []
        this.firstId = '' // id清空 以防再次点击之后重复添加
        this.secondId = ''
        this.thirdId = ''
      },
      qcResectLabeles () {
        if (this.qcResectLabel) { // 点击质检评分界面的时候，重新reset
          this.restSelect()
        }
      },
      getRecoverName (arr) { // 获取被覆盖标签名字
        let nameStr = ''
        for (let m = 0; m < arr.length; m++) {
          nameStr += arr[m] + '、'
        }
        return nameStr.substring(0, nameStr.length - 1)
      },
      getSingleName (id) { // 获取单标签名字
        let single = this.$store.state.call.transCache.singleLabel
        let allSingle = ''
        if (single) {
          this.hasSingle = true // 有之前打过的单击标签
          allSingle = single.singleLabel
        }
        return getSingleOrMultiLabelNameById(allSingle, id)
      },
      changeCallLabelSelect (item) {
        if (item.level === 1) {
          let secondStepLabel = this.callLabel.secondStepLabel
          this.secondStepLabel = [] // change的时候之前的数组清空
          this.thirdStepLabel = []
          this.multiSecond = ''
          this.multiThird = ''
          for (let i = 0; i < secondStepLabel.length; i++) {
            if (secondStepLabel[i].keyStr.indexOf(item.keyStr + '-') > -1) { // 根据选择的标签来匹配自己的孩子
              this.secondStepLabel.push(secondStepLabel[i])
            }
          }
          this.firstId = item._id
          this.firstName = item.name
        } else if (item.level === 2) {
          let thirdStepLabel = this.callLabel.thirdStepLabel
          this.thirdStepLabel = []
          this.multiThird = ''
          for (let i = 0; i < thirdStepLabel.length; i++) {
            if (thirdStepLabel[i].keyStr.indexOf(item.keyStr + '-') > -1) {
              this.thirdStepLabel.push(thirdStepLabel[i])
            }
          }
          this.secondId = item._id
          this.secondName = item.name
        } else if (item.level === 3) {
          this.thirdId = item._id
          this.thirdName = item.name
        }
        if (item === '1') { // 1级标签  请选择
          this.multifirst = '' // select 清空
          this.multiSecond = ''
          this.multiThird = ''
          this.firstId = '' // id清空
          this.secondId = ''
          this.thirdId = ''
          this.secondStepLabel = [] // 下级的下拉框清空
          this.thirdStepLabel = []
        } else if (item === '2') { // 2级标签 请选择
          this.multiSecond = ''
          this.multiThird = ''
          this.secondId = ''
          this.thirdId = ''
          this.thirdStepLabel = []
        } else if (item === '3') {
          this.multiThird = ''
          this.thirdId = ''
        }
      },
      trunLableNameById (item) { // 通话标签id来匹配标签名字
        if (!item) {
          return ''
        }
        let usedLabel = []
        if (item.indexOf('@') !== -1) { // 判断是不是多级
          usedLabel = item.split('@') // @1@2@3拆分为数组
          usedLabel.pop()
        }
        let labelName = ''
        for (var j = 0; j < usedLabel.length; j++) {
          if (getSingleOrMultiLabelNameById(this.callLabel.allLabels, usedLabel[j])) {
            labelName += getSingleOrMultiLabelNameById(this.callLabel.allLabels, usedLabel[j]) + '>'
          }
        }
        labelName = labelName.substring(0, labelName.length - 1)
        return labelName
      },
      addMultiCallLabel (flag) { // 添加多级标签 flag为true 表示是提示框中的确定按钮触发的事件
        let sameFlag = false
        let labelIdList = ''
        let lastLabelName = []
        let opArr = []
        if (!this.firstId) {
          let firstLen = this.callLabel.firstStepLabel.length
          if (firstLen > 0) {
            this.$message.error(this.$t('call.pleaceChoiseFirstLabel'))
            return
          }
          if (firstLen <= 0) {
            this.$message.error(this.$t('call.pleaceSetOrUseLabel'))
            return
          }
        } else {
          labelIdList = this.firstId + '@'
          lastLabelName = [this.firstName]
        }
        if (!this.secondId) {
          let TwoLen = this.getNewSecondLabel.length
          if (TwoLen > 0) {
            this.$message.error(this.$t('call.pleaceChoiseSecondLabel'))
            return
          }
        } else {
          labelIdList = this.firstId + '@' + this.secondId + '@'
          lastLabelName = [this.firstName + '>' + this.secondName]
        }
        if (!this.thirdId) {
          let ThreeLen = this.getNewThirdLabel.length
          if (ThreeLen > 0) {
            this.$message.error(this.$t('call.pleaceChoiseThirdLabel'))
            return
          }
        } else {
          labelIdList = this.firstId + '@' + this.secondId + '@' + this.thirdId + '@'
          lastLabelName = [this.firstName + '>' + this.secondName + '>' + this.thirdName]
        }
        if (this.checkLabels) {
          this.checkLabels.forEach(item => {
            if (this.phoneBarFlag) { // 软电话
              if (item.replace('##', '') === labelIdList) { // 标签重复时
                sameFlag = true
              }
              this.checkLabels[item] = this.checkLabels[item] + '##'
            } else {
              if (item === labelIdList) {
                sameFlag = true
              }
            }
          })
        }
        if (sameFlag) {
          this.$message.error(this.$t('call.labelSameWarn'))
          return
        }
        if (this.hasSingle && !flag) { // 之前有打过单标签并且不是软电话状态
          this.checkMultiLabel = true
          return
        }
        if (flag) {
          this.checkMultiLabel = false
          this.hasSingle = false
          this.checkLabels = [] // 要把之前选中的单标签清空
        }
        if (this.phoneBarFlag) {
          this.checkLabels.push(labelIdList + '##')
        } else {
          this.checkLabels.push(labelIdList)
        }
        opArr.push(labelIdList)
        if (this.phoneBarFlag) { // 软电话
          let phoneData = this.$store.state.cti.globalLet.phone_data
          let phoneBarData = {
            Channel: phoneData._curChannel,
            pbx: phoneData.pbx_in_ip,
            operation: 'add',
            label_op: opArr,
            url: this.getServerUrl,
            callSheetId: this.$store.state.cti.globalLet.currentCallSheetId,
            value: 'LABELS' + this.checkLabels,
            name: lastLabelName
          }
          this.$store.dispatch('markCallSheetThroughCall', phoneBarData).then((resp) => {
            this.restSelect()
            let labelIdObj = {
              callId: phoneBarData.callSheetId,
              labelIdArray: this.checkLabels
            }
            window.localStorage.setItem('labelIdObj', JSON.stringify(labelIdObj))
          })
        } else {
          let state = {}
          state.label = this.checkLabels
          state.callSheetId = this.callSheetId
          state.operation = 'add'
          if (flag) {
            state.operation = 'recover'
          }
          state.label_op = opArr
          state.name = lastLabelName
          let lastData = {data: state, type: this.getTabType}
          if (this.flag === 'QC') {
            delete lastData.type
            lastData.data.flag = 'QC'
            this.$store.commit('singleLabelChange/qualityCheck')
          }
          this.$store.dispatch('markCallSheet', lastData).then((resp) => {
            if (resp) {
              this.restSelect()
            } else {
              this.checkLabels = []
              this.$message.error(this.$t('call.addLabelFail'))
            }
          })
        }
      },
      removeMultiLabel (id) { // 删除多级标签
        let arr = this.checkLabels
        let opArr = []
        let nameArr = []
        opArr.push(id)
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] === id) {
            arr.splice(j, 1)
          }
        }
        this.checkLabels = arr
        let name = this.trunLableNameById(id)
        nameArr.push(name)
        if (this.phoneBarFlag) {
          let phoneData = this.$store.state.cti.globalLet.phone_data
          let phoneBarData = {
            Channel: phoneData._curChannel,
            pbx: phoneData.pbx_in_ip,
            operation: 'delete',
            label_op: opArr,
            url: this.getServerUrl,
            callSheetId: this.$store.state.cti.globalLet.currentCallSheetId,
            value: 'LABELS' + this.checkLabels,
            name: nameArr
          }
          this.$store.dispatch('markCallSheetThroughCall', phoneBarData).then((resp) => {
            if (resp.success) {
              this.$message({
                message: this.$t('sms.successDel'),
                type: 'success'
              })
              let labelIdObj = {
                callId: phoneBarData.callSheetId,
                labelIdArray: this.checkLabels
              }
              window.localStorage.setItem('labelIdObj', JSON.stringify(labelIdObj))
            } else {
              this.$message.error(this.$t('sms.failDel'))
            }
          })
        } else {
          let state = {}
          state.label = this.checkLabels
          state.callSheetId = this.callSheetId
          state.operation = 'delete'
          state.label_op = opArr
          state.name = nameArr
          let lastData = {data: state, type: this.getTabType}
          if (this.flag === 'QC') {
            delete lastData.type
            lastData.data.flag = 'QC'
            this.$store.commit('singleLabelChange/qualityCheck')
          }
          this.$store.dispatch('markCallSheet', lastData).then((resp) => {
            if (resp) {
              this.$message({
                message: this.$t('sms.successDel'),
                type: 'success'
              })
            } else {
              this.$message.error(this.$t('sms.failDel'))
            }
          })
        }
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
  .multi-label
    .box-wrap
      position relative
      .label-title
        width 5em
        position absolute
        top 0
        left 0
      .label-right
        margin-left 6em
    .el-dialog__header
      border-bottom 1px solid #d3d3d3
      padding 16px
    .label-select
      width 23%
      padding-right 2%
      font-size 12px
    .btn-group
      width 25%
      .fl
        background #1abb9c
        border 1px solid #1abb9c
      .fr
        background #7bcdd2
        border 1px solid #7bcdd2
      .opera-left
        float left
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
        p
          display none
      li:hover
        p
          display block
          color #fff
          position absolute
          width 16px
          height 16px
          line-height 16px
          text-align center
          background #FF476E
          border-radius 50%
          top -10px
          right -8px
          cursor pointer
    .clearfix:after
      display block
    .no-opera
      height 320px
  .clear-wrap
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
  .has-single
    border-top 1px solid #efeef3
    padding-top 16px
  .zhezhao
    display none
    position absolute
    top 0px
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
</style>
