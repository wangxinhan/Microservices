<template>
  <div class="notifyswitch">
    <div class="content">
      <el-checkbox v-model="notifySwitch.customerPlan">联系计划提醒</el-checkbox>
    </div>
    <div class="footer">
      <el-button @click="close">{{$t('public.cancel')}}</el-button>
      <el-button type="primary" @click="updateNotifySwitch">{{$t('public.confirm')}}</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NotifySwitch',
    data () {
      return {
        notifySwitch: {}
      }
    },
    methods: {
      updateNotifySwitch () {
        window.sessionStorage.setItem('notifySwitch', JSON.stringify(this.notifySwitch))
        this.close()
      },
      close () {
        this.$emit('close')
      }
    },
    beforeMount () {
      this.notifySwitch = JSON.parse(window.sessionStorage.getItem('notifySwitch'))
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus">
  .notifyswitch
    .content
      text-align center
      margin 20px 0
    .footer
      text-align right
      margin-bottom 22px
</style>
