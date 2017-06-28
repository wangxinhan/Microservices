<template>
  <div class="table-warp">
    <div class="table-head">
      <span>{{$t('webchat.lastTimeRefreshTime')}} {{refreshDate}}</span>
      <a href="javascript:;" class="refresh" @click.stop="refreshData"><i class="iconfont icon-shuaxin"></i> {{$t('public.refresh')}}</a>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
      ref="table"
      :row-key="rowKey"
      @selection-change="handleSelectionChange">
      <el-table-column
        :selectable="selectableHandel"
        :reserve-selection="reserveSelection"
        type="selection"
        min-width="50">
      </el-table-column>
      <el-table-column
        prop="number"
        :label="$t('webchat.webchatTableNumber')"
        width="70">
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('webchat.visitorArea')"
        width="120">
      </el-table-column>
      <el-table-column
        prop="keywords"
        :label="$t('webchat.inviteKeywords')"
        min-width="120">
      </el-table-column>
      <el-table-column
        :reserve-selection="saveStatus"
        :label="$t('webchat.customerTrackBrowseRemark')"
        min-width="260">
        <template scope="scope">
          <el-popover popper-class="time_start_popper" trigger="hover" placement="left">
            <div class="popper_box" v-on:scroll="timeScroll($event, scope.row)">
              <ul>
                <li v-for="item in scope.row.allTrack">
                  <span>{{item.timeStart}}</span>
                  <span class="stayTime" v-if="item.stayTime">{{$t('webchat.stay')}}  {{item.stayTime}}</span>
                  <span>{{item.title}}</span>
                </li>
              </ul>
            </div>
            <div slot="reference" class="name-wrapper">
              <p v-for="item in scope.row.track">
                <span>{{item.timeStart}}</span>
                <span class="stayTime" v-if="item.stayTime">{{$t('webchat.stay')}} {{item.stayTime}}</span>
                <span>{{item.title}}</span>
              </p>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('webchat.inviteStatus')"
        width="120">
        <template scope="scope">
          <span :class="{'success': scope.row.status === 'webchat.inviteStatusSuccess', 'typing': scope.row.status === 'webchat.inviteStatusTypingTable'}">
            {{ $t(scope.row.status) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-invite">
      <p>
        <span>{{$t('webchat.inviteLanguage')}}</span>
        <span class="invited" v-if="!multipleSelection.length">{{$t('webchat.inviteSelectedCustomerIsNull')}}</span>
      </p>
      <el-input class="input-box" :placeholder="$t('public.pleaseEnter')" v-model.trim="invitedInfo">
        <el-button class="input-btn"
                   :disabled="!btnActive"
                   :class="{'input-btn-active': btnActive}"
                   slot="append" @click="sendInvited">{{$t('webchat.sendInvited')}}</el-button>
      </el-input>
    </div>
  </div>
</template>
<script>
  /**
   * 会话邀请弹窗table组件
   */
  import {getFormatDateTime} from '../../../utils/m7Utils'
  export default {
    name: 'WebchatTable',
    props: {
      conversationData: Object
    },
    computed: {
      btnActive () {
        return this.invitedInfo && this.multipleSelection.length
      },
      tableData () { // 处理table内的数据
        let list = []
        let sessionList = this.$store.state.webchat.inviteUbaSessionList.list
        for (let i = 0; i < sessionList.length; i++) {
          let obj = {}
          let item = sessionList[i]
          obj.number = i + 1
          obj._id = item._id
          obj.ubaSessionId = item.pages[0] ? item.pages[0].sessionId : ''
          obj.address = item.platform.area
          let seosource = item.platform.seosource ? item.platform.seosource : ''
          let seokeywords = item.platform.seokeywords ? item.platform.seokeywords : ''
          obj.keywords = seosource + ' ' + seokeywords
          obj.status = item.status
          obj.track = []
          obj.allTrack = []
          for (let j = 0; j < item.pages.length; j++) {
            let pagesObj = {}
            let data = item.pages[j]
            pagesObj.title = data.title
            pagesObj.timeStart = data.timeStart
            if (data.stayTime) {
              pagesObj.stayTime = data.stayTime
            }
            obj.track.push(pagesObj)
            obj.allTrack.push(pagesObj)
          }
          obj.track = obj.track.splice(0, 2)
          list.push(obj)
        }
        return list
      }
    },
    data () {
      return {
        multipleSelection: [],
        userSessionIds: [],
        invitedInfo: '',
        loading: false,
        refreshDate: '',
        reserveSelection: true
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      sendInvited () { // 发送会话邀请
        let sessionIds = []
        if (this.multipleSelection.length) {
          this.multipleSelection.forEach((item, index) => {
            sessionIds.push(item._id)
          })
          let inviteMessage = this.invitedInfo
          let sessionIdArr = []
          this.userSessionIds = sessionIdArr.concat(sessionIds)
          this.$store.dispatch('inviteCustomers', {sessionIds, inviteMessage}).then((res) => {
            if (res.success) {
              this.$refs.table.clearSelection(this.multipleSelection)
              this.invitedInfo = ''
            }
          })
        }
      },
      refreshData () { // 刷新访客信息
        let nowdate = new Date()
        this.loading = true
        this.refreshDate = getFormatDateTime(nowdate).split(' ')[1]
        this.$store.dispatch('getSessionsByAccount', {pageSize: 10, page: 1}).then(() => {
          this.loading = false
        })
      },
      selectableHandel (row, index) { // 禁用已经邀请过的访客
        let flag = true
        this.userSessionIds.forEach((item, index) => {
          if (item === row._id) {
            flag = false
            return false
          }
        })
        return flag
      },
      rowKey (row) {
        return row._id
      },
      timeScroll (event, row) { // 滚动加载更多浏览轨迹
        let nScrollHight = 0
        let nScrollTop = 0
        let nDivHight = event.target.offsetHeight
        nScrollHight = event.target.scrollHeight
        nScrollTop = event.target.scrollTop
        if (nScrollTop + nDivHight >= nScrollHight) {
          this.$store.dispatch('getMoreTrack', {sid: row.ubaSessionId})
        }
      }
    },
    mounted () {
      let nowdate = new Date()
      this.refreshDate = getFormatDateTime(nowdate).split(' ')[1]
    }
  }
</script>

<style lang="stylus" scope>
  .table-warp
    padding 20px
    .table-head
      border 1px solid rgb(223, 236, 235)
      border-bottom none
      height 50px
      line-height 50px
      padding 0 15px
      color #999
    .refresh
      display inline-block
      float right
      cursor pointer
      color #1abb9c
      .iconfont
        font-size 12px
    .success
      color #95d893
    .typing
      color #f8c991
    .table-invite
      p
        line-height 30px
        margin-top 10px
        span
          color #999
        .invited
          color #9fd6eb
      .input-btn
        background #d9d9d9
        color #fff
      .input-btn-active
        background #1abb9c
  .stayTime
    color #f6c277
  .popper_box
    max-height 100px
    overflow-y scroll
    overflow-x hidden
</style>
