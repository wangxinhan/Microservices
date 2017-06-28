<template>
  <div>
    <div v-if="isBlank==='cdr_call'" class="cdr-wrap">
      <p class="p1">{{$t('call.callCardWarnRight')}}</p>
      <p class="p2">{{$t('call.callCardWarnRight2')}}</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'CdrCallBlank',
    data () {
      return {
      }
    },
    computed: {
      isBlank () {
        return this.$route.params.tabName || 'cdr_call'
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .cdr-wrap
    padding 10px 0 0 30px
  .p1
    color #00c7d1
    font-weight bolder
    line-height 2
  .p2
    color #00c7d1
</style>
