<template>
  <el-row v-if="" :class="tabType + '_conbox'">
      <div class="chat_msg_box">
        <div class="chat_msg_con">
          <el-row>
            <el-col :span="24">
              <div class="email_chat_msg chatMsgCon">
                <div class="email_msg_inner">
                    <!-- 详情对话框 -->
                      <el-row>
                        <base target="_blank">
                        <div class="email_title_info">
                          <div class="email_dialog clearBoth">
                            <div class="email_title ellipsis" :title="lastEmail.subject" v-if="lastEmail.subject"> {{lastEmail.subject}}</div>
                            <div class="email_details_do clearBoth">
                              <!--附件小图标-->
                              <div class="attachment_box" v-if="lastEmail.attachment.length>0">
                                <span class="iconfont icon-fujian attachment_btn">({{lastEmail.attachment.length}})</span>
                              </div>
                            </div>
                          </div>
                          <div v-if = "lastEmail.from" class="padding-top5">
                            <!--发件人-->
                            <span>{{$t('email.sender')}}: </span>
                            <span class="padding-left5">
                                {{lastEmail.from.name}} <{{lastEmail.from.addr}}>
                            </span>
                          </div>
                          <div class="padding-top5">
                            <!--时间-->
                            <span>{{$t('public.time')}}: </span>
                            <span v-if = "lastEmail.createTime" class="padding-left5">
                                {{lastEmail.createTime}}
                            </span>
                          </div>
                          <div v-if = "lastEmail.to.length>0" class="padding-top5">
                            <!--收件人-->
                            <span>{{$t('email.recipient')}}: </span>
                            <span v-for = "to in lastEmail.to" class="padding-left5">
                                {{to.name}} <{{to.addr}}>
                            </span>
                          </div>
                          <div v-if = "lastEmail.cc.length>0" class="padding-top5">
                            <!--抄送-->
                            <span>{{$t('email.copyFor')}}: </span>
                            <span  v-for = "cc in lastEmail.cc" class="padding-left5">
                                {{cc.name}}<{{cc.addr}}>
                            </span>
                          </div>
                        </div>
                      </el-row>
                      <el-row>
                        <div class="email_all_content">
                          <div class="email_detail_content" v-html="emailContent"></div>
                          <div class="all_attachment_box clearBoth" v-if="lastEmail.attachment.length>0">
                            <div class="all_attachment_box_title">
                              <!--<span class="iconfont icon-fujian"></span>-->
                              <!--附件-->
                              <span>{{$t('email.attachment')}}: {{lastEmail.attachment.length}}个</span>
                              <!--展开收起-->
                              <span class="unfolded" @click.stop="changeFold">{{foldedText}}</span>
                            </div>
                            <div class="all_attachments_ul clearBoth" v-for="(attach, index) in fujian" v-show="!(index>3&&folded===false)">
                              <email-attachment :fileName="attach.name" :fileUrl="attach.url"></email-attachment>
                            </div>
                          </div>
                        </div>
                      </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
  </el-row>
