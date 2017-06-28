<template>
  <div class="callreport">
    <div class="top">
      <affix :label="$t('report.relaycalloutSea')"></affix>
      <div class="search">
        <template>
          <date-time type="other_half_hour" :query="query"></date-time>
        </template>
        <span class="inquiry fr find" v-on:click.stop="search">{{$t('public.search2')}}</span>
        <div class="clear"></div>
      </div>
      <affix :label="$t('report.relaycalloutRe')"></affix>
      <div class="export">
        <span class="inquiry fr" v-on:click.stop="exportExcel">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" v-on:click.stop="exportPdf">{{$t('report.exportPDF')}}</span>
      </div>
    </div>
    <div :id="id">
      <el-row class="ichars">
        <highcharts :options="options24out"></highcharts>
      </el-row>
      <div class="tab">
        <div class="deploy">
          <i class="iconfont icon-peizhi"></i>
          <span class="tex" @click.stop="config">{{$t('report.setHeaderConfig')}}</span>
        </div>
        <report-table :data="serveNumData" :sum="sum" :config="headOptions.Config"> </report-table>
      </div>
    </div>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('report.reportExportHelp')" v-model="dialogVisible" size="tiny">
      <span>{{$t('report.reportExportTipTitle')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('public.confirm')}}</el-button>
      </span>
    </el-dialog>
    <header-option v-if="isShow" :show="isShow" :option="headOptionsShow" type="call_report_callout_time" v-on:close="close"></header-option>
  </div>
</template>
<script>
  import affix from '../../../ui-modules/affix/Affix.vue'
  import dateTime from '../base/datetime.vue'
  import {exportReportPdf, sortDataByKey, checkTime, searchTime, colorConfigArr} from '../../../../utils/reportUtils.js'
  import headerOption from '../base/headerOption.vue'
  import {getCache, deepClone, getCallTimeLength} from '../../../../utils/m7Utils.js'
  import reportTable from '../base/reportTable.vue'
  export default {
    name: '',
    data () {
      return {
        id: 'callout_report',
        query: { },
        isShow: false,
        headOptions: {},
        dialogVisible: false,
        serveNumData: [],
        headOptionsShow: {},
        sum: [
          { time: '合计' }
        ],
        options24out: {
          chart: {
            type: '',
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
            text: '呼出时间趋势'
          },
          legend: {
            align: 'center',
            verticalAlign: 'top',
            x: 0,
            y: 20
          },
          tooltip: {
            shared: true
          },
          plotOptions: {
            column: {
              stacking: 'normal'
            },
            series: {animation: false}
          },
          credits: {enabled: false},
          series: []
        }
      }
    },
    methods: {
      search () {
        let data = {reportType: 'call_report_callout_time'}
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
        data['query'] = myQuery
        this.$store.dispatch('queryCallCalloutTimeReport', data).then(() => {
          this.headOptions = this.$store.state.report.call.calloutTimeReport.tableHeader
          this.sum = [{ReportTime: '合计'}]
          let tempData = deepClone(this.$store.state.report.call.calloutTimeReport.data)
          for (let i in tempData) {
            let item = tempData[i]
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
              if (j !== 'ReportTime') {
                this.sum[0][j] += item[j]
              }
            }
            item.CallTimeLength = getCallTimeLength(item.CallTimeLength)
            item.CallTimeLengthAvg = getCallTimeLength(item.CallTimeLengthAvg)
            item.DealingRate += '%'
          }
          if (tempData.length > 0) {
            this.sum[0].DealingRate = this.sum[0].AccessCount === 0 ? '0%' : Math.round((this.sum[0].DealingCount / this.sum[0].AccessCount) * 100) + '%'
            this.sum[0].CallTimeLengthAvg = getCallTimeLength(this.sum[0].CallTimeLength / this.sum[0].DealingCount)
            this.sum[0].CallTimeLength = getCallTimeLength(this.sum[0].CallTimeLength)
          }
          this.serveNumData = sortDataByKey(tempData, 'ReportTime')
          let series4high = {}
          this.options24out.xAxis.categories = []
          for (let i in this.serveNumData) {
            let item = this.serveNumData[i]
            this.options24out.xAxis.categories.push(item.ReportTime)
            for (let j in item) {
              if (series4high[j] === undefined) {
                series4high[j] = []
              }
              if (['ReportTime', 'CallTimeLength', 'CallTimeLengthAvg', 'DealingRate'].indexOf(j) < 0) {
                series4high[j].push(item[j])
              } else {
                delete series4high[j]
              }
            }
          }
          this.options24out.series = []
          for (let i in this.$store.state.report.call.calloutTimeReport.tableHeader.Config) {
            let item = this.$store.state.report.call.calloutTimeReport.tableHeader.Config[i]
            if (['ReportTime', 'CallTimeLength', 'CallTimeLengthAvg', 'DealingRate'].indexOf(item.name) < 0) {
              this.options24out.series.push({
                name: item.displayname,
                data: series4high[item.name]
              })
            }
          }
        })
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '通话呼出时间趋势报表 ' + searchTime(this.query), id: this.id})
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
        myQuery.reportType = 'call_report_callout_time'
        myQuery.accountId = this.$store.state.session.user.account
        myQuery.type = 'ReportDialoutExport'
        myQuery.user = this.$store.state.session.user._id
        let data = {
          Method: 'exportDialoutTime',
          Query: myQuery
        }
        this.$store.dispatch('exportCallCalloutTimeReport', data).then(() => {
        })
      },
      close (data) {
        this.isShow = false
        if (data === 'save') {
          this.search()
        }
      },
      config () {
        this.$store.dispatch('getReportTableHeader', 'call_report_callout_time').then((res) => {
          this.headOptionsShow = res
          this.isShow = !this.isShow
        })
      }
    },
    components: {
      affix,
      dateTime,
      headerOption,
      reportTable
    },
    beforeMount () {
      this.$store.dispatch('getCache', {type: 'serviceNo'}).then(() => {
        this.serviceNos = getCache('serviceNo')
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
</style>
