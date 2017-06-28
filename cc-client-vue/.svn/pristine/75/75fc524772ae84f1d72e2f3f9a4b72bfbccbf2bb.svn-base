<template>
  <card-group-solt
  @handleClick="changeTab"
  :activeName="activeName"
  :tabPanes="tabPanes"
    :cardLoading="loading">
    <template v-for="tabPane in tabPanes" :slot="'search_'+tabPane.type">
      <search :type="tabPane.type">
        <template :slot="'select_'+tabPane.type">
          <v-select :selectOptions="search[tabPane.type].isChildren.select" @quickSelect="handlerQuickSelect" :form="search[tabPane.type].isChildren.nomalForm"></v-select>
        </template>
        <template :slot="'inputSearch_'+tabPane.type">
          <input-search @quickSearch="nomalSearch" :placeHolder="search.placeHolder" :form="search[tabPane.type].isChildren.nomalForm"></input-search>
        </template>
        <template :slot="'advancedSearch_'+tabPane.type">
          <advanced-search v-if="search[tabPane.type].isChildren.adv" :adv="search[tabPane.type].isChildren.adv" :badge="search[tabPane.type].isChildren.adv.badgeList" @selectChange="handlerSelectChange" @advSearch="advSearch"></advanced-search>
        </template>
        <template :slot="'refresh_'+tabPane.type">
          <refresh v-if="search[tabPane.type].isChildren.refresh" @refresh="handleRefresh"></refresh>
        </template>
        <template :slot="'advSchBadge_'+tabPane.type">
          <advSchBadge v-if="search[tabPane.type].isChildren.adv.badgeList" :badge="search[tabPane.type].isChildren.adv.badgeList" @removeBadge="removeBadge"></advSchBadge>
        </template>
      </search>
    </template>
    <template slot="pagination">
      <pagination
        :customerShow="true"
        :small="search[activeName].pagination.small"
        :currentPage="search[activeName].pagination.currentPage"
        :count="count"
        :type="type"
        :tabType="activeName"
        @turnPage="turnPage"
        :totalPage="totalPage"
      >
      </pagination>
    </template>
    <template v-for="tabPane in tabPanes" :slot="'cardList_'+tabPane.type">
      <business-card
              :cardList="cardList"
              :count="count"
              :type="type"
              :tabType="tabPane.type"
              :condition = search[activeName].condition
              :clearChecked = "clearChecked"
              v-loading="loading"
              @changeCardItem="changeCardItem"
      >
      </business-card>
    </template>
  </card-group-solt>

