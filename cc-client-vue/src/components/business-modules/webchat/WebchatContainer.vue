<template>
  <el-row :class="tabType + '_conbox'">
    <el-col :span="qualityCheck ? 24 : 16">
      <div class="chat_msg_box">
        <div v-if="!qualityCheck" class="chat_head">
          <el-row>
            <el-col :span="24">
              <div class="chat_top">
                <div class="chat_top_head clearBoth">
                  <!-- <customer-avatar
                  class="avatar client_msg"
                  :status="webchatCustData.status"
                  ></customer-avatar> -->
                  <div class="title">
                    <div class="chat_title">{{webchatData.sName}}<span>{{chatMethod}}</span>
                    <span class="chat_title_time">{{webchatData.createTime}}</span></div>
                  </div>
                </div>
                <div>
                  <el-popover ref="popover1" v-if="tabType === 'webchat_todo'" placement="bottom" width="220" trigger="click">
                    <div class="popover1">
                      <!--<el-input size="small" class="inline-input" :placeholder="$t('public.pleaseEnter')"></el-input>-->
                      <input type="text" :placeholder="$t('public.pleaseEnter')" class="popover1_inpit" v-model.trim="popover1Search" v-on:keyup="searchTree1"/>
                      <div class="prompt" v-if="popoLoading">{{$t('webchat.loading')}}</div>
                      <ul class="tree" v-if="chatHead.onlineAgentsInvite.length && popoLoading === false">
                        <li class="transfer_li_box" v-for="(model, index) in chatHead.onlineAgentsInvite">
                          <div class="box1">
                            <div :class="model.AssignMembers.length ? '' : 'subpadding'" class="transfer_li transfer_group clearBoth" @click.stop="togglePop1(index)" :index="index">
                              <span v-if="model.AssignMembers.length"><i :class="openPop1.index===index&&openPop1.isOn ? 'el-icon-minus' : 'el-icon-plus'"></i></span>
                              <span v-if="model.AssignMembers.length > 0" class="cata-name ellipsis">{{model.DisplayName}}({{model.AssignMembers.length}}{{$t('webchat.onlineNum')}})</span>
                              <span class="transfer_btn iconfont icon-zhuanjie1 transfer_group_btn" @click.stop="transferGroup(model._id, model.Exten)"></span>
                            </div>
                          </div>
                          <ul v-show="openPop1.index === index && openPop1.isOn === true" v-if="model.AssignMembers.length" class="transfer_li_ul">
                            <li class="quickReSys transfer_li clearBoth"
                                v-for="model in model.AssignMembers">
                              <span class="cata-name ellipsis" @click.stop="transferAgent(model._id, model.displayName)">{{model.displayName}}</span>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <div class="prompt" v-if="!chatHead.onlineAgentsInvite.length && popoLoading === false">{{$t('webchat.noData')}}</div>
                    </div>
                  </el-popover>
                  <el-popover ref="popover2" v-if="tabType === 'webchat_todo'" placement="bottom" width="220" trigger="click" v-model.trim="popover2Show">
                    <div class="popover2">
                      <!--<el-input size="small" class="inline-input" :placeholder="$t('public.pleaseEnter')"></el-input>-->
                      <input type="text" :placeholder="$t('public.pleaseEnter')" class="popover2_input" v-model.trim="popover2Search" v-on:keyup="searchTree2"/>
                      <div class="prompt" v-if="popoLoading">{{$t('webchat.loading')}}</div>
                      <ul class="tree" v-if="chatHead.onlineAgentsTransfer.length">
                        <li class="transfer_li_box" v-for="(model, index) in chatHead.onlineAgentsTransfer">
                          <ul v-if="model.AssignMembers.length" class="transfer_li_ul">
                            <li class="quickReSys transfer_li clearfix ellipsis"
                                v-for="modelNew in model.AssignMembers">
                              <span class="cata-name ellipsis" @click.stop="inviteAgent(modelNew._id, modelNew.displayName)">{{modelNew.displayName}}</span>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <div class="prompt" v-if="!chatHead.onlineAgentsTransfer[0].AssignMembers.length && popoLoading === false">{{$t('webchat.noData')}}</div>
                    </div>
                  </el-popover>
                </div>
                <end-session-box v-if="tabType === 'webchat_todo'" :info="chatHead" @endSession="endSessionFun" @changeEndSiFlag="changeEndSessionFlag"></end-session-box>
                <div class="chat_transfer" v-if="!webchatData.showFunBtn && tabType === 'webchat_todo'">
                  <div class="popover_btn_box" v-show="!webchatData.leavemsg">
                    <el-button type="text" class="iconfont icon-zhuanjie1" v-popover:popover1 size="mini" @click="changePopover1"></el-button>
                    <el-button type="text" v-show="webchatData.shwoInviteBtn" class="iconfont icon-yaoqing" v-popover:popover2 size="mini" @click="changePopover2"></el-button>

                    <el-tooltip v-show="!webchatData.shwoInviteBtn" class="item" :content="$t('webchat.kickOutCollaborators')" placement="top">
                      <el-button type="text" class="iconfont icon-tichuxiezuozuoxi" size="mini" @click.stop="changeShwoInviteBtn"></el-button>
                    </el-tooltip>
                  </div>
                  <!--<el-button type="text" class="iconfont icon-tichuxiezuozuoxi" v-show="!webchatData.shwoInviteBtn" size="mini" @click.stop="changeShwoInviteBtn"></el-button>-->
                  <el-button type="text" class="iconfont icon-tuichu" @click.stop="getFinishReason" size="mini"></el-button>
                </div>
                <div class="chat_transfer" v-if="tabType === 'webchat_all' && showGrabIcon">
                  <el-tooltip class="item" :content="$t('webchat.pickUpChat')" placement="right">
                    <el-button type="text" class="iconfont icon-qiangjiehuihua" size="mini" @click.stop="grabConversation"></el-button>
                  </el-tooltip>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="chat_msg_con">
          <el-row>
            <el-col :span="24">
              <div class="chatMsgCon">
                <div class="chat_msg" :class="chatMsgCon.font" v-on:scroll="getChatHistoryScroll($event)">
                  <div class="msg_inner">
                    <div class="wxend">
                      <!-- v-show="chatInfo.showHistoryBtn"-->
                      <a href="javascript:;" class="" @click.stop="getMsgHistory" v-if="chatInfo.showHistoryBtn">{{$t('webchat.viewHistorySession')}}</a>
                      <!--<span>没有更多了</span>-->
                    </div>
                    <div class="chatHistoryMsg" v-if="historyList.length > 0">
                      <div v-for="chatHisMsg in historyList"
                              class="msg_li clearBoth"
                              :class="chatHisMsg.type === 'system' || chatHisMsg.type == 'imcsr' ? 'system_li' : ''">
                        <div class="chat_item in clearBoth" :class="'chat_' + chatHisMsg.when" v-if="chatHisMsg.type === 'in' || (chatHisMsg.type === '' && chatHisMsg.platform === 'weixin')">
                          <div v-if="chatHisMsg.contentType === 'text'">
                            <div class="chat_user_info">
                              <customer-avatar
                                      class="client_msg"
                                      :size="16"
                                      :status="webchatCustData.status"
                                      ></customer-avatar>
                              <div class="chat_time">{{chatTime(chatHisMsg)}}</div>
                            </div>
                            <div class="chat_content do_search">
                              <div class="chat_content_arrow"></div>
                              <div class="chat_message_con">
                                <div class="chat_message_con_text" v-html="chatHisMsg.message"></div>
                              </div>
                              <span v-if="tabType === 'webchat_todo'" class="img_action_kmsearch iconfont icon-sousuo" @click.stop="openPopSearch(true,$event)"></span>
                            </div>
                          </div>
                          <div v-if="chatHisMsg.contentType === 'image'">
                            <div class="chat_user_info">
                              <customer-avatar
                                      class="client_msg"
                                      :size="16"
                                      :status="webchatCustData.status"
                                      ></customer-avatar>
                              <div class="chat_time">{{chatTime(chatHisMsg)}}</div>
                            </div>
                            <div class="chat_content image">
                              <div class="chat_content_arrow"></div>
                              <img class="chat_img" :src="chatHisMsg.message" @click.stop="shwoBigImage(chatHisMsg.message)"/>
                            </div>
                          </div>
                          <div v-if="chatHisMsg.contentType === 'file'">
                            <div class="chat_user_info">
                              <customer-avatar
                                      class="client_msg"
                                      :size="16"
                                      :status="webchatCustData.status"
                                      ></customer-avatar>
                              <div class="chat_time">{{chatTime(chatHisMsg)}}</div>
                            </div>
                            <div class="chat_content do_search">
                              <div class="chat_content_arrow"></div>
                              <!-- 文件的url路径未知 -->
                              <a class="chat_message_con_text" :href="chatHisMsg.message" target="_blank">{{chatHisMsg.fileName}}</a>
                              <span v-if="tabType === 'webchat_todo'" class="img_action_kmsearch iconfont icon-sousuo" @click.stop="openPopSearch(true,$event)"></span>
                            </div>
                          </div>
                          <div v-if="chatHisMsg.contentType === 'voice'">
                            <div class="chat_text_con clearBoth">
                              <div class="chat_user_info">
                                <customer-avatar
                                        class="client_msg"
                                        :size="16"
                                        :status="webchatCustData.status"
                                        ></customer-avatar>
                                <div class="chat_time">{{chatTime(chatHisMsg)}}</div>
                              </div>
                              <div class="chat_content voice_content" @click.stop="changeVoicePlay(chatHisMsg, 'history')">
                                <!--<div class="voice_content_cover" @click="playVoice($event)"></div>-->
                                <div class="chat_content_arrow"></div>
                                <div class="chat_message_con">
                                  <webchat-chat-voice :chatMsg="chatHisMsg" :chatFlag="'history'"></webchat-chat-voice>
                                </div>
                              </div>
                            </div>
                          </div>
                            <!--TODO：视频气泡-->
                          <!-- <div v-if="chatHisMsg.contentType === 'video'">
                            <div class="chat_user_info">
                              <customer-avatar
                                class="client_msg"
                                :status="webchatCustData.status"
                                :size="30"
                              ></customer-avatar>
                              <div class="chat_time">{{chatTime(chatHisMsg.chatHisMsg)}}</div>
                            </div>
                            <div class="chat_content">
                              <div class="chat_content_arrow"></div>
                              <div class="chat_message_con" :class="{colorred:chatHisMsg.videoStatus === 'cancel' || chatHisMsg.videoStatus === 'refuse' || !chatMsg.videoStatus}">
                                  <i class="iconfont icon-shipin" :class="{colorred:chatMsg.videoStatus === 'cancel' || chatMsg.videoStatus === 'refuse' || !chatMsg.videoStatus}"></i>
                                  <span>{{VideoDesc(chatHisMsg.videoStatus)}}</span>
                                  <span v-if="chatHisMsg.videoStatus === 'Hangup'">{{videoTimeCom(chatHisMsg.message)}}</span>
                              </div>
                            </div>
                          </div> -->
                        </div>
                        <div class="chat_item out clearBoth" :class="'chat_' + chatHisMsg.when" v-if="chatHisMsg.type === 'out'">
                          <div v-if="chatHisMsg.contentType === 'text'">
                            <div class="chat_content">
                              <div class="chat_content_arrow_out"></div>
                              <div class="chat_content_text" v-html="chatHisMsg.message"></div>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img" :class="{robot: im_icon(chatHisMsg) === 'robot'}">
                                <img v-if="im_icon(chatHisMsg) && im_icon(chatHisMsg) != 'robot'" :src="im_icon(chatHisMsg)" alt=""/>
                                <i v-if="im_icon(chatHisMsg) === 'robot'" class="iconfont icon-jiqirentouxiang"></i>
                              </div>
                              <div class="chat_time">{{chatTime(chatHisMsg)}}</div>
                            </div>
                          </div>
                          <div v-if="chatHisMsg.contentType === 'image'">
                            <div class="chat_content">
                              <div class="chat_content_arrow_out"></div>
                              <img class="chat_img" :src="chatHisMsg.message" @click.stop="shwoBigImage(chatHisMsg.message)"/>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img image" :class="{robot: im_icon(chatHisMsg) === 'robot'}">
                                <img v-if="im_icon(chatHisMsg) && im_icon(chatHisMsg) != 'robot'" :src="im_icon(chatHisMsg)" alt=""/>
                                <i v-if="im_icon(chatHisMsg) === 'robot'" class="iconfont icon-jiqirentouxiang"></i>
                              </div>
                              <div class="chat_time">{{chatTime(chatHisMsg)}}</div>
                            </div>
                          </div>
                          <div v-if="chatHisMsg.contentType === 'file'">
                            <div class="chat_content">
                              <div class="chat_content_arrow_out"></div>
                              <!-- 文件的url路径未知 -->
                              <a class="chat_content_text" :href="chatHisMsg.message" target="_blank">{{chatHisMsg.fileName}}</a>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img" :class="{robot: im_icon(chatHisMsg) === 'robot'}">
                                <img v-if="im_icon(chatHisMsg) && im_icon(chatHisMsg) != 'robot'" :src="im_icon(chatHisMsg)" alt=""/>
                                <i v-if="im_icon(chatHisMsg) === 'robot'" class="iconfont icon-jiqirentouxiang"></i>
                              </div>
                              <div class="chat_time">{{chatTime(chatHisMsg)}}</div>
                            </div>
                          </div>
                          <div v-if="chatHisMsg.contentType === 'iframe'">
                            <div class="chat_content">
                              <div class="chat_content_arrow_out"></div>
                              <iframe :src="newUrl(chatHisMsg.message)" frameborder="0" :width="(chatHisMsg.iframeWidth <=280 ?chatHisMsg.iframeWidth : 280)" :height="chatHisMsg.iframeHeight"></iframe>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img" :class="{robot: im_icon(chatHisMsg) === 'robot'}">
                                <img v-if="im_icon(chatHisMsg) && im_icon(chatMsg) != 'robot'" :src="im_icon(chatHisMsg)" alt=""/>
                                <i v-if="im_icon(chatHisMsg) === 'robot'" class="iconfont icon-jiqirentouxiang"></i>
                              </div>
                              <div class="chat_time">{{chatTime(chatHisMsg)}}</div>
                            </div>
                          </div>
                            <!--TODO：视频气泡-->
                          <!-- <div v-if="chatHisMsg.contentType === 'video'">
                            <div class="chat_content">
                              <div class="chat_content_arrow_out"></div>
                              <div class="chat_message_con" :class="{colorred:chatHisMsg.videoStatus === 'cancel' || chatHisMsg.videoStatus === 'refuse' || !chatMsg.videoStatus}">
                                <i class="iconfont icon-shipin" :class="{colorred:chatMsg.videoStatus === 'cancel' || chatMsg.videoStatus === 'refuse' || !chatMsg.videoStatus}"></i>
                                <span>{{VideoDesc(chatHisMsg.videoStatus)}}</span>
                                <span v-if="chatHisMsg.videoStatus === 'Hangup'">{{videoTimeCom(chatHisMsg.message)}}</span>
                              </div>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img" >
                                <img v-if="im_icon(chatHisMsg)" :src="im_icon(chatHisMsg)" alt=""/>
                              </div>
                              <div class="chat_time">{{chatTime(chatHisMsg. chatHisMsg)}}</div>
                            </div>
                          </div> -->
                        </div>
                        <div class="chat_item system clearBoth" v-if=" chatHisMsg.type === 'system'">
                          <div class="chat_content">{{chatHisMsg.message}}</div>
                        </div>
                        <div class="chat_item system clearBoth" v-if=" chatHisMsg.type === 'imcsr'">
                          <div class="chat_content chat_message_con_text">{{chatHisMsg.message}}</div>
                        </div>
                      </div>
                      <div class="historyDivied">
                        <span class="divided_text">
                          <span class="divided_line_left"></span>
                          以上是历史会话消息
                          <span class="divided_line_right"></span>
                        </span>

                      </div>
                    </div>
                    <div class="chatUserMsg">
                      <div v-for="chatMsg in webchatUserHistory" class="msg_li clearBoth" :class="chatMsg.type === 'system' || chatMsg.type == 'imcsr' ? 'system_li' : ''">
                        <div class="chat_item in clearBoth" v-if="chatMsg.type == 'in' || (chatMsg.type === '' && chatMsg.platform === 'weixin')">
                          <div v-if="chatMsg.contentType === 'text'" class="chat_text_con">
                            <div class="chat_user_info">
                              <customer-avatar
                                      class="client_msg"
                                      :size="16"
                                      :status="webchatCustData.status"
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
                                      :size="16"
                                      :status="webchatCustData.status"
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
                                      :size="16"
                                      :status="webchatCustData.status"
                                        ></customer-avatar>
                              <div class="chat_time">{{chatTime(chatMsg)}}</div>
                            </div>
                            <div class="chat_content do_search" >
                              <div class="chat_content_arrow"></div>
                              <!-- 文件的url路径未知 -->
                              <a :href="chatMsg.message" target="_blank">{{chatMsg.fileName}}</a>
                              <span class="img_action_kmsearch iconfont icon-sousuo" @click.stop="openPopSearch(true,$event)"></span>
                            </div>
                          </div>
                          <div v-if="chatMsg.contentType === 'voice'">
                            <div class="chat_text_con clearBoth" >
                              <div class="chat_user_info">
                                <customer-avatar
                                        class="client_msg"
                                        :size="16"
                                        :status="webchatCustData.status"
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
                            <!--TODO：视频气泡-->
                          <!-- <div v-if="chatMsg.contentType === 'video'">
                            <div class="chat_user_info">
                              <customer-avatar
                                class="client_msg"
                                :status="webchatCustData.status"
                                :size="30"
                              ></customer-avatar>
                              <div class="chat_time">{{chatTime(chatMsg.chatMsg)}}</div>
                            </div>
                            <div class="chat_content">
                              <div class="chat_content_arrow"></div>
                              <div class="chat_message_con" :class="{colorred:chatMsg.videoStatus === 'cancel' || chatMsg.videoStatus === 'refuse' || !chatMsg.videoStatus}">
                                <i class="iconfont icon-shipin" :class="{colorred:chatMsg.videoStatus === 'cancel' || chatMsg.videoStatus === 'refuse' || !chatMsg.videoStatus}"></i>
                                <span>{{VideoDesc(chatMsg.videoStatus)}}</span>
                                <span v-if="chatMsg.videoStatus === 'Hangup'">{{videoTimeCom(chatMsg.message)}}</span>
                              </div>
                            </div>
                          </div> -->
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
                             <iframe :src="newUrl(chatMsg.message)" frameborder="0" :width="(chatMsg.iframeWidth <=280 ?chatMsg.iframeWidth : 280)" :height="chatMsg.iframeHeight"></iframe>
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
                            <!--TODO：视频气泡-->
                          <!-- <div v-if="chatMsg.contentType === 'video'">
                            <div class="chat_content">
                              <div class="chat_content_arrow_out"></div>
                              <div class="chat_message_con" :class="{colorred:chatMsg.videoStatus === 'cancel' || chatMsg.videoStatus === 'refuse' || !chatMsg.videoStatus}">
                                <i class="iconfont icon-shipin" :class="{colorred:chatMsg.videoStatus === 'cancel' || chatMsg.videoStatus === 'refuse' || !chatMsg.videoStatus}"></i>
                                <span>{{VideoDesc(chatMsg.videoStatus)}}</span>
                                <span v-if="chatMsg.videoStatus === 'Hangup'">{{videoTimeCom(chatMsg.message)}}</span>
                              </div>
                            </div>
                            <div class="chat_user_info_out clearBoth">
                              <div class="chat_user_img" >
                                <img v-if="im_icon(chatMsg)" :src="im_icon(chatMsg)" alt=""/>
                              </div>
                              <div class="chat_time">{{chatTime(chatMsg.chatMsg)}}</div>
                            </div>

                          </div> -->
                        </div>
                        <div class="chat_item system clearBoth"  v-if=" chatMsg.type == 'system'">
                          <div class="chat_content">{{chatMsg.message}}</div>
                        </div>
                        <div class="chat_item system clearBoth" v-if=" chatMsg.type == 'imcsr'">
                          <div class="chat_content">{{chatMsg.message}}</div>
                        </div>
                      </div>
