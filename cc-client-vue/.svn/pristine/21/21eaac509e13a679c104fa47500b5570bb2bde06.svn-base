<template>
  <div class="queue">
    <div class="top">
      <affix :label="$t('report.queueReportSea')"></affix>
      <div class="search">
        <template>
          <date-time type="other_half_hour" :query="query"></date-time>
        </template>
        <div class="skill">
          <span class="ski">{{$t('public.queues')}}：</span>
          <el-select size="small" v-model.trim="value1" :placeholder="$t('report.queueNaSea')">
            <el-option
              v-for="item in options"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <span class="inquiry fr find" v-on:click.stop="search">{{$t('public.search2')}}</span>
        <div class="clear"></div>
      </div>
      <affix :label="$t('report.queueReportRe')"></affix>
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
          <span class="tip"><i class="iconfont icon-tixingweizhi"></i></span>
          <el-tooltip class="item" effect="dark" placement="right" popper-class="reportTip">
            <div slot="content">
              {{$t('report.connectioRate')}}<br>
              {{$t('report.twentySecondPick')}}<br>
              {{$t('report.sixSecondGiveUp')}}<br>
              {{$t('report.turnOnaverQueuTime')}}<br>
              {{$t('report.giveUpAverQueueTime')}}<br>
              {{$t('report.averCallTime')}}<br>
              {{$t('report.serviceLevel')}}
            </div>
            <el-button>{{$t('report.description')}}</el-button>
          </el-tooltip>
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
    <header-option v-if="isShow" :show="isShow" :option="headOptionsShow" type="call_report_queue" v-on:close="close"></header-option>
  </div>
