<template>
  <div class="right-content">
    <div class="card-group">
      <slot name="card"></slot>
    </div>

    <div class="detail">
      <slot name="detail"></slot>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common.styl";
.right-content
  box-size(100%,100%)
  display flex
  flex-flow row
.card-group
  box-size(340px,100%)
  border-right 1px solid $c-border1
.detail
  flex 1
  height 100vh
  width calc(100vw - 404px)
  background-color #fff
</style>
