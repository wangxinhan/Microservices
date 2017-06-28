<template>
  <div class="customizeSearch customer-dialog">
    <el-dialog ref="dialog" :title="title" @close="handleClose" custom-class="customer-search-dialog" :size="small">
      <div class="dialogbody">
        <el-form class="formbody" ref="customizeForm">
          <el-form-item :label="$t('public.menu')" key="kMenus">
            <el-select v-model="formdata.menu">
              <el-option v-for="item in menus" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('customer.CustomerSearch.name')" key="kName">
            <el-input v-model="formdata.kName" size="small"></el-input>
          </el-form-item>
          <el-form-item :label="$t('customer.CustomerSearch.condition')">
            <el-form class="formcontent">
              <div v-for="(item, index) in chooseOptions" class="formitem" :key="item.value + index +'form'">

                <el-select v-model="chooseObject[item.label]" @change="labelChange(chooseObject[item.label],index)" >
                  <el-option :label="item.label" :value="item.value"></el-option>
                  <el-option v-for="li in notChooseOptions" v-if="li.value !== item.value" :label="li.label" :value="li.value" >
                  </el-option>
                </el-select>

                <!--<m7-select v-model="item.value" @change="labelChange(item.value,index)" :key="item.value">-->
                <!--<m7-option :value="item.value" :label="item.label"></m7-option>-->
                <!--<m7-option v-for="li in notChooseOptions" :value="li.value" :label="li.label"></m7-option>-->
                <!--</m7-select>-->
                <m7-select class="relative" v-if="item.inputType !== 'date'  && item.inputType !== 'time'" value="1" >
                <m7-option value="1" :label="$t('public.equal')"></m7-option>
                </m7-select>
                <!--<m7-select class="relative" v-if="item.inputType === 'date' || item.inputType === 'time'"-->
                <!--:options="[{'label':'大于','value':'1'},{'label':'小于','value':'2'}]"-->
                <!--v-model="formdata.query[item.value].relate" ></m7-select>-->
                <!--<el-select class="relative" v-if="item.inputType !== 'date'  && item.inputType !== 'time'" :key="item.value + 'select'"-->
                           <!--:value="inputrelate" >-->
                  <!--<el-option label="等于" value=""></el-option>-->
                <!--</el-select>-->
                <el-select class="relative"
                           v-if="item.inputType === 'date' || item.inputType === 'time'"
                           v-model="formdata.query[item.value][item.timeindex].relate" >
                  <el-option :label="$t('public.moreThan')" value="JGx0"></el-option>
                  <el-option :label="$t('public.lessThan')" value="JGd0"></el-option>
                </el-select>
                <!--输入框-->
                <el-input class="width196" v-if="item.inputType === 'input'" v-model="formdata.query[item.value]" :key="item.value + 'input'"
                ></el-input>
                <!--多行文本-->
                <el-input class="width196" v-if="item.inputType === 'textarea'" type="textarea" :rows="2" :key="item.value + 'textarea'"
                          v-model="formdata.query[item.value]" ></el-input>
                <!--一般下拉-->
                <el-select class="width196" v-if="item.inputType === 'select'" v-model="formdata.query[item.value]" :key="item.value + 'select'"
                           placeholder="请选择" >
                  <el-option v-for="option in item.data" :label="option.label" :value="option.value">
                  </el-option>
                </el-select>
                <!--<m7-select class="width196" v-if="item.inputType === 'select'" v-model="formdata.query[item.value]" :key="item.value + 'select'"-->
                <!--placeholder="请选择" :options="item.data">-->
                <!--</m7-select>-->
                <!--省份下拉框-->
                <el-select class="width196" v-if="item.inputType === 'area'" v-model="formdata.query[item.value]" :key="item.value + 'select'"
                           placeholder="请选择" >
                  <el-option v-for="option in provinces" :label="option.label" :value="option.value"></el-option>
                </el-select>
                <!--<m7-select class="width196" v-if="item.inputType === 'area'" v-model="formdata.query[item.value]" :key="item.value + 'select'"-->
                <!--placeholder="请选择" :options="provinces">-->
                <!--</m7-select>-->
                <!--日期时间选择-->
                <el-date-picker
                  class="width196"
                  v-if="item.inputType === 'date' || item.inputType === 'time'"
                  v-model="formdata.query[item.value][item.timeindex].value"
                  type="datetime"
                  :placeholder="$t('customer.CustomerSearch.pleaseChooseTime')" >
                </el-date-picker>

                <!--占位-->
                <span class="width196" v-if="item.inputType === 'checkbox' || item.inputType === 'radio' "></span>
                <!--增删条件图标-->
                <i v-if="index === 0" class="el-icon-plus el-icon--right cursorpointer colorgreen" @click="addOptions"></i>
                <i v-if="index !== 0" class="iconfont icon-zuixiaohua el-icon--right cursorpointer colorred"
                   @click="deleteOptions(item, index)"></i>
                <!--多选-->
                <div v-if="item.inputType === 'checkbox'">
                  <el-checkbox-group v-if="item.inputType === 'checkbox'" v-model="formdata.query[item.value]" >
                    <el-checkbox v-for="checkitem in item.data" :label="checkitem.value">{{checkitem.label}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <!--单选-->
                <div v-if="item.inputType === 'radio'">
                  <el-radio-group v-model="formdata.query[item.value]" >
                    <el-radio v-for="radioitem in item.data" :label="radioitem.value">
                      {{radioitem.label}}
                    </el-radio>
                  </el-radio-group>
                </div>
                <!--市级选择-->
                <div v-if="item.inputType === 'area'">
                  <!--<m7-select class="width196" :disabled="true" value="1"  :options="[{'label':'市','value':'1'}]">-->
                  <!--</m7-select>-->
                  <el-select value="1" disabled
                             :placeholder="$t('public.pleasePick')" >
                    <el-option label="市" value="1"></el-option>
                  </el-select>
                  <m7-select class="relative" value="1" :options="[{'label':$t('public.equal'),'value':'1'}]">
                  </m7-select>
                  <el-select class="width196" v-model="formdata.query.city"
                             :placeholder="$t('public.pleasePick')" >
                    <el-option v-for="option in cities" :label="option.label" :value="option.value"></el-option>
                  </el-select>
                  <!--<m7-select class="width196" v-model="formdata.query.city" :options="cities"></m7-select>-->
                </div>

              </div>
            </el-form>
          </el-form-item>
        </el-form>
        <div class="footer">
          <el-button type="primary" @click.stop="cancel" class="button cancelbutton cursorpointer">
            {{$t('public.cancel')}}
          </el-button>
          <el-button type="primary" @click.stop="saveSearch" class="button cursorpointer">
            {{$t('public.save')}}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {deepClone, getFormatDateTime} from '../../../utils/m7Utils'
//  import {checkform} from '../../../utils/validate'
  import {sortCustomFields} from '../../../utils/customerUtils.js'
  import m7Select from '../../public-modules/m7-select/m7-select.vue'
  import m7Option from '../../public-modules/m7-select/m7-option.vue'
  export default {
    name: 'CustomizeSearchDialog',
    data () {
      return {
        title: '',
        searchOptions: [],
        chooseOptions: [],
        inputrelate: '',
        modifystatus: false,
        CustomizeId: '',
        formdata: {
          menu: 'customer_my',
          kName: '',
          query: {}
        },
        menus: [
          {
            label: this.$t('customer.customerMy'),
            value: 'customer_my'
          }, {
            label: this.$t('customer.customerPlan'),
            value: 'customer_plan'
          }, {
            label: this.$t('customer.customerAll'),
            value: 'customer_all'
          }
        ],
        provinceCache: {options: []},
        provinces: [],
        chooseObject: {},
        propsitem: {}
      }
    },
    components: {
      m7Select,
      m7Option
    },
    watch: {
      cities (curr, prev) {
        if (curr.length > 1 && prev.length > 1) {
          if (curr[1].value !== prev[1].value) {
            this.formdata.query.city = ''
          }
        }
      },
      chooseOptions () {
        this.chooseObject = {}
        this.chooseOptions.forEach((item) => {
          if (this.chooseObject[item.label] === undefined) {
            Vue.set(this.chooseObject, item.label, item.value)
          }
        })
      }
    },
    methods: {
      showCache (item) {
        let vm = this
        this.formdata.query = {}
        this.chooseOptions = []
        let searchOptions = deepClone(this.searchOptions)
        if (this.isEmptyObject(item.query)) {
          let choose = deepClone(this.searchOptions)[0]
          this.chooseOptions.push(choose)
          Vue.set(this.formdata.query, choose.value, '')
        }
        for (let key in item.query) {
          if (key === 'city') {
            Vue.set(this.formdata.query, key, item.query[key])
          }
          searchOptions.forEach((option) => {
            if (option.value === key) {
              if (option.inputType === 'date' || option.inputType === 'time') {
                if (!vm.formdata.query[option.value]) {
                  Vue.set(vm.formdata.query, option.value, {})
                }
                let timekeys = Object.keys(item.query[key])
                timekeys.forEach((timeitem, index) => {
                  if ((index + 1) === option.timeindex) {
                    Vue.set(vm.formdata.query[option.value], index + 1, {
                      relate: timeitem,
                      value: new Date(item.query[key][timeitem])
                    })
                    vm.chooseOptions.push(option)
                  }
                })
              } else {
                Vue.set(vm.formdata.query, option.value, item.query[key])
                vm.chooseOptions.push(option)
              }
            }
          })
        }
      },
      isEmptyObject (obj) {
        for (let key in obj) {
          return false
        }
        return true
      },
      open (item) {
        let vm = this
        this.$refs.dialog.open()
        this.title = this.$t('customer.CustomerSearch.addCustomizeSearch')
        if (item) {
          this.propsitem = deepClone(item)
          this.title = this.$t('customer.CustomerSearch.updateCustomizeSearch')
          this.modifystatus = true
          this.CustomizeId = item._id
          this.formdata.kName = item.kName
          this.formdata.menu = item.menu
          this.showCache(item)
        }
        vm.unwatch = vm.$watch(function () {
          return vm.formdata.menu
        }, function (newval, oldval) {
          if (newval !== this.propsitem.menu || this.isEmptyObject(this.propsitem)) {
            vm.chooseOptions = []
            vm.formdata.query = {}
            let choose = deepClone(vm.searchOptions)[0]
            vm.chooseOptions.push(choose)
            Vue.set(vm.formdata.query, choose.value, '')
          } else {
            this.showCache(this.propsitem)
          }
        }, {deep: true})
      },
      addOptions () {
        if (this.notChooseOptions.length <= 0) {
          this.$message.error(this.$t('customer.CustomerSearch.noChooseTips'))
          return
        }
        let item = deepClone(this.notChooseOptions[0])
        if (item.inputType === 'checkbox') {
          Vue.set(this.formdata.query, item.value, [])
        } else if (item.inputType === 'date' || item.inputType === 'time') {
          if (!this.formdata.query[item.value]) {
            Vue.set(this.formdata.query, item.value, {})
          }
          if (!this.formdata.query[item.value][item.timeindex]) {
            Vue.set(this.formdata.query[item.value], item.timeindex, {})
            Vue.set(this.formdata.query[item.value][item.timeindex], 'relate', 'JGx0')
            Vue.set(this.formdata.query[item.value][item.timeindex], 'value', '')
          }
        } else {
          Vue.set(this.formdata.query, item.value, '')
        }
        if (item.inputType === 'area') {
          Vue.set(this.formdata.query, 'city', '')
        }
        this.chooseOptions.push(item)
      },
      deleteOptions (option, index) {
        let vm = this
        if (option.inputType === 'time' || option.inputType === 'date') {
          Vue.delete(vm.formdata.query[option.value], option.timeindex)
          if (this.isEmptyObject(this.formdata.query[option.value])) {
            Vue.delete(this.formdata.query, option.value)
          }
        } else {
          Vue.delete(vm.formdata.query, option.value)
        }
        if (option.inputType === 'area') {
          Vue.delete(vm.formdata.query, 'city')
        }
        vm.chooseOptions.splice(index, 1)
//        this.chooseOptions.forEach((item, index) => {
//          if (option.inputType !== 'time' && option.value === item.value) {
//            vm.$nextTick(function () {
//              vm.chooseOptions.splice(index, 1)
//            })
//          } else if (option.inputType === 'time' && option.value === item.value && option.timeindex === item.timeindex) {
//            vm.chooseOptions.splice(index, 1)
//          }
//        })
      },
      labelChange (name, index) {
        let array = deepClone(this.searchOptions)
        let label = this.chooseOptions[index].label
        let timeForeach = false
        array.forEach((item) => {
          if (item.label === label) {
            if (item.inputType === 'time' || item.inputType === 'date') {
              let timeindexCache = this.chooseOptions[index].timeindex
              if (item.timeindex === timeindexCache) {
                Vue.delete(this.formdata.query[item.value], timeindexCache)
                if (this.isEmptyObject(this.formdata.query[item.value])) {
                  Vue.delete(this.formdata.query, item.value)
                }
              }
            } else {
              Vue.delete(this.formdata.query, item.value)
            }
            if (item.inputType === 'area') {
              Vue.delete(this.formdata.query, 'city')
            }
          }
        })
        array.forEach((item) => {
          if (item.value === name) {
            if (item.inputType === 'area') {
              Vue.set(this.formdata.query, 'city', '')
              this.chooseOptions.splice(index, 1, item)
            }
            if (item.inputType === 'checkbox') {
              Vue.set(this.formdata.query, item.value, [])
              this.chooseOptions.splice(index, 1, item)
            } else if (item.inputType === 'date' || item.inputType === 'time') {
              if (!this.formdata.query[item.value]) {
                Vue.set(this.formdata.query, item.value, {})
              }
              if (!this.formdata.query[item.value][item.timeindex] && !timeForeach) {
                Vue.set(this.formdata.query[item.value], item.timeindex, {})
                Vue.set(this.formdata.query[item.value][item.timeindex], 'relate', 'JGx0')
                Vue.set(this.formdata.query[item.value][item.timeindex], 'value', '')
                this.chooseOptions.splice(index, 1, item)
                timeForeach = true
              }
            } else {
              Vue.set(this.formdata.query, item.value, '')
              this.chooseOptions.splice(index, 1, item)
            }
          }
        })
      },
      saveSearch () {
        let payload = this.formdata.query
        let data = {
          kName: this.formdata.kName,
          menu: this.formdata.menu,
          query: {}
        }
        if (!data.kName) {
          this.$message.error(this.$t('customer.CustomerSearch.pleaseEnterSearchName'))
          return
        }
        for (let key in payload) {
          let value = payload[key]
          if (value !== '') {
            if (value instanceof Object && !(value instanceof Array)) {
              if (!this.isEmptyObject(value)) {
                let timekeys = Object.keys(value)
                if (timekeys.length === 1) {
                  if (value[timekeys[0]].value) {
                    let timekey = value[timekeys[0]].relate
                    let timevalue = value[timekeys[0]].value ? getFormatDateTime(value[timekeys[0]].value) : ''
                    let timedata = {}
                    timedata[timekey] = timevalue
                    data.query[key] = timedata
                  }
                } else if (timekeys.length === 2) {
                  let timekey1 = value[timekeys[0]].relate
                  let timekey2 = value[timekeys[1]].relate
                  if (timekey1 === timekey2) {
                    this.$message.error(this.$t('customer.CustomerSearch.timeFormatErrorTip'))
                    return
                  }
                  if (value[timekeys[0]].value || value[timekeys[1]].value) {
                    let timedata = {}
                    if (value[timekeys[0]].value) {
                      timedata[timekey1] = value[timekeys[0]].value
                    }
                    if (value[timekeys[1]].value) {
                      timedata[timekey2] = value[timekeys[1]].value
                    }
                    data.query[key] = timedata
                  }
                }
              }
            } else {
              data.query[key] = value
            }
          }
        }
        let updatetype = this.modifystatus ? 'updateCustomerQuickSearch' : 'addCustomerQuickSearch'
        if (this.modifystatus) {
          data.kId = this.CustomizeId
        }
        this.$store.dispatch(updatetype, data).then((data) => {
          let vm = this
          if (data) {
            vm.reset()
            vm.$refs.dialog.close()
          }
        })
      },
      cancel () {
        this.reset()
        this.$refs.dialog.close()
      },
      reset () {
        this.title = ''
        this.propsitem = {}
        this.modifystatus = false
        this.chooseOptions = []
        this.formdata = {
          menu: 'customer_my',
          kName: '',
          query: {}
        }
        let choose = deepClone(this.searchOptions)[0]
        this.chooseOptions.push(choose)
        Vue.set(this.formdata.query, choose.value, '')
      },
      handleClose () {
        this.reset()
        this.unwatch()
      },
      selectOptions (item) {
        return this.notChooseOptions.push(item)
      }
    },
    computed: {
      notChooseOptions () {
        let vm = this
        let notChoose = []
        let notChooseValue = []
        let values = []
        let search = vm.searchOptions
        vm.chooseOptions.forEach((item) => {
          values.push(item.value)
        })
        search.forEach((item) => {
          if (values.indexOf(item.value) === -1 && notChooseValue.indexOf(item.value) === -1) {
            notChoose.push(item)
            notChooseValue.push(item.value)
          } else if (values.indexOf(item.value) !== -1 && item.inputType === 'time' && vm.formdata.query[item.value] && !vm.formdata.query[item.value][item.timeindex]) {
            notChoose.push(item)
            notChooseValue.push(item.value)
          } else if (values.indexOf(item.value) !== -1 && item.inputType === 'date' && vm.formdata.query[item.value] && !vm.formdata.query[item.value][item.timeindex]) {
            notChoose.push(item)
            notChooseValue.push(item.value)
          }
        })
        return notChoose
      },
      cities () {
        let cities = []
        if (this.formdata.query.province) {
          for (let i = 0; i < this.provinceCache.options.length; i++) {
            if (this.provinceCache.options[i].key === this.formdata.query.province) {
              cities = this.provinceCache.options[i].options
              break
            }
          }
        }
        return [{label: this.$t('public.all'), value: ''}, ...cities.map(city => ({label: city.name, value: city.key}))]
      }
    },
    beforeMount () {
      let p1 = this.$store.dispatch('getCache', {
        type: 'options',
        id: 'd7b9c68a-b50f-21d1-d5fd-41ea93f5f49c'
      })
      let p2 = this.$store.dispatch('getCache', {
        type: 'custTmpls'
      })
      let p3 = this.$store.dispatch('getCache', {
        type: 'custCategorys'
      })
      let p = Promise.all([p1, p2, p3])
      p.then(([provinceCache, custTmpls, custCategorysCache]) => {
        this.provinceCache = provinceCache
        let provinces = [{
          label: this.$t('public.all'),
          value: ''
        }, ...provinceCache.options.map(province => ({label: province.name, value: `${province.key}`}))]
        this.provinces = provinces
        let custTmpl = custTmpls[0]
        let statuses = [{label: this.$t('public.all'), value: ''}]
        for (let key in custTmpl.status) {
          statuses.push({label: custTmpl.status[key], value: key})
        }
        let sources = [{label: this.$t('public.all'), value: ''}, ...custTmpl.source.map(source => ({
          label: source.name,
          value: source.key
        }))]
        let custCategorys = [{
          label: this.$t('public.all'),
          value: ''
        }, ...custCategorysCache.map(category => ({
          label: category.cName,
          value: category._id
        }))]

        let localedOptions = [
          {label: '公海来源', value: 'categoryId', inputType: 'select', data: custCategorys},
          {label: '客户状态', value: 'status', inputType: 'select', data: statuses},
          {label: '客户名称', value: 'name', inputType: 'input'},
          {label: '客户电话', value: 'phone', inputType: 'input', validateType: 'Phone'},
          {label: '数据来源', value: 'custsource1', inputType: 'select', data: sources},
          {
            label: '省',
            value: 'province',
            inputType: 'area'
          },
          {label: '更新时间', value: 'lastUpdateTime', inputType: 'time', timeindex: 1},
          {label: '更新时间', value: 'lastUpdateTime', inputType: 'time', timeindex: 2},
          {label: '创建时间', value: 'createTime', inputType: 'time', timeindex: 1},
          {label: '创建时间', value: 'createTime', inputType: 'time', timeindex: 2},
          {label: '联系时间', value: 'notifyTime', inputType: 'time', timeindex: 1},
          {label: '联系时间', value: 'notifyTime', inputType: 'time', timeindex: 2},
          {label: '导入批次', value: 'batchNo', inputType: 'input'}
        ]

        let isFieldAdded = (fieldName) => fieldName === 'province' || fieldName === 'city' || fieldName === 'name' || fieldName === 'phone'
        custTmpl.stable_fields.forEach(stableField => {
          if (stableField.search && !isFieldAdded(stableField.name)) {
            localedOptions.push({label: stableField.value, value: stableField.name, inputType: 'input'})
          }
        })

        let customOptions = []
        let sortedCustomFields = sortCustomFields(custTmpl.custom_fields)
        sortedCustomFields.forEach(customField => {
          let option = {label: customField.name, value: customField._id}
          if (customField.type === 'single') {
            option.inputType = 'input'
          } else if (customField.type === 'multi') {
            option.inputType = 'textarea'
          } else if (customField.type === 'number') {
            option.inputType = 'input'
            option.validateType = 'Number'
          } else if (customField.type === 'dropdown') {
            option.inputType = 'select'
            option.data = []
            for (let key in customField.choices) {
              option.data.push({label: customField.choices[key], value: key})
            }
          } else if (customField.type === 'checkbox' || customField.type === 'radio') {
            option.inputType = customField.type
            option.data = []
            for (let key in customField.choices) {
              option.data.push({label: customField.choices[key], value: key})
            }
          } else {
            option.inputType = customField.type
          }
          if (customField.value === 'email') {
            option.validateType = 'Email'
          }
          if (option.inputType === 'date') {
            option.timeindex = 2
            let option1 = {label: option.label, value: option.value, inputType: option.inputType, timeindex: 1}
            customOptions.push(option1)
          }
          customOptions.push(option)
        })
        this.searchOptions = localedOptions.concat(customOptions)
        let choose = deepClone(this.searchOptions)[0]
        this.chooseOptions.push(choose)
        Vue.set(this.formdata.query, choose.value, '')
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../assets/common.styl"
  .customizeSearch
    margin 0 0 0 30px
    .dialogbody
      padding-top 10px
      max-height: 560px;
      overflow auto
      .colorred
        color red
      .colorgreen
        color #1abb9c
    .footer
      text-align center
      margin 10px 10px
      .button
        background: #1abb9c;
        width 64px
        padding 0
        border none
        height 28px
        font-size 12px
        margin-bottom 10px
      .cancelbutton
        background-color #7bcdd2
    .formbody
      padding-left 70px
    .el-input
      width auto
    .formcontent
      padding-left 40px
    .relative
      width 100px
    .width196
      width 196px
      display inline-block
    .formitem
      margin 5px 0
    .cursorpointer
      cursor pointer
</style>
