<template>
  <div class="badge" v-show="visible">
    <span class="label">{{$t('public.searchBadge')}}</span>
    <span class="badge_info" v-for="badge in badges">{{badge}}</span>
    <span class="el-icon-close" @click="removeBadge"></span>
  </div>
</template>
<script>
    export default {
      name: 'AdvSchBadge',
      props: {
        badge: Object
      },
      data () {
        return {
        }
      },
      computed: {
        badges () {
          return this.badge
        },
        visible () {
          let obj = this.badge
          let show = false
          for (let key in obj) {
            if (key) {
              show = true
              break
            }
          }
          return show
        }
      },
      methods: {
        removeBadge () {
          this.$emit('removeBadge')
        }
      }
    }
</script>
<style lang="stylus" scoped>
@import "../../../../assets/common"
.badge
  display block
  padding 4px 0 0 10px
  height auto
  line-height 24px
  background #fafafa
  color #8d8d8d
  border-bottom 1px solid #eeeff2
  .label
    display block
    float left
    height 100%
    line-height 24px
  div
    display inline-block
  .badge_info
    display inline-block
    min-height 24px
    max-width 93%
    word-wrap break-word
    white-space normal
    margin 0 10px 0 0
    padding 0 10px
    border-radius 12px
    background #7bcdd2
    color #fff
    overflow hidden
  .el-icon-close
    display inline-block
    height 20px
    margin -6px 10px 0 0
    padding 0 10px
    vertical-align middle
    color #7bcdd2
    cursor pointer
</style>
