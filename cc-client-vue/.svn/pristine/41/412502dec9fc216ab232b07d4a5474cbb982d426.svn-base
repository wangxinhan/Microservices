<template>
  <div>
  <right>
    <template slot="card" v-loading="loading" v-if="!loading">
      <CardGroup :currentTabType="currentTabType" @changeCardItem="changeCardItem" @tabChange="tabChange"></CardGroup>
    </template>
    <template slot="detail">
      <div v-loading="rLoading" :element-loading-text="$t('public.loadingModuleText')" v-show="rLoading" style="height: 600px">
      </div>
        <transition name="fade" mode="out-in" @before-enter="beforeEnter">
          <router-view @routeChange="routeChange">
          </router-view>
        </transition>
    </template>
  </right>
  </div>
</template>
<script>
  import right from 'components/ui-modules/right-layout/RightLayout'
  import CardGroup from './WebchatCardGroup.vue'
  export default {
    name: 'Webchat',
    data () {
      return {
        rLoading: false,
        loadResource: false,
        loading: true,
        webchatList: [],
        tabType: 'webchat_todo'
      }
    },
    components: {
      right,
      CardGroup
    },
    methods: {
      changeCardItem () {
        if (!this.loadResource) {
          this.rLoading = true
        }
      },
      routeChange (tabType) {
        this.tabType = tabType
      },
      beforeEnter () {
        this.loadResource = true
        this.rLoading = false
      },
      tabChange (tabType) {
        this.tabType = tabType
      }
    },
    computed: {
      currentTabType () {
        return this.tabType
      }
    },
    beforeMount () {
      this.loadResource = true
      let that = this
      fetchCurrentUser(this.$store, {}).then(() => {
        that.loading = false
      })
      // todo 测试主动会话后台接口
      /* let ubaSession = null
      that.$store.dispatch('getSessionsByAccount', {pageSize: 10}
      ).then(function () {
        ubaSession = that.$store.state.webchat.inviteUbaSessionList.list[0]
        if (ubaSession) {
          return that.$store.dispatch('getMoreTrack', {sid: ubaSession._id})
        }
      }).then(() => {
        let sessionIds = []
        if (ubaSession) {
          sessionIds.push(ubaSession._id)
          let inviteMessage = '邀请语13213123'
          that.$store.dispatch('inviteCustomers', {sessionIds, inviteMessage})
        }
      }) */
    }
  }
  function fetchCurrentUser (store, data) {
    return store.dispatch('getCurrentUser', data)
  }
</script>
<style lang="stylus" scoped>
  .call{
    background: #efefef;
    color:fff;
  }
  li{
    width:439px;
    height:79px;
    border-bottom:1px solid #eee;
  }
  .cust-tab{
    height:100%;
  }
</style>
