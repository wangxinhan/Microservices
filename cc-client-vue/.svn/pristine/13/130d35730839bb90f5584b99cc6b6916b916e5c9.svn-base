<template>
  <div>
    <el-row :span="24" class="temporary" v-if="!loading">
      <affix :label="$t('business.stagingBusiness')">
          <div class="timedown" v-if="busTimeObj.totalExpireTime && busTimeObj.totalExpireTime !== 0.1">
            <span>
              <el-popover
                ref="popover4"
                placement="bottom-start"
                trigger="hover"
                :content="$t(busTimeObj.totalTimeState)">
              </el-popover>
              <i class="iconfont icon-zongshichang" ></i>
              <el-button type="text" v-popover:popover4 v-bind:style="{ color: totalTimeColor}">{{totalExpireTimeDisplay}}</el-button>
            </span>
          </div>
        <main>
          <el-form label-position="top" :model="form"  ref="form"  class="newbusiness-form">
            <el-form-item :label="$t('business.businessFlow')" class="business-type">
              <el-select size="small" v-model="form.flow" placeholder="" @change="businessTypeChange" :disabled="disabled" class="width-full">
                <el-option  v-for="item in businessTypeData()"
                            :label="item.label"
                            :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-row :gutter="20" v-for="item in items">
              <el-col v-for="col in item.cols" :span="24/item.cols.length">
                <div v-for="one in col.fields">
                  <b-input v-if="one.type==='single'" v-on:tellme="tellme" :label="one.name" :default="one.default" :id="one._id" :require="one.required" :disabled="disabled"></b-input>
                  <b-number v-if="one.type==='number'" v-on:tellme="tellme" :label="one.name" :default="one.default" :id="one._id" :require="one.required" :disabled="disabled"></b-number>
                  <b-textarea v-if="one.type==='multi'" v-on:tellme="tellme" :label="one.name" :default="one.default" :id="one._id" :require="one.required" :disabled="disabled" ></b-textarea>
                  <b-radio v-if="one.type==='radio'" v-on:tellme="tellme" :label="one.name"  :dic="one.dic" :default="one.default" :id="one._id" :require="one.required" :disabled="disabled"></b-radio>
                  <b-checkbox v-if="one.type==='checkbox'" v-on:tellme="tellme" :label="one.name" :dic="one.dic" :default="one.default" :id="one._id" :require="one.required" :disabled="disabled"></b-checkbox>
                  <b-datatime v-if="one.type==='date'" v-on:tellme="tellme" :label="one.name"  :default="one.default" :id="one._id" :require="one.required" :disabled="disabled"></b-datatime>
                  <b-select v-if="one.type==='dropdown'" v-on:tellme="tellme" :label="one.name" :dic="one.dic"  :default="one.default" :id="one._id" :require="one.required" :disabled="disabled"></b-select>
                  <b-file v-if="one.type==='file'" v-on:tellme="tellme" :label="one.name" :default="one.default" :id="one._id" :require="one.required" :disabled="disabled"></b-file>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="operatePane" class="padding-b">
              <el-col :span="12">
                <el-form-item :label="$t('business.nextStep')">
                  <el-select size="small" v-model="form.nextAction" placeholder="" @change="nextStepChange" class="width-full">
                    <el-option  v-for="item in nextAction"
                                :label="item.label"
                                :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('business.handlePeople')">
                  <el-select size="small" v-model="form.nextUser" placeholder="" filterable class="width-full">
                    <el-option  v-for="item in dealAgent"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="line"></div>
            <el-row :gutter="20" class="log">
              <el-col :span="12">
                <span class="lastUser fl">{{lastUpdateUser}}</span>
                <span class="fl">{{$t('business.deal')}}</span>
                <span class="fl">{{detail.lastUpdateTime}}</span>
              </el-col>
              <el-col :span="12">
                <div class="btn-wraper" v-if="operatePane">
                  <el-button type="primary" class="ui-newtemp" @click.stop="doSaveTempBusiness" v-if="tempBtn" :disabled="disabledBtn">{{$t('business.staging')}}</el-button>
                  <el-button type="primary" class="ui-newbus" @click.stop="doSaveBusiness" :disabled="disabledBtn">{{$t('business.submit')}}</el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </main>
      </affix>
      </el-col>
      </el-row>
  </div>
