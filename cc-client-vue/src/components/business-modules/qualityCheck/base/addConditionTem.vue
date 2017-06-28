<template>
  <div class="add-condition-tem">
    <el-dialog modal-append-to-body lock-scroll top="10%" v-model="addCondTemData.isShow" title="抽取条件模板" style="min-width:800px;" @close="addCondTemDataClose">
      <div class="line">
        <span>模板名称</span><el-input class="temp-name" size="small" v-model.trim="Form.tempName" placeholder="最多输入10个字符"></el-input>
      </div>
      <div class="line">
        <span>抽取规则</span>
        <el-radio-group v-model="selectRule" @change="changeChouQuRadio">
          <div class="chouqu-guize">
            <el-radio name="selectRule" label="1" size="small">条数</el-radio>
            <el-select style="width:100px;" size="small" v-model.trim="Form.sampleNum" :disabled="chouquState !== '1'">
              <el-option label="人均条数" value="per_num"></el-option>
              <el-option label="整体条数" value="entirety_num"></el-option>
            </el-select>
            <el-input size="small" style="width:60px;" v-model="Form.count" :disabled="chouquState !== '1'"></el-input>
          </div>
          <div class="chouqu-guize">
            <el-radio name="selectRule" label="2" size="small">百分比</el-radio>
            <el-select style="width:100px;" size="small" v-model.trim="Form.samplePercent" :disabled="chouquState === '1'">
              <el-option label="人均百分比" value="per_percent"></el-option>
              <el-option label="整体百分比" value="entirety_percent"></el-option>
            </el-select>
            <el-input
              :disabled="chouquState === '1'"
              size="small"
              style="width:100px;"
              v-model="Form.percent">
              <template slot="append">%</template>
            </el-input>
          </div>
        </el-radio-group>
      </div>
      <!--通话==========================-->
      <div class="call" v-if="addCondTemData.curQualilyType !== 'qualityWebchat'">
        <div class="line">
          <span>呼叫时间</span>
          <el-date-picker size="small"
                          v-model.trim="callForm.callTime"
                          type="datetimerange"
                          :picker-options="pickerOptions2"
                          :placeholder="$t('public.timeRanges')"
                          :editable="false"
                          align="right">
          </el-date-picker>
        </div>
        <div class="line">
          <span>呼叫类型</span>
          <el-select v-model="callForm.CONNECT_TYPE" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in callTypeList"
              :label="item.code_name"
              :value="item.code_value">
            </el-option>
          </el-select>
        </div>
        <div class="line">
          <span>技能组 </span>
          <el-select size="small" v-model="callForm.QUEUE" multiple placeholder="请选择">
            <el-option
              v-for="item in callQueueList"
              :label="item.DisplayName"
              :value="item.Exten">
            </el-option>
          </el-select>
        </div>
        <div class="line">
          <span>通话座席</span>
          <el-select v-model="callForm.QA_SPECIALIST" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in callAgentList"
              :label="item.displayName + '[' + item.exten + ']'"
              :value="item._id">
            </el-option>
          </el-select>
          <el-checkbox  v-model="callForm.includeSubordinate" label="包含已选座席下级" name="type"></el-checkbox>
        </div>
        <div class="line">
          <span>通话时长</span>
          <el-input
            style="width:100px;"
            size="small"
            placeholder=""
            v-model="callForm.CALL_TIME_LENGTH_BEGIN">
            <template slot="append">秒</template>
          </el-input>
          <span>至</span>
          <el-input
            style="width:100px;"
            size="small"
            placeholder=""
            v-model="callForm.CALL_TIME_LENGTH_END">
            <template slot="append">秒</template>
          </el-input>
        </div>
        <div class="line">
          <span>满意度 </span>
          <el-select size="small" v-model.trim="callForm.INVESTIGATE" filterable :placeholder="$t('webchat.webchatAll')">
            <el-option value="" :label="'--'+$t('webchat.webchatAll')+'--'"></el-option>
            <el-option
              v-for="item in satisfactionList"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="line">
          <span style="width: 100px;">录音内容分类</span>
        </div>
        <div>
          <label-select @labelSelect="labelSelect" :resetSelect="resetSelect"></label-select>
        </div>
      </div>
      <!--在线咨询========================================-->
      <div class="webChat" v-if="addCondTemData.curQualilyType === 'qualityWebchat'">
        <div class="line">
          <span>领取时间</span>
          <el-date-picker size="small"
                          v-model.trim="webForm.lingquTime"
                          type="datetimerange"
                          :picker-options="pickerOptions2"
                          :placeholder="$t('public.timeRanges')"
                          :editable="false"
                          align="right">
          </el-date-picker>
        </div>
        <div class="line">
          <span>座席</span>
          <el-select v-model="webForm.selectedAgentList" multiple placeholder="请选择" size="small">
            <el-option
              v-for="item in callAgentList"
              :label="item.displayName + '[' + item.exten + ']'"
              :value="item._id">
            </el-option>
          </el-select>
          <el-checkbox  v-model="webForm.includeSubordinate" label="包含已选座席下级" name="type"></el-checkbox>
        </div>
        <div class="line">
          <span>满意度</span>
          <el-select size="small" v-model.trim="webForm.appraiseKey" filterable :placeholder="$t('public.all')">
            <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
            <el-option
              v-for="item in appraiseList"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <div class="line">
          <span>消息条数</span>
          <el-radio-group v-model.trim="webForm.msgCountType">
            <el-radio size="small" label="gt" >{{$t('webchat.moreThan')}}</el-radio>
            <el-radio size="small" label="lt" >{{$t('webchat.lessThan')}}</el-radio>
            <el-radio size="small" label="eq" >{{$t('webchat.equal')}}</el-radio>
          </el-radio-group>
          <el-input style="width:100px;" size="small" v-model.trim="webForm.msgCount" :placeholder="$t('public.pleaseEnter')"></el-input>
        </div>
        <div class="line">
          <span style="width: 72px;">结束会话类型</span>
          <el-select size="small" v-model.trim="webForm.finishKey" filterable :placeholder="$t('public.all')">
            <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
            <el-option
              v-for="item in finishReasonList"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <!--保存  抽取======================-->
      <div slot="footer" class="dialog-footer btn-wrap">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="justSaveTheTemp">仅保存</el-button>
        <el-button type="primary" @click="searchAndSaveTheTemp">保存并抽取</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import LabelSelect from '../../../public-modules/phone-bar/LabelSelect.vue'
  import {deepClone, getDateTime} from '../../../../utils/m7Utils'
  export default {
    name: 'addConditionTem',
    data () {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: this.$t('sms.thisOneWeek'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.$t('sms.thisOneMonth'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.$t('sms.thisThreeMonth'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        chouquState: '1',
        selectRule: '1',
        addTempState: 'addAndSelect',        //   仅保存  保存并抽取  状态
        callTypeList: [],                   // 呼叫类型
        callQueueList: [],                  // 技能组
        callAgentList: [],                  // 质检专员
        satisfactionList: [],               // 满意度
        resetSelect: false,                 //  录音内容分类
        finishReasonList: [],               //   结束类型
        appraiseList: [],                  //    在线 满意度
        Form: {
          tempName: '',
          sampleNum: '',
          count: '',
          samplePercent: '',
          percent: ''
        },
        callForm: {
          callTime: '',
          CONNECT_TYPE: [],
          QUEUE: [],
          QA_SPECIALIST: [],
          includeSubordinate: false,
          INVESTIGATE: '',
          CALL_TIME_LENGTH_BEGIN: '',
          CALL_TIME_LENGTH_END: '',
          multiFirst: '',     //  录音内容分类
          multiTwo: '',
          multiThree: ''
        },
        webForm: {
          lingquTime: '',
          selectedAgentList: [],
          includeSubordinate: false,
          msgCountType: '',
          msgCount: '',
          finishKey: '',
          appraiseKey: ''
        }
      }
    },
    props: {
      addCondTemData: {
        type: Object,
        default: function () {
          return {
            isShow: false
          }
        }
      }
    },
    components: {
      LabelSelect
    },
    methods: {
//        抽取规则  条数 百分比 切换
      changeChouQuRadio (value) {
        this.chouquState = value
      },
//      录音内容分类
      labelSelect (data) { // 子组件外抛出来的表单
        this.resetSelect = false
        this.callForm.multiFirst = data.multiFirst
        this.callForm.multiTwo = data.multiTwo
        this.callForm.multiThree = data.multiThree
      },
//      仅保存
      justSaveTheTemp () {
        this.addTempState = 'add'
        this.SaveTheTemp()
      },
//      保存并抽取
      searchAndSaveTheTemp () {
        this.addTempState = 'addAndSelect'
        this.SaveTheTemp()
      },
//      保存并抽取
//      保存
      SaveTheTemp () {
        let data = {}
        data.TEMPLATE_NAME = this.Form.tempName
//          抽取规则
        if (this.selectRule === '1') {
          data.EXT_RULE = 'COUNT_TYPE_NUM'
        } else {
          data.EXT_RULE = 'COUNT_TYPE_PERCENT'
        }
        data.COUNT_TYPE_PERCENT = this.Form.samplePercent
        data.COUNT_TYPE_NUM = this.Form.sampleNum
        data.RANDOMNUM = this.Form.count
        data.PERCENT = this.Form.percent
        data.QUALITY_TYPE = this.addCondTemData.curQualilyType
//        ===================
        if (!data.TEMPLATE_NAME || data.TEMPLATE_NAME === '') {
          this.$message.error('请填写模板名称')
          return
        }
        if (!data.EXT_RULE || data.EXT_RULE === '') {
          data.EXT_RULE = 'COUNT_TYPE_NUM'
        }
        if (data.EXT_RULE === 'COUNT_TYPE_NUM') {
          if (!data.RANDOMNUM || data.RANDOMNUM === '') {
            this.$message.error('请填写随机抽取质检记录的条数，不超过1000条！')
            return
          }
          if (data.RANDOMNUM > 1000) {
            this.$message.error('请注意，随机数最大为1000！')
            return
          }
          if (data.RANDOMNUM === 0) {
            this.$message.error('请注意，随机数最小为1！')
            return
          }
        } else if (data.EXT_RULE === 'COUNT_TYPE_PERCENT') {
          if (!data.PERCENT || data.PERCENT === '') {
            this.$message.error('请填写随机抽取质检记录的百分比！')
            return
          }
          if (data.PERCENT > 100 || data.PERCENT === 0) {
            this.$message.error('请注意，百分比数必须为1-100之间的正整数！')
            return
          }
        }
//        ======================
        if (this.addCondTemData.curQualilyType !== 'qualityWebchat') {  //  通话
//          呼叫时间
          if (this.callForm.callTime.length && this.callForm.callTime[0] !== null) {
            data.BEGIN_TIME = getDateTime(this.callForm.callTime[0])
          }
          if (this.callForm.callTime.length && this.callForm.callTime[1] !== null) {
            data.END_TIME = getDateTime(this.callForm.callTime[1])
          }
//          呼叫类型
          if (this.callForm.CONNECT_TYPE.length) {
            data.CONNECT_TYPE_SELECTED = this.callForm.CONNECT_TYPE.join(',')
          } else {
            data.CONNECT_TYPE_SELECTED = ''
          }
//          技能组
          if (this.callForm.QUEUE.length) {
            data.ERROR_MEMO_SELECTED = this.callForm.QUEUE.join(',')
          } else {
            data.ERROR_MEMO_SELECTED = ''
          }
//          通话时长
          data.CALL_TIME_LENGTH_BEGIN = this.callForm.CALL_TIME_LENGTH_BEGIN
          data.CALL_TIME_LENGTH_END = this.callForm.CALL_TIME_LENGTH_END
//          满意度
          data.INVESTIGATE = this.callForm.INVESTIGATE
//          录音内容分类
          data.multiFirst = this.callForm.multiFirst
          data.multiTwo = this.callForm.multiTwo
          data.multiThree = this.callForm.multiThree
          if (this.callForm.QA_SPECIALIST.length) {
            data.selectedAgentList = this.callForm.QA_SPECIALIST.join(',')
          } else {
            data.selectedAgentList = ''
          }
          data.includeSubordinate = this.callForm.includeSubordinate
          this.$store.dispatch('addQualityCheckRandomTemplates', data).then(res => {
            if (res.success) {
              this.$emit('addConditionTem', this.addTempState)
            }
          })
        } else {   //   在线咨询
          data.flag = this.addTempState
//          所选座席
          if (this.webForm.selectedAgentList.length) {
            data.selectedAgentList = this.webForm.selectedAgentList.join(',')
          } else {
            data.selectedAgentList = ''
          }
          data.includeSubordinate = this.webForm.includeSubordinate
//          结束会话类型
          data.finishKey = this.webForm.finishKey
//          消息条数
          data.msgCount = this.webForm.msgCount
//          消息类型
          data.msgCountType = this.webForm.msgCountType
//          领取时间
          if (this.webForm.lingquTime.length && this.webForm.lingquTime[0] !== null) {
            data.beginTimeBegin = getDateTime(this.webForm.lingquTime[0])
          }
          if (this.webForm.lingquTime.length && this.webForm.lingquTime[1] !== null) {
            data.beginTimeEnd = getDateTime(this.webForm.lingquTime[1])
          }
          data.appraiseKey = this.webForm.appraiseKey
          this.$store.dispatch('addOrSelectRandomTemplate', data).then(res => {
            if (res.success) {
              this.$emit('addConditionTem', this.addTempState)
            }
          })
        }
      },
//      重置
      resetForm () {
        for (let i in this.Form) {
          this.Form[i] = ''
        }
        for (let i in this.callForm) {
          if (typeof this.callForm[i] === 'string') {
            this.callForm[i] = ''
          } else {
            this.callForm[i] = []
          }
        }
        for (let i in this.webForm) {
          if (typeof this.webForm[i] === 'string') {
            this.webForm[i] = ''
          } else {
            this.webForm[i] = []
          }
        }
      },
//      dialog  关闭
      addCondTemDataClose () {
        this.resetForm()
      }
    },
    beforeMount () {
      let p1 = this.$store.dispatch('getCache', {type: 'callType'})
      let p2 = this.$store.dispatch('getCache', {type: 'queues'})
      let p3 = this.$store.dispatch('getCache', {type: 'agents'})
      let p4 = this.$store.dispatch('getCache', {type: 'options'})
      let p5 = this.$store.dispatch('getCache', {type: 'channelDic'})
      Promise.all([p1, p2, p3, p4, p5]).then(() => {
        this.callTypeList = this.$store.state.session.dicMap.callType
        this.callQueueList = this.$store.state.session.dicMap.queues
        this.callAgentList = this.$store.state.session.dicMap.agents
//        通话 满意度 start =================
        let _dics = []
        let optionsRes = this.$store.state.session.dicMap.options
        for (let i = 0; i < optionsRes.length; i++) {
          let obj = optionsRes[i]
          if (obj.name === this.$t('qualityCheck.satisfactionSurveyOptions')) {
            _dics = obj.options || []
            break
          }
        }
        let satisfactionList = []
        for (var n = 0; n < _dics.length; n++) {
          satisfactionList.push({name: _dics[n].name, value: _dics[n].options[0].name})
        }
        this.satisfactionList = satisfactionList
//        通话 满意度 end =================
//        结束类型 ===============
        let finishDics = []
        let dics = this.$store.state.session.dicMap.channelDic
        for (var i = 0; i < dics.length; i++) {
          let obj = dics[i]
          if (obj.type === 'webchat') {
            finishDics = obj.options || []
            break
          }
        }
        let finishKeys = []
        for (let i = 0; i < finishDics.length; i++) {
          finishKeys.push(finishDics[i])
          let level2 = deepClone(finishDics[i].options)
          if (level2) {
            for (let m = 0; m < level2.length; m++) {
              level2[m].name = finishDics[i].name + '->' + level2[m].name
              finishKeys.push(level2[m])
              let level3 = deepClone(level2[m].options)
              if (level3) {
                for (let n = 0; n < level3.length; n++) {
                  level3[n].name = level2[m].name + '->' + level3[n].name
                  finishKeys.push(level3[n])
                }
              }
            }
          }
        }
        finishKeys.push({name: this.$t('webchat.addBlack'), value: 'add_black'})
        this.finishReasonList = finishKeys
//        在线  满意度
        for (let i = 0; i < dics.length; i++) {
          let obj = dics[i]
          if (obj.type === 'webchatCSR') {
            this.appraiseList = obj.options || []
            break
          }
        }
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .add-condition-tem
    .el-dialog--small
      min-width 800px
    .line
      margin-bottom 16px
      span
        display inline-block
        width 50px
    .el-input
    .el-select
      margin-left 20px
    .temp-name
      width 140px
    .chouqu-guize
      display inline-block
      margin-left 20px
</style>
