<template>
  <div class="questionnaire_report_detail">
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
            <el-select size="small" filterable multiple v-model.trim="query.batchNos" placeholder="按批次号搜索">
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
            <span class="demonstration">回访问题:</span>
            <el-select size="small" v-model.trim="query.ques_id" filterable multiple placeholder="按回访问题搜索">
              <el-option
                v-for="item in options2"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="demonstration">批次说明:</span>
            <el-select size="small" v-model.trim="query.batchRemarks" filterable multiple placeholder="按批次说明搜索">
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
        <span class="inquiry fr" @click="excels">导出EXCEL</span>
        <span class="inquiry fr pdf" @click="exportPdf">导出PDF</span>
      </div>
    </div>
    <div :id = "id">
      <div v-for = "(item, index) in items" :class="index > 1 ? hide : ''" class="pie">
        <h3 class="title"><span class="text">{{returnData[index].name}} : {{returnData[index].context}} 结果占比图</span></h3>
        <el-row class="ichars" v-if="!item.hOptionsO">
          <highcharts :options="item.hOptions" style="width: 800px; margin: 0 auto"></highcharts>
        </el-row>
        <el-row class="ichars" v-else="item.hOptionsO" :gutter="20">
          <el-col :span="12">
            <highcharts :options="item.hOptions" :style="{ width: width }"></highcharts>
          </el-col>
          <el-col :span="12">
          <highcharts :options="item.hOptionsO" :style="{ width: width }"></highcharts>
          </el-col>
        </el-row>
      </div>
      <div class="toggle" @click = "toggle" v-show = "unfolded">
        <p v-show = "isNone">
          <span class="tex"><i class="iconfont icon-shouqi"></i>
          </span><span class="text">收起所有问题饼图</span>
        </p>
        <p v-show = "!isNone">
          <span class="tex"><i class="iconfont icon-zhankai1"></i></i></span>
          <span class="text">展开所有问题饼图</span>
        </p>
      </div>
      <div class="tab">
        <div class="deploy">
          <span class="tip"><i class="iconfont icon-tixingweizhi"></i></span>
          <el-tooltip class="item" effect="dark" placement="right" popper-class="reportTip">
              <div slot="content">
                {{$t('report.opportunity')}} <br>
                {{$t('report.singleVolumeRatio')}}
              </div>
              <el-button>{{$t('report.description')}}</el-button>
            </el-tooltip>
        </div>
          <table>
            <template v-for = "item in returnDataOne">
              <tr class="th">
                <td rowspan="4" class="tdO" v-if="item.single">{{item.name}}</td>
                <td rowspan="3" class="tdO" v-if="!item.single">{{item.name}}</td>
                <td>问题结果</td>
                <td v-for="conte in item.quesAnswerTableHeader.Config">{{conte.displayname}}</td>
                <td 
                  v-if= "item.quesAnswerTableHeader.Config.length < configLength" 
                  v-for="(no, index) in (configLength - item.quesAnswerTableHeader.Config.length)">{{nos[index].message}}</td>
                <td>结果合计</td>
                <td>回访总量</td>
              </tr>
              <tr >
                <td>数量</td>
                <td v-for="(number, index) in item.quesAnswerTableHeader.Config">{{ item.data ? item.data[number.name] : 0 }}</td>
                <td v-if= "item.quesAnswerTableHeader.Config.length < configLength" 
                  v-for="(no, index) in (configLength - item.quesAnswerTableHeader.Config.length)">{{nos[index].message}}</td>
                <td>{{item._totalQuesAnswers ? item._totalQuesAnswers : 0}}</td>
                <td>{{item._totalQuesSubmitNums ? item._totalQuesSubmitNums : 0}}</td>
              </tr>
              <tr class="td">
                <td>机会占比</td>
                <td v-for="(abc, index) in item.quesAnswerTableHeader.Config">{{
                (item._totalQuesAnswers == 0 || !item._totalQuesAnswers) ? '0%' : ((item.data[abc.name] / item._totalQuesAnswers) * 100).toFixed(1)+'%'}}</td>
                <td v-if= "item.quesAnswerTableHeader.Config.length < configLength" 
                  v-for="(no, index) in (configLength - item.quesAnswerTableHeader.Config.length)">{{nos[index].message}}</td>
                <td>--</td>
                <td>--</td>
              </tr>
              <tr v-if="item.single">
                <td>单量占比</td>
                <td v-for="(abc, index) in item.quesAnswerTableHeader.Config">{{
                (item._totalQuesSubmitNums == 0 || !item._totalQuesSubmitNums) ? '0%' : ((item.data[abc.name] / item._totalQuesSubmitNums) * 100).toFixed(1)+'%'}}</td>
                <td v-if= "item.quesAnswerTableHeader.Config.length < configLength" 
                  v-for="(no, index) in (configLength - item.quesAnswerTableHeader.Config.length)">{{nos[index].message}}</td>
                <td>--</td>
                <td>--</td>
              </tr>
            </template>
          </table>
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
  import {getDateTime, deepClone, getCache} from '../../../../utils/m7Utils.js'
  export default {
    name: 'questionnaire_report_return',
    data () {
      return {
        width: '',
        hide: 'hide',
        isNone: false,
        batchNumber: [],
        returnVisitQes: [],
        batchInstructions: [],
        returnData: [],
        query: {
          reportType: 'questionnaire_report_question_detail',
          temp_id: '',
          ques_id: [],
          batchNos: [],
          batchRemarks: [],
          create_time_begin: '',
          create_time_end: '',
          return_time_begin: '',
          return_time_end: ''
        },
        dialogVisible: false,
        id: 'questionnaire_report_return',
        value1: '',
        value2: '',
        value3: '',
        value5: '',
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
        value4: '',
        sum: [],
        headOptions: {},
        serveNumData: [],
        options24out: {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          colors: colorConfigArr,
          title: { text: '机会占比' },
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
          legend: {
            align: 'center',
            verticalAlign: 'top',
            y: 30
          },
          credits: {
            enabled: false,
            text: ''
          },
          series: []
        },
        options24out1: {
          chart: {
            type: 'column'
          },
          title: {
            text: '单量占比'
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            title: {
              text: '百分比'
            }
          },
          legend: {
            enabled: false
          },
          credits: {
            enabled: false
          },
          colors: colorConfigArr,
          plotOptions: {
            series: {
              borderWidth: 0,
              dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%'
              }
            }
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{point.name}</span>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}%</b><br>'
          },
          series: [{
            colorByPoint: true,
            data: []
          }]
        }
      }
    },
    components: {
      affix
    },
    mounted () {
      let divWidth = document.getElementById(this.id).offsetWidth
      this.width = (divWidth - 60) / 2 + 'px'
    },
    methods: {
      toggle () {
        this.isNone = !this.isNone
        if (this.hide === 'hide') {
          this.hide = 'show'
        } else {
          this.hide = 'hide'
        }
      },
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
        this.$store.dispatch('queryQuesAnwserReport', data).then(() => {
          let datas = deepClone(this.$store.state.report.questionnaire.anwserReport.data) || {}
          this.returnData = []
          for (let i in datas) {
            if (datas[i].quesAnswerTableHeader.Config.length !== 0) {
              this.returnData.push(datas[i])
            }
          }
        })
      },
      close () {
        this.isShow = false
      },
      excels () {
        let data = {
          Method: 'exportQuesAnswerReport',
          Query: {
            reportType: 'questionnaire_report_question_detail',
            temp_id: this.query.temp_id,
            ques_id: this.query.ques_id,
            batchNos: this.query.batchNos,
            batchRemarks: this.query.batchRemarks,
            create_time_begin: '',
            create_time_end: '',
            return_time_begin: '',
            return_time_end: '',
            account: this.$store.state.session.user.accountId,
            type: 'exportQuesAnswerReport'
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
        if (data.Query.ques_id.length === 0) {
          delete data.Query.ques_id
        }
        if (data.Query.batchNos.length === []) {
          delete data.Query.batchNos
        }
        if (data.Query.batchRemarks.length === []) {
          delete data.Query.batchRemarks
        }
        this.$store.dispatch('exportQuesAnwserReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '问卷明细报表', id: this.id})
      },
      change () {
        this.query.batchNos = []
        this.query.batchRemarks = []
        this.query.ques_id = []
      }
    },
    computed: {
      // 计算是否显示单量占比
      returnDataOne () {
        if (!this.returnData || this.returnData.length === 0) {
          return []
        }
        let data = deepClone(this.returnData)
        for (let i = 0; i < data.length; i++) {
          let multiselect = getCache('questionnaireQues', this.returnData[i].quesId)
          if (multiselect && multiselect.isMultiselect) {
            data[i].single = true
          }
        }
        return data
      },
      // 表格问题结果
      nos () {
        if (!this.returnData || this.returnData.length === 0) {
          return []
        }
        let returnD = deepClone(this.returnData)
        let quesR = []
        let margin = 0
        for (let i = 0; i < returnD.length; i++) {
          let config = returnD[i].quesAnswerTableHeader.Config
          if (config.length < this.configLength) {
            margin = this.configLength - config.length
          }
        }
        for (let j = 0; j < margin; j++) {
          quesR.push({message: '--'})
        }
        return quesR
      },
      // 数量
      // 占比
      // 计算表格自由区的最大长度
      configLength () {
        if (!this.returnData || this.returnData.length === 0) {
          return 0
        }
        let configLength = 0
        for (let d in this.returnData) {
          let dataLength = this.returnData[d].quesAnswerTableHeader.Config.length
          if (configLength < dataLength) {
            configLength = this.returnData[d].quesAnswerTableHeader.Config.length
          }
        }
        return configLength
      },
      // 判断展开问卷是否显示
      unfolded () {
        if (this.returnData.length > 2) {
          return true
        }
        return false
      },
      // 展示问卷图表
      items () {
        if (!this.returnData || this.returnData.length === 0) {
          return []
        }
        let datas = []
        for (let i = 0; i < this.returnData.length; i++) {
          let hOptions = deepClone(this.options24out)
          let hOptionsO = deepClone(this.options24out1)
          let seriesArray = [{
            type: 'pie',
            name: '百分比',
            data: []
          }]
          let seriesArrayO = [{
            colorByPoint: true,
            data: []
          }]
          datas.push({hOptions})
          let multiselect = getCache('questionnaireQues', this.returnData[i].quesId)
          let config = this.returnData[i].quesAnswerTableHeader.Config
          let data = this.returnData[i].data
          if (multiselect && multiselect.isMultiselect) {
            datas[i].hOptionsO = hOptionsO
            for (let j = 0; j < config.length; j++) {
              if (data) {
                seriesArrayO[0].data.push({
                  name: config[j].displayname,
                  y: parseFloat((data[config[j].name] / this.returnData[i]._totalQuesSubmitNums * 100).toFixed(1))
                })
              }
            }
            datas[i].hOptionsO.series = seriesArrayO
          }
          for (let j = 0; j < config.length; j++) {
            if (data) {
              seriesArray[0].data.push([
                `${config[j].displayname}(${data[config[j].name]})`,
                data[config[j].name]
              ])
            } else {
              seriesArray[0].data.push([
                `${config[j].displayname}(0)`,
                0
              ])
            }
          }
          datas[i].hOptions.series = seriesArray
        }
        return datas
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
      // 回访问题
      options2 () {
        let batchNo = []
        for (let b = 0; b < this.returnVisitQes.length; b++) {
          if (this.query.temp_id === this.returnVisitQes[b].temp_id) {
            batchNo.push(this.returnVisitQes[b])
          }
        }
        return batchNo.map(batch => ({ label: batch.name, value: batch._id }))
      },
      // 批次说明
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
        this.batchNumber = deepClone(agents)
      })
      // 按回访问题搜索
      this.$store.dispatch('getCache', {type: 'questionnaireQues'}).then(agents => {
        this.returnVisitQes = deepClone(agents)
      })
      // 按批次说明搜索
      this.$store.dispatch('getCache', {type: 'getQuestionnaireImportBatchRemark'}).then(agents => {
        this.batchInstructions = deepClone(agents)
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
  @import "../../../../assets/common.styl"
  .questionnaire_report_detail
    color $cf-gray2
    .hide
      position absolute
      width 100%
      display none
    .show
      display block
    table
      width 100%
      border 1px solid #e7e7eb
      border-bottom none
      border-spacing 0
      .th
        background #f4f5f9
        .tdO
          background #fff
          border-right 1px solid #e7e7eb
          text-align center
      .td
        background #f4f5f9
      tr
        &:hover
          background #f5f5f5
        td
          border-bottom 1px solid #e7e7eb
          padding 8px
    .pie
      padding 0 20px
      .title
        text-align center
        .text
          top 0
          padding 0 20px
    .toggle
      height 24px
      line-height 24px
      text-align center
      line-height 24px
      width 160px
      margin 0 auto
      margin-bottom 20px
      p
        color #39c4a9
        cursor pointer
        .tex
          display inline-block
          width 20px
          height 20px
          border-radius 50%
          border 1px solid #39c4a9
          line-height 20px
          text-align center
        .text
          margin-left 8px
          font-size 14px
    .search
      padding 0 0px 0 20px
      .el-row
        margin-top 16px
        .demonstration
          display inline-block
          width 70px
    .tab
      .deploy
        .tip
          margin-left 0px
        .item
            cursor pointer
.report .title{
  color: #999;
  margin: 28px 0 18px 0;
  font-weight: normal;
  position: relative;
  line-height: 16px;
}
.report .title .sign{
  position: relative;
  width: 12px;
  height: 12px;
  background: #7ccdd1;
  display: inline-block;
  z-index: 3;
}
.report .title .text{
  position: relative;
  display: inline-block;
  padding: 0 8px 0 10px;
  background: #fff;
  z-index: 3;
}
.report .title:after{
  content: "";
  display: inline-block;
  width: 100%;
  left: 0;
  border-bottom: 1px dashed #999;
  position: absolute;
  top: 50%;
}
.tdO{}
</style>
