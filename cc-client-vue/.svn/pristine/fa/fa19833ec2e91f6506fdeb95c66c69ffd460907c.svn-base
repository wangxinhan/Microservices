<template >
<div>
  <el-row type="flex" class="row-bg switch" justify="center">
    <el-col :span="6">
      <el-tooltip effect="dark" :content="$t('softPhoneBar.messageVoiceSwitch')" :openDelay="200" transition="fade-leave" placement="bottom">
      <span class="sw-note iconfont" @click="toggle('note')" v-bind:class="{ 'icon-kaiguan2' : note.isOn, 'icon-guan3': !note.isOn}"></span>
      </el-tooltip>
    </el-col>
    <el-col :span="6">
      <el-tooltip effect="dark" :content="$t('softPhoneBar.imLineUpNum')" :openDelay="200" transition="fade-leave" placement="bottom">
        <span class="sw-webchat iconfont" @click="toggle('webchat')" :class="[webchat.isOn === 'close' ? 'icon-guan' : 'icon-kaiguan1']">
          <el-badge :value="webchat.queueNum" :max="99" class="item" v-if="webchat.queueNum > 0">
          </el-badge>
        </span>
      </el-tooltip>
    </el-col>
    <el-col :span="6">
      <el-tooltip effect="dark" :content="$t('softPhoneBar.emailLineUpNum')" :openDelay="200" transition="fade-leave" placement="bottom">
        <span class="sw-email iconfont" @click="toggle('email')" v-bind:class="{ 'icon-kaiguan' : email.isOn, 'icon-guan2': !email.isOn}">
          <el-badge :value="email.queueNum" :max="99" class="item" v-if="email.queueNum > 0">
          </el-badge>
        </span>
      </el-tooltip>
    </el-col>
  </el-row>
</div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'Switches',
  data () {
    return {
      note: {
        isOn: true
      }
    }
  },
  computed: mapState(['webchat', 'email']),
  methods: {
    toggle (flag) {
      switch (flag) {
        case 'note':
          this.note.isOn = !this.note.isOn
          let loginInfo = JSON.parse(window.localStorage.loginForm)
          let form = {}
          form.isOn = this.note.isOn
          form.loginName = loginInfo.loginName
          window.localStorage[loginInfo.loginName] = JSON.stringify(form)
          break
        case 'webchat':
          let status = this.$store.state.webchat.isOn === 'open' ? 'close' : 'open'
          window.sessionStorage.webChatIsOn = status
          this.$store.dispatch('updateWebchatAutoClaimStatus', {status: status})
          break
        case 'email':
          this.$store.dispatch('updateEmailAutoClaimStatus', {emailStatus: !this.$store.state.email.isOn})
          break
      }
    }
  },
  mounted () {
    if (window.localStorage.loginForm) { // 获取用户存储的开关状态
      let loginInfo = JSON.parse(window.localStorage.loginForm)
      let JsonString = window.localStorage[loginInfo.loginName]
      if (JsonString) {
        let obj = JSON.parse(JsonString)
        let bool = obj.isOn
        this.note.isOn = bool
      }
    }
    if (window.sessionStorage.webChatIsOn) {
      let webChatIsOn = window.sessionStorage.webChatIsOn
      this.$store.dispatch('updateWebchatAutoClaimStatus', {status: webChatIsOn})
    }
  }
}
</script>
<style scoped lang="stylus">
@import "../../../assets/common.styl"
.item
  margin-top -65px
  margin-left 8px
.switch
  float left
  width 124px
  height 53px
  .el-col
    width 24px
    height 24px
    margin 15px 4px 0 4px
    color $c-main
    cursor pointer
    span
      display block
      height 100%
      font-size 20px
</style>