</template>
<script>
  import affix from '../../../ui-modules/affix/Affix.vue'
  import reportTable from '../base/reportTable.vue'
  import dateTime from '../base/datetime.vue'
  import {exportReportPdf, checkTime, searchTime, colorConfigArr} from '../../../../utils/reportUtils.js'
  import {getCache, deepClone, getCallTimeLength} from '../../../../utils/m7Utils.js'
  import headerOption from '../base/headerOption.vue'
  export default {
    name: '',
    data () {
      return {
        id: 'call_report_queue',
        query: {},
        options: [],
        value1: '',
        queues: [],
        dialogVisible: false,
        checkedQueues: [],
        headOptions: {},
        serveNumData: [],
        headOptionsShow: {},
        sum: [],
        sumExclude: ['queue_name', 'AcceptRate', 'AcceptRateNotIn6Leak'],
        chartInclude: ['AcceptAverageQueueTimeLength', 'AcceptMaxQueueTimeLength', 'AcceptMinQueueTimeLength', 'AbandonAverageQueueTimeLength',
          'AbandonMaxQueueTimeLength', 'AbandonMinQueueTimeLength', 'AcceptAverageCallInTimeLength'],
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
            text: this.$t('report.queueReport')
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
        },
        isShow: false
      }
    },
    components: {
      affix,
      dateTime,
      reportTable,
      headerOption
    },
    methods: {
      search () {
        let data = {reportType: 'call_report_queue'}
        let self = this
        this.checkedQueues.forEach(function (item) {
          self.query['selectedQueueList'] += (item + ',')
        })
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
        this.$store.dispatch('queryCallQueueReport', data).then(() => {
          this.headOptions = this.$store.state.report.call.queueReport.tableHeader
          let series4high = {}
          this.options24out.xAxis.categories = []
          this.sum = [{queue_name: '合计'}]
          let tempData = deepClone(this.$store.state.report.call.queueReport.data)
          for (let i in tempData) {
            let item = tempData[i]
            for (let j in this.queues) {
              if (item.QueueID === this.queues[j]._id) {
                item.queue_name = this.queues[j].DisplayName
              }
            }
            this.options24out.xAxis.categories.push(item.queue_name)
            for (let j in item) {
              if (this.sum[0][j] === undefined) {
                this.sum[0][j] = 0
              }
              if (series4high[j] === undefined) {
                series4high[j] = []
              }
              if (j !== 'queue_name') {
                series4high[j].push(Math.round(item[j]))
              } else {
                delete series4high[j]
              }
              if (this.sumExclude.indexOf(j) < 0) {
                if (!isNaN(item[j])) {
                  if ((j in this.sum[0]) === false) {
                    this.sum[0][j] = 0
                  }
                  if (j === 'AcceptMaxQueueTimeLength') {
                    if (item[j] > this.sum[0][j]) {
                      this.sum[0][j] = item[j]
                    }
                  } else if (j === 'AcceptMinQueueTimeLength') {
                    if (this.sum[0][j] === 0) {
                      this.sum[0][j] = item[j]
                    }
                    if (item[j] < this.sum[0][j]) {
                      this.sum[0][j] = item[j]
                    }
                  } else if (j === 'AbandonMaxQueueTimeLength') {
                    if (item[j] > this.sum[0][j]) {
                      this.sum[0][j] = item[j]
                    }
                  } else if (j === 'AbandonMinQueueTimeLength') {
                    if (this.sum[0][j] === 0) {
                      this.sum[0][j] = item[j]
                    }
                    if (item[j] < this.sum[0][j]) {
                      this.sum[0][j] = item[j]
                    }
                  } else {
                    this.sum[0][j] += item[j]
                  }
                }
              }
            }
            item.AbandonAverageQueueTimeLength = getCallTimeLength(Math.round(item.AbandonAverageQueueTimeLength))
            item.AbandonMaxQueueTimeLength = getCallTimeLength(item.AbandonMaxQueueTimeLength)
            item.AbandonMinQueueTimeLength = getCallTimeLength(item.AbandonMinQueueTimeLength)
            item.AbandonSumQueueTimeLength = getCallTimeLength(item.AbandonSumQueueTimeLength)
            item.AcceptAverageCallInTimeLength = getCallTimeLength(Math.round(item.AcceptAverageCallInTimeLength))
            item.AcceptAverageQueueTimeLength = getCallTimeLength(Math.round(item.AcceptAverageQueueTimeLength))
            item.AcceptSumCallInTimeLength = getCallTimeLength(item.AcceptSumCallInTimeLength)
            item.AcceptSumQueueTimeLength = getCallTimeLength(item.AcceptSumQueueTimeLength)
            item.AcceptMinQueueTimeLength = getCallTimeLength(item.AcceptMinQueueTimeLength)
            item.AcceptMaxQueueTimeLength = getCallTimeLength(item.AcceptMaxQueueTimeLength)
          }
          this.sum[0].AcceptRate = this.sum[0].AccessCount === 0 ? 0 : Math.round((this.sum[0].AcceptCount / this.sum[0].AccessCount) * 100) + '%'
          this.sum[0].AcceptRateNotIn6Leak = this.sum[0].AccessCount === 0 ? 0 : Math.round(((this.sum[0].AcceptCount - this.sum[0].AbandonIn6SumQueueLeak) / this.sum[0].AccessCount) * 100) + '%'
          this.sum[0].ServiceLevel = this.sum[0].AccessCount === 0 ? 0 : Math.round((this.sum[0].AcceptIn20Count / this.sum[0].AccessCount) * 10) / 10
          this.sum[0].AcceptAverageQueueTimeLength = this.sum[0].AcceptSumQueueTimeLength / this.sum[0].AcceptCount
          if (this.sum[0].AccessCount - this.sum[0].AcceptCount === 0) {
            this.sum[0].AbandonAverageQueueTimeLength = 0
          } else {
            this.sum[0].AbandonAverageQueueTimeLength = this.sum[0].AbandonSumQueueTimeLength / (this.sum[0].AccessCount - this.sum[0].AcceptCount)
          }
          this.sum[0].AcceptAverageCallInTimeLength = this.sum[0].AcceptSumCallInTimeLength / this.sum[0].AcceptCount
          this.sum[0].AbandonAverageQueueTimeLength = getCallTimeLength(Math.round(this.sum[0].AbandonAverageQueueTimeLength))
          this.sum[0].AbandonMaxQueueTimeLength = getCallTimeLength(this.sum[0].AbandonMaxQueueTimeLength)
          this.sum[0].AbandonMinQueueTimeLength = getCallTimeLength(this.sum[0].AbandonMinQueueTimeLength)
          this.sum[0].AbandonSumQueueTimeLength = getCallTimeLength(this.sum[0].AbandonSumQueueTimeLength)
          this.sum[0].AcceptAverageCallInTimeLength = getCallTimeLength(Math.round(this.sum[0].AcceptAverageCallInTimeLength))
          this.sum[0].AcceptAverageQueueTimeLength = getCallTimeLength(Math.round(this.sum[0].AcceptAverageQueueTimeLength))
          this.sum[0].AcceptSumCallInTimeLength = getCallTimeLength(this.sum[0].AcceptSumCallInTimeLength)
          this.sum[0].AcceptSumQueueTimeLength = getCallTimeLength(this.sum[0].AcceptSumQueueTimeLength)
          this.sum[0].AcceptMinQueueTimeLength = getCallTimeLength(this.sum[0].AcceptMinQueueTimeLength)
          this.sum[0].AcceptMaxQueueTimeLength = getCallTimeLength(this.sum[0].AcceptMaxQueueTimeLength)
          this.serveNumData = tempData
          this.options24out.series = []
          for (let i in this.$store.state.report.call.queueReport.tableHeader.Config) {
            let item = this.$store.state.report.call.queueReport.tableHeader.Config[i]
            if (this.chartInclude.indexOf(item.name) >= 0) {
              this.options24out.series.push({
                name: item.displayname,
                data: series4high[item.name]
              })
            }
          }
        })
      },
      close (data) {
        this.isShow = false
        if (data === 'save') {
          this.search()
        }
      },
      config () {
        this.$store.dispatch('getReportTableHeader', 'call_report_queue').then((res) => {
          this.headOptionsShow = res
          this.isShow = !this.isShow
        })
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '通话技能组对比报表' + searchTime(this.query), id: this.id})
      },
      exportExcel () {
        let self = this
        this.checkedQueues.forEach(function (item) {
          self.query['selectedQueueList'] += (item + ',')
        })
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
        myQuery.reportType = 'call_report_queue'
        myQuery.accountId = this.$store.state.session.user.account
        myQuery.type = 'exportReportQueue'
        myQuery.user = this.$store.state.session.user._id
        let data = {
          Method: 'exportReportQueue',
          Query: myQuery
        }
        this.$store.dispatch('exportCallQueueReport', data).then(() => {
        })
      }
    },
    beforeMount () {
      this.search()
      this.$store.dispatch('getCache', {type: 'queues'}).then(() => {
        this.queues = getCache('queues')
        for (let i in this.queues) {
          let queueItem = this.queues[i]
          let option = {
            value: queueItem._id,
            label: queueItem.DisplayName
          }
          this.options.push(option)
        }
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .queue
    .skill
      margin-top 20px
    .ski
      margin-left 18px
      display inline-block
      height 36px
      line-height 36px
      width 54px
</style>
