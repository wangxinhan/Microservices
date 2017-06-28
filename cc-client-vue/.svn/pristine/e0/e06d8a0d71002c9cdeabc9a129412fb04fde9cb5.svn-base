<template>
  <el-col :span="24" class="approval">
    <affix :label="this.$t('business.dealBusiness') + '-' + this.processBusinessName">
      <main>
        <el-form label-position="top" :model="form"  ref="form"  class="approval-form">
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
                <b-file v-if="one.type==='file'" v-on:tellme="tellme" :label="one.name" :default="one.default" :id="one._id" :require="one.required"></b-file>
              </div>
            </el-col>
          </el-row>
          <div class="clearfix">
            <el-form-item style="float: left;" label="" v-if="isShow">
              <span class="next-deal">下一步处理人&nbsp;&nbsp;</span>
              <el-select size="small" v-model.trim="form.master" :placeholder="$t('public.pleasePick')"  filterable @change="changeNextMaster">
                <el-option
                  v-for="item in dealAgent"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="wrapper">
              <el-button type="primary" @click.stop="excuteBusinessStepAction" class="ui-pass" :disabled="disabledBtn">执行</el-button>
            </div>
          </div>
        </el-form>
      </main>
    </affix>
  </el-col>
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
  import {getFlowStepActionById, getObjectById, getBusinessStepActionName, getStepRoles, getRoleAgents} from '../../../../utils/workflowUtils.js'
  export default {
    name: 'Approval',
    props: {
      tabName: String,
      process: Object,
      business: Object
    },
    components: {
      BInput,
      BTextarea,
      BRadio,
      BCheckbox,
      BDatatime,
      BSelect,
      BFile,
      BNumber,
      affix
    },
    data () {
      return {
        form: {
          _id: this.process._id,
          actionId: this.process.actionId,
          master: '',
          type: ''
        },
        isShow: true,
        items: [],
        disabledBtn: false,
        dealAgent: []
      }
    },
    watch: {
      process (newV, oldV) {
        this.items = []
        this.$nextTick(() => {
          this.createProcessBusiness()
        })
      }
    },
    computed: {
      processBusinessName () {
        return getBusinessStepActionName(this.process.stepId, this.process.actionId)
      }
    },
    methods: {
      changeNextMaster (value) {
        this.form.master = value
      },
      createProcessBusiness () {
        if (!this.process.actionId) {
          return
        }
        let flow = getCache('businessFlow', this.business.flow)
        let step = getCache('businessFlowStep', this.business.step)
        let action = getFlowStepActionById(step.actions, this.process.actionId)
        this.form = {
          _id: this.business._id,
          actionId: this.process.actionId,
          master: ''
        }
        // 定义客户字段顺序
        this.items = action.actionFields || []
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
                let value = this.business[cacheField._id] || cacheField['default']
                let value1 = this.business[cacheField._id + '_1'] || ''
                let value2 = this.business[cacheField._id + '_2'] || ''
                let data = [value, value1, value2]
                cacheField['default'] = data
              } else if (cacheField.type === 'checkbox') {
                cacheField['default'] = this.business[cacheField._id] || [cacheField['default']]
              } else {
                cacheField['default'] = this.business[cacheField._id] || cacheField['default']
              }
              Object.assign(field, cacheField)
            }
          }
        }
        let nextStepId = action.jumpTo
        let nextStep = getCache('businessFlowStep', nextStepId)
        if (nextStep.type === 'sys') {
          this.nextStepValue = 'sys'
          this.isShow = false
        } else {
          let roles = getStepRoles(nextStepId)
          let agents = getRoleAgents(roles)
          this.dealAgent = []
          if (roles[0] === 'busCreateUser') {
            let createUser = this.business.createUser
            let age = getCache('agents', createUser)
            // 工单创建人,其他作息不显示
            agents = []
            agents.push(age)
            this.form.master = agents[0]._id
          } else {
            if (agents.length !== 1) {
              this.dealAgent.push({label: '自动分配', value: ''})
            }
          }
          for (let i = 0; i < agents.length; i++) {
            this.dealAgent.push({label: agents[i].displayName, value: agents[i]._id})
          }
          if (agents.length === 1) {
            this.form.master = agents[0]._id
          }
        }
      },
      tellme (val) {
        Object.assign(this.form, val)
      },
      excuteBusinessStepAction () {
        for (let i in this.form) {
          if (this.form[i] === false) {
            return
          }
        }
        this.$emit('event', {event: 'stepAction', data: {_id: this.business._id, customer: this.business.customer, form: this.form}})
//        this.disabledBtn = true
//        this.$store.dispatch('excuteBusinessStepAction', this.form).then((res) => {
//          self.disabledBtn = false
//          debugger
//        })
      }
    },
    beforeMount () {
      this.createProcessBusiness()
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/common.styl'
  .approval
    padding 20px 0 0
    header
      text-align center
      padding 10px 0
      h3
        display inline-block
        color $cf-level2
    main
    &:before
      content ''
      clear both
    .wrapper
      float right
      .ui-pass
        width 90px
        padding 6px 0
        @extend .font12
        background-color #7bcdd2
        border 1px solid #7bcdd2
  .next-deal
    color #666
    font-size 12px
</style>
