<template>
  <div class="webchat-card" :class="{'webchat-all': tabType !== 'webchat_todo'}">
    <el-menu
            :default-active = "defaultActive"
            @select="handleSelect"
            :router="active"
            class="el-menu-vertical-demo">
      <el-menu-item style="padding: 0" v-for="(item, index) in cardListRender" :index="handleSplit(item._id)" :class="{'is-active': $route.path.split('/')[4] === item._id}">
        <div class="card webchat_card">
          <label v-if="tabType === 'webchat_todo' && !(item.invitedUser && item.invitedUser === sessionId)" class="fake-checkbox" :class="{'visible': batch.isBatchShow}" v-on:click.stop="">
            <input type="checkbox" :value="item._id" v-model.trim="item.checked" @change="checkThis(item.checked)">
            <span></span>
            <i class="fake-label"></i>
          </label>
          <label v-else class="checkbox_label_alternative"></label>
            <span class="ct">
               <customer-avatar
                       :status="item.cust_status"
                       :size="20"
                       :isim=true
                       :im="{userStatus: item.userStatus, platform: item.platform }"
                       :queueNum="item.leakNum">
               </customer-avatar>
            </span>
          <div class="info">
            <ul class="info_ul">
              <li class="new_chat ellipsis font14"><span class="info_li_sname">{{item.sName}}</span>
                <span v-if="item.platform === 'pc'">({{$t('webchat.websiteCon')}})</span>
                <span v-if="item.platform === 'weixin'">({{$t('webchat.weChatCon')}})</span>
                <span v-if="item.platform === 'sdk'">({{$t('webchat.appCon')}})</span>
                <span v-if="item.platform === 'wap'">({{$t('webchat.wapCon')}})</span>
              </li>
              <li class="new_chat ellipsis card_chat_content" v-if="tabType === 'webchat_todo'">
                <span class="Cover"></span>
                <span class="chat_content" v-if="item.lastMessageUser!=='system'" v-html="lastMessageChange(item)"></span>
              </li>
              <li class="new_chat ellipsis agents_and_skill_group" v-if="tabType === 'webchat_all'">
                <div>
                  <span class="chat_info_name">{{agentName(item)}}</span ><span v-show="toPeer(item)">({{toPeer(item)}})</span>
                </div>
              </li>
              <li v-if="item.status === 'deal'">
                <!--if(row.status=="deal" && session.user._id == row.invitedUser){-->
                <!--desc = "被邀请"-->
                <!--}-->
                <span v-if="item.invitedUser && item.invitedUser === sessionId && item.inviteUserStatus === 'accept'" class="status_beinvited card_statu_li">{{$t('webchat.beInvited')}}</span>
                <span v-if="item.showInvite" class="status_invited_get card_statu_li">{{$t('webchat.InvitationGet')}}</span>
                <span v-else class="status_deal card_statu_li">{{$t('webchat.received')}}</span>
                <webchat-timer :isCard="true" :waitTime="item.waitTime" :showWaitTime="item.showWaitTime"></webchat-timer>
              </li>
              <li v-if="item.status === 'changePeer'">
                <span class="status_change card_statu_li">{{$t('webchat.transfer')}}</span>
                <webchat-timer :isCard="true" :waitTime="item.waitTime" :showWaitTime="item.showWaitTime"></webchat-timer>
              </li>
              <li v-if="item.status === 'finish'">
                <span v-if="item.showInvite " class="status_finish card_statu_li">{{$t('webchat.InvitationClosed')}}</span>
                <span v-else class="status_finish card_statu_li">{{$t('webchat.closed')}}</span>
                <!--<webchat-timer :isCard="true" :waitTime="item.waitTime" :showWaitTime="item.showWaitTime"></webchat-timer>-->
              </li>
              <li v-if="item.status === 'undeal'">
                <span class="status_finish card_statu_li">{{$t('webchat.undeal')}}</span>
              </li>
            </ul>
          </div>
          <div class="remark">
            <ul>
              <li class="date">{{item.chatTime}}</li>
            </ul>
          </div>
        </div>
      </el-menu-item>
    </el-menu>
    <no-record v-if="cardList && cardList.length<=0"></no-record>
    <!-- 批处理-->
    <div class="batch_cover" v-show="batch.isBatchShow"></div>
    <div class="batch_btm" v-show="batch.isBatchShow"></div>
    <div class="batch" :class="{'show': batch.isBatchShow}">
      <el-checkbox v-model.trim="batch.allChecked" @change="checkAll()">{{$t('public.checkAll')}}</el-checkbox>
      <card-batch v-if="batch.operator"
                  :tabType="tabType"
                  :batchOperator="batch"
                  @checkNone="checkNone"
                  @getFinishReason="getFinishReason"
              ></card-batch>
    </div>
    <end-session-box :info="batchFinish" @endSession="endSessionFun" @changeEndSiFlag="changeEndSessionFlag"></end-session-box>
  </div>
