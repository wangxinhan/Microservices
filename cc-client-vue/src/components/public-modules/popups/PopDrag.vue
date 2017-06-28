<template>
<div>
  <!-- 遮罩：鼠标移到iframe上会失去document事件 -->
  <div class='outmask' v-show='params.flag || params.turnWH'></div>
  <div id='drag' :class='[{ pop_hide: toggl, fake_hide: !show}]' class='pop' style="left:100px;top:10px">
    <p id='bar'>
      <span class="tipTil" :class = "{tip: !swit}" :title="message.name">{{message.name}}</span>
      <span @click='close'>×</span>
      <span @click='hide' v-if='swit===true' class="min">-</span>
      <span @click='sho' v-if='swit===false' class='maximize'><b></b></span>
    </p>
    <div id='content' class='wrap'>
      <!-- 遮罩：鼠标移到iframe上会失去document事件 -->
      <div class='innermask' v-show='params.flag || params.turnWH'></div>
      <div class="iframe-wrap">
        <iframe :src="url" v-if='swit' frameborder='0'></iframe>
      </div>
    </div>
    <div v-show="swit" id="turnWidthDrag" class="ui-resizable-handle ui-resizable-e"></div>
    <div v-show="swit" id="turnHeightDrag" class="ui-resizable-handle ui-resizable-s"></div>
    <div v-show="swit" id="turnWidthHeightDrag" class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se"></div>
  </div>
</div>
</template>
<script>
  let tWidth, tHeight
  window.onresize = function () {
    tWidth = document.body.clientWidth
    tHeight = document.body.clientHeight
  }
  export default({
    data () {
      return {
        swit: true,
        toggl: false,
        params: {
          left: 0,
          top: 0,
          currentX: 0,
          currentY: 0,
          flag: false,
          turnWH: false,
          turnW: false,
          turnH: false
        },
        dragWidth: 0,
        dragHeight: 0,
        dragWidthSave: 190,
        dragHeightSave: 50,
        dragMinWidth: 190,
        dragMinHeight: 50
      }
    },
    computed: {
      message () {
        return this.$store.state.dragPop
      },
      show () {
        return this.$store.state.dragPop.open
      },
      user () {
        return this.$store.state.session.user
      },
      url () {
        let tUrl = this.$store.state.dragPop.url
//        let token = this.$store.state.dragPop.token
//        tUrl = tUrl ? tUrl.indexOf('?') > 0 ? tUrl + this.user.displayName + '&loginExten=' + this.user.exten
//        : tUrl + '?loginName=' + this.user.displayName + '&loginExten=' + this.user.exten + '&token=' + token.token + '&tokenId=' + token.tokenId : ''
        return tUrl
      }
    },
    methods: {
      hide () {
        this.toggl = true
        this.swit = false
        let odrag = document.getElementById('drag')
        odrag.style.width = this.dragMinWidth + 'px'
        odrag.style.height = this.dragMinHeight + 'px'
        odrag.style.left = (tWidth - this.dragMinWidth) + 'px'
        odrag.style.top = (tHeight - this.dragMinHeight) + 'px'
        this.params.left = tWidth - this.dragMinWidth
        this.params.top = tHeight - this.dragMinHeight
//        避免最小化时被拖出视图  把dragWidth暂存后再复制
        this.dragWidthSave = this.dragWidth
        this.dragHeightSave = this.dragHeight
        this.dragWidth = this.dragMinWidth
        this.dragHeight = this.dragMinHeight
      },
      sho () {
        this.toggl = false
        this.swit = true
        let odrag = document.getElementById('drag')
        this.dragWidth = this.dragWidthSave
        this.dragHeight = this.dragHeightSave
        odrag.style.width = this.dragWidth + 'px'
        odrag.style.height = this.dragHeight + 'px'
        odrag.style.left = '100px'
        odrag.style.top = '10px'
        this.params.left = 100
        this.params.top = 10
      },
      close () {
        this.$store.commit('SET_DRAGPOP', 'close')
      },
      getCss (o, key) {
        return o[key]
      },
      startDrag (turnWidthBar, turnHeightBar, turnWidthHeightBar, bar, target, self, callback) {
        if (self.getCss(target, 'offsetLeft') !== 'auto') {
          self.params.left = self.getCss(target, 'offsetLeft')
        }
        if (self.getCss(target, 'offsetTop') !== 'auto') {
          self.params.top = self.getCss(target, 'offsetTop')
        }
        this.mouseUp(target, self)
        bar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
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
          self.mouseUp(target, self)
          self.mouseMove(target, callback, self)
        }
        turnWidthBar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.params.turnWH = true
          self.params.turnW = true
          self.mouseUp(target, self)
          self.mouseMove(target, callback, self)
        }
        turnHeightBar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.params.turnWH = true
          self.params.turnH = true
          self.mouseUp(target, self)
          self.mouseMove(target, callback, self)
        }
        turnWidthHeightBar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.params.turnWH = true
          self.params.turnH = true
          self.params.turnW = true
          self.mouseUp(target, self)
          self.mouseMove(target, callback, self)
        }
      },
      mouseMove (target, callback, self) {
        document.onmousemove = function (event) {
          let e = window.event
          e.preventDefault()
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
//          左右拖动 改变窗口宽度
          if (self.params.turnWH) {
            if (self.params.turnW) {
              let leftDis = target.offsetLeft
              let newWidth = nowX - leftDis
              if (newWidth + leftDis >= tWidth) {
                newWidth = tWidth - leftDis
              }
              if (newWidth <= self.dragMinWidth + 200) {
                newWidth = self.dragMinWidth + 200
              }
              target.style.width = newWidth + 'px'
              self.dragWidth = newWidth
            }
            if (self.params.turnH) {
              let topDis = target.offsetTop
              let newHeight = nowY - topDis
              if (newHeight + topDis >= tHeight) {
                newHeight = tHeight - topDis
              }
              if (newHeight <= self.dragMinHeight + 200) {
                newHeight = self.dragMinHeight + 200
              }
              target.style.height = newHeight + 'px'
              self.dragHeight = newHeight
            }
          }
          if (typeof callback === 'function') {
            callback(parseInt(self.params.left) + disX, parseInt(self.params.top) + disY)
          }
        }
      },
      mouseUp (target, self) {
        document.onmouseup = function () {
          document.querySelectorAll('body')[0].style.userSelect = 'text'
          document.onmousemove = null
          self.params.flag = false
          self.params.turnWH = false
          self.params.turnW = false
          self.params.turnH = false
          if (self.getCss(target, 'offsetLeft') !== 'auto') {
            self.params.left = self.getCss(target, 'offsetLeft')
          }
          if (self.getCss(target, 'offsetTop') !== 'auto') {
            self.params.top = self.getCss(target, 'offsetTop')
          }
          document.onmouseup = null
        }
      }
    },
    mounted () {
      let oContent = document.getElementById('drag')
      let oBar = document.getElementById('bar')
      let oTurnWidth = document.getElementById('turnWidthDrag')
      let oTurnHeight = document.getElementById('turnHeightDrag')
      let oTurnWidthHeight = document.getElementById('turnWidthHeightDrag')
      this.startDrag(oTurnWidth, oTurnHeight, oTurnWidthHeight, oBar, oContent, this)
      this.dragWidth = oContent.clientWidth
      this.dragHeight = oContent.clientHeight
      tWidth = document.body.clientWidth
      tHeight = document.body.clientHeight
    }
  })
