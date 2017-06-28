<template>
  <el-dropdown class="rel-operation" trigger="click" @command="custNav">
    <span class="el-dropdown-link">
      <i class="el-icon-plus el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown" v-if="!newEmptySeat">
      <el-dropdown-item class="ro-dropdown" command="/index/customer/add"><i class="el-icon-plus el-icon--right"> </i>增加</el-dropdown-item>
      <el-dropdown-item class="ro-dropdown" v-if="isAllowMergeCustomer" command="/index/customer/merge"><i class="iconfont icon-hebing el-icon--right"> </i>合并</el-dropdown-item>
      <el-dropdown-item class="ro-dropdown" command="/index/customer/customize"><i class="iconfont icon-zidingyikuaijiesousuo el-icon--right"> </i> 自定义快捷搜索</el-dropdown-item>
      <el-dropdown-item class="ro-dropdown" command="/index/customer/export"><i class="iconfont icon-daochu1 el-icon--right"> </i>导出任务</el-dropdown-item>
      <el-dropdown-item class="ro-dropdown" command="/index/customer/listQuery"><i class="iconfont icon-sousuo el-icon--right"> </i>撞单查询</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  import { isAllowMergeCustomer } from '../../../../utils/customerUtils.js'
  export default {
    name: 'DropdownMenu',
    props: {
      placeHolder: String,
      type: String,
      newEmptySeat: Boolean
    },
    data () {
      return {
      }
    },
    computed: {
      isAllowMergeCustomer () {
        return isAllowMergeCustomer(this.$store.state.session.user)
      }
    },
    methods: {
      custNav (command) {
        this.$router.push(command)
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../../assets/common"
.rel-operation
  height 30px
  line-height 30px
  font-size 18px
  margin-right 14px
  flex 1
.ro-dropdown
  color #999
.el-icon-plus, .iconfont
  margin-right 3px
  color $c-main
  font-size 16px
.icon-zidingyikuaijiesousuo
  color $c-main
.icon-zidingyikuaijiesousuo
  color $c-main
</style>
