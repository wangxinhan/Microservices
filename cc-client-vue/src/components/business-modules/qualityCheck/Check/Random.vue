<template>
  <div class="condition" v-if="isShowConditionQA">
    <div class="top">
      <affix :label="'查询条件'"></affix>
      <div class="tem">
        <span class="temp">质检模板：</span>
        <el-radio-group v-model.trim="chenkTemValue" @change="checkTemChange" v-if="qualityCheckTemplates.length!==0">
          <el-radio size="small"
            name="checkTem"
            v-for="(item, index) in qualityCheckTemplates"
            :label="index">
              {{item.name}}
            <span v-if="item.QUALITY_TYPE==='qualityWebchat'">{{$t('qualityCheck.webchat')}}</span>
            <span v-else>{{$t('qualityCheck.call')}}</span>
          </el-radio>
        </el-radio-group>
      </div>
      <div class="term">
        <p class="temp">条件模板：</p>
        <el-radio-group v-model.trim="conditionTemValue" @change="conditionTemChange" v-if="qualityConditionTemplatesDone.length!==0">
          <el-radio size="small"
            name="conditionTem"
            v-for="(item, index) in qualityConditionTemplatesDone"
            :label="index">
              {{item.TEMPLATE_NAME}}
          </el-radio>
          <span class="addOrDel" @click="showAddCondTemp"><i class="iconfont icon-zhankai"></i> <span>添加模板</span></span>
          <span class="addOrDel" @click="delCondTemp"><i class="iconfont icon-guanbi"></i> <span>删除模板</span></span>
        </el-radio-group>
      </div>
      <div class="condition-temp-show-wrap">
        <!--在线咨询条件模板-->
        <div v-if="curQualilyType === 'qualityWebchat'" class="condition-temp-show-webchat">
          <div class="condition-temp-con condition-temp-con-first-line"><span class="wd100">模板名称：</span><span class="condition-temp-con-detail">{{curConditionTemp.TEMPLATE_NAME}}</span></div>
          <div class="condition-temp-con"><span class="wd100">抽取规则：</span><span class="condition-temp-con-detail">{{curConditionTemp.suijiLabel}}</span><span class="condition-temp-con-detail wd60">{{curConditionTemp.suijiLabelRandomNum}}</span></div>
          <div class="condition-temp-con"><span class="wd100">领取时间：</span><span class="condition-temp-con-detail" style="width:126px;margin:0;">{{curConditionTemp.beginTimeBegin}}</span>至  <span class="condition-temp-con-detail" style="width:126px;margin:0;">{{curConditionTemp.beginTimeEnd}}</span></div>
          <div class="condition-temp-con condition-temp-con-first-line"><span class="wd100">满意度：</span><span class="condition-temp-con-detail">{{curConditionTemp.satisfaction}}</span></div>
          <div class="condition-temp-con"><span class="wd100">结束会话类型：</span><span class="condition-temp-con-detail">{{curConditionTemp.finishKeys}}</span></div>
          <div class="condition-temp-con"><span class="wd100">消息条数：</span><el-radio v-model="curConditionTemp.msgCountType" label="gt" size="small" :disabled="true">大于</el-radio><el-radio v-model="curConditionTemp.msgCountType" label="lt" :disabled="true" size="small">小于</el-radio><el-radio v-model="curConditionTemp.msgCountType" label="eq" size="small" :disabled="true">等于</el-radio><span class="condition-temp-con-detail wd60">{{curConditionTemp.msgCount}}</span></div>
          <div class="condition-temp-con condition-temp-con-last-line"><span class="wd100">座席：</span><span v-if="curConditionTemp.agents.length === 0" class="condition-temp-con-detail">{{curConditionTemp.agentsInput}}</span><span class="con-lable" v-for="item in curConditionTemp.agents">{{item}}</span><el-checkbox  v-model="curConditionTemp.checkState" :disabled="true">包含已选座席下级</el-checkbox></div>
        </div>
        <!--通话条件模板-->
        <div v-if="curQualilyType !== 'qualityWebchat'" class="condition-temp-show-call">
          <div class="condition-temp-con condition-temp-con-first-line"><span class="wd100">模板名称：</span><span class="condition-temp-con-detail">{{curConditionTemp.TEMPLATE_NAME}}</span></div>
          <div class="condition-temp-con"><span class="wd100">呼叫类型：</span><span v-if="curConditionTemp.selectedCallTypeList.length === 0" class="condition-temp-con-detail">{{curConditionTemp.selectedCallTypeAll}}</span><span class="con-lable" v-for="item in curConditionTemp.selectedCallTypeList">{{item}}</span></div>
          <div class="condition-temp-con"><span class="wd100">通话时长：</span><span class="condition-temp-con-detail" style="width:80px;">{{curConditionTemp.CALL_TIME_LENGTH_BEGIN}}</span>至&nbsp;<span class="condition-temp-con-detail" style="width:80px;">{{curConditionTemp.CALL_TIME_LENGTH_END}}</span></div>
          <div class="condition-temp-con condition-temp-con-first-line"><span class="wd100">满意度：</span><span class="condition-temp-con-detail">{{curConditionTemp.INVESTIGATE}}</span></div>
          <div class="condition-temp-con"><span class="wd100">技能组：</span><span v-if="curConditionTemp.myqueue.length === 0" class="condition-temp-con-detail">{{curConditionTemp.ERROR_MEMO}}</span><span class="con-lable" v-for="item in curConditionTemp.myqueue">{{item}}</span></div>
          <div class="condition-temp-con"><span class="wd100">呼叫时间：</span><span class="condition-temp-con-detail" style="width:126px;margin:0;">{{curConditionTemp.BEGIN_TIME}}</span>至  <span class="condition-temp-con-detail" style="width:126px;margin:0;">{{curConditionTemp.END_TIME}}</span></div>
          <div class="condition-temp-con condition-temp-con-first-line" style="width:280px;"><span>{{curConditionTemp.suijiLabel}}：</span><span class="condition-temp-con-detail">{{curConditionTemp.suijiLabelRandomNum}}</span></div>
          <div class="condition-temp-con" style="width:800px;"><span class="wd100">录音内容分类：</span><span class="condition-temp-con-detail" style="min-width:150px;">{{curConditionTemp.qaLableOne}}</span><span class="condition-temp-con-detail" style="min-width:150px;">{{curConditionTemp.qaLableTwo}}</span><span class="condition-temp-con-detail" style="min-width:150px;">{{curConditionTemp.qaLableThree}}</span></div>
          <div class="condition-temp-con condition-temp-con-last-line"><span class="wd100">通话座席：</span><span v-if="curConditionTemp.agents.length === 0" class="condition-temp-con-detail">{{curConditionTemp.agentsInput}}</span><span class="con-lable" v-for="item in curConditionTemp.agents">{{item}}</span><el-checkbox v-model="curConditionTemp.checkState" :disabled="true">包含已选座席下级</el-checkbox></div>
        </div>
      </div>
      <div class="sub">
        <span @click="resetSearchByCoditionTemBtn" class="rest">重新抽取</span>
        <span class="search" @click="searchByCoditionTemBtn">{{$t('public.search2')}}</span>
      </div>
      <affix :label="'查询结果'"></affix>
    </div>
    <div class="tables">
      <div class="deploy">
        <Pagination
          v-if="curQualilyType === 'qualityWebchat' && isShowTable"
          class="fr"
          :small="true"
          :currentPage="webCurPage"
          :count="count"
          @turnPage="turnPage"
          :totalPage="Math.ceil(count/pageSize)"
        >
        </Pagination>
        <Pagination
          v-if="curQualilyType !== 'qualityWebchat' && isShowTable"
          class="fr"
          :small="true"
          :currentPage="callCurPage"
          :count="count"
          @turnPage="turnPage"
          :totalPage="Math.ceil(count/pageSize)"
        >
        </Pagination>
      </div>
      <el-table v-loading="callLoading" :data="tableData" style="width: 100%" v-if="curQualilyType !== 'qualityWebchat' && isShowTable">
        <el-table-column prop="CUSTOMER_NAME" :label="$t('public.locationCustomer')" width="">
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
            <el-button @click="handle(scope2.row)" type="text" size="small">{{$t('qualityCheck.grade')}}</el-button>
            <el-button @click="replacementRecord(scope2.row)" type="text" size="small">置换</el-button>
            <br>
            <el-button type="text" @click="look(scope2.row._id)" size="small" >{{$t('qualityCheck.viewLook')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-loading="webLoading" :data="tableData" style="width: 100%" v-if="curQualilyType === 'qualityWebchat' && isShowTable">
        <el-table-column prop="sName" :label="$t('public.customerName')" width="">
        </el-table-column>
        <el-table-column prop="userName" :label="$t('public.handleAgent')" width="">
        </el-table-column>
        <el-table-column prop="beginTime" :label="$t('webchat.claimTime')" width="">
        </el-table-column>
        <el-table-column prop="toPeerName" :label="$t('public.queues')" width="">
        </el-table-column>
        <el-table-column prop="satisfaction" :label="$t('public.satisfaction')" width="">
        </el-table-column>
        <el-table-column prop="chatDuration" :label="$t('webchat.dialogueDuration')" width="">
        </el-table-column>
        <el-table-column prop="totalMsgCount" :label="$t('webchat.msgNum')" width="">
        </el-table-column>
        <el-table-column  :label="$t('public.operate')" width="">
          <template scope="scope">
            <el-button @click="handle(scope.row)" type="text" size="small">{{$t('qualityCheck.grade')}}</el-button>
            <el-button @click="replacementRecord(scope.row)" type="text" size="small">置换</el-button>
            <el-button type="text" @click="look(scope.row._id)" size="small" >{{$t('qualityCheck.viewLook')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <!-- 通话质检  评分 -->
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('qualityCheck.callQualityInfo')" v-model.trim="callDialogShow" size="tiny" class="score" @close="off" :close-on-click-modal="false">
      <call-grade :currentItemCall = "this.currentItemCall"  :currentGrade = "0"  :template = "this.template" @saveGrade="saveGrade" :qcResectLabel="qcResectLabel" @off="off" @handle="handle" :refreshCallGrade="refreshCallGrade"></call-grade>
    </el-dialog>
    <!-- 在线客服质检 评分-->
    <el-dialog  modal-append-to-body lock-scroll top="10%"  :title="$t('qualityCheck.webchatQualityInfo')" v-model.trim="webchatDialogShow" size="tiny" class="score" @close="off">
      <webchat-grade :currentItem = "this.currentItem" :currentGrade = "0" :template = "this.template" @off="off" @saveGrade="saveGrade" @handle="handle"></webchat-grade>
    </el-dialog>
    <!--添加模板组件-->
    <add-condition @addConditionTem="addConditionTem" :addCondTemData="addCondTemData"></add-condition>
  </div>
</template>
<script>
  import {deepClone} from '../../../../utils/m7Utils'
  import addCondition from '../base/addConditionTem'
  import CallGrade from './CallGrade'
  import WebchatGrade from './WebchatGrade'
  import Pagination from '../../../public-modules/card/Pagination'
  import Affix from '../../../ui-modules/affix/Affix.vue'
  export default {
    name: 'random',
    data () {
      return {
        isShowConditionQA: false,
        channelDic: [],
        queues: [],
        callLabel: [],
        agents: [],
        options: [],
        webchatDataIdList: [],    //    已经被置换过的数据的id的集合
        callDataIdList: [],       //    已经被置换过的数据的id的集合
        qualityCheckTemplates: [],
        chenkTemValue: '',   //   质检模板  value
        conditionTemValue: '',   //   条件模板  value
        conditionTempId: '',    //    条件模板  id
        qualityConditionTemplates: [],   //   质检条件模板
        qualityWebchatConditionTemplates: [],   //   质检条件模板--在线咨询
        qualityCallConditionTemplates: [],   //   质检条件模板--通话
        qualityConditionTemplatesDone: [],   //   渲染在页面的 条件模板
        curConditionTemp: {},    //  当前被选中的 条件模板对象
        curQualilyType: 'qualityWebchat',   //   质检还是通话
        webCurPage: 1,
        callCurPage: 1,
        pageSize: 10,
        webLoading: false,
        callLoading: false,
        isShowTable: false,
        resetState: false,
        addCondTemData: {    //    添加条件模板  dialog  传的数据
          isShow: false
        },
        isShowlooklog: false,    // 显示查看日志
        recordList: [],
        paginationRecord: {
          small: false,
          currentPage: 1
        },
        template: {},
        callDialogShow: false,     // 评分
        webchatDialogShow: false,     // 评分
        isSave: false,
        qcResectLabel: false,
        currentItemCall: {},   //   评分组件  用
        currentItem: {},    //   评分组件  用
        refreshCallGrade: ''
      }
    },
    components: {
      addCondition,
      Pagination,
      CallGrade,
      WebchatGrade,
      Affix
    },
    methods: {
//        添加模板 弹窗
      showAddCondTemp () {
        this.addCondTemData.isShow = true
        this.addCondTemData.curQualilyType = this.curQualilyType
      },
//      添加条件模板
      addConditionTem (addTempState) {
        if (addTempState === 'addAndSelect') {
          this.fetchData()
        } else {
          this.$store.dispatch('getCache', {type: 'qualityConditionTemplates'}).then(() => {
            this.qualityConditionTemplates = this.$store.state.session.dicMap.qualityConditionTemplates
//          在线咨询的条件模板
            this.qualityWebchatConditionTemplates = this.qualityConditionTemplates.filter(item => {
              if (item.QUALITY_TYPE && item.QUALITY_TYPE === 'qualityWebchat') {
                return item
              }
            })
//          通话的条件模板
            this.qualityCallConditionTemplates = this.qualityConditionTemplates.filter(item => {
              if (!item.QUALITY_TYPE) {
                return item
              }
            })
            if (this.curQualilyType === 'qualityWebchat') {
              this.qualityConditionTemplatesDone = this.qualityWebchatConditionTemplates
            } else {
              this.qualityConditionTemplatesDone = this.qualityCallConditionTemplates
            }
          })
        }
        this.addCondTemData.isShow = false
      },
//      删除条件模板
      delCondTemp () {
        let data = {}
        let self = this
        data.randomTemplate = this.conditionTempId
        this.$confirm('确认删除该条件模板？', this.$t('public.tip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('removeQualityCheckRandomTemplates', data).then(res => {
            if (res) {
              self.fetchData()
              self.$message({
                message: '删除模板成功',
                type: 'success'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('sms.cancelDel')
          })
        })
      },
//      从缓存获取 质检模板
      fetchData () {
        let p1 = this.$store.dispatch('getCache', {type: 'qualityCheckTemplates'})
        let p2 = this.$store.dispatch('getCache', {type: 'qualityConditionTemplates', loadFromServer: true})
        let p3 = this.$store.dispatch('getCache', {type: 'options'})
        let p4 = this.$store.dispatch('getCache', {type: 'channelDic'})
        let p5 = this.$store.dispatch('getCache', {type: 'queues'})
        let p6 = this.$store.dispatch('getCache', {type: 'callLabel'})
        let p7 = this.$store.dispatch('getCache', {type: 'agents'})
        Promise.all([p1, p2, p3, p4, p5, p6, p7]).then(() => {
          this.qualityCheckTemplates = this.$store.state.session.dicMap.qualityCheckTemplates
          this.qualityConditionTemplates = this.$store.state.session.dicMap.qualityConditionTemplates
//          在线咨询的条件模板
          this.qualityWebchatConditionTemplates = this.qualityConditionTemplates.filter(item => {
            if (item.QUALITY_TYPE && item.QUALITY_TYPE === 'qualityWebchat') {
              return item
            }
          })
//          通话的条件模板
          this.qualityCallConditionTemplates = this.qualityConditionTemplates.filter(item => {
            if (!item.QUALITY_TYPE) {
              return item
            }
          })
          this.options = this.$store.state.session.dicMap.options
          this.channelDic = this.$store.state.session.dicMap.channelDic
          this.queues = this.$store.state.session.dicMap.queues
          this.callLabel = this.$store.state.session.dicMap.callLabel
          this.agents = this.$store.state.session.dicMap.agents
          this.chenkTemValue = 0
          this.checkTemChange(0)
          this.isShowConditionQA = true
        })
      },
//      质检模板 radio change事件
      checkTemChange (index) {
        this.isShowTable = false
        this.template = this.qualityCheckTemplates[index]
        if (this.qualityCheckTemplates[index].QUALITY_TYPE === 'qualityWebchat') {
          this.curQualilyType = 'qualityWebchat'
          this.qualityConditionTemplatesDone = this.qualityWebchatConditionTemplates
        } else {
          this.curQualilyType = 'qualityCall'
          this.qualityConditionTemplatesDone = this.qualityCallConditionTemplates
        }
        if (this.qualityConditionTemplatesDone) {
          this.conditionTemValue = 0
          this.conditionTemChange(0)
        }
      },
//      条件模板  radio change 事件        ===================================
      conditionTemChange (index) {
        this.conditionTempId = this.qualityConditionTemplatesDone[index]._id
        this.curConditionTemp = {}
        let curConditionTempCall = {}
        let curCond = this.qualityConditionTemplatesDone[index]
        console.log(JSON.stringify(this.curConditionTemp))
        curConditionTempCall.TEMPLATE_NAME = curCond.TEMPLATE_NAME
        //          随机抽取数
        let randomRule = curCond[curCond.EXT_RULE]
        let label = '人均随机抽取条数'
        let randomNum = 0
        if (randomRule === 'per_num') {
          label = '人均随机抽取条数'
          randomNum = curCond.TEMPLATE_NUM
        } else if (randomRule === 'per_percent') {
          label = '人均随机抽取百分比'
          randomNum = curCond.PERCENT + '%'
        } else if (!randomRule || randomRule === 'entirety_num') {
          label = '整体随机抽取条数'
          randomNum = curCond.TEMPLATE_NUM
        } else if (randomRule === 'entirety_percent') {
          label = '整体随机抽取百分比'
          randomNum = curCond.PERCENT + '%'
        }
        curConditionTempCall.suijiLabel = label
        curConditionTempCall.suijiLabelRandomNum = randomNum
//          是否包含下级
        if (curCond.includeSubordinate) {
          curConditionTempCall.checkState = true
        } else {
          curConditionTempCall.checkState = false
        }
        if (this.curQualilyType !== 'qualityWebchat') {
//          呼叫类型
          curConditionTempCall.selectedCallTypeList = []
          curConditionTempCall.selectedCallTypeAll = ''
          if (curCond.selectedCallTypeList) {
            let callTypeArr = curCond.selectedCallTypeList.split(',')
            for (let a = 0; a < callTypeArr.length; a++) {
              if (callTypeArr[a] === 'normal') {
                curConditionTempCall.selectedCallTypeList.push('普通来电')
              } else if (callTypeArr[a] === 'dialout') {
                curConditionTempCall.selectedCallTypeList.push('外呼去电')
              } else if (callTypeArr[a] === 'transfer') {
                curConditionTempCall.selectedCallTypeList.push('来电转接')
              } else if (callTypeArr[a] === 'dialTransfer') {
                curConditionTempCall.selectedCallTypeList.push('外呼转接')
              }
            }
          } else {
            curConditionTempCall.selectedCallTypeAll = '--全部--'
          }
//          通话时长
          curConditionTempCall.CALL_TIME_LENGTH_BEGIN = curCond.query.CALL_TIME_LENGTH_BEGIN ? curCond.query.CALL_TIME_LENGTH_BEGIN : ''
          curConditionTempCall.CALL_TIME_LENGTH_END = curCond.query.CALL_TIME_LENGTH_END ? curCond.query.CALL_TIME_LENGTH_END : ''
//            呼叫时间
          curConditionTempCall.BEGIN_TIME = curCond.query.BEGIN_TIME
          curConditionTempCall.END_TIME = curCond.query.END_TIME
//          满意度
          curConditionTempCall.INVESTIGATE = ''
          let investigate = this.getinvestigate()
          if (curCond.query.INVESTIGATE) {
            let investiageNum = curCond.query.INVESTIGATE
            if (investiageNum) {
              for (let i = 0; i < investigate.options.length; i++) {
                let invData = investigate.options[i]
                for (let j = 0; j < invData.options.length; j++) {
                  if (invData.options[j].name === investiageNum) {
                    curConditionTempCall.INVESTIGATE = invData.name
                  }
                }
              }
            }
          }
//          技能组
          curConditionTempCall.myqueue = []
          curConditionTempCall.ERROR_MEMO = ''
          if (curCond.selectedQueueList) {
            let queues = this.queues
            let queueArr = curCond.selectedQueueList.split(',')
            for (let i = 0; i < queues.length; i++) {
              for (let a = 0; a < queueArr.length; a++) {
                if (queues[i].Exten === queueArr[a]) {
                  curConditionTempCall.myqueue.push(queues[i].DisplayName)
                }
              }
            }
            for (let i = 0; i < queues.length; i++) {
              if (queues[i].Exten === curCond.query.ERROR_MEMO) {
                curConditionTempCall.ERROR_MEMO = queues[i].DisplayName
              }
            }
          } else {
            curConditionTempCall.myqueue.push('全部')
          }
//          录音标签
          curConditionTempCall.qaLableOne = ''
          curConditionTempCall.qaLableTwo = ''
          curConditionTempCall.qaLableThree = ''
          let callLabel = this.callLabel
          if (curCond.query.singleLabel) {
            for (let i in callLabel) {
              if (callLabel[i]._id === curCond.query.singleLabel) {
                curConditionTempCall.qaLableOne = callLabel[i].name
              }
            }
          } else if (curCond.query.multiFirst) {
            for (let i in callLabel) {
              let first = callLabel[i]
              if (callLabel[i]._id === curCond.query.multiFirst) {
                curConditionTempCall.qaLableOne = first.name
                for (let f in first.child) {
                  let two = first.child[f]
                  if (two._id === curCond.query.multiTwo) {
                    curConditionTempCall.qaLableTwo = two.name
                    for (let h in two.child) {
                      let three = two.child[h]
                      if (three._id === curCond.query.multiThree) {
                        curConditionTempCall.qaLableThree = three.name
                      }
                    }
                  }
                }
              }
            }
          }
//          通话座席
          let disposalAgent = curCond.query.DISPOSAL_AGENT
          curConditionTempCall.agents = []
          curConditionTempCall.agentsInput = ''
          if (!randomRule && disposalAgent) {
            let agents = this.agents
            if (typeof disposalAgent === 'object') {
              for (let i = 0; i < agents.length; i++) {
                for (let a = 0; a < disposalAgent.length; a++) {
                  if (agents[i]._id === disposalAgent[a]) {
                    curConditionTempCall.agents.push(agents[i].displayName)
                  }
                }
              }
            } else {
              for (let i = 0; i < agents.length; i++) {
                if (agents[i]._id === disposalAgent) {
                  curConditionTempCall.agents.push(agents[i].displayName)
                }
              }
            }
          } else if (curCond.selectedAgentList && curCond.selectedAgentList !== '') {
            let agents = this.agents
            let disposalAgentArr = curCond.selectedAgentList.split(',')
            for (let i = 0; i < agents.length; i++) {
              for (let a = 0; a < disposalAgentArr.length; a++) {
                if (agents[i]._id === disposalAgentArr[a]) {
                  curConditionTempCall.agents.push(agents[i].displayName)
                }
              }
            }
          } else {
            curConditionTempCall.agentsInput = '--全部--'
          }
        }
        if (this.curQualilyType === 'qualityWebchat') {
//          领取时间
          curConditionTempCall.beginTimeBegin = curCond.query.beginTimeBegin ? curCond.query.beginTimeBegin : ''
          curConditionTempCall.beginTimeEnd = curCond.query.beginTimeEnd ? curCond.query.beginTimeEnd : ''
//          座席
          curConditionTempCall.agents = []
          if (curCond.selectedAgentList && curCond.selectedAgentList !== '') {
            let agents = this.agents
            let disposalAgentArr = curCond.selectedAgentList.split(',')
            for (let i = 0; i < agents.length; i++) {
              for (let a = 0; a < disposalAgentArr.length; a++) {
                if (agents[i]._id === disposalAgentArr[a]) {
                  curConditionTempCall.agents.push(agents[i].displayName)
                }
              }
            }
          } else {
            curConditionTempCall.agentsInput = '--全部--'
          }
//          满意度
          curConditionTempCall.satisfaction = ''
          let appraiseKey = curCond.query.appraiseKey ? curCond.query.appraiseKey : ''
          if (appraiseKey === '') {
            curConditionTempCall.satisfaction = ''
          } else {
            let wechatCSR = this.getChannelDic('webchatCSR')
            for (let i = 0; i < wechatCSR.length; i++) {
              if (wechatCSR[i].key === curCond.query.appraiseKey) {
                curConditionTempCall.satisfaction = wechatCSR[i].name
              }
            }
          }
//          结束会话类型
          curConditionTempCall.finishKeys = ''
          let dicsFinish = this.getChannelDic('webchat')
          let finishKeys = []
          for (let i = 0; i < dicsFinish.length; i++) {
            finishKeys.push(dicsFinish[i])
            let level2 = deepClone(dicsFinish[i].options)
            if (level2) {
              for (let m = 0; m < level2.length; m++) {
                level2[m].name = dicsFinish[i].name + '->' + level2[m].name
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
          finishKeys.push({key: 'add_black', name: '加入黑名单'})
          for (let i = 0; i < finishKeys.length; i++) {
            if (finishKeys[i]['key'] === curCond.query.finishKey) {
              curConditionTempCall.finishKeys = finishKeys[i]['name']
            }
          }
//          消息条数
          curConditionTempCall.msgCountType = curCond.query.msgCountType
          curConditionTempCall.msgCount = curCond.query.msgCount
        }
        this.curConditionTemp = deepClone(curConditionTempCall)
//        条件模板change  查询数据====================================================
        this.searchByCoditionTemBtn()
      },
//      通话  满意度  匹配  条件模板详细信息展示时用到此方法
      getinvestigate () {
        let options = this.options
        for (let i = 0; i < options.length; i++) {
          if (options[i].name === '满意度调查选项') {
            return options[i]
          }
        }
      },
//      在线咨询  满意度  匹配  条件模板详细信息展示时用到此方法
      getChannelDic (type) {
        let dicss = this.channelDic
        let dics = []
        for (let i = 0; i < dicss.length; i++) {
          let obj = dicss[i]
          if (obj.type === type) {
            dics = obj.options || []
            break
          }
        }
        return dics
      },
//      =======================================================
//      查询 核心
      searchByCoditionTem () {
        let data = {}
        this.webLoading = true
        this.callLoading = true
        data.pageSize = this.pageSize
//        如果是 重新抽取功能触发 则加字段 reset
        if (this.resetState) {
          data.reset = true
        }
        if (this.curQualilyType === 'qualityWebchat') {
          data.page = this.webCurPage
          data.menuId = 'quality_check_query_random'
          data.templateId = this.conditionTempId
          this.$store.dispatch('webchatSearch', data).then((res) => {
            this.webLoading = false
            this.isShowTable = true
          })
        } else {
          data.page = this.callCurPage
          data.cdrId = 'quality_check_query_random'
          data.randomTemplate = this.conditionTempId
          this.$store.dispatch('normalCallSearch', data).then((res) => {
            this.callLoading = false
            this.isShowTable = true
          })
        }
      },
//      查询按钮
      searchByCoditionTemBtn () {
        if (this.curQualilyType === 'qualityWebchat') {
          this.webCurPage = 1
        } else {
          this.callCurPage = 1
        }
        this.searchByCoditionTem()
      },
//      重新抽取
      resetSearchByCoditionTemBtn () {
        this.resetState = true
        this.searchByCoditionTemBtn()
        this.resetState = false
      },
//      翻页查询
      turnPage (pageNum) {
        if (this.curQualilyType === 'qualityWebchat') {
          this.webCurPage = pageNum
        } else {
          this.callCurPage = pageNum
        }
        this.searchByCoditionTem()
      },
//      查看日志
      look (_id) {
        this.paginationRecord.currentPage = 1
        this.countRecord = 0
        this.totalPageRecord = 0
        if (this.curQualilyType === 'qualityWebchat') {
          this.queryRecordWebchatSessionLog(_id, 1)
        } else {
          this.queryRecordCallListenLog(_id, 1)
        }
      },
      turnPageRecord (pageNum) {
        if (this.curQualilyType === 'qualityWebchat') {
          this.queryRecordWebchatSessionLog(this.currentId, pageNum)
        } else {
          this.queryRecordCallListenLog(this.currentId, pageNum)
        }
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
          this.isShowlooklog = true
        })
      },
      queryRecordWebchatSessionLog (_id, page) {
        this.currentId = _id
        this.title = this.$t('qualityCheck.onlineWebchatLog')
        this.listenpp = this.$t('qualityCheck.checkPeople')
        this.listenTime = this.$t('qualityCheck.checkTime1')
        this.$store.dispatch('queryRecordWebchatSessionLog', {'sessionId': _id, 'page': page, 'pageSize': 10}).then(() => {
          this.recordList = this.$store.state.qualityCheck.recordList.list
          this.countRecord = this.$store.state.qualityCheck.recordList.count
          this.totalPageRecord = Math.ceil(this.$store.state.qualityCheck.recordList.count / 10) || 0
          this.isShowlooklog = true
        })
      },
//      置换
      replacementRecord (value) {
        if (this.curQualilyType === 'qualityWebchat') {
          let data = {}
          data.user = value.user
          data.randomTemplateId = this.conditionTempId
          data.sessionId = value._id
          data.idList = this.webchatDataIdList
          this.$store.dispatch('displacesTmpWebchatSession', data).then(res => {
            if (!res.success) {
              this.$message.error('置换数据失败！')
              return false
            } else {
              this.webchatDataIdList = res.idList
              if (res.selectedId) {
                this.webchatDataIdList.push(res.selectedId)
              } else {
                this.$message.error('此座席无更多通话记录！')
              }
              this.$message({
                message: '置换数据成功',
                type: 'success'
              })
              this.searchByCoditionTemBtn()
            }
          })
        } else {
          let data = {}
          data.callId = value.CALL_SHEET_ID
          data.randomTemplate = this.conditionTempId
          data.idList = this.callDataIdList
          this.$store.dispatch('queryAllConditionData', data).then(res => {
            if (!res.success) {
              this.$message.error('置换数据失败！')
              return false
            } else {
              this.callDataIdList = res.idList
              if (res.selectedId) {
                this.callDataIdList.push(res.selectedId)
              } else {
                this.$message.error('此座席无更多通话记录！')
              }
              this.$message({
                message: '置换数据成功',
                type: 'success'
              })
              this.searchByCoditionTemBtn()
            }
          })
        }
      },
//      评分
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
          this.searchByCoditionTemBtn()
        }
      },
      getMoreQualityCheckCallSheet () {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          let form = {}
          form.menuId = 'quality_check_query'
          form.templateId = this.conditionTempId
          form.pageSize = 10
          this.$store.dispatch('getMoreQualityCheckCallSheet', {data: form, tempList: this.tempList, type: 'webchat'})
        } else {
          let form = {}
          form.cdrId = 'quality_check_query'
          form.randomTemplate = this.conditionTempId
          form.pageSize = 10
          this.$store.dispatch('getMoreQualityCheckCallSheet', {data: form, tempList: this.tempList, type: 'call'})
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
    .wd100
      width 100px
      text-align right
      display inline-block
    .top
      .term
        margin-top 20px
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
            width 390px
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
              margin-left 6px
            .wd60
              width 60px
          .condition-temp-con-first-line
            width 280px
          .condition-temp-con-last-line
            width 600px
            .el-checkbox
              margin-left 20px
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
    .ui-affix
      margin-top 20px
      padding-bottom 0
    .looklog
      .search-pagination
        float right
        height 48px
        .page
          margin-top 10px
          .el-pagination
            padding 0
</style>
