<template>
  <div v-if="isCard" class="time_card">
    <span v-show="showWaitTime" class="cardChatTimers status_deal card_statu_li">
      {{$t('webchat.visitorWait')}} <span>{{waitTime}}</span>
    </span>
  </div>
  <div v-else>
    <div v-show="showWaitTime" class="chatTimers chat_item system clearfix">
      <div class="chat_content">{{$t('webchat.visitorWait')}} <span>{{waitTime}}</span> </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'WebchatTimer',
    props: {
      isCard: Boolean,
      waitTime: String,
      showWaitTime: Boolean
    },
    data () {
      return {
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .chatTimers
    position absolute
    text-align center
    margin-left -110px
    padding 0
    width 220px
    left 50%
    top -28px
    .chat_content
      display inline-block
      width 100%
      height 26px
      border-radius: 13px
      text-align center
      display inline-block
      padding 0
      line-height 26px
      background #FBD293
      color #666
  .card_statu_li.cardChatTimers
    display inline-block
    width auto
    height 22px
    line-height 22px
    color #fff
    background #fe9113
    text-align center
    border-radius 4px
    padding 0 8px
  .time_card
    display inline-block
</style>
