<template>
  <div class="videoInvite">
    <div class="cust_type">
      <customer-avatar :status="cust_status" :size="30" class="fl"></customer-avatar>
      <h2 class="name">{{name}}</h2>
    </div>
    <h3 class="invite">对方正在邀请您进行视频会话</h3>
    <div class="tool">
      <el-tooltip class="item" effect="dark" content="定位到聊天窗口" placement="bottom">
        <span class="iconfont icon-duihua1 location cursorpointer" @click="location"></span>
      </el-tooltip>
      <el-button class="button cancelbutton" @click="rejectVideo">拒绝</el-button>
      <el-button class="button" @click="acceptVideo">接听</el-button>
    </div>
  </div>
</template>

<script>
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import * as webchatTypes from '../../../store/modules/webchat/mutation-types'
  export default {
    name: 'videoInvite',
    data () {
      return {}
    },
    methods: {
      location () {
        this.$router.push({path: '/index/webchat/webchat_todo/' + this.videoInvitedData.videoInviteSessionid})
      },
      rejectVideo () {
        let msg = {
          _id: this.videoInvitedData.videoInviteSessionid,
          operation: 'refuse',
          originator: 'customer'
        }
        this.$store.dispatch('rejectVideoInvite', msg)
      },
      acceptVideo () {
        let videomsg = {
          videoSessionid: this.videoInvitedData.videoInviteSessionid,
          videoUsername: this.name,
          videoToken: this.videoInvitedData.videoInviteToken
        }
        this.$store.commit(webchatTypes.UPDATE_VIDEO_INVITE_STATUS, false)
        this.$store.commit(webchatTypes.UPDATE_VIDEO_CHAT_STATUS, true)
        this.$store.commit(webchatTypes.UPDATE_VIDEO_CHATDATA, videomsg)
      }
    },
    computed: {
      videoInvitedData () {
        return this.$store.state.webchat.videoInvitedData
      },
      name () {
        let self = this
        let name
        this.$store.state.webchat.webchatList.webchat_todo.list.forEach(function (item, index) {
          if (item._id === self.videoInvitedData.videoInviteSessionid) {
            name = item.sName
          }
        })
        return name
      },
      cust_status () {
        let self = this
        let img
        this.$store.state.webchat.webchatList.webchat_todo.list.forEach(function (item, index) {
          if (item._id === self.videoInvitedData.videoInviteSessionid) {
            img = item.cust_status
          }
        })
        return img
      }
    },
    components: {
      CustomerAvatar
    }
  }
</script>

<style type="text/stylus" lang="stylus" scoped>
  .cursorpointer
    cursor pointer

  .videoInvite
    position fixed
    top 54px
    right 10px
    width 300px
    height 150px
    background-color white
    box-shadow 0 0 5px
    .cust_type
      flex: 1
      height: 32px
      margin-top 20px
      margin-left 10px
    .name
      display flex
      align-items center
      height 100%
      color #808080
      padding-left 12px
    .invite
      text-align center
      margin 15px 5px
      color #808080
    .tool
      margin 10px 10px
      .location
        margin 0 20px
        font-size 24px
        vertical-align middle
      :hover
        color #1abb9c
      .button
        color white
        background: #1abb9c
        width 80px
        padding 0
        border none
        height 30px
        font-size 14px
        margin-bottom 10px
      .cancelbutton
        background-color #7bcdd2


</style>
