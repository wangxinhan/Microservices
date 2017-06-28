<template>
  <div class="searchPop" v-show="searchInfo.boxInfo.open">
    <!-- 遮罩：鼠标移到iframe上会失去document事件 -->
    <div class='outmask' v-show='paramsNew.flag'></div>
    <div id='dragImSearch' :class='[{ pop_hide: toggl, fake_hide: !show}]' class='pop' style="left:100px;top:10px">
      <p id='barImSearch'>
        {{message.name}}
        <span @click='close'>×</span>
        <span @click='hide' v-if='swit==true' class="min">-</span>
        <span @click='sho' v-if='swit==false' class='maximize'>□</span>
      </p>
      <div id='contentImSearch' class='wrap'>
        <!-- 遮罩：鼠标移到iframe上会失去document事件 -->
        <div class='innermask' v-show='paramsNew.flag'></div>
        <webchat-km-search :searchData="searchInfo"></webchat-km-search>
      </div>
      <div v-show="swit===true" id="searchWidthDrag" class="ui-resizable-handle ui-resizable-e"></div>
      <div v-show="swit===true" id="searchHeightDrag" class="ui-resizable-handle ui-resizable-s"></div>
      <div v-show="swit===true" id="searchWidthHeightDrag" class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se"></div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import WebchatKmSearch from 'components/business-modules/webchat/WebchatKmSearch'
  let tWidth, tHeight
  window.onresize = function () {
    tWidth = document.body.clientWidth
    tHeight = document.body.clientHeight
  }
  export default({
    name: 'PopDrageSearch',
    data () {
      return {
        swit: true,
        toggl: false,
        paramsNew: {
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
    props: {
      searchInfo: Object
    },
    computed: {
      message () {
        return this.searchInfo.boxInfo
      },
      show () {
        return this.searchInfo.boxInfo.open
      },
      user () {
        return this.$store.state.session.user
      }
    },
    methods: {
      hide () {
        this.toggl = true
        this.swit = false
        let odrag = document.getElementById('dragImSearch')
        odrag.style.width = this.dragMinWidth + 'px'
        odrag.style.height = this.dragMinHeight + 'px'
        odrag.style.left = (tWidth - this.dragMinWidth) + 'px'
        odrag.style.top = (tHeight - this.dragMinHeight) + 'px'
        this.paramsNew.left = tWidth - this.dragMinWidth
        this.paramsNew.top = tHeight - this.dragMinHeight
//        避免最小化时被拖出视图  把dragWidth暂存后再复制
        this.dragWidthSave = this.dragWidth
        this.dragHeightSave = this.dragHeight
        this.dragWidth = this.dragMinWidth
        this.dragHeight = this.dragMinHeight
      },
      sho () {
        this.toggl = false
        this.swit = true
        let odrag = document.getElementById('dragImSearch')
        this.dragWidth = this.dragWidthSave
        this.dragHeight = this.dragHeightSave
        odrag.style.width = this.dragWidth + 'px'
        odrag.style.height = this.dragHeight + 'px'
        odrag.style.left = '100px'
        odrag.style.top = '10px'
        this.paramsNew.left = 100
        this.paramsNew.top = 10
      },
      close () {
        let value = false
        this.$emit('close', value)
      },
      getCss (o, key) {
        return o[key]
      },
      startDrag (turnWidthBar, turnHeightBar, turnWidthHeightBar, bar, target, self, callback) {
        if (self.getCss(target, 'offsetLeft') !== 'auto') {
          self.paramsNew.left = self.getCss(target, 'offsetLeft')
        }
        if (self.getCss(target, 'offsetTop') !== 'auto') {
          self.paramsNew.top = self.getCss(target, 'offsetTop')
        }
        this.mouseUp(target)
        bar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.paramsNew.flag = true
          if (!event) {
            event = window.event
            bar.onselectstart = function () {
              return false
            }
          }
          let e = event
          self.paramsNew.currentX = e.clientX
          self.paramsNew.currentY = e.clientY < 0 ? 0 : e.clientY
          self.mouseUp(target)
          self.mouseMove(target, callback)
        }
        turnWidthBar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.paramsNew.turnWH = true
          self.paramsNew.turnW = true
          self.mouseUp(target)
          self.mouseMove(target, callback)
        }
        turnHeightBar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.paramsNew.turnWH = true
          self.paramsNew.turnH = true
          self.mouseUp(target)
          self.mouseMove(target, callback)
        }
        turnWidthHeightBar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.paramsNew.turnWH = true
          self.paramsNew.turnH = true
          self.paramsNew.turnW = true
          self.mouseUp(target)
          self.mouseMove(target, callback)
        }
      },
      mouseMove (target, callback) {
        let self = this
        document.onmousemove = function (event) {
          let e = window.event
          e.preventDefault()
          let nowX = e.clientX
          let nowY = e.clientY
          let disX = 0
          let disY = 0
          if (self.paramsNew.flag) {
            disX = nowX - self.paramsNew.currentX
            disY = nowY - self.paramsNew.currentY
            // 判断上下左右的极限位置
            let limitLeft = (parseInt(self.paramsNew.left) + disX) > (tWidth - 50) ? (tWidth - 50) : (parseInt(self.paramsNew.left) + disX) < (100 - self.dragWidth) ? 100 - self.dragWidth : parseInt(self.paramsNew.left) + disX
            let limitTop = (parseInt(self.paramsNew.top) + disY) > (tHeight - 34) ? (tHeight - 34) : (parseInt(self.paramsNew.top) + disY) < 0 ? 0 : parseInt(self.paramsNew.top) + disY
            target.style.left = limitLeft + 'px'
            target.style.top = limitTop + 'px'
          }
//          左右拖动 改变窗口宽度
          if (self.paramsNew.turnWH) {
            if (self.paramsNew.turnW) {
              let leftDis = target.offsetLeft
              let newWidth = nowX - leftDis
              if (newWidth + leftDis >= tWidth) {
                newWidth = tWidth - leftDis
              }
              if (newWidth <= self.dragMinWidth + 150) {
                newWidth = self.dragMinWidth + 150
              }
              target.style.width = newWidth + 'px'
              self.dragWidth = newWidth
            }
            if (self.paramsNew.turnH) {
              let topDis = target.offsetTop
              let newHeight = nowY - topDis
              if (newHeight + topDis >= tHeight) {
                newHeight = tHeight - topDis
              }
              if (newHeight <= self.dragMinHeight) {
                newHeight = self.dragMinHeight
              }
              target.style.height = newHeight + 'px'
              self.dragHeight = newHeight
            }
          }
          if (typeof callback === 'function') {
            callback(parseInt(self.paramsNew.left) + disX, parseInt(self.paramsNew.top) + disY)
          }
        }
      },
      mouseUp (target) {
        let self = this
        document.onmouseup = function () {
          document.querySelectorAll('body')[0].style.userSelect = 'text'
          document.onmousemove = null
          self.paramsNew.flag = false
          self.paramsNew.turnWH = false
          self.paramsNew.turnW = false
          self.paramsNew.turnH = false
          if (self.getCss(target, 'offsetLeft') !== 'auto') {
            self.paramsNew.left = self.getCss(target, 'offsetLeft')
          }
          if (self.getCss(target, 'offsetTop') !== 'auto') {
            self.paramsNew.top = self.getCss(target, 'offsetTop')
          }
          document.onmouseup = null
        }
      }
    },
    mounted () {
      let oContent = document.getElementById('dragImSearch')
      let oBar = document.getElementById('barImSearch')
      let oTurnWidth = document.getElementById('searchWidthDrag')
      let oTurnHeight = document.getElementById('searchHeightDrag')
      let oTurnWidthHeight = document.getElementById('searchWidthHeightDrag')
      this.startDrag(oTurnWidth, oTurnHeight, oTurnWidthHeight, oBar, oContent, this)
      this.dragWidth = oContent.clientWidth
      this.dragHeight = oContent.clientHeight
      tWidth = document.body.clientWidth
      tHeight = document.body.clientHeight
    },
    components: {
      WebchatKmSearch
    }
  })
