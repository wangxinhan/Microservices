<template>
  <div class="quality-check">
      <el-tabs  v-model="activeName" @tab-click="tabChange" v-if="!loading">
        <el-tab-pane :label="$t('qualityCheck.'+ item.label)" v-for="item in tabPanes" :name="item.name">
        </el-tab-pane>
        <router-view></router-view>
      </el-tabs>
  </div>
</template>
<script>
  import {isHasMenu} from '../../../utils/m7Utils.js'
  export default {
    name: 'qualityCheck',
    data () {
      return {
        activeName: 'quality_check'
      }
    },
    computed: {
      tabPanes () {
        let data = [
          {name: 'quality_check', label: 'qualityCheck', fun: 'func_quality_check'},
          {name: 'quality_check_result', label: 'qualityCheckResult', fun: 'func_quality_check_list_query'},
          {name: 'quality_check_agent', label: 'qualityCheckAgent', fun: 'func_quality_check_query'},
          {name: 'quality_check_task', label: 'qualityCheckTask', fun: 'func_quality_task_monitor'},
          {name: 'quality_check_cycle', label: 'qualityCheckCycle', fun: 'func_quality_check_cycle'}
        ]
        data.filter(item => {
          if (!isHasMenu(item.fun, this.$store.state.session.user)) {
            return false
          } else {
            return true
          }
        })
        return data
      }
    },
    methods: {
      tabChange (tab) {
        this.$router.push({ path: '/index/qualityCheck/' + tab.name })
      }
    },
    beforeMount () {
      let pathArr = this.$route.fullPath.split('/')
      if (pathArr.length === 3) {
        this.activeName = this.tabPanes[0].name
        this.$router.push({path: '/index/qualityCheck/' + this.tabPanes[0].name})
      } else {
        this.activeName = pathArr[3]
        this.$router.push({path: '/index/qualityCheck/' + pathArr[3]})
      }
      /* let self = this
      self.$store.dispatch('queryQualityCheckList', {TEMPLATE: '5a24a2e0-c03c-11e6-87fd-f1deb3478065'}
      ).then(function () {
        return self.$store.dispatch('showDetailviewWebchat', {_id: '30a1fe90-dd6f-11e6-a800-f1f37bbbe7f5', isReGrade: true, templateId: '5a24a2e0-c03c-11e6-87fd-f1deb3478065'})
      }) */
      /* .then(function () {
        return self.$store.dispatch('saveWebchatSheetGrade', {
          _id: '30a1fe90-dd6f-11e6-a800-f1f37bbbe7f5',
          TEMPLATE: '5a24a2e0-c03c-11e6-87fd-f1deb3478065',
          COMMENTS: 'fdsafdsaf',
          values: {1: 12, 2: 12, 3: 12},
          grade: 19,
          isReGrade: false
        })
      }) */
      /* .then(function () {
       return self.$store.dispatch('queryGradeResult', {TEMPLATE: '5a24a2e0-c03c-11e6-87fd-f1deb3478065'})
       }).then(function () {
       return self.$store.dispatch('agentRanking', {TEMPLATE: '5a24a2e0-c03c-11e6-87fd-f1deb3478065'})
       }).then(function () {
       return self.$store.dispatch('getQualityCheckRandomTemplates', {})
       }).then(function () {
       return self.$store.dispatch('conditionSearch', {templateId: '5f2699a0-e08b-11e6-93eb-4fb1c53636c6'})
       }).then(function () {
       return self.$store.dispatch('normalSearch', {TEMPLATE: '5a24a2e0-c03c-11e6-87fd-f1deb3478065'})
       }) */
    },
    activated () {
      if (this.$route.path.split('/').length === 3) {
        this.activeName = this.tabPanes[0].name
        this.$router.push({path: '/index/qualityCheck/' + this.tabPanes[0].name})
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .quality-check
    height calc(100vh - 53px)
</style>
