<template>
  <div class="chat_popover-content">
    <audio class="audio_item" @ended="playEnd" @loadeddata="load" :src="chatMsg.message" preload="auto">您的浏览器不支持此播放器</audio>
    <div class="audio_play" v-if="playShow">
      <img src="./img/voice.gif" class="audio_img"><span class="audio_len muted"></span>
    </div>
    <div class="audio_default" v-if="!playShow">
      <img src="./img/voice.png" class="audio_img"><span class="audio_len muted"></span>
    </div>
  </div>
</template>
<script type="text/javascript">
  import * as types from '../../../store/modules/webchat/mutation-types.js'
  export default {
    name: 'WebchatChatVoice',
    data () {
      return {
        playShow: false
      }
    },
    props: {
      chatMsg: Object,
      chatFlag: String
    },
    watch: {
      playFlag (cur, pre) {
        this.changePlay()
      }
    },
    computed: {
      playFlag () {
        return this.chatMsg.play
      }
    },
    methods: {
      changePlay () {
        if (this.playFlag) {
          this.playShow = true
          this.$el.getElementsByClassName('audio_item')[0].play()
        } else {
          this.playShow = false
          this.$el.getElementsByClassName('audio_item')[0].pause()
          this.$el.getElementsByClassName('audio_item')[0].currentTime = 0
        }
      },
      playEnd () {
        let arr = this.$route.path.split('/')
        let tabType = arr[3]
        let _id = arr[4]
        this.playShow = false
        this.$store.commit(types.SET_CHAT_VOICE_PLAY, {tabType: tabType, _id: _id, when: this.chatMsg.when, data: false, flag: this.chatFlag})
      },
      load () {
        let audio = this.$el.getElementsByTagName('audio')[0]
        let timeLen = audio.duration
        timeLen = Math.ceil(parseFloat(timeLen))
        this.$el.getElementsByClassName('audio_len')[0].innerText = `${timeLen}"`
//        let _content = this.$el.getElementsByClassName('chat_popover-content')[0]
//        let w = _content.style.width
//        if (timeLen > 1) {
//          w += Math.ceil(timeLen * 5)
//          w = w > 360 ? 360 : w
//          _content.style.width = w
//        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .audio_default,.audio_play
    img
      vertical-align middle
    span
      vertical-align middle
</style>
