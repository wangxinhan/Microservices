<template>
  <div class="analyse">
    <div class="top">
      <affix :label="$t('report.mailSortSea')"></affix>
      <div class="search">
        <template>
          <date-time type="" :query="query"></date-time>
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
    <div :id = "id">
      <el-row class="ichars">
        <highcharts :options="highchartsOptions"></highcharts>
      </el-row>
      <div class="tab">
        <report-table :data="tableData" :sum="totalData" :config="headOptions.Config"></report-table>
      </div>
    </div>
    <header-option :option="headOptions" :type="id"></header-option>
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
  import headerOption from '../base/headerOption.vue'
  import { deepClone, getFormatTimeBySecond } from '../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, searchTime, colorConfigArr } from '../../../../utils/reportUtils.js'
  export default {
    name: 'mail_report_category',
    data () {
      return {
        id: 'mail_report_category',
        title: this.$t('report.mailReportCategory'),
        query: {},
        dialogVisible: false,
        serverData: [],
        headOptions: {},
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
          title: { text: this.$t('report.mailReportCategory') },
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
          categoryName: this.$t('report.total'),
          sessionTotalTimeLength: 0,
          firstResponseTotalTimeLength: 0,
          responseTotalCount: 0,
          sessionCompleteCount: 0
        }

        for (let i = 0; i < headerConfig.length; i++) {
          for (let j = 0; j < datas.length; j++) {
            if (!isNaN(datas[j][headerConfig[i].name])) {
              if ((headerConfig[i].name in total) === false) {
                total[headerConfig[i].name] = 0
              }
              total[headerConfig[i].name] += datas[j][headerConfig[i].name]
            }
            if (headerConfig[i].name === 'averageFirstResponseTimeLength') {
              total.firstResponseTotalTimeLength += datas[j]['firstResponseTotalTimeLength']
              total.responseTotalCount += datas[j]['responseTotalCount']
            } else if (headerConfig[i].name === 'sessionAverageTimeLength') {
              total.sessionTotalTimeLength += datas[j]['sessionTotalTimeLength']
              total.sessionCompleteCount += datas[j]['sessionCompleteCount']
            }
          }
        }

        // 平均会话时长
        total.sessionAverageTimeLength = total.sessionCompleteCount > 0 ? Math.round(total.sessionTotalTimeLength / total.sessionCompleteCount) : 0
        total.sessionAverageTimeLength = getFormatTimeBySecond(total.sessionAverageTimeLength)
        // 平均首次响应时长
        total.averageFirstResponseTimeLength = total.responseTotalCount > 0 ? Math.round(total.firstResponseTotalTimeLength / total.responseTotalCount) : 0
        total.averageFirstResponseTimeLength = getFormatTimeBySecond(total.averageFirstResponseTimeLength)
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
          if (item.name === 'categoryName') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          if (item.name === 'sessionAverageTimeLength' || item.name === 'averageFirstResponseTimeLength') {
            serie.tooltip = { valueSuffix: 's' }
          }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push((datas[i].categoryName))
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
        Object.assign(data.query, query)
        this.loading = true
        this.$store.dispatch('queryMailCategoryReport', data).then(() => {
          // 表头
          this.headOptions = deepClone(this.$store.state.report.email.categoryReport.tableHeader)

          this.serverData = deepClone(this.$store.state.report.email.categoryReport.data)
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportMailCategory',
          Query: {reportType: this.id, user: this.$store.state.session.user._id}
        }
        let query = formatDateQuery(deepClone(this.query))
        Object.assign(data.Query, query)
        this.$store.dispatch('exportMailCategoryReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '邮件分类报表' + searchTime(this.query), id: this.id})
      }
    },
    beforeMount () {
      this.$nextTick(function () {
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .analyse
    .deploy
      .tex
      .te
        cursor pointer
      .set
        margin-right 10px
        position relative
        top 2px
</style>