</script>
<style lang='stylus' scoped>
  .select_select
    user-select none
  .hide
    z-index -1
  .outmask
    width 100vw
    height 100vh
    position fixed
    z-index 99
    top 0
    left 0
  .pop
    position fixed
    width 960px
    height 600px
    z-index 99999
    overflow hidden
    border 1px solid #d9d9d9
    border-radius 4px
    box-shadow 0 0 8px 0 rgba(0,0,0,0.3)
    background-color #fff
    p
      height 40px
      font-size 14px
      line-height 40px
      font-weight bold
      padding-left 20px
      background #fff
      border-bottom 1px solid #eeeff3
      vertical-align middle
      cursor move
      color #999
      -webkit-user-select none
      .tipTil
        display inline-block
        float none
        margin-right 0
        font-size 14px
        color #1a1a1a
      .tip
        width 100px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        float left
      span
        font-size 18px
        float right
        font-weight bold
        margin-right 14px
        cursor pointer
        b
          border 2px solid #999
          width 6px
          height 6px
          line-height 0
          display inline-block
    div.wrap
      background #fff
      width calc(100% - 2px)
      height calc(100% - 53px)
      border-top none
      position relative
      .innermask
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        z-index 100000
      .iframe-wrap
        width 100%
        height 100%
        overflow-x auto
        overflow-y hidden
        iframe
          height 100%
          width 100%
          border none
          scrolling auto
          min-width 1100px
    .ui-resizable-handle
      position absolute
      font-size 0.1px
      display block
    .ui-resizable-e
      cursor e-resize
      width 8px
      right -6px
      top 0
      height 100%
    .ui-resizable-s
      cursor s-resize
      height 8px
      width 100%
      bottom -6px
      left 0
    .ui-resizable-se
      cursor se-resize
      right 0
      bottom 0
    .ui-icon
      width 16px
      height 16px
    .ui-icon-gripsmall-diagonal-se
      background-position -64px -224px
    .ui-icon
      background-image url(./images/ui-icons_222222_256x240.png)
  .pop_hide
    width 190px
    height 50px
    bottom 0px
    right 0px
    border 1px solid #ccc
  .fake_hide
    z-index -1
    opacity 0

</style>