</script>
<style lang='stylus' scoped>
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
    background #fff
    width 960px
    height 600px
    z-index 100
    overflow hidden
    border 1px solid #dcdcdc
    border-radius 4px
    box-shadow 0 0 8px 0 rgba(0,0,0,0.3)
    p
      height 50px
      font-size 14px
      line-height 50px
      font-weight bold
      padding-left 20px
      background #fff
      border-bottom 1px solid #eeeff3
      vertical-align middle
      cursor move
      color #999
      -webkit-user-select none
      /*.maximize*/
        /*margin-top 20px*/
        /*display inline-block*/
        /*height 8px*/
        /*width 8px*/
        /*border 2px solid #cfcfcf*/
      .min
        margin-top 0px
      span
        font-size 18px
        float right
        font-weight bold
        margin-right 14px
        cursor pointer
        color #acacac
    div.wrap
      background #fff
      width calc(100% - 10px)
      height 100%
      border-top none
      overflow-x auto
      overflow-y hidden
      position relative
      .innermask
        width 100%
        height 100%
        position absolute
        top 0
        left 0
        z-index 999
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
      width 14px
      right -5px
      top 0
      height 100%
    .ui-resizable-s
      cursor s-resize
      height 14px
      width 100%
      bottom -5px
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

</style>
