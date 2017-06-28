<template >
<div class="top-nav">
  <switches></switches>
  <phoneBar></phoneBar>
  <userInfo></userInfo>
</div>
</template>
<script>
  import Switches from './Switch'
  import UserInfo from './UserInfo'
  import PhoneBar from './PhoneBar'
  export default {
    name: 'top-nav',
    data () {
      return {
      }
    },
    components: {
      Switches,
      PhoneBar,
      UserInfo
    }
  }
</script>
<style scoped lang="stylus">
@import "../../../assets/common.styl";
.top-nav
  width calc(100% - 64px)
  height 52px
  background  #F0F2F7
  border-bottom  1px solid #D9D9D9 !important
  posa(0,64px)
.right
  margin-left 30.54em

</style>
