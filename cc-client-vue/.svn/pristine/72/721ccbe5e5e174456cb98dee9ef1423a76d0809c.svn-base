<template>
  <right>
    <template v-loading="loading" v-if="!loading" slot="card">
      <CardGroup :currentTabType="currentTabType" @changeCardItem="changeCardItem"></CardGroup>
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
  import CardGroup from './EmailCardGroup.vue'
  export default {
    name: 'Email',
    data () {
      return {
        loading: true,
        emailList: [],
        rLoading: false,
        loadResource: false
      }
    },
    components: {
      right,
      CardGroup
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
      }
    },
    computed: {
      currentTabType () {
        return this.tabType
      }
    },
    beforeMount () {
      this.loadResource = true
      this.loading = false
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
