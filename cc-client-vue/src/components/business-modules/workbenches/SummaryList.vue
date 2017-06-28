<template>
  <div class="workbench-summarylist">
    <div class="workbench-title">
      <el-row>
        <el-col :span="12">
          {{ refresh }}
          {{ $t("workbench.summaryDay") }}
        </el-col>
        <el-col :span="12">
          {{ $t("workbench.summaryMonth") }}
        </el-col>
      </el-row>
    </div>
    <div class="workbench-summarylist-content">
      <el-row>
        <el-col :span="12">
          <div class="workbench-summarylist-today">
            <workbenchSummarylistPercent v-bind:data="todayCdrData" color="#d498e9"
                                         :complete-desc="$t('workbench.answer')"
                                         :uncomplete-desc="$t('workbench.missed')"
                                         :percent-desc="$t('workbench.completingRate')">
            </workbenchSummarylistPercent>
            <workbenchSummarylistPercent v-bind:data="todayWxData" color="#fe7c7c"
                                         :complete-desc="$t('workbench.timelyProcessing')"
                                         :uncomplete-desc="$t('workbench.noProcessing')"
                                         :percent-desc="$t('workbench.responseRate')"
              ></workbenchSummarylistPercent>
            <workbenchSummarylistPercent v-bind:data="todayInternetData" color="#f8cb00"
                                         :complete-desc="$t('workbench.timelyProcessing')"
                                         :uncomplete-desc="$t('workbench.noProcessing')"
                                         :percent-desc="$t('workbench.responseRate')"
              ></workbenchSummarylistPercent>
            <workbenchSummarylistPercent v-bind:data="todayAppData" color="#65c3df"
                                         :complete-desc="$t('workbench.timelyProcessing')"
                                         :uncomplete-desc="$t('workbench.noProcessing')"
                                         :percent-desc="$t('workbench.responseRate')"
              ></workbenchSummarylistPercent>
            <workbenchSummarylistPercent v-bind:data="todayMailData" color="#999"
                                         :complete-desc="$t('workbench.timelyProcessing')"
                                         :uncomplete-desc="$t('workbench.noProcessing')"
                                         :percent-desc="$t('workbench.responseRate')"
              ></workbenchSummarylistPercent>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="workbench-summarylist-month">
            <workbenchSummarylistPercent v-bind:data="monthCdrData" color="#d498e9"
                                         :complete-desc="$t('workbench.answer')"
                                         :uncomplete-desc="$t('workbench.missed')"
                                         :percent-desc="$t('workbench.completingRate')"></workbenchSummarylistPercent>
            <workbenchSummarylistPercent v-bind:data="monthWxData" color="#fe7c7c"
                                         :complete-desc="$t('workbench.timelyProcessing')"
                                         :uncomplete-desc="$t('workbench.noProcessing')"
                                         :percent-desc="$t('workbench.responseRate')"
              ></workbenchSummarylistPercent>
            <workbenchSummarylistPercent v-bind:data="monthInternetData" color="#f8cb00"
                                         :complete-desc="$t('workbench.timelyProcessing')"
                                         :uncomplete-desc="$t('workbench.noProcessing')"
                                         :percent-desc="$t('workbench.responseRate')"
              ></workbenchSummarylistPercent>
            <workbenchSummarylistPercent v-bind:data="monthAppData" color="#65c3df"
                                         :complete-desc="$t('workbench.timelyProcessing')"
                                         :uncomplete-desc="$t('workbench.noProcessing')"
                                         :percent-desc="$t('workbench.responseRate')"
              ></workbenchSummarylistPercent>
            <workbenchSummarylistPercent v-bind:data="monthMailData" color="#999"
                                         :complete-desc="$t('workbench.timelyProcessing')"
                                         :uncomplete-desc="$t('workbench.noProcessing')"
                                         :percent-desc="$t('workbench.responseRate')"
              ></workbenchSummarylistPercent>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import workbenchSummarylistPercent from './SummaryListPercent'
  export default {
    name: 'workbenchsummarylist',
    props: {
      summaryList: Object
    },
    components: {
      workbenchSummarylistPercent
    },
    data () {
      return {
        todayCdrData: {
          all: this.summaryList.todayCdrData.all,
          complete: this.summaryList.todayCdrData.complete,
          iconClass: ['icon-huru', 'call-in'],
          percentDesc: '接通率',
          completeDesc: '接听',
          uncompleteDesc: '未接'
        },
        todayWxData: {
          all: this.summaryList.todayWxData.all,
          complete: this.summaryList.todayWxData.complete,
          iconClass: 'icon-weixinzixun',
          percentDesc: '响应率',
          completeDesc: '及时处理',
          uncompleteDesc: '未及时处理'
        },
        todayInternetData: {
          all: this.summaryList.todayInternetData.all,
          complete: this.summaryList.todayInternetData.complete,
          iconClass: 'icon-hulianwang',
          percentDesc: '响应率',
          completeDesc: '及时处理',
          uncompleteDesc: '未及时处理'
        },
        todayAppData: {
          all: this.summaryList.todayAppData.all,
          complete: this.summaryList.todayAppData.complete,
          iconClass: 'icon-yidongduan',
          percentDesc: '响应率',
          completeDesc: '及时处理',
          uncompleteDesc: '未及时处理'
        },
        todayMailData: {
          all: this.summaryList.todayMailData.all,
          complete: this.summaryList.todayMailData.complete,
          iconClass: 'icon-gongzuotaiyoujian',
          percentDesc: '响应率',
          completeDesc: '及时处理',
          uncompleteDesc: '未及时处理'
        },
        monthCdrData: {
          all: this.summaryList.monthCdrData.all,
          complete: this.summaryList.monthCdrData.complete,
          iconClass: ['icon-huru', 'call-in'],
          percentDesc: '接通率',
          completeDesc: '接听',
          uncompleteDesc: '未接'
        },
        monthWxData: {
          all: this.summaryList.monthWxData.all,
          complete: this.summaryList.monthWxData.complete,
          iconClass: 'icon-weixinzixun',
          percentDesc: '响应率',
          completeDesc: '及时处理',
          uncompleteDesc: '未及时处理'
        },
        monthInternetData: {
          all: this.summaryList.monthInternetData.all,
          complete: this.summaryList.monthInternetData.complete,
          iconClass: 'icon-hulianwang',
          percentDesc: '响应率',
          completeDesc: '及时处理',
          uncompleteDesc: '未及时处理'
        },
        monthAppData: {
          all: this.summaryList.monthAppData.all,
          complete: this.summaryList.monthAppData.complete,
          iconClass: 'icon-yidongduan',
          percentDesc: '响应率',
          completeDesc: '及时处理',
          uncompleteDesc: '未及时处理'
        },
        monthMailData: {
          all: this.summaryList.monthMailData.all,
          complete: this.summaryList.monthMailData.complete,
          iconClass: 'icon-gongzuotaiyoujian',
          percentDesc: '响应率',
          completeDesc: '及时处理',
          uncompleteDesc: '未及时处理'
        }
      }
    },
    computed: {
      refresh: function () {
        this.todayAppData.all = this.summaryList.todayAppData.all
        this.todayCdrData.all = this.summaryList.todayCdrData.all
        this.todayWxData.all = this.summaryList.todayWxData.all
        this.todayInternetData.all = this.summaryList.todayInternetData.all
        this.todayMailData.all = this.summaryList.todayMailData.all
        this.todayAppData.complete = this.summaryList.todayAppData.complete
        this.todayCdrData.complete = this.summaryList.todayCdrData.complete
        this.todayWxData.complete = this.summaryList.todayWxData.complete
        this.todayInternetData.complete = this.summaryList.todayInternetData.complete
        this.todayMailData.complete = this.summaryList.todayMailData.complete
        this.monthAppData.all = this.summaryList.monthAppData.all
        this.monthCdrData.all = this.summaryList.monthCdrData.all
        this.monthWxData.all = this.summaryList.monthWxData.all
        this.monthInternetData.all = this.summaryList.monthInternetData.all
        this.monthMailData.all = this.summaryList.monthMailData.all
        this.monthAppData.complete = this.summaryList.monthAppData.complete
        this.monthCdrData.complete = this.summaryList.monthCdrData.complete
        this.monthWxData.complete = this.summaryList.monthWxData.complete
        this.monthInternetData.complete = this.summaryList.monthInternetData.complete
        this.monthMailData.complete = this.summaryList.monthMailData.complete
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "styl/_workbench.styl"
  .workbench-summarylist
    float left
    width calc(75% - 12px)
    margin 5px
    border 1px solid #e7e7eb
    height 357px
    background #fff
  .workbench-summarylist-today
  .workbench-summarylist-month
    padding 12px 18px
</style>
