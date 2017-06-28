<template>
  <div class="audio_warp">
    <audio src="" id="music"></audio>
  </div>
</template>
<script type='text/javascript'>
export default({
  data () {
    return {
    }
  },
  computed: {
    notify () {
      return this.$store.state.notify
    },
    newNotify () {
      let notify = this.notify
      let tag = notify.tag
      let temp = {}
      temp.tag = tag
      switch (tag) {
        case 'cdr':
          let NOcallnum = notify.NOcallnum
          let titleCdr = this.$t('notify.call1') + NOcallnum + this.$t('notify.call2')
          let contentCdr = this.$t('notify.call3')
          temp = {
            tag: tag,
            title: titleCdr,
            content: contentCdr,
            route: '/index/call/cdr_call/' + notify.id + '/cdr?flag=notify'
          }
          break
        case 'webchat':
          let fromSource = this.$t('notify.unKnow')
          let notifyObj = notify.notify
          let routeWebchat = '/index/webchat/webchat_todo/' + notifyObj._id + '/webchat?flag=notify'
          notifyObj.Platform = notifyObj.Platform || notifyObj.platform
          if (notifyObj.Platform === 'pc') {
            fromSource = this.$t('notify.platformPc')
          } else if (notifyObj.Platform === 'wap') {
            fromSource = this.$t('notify.platformWap')
          } else if (notifyObj.Platform === 'sdk') {
            fromSource = this.$t('notify.platformSdk')
          } else if (notifyObj.Platform === 'weixin') {
            fromSource = this.$t('notify.platformWeixin')
          }
          let titleWebchat = this.$t('notify.webchat1') + fromSource + this.$t('notify.webchat2') + notifyObj.sName + this.$t('notify.webchat3')
          let contentWebchat = ''
          if (notifyObj.msgType === 'disConn') {
            contentWebchat = this.$t('notify.webchat10')
          } else if (notifyObj.msgType === 'newConn') {
            contentWebchat = this.$t('notify.webchat11')
          } else if (notifyObj.operation === 'changePeer' || notifyObj.MsgType === 'convertManual') {
            contentWebchat = this.$t('notify.webchat12')
          } else if (notifyObj.operation === 'redirect') {
            contentWebchat = this.$t('notify.webchat19')
          } else if (notifyObj.operation === 'invited') {
            routeWebchat = '/index/webchat/webchat_todo'
            titleWebchat = this.$t('notify.webchat4') + notifyObj.username + this.$t('notify.webchat3')
            contentWebchat = this.$t('notify.webchat9')
          } else if (notifyObj.operation === 'grab_redirect') {
            titleWebchat = this.$t('notify.webchat4') + notifyObj.toUserName + this.$t('notify.webchat3')
            contentWebchat = notifyObj.toUserName + this.$t('notify.webchat7') + notifyObj.sName + this.$t('notify.webchat8')
          } else if (notifyObj.operation === 'autoClose') {
            titleWebchat = this.$t('notify.webchat14')
            contentWebchat = notifyObj.sName + this.$t('notify.webchat6')
          } else {
            contentWebchat = notifyObj.content.replace(/<[^>]*>/g, '')
          }
          temp = {
            tag: tag,
            title: titleWebchat,
            content: contentWebchat,
            route: routeWebchat
          }
          break
        case 'business':
          let titleBusiness = this.$t('notify.business1')
          let contentBusiness = notify.notify.msg
          temp = {
            tag: tag,
            title: titleBusiness,
            content: contentBusiness,
            route: '/index/business'
          }
          break
        case 'email':
          let titleEmail = ''
          let contentEmail = ''
          let notifyEmail = notify.notify
          if (notifyEmail.subject) {
            titleEmail = this.$t('notify.email1')
            contentEmail = notifyEmail.subject
          }
          if (notifyEmail.emailStatus === 'fail') {
            titleEmail = this.$t('notify.email2')
            contentEmail = this.$t('notify.email3') + notifyEmail.to + this.$t('notify.email4')
          }
          temp = {
            tag: tag,
            title: titleEmail,
            content: contentEmail,
            route: '/index/email/email_todo/' + notifyEmail._id + '/email_jump'
          }
          break
        case 'customerPlan':
          let notifyCustomerPlan = notify.notify
          let titleCustomerPlan = notifyCustomerPlan.notifyTime
          let contentCustomerPlan = this.$t('notify.customerContactPlan', notifyCustomerPlan)
          temp = {
            tag: tag,
            title: titleCustomerPlan,
            content: contentCustomerPlan,
            route: `/index/customer/customer_plan/${notify.notify._id}`
          }
          break
        case 'quesNotify':
          let titleQuesNotify = ''
          let contentQuesNotify = ''
          temp = {
            tag: tag,
            title: titleQuesNotify,
            content: contentQuesNotify
          }
          break
        case 'saleChance':
          let notifySaleChance = notify.notify
          let titleSaleChance = this.$t('notify.saleChance')
          let contentSaleChance = notifySaleChance.content
          temp = {
            tag: tag,
            title: titleSaleChance,
            content: contentSaleChance
          }
          break
        case 'other':
          let titleOther = ''
          let contentOther = ''
          temp = {
            tag: tag,
            title: titleOther,
            content: contentOther
          }
          break
      }
      return temp
    },
    notifySwitch () {
      return this.$store.state.notify
    }
  },
  watch: {
    notify: 'openNotify'
  },
  methods: {
    openNotify () {
      let notify = this.newNotify
      let Notification = window.Notification
      let notifySwitch = JSON.parse(window.sessionStorage.getItem('notifySwitch'))
      let self = this
      if (notify.tag === 'customerPlan' && notifySwitch.customerPlan) {
        return
      }
      if (Notification.permission === 'granted') {
        let notification = new Notification(notify.title, {
          dir: 'auto',
          lang: '',
          tag: notify.tag,
          icon: '../../../../static/img/logo_notify.png',
          body: notify.content
        })
        notification.onshow = function () {
        }
        notification.onclick = function () {
          window.focus()
          if (notify.route) {
            self.$router.push(notify.route)
            // 后期加一下路由跳到指定业务要根据type判断
//            if (notify.tag === 'cdr') {
//              let pane = document.getElementById('cdr_call_id')
//              if (pane) {
//                let node = pane.getElementsByClassName('phon_call')[0]
//                let item = pane.getElementsByClassName('el-menu-item')[0]
//                if (node) {
//                  if (item) {
//                    item.setAttribute('class', 'is-active')
//                  }
//                  node.click()
//                }
//              }
//            }
            notification.close()
          }
        }
        notification.onclose = function () {}
        notification.onerror = function () {}
      }
      let music = document.getElementById('music')
      let isOn = true
      if (window.localStorage.loginForm) {
        let loginForm = JSON.parse(window.localStorage.loginForm)
        if (window.localStorage[loginForm.loginName]) {
          isOn = JSON.parse(window.localStorage[loginForm.loginName]).isOn
        }
      }
      if (music && isOn) { // 是否播放音乐
        if (notify.tag === 'email' || notify.tag === 'webchat') {
          music.src = notify.tag === 'email' ? '../../../../static/audio/im/emailsound.mp3' : '../../../../static/audio/im/warning.mp3'
          music.play()
        }
      }
    }
  },
  beforeMount () {
    window.Notification.requestPermission()
  }
})
</script>

<style lang="stylus" scoped>
  .audio_warp
    display none
</style>
