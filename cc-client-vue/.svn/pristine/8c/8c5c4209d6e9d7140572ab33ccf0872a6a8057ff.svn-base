<template>
<div>
  <div class="customer-dialog">
    <div class="text" type="text" @click="editCustomerInfo = true">
      <i class="iconfont icon-gengxinkehu"></i>
    </div>
    <el-dialog modal-append-to-body lock-scroll top="10%" title="更新客户" v-model.trim="editCustomerInfo" :size="callScreen?'full':'small'" :modal="callScreen?false:true">
      <div class="edit" :class="callScreen?'screen-edit':''" v-if="editCustomerInfo">
        <edit-cust
          :editCustType ="update"
          :custInfo = "custInfo"
          :isBlight = "false"
          :currentBusinessObj = "currentBusinessObj"
          @editCust='updateCustomer'
        ></edit-cust>
      </div>
    </el-dialog>
  </div>
</div>
</template>
<script type="text/javascript">
  import EditCust from '../../business-modules/customer/AddCus.vue'
  export default{
    name: 'EditCustomerInfo',
    components: {
      EditCust
    },
    data () {
      return {
        editCustomerInfo: false,
        update: 'update',
        isShow: false
      }
    },
    props: {
      currentBusinessObj: Object,
      custInfo: Object,
      callScreen: Boolean
    },
    methods: {
      updateCustomer (form) {
        form.type = this.currentBusinessObj.type
        form.tabType = this.currentBusinessObj.tabType
        form.callId = this.currentBusinessObj.callId
        this.$store.dispatch('updateCustomer', form).then((response) => {
          if (response.success) {
            this.editCustomerInfo = false
          }
        })
      },
      showEditWindow () {
        let node = document.getElementsByClassName('call-screen-wrap')[0]
        node.style.display = 'block'
        this.isShow = !this.isShow
      },
      close () {
        this.isShow = false
      }
    }
  }
</script>
<style lang="stylus" scoped>
  legend
    display block
    width 100%
    padding 0
    margin-bottom 20px
    font-size 18px
    line-height 40px
    color #333333
    border 0
    border-bottom 1px solid #e5e5e5
  .text
    text-align center
  .iconfont
    font-size 14px
    color #1abb9c
  .edit
    left 20px
    overflow-y auto
    height 440px
    .add
      height 100%
  .screen-edit
    height 350px
  .el-form
    padding 0 50px
    margin-bottom 80px
    .save
      background #1abb9c
      width 110px
      border none
      height 36px
      font-size 16px
      margin-right 0
      position absolute
      right 0px
  .push
    font-size 24px
    color #1abb9c
    display inline-block
    margin-top 26px
  .del
    margin-top 4px
  .call-screen-wrap
    display none
    width 100%
  .call-screen-container
    position fixed
    z-index 1998
    right 0
    top 0
    bottom 0
    background #fff
    border-left 1px solid #d3d3d3
    overflow-y auto
    cursor auto
  .layout
    transition transform 0.35s
    box-shadow 0 3px 6px rgba(0, 0, 0, .3)
    animation movelayout .25s
    @keyframes movelayout
      0%
        width 300px
      100%
        width 610px
  .layin
    width 0
    transition transform 0.35s
  .el-icon-close
    position absolute
    top 20px
    right 20px
    cursor pointer
  .call-screen-h3
    padding 16px 0 0 20px
</style>
