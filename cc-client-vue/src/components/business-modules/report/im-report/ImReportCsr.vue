<template>
  <div class="csr" v-loading="loading">
    <div class="top">
      <affix :label="$t('report.imReportCsrSearch')"></affix>
      <div class="search">
        <template>
          <date-time type="other" :query="query"></date-time>
        </template>
        <div class="agen">
          <span class="age">{{$t('public.agent')}}：</span>
          <el-select size="small" v-model.trim="selectedAgentList" multiple filterable :placeholder="$t('public.pickAgent')">
            <el-option
              v-for="item in agentOptions"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
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
        <div class="deploy">
          <span class="tip"><i class="iconfont icon-tixingweizhi"></i></span>
          <el-tooltip class="item" effect="dark" placement="right">
            <div slot="content">
              {{$t('report.participationRate')}}
            </div>
            <el-button>{{$t('report.description')}}</el-button>
          </el-tooltip>
        </div>
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
  import { deepClone } from '../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, checkTime, searchTime, colorConfigArr } from '../../../../utils/reportUtils.js'
  export default {
    name: 'im_report_csr',
    data () {
      return {
        id: 'im_report_csr',
        title: this.$t('report.imReportCsr'),
        loading: false,
        query: {},
        dialogVisible: false,
        selectedAgentList: [],
        agentOptions: [],
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
          title: { text: this.$t('report.imReportCsr') },
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
          item.agentName = this.getAgentName(item.agentId)
          item.appraiseRate = `${item.appraiseRate}%`
          for (let key in item) {
            if (key !== 'agentName' && key !== 'sessionCount' && key !== 'totalAppraiseCount' && key !== 'agentId' && key !== 'appraiseRate') {
              item[key] = item.totalAppraiseCount > 0 ? (item[key] * 100 / item.totalAppraiseCount).toFixed(1) : '0.0'
              item[key] = `${item[key]}%`
            }
          }
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
          agentName: this.$t('report.total'),
          totalAppraiseCount: 0,
          sessionCount: 0
        }

        for (let i = 0; i < headerConfig.length; i++) {
          for (let j = 0; j < datas.length; j++) {
            if (!isNaN(datas[j][headerConfig[i].name])) {
              if ((headerConfig[i].name in total) === false) {
                total[headerConfig[i].name] = 0
              }
              total[headerConfig[i].name] += datas[j][headerConfig[i].name]
            }
          }
        }

        // 参评率
        total.appraiseRate = total.sessionCount > 0 ? ((total.totalAppraiseCount / total.sessionCount) * 100).toFixed(1) : '0.0'
        total.appraiseRate = `${total.appraiseRate}%`
        // 不同评价的概率
        for (let key in total) {
          if (key !== 'agentName' && key !== 'sessionCount' && key !== 'totalAppraiseCount' && key !== 'agentId' && key !== 'appraiseRate') {
            total[key] = total.totalAppraiseCount > 0 ? (total[key] * 100 / total.totalAppraiseCount).toFixed(1) : '0.0'
            total[key] = `${total[key]}%`
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

        headerConfig.forEach(item => {
          if (!item.show) {
            return
          }
          if (item.name === 'agentName') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          if (item.name !== 'sessionCount' && item.name !== 'totalAppraiseCount') {
            serie.tooltip = { valueSuffix: '%' }
          }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push(this.getAgentName(datas[i].agentId))
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
      getAgentName (id) {
        for (let i = 0; i < this.agentOptions.length; i++) {
          if (this.agentOptions[i].value === id) {
            return this.agentOptions[i].label
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
          let message = checkTime(query.StartTime, query.EndTime, true, true) // 校验类型与时间
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
        this.$store.dispatch('queryImCsrReport', data).then(() => {
          // 表头
          this.headOptions = deepClone(this.$store.state.report.im.csrReport.tableHeader) || this.headOptions

          this.serverData = deepClone(this.$store.state.report.im.csrReport.data) || this.serverData
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportImCSR',
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
        if (this.selectedAgentList.length > 0) {
          query.selectedAgentList = this.selectedAgentList.join(',')
        }
        Object.assign(data.Query, query)
        this.$store.dispatch('exportImCsrReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '在线咨询座席满意度报表' + searchTime(this.query), id: this.id})
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'agents' }).then(agents => {
        this.agentOptions = agents.map(agent => ({ label: `${agent.displayName}[${agent.exten}]`, value: agent._id }))
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .csr
    .tab
      .deploy
        .tip
          margin-left 0px
    .agen
      margin-top 20px
    .age
      display inline-block
      height 36px
      line-height 36px
      margin 0 16px 0 18px
</style>
