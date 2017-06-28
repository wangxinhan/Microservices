<template>
  <span class="icon-refresh" @click="refresh"><i class= "iconfont icon-shuaxin"></i></span>
</template>
<script>
  export default {
    name: 'Refresh',
    methods: {
      refresh () {
        this.$emit('refresh')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .icon-refresh
    flex 1
    cursor pointer
    text-align center
    margin-right 8px
    .iconfont
      color #1abb9c
</style>
