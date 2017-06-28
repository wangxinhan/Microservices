<template>
    <div class="login-container">
      <div class="login">
          <div class="logo">
               <a href="javascript:;" target="_blank"><img src="../img/login/login-gzdx.png" height="100" width="200"></a>
          </div>
          <div class="login-box">
            <login></login>
          </div>
          <div class="footer">&copy;2016中国电信 </div>
        <!-- 浏览器推荐 -->
          <browser></browser>
          <!-- <v-editor></v-editor> -->
      </div>
    </div>
</template>

<script>
import Browser from '../Browser'
// import Email from './Email'
// import Phone from './Phone'
import Login from '../login.vue'
// import IdentifyCode from './IdentifyCode'
// import Editor from '../../ui-modules/editor/Editor'
export default {
  name: 'login-kf',
  components: {
    Login,
    Browser
  },
  data () {
    return {

    }
  },
  computed: {
  },
  methods: {
  },
  beforeMount () {
  }
}
</script>
<style lang="stylus" scoped>
    @import "../styl/_login"
    @import "../../../../assets/common.styl"
    .login-container
      height 100vh
      display flex
      justify-content center
      align-items center
      -webkit-user-select none
      background linear-gradient(#00a3c9, #006da8) no-repeat
    h1
    h2
      font-weight normal
    a
      color  $c-main
    .login
      font-size 12px
      width 100%
      .logo
        display flex
        width 100%
        padding 20px 0 70px
        height 80px
        margin-top 0px
        justify-content center
        align-items center
        flex-direction column
        background url(../img/login/login-background.png) no-repeat
        background-size 100%
        background-position 50% 100%
        p
          font-size 20px
          color #fff
          .point
            margin 5px 10px
            display inline-block
            box-size(10px,10px)
            background #fff
            border-radius 5px
    .login-box
        position relative
        display flex
        justify-content center
        width 100%
    .vertical-line
        position absolute
        display inline-block
        height 295px
        width 1px
        top 0px
        left 463px
        background-color #fff

    .login-tip-size
        height 14px
        .active
            display block
    .QR-code-info
        color #a6c5da
        line-height 24px
        margin-top 90px

    .p-news
        margin-bottom 16px
        li a
            display block
            @extend .common-ellipsis
            width 352px
            line-height 28px

    .login-extentype ul
        li
            box-size(100px,100px)
            border-radius 50px
            padding 8px
            box-sizing border-box
            display inline-block
            span
                display inline-block
                border 1px solid $color-theme
                box-size(82px,82px)
                border-radius 41px
                text-align center
                line-height 103px
                box-sizing border-box
                img
                    opacity .5

            input
                box-size(82px,82px)
                position absolute
                z-index 3
                opacity 0

            input:hover
                cursor pointer
            .login-tip
              position absolute
              top -61px
              left 0
              opacity 0
              h4
                color #fff
                line-height 28px
              p
                color #a6c5da
                width 70%
        li.active
            border 1px solid $color-green
            cursor pointer
            span
                border 1px solid $color-green
                background $color-green
                img
                    opacity 1

        li:hover
          .login-tip
            width 800px
            opacity 1
            top -61px
            left 0
          .login-tip__movedown
            top -61px
    .footer
       padding-top 20px
       text-align center
       color white
</style>
