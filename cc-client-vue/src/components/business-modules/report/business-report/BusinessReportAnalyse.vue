<template>
  <div class="business_report_analyse" v-loading="loading">
    <div class="top">
      <affix :label="$t('report.businessReportAnalyseSearch')"></affix>
      <div class="search">
        <template>
          <date-time type="other" :query="query"></date-time>
        </template>
        <span class="inquiry fr find" @click="search">{{$t('public.search2')}}</span>
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
              {{$t('report.creatBusinessNumber')}} <br>
              {{$t('report.finishBusinessNumber')}} <br>
              {{$t('report.finishRate')}} <br>
              {{$t('report.averFinishTime')}} <br>
              {{$t('report.aveDealTime')}} <br>
              {{$t('report.averWaitTime')}}
            </div>
            <span>{{$t('report.description')}}</span>
          </el-tooltip>
        </div>
        <report-table :data="tableData" :config="headOptions.Config"></report-table>
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
  import { deepClone, getFormatTimeBySecond } from '../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, checkTime, searchTime, colorConfigArr } from '../../../../utils/reportUtils.js'
  export default {
    name: 'business_report_analyse',
    data () {
      return {
        id: 'business_report_analyse',
        title: this.$t('report.businessReportAnalyse'),
        loading: false,
        query: {},
        dialogVisible: false,
        selectedAgentList: [],
        businessFlowOptions: [],
        serverData: [],
        headOptions: { Config: [], data: [] },
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
          title: { text: this.$t('report.businessReportAnalyse') },
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
          item.flow = this.getBusinessFlowName(item.flow)
          item.finishRate = `${item.finishRate}%`
          item.finishTimeAvg = getFormatTimeBySecond(item.finishTimeAvg)
          item.processTimeAvg = getFormatTimeBySecond(item.processTimeAvg)
          item.waitTimeAvg = getFormatTimeBySecond(item.waitTimeAvg)
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
          flow: this.$t('report.total'),
          finish: 0,
          finishTimeCount: 0,
          processCount: 0,
          processTimeCount: 0,
          waitTimeCount: 0,
          pickCount: 0
        }

        for (let i = 0; i < headerConfig.length; i++) {
          for (let j = 0; j < datas.length; j++) {
            if (!isNaN(datas[j][headerConfig[i].name])) {
              if ((headerConfig[i].name in total) === false) {
                total[headerConfig[i].name] = 0
              }
              total[headerConfig[i].name] += datas[j][headerConfig[i].name]
            }

            if (headerConfig[i].name === 'finishTimeAvg') {
              total.finishTimeCount += datas[j]['finishTimeCount']
            } else if (headerConfig[i].name === 'processTimeAvg') {
              total.processTimeCount += datas[j]['processTimeCount']
              total.processCount += datas[j]['processCount']
            } else if (headerConfig[i].name === 'waitTimeAvg') {
              total.waitTimeCount += datas[j]['waitTimeCount']
              total.pickCount += datas[j]['pickCount']
            }
          }
        }

        // 完成率
        total.finishRate = total.create > 0 ? (total.finish * 100 / total.create).toFixed(0) : 0
        total.finishRate = `${total.finishRate}%`
        // 平均完成时长
        total.finishTimeAvg = total.finish > 0 ? Math.round(total.finishTimeCount / total.finish) : 0
        total.finishTimeAvg = getFormatTimeBySecond(total.finishTimeAvg)
        // 平均处理时长
        total.processTimeAvg = total.processCount > 0 ? Math.round(total.processTimeCount / total.processCount) : 0
        total.processTimeAvg = getFormatTimeBySecond(total.processTimeAvg)
        // 平均等待时长
        total.waitTimeAvg = total.pickCount > 0 ? Math.round(total.waitTimeCount / total.pickCount) : 0
        total.waitTimeAvg = getFormatTimeBySecond(total.waitTimeAvg)

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
          if (item.name === 'flow') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          if (item.name === 'finishTimeAvg' || item.name === 'processTimeAvg' || item.name === 'waitTimeAvg') {
            serie.tooltip = { valueSuffix: 's' }
          } else if (item.name === 'finishRate') {
            serie.tooltip = { valueSuffix: '%' }
          }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push(this.getBusinessFlowName(datas[i].flow))
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
      getBusinessFlowName (id) {
        for (let i = 0; i < this.businessFlowOptions.length; i++) {
          if (this.businessFlowOptions[i].value === id) {
            return this.businessFlowOptions[i].label
          }
        }
        return ''
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
          let message = checkTime(query.StartTime, query.EndTime, false, true) // 校验类型与时间
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
        this.$store.dispatch('queryBusinessAnalyseReport', data).then(() => {
          // 表头
          this.headOptions = deepClone(this.$store.state.report.business.analyseReport.tableHeader) || this.headOptions

          this.serverData = deepClone(this.$store.state.report.business.analyseReport.data) || this.serverData
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportBusinessAnalyse',
          Query: { reportType: this.id, user: this.$store.state.session.user._id }
        }
        let query = formatDateQuery(deepClone(this.query))
        if (query.timeType === 'other') {
          let message = checkTime(query.StartTime, query.EndTime, false, true) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        if (this.selectedAgentList.length > 0) {
          query.selectedAgentList = this.selectedAgentList.join(',')
        }
        Object.assign(data.Query, query)
        this.$store.dispatch('exportBusinessAnalyseReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '工单整体分析报表' + searchTime(this.query), id: this.id})
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'businessFlow' }).then((businessFlow) => {
        this.businessFlowOptions = businessFlow.map(flow => ({ label: flow.name, value: flow._id }))
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .business_report_analyse
    .tab
      .deploy
        .tip
          margin-left 0px
        .item
          cursor pointer
          &:hover
            color #1abb9c
    .ichars
      margin-top 20px
    .top
      .el-row
        padding-left 16px
    .deploy
      .te
        cursor pointer
</style>
