<template>
  <el-tooltip class="item" popper-class="assignPopper"  content="分配" placement="right">
    <span class="icon-assign" @click="Assign"><i class= "iconfont icon-fenpei"></i></span>
  </el-tooltip>
</template>
<script>
  export default {
    name: 'Assign',
    methods: {
      Assign () {
        this.$emit('assign')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .icon-assign
    flex 1
    cursor pointer
    .iconfont
      color #1abb9c
  .assignPopper
    background-color pink !important
</style>
