<template>
  <div v-loading="loading">
    <div v-if="!loading">
      <h3 class="title"><span class="sign"></span><span class="text">{{$t('webchat.basicInfo')}}</span></h3>
      <div class="call-detail">
        <table>
          <tr>
            <td>定位客户</td>
            <td>
              {{currentItemCall.CUSTOMER_NAME}}
            </td>
            <td>主叫</td>
            <td>
              {{currentItemCall.CALL_NO_SHOW}}
            </td>
            <td>被叫</td>
            <td>
              {{currentItemCall.CALLED_NO_SHOW}}
            </td>
          </tr>
          <tr>
            <td>呼叫时间</td>
            <td>
              {{currentItemCall.OFFERING_TIME}}
            </td>
            <td>摘机时间</td>
            <td>
              {{currentItemCall.BEGIN_TIME}}
            </td>
            <td>通话时长</td>
            <td>
              {{currentItemCall.callTimeDisplay}}
            </td>
          </tr>
          <tr>
            <td>呼叫类型</td>
            <td>
              {{currentItemCall.CONNECT_TYPE_show}}
            </td>
            <td>处理状态</td>
            <td>
              {{currentItemCall.STATUS_show}}
            </td>
            <td>处理座席</td>
            <td>
              {{currentItemCall.DISPOSAL_AGENT_show}}
            </td>
          </tr>
          <tr>
            <td>省份</td>
            <td>
              {{currentItemCall.PROVINCE}}
            </td>
            <td>城市</td>
            <td>
              {{currentItemCall.DISTRICT}}
            </td>
            <td>标记</td>
            <td>
              {{currentItemCall.satisfaction}}
            </td>
          </tr>
          <tr>
            <td>满意度</td>
            <td colspan="5">
              {{currentItemCall.INVESTIGATE}}
            </td>
          </tr>
          <tr>
            <td>通话录音</td>
            <td colspan="5">
              <audio controls="" v-bind:src ="currentItemCall.audio" autoplay="autoplay" id="quality-autoplay"></audio>
              <a class="call_sheet_download_file" :href="currentItemCall.audio" target="_blank" download>下载录音</a>
            </td>
          </tr>
        </table>
      </div>
      <h3 class="title" v-if="isCallLabel"><span class="sign"></span><span class="text">{{$t('call.callLabelAndSQ')}}</span></h3>
      <div class="clearfix sq-wrap">
        <span class="fl" >{{$t('call.SQLabel')}}:</span>
        <span v-if="getSQLabel.length <= 0">&nbsp;&nbsp;&nbsp;{{$t('call.noSQLabel')}}</span>
        <el-select v-else size="small" class= 'label-select fl' v-model="SQ_LABEL" :placeholder="$t('public.pleasePick')" >
          <el-option checked value="">{{$t('public.pleasePick')}}</el-option>
          <el-option
                  v-for="item in getSQLabel"
                  :label="item.name"
                  :value="item._id"
                  >
          </el-option>
        </el-select>
      </div>
      <single-label v-if="labelType === 'single' && isCallLabel" :callLabel="getCallLabel" :disabled="false" :checkLabels="currentItemCall.LABELS || []" :callSheetId="currentItemCall.CALL_SHEET_ID" :flag="flagQC"></single-label>
      <multi-label v-if="labelType === 'multi' && isCallLabel" :callLabel="getCallLabel" :disabled="false" :checkLabels="currentItemCall.LABELS || []" :callSheetId="currentItemCall.CALL_SHEET_ID" :flag="flagQC" :qcResectLabel="qcResectLabel"></multi-label>
      <h3 class="title"><span class="sign"></span><span class="text">工单信息</span></h3>
      <div  class="business">
        <div v-if="businessShow.length ===0" >暂无工单信息</div>
        <div class="history-content" v-for="item in businessShow">
          <div class="data">
            <div style="float: left;">{{item.createUser}}<span class="pad-left">创建工单</span></div>
            <div style="float: right;"><span class="pad-right">处理状态</span>{{item.step}}</div>
          </div>
          <div class="clear"></div>
          <div  style="color: #666666" v-for="(value, index) in item.data" class="bus-info">
            <div v-if="index === '工单编号'">
              <span class="pad-right">{{index}}</span><span @click="busShowDetail(item._id)" style="color:#1abb9c;cursor: pointer">{{value}}</span>
            </div>
            <div v-else>
              <span class="pad-right">{{index}}</span><span>{{value}}</span>
            </div>
          </div>
          <business :busId="busId" :showHistory="true" v-if="busDetailShow"  @event="businessEvent"></business>
        </div>
      </div>
      <h3 class="title"><span class="sign"></span><span class="text">请您评分</span></h3>
      <grade-temp :configList="configList" :form="configListForm" :gradeObj="gradeObj" saveBtn="保存并评分下一个" @off="off" @save="saveGrade"
                  v-if="this.template.type!=='pass'">
      </grade-temp>
      <pass-temp  v-else :configList="configList" :form="configListForm" :gradeObj="GRADE_AMOUNT" saveBtn="保存并评分下一个" @off="off" @save="saveGradePass"></pass-temp>
    </div>
  </div>
