<template>
  <div class="smsImport">
    <!--左侧card 列表  通过组件引入-->
    <template>
      <si-search :refresh="refresh"></si-search>
    </template>
    <!--右侧详情  通过 router路由引入-->
    <template v-if="loading">
      <transition name="fade" mode="out-in">
        <router-view>
        </router-view>
      </transition>
    </template>
  </div>
</template>
<script>
  import siSearch from 'components/business-modules/sms/sms-import/smsImportSearch.vue'
  export default {
    name: 'smsImport',
    props: {
      refresh: String,
      loading: false
    },
    data () {
      return {
      }
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'import') {
          this.$router.push({path: '/index/sms'})
          this.loading = true
        }
      }
    },
    components: {
      siSearch
    }
  }
</script>
<style lang="stylus" scoped>
</style>
