<template>
  <div class="source_from" v-loading="loading">
    <el-tabs v-model.trim="reportName" type="card" @tab-click="" class="header">
      <el-tab-pane label="搜索引擎" name="first">
        <search-engine></search-engine>
      </el-tab-pane>
      <el-tab-pane label="地区" name="second">
        <areas></areas>
      </el-tab-pane>
      <el-tab-pane label="关键字" name="third">
        <key-words></key-words>
      </el-tab-pane>
      <el-tab-pane label="来源页面" name="fourth">
        <source-page></source-page>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import areas from './form/Area'
  import KeyWords from './form/KeyWords'
  import SearchEngine from './form/SearchEngine'
  import SourcePage from './form/SourcePage'
  export default {
    name: 'source_from',
    data () {
      return {
        reportName: 'first'
      }
    },
    computed: {
    },
    components: {
      areas,
      KeyWords,
      SourcePage,
      SearchEngine
    },
    methods: {
    }
  }
</script>
<style lang="stylus" scoped>
</style>