</template>
<script type="text/javascript">
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import WebchatTimer from 'components/business-modules/webchat/WebchatTimers'
  import { formatShortTime, deepClone, getCache, getCacheByKey } from '../../../utils/m7Utils.js'
  import CardBatch from 'components/public-modules/card/CardBatch'
  import EndSessionBox from '../../public-modules/ImEndSessionBox/EndSessionBox'
  import NoRecord from 'components/public-modules/card/NoRecord'
  import { renderEmoji } from '../../../utils/webchat.js'
  export default {
    name: 'WebchatCard',
    props: {
      tabType: String,
      cardList: Array,
      type: String,
      clearChecked: String
//      webchatJump: {
//        type: Boolean,
//        default: false
//      }
    },
    watch: {
      // clearChecked 变化 再次执行
      clearChecked: 'checkNone',
      // cardList 变化 再次执行
      cardList () {
        this.defaultActive = this.$route.path
        this.checkNone()
//        this.webchatJumpClick()
      },
//      webchatJump: 'webchatJumpClick',
      $route (to, form) {
        if (to.path.split('/')[2] === 'webchat') {
          this.defaultActive = to.path
        }
      }
    },
    components: {
      CustomerAvatar,
      WebchatTimer,
      CardBatch,
      NoRecord,
      EndSessionBox
    },
    data () {
      return {
        loading: true,
        checked: false,
        isCheckbox: false,
        noName: false,
        defaultActive: '',
        active: true, // 是否使用路由
        batch: {
          batchItem: [],
          allChecked: false,
          isBatchShow: false,
          checkedCount: 0,
          operator: [
            {name: 'webchat.endSession', class: 'icon-tuichu', action: 'getFinishReason'}
          ]
        },
        batchFinish: {
          dialogTableVisible: false,
          endOptionsUl: [],
          majorstwo: [],
          majorsthree: [],
          isActiveOne: '999',
          isActiveTwo: '999',
          isActiveThree: '999',
          endSessionActive: [],
          endSessionFlag: false,
          endSessionLength: 0
        }
      }
    },
    computed: {
      cardListRender () {
        for (let i = 0; i < this.cardList.length; i++) {
          let item = this.cardList[i]
          item.chatTime = this.chatTime(item)
        }
        return this.cardList
      },
      showCard () {
        return this.$store.state.showCard
      },
      sessionId () {
        return this.$store.state.session.sessionId
      },
      allCheckLength () {
        let length = this.cardList.length
        let that = this
        this.cardList.forEach((item) => {
          if (item.invitedUser && item.invitedUser === that.sessionId) {
            length--
          }
        })
        if (length < 0) {
          length = 0
        }
        return length
      }
    },
    methods: {
      showAllCheckbox (event) {
        this.$store.commit('showCard', this.checked)
      },
      handleSplit (index) {
        let path = ''
        if (this.tabType === 'webchat_todo') {
          path = '/index/' + this.type + '/' + this.tabType + '/' + index + '/webchat?flag=list'   //  点击在线咨询能够定位到上一次点击的位置
        } else {
          path = '/index/' + this.type + '/' + this.tabType + '/' + index
        }
        return path
      },
      chatTime (item) {
        let shortTime = formatShortTime(item.createTime)
        return shortTime.name
      },
      handleSelect () {
//        let val = true
//        this.$store.commit(types.SET_RIGHTDETAL_FLAG, {data: val})
        this.$emit('changeCardItem')
      },
      getChecked () { // 单选获取数组
        let that = this
        return this.cardList.filter(item => item.checked).map((item) => {
          if (!(item.invitedUser && item.invitedUser === that.sessionId)) {
            return {_id: item._id, sid: item.sid}
          }
        })
      },
      checkThis (checked, event) { // 单个选中传送数组和展示批量
        let checkedArr = this.getChecked()
        let isBatchShow = checkedArr.length > 0
        this.batch.allChecked = checkedArr.length === this.allCheckLength
        this.batch.batchItem = checkedArr
        this.batch.isBatchShow = isBatchShow
        this.batch.checkedCount = checkedArr.length
      },
      checkAll () { // 全选&取消全选
        this.batch.isBatchShow = this.batch.allChecked
        this.cardList.forEach((item) => {
          item.checked = this.batch.allChecked
        })
        this.batch.batchItem = this.getChecked()
        if (this.batch.allChecked) {
          this.batch.checkedCount = this.allCheckLength
        } else {
          this.batch.allChecked = 0
        }
      },
      checkNone () {
        this.batch.allChecked = false
        this.batch.batchItem = []
        this.batch.isBatchShow = false
        this.cardList.forEach((item) => {
          item.checked = false
        })
      },
      getFinishReason () {
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
          this.batchFinish.endSessionLength = 1
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
            this.batchFinish.endSessionLength = 2
            if (three) {
              this.batchFinish.endSessionLength = 3
            }
          }
          this.batchFinish.endOptionsUl = _dics
          this.batchFinish.dialogTableVisible = true
          this.batchFinish.majorstwo = []
          this.batchFinish.majorsthree = []
          this.batchFinish.isActiveOne = ''
        })
      },
      endSessionFun (flag) {
        if (flag) {
          if (this.batchFinish.endSessionFlag === false) {
            this.$message.error(this.$t('public.chooseEndSession'))
            return
          } else {
            let arr = this.batchFinish.endSessionActive
            let actName = ''
            let finishKey = ''
            if (arr.length > 2) {
              let one = arr[0]
              let two = arr[1]
              let three = arr[2]
              actName = this.batchFinish.endOptionsUl[one].options[two].options[three].name
              finishKey = this.batchFinish.endOptionsUl[one].options[two].options[three].key
            } else if (arr.length === 2) {
              let one = arr[0]
              let two = arr[1]
              actName = this.batchFinish.endOptionsUl[one].options[two].name
              finishKey = this.batchFinish.endOptionsUl[one].options[two].key
            } else {
              let one = arr[0]
              actName = this.batchFinish.endOptionsUl[one].name
              finishKey = this.batchFinish.endOptionsUl[one].key
            }
            let data = {
              finishiArr: deepClone(this.batch.batchItem),
              finishReason: actName,
              finishKey: finishKey,
              remark: ''
            }
            this.$store.dispatch('finishWebchatSession', data).then(() => {
              let list = this.$store.state.webchat.webchatList.webchat_todo.list
              let flag = true
              let session = window.sessionStorage
              list.forEach((item, index) => {
                if (item._id === this.$route.path.split('/')[4]) {
                  flag = false
                }
              })
              if (flag) {
                let callData = {url: '/index/webchat/webchat_todo', flag: false}
                session.setItem('webchat', JSON.stringify(callData))
              }
              this.$router.replace({path: '/index/webchat/webchat_todo'})
            })
            this.batchFinish.dialogTableVisible = false
            this.batchFinish.endSessionFlag = false
            this.batchFinish.endSessionActive = []
            this.checkNone()
          }
        } else {
          this.batchFinish.endSessionFlag = false
          this.batchFinish.endSessionActive = []
          this.batchFinish.dialogTableVisible = false
        }
      },
      changeEndSessionFlag (value) {
        this.batchFinish.endSessionFlag = value
      },
      lastMessageChange (wxObj) {
        let flag = true
        let value = ''
        if (wxObj.contentType) {
          if (wxObj.contentType === 'text') {
            if (wxObj.sName === '访客留言') {
              value = '[留言]'
            } else {
              value = wxObj.lastMessage
            }
          }
          if (wxObj.contentType === 'file') {
            value = '[文件]'
          }
          if (wxObj.contentType === 'image') {
            value = '[图片]'
          }
          if (wxObj.contentType === 'voice') {
            value = '[语音]'
          }
          if (wxObj.contentType === 'imcsr' || wxObj.contentType === 'saveImCSRInfo') {
            value = '[评价]'
          }
          if (wxObj.contentType === 'iframe') {
            value = '[网页]'
          }
        } else {
          if (wxObj.sName === '访客留言') {
            value = '[留言]'
          } else {
            value = wxObj.lastMessage
          }
        }

        return renderEmoji(value, flag)
      },
      toPeer (data) {
        let peerId = data.toPeer || data.ToPeer
        let peer = getCacheByKey('mailQueues', 'Exten', peerId)
        let peerName = ''
        if (peer) {
          peerName = peer.DisplayName
        }
        return peerName
      },
      agentName (data) {
        let agent = getCache('agents', data.user)
        let agentDisplayName = ''
        if (agent) {
          agentDisplayName = agent.displayName
        }
        return agentDisplayName
      }
    },
    beforeMount () {
    },
    beforeUpdate () {
      //  获取缓存中保存的路由
      let session = window.sessionStorage
      if (!session.getItem('webchat')) {
        return
      }
      let _id = ''
      let arr = JSON.parse(session.getItem('webchat')).url.split('/')   //  从路由中获取到上次页面的会话id
      if (arr.length > 3) {
        _id = arr[4]
      }
      //  上次路由为true的状态   并且  当前不是时间检索的状态   并且  保存的路由是webchat_todo的       && !this.$store.state.webchat.onTimeSearch
      if (JSON.parse(session.getItem('webchat')).flag && this.$route.fullPath.split('/')[3] === 'webchat_todo') {
        let list = this.$store.state.webchat.webchatList.webchat_todo.list
        let num = 0
        let flag = false
        let dom = document.getElementsByClassName('el-menu-vertical-demo')
        let domLis = []
        if (dom.length) {
          domLis = dom[0].getElementsByClassName('webchat_card')
        }
        // dom的length和消息列表中的length相同  代表加载完成了
        if (domLis.length === list.length) {
          list.forEach((item, index) => {
            if (item._id === _id) {
              num = index
              flag = true
            }
          })
          if (flag) {
            document.getElementsByClassName('el-menu-vertical-demo')[0].getElementsByClassName('webchat_card')[num].click()
            // 点击之后更改session的flag为false避免重复加载
            let webchatObj = JSON.parse(session.getItem('webchat'))
            webchatObj.flag = false
            session.setItem('webchat', JSON.stringify(webchatObj))
          }
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .webchat-card
    /*height 100%*/
  .el-menu-item
    height auto
    line-height inherit
    padding 0
  .is-active
    background-color red
  .el-menu-item.is-active
    background-color #e8f5fc
  .el-menu-item.is-active
    .card
      background-color #e8f5fc
  .card:hover
  .card:active
    background-color #e8f5fc
    label
      visibility visible
  .card
    padding-left 10px
    box-sizing border-box
    width 100%
    height 76px
    border-bottom 1px solid #d9d9d9
    background-color #fff
    display flex
    cursor pointer
    .el-checkbox
      visibility hidden
    .e-ch-show
      visibility visible
    .ct
      display inline-block
      box-sizing border-box
      padding-top 26px
      margin-right 14px
    .info
      flex 8
      display flex
      align-items center
      ul
        padding-left 2px
        li
          margin-bottom 1px
          color #000
          .card_statu_li
            color #fff
        .card_chat_content
          margin-bottom 7px
        .agents_and_skill_group
          margin-bottom 7px
      .new_chat.font14
        font-weight 500
      .new_chat
        max-width 12em
        position relative
        .Cover
          position absolute
          display inline-block
          width 100%
          height 100%
          z-index 2
    .remark
      flex 4
      ul
        float right
        margin-right 8px
        li
          margin-top 13px
          .el-icon-star-on
            color #f2cc47

    .date
      color $cf-gray4
  .card_statu_li
    display inline-block
    width auto
    height 20px
    line-height 20px
    color #fff
    background #fbd293
    text-align center
    border-radius 4px
    padding 0 8px
  .status_finish
    background #cdcdcd
  .status_change
    background #009fe3
  .status_deal
    background #7bcdd2
  .status_beinvited
    background #f6a423
  .status_invited_get
    background #5dc860
  .card_chat_content
    max-height 2.2em
  .chat_content
    color $cf-gray3
  .fake-checkbox
    input
      top 10px
      left 1px
    span
      top 10px
      left 1px
  .agents_and_skill_group
    margin-bottom 5px
  .info_li_sname
    color $cf-gray1
</style>
