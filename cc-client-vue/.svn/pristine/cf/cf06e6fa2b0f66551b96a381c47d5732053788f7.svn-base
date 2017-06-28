<template>
  <div class="agent">
    <div v-show = "agentName == true">
      <div class="top">
        <affix :label="$t('report.agentWorkLoSea')"></affix>
        <div class="search">
          <template>
            <date-time type="other_half_hour" :query="query"></date-time>
          </template>
          <div class="skill">
            <span class="ski">{{$t('public.agent')}} :</span>
              <el-select v-model="query.selectedAgentList"
                multiple
                filterable
                size="small"
                :placeholder="$t('report.pleChoseAgent')">
                <el-option
                  v-for="item in agents"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-checkbox v-model.trim="query.includeSubordinate">{{$t('report.includeSubordinate')}}</el-checkbox>
            </div>
          <span class="inquiry fr find" @click.stop='search'>{{$t('public.search2')}}</span>
          <div class="clear"></div>
        </div>
        <affix :label="$t('report.agentWorkLoRe')"></affix>
        <div class="export">
          <span class="inquiry fr"　v-on:click.stop="exportExcel">{{$t('report.exportXls')}}</span>
          <span class="inquiry fr pdf" v-on:click.stop="exportPdf">{{$t('report.exportPDF')}}</span>
        </div>
      </div>
      <div :id="id">
        <el-row class="ichars">
          <highcharts :options="options24out"></highcharts>
        </el-row>
        <div class="tab">
          <div class="deploy">
            <span class="set"><i class="iconfont icon-peizhi"></i></span>
            <span class="tex" @click.stop="config">{{$t('report.setHeaderConfig')}}</span>
            <span class="tip"><i class="iconfont icon-tixingweizhi"></i></span>
            <el-tooltip class="item" effect="dark" placement="right" popper-class="reportTip">
              <div slot="content">
                {{$t('report.employeeRate')}}<br>
                {{$t('report.systemBusy')}}
              </div>
              <el-button>{{$t('report.description')}}</el-button>
            </el-tooltip>
          </div>
          <report-table :data="serveNumData" @agentName = "searchName" :sum="sum" :config="Config"> </report-table>
        </div>
      </div>
      <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('report.reportExportHelp')" v-model="dialogVisible" size="tiny">
        <span>{{$t('report.reportExportTipTitle')}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
          <el-button type="primary" @click="confirm">{{$t('public.confirm')}}</el-button>
        </span>
      </el-dialog>
      <header-option v-if="isShow" :show="isShow" :option="headOptionsShow" type="call_report_agent" v-on:close="close"></header-option>
    </div>
    <queryAgentTime v-if="agentName == false" @flag = "show" :cityName = "{queryOne, AgentID, name}"></queryAgentTime>
  </div>
</template>
<script>
  import dateTime from '../base/dateDrill.vue'
  import affix from '../../../ui-modules/affix/Affix.vue'
  import {exportReportPdf, checkTime, searchTime, colorConfigArr} from '../../../../utils/reportUtils.js'
  import {deepClone, getCallTimeLength} from '../../../../utils/m7Utils.js'
  import reportTable from '../base/drillInto.vue'
  import headerOption from '../base/headerOption.vue'
  import queryAgentTime from './QueryAgentTime.vue'
  export default {
    name: 'callReportAgent',
    data () {
      return {
        name: '',
        queryOne: {},
        AgentID: '',
        agentName: true,
        query: {
          selectedAgentList: [],
          includeSubordinate: false
        },
        isShow: false,
        dialogVisible: false,
        headOptions: {},
        headOptionsShow: {},
        agents: [],
        id: 'call_report_agent',
        serveNumData: [],
        sum: [],
        options24out: {
          chart: {
            type: 'column',
            animation: false
          },
          colors: colorConfigArr,
          xAxis: {
            categories: []
          },
          yAxis: {
            gridLineColor: '#e6e6e6',
            allowDecimals: false,
            title: {
              text: ''
            }
          },
          title: {
            text: '座席工作量对比'
          },
          legend: {
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 20
          },
          tooltip: {
            formatter: function () {
              var s = '<span style="font-size:10px">' + this.x + '</span><table>'
              let self = this
              self.points.forEach(function (item) {
                var unit = ''
                if (item.series.name.slice(-2) === '时长') {
                  unit = 's'
                } else if (item.series.name.slice(-1) === '率') {
                  unit = '%'
                }
                s += '<tr><td style="color:' + item.series.color + ';padding:0">' + item.series.name + ': </td><td style="padding:0"><b>' + item.y + '' + unit + '</b></td></tr>'
              })
              s += '</table>'
              return s
            },
            shared: true,
            useHTML: true
          },
          plotOptions: {
          },
          credits: {enabled: false},
          series: []
        }
      }
    },
    computed: {
      Config () {
        let phonebarEnable = ''
        if (!this.headOptions.Config || this.headOptions.Config.length === 0) {
          return []
        }
        let headerConfig = deepClone(this.headOptions.Config)
        for (let i = 0; i < headerConfig.length; i++) {
          if (headerConfig[i].name === 'ShowPhoneBarStatus' && headerConfig[i].show === true) {
            phonebarEnable = true
            headerConfig = headerConfig.slice(0, i).concat(headerConfig.slice(i + 1, headerConfig.length))
          }
        }
        if (phonebarEnable === true) {
          let dataCti = {
            PBX: this.$store.state.session.user.pbx,
            Account: this.$store.state.session.user.account,
            IsEnable: '1'
          }
          this.$store.dispatch('queryAgentReportCti', dataCti).then(() => {
            let phonebarRes = deepClone(this.$store.state.report.call.queryAgentReportCti)
            if (phonebarRes.success) {
              for (let m = 0; m < phonebarRes.list.length; m++) {
                if (phonebarRes.list[m].PhoneBarItemName !== '空闲') {
                  if (phonebarRes.list[m].PhoneBarItemName === '忙碌') {
                    let phoneConfig = {
                      name: 'BUSY_TIME_LENGTH',
                      displayname: phonebarRes.list[m].PhoneBarItemName + '总时长',
                      show: true,
                      order: 15 + m
                    }
                    headerConfig.push(phoneConfig)
                  } else {
                    let phoneConfig = {
                      name: 'STATE' + phonebarRes.list[m].PhoneBarItemId + '_TIME_LENGTH',
                      displayname: phonebarRes.list[m].PhoneBarItemName + '总时长',
                      show: true,
                      order: 15 + m
                    }
                    headerConfig.push(phoneConfig)
                  }
                }
              }
              this.headOptions.Config = headerConfig
            }
          })
        }
        return headerConfig
      }
    },
    methods: {
      show () {
        this.agentName = true
      },
      searchName (id, name) {
        this.queryOne.AgentID = id
        this.name = name
        this.AgentID = id
        let myQuery = deepClone(this.query)
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
        myQuery.reportType = 'call_report_agent'
        myQuery.AgentID = ''
        this.queryOne = deepClone(myQuery)
        this.agentName = false
      },
      search () {
        let data = {reportType: 'call_report_agent'}
        let myQuery = deepClone(this.query)
        if (myQuery.timeType === 'other_half_hour') {
          let message = checkTime(myQuery.StartTime, myQuery.EndTime, false, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
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
        myQuery.reportType = 'call_report_agent'
        myQuery.AgentID = ''
        delete myQuery.normalEndTime
        delete myQuery.normalStartTime
        data = myQuery
        if (data.TimeType === 'other_half_hour') {
          delete data.yearReport
          delete data.monthReport
          delete data.dayReport
        }
        this.$store.dispatch('queryCallAgentReport', data).then(() => {
          this.headOptions = deepClone(this.$store.state.report.call.agentReport.tableHeader)
          this.sum = [{agent_name: '合计'}]
          let resData = deepClone(this.$store.state.report.call.agentReport.data)
          for (let i in resData) {
            let item = resData[i]
            if (myQuery.TimeType === 'year') {
              item.ReportTime = item.MonthID
              delete item.MonthID
            } else if (myQuery.TimeType === 'month') {
              item.ReportTime = item.DayID
              delete item.DayID
            }
            for (let j in item) {
              if (this.sum[0][j] === undefined) {
                this.sum[0][j] = 0
              }
              if (j !== 'agent_name') {
                this.sum[0][j] += item[j]
              }
            }
            for (let index in this.$store.state.report.call.agentReport.agents) {
              let agent = this.$store.state.report.call.agentReport.agents[index]
              if (agent._id === item.AgentID) {
                item.agent_name = agent.displayName + '(' + agent.exten + ')'
              }
            }
            item.LOGIN_TIME_LENGTH = getCallTimeLength(item.LOGIN_TIME_LENGTH)
            item.CallInTimeLength = getCallTimeLength(item.CallInTimeLength)
            item.CallInAverageTimeLength = getCallTimeLength(item.CallInAverageTimeLength)
            item.CallOutTimeLength = getCallTimeLength(item.CallOutTimeLength)
            item.CallOutAverageTimeLength = getCallTimeLength(item.CallOutAverageTimeLength)
            item.BUSY_TIME_LENGTH = getCallTimeLength(item.BUSY_TIME_LENGTH)
            item.STATE99_TIME_LENGTH = getCallTimeLength(item.STATE99_TIME_LENGTH)
            item.STATE3_TIME_LENGTH = getCallTimeLength(item.STATE3_TIME_LENGTH)
            item.STATE2_TIME_LENGTH = getCallTimeLength(item.STATE2_TIME_LENGTH)
            item.STATE4_TIME_LENGTH = getCallTimeLength(item.STATE4_TIME_LENGTH)
          }
          let Dividend = this.sum[0].CallInAccessCount
          let Divisor = this.sum[0].CallInAcceptCount
          if (Dividend > 0 && Divisor >= 0) {
            this.sum[0].CallInAcceptRate = Math.round((this.sum[0].CallInAcceptCount / Dividend) * 100) + '%'
          } else if (Dividend === 0 || Divisor === 0) {
            this.sum[0].CallInAcceptRate = '0%'
          } else {
            this.sum[0].CallInAcceptRate = ''
          }
          if (this.sum[0].LOGIN_TIME_LENGTH === 0 || (this.sum[0].CallInAcceptCount + this.sum[0].CallOutAcceptCount) === 0) {
            this.sum[0].AgentUtilization = '0%'
          } else {
            var molecular = this.sum[0].CallInTimeLength + this.sum[0].CallOutTimeLength
            if (this.sum[0].STATE99_TIME_LENGTH) {
              molecular = molecular + this.sum[0].STATE99_TIME_LENGTH
            }
            var denominator = this.sum[0].LOGIN_TIME_LENGTH
            for (var k = 2; k < 10; k++) {
              if (this.sum[0]['STATE' + k + '_TIME_LENGTH']) {
                denominator = denominator - this.sum[0]['STATE' + k + '_TIME_LENGTH']
              }
            }
            this.sum[0].AgentUtilization = Math.floor(molecular / denominator * 100) + '%'
          }
          if (this.sum[0].CallInAcceptRate === '') {
            this.sum[0].AgentUtilization = ''
          }
          this.sum[0].CallTimeLength = getCallTimeLength(this.sum[0].CallTimeLength)
          this.serveNumData = resData
          let series4high = {}
          this.options24out.xAxis.categories = []
          let highData = deepClone(this.$store.state.report.call.agentReport.data)
          for (let i in highData) {
            let item = highData[i]
            let agentXAxis
            for (let index in this.$store.state.report.call.agentReport.agents) {
              let agent = this.$store.state.report.call.agentReport.agents[index]
              if (agent._id === item.AgentID) {
                agentXAxis = agent.displayName + '(' + agent.exten + ')'
              }
            }
            this.options24out.xAxis.categories.push(agentXAxis)
            for (let j in item) {
              if (series4high[j] === undefined) {
                series4high[j] = []
              }
              if (['LOGIN_TIME_LENGTH', 'CallInAverageTimeLength', 'CallInTimeLength', 'CallOutAverageTimeLength', 'CallOutTimeLength'].indexOf(j) >= 0) {
                series4high[j].push(item[j])
              } else {
                delete series4high[j]
              }
            }
          }
          this.sum[0].LOGIN_TIME_LENGTH = getCallTimeLength(this.sum[0].LOGIN_TIME_LENGTH)
          this.sum[0].CallInTimeLength = getCallTimeLength(this.sum[0].CallInTimeLength)
          this.sum[0].CallInAverageTimeLength = getCallTimeLength(this.sum[0].CallInAverageTimeLength)
          this.sum[0].CallOutTimeLength = getCallTimeLength(this.sum[0].CallOutTimeLength)
          this.sum[0].CallOutAverageTimeLength = getCallTimeLength(this.sum[0].CallOutAverageTimeLength)
          this.sum[0].BUSY_TIME_LENGTH = getCallTimeLength(this.sum[0].BUSY_TIME_LENGTH)
          this.sum[0].STATE99_TIME_LENGTH = getCallTimeLength(this.sum[0].STATE99_TIME_LENGTH)
          this.sum[0].STATE3_TIME_LENGTH = getCallTimeLength(this.sum[0].STATE3_TIME_LENGTH)
          this.sum[0].STATE2_TIME_LENGTH = getCallTimeLength(this.sum[0].STATE2_TIME_LENGTH)
          this.sum[0].STATE4_TIME_LENGTH = getCallTimeLength(this.sum[0].STATE4_TIME_LENGTH)
          if (this.sum[0].CallInAcceptRate === '') {
            this.sum[0].LOGIN_TIME_LENGTH = ''
            this.sum[0].CallInTimeLength = ''
            this.sum[0].CallInAverageTimeLength = ''
            this.sum[0].CallOutTimeLength = ''
            this.sum[0].CallOutAverageTimeLength = ''
          }
          this.options24out.series = []
          for (let i in this.headOptions.Config) {
            let item = this.headOptions.Config[i]
            if (['LOGIN_TIME_LENGTH', 'CallInAverageTimeLength', 'CallInTimeLength', 'CallOutAverageTimeLength', 'CallOutTimeLength'].indexOf(item.name) >= 0) {
              this.options24out.series.push({
                name: item.displayname,
                data: series4high[item.name]
              })
            }
          }
        })
      },
      config () {
        this.$store.dispatch('getReportTableHeader', 'call_report_agent').then((res) => {
          this.headOptionsShow = res
          this.isShow = !this.isShow
        })
      },
      close (data) {
        this.isShow = false
        if (data === 'save') {
          this.search()
        }
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
        myQuery.accountId = this.$store.state.session.user.account
        myQuery.type = 'agentExport'
        myQuery.userType = this.$store.state.session.user.type
        myQuery.dataDB = this.$store.state.session.account.dataDB
        myQuery.selectedAgentList = myQuery.selectedAgentList.join(',')
        myQuery.user = this.$store.state.session.user._id
        myQuery.reportType = 'call_report_agent'
        myQuery.pbx = this.$store.state.session.user.pbx
        myQuery.type = this.$store.state.session.user.type
        if (myQuery.reportType === 'call_report_agent') {
          myQuery.AgentID = ''
        }
        let data = {
          Method: 'exportAgent',
          Query: myQuery
        }
        if (data.TimeType === 'other_half_hour') {
          delete data.yearReport
          delete data.monthReport
          delete data.dayReport
        }
        this.$store.dispatch('exportCallAgentReport', data).then(() => {
        })
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '通话座席工作量报表' + searchTime(this.query), id: this.id})
      }
    },
    components: {
      affix,
      dateTime,
      reportTable,
      headerOption,
      queryAgentTime
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'agents' }).then(agents => {
        this.agents = agents.map(agent => ({ label: `${agent.displayName}[${agent.exten}]`, value: agent._id }))
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .agent
    .el-select
      display inline-block
      margin-right 16px
      .sear
        margin-left 0
        margin-top 16px
    .skill
      margin 20px 0px 0px 18px
      .ski
        margin-right 22px
    .el-col-1
      height 36px
      line-height 36px
    .tab
      .el-table .cell
      .el-table th>div
        padding 18px 4px
        .tex
        .te
          cursor pointer
        .set
          margin-right 10px
          position relative
          top 2px
          .icon-tixingweizhi
            font-size 10px
</style>
