<template>
   <div class="func-tab" id="isSrcollBottom" :class="hiddenLine">
    <el-tabs :active-name="activeTab" @tab-click="handleClick">
      <el-tab-pane
            v-if="tabs.callDetail"
            :label="$t('public.callDetails')"
            :disabled="tabs.callDetail.disabled"
            name="callDetail">
            <slot

                  name="callDetailTab">
            </slot>
      </el-tab-pane>
      <el-tab-pane
          v-if="tabs.businessShow"
          :label="$t('public.business')"
          :disabled="tabs.businessShow.disabled"
          name="business">
          <slot

            name="businessTab">
          </slot>
      </el-tab-pane>
      <el-tab-pane  v-if="tabs.webchat" :label="$t('public.webchat')" :disabled="tabs.webchat.disabled" name="webchat"><slot  name="webchatTab"></slot></el-tab-pane>
      <el-tab-pane  v-if="tabs.email" :label="$t('public.email')" :disabled="tabs.email.disabled" name="email"><slot  name="emailTab"></slot></el-tab-pane>
      <el-tab-pane  v-if="tabs.businessCreateBeforePlan" :label="$t('public.business')" :disabled="tabs.businessCreateBeforePlan.disabled" name="business"><slot  name="businessTab"></slot></el-tab-pane>
      <el-tab-pane  v-if="tabs.plan" :label="$t('public.contactPlan')" :disabled="tabs.plan.disabled" name="plan"><slot  name="contactPlanTab"></slot></el-tab-pane>
      <el-tab-pane  v-if="tabs.businessCreate" :label="$t('public.business')" :disabled="tabs.businessCreate.disabled"  name="business"><slot  name="businessTab"></slot></el-tab-pane>
      <el-tab-pane  v-if="tabs.history" :label="$t('public.history')" :disabled="tabs.history.disabled"  name="history"><slot v-if="isShowCurrentTab==='history'" name="historyTab"></slot></el-tab-pane>
      <el-tab-pane  v-if="tabs.changeLog" :label="$t('public.changeLog')" :disabled="tabs.changeLog.disabled"  name="changeLog"><slot name="changeLogTab"></slot></el-tab-pane>
      <el-tab-pane  v-if="tabs.tabUrl" v-for= "(item, index) in tabUrls" :name="'item' + index">
        <span slot="label"><span class="max-name">{{item.name}}</span><i class="icon-duijie iconfont"  @click.stop="open(urlsStres,item.name,index)"></i></span>
        <slot :name="'item' + index + 'Tab'"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    name: 'FunTab',
    props: {
      tabs: Object,
      activeName: String,
      urlsStres: Array,
      hiddenLine: String
    },
    data () {
      return {
        showBus: false,
        isShowCurrentTab: this.activeName,
        disabled: true,
        btn: false,
        popUrls: '',
        currentCustomer: {},
        tabUrls: this.$store.state.session.dicMap.tabUrlAddress
      }
    },
    computed: {
      activeTab () {
        return this.activeName
      }
    },
    methods: {
      handleClick (tab, event) {
        this.$emit('changeDetailTab', tab.name)
        this.isShowCurrentTab = tab.name
        if (tab.name === 'business') {
          this.showBus = true
        }
      },
      open (url, name, index) {
        if (this.btn === false) {
          this.btn = true
        }
        let newUrl = url[index]
        let dragMess = {url: newUrl, name: name, open: true}
        this.$store.commit('SET_DRAGPOP', dragMess)
      }
    }
  }
</script>
<style lang="stylus" scoped>
.func-tab
  position relative
  &:before
    content ''
    height 1px
    width 100% + 24px
    background #d3d3d3
    position absolute
    top 35px
    left -20px
    z-index 1
  span
    display inline-block
    margin-top -3px
    .icon-duijie
      cursor pointer
      margin-left 6px
      color #999
  .is-active
    .icon-duijie
      color #1abb9c
.func-tab.hide-line
  &:before
    height 0
.max-name
  max-width 5em
  text-overflow ellipsis
  overflow hidden
  white-space nowrap
  display inline-block
  vertical-align bottom
</style>
