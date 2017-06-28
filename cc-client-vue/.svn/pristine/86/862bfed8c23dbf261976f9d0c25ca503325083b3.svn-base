<template>
  <div class="agent">
    <div class="top">
      <affix :label="$t('report.onlyAgentWorkLoSea')">
      </affix>
      <div class="search">
        <template>
          <date-time type="other_half_hour" :query="query" ref="child"></date-time>
        </template>
        <span class="inquiry fr find" @click.stop='search'>{{$t('public.search2')}}</span>
        <div class="clear"></div>
      </div>
      <affix :label="cityName.name.split('(')[0] + $t('report.agentWorkLoSea')">{{aaaaa}}</affix>
      <div class="export">
        <span class="inquiry fr"　v-on:click.stop="exportExcel">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" v-on:click.stop="exportPdf">{{$t('report.exportPDF')}}</span>
        <span class="inquiry fr pdf" v-on:click.stop="flag">返回上页</span>
      </div>
    </div>
    <div :id="id">
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
        <report-table :data="serveNumData" :sum="sum" :config="Config"> </report-table>
      </div>
    </div>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('report.reportExportHelp')" v-model="dialogVisible" size="tiny">
      <span>{{$t('report.reportExportTipTitle')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('public.confirm')}}</el-button>
      </span>
    </el-dialog>
    <header-option v-if="isShow" :show="isShow" :option="headOptionsShow" type="call_report_agent_time" v-on:close="close"></header-option>
  </div>
