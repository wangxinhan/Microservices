<template>
  <div id="workbench"
  v-loading="loading"
  element-loading-text="拼命加载中"
  class="clearfix"
  >
    <div class="workbench" v-if="!loading">
      <div class="welcome"><span class="oem-7moor">{{$t('workbench.welcome')}}</span><span class="refresh" @click.stop="refresh"><i class="iconfont icon-shuaxin"></i>{{$t('public.refresh')}}</span></div>
      <workbench-summarylist v-bind:summary-list="summaryList"></workbench-summarylist>
      <workbench-business v-bind:data="business"></workbench-business>
      <workbench-planninglist v-bind:planning-list="planningList"></workbench-planninglist>
      <workbench-top10list v-bind:today-data="top10list.todayTop10"
                           v-bind:month-data="top10list.monthTop10"
        ></workbench-top10list>
    </div>
  </div>
</template>
<script>
  import workbenchSummarylist from './SummaryList.vue'
  import workbenchBusiness from './Business.vue'
  import workbenchPlanninglist from './PlanningList.vue'
  import workbenchTop10list from './Top10List.vue'
  import {deepClone} from '../../../utils/m7Utils.js'
  export default {
    name: 'work-bench',
    components: {
      workbenchSummarylist,
      workbenchBusiness,
      workbenchPlanninglist,
      workbenchTop10list
    },
    data () {
      return {
        loading: true,
        agentMonthCallReportData: {},
        summaryListCall: {
          todayCdrData: {all: 0, complete: 0}
        },
        top10listCall: {
          todayData: {
            cdrTop10: []
          }
        }
      }
    },
    computed: {
      top10list () {
        let data = deepClone(this.$store.getters.top10list)
        let todayCall = this.$store.state.cti.globalLet.phone_peers
        let arr = []
        for (let i in todayCall) {
          arr.push({name: todayCall[i].DisplayName, score: todayCall[i].InComplete})
        }
        arr.sort(function (a, b) {
          return b.score - a.score
        })
        this.top10listCall.todayData.cdrTop10 = arr.slice(0, 10)
        data.todayTop10.cdrTop10 = this.top10listCall.todayData.cdrTop10
//        data.monthTop10.cdrTop10 = this.top10listCall.monthData.cdrTop10
        for (let i in data) {
          let item = data[i]
          for (let n in item) {
            let length = item[n].length
            for (let m = 0; m < 10 - length; m++) {
              data[i][n].push({name: '- -', score: '- -'})
            }
          }
        }
        return data
      },
      summaryList () {
        let data = deepClone(this.$store.state.workbench.summaryList)
        let currentAgent = this.$store.state.session.user
        let todayCall = this.$store.state.cti.globalLet.phone_peers
        for (let i in todayCall) {
          if (i === currentAgent._id) {
            this.summaryListCall.todayCdrData.all = todayCall[i].InCalls
            this.summaryListCall.todayCdrData.complete = todayCall[i].InComplete
          }
        }
        data.todayCdrData = this.summaryListCall.todayCdrData
//        data.monthCdrData = this.summaryListCall.monthCdrData
        return data
      },
      business () {
        return this.$store.state.workbench.business
      },
      planningList () {
        return this.$store.getters.getPlanList
      }
    },
    methods: {
      fetchData () {
        let pro1 = this.$store.dispatch('queryAgentMultiChannelData')
        let pro2 = this.$store.dispatch('queryPlanningList')
        Promise.all([pro1, pro2]).then(([rep1, rep2]) => {
          this.loading = false
        })
      },
      refresh () {
        this.loading = true
        this.fetchData()
      }
    },
    beforeMount () {
      this.fetchData()
      this.$store.commit('CHANGE_PASSWORD_ADVICE')
    }

  }
</script>
<style lang="stylus" scoped>
  @import "styl/_workbench.styl";
  @import "../../../assets/common.styl"
  #workbench
    height calc(100vh - 3.786em)
    background-color #f5f5f5
  .workbench
    box-sizing border-box
    padding 11px
    overflow auto
    height 100%
    .welcome
      font-size 14px
      color $cf-gray3
      padding 10px 5px
      .refresh
        float right
        cursor pointer
        .iconfont
          color #24bf9f
          margin-right 6px
</style>
