<template>
  <div v-show="conversationInfo.open">
    <div class='outmask' v-show='params.flag'></div>
    <div id='dragConversation' :class='[{ pop_hide: toggl, fake_hide: !show}]' class='pop' style="left:100px;top:10px">
      <p id='barImConversation'>
        {{$t('webchat.conversationInvited')}}
        <span @click='close'>×</span>
        <span @click='hide' v-if='swit==true' class="min">-</span>
        <span @click='sho' v-if='swit==false' class='maximize'>□</span>
      </p>
      <div id='contentConversation' class='wrap'>
        <webchat-table v-if="conversationInfo.open" :conversationData="conversationInfo"></webchat-table>
      </div>
      <div v-show="swit===true" id="conWidthDrag" class="ui-resizable-handle ui-resizable-e"></div>
      <div v-show="swit===true" id="conHeightDrag" class="ui-resizable-handle ui-resizable-s"></div>
      <div v-show="swit===true" id="conWidthHeightDrag" class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se"></div>
    </div>
  </div>
</template>
<script type="text/javascript">
  /**
   * 会话邀请弹窗table组件
   * [props 该组件所需要的参数]
   * @type {
     *   type        业务类型
     *   typeType    业务tab
     * }
   */
  import WebchatTable from 'components/business-modules/webchat/WebchatTable'
  let tWidth, tHeight
  window.onresize = function () {
    tWidth = document.body.clientWidth
    tHeight = document.body.clientHeight
  }
  export default({
    name: 'PopDrageConversation',
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
    props: {
      conversationInfo: Object
    },
    computed: {
      show () {
        return this.conversationInfo.open
      },
      user () {
        return this.$store.state.session.user
      },
      webChatTableData () {
        return this.tableData
      }
    },
    methods: {
      hide () {
        this.toggl = true
        this.swit = false
        let odrag = document.getElementById('dragConversation')
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
        let odrag = document.getElementById('dragConversation')
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
        let value = false
        this.$emit('close', value)
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
        this.mouseUp(target)
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
          self.mouseUp(target)
          self.mouseMove(target, callback)
        }
        turnWidthBar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.params.turnWH = true
          self.params.turnW = true
          self.mouseUp(target)
          self.mouseMove(target, callback)
        }
        turnHeightBar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.params.turnWH = true
          self.params.turnH = true
          self.mouseUp(target)
          self.mouseMove(target, callback)
        }
        turnWidthHeightBar.onmousedown = function (event) {
          document.querySelectorAll('body')[0].style.userSelect = 'none'
          self.params.turnWH = true
          self.params.turnH = true
          self.params.turnW = true
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
              if (newWidth <= self.dragMinWidth + 100) {
                newWidth = self.dragMinWidth + 100
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
              if (newHeight <= self.dragMinHeight) {
                newHeight = self.dragMinHeight
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
      mouseUp (target) {
        let self = this
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
      let oContent = document.getElementById('dragConversation')
      let oBar = document.getElementById('barImConversation')
      let oTurnWidth = document.getElementById('conWidthDrag')
      let oTurnHeight = document.getElementById('conHeightDrag')
      let oTurnWidthHeight = document.getElementById('conWidthHeightDrag')
      this.startDrag(oTurnWidth, oTurnHeight, oTurnWidthHeight, oBar, oContent, this)
      this.dragWidth = oContent.clientWidth
      this.dragHeight = oContent.clientHeight
      tWidth = document.body.clientWidth
      tHeight = document.body.clientHeight
    },
    components: {
      WebchatTable
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
    width 960px
    height 600px
    z-index 100
    overflow hidden
    border 1px solid #dcdcdc
    background #fff
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
      height calc(100% - 80px)
      border-top none
      overflow-x auto
      overflow-y auto
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
