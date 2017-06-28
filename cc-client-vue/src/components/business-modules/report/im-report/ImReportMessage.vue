<template>
  <div class="message" v-loading="loading">
    <div class="top">
      <affix :label="$t('report.imReportMessageSearch')"></affix>
      <div class="search">
        <template>
          <date-time type="other_half_hour" :query="query"></date-time>
        </template>
        <div class="accs">
          <span class="access">{{$t('report.imAccessId')}}：</span>
          <el-select size="small" v-model.trim="selectedAccessIdList" multiple filterable :placeholder="$t('report.searchByName')">
            <el-option
              v-for="item in accessIdOptions"
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
        <span class="inquiry fr" @click.stop="changeHighChartsType">{{comparisonBtnLabel}}</span>
        <span class="inquiry fr pdf" @click.stop="exportXls">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" @click.stop="exportPdf">{{$t('report.exportPDF')}}</span>
      </div>
    </div>
    <div :id="id">
      <el-row class="ichars">
        <highcharts class="ichar" :class="{'hide' : highchartsType != 'lateral'}" :options="highchartsOptionsX"></highcharts>
        <highcharts class="ichar" :class="{'hide' : highchartsType == 'lateral'}" :options="highchartsOptionsY"></highcharts>
      </el-row>
      <div class="tab">
        <div class="deploy">
          <span class="set"><i class="iconfont icon-peizhi"></i></span>
          <span class="tex" @click.stop="isHeaderConfigShow=!isHeaderConfigShow">{{$t('report.setHeaderConfig')}}</span>
          <span class="tip"><i class="iconfont icon-tixingweizhi"></i></span>
          <el-tooltip class="item" effect="dark" placement="right" popper-class="reportTip">
            <div slot="content">
              {{$t('report.dealDialogNumber')}}<br>
              {{$t('report.sourceNumber')}}<br>
              {{$t('report.messageNumber')}}<br>
              {{$t('report.exchangeRate')}}<br>
              {{$t('report.averExchangeTime')}}<br>
              {{$t('report.averResTime')}}<br>
              {{$t('report.queueGiveUpNumber')}}
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
    <header-option v-if="isHeaderConfigShow" :show="isHeaderConfigShow" :option="headOptionsShow" :type="id" v-on:close="close"></header-option>
  </div>
