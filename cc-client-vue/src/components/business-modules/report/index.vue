<template>
  <div class="report">
    <el-tabs v-model.trim="activeName" @tab-click="handleClick" v-if="menus.length!==0">
      <el-tab-pane :label="$t('report.' + menu.name)" :name="menu.fun" v-for="menu in menus">
        <!--<el-menu  :default-active="activeIndex[menu.fun]" class="" mode="horizontal" @select="subMenuChange" :router="true" >-->
          <!--<el-menu-item :index="'/index/report/'+menu.fun+'/'+one.fun" v-for="one in menu.children">{{$t('report.' + one.name)}}</el-menu-item>-->
        <!--</el-menu>-->
        <ul class="menu" v-if="menu.children.length!==0">
          <li v-for="one in menu.children">
            <router-link tag='div':to="'/index/report/'+menu.fun+'/'+one.fun"  class="menu-item" @click.stop="subMenuChange('/index/report/'+menu.fun+'/'+one.fun)">{{$t('report.' + one.name)}}</router-link>
          </li>
        </ul>
      </el-tab-pane>
      <div class="wrapper">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </el-tabs>


  </div>
</template>
<script>
  import {isHasMenu} from '../../../utils/m7Utils.js'
  export default {
    name: 'report',
    data () {
      return {
        activeName: '',
        submenuIndex: '',
        activeIndex: {
          call_report: '',
          im_report: '',
          mail_report: '',
          customer_report: '',
          business_report: '',
          ques_report: '',
          robot_report: ''
        },
        subMenu: [],
        menus: [
          {
            fun: 'call_report',
            name: 'callReport',
            funTree: true,
            children: [
              {name: 'callInReport', funTree: true, fun: 'callin_report'},
              {name: 'callReportRelayArea', funTree: true, fun: 'call_report_relay_area'},
              {name: 'calloutReport', funTree: true, fun: 'callout_report'},
              {name: 'callReportDialoutArea', funTree: true, fun: 'call_report_dialout_area'},
              {name: 'queueReport', funTree: true, fun: 'queue_report'},
              {name: 'callReportQueueTime', funTree: true, fun: 'call_report_queue_time'},
              {name: 'callReportAgent', funTree: true, fun: 'call_report_agent'},
              {name: 'callReportApproveSurvey', funTree: true, fun: 'call_report_approve_survey'}
            ]
          },
          {
            fun: 'im_report',
            name: 'imReport',
            funTree: true,
            children: [
              {name: 'imReportMessage', funTree: true, fun: 'im_report_msg'},
              {name: 'imReportBusinessAnalyse', funTree: true, fun: 'im_report_bus'},
              {name: 'imReportAgent', funTree: true, fun: 'im_report_agent'},
              {name: 'imReportCsr', fun: 'im_report_csr'},
              {name: 'imReportCsrChannel', fun: 'im_report_csr_channel'},
              {name: 'imReportSessionTime', fun: 'im_report_session_time'},
              {name: 'imReportSourceFrom', fun: 'im_report_source_from'},
              {name: 'imReportAgentResponse', fun: 'im_report_agent_response'}
            ]
          },
          {
            fun: 'mail_report',
            name: 'mailReport',
            funTree: true,
            children: [
              {name: 'mailReportAgent', fun: 'mail_report_agent', funTree: true},
              {name: 'mailReportCategory', fun: 'mail_report_category', funTree: true}
            ]
          },
          {
            fun: 'customer_report',
            name: 'customerReport',
            funTree: true,
            children: [
              {name: 'customerReportIncrease', funTree: true, fun: 'customer_report_increase'}
            ]
          },
          {
            fun: 'business_report',
            name: 'businessReport',
            funTree: true,
            children: [
              {name: 'businessReportAnalyse', funTree: true, fun: 'business_report_analyse'},
              {name: 'businessReportAgent', funTree: true, fun: 'business_report_agent'}
            ]
          },
          {
            fun: 'ques_report',
            name: 'quesReport',
            funTree: true,
            children: [
              {name: 'questionnaireReportReturn', fun: 'questionnaire_report_return'},
              {name: 'questionnaireReportQuestionDetail', fun: 'questionnaire_report_question_detail'}
            ]
          },
          {
            fun: 'robot_report',
            name: 'robotReport',
            funTree: true,
            children: [
              {name: 'robotReportMessage', funTree: true, fun: 'robot_report_message'},
              {name: 'robotReportTop20', funTree: true, fun: 'robot_report_top20'}
            ]
          }
        ]
      }
    },
    methods: {
      initMenu () {
//        let menus = this.menus
        this.menus = this.menus.filter(item => {
          if (!isHasMenu(item.fun, this.$store.state.session.user)) {
            return false
          } else {
            item.children = item.children.filter(subItem => {
              if (subItem.funTree) {
                if (!isHasMenu(subItem.fun, this.$store.state.session.user)) {
                  return false
                } else {
                  return true
                }
              } else {
                return true
              }
            })
            return true
          }
        })
      },
      handleClick (tab, event) {
        this.activeName = tab.name
        if (this.activeIndex[tab.name]) {
          this.$router.push({path: '/index/report/' + tab.name + '/' + this.activeIndex[tab.name]})
        } else {
          for (let i = 0; i < this.menus.length; i++) {
            let item = this.menus[i]
            if (item.fun === tab.name) {
              this.$router.push({path: '/index/report/' + tab.name + '/' + item.children[0].fun})
              this.activeIndex[tab.name] = item.children[0].fun
            }
          }
        }
      },
      subMenuChange (index) {
        var arr = index.split('/')
        this.activeIndex[arr[3]] = arr[4]
      }
    },
    beforeMount () {
      this.initMenu()
      if (this.menus.length !== 0) {
        if (this.$route.path.split('/').length !== 5) {
          this.handleClick({name: this.menus[0].fun})
        } else {
          this.activeName = this.$route.path.split('/')[3]
          this.subMenuChange(this.$route.path)
        }
      }
//      this.activeName = this.$route.path.split('/')[3] ? this.$route.path.split('/')[3] : 'call_report'
//      for (let key in this.menus[this.activeName].children) {
//        this.menus[this.activeName].children[key].link = '/index/report/' + this.activeName + '/' + key
//      }
//      this.subMenu = this.menus[this.activeName].children
    },
    activated () {
      if (this.menus.length !== 0) {
        if (this.$route.path.split('/').length !== 5) {
          this.activeName = this.menus[0].fun
          this.$router.push({path: '/index/report/' + this.menus[0].fun + '/' + this.menus[0].children[0].fun})
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/report.css"
@import "../../../assets/common.styl"
  .report
    height calc(100vh - 53px)
    background #fff
    .el-tabs__header
      border 1px solid #ccc
    .wrapper
      height calc(100vh - 166px)
      overflow scroll
      overflow-x hidden
      padding-bottom 20px
    .menu
      background #fff
      height 50px
      border-bottom 1px solid #d9d9d9
      white-space nowrap
      overflow-x auto
      font-size 14px
      color $cf-gray1
      li
        display inline-block
        &:first-child
          margin-left 16px
      .menu-item
        float left
        margin-top 10px
        padding 0 15px
        height 30px
        line-height 30px
        margin-left 6px
        cursor pointer
      .router-link-active
        background #1bbc9b
        color #fff
        border-radius 14px
</style>
