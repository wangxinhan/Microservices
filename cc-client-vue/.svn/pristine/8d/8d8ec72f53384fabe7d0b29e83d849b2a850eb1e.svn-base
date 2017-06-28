<template>
  <div class="waiting-wrap">
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('cti.waite')" v-model.trim="showTransferCancelDialog"  class="call-label" size="tiny" :show-close="false" :close-on-click-modal="false">
      <template>
        <p class="wat-p">{{$t('cti.waiting')}}<span class="seat">{{waitState.Exten}}</span>{{$t('cti.pleaseWait')}}( <span>{{waitState.time}}</span> )</p>
        <el-button v-if="waitState.isTransfer" class="cancel-btn" @click="phoneCancelTransfer">{{$t('public.cancel')}}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'waiting',
    props: ['waitState', 'showTransferCancelDialog'],
    data () {
      return {
        showClose: false
      }
    },
    methods: {
      phoneCancelTransfer () {
        this.$store.dispatch('phoneCancelTransfer')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  div
    width 100%
    height 100%
  .call-label
    text-align left
  .seat
    color #8ecbd1
  .wat-p
    text-align center
  .cancel-btn
    display block
    margin 0 auto
    background #8ecbd1
    color #fff
    text-align center
    margin-top 20px
</style>
