<template>
  <div class="monitor" >
    <div class="loading"
         v-loading="loading"
         element-loading-text="拼命加载中"
         v-if="loading">
    </div>
    <el-tabs :active-name="activeName" @tab-click="tab" v-if="!loading">
      <el-tab-pane :label="$t('monitor.table')" name="table" style="margin-left:12px">
      </el-tab-pane>
      <el-tab-pane :label="$t('monitor.chart')" name="chart">
      </el-tab-pane>
      <router-view></router-view>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    name: 'monitor',
    data () {
      return {
        activeName: 'table',
        loading: true
      }
    },
    created () {
//      this.$router.push({ path: '/index/monitor/table' })
    },
    methods: {
      tab (tab, event) {
        this.$router.push({ path: '/index/monitor/' + tab.name })
      }
    },
    beforeMount () {
      let self = this
      let p1 = this.$store.dispatch('imMonitorInit', {})
      let p2 = this.$store.dispatch('getCache', {type: 'mailQueues'})
      let p3 = this.$store.dispatch('getCache', {type: 'onlineChannelAgent'})
      let p4 = this.$store.dispatch('getCache', {type: 'agents'})
      Promise.all([p1, p2, p3, p4]).then(function () {
        self.loading = false
        let pathArr = self.$route.fullPath.split('/')
        if (pathArr.length === 4) {
          self.activeName = pathArr[3]
          self.$router.push({path: '/index/monitor/' + pathArr[3]})
        } else {
          self.$router.push({ path: '/index/monitor/table' })
        }
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .monitor
    height calc(100vh - 53px)
    background #fff
  .loading
    height: 100vh
  .el-tabs__item
    margin-left: 12px
</style>
