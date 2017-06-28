<template>
  <div class="login-model">
    <el-form :model="form" :rules="rules" ref="form" class="login-form">
      <input v-model.trim="form.lastCodeKey" type="hidden">
      <el-row>
        <el-col :span="24" class="login-extentype">
          <ul>
            <li class="login-type" v-bind:class="{'active': form.extenType == 'Local'}" v-on:click="form.extenType = 'Local'">
              <input type="radio" v-model.trim="form.extenType" value="Local" />
                                    <span class="phone">
                                          <img src="./img/login/iphone.png" height="37" width="22" alt="">
                                    </span>
              <div class="login-tip">

                <h4>{{$t('login.phoneLoginToAnswer')}}</h4>
                <p>{{$t('login.custCallsTransferredAgent')}}</p>
              </div>
            </li>
            <li class="login-type" v-bind:class="{ 'active': form.extenType == 'gateway'}" v-on:click="form.extenType = 'gateway'">
              <input type="radio"v-model.trim="form.extenType" value="gateway">
                                    <span class="tel">
                                        <img src="./img/login/tel.png" height="33" width="34" alt="">
                                    </span>
              <div class="login-tip">
                <h4>{{$t('login.callsVia')}}</h4>
                <p>{{$t('login.independPhoneEquipment')}}</p>
              </div>
            </li>
            <li class="login-type" v-bind:class="{ 'active': form.extenType == 'sip'}" v-on:click="form.extenType = 'sip'">
              <input type="radio" v-model.trim="form.extenType" value="sip">
                                    <span class="cup">
                                        <img src="./img/login/cup.png" height="32" width="35" alt="">
                                    </span>
              <div class="login-tip">
                <h4>{{$t('login.softPhoneLogin')}}</h4>
                <p>{{$t('login.enterpriseCommunications')}}</p>
              </div>
            </li>
          </ul>
        </el-col>
        <el-col :span="24">
          <span class="l-input l-name" prop="name">
              <input type="text"  name="name" v-model.trim="form.loginName" :placeholder="$t('login.plahText')">
          </span>
          <span class="l-input l-password">
              <input type="password" name="password" v-model="form.password" :placeholder="$t('login.loginBtn')">
          </span>
          <button  type="submit" class="btn-login" :disabled="btn" v-on:click.prevent="login">{{ signName }}</button>
          <div class="login-status">
            <label  class="">
              <input type="checkbox" v-model.trim="form.remember" :checked="form.remember" class="l-rem">
              <span class="remember"></span>
              <span>{{$t('login.remember')}}</span>
            </label>
            <label  class="">
              <input type="checkbox"  v-model.trim="form.login_busyType" class="l-sta">
              <span class="status"></span>
              <span>{{$t('login.status')}}</span>
            </label>
            <!-- <label for="l-for" style="display:none" class="">
                <a href="">{{$t('login.forget')}}</a>
            </label> -->
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!--绑定手机号-->
    <phone :phone="phone"></phone>
    <!-- 邮箱验证 -->
    <email :email="email"></email>
    <!--验证码-->
    <identify-code @identifyToLogin="identifyToLogin" :identifyCode="identifyCode"></identify-code>
  </div>
</template>

<script>
// import I18n from './I18nSelect'
// import Browser from './Browser'
import Email from './Email'
import Phone from './Phone'
// import Bottom from './Footer'
import IdentifyCode from './IdentifyCode'
// import Editor from '../../ui-modules/editor/Editor'
let md5 = require('md5')
let form = window.localStorage.loginForm ? JSON.parse(window.localStorage.loginForm) : {
  lastCodeKey: '',
  loginName: '',
  password: '',
  extenType: 'Local',
  remember: true,
  login_busyType: true
}
function initForm (Vform) {
  let ls = window.localStorage
  if (!!ls.loginForm && Vform.remember) {
    form = JSON.parse(ls.loginForm)
    Object.assign(Vform, form)
  }
}

