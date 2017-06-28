<template>
  <right>
    <template slot="card">
      <CardGroup @changeCardItem="changeCardItem"></CardGroup>
    </template>
    <template slot="detail">
      <div v-loading="rLoading" :element-loading-text="$t('public.loadingModuleText')" v-show="rLoading" style="height: 600px">
      </div>
      <transition name="fade" mode="out-in" @before-enter="beforeEnter">
        <router-view>
        </router-view>
      </transition>
    </template>
  </right>
</template>
<script>
  import right from 'components/ui-modules/right-layout/RightLayout'
  import CardGroup from './BusinessCardGroup.vue'
  export default {
    name: 'Business',
    data () {
      return {
        rLoading: false,
        loadResource: false
      }
    },
    methods: {
      changeCardItem () {
        if (!this.loadResource) {
          this.rLoading = true
        }
      },
      beforeEnter () {
        this.loadResource = true
        this.rLoading = false
        console.log('beforeEnter webchat')
      }
    },
    beforeMount () {
      this.loadResource = true
    },
    components: {
      right,
      CardGroup
    }
  }
</script>
<style lang="stylus" scoped>

</style>
