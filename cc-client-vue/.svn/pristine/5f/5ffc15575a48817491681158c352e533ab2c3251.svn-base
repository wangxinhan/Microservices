<template>
  <el-dialog modal-append-to-body lock-scroll top="10%" v-if="phone" class= "dislog-login dislog-email" title="提示" v-model.trim="phone.isShow">
    <p>您还没有绑定手机号，请输入绑定!</p>
    <el-input size="small" placeholder="请输入手机号" v-model.trim="mobile" auto-complete="off"></el-input>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="btn" @click.native.stop="signInByPhone">{{signName}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name: 'Phone',
    data () {
      return {
        btn: false,
        mobile: ''
      }
    },
    props: {
      phone: {
        type: Object,
        default: function () {
          return {
            isShow: false,
            _id: '',
            form: null
          }
        }
      }
    },
    computed: {
      signName () {
        return this.btn ? this.$t('public.confirming') : this.$t('public.confirm')
      }
    },
    methods: {
      signInByPhone () {
        this.btn = true
        let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
        if (!myreg.test(this.mobile)) {
          this.btn = false
          this.$message.error('请输入正确手机号码')
          return
        }
        let data = {
          mobile: this.mobile,
          _id: this.phone._id,
          logType: 'bind'
        }
        this.$store.dispatch('signIn', data).then(val => {
          if (val.success) {
            this.$store.dispatch('signIn', this.phone.form).then(val => {
              let ls = window.localStorage
              let form = {}
              if (this.phone.form.remember) {
                form = this.phone.form
              } else {
                form = this.phone.form
                form.loginName = ''
                form.password = ''
              }
              ls.loginForm = JSON.stringify(form)
              this.phone.isShow = false
              this.$router.replace({path: '/index'})
            })
          }
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
</style>
