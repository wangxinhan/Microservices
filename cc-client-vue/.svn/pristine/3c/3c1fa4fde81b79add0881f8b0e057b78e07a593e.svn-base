<template>
  <el-row>
    <el-col :span="24" class="b-info">
      <header>
        <h3 class="font14">{{$t('business.businessInfo')}}-{{businessTitle}}</h3>
        <div class="timedown" v-if="busTimeObj.totalExpireTime !== 0.1">
          <span v-if="busTimeObj.stepExpireTime !== 0.1">
            <el-popover
            ref="popover3"
            placement="bottom-start"
            trigger="hover"
            transition="slide-fade"
            :content="$t(busTimeObj.stepTimeState)">
            </el-popover>
            <i class="iconfont icon-chulishichang"></i>
            <el-button type="text" v-popover:popover3 v-bind:style="{ color: stepTimeColor}">{{stepExpireTimeDisplay}}</el-button>
          </span>
          <span v-if="busTimeObj.totalExpireTime">
            <el-popover
            ref="popover4"
            placement="bottom-start"
            trigger="hover"
            :content="$t(busTimeObj.totalTimeState)">
            </el-popover>
            <i class="iconfont icon-zongshichang" style="margin-right: 5px;"></i>
            <el-button type="text" v-popover:popover4 v-bind:style="{ color: totalTimeColor}">{{totalExpireTimeDisplay}}</el-button>
          </span>
        </div>
      </header>
      <main class="bus-info-main">
        <el-row :gutter="20" v-for="item in items">
          <el-col v-for="col in item.cols" :span="24/item.cols.length" class="padding-b">
            <div v-for="one in col.fields">
              <b-input v-if="one.type==='single'"  :label="one.name" :default="one.default" :id="one._id" :disabled="true"></b-input>
              <b-input v-if="one.type==='number'"  :label="one.name" :default="one.default" :id="one._id" :disabled="true"></b-input>
              <b-textarea v-if="one.type==='multi'"  :label="one.name" :default="one.default" :id="one._id" :disabled="true"></b-textarea>
              <b-radio v-if="one.type==='radio'"  :label="one.name"  :dic="one.dic" :default="one.default" :id="one._id" :disabled="true"></b-radio>
              <b-checkbox v-if="one.type==='checkbox'"  :label="one.name" :dic="one.dic" :default="one.default" :id="one._id" :disabled="true"></b-checkbox>
              <b-datatime v-if="one.type==='date'"  :label="one.name"  :default="one.default" :id="one._id" :disabled="true"></b-datatime>
              <b-select v-if="one.type==='dropdown'"  :label="one.name" :dic="one.dic"  :default="one.default" :id="one._id" :disabled="true"></b-select>
              <b-file v-if="one.type==='file'" :label="one.name" :default="one.default" :id="one._id" :disabled="true"></b-file>
            </div>
          </el-col>
        </el-row>
        <div class="line"></div>
        <el-row>
          <el-col :span="8" class="log">
            <span class="bus-dealuser fl">{{lastUpdateUser}}</span>
            <span class="fl">{{$t('business.deal')}}</span>
            <span class="fl">{{detail.lastUpdateTime}}</span>
          </el-col>
          <el-col :span="8">
            <el-form label-position='left'label-width="80px">
              <el-form-item  :label="$t('business.master')" v-if="masterSelect">
                <el-select size="small" v-model.trim="master" :placeholder="$t('public.pleasePick')"  filterable @change="changeBusinessMaster" :name="detail._id" v-if="masterloading" style="width: 70%;">
                  <el-option
                    v-for="item in dealAgent"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <el-form>
              <el-form-item class="wrapper fr" v-if="operatePane">
                <el-dropdown @command="showProcessBusinessTask">
                  <el-button type="info" class="ui-pass">
                    {{$t('business.beginDeal')}}<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="item in oprateSelect" :command="item.value">{{item.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!--<el-button type="info" class="ui-pass">-->
                <!--{{}}-->
                <!--</el-button>-->
                <el-button class="ui-back" type="warning" @click.stop="businessBackShow">{{$t('business.return')}}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </main>
    </el-col>
    <el-col :span="24">
      <approval v-if="approvalshow" :process="processBusiness" :business="detail" :tabName="tabName" v-on:event="businessEvent"></approval>
    </el-col>
    <el-col :span="24">
      <business-back :business="detail" v-if="backShow" :tabName="tabName" v-on:event="businessEvent"></business-back>
      </el-col>
    <el-col :span="24">
      <business-comment  :business="detail" v-if="true" :tabName="tabName" v-on:event="businessEvent"></business-comment>
    </el-col>
  </el-row>
</template>
<script>
  import Approval from './Approval.vue'
  import BInput from './base/Binput.vue'
  import BTextarea from './base/Btextarea.vue'
  import BRadio from './base/Bradio.vue'
  import BCheckbox from './base/Bcheckbox.vue'
  import BDatatime from './base/Bdatatime.vue'
  import BSelect from './base/Bselect.vue'
  import BFile from './base/Bfile.vue'
  import BusinessBack from './businessBack.vue'
  import BusinessComment from './businessComment.vue'
  import {getCache, deepClone, getCurrentDateTime} from '../../../../utils/m7Utils.js'
  import * as types from '../../../../store/modules/business/mutation-types.js'
  import {busTimeDown, showCountDown, getRoleAgents, getFlowStepActionById, getFlowAction, arrayContainsStr, getFlowStepById, getFlowStepNameByCache, getObjectById, getStepRoles} from '../../../../utils/workflowUtils.js'
  export default {
    name: 'BusinessInfo',
    props: {
      tabName: String,
      detail: Object
    },
    components: {
      Approval,
      BInput,
      BTextarea,
      BRadio,
      BCheckbox,
      BDatatime,
      BSelect,
      BFile,
      BusinessBack,
      BusinessComment
    },
    data () {
      return {
        items: [
        ],
        master: '',
        masterSelect: true,
        oprateSelect: [],
        dealAgent: [],
        operatePane: true,
        approvalshow: false,
        backShow: false,
        processBusiness: {},
        stepTimeColor: '',
        totalTimeColor: '',
        busTimeObj: {},
        stop: {stop: ''},
        masterloading: true
      }
    },
    computed: {
      businessTitle () {
        return getFlowStepNameByCache(this.detail.flow, this.detail.step)
      },
      stepExpireTimeDisplay () {
        if (this.busTimeObj.stepExpireTime < 0) {
          this.stepTimeColor = '#ff4949'
        } else {
          this.stepTimeColor = '#333'
        }
        return showCountDown(this.busTimeObj.stepExpireTime || 0.1)
      },
      totalExpireTimeDisplay () {
        if (this.busTimeObj.totalExpireTime < 0) {
          this.totalTimeColor = '#ff4949'
        } else {
          this.totalTimeColor = '#333'
        }
        return showCountDown(this.busTimeObj.totalExpireTime || 0.1)
      },
      lastUpdateUser () {
        return getCache('agents', this.detail.lastUpdateUser).displayName
      }
    },
    watch: {
      'detail': function () {
        // 防止工单刷新时发送changeMaster请求
        this.masterloading = false
        this.$nextTick(() => {
          this.businessTransform()
        })
        let self = this
        busTimeDown(this.stop, this.detail, function (res) {
          self.busTimeObj = res
        })
        if (this.detail.status === 'complete' || this.detail.status === 'cancel') {
          clearInterval(this.stop.stop)
        }
      }
    },
    methods: {
      businessEvent (data) {
        if (data.event === 'backAction') {
          this.backShow = false
        } else if (data.event === 'stepAction') {
          this.approvalshow = false
        }
        this.$emit('event', data)
      },
      masterChange (value) {
        this.processBusiness.master = value
      },
      closeBack () {
        this.backShow = false
      },
      businessTransform () {
        let flow = getCache('businessFlow', this.detail.flow)
        let step = getFlowStepById(flow, this.detail.step)
        // 定义客户字段顺序
        this.items = step && step.stepFields ? step.stepFields : []
        // 客户字段，定义内容样式
        let flowFields = flow ? flow.fields : []
        for (let i = 0; i < this.items.length; i++) {
          let row = this.items[i]
          for (let j = 0; j < row.cols.length; j++) {
            let col = row.cols[j]
            for (let k = 0; k < col.fields.length; k++) {
              let field = col.fields[k]
              let cacheField = getObjectById(flowFields, field._id)
              if (cacheField.type === 'dropdown') {
                let value = this.detail[cacheField._id] || cacheField['default']
                let value1 = this.detail[cacheField._id + '_1'] || ''
                let value2 = this.detail[cacheField._id + '_2'] || ''
                let data = [value, value1, value2]
                cacheField['default'] = data
              } else {
                cacheField['default'] = this.detail[cacheField._id] || cacheField['default']
              }
              Object.assign(field, cacheField)
            }
          }
        }
        if (this.detail.status === 'complete' || (this.detail.status && this.detail.status.status === 'cancel')) { // 已完成状态
          this.operatePane = false
          this.masterSelect = false
        } else {
          let step = getCache('businessFlowStep', this.detail.step)
          let actions = step && step.actions ? step.actions : []
          this.oprateSelect = []
          let flag = 0
          let role = []
          role = deepClone(this.$store.state.session.user.role)
          role.push('busCreateUser')
          for (let i = 0; i < actions.length; i++) {
            var actionsItem = actions[i]
            if (arrayContainsStr(role, actionsItem.actionRole)) {
              flag++
              this.oprateSelect.push({value: actionsItem._id, label: actionsItem.name})
            }
          }
//          role.pop()
          if (flag === 0 || (this.detail.master && this.detail.master !== this.$store.state.session.user._id)) {
            this.operatePane = false
          }
          if (flag === 0) {
            this.masterSelect = false
          }
          if (flag === 1) {
          }
          let roles = getStepRoles(this.detail.step)
          let agents = getRoleAgents(roles)
          this.dealAgent = []
          if (roles[0] === 'busCreateUser') {
            let createUser = this.detail.createUser
            let age = getCache('agents', createUser)
            agents = []
            agents.push(age)
          } else {
            if (agents.length !== 1) {
              this.dealAgent.push({label: '自动分配', value: ''})
            }
          }
          this.master = this.detail.master
          this.masterloading = true
          for (let i = 0; i < agents.length; i++) {
            this.dealAgent.push({label: agents[i].displayName, value: agents[i]._id})
          }
        }
      },
      showProcessBusinessTask (key) {
        let business = this.detail
        let actionId = key
        let stepId = business.step
        let action = getFlowAction(stepId, actionId)
        let nextStepId = action.jumpTo
        let nextStep = getCache('businessFlowStep', nextStepId)
        if (nextStep.type === 'sys') { // 如果是系统步骤，并且没有配置界面，则直接执行。
          let step = getCache('businessFlowStep', stepId)
          action = getFlowStepActionById(step.actions, actionId)
          let fields = action.actionFields
          if (fields.length === 0) {
            let executeData = {_id: business._id, actionId: actionId, master: 'sys'}
            let self = this
            this.$emit('event', {event: 'stepAction', data: {_id: this.detail._id, customer: this.detail.customer, form: executeData}})
            self.backShow = false
//            this.$store.dispatch('excuteBusinessStepAction', executeData).then((res) => {
//              self.backShow = false
//            })
            return
          }
        }
        this.processBusiness = {stepId: stepId, actionId: actionId, _id: business._id, master: this.master}
        this.approvalshow = true
        this.backShow = false
      },
      businessBackShow () {
        this.approvalshow = false
        if (this.backShow) {
          this.backShow = false
        } else {
          this.backShow = true
        }
      },
      changeBusinessMaster (value) {
        let self = this
        this.$store.dispatch('changeBusinessMaster', {_id: this.detail._id, master: value}).then((rep) => {
          if (!rep.success) {
            return
          }
          if (value !== self.$store.state.session.user._id && value !== '') {
            self.operatePane = false
          } else {
            self.operatePane = true
          }
          self.approvalshow = false
          self.backShow = false
          this.$emit('event', {event: 'changeBusinessMaster', data: {_id: this.detail._id, customer: this.detail.customer}})
          let data = {
            'businessId': self.detail._id,
            'step': self.detail.step,
            'action': 'assign',
            'excuteData': {
              'master': value
            },
            'time': getCurrentDateTime(),
            'master': self.$store.state.session.user._id
          }
          self.$store.commit(types.ADD_BUSINESS_ACTION_HISTORY, {data})
          self.$store.commit(types.CHANGE_BUSINESS_MASTER, {_id: this.detail._id, master: value})
        })
      }
    },
    beforeMount () {
      this.businessTransform()
      let self = this
      busTimeDown(this.stop, this.detail, function (res) {
        self.busTimeObj = res
      })
    },
    beforeDestroy () {
      clearInterval(this.stop.stop)
    },
    mounted () {
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/common.styl'
  .el-button
    padding 6px 0
  .b-info
    background-color #cce6ff
    padding 15px
    border-radius 5px
    header
      position relative
      h3
        display inline-block
        color $cf-gray1
    main
      padding-top 20px
      .reason
        height 50px
      .log
        color $cf-gray1
        font-size 12px
        line-height 34px
        .bus-dealuser
          padding-left 2px
          box-sizing border-box
          max-width 70px
          @extend .ellipsis
      .line
        margin-bottom 15px
        &:before
          content ''
          height 1px
          width 100%
          display block
          border-top  1px dashed $cf-level2
      &:before
        content ''
        clear both
      .wrapper
        float right
        .ui-pass
          margin-right 15px
          background-color #7bcdd2
          border 1px solid #7bcdd2
        .ui-back, .ui-pass
          width 90px
          @extend .font12
  .business-processing
    padding-top 15px
  .timedown
    position absolute
    top 0
    right 0
    color $cf-level2
    .el-button
      padding 0
      vertical-align 20%
    &>span
      display inline-block
      padding 0 10px
      i
        width 20px
        height 20px
        font-size 20px
        line-height 20px
        display inline-block
        color #02c7d0
      .el-button--text
        color $cf-gray1
</style>
