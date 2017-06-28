<template>
  <div class="workbench-summarylist-percent row">
    <el-row>
      <el-col :span="17">
        <div class="percent-left fl">
          <div class="icon iconfont" v-bind:class="data.iconClass"></div>
        </div>
        <div class="percent-right fr">
          <div class="percent-right-complete"  v-bind:style="{ width: percent+ '%' }">
            {{completeDesc+data.complete}}
          </div>
          <div class="percent-right-uncomplete" v-bind:style="{ width: 100-percent+ '%' }">
            {{uncompleteDesc+(data.all - data.complete>=0?data.all - data.complete:0)}}
          </div>
        </div>
      </el-col>
      <el-col :span="7" class="charts">
        <div class="wrap">
          <div class="circle" v-bind:class="{'clip-auto': circle0 }">
            <div class="percent left" v-bind:style="{ transform: 'rotate('+(18/5)*percent+'deg)','border-color':color}"></div>
            <div class="percent right" v-bind:class="{ wth0: wth0 }" v-bind:style="{borderColor:color}"></div>
          </div>
          <div class="num"><span>{{percent}}</span>%</div>
        </div>
        <div class="percent-describ">{{percentDesc}}</div>
      </el-col>
    </el-row>
  </div>

</template>
<script>
  export default {
    name: 'summaryPercent',
    props: ['data', 'color', 'completeDesc', 'uncompleteDesc', 'percentDesc'],
    data () {
      return {
        circle0: false,
        wth0: true

      }
    },
    computed: {
      percent: function () {
        var num
        if (this.data.all === 0) {
          num = 100
        } else {
          num = Math.round(100 * this.data.complete / this.data.all)
          if (num > 100) {
            num = 100
          }
        }
        if (num < 50) {
          this.circle0 = false
          this.wth0 = true
        } else if (num > 50) {
          this.circle0 = true
          this.wth0 = false
        }
        return num
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "styl/_workbench.styl"
  @import '../../../assets/common.styl'
  .wrap
  .circle
  .percent
    position absolute
    width 50px
    height 50px
    border-radius 50%
  .wrap
    position relative
    background-color #f7f7f7
  .circle
    box-sizing border-box
    border 3px solid #f7f7f7
    clip rect(0, 50px, 50px, 25px)
  .clip-auto
    clip rect(auto, auto, auto, auto)
  .percent
    box-sizing border-box
    top -3px
    left -3px

  .left
    transition transform ease
    border 3px solid blue
    clip rect(0, 25px, 50px, 0)

  .right
    border 3px solid blue
    clip rect(0, 50px, 50px, 25px)


  .wth0
    width 0


  .num
    position absolute
    box-sizing border-box
    width 44px
    height 44px
    line-height 44px
    text-align center
    font-size 14px
    left 3px
    top 3px
    border-radius 50%
    background-color #fff
    color $cf-gray3
    z-index 1

  .percent-describ
    position absolute
    left 72px
    top 25%
    color $cf-gray3
    font-size 12px

  .workbench-summarylist-percent
    padding 5px 0px

  .workbench-summarylist-percent
    .el-col-7
      margin-top -3px
      padding 0

    .el-col-17
      padding-right 18px
  .percent-left
    width 70px
    height 45px
    border-bottom-left-radius 18px 22px
    border-top-left-radius 18px 22px
    background-color #ebebeb

  .percent-right
    width calc(100% - 71px)
    height 100%
    white-space nowrap

  .percent-bar-common
    height 22px
    line-height 22px
    font-size 12px
    color $cf-gray3
    border-top-right-radius 11px 11px
    border-bottom-right-radius 11px 11px
    min-width 100px
    text-indent 5px

  .percent-right-complete
    background-color #e6e6e6
    margin-bottom 1px
    @extend .percent-bar-common

  .percent-right-uncomplete
    background-color #f0f0f0
    @extend .percent-bar-common

  .icon
    width 30px
    height 30px
    margin 6px 0 0 25px
    font-size 30px
    color #7bcdd2

  .workbench-summarylist-percent
    .im_icon
      background-position center -37px
    .internet_icon
      background-position center -76px
    .app_icon
      background-position center -118px
    .mail_icon
      background-position center -155px
    .cdr_icon
      background-position center 1px
  .call-in
    font-size 24px
    margin-top 8px
  .charts
    position relative
</style>
