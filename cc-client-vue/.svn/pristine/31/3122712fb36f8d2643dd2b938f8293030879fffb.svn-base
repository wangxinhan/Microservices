<template>
    <div class="login-container">
      <div class="login">
          <div class="logo">
               <a href="//www.7moor.com" target="_blank"><img src="./img/login/logo.png" height="74" width="68"></a>
               <P>{{$t('login.rongLian7M')}}<span class="point"></span>{{$t('login.cloudService')}}</P>
          </div>
          <div class="login-box">
              <el-row type="flex">
                  <el-col :span="24" class="login-tip-size"></el-col>
              </el-row>
              <el-row type="flex">
                  <el-col :span="10" :offset="2" class="login-profile">
                      <ul class="p-news">
                          <li><a href="//www.7moor.com/21150.html" target="_blank">容联七陌助力印象笔记 搭建全新客服中心</a></li>
                          <li><a href="//www.7moor.com/21152.html" target="_blank">知金教育联手容联七陌云电销 成就学员美好未来</a></li>
                          <li><a href="//www.7moor.com/21118.html" target="_blank">七陌助力微盟，打造全新客户服务与营销管理平台</a></li>
                          <li><a href="//www.7moor.com/21115.html" target="_blank">外勤365牵手容联七陌 让沟通成为业务增长加速器 </a></li>
                          <li><a href="//www.7moor.com/21143.html" target="_blank">容联七陌云客服助力易加医，让用户享受更贴心服务</a></li>
                      </ul>
                      <el-col :span="10" class="QR-code-img"></el-col>
                      <el-col :span="12" class="QR-code-info">
                      <i18n style="display:none"></i18n>
                        <div class="qr-code-tip">
                          <span>{{$t('login.concernPublicNum')}}</span>
                          <span>{{$t('login.phoneProcessWork')}}</span>
                        </div>
                      </el-col>
                  </el-col>
                  <span class="vertical-line"></span>
                    <el-col :span="12" class="ml">
                      <!-- 登陆组件-->
                      <login></login>
                    </el-col>
              </el-row>
          </div>
          <bottom></bottom>
          <!-- 浏览器推荐 -->
          <browser></browser>
          <!-- <v-editor></v-editor> -->
      </div>
    </div>
</template>

<script>
import I18n from './I18nSelect'
import Browser from './Browser'
// import Email from './Email'
// import Phone from './Phone'
import Login from './login.vue'
import Bottom from './Footer'
// import IdentifyCode from './IdentifyCode'
// import Editor from '../../ui-modules/editor/Editor'
export default {
  name: 'login-kf',
  components: {
    Login,
    I18n,
    Browser,
    // 'v-editor': Editor,
    Bottom
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
    @import "styl/_login"
    @import "../../../assets/common.styl"
    .login-profile
      padding-left 20px
    .qr-code-tip
      display flex
      flex-direction column
      margin-left 10px
      span
        line-height 16px
    .login-container
      height 100vh
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
      height 100%
      display flex
      justify-content center
      align-items center
      flex-direction column
      .logo
        display flex
        width 100%
        height 35.152%
        margin-top -40px
        justify-content center
        align-items center
        flex-direction column
        background url(img/login/login-background.png) no-repeat
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
        width 930px
    .vertical-line
        position absolute
        display inline-block
        height 290px
        width 1px
        top 0px
        left 463px
        background-color #99d0e3

    .login-tip-size
        height 14px
        .active
            display block
    .QR-code-img
        height 138px
        width 138px
        background url("./img/login/QR-code.png") no-repeat
    .QR-code-info
        color #a6c5da
        line-height 24px
        margin-top 96px

    .p-news
        margin-bottom 16px
        li a
            color #c0ddeb
            font-weight 200
            display block
            @extend .common-ellipsis
            width 352px
            line-height 24px
            &:hover
              color #fff
    .ml
      margin-left: 80px
</style>
