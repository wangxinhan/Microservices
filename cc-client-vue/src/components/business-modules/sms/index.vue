<!--短信模块：1.我的短信  2.所有短信  3.群发短信  4.导入群发短信  5.短信模板管理  by 洪文-->
<template>
  <div class="sms" >
    <el-tabs v-model="activeName" :active-name="activeName" @tab-click="tab">
      <el-tab-pane :label="$t('sms.mySMS')" name="my">
        <sms-my :refresh="refresh"></sms-my>
      </el-tab-pane>
      <el-tab-pane :label="$t('sms.allSMS')" name="all">
        <sms-all :refresh="refresh"></sms-all>
      </el-tab-pane>
      <el-tab-pane :label="$t('sms.massSMS')" name="mass">
        <sms-mass :refresh="refresh"></sms-mass>
      </el-tab-pane>
      <el-tab-pane :label="$t('sms.importSMS')" name="import">
        <sms-import :refresh="refresh"></sms-import>
      </el-tab-pane>
      <el-tab-pane :label="$t('sms.template')" name="template">
        <sms-template :refresh="refresh"></sms-template>
      </el-tab-pane>
    </el-tabs>
    <div></div>
  </div>
</template>
<script>
  import smsMy from 'components/business-modules/sms/SmsMy.vue'
  import smsAll from 'components/business-modules/sms/SmsAll.vue'
  import smsMass from 'components/business-modules/sms/SmsMass.vue'
  import smsImport from 'components/business-modules/sms/SmsImport.vue'
  import smsTemplate from 'components/business-modules/sms/SmsTemplate.vue'
  export default {
    name: 'sms',
    data () {
      return {
        activeName: 'my',
        refresh: 'my'
      }
    },
    methods: {
      tab (tab) {
        this.refresh = tab.name
      }
    },
    components: {
      smsMy,
      smsAll,
      smsMass,
      smsImport,
      smsTemplate
    },
    activated () {
      this.activeName = 'my'
      this.refresh = 'my'
      this.$router.push({path: '/index/sms'})
    }
  }
</script>
<style lang="stylus" scoped>
  .sms
    height calc(100vh - 53px)
    background #fff
    .smsMy
    .smsAll
    .smsMass
    .smsTemplate
      padding 20px
      height calc(100vh - 115px)
      overflow auto
    .smsImport
      padding 0 0 20px
      height calc(100vh - 95px)
  .el-tabs__item
    margin-left: 12px
</style>
