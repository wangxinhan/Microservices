<template>
  <el-row v-if="currEmailSession" :class="tabType + '_conbox'">
    <el-col :span="16">
      <div class="chat_msg_box">
        <div class="chat_head" v-show="tabType === 'email_todo'">
          <el-row>
            <el-col :span="24">
              <div class="chat_top">
                <div class="chat_top_head clearBoth">
                  <div class="title">
                    <div class="email_title_con">{{emailCustData.name?emailCustData.name:$t('public.unknowLocationCustomer')}}
                    <span class="chat_title_time">{{currEmailSession.createTime}}</span></div>
                  </div>
                </div>

                <!--转接座席-->
                <el-popover ref="popover1" placement="bottom" width="220" trigger="click" v-model.trim="chatHead.popover1Visible">
                  <div class="popover1">
                    <input type="text" :placeholder="$t('public.pleaseEnter')" class="popover1_input" v-model.trim="popover1Search" v-on:keyup="searchTree1"/>
                    <!--<input type="text" :placeholder="$t('public.pleaseEnter')" class="popover1_inpit" v-model.trim="popover1Search" v-on:keyup="searchTree1"/>-->
                    <ul class="tree">
                      <li class="quickReSys transfer_li clearBoth ellipsis" v-for="(model, index) in chatHead.onlineAgents" @click.stop="transferAgent(model._id, model.displayName)">
                        <span class="cata-name ellipsis" >{{model.displayName}}</span>
                      </li>
                    </ul>
                  </div>
                </el-popover>
                <el-popover ref="popover2" placement="bottom" width="88" trigger="click" :class="mail_pop" v-model.trim="chatHead.popover2Visible">
                  <div class="popover2 popover_email">
                    <ul>
                      <li class="email_unread"><el-checkbox v-model.trim="chatHead.readStateChecked"  @change="switchReadState(chatHead.readStateChecked,'switchReadState')">{{$t('email.unReadEmail')}}</el-checkbox></li>
                      <li><el-checkbox v-model.trim="chatHead.starStateChecked"  @change="switchStarState(chatHead.starStateChecked, 'starStateChecked')">{{$t('email.starEmail')}}</el-checkbox></li>
                    </ul>
                      </li>
                    </ul>
                  </div>
                </el-popover>

                <el-popover ref="popover3" placement="bottom" width="88" trigger="click" :class="mail_pop" v-model.trim="chatHead.popover3Visible">
                  <div class="popover3 popover_email">
                    <ul>
                      <li v-for="category in chatHead.mailCategories" @click.stop="selectCategory(category, 'selectCategory')">{{category.categoryName}}</li>
                    </ul>
                  </div>
                </el-popover>
                <end-session-box :info="chatHead" @endSession="endSessionFun" @changeEndSiFlag="changeEndSessionFlag"></end-session-box>
                <div class="chat_transfer" >
                  <el-button type="text" class="email_mark" v-popover:popover3 size="mini" @click="initCategoryData" >{{checkedCategory}} <span class="el-icon-arrow-down"></span></el-button>
                  <el-button type="text" class="email_mark" v-popover:popover2 size="mini" @click="initMarkData" >{{$t('email.emailMark')}} <span class="el-icon-arrow-down"></span></el-button>
                  <el-button type="text" class="iconfont icon-zhuanjie1" v-popover:popover1 size="mini" @click="showRedirectPopup" ></el-button>
                  <el-button type="text" class="iconfont icon-wancheng1" @click="showFinishPopup" size="mini"></el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="chat_msg_con">
          <el-row>
            <el-col :span="24">

              <div class="email_chat_msg chatMsgCon" :class="chatMsgCon.font">
                <div class="email_msg_inner">
                  <div v-if="currSessionHistory" v-for="(chatMsg, index) in currSessionHistory" class="msg_li clearBoth" >

                    <!--收到消息-->
                    <div class="chat_item in clearBoth" v-if="chatMsg.emailType === 'receive'">
                      <div class="chat_user_info">
                        <customer-avatar
                          :size="20"
                          class="client_msg"
                          :status="emailCustData.status"
                        ></customer-avatar>
                        <div class="chat_time" >{{getChatShortTime(chatMsg)}}</div>
                      </div>
                      <div class="chat_content">
                        <div class="chat_content_arrow"></div>
                        <p>{{chatMsg.contentText}}</p>
                        <div class="clearBoth email_do_btn_box">
                          <div class="email_do_btn clearBoth">
                            <div class="el-icon-arrow-right" @click.stop="showEmailDetails(chatMsg)"></div>
                            <div v-if="chatMsg.attachment.length>0" class="attachment_box clearBoth">

                              <!-- 邮件附件详情 -->
                              <span class="iconfont icon-fujian attachment_btn" @click.stop="showChatAttach(chatMsg.attachment, index)">({{chatMsg.attachment.length}})</span>
                              <div class="popover_attachment" v-if="chatMsgCon.currAttachment === index && chatMsgCon.currAttachVisible">
                                <div class="pop_arrow"></div>
                                <ul>
                                  <li v-for="attach in chatMsgCon.chatAttach" class="ellipsis">
                                    <a :href="attach.url" @click.stop="chatMsgCon.currAttachVisible=false" :download="attach.name" :title="attach.name">{{attach.name}}</a>
                                  </li>
                                </ul>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!--回复消息-->
                    <div class="chat_item out clearBoth"  v-if="chatMsg.emailType === 'reply'">
                      <div class="chat_content">
                        <div class="chat_content_arrow_out"></div>
                        <div class="send_status failure iconfont icon-tishi" v-if="chatMsg.status === 'fail'"></div>
                        <div class="send_status success iconfont icon-fasongchenggong" v-if="chatMsg.status === 'success'"></div>
                        <div class="send_status process" v-if="!chatMsg.status"></div>
                        <p>{{chatMsg.contentText}}</p>
                        <div class="clearBoth email_do_btn_box">
                          <div class="email_do_btn clearBoth">
                            <div class="el-icon-arrow-right" @click.stop="showEmailDetails(chatMsg)"></div>
                            <div v-if="chatMsg.attachment.length>0" class="attachment_box clearBoth">
                              <!-- 邮件附件详情 -->
                              <div class="iconfont icon-fujian attachment_btn" @click.stop="showChatAttach(chatMsg.attachment, index)">({{chatMsg.attachment.length}})</div>
                              <div class="popover_attachment" v-if="chatMsgCon.currAttachment === index && chatMsgCon.currAttachVisible">
                                <div class="pop_arrow"></div>
                                <ul>
                                  <li v-for="attach in chatMsgCon.chatAttach" class="ellipsis">
                                    <a :href="attach.url" @click.stop="chatMsgCon.currAttachVisible=false" :download="attach.name" :title="attach.name">{{attach.name}}</a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="chat_user_info_out clearBoth">
                        <div class="chat_user_img" >
                          <img v-if="im_icon(chatMsg)" :src="im_icon(chatMsg)" alt=""/>
                        </div>
                        <div class="chat_time">{{getChatShortTime(chatMsg)}}</div>
                      </div>
                    </div>

                    <!-- 详情对话框 -->
                    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('email.emailDetail')" id="email_detail" v-model.trim="chatMsgCon.showDetail">
                      <el-row>
                        <div class="email_title_info">
                          <div class="email_dialog clearBoth">
                            <div class="email_title ellipsis" :title="mailDetailInfo.subject" v-if="mailDetailInfo.subject"> {{mailDetailInfo.subject}}</div>
                            <div class="email_details_do clearBoth">
                              <!--附件小图标-->
                              <div class="attachment_box" v-if="mailDetailInfo.attachment.length>0">
                                <span class="iconfont icon-fujian attachment_btn" >({{mailDetailInfo.attachment.length}})</span>
                              </div>
                              <div class="forward_box" v-if="mailDetailInfo.emailType ==='receive'">
                                <span class="iconfont icon-zhuanjie1 zhuanjie1" @click.stop="chatMsgCon.showForward=!chatMsgCon.showForward"></span>
                                <div class="forward_con" v-if="chatMsgCon.showForward">
                                  <div class="pop_arrow"></div>
                                  <input-tag :inputData="chatMsgCon.forwardGroup" :validate="'Email'" @inputChange="forwardInputChange" :placeholder="$t('email.editEmailCopy')"></input-tag>
                                  <div class="btn-group">
                                    <el-button size="mini" type="text" @click.stop="cancelForwardEmail">{{$t('public.cancel')}}</el-button>
                                    <el-button type="primary" size="mini" @click.stop="forwardEmail">{{$t('email.forwardPrefix')}}</el-button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="email_details_info_li">
                            <span>{{$t('public.time')}}: </span>
                            <span v-if = "mailDetailInfo.createTime">
                                {{mailDetailInfo.createTime}}
                            </span>
                          </div>
                          <div clas="email_details_info_li" v-if = "mailDetailInfo.from">
                            <span>{{$t('email.sender')}}: </span>
                            <span>
                                {{mailDetailInfo.from.name}} <{{mailDetailInfo.from.addr}}>
                            </span>
                          </div>
                          <div class="email_details_info_li" v-if = "mailDetailInfo.to.length>0">
                            <span>{{$t('email.recipient')}}: </span>
                            <span v-for = "to in mailDetailInfo.to">
                                {{to.name}} <{{to.addr}}>
                            </span>
                          </div>
                          <div class="email_details_info_li" v-if = "mailDetailInfo.cc.length>0">
                            <span>{{$t('email.copyFor')}}: </span>
                            <span  v-for = "cc in mailDetailInfo.cc">
                                {{cc.name}} <{{cc.addr}}>
                            </span>
                          </div>
                        </div>
                      </el-row>
                      <el-row>
                        <div class="email_all_content">
                          <div class="email_detail_content" v-html="emailContent"></div>
                          <div class="all_attachment_box clearBoth" v-if="mailDetailInfo.attachment.length>0">
                            <div class="all_attachment_box_title">
                              <!--<span class="iconfont icon-fujian"></span>-->
                              <span>{{$t('email.attachment')}}: {{mailDetailInfo.attachment.length}}</span>
                            </div>
                            <div class="all_attachments_ul clearBoth" v-for="attach in mailDetailInfo.attachment">
                              <email-attachment :fileName="attach.name" :fileUrl="attach.url"></email-attachment>
                            </div>
                          </div>
                        </div>
                      </el-row>
                      <div class="tableVisibleBtnBox clearBoth">
                        <el-button class="tableVisibleBtn" @click.stop="chatMsgCon.showDetail = false" size="small">{{$t('public.cancel')}}</el-button>
                        <!--<el-button class="tableVisibleBtn" @click.stop="chatMsgCon.showDetail = false,chatMsgCon.showForward = false" size="small">{{$t('public.cancel')}}</el-button>-->
                      </div>
                    </el-dialog>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="send_chat_msg email_send_box" v-show="tabType === 'email_todo'">
          <el-row>
            <el-col :span="24">
              <!-- 邮件聊天框部分 -->
              <el-form :model="sendChatMsg" class="send_msg_form" ref="sendChatMsg">
                <div class="attach_and_copy_box">
                  <div class="attach_box_p box_p" v-if="(inboxEmail.attachGroup.length>0 || attachUpPro.flag ) && !inboxEmail.copyBoxShow">
                    <attach-input-tag :inputData="inboxEmail.attachGroup" :uploadProgress="attachUpPro" @inputChange="attachInputChange" ></attach-input-tag>
                  </div>
                  <div class="copy_box_p box_p" v-if="inboxEmail.copyBoxShow">
                    <input-tag :inputData="inboxEmail.ccGroup" :validate="'Email'" @inputChange="ccInputChange" :placeholder="$t('email.editCopy')"></input-tag>
                    <span class="cancel_copy" @click.stop="cancelCcInput">{{$t('email.cancelCopy')}}</span>
                  </div>
                </div>
                <div class="quill">
                  <quill-editor ref="myTextEditor"
                                v-model.trim="inboxEmail.content"
                                :config="inboxEmail.editorOption">
                  </quill-editor>
                </div>
                <el-form-item class="footer_box" :class="clearBoth">
                  <div class="attach_and_copy">
                    <div id="uploadEmailFile" :class="(inboxEmail.attachGroup.length>0 && !inboxEmail.copyBoxShow) ? 'click' : '' " @click.stop="changeCopyBoxShow()" class="addAttach" >
                      <span class="iconfont icon-fujian"></span>
                      {{$t('email.addAttach')}}
                      <span v-if="inboxEmail.attachGroup.length>0">({{inboxEmail.attachGroup.length}})</span>
                    </div>
                    <div class="addCopy" :class="inboxEmail.copyBoxShow===true?'click':''"  @click.stop="changeCopyBoxShow(true)">{{$t('email.addCopy')}}<span v-if="inboxEmail.ccGroup.length>0">({{inboxEmail.ccGroup.length}})</span></div>
                  </div>
                  <el-button type="primary" class="replyMsg" @click.stop="replyEmailInbox" size="small">{{$t('email.send')}}</el-button>
                  <span class="incidentalAgentInfo">
                    <el-checkbox v-model.trim="inboxEmail.carryAgentInfo">{{$t('email.incidentalAgentInfo')}}</el-checkbox>
                  </span>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-col>

    <!--右侧详情 -->
    <el-col :span="8">
      <div class="chat_info_box">
        <div class="chat_info">
          <!-- 处理中 -->
          <el-tabs class="chat_info_todo" v-show="tabType === 'email_todo'" :active-name="activeName" @tab-click="tabChange">
            <el-tab-pane :label="$t('webchat.auxiliaryInformation')" class="basic_info chat_detailed_info_box" name="otherInfo">
              <div>
                <h3 class="chat_info_title" :title="currEmailSession.subject">{{currEmailSession.subject}}</h3>
                <div class="chat_info_li clearBoth" >
                  <span class="chat_info_li_title">{{$t('public.customer')}}:<b v-if="currEmailSession.from" class="chat_info_li_con">{{currEmailSession.from.addr}}</b></span>
                  <!--<b v-if="currEmailSession.from.addr" class="chat_info_li_con">{{currEmailSession.from.addr}}</b>-->
                </div>
                <div class="chat_info_remark chat_info_li">
                  <span class="chat_info_li_title chat_info_li">{{$t('public.remark')}}</span>
                  <textarea class="chat_info_li_remarks" rows="3" :placeholder="$t('public.pleaseEnter')" v-on:blur="editRemark($event)">{{currEmailSession.remark}}</textarea>
                </div>
              </div>
            </el-tab-pane>

            <!-- 快捷回复-->
            <el-tab-pane :label="$t('email.commonWords')" class="basic_info quick_replay_box" name="quickreply">
              <div class="quickreplay_box">
                <div class="quickBoxTit">
                  {{$t('webchat.systemCommon')}}
                </div>
                <ul class="tree" v-if="sysQuickReply.length">
                  <li class="quickReSys quickReSysIndex" v-for="(model, index) in sysQuickReply">
                    <div class="cursor_li sys_quick_li" :class="" @click.stop="itemToggle(index)" :index="index" :title="model.name">
                      <span class="sys_quick_li_span"><i :class="open.index===index&&open.isOn ? 'el-icon-minus' : 'el-icon-plus'"></i></span>
                      <div class="cata-name ellipsis sys_quick_li_title">{{model.name}}</div>
                    </div>
                    <ul v-show="open.index === index && open.isOn === true" v-if="model.children&&model.children.length" class="quick_re_sys_ul">
                      <li class="quickReSys quickReLi ellipsis"
                          v-for="model in model.children"
                      >
                        <span class="cata-name ellipsis">{{model.content}}</span>
                        <span class="quickReBox clearBoth">
                          <i class="quickRe iconfont icon-fuzhi" @click.stop="quickCopyMsg(model.content)"></i>
                          <i class="quickRe iconfont icon-piliang" @click.stop="quickSendMsg(model.content)"></i>
                        </span>
                      </li>
                    </ul>
                  </li>
                </ul>

                <!-- 自定义快捷回复-->
                <div class="quickreplay_custome_title">
                  {{$t('webchat.customize')}} <span class="edit_img iconfont icon-beizhu" @click.stop="showQuickReplyEditInput" v-show="custQuickReplyEditIsShow === true"></span>
                </div>
                <div>
                  <ul class="quickreplay_custom_con" v-show="custQuickReplyEditIsShow">
                    <li class="quickReLi ellipsis" v-for="item in customQuickReply.rdata">
                      <span>{{item.value}}</span>
                      <span class="quickReBox clearBoth">
                        <i class="quickRe iconfont icon-fuzhi" @click.stop="quickCopyMsg(item.value)"></i>
                        <i class="quickRe iconfont icon-piliang" @click.stop="quickSendMsg(item.value)"></i>
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <div class="quickreplay_custom_edit" v-show="custQuickReplyEditIsShow === false">
                    <el-form :model="editCustomQuickReply" ref="editCustomQuickReply" class="demo-dynamic">
                      <el-button type="text" @click.stop="addQuickReplyItem" size="small" class="color el-icon-plus"></el-button>
                      <el-form-item v-for="(domain, index) in editCustomQuickReply.rdata" class="quickreplay_li" :prop="'rdata.' + index + '.value'" :rules="{required: true, message: '快捷回复不能为空', trigger: 'blur'}">
                        <input type="text" class="quickreplay_custom_edit_input" v-on:focus="indexInRdata = index" v-model.trim="domain.value"/>
                        <el-button class="edit_del el-icon-minus color" type="text" size="mini" @click.prevent="removeQuickReplyItem(domain)"></el-button>
                      </el-form-item>
                      <el-form-item>
                        <div class="button_box">
                          <el-button :class="quickReplyCancel" @click.stop="custQuickReplySubmit()" size="small">{{$t('public.cancel')}}</el-button>
                          <el-button :class="quickReplySave" @click.stop="custQuickReplySubmit(true)" type="primary" size="small">{{$t('public.save')}}</el-button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <!-- 全部 -->
          <div v-show="tabType === 'email_all'" class="chat_info_all">
            <h3 class="chat_info_title">{{currEmailSession.subject}}</h3>
            <div class="chat_info_li clearBoth" >
              <span class="chat_info_li_title">{{$t('public.customer')}}:</span>
              <span v-if="currEmailSession.from" class="chat_info_li_con">{{currEmailSession.from.addr}}</span>
            </div>
            <div class="chat_info_li clearBoth" >
              <span class="chat_info_li_title">{{$t('email.serviceEmail')}}:</span>
              <span v-if="currEmailSession.to" class="chat_info_li_con">{{currEmailSession.to.addr}}</span>
            </div>
            <div class="chat_info_li clearBoth" >
              <span class="chat_info_li_title">{{$t('email.emailCount')}}:</span>
              <span v-if="currEmailSession.totalEmailNum" class="chat_info_li_con">{{currEmailSession.totalEmailNum}}</span>
            </div>
            <div class="chat_info_li clearBoth" >
              <span class="chat_info_li_title">{{$t('email.endType')}}:</span>
              <span v-if="currEmailSession.finishReason" class="chat_info_li_con">{{currEmailSession.finishReason}}</span>
            </div>
            <div class="chat_info_li clearBoth email_createtime" >
              <span class="chat_info_li_title">{{$t('public.createTime')}}:</span>
              <span v-if="currEmailSession.createTime" class="chat_info_li_con">{{currEmailSession.createTime}}</span>
            </div>
            <div class="chat_info_li clearBoth" >
              <span class="chat_info_li_title">{{$t('email.agentFirstReplyTime')}}:</span>
              <span v-if="currEmailSession.firstReplyTime" class="chat_info_li_con">{{currEmailSession.firstReplyTime}}</span>
            </div>
            <div class="chat_info_li clearBoth" >
              <span class="chat_info_li_title">{{$t('email.endTime')}}:</span>
              <span v-if="currEmailSession.endTime" class="chat_info_li_con">{{currEmailSession.endTime}}</span>
            </div>
            <div class="chat_info_li clearBoth" >
              <span class="chat_info_li_title">{{$t('email.durationTime')}}:</span>
              <span v-if="currEmailSession.endTime" class="chat_info_li_con">{{getTimeLength(currEmailSession.lastEmailTimestamp , currEmailSession.createTimeStamp)}}</span>
            </div>
            <div class="chat_info_remark">
              <span class="chat_info_li_title chat_info_li">{{$t('public.remark')}}:</span>
              <textarea class="chat_info_li_remarks" rows="3" :placeholder="$t('public.pleaseEnter')" v-on:blur="editRemark($event)">{{currEmailSession.remark}}</textarea>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script type="text/javascript">
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import { deepClone, Base64, formatTimestamp, getCache } from '../../../utils/m7Utils'
  import * as types from '../../../store/modules/email/mutation-types.js'
  import { isEmpty } from 'lodash'
  import InputTag from 'components/public-modules/input/InputTag'
  import AttachInputTag from './AttachInputTag'
  import EndSessionBox from '../../public-modules/ImEndSessionBox/EndSessionBox'
  import {uploadTo7moorEmailDomain} from '../../../utils/qiniuUtils'
  import EmailAttachment from './EmailAttachment'
  import uuid from 'uuid'
  export default {
    name: 'EmailContainer',
    data () {
      return {
        tabType: 'email_todo',
        chatHead: {
          mailCategories: [],
          onlineAgents: [],
          isActiveOne: '999',
          isActiveTwo: '999',
          isActiveThree: '999',
          defaultProps: {
            children: 'children',
            label: 'label'
          },
          dialogTableVisible: false,
          endOptionsUl: [],
          majorstwo: [],
          majorsthree: [],
          endSessionActive: [],
          endSessionFlag: false,
          readStateChecked: false,
          starStateChecked: false,
          popover1Visible: false,
          popover2Visible: false,
          popover3Visible: false,
          endSessionLength: 0
        },
        chatMsgCon: {
          font: 'font12',
          chatMsgs: [],
          emailDetail: {
            to: [],
            cc: [],
            attachment: []
          },
          attachGroup: [],
          forwardGroup: [],
          attachment: [],
          showDetail: false,
          showDetailAttach: false,
          showForward: false,
          chatAttach: [],
          currAttachment: '',
          currAttachVisible: false
        },
        custQuickReplyEditIsShow: true,
        editCustomQuickReply: {},
        oldCustomQuickReply: {},
        inboxEmail: {
          content: '',
          dialogVisible: false,
          editorOption: {
            placeholder: '',
            modules: {
              toolbar: [
                ['bold', 'italic', 'underline', 'strike', {'list': 'ordered'}, {'list': 'bullet'}, {'header': [1, 2, 3, 4, 5, 6, false]}, {'color': []}, {'background': []}, {'font': []}, {'align': []}, 'link', 'emailUpLoadFile', 'clean']
              ]
            }
          },
          ccGroup: [],
          attachGroup: [],
          copyBoxShow: false,
          carryAgentInfo: true
        },
        attachUpPro: {
          flag: false,
          progress: ''
        },
        activeName: 'otherInfo',
        chatInfoVal: {
          chatInfo: []
        },
        open: {
          index: -1,
          isOn: false
        },
        showSuggest: false,
        loading: true,
        popover1Search: '',
        popoLoading: false,
        pop1Clone: {},
        pop2Clone: {},
        openPop1: {
          index: -1,
          isOn: false
        },
        options5: [],
        forwardAddr: [],
        remarkClone: ''
      }
    },
    computed: {
      checkedCategory () {
        let current = this.$t('email.emailCategory')
        if (!this.$store.state.email.current.email_todo.currentSession.category) {
          return current
        }
        let mailCategories = this.$store.state.session.dicMap.mailCategorys
        for (let i in mailCategories) {
          if (mailCategories[i]._id === this.$store.state.email.current.email_todo.currentSession.category) {
            current = mailCategories[i].categoryName
            break
          }
        }
        return current
      },
      sysQuickReply () {
        let arr = []
        arr = this.$store.getters.getSysQuickReplyForEmail || []
        return arr
      },
      customQuickReply () {
        return this.$store.getters.getCustomQuickReplyForEmail
      },
      agentName () {
        let agents = this.$store.state.session.dicMap.agents
        let current = ''
        for (let i in agents) {
          if (agents[i]._id === this.currEmailSession.agent) {
            current = agents[i].displayName
            break
          }
        }
        return current
      },
      currEmailSession () {
        let session = this.$store.state.email.current[this.tabType].currentSession
        this.remarkClone = session.remark || ''
        return session
      },
      currSessionHistory () {
        return this.$store.state.email.current[this.tabType].currentSessionHistory || []
      },
      emailCustData () {
        return this.$store.state.email.current[this.tabType].currentCustomer
      },
      mailDetailInfo () {
        return this.chatMsgCon.emailDetail
      },
      editor () {
        return this.$refs.myTextEditor.quillEditor
      },
      emailContent () {
        let content = deepClone(this.mailDetailInfo.content) || ''
        let newData = content.replace(/<style[^>]*?>[\s\S]*?<\/style>/g, '')
        return newData
      },
      sessionUserId () {
        return this.$store.state.session.user._id
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      $route (to, form) {
        if (to.path.split('/')[2] === 'email') {
          this.fetchData()
        }
      }
//      'inboxEmail.copyBoxShow': 'chatMsgChange'
    },
    created () {
      this.fetchData()
    },
    components: {
      CustomerAvatar,
      InputTag,
      AttachInputTag,
      EmailAttachment,
      EndSessionBox
    },
    methods: {
      fetchData () {
        let path = this.$route.path.split('/')
        this.tabType = path[3]
        this.sessionId = path[4]
      },
      searchTree1 () {
        let str = this.popover1Search
        let dataLi = []
        if (str) {
          this.pop1Clone.forEach((item) => {
            let liName = item.displayName
            if (liName.indexOf(str) !== -1) {
              dataLi.push(item)
            }
          })
          this.chatHead.onlineAgents = dataLi
        } else {
          this.chatHead.onlineAgents = this.pop1Clone
        }
      },
      // 邮件聊天框相关
      replyEmailInbox () {
        let content = this.inboxEmail.content
        let text = this.editor.getText()
        if (!text.trim()) {
          text = this.inboxEmail.content
        }
        if (!content || !text) {
          this.$message({message: this.$t('email.isNullByContent'), type: 'warning'})
          return false
        }
        let data = {
          sessionId: this.currEmailSession._id,
          shortId: this.currEmailSession.shortId,
          to: this.currEmailSession.from,
          from: this.currEmailSession.to,
          subject: this.currEmailSession.subject,
          supportEmail: this.currEmailSession.supportEmail,
          attachment: this.inboxEmail.attachGroup,
          cc: this.inboxEmail.ccGroup || [],
          content: content,
          contentText: text,
          carryAgentInfo: this.inboxEmail.carryAgentInfo,
          displayName: this.agentName,
          firstReplyTime: this.currEmailSession.firstReplyTime,
          agentFirstReplyTime: this.currEmailSession.agentFirstReplyTime
        }
        replyEmailInbox(this.$store, data).then(() => {
          this.$nextTick(function () {
            if (document.getElementsByClassName('email_chat_msg').length) {
              document.getElementsByClassName('email_chat_msg')[0].scrollTop = document.getElementsByClassName('email_msg_inner')[0].scrollHeight
            }
          })
        })
        this.inboxEmail.content = ''
        this.inboxEmail.ccGroup = []
        this.inboxEmail.attachGroup = []
        this.inboxEmail.copyBoxShow = false
        this.$nextTick(function () {
          this.chatMsgChange()
        })
      },
      cancelForwardEmail () {
        this.chatMsgCon.forwardGroup = []
        this.chatMsgCon.showForward = false
      },
      forwardEmail () {
        let forwardAddr = deepClone(this.chatMsgCon.forwardGroup)
        if (!forwardAddr.length) {
          this.$message({message: this.$t('email.forwardEmailNotAir'), type: 'error'})
          return
        }
        this.chatMsgCon.showForward = false
        let toAddr = []
        forwardAddr.forEach((item) => {
          let address = {name: '', addr: item}
          toAddr.push(address)
        })
        let attachments = []
        let attachFiles = deepClone(this.chatMsgCon.emailDetail.attachment)
        attachFiles.forEach((attach) => {
          let attachName = Base64.encode(attach.name)
          let attachUrl = Base64.encode(attach.url)
          attachments.push({name: attachName, url: attachUrl})
        })
        let emailSubject = this.$t('email.forwardPrefix') + ':' + this.chatMsgCon.emailDetail.subject
        let data = {
          sessionId: this.currEmailSession._id,
          shortId: this.currEmailSession.shortId,
          to: toAddr,
          from: this.currEmailSession.to,
          subject: emailSubject,
          supportEmail: this.currEmailSession.supportEmail,
          attachment: attachments,
          cc: [],
          carryAgentInfo: true,
          displayName: this.agentName,
          content: this.chatMsgCon.emailDetail.content,
          contentText: this.chatMsgCon.emailDetail.contentText
        }
        forwardEmailInbox(this.$store, data).then(() => {
          this.chatMsgCon.showDetail = false
          this.chatMsgCon.forwardGroup = []
        })
      },
      showEmailDetails (mail) {
        this.chatMsgCon.showForward = false
        this.chatMsgCon.showDetailAttach = false
        this.chatMsgCon.currAttachVisible = false
        this.chatMsgCon.forwardGroup = []
        let result = deepClone(mail)
        this.chatMsgCon.emailDetail = result
        this.chatMsgCon.showDetail = true
      },
      changeDetailAttachStatus () {
        this.chatMsgCon.showDetailAttach = !this.chatMsgCon.showDetailAttach
      },
      showChatAttach (attach, index) {
        if (!this.chatMsgCon.currAttachment || this.chatMsgCon.currAttachment === index) {
          this.chatMsgCon.currAttachVisible = !this.chatMsgCon.currAttachVisible
        }
        if (this.chatMsgCon.currAttachment !== index) {
          this.chatMsgCon.currAttachVisible = true
        }
        this.chatMsgCon.chatAttach = attach
        this.chatMsgCon.currAttachment = index
      },
      ccInputChange (data) {
        this.inboxEmail.ccGroup = data
        this.$nextTick(function () {
          this.chatMsgChange()
        })
      },
      attachInputChange (data) {
        this.inboxEmail.attachGroup = data
        this.$nextTick(function () {
          this.chatMsgChange()
        })
      },
      cancelCcInput () {
        this.inboxEmail.ccGroup = []
        this.inboxEmail.copyBoxShow = false
        this.$nextTick(function () {
          this.chatMsgChange()
        })
      },
      forwardInputChange (data) {
        this.chatMsgCon.forwardGroup = data
      },
      changeShowForward () {
        this.showForward1 = !this.showForward1
      },
      initUploadEmailFile () {
        let self = this
        let fileAdded = function (up, files) {
          console.log('fileAdd')
        }
        let beforeUpload = function (up, file) {
          console.log('beforeUpload1')
        }
        let uploadProgress = function (up, file) {
          self.attachUpPro.flag = true
          self.attachUpPro.progress = file.percent
          self.chatMsgChange()
          if (document.getElementsByClassName('verification_box_attach').length) {
            document.getElementsByClassName('verification_box_attach')[0].scrollTop = document.getElementsByClassName('verification_ul')[0].scrollHeight
          }
        }
        let uploadComplete = function () {
          console.log('uploadComplete1')
        }
        let fileUploaded = function (up, file, info) {
          let domain = up.getOption('domain')
          let res = JSON.parse(info)
          let sourceLink = domain + res.key // 获取上传成功后的文件的Url
          let trueName = file.name
          self.inboxEmail.attachGroup.push({name: trueName, url: sourceLink})
          self.attachUpPro.flag = false
          self.$nextTick(function () {
            self.chatMsgChange()
            if (document.getElementsByClassName('verification_box_attach').length) {
              document.getElementsByClassName('verification_box_attach')[0].scrollTop = document.getElementsByClassName('verification_ul')[0].scrollHeight
            }
          })
//          self.$nextTick(function () {
//            if (document.getElementsByClassName('verification_box_attach').length) {
//              document.getElementsByClassName('verification_box_attach')[0].scrollTop = document.getElementsByClassName('verification_ul')[0].scrollHeight
//            }
//          })
        }
        let error = function (up, err, errTip) {
          self.$message.error(errTip)
        }
        let key = function (up, file) {
          let today = new Date()
          let time = today.getTime()
          let fileName = file.name
          let key = 'email/' + time + '/' + uuid.v1() + '/' + fileName
          return key
        }
        uploadTo7moorEmailDomain(this.sessionUserId, 'uploadEmailFile', {}, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploaded, error, key)
      },
      initUploadImageFile () {
        let self = this
        let fileAdded = function (up, files) {
          console.log('fileAdd')
        }
        let beforeUpload = function (up, file) {
          console.log('beforeUpload1')
        }
        let uploadProgress = function (up, file) {
          console.log('uploadProgress1')
        }
        let uploadComplete = function () {
          console.log('uploadComplete1')
        }
        let fileUploaded = function (up, file, info) {
          let domain = up.getOption('domain')
          let res = JSON.parse(info)
          let sourceLink = domain + res.key // 获取上传成功后的文件的Url
          self.inboxEmail.content += `<img src="${sourceLink}">`
        }
        let error = function (up, err, errTip) {
          self.$message.error(errTip)
        }
        let key = function (up, file) {
          let today = new Date()
          let time = today.getTime()
          let fileName = file.name
          let key = 'email/' + time + '/' + uuid.v1() + '/' + fileName
          return key
        }
        let filters = {
          mime_types: [
            {title: 'Image files', extensions: 'jpg,jpeg,gif,png,bmp'}
          ]
        }
        uploadTo7moorEmailDomain(this.sessionUserId, 'uploadImageFile', filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploaded, error, key)
      },
//      removeStyle () {
//        let pane = document.getElementById('email_detail').getElementsByTagName('style')
//        for (let i = 0; i < pane.length; i++) {
//          let removeObj = pane[i]
//          removeObj.parentNode.removeChild(removeObj)
//        }
//      },
      // 分类星标,转接座席,完成会话
      initCategoryData () {
        let categoryList = this.$store.getters.dicMap.mailCategorys || []
        let filterResult = categoryList.filter((category) => {
          return category.relateMailAddr === this.currEmailSession.to.addr
        })
        filterResult.unshift({categoryName: this.$t('email.uncategorized'), categoryId: 'uncategorized'})
        this.chatHead.mailCategories = filterResult
      },
      selectCategory (selectCategory) {
        let data = {
          mailSessionId: this.currEmailSession._id,
          categoryId: selectCategory._id || selectCategory.categoryId,
          categoryName: selectCategory.categoryName
        }
        defineEmailCategory(this.$store, data).then((res) => {
          this.chatHead.popover3Visible = false
        })
      },
      showFinishPopup () {
        getChannelDic(this.$store).then((res) => {
          let finishTypeOne = []
          res.forEach((item) => {
            if (item.type === 'email') {
              finishTypeOne = item.options || []
            }
          })
          if (finishTypeOne.length === 0) {
            this.$message.error(this.$t('email.isNullByFinishKey'))
            return
          }
          let two = false
          let three = false
          this.chatHead.endSessionLength = 1
          finishTypeOne.forEach((item) => {
            if (!item.options) {
              item.options = []
            } else if (item.options.length) {
              two = true
            }
            item.options.forEach((secondItem) => {
              if (!secondItem.options) {
                secondItem.options = []
              } else if (secondItem.options.length) {
                three = true
              }
            })
          })
          if (two) {
            this.chatHead.endSessionLength = 2
            if (three) {
              this.chatHead.endSessionLength = 3
            }
          }
          this.chatHead.endOptionsUl = finishTypeOne
          this.chatHead.majorstwo = []
          this.chatHead.majorsthree = []
          this.chatHead.endSessionActive = []
          this.chatHead.dialogTableVisible = true
          this.chatHead.isActiveOne = ''
        })
      },
//      cascadeDisplay (data, flag, index) {
//        let that = this
//        if (flag === 'one') {
//          that.chatHead.endOptionsUl.forEach(function (d) {
//            if (d.name === data) {
//              that.chatHead.endSessionFlag = false
//              that.chatHead.majorstwo = d.options
//              that.chatHead.isActiveOne = index
//              that.chatHead.majorsthree = []
//              that.chatHead.isActiveTwo = ''
//              that.chatHead.isActiveThree = ''
//              if (that.chatHead.majorstwo.length) {
//                that.chatHead.endSessionFlag = false
//              } else {
//                that.chatHead.endSessionFlag = true
//              }
//              that.chatHead.endSessionActive[0] = index
//            }
//          })
//        }
//        if (flag === 'two') {
//          that.chatHead.majorstwo.forEach(function (d) {
//            if (d.name === data) {
//              that.chatHead.majorsthree = d.options
//              that.chatHead.isActiveTwo = index
//              that.chatHead.isActiveThree = ''
//              if (that.chatHead.majorsthree.length) {
//                that.chatHead.endSessionFlag = false
//              } else {
//                that.chatHead.endSessionFlag = true
//              }
//              that.chatHead.endSessionActive[1] = index
//            }
//          })
//        }
//        if (flag === 'three') {
//          that.chatHead.majorsthree.forEach(function (d) {
//            if (d.name === data) {
//              that.chatHead.isActiveThree = index
//              that.chatHead.endSessionFlag = true
//              that.chatHead.endSessionActive[2] = index
//            }
//          })
//        }
//      },
      endSessionFun (flag) {
        if (flag) {
          if (this.chatHead.endSessionFlag === false) {
            this.$message.error(this.$t('public.chooseEndSession'))
            return
          } else {
            let arr = this.chatHead.endSessionActive
            let actName = ''
            let finishKey = ''
            if (arr.length > 2) {
              let one = arr[0]
              let two = arr[1]
              let three = arr[2]
              actName = this.chatHead.endOptionsUl[one].options[two].options[three].name
              finishKey = this.chatHead.endOptionsUl[one].options[two].options[three].key
            } else if (arr.length === 2) {
              let one = arr[0]
              let two = arr[1]
              actName = this.chatHead.endOptionsUl[one].options[two].name
              finishKey = this.chatHead.endOptionsUl[one].options[two].key
            } else {
              let one = arr[0]
              actName = this.chatHead.endOptionsUl[one].name
              finishKey = this.chatHead.endOptionsUl[one].key
            }
            let data = {
              _id: this.currEmailSession._id,
              finishReason: actName,
              finishKey: finishKey
            }
            finishSession(this.$store, data).then(() => {
              this.$router.replace({path: '/index/email'})
            })
            this.chatHead.endSessionActive = []
            this.batchFinish.endSessionFlag = false
            this.chatHead.dialogTableVisible = false
          }
        } else {
          this.chatHead.endSessionFlag = false
          this.chatHead.dialogTableVisible = false
        }
      },
      changeEndSessionFlag (value) {
        this.chatHead.endSessionFlag = value
      },
      initMarkData () {
        if (!isEmpty(this.currEmailSession.mailMarks)) {
          this.chatHead.starStateChecked = true
        }
      },
      switchReadState (checked) {
        this.chatHead.popover2Visible = false
        let data = {
          sessionId: this.currEmailSession._id,
          readMark: checked ? 'unread' : 'read'
        }
        doEmailMark(this.$store, data).then(() => {
          this.chatHead.readStateChecked = checked
        })
      },
      switchStarState (checked) {
        this.chatHead.popover2Visible = false
        let data = {
          sessionId: this.currEmailSession._id,
          starMark: checked ? 'mark' : 'unmark'
        }
        doEmailMark(this.$store, data).then(() => {
          this.chatHead.starStateChecked = checked
        })
      },
      showRedirectPopup () {
        this.popoLoading = true
        this.popover1Search = ''
        this.$store.dispatch('getEmailOnlineAgent', {toPeer: this.currEmailSession.toPeer}).then((res) => {
          this.chatHead.onlineAgents = deepClone(res)
          this.openPop1.index = -1
          this.openPop1.isOn = false
          this.pop1Clone = deepClone(res)
          this.popoLoading = false
        })
      },
      transferAgent (toUser, toUserName) {
        let data = {
          _id: this.currEmailSession._id,
          toUser: toUser,
          toUserName: toUserName,
          fromEmail: this.currEmailSession.from.addr,
          cust_status: this.$store.state.email.current.email_todo.currentCustomer.status || ''
        }
        let self = this
        redirectMailSession(this.$store, data).then((success) => {
          this.chatHead.popover1Visible = false
          if (success) {
            self.$router.replace({path: '/index/email'})
          }
        })
      },

      // 快捷回复相关
      removeQuickReplyItem (item) {
        var index = this.editCustomQuickReply.rdata.indexOf(item)
        this.editCustomQuickReply.rdata.splice(index, 1)
      },
      addQuickReplyItem () {
        this.editCustomQuickReply.rdata.push({value: ''})
        this.$nextTick(function () {
          if (document.getElementsByClassName('quick_replay_box').length) {
            document.getElementsByClassName('quick_replay_box')[0].scrollTop = document.getElementsByClassName('quickreplay_box')[0].scrollHeight
          }
        })
      },
      showQuickReplyEditInput () {
        this.editCustomQuickReply = deepClone(this.customQuickReply)
        this.oldCustomQuickReply = deepClone(this.customQuickReply)
        this.custQuickReplyEditIsShow = false
        this.$nextTick(function () {
          if (document.getElementsByClassName('quick_replay_box').length) {
            document.getElementsByClassName('quick_replay_box')[0].scrollTop = document.getElementsByClassName('quickreplay_box')[0].scrollHeight
          }
        })
      },
      custQuickReplySubmit (flag) {
        let cloneData = deepClone(this.editCustomQuickReply) // 自定义快捷回复新设置数据克隆（经过数据验证之后获取不到新设置的数据）
        if (this.$refs.editCustomQuickReply.fields.length) {
          this.$refs.editCustomQuickReply.validate((valid) => {
            if (valid) {
              let vuexData = {}
              if (flag) {
                let arr = []
                this.editCustomQuickReply.rdata.forEach((item) => {
                  arr.push(item.value)
                })
                let data = {
                  quickreplys: arr,
                  moduleType: 'email'
                }
                this.$store.dispatch('saveQuickReply', data)
                vuexData = cloneData
              } else {
                vuexData = deepClone(this.oldCustomQuickReply)
              }
              this.$store.commit(types.SET_CUST_QUICK_REPLY, vuexData)
              this.custQuickReplyEditIsShow = true
            }
          })
        } else {
          if (flag) {
            let arr = []
            let data = {
              quickreplys: arr,
              moduleType: 'email'
            }
            this.$store.dispatch('saveQuickReply', data)
            this.$store.commit(types.SET_CUST_QUICK_REPLY, cloneData)
          }
          this.custQuickReplyEditIsShow = true
        }
      },
      quickSendMsg (data) {
        this.inboxEmail.content = data
        this.replyEmailInbox()
      },
      quickCopyMsg (data) {
        let str = this.inboxEmail.content
        this.inboxEmail.content = str + data
      },
      itemToggle (index) {
        if (index === this.open.index) {
          this.open.isOn = !this.open.isOn
        } else {
          this.open.index = index
          this.open.isOn = true
        }
        if (!this.sysQuickReply[index].children) {
          let data = {
            id: this.sysQuickReply[index]._id,
            moduleType: 'email',
            index: index
          }
          this.$store.dispatch('queryEmailTagsById', data)
        }
      },
      editRemark (event) {
        if (this.remarkClone !== event.target.value) {
          this.currEmailSession.remark = event.target.value
          let data = {
            _id: this.currEmailSession._id,
            remark: event.target.value
          }
          this.$store.dispatch('saveRemark', data).then(() => {
            this.remarkClone = event.target.value
          })
        }
      },
      tabChange (tab) {
        if (tab.name === 'quickreply') {
          if (!this.sysQuickReply.length) {
            doQuerySysQuickReplyList(this.$store, {'moduleType': 'email'})
          }
          if (!this.customQuickReply.rdata) {
            doQueryCustomQuickReplyList(this.$store, {'moduleType': 'email'})
          }
        }
      },

      // 工具类
      getChatShortTime (item) {
        let agentInfo = ''
        if (item.agent) {
          if (this.sessionUserId === item.agent) {
            agentInfo = '我'
          } else {
            agentInfo = getCache('agents', item.agent).displayName
          }
        }
        return item.createTime.substring(5, 19) + ' ' + agentInfo

//        return getDateTimeByStr(time, 'time')
      },
      getTimeLength (lastEmailTimestamp, createTimeStamp) {
        return formatTimestamp(lastEmailTimestamp - createTimeStamp)
      },
      changeScroll () {
        this.$nextTick(function () {
          if (this.$route.path.split('/')[3] === 'email_todo' && document.getElementsByClassName('email_chat_msg').length) {
            document.getElementsByClassName('email_chat_msg')[0].scrollTop = document.getElementsByClassName('email_msg_inner')[0].scrollHeight
          }
        })
      },
      chatMsgChange () {
        let obj = document.getElementsByClassName('attach_and_copy_box')
        let obj1 = document.getElementsByClassName('chatMsgCon')
        if (obj.length) {
          obj1[0].style.height = '-webkit-calc(100vh - 186px - 162px - ' + obj[0].offsetHeight + 'px)'
        } else {
          obj1[0].style.height = '-webkit-calc(100vh - 186px - 162px)'
        }
      },
      changeCopyBoxShow (flag) {
        if (flag) {
          this.inboxEmail.copyBoxShow = true
        } else {
          this.inboxEmail.copyBoxShow = false
        }
        this.$nextTick(function () {
          this.chatMsgChange()
        })
      },
      im_icon (chatMsg) {
        let data = ''
        if (chatMsg.agent) {
          let agentInfo = getCache('agents', chatMsg.agent)
          if (agentInfo.im_icon) {
            data = agentInfo.im_icon + '?imageView2/1/w/50/h/50'
          }
        }
        return data
      }
    },
    beforeMount () {
      this.fetchData()
    },
    mounted () {
      if (this.tabType === 'email_todo') {
        let btn = document.getElementsByClassName('ql-emailUpLoadFile')[0]
        let name = btn.className
        btn.className = name + ' iconfont icon-tupianicon'
        btn.id = 'uploadImageFile'
        this.initUploadEmailFile()
        this.initUploadImageFile()
        this.changeScroll()
      }
//      let quillEditor = this.$refs.myTextEditor.quillEditor
//      let quillToolbar = quillEditor.getModule('toolbar')
//      quillToolbar.addHandler('image', function () {
//        console.log('上传文件')
//        // todo 弹出一个文件选择框,让客户选择文件,选择好后,再插入<img>标签到编辑框里去
//      })
//      quillToolbar.addHandler('link', function () {
//        console.log('编辑超链')
//        // todo 弹出一个文本输入框,让客户填写链接,确定后再插入<a>标签到编辑框里去
//
//      })
    }
  }
  function replyEmailInbox (store, data) {
    return store.dispatch('replyInbox', data)
  }
  function forwardEmailInbox (store, data) {
    return store.dispatch('forwardEmail', data)
  }
  function getChannelDic (store) {
    return store.dispatch('getCache', {type: 'channelDic'})
  }
  function finishSession (store, data) {
    return store.dispatch('finishEmailSession', data)
  }
  function defineEmailCategory (store, data) {
    return store.dispatch('defineMailCategory', data)
  }
  function doEmailMark (store, data) {
    return store.dispatch('doMailMark', data)
  }
  function redirectMailSession (store, data) {
    return store.dispatch('redirectEmailSession', data)
  }
  function doQuerySysQuickReplyList (store, data) {
    return store.dispatch('queryEmailAllTagsForEmail', data)
  }
  function doQueryCustomQuickReplyList (store, data) {
    return store.dispatch('getQuickReplyListForEmail', data)
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
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
    border-bottom 1px solid $c-border1
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
      color $cf-gray5
    .email_mark
      color $cf-gray3
      .el-icon-arrow-down
        color $cf-gray5
  .avatar
    position absolute
    left 0
  .title
    margin-left 10px
    .chat_title_time
      color $cf-gray4
  .tableVisibleBtn
    display inline-block
  .tableVisibleBtnBox
    clear both
    text-align center
    padding-top 10px
  .dic_item_desc_radio
    position absolute
    display inline-block
    width 100%
    height 100%
    opacity 0
    cursor pointer
  .email_chat_msg
    padding 25px 14px 0
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
      border 1px solid #000
    .chat_content
      p
        color #000
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
    background #cce5ff
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
    border-right 6px solid #cce5ff
    content ' '
    position absolute
    width 0
    height 0
    left -9px
    top 10px
    border-radius 1px
    transform rotate(95deg)
    border 5px solid #cce5ff
    border-color #cce5ff transparent transparent #cce5ff
  .chat_user_info_out
    position absolute
    right 0
    top -2px
    .chat_time
      position absolute
      white-space nowrap
      right 75px
      top -20px
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
      height calc( 100vh - 186px - 162px)
      height -webkit-calc( 100vh - 186px - 162px)
      height -moz-calc( 100vh - 186px - 162px)
  .email_all_conbox
    .email_chat_msg
      height calc( 100vh - 186px)
      height -webkit-calc( 100vh - 186px)
      height -moz-calc( 100vh - 186px)
  .chat_info
    padding-top 2px
    .chat_info_todo
    .chat_info_all
      padding 0 14px
      box-sizing border-box
      height calc(100vh - 186px)
      height -webkit-calc(100vh - 186px)
      height -moz-calc(100vh - 186px)
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
    margin-bottom 30px
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
    max-height -webkit-calc(100vh - 218px + 28px)
    max-height -moz-calc(100vh - 218px + 28px)
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
      max-height -webkit-calc( 100vh - 226px)
      max-height -moz-calc( 100vh - 226px)
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
    color #000
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
    max-height calc(100vh - 400px)
    max-height -webkit-calc(100vh - 400px)
    max-height -moz-calc(100vh - 400px)
    overflow-y auto
    padding-top 20px
  .email_title
    font-size 22px
    float left
    width 100%
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
    width 160px
    border-radius 2px
    border 1px solid #D3DCE6
    padding 10px
    z-index 2000
    font-size 12px
    box-shadow 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
    left -82px
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
  .email_title_con
    color $cf-gray1
  .email_details_info_li
    color $cf-gray3
  .email_detail_content
    color $cf-gray1
</style>
