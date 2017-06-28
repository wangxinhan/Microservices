<template>
    <div class="summary" v-loading="loading" :element-loading-text="$t('public.loadingText')">
      <slot name="customerSlot"></slot>
      <slot name="funTabSlot"></slot>
      <!--<slot name="PopDragSearch"></slot>-->
    </div>
</template>
<script>
  export default {
    name: 'ContactSummarySlot',
    props: {
      loading: {type: Boolean, default: false}
    }
  }
</script>
<style lang="stylus" scoped>
@import '../../../assets/common.styl'
.loading
  height: 100vh
.summary
  height: 131px;
  /*border-bottom 1px solid $c-border*/
  padding 0 20px
  background-color $c-back
</style>
