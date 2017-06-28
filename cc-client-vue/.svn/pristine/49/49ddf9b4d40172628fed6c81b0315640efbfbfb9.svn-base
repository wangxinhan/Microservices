<template >
<div class="user-info">
  <div class="logout" @click="logoutVisible = true">
    <i class="iconfont icon-tuichu"></i>
  </div>
  <div class="user-pic">
    <UserPic></UserPic>
  </div>
  <div class="ways">
    <WaysOfAnswer></WaysOfAnswer>
  </div>
  <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('cti.isSignOut')" v-model.trim="logoutVisible" size="tiny">
    <el-checkbox v-model.trim="checked">{{$t('cti.afterOut')}}</el-checkbox>
    <span slot="footer" class="dialog-footer">
      <el-button @click="logoutVisible = false" >{{$t('public.cancel')}}</el-button>
      <el-button type="primary" @click="logout">{{$t('public.confirm')}}</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
  import WaysOfAnswer from './WaysOfAnswer'
  import UserPic from './UserPic'
  export default {
    name: 'UserInfo',
    data () {
      return {
        logoutVisible: false,
        checked: true
      }
    },
    methods: {
      logout () {
        this.logoutVisible = false
        window.localStorage.setItem('logout', this.$data.checked)
        this.$store.dispatch('ctiExit', !this.$data.checked)
      }
    },
    components: {
      WaysOfAnswer,
      UserPic
    },
    beforeMount () {
      let booleanFlag = window.localStorage.getItem('logout')
      if (booleanFlag === 'true') {
        booleanFlag = true
      } else {
        booleanFlag = false
      }
      this.$data.checked = booleanFlag
    }
  }
</script>
<style scoped lang="stylus">
@import "../../../assets/common.styl"
.user-info > div
  float right
  height 100%
  border-right 1px solid $c-border1
.user-info
  height 100%
  .ways
    min-width 120px
    text-align right
    white-space nowrap
  .user-pic
    min-width 113px
  .logout
    width 55px
    background-size 18px auto
    border-right 0
    color #9c9c9c
    font-weight bold
    text-align center
    line-height 52px
    cursor pointer
    .iconfont
      font-size 20px
</style>
