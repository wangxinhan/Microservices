<template>
  <div class="session" v-loading="loading">
    <div class="top">
      <affix :label="$t('report.imReportSessionTimeSearch')"></affix>
      <div class="search">
        <template>
          <date-time type="other" :query="query"></date-time>
        </template>
        <span class="inquiry fr find" @click.stop="search">{{$t('public.search2')}}</span>
        <div class="clear"></div>
      </div>
      <affix :label="title"></affix>
      <div class="export">
        <span class="inquiry fr" @click.stop="exportXls">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" @click.sotp="exportPdf">{{$t('report.exportPDF')}}</span>
      </div>
    </div>
    <div :id="id">
      <el-row class="ichars">
        <highcharts :options="highchartsOptions"></highcharts>
      </el-row>
      <div class="tab">
        <div class="deploy">
          <span class="tip"><i class="iconfont icon-tixingweizhi"></i></span>
          <el-tooltip class="item" effect="dark" placement="right" popper-class="reportTip">
            <div slot="content">
              {{$t('report.allConSationNumber')}}<br>
              {{$t('report.lostConSation')}}<br>
              {{$t('report.customizeSeaExp')}}
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
  </div>
</template>
<script>
  import affix from '../../../ui-modules/affix/Affix.vue'
  import dateTime from '../base/datetime.vue'
  import reportTable from '../base/reportTable.vue'
  import { deepClone } from '../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, checkTime, searchTime, colorConfigArr } from '../../../../utils/reportUtils.js'
  export default {
    name: 'im_report_session_time',
    data () {
      return {
        id: 'im_report_session_time',
        title: this.$t('report.imReportSessionTime'),
        loading: false,
        groupName: 'hourId',
        timeType: 'day',
        query: {},
        dialogVisible: false,
        serverData: [],
        headOptions: { Config: [], data: [] },
        highchartsDefaultOptions: {
          chart: { type: '', animation: false },
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
          title: { text: this.$t('report.imReportSessionTime') },
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
      reportTable
    },
    computed: {
      tableData () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let data = deepClone(this.serverData)
        data.forEach(item => {
          item.reportTime = this.formatReportTime(item[this.groupName])
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
          reportTime: this.$t('report.total')
        }

        for (let i = 0; i < headerConfig.length; i++) {
          for (let j = 0; j < datas.length; j++) {
            if (!isNaN(datas[j][headerConfig[i].name])) {
              if ((headerConfig[i].name in total) === false) {
                total[headerConfig[i].name] = 0
              }
              total[headerConfig[i].name] += datas[j][headerConfig[i].name]
            }
          }
        }

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
          if (item.name === 'reportTime') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push(this.formatChartTime(datas[i][this.groupName]))
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
      formatReportTime (reportTime) {
        if (this.groupName === 'monthId') {
          return `${reportTime.substring(0, 4)}-${reportTime.substring(4, 6)}`
        } else if (this.groupName === 'dayId') {
          return `${reportTime.substring(0, 4)}-${reportTime.substring(4, 6)}-${reportTime.substring(6, 8)}`
        } else {
          return `${reportTime.substring(0, 4)}-${reportTime.substring(4, 6)}-${reportTime.substring(6, 8)} ${reportTime.substring(8, 10)}:00:00`
        }
      },
      formatChartTime (reportTime) {
        if (this.groupName === 'monthId') {
          return reportTime.substring(4, 6)
        } else if (this.groupName === 'dayId' && this.timeType === 'month') {
          return reportTime.substring(6, 8)
        } else if (this.groupName === 'dayId' && this.timeType === 'other') {
          return `${reportTime.substring(0, 4)}-${reportTime.substring(4, 6)}-${reportTime.substring(6, 8)}`
        } else {
          return reportTime.substring(8, 10)
        }
      },
      search () {
        let data = {
          reportType: this.id,
          account: this.$store.state.session.user.account,
          query: { reportType: this.id },
          user: {
            type: this.$store.state.session.user.type,
            moduleUsers: this.$store.state.session.user.moduleUsers
          }
        }
        let query = formatDateQuery(deepClone(this.query))
        if (query.timeType === 'other') {
          let message = checkTime(query.StartTime, query.EndTime, true, true) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        if (query.timeType === 'other' && (query.StartTime === '' || query.EndTime === '')) {
          let date = new Date()
          let year = '' + date.getFullYear()
          query.timeType = 'year'
          query.yearReport = year
        }
        Object.assign(data.query, query)
        this.loading = true
        this.$store.dispatch('queryImSessionTimeReport', data).then(() => {
          if (query.timeType === 'year') {
            this.groupName = 'monthId'
          } else if (query.timeType === 'month') {
            this.groupName = 'dayId'
          } else if (query.timeType === 'day') {
            this.groupName = 'hourId'
          } else if (query.timeType === 'other') {
            this.groupName = 'dayId'
          }
          this.timeType = query.timeType
          // 表头
          this.headOptions = deepClone(this.$store.state.report.im.sessionTimeReport.tableHeader) || this.headOptions

          this.serverData = deepClone(this.$store.state.report.im.sessionTimeReport.data) || this.serverData
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportImSessionTime',
          Query: { reportType: this.id, user: this.$store.state.session.user._id }
        }
        let query = formatDateQuery(deepClone(this.query))
        if (query.timeType === 'other_half_hour') {
          let message = checkTime(query.StartTime, query.EndTime, true, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        Object.assign(data.Query, query)
        this.$store.dispatch('exportImSessionTimeReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '在线咨询会话数时间趋势报表' + searchTime(this.query), id: this.id})
      }
    },
    beforeMount () {
      this.$nextTick(() => {
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .session
    .tab
      .deploy
        .tip
          margin-left 0px
</style>