</template>
<script>
  import {getQualityCheckConfigs} from '../../../../utils/webchat.js'
  import {deepClone, getCache, getAllUseSingleCallLabel, getAllUseMultiCallLabel} from '../../../../utils/m7Utils.js'
  import {getBusinessHistoryData, showCountDown} from '../../../../utils/workflowUtils.js'
  import business from '../../../public-modules/cust-tab-content/business/index.vue'
  import gradeTemp from '../base/gradeTemp'
  import passTemp from '../base/passTemp.vue'
  import singleLabel from '../../../business-modules/call/SingleLabel.vue'
  import MultiLabel from '../../../business-modules/call/MultiLabel.vue'
  export default {
    name: 'callGrade',
    data () {
      return {
        busId: '',
        loading: true,
        busDetailShow: false,
        webchatUserHistory: [],
        gradeObj: {
          grade: 0,
          COMMENT: '',
          obj: {},
          type: ''
        },
        GRADE_AMOUNT: {
          amount: '',
          COMMENT: ''
        },
        configList: [],
        configListForm: {},
        template: {},
        flagQC: 'QC',
        isCallLabel: true,
        SQ_LABEL: ''
      }
    },
    components: {
      business,
      gradeTemp,
      passTemp,
      singleLabel,
      MultiLabel
    },
    computed: {
      getSQLabel () {
        let sqLabels = this.$store.state.session.dicMap.sqLabels
        return sqLabels || []
      },
      businessShow () {
        let data = this.currentItemCall.busHistory || []
        let arr = []
        for (let i = 0; i < data.length; i++) {
          let busObj = {_id: data[i]._id}
          let item = data[i]
          busObj.lastUpdateUser = getCache('agents', item.lastUpdateUser).displayName
          busObj.createUser = getCache('agents', item.createUser).displayName
          busObj.step = getCache('businessFlowStep', item.step).name
          busObj.flow = getCache('businessFlow', item.flow).name
          busObj.data = getBusinessHistoryData({excuteData: item.historyData, action: 'create'}, item)
          arr.push(busObj)
        }
        return arr
      },
      getCallLabel () {
        let allLabel = deepClone(this.$store.state.session.dicMap.callLabel)
        if (allLabel === -1) {
          this.isCallLabel = false
          allLabel = []
        }
        let labelType = this.$store.state.call.transCache.callLabelType
        let multiObj = this.$store.state.call.transCache.multiLabel
        let singleObj = this.$store.state.call.transCache.singleLabel
        if (multiObj.allLabels && labelType === 'multi') { // 能取多标签并且状态是多级
          return multiObj
        } else if (singleObj.singleLabel && labelType === 'single') { // 能取单标签并且状态是单级
          return singleObj.singleLabel
        } else { // 取不到标签，重新往call里面存单标签和多标签
          let singleObj = getAllUseSingleCallLabel(allLabel)
          this.$store.commit('call/SET_CALL_SINGLE_LABEL', singleObj)
          let multiObj = getAllUseMultiCallLabel(allLabel)
          this.$store.commit('call/SET_CALL_MULTI_LABEL', multiObj)
          if (labelType === 'single') {
            return singleObj.singleLabel
          } else if (labelType === 'multi') {
            return multiObj
          }
        }
      }
    },
    props: {
      currentItemCall: Object,
      template: Object,
      currentGrade: Object,
      refreshCallGrade: Number,
      qcResectLabel: Boolean
    },
    methods: {
      businessEvent (eventData) {
        let data = eventData.data
        this.busId = data._id
        if (eventData.event !== 'changeBusinessMaster') {
          this.$store.dispatch('getBusinessDetailById', {_id: this.busId})
        }
      },
      busShowDetail (id) {
        this.busDetailShow = !this.busDetailShow
        if (this.busDetailShow) {
          this.$store.dispatch('getBusinessDetailById', {_id: id}).then(() => {
            this.busId = id
          })
        }
      },
      fetchData () {
        this.$store.dispatch('recordListenLog', {CALL_SHEET_ID: this.currentItemCall._id})
        this.currentItemCall.callTimeDisplay = showCountDown(this.currentItemCall.CALL_TIME_LENGTH * 1000)
        if (this.template.type !== 'pass') {
          this.gradeObj = {
            grade: 0,
            COMMENT: '',
            obj: {},
            type: ''
          }
          let configs = deepClone(this.template.config)
          let list = getQualityCheckConfigs(configs)
          this.configListForm = {}
          list.forEach((item) => {
            item.value = ''
            if (this.currentGrade[item.order]) {
              this.gradeObj.type = 'grade'
              this.gradeObj.grade = this.currentGrade.GRADE_AMOUNT
              let value = Math.round(this.currentGrade[item.order] * 100 / item.weight)
              this.$set(this.configListForm, item.order + '_' + item.fatal + '_' + item.weight, value)
            } else {
              this.$set(this.configListForm, item.order + '_' + item.fatal + '_' + item.weight, '')
            }
          })
          this.configList = deepClone(list)
        } else {
          this.GRADE_AMOUNT = {
            amount: ''
          }
          this.configList = deepClone(this.template.config)
          this.configListForm = {}
          let self = this
          let renderForm = function (config) {
            config.forEach(item => {
              self.$set(self.configListForm, item.name, '')
              if (item.child && item.child.length > 0) {
                renderForm(item.child)
              }
            })
          }
          renderForm(this.configList)
        }
      },
      off () {
        let play = document.getElementById('quality-autoplay')
        if (play) {
          play.pause()
        }
        document.getElementById('quality-autoplay').pause()
        this.$emit('off')
      },
      saveGrade (gradeObj) {
        let play = document.getElementById('quality-autoplay')
        if (play) {
          play.pause()
        }
        let SQlabel = this.SQ_LABEL
        this.$emit('saveGrade', gradeObj, SQlabel)
        this.SQ_LABEL = '' // 外抛之后清空处理，防止把数据带到下一个模板里面
      },
      saveGradePass (gradeObj) {
        let obj = {
          config: this.configListForm,
          grade: gradeObj
        }
        let SQlabel = this.SQ_LABEL
        this.$emit('saveGrade', obj, SQlabel)
        this.SQ_LABEL = '' // 外抛之后清空处理，防止把数据带到下一个模板里面
      }
    },
    beforeMount () {
      let p1 = this.$store.dispatch('getCache', {type: 'businessFlowStep'})
      let p2 = this.$store.dispatch('getCache', {type: 'businessFlowField'})
      let p3 = this.$store.dispatch('getCache', {type: 'businessFlow'})
      let p4 = this.$store.dispatch('getCache', {type: 'sqLabels'})
      Promise.all([p1, p2, p3, p4]).then(() => {
        this.loading = false
      })
      let labelType = this.$store.state.call.transCache.callLabelType
      this.labelType = labelType
    },
    watch: {
      refreshCallGrade () {
        let play = document.getElementById('quality-autoplay')
        if (play) {
          play.play()
        }
        this.fetchData()
      },
      qcResectLabel () {
        if (this.qcResectLabel) { // 质检评分界面打开时先清空上一次操作
          this.SQ_LABEL = ''
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .search-pagination
      float right
    .score
      .el-dialog
        width 840px
    .normal
      height calc(100vh - 158px)
      padding 0 20px
      overflow scroll
      .tables
        padding-bottom 30px
      .el-dialog
        .scoring
          text-align center
          color #fff
          margin-top 40px
          span
            display inline-block
            padding 10px 26px
            border-radius 4px
            cursor pointer
          .off
            background #7bcdd2
          .save
            background #1abb9c
            margin-left 40px
        .el-row
          margin-top 12px
          color #8f8f8f
          .el-col-7
          .el-col-11
            line-height 36px
          .el-col-13
            .totalScore
              color #7bcdd2
      .chatMsgCon
        border-bottom 1px solid #eeeff3
      .chat_msg
        padding 14px
        box-sizing border-box
        overflow auto
        height calc( 100vh - 342px + 92px)
      .chat_item
        position relative
        width 70%
        padding-left 50px
      .chat_user_info
        position absolute
        left 0
        top 6px
        .chat_time
             margin -4px 0 0 -5px
      .chat_user_img
        border-radius 50%
        width 40px
        height 40px
        overflow hidden
        background url("../../../public-modules/contact-summary/img/agent.png") no-repeat 50% 50%
        background-size 40px auto
        img
          background #fff
      .chat_time
        color #9A9A9A
        width 60px
        line-height 16px
        text-align center
      .chat_content
        max-width 90%
        padding 10px
        position relative
        margin-left 14px
        border-radius 6px
        background #7ACDD1
        display inline-block
        color #fff
        .chat_img
          max-width 100px
        .send_status
          position absolute
          width 26px
          height 26px
          border-radius 50%
          left -30px
          top 50%
          margin-top -13px
        .send_status.process
          background url('../../webchat/img/webchat_send.gif') no-repeat
          background-size 26px 26px
        .send_status.failure
          color red
          text-align center
          line-height 24px
          font-size 24px
        .chat_content_text
          word-break break-all
      .chat_content_arrow
        position absolute
        left -6px
        width 0
        height 0
        border-top 6px solid transparent
        border-bottom 6px solid transparent
        border-right 6px solid #7ACDD1
      .chat_user_info_out
        position absolute
        right 0
        top -2px
        .chat_time
          position absolute
          right -5px
          top 48px
      .chat_item.out
        padding 0 50px 0 0
        float right
        .chat_user_img
          border-radius 50%
          width 40px
          height 40px
          float right
        .chat_content
          float right
          background #F2F2F2
          margin 0 14px 0 0
          color #000
      .chat_content_arrow_out
        position absolute
        right -6px
        width 0
        height 0
        border-top 6px solid transparent
        border-bottom 6px solid transparent
        border-left 6px solid #F2F2F2
      .chat_item.system
        text-align center
        padding 0
        width 100%
        .chat_content
          display inline-block
          width auto
          height 26px
          border-radius: 13px
          text-align center
          display inline-block
          padding 0
          line-height 26px
          background #f2f2f2
          color #000
      .chat_msg_con
        textarea
          resize none
      .el-form-item
        margin 0
      .replyMsg
        float right
      .msg_do
        margin 0 10px 0
        float left
        color #bbb
      .fontSize
        min-width 20px
      .fontSize
        li
          line-height 28px
      .upload
        display inline-block
        width 22px
      .blacklist_con
        resize none
      .other_msg
        padding-top 5px
        .iconfont
          font-size 18px
          cursor pointer
        .iconfont:hover
          color $c-main
        .icon-zhishikujiansuo
          font-size 20px
      .upload
        width 20px
      .chat_info
        padding-top 20px
        .chat_info_todo
        .chat_info_all
          padding 0 14px
          box-sizing border-box
      .chat_info_li_title , .chat_auxiliary_title,.chat_info_all i
        color #b8b8b8
        font-style normal
      .chat_info_li_con , .chat_auxiliary_from
        color #999
        float right
      .chat_info_li_remarks
        resize none
        font-size 12px
        box-sizing border-box
        width 100%
        margin-top 6px
        border-radius 4px
        padding 6px 10px
      .el-tree
        border none
      .quickreplay_custome_title
        span
          float right
          font-size 12px
          line-height 20px
          cursor pointer
      .quickreplay_li
        .edit_del
          position absolute
          right 4px
          top 0
      .quickRe
        display none
        color #37b5ed
        float right
        margin-right 4px
        cursor pointer
      .quickReLi
        width 100%
        position relative
        box-sizing border-box
        padding 2px 0 2px 20px
        color #808080
      .quickReLi:before
        content '\ '
        background #7dccd1
        width 4px
        height 4px
        position absolute
        left 10px
        top 6px
      .quickReBox
        position absolute
        right 0
        top 0
      .quickReLi:hover
        padding-right 40px
        .quickRe
          display inline-block
      .quickreplay_custom_con
        li
          margin-bottom 4px
          position relative
      .quickreplay_custom_con
        li
          i
            line-height 16px
      .quickreplay_box
        .el-tree
          .is-leaf
            display none
      .color
        color #1f2d3d
      .quickreplay_box
        color #a7a7a7
      .popover1
        .quickReLi:before
          display none
      .popover1
        .quickReLi
          padding-left 18px
      .transfer_li
        color #989898
        height 16px
        padding 3px 0
        cursor pointer
      .transfer_li:hover
        background #e8f5fc
        .transfer_btn
          display inline-block
      .transfer_btn
        display none
        color $c-main
        cursor pointer
        float right
        margin-right 6px
      .transfer_li_ul .transfer_li
        padding-left 18px
      .msg_li
        min-height 62px
        margin-bottom 20px
      .msg_li.system_li
        height 24px
        margin 10px 0
      .transfer_li_box
        position relative
      .transfer_group_btn
        position absolute
        top 4px
        right 0
      .box1:hover
        .transfer_group_btn
          display inline-block
      .box1:hover
        .transfer_li
          background #e8f5fc
      .send_msg_form
        position relative
        textarea
          width 100%
          border none
          box-sizing border-box
          resize none
      .font12
        font-size 12px
      .font14
        font-size 14px
      .font16
        font-size 16px
      .font18
        font-size 18px
      .font20
        font-size 20px
      .suggest
        width 308px
        background #fff
        bors(1px,#eee)
      .client_msg
        height 36px
      .chat_info_all
        padding-top 18px
      .transfer_li_ul
        .transfer_li
          .cata-name
            display inline-block
            width 100%
      .cursor_li
        cursor pointer
      .webchat_todo_conbox
        .basic_info
          padding-top 14px
          max-height calc( 100vh - 330px)
          box-sizing border-box
          overflow auto
          h3
            margin-bottom 10px
      .wxend
        text-align center
        padding 5px
        display block
        z-index 10000
        color #999
      .historyDivied
        color grey
        text-align center
      .popover1 .tree,.popover2 .tree
        overflow-y auto
        max-height 200px
        font-size 12px
      .quickreplay_box
        .quickBoxTit
          padding 0 0 8px
        .quickreplay_custome_title
          padding 14px 0 8px
        .tree
          padding-left 10px
          .cursor_li
            padding 2px 0
          .quickReLi:before
            top 8px
      .chat_info,.chat_info_all
        h3
          color #666
        .chat_info_li
          margin-bottom 4px
          padding-right 4px
          box-sizing border-box
        .chat_info_li:last-child
          margin-bottom 10px
        .chat_info_li.chat_info_li_title
          display inline-block
      .chat_info_all
        height calc( 100vh - 286px)
        h3
          padding 8px 0
      .chat_info_ul
        margin-bottom 10px
        span
          float right
      .popover1_inpit
      .popover2_input
        background-color #fff
        border-radius 4px
        border 1px solid #c0ccda
        color #1f2d3d
        display block
        font-size inherit
        height 36px
        line-height 1
        padding 3px 10px
        width 100%
        box-sizing border-box
      .icon-tishi
        color red
      .chat_content.image
        img
          cursor pointer
      .img_action_kmsearch
        display none
      .webchat_todo_conbox
        .chat_item.in
          .chat_text_con
            .chat_content
              position relative
              max-width 360px
              transition padding-right 0.2s ease
              .img_action_kmsearch
                color #E8F5FC
                position absolute
                right 6px
                bottom 10px
                display none
                transition 0.2s ease
                opacity 0
                cursor pointer
            .chat_content:hover
              padding-right 30px
              .img_action_kmsearch
                display block
                animation mymove 0.2s 0.05s forwards
      .call-detail table
        border 1px solid #ddd
        width 100%
        tr
          height 40px
          border-bottom 1px solid #e0e6ed
          td
            padding 10px
        tr:nth-of-type(even) td
          background #fafafa
        tr:nth-of-type(odd):hover td
          background #e0e6ed
      .call-detail table tr:nth-last-child(1)
        border-bottom none
      .remarks
        border-radius 3px
        width 100%
        margin-top 9px
        box-sizing border-box
        color #999
        padding 4px 6px
        background #fafafa
        border 1px solid #ddd
      .detail-wrap
        margin 20px 34px 0 34px
        color $cf-level2
      .icon
        cursor pointer
      .deploy
        height 48px
        color #989898
        border 1px solid #ebebeb
        border-bottom none
        padding-left 14px
        .page
          margin-top 10px
        .el-pagination
          padding 0
      .cell
        .el-button
          color #74cdb7
      .top
        .el-radio-group
          margin-top 10px
        .el-radio
          margin 0 0 6px 20px
        .temp
          color #a6a6a6
          margin-bottom 10px
        .sear
          .el-row
            margin-top 12px
            span
              color #c0c0c0
              display inline-block
              margin-left 20px
            .temp
              color #a6a6a6
              margin-left 0
            .takeTime
              margin-left 66px
          .el-input
            width inherit
            margin-left 10px
        .el-select
          margin-left 10px
        .sub
          text-align right
          margin-top 20px
          .rest
          .search
            display inline-block
            width 108px
            height 30px
            background #72c7e3
            color #fff
            text-align center
            line-height 30px
            border-radius 2px
            cursor pointer
          .search
            background #1abb9c
            margin-left 24px
      .title
        color #999
        margin 28px 0 18px 0
        font-weight normal
        position relative
        .sign
          position relative
          width 12px
          height 12px
          background #7ccdd1
          display inline-block
          z-index 3
        .text
          position relative
          display inline-block
          padding 0 8px 0 10px
          background #fff
          z-index 3
        &:after
          content ""
          display inline-block
          width 100%
          left 0
          border-bottom 1px dashed #999
          position absolute
          top 12px
    .icon-tixingweizhi
      display inline-block
      font-size 12px
      color #1abb9c
      line-height 14px
      height 14px
      width 14px
      text-align center
      border-radius 50%
      border 1px solid #1abb9c
  .business
    border 1px solid #ddd
    background-color #f9f9f9
    padding 5px
    .data
      line-height 34px
      font-size 14px
      border-bottom 1px dotted #ddd
      height 34px
    .bus-info
      padding-top 10px
    .pad-right
      padding-right 6px
    .pad-left
      padding-left 6px
  .clearfix:after
    display block
  .sq-wrap
    margin-bottom 16px
  .call-detail table
    border 1px solid #ddd
    width 100%
    tr
      height 40px
      border-bottom 1px solid #e0e6ed
      td
        padding 10px
    tr:nth-of-type(even) td
      background #fafafa
    tr:nth-of-type(odd):hover td
      background #e0e6ed
  .call-detail table tr:nth-last-child(1)
    border-bottom none
  .title .sign
    position relative
    width 12px
    height 12px
    background #7ccdd1
    display inline-block
    z-index 3
  .title
    color #999
    margin 28px 0 18px 0
    font-weight normal
    position relative
    line-height 16px
    .sign
      position relative
      width 12px
      height 12px
      background #7ccdd1
      display inline-block
      z-index 3
    .text
      position relative
      display inline-block
      padding 0 8px 0 10px
      background #fff
      z-index 3
    &:after
      content ""
      display inline-block
      width 100%
      left 0
      border-bottom 1px dashed #999
      position absolute
      top 50%
</style>
