<template>
  <div class="searchEngine" v-loading="loading">
    <div class="top">
      <affix :label="$t('report.imReportSourceFromSearchEngineSearch')"></affix>
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
        <el-col :span="24">
          <highcharts :options="highchartsOptions" style="width:600px; margin:0 auto; height:400px"></highcharts>
        </el-col>
      </el-row>
      <div class="tab">
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
  import affix from '../../../../ui-modules/affix/Affix.vue'
  import dateTime from '../../base/datetime.vue'
  import reportTable from '../../base/reportTable.vue'
  import { deepClone } from '../../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, searchTime, checkTime, colorConfigArr } from '../../../../../utils/reportUtils.js'
  export default {
    name: 'searchEngine',
    data () {
      return {
        id: 'im_report_session_seoSource',
        title: this.$t('report.imReportSourceFromSearchEngine'),
        loading: false,
        query: {},
        serverData: [],
        headOptions: { Config: [], data: [] },
        dialogVisible: false,
        highchartsDefaultOptions: {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          colors: colorConfigArr,
          title: { text: this.$t('report.imReportSourceFromSearchEngine') },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {}
              },
              showInLegend: true
            }
          },
          legend: { align: 'center', verticalAlign: 'top', y: 30 },
          credits: { enabled: false },
          series: [{
            type: 'pie',
            name: this.$t('report.percentage'),
            data: []
          }]
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

        return data
      },
      highchartsOptions () {
        let options = deepClone(this.highchartsDefaultOptions)
        if (!this.serverData || this.serverData.length === 0) {
          return options
        }

        let datas = this.serverData
        let seriesArray = []

        for (let i = 0; i < datas.length; i++) {
          seriesArray.push([datas[i].seoSource, datas[i].sessionCount])
        }

        options.series[0].data = seriesArray

        return options
      }
    },
    methods: {
      search () {
        let data = {
          reportType: this.id,
          account: this.$store.state.session.user.account,
          query: { reportType: this.id }
        }
        let query = formatDateQuery(deepClone(this.query))
        if (query.timeType === 'other') {
          let message = checkTime(query.StartTime, query.EndTime, true, true) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        Object.assign(data.query, query)
        this.loading = true
        this.$store.dispatch('queryImSessionFromReport', data).then(() => {
          // 表头
          this.headOptions = deepClone(this.$store.state.report.im.sessionFromReport[this.id].tableHeader) || this.headOptions

          this.serverData = deepClone(this.$store.state.report.im.sessionFromReport[this.id].data) || this.serverData
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportImSourceAnalyse',
          Query: {
            reportType: this.id,
            includeSubordinate: this.includeSubordinate,
            user: this.$store.state.session.user._id
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
        Object.assign(data.Query, query)
        this.$store.dispatch('exportImSessionFromReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '搜索引擎报表' + searchTime(this.query), id: this.id})
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
  .searchEngine
    .tab
    .deploy
      .tex
      .te
        cursor pointer
      .set
        margin-right 10px
        position relative
        top 2px
</style>
