<template>
  <div class="questionContent">
    <div class="questionwarp">
      <affix :label="$t('questionnaire.content')" class="question-detail">
        <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="ruleForm">
          <el-form-item  v-for="(item, index) in showQues" :label="item.title">
            <el-radio-group v-if="item.inputType == 'radio'" v-model.trim="item.vModel" @change="changeQuesAnswer(item._id, item.vModel, index)" :disabled="questionnaireDetail.disabled">
              <el-radio size="small" v-for="anw in item.answers" :label="anw._id">{{anw.answer}}</el-radio>
            </el-radio-group>
            <el-checkbox-group v-if="item.inputType == 'checkbox'" v-model.trim="item.vModel">
              <el-checkbox v-for="anw in item.answers" :label="anw._id" :disabled="questionnaireDetail.disabled">{{anw.answer}}</el-checkbox>
            </el-checkbox-group>
            <el-form-item>
              <el-row class="question-row">
                <label>
                  <i class="iconfont icon-beizhu" :class="{isdisable:questionnaireDetail.disabled}" @click="toggleInput(index)"></i>
                </label>
                <el-col :span="23">
                  <div class="inputContent" v-show="!item.show || questionnaireDetail.disabled">{{item.otherVModel}}</div>
                  <el-input size="small" v-show="item.show && !questionnaireDetail.disabled" type="textarea" v-model.trim="item.otherVModel" :disabled="questionnaireDetail.disabled"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form-item>
        </el-form>
      </affix>
      <affix :label="$t('questionnaire.results')" class="question-detail">
        <span v-if="qstatus.length === 0" style="color: #FF4949;">问卷模板显示异常</span>
        <el-form v-else :label-position="labelPosition" label-width="80px" :model="form" ref="ruleForm">
          <el-form-item>
            <el-radio-group v-model.trim="form.results" :disabled="questionnaireDetail.disabled">
              <el-radio size="small" v-for="state in qstatus" :label="state.value" class="is-checked">{{state.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
          <div class="btn-warp" v-if="questionnaireDetail.canSubmit && qstatus.length">
            <div class="btn-container">
              <el-popover
                ref="popover"
                placement="bottom"
                width="350"
                v-model.trim="visibleTimeInput">
                <el-date-picker size="small"
                                v-model.trim="form.region"
                                :editable="boolean"
                                type="datetime"
                                :picker-options="pickerOptions"
                                :format="'yyyy-MM-dd HH:mm'"
                                :placeholder="$t('public.pickTime')"
                                :disabledDate="disabledDate"
                                align="left"
                                style="width:350px">
                </el-date-picker>
                <div class="btn-box" style="text-align: right; margin: 0">
                  <el-button class="laterBtn laterBtnCancel" size="mini" type="text" @click.stop="visibleTimeInput = false">{{$t('public.cancel')}}</el-button>
                  <el-button class="laterBtn laterBtnDone" type="primary" size="mini" @click.stop="laterComplete">{{$t('public.confirm')}}</el-button>
                </div>
              </el-popover>
              <el-button type="success" class="resetForm" @click.stop="resetForm">{{$t('public.reset')}}</el-button>
              <el-button type="success" v-popover:popover>{{$t('questionnaire.lateComplete')}}</el-button>
              <el-button type="success" @click.stop="onSubmit">{{$t('questionnaire.submitQues')}}</el-button>
            </div>
          </div>
      </affix>
      <affix :label="$t('questionnaire.markHistory')" class="question-detail">
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" ref="ruleForm">
          <el-form-item>
            <el-row>
              <el-col :span="24">
                <div @click="toggleHistoryInput">
                  <i class="iconfont icon-beizhu"></i>
                  <span class="submitRemark">{{ $t('questionnaire.submitRemark') }}</span>
                </div>
              </el-col>
              <el-col :span="24">
                <el-input size="small" v-if="showHistoryInput" type="textarea" v-model.trim="form.desc"></el-input>
              </el-col>
              <el-col>
                <el-button v-if="showHistoryInput" class="btn-submit" type="success" @click.stop="submitComment">{{ $t('questionnaire.submitRemark') }}</el-button>
                <el-button v-if="showHistoryInput" class="btn-submit btn-submit-cancel" @click.stop="submitCommentCancel">取消</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <div class="remark-warp">
            <ul class="h-cp-content">
              <time-line :isFirst="index === 0 && item.status === '0'" v-for="(item, index) in comments">
                {{ item.time.split(' ')[1].substring(0,5) }}
                <span class="date">{{item.time.split(' ')[0]}}</span>
                  <span class="name1">
                    <agent :id="item.user" :isNum="false"></agent>
                  </span>
                <span class="plan_content">{{item.comment}}</span>
              </time-line>
            </ul>
          </div>
        </el-form>
      </affix>
    </div>
  </div>
</template>
<script>
  import Affix from 'components/ui-modules/affix/Affix'
  import TimeLine from '../../ui-modules/timeLine/TimeLine'
  import Agent from '../../public-modules/cache/Agent'
  import _ from 'lodash'
  import {getFormatDateTime, deepClone} from '../../../utils/m7Utils'
  function getAfterDate (num) {
    let date = new Date()
    date.setHours(9)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    date.setDate(date.getDate() + num)
    return date
  }
  export default {
    name: 'QuestionSummary',
    props: {
      questionnaireDetail: Object
    },
    data () {
      return {
        boolean: false,
        labelPosition: 'top',
        loading: true,
        form: {results: null, region: null, desc: null},
        ques: null,
        showHistoryInput: false,
        visibleTimeInput: false,
        rules: {
          contactContent: [
            { required: true, message: this.$t('customer.contactPlan.pleaseEnterContactPlanContent'), trigger: 'blur' }
          ],
          region: [
            { required: true, type: 'date', message: this.$t('customer.contactPlan.pleasePickTime'), trigger: 'change' }
          ]
        },
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() + 86400000 < Date.now()
          },
          shortcuts: [{
            text: this.$t('public.afterHalfHour'),
            onClick (picker) {
              let date = new Date()
              date.setMinutes(date.getMinutes() + 30)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.afterOneHour'),
            onClick (picker) {
              let date = new Date()
              date.setHours(date.getHours() + 1)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.tomorrow'),
            onClick (picker) {
              let date = getAfterDate(1)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.afterTomorrow'),
            onClick (picker) {
              let date = getAfterDate(2)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.after3Days'),
            onClick (picker) {
              let date = getAfterDate(3)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.after14Days'),
            onClick (picker) {
              let date = getAfterDate(14)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.after30Days'),
            onClick (picker) {
              let date = getAfterDate(30)
              picker.$emit('pick', date)
            }
          }]
        }
      }
    },
    computed: {
      comments () {
        let comments = deepClone(this.questionnaireDetail.comments)
        return comments.reverse()
      },
      showQues () {
        return this.ques
      },
      qstatus () {
        if (this.questionnaireDetail && this.questionnaireDetail.tempData && this.questionnaireDetail.tempData.qstatus) {
          let qstatus = this.questionnaireDetail.tempData.qstatus
          let result = []
          for (let key in qstatus) {
            result.push({name: qstatus[key], value: key})
          }
          return result
        }
        return []
      }
    },
    methods: {
      submitComment () { // 添加备注
        if (_.isEmpty(this.form.desc)) {
          this.$message({type: 'error', message: '请填写内容'})
          return
        }
        this.$store.dispatch('addQuesComment', {comment: this.form.desc, _id: this.questionnaireDetail._id}).then(res => {
          if (res.success) {
            this.form.desc = ''
          }
        })
      },
      submitCommentCancel () { // 取消备注
        this.showHistoryInput = false
      },
      onSubmit () { // 提交问卷
        let submitResult = {}
        if (!this.form.results) {
          this.$message({type: 'error', message: '请选择回访结果'})
          return
        }
        submitResult.result = this.form.results
        submitResult.status = 'complete'
        submitResult._id = this.questionnaireDetail._id
        let anws = {}
        let ques = this.ques
        ques.forEach(item => {
          if (item.vModel) {
            if (typeof item.vModel === 'string') {
              let anw = item.vModel.substr(0, item.vModel.indexOf('__'))
              anws[item._id] = {aws: [anw], 'other': item.otherVModel}
            } else {
              let aws = []
              anws[item._id] = {aws: aws, 'other': item.otherVModel}
              if (item.vModel.length) {
                item.vModel.forEach(model => {
                  let anw = model.substr(0, model.indexOf('__'))
                  aws.push(anw)
                })
              } else {
                let anw = item._id
                aws.push(anw)
              }
            }
          } else {
            let anw = item._id
            anws[item._id] = {aws: [anw], 'other': item.otherVModel}
          }
        })
        submitResult.anws = anws || {}
        this.$store.dispatch('completeTask', submitResult).then((res) => {
          if (res.success) {
            this.$router.push('/index/questionnaire/')
          }
        })
      },
      resetForm () { // 重置表单
        this.form.results = null
        this.form.region = null
        this.ques.forEach(item => {
          if (typeof item.vModel === 'string') {
            item.vModel = ''
            item.otherVModel = ''
          } else {
            item.otherVModel = ''
            item.vModel = []
          }
        })
      },
      laterComplete () { // 稍后回访
        let timeDate = {}
        if (!this.form.region) {
          this.$message({type: 'error', message: '请选择稍后访问的时间'})
          return
        }
        let notifyTime = getFormatDateTime(this.form.region)
        timeDate.notifyTime_date = notifyTime.split(' ')[0]
        timeDate.notifyTime_time = notifyTime.split(' ')[1]
        timeDate._id = this.questionnaireDetail._id
        timeDate.status = 'complete'
        let that = this
        this.$store.dispatch('confirmQuesCallTask', timeDate).then(() => {
          that.visibleTimeInput = false
          that.$router.push('/index/questionnaire/')
        })
      },
      initQues () { // 处理备注历史
        for (let key in this.form) {
          this.form[key] = null
        }
        if (this.questionnaireDetail.result) {
          this.form.results = this.questionnaireDetail.result
        }
        this.ques = []
        let status = this.questionnaireDetail.status
        if (this.questionnaireDetail.tempType === 'dynamic' && status !== 'complete') {
          // 动态问卷处理
          let startQues = this.questionnaireDetail.startQues
          if (startQues) {
            let item2 = deepClone(startQues)
            item2.anws = item2.anws || []
            item2.anws.forEach(anw => {
              anw._id = anw._id + '__' + anw.next
            })
            if (!startQues) return {}
            this.ques.push({
              inputType: 'radio',
              lastQuesId: null,
              otherVModel: '',
              vModel: '',
              show: false,
              _id: item2._id,
              title: item2.name + ' ' + item2.context,
              remark: '',
              answers: item2.anws
            })
          }
        } else {
          // 静态问卷处理 或者是动态问卷的已完成状态的处理
          let questions = this.questionnaireDetail.ques
          if (!questions) {
            return
          }
//        let anws = this.questionnaireDetail.anws || {}
          let anws = this.questionnaireDetail ? this.questionnaireDetail.anws || {} : {}
          questions.forEach(item => {
            let item2 = deepClone(item)
            item2.anws = item2.anws || []
            if (status !== 'complete') {
              item2.anws.forEach(anw => {
                anw._id = anw._id + '__' + anw.next
              })
            }
            let vModel = item2.isMultiselect ? item2.answValue || [] : (item2.answValue ? item2.answValue[0] : '')
            if (status === 'complete' && this.questionnaireDetail.tempType === 'dynamic') {
              for (let key in anws) {
                if (key === item2._id) {
                  this.ques.push({
                    lastQuesId: null,
                    otherVModel: item2.otherValue || '',
                    vModel: vModel,
                    show: false,
                    _id: item2._id,
                    title: item2.name + ' ' + item2.context,
                    remark: '',
                    answers: item2.anws,
                    inputType: (item2.isMultiselect ? 'checkbox' : 'radio')
                  })
                }
              }
            } else {
              this.ques.push({
                lastQuesId: null,
                otherVModel: item2.otherValue || '',
                vModel: vModel,
                show: false,
                _id: item2._id,
                title: item2.name + ' ' + item2.context,
                remark: '',
                answers: item2.anws,
                inputType: (item2.isMultiselect ? 'checkbox' : 'radio')
              })
            }
          })
        }
      },
      changeQuesAnswer (quesId, value, index) {
        if (this.questionnaireDetail.tempType === 'static' || this.questionnaireDetail.status === 'complete') {
          return
        }
        let newQues = []
        for (let i = 0; i < this.ques.length; i++) {
          if (i <= index) {
            newQues.push(this.ques[i])
          }
        }
        this.ques = newQues
        // 获取下一个问题
        let nextQuesId = value.substr(value.indexOf('__') + 2)
        let ques = this.questionnaireDetail.ques
        let nextQues = _.filter(ques, {_id: nextQuesId})
        console.log(nextQues)
        if (nextQues && nextQues.length > 0) {
          let item2 = deepClone(nextQues[0])
          item2.anws.forEach(anw => {
            anw._id = anw._id + '__' + anw.next
          })
          this.ques.push({inputType: 'radio', lastQuesId: quesId, otherVModel: '', vModel: '', _id: nextQues[0]._id, title: nextQues[0].name + ' ' + nextQues[0].context, remark: '', show: false, answers: item2.anws})
        }
      },
      toggleInput (index) {
        this.showQues[index].show = !this.showQues[index].show
      },
      toggleHistoryInput () {
        this.showHistoryInput = !this.showHistoryInput
      }
    },
    watch: {
      'questionnaireDetail': 'initQues'
    },
    components: {
      Affix,
      TimeLine,
      Agent
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .questionContent
    height calc(100vh - 170px)
    overflow-y auto
    .iconfont
      color $c-main
      cursor pointer
      font-size 14px
    .isdisable
      color #ccc
      cursor default
    textarea
      color $c-main
  .btn-warp
    overflow hidden
    display block
    .btn-container
      float right
    .el-button
      width 109px
      padding 8px 0
    .el-button--success
      background $c-main
      border 1px solid $c-main
  .btn-submit
    height 32px
    line-height 32px
    padding 0
    background $c-main
    width 109px
    float right
    margin-top 15px
  .btn-submit-cancel
    background #7ccdd1
    border 1px solid #7ccdd1
    margin-right 10px
    color #fff
  .inputContent
    overflow hidden
    word-wrap break-word
    white-space normal
    line-height 24px
    font-size 12px
    color $cf-gray3
  .laterBtn
    width 120px
    height 36px
    font-size 14px
    color #fff
  .laterBtnCancel
    background-color #7ccdd1
  .laterBtnDone
    background-color #1aba9c
    border 1px solid $c-main
  .btn-box
    width 100%
    padding 20px 48px 5px
    box-sizing border-box
  .resetForm
    background #7ccdd1 !important
    border 1px solid #7ccdd1 !important
  .name1
    color #7ccdd1
  .submitRemark
    color $c-main
    cursor pointer
  .question-detail
    padding 15px 20px 20px
  .question-row
    label
      float left
      margin -6px 10px 0 0
  .ui-time-line
    font-size 12px
    .name1
      margin 0 10px
    .date
      margin-left 5px
</style>