<!--                      <div v-if="uploadImg" >
                        <div class="chat_item out clearBoth">
                          <div class="chat_content image">
                            <div class="chat_content_arrow_out"></div>
                            <div class="uploadingImg"></div>
                          </div>
                          <div class="chat_user_info_out clearBoth">
                            <div class="chat_user_img" >
                              <img v-if="im_icon" :src="im_icon" alt=""/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="uploadFile.flag" >
                        <div class="chat_item out clearBoth">
                          <div class="chat_content">
                            <div class="chat_content_arrow_out"></div>
                            <div class="upload_file_box">
                              <div class="upload_file_title">{{uploadFile.name}}</div>
                              <div class="upload_file_title">{{uploadFile.progress}}%</div>
                              <div class="upload_file_progress">
                                <span class="file_progress" :style="'width:' + uploadFile.progress + '%'"></span>
                              </div>
                            </div>
                          </div>
                          <div class="chat_user_info_out clearBoth">
                            <div class="chat_user_img" >
                              <img v-if="im_icon" :src="im_icon" alt=""/>
                            </div>
                          </div>
                        </div>
                      </div>-->
                      <!-- <div v-if="uploadImg" >
                        <div class="chat_item out clearBoth">
                          <div class="chat_content image">
                            <div class="chat_content_arrow_out"></div>
                            <div class="uploadingImg"></div>
                          </div>
                          <div class="chat_user_info_out clearBoth">
                            <div class="chat_user_img" >
                              <img v-if="im_icon" :src="im_icon" alt=""/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="uploadFile.flag" >
                        <div class="chat_item out clearBoth">
                          <div class="chat_content">
                            <div class="chat_content_arrow_out"></div>
                            <div class="upload_file_box">
                              <div class="upload_file_title">{{uploadFile.name}}</div>
                              <div class="upload_file_title">{{uploadFile.progress}}%</div>
                              <div class="upload_file_progress">
                                <span class="file_progress" :style="'width:' + uploadFile.progress + '%'"></span>
                              </div>
                            </div>
                          </div>
                          <div class="chat_user_info_out clearBoth">
                            <div class="chat_user_img" >
                              <img v-if="im_icon" :src="im_icon" alt=""/>
                            </div>
                          </div>
                        </div>
                      </div>-->
                    </div>
                    <div class="chatPreloadedMsg chat_item in clearBoth" v-if="preloadedFlag">  <!--chatInfoById.showChatPreloaded-->
                      <div class="chat_user_info">
                        <customer-avatar
                                class="client_msg"
                                :size="16"
                                :status="webchatCustData.status"
                                ></customer-avatar>
                        <div class="chat_time" v-if="preloadedTitle">{{$t('webchat.inviteStatusTyping')}}</div>
                        <div class="chat_time" v-else>{{$t('webchat.inviteStatusTyp')}}</div>
                      </div>
                      <div class="chat_content" >
                        <div class="chat_content_arrow"></div>
                        <div class="chat_message_con" v-html="preloadedMsgCon"></div><!-- preloadedMsgCon 预加载的消息 -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="send_chat_msg" v-if="tabType === 'webchat_todo'">
          <el-popover v-if="tabType === 'webchat_todo'" ref="popover3" placement="top" width="472" trigger="click" :offset="-230">
            <emoji-face @setEmojiFace="emojiFaceData">
            </emoji-face>
          </el-popover>
          <el-popover v-if="tabType === 'webchat_todo'" ref="popover4" v-model="popover4Show" placement="top" width="572" trigger="click" :offset="-100">
            <div class="webchat_todo_">
              <span>网址：</span>
              <el-input size="mini" style="height: 22px;width: 200px" v-model="iframeMsgUrl"></el-input>
              <span>宽：</span>
              <el-input size="mini" style="height: 22px;width: 50px" maxlength="3" v-model.trim="iframeMsgWidth"></el-input>
              <span>px</span>
              <span style="margin-left: 20px">高：</span>
              <el-input size="mini" style="height: 22px;width: 50px" v-model.trim="iframeMsgHeight"></el-input>
              <span>px</span>
              <el-button type="primary" class="replyMsg" @click="handleSubmit('', 'iframe')" size="small">{{$t('webchat.send')}}</el-button>
            </div>
          </el-popover>
          <el-row>
            <el-col :span="24">
              <div v-if="!webchatData.leavemsg">
                <div class="other_msg clearBoth">
                  <webchat-timer :isCard="false" :waitTime="chatInfo.waitTime" :showWaitTime="chatInfo.showWaitTime"></webchat-timer>
                  <el-dropdown trigger="click" menu-align="start" class="msg_do" @command="changeFont">
                <span class="el-dropdown-link">
                  <i class="icon icon-font iconfont"></i>
                </span>
                    <el-dropdown-menu slot="dropdown" class="fontSize">
                      <el-dropdown-item :class="chatMsgCon.font === 'font12' ? 'active' : ''" command="12">12</el-dropdown-item>
                      <el-dropdown-item :class="chatMsgCon.font === 'font14' ? 'active' : ''" command="14">14</el-dropdown-item>
                      <el-dropdown-item :class="chatMsgCon.font === 'font16' ? 'active' : ''" command="16">16</el-dropdown-item>
                      <el-dropdown-item :class="chatMsgCon.font === 'font18' ? 'active' : ''" command="18">18</el-dropdown-item>
                      <el-dropdown-item :class="chatMsgCon.font === 'font20' ? 'active' : ''" command="20">20</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <i class="msg_do icon-biaoqing iconfont" v-popover:popover3></i>
                  <i class="msg_do iconfont icon-tupian" id="uploadWebchatImg"></i>
                  <!-- <i class="msg_do iconfont icon-shipin" id="videoChat" @click.stop="startVideoChat"></i> -->
                  <i class="msg_do iconfont icon-imwenjian" id="uploadWebchatFile"></i>
                  <i class="msg_do iconfont icon-pingjia" @click.stop="pushImCSRInfo"></i>
                  <i class="msg_do iconfont icon-zhishikujiansuo" @click.stop="openPopSearch(false)"></i>
                  <i class="msg_do iconfont icon-hulianwang" v-popover:popover4 @click="changePopover4"></i>
                  <i class="msg_do iconfont icon-heimingdan" @click.stop="showCustomerBlack"></i>
                  <el-dialog modal-append-to-body lock-scroll top="10%" title="加入黑名单" v-model.trim="sendChatMsg.dialogVisible" size="tiny">
                    <span class="send_chat_msg_title">将客户{{this.webchatData.sName}}加入黑名单</span>
                    <div class="dic_item">
                      <el-input placeholder="封禁原因" size="small" class="blacklist_con" v-model.trim="sendChatMsg.addBlackReason" type="textarea" cols="30" rows="5" ></el-input>
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click.stop="sendChatMsg.dialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click.stop="customerAddBlack">确 定</el-button>
                    </span>
                  </el-dialog>
                </div>
                <el-form :model="sendChatMsg" class="send_msg_form" ref="sendChatMsg">
                  <el-form-item :class="webchat_el_form">
                    <textarea v-focus autofocus=true  class="send_msg_textarea" type="textarea" rows="3" v-model.trim="sendChatMsg.content" @keyup="selectItem($event)" style="font-size: 12px"></textarea>
                    <!-- selectItem($event) -->
                    <div class="suggest" v-show="showSuggest === true">
                      <ul>
                        <li class="cursor_li ellipsis" v-for="(domain, index) in listNeedShow" :class="domain.flag ? 'active' : ''" @click.stop="suggestListAdd(domain.data)">
                          {{domain.data}}
                        </li>
                      </ul>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" class="replyMsg" @click="handleSubmit" size="small">{{$t('webchat.send')}}</el-button>
                    <!--<el-button type="primary" class="replyMsg" @click.stop="ceshi" size="small">测试</el-button>-->
                  </el-form-item>
                </el-form>
              </div>
              <div v-if="webchatData.leavemsg" class="leavemsg_box"></div>
            </el-col>
          </el-row>
        </div>
        <!--<el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('webchat.largeImage')" v-model.trim="bigImage.bigImageShow">-->
          <!--<img :src="bigImage.url" alt=""/>-->
          <!--<el-button type="primary" @click.stop="bigImage.bigImageShow = false">{{$t('webchat.close')}}</el-button>-->
        <!--</el-dialog>-->
      </div>
      <div>
        <pop-drag-search :searchInfo="popSearchInfo" v-if="popSearchInfo.boxInfo.open" @close="closePopSearch"></pop-drag-search>
      </div>
      <big-image :imgInfo="bigImage" @closeImageDialog="closeBigImage"></big-image>
    </el-col>
    <el-col v-if="!qualityCheck" :span="8">
      <div class="webchat_chat_info chat_info_box">
        <div class="chat_info">
          <el-tabs class="chat_info_todo" v-if="tabType === 'webchat_todo'" :active-name="activeName" @tab-click="tabChange">
            <el-tab-pane :label="$t('webchat.auxiliaryInformation')" class="basic_info chat_detailed_info_box" name="otherInfo">
              <div>
                <h3 class="titleInfo" @click="switchInfo('base')">
                  <span :class="{'el-icon-plus': !baseInfo, 'el-icon-minus': baseInfo}"></span>
                  {{$t('webchat.basicInfo')}}</h3>
                <div v-if="baseInfo">
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.assistAgent')}}:</span>
                    <span v-if="!webchatData.assistAgent" class="chat_info_li_con">{{$t('webchat.nothing')}}</span>
                    <span v-if="webchatData.assistAgent" class="chat_info_li_con">{{webchatData.invitedUserName}}</span>
                  </div>
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.invitationStatus')}}:</span>
                    <span v-if="webchatData.inviteUserStatus && webchatData.inviteUserStatus === 'accept'" class="chat_info_li_con">{{$t('webchat.accecptInvite')}}</span>
                    <span v-if="webchatData.inviteUserStatus && webchatData.inviteUserStatus === 'undeal'" class="chat_info_li_con">{{$t('webchat.noAccecptInvite')}}</span>
                    <span v-if="!webchatData.inviteUserStatus" class="chat_info_li_con">{{$t('webchat.noInvite')}}</span>
                  </div>
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.are')}}:</span>
                    <span class="chat_info_li_con">{{webchatData.area}}</span>
                  </div>
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.ipAdress')}}:</span>
                    <span class="chat_info_li_con">{{webchatData.ip}}</span>
                  </div>
                  <div class="chat_info_li clearBoth" >
                    <span class="chat_info_li_title">{{$t('webchat.seoKeywords')}}:</span>
                    <span class="chat_info_li_con">{{webchatData.seoKeywords}}</span>
                  </div>
                  <div class="chat_info_remark chat_info_li">
                    <span class="chat_info_li_title">{{$t('public.remark')}}</span>
                    <textarea class="chat_info_li_remarks" rows="3" :placeholder="$t('public.pleaseEnter')" v-on:blur="editRemark($event)" v-model="webchatData.remark"></textarea>
                  </div>
                </div>
                <div class="chat_auxiliary_info">
                  <h3 class="titleInfo" @click="switchInfo('track')">
                    <span :class="{'el-icon-plus': !trackInfo, 'el-icon-minus': trackInfo}"></span>
                    {{$t('webchat.trackBrowseCount', { count: ubaInfoList.count ? ubaInfoList.count : 0 })}}
                  </h3>
                  <div v-if="trackInfo" id="timeScroll" class="time_line_warp" v-on:scroll="timeScroll($event)">
                    <ul>
                      <webChatTimeLine :ubaInfoListPages="ubaInfoList.pages"></webChatTimeLine>
                    </ul>
                  </div>
                </div>
                <div class="chat_auxiliary_info">
                  <h3 class="titleInfo"  @click="switchInfo('visit')">
                    <span :class="{'el-icon-plus': !visitInfo, 'el-icon-minus': visitInfo}"></span>
                    {{$t('webchat.accessInformation')}}：({{visitInfoList.length}}{{$t('webchat.communication')}})
                  </h3>
                  <div v-if="visitInfo" class="chat_auxiliary_box">
                    <div   v-for="auxiliary in visitInfoList">
                      <span class="chat_auxiliary_title">{{auxiliary.time}}</span>
                      <a v-if="auxiliary.platform === 'pc'" :href="auxiliary.fromUrl" class="chat_auxiliary_from" target="_blank">
                        <span v-if="auxiliary.urlTitle">{{auxiliary.urlTitle}}</span>
                        <span v-else>{{$t('webchat.WebConsultation')}}</span>
                      </a>
                      <span v-if="auxiliary.platform === 'wap'" class="chat_auxiliary_from">{{$t('webchat.WapConsultation')}}</span>
                      <span v-if="auxiliary.platform === 'sdk'" class="chat_auxiliary_from">{{$t('webchat.SdkConsultation')}}</span>
                      <span v-if="auxiliary.platform === 'weixin'" class="chat_auxiliary_from">{{$t('webchat.WeiXinConsultation')}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('webchat.quickReplay')" class="basic_info quick_replay_box" name="qucireplay">
              <div v-if="!webchatData.leavemsg" class="quickreplay_box">
                <div class="quickreplay_system">
                  <div class="quickBoxTit">
                    {{$t('webchat.systemCommon')}}
                  </div>
                  <ul class="tree" v-if="sysQuickReply.length">
                    <li class="quickReSys quickReSysIndex" v-for="(model, index) in sysQuickReply">
                      <div class="cursor_li sys_quick_li" @click.stop="quickSysLitoggle1(index)" :index="index" :title="model.name">
                        <span class="sys_quick_li_span"><i :class="open.index===index&&open.isOn ? 'el-icon-minus' : 'el-icon-plus'"></i></span>
                        <div class="cata-name ellipsis sys_quick_li_title">{{model.name}}</div>
                      </div>
                      <ul v-show="open.index === index && open.isOn === true" v-if="model.children&&model.children.length" class="quick_re_sys_ul">
                        <li class="quickReSys quickReLi ellipsis"
                            v-for="model in model.children">
                          <span class="cata-name ellipsis">{{model.content}}</span>
                        <span class="quickReBox clearBoth">
                          <i class="quickRe iconfont icon-fuzhi" @click.stop="quickCopyMsg(model.content)"></i>
                          <i class="quickRe iconfont icon-piliang" @click.stop="quickSendMsg(model.content)"></i>
                        </span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div class="quickreplay_custome">
                  <div class="quickreplay_custome_title">
                    {{$t('webchat.customize')}} <span class="edit_img iconfont icon-beizhu" @click.stop="changeShow" v-if="custQkReplyIsShow === true"></span>
                  </div>
                  <div class="quickreplay_custom_con_box">
                    <ul class="quickreplay_custom_con" v-if="custQkReplyIsShow === true">
                      <li class="quickReLi ellipsis" v-for="item in customQuickReply.rdata">
                        <span>{{item.value}}</span>
                      <span class="quickReBox clearBoth">
                        <i class="quickRe iconfont icon-fuzhi" @click.stop="quickCopyMsg(item.value)"></i>
                        <i class="quickRe iconfont icon-piliang" @click.stop="quickSendMsg(item.value)"></i>
                      </span>
                      </li>
                    </ul>
                  </div>
                  <div class="quickreplay_custom_edit_box">
                    <div class="quickreplay_custom_edit" v-if="custQkReplyIsShow === false">
                      <el-form :model="editCustomQuickReply" ref="editCustomQuickReply" class="demo-dynamic">
                        <el-button type="text" @click.stop="addDomain" size="small" class="color el-icon-plus"></el-button>
                        <el-form-item v-for="(domain, index) in editCustomQuickReply.rdata" class="quickreplay_li" :prop="'rdata.' + index + '.value'" :rules="{required: true, message: '快捷回复不能为空', trigger: 'blur'}">
                          <input type="text" class="quickreplay_custom_edit_input" v-on:focus="indexInRdata = index" v-model.trim="domain.value"/>
                          <!--<el-input size="small" v-model.trim="domain.value" class="quickreplay_custom_edit_input" size="mini"></el-input>-->
                          <el-button class="edit_del el-icon-minus color" type="text" size="mini" @click.prevent="removeDomain(domain)"></el-button>
                        </el-form-item>
                        <el-form-item>
                          <div class="button_box">
                            <el-button @click.stop="custQkReSubmit()" size="small">{{$t('public.cancel')}}</el-button>
                            <el-button @click.stop="custQkReSubmit(true)" type="primary" size="small">{{$t('public.save')}}</el-button>
                          </div>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div v-if="tabType === 'webchat_all'" class="chat_info_all_box">
            <div class="chat_info_all_title">{{$t('webchat.chatInfo')}}</div>
            <div class="chat_info_all">
              <div class="chat_info_li clearBoth" >
                <span class="chat_info_li_title">{{$t('webchat.assistAgent')}}:</span>
                <span v-if="!webchatData.assistAgent" class="chat_info_li_con">{{$t('webchat.nothing')}}</span>
                <span v-if="webchatData.assistAgent" class="chat_info_li_con">{{webchatData.invitedUserName}}</span>
              </div>
              <div class="chat_info_li clearBoth" >
                <span class="chat_info_li_title">{{$t('webchat.invitationStatus')}}:</span>
                <span v-if="webchatData.inviteUserStatus && webchatData.inviteUserStatus === 'accept'" class="chat_info_li_con">{{$t('webchat.accecptInvite')}}</span>
                <span v-if="webchatData.inviteUserStatus && webchatData.inviteUserStatus === 'undeal'" class="chat_info_li_con">{{$t('webchat.noAccecptInvite')}}</span>
                <span v-if="!webchatData.inviteUserStatus" class="chat_info_li_con">{{$t('webchat.noInvite')}}</span>
              </div>
              <div class="chat_info_li clearBoth" >
                <span class="chat_info_li_title">{{$t('webchat.are')}}:</span>
                <span class="chat_info_li_con">{{webchatData.area}}</span>
              </div>
              <div class="chat_info_li clearBoth" >
                <span class="chat_info_li_title">{{$t('webchat.ipAdress')}}:</span>
                <span class="chat_info_li_con">{{webchatData.ip}}</span>
              </div>
              <div class="chat_info_li clearBoth" >
                <span class="chat_info_li_title">{{$t('webchat.seoKeywords')}}:</span>
                <span class="chat_info_li_con">{{webchatData.seoKeywords}}</span>
              </div>
              <div class="chat_info_remark chat_info_li">
                <span class="chat_info_li_title">{{$t('public.remark')}}</span>
                <textarea class="chat_info_li_remarks" rows="3" :placeholder="$t('public.pleaseEnter')" v-on:blur="editRemark($event)" v-model="webchatDataClone.remark"></textarea>
              </div>
              <ul class="chat_info_ul">
                <li class="clearBoth chat_info_li"><i>{{$t('webchat.msgNum')}}：</i><span class="chat_info_li_con" :title="webchatData.totalMsgCount">{{webchatData.totalMsgCount}}</span></li>
                <li class="clearBoth chat_info_li"><i>{{$t('webchat.endType')}}：</i><span class="chat_info_li_con" :title="webchatDataClone.finishReason">{{webchatDataClone.finishReason}}</span></li>
                <li class="clearBoth chat_info_li investigate_box">
                  <i>{{$t('webchat.evalution')}}：</i>
                <span class="investigate_box">
                  <span class="chat_info_li_con" :title="chatInfo.investigate.value" @mouseenter="investigateShow(true)">{{chatInfo.investigate.value}}</span>
                </span>
                  <ul v-if="investigate" class="investigate_con clearBoth" @mouseleave="investigateShow()" @mouseenter="investigateShow(true)">
                    <li class="clearBoth">
                      <i>{{$t('webchat.evalution')}}：</i>
                      <span>{{chatInfo.investigate.value}}</span>
                    </li>
                    <li class="clearBoth">
                      <i>{{$t('webchat.evalutionLabel')}}：</i>
                      <span v-if="chatInfo.investigate.label.length > 0">{{chatInfo.investigate.label}}</span>
                    </li>
                    <li class="clearBoth">
                      <i>{{$t('webchat.evalutionContent')}}：</i>
                      <span class="investigate_content">{{chatInfo.investigate.content}}</span>
                    </li>
                  </ul>
                </li>
                <li class="clearBoth chat_info_li"><i>{{$t('webchat.fromSkillGroup')}}：</i><span class="chat_info_li_con" :title="chatInfo.queueName">{{chatInfo.queueName}}</span></li>
                <li class="clearBoth chat_info_li"><i>{{$t('webchat.fromService')}}：</i><span class="chat_info_li_con" :title="webchatData.username">{{webchatData.username}}</span></li>
              </ul>
              <ul class="chat_info_ul">
                <li class="clearBoth chat_info_li"><i>{{$t('webchat.beginDate')}}：</i><span class="chat_info_li_con" :title="webchatDataClone.beginDate">{{webchatDataClone.beginDate}}</span></li>
                <li class="clearBoth chat_info_li"><i>{{$t('webchat.artificialStartTime')}}：</i><span class="chat_info_li_con" :title="webchatDataClone.manualTime">{{webchatDataClone.manualTime}}</span></li>
                <li class="clearBoth chat_info_li"><i>{{$t('webchat.firstResponseDate')}}：</i><span class="chat_info_li_con" :title="webchatDataClone.firstReplyTime">{{webchatDataClone.firstReplyTime}}</span></li>
                <li class="clearBoth chat_info_li"><i>{{$t('webchat.conversationEdnTime')}}：</i><span class="chat_info_li_con" :title="webchatDataClone.endTime">{{webchatDataClone.endTime}}</span></li>
                <li class="clearBoth chat_info_li"><i>{{$t('webchat.dialogueDuration')}}：</i><span class="chat_info_li_con" :title="webchatDataClone.duration">{{webchatDataClone.duration}}</span></li>
              </ul>
              <div class="chat_auxiliary_info">
                <h3 class="titleInfo" @click="switchInfo('track')">
                  <span :class="{'el-icon-plus': !trackInfo, 'el-icon-minus': trackInfo}"></span>
                  {{$t('webchat.trackBrowseCount', { count: ubaInfoList.count ? ubaInfoList.count : 0 })}}
                </h3>
                <div v-if="trackInfo" id="timeScroll" class="time_line_warp" v-on:scroll="timeScroll($event)">
                  <ul>
                    <webChatTimeLine :ubaInfoListPages="ubaInfoList.pages"></webChatTimeLine>
                  </ul>
                </div>
              </div>
              <div class="chat_auxiliary_info">
                <h3 class="titleInfo"  @click="switchInfo('visit')">
                  <span :class="{'el-icon-plus': !visitInfo, 'el-icon-minus': visitInfo}"></span>
                  {{$t('webchat.accessInformation')}}：({{visitInfoList.length}}{{$t('webchat.communication')}})
                </h3>
                <div v-if="visitInfo" class="chat_auxiliary_box" v-for="auxiliary in visitInfoList">
                  <span class="chat_auxiliary_title">{{auxiliary.time}}</span>
                  <a v-if="auxiliary.platform === 'pc'" :href="auxiliary.fromUrl" class="chat_auxiliary_from" target="_blank">
                    <span v-if="auxiliary.urlTitle">{{auxiliary.urlTitle}}</span>
                    <span v-else>{{$t('webchat.WebConsultation')}}</span>
                  </a>
                  <span v-if="auxiliary.platform === 'wap'" class="chat_auxiliary_from">{{$t('webchat.WapConsultation')}}</span>
                  <span v-if="auxiliary.platform === 'sdk'" class="chat_auxiliary_from">{{$t('webchat.SdkConsultation')}}</span>
                  <span v-if="auxiliary.platform === 'weixin'" class="chat_auxiliary_from">{{$t('webchat.WeiXinConsultation')}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-col>
    <!-- <el-dialog  title="操作提示" v-model="VideoTipsDialog" :modal="false" :close-on-click-modal="false" custom-class="VideoTips" size="tiny">
      <p class="tipsword">{{VideoActionTips}}</p>
      <div class="tipsbutton">
      <el-button type="primary" @click="VideoTipsDialog = false">确 定</el-button>
      </div>
    </el-dialog> -->
  </el-row>
</template>
<script type="text/javascript">
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import { deepClone, getCurrentDate, getCurrentDateTime, millsToDate, contains, getFormatDateTime, getCache } from '../../../utils/m7Utils'
  import * as webchatUtils from '../../../utils/webchat.js'
  import * as types from '../../../store/modules/webchat/mutation-types.js'
  import EmojiFace from 'components/public-modules/emoji-face'
  import WebchatTimer from 'components/business-modules/webchat/WebchatTimers'
  import { uploadTo7moorImDomain, PasteImguploadTo7moorImDomain, qiniu7moorImDomain } from '../../../utils/qiniuUtils'
  import EndSessionBox from '../../public-modules/ImEndSessionBox/EndSessionBox'
  import BigImage from 'components/public-modules/bigImage/BigImage'
  import PopDragSearch from 'components/public-modules/popups/PopDragSearch'
  import webChatTimeLine from '../../ui-modules/timeLine/webChatTimeLine'
  import WebchatChatVoice from './WebchatChatVoice.vue'
  import uuid from 'uuid'
  import {checkform} from '../../../utils/validate'

  // function getWebchatDetail (store, _id, sid, submenu) {
  //   let data = {_id: _id, sid: sid, submenu: submenu}
  //   return store.dispatch('popupWebchat', data)
  // }
  // function getChatInfoById (store, _id, submenu) {
  //   let data = {
  //     cust_id: '',
  //     queryHistory: true,
  //     submenu: submenu,
  //     _id: _id
  //   }
  //   return store.dispatch('queryChatInfoById', data)
  // }
  function doQuerySysQuickReplyList (store, data) {
    return store.dispatch('queryWebChatAllTags', data)
  }
  function doQueryCustomQuickReplyList (store, data) {
    return store.dispatch('getQuickReplyList', data)
  }
  function getWebchatUserHistory (store, sessionId, submenu, page) {
    let data = {
      page: page,
      limit: 10,
      sessionId: sessionId,
      submenu: submenu
    }
    return store.dispatch('queryUserHistory', data)
  }
  function getQueryHistory (store, sid, sessionId, submenu, dateTime, page) {
    let data = {
      page: page,
      limit: 50,
      sid: sid,
      sessionId: sessionId,
      dateTime: dateTime,
      submenu: submenu
    }
    return store.dispatch('queryHistory', data)
  }
  function changeShowInvite (store, data) {
    return store.dispatch('changeInvite', data)
  }
  export default {
    name: 'WebchatContainer',
    props: {
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
        tabType: '',
        customerId: '',
        chatHead: {
          onlineAgentsInvite: [{AssignMembers: [], DisplayName: ''}],
          onlineAgentsTransfer: [{AssignMembers: [], DisplayName: ''}],
          isActiveOne: '999',
          isActiveTwo: '999',
          isActiveThree: '999',
          defaultProps: {
            AssignMembers: 'AssignMembers',
            DisplayName: 'DisplayName'
          },
          isWebChat: true,
          remark: '',
          dialogTableVisible: false,
          endOptionsUl: [],
          majorstwo: [],
          majorsthree: [],
          endSessionActive: [],
          endSessionFlag: false,
          endSessionLength: 0
        },
        chatMsgCon: {
          font: 'font14',
          chatMsgs: [{
            msg: '您好，有什么可以帮助您的吗',
            time: '17:10:38',
            conType: 'in'
          },
          {
            msg: '你好，我想咨询下贵公司的产品',
            time: '17:10:38',
            conType: 'out'
          },
          {
            msg: '用户已离开',
            time: '17:10:38',
            conType: 'system'
          }]
        },
        sendChatMsg: {
          content: '',
          addBlackReason: '',
          dialogVisible: false
        },
        activeName: 'otherInfo',
        open: {
          index: -1,
          isOn: false
        },
        openPop1: {
          index: -1,
          isOn: false
        },
        openPop2: {
          index: -1,
          isOn: false
        },
        showSuggest: false, // 展示自动输入框
        wordLast: '',     // 缓存的上一个单词
        wordLastList: [],      // 上次正则筛选出来的快捷回复
        listNeedShow: [],       // 需要展示的数据
        selectIndex: -1,        // 本次选中的index
        webchatData: {},
        chatInfo: {},
        indexInRdata: '',
        custQkReplyIsShow: true,
        editCustomQuickReply: {},
        oldCustomQuickReply: {},    // 自定义快捷回复历史数据暂存
        visitInfoList: [],
        popover1Search: '',
        popover2Search: '',
        pop1Clone: {},
        pop2Clone: {},
        showGrabIcon: true,
        popover2Show: false,
        bigImage: {
          bigImageShow: false,
          url: ''
        },
        popSearchInfo: {
          boxInfo: {
            name: '',
            open: false
          },
          serachDate: '',
          searcgFlag: 0
        },
        visiblePick: false,
        iconFont: '',
        popoLoading: false,
        uploadImg: false,
        uploadFile: {
          flag: false,
          progress: '',
          name: ''
        },
        remarkClone: '',
        webchatDataClone: {},
        preloadedTitle: true,
        ubaInfoList: [],
        investigate: false,
        baseInfo: true,
        trackInfo: true,
        visitInfo: false,
        ubaSessionId: '',  // ubaSessionId 用来确定唯一的用户浏览轨迹
        // VideoTipsDialog: false,
        // VideoActionTips: ''
        popover4Show: false,
        defaultiframeMsgHeight: '',
        defaultiframeMsgWidth: '',
        defaultiframeMsgUrl: '',
        iframeMsgUrl: '',     // iframe消息地址
        iframeMsgWidth: '',   // iframe消息宽度
        iframeMsgHeight: ''   // iframe消息高度
      }
    },
    methods: {
      quickSysLitoggle1 (index) {
        if (index === this.open.index) {
          this.open.isOn = !this.open.isOn
        } else {
          this.open.index = index
          this.open.isOn = true
        }
        if (!this.sysQuickReply[index].children) {
          let data = {
            id: this.sysQuickReply[index]._id,
            moduleType: 'webchat',
            index: index
          }
          this.$store.dispatch('queryWebChatTagsById', data)
        }
      },
      togglePop1: function (index) {
        if (index === this.openPop1.index) {
          this.openPop1.isOn = !this.openPop1.isOn
        } else {
          this.openPop1.index = index
          this.openPop1.isOn = true
        }
      },
      togglePop2: function (index) {
        if (index === this.openPop2.index) {
          this.openPop2.isOn = !this.openPop2.isOn
        } else {
          this.openPop2.index = index
          this.openPop2.isOn = true
        }
      },
//      changeMajorOne (data, flag, index) {
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
      handleReset () {
        this.sendChatMsg.resetFields()
      },
      handleSubmit (data, type, newData) {
        let str = ''
        if (newData) {
          str = newData
        } else if (type === 'iframe') {
          str = this.iframeMsgUrl
        } else {
          str = this.sendChatMsg.content
        }
        str = this.trim(str)
        if (str) {
          let timeStamp = new Date().getTime()
          let data = {
            accessId: this.webchatData.accessId,
            content: str,
            contentType: type || 'text',
            displayName: this.agentName,
            exten: this.agentNum,
            firstReply: false,
            im_icon: this.$store.state.session.user.im_icon || '',
            lastClaimTime: this.chatInfo.lastClaimTime,
            lastRedirectTime: '',
            lastRedirectUserTime: '',
            manualTime: this.chatInfo.manualTime,
            platform: this.chatInfo.platform,
            sessionId: this.webchatData._id,
            sid: this.webchatData.sid,
            status: this.chatInfo.status,
            timeStamp: timeStamp,
            type: 'out'
          }
          let nstr = encodeURIComponent(str)
          let displayName = encodeURIComponent(this.agentName)
          let agentNum = encodeURIComponent(this.agentNum)
          data.content = nstr
          data.displayName = displayName
          data.agentNum = agentNum
          let tempData = deepClone(data)
          tempData.sendStatus = 'sending'
          tempData.message = decodeURIComponent(nstr)
          tempData.message = webchatUtils.renderEmoji(tempData.message)
          tempData.createTime = getCurrentDateTime()
          let paramsNew = tempData.message.split('?fileName=')
          if (paramsNew.length > 1) {
            let params2 = paramsNew[1].split('?fileSize=')
            if (params2.length) {
              tempData.fileName = params2[0]
            }
          }
          if (tempData.contentType === 'text') {
            tempData.contentHasUrl = ''
            let oldContent = tempData.message
            let contentNew = webchatUtils.msgConvertion(tempData.message)
            if (oldContent !== contentNew) {
              tempData.message = contentNew
              tempData.contentHasUrl = 'have'
              data.contentHasUrl = 'have'
              data.contentNew = contentNew
            }
          }
          if (data.contentType === 'iframe') {
            if (this.iframeMsgWidth === '' || this.iframeMsgHeight === '') {
              this.$message({
                message: '页面宽高不能为空',
                type: 'warning'
              })
              return
            }
            // 输入校验
            let urlMatch = checkform(this.iframeMsgUrl, 'Url')
            let heightMatch = checkform(this.iframeMsgHeight, 'Number')
            let widthMatch = checkform(this.iframeMsgWidth, 'Number')
            urlMatch && this.$message({message: this.$t(urlMatch), type: 'warning'})
            heightMatch && this.$message({message: this.$t(heightMatch), type: 'warning'})
            widthMatch && this.$message({message: this.$t(widthMatch), type: 'warning'})
            if (urlMatch || heightMatch || widthMatch) {
              return false
            }
            data.iframeWidth = this.iframeMsgWidth <= 280 ? this.iframeMsgWidth : 280
            data.iframeHeight = this.iframeMsgHeight
            this.popover4Show = false
          }
          var index = this.webchatUserHistory.length
          this.$store.commit(types.REPLY_MSG, {data: tempData, index})
          this.$store.dispatch('replyMsg', {data, index}).then((res) => {
            this.$nextTick(function () {
              if (this.$route.path.split('/')[3] === 'webchat_todo' && document.getElementsByClassName('chat_msg').length) {
                this.scrollToBottom('chat_msg', 'msg_inner')
              }
            })
          })
        } else {
          this.$message({
            message: this.$t('webchat.notEmpty'),
            type: 'warning'
          })
        }
        if (!newData) {
          this.sendChatMsg.content = ''
        }
        return false
      },
      getChatHistoryScroll (event) {
        let arr = this.$route.path.split('/')
        let tabType = arr[3]
        let _id = arr[4]
        if (this.qualityCheck) {
          _id = this.sessionId
        }
        if (event.target.scrollTop < 1 && !this.chatInfo.finishChatScroll) {
          let page = deepClone(this.chatInfo.chatScrollPage)
          let oldHis = deepClone(this.webchatUserHistory)
          let oldLength = oldHis.length
          getWebchatUserHistory(this.$store, _id, tabType, page).then(() => {
            let newLength = this.webchatUserHistory.length
            if (newLength === oldLength) {

            } else {

            }
          })
        }
      },
      getMsgHistory () {
        let arr = this.$route.path.split('/')
        let tabType = arr[3]
        let page = deepClone(this.chatInfo.chatHistoryPage)
        let dateTime
        if (this.webchatUserHistory[0] && page === 1) {
          dateTime = this.webchatUserHistory[0].dateTime
        } else if (this.historyList[0] && page !== 1) {
          dateTime = this.historyList[0].dateTime
        } else {
          dateTime = getCurrentDateTime()
        }
        getQueryHistory(this.$store, this.webchatData.sid, this.webchatData._id, tabType, dateTime, page).then(() => {})
      },
      trim (data) {
        let _str = data
        return _str.replace(/(^\s*)|(\s*$)/g, '')
      },
      removeDomain (item) {
        var index = this.editCustomQuickReply.rdata.indexOf(item)
        this.editCustomQuickReply.rdata.splice(index, 1)
      },
      addDomain () {
        this.editCustomQuickReply.rdata.push({value: ''})
        this.$nextTick(function () {
          this.scrollToBottom('quick_replay_box', 'quickreplay_box')
        })
      },
      changeShow () {
        this.editCustomQuickReply = deepClone(this.customQuickReply)
        this.oldCustomQuickReply = deepClone(this.customQuickReply)
        this.custQkReplyIsShow = false
        this.$nextTick(function () {
          this.scrollToBottom('quick_replay_box', 'quickreplay_box')
        })
      },
      custQkReSubmit (flag) {
        let cloneData = deepClone(this.editCustomQuickReply) // 自定义快捷回复新设置数据克隆（经过数据验证之后获取不到验证前的数据）
        if (this.$refs.editCustomQuickReply.fields.length) {
          this.$refs.editCustomQuickReply.validate((valid) => {
            if (valid) {
              let vuexData = {}
              if (flag) {
                let arr = []
                cloneData.rdata.forEach((item) => {
                  arr.push(item.value)
                })
                let data = {
                  quickreplys: arr,
                  moduleType: 'webchat'
                }
                this.$store.dispatch('saveQuickReply', data)
                vuexData = cloneData
              } else {
                vuexData = deepClone(this.oldCustomQuickReply)
              }
              this.$store.commit(types.SET_QUICK_REPLY_DATA, vuexData)
              this.custQkReplyIsShow = true
              let data = {
                'moduleType': 'webchat'
              }
              this.$store.dispatch('getAllQuickReplyList', data)
            }
          })
        } else {
          if (flag) {
            let arr = []
            let data = {
              quickreplys: arr,
              moduleType: 'webchat'
            }
            this.$store.dispatch('saveQuickReply', data)
            this.$store.commit(types.SET_QUICK_REPLY_DATA, cloneData)
          }
          this.custQkReplyIsShow = true
        }
      },
      quickSendMsg (data) {
//        this.sendChatMsg.content = data
        this.handleSubmit({}, '', data)
        this.$nextTick(function () {
          this.scrollToBottom('chatMsgCon', 'chatMsgCon')
        })
      },
      quickCopyMsg (data) {
        let str = this.sendChatMsg.content
        this.sendChatMsg.content = str + data
      },
      pushImCSRInfo () {
        // if (this.isVideoing) {
        //   this.VideoTipsDialog = true
        //   this.VideoActionTips = '视频聊天请求结束后才可以请求评价!'
        //   return
        // }
        let data = {
          accessId: this.webchatData.accessId,
          content: '',
          contentType: 'text',
          displayName: this.agentName,
          exten: this.agentNum,
          im_icon: this.$store.state.session.user.im_icon || '',
          platform: this.chatInfo.platform,
          sessionId: this.webchatData._id,
          sid: this.webchatData.sid,
          status: 'deal'
        }
        this.$store.dispatch('pushImCSRInfo', data).then((res) => {
        })
      },
      emojiFaceData (data) {
        document.querySelectorAll('.send_msg_textarea')[0].focus()
        let old = this.sendChatMsg.content
        this.sendChatMsg.content = old + data.value
        this.faceIndex = data.index
      },
      changePopover1 () {
        // if (this.isVideoing || this.isInviteVideo) {
        //   this.VideoTipsDialog = true
        //   this.VideoActionTips = '视频聊天请求结束后才可以进行操作!'
        //   return
        // }
        this.popoLoading = true
        this.popover1Search = ''
        this.chatHead.onlineAgentsInvite = [{AssignMembers: [], DisplayName: ''}]
        this.$store.dispatch('getOnlineAgent', {data: {toPeer: this.webchatData.toPeer}}).then((res) => {
          if (res.length) {
            this.chatHead.onlineAgentsInvite = res
          }
//          this.chatHead.onlineAgentsInvite = res
          this.openPop1.index = -1
          this.openPop1.isOn = false
          this.pop1Clone = deepClone(res)
          this.popoLoading = false
        })
      },
      changePopover2 () {
        // if (this.isVideoing || this.isInviteVideo) {
        //   this.VideoTipsDialog = true
        //   this.VideoActionTips = '视频聊天请求结束后才可以进行操作!'
        //   return
        // }
        this.popoLoading = true
        this.popover2Search = ''
        this.chatHead.onlineAgentsTransfer = [{AssignMembers: [], DisplayName: ''}]
        this.$store.dispatch('getPeerOnlineAgent', this.webchatData.toPeer).then((res) => {
          if (res.length) {
            this.chatHead.onlineAgentsTransfer = res
          }
          this.openPop2.index = -1
          this.openPop2.isOn = false
          this.pop2Clone = deepClone(res)
          this.popoLoading = false
        })
      },
      changePopover4 () {
        this.iframeMsgUrl = this.defaultiframeMsgUrl
        this.iframeMsgWidth = this.defaultiframeMsgWidth
        this.iframeMsgHeight = this.defaultiframeMsgHeight
      },
      changeShwoInviteBtn () {
        let self = this
        this.$confirm(this.$t('webchat.sureKickOutCollaborators'), this.$t('public.tip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then(() => {
          self.changeInviteBtn(self)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('webchat.cancelKickOutCollaborators')
          })
        })
      },
      changeInviteBtn (self) {
        changeShowInvite(self.$store, false)
        this.$store.dispatch('kickGroupSession', {_id: self.webchatData._id})
      },
      searchTree1 () {
        let that = this
        let str = that.popover1Search
        let schStr = that.trim(str)
        let data = []
        that.openPop1.index = -1
        that.openPop1.isOn = false
        if (schStr) {
          that.pop1Clone.forEach((item) => {
//          AssignMembers
            let obj = deepClone(item)
            let dataLi = {
              AssignMembers: []
            }
            let grrowName = obj.DisplayName
            let grrowIdexOf = grrowName.indexOf(schStr)
            for (let i = 0; i < obj.AssignMembers.length; i++) {
              let liName = obj.AssignMembers[i].displayName
              if (liName.indexOf(schStr) !== -1) {
                dataLi.AssignMembers.push(obj.AssignMembers[i])
              }
            }
            if (dataLi.AssignMembers.length) {
              obj.AssignMembers = dataLi.AssignMembers
              data.push(obj)
            } else if (grrowIdexOf !== -1) {
              data.push(obj)
            }
          })
          that.chatHead.onlineAgentsInvite = data
          console.log(that.chatHead.onlineAgentsInvite)
        } else {
          that.chatHead.onlineAgentsInvite = deepClone(this.pop1Clone)
        }
      },
      searchTree2 () {
        let that = this
        let str = that.popover2Search
        let schStr = that.trim(str)
        let data = []
        if (schStr) {
          that.pop2Clone.forEach((item) => {
            let obj = deepClone(item)
            let dataLi = {
              AssignMembers: []
            }
            for (let i = 0; i < obj.AssignMembers.length; i++) {
              let liName = obj.AssignMembers[i].displayName
              if (liName.indexOf(schStr) !== -1) {
                dataLi.AssignMembers.push(obj.AssignMembers[i])
              }
            }
            data.push(dataLi)
          })
          that.chatHead.onlineAgentsTransfer = data
        } else {
          that.chatHead.onlineAgentsTransfer = deepClone(that.pop2Clone)
        }
      },
      changeFont (command) {
        let data = 'font' + command
        window.localStorage.setItem('imFontCon', data)
        this.chatMsgCon.font = data
      },
      editRemark (event) {
        if (this.remarkClone !== event.target.value) {
          let remark = {
            accessId: this.webchatData.accessId,
            sid: this.webchatData._id,
            content: event.target.value
          }
          this.$store.dispatch('updateWebchatSessionRemark', remark).then(() => {
            this.remarkClone = event.target.value
            this.chatHead.remark = event.target.value
          })
        }
      },
      getFinishReason () {
        let self = this
        this.$store.dispatch('getCache', {type: 'channelDic'}).then((res) => {
          let _dics = ''
          for (let i = 0; i < res.length; i++) {
            if (res[i].type === 'webchat') {
              _dics = res[i].options || []
              break
            }
          }
          if (_dics.length === 0) {
            this.$message.error(this.$t('webchat.isNullByFinishKey'))
            return
          }
          let two = false
          let three = false
          this.chatHead.endSessionLength = 1
          _dics.forEach((item) => {
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
          self.chatHead.endOptionsUl = _dics
          self.chatHead.dialogTableVisible = true
          self.chatHead.majorstwo = []
          self.chatHead.majorsthree = []
          self.chatHead.isActiveOne = ''
          self.chatHead.endSessionActive = []
        })
      },
      transferAgent (toUser, toUserName) {
        let inviteAgent = {
          _id: this.webchatData._id,
          sid: this.webchatData.sid,
          toUser: toUser,
          toUserName: toUserName,
          custId: this.webchatData.custId,
          sName: this.webchatData.sName,
          cust_status: this.webchatData.cust_status
        }
        this.$store.dispatch('redirectWebchatSession', inviteAgent).then(() => {
          this.$router.replace({path: '/index/webchat/webchat_todo'})
        })
      },
      transferGroup (id, exten) {
        let transferGroup = {
          _id: this.webchatData._id,
          sid: this.webchatData._id,
          queueId: id,
          toPeer: exten
        }
        this.$store.dispatch('redirectWebchatSession', transferGroup).then(() => {
          this.$router.replace({path: '/index/webchat/webchat_todo'})
        })
      },
      inviteAgent (invitedUser, invitedUserName) {
        let inviteAgent = {
          _id: this.webchatData._id,
          sid: this.webchatData._id,
          invitedUser: invitedUser,
          invitedUserName: invitedUserName
        }
        this.$store.dispatch('inviteGroupSession', inviteAgent).then((res) => {
          if (res) {
            //  展示邀请座席页面
            let data = deepClone(this.$store.state.inviteCon)
            if (data) {
              this.popover2Show = false
              return
            }
            data = !data
            changeShowInvite(this.$store, data)
            //  切换邀请座席按钮和踢出邀请座席按钮
            //  popover2隐藏
            this.popover2Show = false
          }
        })
      },
      endSessionFun (flag, addBlack, remark) {
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
            } else if (arr[0]) {
              let one = arr[0]
              actName = this.chatHead.endOptionsUl[one].name
              finishKey = this.chatHead.endOptionsUl[one].key
            }
            let data = {
              _id: this.webchatData._id,
              sid: this.webchatData.sid,
              finishReason: actName,
              finishKey: finishKey,
              remark: remark || ''
            }

            if (addBlack) {
              data.finishKey = 'add_black'
              data.actName = this.$t('webchat.addCustomerBlack')
            }

            this.$store.dispatch('finishWebchatSession', data).then(() => {
              this.$router.replace({path: '/index/webchat/webchat_todo'})
            })
            this.chatHead.dialogTableVisible = false
            this.chatHead.endSessionActive = []
            this.chatHead.endSessionFlag = false
          }
        } else {
          this.chatHead.endSessionFlag = false
          this.chatHead.endSessionActive = []
          this.chatHead.dialogTableVisible = false
        }
      },
      changeEndSessionFlag (value) {
        this.chatHead.endSessionFlag = value
      },
      fetchData () {
        if (document.querySelectorAll('.send_msg_textarea')[0]) {
          document.querySelectorAll('.send_msg_textarea')[0].focus() // 获取焦点
        }
        let arr = this.$route.path.split('/')
        let tabType = arr[3]
        let _id = arr[4]
        if (this.qualityCheck) {
          _id = this.sessionId
        }
        this.tabType = tabType
        this.sessionId = _id
        if (tabType === 'webchat_todo') {
          let currentSession = this.$store.state.webchat.current[tabType].currentSession[_id]
          let chatInfoById = this.$store.state.webchat.current[tabType].chatInfoById[_id]
          let visitInfoList = this.$store.state.webchat.current[tabType].visitInfoList[_id]
          this.webchatData = currentSession
          this.chatHead.remark = this.webchatData.remark || ''
          this.webchatDataClone = deepClone(currentSession)
          this.remarkClone = this.webchatData.remark || ''
          this.chatInfo = chatInfoById
          this.visitInfoList = visitInfoList
          this.showGrabIcon = false
        } else {
          let obj1 = this.$store.state.webchat.current[tabType].currentSession
          this.webchatData = deepClone(obj1)
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
          this.webchatDataClone = obj
          this.remarkClone = this.webchatData.remark || ''
          this.chatInfo = this.$store.state.webchat.current[tabType].chatInfoById
          // 全部中展示浏览信息
          this.visitInfoList = this.$store.state.webchat.current[tabType].visitInfoList
          let isContainPeer
          let self = this
          this.$store.dispatch('getCache', {type: 'accessChannelAgent', id: this.webchatData.toPeer}).then((peer) => {
            if (peer) {
              let accessAgents = []
              accessAgents = peer.agents
              accessAgents.forEach((item) => {
                if (item.agentID === this.$store.state.session.user._id) {
                  isContainPeer = true
                }
              })
            }
            if (!isContainPeer) {
              self.showGrabIcon = false
            } else if (this.$store.state.session.user._id === this.webchatData.user) {
              self.showGrabIcon = false
            } else if (this.webchatData.status !== 'deal') {
              self.showGrabIcon = false
            } else if (!contains(this.$store.state.session.user.funcIds, 'func_webchat_grab')) {
              self.showGrabIcon = false
            } else if (this.webchatData.inviteUserStatus === 'accept') {
              self.showGrabIcon = false
            } else {
              self.showGrabIcon = true
            }
          })
        }
        this.$store.commit(types.SHOW_OR_HIDE_HISTORY_BTN, {submenu: tabType, sessionId: this.sessionId, length: this.webchatUserHistory.length})
        if (document.getElementById('timeScroll')) {
          document.getElementById('timeScroll').scrollTop = 0
        }
        // 载入用户的浏览轨迹
        this.ubaSessionId = ''
        // 增加tabtype 待处理和全部中都要展示浏览轨迹
        this.$store.dispatch('loadUbaInfo', {_id: this.webchatData._id, ubaSessionId: this.ubaSessionId, tabType: tabType}).then((sessionId) => {
          if (sessionId) {
            this.ubaSessionId = sessionId
            this.ubaInfoList = this.$store.state.webchat.current.webchat_todo.ubaInfoList[sessionId]
          } else {
            this.ubaInfoList = []
          }
        })
        this.$store.dispatch('getCache', {type: 'channelGlobalSet'}).then((channelGlobalSet) => {
          this.defaultiframeMsgHeight = channelGlobalSet.iframeHeight
          this.defaultiframeMsgWidth = channelGlobalSet.iframeWidth
          this.defaultiframeMsgUrl = channelGlobalSet.iframeUrl
          this.iframeMsgUrl = channelGlobalSet.iframeUrl
          this.iframeMsgWidth = channelGlobalSet.iframeWidth
          this.iframeMsgHeight = channelGlobalSet.iframeHeight
        })
      },
      initUploadWebchatImg () {
        let filters
        let that = this
        let fileAdded = function (up, files) {
          console.log('fileAdd')
        }
        let beforeUpload = function (up, file) {
          console.log('beforeUpload')
        }
        let uploadProgress = function (up, file) {
          that.uploadImg = true
          that.changeChatMsgScroll()
        }
        let uploadComplete = function () {
          console.log('uploadComplete')
        }
        let fileUploaded = function (up, file, info) {
          let domain = up.getOption('domain')
          let res = JSON.parse(info)
          let sourceLink = domain + res.key // 获取上传成功后的文件的Url
          that.sendChatMsg.content = sourceLink
          that.handleSubmit({}, 'image')
          that.uploadImg = false
        }
        let error = function (up, err, errTip) {
          that.$message.error(errTip)
        }
        let key = function (up, file) {
          let date = getCurrentDate()
          let today = new Date()
          let time = today.getTime()
          let fileName = file.name
          let fileSuffix = ''
          if (fileName) {
            fileSuffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
          }
          return 'im/' + that.webchatData.accessId + '/' + date + '/' + time + '/' + uuid.v1() + fileSuffix
        }
        filters = {
          mime_types: [
            { title: 'Image files', extensions: 'jpg,jpeg,gif,png,bmp' }
          ]
        }
        uploadTo7moorImDomain(this.$store.state.session.user._id, 'uploadWebchatImg', filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploaded, error, key)
      },
      pasteImg (evnet) {
        let ele = evnet.clipboardData.items
        let that = this
        for (let i = 0; i < ele.length; ++i) {
          if (ele[i].kind === 'file' && ele[i].type.indexOf('image/') !== -1) {
            let blob = ele[i].getAsFile()
            let filename = 'clipboard' + new Date().getTime() + '.png'
            let key = function () {
              let date = getCurrentDate()
              let today = new Date()
              let time = today.getTime()
              let fileName = filename
              let fileSuffix = ''
              if (fileName) {
                fileSuffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
              }
              return 'im/' + that.webchatData.accessId + '/' + date + '/' + time + '/' + uuid.v1() + fileSuffix
            }
            let key1 = key()
            let uploadProgress = function (up, file) {
              that.uploadImg = true
              that.changeChatMsgScroll()
            }
            let fileUploaded = function (info) {
              let domain = qiniu7moorImDomain
              let res = JSON.parse(info.currentTarget.responseText)
              let sourceLink = domain + res.key // 获取上传成功后的文件的Url
              that.sendChatMsg.content = sourceLink
              that.handleSubmit({}, 'image')
              that.uploadImg = false
            }
            PasteImguploadTo7moorImDomain(this.$store.state.session.user._id, blob, filename, uploadProgress, fileUploaded, key1)
          }
        }
      },
      initUploadWebchatFile () {
        let that = this
        let fileAdded2 = function (up, files) {
          console.log('fileAdd')
        }
        let beforeUpload2 = function (up, file) {
          console.log('beforeUpload1')
        }
        let uploadProgress2 = function (up, file) {
          that.uploadFile.name = file.name
          that.uploadFile.progress = file.percent
          that.uploadFile.flag = true
          that.changeChatMsgScroll()
        }
        let uploadComplete2 = function () {
          console.log('uploadComplete1')
        }
        let fileUploaded2 = function (up, file, info) {
          let domain = up.getOption('domain')
          let res = JSON.parse(info)
          let fileSize
          if (file.size === 0) {
            fileSize = '0 B'
          }
          let k = 1024 // or 1024
          let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          let i = Math.floor(Math.log(file.size) / Math.log(k))
          fileSize = (file.size / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
          let sourceLink = domain + res.key + '?fileName=' + file.name + '?fileSize=' + fileSize
          that.sendChatMsg.content = sourceLink
          that.handleSubmit({}, 'file')
          that.uploadFile.name = ''
          that.uploadFile.progress = ''
          that.uploadFile.flag = false
        }
        let error2 = function (up, err, errTip) {
          that.$message.error(errTip)
        }
        let key2 = function (up, file) {
          let date = getCurrentDate()
          let today = new Date()
          let time = today.getTime()
          let fileName = file.name
          return 'im/' + that.webchatData.accessId + '/' + date + '/' + time + '/' + fileName
        }
        uploadTo7moorImDomain(this.$store.state.session.user._id, 'uploadWebchatFile', {}, fileAdded2, beforeUpload2, uploadProgress2, uploadComplete2, fileUploaded2, error2, key2)
      },
      grabConversation () {
        let data = {
          _id: this.webchatData._id,
          toUser: this.$store.state.session.user._id,
          toUserName: this.$store.state.session.user.displayName,
          sid: this.webchatData.sid,
          'currUser': this.webchatData.user
        }
        let self = this
        this.$store.dispatch('grabWebchatSession', data).then(() => {
          self.$router.push('/index/webchat/webchat_todo/' + this.webchatData._id + '/webchat')
        })
      },
      changFlag () {
        let data = deepClone(this.$store.state.inviteCon)
        data = !data
        changeShowInvite(this.$store, data)
      },
      tabChange (tab, event) {
        if (tab.name === 'qucireplay') {
          if (!this.sysQuickReply.length) {
            doQuerySysQuickReplyList(this.$store, {'moduleType': 'webchat'}).then(() => {
            })
          }
          if (!this.customQuickReply.rdata) {
            doQueryCustomQuickReplyList(this.$store, {'moduleType': 'webchat'}).then(() => {
            })
          }
        }
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
        if (this.qualityCheck) {
          return
        }
        this.bigImage.url = data
        this.bigImage.bigImageShow = true
      },
      openPopSearch (value, event) {
        if (value) {
          let obj = event.target
          let parent = obj.parentNode
          let data = parent.childNodes[2].innerText
          let str = this.trim(data)
          this.popSearchInfo.serachDate = str
        } else {
          this.popSearchInfo.serachDate = ''
        }
        this.popSearchInfo.searcgFlag = Math.random()
        this.popSearchInfo.boxInfo.name = this.$t('webchat.KnowledgeSearch')
        this.popSearchInfo.boxInfo.open = true
      },
      closePopSearch (value) {
        this.popSearchInfo.boxInfo.open = value
      },
      copyKmContent () {
        let content = deepClone(this.sendChatMsg.content)
        let value = deepClone(this.copySerachValue)
        this.sendChatMsg.content = content + '' + value
      },
      changeChatMsgScroll () {
        this.$nextTick(function () {
          if (this.$route.path.split('/')[3] === 'webchat_todo' && document.getElementsByClassName('chat_msg').length) {
            this.scrollToBottom('chat_msg', 'msg_inner')
          }
        })
      },
      suggestListAdd (data) {
        this.sendChatMsg.content = data
        this.showSuggest = false
        this.selectIndex = -1
      },
      selectItem (event) {
        document.getElementsByClassName('suggest')[0].scrollTop = 0
        let keyWord = this.sendChatMsg.content
//        var sugliPane =suggestPane.find("li")
//        var currentSelIndex = parseInt(suggestPane.attr("ds_index"))
//        let oldSelIndex = -1
        if (keyWord === '') {
          this.showSuggest = false
          this.selectIndex = -1
          return
        } else {
          let liLength = this.listNeedShow.length    // 获取列表数量
          if ((event.keyCode === 38 || event.keyCode === 40) && this.showSuggest !== false) {
            if (liLength > 0) {
              // 上移
              if (event.keyCode === 38) {
                this.selectIndex -= 1
                if (this.selectIndex <= -1) {
                  this.selectIndex = this.listNeedShow.length - 1
                }
                if (this.selectIndex !== -1) {
                  this.sendChatMsg.content = this.listNeedShow[this.selectIndex].data
                  this.moveAutoCompItem(this.sendChatMsg.content)
                }
                document.getElementsByClassName('suggest')[0].scrollTop = 26 * (this.selectIndex - 3)
                this.listNeedShow.forEach((item) => {
                  item.flag = false
                })
                if (this.selectIndex >= 0) {
                  this.listNeedShow[this.selectIndex].flag = true
                }
              }
              // 下移
              if (event.keyCode === 40) {
                this.selectIndex += 1
                if (this.selectIndex > this.listNeedShow.length - 1) {
                  this.selectIndex = 0
                }
                if (this.selectIndex !== -1) {
                  this.sendChatMsg.content = this.listNeedShow[this.selectIndex].data
                  this.moveAutoCompItem(this.sendChatMsg.content)
                }
                document.getElementsByClassName('suggest')[0].scrollTop = 26 * (this.selectIndex - 3)
                this.listNeedShow.forEach((item) => {
                  item.flag = false
                })
                if (this.selectIndex >= 0) {
                  this.listNeedShow[this.selectIndex].flag = true
                }
              }
            }
          } else if (event.keyCode === 13) {
            if (this.showSuggest) {
              if (this.selectIndex === -1) {
                this.showSuggest = false
              } else {
                let showData = this.listNeedShow[this.selectIndex].data
                this.suggestListAdd(showData)
              }
            } else {
              this.handleSubmit()
            }
          } else {
            this.quickReplayAutoComplete(keyWord)
          }
//        }

        /**
         * 正在键入的通知
         */
//        var $form = $(src).closest("form");
//        var sid =  $form.find("[name=sid]").val();
//        var accessId =  $form.find("[name=accessId]").val();
//        var platform =  $form.find("[name=platform]").val();
//        var timestamp = new Date().getTime();
//        //判断是否少于一秒
//        var beforeTimestamp = $(src).attr("beforeTimestamp")|| 0;
//        if((timestamp-beforeTimestamp)>2000 && platform != "weixin"){
//          $(src).attr("beforeTimestamp",timestamp);
//          //发送消息；
//          var action = {
//            action: "app.webchat.typeNotice",
//            data: {sid:sid,timestamp:timestamp}
//          }
//          DS.send(action, function (rep) {
//            if (rep.success) {
//
//            } else {
//              $().alertmessage('showError', rep.message||errMsg)
//            }
//          },"POST")
        }
      },
      quickReplayAutoComplete (data) {
        let showLimit = 20
        let listNeedShow = [] // 需要显示的数据
        let wordLast = this.wordLast // 缓存的上个单词
        let word = this.sendChatMsg.content.replace(/\r\n/g, '').replace(/\n/g, '').replace(/(^\s*)|(\s*$)/g, '').replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\{/g, '\\{')
        let regWord = new RegExp('^' + wordLast)
        let isAddByLastWord = false // 是否是从上次单词连续输入的
        if (wordLast && word.match(regWord)) {
          isAddByLastWord = true
        }
        if (word) {
          let list = [] // 用来进行匹配的数据
          if (!this.wordLastList.length) { // 缓存的上个单词的语句的listgetAllQuickReplyList
            this.wordLastList = []
            this.wordLast = ''
          }
          if (!(isAddByLastWord && !this.wordLastList.length > 0)) { // 如果是从上次单词连续输入的，且上次单词没有匹配到结果，则不进行匹配
            if (isAddByLastWord) {
              list = this.wordLastList
            } else {
              list = this.$store.state.webchat.current.webchat_todo.allQuickReply.list
            }
            if (list) {
              this.wordLast = word
              this.wordLastList = []
              for (let i in list) {
                let content = list[i]
                let reg = new RegExp('^' + word)
                if (content && content !== '' && content.match(reg)) {
                  this.wordLastList.push(content)
                  if (listNeedShow.length < showLimit && listNeedShow.indexOf(content) < 0) {
                    listNeedShow.push({'data': content, 'flag': false})
                  }
                }
              }
            } else {
              let data = {
                'moduleType': 'webchat'
              }
              this.$store.dispatch('getAllQuickReplyList', data)
            }
          }
          this.listNeedShow = listNeedShow
          if (this.listNeedShow.length) {
            this.moveAutoCompItem(word)
          } else {
            this.showSuggest = false
            this.selectIndex = -1
          }
        } else {
          this.showSuggest = false
          this.selectIndex = -1
        }
      },
      moveAutoCompItem (keyWord) {
        let moveLeft = 14
        let fontSize = document.getElementsByClassName('send_msg_textarea')[0].style.fontSize.substr(0, 2) - 0
        let reg = /^[\u4e00-\u9fa5]+$/
        let flag = keyWord.split('')
        if (flag.length < 40) {
          for (let j = 0; j < flag.length; j++) {
            if (!reg.test(flag[j])) {
              moveLeft += fontSize / 2
            } else {
              moveLeft += fontSize
            }
          }
        } else {
          moveLeft = 200
        }
        document.getElementsByClassName('suggest')[0].style.bottom = '30px'
        document.getElementsByClassName('suggest')[0].style.left = moveLeft + 'px'
        this.showSuggest = true
      },
      getAllQuickReplay () {
        let flag = this.$store.state.webchat.current.webchat_todo.allQuickReply.flag
        if (flag) {
          let data = {
            'moduleType': 'webchat'
          }
          this.$store.dispatch('getAllQuickReplyList', data)
        }
      },
      addLisiner () {
        let that = this
        document.addEventListener('click', function (event) {
          if (document.getElementsByClassName('suggest').length) {
            that.showSuggest = false
            that.selectIndex = -1
          }
        })
        if (document.getElementsByClassName('send_msg_textarea').length) {
          document.getElementsByClassName('send_msg_textarea')[0].onpaste = this.pasteImg
        }
      },
      im_icon (obj) {
        let data = ''
        if (typeof obj === 'object') {
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
      chatTime (item) {
        let timeNew = item.showTime
        if (item.uidDesc) {
          timeNew += ` ${item.uidDesc}`
        }
        return timeNew
      },
      customerAddBlack () {
        let data = {}
        data.addBlackReason = this.sendChatMsg.addBlackReason
        data._id = this.webchatData._id
        data.sid = this.webchatData.sid
        if (!this.sendChatMsg.addBlackReason) {
          this.$message.error('封禁原因必须填写封禁原因必须填写')
          return
        }
        this.$store.dispatch('customerAddBlack', data).then((res) => {
          if (res && res.success) {
            this.chatHead.endSessionFlag = true
            this.endSessionFun(true, true)
            this.sendChatMsg.addBlackReason = ''
            this.sendChatMsg.dialogVisible = false
          }
        })
      },
      showCustomerBlack () {
        this.sendChatMsg.addBlackReason = ''
        this.sendChatMsg.dialogVisible = true
      },
      playVoice (event) {
//        let pane = event.target
//        let audio =
//        if (pane.classList.contains('played')) {
//          audio.pause();
//          audio.currentTime = 0;
//          pane.removeClass("played");
//          pane.find(".audio_play").hide();
//          pane.find(".audio_default").show();
//        }
//        if (pane.hasClass("played")) {
//          audio.pause();
//          audio.currentTime = 0;
//          pane.removeClass("played");
//          pane.find(".audio_play").hide();
//          pane.find(".audio_default").show();
//        } else {
//          container.find(".audio_item").each(function(){
//            this.pause();
//            this.currentTime = 0;
//            var _p=$(this).closest(".chat_popover.voice");
//            _p.removeClass("played");
//            _p.find(".audio_play").hide();
//            _p.find(".audio_default").show();
//          });
//          audio.play();
//          pane.addClass("played");
//        }
      },
      changeVoicePlay (chatMsg, flag) {
        let arr = this.$route.path.split('/')
        let tabType = arr[3]
        let _id = arr[4]
        if (!chatMsg.play) {
          this.$store.commit(types.RESET_USER_HISTORY_VOICE_PLAY, {tabType: tabType, _id: _id})
          this.$store.commit(types.SET_CHAT_VOICE_PLAY, {tabType: tabType, _id: _id, when: chatMsg.when, data: true, flag: flag})
        } else {
          this.$store.commit(types.SET_CHAT_VOICE_PLAY, {tabType: tabType, _id: _id})
          this.$store.commit(types.SET_CHAT_VOICE_PLAY, {tabType: tabType, _id: _id, when: chatMsg.when, data: false, flag: flag})
        }
      },
      startVideoChat () {
        if (this.isVideoing || this.isInviteVideo) {
          this.VideoTipsDialog = true
          this.VideoActionTips = '请先结束已存在的视频通话或视频邀请！'
          return
        }
        let msg = {
          currUser: this.webchatData.user,
          sid: this.webchatData.sid,
          sessionId: this.webchatData._id,
          sName: this.webchatData.sName
        }
        this.$store.dispatch('requestVideoChat', msg)
      },
//      VideoDesc (data) {
//        if (data === 'cancel') {
//          return '视频通话已取消'
//        } else if (data === 'refuse') {
//          return '对方未接听通话'
//        } else if (data === 'Hangup') {
//          return '通话时长'
//        } else {
//          return '视频通话已取消'
//        }
//      },
//      videoTimeCom (time) {
//        console.log(time)
//        var hours = Math.floor(time / (3600 * 1000))
//        var hoursleft = time % (3600 * 1000)
//        var minutes = Math.floor(hoursleft / (60 * 1000))
//        var minutesleft = hoursleft % (60 * 1000)
//        var seconds = Math.round(minutesleft / 1000)
//        var h = hours > 9 ? hours : '0' + hours
//        var m = minutes > 9 ? minutes : '0' + minutes
//        var s = seconds > 9 ? seconds : '0' + seconds
//        return h + ':' + m + ':' + s
//      },
      preloadedMsgConChange () {
        if (this.preloadedMsgCon && this.preloadedMsgCon !== 'undefined') {
          this.preloadedTitle = true
          let that = this
          setTimeout(function () {
            that.preloadedTitle = false
          }, 5000)
        } else {
          let arr = this.$route.path.split('/')
          let _id = arr[4]
          this.$store.commit(types.UPDATE_PRELOADED_MSG_FLAG, {_id: _id, value: false})
        }
      },
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
      timeScroll (event) { // 滚动加载更多浏览轨迹
        let nScrollHight = 0
        let nScrollTop = 0
        let nDivHight = event.target.offsetHeight
        nScrollHight = event.target.scrollHeight
        nScrollTop = event.target.scrollTop
        if (nScrollTop + nDivHight >= nScrollHight) {
          let that = this
          this.$store.dispatch('loadUbaInfo', {_id: this.webchatData._id, ubaSessionId: this.ubaSessionId, tabType: this.tabType}).then((sessionId) => {
            if (sessionId) {
              that.ubaInfoList = that.$store.state.webchat.current.webchat_todo.ubaInfoList[sessionId]
            }
          })
        }
      },
      newUrl (url) {
        return url.replace('http://', '//')
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      $route (to, form) {
        if (to.path.split('/')[2] === 'webchat') {
          this.fetchData()
        }
        this.wordLast = ''
        this.sendChatMsg.content = ''
        this.chatMsgCon.font = window.localStorage.getItem('imFontCon')
        if (!this.chatMsgCon.font) {
          this.chatMsgCon.font = 'font14'
        }
      },
      'inputRandom': 'copyKmContent',
      'webchatUserHistory': 'changeChatMsgScroll',
      'preloadedMsgCon': 'preloadedMsgConChange'
    },
    components: {
      CustomerAvatar,
      EmojiFace,
      WebchatTimer,
      EndSessionBox,
      BigImage,
      WebchatChatVoice,
      PopDragSearch,
      webChatTimeLine
    },
    computed: {
      webchatUserHistory () {
        let arr = this.$route.path.split('/')
        let tabType = arr[3]
        let _id = arr[4]
        if (tabType === 'webchat_todo') {
          return this.$store.state.webchat.current[tabType].messageList[_id]
        } else {
          return this.$store.state.webchat.current[tabType].messageList
        }
      },
      sysQuickReply () {
        let arr = []
        arr = this.$store.getters.getSysQuickReply || []
        return arr
      },
      customQuickReply () {
        let data = this.$store.getters.getCustomQuickReply
        return data
      },
      agentName () {
        let agents = this.$store.state.session.dicMap.agents
        let current = ''
        for (let i in agents) {
          if (agents[i]._id === this.webchatData.user) {
            current = agents[i].displayName
            break
          }
        }
        return current
      },
      agentNum () {
        let agents = this.$store.state.session.dicMap.agents
        let current = ''
        for (let i in agents) {
          if (agents[i]._id === this.webchatData.user) {
            current = agents[i].loginName
            break
          }
        }
        return current
      },
      webchatCustData () {
        if (this.tabType === 'webchat_todo') {
          return this.$store.state.webchat.current[this.tabType].currentSession[this.sessionId].currentCustomer || {}
        } else {
          return this.$store.state.webchat.current[this.tabType].currentCustomer || {}
        }
      },
      historyList () {
        if (this.tabType === 'webchat_todo') {
          return this.$store.state.webchat.current[this.tabType].historyMsgList[this.sessionId]
        } else if (this.tabType === 'webchat_all') {
          return this.$store.state.webchat.current[this.tabType].historyMsgList || []
        }
      },
      preloadedMsgCon () {
        if (this.tabType === 'webchat_todo') {
          return this.$store.state.webchat.current[this.tabType].currentSession[this.sessionId].preloadedMsgCon || ''
        }
      },
      preloadedFlag () {
        if (this.tabType === 'webchat_todo') {
          this.scrollToBottom('chat_msg', 'msg_inner')
          return this.$store.state.webchat.current[this.tabType].currentSession[this.sessionId].preloadedFlag
        }
      },
      chatMethod () {
        let platform = ''
        if (this.webchatData.platform === 'pc') {
          platform = this.$t('webchat.platformPc')
        } else if (this.webchatData.platform === 'wap') {
          platform = this.$t('webchat.platformWap')
        } else if (this.webchatData.platform === 'sdk') {
          platform = this.$t('webchat.platformApp')
        } else if (this.webchatData.platform === 'weixin') {
          platform = this.$t('webchat.platformWeixin')
        } else {
          platform = this.$t('webchat.platformOther')
        }
        return platform
      },
      inputRandom () {
        return this.$store.state.webchat.transCache.copyImSearchValue.random
      },
      copySerachValue () {
        return this.$store.state.webchat.transCache.copyImSearchValue.value
//      },
//      webchatUserHistory () {
//        let arr = this.$route.path.split('/')
//        let tabType = arr[3]
//        let _id = arr[4]
//        if (tabType && _id) {
//          return this.$store.state.webchat.current[tabType].messageList[_id]
//        }
      }
    },
    beforeMount () {
      this.fetchData()
      this.$store.commit(types.SET_RIGHTDETAL_FLAG, {data: true})
      this.chatMsgCon.font = window.localStorage.getItem('imFontCon')
      if (!this.chatMsgCon.font) {
        this.chatMsgCon.font = 'font14'
      }
    },
    mounted () {
      if (this.tabType === 'webchat_todo' && document.getElementsByClassName('send_msg_textarea')) {
        this.initUploadWebchatFile()
        this.initUploadWebchatImg()
        this.getAllQuickReplay()
        this.addLisiner()
        if (document.getElementsByClassName('send_msg_textarea').length) {
          document.getElementsByClassName('send_msg_textarea')[0].addEventListener('paste', this.pasteImg)
        }
      }
    },
    updated () {
      if (this.tabType === 'webchat_todo' && document.getElementsByClassName('send_msg_textarea').length) {
        if (document.getElementsByClassName('send_msg_textarea')[0]) {
          document.getElementsByClassName('send_msg_textarea')[0].addEventListener('paste', this.pasteImg)
        }
      }
    },
    activated () {
      if (this.tabType === 'webchat_todo') {
        document.getElementsByClassName('send_msg_textarea')[0].addEventListener('paste', this.pasteImg)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .chat_info_box
    overflow hidden
  .chat_info_box .chat_info_label
    display inline-block
  .chat_msg_box
    border-right 1px solid #d3d3d3
  .active
    background #e8f5fc
  .chat_top
    position relative
    height 44px
    box-sizing border-box
    border-bottom 1px solid #d9d9d9
  .chat_top_head
    float left
    height 40px
    max-width 100%
    box-sizing border-box
    position relative
    line-height 44px
  .chat_transfer
    float right
  .avatar
    position absolute
    left 0
  .title
    margin-left 14px
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
      margin 5px 6px 0
      line-height 30px
      color $cf-gray5
    .icon-tuichu
      margin-right 10px
  .chatMsgCon
    border-bottom 1px solid #d9d9d9
  .chat_msg
    padding 14px 16px
    box-sizing border-box
    overflow auto
  .webchat_todo_conbox
    .chat_msg
      height calc( 100vh - 331px)
  .webchat_all_conbox
    .chat_msg
      height calc( 100vh - 328px + 97px)
  .chat_item
    position relative
    width 70%
    padding-left 34px
  .chat_user_info
    position absolute
    left 0
    top 6px
    .chat_time
      position absolute
      white-space nowrap
      font-size 12px
      color #737373
      top -22px
      left 56px
  .chat_user_img
    border-radius 50%
    width 40px
    height 40px
    overflow hidden
    background url("../../public-modules/contact-summary/img/agent.png") no-repeat 50% 50%
    background-size 32px auto
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
    padding 8px 12px
    position relative
    margin-left 10px
    border-radius 14px
    background #cce5ff
    display inline-block
    color #000
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
  .chatPreloadedMsg
    margin-bottom 20px
    .chat_content
      background #1cd0e0
    .chat_content_arrow
      border 5px solid #1cd0e0
      border-color #1cd0e0 transparent transparent #1cd0e0
  .chat_user_info_out
    position absolute
    right 0
    top -2px
    .chat_time
      position absolute
      white-space nowrap
      font-size 12px
      color #737373
      right 56px
      top -16px
  .chat_item.out
    padding-right 38px
    float right
    .chat_user_img
      border-radius 50%
      width 32px
      height 32px
      float right
    .chat_content
      float right
      background #f0f0f0
      margin 0 5px 0 0
      color #000
  .chat_content_arrow_out
    border-left 6px solid #f0f0f0
    border-top 6px solid transparent
    border-bottom 6px solid transparent
    border-right 6px solid #f0f0f0
    content ' '
    position absolute
    width 0
    height 0
    right -9px
    top 10px
    border-radius 1px
    transform rotate(83deg)
    border 5px solid #f0f0f0
    border-color transparent transparent #f0f0f0 #f0f0f0
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
      background #f0f0f0
      color #000
  .chat_msg_con
    textarea
      resize none
  .el-form-item
    margin 0
  .replyMsg
    float right
    margin-right 12px
  .msg_do
    margin 0 10px 0
    float left
    color $cf-gray5
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
    position relative
    .chat_info_all,.chat_info_todo
      box-sizing border-box
      height calc(100vh - 190px)
    .chat_info_todo
      overflow-y hidden
      padding 8px 14px 0
    .chat_info_all
      padding 10px 14px 0
    .chat_info_todo:before
      content ''
      height 1px
      width 124%
      background #d3d3d3
      position absolute
      top 43px
      left -20px
      z-index 1
    .chat_auxiliary_info
      /*padding-bottom 10px*/
      line-height 18px
      h3 + .chat_auxiliary_box
        a
          color #71ccba
  .chat_info_li_title,.chat_auxiliary_title,.chat_info_all i
    color $cf-gray3
    font-style normal
  .chat_info_li_con,.chat_auxiliary_from
    color $cf-gray3
    float right
  .chat_info_li_remarks
    resize none
    font-size 12px
    box-sizing border-box
    width 100%
    margin-top 6px
    border-color $cf-gray5
    padding 6px
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
    color $cf-gray3
  .quickReLi:before
    content '\ '
    background #7dccd1
    width 4px
    height 4px
    position absolute
    left 10px
    top 8px
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
    color $cf-gray1
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
  .transfer_li_ul
    .transfer_li
      padding-left 18px
      color $cf-gray3
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
      height 40px
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
    z-index 100
    li
      line-height 26px
      box-sizing border-box
      padding 0 6px
      font-size 12px
    li:hover
      background #d7f2fd
    li.active
      background #d7f2fd
    .cursor_li
      cursor pointer

    .cursor_li:before
      width 4px
      height 4px
      content ""
      background #7ecdd2
      margin 0 5px
      margin: 11px 5px
      float: left
  .send_msg_textarea
    font-size 12px
  .client_msg
    height 36px
  .transfer_li_ul
    .transfer_li
      .cata-name
        display inline-block
        width 100%
  .cursor_li
    cursor pointer
  .webchat_todo_conbox
    .basic_info
      padding-top 8px
      max-height calc( 100vh - 246px)
      box-sizing border-box
      overflow auto
      h3
        margin-bottom 6px
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
    .divided_text
      background #fff
      position relative
      .divided_line_left,.divided_line_right
        position absolute
        width 100px
        border-bottom 1px dashed #a6a6a6
        display inline-block
        top 8px
      .divided_line_left
        left 100%
      .divided_line_right
        right 100%
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
    .quickBoxTit,.quickreplay_custome_title
      color $cf-gray2
      font-size 14px
      font-weight bold
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
      margin-bottom 5px
      padding-right 4px
      box-sizing border-box
    .chat_info_li.chat_info_li_title
      display inline-block
    .chat_info_remark
      margin 8px 0 6px
      .chat_info_li_remarks
        border-radius 3px
  .chat_info_all
    height calc( 100vh - 198px)
    overflow auto
    h3
      padding-bottom 20px
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
    color $cf-gray3
    font-size 12px
    padding 3px 0
  .sys_quick_li
    position relative
    color $cf-gray1
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
    color #000
    .chat_title_time
      margin-left 16px
      font-size 12px
      color $cf-gray4
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
  .chat_info .titleInfo
    cursor pointer
    font-weight bold
    color $cf-gray2
    .el-icon-minus,.el-icon-plus
      color #808080
  .chat_item.in a
    color #fff
  .chat_item.out a
    color #666
  .investigate_con
    span
      float none
      vertical-align bottom
  .el-dialog__wrapper
    z-index 30001 !important
  .VideoTips
    .el-dialog__body
      .tipsword
        text-align center
        font-size 16px
        margin 10px 0
      .tipsbutton
        text-align center
        padding-top 15px
    .el-dialog__header
      padding-bottom 20px
      border-bottom 1px solid #a1a1a1
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
    height calc(100vh - 550px)
    max-height: 400px
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
  .webchat_chat_info
    textarea::-webkit-input-placeholder
      color $cf-gray5
  .chat_info_all_title
    font-weight bold
    font-size 14px
    color $cf-gray2
    height 44px
    box-sizing border-box
    padding 14px
    border-bottom 1px solid $c-border1
</style>
