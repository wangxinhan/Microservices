<template>
  <div class="survey">
    <div class="top">
      <affix :label="$t('report.callReportApproveSurveySearch')"></affix>
      <div class="search">
        <template>
          <date-time type="other_half_hour" :query="query"></date-time>
        </template>
        <div class="skill">
          <span class="ski">{{$t('call.callType')}} : </span>
          <el-select size="small"
            v-model.trim="value"
            :placeholder="$t('webchat.webchatAll')">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="skill">
          <span class="ski ski1">{{$t('public.agent')}} :</span>
          <el-select size="small"
            v-model.trim="query.selectedAgentList"
            multiple
            filterable
            allow-create
            :placeholder="$t('report.pleChoseAgent')">
            <el-option
              v-for="item in agents"
              :label="item.displayName"
              :value="item._id">
            </el-option>
          </el-select>
        </div>
          <span class="inquiry fr find" @click='search'>{{$t('public.search2')}}</span>
          <div class="clear"></div>
      </div>
        <affix :label="$t('report.callReportApproveSurvey')"></affix>
       <div class="export">
        <span class="inquiry fr" v-on:click="exportExcel">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" v-on:click="exportPdf">{{$t('report.exportPDF')}}</span>
      </div>
    </div>
    <div class="tab" :id = "id">
      <report-table :data="serveNumData" :sum="sum" :config="headOptions.Config"> </report-table>
    </div>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('report.reportExportHelp')" v-model="dialogVisible" size="tiny">
      <span>{{$t('report.reportExportTipTitle')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('public.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import affix from '../../../ui-modules/affix/Affix.vue'
  import dateTime from '../base/datetime.vue'
  import {exportReportPdf, checkTime, searchTime} from '../../../../utils/reportUtils.js'
  import {getCache, deepClone} from '../../../../utils/m7Utils.js'
  import reportTable from '../base/reportTable.vue'
  export default {
    name: 'survey',
    data () {
      return {
        id: 'call_report_approve_survey',
        query: {
          selectedAgentList: []
        },
        value1: '',
        agents: [],
        value: '',
        dialogVisible: false,
        options: [
          {label: this.$t('public.callIn'), value: 'normal'},
          {label: this.$t('softPhoneBar.callout'), value: 'dialout'},
          {label: this.$t('webchat.webchatAll'), value: ''}
        ],
        options1: [],
        sum: [],
        headOptions: {},
        serveNumData: [],
        serveData: []
      }
    },
    methods: {
      search (init) {
        let data = {reportType: 'call_report_approve_survey'}
        let myQuery = deepClone(this.query)
        if (myQuery.timeType === 'other_half_hour') {
          let message = checkTime(myQuery.StartTime, myQuery.EndTime, false, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        if (init !== 'true') {
          let callType = this.value
          myQuery.callType = callType
          myQuery.TimeType = myQuery.timeType
          delete myQuery.timeType
          myQuery.yearReport += ''
          if (typeof myQuery.monthReport === 'number') {
            if (myQuery.monthReport < 10) {
              myQuery.monthReport = '0' + myQuery.monthReport
            } else {
              myQuery.monthReport = '' + myQuery.monthReport
            }
          }
          if (typeof myQuery.dayReport === 'number') {
            if (myQuery.dayReport < 10) {
              myQuery.dayReport = '0' + myQuery.dayReport
            } else {
              myQuery.dayReport = '' + myQuery.dayReport
            }
          }
          myQuery.selectedAgentList = myQuery.selectedAgentList.join(',')
          myQuery.reportType = 'call_report_approve_survey'
          myQuery.AgentID = ''
          data = myQuery
          if (data.TimeType === 'other_half_hour') {
            delete data.yearReport
            delete data.monthReport
            delete data.dayReport
          }
          if (data.TimeType === 'year') {
            delete data.monthReport
            delete data.dayReport
          }
        }
        this.$store.dispatch('queryCallApproveSurveyReport', data).then(() => {
          this.headOptions = this.$store.state.report.call.approveSurveyReport.tableHeader
          this.sum = [{agent_name: '合计'}]
          let agentReportData = deepClone(this.$store.state.report.call.approveSurveyReport.agentReportData)
          let resData = deepClone(this.$store.state.report.call.approveSurveyReport.data)
          for (var k in agentReportData) {
            let flag = agentReportData[k]
            for (var m in resData) {
              let resFlag = resData[m]
              if (flag.AgentID === resFlag.AgentID) {
                resFlag.CallInAcceptCount = flag.CallInAcceptCount
                resFlag.CallOutAcceptCount = flag.CallOutAcceptCount
              }
            }
          }
          let headConfig = this.headOptions.Config
          for (var f in headConfig) {
            if (data.callType === 'normal') {
              if (headConfig[f].name === 'approveSurveyOutRate' || headConfig[f].name === 'approveSurveyRate' || headConfig[f].name === 'CallOutAcceptCount') {
                this.headOptions.Config[f].show = false
              }
            } else if (data.callType === 'dialout') {
              if (headConfig[f].name === 'approveSurveyInRate' || headConfig[f].name === 'approveSurveyRate' || headConfig[f].name === 'CallInAcceptCount') {
                this.headOptions.Config[f].show = false
              }
            } else if (data === 'call_report_approve_survey' || headConfig[f].name === '') {
              if (headConfig[f].name === 'approveSurveyInRate' || headConfig[f].name === 'approveSurveyOutRate') {
                this.headOptions.Config[f].show = false
              }
            }
          }
          for (var i in resData) {
            let item = resData[i]
            if (myQuery.TimeType === 'year') {
              item.ReportTime = item.MonthID
              delete item.MonthID
            } else if (myQuery.TimeType === 'month') {
              item.ReportTime = item.DayID
              delete item.DayID
            }
            let countNum = (item.CallOutAcceptCount || 0) + (item.CallInAcceptCount || 0)
            if (countNum > 0 && item.approveSurveyCount > 0) {
              item.approveSurveyRate = Math.round((item.approveSurveyCount / countNum) * 100) + '%'
            } else {
              item.approveSurveyRate = '0%'
            }
            for (var j in item) {
              if (this.sum[0][j] === undefined) {
                this.sum[0][j] = 0
              }
              if (j !== 'agent_name') {
                this.sum[0][j] += item[j]
              }
              if (j.substr(0, j.length - 1) === 'approveSurvey') {
                if (item.approveSurveyCount === 0) {
                  item[j] = item[j] + '(' + Math.round(item[j] / 1 * 100) + '%' + ')'
                } else {
                  item[j] = item.approveSurveyCount ? item[j] + '(' + Math.round(item[j] / item.approveSurveyCount * 100) + '%' + ')' : '0%'
                }
              }
            }
            let agents = this.$store.state.session.dicMap.agents
            for (let index in agents) {
              let agent = agents[index]
              if (agent._id === item.AgentID) {
                item.agent_name = agent.displayName + '(' + agent.exten + ')'
              }
            }
          }
          let sumCountNum = this.sum[0].CallOutAcceptCount + this.sum[0].CallInAcceptCount
          if (sumCountNum > 0 && this.sum[0].approveSurveyCount > 0) {
            this.sum[0].approveSurveyRate = Math.round((this.sum[0].approveSurveyCount / sumCountNum) * 100) + '%'
          } else {
            this.sum[0].approveSurveyRate = '0%'
          }

          for (var y in this.sum[0]) {
            if (y.substr(0, y.length - 1) === 'approveSurvey') {
              if (this.sum[0].approveSurveyCount === 0) {
                this.sum[0][y] = this.sum[0][y] + '(' + Math.round(this.sum[0][y] / 1 * 100) + '%' + ')'
              } else {
                this.sum[0][y] = this.sum[0].approveSurveyCount ? this.sum[0][y] + '(' + Math.round(this.sum[0][y] / this.sum[0].approveSurveyCount * 100) + '%' + ')' : this.sum[0][y] + '(0%)'
              }
            }
          }
          this.serveNumData = resData
        })
      },
      close () {
        this.isShow = false
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '通话座席满意度调查报表' + searchTime(this.query), id: this.id})
      },
      exportExcel () {
        let myQuery = deepClone(this.query)
        if (myQuery.timeType === 'other_half_hour') {
          let message = checkTime(myQuery.StartTime, myQuery.EndTime, false, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        let callType = this.value
        myQuery.callType = callType
        myQuery.TimeType = myQuery.timeType
        delete myQuery.timeType
        myQuery.yearReport += ''
        if (typeof myQuery.monthReport === 'number') {
          if (myQuery.monthReport < 10) {
            myQuery.monthReport = '0' + myQuery.monthReport
          } else {
            myQuery.monthReport = '' + myQuery.monthReport
          }
        }
        if (typeof myQuery.dayReport === 'number') {
          if (myQuery.dayReport < 10) {
            myQuery.dayReport = '0' + myQuery.dayReport
          } else {
            myQuery.dayReport = '' + myQuery.dayReport
          }
        }
        myQuery.selectedAgentList = myQuery.selectedAgentList.join(',')
        myQuery.accountId = this.$store.state.session.user.account
        myQuery.userType = this.$store.state.session.user.type
        myQuery.user = this.$store.state.session.user._id
        myQuery.type = 'ReportApproveSurveyExport'
        myQuery.reportType = 'call_report_approve_survey'
        myQuery.AgentID = ''
        if (myQuery.TimeType === 'other_half_hour') {
          delete myQuery.yearReport
          delete myQuery.monthReport
          delete myQuery.dayReport
        }
        if (myQuery.TimeType === 'year') {
          delete myQuery.monthReport
          delete myQuery.dayReport
        }
        let data = {
          Method: 'exportApproveSurveyReport',
          Query: myQuery
        }
        this.$store.dispatch('exportCallApproveSurveyReport', data).then(() => {
        })
      },
      exportPdf () {
        this.dialogVisible = true
      }
    },
    components: {
      affix,
      dateTime,
      reportTable
    },
    beforeMount () {
      this.$store.dispatch('getCache', {type: 'agents'}).then(() => {
        this.agents = getCache('agents')
        this.search('true')
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .survey
    .el-select
      display inline-block
    .top
      .el-row
        margin-left 10px
      .sear
        margin-left 0
      .skill
        margin 16px 0 0 18px
        .el-col
        .el-col-2
          width 80px
        .ski
          display inline-block
          text-align right
        .ski1
          margin-right 24px
    .el-col-1
      height 36px
      line-height 36px
</style>