</template>
<script type="text/javascript">
  /**
   * emailDetails 卡邮件详情组件
   * @author yangjiao
   * @path components/business-modules/email/emailDetails.vue
   * @data chatMsgCon
   * showDetailAttach 显示附件
   *
   *
   * @property {Object} lastEmail - 邮件详情信息
   *
   * @example
   *   <emailDetails
   :id="contactHistoryInfo._id"
   :lastEmail="lastEmail"
   v-if="contactHistoryInfo._id && contactHistoryInfo.labelValue === 2"
   >
   </emailDetails>

   */
  import { deepClone } from '../../../utils/m7Utils'
  import EmailAttachment from './EmailAttachment'
  export default {
    name: 'EmailContainer',
    data () {
      return {
        tabType: 'email_todo',
        chatMsgCon: {
          font: 'font12',
          attachment: []
//          showDetailAttach: false
        },
        loading: true,
        folded: false,
        remarkClone: '',
//        fujian: [],
        foldedText: '展开'
      }
    },
    props: {
      lastEmail: Object
    },
    computed: {
//      currEmailSession () {
//        let session = this.$store.state.email.current[this.tabType].currentSession
//        this.remarkClone = session.remark || ''
//        return session
//      },
      fujian () {
        return this.lastEmail.attachment
      },
      emailContent () {
        let content = deepClone(this.lastEmail.content) || ''
        let newData = content.replace(/<style[^>]*?>[\s\S]*?<\/style>/g, '')
        return newData
      }
    },
    components: {
      EmailAttachment
    },
    methods: {
//      changeDetailAttachStatus () {
//        this.chatMsgCon.showDetailAttach = !this.chatMsgCon.showDetailAttach
//      }
      changeFold () {
        if (!this.folded) {
          this.folded = true
          this.foldedText = '收起'
        } else {
          this.folded = false
          this.foldedText = '展开'
        }
      },
      changeDetailAttachStatus () {
        this.chatMsgCon.showDetailAttach = !this.chatMsgCon.showDetailAttach
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .unfolded
    color: #1abb9c
    padding-left 30px
    cursor pointer
  .padding-top5
    padding-top 5px
  .padding-left5
    padding-left 5px
  .chat_info_li
    line-height 20px
  overflow-y auto
  .chat_info_box .chat_info_label
    display inline-block
  .chat_msg_box
    border-right 1px solid #d3d3d3
  .active
    background #e8f5fc
  .chat_top
    position relative
    height 40px
    box-sizing border-box
    border-bottom 1px solid #EEEFF3
  .chat_top_head
    float left
    /*padding-left 48px*/
    max-width 100%
    box-sizing border-box
    position relative
    /*margin-top 8px*/
    line-height 40px
  .chat_transfer
    float right
    margin-right 10px
    .iconfont
      cursor pointer
      font-size 18px
      margin 0 10px
      line-height 30px
      color #ababab
  .avatar
    position absolute
    left 0
  .title
    margin-left 10px
    .chat_title_time
      color #aaa
  .diction-subject
    background #F9F7FC
    border 1px solid #e6e6e6
    height 148px
    overflow-y auto
    background #fff
  .tableVisibleBtn
    display inline-block
  .tableVisibleBtnBox
    clear both
    text-align center
    padding-top 10px
  .dic_item_desc_session
    margin-top 8px
    text-align left
    font-weight bold
    cursor pointer
    height 20px
    line-height 20px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    position relative
  .dic_item_desc_arrow
    position absolute
    right 10px
  .dic_item_desc_text
    width 100%
    height 100%
    padding-left 10px
    box-sizing border-box
  .dic_item_desc_radio
    position absolute
    display inline-block
    width 100%
    height 100%
    opacity 0
    cursor pointer
  .email_chat_msg
    padding 1px 14px 0
    box-sizing border-box
    border-bottom 1px solid #eeeff3
    overflow auto
  .chat_item
    position relative
    width 70%
    padding-left 50px
  .chat_user_info
    position absolute
    left 0
    top 12px
    .chat_time
      position absolute
      left 65px
      top -30px
      white-space nowrap
  .chat_user_img
    border-radius 50%
    width 40px
    height 40px
    overflow hidden
    background url("../../public-modules/contact-summary/img/agent.png") no-repeat 50% 50%
    background-size 40px auto
    img
      width 100%
      background #fff
  .chat_time
    color #9A9A9A
    text-align center
    line-height 16px
  .chat_item.in
    .el-icon-arrow-right
      border 1px solid #fff
    .chat_content
      p
        color #fff
  .chat_item.out
    .chat_content
      p
        color #666
  .chat_content
    max-width 90%
    padding 10px 10px 4px
    position relative
    margin-left 14px
    border-radius 18px
    background #7acdd1
    .send_status
      position absolute
      width 20px
      height 20px
      border-radius 50%
      left -30px
      top 50%
      margin-top -13px
    .send_status.process
      background url('../webchat/img/webchat_send.gif') no-repeat
      background-size 20px 20px
    .send_status.failure
      color red
      text-align center
      line-height 20px
      font-size 20px
    .send_status.success
      color #fff
      text-align center
      line-height 20px
      font-size 14px
      background #1aba9d
  .chat_item
    .chat_content
      p
        overflow hidden
        max-height 54px
        line-height 18px
        word-break break-all
  .chat_content_arrow
    border-top 6px solid transparent
    border-bottom 6px solid transparent
    border-right 6px solid #7acdd1
    content ' '
    position absolute
    width 0
    height 0
    left -9px
    top 10px
    border-radius 1px
    transform rotate(95deg)
    border 5px solid #7acdd1
    border-color #7acdd1 transparent transparent #7acdd1
  .chat_user_info_out
    position absolute
    right 0
    top -2px
    .chat_time
      position absolute
      white-space nowrap
      right 75px
      top -15px
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
    .email_do_btn
      color $c-main
  .chat_content_arrow_out
    border-left 6px solid #f2f2f2
    border-top 6px solid transparent
    border-bottom 6px solid transparent
    border-right 6px solid #f2f2f2
    content ' '
    position absolute
    width 0
    height 0
    right -9px
    top 10px
    border-radius 1px
    transform rotate(83deg)
    border 5px solid #f2f2f2
    border-color transparent transparent #f2f2f2 #f2f2f2
  .chat_item.system
    text-align center
    .chat_content
      display inline-block
      width 35%
      height 26px
      border-radius: 13px
      text-align center
      display inline-block
      padding 0
      line-height 26px
      background #f2f2f2
  .chat_msg_con
    textarea
      resize none
  .el-form-item
    margin 0
  .replyMsg
    float right
  .msg_do
    margin-left 0
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
    .iconfont
      font-size 18px
      cursor pointer
  .other_msg
    .iconfont:hover
      color $c-main
  .upload
    width 20px
  .email_todo_conbox
    .email_chat_msg
      max-height calc( 100vh - 230px)
  .email_all_conbox
    .email_chat_msg
      max-height calc( 100vh - 230px)
  .chat_info
    padding-top 2px
    .chat_info_todo
    .chat_info_all
      padding 0 14px
      box-sizing border-box
      height calc(100vh - 186px)
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
    border-color #fff
  textarea:focus
    border-color #e6e6e6
  .el-tree
    border none
  .quickreplay_custome_title
    padding 14px 0 8px
    span
      float right
      font-size 12px
      line-height 20px
      cursor pointer
      margin-right 6px
  .quickreplay_li
    .edit_del
      position absolute
      right 4px
      top 0
  .quickRe
    display none
    color #71ccba
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
    color #a7a7a7
    .quickBoxTit
      padding 0 0 8px
    .tree
      padding-left 10px
      .cursor_li
        padding 2px 0
      .quickReLi:before
        top 8px
    .el-tree
      .is-leaf
        display none
  .color
    color #1f2d3d
  .popover1
    font-size 12px
    .quickReLi:before
      display none
    .quickReLi
      padding-left 18px
  .transfer_li
    color #989898
    height 16px
    padding 4px 0
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
    font-size 12px
    margin 4px 0
  .transfer_group_btn
    position absolute
    top 0
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
    max-height calc(100vh - 218px + 28px)
    overflow-y auto
  .transfer_li
    .cata-name
      display inline-block
      width 100%
  .cursor_li
    cursor pointer
  .chat_info_title
    color #808080
    word-break break-all
  .email_todo_conbox
    .basic_info
      padding-top 14px
      max-height calc( 100vh - 226px)
      box-sizing border-box
      overflow auto
      .chat_info_title
        margin-bottom 10px
        max-height 40em
        overflow hidden
      .chat_info_li
        margin-bottom 4px
      .chat_info_li.chat_info_li_title
        display inline-block
  .email_do_btn
    line-height 22px
    margin-top 4px
    color #fff
    .el-icon-arrow-right
      float right
      cursor pointer
      text-align center
      vertical-align top
      border 1px solid $c-main
      box-sizing border-box
      border-radius 50%
      line-height 18px
      height 20px
      width 20px
      vertical-align bottom
    .attachment_box
      float right
      margin-right 8px
      .attachment_btn
        cursor pointer
  .email_do_btn_box
    height 24px
  .email_all_content
    overflow-y auto
    padding-top 20px
  .email_title
    font-size 22px
    float left
    width 100%
    padding-bottom 5px
    color $cf-gray2
    font-weight bold
  .email_details_do
    color $c-main
    position absolute
    right 0
    width 80px
    .iconfont
      cursor pointer
  .email_title_info
    border-bottom 1px solid #cdcdcd
    padding-bottom 10px
    .padding-top5
      color $cf-gray3
  .email_mark
    color #999
    font-size 12px
  .popover3
    max-height 106px
    overflow-y auto
  .popover2
  .popover3
    font-size 12px
    width 88px
    color #999
    text-align center
    li
      line-height 26px
    li:hover
      background $c-card
      cursor pointer
    .email_unread
      border-bottom 1px solid #e7e7e7
  .mail_pop
    box-sizing border-box
  .cancel_star
    padding-left 24px
  .popover1_input
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
  .popover_attachment
    position absolute
    background #fff
    min-width 150px
    border-radius 2px
    border 1px solid #D3DCE6
    padding 10px
    z-index 2000
    font-size 12px
    box-shadow 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
    left -76px
  .forward_btn
    margin-left 12px
  .incidentalAgentInfo
    float right
    margin-right 6px
    line-height 28px
    color #a5a5a5
  .email_dialog
    position relative
    padding-right 90px
    width 100%
    box-sizing border-box
    line-height 22px
  .forward_box
    display inline-block
    position relative
    float right
    .forward_con
      position absolute
      background #fff
      width 280px
      border-radius 2px
      border 1px solid #D3DCE6
      padding 10px
      z-index 2000
      font-size 12px
      box-shadow 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
      left -150px
      top 26px
    .pop_arrow
      color transparent
      top -13px
      left 50%
      margin-right 3px
      border-top-width 0
      border-bottom-color #D3DCE6
      border-width 6px
      position absolute
      display block
      width 0
      height 0
      border-style solid
    .pop_arrow:after
      content " "
      border-width 6px
      position absolute
      display block
      width 0
      height 0
      border-color transparent
      border-style solid
      top: 1px;
      margin-left: -6px;
      border-top-width: 0;
      border-bottom-color: #fff;
  .attachment_box
    position relative
    display inline-block
  .btn-group
    text-align center
    margin-top 14px
    .el-button
      color #fff
      width 74px
      height 30px
    .el-button:nth-child(1)
      background #7bcdd2
      border 1px solid #7bcdd2
    .el-button:nth-child(2)
      background #1abb9c
      border 1px solid #1abb9c
  .pop_arrow
    color transparent
    top -13px
    left 50%
    margin-right 3px
    border-top-width 0
    border-bottom-color #D3DCE6
    border-width 6px
    position absolute
    display block
    width 0
    height 0
    border-style solid
  .pop_arrow:after
    content " "
    border-width 6px
    position absolute
    display block
    width 0
    height 0
    border-color transparent
    border-style solid
    top 1px
    margin-left -6px
    border-top-width 0
    border-bottom-color #fff
  .email_details_attachment
    left -78px
    top 26px
  .all_attachment_box
    .iconfont
      color $c-main
  .all_attachment_box_title
    margin 18px 0
    span
      color $cf-gray3
  .all_attachments_ul

  .attach_and_copy
    float left
    line-height 28px
    .addCopy,.addAttach
      display inline-block
      margin-left 10px
      cursor pointer
      color #a5a5a5
    .addCopy.click,.addAttach.click
      color $c-main
  .attach_and_copy_box
    position relative
    .box_p
      width 100%
      box-sizing border-box
      background #fafafa
      padding 6px 80px 6px 12px
    .copy_box_p
      .cancel_copy
        position absolute
        cursor pointer
        right 10px
        top 14px
        color $c-main
    .copy_box_p.click
      z-index 2
    .attach_box_p.box_p
      font-size 12px
      padding 6px 12px
    .attach_box_p.click
      z-index 2
    .copy_con_box,.attach_con_box
      width 100%
    .icon-xiazai
      cursor pointer
  .chat_info_li_title
    b.chat_info_li_con
      font-weight normal
  .quickreplay_custom_edit
    .quickReplyCancel
      background #7bcdd2
      border 1px solid #7bcdd2
    .quickReplySave
      background #1abb9c
      border 1px solid #1abb9c
  .button_box
    margin-top 10px
    text-align center
  .sys_quick_li
    position relative
    .sys_quick_li_span
      position absolute
      left 0
    .sys_quick_li_title
      display inline-block
      width 100%
      box-sizing border-box
      padding-left 20px
  .footer_box
    padding 4px 8px
  .email_detail_content
    color $cf-gray1
</style>
