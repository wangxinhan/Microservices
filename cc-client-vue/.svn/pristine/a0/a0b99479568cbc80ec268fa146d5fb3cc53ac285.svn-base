<template>
  <div class="analyse" v-loading="loading">
    <div class="top">
      <affix :label="$t('report.imReportBusinessAnalyseSearch')"></affix>
      <div class="search">
          <template>
            <date-time type="other_half_hour" :query="query"></date-time>
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
  import headerOption from '../base/headerOption.vue'
  import { deepClone } from '../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, checkTime, searchTime, colorConfigArr } from '../../../../utils/reportUtils.js'
  export default {
    name: 'im_report_business_analyse',
    data () {
      return {
        id: 'im_report_business_analyse',
        title: this.$t('report.imReportBusinessAnalyse'),
        loading: false,
        query: {},
        serverData: [],
        headOptions: { Config: [], data: [] },
        dialogVisible: false,
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
          title: { text: this.$t('report.imReportBusinessAnalyse') },
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
      finishOptions () {
        let channelDic = this.$store.state.session.dicMap.channelDic
        for (let i = 0; i < channelDic.length; i++) {
          if (channelDic[i].type === 'webchat') {
            return this.initFinishName(channelDic[i].options)
          }
        }
        return {}
      },
      tableData () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let data = deepClone(this.serverData)
        data.forEach(item => {
          item.consultType = this.finishOptions[item.consultType] || this.$t('report.imReportBusinessAnalyseDeletedType')
          item.consultTotal = (item.pc || 0) + (item.sdk || 0) + (item.weixin || 0) + (item.wap || 0)
        })

        return data
      },
      totalData () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let headerConfig = this.headOptions.Config || []
        let datas = this.serverData
        let total = { consultType: this.$t('report.total') }

        for (let i = 0; i < headerConfig.length; i++) {
          for (let j = 0; j < datas.length; j++) {
            datas[j].consultTotal = (datas[j].pc || 0) + (datas[j].sdk || 0) + (datas[j].weixin || 0) + (datas[j].wap || 0)
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
        let total = []

        headerConfig.forEach(item => {
          if (!item.show) {
            return
          }
          if (item.name === 'consultType' || item.name === 'consultTotal') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push(this.finishOptions[datas[i].consultType] || this.$t('report.imReportBusinessAnalyseDeletedType'))
          let t = 0
          for (let j = 0; j < seriesArray.length; j++) {
            seriesArray[j].data.push(datas[i][seriesArray[j].valueName])
            t += datas[i][seriesArray[j].valueName]
          }
          total.push(t)
        }
        seriesArray.push({name: this.$t('report.total2'), data: total, valueName: 'consultTotal'})

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
          query: { reportType: this.id }
        }
        let query = formatDateQuery(deepClone(this.query))
        if (query.timeType === 'other_half_hour') {
          let message = checkTime(query.StartTime, query.EndTime, true, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        Object.assign(data.query, query)
        this.loading = true
        this.$store.dispatch('queryImBusinessAnalyseReport', data).then(() => {
          // 表头
          this.headOptions = deepClone(this.$store.state.report.im.businessAnalyseReport.tableHeader) || this.headOptions
          if (this.headOptions.Config && this.headOptions.Config.length > 0) {
            this.headOptions.Config.push({
              order: '99',
              name: 'consultTotal',
              displayname: this.$t('report.total2'),
              show: true
            })
          }

          this.serverData = deepClone(this.$store.state.report.im.businessAnalyseReport.data) || this.serverData
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportImBusiness',
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
        this.$store.dispatch('exportImBusinessAnalyseReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '在线咨询业务分析报表' + searchTime(this.query), id: this.id})
      },
      initFinishName (finishOption) {
        let finishKeys = {
          add_black: this.$t('report.addBlack')
        }
        for (let i = 0; i < finishOption.length; i++) {
          finishKeys[finishOption[i].key] = finishOption[i].name
          let level2 = deepClone(finishOption[i].options)
          if (level2) {
            for (let m = 0; m < level2.length; m++) {
              level2[m].name = finishOption[i].name + '->' + level2[m].name
              finishKeys[level2[m].key] = level2[m].name
              let level3 = deepClone(level2[m].options)
              if (level3) {
                for (let n = 0; n < level3.length; n++) {
                  level3[n].name = level2[m].name + '->' + level3[n].name
                  finishKeys[level3[n].key] = level3[n].name
                }
              }
            }
          }
        }
        return finishKeys
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'channelDic' }).then(channelDic => {
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
</style>
