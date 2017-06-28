<template>
<div class="customer-dialog">
  <div class="block text" @click="toggle">
    <i class="iconfont icon-chakanxinxi"></i>
  </div>
  <div class="cust_info" :class="{ 'layout' : isShow, 'layin': !isShow}">
    <span class="el-icon-close" @click="close"></span>
    <h4>{{$t('questionnaire.customerInfo')}}</h4>
    <table>
      <tbody>
        <tr  v-for="item in custDetial">
          <td class="label">{{item.name}}</td>
          <td v-if="item.name === $t('public.contactWay')" class="label">{{phoneNum}}</td>
          <td v-else class="label">{{item.value}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>
<script>
// import { showFieldDesc } from '../../../utils/customerUtils.js'
export default {
  name: 'ShowQuestionInfo',
  data () {
    return {
      isShow: false
    }
  },
  props: {
    custDetial: Array,
    phoneNum: String,
    cid: String
  },
  methods: {
    toggle () {
      this.isShow = !this.isShow
    },
    close () {
      this.isShow = false
    }
  },
  watch: { // 当切换卡片时隐藏当前组件
    cid () {
      this.isShow = false
    }
  }
}
</script>
<style lang="stylus" scoped>
.text
    text-align center
.layout
  transition transform 0.35s
  box-shadow 0 3px 6px rgba(0, 0, 0, .3)
  animation movelayout .4s
  @keyframes movelayout
    0%
      width 300px 
    100% 
      width 610px
.layin
  width:0px
  transition transform 0.35s
.block
  width 36px
  height 36px
  border 1px solid #1abb9c
  border-radius 50%
  line-height 36px
  cursor pointer
.cust_info
  position fixed
  z-index 1998
  right 0
  top 54px
  bottom 0
  background #fff
  border-left 1px solid #d3d3d3
  overflow-y auto
  overflow-x hidden
  cursor auto
  .el-icon-close
    float right
    width 14px
    margin-right 20px
    font-size 14px
    line-height 40px
    cursor pointer
  h4
    display block
    border-bottom 1px solid #d3d3d3
    text-indent 20px
    line-height 42px
  table
    width 570px
    margin 20px
    font-size 12px
    box-sizing border-box
    tr
      td.label
        width 120px
        padding-right 10px
.iconfont
  font-size 16px
  color #1abb9c
</style>
