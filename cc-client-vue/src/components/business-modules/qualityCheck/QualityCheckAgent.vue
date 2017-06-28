<template>
  <div class="agent">
    <div class="top">
      <affix :label="$t('qualityCheck.qualityCheckAgent')"></affix>
      <div class="templa">
        <span class="temp">{{$t('qualityCheck.qualityTemplate')}}：</span>
        <el-radio-group v-model.trim="value" @change="change" v-if="items.length!==0">
          <el-radio size="small"
            :label="index" v-for="(item, index) in items" >
              {{item.name}}
              <span v-if="item.QUALITY_TYPE==='qualityWebchat'">{{$t('qualityCheck.webchat')}}</span>
              <span v-else>{{$t('qualityCheck.call')}}</span>
          </el-radio>
        </el-radio-group>
        <span v-else>{{$t('qualityCheck.pleaseExployModel')}}</span>
      </div>
      <div class="tem" v-if="items.length!==0">
        <span class="temp">{{$t('qualityCheck.checkTime')}}：</span>
        <el-date-picker size="small"
          v-model.trim="form.time"
          type="datetimerange"
          :picker-options="pickerOptions2"
          :placeholder="$t('public.timeRanges')"
          align="right"
          :editable="boolean"
          @change="timeChange">
        </el-date-picker>
      </div>
      <div class="tem">
        <span class="temp">{{$t('public.agent')}}：</span>
            <el-select size="small" v-model.trim="form.selectedAgent" multiple filterable :placeholder="$t('public.searchDisplayName')">
              <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
              <el-option
                v-for="item in agentList"
                :label="item.displayName"
                :value="item._id"
              >
              <span >{{ item.displayName }}</span>
              <span >[<span>{{ item.exten }}</span>]</span>
              </el-option>
            </el-select>
            <el-checkbox v-model.trim="form.includeSubordinate">{{$t('public.includeUnderAgent')}}</el-checkbox>
      </div>
      <div class="sub">
        <span class="rest" @click="rest">{{$t('public.reset')}}</span>
        <span class="search" @click= "query">{{$t('public.search2')}}</span>
        <span class="search" @click= "exportExcel">{{$t('report.exportXls')}}</span>
      </div>
      <affix :label="$t('public.searchResult')"></affix>
    </div>
    <div class="tables">
      <div class="deploy">
        <div class="search-pagination">
          <pagination
                  :small="pagination.small"
                  :currentPage="pagination.currentPage"
                  :count="count"
                  @turnPage="turnPage"
                  :totalPage="totalPage"
                  >
          </pagination>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" stripe v-if="template.QUALITY_TYPE ==='qualityWebchat'">
        <el-table-column prop="DISPOSAL_AGENT" :label="$t('public.agent')" width="">
        </el-table-column>
        <el-table-column
          v-for="item in configList"
          :prop="item.order"
          :label="item.name"
          width=""
          >
        </el-table-column>
        <el-table-column prop="AMOUNT" :label="$t('qualityCheck.averageScore')" width="">
        </el-table-column>
      </el-table>
      <el-table :data="tableData" style="width: 100%" stripe v-else-if="template.type ==='pass'">
        <el-table-column prop="DISPOSAL_AGENT" :label="$t('public.agent')" width="">
        </el-table-column>
        <el-table-column prop="all_count" :label="$t('qualityCheck.agentMonitorNumber')" width="">
        </el-table-column>
        <el-table-column prop="all" :label="$t('qualityCheck.passTheNumber')" width="">
        </el-table-column>
        <el-table-column
          v-for="item in configList"
          :prop="item.name+'_cent'"
          :label="item.value"
          width=""
        >
        </el-table-column>
        <el-table-column prop="all_cent" :label="$t('qualityCheck.agentMonitorNumber')" width="">
        </el-table-column>
      </el-table>
      <el-table :data="tableData" style="width: 100%" stripe v-else>
        <el-table-column prop="DISPOSAL_AGENT" :label="$t('public.agent')" width="">
        </el-table-column>
        <el-table-column
          v-for="item in configList"
          :prop="item.order"
          :label="item.name"
          width=""
        >
        </el-table-column>
        <el-table-column prop="AMOUNT" :label="$t('qualityCheck.averageScore')" width="">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import Pagination from '../../public-modules/card/Pagination'
  import {getDateTime, deepClone} from '../../../utils/m7Utils.js'
  import {getQualityCheckConfigs} from '../../../utils/webchat.js'
  import Affix from '../../ui-modules/affix/Affix.vue'
  export default {
    name: 'random',
    data () {
      return {
        form: {
          time: '',
          includeSubordinate: false,
          selectedAgent: []
        },
        callForm: {
        },
        value: '',
        boolean: false,
        pickerOptions2: {
          shortcuts: [{
            text: this.$t('sms.thisOneWeek'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.$t('sms.thisOneMonth'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.$t('sms.thisThreeMonth'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        items: [],
        template: {},
        configList: [],
        pagination: {
          small: false,
          currentPage: 1
        },
        getWebchatCache: false
      }
    },
    components: {
      Pagination,
      Affix
    },
    methods: {
      rest () {
        for (let i in this.form) {
          if (typeof this.form[i] === 'object' && i !== 'claimTime' && i !== 'checkTime') {
            this.form[i] = []
          } else {
            this.form[i] = ''
          }
        }
      },
      timeChange (value) {
        if (!value) {
          this.form.time = ''
          this.form.BEGIN_TIME = ''
          this.form.END_TIME = ''
        }
      },
      change (index) {
        this.template = this.items[index]
        this.renderWebchatCache()
        if (this.items[index].QUALITY_TYPE === 'qualityWebchat') {
          // if (this.getWebchatCache === false) {
          // }
          this.queryWebchatGradeResult(1)
        } else {
          this.queryCallSheetGradeResult(1)
        }
      },
      renderWebchatCache () {
        this.getWebchatCache = true
        let configs = deepClone(this.template.config)
        this.configList = getQualityCheckConfigs(configs)
      },
      fetchData () {
        let self = this
        this.$store.dispatch('getCache', {type: 'qualityCheckTemplates'}).then((res) => {
          self.items = res
          self.value = 0
          self.template = res[0]
          self.change(0)
          let configs = deepClone(this.template.config)
          self.configList = getQualityCheckConfigs(configs)
          self.$store.dispatch('getCache', {type: 'agents'}).then((res) => {
            self.agentList = res
          })
        })
      },
      queryCallSheetGradeResult (page) {
        if (this.form.time && this.form.time[0] !== null) {
          this.form.BEGIN_TIME = getDateTime(this.form.time[0])
        }
        if (this.form.time && this.form.time[1] !== null) {
          this.form.END_TIME = getDateTime(this.form.time[1])
        }
        this.form.page = page
        this.form.pageSize = 10
        this.form.TEMPLATE = this.template._id
        let data = deepClone(this.form)
        let agent = ''
        if (data.selectedAgent.length) {
          data.selectedAgent.forEach((item) => {
            agent += ',' + item
          })
        }
        data.selectedAgent = agent
        this.$store.dispatch('queryCallSheetGradeResult', data).then((res) => {
        })
      },
      queryWebchatGradeResult (page) {
        if (this.form.time && this.form.time[0] !== null) {
          this.form.BEGIN_TIME = getDateTime(this.form.time[0])
        }
        if (this.form.time && this.form.time[1] !== null) {
          this.form.END_TIME = getDateTime(this.form.time[1])
        }
        this.form.page = page
        this.form.pageSize = 10
        this.form.TEMPLATE = this.template._id
        let data = deepClone(this.form)
        let agent = ''
        if (data.selectedAgent.length) {
          data.selectedAgent.forEach((item) => {
            agent += ',' + item
          })
        }
        data.selectedAgent = agent
        this.$store.dispatch('queryWebchatGradeResult', data).then((res) => {
        })
      },
      query () {
        this.pagination.currentPage = 1
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.queryWebchatGradeResult(1)
        } else {
          this.queryCallSheetGradeResult(1)
        }
      },
      turnPage (pageNum) {
        this.pagination.currentPage = pageNum
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.queryWebchatGradeResult(pageNum)
        } else {
          this.queryCallSheetGradeResult(pageNum)
        }
      },
      exportExcel () {
        if (this.template.type === 'pass') {
          this.$message.error(this.$t('qualityCheck.passTemNoexcelFun'))
          return
        }
        let data = {}
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          data.Method = 'exportWebchatGradeResult'
        } else {
          data.Method = 'exportCallSheetGradeResult'
        }
        if (this.form.time && this.form.time[0] !== null) {
          this.form.BEGIN_TIME = getDateTime(this.form.time[0])
        }
        if (this.form.time && this.form.time[1] !== null) {
          this.form.END_TIME = getDateTime(this.form.time[1])
        }
        let query = deepClone(this.form)
        let agent = ''
        if (query.selectedAgent.length) {
          query.selectedAgent.forEach((item) => {
            agent += ',' + item
          })
        }
        query.selectedAgent = agent
        query.TEMPLATE = this.template._id
        data.Query = query
        this.$store.dispatch('exportQualityCheckExcel', data).then((res) => {
        })
      }
    },
    beforeMount () {
      this.fetchData()
    },
    computed: {
      tableData () {
        return this.$store.state.qualityCheck.queryGradeResult.list
      },
      count () {
        return this.$store.state.qualityCheck.queryGradeResult.count
      },
      totalPage () {
        return Math.ceil(this.$store.state.qualityCheck.queryGradeResult.count / 10) || 0
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .search-pagination
    float right
    padding-top 10px
  .agent
    height calc(100vh - 90px)
    padding 0 20px
    overflow scroll
    .tables
      padding-bottom 20px
      .deploy
        height 48px
        border 1px solid #e7e7eb
        border-bottom none
        padding-left 14px
        .page
          margin-top 10px
    .tem
      padding-bottom 5px
      .el-checkbox
        color #808080
        margin 0 10px 0 32px
        padding 0
      .temp
        display inline-block
        width 70px
        margin-left 20px
        color $cf-gray1
    .templa
      padding-bottom 20px
      .temp
        margin-left 0
        color $cf-gray1
    .el-radio-group
      margin-top 10px
      .el-radio
        margin 0 0 6px 20px
    .sub
      text-align right
      .rest
      .search
        display inline-block
        width 108px
        height 30px
        background #72c7e3
        color #fff
        text-align center
        line-height 30px
        border-radius 2px
        cursor pointer
      .search
        background #1abb9c
        margin-left 24px
    .ui-affix
      padding-bottom 0
      margin-top 40px
</style>
