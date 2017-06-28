<template>
  <div class="invite_box">
    <div class="beInvited" v-show="invitedFlag">
      <div class="invite_text">
        <span class="invite_customer">{{inviteUserName}}</span>邀您加入多方会话
      </div>
      <div class="invite_btn">
        <el-button type="primary" class="refuse" size="small" @click=refusedGroupSession()>{{$t('public.refuse')}}</el-button>
        <el-button type="primary" class="accept" size="small" @click=acceptGroupSession()>{{$t('public.accept')}}</el-button>
      </div>
    </div>
    <div class="invited_people" v-show="kickInvitedFlag">
      <div class="invite_text">
        正在邀请<span class="invite_customer">{{inviteUserName}}</span>加入多方会话
      </div>
      <div class="invite_btn">
        <el-button type="primary" class="refuse" size="small" @click=kickGroupSession()>{{$t('public.cancel')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import * as types from '../../../store/modules/webchat/mutation-types.js'
  export default({
    name: 'InviteConversation',
    data () {
      return {
      }
    },
    computed: {
      inviteUserName () {
        return this.$store.state.webchat.current.webchat_todo.inviteUserName
      },
      sessionId () {
        return this.$store.state.webchat.current.webchat_todo.inviteSessionId
      },
      sid () {
        return this.$store.state.webchat.current.webchat_todo.sid
      },
      toPeer () {
        return this.$store.state.webchat.current.webchat_todo.toPeer
      },
      kickInvitedFlag () {
        return this.$store.state.webchat.current.webchat_todo.kickInvitedFlag
      },
      invitedFlag () {
        return this.$store.state.webchat.current.webchat_todo.invitedFlag
      }
    },
    methods: {
      kickGroupSession () {
        let self = this
        this.$store.dispatch('cancelGroupSession', {_id: this.sessionId}).then(() => {
          this.$store.dispatch('changeInvite', false)
          self.$store.commit(types.SHOW_KICK_NOTIFY, false)
        })
      },
      acceptGroupSession () {
        let self = this
        this.$store.dispatch('acceptGroupSession', {_id: this.sessionId, sid: this.sid, toPeer: this.toPeer}).then(() => {
          this.$store.dispatch('changeInvite', false)
          self.$store.commit(types.SHOW_INVITE_NOTIFY, false)
          self.$router.push('/index/webchat/webchat_todo/' + self.sessionId + '/')
        })
      },
      refusedGroupSession () {
        let self = this
        this.$store.dispatch('refusedGroupSession', {_id: this.sessionId}).then(() => {
          this.$store.dispatch('changeInvite', false)
          self.$store.commit(types.SHOW_INVITE_NOTIFY, false)
        })
      }
    }
  })
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .invite_box
    background #fff
    position absolute
    width 300px
    height 150px
    border-radius 2px
    border 1px solid #D3DCE6
    padding 30px
    z-index 2000
    font-size 12px
    box-shadow 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
    right 4px
    top 4px
    box-sizing border-box
  .refuse
    background #7bcdd2
    border 1px solid #7bcdd2
  .accept
    background $c-main
    bors(1px,$c-main)
  .invite_text
    font-size 18px
    text-align center
  .invite_btn
    text-align center
    margin-top 10px
    font-size 14px
    .refuse,.accept
      width 100px
      height 34px
      font-size 14px
</style>
