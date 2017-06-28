<template>
  <div class="workbench-top10list">
    <div class="workbench-title">
      {{$t('workbench.ranking')}}
      <div class="fr top-choose">
        <span class="top-day" ds-attr='day' v-bind:class = "{top_active: activeSlip=='day'}" v-on:click.stop="active('day')">{{$t('workbench.day')}}</span>
        <span class="top-month" ds-attr='month' v-bind:class = "{top_active: activeSlip=='month'}" v-on:click.stop="active('month')">{{$t('workbench.month')}}</span>
      </div>
    </div>
    <div class="workbench-top10list-content">
      <table class = "rank table">
        <tr v-for="item in 10">
          <td>{{item}}</td>
        </tr>
      </table>
      <el-row>
        <el-col :span="6" class="workbench-top10list-cdr">
          <div class="icon iconfont icon-gongzuotaiwangguan top10list-cdr-icon">
            <i class="icon iconfont icon-dianhuahuru"></i>
          </div>
          <table class="table">
            <tr  v-for="(list,index) in currentData.cdrTop10">
              <td class="work_name">{{list.name}}</td><td>{{list.score}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="6" class="workbench-top10list-mail">
          <div class="icon iconfont icon-gongzuotaiwangguan top10list-mail-icon">
            <i class="icon iconfont">&#xe650;</i>
          </div>
          <table class="table">
            <tr  v-for="list in currentData.mailTop10">
              <td  class="work_name">{{list.name}}</td><td>{{list.score}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="6" class="workbench-top10list-im">
          <div class="icon iconfont icon-gongzuotaiwangguan top10list-im-icon">
            <i class="icon iconfont">&#xe655;</i>
          </div>
          <table class="table">
            <tr  v-for="list in currentData.imTop10">
              <td class="work_name">{{list.name}}</td><td>{{list.score}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="6" class="workbench-top10list-bus">
          <div class="icon iconfont icon-gongzuotaiwangguan top10list-bus-icon">
            <i class="icon iconfont">&#xe63d;</i>
          </div>
          <table class="table">
            <tr  v-for="list in currentData.businessTop10">
              <td  class="work_name">{{list.name}}</td><td>{{list.score}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  //    import Workbench from './components/workbench/workbench.vue'
  export default {
    name: 'workbenchtop10list',
    props: {
      todayData: Object,
      monthData: Object
    },
    data () {
      return {
        activeSlip: 'day'
      }
    },
    computed: {
      currentData () {
        if (this.activeSlip === 'day') {
          return this.todayData
        } else {
          return this.monthData
        }
      }
    },
    methods: {
      active (date) {
        if (date === 'day') {
          this.activeSlip = 'day'
        } else {
          this.activeSlip = 'month'
        }
      }
    },
    mounted () {
      this.active('day')
    }
  }
</script>
<style scoped lang="stylus">
  @import "styl/_workbench.styl"
  table
    border-spacing 0
    border-collapse collapse
    background-color transparent
  .table
    border-collapse collapse
    width 100%
    max-width 100%
    margin-bottom 20px
  .table td
  .table th
    background-color #fff !important
  .table > thead > tr > th
  .table > tbody > tr > th
  .table > tfoot > tr > th
  .table > thead > tr > td
  .table > tbody > tr > td
  .table > tfoot > tr > td
    padding 8px
    line-height 1.42857143
    vertical-align top
    border-top 1px solid #ddd
  .table > thead > tr > th
    vertical-align bottom
    border-bottom 2px solid #ddd
  .table > caption + thead > tr:first-child > th
  .table > colgroup + thead > tr:first-child > th
  .table > thead:first-child > tr:first-child > th
  .table > caption + thead > tr:first-child > td
  .table > colgroup + thead > tr:first-child > td
  .table > thead:first-child > tr:first-child > td
    border-top 0
  .table > tbody + tbody
    border-top 2px solid #ddd
  .table .table
    background-color #fff
  .workbench-top10list
    float  left
    width calc(55% - 12px)
    margin  5px
    border  1px solid #e7e7eb
    height  380px
    background  #fff
    .workbench-title
      position  relative
      .top-choose
        position  absolute
        right  40px
        top  0
        span
          display  block
          float  left
          margin-left  10px
          width  28px
          height  40px
          cursor pointer
  .top_active
    color #1abb9c
    box-sizing  border-box
    border-bottom  3px solid #1abb9c

  .workbench-top10list-content
    font-size  12px
    position  relative
    height  100%
    padding  0 30px 0 70px
    .table
      table-layout fixed
      & last-of-type
         border-bottom none
      tr
        height  19px
        line-height  19px
        border-bottom  1px dashed #d9d9d9
        text-align  center
        color $cf-gray3
        & last-of-type
           border-bottom none
        .work_name
          overflow hidden
          width 100px
          text-overflow ellipsis
          white-space nowrap
  .rank
    position  absolute
    left  48px
    top  120px
    width  22px
    p
      height  19px
      border-bottom  1px dashed #d9d9d9
      color  #989898
      padding  0
      margin  0
      text-align  center

  div[class^="icon"]
    width 96px
    height  96px
    line-height 96px
    font-size 96px
    text-align center
    margin  12px auto
    position relative
    i
      display inline-block
      font-size 30px
      position absolute
      top 23px
      left 33px
      color white
  .workbench-top10list-cdr .top10list-cdr-icon
    color #65c3df
  .workbench-top10list-mail .top10list-mail-icon
    color #d498e9
  .workbench-top10list-im .top10list-im-icon
    color #f8cb00
  .workbench-top10list-bus .top10list-bus-icon
    color #7bcdd2
  .workbench-top10list-im .table tr:nth-child(-n+3)
    color #f8cb00
  .workbench-top10list-mail .table tr:nth-child(-n+3)
    color #c35de8
  .workbench-top10list-cdr .table tr:nth-child(-n+3)
    color #65c3df
  .workbench-top10list-bus .table tr:nth-child(-n+3)
    color #00c7d1
</style>
