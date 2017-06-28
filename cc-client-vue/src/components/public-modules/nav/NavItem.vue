<template>
  <div @click.stop="click" class="nav-box">
    <router-link :to="link">
      <el-tooltip :openDelay="200" transition="fade-leave" class="item" effect="dark" :content="tipContent" placement="right-start">
        <div class="nav-item-wrap">
          <el-badge is-dot :class="{m7badge: noBadge}" class="item">
            <div class="nav-item-icon" v-bind:class="[navType]">
              <span class="iconfont" :class="ic"></span>
            </div>
          </el-badge>
        </div>
      </el-tooltip>
    </router-link>
    <div class="height-blank" v-if="link === '/index/km'"></div>
  </div>
</template>
<script>
    export default {
      name: 'navItem',
      props: ['navType', 'tipContent', 'noBadge', 'link', 'ic'],
      data () {
        return {
        }
      },
      methods: {
        click () {
          this.$store.commit('CLOSE_ADV_SEARCH')
          this.$emit('changeRoute', this.navType)
        }
      }
    }
</script>
<style lang="stylus" scoped>
  .height-blank
    height 1.28em
    margin-bottom 1.28em
    border-bottom 1px solid #0085ae
    &:after
      content: '';
      width: 100%;
      height: 1.14em;
      border-bottom: 1px solid #00a0d1;
      display: block;
  .iconfont
    font-size 1.58em
    color #d9f5ff
  .nav-item-wrap
    width 64px
    height 2.7em
    display flex
    justify-content center
    align-items center
    box-sizing border-box
  .router-link-active
    .nav-item-wrap
      background-color #01678c
      .iconfont
        color #fff
</style>
