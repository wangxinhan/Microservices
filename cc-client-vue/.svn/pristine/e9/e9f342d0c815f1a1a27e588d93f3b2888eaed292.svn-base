<template>
  <div class="quality">
    <div class="" >
      <el-tabs v-model="activeName" :active-name="activeName" @tab-click="tabChange">
        <el-tab-pane :label="$t('qualityCheck.normal')"  name="normal">
          <template>
            <normal v-if="activeName === 'normal'"></normal>
          </template>
        </el-tab-pane>
        <el-tab-pane :label="$t('qualityCheck.random')" name="random">
          <template>
            <random v-if="activeName === 'random'"></random>
          </template>
        </el-tab-pane>
        <el-tab-pane :label="$t('qualityCheck.task')"  name="task">
          <template>
            <task v-if="activeName === 'task'"></task>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
  import normal from './Check/Normal'
  import random from './Check/Random'
  import task from './Check/Task.vue'
  export default {
    name: 'qualityCheck',
    data () {
      return {
        activeName: this.$route.params.tabType || 'normal',
        loading: false,
        tabPanes: [
        ]
      }
    },
    components: {
      normal,
      random,
      task
    },
    methods: {
      tabChange (tab) {
        this.$router.push({ path: '/index/qualityCheck/quality_check/' + tab.name })
      }
    },
    beforeMount () {
//      this.$router.push({ path: '/index/qualityCheck/quality_check/' + this.activeName })
    }
  }
</script>
<style lang="stylus" scoped>
  .quality
    height calc(100vh - 53px)
</style>
