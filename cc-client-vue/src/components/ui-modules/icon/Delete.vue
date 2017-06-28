<template>
  <span class="icon-delete" @click="Delete"><i class="iconfont icon-shanchu"></i></span>
</template>
<script>
  export default {
    name: 'Delete',
    methods: {
      Delete () {
        this.$emit('delete')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .icon-delete
    flex 1
    text-align center
    cursor pointer
    .icon-shanchu
      color #1abb9c
</style>
