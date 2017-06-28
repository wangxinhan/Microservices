<template>
  <el-col :span="24" class="business-history" v-if="loading&&cons&&cons.length!==0">
    <affix :label="$t('business.businessHistory')">
      <el-col :span="24">
      <ul>
        <template v-for="con in cons" >
          <li class="treat">
            <div class="warpper">
              <span class="bac"><time><span>{{con.time}}</span></time></span>
              <div class="name">
                <span>{{con.user}}</span><span v-if="con.info.action !== 'transformIn' && con.info.action !== 'backIn'">{{con.info.actionName}}</span>
                <span v-if="con.info.error">{{con.info.error}}</span>
              </div>
              <div class="current-step" v-if="con.info.action === 'transformIn' || con.info.action === 'backIn'">
                <div class="process"  >
                  <span class="start">
                    {{con.info.fromStepName}}
                  </span>
                  <div class="goto">
                    <span class="todo">{{$t('business.action')}}【{{con.info.actionName}}】</span>
                    <span class="">
                     <i class="icon iconfont icon-dongzuobiangeng"></i>
                    </span>
                  </div>
                  <span class="end">
                    {{con.info.stepName}}
                  </span>
                </div>
                <div class="pc-time">
                  <span class="time" v-if="con.isUShow==='true'">
                    <el-popover
                      placement="bottom"
                      trigger="hover"
                      :content="con.color === 'red'? $t('business.stepCompleteOver'):$t('business.stepCompleteTime')">
                      <span v-bind:style="{ color: con.color}" slot="reference">{{con.stepUseTime}}</span >
                    </el-popover>
                    <!--<span v-bind:style="{ color: con.color}">{{con.stepUseTime}}</span >-->
                    <span v-if="con.isUShow==='true' && con.isStepShow==='true'">/</span>
                    <el-popover
                      v-if="con.isStepShow==='true'"
                      placement="bottom"
                      trigger="hover"
                      :content="$t('business.busStepTime')">
                      <span slot="reference">{{con.stepTime}}</span>
                    </el-popover>
                    <!--<span v-if="con.isStepShow==='true'">{{con.stepTime}}</span>-->
                  </span>
                </div>
              </div>

              <div v-if="con.data&&!isEmpty(con.data)" class="once-step">
                <div v-for="(value, key) in con.data">
                  <span>{{key}}:</span><span v-html="value" style="" class="break-all">{{value}}</span>
                </div>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </el-col>
  </affix>
 </el-col>