</template>
<script>
  import affix from '../../../ui-modules/affix/Affix.vue'
  import BInput from './base/Binput.vue'
  import BTextarea from './base/Btextarea.vue'
  import BRadio from './base/Bradio.vue'
  import BCheckbox from './base/Bcheckbox.vue'
  import BDatatime from './base/Bdatatime.vue'
  import BSelect from './base/Bselect.vue'
  import BFile from './base/Bfile.vue'
  import BNumber from './base/Bnumber.vue'
  import {getCache} from '../../../../utils/m7Utils.js'
  import {busTimeDown, showCountDown, getRoleAgents, getRoleActions, getStepRoles, getFlowAction, getStartStep, hasAccessForFlow, getObjectById} from '../../../../utils/workflowUtils.js'
  export default {
    name: 'temporaryBus',
    props: {
      tabName: String,
      detail: Object
    },
    data () {
      return {
        loading: true,
        disabled: false,
        operatePane: true,
        tempBtn: true,
        form: {
          _id: this.detail._id,
          flow: '',
          nextAction: '',
          nextUser: ''
        },
        items: [
        ],
        nextAction: [],
        dealAgent: [],
        totalTimeColor: '',
        busTimeObj: {},
        stop: {stop: ''},
        disabledBtn: false,
        firstIn: true
      }
    },
    components: {
      affix,
      BInput,
      BTextarea,
      BRadio,
      BCheckbox,
      BDatatime,
      BSelect,
      BFile,
      BNumber
    },
    methods: {
      businessTypeChange (_id) {
        this.items = []
        this.$nextTick(() => {
          let flow = getCache('businessFlow', _id)
          let step = getStartStep(flow)
          this.form = {
            _id: this.detail._id,
            flow: _id,
            nextAction: '',
            nextUser: ''
          }
          // 定义客户字段顺序
          this.items = step.stepFields || []
          // 客户字段，定义内容样式
          let flowFields = flow ? flow.fields : []
          let actions = getRoleActions(step)
          this.nextAction = []
          for (let i = 0; i < actions.length; i++) {
            this.nextAction.push({label: actions[i].name, value: actions[i]._id})
          }
          if (this.nextAction.length !== 0) {
            this.form.nextAction = this.nextAction[0].value
            this.nextStepChange(this.form.nextAction)
          }
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
          if (this.detail.master !== this.$store.state.session.user._id) {
            this.disabled = true
            this.operatePane = false
          }
          if (this.detail.saveFlag === 'temp') {
            this.tempBtn = true
          } else {
            this.tempBtn = false
          }
          if (this.firstIn) {
            let self = this
            busTimeDown(this.stop, this.detail, function (res) {
              self.busTimeObj = res
            })
            this.firstIn = false
          } else {
            this.busTimeObj = {}
            clearInterval(this.stop.stop)
          }
        })
      },
      tellme (val) {
        Object.assign(this.form, val)
      },
      nextStepChange (_id) {
        let flow = getCache('businessFlow', this.form.flow)
        let step = getStartStep(flow)
        let action = getFlowAction(step._id, _id)
        if (!action) {
          return
        }
        let nextStepId = action.jumpTo
        let roles = getStepRoles(nextStepId)
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
        this.form.nextUser = ''
        for (let i = 0; i < agents.length; i++) {
          this.dealAgent.push({label: agents[i].displayName + '[' + agents[i].exten + ']', value: agents[i]._id})
        }
      },
      businessTypeData () {
        let flows = getCache('businessFlow')
        let data = []
        for (var i = 0; i < flows.length; i++) {
          let flowsItem = flows[i]
          if (hasAccessForFlow(flowsItem)) {
            data.push({value: flowsItem._id, label: flowsItem.name})
          }
        }
        return data
      },
      doSaveTempBusiness () {
        for (let i in this.form) {
          if (this.form[i] === false) {
            return
          }
        }
        this.$emit('event', {event: 'addTempBusinessTask', data: {customer: this.detail.customer}})
//        this.disabledBtn = true
//        this.$store.dispatch('addTempBusinessTask', this.form).then((res) => {
//          self.disabledBtn = false
//
//        })
      },
      doSaveBusiness () {
        for (let i in this.form) {
          if (this.form[i] === false) {
            return
          }
        }
        this.$emit('event', {event: 'addBusinessTask', data: {customer: this.detail.customer, form: this.form}})
//        this.disabledBtn = true
//        this.$store.dispatch('addBusinessTask', this.form).then((res) => {
//          self.disabledBtn = false
//          debugger
//          self.$emit('event', {event: 'addBusinessTask', data: {_id: res, customer: self.detail.customer}})
//        })
      }
    },
    computed: {
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
    beforeMount () {
      let self = this
      Promise.all([
        this.$store.dispatch('getCache', {type: 'options'})
      ]).then((res) => {
        self.loading = false
        let businessTypeData = self.businessTypeData()
        if (businessTypeData.length === 0) {
          return
        }
        this.form.flow = self.detail.flow
        self.businessTypeChange(self.detail.flow)
      })
    },
    mounted () {

    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/common.styl'
  .temporary
    position relative
    .timedown
      position absolute
      right 20px
      top 14px
    .log
      color $cf-gray1
      margin-bottom 12px
      font-size 12px
      position relative
      line-height: 34px
      .lastUser
        padding-left 2px
        box-sizing border-box
        max-width 70px
        @extend .ellipsis
  .btn-wraper
    float right
    .ui-newbus, .ui-newtemp
      width 90px
      @extend .font12
      padding 6px 0
      background-color #1abb9c
      border 1px solid #1abb9c
    .ui-newtemp
      background-color #7ccdd1
      border 1px solid #7ccdd1
  .business-type
    padding 0 0 5px
  .padding-b
    padding-bottom 8px
  .width-full
    width 100%
  .line
    margin-bottom 15px
    &:before
      content ''
      height 1px
      width 100%
      display block
      border-top  1px dashed $cf-level2
  .icon-zongshichang
    color #02c7d0
</style>
