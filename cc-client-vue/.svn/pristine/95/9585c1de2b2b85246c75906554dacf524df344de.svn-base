<template>
  <el-dialog modal-append-to-body lock-scroll top="10%" size="tiny" class= "dislog-login dislog-identify-code" :title="$t('login.errorCodeIdentify')" v-model.trim="identifyCode.isShow">
    <p class="title">{{$t('login.pleaseMoveToIdentify')}}</p>
    <div class="code-identify-out" id="code-identify-out">
      {{$t('login.moveBlock')}}
      <div class="code-identify-in" id="code-identify-in"></div>
      <div class="code-identify-block" id="code-identify-block">>></div>
      <div v-if="isShowIdentifySuc" class="identify-suc"><i class="el-icon-check"></i> {{$t('login.identifySuccess')}}</div>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name: 'identifyCode',
    data () {
      return {
        currentX: 0,
        isShowIdentifySuc: false
      }
    },
    props: {
      identifyCode: {
        type: Object,
        default: function () {
          return {
            isShow: false,
            token1: ''
          }
        }
      }
    },
    methods: {
//      向父组件发送验证事件
      sendIdentify () {
        this.$store.dispatch('checkBeforeLogin', {token1: this.identifyCode.token1}).then(resp => {
          if (resp.success) {
            let token2 = resp.token2
            this.$emit('identifyToLogin', token2)
            this.isShowIdentifySuc = false
            this.identifyCode.isShow = false
          }
        })
      },
//      dom加载完成后 原生js实现 滑块验证
      startIdentify (identifyIn, identifyBlock) {
        let self = this
        identifyBlock.onmousedown = function (event) {
          let e = window.event || event
          self.currentX = e.clientX
          let identifyInWidth = 44
//          鼠标在滑块上的 move事件
          document.onmousemove = function (event) {
            let ee = window.event || event
            ee.preventDefault()
            let nowX = ee.clientX
            let disX = nowX - self.currentX
            identifyInWidth = disX + 44
            if (identifyInWidth <= 44) {
              disX = 0
              identifyInWidth = 44
            }
            if (identifyInWidth >= 260) {
              disX = 216
              identifyInWidth = 260
            }
            identifyIn.style.width = identifyInWidth + 'px'
            identifyBlock.style.left = disX + 'px'
            if (identifyInWidth === 260) {
              self.isShowIdentifySuc = true
              identifyInWidth = 44
              document.onmousemove = null
              self.sendIdentify()
            }
          }
//          鼠标左键抬起 重置 滑块
          document.onmouseup = function () {
            document.onmousemove = null
            document.onmouseup = null
            self.isShowIdentifySuc = false
            identifyIn.style.width = 44 + 'px'
            identifyBlock.style.left = 0 + 'px'
          }
        }
        return false
      }
    },
    updated () {
      let identifyIn = document.getElementById('code-identify-in')
      let identifyBlock = document.getElementById('code-identify-block')
      if (identifyIn && identifyBlock) {
        this.startIdentify(identifyIn, identifyBlock)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .dislog-identify-code
    -webkit-user-select none
    .title
      margin-bottom 30px
      font-size 14px
      color #adadad
    .code-identify-out
      position relative
      width 260px
      height 30px
      line-height 30px
      background #fff
      margin auto
      border 1px solid #1abb9c
      border-radius 30px
      text-align center
      color #1abb9c
      .code-identify-in
        position absolute
        top 0
        left 0
        width 44px
        height 30px
        background-color #1abb9c
        border-radius 30px
      .code-identify-block
        position absolute
        top 0
        left 0
        width 42px
        height 28px
        line-height 28px
        font-size 16px
        cursor pointer
        border-radius 30px
        border 1px solid #c6e5e0
        background -webkit-radial-gradient(#f4fefd,#f5ffff)
        box-shadow 2px 0px 10px #aadbd5 inset,2px 0px 10px #aadbd5
      .identify-suc
        width 100px
        position absolute
        top 0
        left 66px
        z-index 5
        color #fff
</style>
