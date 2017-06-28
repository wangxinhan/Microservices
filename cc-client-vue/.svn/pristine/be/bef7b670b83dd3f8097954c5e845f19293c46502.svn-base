<template>
<div class="view ui-index">
  <sidebar-nav @changeMenu="changeMenu"></sidebar-nav>
  <called-bar></called-bar>
  <div v-loading="loading" :element-loading-text="$t('public.loadingModuleText')" class="loading-index">
   <transition
    name="fade"
    mode="out-in"
    @before-enter="beforeEnter"
    >
     <keep-alive>
        <router-view ></router-view>
     </keep-alive>
    </transition>
  </div>
</div>
</template>
<script>
  import sidebarNav from '../public-modules/nav'
  import calledBar from '../public-modules/phone-bar'
  export default {
    name: 'Main',
    data () {
      return {
        loading: false,
        loadModule: []
      }
    },
    methods: {
      changeMenu (module) {
        if (this.loadModule.indexOf(module) === -1) {
          this.loading = true
          this.loadModule.push(module)
        } else {
          this.loading = false
        }
      },
      // --------
      // 进入中
      // --------
      beforeEnter (el) {
        // ...
        this.loading = false
        console.log('beforeEnter')
      }
    },
    components: {
      sidebarNav,
      calledBar
    }
  }
</script>
<style lang="stylus" scoped>
.view
  margin 53px 0 0 64px
  box-sizing border-box
  background #f5f5f5
  height 100vh
.fade-enter-active, .fade-leave-active
  transition all .2s ease
.fade-enter, .fade-leave-active
  opacity 0

</style>
