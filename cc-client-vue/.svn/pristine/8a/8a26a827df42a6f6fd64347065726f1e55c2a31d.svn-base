<template>
  <div class="nav">
    <div class="icon oem-7moor"><span class="hide">{{ loadMenuNews }}</span></div>
    <div class="nav-items">
      <div class="nav-items-top">
        <nav-item
          v-for="nav in navs"
          v-if="nav.show"
          :nav-type="nav.icon"
          :no-badge="nav.noBadge"
          :tip-content="$t(nav.content)"
          :link="nav.link"
          :ic = "nav.ic"
          @changeRoute="changeMenu"
          >
          </nav-item>
      </div>
    </div>
  </div>
</template>
<script>
  import navItem from './NavItem.vue'
  import { mapValues } from 'lodash'
  export default {
    name: 'navBar',
    components: {
      navItem
    },
    data () {
      return {
        navs: {
          workbench: {
            show: true,
            icon: 'nav-workbench',
            content: 'public.workbench',
            link: '/index/workbench',
            noBadge: true,
            ic: 'icon-gongzuotai'
          },
          cdr: {
            id: 'nav_call',
            show: false,
            icon: 'nav-cdr',
            content: 'public.call',
            link: '/index/call/cdr_call',
            noBadge: true,
            ic: 'icon-dianhua'
          },
          im: {
            id: 'nav_webchat',
            show: false,
            icon: 'nav-im',
            content: 'public.webchat',
            link: '/index/webchat/webchat_todo',
            noBadge: true,
            ic: 'icon-zaixianzixun'
          },
          mail: {
            id: 'nav_email',
            show: false,
            icon: 'nav-mail',
            content: 'public.mail',
            link: '/index/email',
            noBadge: true,
            ic: 'icon-youjian'
          },
          customer: {
            id: 'nav_customer',
            show: false,
            icon: 'nav-customer',
            content: 'public.customer',
            link: '/index/customer',
            noBadge: true,
            ic: 'icon-kehu'
          },
          bussiness: {
            id: 'nav_business',
            show: false,
            icon: 'nav-bussiness',
            content: 'public.business',
            link: '/index/business',
            noBadge: true,
            ic: 'icon-gongdan'
          },
          km: {
            id: 'nav_km',
            show: false,
            icon: 'nav-km',
            content: 'public.km',
            link: '/index/km',
            noBadge: true,
            ic: 'icon-zhishiku'
          },
          report: {
            id: 'nav_report',
            show: false,
            icon: 'nav-report',
            content: 'public.report',
            link: '/index/report',
            noBadge: true,
            ic: 'icon-baobiao'
          },
          monitor: {
            id: 'nav_monitor',
            show: false,
            icon: 'nav-monitor',
            content: 'public.monitor',
            link: '/index/monitor',
            noBadge: true,
            ic: 'icon-jiankong'
          },
          questionnaire: {
            id: 'nav_questionnaire',
            show: false,
            icon: 'nav-questionnaire',
            content: 'public.questionnaire',
            link: '/index/questionnaire',
            noBadge: true,
            ic: 'icon-wenjuantiaocha'
          },
          qualityCheck: {
            id: 'nav_qualityCheck',
            show: false,
            icon: 'nav-qualityCheck',
            content: 'public.qualityCheck',
            link: '/index/qualityCheck',
            noBadge: true,
            ic: 'icon-zhijianguanli'
          },
//          misscall: {
//            id: 'my_call_sheet_leak',
//            show: false,
//            icon: 'nav-misscall',
//            content: 'public.misscall',
//            link: '/index/misscall',
//            noBadge: true,
//            ic: 'icon-weijielaidian'
//          },
          sms: {
            id: 'nav_sms',
            show: false,
            icon: 'nav-sms',
            content: 'public.SMS',
            link: '/index/sms',
            noBadge: true,
            ic: 'icon-duanxin'
          },
          urlInterface: {
            id: 'nav_url_interface',
            show: false,
            icon: 'nav-interface',
            content: 'public.interface',
            link: '/index/interface',
            noBadge: true,
            ic: 'icon-lianjie'
          },
          config: {
            show: false,
            icon: 'nav-config',
            content: 'public.config',
            link: '/index/config',
            noBadge: true,
            ic: 'icon-peizhi'
          }
        }
      }
    },
    computed: {
      loadMenuNews () {
        if (this.$store.state.webchat.todoNum > 0 || this.$store.state.webchat.queueNum > 0) {
          this.navs.im.noBadge = false
        } else {
          this.navs.im.noBadge = true
        }
        if (this.$store.state.email.todoNum > 0 || this.$store.state.email.queueNum > 0) {
          this.navs.mail.noBadge = false
        } else {
          this.navs.mail.noBadge = true
        }
        let roleNum = this.$store.state.business.roleNum
        let total = this.$store.state.business.total
        if (total > 0 || roleNum > 0) {
          this.navs.bussiness.noBadge = false
        } else {
          this.navs.bussiness.noBadge = true
        }
        let cdrCallNum = this.$store.state.call.unReadCdr
        if (cdrCallNum && cdrCallNum > 0) {
          this.navs.cdr.noBadge = false
        } else {
          this.navs.cdr.noBadge = true
        }
      },
      tabName () {
        return this.$route.params.tabName ? this.$route.params.tabName : 'noTabName'
      }
    },
    watch: {
      tabName (to, form) {
        if (this.tabName.split('_')[0] === 'cdr') {
          this.navs.cdr.link = '/index/call/' + this.tabName
        } else if (this.tabName.split('_')[0] === 'webchat') {
          this.navs.im.link = '/index/webchat/' + this.tabName
        }
      },
      $route (to, from) {
        let fromArr = from.path.split('/')
        let toArr = to.path.split('/')
        let session = window.sessionStorage
        let data = {}
        let sameFlag = false
        let callObj = JSON.parse(session.getItem('call'))
        let webchatObj = JSON.parse(session.getItem('webchat'))
        if (callObj) {
          if (callObj.url === to.path) { // 解决来电卡片跳转路由死循环的问题
            sameFlag = true
          }
        }
        if (webchatObj) {
          if (webchatObj.url === to.path) { // 解决来电卡片跳转路由死循环的问题
            sameFlag = true
          }
        }
        data.url = from.path
        data.flag = false // 其他模块为false
        if ((fromArr[3] === 'cdr_call' || fromArr[3] === 'webchat_todo') && fromArr.length > 4 && !sameFlag) { // 是来电并且带着id
          data.flag = true
          var fromItem = ''
          if (fromArr[3] === 'cdr_call') {
            fromItem = 'call'
          } else {
            fromItem = 'webchat'
          }
          session.setItem(fromItem, JSON.stringify(data))
          if (to.query.flag === 'list' || to.query.flag === 'notify') { // 卡片之间切换时,或者是推送消息点击
            let newData = {url: from.path, flag: true}
            session.setItem(fromItem, JSON.stringify(newData))
          }
        }
        if (toArr[3] && (toArr[3] === 'cdr_call' || toArr[3] === 'webchat_todo') && !sameFlag) {   // 通话tab切换到我的和全部模块时
          callObj = JSON.parse(session.getItem('call'))
          webchatObj = JSON.parse(session.getItem('webchat'))
          if (toArr[3] === 'cdr_call' && callObj) {
            callObj.flag = true
            session.setItem('call', JSON.stringify(callObj))
          } else if (toArr[3] === 'webchat_todo' && webchatObj) {
            webchatObj.flag = true
            session.setItem('webchat', JSON.stringify(webchatObj))
          }
        } else if (toArr[2] && (toArr[2] === 'webchat' || toArr[2] === 'call') && !sameFlag) { // 通话tab切换到来电模块时
          callObj = JSON.parse(session.getItem('call'))
          webchatObj = JSON.parse(session.getItem('webchat'))
          if (toArr[2] === 'call' && callObj) {
            callObj.flag = false
            session.setItem('call', JSON.stringify(callObj))
          } else if (toArr[2] === 'webchat' && webchatObj) {
            webchatObj.flag = false
            session.setItem('webchat', JSON.stringify(webchatObj))
          }
        }
        if ((toArr[3] === 'cdr_call' || toArr[3] === 'webchat_todo') && !sameFlag) { // 跳转到带着id的来电路由
          if (session.getItem('call') && toArr[3] === 'cdr_call') {
            if (to.query.flag === 'list' || to.query.flag === 'notify') { // 接了一个来电之后，又打一个来电
              let callData = {url: to.fullPath, flag: true}
              session.setItem('call', JSON.stringify(callData))
            }
            if (JSON.parse(session.getItem('call')).flag) {
              if (to.query.flag === 'add') {
                return
              }
              let url = JSON.parse(session.getItem('call')).url
              if (url.indexOf('/add') > -1) { // 未定位到客户
                this.$router.push({path: JSON.parse(session.getItem('call')).url + '?flag=add'})
              } else {
                this.$router.push({path: JSON.parse(session.getItem('call')).url})
              }
            }
          } else if (session.getItem('webchat') && toArr[3] === 'webchat_todo') {
            if (to.query.flag === 'list' || to.query.flag === 'notify') { // 从卡片上跳转过来的时候要保存路由
              let callData = {url: to.fullPath, flag: true}
              session.setItem('webchat', JSON.stringify(callData))
            }
            // 目标路由是webchat_todo   并且是长度为4的时候  代表点击到了带处理页面 然后beforeupdate触发点击事件
            if (JSON.parse(session.getItem('webchat')).flag && !this.$store.state.webchat.onTimeSearch && toArr.length === 4) {
              this.$router.push({path: JSON.parse(session.getItem('webchat')).url})
            }
          }
        }
      }
    },
    methods: {
      changeMenu (navType) {
        this.$emit('changeMenu', navType)
      }
    },
    beforeMount () {
      this.$store.dispatch('initMenu').then(() => {
        let menus = this.$store.state.session.clientMenu
        menus.forEach(menu => {
          mapValues(this.navs, nav => {
            if (nav.id === menu.id) {
              nav.show = true
            }
          })
        })
        if (this.tabName.split('_')[0] === 'cdr') {
          this.$router.push({path: '/index/call/cdr_call'})
        } else if (this.tabName.split('_')[0] === 'webchat') {
          this.$router.push({path: '/index/webchat/webchat_todo'})
        }
      })
      this.$store.dispatch('refreshUndealNum')
      this.$store.dispatch('getUndealInvitation')
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../assets/common.styl'
  @media screen and (max-height: 650px)
    .nav
      font-size 12px
  .nav
    position absolute
    left 0
    top 0
    width 64px
    height 100%
    background -webkit-linear-gradient(top, #00adcf 0%, #0068a5 100%)
  .icon
    box-size(1.85em,2.07em)
    background url(../../../assets/logo.png) no-repeat
    background-size 1.85em auto
    margin 0.93em auto
  .nav-items-top
    box-size(100%, 100%)
  .nav-items-bottom
    bottom 0
    border-top 1px solid #0085ae
</style>
