<template>
  <div class="business_report_agent" v-loading="loading">
    <div class="top">
      <affix :label="$t('report.businessReportAgentSearch')"></affix>
      <div class="search">
        <template>
          <date-time type="other" :query="query"></date-time>
        </template>
        <div class="skill">
          <span class="ski">{{$t('public.agent')}} :</span>
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
          <el-tooltip class="item" effect="dark" placement="right" popper-class="reportTip">
            <div slot="content">
              {{$t('report.creatBusinessNumber')}} <br>
              {{$t('report.receiveBusinessNumber')}} <br>
              {{$t('report.dealBusiness')}} <br>
              {{$t('report.averDealTime')}} <br>
              {{$t('report.distributionBusiNum')}}
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
    name: 'business_report_agent',
    data () {
      return {
        id: 'business_report_agent',
        title: this.$t('report.businessReportAgent'),
        loading: false,
        dialogVisible: false,
        query: {},
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
          title: { text: this.$t('report.businessReportAgent') },
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
          item.agent = this.getAgentName(item.agent)
          item.processTimeAvg = getFormatTimeBySecond(item.processTimeAvg)
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
          agent: this.$t('report.total'),
          processTimeCount: 0
        }

        for (let i = 0; i < headerConfig.length; i++) {
          for (let j = 0; j < datas.length; j++) {
            if (!isNaN(datas[j][headerConfig[i].name])) {
              if ((headerConfig[i].name in total) === false) {
                total[headerConfig[i].name] = 0
              }
              total[headerConfig[i].name] += datas[j][headerConfig[i].name]
            }

            if (headerConfig[i].name === 'processTimeAvg') {
              total.processTimeCount += datas[j]['processTimeCount']
            }
          }
        }

        // 平均处理时长
        total.processTimeAvg = total.process > 0 ? Math.round(total.processTimeCount / total.process) : 0
        total.processTimeAvg = getFormatTimeBySecond(total.processTimeAvg)

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
          if (item.name === 'agent') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          if (item.name === 'processTimeAvg') {
            serie.tooltip = { valueSuffix: 's' }
          }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push(this.getAgentName(datas[i].agent))
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
          let message = checkTime(query.StartTime, query.EndTime, false, true) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        this.loading = true
        if (this.selectedAgentList.length > 0) {
          query.selectedAgentList = this.selectedAgentList.join(',')
        }
        Object.assign(data.query, query)
        this.$store.dispatch('queryBusinessAgentReport', data).then(() => {
          // 表头
          this.headOptions = deepClone(this.$store.state.report.business.agentReport.tableHeader) || this.headOptions

          this.serverData = deepClone(this.$store.state.report.business.agentReport.data) || this.serverData
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportBusinessAgent',
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
        this.$store.dispatch('exportBusinessAgentReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '工单座席工作量报表' + searchTime(this.query), id: this.id})
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
  .business_report_agent
    .tab
      .deploy
        .tip
          margin-left 0px
        .item
          cursor pointer
          &:hover
            color #1abb9c
    #business_report_agent
    .el-select
      display inline-block
    .top
      .sear
        margin-left 0
      .skill
        margin-top 16px
        .ski
          margin-right 22px
          margin-left 18px
    .deploy
      .tex
        margin-left 10px
    .el-col-1
      height 36px
      line-height 36px
</style>
