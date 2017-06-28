<template>
  <div class="callreport">
    <div class="top">
      <affix :label="$t('report.relaycallIn')"></affix>
      <div class="search">
        <div class="time">
          <el-row :gutter="18">
            <template>
              <date-time type="other_half_hour" :query="query"></date-time>
            </template>
          </el-row>
        </div>
        <div class="serve">
          <span class="col">{{$t('monitor.serviceNum')}}：</span>
          <el-checkbox  v-model.trim="checkAll" @change="handleCheckAllChange">{{$t('public.checkAll')}}</el-checkbox><el-checkbox v-model.trim="query.delete_ServerNo">{{$t('report.deletedServe')}}</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model.trim="checkedNos" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="one in serviceNos" :label="one.Exten">{{one.Exten}}</el-checkbox>
          </el-checkbox-group>
          <span class="inquiry fr find" @click.stop='search'>{{$t('public.search2')}}</span>
          <div class="clear"></div>
        </div>
      </div>
      <affix :label="$t('report.relaycallInRe')"></affix>
      <div class="export">
        <span class="inquiry fr" v-on:click.stop="exportExcel">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" v-on:click.stop="exportPdf">{{$t('report.exportPDF')}}</span>
      </div>
    </div>
      <div :id="id">
        <el-row class="ichars">
          <highcharts :options="options24out"></highcharts>
        </el-row>
        <div class="tabl">
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
      <!--<div class="box" v-if="isShow"></div>-->
      <header-option v-if="isShow" :show="isShow" :option="headOptionsShow" type="call_report_relay_time" v-on:close="close"></header-option>
    </div>
</template>
<script>
  import affix from '../../../ui-modules/affix/Affix.vue'
  import dateTime from '../base/datetime.vue'
  import headerOption from '../base/headerOption.vue'
  import {exportReportPdf, sortDataByKey, checkTime, searchTime, colorConfigArr} from '../../../../utils/reportUtils.js'
  import {getCache, deepClone} from '../../../../utils/m7Utils.js'
  import reportTable from '../base/reportTable.vue'
  export default {
    name: 'CallInReport',
    data () {
      return {
        id: 'CallInReport',
        query: {
          reportType: 'call_report_relay_time',
          delete_ServerNo: false,
          delete_ServerNos: ''
        },
        dialogVisible: false,
        checkAll: true,
        checkedNos: [],
        headOptionsShow: {},
        headOptions: {},
        serviceNos: '',
        isShow: false,
        serveNumData: [
        ],
        sum: [{ReportTime: '合计'}],
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
            text: this.$t('report.relaycall')
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
    components: {
      affix,
      dateTime,
      headerOption,
      reportTable
    },
    methods: {
      search () {
        if (this.checkedNos.length === 0 && this.query.delete_ServerNo === false) {
          this.open4()
        }
        let data = {reportType: 'call_report_relay_time'}
        let self = this
        self.serviceNos.forEach(function (item) {
          if (self.checkedNos.indexOf(item.Exten) >= 0) {
            self.query['ServiceNo_' + item.Exten] = true
          } else {
            self.query['ServiceNo_' + item.Exten] = false
          }
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
        this.$store.dispatch('queryCallRelayTimeReport', data).then(() => {
          this.headOptions = this.$store.state.report.call.relayTimeReport.tableHeader
          this.sum = [{ReportTime: '合计'}]
          let tempData = deepClone(this.$store.state.report.call.relayTimeReport.data)
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
              if (j !== 'ReportTime') {
                series4high[j].push(item[j])
              } else {
                delete series4high[j]
              }
            }
          }
          this.options24out.series = []
          for (let i in this.$store.state.report.call.relayTimeReport.tableHeader.Config) {
            let item = this.$store.state.report.call.relayTimeReport.tableHeader.Config[i]
            if (item.name !== 'ReportTime') {
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
      open4 () {
        this.$message.error('请选择服务号作为查询条件')
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '通话呼入时间趋势报表' + searchTime(this.query), id: this.id})
      },
      exportExcel () {
        let self = this
        this.checkedNos.forEach(function (item) {
          self.query['ServiceNo_' + item] = true
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
        myQuery.reportType = 'call_report_relay_time'
        myQuery.accountId = this.$store.state.session.user.account
        myQuery.type = 'ReportRelayTimeExport'
        myQuery.user = this.$store.state.session.user._id
        let data = {
          Method: 'exportRelayTimeReport',
          Query: myQuery
        }
        this.$store.dispatch('exportCallRelayTimeReport', data).then(() => {
        })
      },
      handleCheckAllChange (event) {
        this.checkedNos = []
        if (this.checkAll === true) {
          this.serviceNos.forEach((i) => {
            this.checkedNos.push(i.Exten)
          })
        }
      },
      handleCheckedCitiesChange (value) {
        if (this.checkedNos.length === this.serviceNos.length) {
          this.checkAll = true
        } else {
          this.checkAll = false
        }
      },
      config () {
        this.$store.dispatch('getReportTableHeader', 'call_report_relay_time').then((res) => {
          this.headOptionsShow = res
          this.isShow = !this.isShow
        })
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', {type: 'serviceNo'}).then(() => {
        this.serviceNos = getCache('serviceNo')
        this.handleCheckAllChange()
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .callreport
    .box
      width 300px
      height 300px
      position absolute
      border 1px solid #000
      background #0f0
      left 50%
      margin-left -150
      top 30px
      z-index 10
    .export
      height 30px
      margin-bottom 18px
    .serve
      margin 20px 0 0 10px
  .el-checkbox-group
    margin-left 44px
    .el-checkbox
      &:nth-child(1)
        padding-left 15px
    .col
      display inline-block
      width 56px
  .el-col-1
    height 36px
    line-height 36px
</style>
