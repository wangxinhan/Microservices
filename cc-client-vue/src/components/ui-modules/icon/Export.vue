<template>
  <span class="icon-daochu" @click="Export"><i class= "iconfont icon-daochu1"></i></span>
</template>
<script>
  export default {
    name: 'Export',
    methods: {
      Export () {
        this.$emit('export')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .icon-daochu
    flex 1
    cursor pointer
    text-align center
    .iconfont
      color #1abb9c
</style>
