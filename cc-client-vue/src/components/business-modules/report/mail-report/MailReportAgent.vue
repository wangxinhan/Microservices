<template>
  <div class="mail_report_agent">
    <div class="top">
      <affix :label="$t('report.mailReportAgent')+$t('public.search2')"></affix>
      <div class="search">
        <template>
          <date-time type="other_half_hour" :query="query"></date-time>
        </template>
        <div class="skill">
          <span class="ski">{{$t('public.agent')}} :</span>
          <el-select size="small" v-model.trim="selectedAgentList" multiple filterable :placeholder="$t('public.pickAgent')">
            <el-option
                    v-for="item in agentOptions"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
          <el-checkbox v-model.trim="includeSubordinate" checked>{{$t('report.includeSubordinate')}}</el-checkbox>
        </div>
        <span class="inquiry fr find" @click.stop="search">{{$t('public.search2')}}</span>
        <div class="clear"></div>
      </div>
      <affix :label="title"></affix>
      <div class="export">
        <span class="inquiry fr" @click.stop="exportXls">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" @click.sotp="exportPdf">{{$t('report.exportPDF')}}</span>
      </div>
    </div>
    <div :id = "id">
      <el-row class="ichars">
        <highcharts :options="highchartsOptions"></highcharts>
      </el-row>
      <div class="tab">
        <div class="deploy">
          <span class="set"><i class="iconfont icon-peizhi"></i></span>
          <span class="tex" @click.stop="isHeaderConfigShow=!isHeaderConfigShow">{{$t('report.setHeaderConfig')}}</span>
          <span class="tip"><i class="iconfont icon-tixingweizhi"></i></span>
          <el-tooltip class="item" effect="dark" placement="right" popper-class="reportTip">
            <div slot="content">
              {{$t('report.sessionMailDuration')}}<br/>
              {{$t('report.averageResponseTime')}}
            </div>
            <el-button>{{$t('report.description')}}</el-button>
          </el-tooltip>
        </div>
        <report-table :data="tableData" :sum="totalData" :config="headOptions.Config"></report-table>
      </div>
    </div>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('report.reportExportHelp')" v-model="dialogVisible" size="tiny">
      <span>{{$t('report.reportExportTipTitle')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('public.confirm')}}</el-button>
      </span>
    </el-dialog>
    <header-option v-if="isHeaderConfigShow" :show="isHeaderConfigShow" :option="headOptionsShow" :type="id" v-on:close="close"></header-option>
  </div>
