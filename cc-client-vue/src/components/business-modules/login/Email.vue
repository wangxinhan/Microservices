<template>
  <el-dialog modal-append-to-body lock-scroll top="10%"  v-if="email.isShow" class= "dislog-login dislog-phone" title="提示" v-model.trim="email.isShow">
    <p>IP验证没通过，需要邮箱验证码登录，验<br>证码已经发到您的邮箱，请查收!</p>
    <el-input size="small" placeholder="请输入邮箱验证码" v-model.trim="authCode" auto-complete="off"></el-input>
    <a class="email-resend__btn" @click.stop="retryMail2Authcode">没收到邮件，点击重新发送</a>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="btn" @click.native.stop="signInByEmail">登录</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name: 'Email',
    data () {
      return {
        authCode: '',
        btn: false
      }
    },
    props: {
      email: {
        type: Object,
        default: function () {
          return {
            isShow: true,
            lastCodeKey: '',
            form: null
          }
        }
      }
    },
    computed: {
      signName () {
        return this.btn ? this.$t('login.loginingBtn') : this.$t('login.loginBtn')
      }
    },
    methods: {
      signInByEmail () {
        this.btn = true
        let form = this.email.form
        form.lastCodeKey = this.email.lastCodeKey
        form.authCode = this.authCode
        this.authCode = ''
        if (!form.authCode) {
          this.btn = false
          this.$message.error('请输入邮箱验证码')
          return
        } else {
          this.$store.dispatch('signIn', form).then(val => {
            if (this.$store.state.login) {
              let ls = window.localStorage
              let form = {}
              if (this.email.form.remember) {
                form = this.email.form
              } else {
                form = this.email.form
                form.loginName = ''
                form.password = ''
              }
              delete form.lastCodeKey
              delete form.authCode
              ls.loginForm = JSON.stringify(form)
              this.email.isShow = false
              this.$router.replace({path: '/index'})
            }
          })
        }
      },
      retryMail2Authcode () {
        this.$store.dispatch('retryMail2Authcode', {lastCodeKey: this.email.lastCodeKey}).then(data => {
          this.btn = false
          this.$message({
            message: '邮件已经发送请注意查收',
            type: 'success'
          })
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .email-resend__btn
    display block
    margin-top 10px
</style>
