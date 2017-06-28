<template>
  <div class="qualityCheckTask" v-if="qualityCheckTaskloading">
    <div class="top">
      <affix :label="$t('qualityCheck.qualityCheckTask')"></affix>
      <el-form :model="ruleForm" ref="ruleForm">
        <div class="temp-search-wrap">
          <span class="demonstration">创建时间:</span>
          <el-date-picker size="small"
                          class="el-input-time"
                          v-model.trim="ruleForm.date"
                          type="datetimerange"
                          :editable="boolean"
                          :picker-options="pickerOptions2"
                          :placeholder="$t('sms.choTimeScope')"
                          align="right">
          </el-date-picker>
        </div>
        <div class="temp-search-wrap">
          <span class="demonstration">质检专员:</span>
          <el-autocomplete
            class="quality-agents-select-option"
            v-model="ruleForm.QA_SPECIALIST"
            :fetch-suggestions="querySearch"
            size="small"
            placeholder="请输入内容"
          ></el-autocomplete>
        </div>
        <div class="temp-search-wrap">
          <span class="demonstration">任务状态:</span>
          <el-select size="small" v-model="ruleForm.hide" :placeholder="$t('public.pleasePick')">
            <el-option
              :label="$t('public.all')"
              :value="''">
            </el-option>
            <el-option
              label="使用中"
              value="true">
            </el-option>
            <el-option
              label="已停用"
              value="false">
            </el-option>
          </el-select>
        </div>
      </el-form>
      <div class="sub">
        <span class="rest" @click="reset">{{$t('public.reset')}}</span>
        <span class="search" @click= "queryBtn">{{$t('public.search2')}}</span>
      </div>
      <affix :label="$t('public.searchResult')"></affix>
    </div>
    <div class="table-wrap">
      <div class="deploy">
        <div class="page-wrap">
          <span class="fl all">{{$t('sms.gong')}}{{count || 0}}{{$t('sms.tiaoJiLu')}}&nbsp;|&nbsp;</span>
          <span class="currentpage">{{currentPage}}/{{Math.ceil(count/pageSize) || 1}}</span>
          <el-pagination
            small
            :page-size="10"
            layout=" prev, next"
            class="fr"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :total="count">
          </el-pagination>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="TASK_NAME" :label="$t('qualityCheck.taskName')">
        </el-table-column>
        <el-table-column prop="taskAllNum" :label="$t('qualityCheck.taskAccount')" width="90">
        </el-table-column>
        <el-table-column prop="ALREADY_MONITORING" :label="$t('qualityCheck.monitorAllNum')" width="90">
        </el-table-column>
        <el-table-column prop="WAIT_MONITORING" :label="$t('qualityCheck.toMonitorNum')" width="90">
        </el-table-column>
        <el-table-column prop="REPLACEMENT" :label="$t('qualityCheck.exchangeNum')" width="90">
        </el-table-column>
        <el-table-column prop="agentsData" :label="$t('qualityCheck.checkWorker')" width="130">
        </el-table-column>
        <el-table-column prop="time" :label="$t('public.createTime')" width="170">
        </el-table-column>
        <el-table-column :label="$t('qualityCheck.taskState')" width="130">
          <template scope="scope">
            <div v-if="tableData[scope.$index].hide" style="color:#1ebc9b;">使用中</div>
            <div v-if="!tableData[scope.$index].hide" style="color:#e3746f;">已停用</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {getFormatDateTime} from '../../../utils/m7Utils.js'
  import Affix from '../../ui-modules/affix/Affix.vue'
  export default {
    name: 'qualityCheckTask',
    data () {
      return {
        qualityCheckTaskloading: false,
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
        ruleForm: {
          date: '',
          QA_SPECIALIST: '',
          hide: ''
        },
        currentPage: 1,
        pageSize: 10,
        tableLoading: false,
        agents: [],
        restaurants: []
      }
    },
    methods: {
      reset () {
        for (let i in this.ruleForm) {
          this.ruleForm[i] = ''
        }
      },
      query () {
        let data = {'pageSize': this.pageSize, 'page': this.currentPage}
        let notifyTime = this.ruleForm.date
        if (notifyTime) {
          if (notifyTime[0]) {
            data.BEGIN_TIME = getFormatDateTime(notifyTime[0])
          }
          if (notifyTime[1]) {
            data.END_TIME = getFormatDateTime(notifyTime[1])
          }
        }
        data.hide = this.ruleForm.hide
        let QASPECIALISTExchange = this.ruleForm.QA_SPECIALIST
        let agentsDatas = this.agents
        let QASPECIALISTId = ''
        for (let k in agentsDatas) {
          if (agentsDatas[k].displayName === QASPECIALISTExchange) {
            QASPECIALISTId = agentsDatas[k]._id
          }
        }
        data.QA_SPECIALIST = QASPECIALISTId
        this.tableLoading = true
        this.$store.dispatch('getQualityTaskTemplateList', data).then(() => {
          this.tableLoading = false
        })
      },
//      分页查询
      handleCurrentChange (val) {
        this.currentPage = val
        this.query()
      },
//      查询按钮
      queryBtn () {
        this.currentPage = 1
        this.query()
      },
//      质检专员联想搜索==============================
      querySearch (queryString, cb) {
        var restaurants = this.restaurants
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0)
        }
      },
      loadRestaurants () {
        let data = []
        let agentsDatas = this.agents
        for (let k in agentsDatas) {
          data.push({value: agentsDatas[k].displayName})
        }
        return data
      }
