<template>
  <div class="quesSummaryConatiner" v-loading="loading">
    <div class="summaryHeader">
      <div class="userInfo">
        <p class="name">
          <span class="name_warp">
            {{ questionnaireDetail.name }}
          </span>
          <span class="b-time" v-if="questionnaireDetail.notifyTime">
            <i class="el-icon-time"></i>
            {{ iconTime }}
         </span>
        </p>
        <p class="phone">{{ questionnaireDetail.basePhone }}</p>
      </div>
      <div class="userHandler">
        <span class="icon phone ques_phone" :class="{disabled : !phone.tel[0].tel}">
          <span class="info">
            <phone :phone="call"></phone>
          </span>
          <span class="info" v-if="!isSMS">
            <phone :phone="phone"></phone>
          </span>
        </span>
        <span class="icon">
          <show-question-info :phoneNum="phoneNum" :custDetial="custDetial" :cid="cid"></show-question-info>
        </span>
      </div>
    </div>
    <template>
      <el-tabs v-model.trim="tabActive"  @tab-click="changeTab">
        <el-tab-pane :label="rightTabPane.name" :name="rightTabPane.type" v-for="rightTabPane in rightTabPanes"></el-tab-pane>
      </el-tabs>
    </template>
    <template>
      <keep-alive>
        <question-content v-if="tabActiveName == 'ques_content'" :questionnaireDetail="questionnaireDetail">
        </question-content>
      </keep-alive>
      <question-history :cid="cid" :refresh="refresh" v-if="tabActiveName == 'ques_history'"></question-history>
    </template>
  </div>
</template>
<script>
  import QuestionContent from './QuestionContent'
  import ShowQuestionInfo from './ShowQuestionInfo'
  import Phone from '../../public-modules/contact-summary/Phone'
  import ContactHistory from 'components/public-modules/cust-tab-content/contact-history/'
  import QuestionHistory from './QuestionHistory'
  export default {
    name: 'QuestionSummary',
    data () {
      return {
        labelPosition: 'top',
        tabs: {plan: true, businessCreate: true, history: true, changeLog: true},
        tabActiveName: 'ques_content',
        loading: true,
        isSMS: true,
        rightTabPanes: [
          {name: this.$t('questionnaire.content'), type: 'ques_content'},
          {name: this.$t('questionnaire.history'), type: 'ques_history'}
        ],
        refresh: 'history'
      }
    },
    computed: {
      tabActive () {
        return this.tabActiveName
      },
      custDetial () {
        return this.$store.state.questionnaire.current.custDetial
      },
      phoneNum () {
        return this.questionnaireDetail.basePhone
      },
      iconTime () {
        return this.questionnaireDetail.notifyTime.split(' ')[0].split('-')[1] + '-' + this.questionnaireDetail.notifyTime.split(' ')[0].split('-')[2] + ' ' + this.questionnaireDetail.notifyTime.split(' ')[1].substring(0, 5)
      },
      questionnaireDetail () {
        return this.$store.state.questionnaire.current
      },
      phone () {
        if (this.questionnaireDetail) {
          let phone = {
            tel: [{area: '', memo: '', tel: this.questionnaireDetail.phone}],
            type: 'tlak',
            module: 'question',
            ques_id: this.cid
          }
          return phone
        } else {
          return {
            tel: [],
            type: 'tlak',
            quesId: 'cid',
            module: 'question',
            ques_id: this.cid
          }
        }
      },
      call () {
        if (this.questionnaireDetail) {
          let call = {
            tel: [{area: '', memo: '', tel: this.questionnaireDetail.phone}],
            type: 'call',
            module: 'question',
            ques_id: this.cid
          }
          return call
        } else {
          return {
            tel: [],
            type: 'call',
            module: 'question',
            ques_id: this.cid
          }
        }
      },
      cid () {
        if (this.$route.path.split('/')[2] === 'questionnaire') {
          return this.$route.path.split('/')[4]
        } else {
          this.loading = true
        }
      }
    },
    methods: {
      changeTab (tab) {
        this.tabActiveName = tab.name
      },
      fetchData () {
        this.loading = true
        let type = this.$route.path.split('/')[2]
        if (type !== 'questionnaire' || this.$route.path.split('/').length < 5) {
          this.loading = false
          return
        }
        this.tabActiveName = 'ques_content'
        let id = this.$route.path.split('/')[4]
        this.$store.dispatch('showQuestionnaireDetail', {_id: id}).then(() => {
          this.loading = false
        })
      }
    },
    watch: {
      '$route': 'fetchData'
    },
    components: {
      QuestionContent,
      ShowQuestionInfo,
      ContactHistory,
      QuestionHistory,
      Phone
    },
    beforeMount () {
      this.fetchData()
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .quesSummaryConatiner
    border-bottom 1px solid #d3d3d3
    .el-tabs
      background $c-back
      padding-left 20px
      border-bottom 1px solid #d1dbe5
  .summaryHeader
    overflow hidden
    background-color $c-back
  .userInfo
    height 50px
    padding 30px 0 0 30px
    float left
    .name
      font-size 16px
      display block
      height 24px
      line-height 24px
      margin-bottom 5px
    .name_warp
      float left
      color $cf-gray1
    .b-time
      background #7ccdd1
      padding 1px 5px
      border-radius 4px
      font-size 14px
      line-height 22px
      margin-left 15px
      float left
      color #fff
    .phone
      color $cf-gray3
  .userHandler
    float right
    margin 30px 30px 0 0
    .phone
      border 1px solid
      border-radius 50%
      border 1px solid #1abb9c
      cursor pointer
    .disabled
      border 1px solid #d3d3d3
      border-radius 50%
      .iconfont
        color #d3d3d3
    .icon
      width 36px
      height 36px
      display block
      float left
      margin-right 5px
      cursor pointer
</style>
