<template>
  <right>
    <template slot="card">
      <CardGroup :currentTabType="currentTabType" @changeCardItem="changeCardItem" @tabChange="tabChange"></CardGroup>
    </template>
    <template slot="detail">
      <div v-loading="rLoading" :element-loading-text="$t('public.loadingModuleText')" v-show="rLoading" style="height: 600px">
      </div>
      <transition name="fade" mode="out-in" @before-enter="beforeEnter">
        <router-view @routeChange="routeChange">
        </router-view>
      </transition>
    </template>
  </right>
</template>
<script>
  import right from 'components/ui-modules/right-layout/RightLayout'
  import CardGroup from './CallCardGroup.vue'
  import ContactSummary from 'components/public-modules/contact-summary'
  export default {
    name: 'call',
    data () {
      return {
        tabType: 'cdr_call',
        rLoading: false,
        loadResource: false
      }
    },
    components: {
      right,
      CardGroup,
      ContactSummary
    },
    computed: {
      currentTabType () {
        return this.tabType
      }
    },
    methods: {
      routeChange (tabType) {
        this.tabType = tabType
      },
      changeCardItem () {
        if (!this.loadResource) {
          this.rLoading = true
        }
      },
      beforeEnter () {
        this.loadResource = true
        this.rLoading = false
      },
      tabChange (tabType) {
        this.tabType = tabType
      }
    },
    beforeMount () {
      this.loadResource = true
    }
  }
</script>
<style lang="stylus" scoped>
.call
  background #efefef
  color $cf-level2
li
  width 439px
  height 79px
  border-bottom 1px solid #eee
.cust-info
  min-height 141px
  max-width 200px
  width 100%
.cust-tab
  height:100%
</style>
