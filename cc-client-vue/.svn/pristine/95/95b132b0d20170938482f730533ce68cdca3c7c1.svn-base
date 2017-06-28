<template>
  <div class="queuetime">
    <div class="top">
      <affix :label="$t('report.queueTimeSea')"></affix>
      <div class="search">
        <template>
          <date-time type="other_half_hour" :query="query"></date-time>
        </template>
        <div class="skill">
          <span class="ski">{{$t('public.queues')}}：</span>
          <el-select size="small"
            v-model.trim="query.currentQueue"
            :placeholder="$t('report.queueNaSea')"
            multiple
            filterable
            allow-create
          >
            <el-option
              v-for="item in queues"
              :label="item.DisplayName"
              :value="item._id">
            </el-option>
          </el-select>
        </div>
        <span
          class="inquiry fr find"
          @click.stop='search'>{{$t('public.search2')}}</span>
          <div class="clear"></div>
      </div>
      <affix :label="$t('report.queueTimeRe')"></affix>
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
        <div class="deploy"><i class="iconfont icon-peizhi"></i><span class="tex" @click.stop="config">{{$t('report.setHeaderConfig')}}</span></div>
        <report-table :data="serveNumData" :sum="sum" :config="headOptions.Config"> </report-table>
      </div>
      <header-option v-if="isShow" :show="isShow" :option="headOptionsShow" type="call_report_queue_time" v-on:close="close"></header-option>
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
  import {exportReportPdf, sortDataByKey, checkTime, searchTime, colorConfigArr} from '../../../../utils/reportUtils.js'
  import {deepClone, getCallTimeLength, getCache} from '../../../../utils/m7Utils.js'
  import reportTable from '../base/reportTable.vue'
  import headerOption from '../base/headerOption.vue'
  export default {
    name: '',
    data () {
      return {
        id: 'call_report_queue_time',
        query: {
          currentQueue: {}
        },
        serveNumData: [],
        headOptionsShow: {},
        serveData: [],
        headOptions: {},
        isShow: false,
        dialogVisible: false,
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
            text: this.$t('report.callReportQueueTime')
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
      close (data) {
        this.isShow = false
        if (data === 'save') {
          this.search()
        }
      },
      config () {
        this.$store.dispatch('getReportTableHeader', 'call_report_queue_time').then((res) => {
          this.headOptionsShow = res
          this.isShow = !this.isShow
        })
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '通话技能组时间趋势报表' + searchTime(this.query), id: this.id})
      },
      search (init) {
        let data = {reportType: 'call_report_queue_time'}
        let myQuery = deepClone(this.query)
        if (myQuery.timeType === 'other_half_hour') {
          let message = checkTime(myQuery.StartTime, myQuery.EndTime, false, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        if (init !== 'true') {
          let queueFlag = myQuery.currentQueue
          let current = ''
          if (queueFlag.length > 0) {
            for (let i in queueFlag) {
              current += queueFlag[i] + ','
            }
          }
          myQuery.currentQueue = current
          myQuery.TimeType = myQuery.timeType
          myQuery.reportType = 'call_report_queue_time'
          delete myQuery.timeType
          myQuery.yearReport += ''
          if (typeof myQuery.monthReport === 'number') {
            if (myQuery.monthReport < 10) {
              myQuery.monthReport = '0' + myQuery.monthReport
            } else {
              myQuery.monthReport = '' + myQuery.monthReport
            }
          }
          if (myQuery.TimeType === 'year') {
            delete myQuery.monthReport
            delete myQuery.dayReport
          }
          if (typeof myQuery.dayReport === 'number') {
            if (myQuery.dayReport < 10) {
              myQuery.dayReport = '0' + myQuery.dayReport
            } else {
              myQuery.dayReport = '' + myQuery.dayReport
            }
          }
          data['query'] = myQuery
        }
        this.$store.dispatch('queryCallQueueTimeReport', data).then(() => {
          this.headOptions = this.$store.state.report.call.queueTimeReport.tableHeader
          this.sum = [{ReportTime: '合计'}]
          let tempData = deepClone(this.$store.state.report.call.queueTimeReport.data)
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
            item.AbandonMinQueueTimeLength = getCallTimeLength(item.AbandonMinQueueTimeLength)
            item.AbandonMaxQueueTimeLength = getCallTimeLength(item.AbandonMaxQueueTimeLength)
            item.AbandonAverageQueueTimeLength = getCallTimeLength(item.AbandonAverageQueueTimeLength)
            item.AcceptMinQueueTimeLength = getCallTimeLength(item.AcceptMinQueueTimeLength)
            item.AcceptMaxQueueTimeLength = getCallTimeLength(item.AcceptMaxQueueTimeLength)
            item.AcceptAverageQueueTimeLength = getCallTimeLength(item.AcceptAverageQueueTimeLength)
          }
          let Dividend = this.sum[0].AccessCount
          if (Dividend === 0) {
            this.sum[0].AcceptRate = '0%'
          } else if (Dividend > 0) {
            this.sum[0].AcceptRate = Math.round((this.sum[0].AcceptCount / Dividend) * 100) + '%'
          } else {
            this.sum[0].AcceptRate = ''
          }
          if (this.sum[0].AcceptRate === '') {
            this.sum[0].ReportTime = ''
          }
          this.serveNumData = sortDataByKey(tempData, 'ReportTime')
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
              if (['AccessCount', 'AcceptCount', 'AcceptIn20Count'].indexOf(j) >= 0) {
                series4high[j].push(item[j])
              } else {
                delete series4high[j]
              }
            }
          }
          this.sum[0].CallTimeLength = getCallTimeLength(this.sum[0].CallTimeLength)
          this.sum[0].AbandonMinQueueTimeLength = getCallTimeLength(this.sum[0].AbandonMinQueueTimeLength)
          this.sum[0].AbandonMaxQueueTimeLength = getCallTimeLength(this.sum[0].AbandonMaxQueueTimeLength)
          this.sum[0].AbandonAverageQueueTimeLength = getCallTimeLength(this.sum[0].AbandonAverageQueueTimeLength)
          this.sum[0].AcceptMinQueueTimeLength = getCallTimeLength(this.sum[0].AcceptMinQueueTimeLength)
          this.sum[0].AcceptMaxQueueTimeLength = getCallTimeLength(this.sum[0].AcceptMaxQueueTimeLength)
          this.sum[0].AcceptAverageQueueTimeLength = getCallTimeLength(this.sum[0].AcceptAverageQueueTimeLength)
          if (this.sum[0].AcceptRate === '') {
            this.sum[0].AbandonMinQueueTimeLength = ''
            this.sum[0].AbandonMaxQueueTimeLength = ''
            this.sum[0].AbandonAverageQueueTimeLength = ''
            this.sum[0].AcceptMinQueueTimeLength = ''
            this.sum[0].AcceptMaxQueueTimeLength = ''
            this.sum[0].AcceptAverageQueueTimeLength = ''
          }
          this.options24out.series = []
          for (let i in this.$store.state.report.call.queueTimeReport.tableHeader.Config) {
            let item = this.$store.state.report.call.queueTimeReport.tableHeader.Config[i]
            if (['AccessCount', 'AcceptCount', 'AcceptIn20Count'].indexOf(item.name) >= 0) {
              this.options24out.series.push({
                name: item.displayname,
                data: series4high[item.name]
              })
            }
          }
        })
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
        let queueFlag = myQuery.currentQueue
        let current = ''
        if (queueFlag.length > 0) {
          for (let i in queueFlag) {
            current += queueFlag[i] + ','
          }
        }
        myQuery.currentQueue = current
        myQuery.reportType = 'call_report_queue_time'
        myQuery.accountId = this.$store.state.session.user.account
        myQuery.type = 'exportReportQueueTime'
        myQuery.user = this.$store.state.session.user._id
        myQuery.StartTime = ''
        myQuery.EndTime = ''
        if (myQuery.TimeType === 'year') {
          delete myQuery.monthReport
          delete myQuery.dayReport
        }
        let data = {
          Method: 'exportReportQueueTime',
          Query: myQuery
        }
        this.$store.dispatch('exportCallQueueTimeReport', data).then(() => {
        })
      }
    },
    components: {
      affix,
      dateTime,
      reportTable,
      headerOption
    },
    beforeMount () {
      this.$store.dispatch('getCache', {type: 'queues'}).then(() => {
        this.queues = getCache('queues')
        this.search('true')
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .queuetime
    #call_report_queue_time
    .el-select
      display inline-block
    .top
      .sear
        margin-left 0
      .skill
        margin-top 20px
        .ski
          margin-left 18px
          display inline-block
          height 36px
          line-height 36px
          width 54px
    .el-col-1
      height 36px
      line-height 36px
</style>
