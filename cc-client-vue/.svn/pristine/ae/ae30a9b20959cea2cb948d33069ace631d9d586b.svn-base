<template>
  <div class="condition" v-if="isShowTaskQA">
    <div class="top">
      <!--<h3 class="title"><span class="sign"></span><span class="text">查询条件</span></h3>-->
      <affix :label="'查询条件'"></affix>
      <div class="tem">
        <span class="temp">任务模板：</span>
        <el-radio-group v-model.trim="taskTemVal" @change="taskTemChange" v-if="qualityCheckTaskTemplates.length!==0">
          <el-radio size="small"
            v-for="(item, index) in qualityCheckTaskTemplates"
            :label="index">
              {{item.TASK_NAME}}
          </el-radio>
        </el-radio-group>
        <span class="addOrDel" @click="showAddTaskTemp"><i class="iconfont icon-zhankai"></i> <span>添加模板</span></span>
        <span class="addOrDel" @click="removeTaskTemp"><i class="iconfont icon-guanbi"></i> <span>删除模板</span></span>
      </div>
      <div v-if="conditionForTask" class="condition-temp-show-wrap">
        <!--任务模板-->
        <div class="condition-temp-show-call">
          <div class="condition-temp-con condition-temp-con-first-line">
            <span class="wd100">任务名称：</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.taskName}}</span>
          </div>
          <div class="condition-temp-con">
            <span class="wd100">质检模板：</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.TaskTmplateName}}</span>
          </div>
          <div class="condition-temp-con">
            <span class="wd100">呼叫类型：</span>
            <span class="condition-temp-con-detail" v-if="!curTaskTemp.taskConnectType.length"></span>
            <span class="con-lable" v-else v-for="taskConnectTypeItem in curTaskTemp.taskConnectType">
              {{taskConnectTypeItem}}
            </span>
          </div>
          <div class="condition-temp-con condition-temp-con-first-line">
            <span class="wd100">满意度：</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.investigate}}</span>
          </div>
          <div class="condition-temp-con">
            <span class="wd100">质检专员：</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.taskQaSpecialist}}</span>
          </div>
          <div class="condition-temp-con">
            <span class="wd100">呼叫时间：</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.taskPickerStart}}</span>
            <span style="margin-right: 7px;">至</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.taskPickerEnd}}</span>
          </div>
          <div class="condition-temp-con condition-temp-con-first-line">
            <span class="wd100">技能组：</span>
            <span class="condition-temp-con-detail" v-if="!curTaskTemp.taskSelectQueues.length"></span>
            <span class="con-lable" v-else v-for="taskConnectTypeItem in curTaskTemp.taskSelectQueues">
              {{taskConnectTypeItem}}
            </span>
          </div>
          <div class="condition-temp-con">
            <span class="wd100">抽取规则：</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.extractionRuleNum}}</span>
            <span class="condition-temp-con-detail wd70">{{curTaskTemp.taskNum}}</span>
          </div>
          <div class="condition-temp-con">
            <span class="wd100">通话时长：</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.telStart}}</span>
            <span style="margin-right: 7px;">至</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.telEnd}}</span>
          </div>
          <div class="condition-temp-con" style="width:100%;">
            <span class="wd100">录音内容分类：</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.qaLableOne}}</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.qaLableTwo}}</span>
            <span class="condition-temp-con-detail">{{curTaskTemp.qaLableThree}}</span>
          </div>
          <div class="condition-temp-con condition-temp-con-last-line">
            <span class="wd100">通话座席：</span>
            <span class="condition-temp-con-detail" v-if="!curTaskTemp.taskSelectAgents.length"></span>
            <span class="con-lable" v-else v-for="item in curTaskTemp.taskSelectAgents">
              {{item}}
            </span>
            <el-checkbox v-model="curTaskTemp.taskCheckbox" :disabled="true">包含已选座席下级</el-checkbox>
          </div>
        </div>
      </div>
      <div class="sub">
        <span class="search" @click="searchTaskTemBtn">{{$t('public.search2')}}</span>
      </div>
      <!--<h3 class="title">-->
        <!--<span class="sign"></span>-->
        <!--<span class="text">查询结果</span>-->
      <!--</h3>-->
      <affix :label="'查询结果'"></affix>
    </div>
    <div class="tables">
      <div class="deploy">
        <!--<div class="page-wrap">-->
          <!--<span class="fl all">共{{count || 0}}条记录&nbsp;|&nbsp;</span>-->
          <!--<span class="currentpage">{{taskCurPage}}/{{totalPage}}</span>-->
          <!--<el-pagination-->
            <!--small-->
            <!--:page-size="10"-->
            <!--layout=" prev, next"-->
            <!--class="fr"-->
            <!--@current-change="turnPage"-->
            <!--:current-page="taskCurPage"-->
            <!--:total="count">-->
          <!--</el-pagination>-->
        <!--</div>-->
        <Pagination
          class="fr"
          :small="true"
          :currentPage="taskCurPage"
          :count="count"
          @turnPage="turnPage"
          :totalPage="Math.ceil(count/pageSize)"
        >
        </Pagination>
      </div>
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column prop="CUSTOMER_NAME" :label="$t('public.locationCustomer')" width="">
        </el-table-column>
        <el-table-column label="任务名称" width="">
          <template scope="scope">
            <span>{{curTaskTemp.taskName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CALL_NO_SHOW" :label="$t('qualityCheck.callingNumber')" width="">
        </el-table-column>
        <el-table-column prop="CALLED_NO_SHOW" :label="$t('qualityCheck.calledNumber')" width="">
        </el-table-column>
        <el-table-column prop="CONNECT_TYPE_show" :label="$t('call.callType')" width="">
        </el-table-column>
        <el-table-column prop="STATUS_show" :label="$t('qualityCheck.answerState')" width="">
        </el-table-column>
        <el-table-column prop="DISPOSAL_AGENT_show" :label="$t('call.callRingSeat')" width="">
        </el-table-column>
        <el-table-column prop="QUEUE_NAME" :label="$t('call.skillGroup')" width="">
        </el-table-column>
        <el-table-column prop="INVESTIGATE_show" :label="$t('public.satisfaction')" width="">
        </el-table-column>
        <el-table-column prop="OFFERING_TIME" :label="$t('public.callTime')" width="">
        </el-table-column>
        <el-table-column prop="CALL_TIME_LENGTH_show" :label="$t('call.callTime')" width="">
        </el-table-column>
        <el-table-column  :label="$t('public.operate')" width="">
          <template scope="scope2">
            <el-button v-if="taskQaSpecialistId === currentUserId" @click="handle(scope2.row)" type="text" size="small">{{$t('qualityCheck.grade')}}</el-button>
            <br v-if="taskQaSpecialistId === currentUserId">
            <el-button v-if="taskQaSpecialistId === currentUserId" @click="replacementRecord(scope2.row)" type="text" size="small">置换</el-button>
            <br v-if="taskQaSpecialistId === currentUserId">
            <el-button type="text" @click="look(scope2.row._id)" size="small" >{{$t('qualityCheck.viewLook')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('qualityCheck.callQualityInfo')" v-model.trim="callDialogShow" size="tiny" class="score" @close="off" :close-on-click-modal="false">
      <call-grade :currentItemCall = "this.currentItemCall"  :currentGrade = "0"  :template = "this.template" @saveGrade="saveGrade" :qcResectLabel="qcResectLabel" @off="off" @handle="handle" :refreshCallGrade="refreshCallGrade"></call-grade>
    </el-dialog>
    <div class="looklog">
      <el-dialog modal-append-to-body lock-scroll top="10%" v-model.trim="isShowlooklog" :title="title">
        <div class="tables">
          <div class="deploy">
            <div class="search-pagination">
              <pagination
                :small="paginationRecord.small"
                :currentPage="paginationRecord.currentPage"
                :count="countRecord"
                @turnPage="turnPageRecord"
                :totalPage="totalPageRecord"
              >
              </pagination>
            </div>
          </div>
          <el-table :data="recordList" style="width: 100%">
            <el-table-column prop="user" :label="listenpp" width="">
            </el-table-column>
            <el-table-column prop="" label="" width="">
            </el-table-column>
            <el-table-column prop="time" :label="listenTime" width="">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
    <add-task-tem :addTaskData="addTaskData" @addTaskTem="addTaskTem"></add-task-tem>
  </div>
</template>
<script>
  import {deepClone, getDateTime} from '../../../../utils/m7Utils'
  import addTaskTem from '../base/addTaskTem'
  import CallGrade from './CallGrade'
  import Pagination from '../../../public-modules/card/Pagination'
  import Affix from '../../../ui-modules/affix/Affix.vue'
  export default {
    name: 'random',
    data () {
      return {
        loading: false,
        template: {},
        taskTempId: '',
        isShowTaskQA: false,
        isShowlooklog: false,    // 显示查看日志
        recordList: [],
        paginationRecord: {
          small: false,
          currentPage: 1
        },
        taskTemVal: '',   //   任务模板  value
        qualityCheckTaskTemplates: [],  // 任务模板
        curConditionTemp: {},    //  当前被选中的 任务模板
        curTaskTemp: {  //  当前被选中的 任务模板
          taskName: '',         // 任务名称
          TaskTmplateName: '', // 质检模板
          taskTemplate: '',
          extractionRuleNum: '',
          taskNum: 0,
          taskConnectType: [],   // 呼叫类型
          taskPickerStart: '',
          taskPickerEnd: '',
          taskCheckbox: false,
          taskSelectQueues: [],    // 技能组
          taskQaSpecialist: '',     // 质检员
          investigate: '',    // 满意度
          taskSelectAgents: [],  // 通话座席
          qaLableOne: '',   // 录音内容分类
          qaLableTwo: '',
          qaLableThree: '',
          qaLableShow: false
        },
        title: '',
        listenTime: '',
        listenpp: '',
        conditionForTask: true,   //  是否显示
        taskCurPage: 1,
        pageSize: 10,
        addTaskData: {    //    添加模板  dialog  传的数据
          isShow: false,
          qualityCheckTemplates: []
        },
        callDialogShow: false,     // 评分
        isSave: false,
        qcResectLabel: false,
        currentItemCall: {},
        refreshCallGrade: '',
        currentUserId: '',       // 当前座席的ID
        taskQaSpecialistId: '',   // 当前质检id
        selectedId: '',
        selectedCallId: '',
        callForm: {}
      }
    },
    methods: {
//      从缓存获取 质检模板
      fetchData () {
        let p1 = this.$store.dispatch('getCache', {type: 'qualityCheckTemplates'})
        let p2 = this.$store.dispatch('getCache', {type: 'qualityTasks'})
        let p3 = this.$store.dispatch('getCache', {type: 'agents'})
        let p4 = this.$store.dispatch('getCache', {type: 'callType'})
        let p5 = this.$store.dispatch('getCache', {type: 'queues'})
        let p6 = this.$store.dispatch('getCache', {type: 'options'})
        Promise.all([p1, p2, p3, p4, p5, p6]).then(() => {
          this.addTaskData.qualityCheckTemplates = this.$store.state.session.dicMap.qualityCheckTemplates
          this.$store.dispatch('getQualityTaskTemplates').then((res) => {
            if (res.success) {
              this.qualityCheckTaskTemplates = res.list
              if (this.qualityCheckTaskTemplates) {
                this.taskTemVal = 0
                this.taskTemChange(0)
              }
              this.isShowTaskQA = true
            }
          })
        })
        this.currentUserId = this.$store.state.session.user._id
      },
      taskTemChange (index) {
        console.log(index)
        let taskTemplateId = this.qualityCheckTaskTemplates[index]._id
        this.taskTempId = this.qualityCheckTaskTemplates[index]._id
        if (taskTemplateId) {
          this.getTaskTemplate(taskTemplateId)
        }
      },
      searchByTaskTem () {
        let data = {}
        this.loading = true
        data.pageSize = this.pageSize
        data.page = this.taskCurPage
        data.cdrId = 'quality_check_query_task'
        data.taskTemplate = this.taskTempId
        this.$store.dispatch('normalCallSearch', data).then((res) => {
          if (res) {
            this.selectedId = res
          }
          this.loading = false
        })
      },
      turnPage (pageNum) {
        this.taskCurPage = pageNum
        this.searchByTaskTem()
      },
      getinvestigate () {
        let options = this.$store.state.session.dicMap.options
        for (let i = 0; i < options.length; i++) {
          if (options[i].name === '满意度调查选项') {
            return options[i]
          }
        }
      },
      searchTaskTemBtn () {
        this.searchByTaskTem()
      },
      getTaskTemplate (data) {
        let qualityTasks = this.$store.state.session.dicMap.qualityTasks
        if (qualityTasks) {
          let tasks = qualityTasks
          for (let ind in tasks) {
            if (data === tasks[ind]._id) {
              let res = tasks[ind]
              this.callForm = res.query
              this.conditionForTask = true
              this.curTaskTemp.taskName = res.TASK_NAME
              let templates = this.addTaskData.qualityCheckTemplates
              for (let i = 0; i < templates.length; i++) {
                if (templates[i]._id === res.query.TASK_TEMPLATE) {
                  this.curTaskTemp.TaskTmplateName = templates[i].name
                  this.template = templates[i]
                }
              }
              // 录音标签
              this.curTaskTemp.qaLableOne = ''
              this.curTaskTemp.qaLableTwo = ''
              this.curTaskTemp.qaLableThree = ''
              let callLabel = this.$store.state.session.dicMap.callLabel
              if (res.query.singleLabel) {
                for (let i in callLabel) {
                  if (callLabel[i]._id === res.query.singleLabel) {
                    this.curTaskTemp.qaLableOne = callLabel[i].name
                  }
                }
              } else if (res.query.multiFirst) {
                for (let i in callLabel) {
                  let first = callLabel[i]
                  if (callLabel[i]._id === res.query.multiFirst) {
                    this.curTaskTemp.qaLableShow = true
                    this.curTaskTemp.qaLableOne = first.name
                    for (let f in first.child) {
                      let two = first.child[f]
                      if (two._id === res.query.multiTwo) {
                        this.curTaskTemp.qaLableTwo = two.name
                        for (let h in two.child) {
                          let three = two.child[h]
                          if (three._id === res.query.multiThree) {
                            this.curTaskTemp.qaLableThree = three.name
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                this.curTaskTemp.qaLableShow = false
              }

              // 抽取规则
              if (res.query.sample_selection_rule === 'per_num') {
                this.curTaskTemp.extractionRuleNum = '人均条数'
                this.curTaskTemp.taskNum = res.query.count
              } else if (res.query.sample_selection_rule === 'entirety_num') {
                this.curTaskTemp.extractionRuleNum = '整体条数'
                this.curTaskTemp.taskNum = res.query.count
              } else if (res.query.sample_selection_rule === 'per_percent') {
                this.curTaskTemp.extractionRuleNum = '人均百分比'
                this.curTaskTemp.taskNum = res.query.percent
              } else {
                this.curTaskTemp.extractionRuleNum = '整体百分比'
                this.curTaskTemp.taskNum = res.query.percent
              }

              // 呼叫类型
              this.curTaskTemp.taskConnectType = []
              if (res.query.CONNECT_TYPE) {
                let calllist = []
                let curConditionTempArr = []
                if (res.query.CONNECT_TYPE.indexOf(',') !== -1) {
                  calllist = res.query.CONNECT_TYPE.split(',')
                } else {
                  calllist.push(res.query.CONNECT_TYPE)
                }
                for (let j = 0; j < calllist.length; j++) {
                  let callType = this.$store.state.session.dicMap.callType
                  for (let i = 0; i < callType.length; i++) {
                    if (callType[i].code_value === calllist[j]) {
                      curConditionTempArr.push(callType[i].code_name)
                    }
                  }
                }
                this.curTaskTemp.taskConnectType = curConditionTempArr
              } else {
                this.curTaskTemp.taskConnectType = []
              }

              // 呼叫时间
              this.curTaskTemp.taskPickerStart = res.query.BEGIN_TIME
              this.curTaskTemp.taskPickerEnd = res.query.END_TIME
              // 是否包含下级
              if (res.query.includeSubordinate) {
                this.curTaskTemp.taskCheckbox = true
              } else {
                this.curTaskTemp.taskCheckbox = false
              }
              // 技能组
              if (res.query.QUEUE) {
                let list = []
                let queuesArr = []
                if (res.query.QUEUE.indexOf(',') !== -1) {
                  list = res.query.QUEUE.split(',')
                } else {
                  list.push(res.query.QUEUE)
                }
                for (let j = 0; j < list.length; j++) {
                  let queues = this.$store.state.session.dicMap.queues
                  for (let i = 0; i < queues.length; i++) {
                    if (queues[i].Exten === list[j]) {
                      queuesArr.push(queues[i].DisplayName)
                    }
                  }
                }
                this.curTaskTemp.taskSelectQueues = queuesArr
              } else {
                this.curTaskTemp.taskSelectQueues = []
              }

              // 质检员
              let agents = this.$store.state.session.dicMap.agents
              for (let i = 0; i < agents.length; i++) {
                if (agents[i]._id === res.query.QA_SPECIALIST) {
                  this.taskQaSpecialistId = res.query.QA_SPECIALIST
                  this.curTaskTemp.taskQaSpecialist = agents[i].displayName + '[' + agents[i].exten + ']'
                }
              }

              // 满意度
              this.curTaskTemp.investigate = ''
              let investigate = this.getinvestigate()
              let investiageNum = res.query.INVESTIGATE
              if (investiageNum) {
                for (let i = 0; i < investigate.options.length; i++) {
                  let invData = investigate.options[i]
                  for (let j = 0; j < invData.options.length; j++) {
                    if (invData.options[j].name === investiageNum) {
                      this.curTaskTemp.investigate = invData.name
                    }
                  }
                }
              } else {
                this.curTaskTemp.investigate = '--全部--'
              }

              // 通话座席
              this.curTaskTemp.taskSelectAgents = []
              if (res.query.selectedAgentList) {
                let list = []
                let selectAgentsArr = []
                if (res.query.selectedAgentList.indexOf(',') !== -1) {
                  list = res.query.selectedAgentList.split(',')
                } else {
                  list.push(res.query.selectedAgentList)
                }
                for (let j = 0; j < list.length; j++) {
                  let agents = this.$store.state.session.dicMap.agents
                  for (let i = 0; i < agents.length; i++) {
                    if (agents[i]._id === list[j]) {
                      selectAgentsArr.push(agents[i].displayName)
                    }
                  }
                }
                this.curTaskTemp.taskSelectAgents = selectAgentsArr
              } else {
                this.curTaskTemp.taskSelectAgents = []
              }
              // 通话时长
              this.curTaskTemp.telStart = res.query.CALL_TIME_LENGTH_BEGIN
              this.curTaskTemp.telEnd = res.query.CALL_TIME_LENGTH_END
              this.searchByTaskTem()
            }
          }
        }
      },
      look (_id) {
        this.paginationRecord.currentPage = 1
        this.countRecord = 0
        this.totalPageRecord = 0
        this.isShowlooklog = true
        this.queryRecordCallListenLog(_id, 1)
      },
      turnPageRecord (pageNum) {
        this.paginationRecord.currentPage = pageNum
        this.queryRecordCallListenLog(this.currentId, pageNum)
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
      handle (data) {
        this.currentIndex = 0
        for (let i = 0; i < this.tempList.length; i++) {
          if (this.tempList[i]._id === data._id) {
            this.currentIndex = i
            break
          }
        }
        var num = this.tempList.length - this.currentIndex
        if (num < 5) {
          setTimeout(this.getMoreQualityCheckCallSheet, 1000)
        }
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.webchatDialogShow = true
          let self = this
          self.currentItem = data
        } else {
          this.callDialogShow = true
          this.qcResectLabel = true
          this.$store.dispatch('queryBusiness', {callId: data._id, customer: data.CUSTOMER_ID}).then((res) => {
            data.audio = this.recordFileName(data.FILE_SERVER, data.RECORD_FILE_NAME)
            if (res && res.length > 0) {
              data.busHistory = [res[0]]
            } else {
              data.busHistory = []
            }
            this.currentItemCall = data
            this.refreshCallGrade = Math.random()
          })
        }
      },
      off () {
        this.webchatDialogShow = false
        this.callDialogShow = false
        this.qcResectLabel = false
        let play = document.getElementById('quality-autoplay')
        if (play) {
          play.pause()
        }
        this.$store.commit('webchat/QUALITY_QUERY_WEBCHAT_HISTORY_CLEAR')
        if (this.isSave === true) {
          this.query()
        }
      },
      getMoreQualityCheckCallSheet () {
        this.callForm.cdrId = 'quality_check_query'
        if (this.callForm.beginTime && this.callForm.beginTime[0] !== null) {
          this.callForm.BEGIN_TIME = getDateTime(this.callForm.beginTime[0])
        }
        if (this.callForm.beginTime && this.callForm.beginTime[1] !== null) {
          this.callForm.END_TIME = getDateTime(this.callForm.beginTime[1])
        }
        this.callForm.pageSize = 10
        let form = deepClone(this.callForm)
        this.$store.dispatch('getMoreQualityCheckCallSheet', {data: form, tempList: this.tempList, type: 'call'})
      },
      query () {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.callForm.page = 1
          this.pagination.currentPage = 1
          this.$refs.chatForm.validate((valid) => {
            if (valid) {
              this.getQualityCheckWebchatSession()
              this.isSave = false
            }
          })
        } else {
          this.callForm.page = 1
          this.paginationCall.currentPage = 1
          this.$refs.callForm.validate((valid) => {
            if (valid) {
              if (this.callForm.CALL_TIME_LENGTH_BEGIN && this.callForm.CALL_TIME_LENGTH_END && this.callForm.CALL_TIME_LENGTH_BEGIN >= this.callForm.CALL_TIME_LENGTH_END) {
                this.$message.error(this.$t('qualityCheck.PleaseEnterTheCorrectCallDurationRrange'))
                return
              }
              this.getNormalCallsheetData()
              this.isSave = false
            } else {
            }
          })
        }
      },
      saveGrade (gradeObj, SQlabel) {
        this.isSave = true
        this.$store.commit('deleteGraded/qualityCheck', this.currentIndex)
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          let data = deepClone(gradeObj)
          data._id = this.currentItem._id
          data.TEMPLATE = this.template._id
          data.values = gradeObj.obj
          let self = this
          this.$store.dispatch('saveWebchatSheetGrade', {data, currentItem: this.currentItem}).then((res) => {
            self.webchatDialogShow = false
            this.$store.commit('deleteGraded/qualityCheck', 1)
            if (self.tempList.length <= 0) {
              self.$message.success(this.$t('qualityCheck.allRatingFinish'))
            } else {
              self.$message.success(this.$t('qualityCheck.rateSuccessNext'))
              this.handle(self.tempList[0])
            }
          })
        } else if (this.template.type === 'pass') {
          let data = {}
          data.CALL_SHEET_ID = this.currentItemCall.CALL_SHEET_ID
          gradeObj.config.amount = gradeObj.grade.amount
          data.QUALITY_GRADE = gradeObj.config
          data.COMMENTS = gradeObj.grade.COMMENT
          let GRADE_DATA = {}
          GRADE_DATA._id = this.currentItemCall._id
          GRADE_DATA.OFFERING_TIME = this.currentItemCall.OFFERING_TIME
          GRADE_DATA.DISPOSAL_AGENT = this.currentItemCall.DISPOSAL_AGENT
          GRADE_DATA.CALL_NO = this.currentItemCall.CALL_NO
          GRADE_DATA.CALLED_NO = this.currentItemCall.CALLED_NO
          GRADE_DATA.CONNECT_TYPE = this.currentItemCall.CONNECT_TYPE
          GRADE_DATA.ERROR_MEMO = this.currentItemCall.ERROR_MEMO
          GRADE_DATA.CALL_TIME_LENGTH = this.currentItemCall.CALL_TIME_LENGTH
          GRADE_DATA.FILE_SERVER = this.currentItemCall.FILE_SERVER
          GRADE_DATA.RECORD_FILE_NAME = this.currentItemCall.RECORD_FILE_NAME
          GRADE_DATA.INVESTIGATE = this.currentItemCall.INVESTIGATE
          GRADE_DATA.GRADE_AMOUNT = gradeObj.config
          GRADE_DATA.COMMENTS = gradeObj.COMMENT
          GRADE_DATA.TEMPLATE = this.template._id
          GRADE_DATA.SQ_LABEL = SQlabel
          data.GRADE_DATA = GRADE_DATA
          data.SQ_LABEL = SQlabel
          let self = this
          this.$store.dispatch('saveCallShellGrade', {data}).then((res) => {
            self.callDialogShow = false
            self.qcResectLabel = false
            this.$store.commit('deleteGraded/qualityCheck', 1)
            if (self.tempList.length <= 0) {
              self.$message.success(this.$t('qualityCheck.allRatingFinish'))
            } else {
              self.$message.success(this.$t('qualityCheck.rateSuccessNext'))
              this.handle(self.tempList[0])
            }
          })
        } else {
          let data = {}
          data.CALL_SHEET_ID = this.currentItemCall.CALL_SHEET_ID
          data.QUALITY_GRADE = gradeObj.grade
          data.COMMENTS = gradeObj.COMMENT
          let GRADE_DATA = {}
          GRADE_DATA._id = this.currentItemCall._id
          GRADE_DATA.OFFERING_TIME = this.currentItemCall.OFFERING_TIME
          GRADE_DATA.DISPOSAL_AGENT = this.currentItemCall.DISPOSAL_AGENT
          GRADE_DATA.CALL_NO = this.currentItemCall.CALL_NO
          GRADE_DATA.CALLED_NO = this.currentItemCall.CALLED_NO
          GRADE_DATA.CONNECT_TYPE = this.currentItemCall.CONNECT_TYPE
          GRADE_DATA.ERROR_MEMO = this.currentItemCall.ERROR_MEMO
          GRADE_DATA.CALL_TIME_LENGTH = this.currentItemCall.CALL_TIME_LENGTH
          GRADE_DATA.FILE_SERVER = this.currentItemCall.FILE_SERVER
          GRADE_DATA.RECORD_FILE_NAME = this.currentItemCall.RECORD_FILE_NAME
          GRADE_DATA.INVESTIGATE = this.currentItemCall.INVESTIGATE
          GRADE_DATA.GRADE_AMOUNT = gradeObj.grade
          GRADE_DATA.COMMENTS = gradeObj.COMMENT
          GRADE_DATA.TEMPLATE = this.template._id
          GRADE_DATA.SQ_LABEL = SQlabel
          data.SQ_LABEL = SQlabel
          for (let i in gradeObj.obj) {
            GRADE_DATA[i] = gradeObj.obj[i]
          }
          data.GRADE_DATA = GRADE_DATA

          let self = this
          this.$store.dispatch('saveCallGradeForScore', {data}).then((res) => {
            self.callDialogShow = false
            self.qcResectLabel = false
            // 删除tempList评价完的那个
            this.$store.commit('deleteGraded/qualityCheck', 1)
            if (self.tempList.length <= 0) {
              self.$message.success(this.$t('qualityCheck.allRatingFinish'))
            } else {
              self.$message.success(this.$t('qualityCheck.rateSuccessNext'))
              this.handle(self.tempList[0])
            }
          })
        }
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
      showAddTaskTemp () {
        this.addTaskData.isShow = true
      },
      removeTaskTemp () {
        this.$confirm('是否停用当前任务', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('removeQualityCheckTaskTemplates', {'taskTemplate': this.taskTempId}).then((res) => {
            if (res.success) {
              this.fetchData()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message.error('任务模板删除失败，请稍后再试！')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }, // 移除模板
      addTaskTem (data) { // 添加模板
        if (data) {
          this.selectedId = data
        }
        this.fetchData()
      },
      replacementRecord (data) {
        if (this.selectedCallId === '') {
          this.selectedCallId = this.selectedId
        }
        this.$store.dispatch('replacementRecord', {selectedId: this.selectedCallId, _id: data._id}).then((res) => {
          if (!res.success) {
            this.$message.error('置换数据失败!')
          } else {
            if (res.callId) {
              this.selectedCallId += ',' + res.callId
            } else {
              this.$message.error('此座席无更多通话记录')
              return
            }
            this.$message({
              message: '置换数据成功',
              type: 'success'
            })
            this.searchByTaskTem()
          }
        })
      }
    },
    computed: {
      count () {
        return this.$store.state.qualityCheck.searchList.count
      },
      totalPage () {
        return Math.ceil(this.$store.state.qualityCheck.searchList.count / 10) || 1
      },
      tableData () {
        return this.$store.state.qualityCheck.searchList.list
      },
      tempList () {
        return this.$store.state.qualityCheck.tempList
      }
    },
    components: {
      addTaskTem,
      Pagination,
      CallGrade,
      Affix
    },
    beforeMount () {
      this.fetchData()
    }
  }
</script>
<style lang="stylus" scoped>
  .condition
    height calc(100vh - 158px)
    padding 20px 20px 0
    overflow scroll
    .ui-affix
      padding-bottom 0
      margin-top 20px
    .wd100
      width 100px
      text-align right
      display inline-block
    .w200
      width 200px
    .top
      .tem
        .addOrDel
          margin-left 20px
          display inline-block
          padding 4px
          border 1px solid #1abb9c
          border-radius 2px
          color #1abb9c
          font-size 12px
          cursor pointer
          .iconfont
            font-size 12px
      .temp
        display inline-block
        margin-bottom 20px
      .el-radio
        margin 0 0 6px 20px
      .temp
        color $cf-gray1
      .condition-temp-show-wrap
        .condition-temp-show-webchat
        .condition-temp-show-call
          .condition-temp-con
            min-width 390px
            display inline-block
            margin-left 20px
            margin-top 20px
            .condition-temp-con-detail
              display inline-block
              width 150px
              border 1px solid #ddd
              border-radius 4px
              background-color #fafafa
              padding 4px
              height 16px
              line-height 16px
              margin-right 10px
              vertical-align middle
            .con-lable
              padding 4px
              background-color #1bbc9b
              color #fff
              border-radius 4px
              margin-right 5px
            .wd60
              width 60px
            .wd70
              width 70px
          .condition-temp-con-first-line
            min-width 280px
          .condition-temp-con-last-line
            /*width 600px*/
            /*.el-checkbox*/
              /*margin-left 20px*/
      .sub
        text-align right
        margin-top 20px
        .rest
        .search
          display inline-block
          width 108px
          height 30px
          cursor pointer
          background #72c7e3
          color #fff
          text-align center
          line-height 30px
          border-radius 2px
        .search
          background #1abb9c
          margin-left 24px
    .tables
      padding-bottom 30px
      .deploy
        height 48px
        line-height 48px
        color #989898
        border 1px solid #ebebeb
        border-bottom none
        padding-left 14px
        .fr
          padding-top 10px
          height 38px
    .title
      color #999
      margin 28px 0 18px 0
      font-weight normal
      position relative
      line-height 16px
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
        border-bottom 1px dashed #999
        position absolute
        top 50%
  .search-pagination
    float right
    height 48px
    .page
      margin-top 10px
      .el-pagination
        padding 0
</style>