</template>
<script>
  import affix from '../../../ui-modules/affix/Affix.vue'
  import dateTime from '../base/datetime.vue'
  import reportTable from '../base/reportTable.vue'
  import headerOption from '../base/headerOption.vue'
  import { deepClone, getFormatTimeBySecond } from '../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, checkTime, searchTime, colorConfigArr } from '../../../../utils/reportUtils.js'
  export default {
    name: 'MailReportAgent',
    data () {
      return {
        id: 'mail_report_agent',
        title: this.$t('report.mailReportAgent'),
        query: {},
        dialogVisible: false,
        selectedAgentList: [],
        includeSubordinate: true,
        agentOptions: [],
        serverData: [],
        headOptions: {Config: []},
        headOptionsShow: {},
        isHeaderConfigShow: false,
        highchartsDefaultOptions: {
          chart: { type: 'column', animation: false },
          colors: colorConfigArr,
          xAxis: {
            categories: [],
            title: {
              enabled: true,
              text: '',
              style: { fontWeight: 'normal' }
            }
          },
          yAxis: {
            gridLineColor: '#e6e6e6',
            allowDecimals: false,
            title: { text: '' },
            showEmpty: false
          },
          title: { text: this.$t('report.mailReportAgent') },
          legend: { align: 'center', verticalAlign: 'top', y: 30 },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}{point.valueSuffix}</b><br/>',
            shared: true
          },
          credits: { enabled: false },
          series: []
        }
      }
    },
    components: {
      affix,
      dateTime,
      reportTable,
      headerOption
    },
    computed: {
      tableData () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let data = deepClone(this.serverData)
        data.forEach(item => {
          item.agentName = this.getAgentName(item.agentId)
          item.mailAutoClaimOpenTimeLength = getFormatTimeBySecond(item.mailAutoClaimOpenTimeLength)
          item.mailAutoClaimCloseTimeLength = getFormatTimeBySecond(item.mailAutoClaimCloseTimeLength)
          item.sessionAverageTimeLength = getFormatTimeBySecond(item.sessionAverageTimeLength)
          item.averageFirstResponseTimeLength = getFormatTimeBySecond(item.averageFirstResponseTimeLength)
        })

        return data
      },
      totalData () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let headerConfig = this.headOptions.Config || []
        let datas = this.serverData
        let total = {
          agentName: this.$t('report.total'),
          sessionTotalTimeLength: 0,
          firstResponseTotalTimeLength: 0,
          responseTotalCount: 0
        }

        for (let i = 0; i < headerConfig.length; i++) {
          for (let j = 0; j < datas.length; j++) {
            if (!isNaN(datas[j][headerConfig[i].name])) {
              if ((headerConfig[i].name in total) === false) {
                total[headerConfig[i].name] = 0
              }
              total[headerConfig[i].name] += datas[j][headerConfig[i].name]
            }

            if (headerConfig[i].name === 'sessionAverageTimeLength') {
              total.sessionTotalTimeLength += datas[j]['sessionTotalTimeLength']
            } else if (headerConfig[i].name === 'averageFirstResponseTimeLength') {
              total.firstResponseTotalTimeLength += datas[j]['firstResponseTotalTimeLength']
              total.responseTotalCount += datas[j]['responseTotalCount']
            }
          }
        }

        // 平均会话时长
        total.sessionAverageTimeLength = total.sessionCompleteCount + total.sessionRollOutCount > 0 ? Math.round(total.sessionTotalTimeLength / (total.sessionCompleteCount + total.sessionRollOutCount)) : 0
        total.sessionAverageTimeLength = getFormatTimeBySecond(total.sessionAverageTimeLength)
        // 平均首次响应时长
        total.averageFirstResponseTimeLength = total.responseTotalCount > 0 ? Math.round(total.firstResponseTotalTimeLength / total.responseTotalCount) : 0
        total.averageFirstResponseTimeLength = getFormatTimeBySecond(total.averageFirstResponseTimeLength)
        // 领取开关
        total.mailAutoClaimOpenTimeLength = getFormatTimeBySecond(total.mailAutoClaimOpenTimeLength)
        total.mailAutoClaimCloseTimeLength = getFormatTimeBySecond(total.mailAutoClaimCloseTimeLength)
        return [total]
      },
      highchartsOptions () {
        let options = deepClone(this.highchartsDefaultOptions)
        if (!this.serverData || this.serverData.length === 0) {
          return options
        }

        let headerConfig = this.headOptions.Config || []
        let datas = this.serverData
        let categoriesArray = []
        let seriesArray = []

        headerConfig.forEach(item => {
          if (!item.show) {
            return
          }
          if (item.name === 'agentName') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          if (item.name === 'sessionAverageTimeLength' || item.name === 'averageFirstResponseTimeLength' ||
            item.name === 'mailAutoClaimOpenTimeLength' || item.name === 'mailAutoClaimCloseTimeLength') {
            serie.tooltip = {valueSuffix: 's'}
          }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push(this.getAgentName(datas[i].agentId))
          for (let j = 0; j < seriesArray.length; j++) {
            seriesArray[j].data.push(datas[i][seriesArray[j].valueName])
          }
        }

        options.xAxis.categories = categoriesArray
        options.series = seriesArray

        return options
      }
    },
    methods: {
      getAgentName (id) {
        for (let i = 0; i < this.agentOptions.length; i++) {
          if (this.agentOptions[i].value === id) {
            return this.agentOptions[i].label
          }
        }
        return ''
      },
      search () {
        let data = {
          reportType: this.id,
          account: this.$store.state.session.user.account,
          query: {reportType: this.id, includeSubordinate: this.includeSubordinate},
          user: {
            type: this.$store.state.session.user.type,
            moduleUsers: this.$store.state.session.user.moduleUsers
          }
        }
        let query = formatDateQuery(deepClone(this.query))
        if (query.timeType === 'other_half_hour') {
          let message = checkTime(query.StartTime, query.EndTime, false, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        if (this.selectedAgentList.length > 0) {
          query.selectedAgentList = this.selectedAgentList.join(',')
        }
        Object.assign(data.query, query)
        this.loading = true
        this.$store.dispatch('queryMailAgentReport', data).then(() => {
          // 表头
          this.headOptions = deepClone(this.$store.state.report.email.agentReport.tableHeader)
          this.headOptionsShow = deepClone(this.$store.state.report.email.agentReport.tableHeader)

          this.serverData = deepClone(this.$store.state.report.email.agentReport.data)
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportMailAgent',
          Query: {
            reportType: this.id,
            user: this.$store.state.session.user._id,
            includeSubordinate: this.includeSubordinate
          }
        }
        let query = formatDateQuery(deepClone(this.query))
        if (query.timeType === 'other_half_hour') {
          let message = checkTime(query.StartTime, query.EndTime, false, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        if (this.selectedAgentList.length > 0) {
          query.selectedAgentList = this.selectedAgentList.join(',')
        }
        Object.assign(data.Query, query)
        this.$store.dispatch('exportMailAgentReport', data)
      },
      close (data) {
        if (data) {
          this.headOptions = deepClone(this.$store.state.report.email.agentReport.tableHeader)
        }
        this.headOptionsShow = deepClone(this.$store.state.report.email.agentReport.tableHeader)
        this.isHeaderConfigShow = false
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '邮件座席工作量报表' + searchTime(this.query), id: this.id})
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'agents' }).then(agents => {
        this.agentOptions = agents.map(agent => ({ label: `${agent.displayName}[${agent.exten}]`, value: agent._id }))
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .mail_report_agent
    .el-select
      display inline-block
      margin-right 16px
    .top
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
      .deploy
        .tex
          margin-left 10px
          cursor pointer
</style>
