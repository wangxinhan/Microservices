<template>
  <div v-if="isim" class="isim">
    <el-badge :value="queueNum" :max="99" class="item" v-if="queueNum">
    </el-badge>
     <span v-if="im.userStatus=='online' && status">
        <div :class="'cust_'+status" :style="{fontSize:size+'px'}">
          <i :class="'im_'+im.platform"></i>
        </div>
     </span>
    <span v-if="im.userStatus=='online' && !status">
       <div class="cust_status10" :style="{fontSize:size+'px'}">
         <i :class="'im_'+im.platform"></i>
       </div>
    </span>
    <span v-if="im.userStatus!='online' && status">
       <div :class="'cust_'+status+' active'" :style="{fontSize:size+'px'}">
         <i :class="'im_'+im.platform+' active'"></i>
       </div>
    </span>
    <span v-if="im.userStatus!='online' && !status">
       <div  class="cust_status10 active" :style="{fontSize:size+'px'}">
         <i :class="'im_'+im.platform+' active'"></i>
       </div>
    </span>
  </div>
  <div class="isim__div" v-else>
    <span v-if="status" :class="'cust_'+status" :style="{fontSize:size+'px'}">
      <el-badge :value="queueNum" :max="99" class="item" v-if="queueNum">
      </el-badge>
    </span>
    <span v-else class="cust_status10" :style="{fontSize:size+'px'}">
      <el-badge :value="queueNum" :max="99" class="item" v-if="queueNum">
      </el-badge>
    </span>
    <span v-if="iscall">
      <i :class="'call_'+call" v-if="call"></i>
      <i :class="call_normal" v-else></i>
    </span>
    <span v-if="!isRead&&type==='business_my'">
        <i class="businessIsRead"></i>
    </span>
    <span v-if="isRead&&type==='cdr_call'">
        <i class="businessIsRead"></i>
    </span>
  </div>
</template>
<script>
  export default {
    name: 'CustomerAvatar',
    props: {
      status: String,
      size: Number,
      isim: Boolean,
      iscall: Boolean,
      im: Object,
      call: String,
      isRead: {type: Boolean, default: true},
      type: String,
      queueNum: Number
    },
    data () {
      return {
      }
    }
  }
</script>
<style lang="stylus" scoped>
  [class^="cust_status"]
    position relative
  [class^='im_'],[class^='call_']
    padding 4px
    background #fff
    position absolute
    left 22px
    top 20px
    border-radius 50%
  [class^="cust_status"],[class^='im_'],[class^='call_']
    font-family "iconfont" !important
    font-style normal
    -webkit-font-smoothing antialiased
  [class^="cust_status"]
    font-size 20px
  [class^='im_']
    top 18px
    font-size 14px
  [class^='call_']
    font-size 12px
  [class^="cust_status"]:before
    color #fff
    padding 8px
    border-radius 50%
  .cust_status0:before
    background #9761AD
    content "\E652"
  .cust_status0  [class^="im_"]
    color #9761AD
  .cust_status1:before
    background #ED5870
    content "\E647"
  .cust_status1  [class^="im_"]
    color #ED5870
  .cust_status2:before
    background #F48C4D
    content "\E640"
  .cust_status2  [class^="im_"]
    color #F48C4D
  .cust_status3:before
    background #FBB100
    content "\E685"
  .cust_status3  [class^="im_"]
    color #FBB100
  .cust_status4:before
    background #79B05D
    content "\E645"
  .cust_status4  [class^="im_"]
    color #79B05D
  .cust_status5:before
    background #5F89BB
    content "\E64B"
  .cust_status5  [class^="im_"]
    color #5F89BB
  .cust_status6:before
    background #66BDC7
    content "\E646"
  .cust_status6  [class^="im_"]
    color #66BDC7
  .cust_status7:before
    background #9761AD
    content "\e6a6"
  .cust_status7  [class^="im_"]
    color #9761AD
  .cust_status8:before
    background #BBC9D6
    content "\E649"
  .cust_status8  [class^="im_"]
    color #BBC9D6
  .cust_status9:before
    background #CECECE
    content "\e691"
  .cust_status9  [class^="im_"]
    color #CECECE
  .cust_status10:before
    background #009FE3
    content "\E64D"
  .cust_status10  [class^="im_"]
    color #009FE3
  .im_pc:before
    content "\e65b"
  .im_weixin:before
    content "\e651"
  .im_wap:before
    content "\e66d"
  .im_sdk:before
    content "\e671"
  .el-menu-item:hover [class^="call_"],.el-menu-item.is-active [class^="call_"]
    background:#e8f5fC
  [class^='im_'].active
    color #DAD8DA
  [class^="cust_status"].active:before
    background:#DAD8DA
  .call_dialout:before,.call_dialTransfer:before
    content "\e64f"
    color #44B7AE
  .call_normal:before,.call_transfer:before
    content "\e674"
    color #F5A628
  .businessIsRead
    display block
    position absolute
    width 10px
    height 10px
    background #ff4949
    border-radius 50%
    right 0
    top -4px
    border: 2px solid #fff
  .el-menu-item.is-active .card [class^='im_'].active
    background: #e8f5fc
  .card:hover [class^='im_']
    background #e8f5fc
  .el-menu-item.is-active .card [class^='im_']
    background: #e8f5fc
  .item
    margin-top -30px
    margin-left -16px
  .isim
    position relative
    .item
      margin 0
      position absolute
      z-index 5
      left 26px
      top -15px
  .isim__div
    display inline-block
</style>
