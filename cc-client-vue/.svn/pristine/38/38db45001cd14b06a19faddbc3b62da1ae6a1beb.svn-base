<template>
  <ul>
    <li class="ui-time-line" :class="{isStartPage: item.isStartPage}" v-for="item in ubaInfoListPages">
      <el-tooltip v-if="item.isStartPage" class="tooltip" content="访客由此页面进入咨询" placement="left">
        <el-button></el-button>
      </el-tooltip>
      <div class="time_line_box">
        <span class="uba_time_warp">{{item.timeStart ? item.timeStart : ' '}}</span>
        <span class="uba_page_stay" style="color: #FFB272">{{item.stayTimeDesc}}</span>
      <span class="currentUrl_warp">
        <a :href="item.currentUrl" target="_blank">{{item.title}}</a>
      </span>
      </div>
    </li>
  </ul>
</template>
<script>
  export default {
    name: 'webChatTimeLine',
    props: {
      ubaInfoListPages: Array
    },
    data () {
      return {
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .ui-time-line
    margin-top 14px
    position relative
    color $cf-gray3
    z-index 10
    &:before
      content ""
      width 12px
      height 12px
      display inline-block
      margin 4px 12px 0 0
      border-radius 6px
      background-color #bfbfbf
      z-index 10
      float left
    &:after
      content ""
      width 1px
      height 40px
      display inline-block
      position absolute
      top 10px
      left 5.5px
      margin-right 12px
      border-radius 6px
      z-index -1
      background-color #bfbfbf
    &:last-child
      &:after
        width 0
        height 0
  .isStartPage
    &:before
      background-color #1abb9c
  .fade-enter-active,
  .fade-leave-active
    transition all 0.5s ease
   .fade-enter,
   .fade-leave-active
    opacity 0
  .tooltip
    background transparent
    border none
    position absolute
    left -7px
    top -3px
  .time_line_warp
    max-height 170px
    overflow-y auto
    padding-bottom 10px
  .uba_page_stay
    font-size 12px
    position absolute
    left 25px
    top 15px
  .uba_time_warp
    display block
  .currentUrl_warp
    display block
    padding-left 5px
    word-break break-all
  .time_line_box
    display flex
    min-height 30px
</style>