</template>
<script>
  import affix from '../../../ui-modules/affix/Affix.vue'
  import dateTime from '../base/datetime.vue'
  import reportTable from '../base/reportTable.vue'
  import headerOption from '../base/headerOption.vue'
  import { deepClone, getFormatTimeBySecond } from '../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, checkTime, searchTime, colorConfigArr } from '../../../../utils/reportUtils.js'
  export default {
    name: 'im_report_message',
    data () {
      return {
        id: 'im_report_message',
        title: this.$t('report.imReportMessage'),
        loading: false,
        query: {},
        dialogVisible: false,
        platformOptions: [
          { label: this.$t('report.imPlatform.pc'), value: 'pc' },
          { label: this.$t('report.imPlatform.wap'), value: 'wap' },
          { label: this.$t('report.imPlatform.sdk'), value: 'sdk' },
          { label: this.$t('report.imPlatform.weixin'), value: 'weixin' }
        ],
        accessIdOptions: [],
        selectedAccessIdList: [],
        headOptions: { Config: [], data: [] },
        headOptionsShow: { Config: [], data: [] },
        isHeaderConfigShow: false,
        serverData: [],
        highchartsType: 'lateral',
        comparisonBtnLabel: this.$t('report.lateralComparison'),
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
          title: { text: this.$t('report.imReportMessage') },
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
        // 接入名称和时间处理
        data.forEach(item => {
          item.platform = this.getPlatformName(item.accessId || item.platform)
          item.averageSessionTimeLength = getFormatTimeBySecond(item.averageSessionTimeLength)
          item.averageFirstResponseTimeLength = getFormatTimeBySecond(item.averageFirstResponseTimeLength)
          item.sessionRate = `${item.sessionRate}%`
        })

        data = data.filter(item => !!item.platform)

        return data
      },
      totalData () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let headerConfig = this.headOptions.Config || []
        let datas = this.serverData
        let total = {
          platform: this.$t('report.total'),
          sessionTotalTimeLength: 0,
          firstResponseTotalTimeLength: 0,
          finishSessionCount: 0,
          responseTotalCount: 0
        }

        for (let i = 0; i < headerConfig.length; i++) {
          if (headerConfig[i].name === 'platform') {
            continue
          }
          for (let j = 0; j < datas.length; j++) {
            if (!isNaN(datas[j][headerConfig[i].name])) {
              if ((headerConfig[i].name in total) === false) {
                total[headerConfig[i].name] = 0
              }
              total[headerConfig[i].name] += datas[j][headerConfig[i].name]
            }

            if (headerConfig[i].name === 'averageSessionTimeLength') {
              total.sessionTotalTimeLength += datas[j]['sessionTotalTimeLength']
              total.finishSessionCount += datas[j]['finishSessionCount']
            } else if (headerConfig[i].name === 'averageFirstResponseTimeLength') {
              total.firstResponseTotalTimeLength += datas[j]['firstResponseTotalTimeLength']
            } else if (headerConfig[i].name === 'sessionRate') {
              total.responseTotalCount += datas[j]['responseTotalCount']
            }
          }
        }

        // 平均对话时长
        total.averageSessionTimeLength = total.finishSessionCount > 0 ? Math.round(total.sessionTotalTimeLength / total.finishSessionCount) : 0
        total.averageSessionTimeLength = getFormatTimeBySecond(total.averageSessionTimeLength)
        // 对话率
        total.sessionRate = total.sessionCount ? Math.round((total.responseTotalCount / total.sessionCount) * 100) : 0
        total.sessionRate = `${total.sessionRate}%`
        // 平均首次响应时长
        total.averageFirstResponseTimeLength ? Math.round(total.firstResponseTotalTimeLength / total.responseTotalCount) : 0
        total.averageFirstResponseTimeLength = getFormatTimeBySecond(total.averageFirstResponseTimeLength)
        return [total]
      },
      highchartsOptionsX () {
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
          if (item.name === 'platform') {
            return
          }
          let serie = { name: item.displayname, data: [], valueName: item.name }
          if (item.name === 'averageSessionTimeLength' || item.name === 'averageFirstResponseTimeLength') {
            serie.tooltip = { valueSuffix: 's' }
          } else if (item.name === 'sessionRate') {
            serie.tooltip = { valueSuffix: '%' }
          }
          seriesArray.push(serie)
        })

        for (let i = 0; i < datas.length; i++) {
          categoriesArray.push(this.getPlatformName(datas[i].platform || datas[i].accessId))
          for (let j = 0; j < seriesArray.length; j++) {
            seriesArray[j].data.push(datas[i][seriesArray[j].valueName])
          }
        }
        options.xAxis.categories = categoriesArray
        options.series = seriesArray

        return options
      },
      highchartsOptionsY () {
        let options = deepClone(this.highchartsDefaultOptions)
        if (!this.serverData || this.serverData.length === 0) {
          return options
        }
        let headerConfig = this.headOptions.Config || []
        let datas = this.serverData
        let categoriesArray = []
        let seriesArray = []

        datas.forEach(item => {
          let serie = { name: this.getPlatformName(item.platform || item.accessId), data: [], valueName: item.platform || item.accessId }
          seriesArray.push(serie)
        })

        for (let i = 0; i < headerConfig.length; i++) {
          if (!headerConfig[i].show) {
            continue
          }
          if (headerConfig[i].name === 'platform') {
            continue
          }
          categoriesArray.push(headerConfig[i].displayname)
          for (let j = 0; j < seriesArray.length; j++) {
            for (let k = 0; k < datas.length; k++) {
              if (datas[k].platform === seriesArray[j].valueName || datas[k].accessId === seriesArray[j].valueName) {
                if (headerConfig[i].name === 'averageSessionTimeLength' || headerConfig[i].name === 'averageFirstResponseTimeLength') {
                  seriesArray[j].data.push({ y: datas[k][headerConfig[i].name], valueSuffix: 's' })
                } else if (headerConfig[i].name === 'sessionRate') {
                  seriesArray[j].data.push({ y: datas[k][headerConfig[i].name], valueSuffix: '%' })
                } else {
                  seriesArray[j].data.push(datas[k][headerConfig[i].name])
                }
              }
            }
          }
        }

        options.xAxis.categories = categoriesArray
        options.series = seriesArray

        return options
      }
    },
    methods: {
      getPlatformName (id) {
        for (let i = 0; i < this.platformOptions.length; i++) {
          if (this.platformOptions[i].value === id) {
            return this.platformOptions[i].label
          }
        }
        for (let i = 0; i < this.accessIdOptions.length; i++) {
          if (this.accessIdOptions[i].value === id) {
            return this.accessIdOptions[i].name
          }
        }
      },
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
        if (this.selectedAccessIdList.length > 0) {
          query.selectedAccessIdList = this.selectedAccessIdList.join(',')
        }
        Object.assign(data.query, query)
        this.loading = true
        this.$store.dispatch('queryImMessageReport', data).then(() => {
          // 表头
          this.headOptions = deepClone(this.$store.state.report.im.messageReport.tableHeader) || this.headOptions
          this.headOptionsShow = deepClone(this.$store.state.report.im.messageReport.tableHeader) || this.headOptionsShow

          this.serverData = deepClone(this.$store.state.report.im.messageReport.data) || this.serverData
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportImMessage',
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
        if (this.selectedAccessIdList.length > 0) {
          query.selectedAccessIdList = this.selectedAccessIdList.join(',')
        }
        Object.assign(data.Query, query)
        this.$store.dispatch('exportImMessageReport', data)
      },
      changeHighChartsType () {
        if (this.highchartsType === 'lateral') {
          this.highchartsType = 'longitudinal'
          this.comparisonBtnLabel = this.$t('report.lateralComparison')
        } else if (this.highchartsType === 'longitudinal') {
          this.highchartsType = 'lateral'
          this.comparisonBtnLabel = this.$t('report.longitudinalComparison')
        }
      },
      close (data) {
        if (data) {
          this.headOptions = deepClone(this.$store.state.report.im.messageReport.tableHeader)
        }
        this.headOptionsShow = deepClone(this.$store.state.report.im.messageReport.tableHeader)
        this.isHeaderConfigShow = false
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '在线咨询消息报表' + searchTime(this.query), id: this.id})
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'accessIds' }).then(accessIds => {
        this.accessIdOptions = accessIds.map(accessId => ({ label: `${accessId.name}[${accessId.platform}]`, name: accessId.name, platform: accessId.platform, value: accessId._id }))
        this.search()
      })
    },
    mounted () {
      let ichar = document.getElementsByClassName('ichar')
      let width = ichar[0].offsetWidth
      ichar[0].style.width = width + 'px'
      ichar[1].style.width = width + 'px'
    }
  }
</script>
<style lang="stylus" scoped>
  .hide
    position absolute
    width 100%
    z-index -40
    display none
  .message
    .accs
      margin 20px 0 0px 18px
    .access
      display inline-block
      height 36px
      line-height 36px
      margin-right 6px
</style>
