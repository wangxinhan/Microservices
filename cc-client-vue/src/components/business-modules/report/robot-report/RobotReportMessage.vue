<template>
  <div class="analyse">
    <div class="top">
      <affix :label="$t('report.robotReportMessageSearch')"></affix>
      <div class="search">
        <template>
          <date-time type="other" :query="timeQuery"></date-time>
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
        <report-table :data="tableData" :config="headOptions"></report-table>
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
  import dateTime from '../base/datetimeo.vue'
  import reportTable from '../base/reportTable.vue'
  import { deepClone } from '../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, searchTime, colorConfigArr } from '../../../../utils/reportUtils.js'
  export default {
    name: 'robot_report_message',
    data () {
      return {
        id: 'robot_report_message',
        title: this.$t('report.robotReportMessage'),
        timeQuery: {},
        dialogVisible: false,
        serverData: [],
        headOptions: [{
          'order': '1',
          'name': 'time',
          'displayname': '时间',
          'show': true
        }, {
          'order': '2',
          'name': 'sessionCount',
          'displayname': '对话数',
          'show': true
        }, {
          'order': '3',
          'name': 'answerCount',
          'displayname': '回答总数',
          'show': true
        }, {
          'order': '4',
          'name': 'commonCount',
          'displayname': '寒暄回答数',
          'show': true
        }, {
          'order': '5',
          'name': 'businessCount',
          'displayname': '业务回答数',
          'show': true
        }, {
          'order': '6',
          'name': 'businessLeadsCount',
          'displayname': '业务引导回答数',
          'show': true
        }, {
          'order': '7',
          'name': 'unknownCount',
          'displayname': '未知回答数',
          'show': true
        }],
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
          title: { text: this.$t('report.robotReportMessage') },
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
        return data
      },
      highchartsOptions () {
        let options = deepClone(this.highchartsDefaultOptions)
        if (!this.serverData || this.serverData.length === 0) {
          return options
        }

        let headerConfig = this.headOptions
        let datas = this.serverData
        let categoriesArray = []
        let seriesArray = []

        headerConfig.forEach(item => {
          if (!item.show) {
            return
          }
          if (item.name === 'time') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push(datas[i].time)
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
        let start = this.timeQuery.StartTime ? this.timeQuery.StartTime.replace(/-/g, '').replace(/:/g, '').replace(/\s/g, '') : 0
        let end = this.timeQuery.EndTime ? this.timeQuery.EndTime.replace(/-/g, '').replace(/:/g, '').replace(/\s/g, '') : 0
        if (start && end) {
          if (parseInt(end) < parseInt(start)) {
            this.$message.error(this.$t('report.queryTimeErr'))
            return
          }
        }
        this.loading = true
        let data = {
          reportType: this.id,
          account: this.$store.state.session.user.account,
          query: { reportType: this.id }
        }
        let query = formatDateQuery(deepClone(this.timeQuery))
        Object.assign(data.query, query)
        this.$store.dispatch('queryRobotMessageReport', data).then(() => {
          // 表头
          this.serverData = deepClone(this.$store.state.report.robot.messageReport.data)
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportRobotMessageExcel',
          Query: {reportType: this.id, accountId: this.$store.state.session.user.account}
        }
        let query = formatDateQuery(deepClone(this.timeQuery))
        Object.assign(data.Query, query)
        this.$store.dispatch('exportRobotMessageExcel', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '机器人消息报表' + searchTime(this.timeQuery), id: this.id})
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
