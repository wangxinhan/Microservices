<template>
  <div class="add-condition-tem">
    <el-dialog modal-append-to-body lock-scroll top="10%" v-model="addTaskData.isShow" title="抽取任务模板" style="min-width:800px;">
      <el-form :inline="true" label-position="right" ref="form" :model="form" :rules="rules">
        <el-form-item label="任务名称" prop="TASK_NAME">
          <el-input v-model.trim="form.TASK_NAME" size="small" maxlength="10" placeholder="最多输入10个字符"></el-input>
        </el-form-item>
        <el-form-item label="质检模板" prop="TASK_TEMPLATE">
          <el-radio-group class="radio-group" v-model.trim="form.TASK_TEMPLATE" @change="taskTemChange" v-if="addTaskData.qualityCheckTemplates.length!==0">
            <el-radio size="small"
                      v-if="item.QUALITY_TYPE !== 'qualityWebchat'"
                      v-for="(item, index) in addTaskData.qualityCheckTemplates"
                      :label="item._id">
              {{item.QUALITY_TYPE === 'qualityWebchat' ? item.name + '[在线咨询]' : item.name + '[通话]'}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抽取规则">
          <el-radio-group v-model.tirm="selectRule" @change="changeChouQuRadio">
            <div class="chouqu-guize">
              <el-radio class="radio" name="selectRule" label="1" size="small">条数</el-radio>
              <el-select style="width:100px;" size="small" v-model.trim="cacheForm.sampleNum" :disabled="chouquState !== '1'">
                <el-option label="人均条数" value="per_num"></el-option>
                <el-option label="整体条数" value="entirety_num"></el-option>
              </el-select>
              <el-form-item class="count"  prop="count">
                <el-input size="small" style="width:60px;" v-model.trim="form.count" :disabled="chouquState !== '1'"></el-input>
              </el-form-item>
            </div>
            <div class="chouqu-guize">
              <el-radio class="radio"  name="selectRule" label="2" size="small">百分比</el-radio>
              <el-select style="width:100px;" size="small" v-model="cacheForm.samplePercent" :disabled="chouquState === '1'">
                <el-option label="人均百分比" value="per_percent"></el-option>
                <el-option label="整体百分比" value="entirety_percent"></el-option>
              </el-select>
              <el-form-item class="percent" prop="percent">
                <el-input :disabled="chouquState === '1'" size="small" style="width:100px;" v-model.trim="form.percent">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="呼叫时间" prop="callTime">
          <el-date-picker size="small"
                          v-model.trim="cacheForm.callTime"
                          type="datetimerange"
                          :picker-options="pickerOptions2"
                          :placeholder="$t('public.timeRanges')"
                          :editable="false"
                          align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="呼叫类型" prop="CONNECT_TYPE">
          <el-select v-model="cacheForm.CONNECT_TYPE" multiple placeholder="按呼叫类型名搜索" size="small">
            <el-option
              v-for="item in callTypeList"
              :label="item.code_name"
              :value="item.code_value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="技能组">
          <el-select size="small" v-model.trim="cacheForm.QUEUE" multiple filterable :placeholder="$t('qualityCheck.skillGroupSearch')">
            <el-option
              v-for="item in callQueueList"
              :label="item.DisplayName"
              :value="item.Exten">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="质检专员" prop="QA_SPECIALIST">
          <el-select size="small" v-model.trim="form.QA_SPECIALIST" filterable :placeholder="$t('public.pickAgentTip')">
            <el-option
              v-for="item in callAgentList"
              :label="item.displayName + '[' + item.exten + ']'"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="满意度" prop="INVESTIGATE">
          <el-select size="small" v-model.trim="form.INVESTIGATE" filterable :placeholder="$t('webchat.webchatAll')">
            <el-option value="" :label="'--'+$t('webchat.webchatAll')+'--'"></el-option>
            <el-option
              v-for="item in satisfactionList"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通话时长">
          <el-col :span="11">
            <el-form-item prop="CALL_TIME_LENGTH_BEGIN">
              <el-input
                style="width:100px;"
                size="small"
                placeholder=""
                v-model="form.CALL_TIME_LENGTH_BEGIN">
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">至</el-col>
          <el-col :span="11">
            <el-form-item prop="CALL_TIME_LENGTH_END">
              <el-input
                style="width:100px;"
                size="small"
                placeholder=""
                v-model="form.CALL_TIME_LENGTH_END">
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="录音内容分类">
          <label-select @labelSelect="labelSelect" :resetSelect="resetSelect"></label-select>
        </el-form-item>
        <el-form-item :label="$t('qualityCheck.callAgent')+':'">
          <el-select size="small" v-model.trim="cacheForm.selectedAgentList" multiple filterable :placeholder="'--'+$t('webchat.webchatAll')+'--'">
            <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
            <el-option
              v-for="item in callAgentList"
              :label="item.displayName + '[' + item.exten + ']'"
              :value="item._id">
            </el-option>
          </el-select>
          <el-checkbox  v-model="form.includeSubordinate" label="包含已选座席下级" name="type"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit">创建任务并抽取</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import LabelSelect from '../../../public-modules/phone-bar/LabelSelect.vue'
  import {deepClone, getDateTime} from '../../../../utils/m7Utils'
  import {checkform} from '../../../../utils/validate.js'
  export default {
    name: 'addTaskTem',
    data () {
      let validate1 = (rule, value, callback) => {
        if (value !== '') {
          let match = checkform(value, 'Number3')
          if (match) {
            callback(new Error(this.$t('qualityCheck.pleaseEnterNum')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
//      let validateCallLength = (rule, value, callback) => {
//        let item = self.callForm
//        if (item.CALL_TIME_LENGTH_BEGIN !== '' && item.CALL_TIME_LENGTH_END !== '') {
//          if (parseInt(item.CALL_TIME_LENGTH_END) < item.CALL_TIME_LENGTH_BEGIN) {
//            callback(new Error(this.$t('qualityCheck.PleaseEnterTheCorrectCallDurationRrange')))
//          } else {
//            callback()
//          }
//        } else {
//          callback()
//        }
//      }
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
        taskTemVal: 0,
        form: {
          TASK_NAME: '',
          TASK_TEMPLATE: '',                 // 质检模板
          BEGIN_TIME: '',
          END_TIME: '',
          QA_SPECIALIST: '',                 // 质检员
//          selectedAgents: '',
          selectedAgentList: '',             // 通话座席
          includeSubordinate: false,         // 是否包含下级
          CALL_TIME_LENGTH_BEGIN: '',        // 通话时长
          CALL_TIME_LENGTH_END: '',
          multiFirst: '',
          multiTwo: '',
          multiThree: '',
          singleLabel: '',                   // 录音标签
          INVESTIGATE: '',                   // 满意度
          sample_selection_rule: '',         // 抽取规则
          count: 10,
          percent: 10,
          QUEUE: '',                         // 技能组
          CONNECT_TYPE: '',                   // 呼叫类型
          page: 1
        },
        cacheForm: {
          sampleNum: 'per_num',
          samplePercent: 'per_percent',
          callTime: [],
          QUEUE: [],
          CONNECT_TYPE: [],
          selectedAgentList: []
        },
        callTypeList: [],                   // 呼叫类型
        callAgentList: [],                  // 质检专员
        callQueueList: [],                  // 技能组
        satisfactionList: [],               // 满意度
        resetSelect: false,
        rules: {
          count: [
            {validator: validate1, trigger: 'blur'}
          ],
          percent: [
            {validator: validate1, trigger: 'blur'}
          ],
          CALL_TIME_LENGTH_BEGIN: [
            {validator: validate1, trigger: 'blur'}
          ],
          CALL_TIME_LENGTH_END: [
            {validator: validate1, trigger: 'blur'}
          ]
        }
      }
    },
    props: {
      addTaskData: {
        type: Object,
        default: function () {
          return {
            isShow: false
          }
        }
      }
    },
    computed: {
    },
    watch: {
      cacheForm: {
        deep: true,
        handler (newV) {
          let cloneForm = deepClone(newV)
          this.handleForm(cloneForm)
        }
      },
      'addTaskData.isShow': 'resetForm'
    },
    methods: {
      changeChouQuRadio (value) {
        this.chouquState = value
        console.log(this.chouquState)
      },
      taskTemChange (_id) {
        console.log(_id)
      },
      handleForm (data) {
        console.log(data)
        if (data.callTime.length && data.callTime[0] !== null) {
          this.form.BEGIN_TIME = getDateTime(data.callTime[0])
        }
        if (data.callTime.length && data.callTime[1] !== null) {
          this.form.END_TIME = getDateTime(data.callTime[1])
        }
        if (this.chouquState === '1') {
          this.form.sample_selection_rule = data.sampleNum
        } else {
          this.form.sample_selection_rule = data.samplePercent
        }
        if (data.QUEUE.length) {
          this.form.QUEUE = data.QUEUE.join(',')
        } else {
          this.form.QUEUE = ''
        }
        if (data.CONNECT_TYPE.length) {
          this.form.CONNECT_TYPE = data.CONNECT_TYPE.join(',')
        } else {
          this.form.CONNECT_TYPE = ''
        }
        if (data.selectedAgentList.length) {
          this.form.selectedAgentList = data.selectedAgentList.join(',')
        } else {
          this.form.selectedAgentList = ''
        }
        console.log(this.form)
      },
      renderCallCache () {
        let self = this
        this.$store.dispatch('getCache', {type: 'callType'}).then((res) => {  // 呼叫类型
          self.callTypeList = res
        })
        this.$store.dispatch('getCache', {type: 'agents'}).then((res) => { // 质检员
          res.forEach((item) => {
            item.labelCall = item.displayName + '【' + item.exten + '】'
          })
          self.callAgentList = res
        })
        this.$store.dispatch('getCache', {type: 'queues'}).then((res) => { // 技能组
          self.callQueueList = res
        })
        this.$store.dispatch('getCache', {type: 'options'}).then((res) => { // 满意度
          let _dics = []
          for (let i = 0; i < res.length; i++) {
            let obj = res[i]
            if (obj.name === this.$t('qualityCheck.satisfactionSurveyOptions')) {
              _dics = obj.options || []
              break
            }
          }
          let satisfactionList = []
          for (var n = 0; n < _dics.length; n++) {
            satisfactionList.push({name: _dics[n].name, value: _dics[n].options[0].name})
          }
          self.satisfactionList = satisfactionList
        })
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.submitForm()
          } else {
            this.$message.error('请填写正确的信息!')
            return false
          }
        })
      },
      submitForm () {
        let data = deepClone(this.form)
        if (!data.TASK_NAME || data.TASK_NAME === '') {
          this.$message.error('请填写质检任务名称!')
          return
        }
        if (!data.TASK_TEMPLATE || data.TASK_NAME === '') {
          this.$message.error('请选择质检模板!')
          return
        }
        if (data.CALL_TIME_LENGTH_BEGIN && data.CALL_TIME_LENGTH_END) {
          let arraySta = parseInt(data.CALL_TIME_LENGTH_BEGIN)
          let arrayEnd = parseInt(data.CALL_TIME_LENGTH_END)
          if (arrayEnd <= arraySta) {
            this.$message.error('请输入正确的通话时长范围!')
            return
          }
        } else if (data.CALL_TIME_LENGTH_BEGIN && data.CALL_TIME_LENGTH_END === '') {
          this.$message.error('请输入正确的通话时长范围!')
          return
        }
        if (this.chouquState === '1') {
          if (!data.count || data.count === '') {
            this.$message.error('请填写按条数抽取质检记录的数量，不超过1000条！')
            return
          }
          if (data.count === 0) {
            this.$message.error('按条数抽取质检记录的数量不得小于1')
            return
          }
          if (data.count > 1000) {
            this.$message.error('按条数抽取质检记录的数量不得大于1000')
            return
          }
          delete data.percent
        } else {
          if (!data.percent || data.percent === '') {
            this.$message.error('请填写随机抽取质检记录的百分比！')
            return
          }
          if (data.percent === 0) {
            this.$message.error('请注意，百分比数必须为1-100之间的正整数！')
            return
          }
          if (data.percent > 100) {
            this.$message.error('请注意，百分比数必须为1-100之间的正整数！')
            return
          }
          data.percent = data.percent + '%'
          delete data.count
        }
        if (!data.QA_SPECIALIST || data.QA_SPECIALIST === '' || data.QA_SPECIALIST === 'serachInputNoresult') {
          this.$message.error('请填写质检专员名称')
          return
        }
        this.$store.dispatch('addQualityTaskTemplate', data).then((res) => {
          if (!res.success) {
            if (res.message) {
              if (res.message === 'QualityNumRepeat') {
                this.$message.error('质检任务名称重复，请重新输入！')
              } else {
                this.$message.error(res.message)
              }
              return
            }
          } else {
            if (res.count === 0) {
              this.$message.error('没有符合条件的通话记录!')
              this.addTaskData.isShow = false
            }
            let selectId = ''
            if (res.selectedId) {
              selectId = res.selectedId
            }
            this.$emit('addTaskTem', selectId)
            this.addTaskData.isShow = false
          }
        })
      },
      queryRecordCallListenLog (_id, page) {
        this.currentId = _id
        this.title = this.$t('qualityCheck.callQualityLookLog')
        this.listenpp = this.$t('qualityCheck.checkPeople')
        this.listenTime = this.$t('qualityCheck.checkTime1')
        this.$store.dispatch('queryRecordCallListenLog', {'CALL_SHEET_ID': _id, 'page': page, 'pageSize': 10}).then(() => {
          this.recordList = this.$store.state.qualityCheck.recordList.list
          this.countRecord = this.$store.state.qualityCheck.recordList.count
          this.totalPageRecord = Math.ceil(this.$store.state.qualityCheck.recordList.count / 10) || 0
          this.isShow = true
        })
      },
      labelSelect (data) { // 子组件外抛出来的表单
        this.resetSelect = false
        this.form.multiFirst = data.multiFirst
        this.form.multiTwo = data.multiTwo
        this.form.multiThree = data.multiThree
      },
      resetForm () {
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
          this.resetSelect = true
          this.selectRule = '1'
          this.chouquState = '1'
          this.form.multiFirst = ''
          this.form.multiTwo = ''
          this.form.multiThree = ''
          this.form.count = 10
          this.form.percent = 10
          this.cacheForm.sampleNum = 'per_num'
          this.cacheForm.samplePercent = 'per_percent'
          this.cacheForm.callTime = []
          this.cacheForm.QUEUE = []
          this.cacheForm.CONNECT_TYPE = []
          this.cacheForm.selectedAgentList = []
        }
      }
    },
    components: {
      LabelSelect
    },
    beforeMount () {
      this.renderCallCache()
    }
  }
</script>
<style lang="stylus" scoped>
  .add-condition-tem
    .el-dialog--small
      min-width 800px
    .line
      margin-bottom 16px
    .temp-name
      width 140px
    .chouqu-guize
      display inline-block
    .count
      margin -4px 0 0 10px
    .percent
      margin -4px 0 0 10px
    .radio
      margin 0 10px
    .radio-group
      margin-left 90px
      margin-top -20px
      .el-radio
        margin 0 10px 0 0
</style>