</template>
<script>
  import Affix from '../../../ui-modules/affix/Affix'
  import {getCache} from '../../../../utils/m7Utils.js'
  import { isEmpty } from 'lodash'
  import {taskTimeAll, getBusinessHisotryInfo, getUserNameById, getBusinessHistoryData} from '../../../../utils/workflowUtils.js'
  export default {
    name: 'busHistory',
    data () {
      return {
        loading: false
      }
    },
    props: {
      item: Object
    },
    methods: {
      isEmpty (a) {
        return isEmpty(a)
      }
    },
    computed: {
      cons () {
        let history = this.item.history || []
        let showItem
        let showItems = []
        if (history instanceof Array) {
        } else {
          history = []
        }
        if (history.length === 0) {
          return []
        }
        for (var i = 0; i < history.length; i++) {
//          actionName
          let historyItem = history[i]
          if (historyItem.action && historyItem.action === 'complete') {
            continue
          }
          let histroyMaster = historyItem.master
          if (historyItem.action && historyItem.action === 'backIn') {
            histroyMaster = historyItem.excuteUser
          }
          let time = history[i].time
          let user = getUserNameById(histroyMaster) + getCache('agents', histroyMaster).exten
          let info = getBusinessHisotryInfo(historyItem, historyItem.step, historyItem.fromStep, historyItem.excuteAction)
          let data = getBusinessHistoryData(historyItem, this.item, 'businessFlow')
          showItem = {
            time: time,
            user: user,
            info: info,
            data: data
          }
//          let flowObj = getCache('businessFlow', this.item.flow)
          let step = historyItem.ctype && historyItem.ctime ? taskTimeAll(historyItem.ctype, historyItem.ctime) : -1
          showItem.stepUseTime = historyItem.stepProcessTime ? taskTimeAll('second', historyItem.stepProcessTime) : -1
          showItem.color = showItem.stepUseTime > step && step !== -1 ? 'red' : ''
          showItem.stepTime = step
          showItem.isUShow = showItem.stepUseTime === -1 ? 'false' : 'true'
          showItem.isStepShow = showItem.stepTime === -1 ? 'false' : 'true'
          showItems.push(showItem)
        }
        return showItems
      }
    },
    components: {
      Affix
    },
    beforeMount () {
      let self = this
      Promise.all([
        this.$store.dispatch('getCache', {type: 'businessFlowField'})
      ]).then(() => {
        self.loading = true
      })
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/common.styl'
  .business-history
    padding 15px 0 0
    .treat
        position relative
        padding 6px 0 14px 28px
        margin-left 90px
        border-left 1px solid $c-border1
        .bac
          @extend .font12
          position absolute
          width 70px
          padding-right 8px
          left -88px
          top 30px
          margin-top 2px
          color $cf-gray4
          text-align right
          &:before
            content ""
            width 14px
            height 14px
            display inline-block
            position absolute
            top 0
            right -17px
            border-radius 7px
            background-color $c-border1
          time
            display inline-block
            height 18px
            overflow hidden
            span
              margin-top -18px
              display inline-block
    .treat:last-child
      .bac
        &:before
          background #999
        time
          height 36px
          span
            margin 0
        .last
          background-color $c-white
          background-position right top
          height 22px
          top 20px
      li
        &:first-child
          border-left 0
          &:before
            content ""
            width 1px
            height: 100%;
            display inline-block
            position absolute
            top 35px
            left 0
            background-color $c-border1
        &:last-child
          margin-bottom: 40px
    .warpper
      background-color $c-bus-back
      border 1px solid $c-bus-back
      padding 12px 12px 4px 12px
      border-radius 8px
      min-height 35px
      font-size 12px
      &:before
        content ''
        font-size 0
        line-height 0
        border-width 10px
        border-color $c-bus-back
        border-left-width 0
        border-style dashed
        border-right-style solid
        border-top-color transparent
        border-bottom-color transparent
        position absolute
        top 30px
        left 18px
      .name
        padding-bottom 10px
        @extend .font14
        color $cf-gray1
          &:nth-child(2)
            padding-left 10px
            @extend .font12
      .name+.once-step
        margin 0
      .current-step
        display flex
        .process
          flex 8
          display flex
          margin-left 5em
          align-items center
          .start
            color #00c7d1
            @extend .font14
            min-width 60px
          .goto
            display flex
            flex-direction column
            text-align center
            margin 0 1em
            color $cf-level2
            .todo
              position relative
              text-align left
              color $cf-gray2
              margin-bottom 5px
              text-align center
            .icon-dongzuobiangeng
              display block
              font-size 230px
          .end
            @extend .font14
            color #aa00e8
            min-width 60px
        .pc-time
          flex 4
          display flex
          flex-direction column
          align-items bottom
          margin 20px 0 12px
          text-align right
          .time
          .label
            color $cf-level1
      .once-step
        display flex
        flex-direction column
        border-top 1px dotted $cf-level1
        margin-top 10px
        padding-top 10px
        line-height 20px
        color $cf-gray2
        .os-assign-Seats
        .os-process-Seats
          color $cf-level1
      .remark
        font-size 12px
        color $cf-level2
        margin-top 10px
        span
          display inline-block
          width 100%
          @extend .ellipsis
  .break-all
    word-break break-all
</style>
