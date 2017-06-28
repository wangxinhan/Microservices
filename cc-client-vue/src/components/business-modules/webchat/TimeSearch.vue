<template>
  <div class="high">
    <el-popover
      ref="popoverTime"
      width="730"
      placement="bottom"
      trigger="click"
      :offset="100">
      <el-form :inline="true" label-position="top"  class="high-ranking-search">
        <div class="font12 time_search_box">
          <div class="flex3">
            <div class="search_title">{{$t("webchat.visitorLastReply")}}</div>
            <div v-for="(item, index) in groupCustomer.list" class="groupLi">
              <label class="label-box">
                <input type="checkbox" v-model.trim="item.checked" @change="changeCustomerLabel(index, item.checked)"><span class="label-text">{{item.name}}</span>
              </label>
            </div>
            <div class="groupLi groupLiText">
              <input type="text" v-model.trim="groupCustomer.customize" @focus="switchCustomerTime" :placeholder="'1-9999'" maxlength="4"/>分钟前
            </div>
          </div>
          <div class="flex3">
            <div class="search_title">{{$t("webchat.agentLastReply")}}</div>
            <div v-for="(item, index) in groupAgent.list" class="groupLi">
              <label class="label-box">
                <input type="checkbox" v-model.trim="item.checked" @change="changeAgentLabel(index, item.checked)"><span class="label-text">{{item.name}}</span>
              </label>
            </div>
            <div class="groupLi">
              <input type="text" v-model.trim="groupAgent.customize" @focus="switchAgentTime" :placeholder="'1-9999'" maxlength="4"/>分钟前
            </div>
          </div>
        </div>
        <el-form-item class="btn-group">
          <el-button type="primary" @click="resetFormData(true)">{{$t("public.reset")}}</el-button>
          <el-button type="primary" @click="submitFormData">{{$t("public.search")}}</el-button>
        </el-form-item>
      </el-form>
    </el-popover>
    <el-button v-if="sessionInvitation && sessionInvitation != 0"
               class="iconfont icon-qiangjiehuihua" type="text"
               @click.stop="openpopConversation()">{{$t("webchat.activeSession")}}</el-button>
    <el-button class="iconfont icon-sousuo" type="text" v-popover:popoverTime @click="visible = !visible">{{$t("webchat.timeSearch")}}</el-button>
  </div>