//      ==============================================
    },
    computed: {
//        重构表单数据
      tableData () {
        let data = this.$store.state.qualityCheck.qualityTaskTemplate.list
        for (var i in data) {
          if (!data[i].ALREADY_MONITORING) {
            data[i].ALREADY_MONITORING = 0
          }
          if (!data[i].WAIT_MONITORING) {
            data[i].WAIT_MONITORING = 0
          }
          if (!data[i].REPLACEMENT) {
            data[i].REPLACEMENT = 0
          }
          let agentsId = data[i].query.QA_SPECIALIST
          let agentsDatas = this.agents
          for (var k in agentsDatas) {
            if (agentsDatas[k]._id === agentsId) {
              data[i].agentsData = agentsDatas[k].displayName
            }
          }
          data[i].taskAllNum = Number(data[i].ALREADY_MONITORING) + Number(data[i].WAIT_MONITORING) + Number(data[i].REPLACEMENT)
        }
        return data
      },
      count () {
        return this.$store.state.qualityCheck.qualityTaskTemplate.count
      }
    },
    components: {
      Affix
    },
    beforeMount () {
      this.query()
      this.$store.dispatch('getCache', {type: 'agents'}).then(() => {
        this.agents = this.$store.state.session.dicMap.agents
        this.restaurants = this.loadRestaurants()
        this.qualityCheckTaskloading = true
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .qualityCheckTask
    height calc(100vh - 96px)
    padding 0 20px
    overflow scroll
    .table-wrap
      padding-bottom 20px
      .deploy
        height 48px
        line-height 48px
        border 1px solid #e7e7eb
        border-bottom none
        padding-left 14px
        margin-top 30px
        .page-wrap
          float right
          .el-pagination
            line-height 30px
            margin 12px 10px 0
    .temp-search-wrap
      display inline-block
      margin-bottom 20px
      .el-input-time
        width 370px
      .demonstration
        display inline-block
        width 70px
        text-align right
        margin-left 20px
        color $cf-gray1
    .ui-affix
      padding-bottom 0
      margin-top 40px
    .sub
      text-align right
      margin-top 30px
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
  .quality-agents-select-option
    max-width 193px
    height auto
    word-wrap break-word
    white-space normal
</style>
