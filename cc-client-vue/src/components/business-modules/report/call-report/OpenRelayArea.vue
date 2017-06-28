<template>
  <div class="callarea">
    <div class="top">
      <affix :label="$t('report.relaycallSeaCity')"></affix>
      <div class="search">
        <template>
          <date-time type="other_half_hour" :query="query" ref="child"></date-time>
        </template>
        <div class="serve">
          <span class="colo">{{$t('monitor.serviceNum')}}：</span>
          <el-checkbox v-model.trim="checkAll" @change="handleServiceNosCheckAll">{{$t('public.checkAll')}}</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model.trim="checkedServiceNos" @change="handleServiceNosCheck">
            <el-checkbox v-for="number in serviceNos" :label="number.Exten" :value="number.Exten">{{number.Exten}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="serve serve1">
          <span class="pro colo">{{$t('public.province')}}：</span>
          <el-checkbox :indeterminate="isIndeterminate1" v-model.trim="checkAll1" @change="handleProvincesCheckAll">{{$t('public.checkAll')}}</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model.trim="checkedProvinces" @change="handleProvincesCheck">
            <el-checkbox v-for="province in provinces" :label="province" :name="province">{{province}}</el-checkbox>
          </el-checkbox-group>
          <span class="inquiry fr find" v-on:click.stop="search">{{$t('public.search2')}}</span>
          <div class="clear"></div>
          </div>
      </div>
        <affix :label="$t('report.relaycallDisCity')"></affix>
        <div class="export">
        <span class="inquiry fr" v-on:click.stop="exportExcel">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" v-on:click.stop="exportPdf">{{$t('report.exportPDF')}}</span>
        <span class="inquiry fr pdf" v-on:click.stop="flag">返回上页</span>
      </div>
      <div class="clear"></div>
    </div>
    <div class="tab" :id="id">
      <div class="deploy"><i class="iconfont icon-peizhi"></i><span class="tex" @click.stop="config">{{$t('report.setHeaderConfig')}}</span></div>
      <report-table :data="serveNumData" :sum="sum" :config="headOptions.Config" @proName ="sss"> </report-table>
      <report-tablea :data="serveNumDataC" :sum="sum1" :config="headOptions.Config" @proName ="sss"> </report-tablea>
    </div>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('report.reportExportHelp')" v-model="dialogVisible" size="tiny">
      <span>{{$t('report.reportExportTipTitle')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="confirm">{{$t('public.confirm')}}</el-button>
      </span>
    </el-dialog>
    <header-option v-if="isShow" :show="isShow" :option="headOptionsShow" type="call_report_relay_area_city" v-on:close="close"></header-option>
  </div>
</template>
<script>
  import dateTime from '../base/dateTimeDrill.vue'
  import headerOption from '../base/headerOption.vue'
  import reportTable from '../base/drillInto.vue'
  import {exportReportPdf, checkTime, searchTime} from '../../../../utils/reportUtils.js'
  import {getCache, deepClone} from '../../../../utils/m7Utils.js'
  import affix from '../../../ui-modules/affix/Affix.vue'
  export default {
    name: 'callarea',
    data () {
      return {
        id: 'call_report_relay_area_city',
        query: {
          reportType: '',
          relayAreaCityCurrentProvince: this.cityName.cityName
        },
        checkAll: true,
        checkAll1: true,
        checkedServiceNos: [],
        checkedProvinces: [],
        headOptionsShow: {},
        headOptions: {},
        isShow: false,
        dialogVisible: false,
        serviceNos: [],
        provinces: ['未知号段', '北京市', '天津市', '上海市', '重庆市', '澳门', '福建省', '广东省', '安徽省', '广西省', '甘肃省', '贵州省', '河北省', '河南省', '湖北省', '湖南省', '海南省', '黑龙江省', '浙江省', '江苏省', '江西省', '吉林省', '辽宁省', '内蒙古', '宁夏', '青海省', '山东省', '山西省', '陕西省', '四川省', '台湾省', '新疆', '西藏', '香港', '云南省'],
        isIndeterminate: false,
        isIndeterminate1: false,
        sum: [],
        serveNumData: []
      }
    },
    props: [
      'cityName'
    ],
    methods: {
      flag () {
        this.$emit('flag')
      },
      search () {
        if (this.checkedServiceNos.length === 0) {
          this.open3()
        }
        if (this.checkedProvinces.length === 0) {
          this.open2()
        }
        let data = {reportType: 'call_report_relay_area_city'}
        let self = this
        this.provinces.forEach(function (item) {
          if (self.checkedProvinces.indexOf(item) >= 0) {
            self.query['Province_' + item] = true
          } else {
            self.query['Province_' + item] = false
          }
        })
        self.serviceNos.forEach(function (item) {
          if (self.checkedServiceNos.indexOf(item.Exten) >= 0) {
            self.query['ServiceNo_' + item.Exten] = true
          } else {
            self.query['ServiceNo_' + item.Exten] = false
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
        if (myQuery.TimeType === 'year') {
          delete myQuery.monthReport
          delete myQuery.dayReport
        }
        delete myQuery.relayAreaCityCurrentProvince
        data.query = myQuery
        this.$store.dispatch('openRelayAreaCity', data).then(() => {
          this.headOptions = this.$store.state.report.call.openRelayAreaCity.tableHeader
          this.sum = [{City: '合计'}]
          let tempData = deepClone(this.$store.state.report.call.openRelayAreaCity.data)
          for (let i in tempData) {
            let item = tempData[i]
            for (let j in item) {
              if (this.sum[0][j] === undefined) {
                this.sum[0][j] = 0
              }
              if (j !== 'City') {
                this.sum[0][j] += item[j]
              }
            }
          }
          this.serveNumData = tempData
        })
      },
      search1 () {
        this.checkedProvinces = [this.cityName.cityName]
        this.checkedServiceNos = this.cityName.checkedServiceNos
        this.query = deepClone(this.cityName.queryOne)
        this.$refs.child.form = {
          timeType: this.cityName.queryOne.TimeType,
          yearReport: parseInt(this.cityName.queryOne.yearReport),
          monthReport: parseInt(this.cityName.queryOne.monthReport),
          dayReport: parseInt(this.cityName.queryOne.dayReport)
        }
        if (this.cityName.queryOne.TimeType === 'other_half_hour') {
          if (this.cityName.queryOne.StartTime || this.cityName.queryOne.EndTime) {
            let StartTime = this.cityName.queryOne.StartTime.split(' ')[1] ? this.cityName.queryOne.StartTime.split(' ')[1] : ''
            let EndTime = this.cityName.queryOne.EndTime.split(' ')[1] ? this.cityName.queryOne.EndTime.split(' ')[1] : ''
            this.$refs.child.otherTimes = {
              beginTime: StartTime,
              endTime: EndTime,
              beginDate: this.cityName.queryOne.normalStartTime,
              endDate: this.cityName.queryOne.normalEndTime
            }
          } else {
            this.$refs.child.otherTimes = {
              beginTime: '',
              endTime: '',
              beginDate: '',
              endDate: ''
            }
          }
        }
        if (this.query.TimeType === 'other_half_hour') {
          let message = checkTime(this.query.StartTime, this.query.EndTime, false, false) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        let data = {
          reportType: 'call_report_relay_area_city',
          query: this.cityName.queryOne
        }
        data.query.relayAreaCityCurrentProvince = this.cityName.cityName
        data.query.reportType = 'call_report_relay_area'
        this.$store.dispatch('openRelayAreaCity', data).then(() => {
          this.headOptions = this.$store.state.report.call.openRelayAreaCity.tableHeader
          this.sum = [{City: '合计'}]
          let tempData = deepClone(this.$store.state.report.call.openRelayAreaCity.data)
          for (let i in tempData) {
            let item = tempData[i]
            for (let j in item) {
              if (this.sum[0][j] === undefined) {
                this.sum[0][j] = 0
              }
              if (j !== 'City') {
                this.sum[0][j] += item[j]
              }
            }
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
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '通话呼入地域分布报表' + searchTime(this.query), id: this.id})
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
        this.checkedServiceNos.forEach(function (item) {
          self.query['ServiceNo_' + item] = true
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
        if (myQuery.TimeType === 'year') {
          delete myQuery.monthReport
          delete myQuery.dayReport
        }
        myQuery.reportType = 'call_report_relay_area_city'
        myQuery.accountId = this.$store.state.session.user.account
        myQuery.type = 'ReportRelayAreaCityExport'
        myQuery.user = this.$store.state.session.user._id
        delete myQuery.relayAreaCityCurrentProvince
        let data = {
          Method: 'ReportRelayAreaCityExport',
          Query: myQuery
        }
        this.$store.dispatch('exportCallRelayAreaReport', data).then(() => {
        })
      },
      config () {
        this.$store.dispatch('getReportTableHeader', 'call_report_relay_area_city').then((res) => {
          this.headOptionsShow = res
          this.isShow = !this.isShow
        })
      },
      open3 () {
        this.$message.error('请选择服务号作为查询条件')
      },
      open2 () {
        this.$message.error('请选择省份查询条件！')
      },
      handleServiceNosCheckAll (event) {
        this.checkedServiceNos = []
        if (this.checkAll === true) {
          this.serviceNos.forEach((i) => {
            this.checkedServiceNos.push(i.Exten)
          })
        }
      },
      handleServiceNosCheck (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.serviceNos.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.serviceNos.length
      },
      handleProvincesCheckAll (event) {
        this.checkedProvinces = this.checkAll1 ? this.provinces : []
        this.isIndeterminate1 = false
      },
      handleProvincesCheck (value) {
        let checkedCount = value.length
        this.checkAll1 = checkedCount === this.provinces.length
        this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.provinces.length
      }
    },
    watch: {
      'cityName': 'search1'
    },
    computed: {
    },
    components: {
      dateTime,
      headerOption,
      reportTable,
      affix
    },
    beforeMount () {
      this.$store.dispatch('getCache', {type: 'serviceNo'}).then(() => {
        this.serviceNos = getCache('serviceNo')
        // this.handleServiceNosCheckAll()
        // this.handleProvincesCheckAll()
        // this.search()
        // this.search1()
      })
    },
    mounted () {
//      this.appendTfoot()
    }
  }
</script>
<style lang="stylus" scoped>
  .callarea
    .top
      .serve
        margin 18px 0 0 18px
    .el-checkbox-group
      margin-left 40px
      .el-checkbox
        &:nth-child(1)
          padding-left 15px
      .el-checkbox
        width 90px
</style>
