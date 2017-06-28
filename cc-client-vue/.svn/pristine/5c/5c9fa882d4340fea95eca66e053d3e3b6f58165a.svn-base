<template>
  <div class="dialout">
    <div class="top">
      <affix :label="$t('report.calloutAreaSea')"></affix>
      <div class="search">
        <template>
          <date-time type="other_half_hour" :query="query"></date-time>
        </template>
        <div class="serve">
          <span class="prov">{{$t('public.province')}}：</span>
          <el-checkbox :indeterminate="isIndeterminate" v-model.trim="checkAll" @change="handleCheckAllChange">{{$t('public.checkAll')}}</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model.trim="checkedProvinces" @change="handleCheckedProvincesChange">
            <el-checkbox v-for="province in provinces" :label="province" :name="province">{{province}}</el-checkbox>
          </el-checkbox-group>
          <span class="inquiry fr find" v-on:click.stop="search">{{$t('public.search2')}}</span>
          <div class="clear"></div>
      </div>
      </div>
      <affix :label="$t('report.calloutAreaRe')"></affix>
      <div class="export">
        <span class="inquiry fr" v-on:click.stop="exportExcel">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" v-on:click.stop="exportPdf">{{$t('report.exportPDF')}}</span>
      </div>
    </div>
    <div class="tab" :id="id">
      <div class="deploy">
        <i class="iconfont icon-peizhi"></i>
        <span class="tex" @click.stop="config">{{$t('report.setHeaderConfig')}}</span>
      </div>
      <report-table :data="serveNumData" :sum="sum" :config="headOptions.Config"> </report-table>
  </div>
  <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('report.reportExportHelp')" v-model="dialogVisible" size="tiny">
    <span>{{$t('report.reportExportTipTitle')}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
      <el-button type="primary" @click="confirm">{{$t('public.confirm')}}</el-button>
    </span>
  </el-dialog>
  <header-option v-if="isShow" :show="isShow" :option="headOptionsShow" type="call_report_dialout_area" v-on:close="close"></header-option>
  </div>
</template>
<script>
  import affix from '../../../ui-modules/affix/Affix.vue'
  import dateTime from '../base/datetime.vue'
  import headerOption from '../base/headerOption.vue'
  import {exportReportPdf, checkTime, searchTime} from '../../../../utils/reportUtils.js'
  import {deepClone, getCallTimeLength} from '../../../../utils/m7Utils.js'
  import reportTable from '../base/reportTable.vue'
  export default {
    name: 'dialout',
    data () {
      return {
        id: 'call_report_dialout_area',
        query: {},
        isShow: false,
        dialogVisible: false,
        checkAll: true,
        checkedProvinces: [],
        isIndeterminate: false,
        headOptions: {},
        headOptionsShow: {},
        provinces: ['未知号段', '北京市', '天津市', '上海市', '重庆市', '澳门', '福建省', '广东省', '广西省', '甘肃省', '贵州省', '河北省', '河南省', '湖北省', '湖南省', '海南省', '黑龙江省', '浙江省', '江苏省', '江西省', '吉林省', '辽宁省', '内蒙古', '宁夏', '青海省', '山东省', '山西省', '陕西省', '四川省', '台湾省', '新疆', '西藏', '香港', '云南省'],
        sum: [],
        serveNumData: []
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
        if (this.checkedProvinces.length === 0) {
          this.open4()
        }
        let data = {reportType: 'call_report_dialout_area'}
        let self = this
        this.provinces.forEach(function (item) {
          if (self.checkedProvinces.indexOf(item) >= 0) {
            self.query['Province_' + item] = true
          } else {
            self.query['Province_' + item] = false
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
        this.$store.dispatch('queryCallDialoutAreaReport', data).then(() => {
          this.headOptions = this.$store.state.report.call.callDialoutAreaReport.tableHeader
          this.sum = [{Province: '合计'}]
          let tempData = deepClone(this.$store.state.report.call.callDialoutAreaReport.data)
          for (let i in tempData) {
            let item = tempData[i]
            for (let j in item) {
              if (this.sum[0][j] === undefined) {
                this.sum[0][j] = 0
              }
              if (j !== 'Province') {
                this.sum[0][j] += item[j]
              }
            }
            item.CallTimeLength = getCallTimeLength(item.CallTimeLength)
            item.CallOutAverageTimeLength = getCallTimeLength(item.CallOutAverageTimeLength)
            if (item.CallOutAcceptRate === 0) {
              item.CallOutAcceptRate += '%'
            }
          }
          if (tempData.length > 0) {
            this.sum[0].CallOutAcceptRate = this.sum[0].AccessCount === 0 ? '0%' : Math.round((this.sum[0].DealingCount / this.sum[0].AccessCount) * 100) + '%'
            this.sum[0].CallOutAverageTimeLength = getCallTimeLength(this.sum[0].CallTimeLength / this.sum[0].DealingCount)
            this.sum[0].CallTimeLength = getCallTimeLength(this.sum[0].CallTimeLength)
          }
          this.serveNumData = tempData
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
      config () {
        this.$store.dispatch('getReportTableHeader', 'call_report_dialout_area').then((res) => {
          this.headOptionsShow = res
          this.isShow = !this.isShow
        })
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '通话呼出地域分布报表' + searchTime(this.query), id: this.id})
      },
      exportExcel () {
        let self = this
        this.provinces.forEach(function (item) {
          if (self.checkedProvinces.indexOf(item) >= 0) {
            self.query['Province_' + item] = true
          } else {
            self.query['Province_' + item] = false
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
        myQuery.reportType = 'call_report_dialout_area'
        myQuery.accountId = this.$store.state.session.user.account
        myQuery.type = 'ReportDialoutAreaExport'
        myQuery.user = this.$store.state.session.user._id
        let data = {
          Method: 'ReportDialoutAreaExport',
          Query: myQuery
        }
        this.$store.dispatch('exportCallDialoutAreaReport', data).then(() => {
        })
      },
      handleCheckAllChange (event) {
        this.checkedProvinces = this.checkAll ? this.provinces : []
        this.isIndeterminate = false
      },
      handleCheckedProvincesChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.provinces.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.provinces.length
      }
    },
    beforeMount () {
      this.handleCheckAllChange()
      this.search()
    }
  }
</script>
<style lang="stylus" scoped>
  .dialout
    .sear
      margin-left 0
      margin-top 16px
    .el-select
      display inline-block
  .el-checkbox-group
    margin-left 40px
    .el-checkbox
      width 76px
      &:nth-child(1)
        padding-left 15px
  .top
    .serve
      margin-top 16px
      margin-left 18px
      .prov
        margin-right 16px
  .el-col-1
    height 36px
    line-height 36px
</style>
