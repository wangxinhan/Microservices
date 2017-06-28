<template >
<div>
  <div class="center" v-if='isEditUserInfo' @click="openDialog" @click.once="initUploadUserIcon">
    <span class="agent">
      <img v-if="user_pic" :src="user_pic" :alt="ruleForm1.displayName" />
    </span>
    <span class="userName" :title="displayName">{{displayName}}</span>
  </div>
  <div class="center" v-else>
    <span class="agent">
      <img v-if="user_pic" :src="user_pic" :alt="ruleForm1.displayName" />
    </span>
    <span class="userName" :title="displayName">{{displayName}}</span>
  </div>
  <el-dialog modal-append-to-body lock-scroll top="10%" class="userPicDialog" title="" v-model="UserDetail" v-show="UserDetail" size="tiny">
    <el-tabs :active-name="activeName">
      <el-tab-pane :label="$t('userInfo.userInfo')" name="first">
        <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-position="right" label-width="90px">
            <el-form-item class="user_icon" :label="$t('userInfo.avatar')">
              <span class="im_icon">
                <img v-if="im_icon" :src="im_icon" :alt="ruleForm1.displayName" />
                <el-button class="userEdit" :value="ruleForm1.userEdit" id="uploadUserIcon"></el-button>
              </span>
            </el-form-item>
            <el-form-item :label="$t('public.name')" prop="displayName">
              <el-input size="small" type="text" v-model.trim="ruleForm1.displayName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('public.phoneNum')" prop="mobile">
              <el-input size="small" type="text" v-model.trim="ruleForm1.mobile" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('public.email')" prop="email">
              <el-input size="small" type="text" v-model.trim="ruleForm1.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('userInfo.autoBusyTime')" prop="AutoBusyTime" v-if="isAutoBusyTime">
              <el-input size="small" :placeholder="$t('public.pleaseEnter')" v-model.trim="ruleForm1.AutoBusyTime" auto-complete="off">
                <template slot="append">{{$t('public.seconds')}}</template>
              </el-input>
            </el-form-item>
            <el-form-item class="txrt">
              <el-button @click="UserDetail = false;" >{{$t('public.cancel')}}</el-button>
              <el-button type="primary" @click="appUserInfoUpdate">{{$t('public.confirm')}}</el-button>
            </el-form-item>
          </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('public.password')" name="second">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="right" label-width="90px">
          <el-form-item :label="$t('userInfo.oldPassWord')" prop="oldPassword">
            <el-input size="small" type="password" v-model="ruleForm2.oldPassword" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('public.password')" prop="pass">
            <el-input size="small" type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('userInfo.confirmPassword')" prop="checkPass">
            <el-input size="small" type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item class="txrt">
            <el-button @click="UserDetail = false">{{$t('public.cancel')}}</el-button>
            <el-button type="primary" @click="appUserPasswordUpdate">{{$t('public.confirm')}}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="false" :label="$t('public.notifySet')" name="three">
        <notify-switch @close="UserDetail = false"></notify-switch>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</div>