</template>
<script>
  import {deepClone} from '../../../utils/m7Utils'
  import {checkform} from '../../../utils/validate'
  export default {
    name: 'AdvancedSearch',
    /**
     * [props 该组件所需要的参数]
     * @type {
     *   type        业务类型
     *   typeType    业务tab
     * }
     */
    data () {
      return {
        visible: false,
        groupCustomer: {
          list: [
            {name: '5分钟前', checked: false},
            {name: '10分钟前', checked: false},
            {name: '15分钟前', checked: false},
            {name: '20分钟前', checked: false},
            {name: '25分钟前', checked: false},
            {name: '30分钟前', checked: false}
          ],
          customize: ''
        },
        groupAgent: {
          list: [
            {name: '5分钟前', checked: false},
            {name: '10分钟前', checked: false},
            {name: '15分钟前', checked: false},
            {name: '20分钟前', checked: false},
            {name: '25分钟前', checked: false},
            {name: '30分钟前', checked: false},
            {name: '未读', checked: false}
          ],
          customize: ''
        },
        sessionInvitation: ''
      }
    },
    props: {
      callLabel: Array,
      checkLabels: Array,
      callSheetId: String,
      resetSearch: Boolean
    },
    computed: {
    },
    watch: {
      'resetSearch': 'resetFormData'
    },
    methods: {
      switchCustomerTime () {
        this.groupCustomer.list.forEach((item) => {
          item.checked = false
        })
      },
      switchAgentTime () {
        this.groupAgent.list.forEach((item, index) => {
          if (index !== 6) {
            item.checked = false
          }
        })
      },
      resetFormData (data) {
        if (this.resetSearch || data) {
          this.groupAgent.list.forEach((item) => {
            item.checked = false
          })
          this.groupCustomer.list.forEach((item) => {
            item.checked = false
          })
          this.groupCustomer.customize = ''
          this.groupAgent.customize = ''
        }
      },
      openpopConversation () {
        this.$emit('inviteInfo')
      },
      submitFormData () {
        let match1 = checkform(this.groupCustomer.customize, 'Number3')
        let match2 = checkform(this.groupAgent.customize, 'Number3')
        if (match1) {
          this.$message.error(this.$t(match1))
          this.groupCustomer.customize = ''
          return
        }
        if (match2) {
          this.$message.error(this.$t(match2))
          this.groupAgent.customize = ''
          return
        }
        if (this.groupCustomer.customize === '0' || this.groupAgent.customize === '0') {
          if (this.groupCustomer.customize === '0') {
            this.groupCustomer.customize = ''
          }
          if (this.groupAgent.customize === '0') {
            this.groupAgent.customize = ''
          }
          this.$message.error(this.$t('validate.disagreeNumber'))
          return
        }
        let groupCustomer = deepClone(this.groupCustomer)
        let groupAgent = deepClone(this.groupAgent)
        let data = {}
        if (groupCustomer.customize) {
          data.visitorsReply = parseInt(groupCustomer.customize)
          data.visitorsReply = `${data.visitorsReply}__${this.$t('webchat.visitor')}:${data.visitorsReply}${this.$t('webchat.minutesAgo')}`
        }
        if (groupAgent.customize) {
          data.clientReply = parseInt(groupAgent.customize)
          data.clientReply = `${data.clientReply}__${this.$t('public.agent')}:${data.clientReply}${this.$t('webchat.minutesAgo')}`
        }
        groupCustomer.list.forEach((item, index) => {
          if (item.checked) {
            data.visitorsReply = `${5 * (index + 1)}__${this.$t('webchat.visitor')}:${item.name}`
          }
        })
        groupAgent.list.forEach((item, index) => {
          if (item.checked) {
            if (index === 6) {
              data.unReply = `${true}__${item.name}`
            } else {
              data.clientReply = `${5 * (index + 1)}__${this.$t('public.agent')}:${item.name}`
            }
          }
        })
        let flag = false
        this.$emit('timeSearch', data, flag)
        document.getElementsByTagName('body')[0].click()
      },
      changeCustomerLabel (index, ischecked) {
        if (ischecked) {
          this.groupCustomer.list.forEach((item) => {
            item.checked = false
          })
          this.groupCustomer.list[index].checked = true
          this.groupCustomer.customize = ''
        }
      },
      changeAgentLabel (index, ischecked) {
        if (index === 6) {
          this.groupAgent.list[index].checked = ischecked
          return
        }
        if (ischecked) {
          this.groupAgent.list.forEach((item, index) => {
            if (index !== 6) {
              item.checked = false
            }
          })
          this.groupAgent.list[index].checked = true
          this.groupAgent.customize = ''
        }
      },
      getAllCheck () {
        return this.groupCallLabel.filter(item => item.checked).map(item => item._id)
      },
      changeCallLabel (id, name, flag) {
        let data = {}
        let nameArr = []
        let opArr = []
        if (flag === true) {
          data.operation = 'add'
        } else {
          data.operation = 'delete'
        }
        opArr.push(id)
        nameArr.push(name)
        data.label_op = opArr
        data.name = nameArr
        data.label = this.getAllCheck()
        data.callSheetId = this.callSheetId
        let routeArry = this.$route.path.split('/')
        let tabType = routeArry[3]
        let lastData = {data: data, type: tabType}
        console.log(lastData)
        this.$store.dispatch('markCallSheet', lastData)
      }
    },
    beforeMount () {
//       todo 测试主动会话后台接口
/*    let ubaSession = null
       let that = this
       this.$store.dispatch('getSessionsByAccount', {pageSize: 10, page: 1}).then(() => {
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
       })
       */
      this.$store.dispatch('getCache', {type: 'channelGlobalSet'}).then((res) => {
        if (res) {
          this.sessionInvitation = res.sessionInvitation ? res.sessionInvitation : ''
        }
      })
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .high
    .el-button
      color #a6a6a6
      float right
      margin-right 10px
      margin-left 0px
  .high-ranking-search
    padding 10px 0 10px 10px
    font-size 0
    .time_search_box
      display flex
      color #999
      .flex3
        flex 3
        .groupLi
          display inline-block
          margin 0 20px 10px 0
          float left
          input[type='text']
            margin-right 6px
            border-color $c-border1
            color $cf-gray3
        .groupLiText
          color $cf-gray3
        input
          border 1px solid $c-border1
          border-radius 2px
          height 32px
          box-sizing border-box
          text-align center
          font-size 12px
  .el-form--inline
    .el-form-item
      margin-bottom 16px;
      margin-right 20px
      width 192px
    .add-width
      width 384px
      margin-right 40px
      .el-form-item__content
        .el-date-editor
          height 30px
          width 384px
    .minus-width
      width 0px
      .el-form-item__content
        .el-date-editor
          height 30px
          width 384px
    .all-width
      width 100%
      .el-form-item__content
        .el-date-editor
          height 30px
          width 100%
    /*  div:nth-child(5n)
    margin-right 0*/
    .dotted
      width 100%
      border thin dashed #d9d9d9
      margin-bottom 30px
    .solid
      width 100%
      border thin solid #e6e6e6
    .btn-group
      padding 13px 0 5px 0
      text-align center
      .el-button
        height 38px
        width 150px
        font-size 14px
      .el-button:nth-child(1)
        background #7bcdd2
        border 1px solid #7bcdd2
      .el-button:nth-child(2)
        background #1abb9c
        border 1px solid #1abb9c
    .icon-sousuo
      float right
  .label-box
    position relative
    float left
    height 32px
    input
      sing-inp()
    input:checked+span
      sing-sped()
    input+span
      sing-sp()
      min-width 56px
      margin 0
    input:checked+span
      &:after
        sing-af()
      &:before
        sing-be()
  .el-form-item.btn-group
    width 100%
    margin-bottom 0
    padding-bottom 0
  .high
    .iconfont
      font-size 12px
      -webkit-font-smoothing auto
      color $cf-gray1
      span
        margin-left 5px
    .iconfont:before
      font-size 16px
  .search_title
    margin-bottom 10px
    color $cf-gray1
</style>
