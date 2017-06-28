<template>
  <div>
    <div v-if="businessTypeData().length !==0">
      <el-row :span="24" class="new" v-if="!loading">
        <affix :label="$t('business.newBusiness')">
          <main>
            <el-form label-position="top" :model="form"  ref="form"  class="newbusiness-form">
              <el-form-item :label="$t('business.businessFlow')" class="business-type">
                <el-select size="small" v-model.trim="form.flow" placeholder="" @change="businessTypeChange" style="width:100%">
                  <el-option  v-for="item in businessTypeData()"
                              :label="item.label"
                              :value="item.value">
                    <!--<span>{{item.label}}</span>-->
                    <!--<span style="color:#999" v-if="item.busSumTime">(总时长{{item.busSumTime}})</span>-->
                  </el-option>
                </el-select>
              </el-form-item>
              <el-row :gutter="20" v-for="item in items">
                <el-col v-for="col in item.cols" :span="24/item.cols.length">
                  <div v-for="one in col.fields">
                    <b-input v-if="one.type==='single'" v-on:tellme="tellme" :label="one.name" :default="one.default" :id="one._id" :require="one.required"></b-input>
                    <b-number v-if="one.type==='number'" v-on:tellme="tellme" :label="one.name" :default="one.default" :id="one._id" :require="one.required"></b-number>
                    <b-textarea v-if="one.type==='multi'" v-on:tellme="tellme" :label="one.name" :default="one.default" :id="one._id" :require="one.required"></b-textarea>
                    <b-radio v-if="one.type==='radio'" v-on:tellme="tellme" :label="one.name"  :dic="one.dic" :default="one.default" :id="one._id" :require="one.required"></b-radio>
                    <b-checkbox v-if="one.type==='checkbox'" v-on:tellme="tellme" :label="one.name" :dic="one.dic" :default="one.default" :id="one._id" :require="one.required"></b-checkbox>
                    <b-datatime v-if="one.type==='date'" v-on:tellme="tellme" :label="one.name"  :default="one.default" :id="one._id" :require="one.required"></b-datatime>
                    <b-select v-if="one.type==='dropdown'" v-on:tellme="tellme" :label="one.name" :dic="one.dic"  :default="one.default" :id="one._id" :require="one.required"></b-select>
                    <b-file v-if="one.type==='file'" v-on:tellme="tellme" :label="one.name" :default="[]" :id="one._id" :require="one.required"></b-file>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="$t('business.nextStep')">
                    <el-select size="small" v-model.trim="form.nextAction" placeholder="" @change="nextStepChange" class="width-full">
                      <el-option  v-for="item in nextAction"
                                  :label="item.label"
                                  :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('business.handlePeople')">
                    <el-select size="small" v-model.trim="form.nextUser" filterable placeholder="" class="width-full">
                      <el-option  v-for="item in dealAgent"
                                  :label="item.label"
                                  :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <div class="btn-wraper">
                  <el-button type="primary" class="ui-newtemp" @click.stop="doSaveTempBusiness" :disabled="disabledBtn">{{$t('business.staging')}}</el-button>
                  <el-button type="primary" class="ui-newbus" @click.stop="doSaveBusiness" :disabled="disabledBtn">{{$t('business.submit')}}</el-button>
                </div>
              </el-form-item>
            </el-form>
          </main>
        </affix>
      </el-row>
    </div>
    <div v-else class="no-power">{{$t('business.noBusinessPower')}}</div>
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
  import {getCache, deepClone} from '../../../../utils/m7Utils.js'
  import {taskTimeAll, getRoleAgents, getRoleActions, getStepRoles, getFlowAction, getStartStep, hasAccessForFlow, getObjectById} from '../../../../utils/workflowUtils.js'
  export default {
    name: 'newBusiness',
    data () {
      return {
        loading: true,
//        radomNum: '',
        form: {
          flow: '',
          nextAction: '',
          nextUser: ''
        },
        items: [
        ],
        nextAction: [],
        dealAgent: [],
        disabledBtn: false
      }
    },
    props: {
      cid: String
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
            flow: _id,
            nextAction: '',
            nextUser: ''
          }
          this.items = deepClone(step.stepFields || [])
          // 定义客户字段顺序
//          this.items = step.stepFields || []
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
                  cacheField['default'] = [cacheField['default'], '', '']
                }
                if (cacheField.type === 'checkbox') {
                  cacheField['default'] = [cacheField['default']]
                }
                Object.assign(field, cacheField)
              }
            }
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
        let nextStepId = action.jumpTo
        let roles = getStepRoles(nextStepId)
        let agents = getRoleAgents(roles)
        this.dealAgent = []
        if (roles[0] === 'busCreateUser') {
          let createUser = this.$store.state.session.user._id
          let age = getCache('agents', createUser)
          agents = []
          agents.push(age)
        } else {
          if (agents.length !== 1) {
            this.dealAgent.push({label: '自动分配', value: ''})
          }
        }
        for (let i = 0; i < agents.length; i++) {
          this.dealAgent.push({label: agents[i].displayName + '[' + agents[i].exten + ']', value: agents[i]._id})
        }
        this.form.nextUser = ''
      },
      businessTypeData () {
        let flows = getCache('businessFlow')
        let data = []
        for (var i = 0; i < flows.length; i++) {
          let flowsItem = flows[i]
          if (hasAccessForFlow(flowsItem)) {
            let busSumTime = null
            if (flowsItem.ctype) {
              busSumTime = taskTimeAll(flowsItem.ctype, flowsItem.ctime)
            }
            if (busSumTime) {
              data.push({value: flowsItem._id, label: flowsItem.name + '(工单总时长' + busSumTime + ')', busSumTime: busSumTime})
            } else {
              data.push({value: flowsItem._id, label: flowsItem.name, busSumTime: busSumTime})
            }
          }
        }
        return data
      },
      doSaveTempBusiness () {
        this.form.customer = this.cid
        for (let i in this.form) {
          if (this.form[i] === false) {
            return
          }
        }
        this.$emit('event', {event: 'addTempBusinessTask', data: {customer: this.cid, form: this.form}})
//        this.disabledBtn = true
//        this.$store.dispatch('addTempBusinessTask', this.form).then((res) => {
//          self.disabledBtn = false
//
//        })
      },
      doSaveBusiness () {
        this.form.customer = this.cid
        for (let i in this.form) {
          if (this.form[i] === false) {
            return
          }
        }
        this.$emit('event', {event: 'addBusinessTask', data: {customer: this.cid, form: this.form}})
      }
    },
    computed: {
    },
    beforeMount () {
      let self = this
      Promise.all([
        this.$store.dispatch('getCache', {type: 'options'})
      ]).then((res) => {
        self.loading = false
      })
    },
    mounted () {
      let businessTypeData = this.businessTypeData()
      if (businessTypeData.length === 0) {
        return
      }
      this.businessTypeChange(businessTypeData[0].value)
      this.form.flow = businessTypeData[0].value
    }
  }
</script>
<style lang="stylus" scoped>
    @import '../../../../assets/common.styl'
    .btn-wraper
      float right
    .ui-newbus, .ui-newtemp
      width 90px
      padding 6px 0
      @extend .font12
    .ui-newtemp
      background-color #7ccdd1
      border 1px solid #7ccdd1
    .no-power
      color #00c7d1
      font-weight bolder
      padding 20px 20px
    .business-type
      padding 0px 0 5px
    .width-full
      width 100%
</style>
