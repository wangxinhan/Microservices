<template>
  <div>
    <div class="video" :class="{videosmall:smallMode}" id="video">
      <div id="dragbar" class="dragbar" v-show="dragbarShow"></div>
      <div class="minimg" v-show="!smallMode" @click="small"><img src="../../../assets/img/small.png"></div>
      <img src="../../../assets/img/big.png" class="maximg" v-show="smallMode" @click="maxMode">
      <iframe :src="url" frameborder="0" width="100%" height="100%"></iframe>
    </div>
  </div>
</template>
<script>
  import * as types from '../../../store/modules/webchat/mutation-types.js'
  let tWidth, tHeight
  window.onresize = function () {
    tWidth = document.body.clientWidth
    tHeight = document.body.clientHeight
  }
  export default({
    data () {
      return {
        swit: true,
        smallMode: false,
        dragbarShow: true,
        params: {
          left: 0,
          top: 0,
          currentX: 0,
          currentY: 0,
          flag: false
        },
        dragWidth: 0,
        dragHeight: 0
      }
    },
    computed: {
      Username () {
        return this.$store.state.webchat.videoChatData.videoUsername
      },
      url () {
        return 'https://rtctest.7moor.com/?token=' + this.$store.state.webchat.videoChatData.videoToken + '&role=2&Username=' + this.Username
      },
      sessionId () {
        return this.$store.state.webchat.videoChatData.videoSessionid
      }
    },
    methods: {
      getMsgFromChildFrame (b) {
        if (b.data === 'UserHangup') {
          this.$store.commit(types.UPDATE_VIDEO_CHAT_STATUS, false)
          let videoMsg = {
            videoSessionid: '',
            videoToken: '',
            videoUsername: ''
          }
          this.$store.commit(types.UPDATE_VIDEO_CHATDATA, videoMsg)
        }
        if (b.data === 'UserCancel') {
          let msg = {
            _id: this.sessionId,
            operation: 'cancel',
            originator: 'agent'
          }
          this.$store.dispatch('cancelVideoInvite', msg)
        }
        if (b.data === 'notSupport') {
          this.$store.commit(types.UPDATE_VIDEO_CHAT_STATUS, false)
          let videoMsg = {
            videoSessionid: '',
            videoToken: '',
            videoUsername: ''
          }
          this.$store.commit(types.UPDATE_VIDEO_CHATDATA, videoMsg)
        }
        if (b.data === 'location') {
          this.$router.push({path: '/index/webchat/webchat_todo/' + this.sessionId})
        }
        if (b.data === 'UserHangup' || b.data === 'UserCancel' || b.data === 'notSupport' || b.data === 'location') {
          window.removeEventListener('message', this.getMsgFromChildFrame)
        }
      },
      small () {
        let iframe = document.getElementById('video').getElementsByTagName('iframe')[0].contentWindow
        let Video = document.getElementById('video')
        Video.style.left = '90%'
        Video.style.top = '44%'
        iframe.postMessage('smallMode', '*')
        this.smallMode = true
      },
      maxMode () {
        let iframe = document.getElementById('video').getElementsByTagName('iframe')[0].contentWindow
        let Video = document.getElementById('video')
        Video.style.left = '28%'
        Video.style.top = '20%'
        iframe.postMessage('bigMode', '*')
        this.smallMode = false
      },
      getCss (o, key) {
        return o[key]
      },
      startDrag (bar, target, self, callback) {
        bar.onmousedown = function (event) {
          console.log(self.getCss(target, 'offsetLeft'))
          if (self.getCss(target, 'offsetLeft') !== 'auto') {
            self.params.left = self.getCss(target, 'offsetLeft')
          }
          if (self.getCss(target, 'offsetTop') !== 'auto') {
            self.params.top = self.getCss(target, 'offsetTop')
          }
          self.params.flag = true
          if (!event) {
            event = window.event
            bar.onselectstart = function () {
              return false
            }
          }
          let e = event
          self.params.currentX = e.clientX
          self.params.currentY = e.clientY < 0 ? 0 : e.clientY
        }
        document.onmouseup = function () {
          self.params.flag = false
          if (self.getCss(target, 'offsetLeft') !== 'auto') {
            self.params.left = self.getCss(target, 'offsetLeft')
          }
          if (self.getCss(target, 'offsetTop') !== 'auto') {
            self.params.top = self.getCss(target, 'offsetTop')
          }
        }
        document.onmousemove = function (event) {
          let e = window.event
          let nowX = e.clientX
          let nowY = e.clientY
          let disX = 0
          let disY = 0
          if (self.params.flag) {
            disX = nowX - self.params.currentX
            disY = nowY - self.params.currentY
            // 判断上下左右的极限位置
            let limitLeft = (parseInt(self.params.left) + disX) > (tWidth - 50) ? (tWidth - 50) : (parseInt(self.params.left) + disX) < (100 - self.dragWidth) ? 100 - self.dragWidth : parseInt(self.params.left) + disX
            let limitTop = (parseInt(self.params.top) + disY) > (tHeight - 34) ? (tHeight - 34) : (parseInt(self.params.top) + disY) < 0 ? 0 : parseInt(self.params.top) + disY
            target.style.left = limitLeft + 'px'
            target.style.top = limitTop + 'px'
          }
          if (typeof callback === 'function') {
            callback(parseInt(self.params.left) + disX, parseInt(self.params.top) + disY)
          }
        }
      },
      dragBarOver (self) {
        let oContent = document.getElementById('video')
        oContent.onmouseover = function () {
          self.dragbarShow = true
        }
        oContent.onmouseout = function () {
          self.dragbarShow = false
        }
      }
    },
    mounted () {
      let oContent = document.getElementById('video')
      let oBar = document.getElementById('dragbar')
      this.dragBarOver(this)
      this.startDrag(oBar, oContent, this)
      this.dragWidth = oContent.clientWidth
      this.dragHeight = oContent.clientHeight
      tWidth = document.body.clientWidth
      tHeight = document.body.clientHeight
      if (window.addEventListener) {
        window.addEventListener('message', this.getMsgFromChildFrame)
      } else {
        window.attachEvent('onmessage', this.getMsgFromChildFrame)
      }
    }
  })
</script>
<style lang='stylus' scoped type="text/stylus">
  .video
    position: absolute;
    left: 28%;
    top: 20%;
    width: 700px;
    height: 500px;
    z-index: 30000;
    overflow: hidden;
    background: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    box-shadow: 0 0 3px 2px rgba(53, 53, 53, 0.1);
    border-top-width: 1px;
    border-right-width: 1px;
    border-left-width: 1px;
    border-style: solid solid none;
    border-top-color: #19CAA6;
    border-right-color: #19CAA6;
    border-left-color: #19CAA6;
    .dragbar
      width: 100%;
      height: 50px;
      opacity: 0.5;
      position: absolute;
      background-color: #ffffff;
      cursor: move;
    .minimg
      position: absolute;
      right: 2%;
      top: 2%;
      width: 30px;
      height: 30px;
      background-color: white;
      border-radius: 50%;
      text-align: center;
      cursor: pointer;
      img
        width: 25px;
        vertical-align: middle;
    .minimg:after
      content: '';
      display: inline-block;
      width: 0;
      height: 100%;
      vertical-align: middle;
    .maximg
      position: absolute;
      right: 2%;
      top: 2%;
      width: 17px;
      height: 17px;

  .videosmall
    width 120px
    height 90px

</style>
