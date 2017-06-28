<template >
  <div>
    <el-tooltip class="item" effect="dark" :content="$t('cti.noConnectInternet')" placement="bottom" v-if="getFirstExtenType === 'sip'">
      <div class="first-status">
        <i class="icon iconfont icon-ermai"></i><span class="name-status">{{$t('cti.softPhone')}}{{statusRelay}}</span>
      </div>
    </el-tooltip>
    <div v-else>
      <el-tooltip class="item" effect="dark"  :content="$t('cti.noConnectInternet')" placement="bottom" v-if="type=='sip'||type=='gateway'">
        <el-dropdown menu-align="start" @command="changeLoginType" trigger="click">
          <span>
            <i class="icon iconfont icon-ermai" v-if="type=='sip'||type=='gateway'"></i><span class="name-status">{{extenTypeInfo}}{{statusRelay}}<i class="el-icon-arrow-down el-icon--right"></i></span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="gateway" command="gateway">{{$t('cti.wayOfSip')}}</el-dropdown-item>
            <el-dropdown-item v-if="sip" command="sip">{{$t('cti.wayOfBar')}}</el-dropdown-item>
            <el-dropdown-item v-if="Local" command="Local">{{$t('cti.wayOfPhone')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>
      <el-dropdown menu-align="start" @command="changeLoginType" trigger="click" v-else>
        <span>
          <i class="icon iconfont icon-ermai" v-if="type=='sip'||type=='gateway'"></i><span class="name-status">{{extenTypeInfo}}{{statusRelay}}<i class="el-icon-arrow-down el-icon--right"></i></span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="gateway" command="gateway">{{$t('cti.wayOfSip')}}</el-dropdown-item>
          <el-dropdown-item v-if="sip" command="sip">{{$t('cti.wayOfBar')}}</el-dropdown-item>
          <el-dropdown-item v-if="Local" command="Local">{{$t('cti.wayOfPhone')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'WaysOfAnswer',
    data () {
      return {
        type: ''
      }
    },
    computed: {
      statusRelay () {
        let relay = ''
        let peer = this.$store.state.cti.globalLet.phone_peers
        if (peer) {
          let state = peer[this.$store.state.session.user._id]
          if (state) {
            relay = state.status
          }
        }
        if (this.type === 'sip') {
          return relay === undefined ? '(-1)' : ('(' + relay + ')')
        } else if (this.type === 'gateway') {
          return relay === undefined ? '' : ('(' + relay + ')')
        } else {
          return ''
        }
      },
      getFirstExtenType () {
        let loginData = JSON.parse(window.sessionStorage.getItem('loginData'))
        this.type = loginData.extenType
        return loginData.extenType // 获取初始化登录方式，若为软电话，则不能再切换
      },
      extenTypeInfo () {
        let extenType = this.$store.state.cti.globalLet._cti_extenType
        this.type = extenType
        if (extenType === 'Local') {
          return this.$store.state.session.user.mobile
        } else if (extenType === 'gateway') {
          return this.$t('cti.SipPhone')
        } else if (extenType === 'sip') {
          return this.$t('cti.softPhone')
        }
      },
      extenType () {
        return this.$store.state.cti.globalLet._cti_extenType
      },
      gateway () {
        let extenType = this.$store.state.cti.globalLet._cti_extenType
        return extenType === 'gateway' ? 0 : 1
      },
      sip () {
        let extenType = this.$store.state.cti.globalLet._cti_extenType
        return extenType === 'sip' ? 0 : 1
      },
      Local () {
        let extenType = this.$store.state.cti.globalLet._cti_extenType
        return extenType === 'Local' ? 0 : 1
      }
    },
    methods: {
      changeLoginType (command) {
        let arr = command.split(',')
        let extenNum = ''
        let users = this.$store.state.session.user
        if (arr[0] === 'gateway') {
          if (users.hasOwnProperty('gatewayLoginWay')) {
            if (users.gatewayLoginWay) {
              if (!this.$store.state.session.user.gatewayExten || this.$store.state.session.user.gatewayExten === '') {
                this.$message.error(this.$t('cti.NotConfigSip'))
                return
              } else {
                extenNum = this.$store.state.session.user.gatewayExten
              }
            } else {
              this.$message.error(this.$t('cti.extenTypeError'))
              return
            }
          } else {
            if (!this.$store.state.session.user.gatewayExten || this.$store.state.session.user.gatewayExten === '') {
              this.$message.error(this.$t('cti.NotConfigSip'))
              return
            } else {
              extenNum = this.$store.state.session.user.gatewayExten
            }
          }
        } else if (arr[0] === 'Local') {
          if (users.hasOwnProperty('localLoginWay')) {
            if (users.localLoginWay) {
              if (!this.$store.state.session.user.mobile || this.$store.state.session.user.mobile === '') {
                this.$message.error(this.$t('cti.LocalNumisNULL'))
                return
              } else {
                extenNum = this.$store.state.session.user.mobileExten
              }
            } else {
              this.$message.error(this.$t('cti.extenTypeError'))
              return
            }
          } else {
            if (!this.$store.state.session.user.mobile || this.$store.state.session.user.mobile === '') {
              this.$message.error(this.$t('cti.LocalNumisNULL'))
              return
            } else {
              extenNum = this.$store.state.session.user.mobileExten
            }
          }
        } else {
          if (users.hasOwnProperty('sipLoginWay')) {
            if (users.sipLoginWay) {
              extenNum = this.$store.state.session.user.sipExten
            } else {
              this.$message.error(this.$t('cti.extenTypeError'))
              return
            }
          } else {
            extenNum = this.$store.state.session.user.sipExten
          }
        }
        this.$store.dispatch('phoneSwitchExtenType', {extenType: arr[0], extenNum: extenNum})
      }
    }
  }
</script>
<style scoped lang="stylus">
@import "../../../assets/common.styl"
.el-dropdown
  color $cf-gray1
.el-dropdown,.first-status
  padding 18px 10px 10px
  cursor pointer
  font-size 14px
.icon-ermai
  padding-right 6px
  font-size 14px
.name-status
   font-size 12px
</style>
