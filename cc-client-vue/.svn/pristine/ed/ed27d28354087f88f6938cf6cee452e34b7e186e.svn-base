<template>
    <el-row v-if="!loading&&firstIn" class="business-tab">
      <new-business v-if="!busId&&!busIdOut&&tabName!=='business'" :cid="cid" v-on:event="businessEvent"></new-business>
      <temporary-business v-if="item&&isStartStep(item.step)" :detail="item" :tabName="tabName" v-on:event="businessEvent"></temporary-business>
      <business-info v-if="item&&!isStartStep(item.step)" :detail="item" :tabName="tabName" v-on:event="businessEvent"></business-info>
      <history v-if="showHistory&&item" :item="item"></history>
      <history-table v-if="showHistoryTable" :cid="cid" :callScreen="callScreen"></history-table>
    </el-row>
</template>
<script>
  import BusinessInfo from './BusinessInfo.vue'
  import History from './History.vue'
  import NewBusiness from './NewBusiness.vue'
  import TemporaryBusiness from './TemporaryBusiness.vue'
  import {getCache} from '../../../../utils/m7Utils.js'
  export default {
    name: 'BusinessSum',
    data () {
      return {
        loading: true,
        firstIn: false
      }
    },
    props: {
      busId: String,
      refresh: String,
      tabName: String,
      cid: String, // 客戶id
      showHistory: {type: Boolean, default: false},
      showHistoryTable: {type: Boolean, default: false},
      callScreen: Boolean
    },
    components: {
      BusinessInfo,
      History,
      NewBusiness,
      TemporaryBusiness
    },
    computed: {
      item () {
        let item
        if (this.busId) {
          item = this.$store.state.business['current'].businessAction[this.busId]
        } else {
          item = ''
        }
        return item
      },
      firstInComputed () {
        // 首次进入工单模块
        if (this.refresh === 'business' || !this.refresh) {
          this.firstIn = true
        }
        return true
      }
//      firstInComputed () {
//        // 首次进入工单模块
//        debugger
//        if (this.refresh === 'business' || !this.refresh) {
//          this.firstIn = true
//        }
//        return 'abc'
//      }
    },
    methods: {
      businessEvent (eventData) {
        let eventType = eventData.event
        let data = eventData.data
        if (eventType === 'addBusinessTask') {
          this.$store.dispatch('addBusinessTask', data.form).then((res) => {
            eventData.data._id = res
            this.$emit('event', eventData)
          })
        } else if (eventType === 'addTempBusinessTask') {
          this.$store.dispatch('addTempBusinessTask', data.form).then((res) => {
            eventData.data._id = res
            this.$emit('event', eventData)
          })
        } else if (eventType === 'stepAction') {
          this.$store.dispatch('excuteBusinessStepAction', data.form).then((res) => {
            this.$emit('event', eventData)
          })
        } else if (eventType === 'commentAction') {
        } else if (eventType === 'backAction') {
          this.$store.dispatch('excuteBusinessBackAction', data.form).then(() => {
            this.$emit('event', eventData)
          })
        } else if (eventType === 'changeBusinessMaster') {
          this.$emit('event', eventData)
        }
      },
      isStartStep (stepId) {
        let step = getCache('businessFlowStep', stepId)
        if (step.isBegin) {
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      refresh () {
        if (this.refresh === 'business' || !this.refresh) {
          this.firstIn = true
        }
      }
    },
    beforeCreate: function () {
      this.$options.components.HistoryTable = require('../../../business-modules/business/HistoryTable.vue')
    },
    beforeMount () {
      let self = this
      if (this.refresh === 'business' || !this.refresh) {
        this.firstIn = true
      }
      Promise.all([
        this.$store.dispatch('getCache', {type: 'businessFlowStep'}),
        this.$store.dispatch('getCache', {type: 'businessFlow'}),
        this.$store.dispatch('getCache', {type: 'agents'})
      ]).then(() => {
        self.loading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/common.styl'
  .el-row
    @extend .font14
    .add-ramark
      @extend .font16
      margin-left 26px
      span
        height 20px
        line-height 20px
      i
        display inline-block
        width 20px
        height 20px
        background-color  $c-main
        margin-right 8px
  .business-tab
    padding 20px 20px
</style>
