<template>
  <div class="questionnaire_report_return">
    <div class="top">
      <affix label="问卷回访状态查询信息"></affix>
      <div class="search">
        <el-row>
          <el-col :span="8">
            <span class="demonstration">创建时间:</span>
            <el-date-picker size="small"
              v-model.trim="value4"
              type="daterange"
              :picker-options="pickerOptions"
              placeholder="选择时间范围"
              :editable="boolean"
              align="right">
            </el-date-picker>
          </el-col>
          <el-col :span="8">
            <span class="demonstration">问卷模板:</span>
            <el-select size="small" v-model.trim="query.temp_id" @change = "change">
              <el-option
                v-for="item in options"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="demonstration">批次号:</span>
            <el-select size="small" filterable multiple v-model.trim="query.batchNos" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="demonstration">回访时间:</span>
            <el-date-picker size="small"
              v-model.trim="value3"
              type="daterange"
              :picker-options="pickerOptions"
              placeholder="选择时间范围"
              :editable="boolean"
              align="right">
            </el-date-picker>
          </el-col>
          <el-col :span="8">
            <span class="demonstration">批次说明:</span>
            <el-select size="small" filterable multiple v-model.trim="query.batchRemarks" placeholder="请选择">
              <el-option
                v-for="item in options3"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <span class="inquiry fr find" @click="search">查询</span>
        <div class="clear"></div>
      </div>
      <affix label="问卷回访状态报表"></affix>
      <div class="export">
        <span class="inquiry fr" @click.stop="exportXls">导出EXCEL</span>
        <span class="inquiry fr pdf" @click="exportPdf">导出PDF</span>
      </div>
    </div>
    <div :id = "id">
      <el-row class="ichars">
          <highcharts :options="highchartsOptions"></highcharts>
      </el-row>
      <el-row class="ichars">
          <highcharts :options="highchartsOptionsCi"></highcharts>
      </el-row>
      <div class="tab">
        <report-table :data="tableData" :sum="totalData" :config="config"></report-table>
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
  import {exportReportPdf, colorConfigArr} from '../../../../utils/reportUtils.js'
  import reportTable from '../base/reportTable.vue'
  import {getDateTime, deepClone} from '../../../../utils/m7Utils.js'
  export default {
    name: 'questionnaire_report_return',
    data () {
      return {
        query: {
          reportType: 'questionnaire_report_return',
          temp_id: '',
          batchNos: [],
          batchRemarks: [],
          create_time_begin: '',
          create_time_end: '',
          return_time_begin: '',
          return_time_end: ''
        },
        dialogVisible: false,
        batchNumber: [],
        batchInstructions: [],
        tableDatas: [],
        tableDataCon: [],
        config: [{
          displayname: '回访状态',
          name: 'returnState',
          show: true
        }, {
          displayname: '数量',
          name: 'count',
          show: true
        },
        {
          displayname: '占比',
          name: 'AccountingFor',
          show: true
        }],
        id: 'questionnaire_report_return',
        value3: '',
        value4: '',
        boolean: false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        serveNumData: [],
        highchartsDefaultOptions: {
          chart: {
            type: 'column',
            animation: false
          },
          colors: colorConfigArr,
          xAxis: {
            categories: []
          },
          legend: {
            enabled: false
          },
          yAxis: {
            title: {
              text: '数量'
            }
          },
          title: {
            text: '回访状态柱形图'
          },
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                format: '{point.y}'
              }
            }
          },
          tooltip: {
            headerFormat: '',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}',
            shared: true
          },

          credits: {enabled: false},
          series: []
        },
        highchartsDefaultOptionsC: {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          colors: colorConfigArr,
          title: { text: '回访状态饼形图' },
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
          series: []
        }
      }
    },
    components: {
      affix,
      reportTable
    },
    methods: {
      search () {
        // 初始化查询时间
        if (this.value4[0]) {
          let time = getDateTime(this.value4[0]).split(' ')
          let timeEnd = getDateTime(this.value4[1]).split(' ')
          this.query.create_time_begin = time[0]
          this.query.create_time_end = timeEnd[0]
        } else {
          this.query.create_time_begin = ''
          this.query.create_time_end = ''
        }
        if (this.value3[0]) {
          let time1 = getDateTime(this.value3[0]).split(' ')
          let timeEnd1 = getDateTime(this.value3[1]).split(' ')
          this.query.return_time_begin = time1[0]
          this.query.return_time_end = timeEnd1[0]
        } else {
          this.query.return_time_begin = ''
          this.query.return_time_end = ''
        }
        // 查询条件
        let data = {
          account: this.$store.state.session.user.accountId,
          query: this.query
        }
        // 查询数据
        this.$store.dispatch('queryQuesResultReport', data).then(() => {
          this.tableDatas = deepClone(this.$store.state.report.questionnaire.resultReport.tableHeader.Config) || []
          this.tableDataCon = deepClone(this.$store.state.report.questionnaire.resultReport.data) || []
        })
      },
      change () {
        this.query.batchNos = []
        this.query.batchRemarks = []
      },
      close () {
        this.isShow = false
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '问卷回访状态报表', id: this.id})
      },
      exportXls () {
        let data = {
          Method: 'exportQuesResultReport',
          Query: {
            reportType: 'questionnaire_report_return',
            temp_id: this.query.temp_id,
            batchNos: this.query.batchNos,
            batchRemarks: this.query.batchRemarks,
            create_time_begin: '',
            create_time_end: '',
            return_time_begin: '',
            return_time_end: '',
            account: this.$store.state.session.user.accountId
          }
        }
        // 初始化查询时间
        if (this.value4[0]) {
          let time = getDateTime(this.value4[0]).split(' ')
          let timeEnd = getDateTime(this.value4[1]).split(' ')
          data.Query.create_time_begin = time[0]
          data.Query.create_time_end = timeEnd[0]
        } else {
          data.Query.create_time_begin = ''
          data.Query.create_time_end = ''
        }
        if (this.value3[0]) {
          let time1 = getDateTime(this.value3[0]).split(' ')
          let timeEnd1 = getDateTime(this.value3[1]).split(' ')
          data.Query.return_time_begin = time1[0]
          data.Query.return_time_end = timeEnd1[0]
        } else {
          data.Query.return_time_begin = ''
          data.Query.return_time_end = ''
        }
        this.$store.dispatch('exportQuesResultReport', data)
      }
    },
    computed: {
      highchartsOptions () {
        let hOptions = deepClone(this.highchartsDefaultOptions)
        if (!this.tableDataCon || this.tableDataCon.length === 0) {
          return hOptions
        }
        let categoriesArray = []
        let seriesArray = [{
          name: ' ',
          colorByPoint: true,
          data: []
        }]
        for (let i = 0; i < this.tableDatas.length; i++) {
          categoriesArray.push(this.tableDatas[i].displayname)
        }
        hOptions.xAxis.categories = categoriesArray
        for (let i = 0; i < this.tableDatas.length; i++) {
          seriesArray[0].data.push({
            name: this.tableDatas[i].displayname,
            y: this.tableDataCon[0][this.tableDatas[i].name]
          })
        }
        hOptions.series = seriesArray
        return hOptions
      },
      highchartsOptionsCi () {
        let hOptionsC = deepClone(this.highchartsDefaultOptionsC)
        if (!this.tableDataCon || this.tableDataCon.length === 0) {
          return hOptionsC
        }
        let seriesArray = [{
          type: 'pie',
          name: '百分比',
          data: []
        }]
        for (let i = 0; i < this.tableDatas.length; i++) {
          seriesArray[0].data.push([
            `${this.tableDatas[i].displayname}(${this.tableDataCon[0][this.tableDatas[i].name]})`,
            this.tableDataCon[0][this.tableDatas[i].name]
          ])
        }
        hOptionsC.series = seriesArray
        return hOptionsC
      },
      totalData () {
        if (!this.tableDataCon || this.tableDataCon.length === 0) {
          return []
        }
        let sum = {'returnState': '合计', 'count': this.tableDataCon[0]._totalResult, 'AccountingFor': '100%'}
        return [sum]
      },
      tableData () {
        if (!this.tableDataCon || this.tableDataCon.length === 0) {
          return []
        }
        let tabD = []
        let accountSum = this.tableDataCon[0]._totalResult
        for (let i = 0; i < this.tableDatas.length; i++) {
          tabD.push({
            'returnState': this.tableDatas[i].displayname,
            'count': this.tableDataCon[0][this.tableDatas[i].name],
            'AccountingFor': (this.tableDataCon[0][this.tableDatas[i].name] / accountSum * 100).toFixed(1) + '%'
          })
        }
        return tabD
      },
      // 批次号
      options1 () {
        let batchNo = []
        for (let b = 0; b < this.batchNumber.length; b++) {
          if (this.query.temp_id === this.batchNumber[b].dbType) {
            batchNo.push(this.batchNumber[b])
          }
        }
        return batchNo.map(batch => ({ label: batch.batchNo, value: batch.batchNo }))
      },
      // 批次说明列表
      options3 () {
        let batchNo = []
        for (let b = 0; b < this.batchInstructions.length; b++) {
          if (this.query.temp_id === this.batchInstructions[b].dbType) {
            batchNo.push(this.batchInstructions[b])
          }
        }
        return batchNo.map(batch => ({ label: batch.batchRemark, value: batch.batchRemark }))
      }
    },
    beforeMount () {
      // 按批次号搜索
      this.$store.dispatch('getCache', {type: 'getQuestionnaireImportBatchNo'}).then(agents => {
        this.batchNumber = deepClone(agents) || this.batchNumber
      })
      // 按批次说明搜索
      this.$store.dispatch('getCache', {type: 'getQuestionnaireImportBatchRemark'}).then(agents => {
        this.batchInstructions = deepClone(agents) || this.batchInstructions
      })
      // 模板搜索
      this.$store.dispatch('getCache', {type: 'questionnaireTemp'}).then(agents => {
        this.options = agents.map(agent => ({ label: agent.name, value: agent._id }))
        this.query.temp_id = agents[0]._id
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .questionnaire_report_return
    .search
      padding 0 0px 0 20px
      .el-row
        margin-top 16px
        .demonstration
          display inline-block
          width 70px
    .el-col-1
    .el-col-2
      text-align center
      height 36px
      line-height 36px
</style>
