<template>
  <div class="analyse">
    <div class="top">
      <affix :label="$t('report.robotReportTop20Search')"></affix>
      <div class="search">
        <div>
          <template>
            <span class="ques">问题分类:</span>
            <el-select v-model="questionType" placeholder="请选择" size="small">
              <el-option
                      v-for="item in questionOptions"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </template>
        </div>
        <span class="inquiry fr find" @click.stop="search">{{$t('public.search2')}}</span>
        <div class="clear"></div>
      </div>
      <affix :label="title"></affix>
      <div class="export">
        <span class="inquiry fr" @click.stop="exportXls">{{$t('report.exportXls')}}</span>
        <!-- <span class="inquiry fr pdf" @click.sotp="exportPdf">{{$t('report.exportPDF')}}</span> -->
      </div>
    </div>
    <div :id = "id">
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
  import dateTime from '../base/datetime.vue'
  import reportTable from '../base/reportTable.vue'
  import { deepClone } from '../../../../utils/m7Utils.js'
  import { filter } from 'lodash'
  import { exportReportPdf } from '../../../../utils/reportUtils.js'
  export default {
    name: 'robot_report_top20',
    data () {
      return {
        id: 'robot_report_top20',
        title: this.$t('report.robotReportTop20'),
        dialogVisible: false,
        serverData: [],
        questionType: '',
        questionOptions: [],
        headOptions: [{
          'order': '1',
          'name': 'no',
          'displayname': '排名',
          'show': true
        }, {
          'order': '2',
          'name': 'name',
          'displayname': '标准问法',
          'show': true
        }, {
          'order': '3',
          'name': 'type',
          'displayname': '分类',
          'show': true
        }, {
          'order': '4',
          'name': 'hits',
          'displayname': '命中次数',
          'show': true
        }]
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
      }
    },
    methods: {
      search () {
        this.loading = true
        this.$store.dispatch('queryRobotTop20Report', {questionType: this.questionType}).then(() => {
          let metaData = deepClone(this.$store.state.report.robot.top20Report.list)
          metaData.forEach((item, index) => {
            item.no = index + 1
            item.type = this.getTypeNameById(item.type) || '全部'
            if (!item.hits || item.hits < 1) {
              item.hits = 0
            }
          })
          this.serverData = metaData
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportRobotTop20Excel',
          Query: {
            reportType: this.id,
            questionType: this.questionType,
            accountId: this.$store.state.session.user.account
          }
        }
        this.$store.dispatch('exportRobotMessageExcel', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: this.$t('report.robotReportTop20Search'), id: this.id})
      },
      getTypeNameById (typeId) {
        let options = filter(this.questionOptions, {value: typeId})
        if (options[0]) {
          return options[0].label
        }
        return ''
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', {type: 'quesTypes'}).then(types => {
        this.questionOptions = types.map(type => ({label: type.name, value: type._id}))
        this.questionOptions.forEach((question) => {
          if (question.label === this.$t('public.all')) {
            question.value = ''
          }
        })
        this.questionType = this.questionOptions[0].value
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .analyse
    .search
      .ques
        margin-right 20px
</style>
