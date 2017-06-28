<template>
  <div class="main-container" >
      <router-view v-if="!browser"></router-view>
      <masking></masking>
      <popup v-if="login && isPopup"></popup>
      <popdrag v-if="login"></popdrag>
      <download></download>
      <notify></notify>
      <invite-conversation v-if="login && inviteCon"></invite-conversation>
      <Browser v-if="browser"></Browser>
      <!-- <video-invite v-if="login&&inviteVideo"></video-invite>
      <video-drag v-if="login&&isVideoing"></video-drag> -->
      <el-dialog v-model="imgShow" size="full" @close="bigImgClose" :close-on-click-modal="true" :showshow-close="false" custom-class="bigimg">
        <div class="img-box" @click.stop="bigImgClose">
          <img :src="imgUrl" style="max-width: 100%">
        </div>
      </el-dialog>
      <iframe name="report_export_pdf_show_print" id="report_export_pdf_show_print" src="" style="display: none"></iframe>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import masking from 'components/ui-modules/mask/index'
  import popup from 'components/public-modules/popups/Popup.vue'
  import popdrag from 'components/public-modules/popups/PopDrag.vue'
  import download from 'components/public-modules/download/Download.vue'
  import notify from 'components/public-modules/notify/Notify.vue'
  import InviteConversation from 'components/public-modules/InviteConversation/InviteConversation.vue'
  import Browser from 'components/business-modules/login/Browser'
  import * as types from './store/mutation-types.js'
  // import videoInvite from 'components/business-modules/webchat/WebchatVideoInvite.vue'
  // import videoDrag from 'components/public-modules/popups/PopDragVideo.vue'
  export default {
    name: 'app',
    data () {
      return {
        browser: false
      }
    },
    watch: {
      exit (cur, pre) {
        if (cur) {
          this.msgDialog(this.$t(cur))
        }
      }
    },
    computed: {
      imgShow () {
        return this.$store.state.bigImg.imgShow
      },
      imgUrl () {
        return this.$store.state.bigImg.imgUrl
      },
      ...mapState({
        login: 'login',
        isPopup: 'isPopup',
        inviteCon: 'inviteCon',
        exit: 'exit'
      })
      // isVideoing () {
      //   return this.$store.state.webchat.isVideoing
      // },
      // inviteVideo () {
      //   return this.$store.state.webchat.isinviteVideo
      // }
    },
    methods: {
      closeImgDialog () {
        let msg = {
          show: false,
          url: ''
        }
        this.$store.commit(types.SET_BIGIMG, msg)
      },
      bigImgClose () {
        let msg = {
          show: false,
          url: ''
        }
        this.$store.commit(types.SET_BIGIMG, msg)
      },
      msgDialog (msg) {
        window.sessionStorage.clear()
        this.$alert(msg, this.$t('public.tip'), {
          confirmButtonText: this.$t('public.confirm'),
          type: 'warning',
          showCancelButton: false
        }).then(() => {
          window.location = '/'
        })
      }
    },
    components: {
      masking,
      download,
      popup,
      popdrag,
      notify,
      Browser,
      InviteConversation // ,
      // videoInvite,
      // videoDrag
    },
    created () {
      if (!window.fetch) {
        this.browser = true
      }
    }
  }
</script>
<style lang="stylus">
@import 'assets/reset.styl'
#app
  width 100vw
  height 100vh
  min-width 1024px
  box-sizing border-box
  font-family "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif
</style>
