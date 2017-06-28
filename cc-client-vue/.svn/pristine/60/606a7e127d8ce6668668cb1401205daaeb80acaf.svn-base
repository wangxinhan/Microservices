<template>
  <div class="card-search-group ele-v-search">
    <slot :name="'subMenu_'+type"></slot>
    <div class="flex">
      <slot :name="'select_'+type"></slot>
      <slot :name="'inputSearch_'+type"></slot>
      <slot :name="'advancedSearch_'+type"></slot>
      <slot :name="'CustRefresh_'+type"></slot>
      <slot :name="'dropdownSelect_'+type"></slot>
      <slot :name="'export_'+type"></slot>
      <slot :name="'assign_'+type"></slot>
      <slot :name="'delete_'+type"></slot>
      <slot :name="'refresh_'+type"></slot>
    </div>
    <slot :name="'advSchBadge_'+type"></slot>
  </div>
</template>
<script>
  export default {
    name: 'Search',
    props: {
      isChildren: Object,
      type: String
    },
    data () {
      return {
        typeA: this.type,
        input5: '',
        formStacked: {
          name: '',
          region: '',
          type: ''
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../../assets/common"
.card-search-group
  .flex
    display flex
    align-items center
    min-height 40px
    font-size 0
    background #fff
    border-bottom 1px solid $c-border1
    [class^="icon-"]
      margin-right 8px
  .nomal
    margin 0 10px
    flex 8
  .high
    width 60px
    font-size 12px
    line-height 30px
    margin-right 10px
    flex 3
    a
      color $c-main
  .rel-operation
    font-size 16px
    margin-right 10px
    flex 1
    color $c-main
    cursor pointer
</style>