</template>
<script>
  import dateTime from '../base/dateTimeDrill.vue'
  import {exportReportPdf, checkTime, searchTime} from '../../../../utils/reportUtils.js'
  import {deepClone, getCallTimeLength} from '../../../../utils/m7Utils.js'
  import reportTable from '../base/drillInto.vue'
  import headerOption from '../base/headerOption.vue'
  import affix from '../../../ui-modules/affix/Affix.vue'
  export default {
    name: 'callReportAgent',
    data () {
      return {
        aaaa: 'assssaaa',
        query: {
        },
        isShow: false,
        dialogVisible: false,
        headOptions: {},
        headOptionsShow: {},
        agents: [],
        id: 'query_agent_time',
        serveNumData: [],
        sum: []
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
      search1 () {
        this.query = deepClone(this.cityName.queryOne)
        this.$refs.child.query.initShow = this.cityName.queryOne.TimeType
        this.$refs.child.form = {
          timeType: this.cityName.queryOne.TimeType,
          yearReport: parseInt(this.cityName.queryOne.yearReport),
          monthReport: parseInt(this.cityName.queryOne.monthReport),
          dayReport: parseInt(this.cityName.queryOne.dayReport)
        }
        if (this.cityName.queryOne.TimeType === 'other_half_hour') {
          if (this.cityName.queryOne.StartTime || this.cityName.queryOne.EndTime) {
            let StartTime = this.cityName.queryOne.StartTime.split(' ')[1] ? this.cityName.queryOne.StartTime.split(' ')[1] : ''
            let EndTime = this.cityName.queryOne.EndTime.split(' ')[1] ? this.cityName.queryOne.EndTime.split(' ')[1] : ''
            this.$refs.child.otherTimes = {
              beginTime: StartTime,
              endTime: EndTime,
              beginDate: this.cityName.queryOne.normalStartTime,
              endDate: this.cityName.queryOne.normalEndTime
            }
          } else {
            this.$refs.child.otherTimes = {
              beginTime: '',
              endTime: '',
              beginDate: '',
              endDate: ''
            }
          }
        }
        if (this.query.TimeType === 'other_half_hour') {
          let message = checkTime(this.query.StartTime, this.query.EndTime, false, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        let data = {
          AgentID: this.cityName.AgentID,
          TimeType: this.query.TimeType,
          yearReport: this.query.yearReport,
          monthReport: this.query.monthReport,
          dayReport: this.query.dayReport,
          StartTime: this.query.StartTime,
          EndTime: this.query.EndTime,
          reportType: 'call_report_agent_time'
        }
        if (this.query.TimeType === 'year') {
          data.YearID = this.query.yearReport
        }
        if (this.query.TimeType === 'month') {
          data.MonthID = this.query.yearReport + '0' + this.query.monthReport
        }
        if (this.query.TimeType === 'day') {
          data.DayID = this.query.yearReport + '0' + this.query.monthReport + this.query.dayReport
        }
        this.$store.dispatch('queryAgentTime', data).then(() => {
          this.headOptions = deepClone(this.$store.state.report.call.queryAgentTime.tableHeader)
          this.sum = [{show_time: '合计'}]
          let resData = deepClone(this.$store.state.report.call.queryAgentTime.data)
          for (let i in resData) {
            let item = resData[i]
            if (data.TimeType === 'year') {
              item.show_time = item.MonthID
              delete item.MonthID
            } else if (data.TimeType === 'month') {
              item.show_time = item.DayID
              delete item.DayID
            } else {
              item.show_time = item.ReportTime
            }
            for (let j in item) {
              if (this.sum[0][j] === undefined) {
                this.sum[0][j] = 0
              }
              if (j !== 'show_time') {
                this.sum[0][j] += item[j]
              }
            }
            for (let index in this.$store.state.report.call.queryAgentTime.agents) {
              let agent = this.$store.state.report.call.queryAgentTime.agents[index]
              if (agent._id === item.AgentID) {
                item.agent_name = agent.displayName + '(' + agent.exten + ')'
              }
            }
            item.LOGIN_TIME_LENGTH = getCallTimeLength(item.LOGIN_TIME_LENGTH)
            item.CallInTimeLength = getCallTimeLength(item.CallInTimeLength)
            item.CallInAverageTimeLength = getCallTimeLength(item.CallInAverageTimeLength)
            item.CallOutTimeLength = getCallTimeLength(item.CallOutTimeLength)
            item.CallOutAverageTimeLength = getCallTimeLength(item.CallOutAverageTimeLength)
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
            let molecular = this.sum[0].CallInTimeLength + this.sum[0].CallOutTimeLength
            if (this.sum[0].STATE99_TIME_LENGTH) {
              molecular = molecular + this.sum[0].STATE99_TIME_LENGTH
            }
            let denominator = this.sum[0].LOGIN_TIME_LENGTH
            for (let k = 2; k < 10; k++) {
              if (this.sum[0]['STATE' + k + '_TIME_LENGTH']) {
                denominator = denominator - this.sum[0]['STATE' + k + '_TIME_LENGTH']
              }
            }
            this.sum[0].AgentUtilization = Math.floor(molecular / denominator * 100) + '%'
          }
          if (this.sum[0].CallInAcceptRate === '') {
            this.sum[0].AgentUtilization = ''
          }
          this.sum[0].LOGIN_TIME_LENGTH = getCallTimeLength(this.sum[0].LOGIN_TIME_LENGTH)
          this.sum[0].CallTimeLength = getCallTimeLength(this.sum[0].CallTimeLength)
          this.serveNumData = resData
          this.sum[0].CallInTimeLength = getCallTimeLength(this.sum[0].CallInTimeLength)
          this.sum[0].CallInAverageTimeLength = getCallTimeLength(this.sum[0].CallInAverageTimeLength)
          this.sum[0].CallOutTimeLength = getCallTimeLength(this.sum[0].CallOutTimeLength)
          this.sum[0].CallOutAverageTimeLength = getCallTimeLength(this.sum[0].CallOutAverageTimeLength)
          if (this.sum[0].CallInAcceptRate === '') {
            this.sum[0].LOGIN_TIME_LENGTH = ''
            this.sum[0].CallInTimeLength = ''
            this.sum[0].CallInAverageTimeLength = ''
            this.sum[0].CallOutTimeLength = ''
            this.sum[0].CallOutAverageTimeLength = ''
          }
        })
      },
      flag () {
        this.$emit('flag')
      },
      search () {
        let data = {
          AgentID: this.cityName.AgentID,
          TimeType: this.query.timeType,
          yearReport: this.query.yearReport + '',
          monthReport: this.query.monthReport,
          dayReport: this.query.dayReport,
          StartTime: this.query.StartTime,
          EndTime: this.query.EndTime,
          reportType: 'call_report_agent_time'
        }
        if (data.TimeType === 'year') {
          data.YearID = data.yearReport + ''
        }
        if (data.TimeType === 'month') {
          data.MonthID = data.yearReport + '0' + data.monthReport
        }
        if (data.TimeType === 'day') {
          data.DayID = data.yearReport + '0' + data.monthReport + data.dayReport
        }
        if (typeof data.monthReport === 'number') {
          if (data.monthReport < 10) {
            data.monthReport = '0' + data.monthReport
          } else {
            data.monthReport = '' + data.monthReport
          }
        }
        if (typeof data.dayReport === 'number') {
          if (data.dayReport < 10) {
            data.dayReport = '0' + data.dayReport
          } else {
            data.dayReport = '' + data.dayReport
          }
        }
        if (data.TimeType === 'other_half_hour') {
          let message = checkTime(data.StartTime, data.EndTime, false, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        this.$store.dispatch('queryAgentTime', data).then(() => {
          this.headOptions = deepClone(this.$store.state.report.call.queryAgentTime.tableHeader)
          this.sum = [{show_time: '合计'}]
          let resData = deepClone(this.$store.state.report.call.queryAgentTime.data)
          for (let i in resData) {
            let item = resData[i]
            if (data.TimeType === 'year') {
              item.show_time = item.MonthID
              delete item.MonthID
            } else if (data.TimeType === 'month') {
              item.show_time = item.DayID
              delete item.DayID
            } else {
              item.show_time = item.ReportTime
            }
            for (let j in item) {
              if (this.sum[0][j] === undefined) {
                this.sum[0][j] = 0
              }
              if (j !== 'show_time') {
                this.sum[0][j] += item[j]
              }
            }
            for (let index in this.$store.state.report.call.queryAgentTime.agents) {
              let agent = this.$store.state.report.call.queryAgentTime.agents[index]
              if (agent._id === item.AgentID) {
                item.agent_name = agent.displayName + '(' + agent.exten + ')'
              }
            }
            item.LOGIN_TIME_LENGTH = getCallTimeLength(item.LOGIN_TIME_LENGTH)
            item.CallInTimeLength = getCallTimeLength(item.CallInTimeLength)
            item.CallInAverageTimeLength = getCallTimeLength(item.CallInAverageTimeLength)
            item.CallOutTimeLength = getCallTimeLength(item.CallOutTimeLength)
            item.CallOutAverageTimeLength = getCallTimeLength(item.CallOutAverageTimeLength)
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
            let molecular = this.sum[0].CallInTimeLength + this.sum[0].CallOutTimeLength
            if (this.sum[0].STATE99_TIME_LENGTH) {
              molecular = molecular + this.sum[0].STATE99_TIME_LENGTH
            }
            let denominator = this.sum[0].LOGIN_TIME_LENGTH
            for (let k = 2; k < 10; k++) {
              if (this.sum[0]['STATE' + k + '_TIME_LENGTH']) {
                denominator = denominator - this.sum[0]['STATE' + k + '_TIME_LENGTH']
              }
            }
            this.sum[0].AgentUtilization = Math.floor(molecular / denominator * 100) + '%'
          }
          if (this.sum[0].CallInAcceptRate === '') {
            this.sum[0].AgentUtilization = ''
          }
          this.sum[0].LOGIN_TIME_LENGTH = getCallTimeLength(this.sum[0].LOGIN_TIME_LENGTH)
          this.sum[0].CallTimeLength = getCallTimeLength(this.sum[0].CallTimeLength)
          if (!resData) {
            this.sum = []
          }
          this.serveNumData = resData
          this.sum[0].CallInTimeLength = getCallTimeLength(this.sum[0].CallInTimeLength)
          this.sum[0].CallInAverageTimeLength = getCallTimeLength(this.sum[0].CallInAverageTimeLength)
          this.sum[0].CallOutTimeLength = getCallTimeLength(this.sum[0].CallOutTimeLength)
          this.sum[0].CallOutAverageTimeLength = getCallTimeLength(this.sum[0].CallOutAverageTimeLength)
          if (this.sum[0].CallInAcceptRate === '') {
            this.sum[0].LOGIN_TIME_LENGTH = ''
            this.sum[0].CallInTimeLength = ''
            this.sum[0].CallInAverageTimeLength = ''
            this.sum[0].CallOutTimeLength = ''
            this.sum[0].CallOutAverageTimeLength = ''
          }
        })
      },
      config () {
        this.$store.dispatch('getReportTableHeader', 'call_report_agent_time').then((res) => {
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
        myQuery.user = this.$store.state.session.user._id
        myQuery.AgentID = this.cityName.AgentID
        myQuery.reportType = 'call_report_agent_time'
        myQuery.pbx = this.$store.state.session.user.pbx
        myQuery.type = this.$store.state.session.user.type
        delete myQuery.selectedAgentList
        delete myQuery.includeSubordinate
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
      dateTime,
      reportTable,
      headerOption,
      affix
    },
    props: [
      'cityName'
    ],
    watch: {
      'cityName': 'search1'
    },
    beforeMount () {
    }
  }
</script>
<style lang="stylus" scoped>
  .agent
    .ichars
      width calc(100vh-80px)
      padding 0 40px
</style>