</template>
<script>
  import CardGroupSolt from 'components/public-modules/card'
  import BusinessCard from './BusinessCard'
  import Search from '../../public-modules/card/search'
  import Select from '../../public-modules/card/search/Select'
  import InputSearch from '../../public-modules/card/search/InputSearch'
  import AdvancedSearch from '../../public-modules/card/search/AdvancedSearch'
  import Pagination from '../../public-modules/card/Pagination'
  import Refresh from '../../ui-modules/icon/Refresh'
  import AdvSchBadge from '../../public-modules/card/search/AdvSchBadge'
  import {advancedSearchBack, getFlowStepNameByCache, getStartStep, getFlowStepById, createFlowCustomFields, addBusienssSelectCascade} from '../../../utils/workflowUtils'
  import {deepClone, getDateTime} from '../../../utils/m7Utils'
  export default {
    name: 'BusinessCardGroup',
    data () {
      return {
        loading: true,
        activeName: this.$route.params.tabType || 'business_undeal',
        type: 'business',
        clearChecked: '',
        search: {
          isAdvSearch: false,
          isSearch: false, // 是否正在执行搜索
          advSearchCondition: {}, // 高级搜索的查询条件展示
          placeHolder: this.$t('public.queryPlaceHolding'),
          business_undeal: {
            searchCard: 'buSearchCard',
            show: true,
            pagination: {
              small: true,
              currentPage: 1
            },
            condition: {},
            isChildren: {
              rel: false,
              refresh: true,
              select: [],
              nomal: true,
              nomalForm: {query: '', flow: '', value: ''},
              adv: {
                form: {createUser: null, ownercomCreateUser: null, ownerdepCreateUser: null, query: null, flow: null, step: null, number: null, createTime: null, custom: {}},
                advSearchOptions: {
                  localed: [
                    {label: this.$t('public.creator'), name: 'createUser', inputType: 'owner'},
                    {label: this.$t('business.customerName'), name: 'query', inputType: 'input'},
                    {label: this.$t('business.businessFlow'), name: 'flow', inputType: 'select', data: []},
                    {label: this.$t('business.businessStep'), name: 'step', inputType: 'select', data: []},
                    {label: this.$t('business.businessNumber'), name: 'number', inputType: 'input', validateType: 'Number3'},
                    {label: this.$t('public.createTime'), name: 'createTime', inputType: 'time'}
                  ],
                  custom: [
                  ]
                },
                badgeList: {}
              }
            }
          },
          business_my: {
            searchCard: 'bmSearchCard',
            show: true,
            pagination: {
              small: true,
              currentPage: 1
            },
            condition: {},
            isChildren: {
              rel: false,
              refresh: true,
              select: [{label: this.$t('business.myTodo'), value: 'my_task_uncomplete'}, {label: this.$t('business.myCreated'), value: 'my_task_created'}, {label: this.$t('business.myParticipated'), value: 'my_task_followed'}],
              nomal: true,
              nomalForm: {query: '', flow: '', value: ''},
              adv: {
                form: {submenu2: null, createUser: null, ownercomCreateUser: null, ownerdepCreateUser: null, query: null, flow: null, step: null, number: null, createTime: null, custom: {}},
                advSearchOptions: {
                  localed: [
                    {label: this.$t('public.quickSearch'), name: 'submenu2', inputType: 'select', data: [{label: this.$t('business.myAll'), value: ''}, {label: this.$t('business.myTodo'), value: 'my_task_uncomplete'}, {label: this.$t('business.myCreated'), value: 'my_task_created'}, {label: this.$t('business.myParticipated'), value: 'my_task_followed'}]},
                    {label: this.$t('public.creator'), name: 'createUser', inputType: 'owner'},
                    {label: this.$t('business.customerName'), name: 'query', inputType: 'input'},
                    {label: this.$t('business.businessFlow'), name: 'flow', inputType: 'select', data: []},
                    {label: this.$t('business.businessStep'), name: 'step', inputType: 'select', data: []},
                    {label: this.$t('business.businessNumber'), name: 'number', inputType: 'input'},
                    {label: this.$t('public.createTime'), name: 'createTime', inputType: 'time'}
                  ],
                  custom: [
                  ]
                },
                badgeList: {}
              }
            }
          },
          business_all: {
            searchCard: 'baSearchCard',
            show: true,
            pagination: {
              small: true,
              currentPage: 1
            },
            condition: {},
            isChildren: {
              rel: true,
              refresh: true,
              select: [{label: this.$t('public.all'), value: ''}, {label: this.$t('business.todo'), value: 'task_uncomplete'}, {label: this.$t('business.finished'), value: 'task_finished'}],
              nomal: true,
              nomalForm: {query: '', flow: '', value: ''},
              adv: {
                form: {submenu2: null, createUser: null, ownercomCreateUser: null, ownerdepCreateUser: null, query: null, flow: null, step: null, master: null, ownercom: null, ownerdep: null, number: null, createTime: null, custom: {}},
                advSearchOptions: {
                  localed: [
                    {label: this.$t('public.quickSearch'), name: 'submenu2', inputType: 'select', data: [{label: this.$t('public.all'), value: ''}, {label: this.$t('business.todo'), value: 'task_uncomplete'}, {label: this.$t('business.finished'), value: 'task_finished'}]},
                    {label: this.$t('public.creator'), name: 'createUser', inputType: 'owner'},
                    {label: this.$t('business.customerName'), name: 'query', inputType: 'input'},
                    {label: this.$t('business.businessFlow'), name: 'flow', inputType: 'select', data: []},
                    {label: this.$t('business.businessStep'), name: 'step', inputType: 'select', data: []},
                    {label: this.$t('business.master'), name: 'master', inputType: 'owner'},
                    {label: this.$t('business.businessNumber'), name: 'number', inputType: 'input'},
                    {label: this.$t('public.createTime'), name: 'createTime', inputType: 'time'}
                  ],
                  custom: [
                  ]
                },
                badgeList: {}
              }
            }
          }
        }
      }
    },
    beforeMount () {
      let queryData = {
        flow: '',
        query: '',
        page: 1,
        limit: 10
      }
      getBusiness(this.$store, this.activeName, queryData).then(() => {
        Promise.all([this.$store.dispatch('getCache', {type: 'businessFlowField'}), this.$store.dispatch('getCache', {type: 'options'})]).then(() => {
          this.loading = false
          getBusinessFlow(this.$store).then(() => {
            this.tabPanes.forEach((tabPane) => {
              this.search[tabPane.type].isChildren.adv.advSearchOptions.localed.forEach((item) => {
                if (item.name === 'flow') {
                  item.data = this.businessFlowAdv
                  let quickSelect = [{label: this.$t('public.all'), value: ''}]
                  this.businessFlow.forEach(selectItem => {
                    quickSelect.push(selectItem)
                  })
                  console.log(quickSelect)
                  this.search.business_undeal.isChildren.select = quickSelect
                }
              })
            })
          })
        })
      })
    },
    activated () {
      if (this.$route.query.active) {
        this.changeTab(this.$route.query.active)
      }
    },
    computed: {
      businessFlow () {
        let flows = this.$store.state.business.transCache.businessTypes
        let returnData = []
        for (let i = 0; i < flows.length; i++) {
          returnData.push({label: flows[i].name, value: flows[i]._id})
        }
        return returnData
      },
      businessFlowAdv () {
        let flows = this.$store.state.business.transCache.businessTypes
        let returnData = [{label: '--请选择--', value: ''}]
        for (let i = 0; i < flows.length; i++) {
          returnData.push({label: flows[i].name, value: flows[i]._id})
        }
        return returnData
      },
      cardList () {
        return this.$store.state[this.type][this.type + 'List'].list
      },
      count () {
        return this.$store.state[this.type][this.type + 'List'].count
      },
      totalPage () {
        return Math.ceil(this.$store.state[this.type][this.type + 'List'].count / 10) || 0
      },
      refreshLeftcard () {
        return this.$store.state.business.transCache.refreshLeft
      },
      tabPanes () {
        let roleNum = this.$store.state.business.roleNum
        let total = this.$store.state.business.total
        let noReadNum = this.$store.state.business.noReadNum
        if (roleNum > 99) {
          roleNum = '99+'
        }
        if (total > 99) {
          total = '99+'
        }
        if (noReadNum > 99) {
          noReadNum = '99+'
        }
        return [
          {name: this.$t('business.undealBusiness') + roleNum, type: 'business_undeal'},
          {name: this.$t('business.myBusiness') + noReadNum + '/' + total, type: 'business_my'},
          {name: this.$t('business.allBusiness'), type: 'business_all'}
        ]
      }
    },
    watch: {
      refreshLeftcard () {
        this.advSearch(false)
      }
    },
    methods: {
      changeCardItem () {
        this.$emit('changeCardItem')
      },
      clearSearchQuery () {
        this.search.isAdvSearch = false
        let currentTab = this.search[this.activeName]
        currentTab.pagination.currentPage = 1
        for (let key in currentTab.isChildren.adv.form) {
          if (key !== 'custom') {
            currentTab.isChildren.adv.form[key] = null
          } else {
            currentTab.isChildren.adv.form[key] = {}
          }
        }
        for (let key in this.search[this.activeName].isChildren.nomalForm) {
          this.search[this.activeName].isChildren.nomalForm[key] = null
        }
      },
      changeTab (tabName) {
        this.activeName = tabName
        let self = this
        self.loading = true
        // 清空搜索中的查询条件
        this.clearSearchQuery()
        let queryData = {
          flow: '',
          query: '',
          page: 1,
          limit: 10
        }
        this.$store.dispatch('refreshUndealNum')
        this.$router.push({ path: '/index/business' })
        getBusiness(this.$store, this.activeName, queryData).then(() => {
          self.loading = false
        })
      },
      turnPage (pageNum) {
        if (this.search.isSearch && pageNum < 2) {
          this.search.isSearch = false
          return
        }
        if (this.search.isAdvSearch) {
          this.advSearch(false, pageNum)
        } else {
          this.nomalSearch(this.search[this.activeName].isChildren.nomalForm.query, pageNum)
        }
        // 一定要设置为false,这样才代表是翻页,而不是搜索
        this.search.isSearch = false
      },
      handlerSelectChange (selectObj) {
        let selectName = selectObj.selectName
        let selectValue = selectObj.selectValue
        let custom = selectObj.custom
        let cascadeIndex = selectObj.cascadeIndex
        if (selectName === 'submenu2') {
//          this.search[this.activeName].isChildren.nomalForm.value = selectValue
        }
        if ((selectName === 'ownercom' || selectName === 'owner' || selectName === 'ownerdep') && selectObj.name && selectObj.name === 'createUser') {
          this.search[this.activeName].isChildren.adv.form.ownercomCreateUser = null
          this.search[this.activeName].isChildren.adv.form.createUser = null
          this.search[this.activeName].isChildren.adv.form.ownerdepCreateUser = null
          if (selectName === 'owner') {
            this.search[this.activeName].isChildren.adv.form.createUser = selectValue
          } else {
            this.search[this.activeName].isChildren.adv.form[selectName + 'CreateUser'] = selectValue
          }
        }
        if ((selectName === 'ownercom' || selectName === 'owner' || selectName === 'ownerdep') && selectObj.name && selectObj.name === 'master') {
          this.search[this.activeName].isChildren.adv.form.ownercom = null
          this.search[this.activeName].isChildren.adv.form.master = null
          this.search[this.activeName].isChildren.adv.form.ownerdep = null
          if (selectName === 'owner') {
            this.search[this.activeName].isChildren.adv.form.master = selectValue
          } else {
            this.search[this.activeName].isChildren.adv.form[selectName] = selectValue
          }
        }
        // 工单类型改变
        if (selectName === 'flow') {
//          if (this.activeName === 'business_undeal' && this.search[this.activeName].isChildren.nomalForm.value !== selectValue) {
//            this.search[this.activeName].isChildren.nomalForm.value = selectValue
//          }
          getBusinessFlowStep(this.$store, selectValue).then((flow) => {
            let steps = flow.steps || []
            let stepsSelectData = [{label: '--请选择--', value: ''}]
            for (let i = 0; i < steps.length; i++) {
              let stepsItem = steps[i]
              stepsSelectData.push({label: stepsItem.name, value: stepsItem._id})
            }
            this.search[this.activeName].isChildren.adv.advSearchOptions.localed.forEach((item) => {
              if (item.name === 'step') {
                this.search[this.activeName].isChildren.adv.form.step = null
                item.data = stepsSelectData
              }
            })
            let startStep = getStartStep(flow)
            let step = getFlowStepById(flow, startStep._id)
            let fields = step ? step.stepFields : []
            let flowFields = flow ? flow.fields : []
            let customFormFields = createFlowCustomFields(fields, flowFields, true)
            this.search[this.activeName].isChildren.adv.advSearchOptions.custom = customFormFields.advFields
            this.search[this.activeName].isChildren.adv.form.custom = customFormFields.customForm
          })
        }
        // 自定义字段的级联
        if (custom) {
          let fieldId = selectName.split('_')[0]
          let rootValue = this.search[this.activeName].isChildren.adv.form.custom[fieldId]
          addBusienssSelectCascade(this.$store, selectValue, fieldId, cascadeIndex, rootValue).then((labels) => {
            this.search[this.activeName].isChildren.adv.advSearchOptions.custom.forEach((item) => {
              let selectName = fieldId + '_' + (cascadeIndex + 1)
              if (item.name === selectName) {
                this.search[this.activeName].isChildren.adv.form.custom[selectName] = null
                item.data = labels
              }
            })
          })
        }
      },
      advSearch (clearBadge, pageNum, emitData) {
        let selectName = ''
        let selectValue = ''
        if (emitData && emitData.selectName) {
          selectName = emitData.selectName ? emitData.selectName : ''
          selectValue = emitData.selectValue ? emitData.selectValue : ''
        }

        if (selectName === 'flow') {
          if (this.activeName === 'business_undeal' && this.search[this.activeName].isChildren.nomalForm.value !== selectValue) {
            this.search[this.activeName].isChildren.nomalForm.value = selectValue
          }
        }

        if (selectName === 'submenu2') {
          this.search[this.activeName].isChildren.nomalForm.value = selectValue
        }

        this.search.isSearch = true
        let self = this
        self.loading = true
        let form = this.search[this.activeName].isChildren.adv.form
        let tempArr = {}
        // deepClone后createtiem里日期消失
        if (form.createTime && form.createTime[0] !== null) {
          form.createTime$begin = getDateTime(form.createTime[0])
        }
        if (form.createTime && form.createTime[1] !== null) {
          form.createTime$end = getDateTime(form.createTime[1])
        }
        for (let m in form.custom) {
          if (form.custom[m] instanceof Date) {
            form.custom[m] = getDateTime(form.custom[m])
          }
        }
        let searchQuery = deepClone(form)
        let flows = this.$store.state.business.transCache.businessTypes
        if (clearBadge === true) {
          self.search.isAdvSearch = false
          // 清空高级搜索选项
          for (let key in form) {
            if (key === 'custom') {
              form.custom = {}
            } else {
              form[key] = null
            }
          }
          searchQuery = {}
        } else {
          if (searchQuery.submenu2) {
          }
          self.search.isAdvSearch = true
          let custom = searchQuery.custom
          delete searchQuery.createTime
          for (let key in searchQuery) { // 搜索条件
            if (searchQuery[key] && key !== 'custom') {
              tempArr[key] = searchQuery[key]
              if (key === 'flow') {
                for (let i = 0; i < flows.length; i++) {
                  if (flows[i]._id === searchQuery[key]) {
                    tempArr[key] = flows[i].name
                    break
                  }
                }
              } else if (key === 'step') {
                tempArr[key] = getFlowStepNameByCache(searchQuery.flow, searchQuery.step)
              } else if (key === 'submenu2') {
                let select = this.search[this.activeName].isChildren.select
                for (let i = 0; i < select.length; i++) {
                  if (select[i].value === searchQuery[key]) {
                    tempArr[key] = select[i].label
                  }
                }
              } else if (searchQuery[key] && typeof searchQuery[key] === 'string') {
                if (searchQuery[key].match(/__/)) {
                  tempArr[key] = searchQuery[key].substr(searchQuery[key].indexOf('__') + 2)
                  searchQuery[key] = searchQuery[key].substr(0, searchQuery[key].indexOf('__'))
                } else {
                  tempArr[key] = searchQuery[key]
                }
              }
            }
          }
          for (let i in custom) {
            searchQuery[i] = custom[i]
          }
          // 自定义字段回显
          tempArr = Object.assign(tempArr, advancedSearchBack(custom))
          delete searchQuery.custom
          // 去除普通搜索的条件
//          for (let key in this.search[this.activeName].isChildren.nomalForm) {
//            this.search[this.activeName].isChildren.nomalForm[key] = null
//          }
        }
        this.search[this.activeName].isChildren.adv.badgeList = tempArr
        searchQuery.page = pageNum || 1
        self.search[self.activeName].pagination.currentPage = pageNum || 1
        self.search[self.activeName].condition = searchQuery
        getBusiness(this.$store, this.activeName, searchQuery).then(() => {
          self.loading = false
        })
      },
      /**
       * 快捷搜索
       */
      handlerQuickSelect (value) {
        if (this.search.isAdvSearch && value === null) {
          return
        }
        this.search[this.activeName].isChildren.adv.badgeList = {} // 清除高级搜索项
        this.search.isAdvSearch = false
        this.search.isSearch = true
        let self = this
        self.loading = true
        if (self.activeName === 'business_undeal') {
          self.search[this.activeName].isChildren.adv.form.flow = value
        } else {
          self.search[this.activeName].isChildren.adv.form.submenu2 = value
        }
        if (self.activeName === 'business_undeal') {
          self.search[self.activeName].isChildren.nomalForm.flow = value
          self.search[self.activeName].isChildren.nomalForm.value = value
        } else {
          self.search[self.activeName].isChildren.nomalForm.submenu2 = value
          self.search[self.activeName].isChildren.nomalForm.value = value
        }
        let queryData = deepClone(this.search[self.activeName].isChildren.nomalForm)
        delete queryData.value
        self.search[self.activeName].pagination.currentPage = 1
        getBusiness(this.$store, self.activeName, queryData).then(() => {
          self.loading = false
        })
      },
      nomalSearch (value, pageNum) {
        this.search.isSearch = true
        let self = this
        self.loading = true

        this.search[this.activeName].isChildren.adv.badgeList = {} // 清除高级搜索项
        this.search.isAdvSearch = false

        this.search[self.activeName].isChildren.nomalForm.query = value
        let queryData = deepClone(this.search[self.activeName].isChildren.nomalForm)
        delete queryData.value
        queryData.page = pageNum || 1
        self.search[self.activeName].pagination.currentPage = pageNum || 1
        getBusiness(this.$store, this.activeName, queryData).then(() => {
          self.loading = false
        })
      },
      handleRefresh () {
        if (this.search.isAdvSearch) {
          this.advSearch()
        } else {
          this.nomalSearch(this.search[this.activeName].isChildren.nomalForm.query)
        }
      },
      removeBadge () {
        this.advSearch(true)
        this.clearChecked = Math.random()
      }
    },
    components: {
      BusinessCard,
      Search,
      'v-select': Select,
      CardGroupSolt,
      InputSearch,
      AdvancedSearch,
      Pagination,
      Refresh,
      AdvSchBadge
    }
  }
  function getBusiness (store, tabName, data) {
    if (tabName === 'business_my') {
      if (data.submenu2 === 'my_task_followed') {
        delete data.submenu2
        return store.dispatch('getFollowedBusiness', data)
      } else if (data.submenu2 === 'my_task_created') {
        delete data.submenu2
        return store.dispatch('getAssignedBusiness', data)
      } else {
        delete data.submenu2
        return store.dispatch('getUnDealBusiness', data)
      }
    } else if (tabName === 'business_all') {
      if (data.submenu2 === 'task_finished') {
        delete data.submenu2
        return store.dispatch('getAllFinishedBusiness', data)
      } else if (data.submenu2 === 'task_uncomplete') {
        delete data.submenu2
        return store.dispatch('getAllUncompleteBusiness', data)
      } else {
        delete data.submenu2
        return store.dispatch('queryAllBusiness', data)
      }
    } else {
      return store.dispatch('getRoleUnDealBusiness', data)
    }
  }
  function getBusinessFlowStep (store, flowId) {
    return store.dispatch('getCache', {type: 'businessFlow', id: flowId})
  }
  function getBusinessFlow (store) {
    return store.dispatch('getBusinessFlow')
  }
</script>
<style lang="stylus" scoped>
</style>
