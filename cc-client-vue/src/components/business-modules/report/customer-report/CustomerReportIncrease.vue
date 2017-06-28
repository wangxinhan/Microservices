<template>
  <div class="increase" v-loading="loading">
    <div class="top">
      <affix :label="$t('report.customerReportIncreaseSearch')"></affix>
      <div class="search">
        <template>
          <date-time type="noDay" initShow="month" :query="query"></date-time>
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
  import { deepClone } from '../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, searchTime, colorConfigArr } from '../../../../utils/reportUtils.js'
  export default {
    name: 'customer_report_increase',
    data () {
      return {
        id: 'customer_report_increase',
        title: this.$t('report.customerReportIncrease'),
        loading: false,
        query: {},
        dialogVisible: false,
        timeType: 'month',
        sourceOptions: [],
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
          title: { text: this.$t('report.customerReportIncrease') },
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
          item.day = this.formatReportTime(item.day)
          for (let i = 0; i < this.sourceOptions.length; i++) {
            if (!item[this.sourceOptions[i].key]) {
              item[this.sourceOptions[i].key] = 0
            }
          }
        })

        return data
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
          if (item.name === 'day') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push(this.formatReportTime(datas[i].day))
          for (let j = 0; j < seriesArray.length; j++) {
            seriesArray[j].data.push(datas[i][seriesArray[j].valueName] || 0)
          }
        }

        options.xAxis.categories = categoriesArray
        options.series = seriesArray

        return options
      }
    },
    methods: {
      getSourceName (id) {
        for (let i = 0; i < this.sourceOptions.length; i++) {
          if (this.sourceOptions[i].key === id) {
            return this.sourceOptions[i].name
          }
        }
        return ''
      },
      formatReportTime (reportTime) {
        if (this.timeType === 'month') {
          return `${reportTime.substring(0, 4)}-${reportTime.substring(4, 6)}-${reportTime.substring(6, 8)}`
        } else if (this.timeType === 'year') {
          return `${reportTime.substring(0, 4)}-${reportTime.substring(4, 6)}`
        }
      },
      search () {
        this.loading = true
        let data = {
          reportType: this.id,
          account: this.$store.state.session.user.account,
          query: { reportType: this.id },
          keys: this.sourceOptions.filter(source => source.key !== 'unknow').map(source => source.key)
        }
        let query = formatDateQuery(deepClone(this.query))

        Object.assign(data.query, query)
        this.$store.dispatch('queryCustomerIncreaseReport', data).then(() => {
          // 表头
          this.headOptions = {
            Config: [
              { order: 1, name: 'day', displayname: this.$t('public.time'), show: true },
              ...this.sourceOptions.map((source, index) => ({ order: index + 2, name: source.key, displayname: source.name, show: true }))
            ]
          }

          this.timeType = query.timeType
          this.serverData = deepClone(this.$store.state.report.customer.increaseReport.data) || this.serverData
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportCustomerIncrease',
          Query: { reportType: this.id, user: this.$store.state.session.user._id }
        }
        let query = formatDateQuery(deepClone(this.query))
        Object.assign(data.Query, query)
        this.$store.dispatch('exportCustomerIncreaseReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '客户来源分析报表' + searchTime(this.query), id: this.id})
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'custTmpls' }).then(custTmpls => {
        this.sourceOptions = custTmpls[0].source.filter(source => source.key !== 'unknow')
        this.sourceOptions.push({ key: 'unknow', name: this.$t('customer.unknownSource') })
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  #customer_report_increase
  .increase
    .deploy
      .tex
      .te
        cursor pointer
      .set
        margin-right 10px
        position relative
        top 2px
</style>
