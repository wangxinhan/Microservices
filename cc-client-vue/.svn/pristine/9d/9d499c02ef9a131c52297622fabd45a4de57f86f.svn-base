<template>
  <li :class="[{ first: isFirst },'ui-time-line' ]"><slot></slot></li>
</template>
<script>
  export default {
    name: 'TimeLine',
    props: {
      isFirst: Boolean
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
    &:after
      content ""
      width 1px
      height 24px
      display inline-block
      position absolute
      top 12px
      left 5.5px
      margin-right 12px
      border-radius 6px
      z-index -1
      background-color #bfbfbf
    &:last-child
      &:after
        width 0
        height 0
  .first
    &:first-child
      &:before
        background-color #1abb9c

</style>