export default {
  name: 'login',
  props: ['show'],
  components: {
//    I18n,
//    Browser,
    Email,
    Phone,
    // 'v-editor': Editor,
//    Bottom,
    IdentifyCode
  },
  data () {
    return {
      // input content to editor
      inputContent: 'base on wangeditor',
      // output content from editor
      outputContent: '',
      // set image upload api url
      uploadUrl: '/api/v1/help/upload/wangEditorH5File',
      sta: 'sta-on',
      btn: false, // true 已经提交过， false没有提交过
      name: '',
      phone: {
        isShow: false,
        _id: '',
        form: null
      },
      email: {
        isShow: false,
        lastCodeKey: '',
        form: null
      },
      identifyCode: {
        isShow: false,
        token1: ''
      },
      form: form
    }
  },
  computed: {
    signName () {
      return this.btn ? this.$t('login.loginingBtn') : this.$t('login.loginBtn')
    }
  },
  methods: {
    validate (vStr) {
      if (this.form.loginName.length === 0 && vStr === 'name') {
        this.$message.error(this.$t('login.isNullByName'))
        return true
      }
    },
    login () {
      if (this.validate('name')) {
        this.btn = false
        return
      }
      if (this.form.loginName.length === 0 || this.form.password === 0) {
        this.$message.error(this.$t('login.isNull'))
        this.btn = false
        return
      }
      let password = this.form.password
      if (!isMD5(password)) {
        this.form.password = md5(this.form.password)
      }
      this.$store.dispatch('checkBeforeLogin', {loginName: this.form.loginName}).then(res => {
        if (res.success) {
          if (res.identifyCodeShow) {
            let token1 = res.token1
            this.identifyCode = {
              isShow: true,
              token1: token1
            }
          } else {
            this.loginSend()
          }
        }
      })
    },
    loginSend () {
      this.btn = true
      this.$store.dispatch('signIn', this.form).then(val => {
        delete this.form.identifyCodeToken
        if (val && val.logType === 'bind') {
          this.phone = {
            isShow: true,
            _id: val.sessionId,
            form: this.form
          }
          this.btn = false
        } else if (val && val.lastCodeKey) {
          this.email = {
            isShow: true,
            lastCodeKey: val.lastCodeKey,
            form: this.form
          }
          this.btn = false
        } else if (this.$store.state.login) {
          let ls = window.localStorage
          let form = {}
          if (this.form.remember) {
            form = this.form
          } else {
            form = this.form
            form.password = ''
          }
          ls.loginForm = JSON.stringify(form)
          this.$router.replace({path: '/index'})
        } else {
          this.btn = false
        }
      })
    },
    identifyToLogin (token2) {
      this.form.identifyCodeToken = token2
      this.loginSend()
    }
  },
  beforeMount () {
    if (window.parent !== window) {
      if (window.parent.location.origin !== window.location.origin) {
        window.sessionStorage.clear()
      }
    } else {
      window.sessionStorage.clear()
    }
    initForm(this.form)
  }
}
function isMD5 (str) {
  let md5 = /^[a-f0-9]{32}$/
  return md5.test(str)
}

</script>
<style lang="stylus" scoped>
    @import "styl/_login"
    @import "../../../assets/common.styl"
    h1
    h2
      font-weight normal
    a
      color  $c-main
    .login-model
      width 317px
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
    .vertical-line
        position absolute
        display inline-block
        height 295px
        width 1px
        top 0px
        left 463px
        background-color #99d013
    .login-extentype ul
        li
            box-size(100px,100px)
            border-radius 50px
            padding 8px
            box-sizing border-box
            display inline-block
            span
                display inline-block
                border 1px solid rgba(255, 255, 255, .4)
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
              left 5%
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
            transition all 1.5s
            width 800px
            opacity 1
            top -61px
            left 5%
          .login-tip__movedown
            top -61px

    .login-form
        position relative
        margin-top -12px
        .l-input
            box-size(317px,42px)
            margin-top 10px
            border-radius 22px
            display block
            background #c0DDEB
            border 0
            text-align center
            line-height 24px
            input
                background #c0DDEB
                border 0
                box-size(279px,42px)
        .btn-login
            box-size(317px,42px)
            margin-top 10px
            border-radius 22px
            margin-top 24px
            font-size 20px
            font-weight 900
            background $color-green
            border 0px
            color #fff
            cursor pointer
        .disable-btn
          disabled disabled

    .login-status
        margin-top 14px
        color #c0DDEB
        font-size 12px
        line-height 16px
        label
            display inline-block
            cursor pointer
            &:first-child
              margin 0 148px 0 8px
        input
          float none
          opacity 0
          height 12px
          position absolute
        span
          line-height 12px
        .remember
            display inline-block
            box-size(14px,14px)
            border 1px solid #C0DDEB
            border-radius 2px
            line-height 12px
            text-align center
            float left
            margin-right 7px
        .status
            box-size(27px,16px)
            background-color #ea6875
            display inline-block
            border-radius 8px
            border 2px solid #ea6875
            box-sizing border-box
            float left
            margin-right 7px

        .l-sta+.status:before
            content ""
            box-size(12px,12px)
            background #fff
            border-radius 6px
            display inline-block
        .l-sta:checked+.status:before
            float right
        .l-rem:checked+.remember:before
            content "\221A"
            font-style oblique
            font-family cursive
            font-size 12px
            font-weight 700

        .l-sta:checked+.status
            background-color  $c-main
            border 2px solid  $c-main
        .l-sta+.status:before
            float: left
</style>
