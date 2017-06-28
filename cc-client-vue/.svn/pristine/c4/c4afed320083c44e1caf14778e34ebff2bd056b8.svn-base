<template>
  <el-dropdown trigger="click" @command="emailTo">
    <span class="el-dropdown-link">
      <i :class="['iconfont', 'icon-youjian',  email.length===0 ? 'disable':'']"></i>
    </span>
    <el-dropdown-menu v-if="email.length>0"slot="dropdown">
      <el-dropdown-item :command="ema.email" v-for="ema in email">
      <a :href="'mailTo:' + ema.email"><span>{{ema.email}}</span><span v-if="ema.memo">({{ema.memo}})</span></a>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  export default {
    name: 'Email',
    data () {
      return {
      }
    },
    props: {
      email: Array
    },
    methods: {
      emailTo (command) {
      }
    }
  }
</script>
<style lang="stylus" scoped>
.el-dropdown, .el-dropdown-link
  display block
  width 100%
  height 100%
  line-height 36px
  text-align center
  color #1abb9c
  .iconfont
    font-size 18px
  .disable
    color #d3d3d3
    cursor no-drop
</style>
