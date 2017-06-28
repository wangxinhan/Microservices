<template>
  <div class="ui-affix">
    <span class="ui-title">
      <h3 class="title"><i class="square"></i>{{ label }}</h3>
    </span>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'Affix',
    props: {
      label: String
    },
    data () {
      return {
      }
    }
  }
</script>
<style lang="stylus" scoped>
.ui-affix
  position relative
  margin-top 12px
  padding  18px 20px 27px 20px
  &:after
    content ''
    border-top 1px dashed #a6a6a6
    height 1px
    width 100%
    position absolute
    top -4px
    left 0
  .ui-title
    position absolute
    top -13px
    left 0
    display block
    width 100%
    .title
      position absolute
      background-color #fff
      padding-right 10px
      z-index 4
      color #000
      font-size 14px
      &:before
        content ''
        display inline-block
        width 12px
        height 12px
        background-color #7bcdd2
        margin-right 8px
</style>
