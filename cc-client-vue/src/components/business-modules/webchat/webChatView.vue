<template>
  <el-row :class="tabType + '_conbox'">
    <el-col :span="qualityCheck ? 24 : 16">
      <div class="chat_msg_box">
        <div v-if="!qualityCheck" class="chat_head">
          <el-row>
            <el-col :span="24">
              <div class="chat_top">
                <div class="chat_top_head clearBoth">
                   <!--<customer-avatar-->
                  <!--class="avatar client_msg"-->
                  <!--:status="'status0'"-->
                  <!--&gt;</customer-avatar>-->
                  <div class="title">
                    <div class="chat_title">{{chatInformation.sName}}<span>{{chatMethod}}</span>
                      <span class="chat_title_time">{{chatInformation.createTime}}</span></div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="chat_msg_con">
          <el-row>
            <el-col :span="24">
              <div class="chatMsgCon">
                <div class="chat_msg chat_msg1 font14" v-on:scroll="getChatHistoryScroll($event)">
                  <div class="msg_inner msg_inner1">
                    <!--获取当前会话-->
                    <div class="chatUserMsg">
                      <div v-for="chatMsg in contectHistoryList" class="msg_li clearBoth" :class="chatMsg.type === 'system' || chatMsg.type == 'imcsr' ? 'system_li' : ''">
                        <div class="chat_item in clearBoth" v-if="chatMsg.type == 'in' || (chatMsg.type === '' && chatMsg.platform === 'weixin')">
                          <div v-if="chatMsg.contentType === 'text'" class="chat_text_con">
                            <div class="chat_user_info">
                              <customer-avatar
                                class="client_msg"
                                :size="20"
                                :status="displayName.row.status"
                              ></customer-avatar>
                              <div class="chat_time">{{chatTime(chatMsg)}}</div>
                            </div>
                            <div class="chat_content do_search" >
                              <div class="chat_content_arrow"></div>
                              <div class="chat_message_con">
                                <div class="chat_message_con_text" v-html="chatMsg.message"></div>
                              </div>
                              <span class="img_action_kmsearch iconfont icon-sousuo" @click.stop="openPopSearch(true,$event)"></span>
                            </div>
                          </div>
                          <div v-if="chatMsg.contentType === 'image'">
                            <div class="chat_user_info">
                              <customer-avatar
                                class="client_msg"
                                :size="20"
                                :status="displayName.row.status"
                              ></customer-avatar>
                              <div class="chat_time">{{chatTime(chatMsg)}}</div>
                            </div>
                            <div class="chat_content image">
                              <div class="chat_content_arrow"></div>
                              <img class="chat_img" :src="chatMsg.message" @click.stop="shwoBigImage(chatMsg.message)"/>
                            </div>
                          </div>
                          <div v-if="chatMsg.contentType === 'file'">
                            <div class="chat_user_info">
                              <customer-avatar
                                class="client_msg"
                                :size="20"
                                :status="displayName.row.status"
                              ></customer-avatar>
                              <div class="chat_time">{{chatTime(chatMsg)}}</div>
                            </div>
                            <div class="chat_content do_search" >
                              <div class="chat_content_arrow"></div>
                              <!-- 文件的url路径未知 -->
                              <a :href="chatMsg.message" target="_blank">{{chatMsg.fileName}}</a>
                              <!--<span class="img_action_kmsearch iconfont icon-sousuo" @click.stop="openPopSearch(true,$event)"></span>-->
                            </div>
                          </div>
                          <div v-if="chatMsg.contentType === 'voice'">
                            <div class="chat_text_con clearBoth" >
                              <div class="chat_user_info">
                                <customer-avatar
                                  class="client_msg"
                                  :size="20"
                                  :status="displayName.row.status"
                                ></customer-avatar>
                                <div class="chat_time">{{chatTime(chatMsg)}}</div>
                              </div>
                              <div class="chat_content voice_content" @click.stop="changeVoicePlay(chatMsg, 'user')">
                                <!--<div class="voice_content_cover" @click="playVoice($event)"></div>-->
                                <div class="chat_content_arrow"></div>
                                <div class="chat_message_con">
                                  <webchat-chat-voice :chatMsg="chatMsg" :chatFlag="'user'"></webchat-chat-voice>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="chat_item out clearBoth"  v-if=" chatMsg.type == 'out'">
                          <div v-if="chatMsg.contentType === 'text'">
                            <div class="chat_content">
                              <div class="send_status failure iconfont icon-tishi" v-if="chatMsg.sendStatus=='fail'"></div>
                              <div class="send_status process" v-if="chatMsg.sendStatus=='sending'"></div>
                              <div class="chat_content_arrow_out"></div>
                              <pre class="chat_content_text" v-html="chatMsg.message"></pre>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img" :class="{robot: im_icon(chatMsg) === 'robot'}">
                                <img v-if="im_icon(chatMsg) && im_icon(chatMsg) != 'robot'" :src="im_icon(chatMsg)" alt=""/>
                                <i v-if="im_icon(chatMsg) === 'robot'" class="iconfont icon-jiqirentouxiang"></i>
                              </div>
                              <div class="chat_time">{{chatTime(chatMsg)}}</div>
                            </div>
                          </div>
                          <div v-if="chatMsg.contentType === 'image'">
                            <div class="chat_content image">
                              <div class="chat_content_arrow_out"></div>
                              <img class="chat_img" :src="chatMsg.message" @click.stop="shwoBigImage(chatMsg.message)"/>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img" :class="{robot: im_icon(chatMsg) === 'robot'}">
                                <img v-if="im_icon(chatMsg) && im_icon(chatMsg) != 'robot'" :src="im_icon(chatMsg)" alt=""/>
                                <i v-if="im_icon(chatMsg) === 'robot'" class="iconfont icon-jiqirentouxiang"></i>
                              </div>
                              <div class="chat_time">{{chatTime(chatMsg)}}</div>
                            </div>
                          </div>
                          <div v-if="chatMsg.contentType === 'file'">
                            <div class="chat_content">
                              <div class="chat_content_arrow_out"></div>
                              <!-- 文件的url路径未知 -->
                              <a :href="chatMsg.message" target="_blank">{{chatMsg.fileName}}</a>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img" :class="{robot: im_icon(chatMsg) === 'robot'}">
                                <img v-if="im_icon(chatMsg) && im_icon(chatMsg) != 'robot'" :src="im_icon(chatMsg)" alt=""/>
                                <i v-if="im_icon(chatMsg) === 'robot'" class="iconfont icon-jiqirentouxiang"></i>
                              </div>
                              <div class="chat_time">{{chatTime(chatMsg)}}</div>
                            </div>
                          </div>
                          <div v-if="chatMsg.contentType === 'iframe'">
                            <div class="chat_content">
                              <div class="chat_content_arrow_out"></div>
                              <div style="max-width: 100%;max-height: 300px;overflow: auto">
                                <iframe :src="chatMsg.message" frameborder="0" :width="chatMsg.iframeWidth" :height="chatMsg.iframeHeight"></iframe>
                              </div>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img" :class="{robot: im_icon(chatMsg) === 'robot'}">
                                <img v-if="im_icon(chatMsg) && im_icon(chatMsg) != 'robot'" :src="im_icon(chatMsg)" alt=""/>
                                <i v-if="im_icon(chatMsg) === 'robot'" class="iconfont icon-jiqirentouxiang"></i>
                              </div>
                              <div class="chat_time">{{chatTime(chatMsg)}}</div>
                            </div>
                          </div>
                        </div>
                        <div class="chat_item system clearBoth"  v-if=" chatMsg.type == 'system'">
                          <div class="chat_content">{{chatMsg.message}}</div>
                        </div>
                        <div class="chat_item system clearBoth" v-if=" chatMsg.type == 'imcsr'">
                          <div class="chat_content">{{chatMsg.message}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <big-image :imgInfo="bigImage" @closeImageDialog="closeBigImage"></big-image>
    </el-col>
    <el-col :span="8" v-if="showFlag">
      <div class="chat_info_box" style="margin-top: 10px">
        <div class="chat_info">
          <el-tabs class="chat_info_todo" :active-name="activeName">
            <el-tab-pane class="" name="otherInfo">
              <div>
                <!--基本信息-->
                <h3 class="titleInfo" @click="switchInfo('base')">
                  <span :class="{'el-icon-plus': !baseInfo, 'el-icon-minus': baseInfo}"></span>
                  {{$t('webchat.basicInfo')}}</h3>
                <div v-if="baseInfo" class="chat_info_all">
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.assistAgent')}}:</span>
                    <span v-if="!chatInformation.assistAgent" class="chat_info_li_con">{{$t('webchat.nothing')}}</span>
                    <span v-if="chatInformation.assistAgent" class="chat_info_li_con">{{chatInformation.invitedUserName}}</span>
                  </div>
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.invitationStatus')}}:</span>
                    <span v-if="chatInformation.inviteUserStatus && chatInformation.inviteUserStatus === 'accept'" class="chat_info_li_con">{{$t('webchat.accecptInvite')}}</span>
                    <span v-if="chatInformation.inviteUserStatus && chatInformation.inviteUserStatus === 'undeal'" class="chat_info_li_con">{{$t('webchat.noAccecptInvite')}}</span>
                    <span v-if="!chatInformation.inviteUserStatus" class="chat_info_li_con">{{$t('webchat.noInvite')}}</span>
                  </div>
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.are')}}:</span>
                    <span class="chat_info_li_con">{{chatInformation.area}}</span>
                  </div>
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.ipAdress')}}:</span>
                    <span class="chat_info_li_con">{{chatInformation.ip}}</span>
                  </div>
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.seoKeywords')}}:</span>
                    <span class="chat_info_li_con">{{chatInformation.seoKeywords}}</span>
                  </div>
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('public.remark')}}:</span>
                    <span class="chat_info_li_con">{{displayName.user.remark}}</span>
                  </div>
                  <!--<div class="chat_info_remark chat_info_li">-->
                    <!--<span class="chat_info_li_title">{{$t('public.remark')}}</span>-->
                    <!--<textarea class="chat_info_li_remarks" rows="3" :placeholder="$t('public.pleaseEnter')" v-on:blur="editRemark($event)">{{displayName.user.remark}}</textarea>-->
                  <!--</div>-->
                  <ul class="chat_info_ul">
                    <li class="clearBoth chat_info_li"><i>{{$t('webchat.msgNum')}}：</i><span class="chat_info_li_con" :title="chatInformation.totalMsgCount">{{chatInformation.totalMsgCount}}</span></li>
                    <li class="clearBoth chat_info_li"><i>{{$t('webchat.endType')}}：</i><span class="chat_info_li_con" :title="chatInformation.finishReason">{{chatInformation.finishReason}}</span></li>
                    <li class="clearBoth chat_info_li investigate_box">
                      <i>{{$t('webchat.evalution')}}：</i>
                      <span class="investigate_box">
                  <span class="chat_info_li_con" :title="chatInformation.investigate.value" @mouseenter="investigateShow(true)">{{chatInformation.investigate.value}}</span>
                </span>
                      <ul v-if="investigate" class="investigate_con clearBoth" @mouseleave="investigateShow()" @mouseenter="investigateShow(true)">
                        <li class="clearBoth">
                          <i>{{$t('webchat.evalution')}}：</i>
                          <span>{{chatInformation.investigate.value}}</span>
                        </li>
                        <li class="clearBoth">
                          <i>{{$t('webchat.evalutionLabel')}}：</i>
                          <span v-if="chatInformation.investigate.label.length > 0">{{chatInformation.investigate.label}}</span>
                        </li>
                        <li class="clearBoth">
                          <i>{{$t('webchat.evalutionContent')}}：</i>
                          <span class="investigate_content">{{chatInformation.investigate.content}}</span>
                        </li>
                      </ul>
                    </li>
                    <li class="clearBoth chat_info_li"><i>{{$t('webchat.fromSkillGroup')}}：</i><span class="chat_info_li_con" :title="chatInformation.queueName">{{chatInformation.queueName}}</span></li>
                    <li class="clearBoth chat_info_li"><i>{{$t('webchat.fromService')}}：</i><span class="chat_info_li_con" :title="agentName">{{agentName}}</span></li>
                  </ul>
                  <ul class="chat_info_ul">
                    <li class="clearBoth chat_info_li"><i>{{$t('webchat.beginDate')}}：</i><span class="chat_info_li_con" :title="chatInformation.beginDate">{{chatInformation.beginDate}}</span></li>
                    <li class="clearBoth chat_info_li"><i>{{$t('webchat.artificialStartTime')}}：</i><span class="chat_info_li_con" :title="chatInformation.manualTime">{{chatInformation.manualTime}}</span></li>
                    <li class="clearBoth chat_info_li"><i>{{$t('webchat.firstResponseDate')}}：</i><span class="chat_info_li_con" :title="chatInformation.firstReplyTime">{{chatInformation.firstReplyTime}}</span></li>
                    <li class="clearBoth chat_info_li"><i>{{$t('webchat.conversationEdnTime')}}：</i><span class="chat_info_li_con" :title="chatInformation.endTime">{{chatInformation.endTime}}</span></li>
                    <li class="clearBoth chat_info_li"><i>{{$t('webchat.dialogueDuration')}}：</i><span class="chat_info_li_con" :title="chatInformation.duration">{{chatInformation.duration}}</span></li>
                  </ul>
                </div>
                <div class="chat_auxiliary_info">
                  <h3 class="titleInfo" @click="switchInfo('track')">
                    <span :class="{'el-icon-plus': !trackInfo, 'el-icon-minus': trackInfo}"></span>
                    浏览轨迹({{ubaInfoList.count ? ubaInfoList.count : 0}}个)
                  </h3>
                  <div v-if="trackInfo"  id="timeScroll" class="time_line_warp" v-on:scroll="timeScroll($event)">
                    <ul>
                      <webChatTimeLine :ubaInfoListPages="ubaInfoList.pages"></webChatTimeLine>
                    </ul>
                  </div>
                </div>
                <div class="chat_auxiliary_info">
                  <h3 class="titleInfo"  @click="switchInfo('visit')">
                    <span :class="{'el-icon-plus': !visitInfo, 'el-icon-minus': visitInfo}"></span>
                    {{$t('webchat.accessInformation')}}({{visitInfoList.length}}{{$t('webchat.communication')}})
                  </h3>
                  <!--<div v-if="visitInfo" class="chat_auxiliary_box" v-for="auxiliary in visitInfoList">-->
                    <!--<span class="chat_auxiliary_title">{{auxiliary.time}}</span>-->
                    <!--<a :href="auxiliary.fromUrl" class="chat_auxiliary_from" target="_blank">{{auxiliary.urlTitle}}</a>-->
                  <!--</div>-->
                  <div v-if="visitInfo" class="chat_auxiliary_box" v-for="auxiliary in visitInfoList">
                    <span class="chat_auxiliary_title">{{auxiliary.time}}</span>
                    <a v-if="auxiliary.platform === 'pc'" :href="auxiliary.fromUrl" class="chat_auxiliary_from" target="_blank">
                      <span v-if="auxiliary.urlTitle">{{auxiliary.urlTitle}}</span>
                      <span v-else>{{$t('webchat.WebConsultation')}}</span>
                    </a>
                    <span v-if="auxiliary.platform === 'wap'" class="chat_auxiliary_from">{{$t('webchat.WapConsultation')}}</span>
                    <span v-if="auxiliary.platform === 'sdk'" class="chat_auxiliary_from">{{$t('webchat.SdkConsultation')}}</span>
                    <span v-if="auxiliary.platform === 'weixin'" class="chat_auxiliary_from">{{$t('webchat.WeiXinConsultation')}}</span>
                    <span v-if="auxiliary.platform === 'weibo'" class="chat_auxiliary_from">{{$t('webchat.WeiboConsultation')}}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script type="text/javascript">
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import { deepClone, millsToDate, getFormatDateTime, getCache } from '../../../utils/m7Utils'
  import * as types from '../../../store/mutation-types.js'
  import WebchatTimer from 'components/business-modules/webchat/WebchatTimers'
  import BigImage from 'components/public-modules/bigImage/BigImage'
  import PopDragSearch from 'components/public-modules/popups/PopDragSearch'
  import webChatTimeLine from '../../ui-modules/timeLine/webChatTimeLine'
  import WebchatChatVoice from './WebchatChatVoice.vue'
  export default {
    name: 'webchatview',
    props: {
      chatInformationId: String,
      showFlag: {
        type: Boolean,
        default: false
      },
      qualityCheck: {
        type: Boolean,
        default: false
      },
      sessionId: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        status: '',
        displayName: {
          user: {},
          row: {}
        },
        chatInformation: {},
        contectHistoryList: [],
        tabType: '',
        customerId: '',
        activeName: 'otherInfo',
        webchatData: {},
        visitInfoList: [],
        bigImage: {
          bigImageShow: false,
          url: ''
        },
        iconFont: '',
        remarkClone: '',
        webchatDataClone: {},
        ubaInfoList: [],
        investigate: false,
        baseInfo: true,
        trackInfo: true,
        visitInfo: false,
        currentPage: 1,
        finishChatScroll: false,
        page: 1,
        ubaSessionId: '' // ubaSessionId 用来确定唯一的用户浏览轨迹
      }
    },
    methods: {
      getChatHistoryScroll (event) {
        let height = document.getElementsByClassName('msg_inner1')[0].scrollHeight
        if (event.target.scrollTop < 1 && !this.finishChatScroll) {
          this.$store.dispatch('queryUserContactHistory', {page: ++this.page, sessionId: this.chatInformationId, limit: 10}).then((resp) => {
            if (resp.list.length) {
              this.contectHistoryList = (resp.list).concat(this.contectHistoryList)
              event.target.scrollTop = height
            } else {
              this.finishChatScroll = true
            }
          })
        }
      },
      trim (data) {
        let _str = data
        return _str.replace(/(^\s*)|(\s*$)/g, '')
      },
//      编辑备注
      editRemark (event) {
        if (this.remarkClone !== event.target.value) {
          let remark = {
            accessId: this.webchatData.accessId,
            sid: this.webchatData._id,
            content: event.target.value
          }
          this.$store.dispatch('updateWebchatSessionRemark', remark).then(() => {
            this.remarkClone = event.target.value
//            this.displayName.user.remark = event.target.value
          })
        }
      },
      fetchData () {
        this.$store.dispatch('queryChatInformationById', {_id: this.chatInformationId, queryHistory: true}).then((resp) => {
          let obj1 = resp.chatSession
//          this.chatInformation = obj1
          this.chatInformation = deepClone(obj1)
          let obj = deepClone(obj1)
//          if (!obj.leavemsg) {
//            obj.leavemsg = ''
//          }
          if (obj.firstReplyTime) {
            obj.firstReplyTime = getFormatDateTime(new Date(obj.firstReplyTime)).split(' ')[1]
          }
          if (obj.beginTime) {
            let tempD = new Date(obj.beginTime)
            obj.beginDate = tempD.getFullYear() + '-' + (tempD.getMonth() + 1) + '-' + tempD.getDate()
            obj.beginTime = obj.beginTime.split(' ')[1]
          }
          if (obj.agentFirstReplyTime) {
            obj.agentFirstReplyTime = getFormatDateTime(new Date(obj.agentFirstReplyTime)).split(' ')[1]
          }
          if (obj.firstReplyTime) {
            obj.firstReplyTime = obj.agentFirstReplyTime
          }
          if (obj.endTime) {
            obj.endTime = getFormatDateTime(new Date(obj.endTime))
            if (obj.endTime.split(' ')[0] === obj.beginTime.split(' ')[0]) {
              obj.endTime = obj.endTime.split(' ')[1]
            }
          }
          let desc = ''
          if (obj.lastTimeStamp) {
            let descTime = new Date()
            descTime.setTime(obj.lastTimeStamp)
            desc = getFormatDateTime(descTime)
          }
          if (desc && obj.manualTime) {
            obj.duration = millsToDate(new Date(desc).getTime() - new Date(obj.manualTime).getTime())
          }
          if (obj.manualTime) {
            obj.manualTime = getFormatDateTime(new Date(obj.manualTime)).split(' ')[1]
          }
          this.chatInformation = obj
          this.visitInfoList = resp.historyList
          this.$store.dispatch('popupWebchatById', {_id: this.chatInformationId, sid: this.chatInformation.sid}).then((resp) => {
            this.status = resp.row.status
            this.displayName = resp
            this.chatInformation.sName = resp.row.name
            // 载入用户的浏览轨迹   需要
            this.ubaSessionId = ''
            if (this.chatInformation.ubaInfo) {
              this.$store.dispatch('loadUbaInfo', {_id: '', ubaSessionId: this.chatInformation.ubaInfo.ubaSessionId, ubaPageId: this.chatInformation.ubaInfo.ubaPageId, ubaHisttory: true}).then((sessionId) => {
                if (sessionId) {
                  this.ubaSessionId = sessionId
                  this.ubaInfoList = this.$store.state.webchat.current.webchat_todo.ubaInfoList[sessionId]
                }
              })
            }
          })
        })
        this.$store.dispatch('queryUserContactHistory', {page: 1, sessionId: this.chatInformationId, limit: 10}).then((resp) => {
          this.contectHistoryList = resp.list
          let that = this
          window.setTimeout(function () {
            that.changeChatMsgScroll()
          }, 200)
        })
      },
      scrollToBottom (scrollClassName, warpClassName) {
        this.$nextTick(function () {
          document.getElementsByClassName(scrollClassName)[0].scrollTop = document.getElementsByClassName(warpClassName)[0].scrollHeight
        })
      },
      closeBigImage () {
        this.bigImage.bigImageShow = false
        this.bigImage.url = ''
      },
      shwoBigImage (data) {
        let msg = {
          show: true,
          url: data
        }
        this.$store.commit(types.SET_BIGIMG, msg)
      },
      changeChatMsgScroll () {
        this.$nextTick(function () {
          this.scrollToBottom('chat_msg1', 'msg_inner1')
        })
      },
//      获取坐席头像
      im_icon (obj) {
        let data = ''
        if (obj.im_icon) {
          data = obj.im_icon + '?imageView2/1/w/50/h/50'
        } else {
          if (obj.user && obj.user !== 'system' && obj.user !== 'robot') {
            let agent = getCache('agents', obj.user)
            if (agent.im_icon) {
              data = agent.im_icon + '?imageView2/1/w/50/h/50'
            } else {
              data = ''
            }
          } else if (obj.user === 'robot') {
            data = 'robot'
          }
        }
        return data
      },
      investigateShow (flag) {
        if (flag) {
          this.investigate = true
        } else {
          this.investigate = false
        }
      },
//     格式化时间
      chatTime (item) {
        let timeNew = item.dateTime
        if (item.uidDesc) {
          timeNew += ` ${item.uidDesc}`
        }
        return timeNew
      },
//      语音播放
      changeVoicePlay (chatMsg, flag) {
        if (chatMsg.play) {
          chatMsg.play = false
        } else {
          this.contectHistoryList.forEach(function (item, index) {
            item.play = false
          })
          chatMsg.play = !chatMsg.play
        }
      },
//      加减号
      switchInfo (type) {
        if (type === 'track') {
          if (!this.visitInfo) {
            this.trackInfo = !this.trackInfo
          } else {
            this.trackInfo = !this.trackInfo
            this.visitInfo = !this.visitInfo
          }
        } else if (type === 'base') {
          this.baseInfo = !this.baseInfo
        } else if (type === 'visit') {
          if (!this.trackInfo) {
            this.visitInfo = !this.visitInfo
          } else {
            this.visitInfo = !this.visitInfo
            this.trackInfo = !this.trackInfo
          }
        }
      },
      timeScroll (event) { // 滚动加载更多浏览轨迹 需要
        let nScrollHight = 0
        let nScrollTop = 0
        let nDivHight = event.target.offsetHeight
        nScrollHight = event.target.scrollHeight
        nScrollTop = event.target.scrollTop
        if (nScrollTop + nDivHight >= nScrollHight) {
          this.currentPage += 1
          this.$store.dispatch('loadUbaInfo', {_id: '', ubaSessionId: this.chatInformation.ubaInfo.ubaSessionId, ubaPageId: this.chatInformation.ubaInfo.ubaPageId, ubaHisttory: true, currentPage: this.currentPage}).then((sessionId) => {
            if (sessionId) {
              this.ubaSessionId = sessionId
              this.ubaInfoList = this.$store.state.webchat.current.webchat_todo.ubaInfoList[sessionId]
            }
          })
        }
      }
    },
    watch: {
      chatInformationId () {
        this.finishChatScroll = false
        this.page = 0
        this.fetchData()
      }
//      contectHistoryList (pre, next) {
//        let that = this
//        window.setTimeout(function () {
//          that.changeChatMsgScroll()
//        }, 200)
//      }
    },
    components: {
      CustomerAvatar,
      WebchatTimer,
      BigImage,
      WebchatChatVoice,
      PopDragSearch,
      webChatTimeLine
    },
    computed: {
      agentName () {
        let agents = this.$store.state.session.dicMap.agents
        let current = ''
        for (let i in agents) {
          if (this.displayName.user && agents[i]._id === this.displayName.user.user) {
            current = agents[i].displayName
            break
          }
        }
        return current
      },
//      获取平台来源
      chatMethod () {
        let platform = ''
        if (this.chatInformation.platform === 'pc') {
          platform = this.$t('webchat.platformPc')
        } else if (this.chatInformation.platform === 'wap') {
          platform = this.$t('webchat.platformWap')
        } else if (this.chatInformation.platform === 'sdk') {
          platform = this.$t('webchat.platformApp')
        } else if (this.chatInformation.platform === 'weixin') {
          platform = this.$t('webchat.platformWeixin')
        } else {
          platform = this.$t('webchat.platformOther')
        }
        return platform
      }
    },
    beforeMount () {
      this.fetchData()
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .agentName
    padding-left 10px
  .chat_info_box
    overflow-y hidden
  .chat_info_box .chat_info_label
    display inline-block
  .chat_msg_box
    /*border-right 1px solid #d3d3d3*/
  .active
    background #e8f5fc
  .chat_top
    position relative
    box-sizing border-box
  .chat_top_head
    float left
    max-width 100%
    box-sizing border-box
    position relative
  .chat_transfer
    float right
  .avatar
    position absolute
    left 10px
  .title
    margin-left 10px
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
  .chat_transfer
    .iconfont
      cursor pointer
      font-size 20px
      margin 5px 10px 0
      line-height 30px
      color #ababab
  .chatMsgCon
    border-bottom 1px solid #eeeff3
    border-right 1px solid #eeeff3
    border-top 1px solid #eeeff3
    border-left 1px solid #eeeff3
    margin-left 10px
  .chat_msg
    padding 14px
    box-sizing border-box
    overflow auto
    height calc( 100vh - 320px)
  .webchat_todo_conbox
    .chat_msg
      height calc( 100vh - 190px)
  .webchat_all_conbox
    .chat_msg
      height calc( 100vh - 328px + 97px)
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
      white-space nowrap
      font-size 12px
      color #d0d0d0
      top -30px
      left 70px
  /*.chat_msg.font18*/
  /*.chat_user_info*/
  /*.chat_time*/
  /*left -8px*/
  /*.chat_user_info_out*/
  /*.chat_time*/
  /*right -8px*/
  /*.chat_msg.font20*/
  /*.chat_user_info*/
  /*.chat_time*/
  /*left -14px*/
  /*top 40px*/
  /*.chat_user_info_out*/
  /*.chat_time*/
  /*right -13px*/
  .chat_user_img
    border-radius 50%
    width 40px
    height 40px
    overflow hidden
    background url("../../public-modules/contact-summary/img/agent.png") no-repeat 50% 50%
    background-size 40px auto
    img
      background #fff
      width 100%
  .robot
    background #d9d9d9
    .icon-jiqirentouxiang
      width 40px
      height 40px
      display block
      text-align center
      line-height 40px
      font-size 30px
  .chat_time
    color #9A9A9A
    width auto
    line-height 16px
    text-align center
  .chat_content
    max-width 90%
    padding 10px
    position relative
    margin-left 10px
    margin-top 2px
    border-radius 14px
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
      background url('./img/webchat_send.gif') no-repeat
      background-size 26px 26px
    .send_status.failure
      color red
      text-align center
      line-height 26px
      font-size 24px
    .chat_content_text
      word-break break-all
      white-space normal
      p
        img
          max-width 100%
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
      font-size 12px
      color #d0d0d0
      right 65px
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
      margin 0 5px 0 0
      color #666
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
    padding 0
    width 100%
    .chat_content
      display inline-block
      width auto
      height 26px
      border-radius: 13px
      text-align center
      display inline-block
      padding 0 14px
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
    height 23px
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
    padding-top 2px
    .chat_info_todo
    /*.chat_info_all*/
      overflow auto
      padding 0 5px 0px 10px
      box-sizing border-box
      height calc(100vh - 350px)
      /*overflow-y hidden*/
    .chat_auxiliary_info
      /*padding-bottom 10px*/
      line-height 18px
      h3 + .chat_auxiliary_box
        a
          color #71ccba
  .chat_info_li_title , .chat_auxiliary_title,.chat_info_all i
    color #b8b8b8
    font-style normal
  .chat_info_li_con , .chat_auxiliary_from
    color #999
    float right
  .chat_info_li_remarks
    border none
    resize none
    font-size 12px
    box-sizing border-box
    width 100%
    margin-top 6px
  .el-tree
    border none
  .quickreplay_custome_title
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
  .color
    color #1f2d3d
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
    min-height 40px
    margin-bottom 25px
  .msg_li.system_li
    height 24px
    margin 10px 0 20px
    min-height 24px
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
      height 62px
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
    width 280px
    background #fff
    bors(1px,#eee)
    position absolute
    left 30px
    max-height 200px
    overflow-y auto
    z-index 1
    li
      line-height 26px
      box-sizing border-box
      padding 0 6px
      font-size 12px
    li:hover
      background #eee
    li.active
      background #eee
  .send_msg_textarea
    font-size 12px
  .client_msg
    height 36px
  /*.chat_info_all*/
    /*padding-top 18px*/
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
      max-height calc( 100vh - 226px)
      box-sizing border-box
      overflow auto
      h3
        margin-bottom 10px
        user-select none
  .wxend
    text-align center
    padding 5px
    display block
    z-index 10000
    color #999
  .historyDivied
    color grey
    text-align center
    padding-bottom 15px
  .popover1 .tree,.popover2 .tree
    overflow-y auto
    max-height 200px
    font-size 12px
  .quickreplay_box
    color #a7a7a7
    .el-tree
      .is-leaf
        display none
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
      color #808080
    .chat_info_li
      margin-bottom 4px
      padding-right 4px
      box-sizing border-box
    .chat_info_li:last-child
      margin-bottom 10px
    .chat_info_li.chat_info_li_title
      display inline-block
  /*.chat_info_all*/
    /*
    overflow hidden*/
    h3
      padding 8px 0
  .chat_info_ul
    margin-bottom 10px
    li
      display block
    span
      float right
      display inline-block
      max-width 100%
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
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
  .chat_message_con_text
    word-break break-all
  .button_box
    margin-top 10px
    text-align center
  .prompt
    text-align center
    color #989898
    font-size 12px
    padding 3px 0
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
  .uploadingImg
    width 100px
    height 100px
    background url('./img/uploading.gif') no-repeat
    background-size 100px 100px
  .upload_file_box
    height 32px
    width 100px
    .upload_file_title
      width 100%
      text-align center
      line-height 16px
    .upload_file_progress
      background #808080
      overglow hidden
      height 10px
      .file_progress
        background #1ABA9D
        float left
        height 100%
  .popover_btn_box
    display inline-block
  .leavemsg_box
    height 120px
    cursor not-allowed
  .chat_title
    margin-bottom 4px
    font-size 14px
    span
      color #aaa
  .chat_title_time
    margin-left 15px
    font-size 12px
  .webchat_el_form
    height 65px
  .investigate_box
    position relative
  .investigate_con
    position absolute
    bottom 0
    width 100%
    left 0
    background #fff
    box-shadow 0 0 8px #aaa
    padding 8px
    box-sizing border-box
    li
      margin-bottom 6px
    .investigate_content
      float none
      display inline
      word-break break-all
      white-space normal
    span
      color #999
  .audio_img
    height 15px
    margin-right 15px
  .voice_content.chat_content
    position relative
    .chat_message_con
      cursor pointer
  .titleInfo
    cursor pointer
  .msg_li a
    color #fff
  .investigate_con
    span
      float none
      vertical-align bottom
  .el-dialog__wrapper
    z-index 30001 !important
  .VideoTips
    .el-dialog__body
      .tipsword
        text-align: center
        font-size: 16px
        margin: 10px 0
      .tipsbutton
        text-align: center
        padding-top: 15px
    .el-dialog__header
      padding-bottom: 20px
      border-bottom: 1px solid #a1a1a1
      span
        color #a2a2a2
  .colorred
    color red
  .chatUserMsg
    margin-top 15px
  .chat_item.in
    .chat_message_con
      min-height 1em
      min-width 0.5em
  .chat_auxiliary_box
    padding-right 4px
  .fade-enter-active,
  .fade-leave-active
    transition all 0.5s ease
  .fade-enter,
  .fade-leave-active
    opacity 0
  .send_chat_msg_title
    line-height 30px
  .time_line_warp
    max-height 200px
    overflow-y auto
    padding-bottom 10px
  .uba_page_stay
    font-size 12px
    position absolute
    left 25px
    top 15px
  .uba_time_warp
    display block
  .currentUrl_warp
    display block
    padding-left 5px
    word-break break-all
  .time_line_box
    display flex
</style>