</template>
<script>
import {uploadTo7moorDomain} from '../../../utils/qiniuUtils'
import * as m7Utils from '../../../utils/m7Utils'
import {checkform} from '../../../utils/validate'
import uuid from 'uuid'
import notifySwitch from './NotifySwitch.vue'
// let md5 = require('md5')
export default {
  name: 'UserPic',
  computed: {
    user_pic () {
      return this.$store.state.session.user.im_icon ? this.$store.state.session.user.im_icon + '?imageView2/1/w/50/h/50' : ''
    },
    im_icon () {
      return this.user_icon ? this.user_icon + '?imageView2/1/w/50/h/50' : (this.$store.state.session.user.im_icon ? this.$store.state.session.user.im_icon + '?imageView2/1/w/50/h/50' : '')
    },
    _id () {
      return this.$store.state.session.sessionId
    },
    displayName () {
      return this.$store.state.session.user.displayName
    },
    userAutoBusyTime () {
      let obj = {
        AutoBusyTime: this.$store.state.session.user.AutoBusyTime || 0,
        email: this.$store.state.session.user.email,
        mobile: this.$store.state.session.user.mobile,
        displayName: this.$store.state.session.user.displayName,
        password: this.$store.state.session.user.password
      }
      return obj
    }
  },
  data () {
    var validateMobile = (rule, value, callback) => {
      if (value !== '') {
        let match = checkform(value, 'Mobile')
        if (match) {
          callback(new Error(this.$t(match)))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value !== '') {
        let match = checkform(value, 'Email')
        if (match) {
          callback(new Error(this.$t(match)))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateNum = (rule, value, callback) => {
      if (value !== '') {
        let match = checkform(value, 'Number3')
        if (match) {
          callback(new Error(this.$t(match)))
        } else {
          if (value > 60 * 60 * 24) {
            callback(new Error(this.$t('validate.afterOpTime')))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    var validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.enterPassword')))
      } else if (value !== this.ruleForm1.password) {
        callback(new Error(this.$t('validate.wrongPassword')))
      } else {
        callback()
      }
    }
    let lengthRegex = new RegExp('^\\w{6,}$')
    let characterRegex = new RegExp('[a-zA-Z]{1,}')
    let numberRegex = new RegExp('[0-9]{1,}')
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.enterPassword')))
      } else if (!(lengthRegex.test(value) && characterRegex.test(value) && numberRegex.test(value))) {
        callback(new Error(this.$t('validate.newPasswordRule')))
      } else if (value === this.ruleForm1.password) {
        callback(new Error(this.$t('validate.checkPassword')))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.enterPassword')))
      } else if (!(lengthRegex.test(value) && characterRegex.test(value) && numberRegex.test(value))) {
        callback(new Error(this.$t('validate.newPasswordRule')))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error(this.$t('validate.disagreePassword')))
      } else {
        callback()
      }
    }
    return {
      UserDetail: false,
      isAutoBusyTime: false,
      isEditUserInfo: true,
      activeName: 'first',
      user_icon: '',
      ruleForm1: {
        displayName: '',
        mobile: '',
        email: '',
        AutoBusyTime: '',
        password: ''
      },
      ruleForm2: {
        pass: '',
        checkPass: '',
        oldPassword: ''
      },
      rules1: {
        displayName: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        AutoBusyTime: [
          { validator: validateNum, trigger: 'blur' }
        ]
      },
      rules2: {
        oldPassword: [
          { required: true, validator: validateOldPass, trigger: 'blur' }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    openDialog () {
      this.user_icon = ''
      this.UserDetail = true
    },
    appUserInfoUpdate (ev) {
      this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          let data = {
            displayName: this.ruleForm1.displayName,
            email: this.ruleForm1.email,
            mobile: this.ruleForm1.mobile,
            AutoBusyTime: this.ruleForm1.AutoBusyTime,
            im_icon: this.user_icon || this.$store.state.session.user.im_icon,
            _id: this._id
          }
          this.$store.dispatch('userEdit', data).then(req => {
            if (req) {
              this.UserDetail = false// 关闭
              this.$message({
                message: this.$t('message.editSucess'),
                type: 'success'
              })
            }
          })
        } else {
          return
        }
      })
    },
    appUserPasswordUpdate (ev) {
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          let data = {
            password: this.ruleForm2.pass,
            _id: this._id
          }
          this.$store.dispatch('userEdit', data).then(req => {
            if (req) {
              this.UserDetail = false// 关闭
              this.$message({
                message: this.$t('message.editSucess'),
                type: 'success'
              })
            }
          })
        } else {
          return
        }
      })
    },
    resetFields () {
      this.$refs.ruleForm2.resetFields()// 重置
      this.$refs.ruleForm1.resetFields()
      this.$refs.ruleForm2.oldPassword = ''
    },
    initUploadUserIcon (ev) {
      let account = this.$store.state.session.user.account
      let that = this
      let filters = {
        mime_types: [
          { title: 'Image files', extensions: 'jpg,jpeg,gif,png,bmp' }
        ]
      }
      let fileAdded = function (up, files) {
        console.log('fileAdd')
      }
      let beforeUpload = function (up, file) {
        console.log('beforeUpload')
      }
      let uploadProgress = function (up, file) {
        console.log('uploadProgress')
      }
      let uploadComplete = function () {
        console.log('uploadComplete')
      }
      let fileUploaded = function (up, file, info) {
        let domain = up.getOption('domain')
        let res = JSON.parse(info)
        let sourceLink = domain + res.key // 获取上传成功后的文件的Url
        that.user_icon = sourceLink
      }
      let error = function (up, err, errTip) {
        console.log('uploadError ' + errTip)
      }
      let key = function (up, file) {
        let date = m7Utils.getCurrentDate()
        let today = new Date()
        let time = today.getTime()
        let fileName = file.name
        let fileSuffix = ''
        if (fileName) {
          fileSuffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
        }
        let key = account + '/icon/' + date + '/' + time + '/' + uuid.v1() + fileSuffix
        return key
      }
      uploadTo7moorDomain(this.$store.state.session.user._id, 'uploadUserIcon', filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploaded, error, key)
    }
  },
  watch: {
    UserDetail (cur, pre) {
      if (!cur) {
        this.resetFields()
      }
    }
  },
  components: {
    notifySwitch
  },
  beforeMount () {
    if (!m7Utils.isHasFunc('func_user_edit_no_auto_busy_time', this.$store.state.session.user)) {
      // 座席个人设置中禁止修改后处理时长
      this.isAutoBusyTime = true
    }
    if (m7Utils.isHasFunc('func_not_allow_user_edit_info', this.$store.state.session.user)) {
      // 禁止座席修改个人信息
      this.isEditUserInfo = false
    }
  },
  updated () {
    this.ruleForm1 = this.userAutoBusyTime
  }
}
</script>
<style scoped lang="stylus">
@import "../../../assets/common.styl";
.center
  padding 10px 10px 0
  white-space nowrap
  line-height 30px
  overflow hidden
  cursor pointer
.agent
  display inline-block
  float left
  margin-right 8px
  box-size(30px,30px)
  border-radius 15px
  background url("../contact-summary/img/agent.png") no-repeat 50% 50%
  background-size 30px auto
  overflow hidden
  img
    width 30px
    background-color #fff
.txrt
  margin-top 20px
  text-align right
.im_icon
  display block
  width 40px
  height 40px
  border-radius 35px
  overflow hidden
  position relative
  background url("../contact-summary/img/agent.png") no-repeat 50% 50%
  background-size 40px auto
  img
    width 40px
    background-color #fff
  .userEdit
    width 80px
    height 80px
    position absolute
    left 0
    top 0
    opacity 0
.userName
  display inline-block
  max-width 5em
  white-space nowrap
  text-overflow ellipsis
  overflow hidden
  vertical-align bottom
  color $cf-gray1
</style>
