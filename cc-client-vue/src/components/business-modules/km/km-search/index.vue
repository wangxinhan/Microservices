<template>
  <div class="km-search">
    <p v-if="KmType === 'inner'">{{$t('km.useForInternalSearch')}}</p>
    <p v-else>{{$t('km.useForOnlineCustomer')}}</p>
    <kmTree :KmType="KmType"  @recentUpdate="recentUpdate"></kmTree>
  </div>
</template>
<script>
  import kmTree from 'components/business-modules/km/km-search/KmTree.vue'
  export default {
    name: 'kmSearch',
    props: ['KmType'],
    data () {
      return {
      }
    },
    methods: {
      recentUpdate (recentUpdate) {
        this.$emit('recentUpdate', recentUpdate)
      }
    },
    components: {
      kmTree
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl";
  .km-search
    width 428px
    height calc(100vh - 53px)
    float left
    border-right 1px solid #d3d3d3
    p
      padding-left 24px
      height 50px
      line-height 50px
      font-size 18px
      color $cf-gray4
      border-bottom 1px solid #eeeff2

</style>
