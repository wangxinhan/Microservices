<template>
<div class="high">
  <transition name="fade">
    <div v-show="opened" class="popover">
      <el-form :inline="true" label-position="top"  class="high-ranking-search" :rules="computeRules" :model="formStacked.form" ref="ruleForm">
        <div class="search-condition">
          <div class="default-form">
            <el-form-item v-for="item in formStacked.advSearchOptions.localed" :label="item.label" :prop="item.name" :class="[item.inputType === 'time' ? 'add-width' : '',item.inputType === 'multi' ? 'multi-label' : '',item.inputType === 'rangeInput' ? 'cdr-call': '', item.inputType === 'area' ? 'add-width-linkage': '',item.name ==='CALL_TIME_LENGTH_END' || item.name === 'QUEUE_TIME_LENGTH_END'?'whiteFont':'', item.inputType === 'no' ? 'minus-width' : '']">
              <area-linkage v-if="item.inputType==='area'" :provinceName="item.provinceName" :provinceValue="formStacked.form[item.provinceName]" :cityName="item.cityName" :cityValue="formStacked.form[item.cityName]" @provinceChange="changeData" @cityChange="changeData">
              </area-linkage>

              <el-input size="small" v-if="item.inputType==='input'" v-model.trim="formStacked.form[item.name]"></el-input>
              <template v-if="item.inputType==='rangeInput'">
                <el-input size="small" :placeholder="$t('public.pleaseEnter')" v-model.trim="formStacked.form[item.name]" style="width:90%">
                  <template slot="append">{{$t('public.seconds')}}</template>
                </el-input>
                <span class="public-to" v-if="item.name !== 'CALL_TIME_LENGTH_END' && item.name !== 'QUEUE_TIME_LENGTH_END'">{{$t('public.to')}}</span>
              </template>

              <el-select size="small" v-if="item.inputType==='select'"
                         :multiple="item.multiple"
                         @click.stop.native="remoteSearch(item.remoteMethod)"
                         :allow-create="item.allowCreate"
                         :filterable="item.filterable"
                         v-model.trim="formStacked.form[item.name]"
                         :placeholder="$t('public.pleasePick')"
                         @change="changeData(formStacked.form[item.name], item.name)">
                <el-option v-if="item.inputType==='select'"
                           v-for="item2 in item.data"
                           :label="item2.label"
                           :value="item2.value">
                </el-option>
              </el-select>

              <el-date-picker size="small" v-if="item.inputType==='date'"
                              v-model.trim="formStacked.form[item.name]"
                              type="date"
                              :editable="boolean"
                              :placeholder="$t('public.pleasePick')"
                              align="left">
              </el-date-picker>

              <el-date-picker size="small" v-if="item.inputType==='time'"
                              v-model.trim="formStacked.form[item.name]"
                              type="datetimerange"
                              :editable="boolean"
                              :picker-options="pickerOptions2"
                              :placeholder="$t('public.timeRanges')"
                              align="right"
                              style="width:404px">
              </el-date-picker>

              <div v-if="item.inputType==='checkbox'">
                <el-checkbox-group  v-model.trim="formStacked.form[item.name]">
                  <el-checkbox v-if="item.inputType==='checkbox'"
                               v-for="item2 in item.data"
                               :label="item2.value">
                    {{item2.label}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>

              <div v-if="item.inputType === 'radioInput'">
                <el-radio-group v-model.trim="formStacked.form[item.radioName]">
                  <el-radio size="small" :label="`lt__${$t('webchat.lessThan')}`">{{$t('webchat.lessThan')}}</el-radio>
                  <el-radio size="small" :label="`gt__${$t('webchat.moreThan')}`">{{$t('webchat.moreThan')}}</el-radio>
                  <el-radio size="small" :label="`eq__${$t('webchat.equal')}`">{{$t('webchat.equal')}}</el-radio>
                </el-radio-group>
                <el-input size="small" v-model.trim="formStacked.form[item.inputName]"></el-input>
              </div>

              <div v-if="item.inputType==='radio'">
                <el-radio-group  v-model.trim="formStacked.form.custom[item.name]">
                  <el-radio size="small" v-if="item.inputType==='radio'"
                            v-for="item2 in item.data"
                            :label="item2.value">
                    {{item2.label}}
                  </el-radio>
                </el-radio-group>
              </div>

              <div v-if="item.inputType === 'owner'">
                <owner-tree-select ref="ownerTree" :businessType="type" :name="item.name" :owner="owner" @owner-change="handleOwnerChange" @owner-reset="handleOwnerReset">
                </owner-tree-select>
              </div>
              <i v-if="item.inputType==='no'"></i>
              <label-select v-if="item.inputType === 'multi'" @labelSelect="changeData" :stringFlag="true" :resetSelect = 'resetSelect' :isClear="isClear"></label-select>
            </el-form-item>
          </div>
          <div class="dotted" v-if="formStacked.advSearchOptions.custom"></div>
          <div class="custom-form" v-if="formStacked.advSearchOptions.custom">
            <el-form-item v-for="item in formStacked.advSearchOptions.custom" :label="item.label"
                          :class="[item.inputType==='time' || item.inputType == 'textarea' ? 'add-width' : '', item.inputType==='no' ? 'minus-width' : '', item.inputType==='checkbox' || item.inputType ==='radio' ? 'all-width' : '']">
              <el-input size="small" v-if="item.inputType==='input'" v-model.trim="formStacked.form.custom[item.name]"></el-input>

              <el-select size="small" v-if="item.inputType==='select'" v-model.trim="formStacked.form.custom[item.name]" :placeholder="$t('public.pleasePick')" @change="changeData(formStacked.form.custom[item.name], item.name, 'true', item.cascadeIndex)">
                <el-option v-if="item.inputType==='select'"
                           v-for="item2 in item.data"
                           :label="item2.label"
                           :value="item2.value">
                </el-option>
              </el-select>

              <el-date-picker size="small" v-if="item.inputType==='date'"
                              v-model.trim="formStacked.form.custom[item.name]"
                              type="date"
                              :editable="boolean"
                              :placeholder="$t('public.pleasePick')"
                              align="right">
              </el-date-picker>

              <el-date-picker size="small" v-if="item.inputType==='time'"
                              v-model.trim="formStacked.form.custom[item.name]"
                              type="datetimerange"
                              :editable="boolean"
                              :picker-options="pickerOptions2"
                              :placeholder="$t('public.timeRanges')"
                              align="right"
                              style="width:404px">
              </el-date-picker>

              <div v-if="item.inputType==='checkbox'">
                <el-checkbox-group  v-model.trim="formStacked.form.custom[item.name]">
                  <el-checkbox v-if="item.inputType==='checkbox'"
                               v-for="item2 in item.data"
                               :label="item2.value">
                    {{item2.label}}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-if="item.inputType==='radio'">
                <el-radio-group  v-model.trim="formStacked.form.custom[item.name]">
                  <el-radio size="small" v-if="item.inputType==='radio'"
                            v-for="item2 in item.data"
                            :label="item2.value">
                    {{item2.label}}
                  </el-radio>
                </el-radio-group>
              </div>
              <el-input size="small" type="textarea" v-if="item.inputType==='textarea'" v-model.trim="formStacked.form.custom[item.name]"></el-input>
              <i v-if="item.inputType==='no'"></i>

            </el-form-item>
          </div>
          <div class="solid"></div>
        </div>
        <el-form-item class="all-width btn-group">
          <el-button type="primary" @click="resetForm">{{$t("public.reset")}}</el-button>
          <el-button type="primary"  @click="submitForm('ruleForm')">{{$t("public.search")}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </transition>
  <el-button type="text" size="small" @click.stop="toggle">{{$t("public.advSearch")}}</el-button>
</div>
</template>
<script>
  import {checkform} from '../../../../utils/validate'
  import AreaLinkage from '../../../ui-modules/area-linkage/AreaLinkage.vue'
  import OwnerTreeSelect from '../../agent-tree/OwnerTreeSelect.vue'
  import LabelSelect from '../../phone-bar/LabelSelect.vue'
  import { resetForm } from '../../../../utils/m7Utils.js'

  export default {
    name: 'AdvancedSearch',
    /**
     * [props 该组件所需要的参数]
     * @type {
     *   type        业务类型
     *   typeType    业务tab
     * }
     */
    props: {
      type: String,
      tabType: String,
      searchOptions: Object,
      adv: Object,
      opened: false,
      isClear: Boolean
    },
    data () {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        resetSelect: false,
        value3: '',
        value: '',
        boolean: false,
        updateTime: '',
        visible: false,
        emitData: {}
      }
    },
    components: {
      AreaLinkage,
      OwnerTreeSelect,
      LabelSelect
    },
    watch: {
      close () {
        this.visible = false
      }
    },
    methods: {
      submitForm (formName) {
        let self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            self.$emit('advSearch', false, 1, self.emitData)
            self.visible = false
            document.getElementsByTagName('body')[0].click()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm () {
        this.resetSelect = true
        resetForm(this.formStacked.form)
        if (this.$refs.ownerTree) {
          this.$refs.ownerTree.map(tree => {
            tree.$emit('resetValue')
          })
        }
      },
      changeData (value, key, custom, cascadeIndex) {
        let emitData = {selectName: key, selectValue: value}
        if (key === 'multiCallLabel') {
          this.resetSelect = false
        }
        if (custom) {
          emitData.custom = true
          emitData.cascadeIndex = cascadeIndex
        }
        this.emitData = emitData
        this.$emit('selectChange', emitData)
      },
      remoteSearch (methodName) {
        this.$emit(methodName)
      },
      handleOwnerChange (obj) {
        let emitData = { selectName: obj.type, selectValue: `${obj._id}__${obj.displayName || obj.label}`, name: obj.name }
        this.$emit('selectChange', emitData)
      },
      handleOwnerReset (name) {
        let emitData = { selectName: 'ownercom', selectValue: '' }
        if (name) {
          emitData.name = name
        }
        this.$emit('selectChange', emitData)
      },
      toggle () {
        this.opened = !this.opened
      },
      hide () {
        this.opened = false
      }
    },
    computed: {
      formStacked () {
        return this.adv
      },
      computeRules () {
        let validateMoblie = (rule, value, callback) => {
          if (value !== '') {
            let match = checkform(value, 'Mobile')
            if (match) {
              callback(new Error(this.$t(match)))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
        let validateEmail = (rule, value, callback) => {
          if (value !== '') {
            let match = checkform(value, 'Email')
            if (match) {
              callback(new Error(this.$t(match)))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
        let validateNum = (rule, value, callback) => {
          if (value !== '') {
            let match = checkform(value, 'Number3')
            if (match) {
              callback(new Error(this.$t(match)))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
        let rules = {}
        let localItem = this.formStacked.advSearchOptions.localed
        if (localItem) {
          localItem.forEach((item) => {
            if (item.validateType === 'Number3') {
              rules[item.name] = [{validator: validateNum, trigger: 'blur'}]
            } else if (item.validateType === 'Mobile') {
              rules[item.name] = [{validator: validateMoblie, trigger: 'blur'}]
            } else if (item.validateType === 'Email') {
              rules[item.name] = [{validator: validateEmail, trigger: 'blur'}]
            }
          })
        }
        return rules
      },
      close () {
        return this.$store.state.closeAdvSearch
      },
      owner () {
        let form = this.formStacked.form
        let ownercom = form.ownercom ? form.ownercom : ''
        let owner = form.owner ? form.owner : ''
        let ownerdep = form.ownerdep ? form.ownerdep : ''
        // 工单特有的
        let ownercomCreateUser = form.ownercomCreateUser ? form.ownercomCreateUser : ''
        let createUser = form.createUser ? form.createUser : ''
        let ownerdepCreateUser = form.ownerdepCreateUser ? form.ownerdepCreateUser : ''
        let master = form.master ? form.master : ''

        return ownercom + owner + ownerdep + ownercomCreateUser + createUser + ownerdepCreateUser + master
      }
    },
    mounted () {
      document.addEventListener('click', (e) => {
        if (!this.$el.contains(e.target)) {
          this.opened = false
        }
      })
    }
  }
</script>
<style lang="stylus" scoped>
.el-checkbox-group
    display flex
    flex-wrap wrap
    margin-top -5px
    .el-checkbox
      margin-left 0
.default-form
  padding-bottom 10px
.fade-enter-active,
.fade-leave-active
  transition all 0.5s ease
.fade-enter,
.fade-leave-active
  opacity 0
.public-to
  color #1a1a1a
  font-size 12px
.high
  position relative
  .el-button
    color #1abb9c
.high-ranking-search
  padding 10px 0 10px 10px
  font-size 0
.search-condition
  max-height calc(100vh - 300px)
  overflow auto
  overflow-x hidden
.el-form--inline
  .el-form-item
    margin -8px 20px 0 0
    width 192px
  .add-width
    width 384px
    margin-right 40px
  .add-width-linkage
    width 404px
    margin-right 20px
  .minus-width
    width 0px
    .el-form-item__content
      .el-date-editor
        height 30px
        width 384px
  .all-width
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
  .el-form-item.btn-group
    width 100%
    margin-bottom 0
    padding-bottom 0
  .el-form-item.cdr-call
    width 208px
    margin-right 5px
  .el-form-item.multi-label
    width 640px
    margin-right 0
.popover
  width 1080px
  z-index 100
  position absolute
  background #fff
  top 36px
  border 1px solid #ddd
  border-radius 4px
  padding 10px
  box-shadow 0px 2px 4px 0px rgba(0, 0, 0, .12), 0px 0px 6px 0px rgba(0, 0, 0, .04)
  left -250px
  &:before
   content ""
   position absolute
   border-style solid
   top -6px
   left 270px
   border-width 0px 6px 6px 6px
   border-color #ddd transparent
  &:after
   content ""
   position absolute
   border-style solid
   top -4px
   left 272px
   border-width 0px 4px 4px 4px
   border-color  #fff transparent
  .el-button
    color #fff
</style>
