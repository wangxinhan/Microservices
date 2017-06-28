<template>
  <card-group-solt
  @handleClick="changeTab"
  :activeName="activeName"
  :tabPanes="tabPanes">
    <template v-for="tabPane in tabPanes" :slot="'search_'+tabPane.type">
      <search :type="tabPane.type">
        <template :slot="'select_'+tabPane.type">
          <v-select :selectOptions="search[tabPane.type].isChildren.select" :form="search[tabPane.type].isChildren.nomalForm" @quickSelect="handlerQuickSelect"></v-select>
        </template>
        <template :slot="'inputSearch_'+tabPane.type">
          <input-search :placeHolder="search.placeHolder" :form="search[tabPane.type].isChildren.nomalForm" @quickSearch="handlerQuickSearch"></input-search>
        </template>
        <template :slot="'advancedSearch_'+tabPane.type">
          <advanced-search v-if="search[tabPane.type].isChildren.adv" :adv="search[tabPane.type].isChildren.adv" @selectChange="handlerSelectChange" @advSearch="advSearch"></advanced-search>
        </template>
        <template :slot="'dropdownSelect_'+tabPane.type">
          <dropdown-menu></dropdown-menu>
        </template>
        <template :slot="'advSchBadge_'+tabPane.type">
          <advSchBadge v-if="search[tabPane.type].isChildren.adv.badgeList" :badge="search[tabPane.type].isChildren.adv.badgeList" @removeBadge="removeBadge"></advSchBadge>
        </template>
      </search>
    </template>
    <template slot="pagination">
      <pagination
        :small="search[activeName].pagination.small"
        :currentPage="currentPage"
        :count="count"
        :type="type"
        :tabType="activeName"
        @turnPage="turnPage"
        :totalPage="totalPage"
      >
      </pagination>
    </template>
    <template v-for="tabPane in tabPanes" :slot="'cardList_'+tabPane.type">
      <question-card
              :cardList="cardList"
              :count="count"
              :type="type"
              :tabType="tabPane.type"
              v-if="tabPane.type===activeName"
      >
      </question-card>
    </template>
  </card-group-solt>
</template>
<script>
  import CardGroupSolt from 'components/public-modules/card'
  import QuestionCard from './QuestionCard.vue'
  import Search from '../../public-modules/card/search'
  import Select from '../../public-modules/card/search/Select'
  import InputSearch from '../../public-modules/card/search/InputSearch'
  import DropdownMenu from '../../public-modules/card/search/DropdownMenu.vue'
  import AdvancedSearch from '../../public-modules/card/search/AdvancedSearch'
  import Pagination from '../../public-modules/card/Pagination'
  import AdvSchBadge from '../../public-modules/card/search/AdvSchBadge'
  import { deepClone, getFormatDateTime } from '../../../utils/m7Utils'
  import { sortCustomFields, showFieldDesc } from '../../../utils/customerUtils.js'
  export default {
    name: 'CustCardGroup',
    data () {
      return {
        activeName: this.$route.params.tabType || 'customer_my',
        type: 'customer',
        tabPanes: [
          {name: '我的客户', type: 'customer_my'},
          {name: '联系计划', type: 'customer_plan'},
          {name: '全部客户', type: 'customer_all'}
        ],
        search: {
          isSearch: false,
          placeHolder: this.$t('customer.enterNameOrPhoneForQuery'),
          customer_my: {
            pagination: {
              small: true,
              currentPage: 1
            },
            show: true,
            isChildren: {
              lastQuery: null,
              rel: true,
              select: [],
              nomal: true,
              nomalForm: { value: '', query: '' },
              adv: {
                form: { categoryId: null, status: null, name: null, phone: null, actionType: null, custsource1: null, province: null, city: null, lastUpdateTime: null, createTime: null, batchNo: null, notifyTime: null, owner: null, custom: {} },
                advSearchOptions: {
                  localed: [],
                  custom: []
                },
                badgeList: {}
              }
            }
          },
          customer_plan: {
            pagination: {
              small: true,
              currentPage: 1
            },
            show: true,
            isChildren: {
              lastQuery: null,
              rel: true,
              select: [],
              nomal: true,
              nomalForm: { value: '', query: '' },
              adv: {
                form: { categoryId: null, status: null, name: null, phone: null, actionType: null, custsource1: null, province: null, city: null, lastUpdateTime: null, createTime: null, batchNo: null, notifyTime: null, owner: null, custom: {} },
                advSearchOptions: {
                  localed: [],
                  custom: []
                },
                badgeList: {}
              }
            }
          },
          customer_all: {
            pagination: {
              small: true,
              currentPage: 1
            },
            show: true,
            isChildren: {
              lastQuery: null,
              rel: true,
              select: [],
              nomal: true,
              nomalForm: { value: '', query: '' },
              adv: {
                form: { categoryId: null, status: null, name: null, phone: null, actionType: null, custsource1: null, province: null, city: null, lastUpdateTime: null, createTime: null, batchNo: null, notifyTime: null, owner: null, custom: {} },
                advSearchOptions: {
                  localed: [],
                  custom: []
                }
              },
              badgeList: {}
            }
          }
        },
        card: {
          call: {
            count: ''
          },
          myCall: {
            count: ''
          },
          allCall: {
            count: ''
          }
        }
      }
    },
    components: {
      QuestionCard,
      Search,
      'v-select': Select,
      CardGroupSolt,
      InputSearch,
      DropdownMenu,
      AdvancedSearch,
      Pagination,
      AdvSchBadge
    },
    beforeMount () {
      let queryData = {
        menu: this.activeName,
        page: 1,
        limit: 10
      }
      this.search[this.activeName].isChildren.lastQuery = queryData

      getCustList(this.$store, this.activeName, queryData).then(() => {
        this.loading = false
      })

      // 快捷搜索 - select
      Promise.all([
        this.$store.dispatch('getCache', { type: 'custTmpls' }),
        this.$store.dispatch('getCache', { type: 'quickSearchTmpls' })
      ]).then(([custTmpls, quickSearchTmpls]) => {
        let custTmpl = custTmpls[0]
        this.tabPanes.forEach(tabPane => {
          let quickSelect = [{ label: this.$t('public.all'), value: '' }]
          if (tabPane.type === 'customer_plan') {
            quickSelect.push({ label: this.$t('customer.todayContactPlan'), value: 'totalNotify' })
          }
          // 客户状态
          for (let key in custTmpl.status) {
            quickSelect.push({ label: custTmpl.status[key], value: key })
          }
          // 自定义快捷搜索
          quickSearchTmpls.forEach(quickSearchTmpl => {
            if (quickSearchTmpl.menu === tabPane.type) {
              quickSelect.push({ label: quickSearchTmpl.kName, value: quickSearchTmpl.query })
            }
          })
          this.search[tabPane.type].isChildren.select = quickSelect
        })
      })

      // 高级搜索
      Promise.all([
        this.$store.dispatch('getCache', { type: 'custCategorys' }),
        this.$store.dispatch('getCache', { type: 'custTmpls' })
      ]).then(([custCategorysCache, custTmpls]) => {
        let custTmpl = custTmpls[0]
        let statuses = [{ label: this.$t('public.all'), value: '' }]
        for (let key in custTmpl.status) {
          statuses.push({ label: custTmpl.status[key], value: key })
        }
        let sources = [{ label: this.$t('public.all'), value: '' }, ...custTmpl.source.map(source => ({ label: source.name, value: source.key }))]
        let custCategorys = [{ label: this.$t('public.all'), value: '' }, ...custCategorysCache.map(category => ({ label: category.cName, value: category._id }))]

        let localedOptions = [
          { label: '公海来源', name: 'categoryId', inputType: 'select', data: custCategorys },
          { label: '客户状态', name: 'status', inputType: 'select', data: statuses },
          { label: '客户名称', name: 'name', inputType: 'input' },
          { label: '客户电话', name: 'phone', inputType: 'input' },
          { label: '建立联系计划', name: 'actionType', inputType: 'checkbox', data: [{ label: '是', name: 'actionType', value: 'date' }] },
          { label: '数据来源', name: 'custsource1', inputType: 'select', data: sources },
          { label: '省/市', inputType: 'area', provinceName: 'province', provinceValue: this.search[this.activeName].isChildren.adv.form.province, cityName: 'city', cityValue: this.search[this.activeName].isChildren.adv.form.city },
          { label: '更新时间', name: 'lastUpdateTime', inputType: 'time' },
          { label: '创建时间', name: 'createTime', inputType: 'time' },
          { label: '联系时间', name: 'notifyTime', inputType: 'time' },
          { label: '导入批次', name: 'batchNo', inputType: 'input' }
        ]

        let isFieldAdded = (fieldName) => fieldName === 'province' || fieldName === 'city' || fieldName === 'name' || fieldName === 'phone'
        custTmpl.stable_fields.forEach(stableField => {
          if (stableField.search && !isFieldAdded(stableField.name)) {
            localedOptions.push({ label: stableField.value, name: stableField.name, inputType: 'input' })
          }
        })

        let customOptions = []
        let customForm = {}
        let sortedCustomFields = sortCustomFields(custTmpl.custom_fields)
        sortedCustomFields.forEach(customField => {
          let option = { label: customField.name, name: customField._id }
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
              option.data.push({ label: customField.choices[key], value: key })
            }
          } else if (customField.type === 'checkbox' || customField.type === 'radio') {
            option.inputType = customField.type
            option.data = []
            for (let key in customField.choices) {
              option.data.push({ label: customField.choices[key], value: key })
            }
          } else {
            option.inputType = customField.type
          }

          customOptions.push(option)
          if (customField.type === 'checkbox') {
            customForm[customField._id] = []
          } else {
            customForm[customField._id] = null
          }
        })

        this.tabPanes.forEach(tabPane => {
          let localedOptionsCopy = deepClone(localedOptions)
          if (tabPane.type === 'customer_all') {
            localedOptionsCopy[10] = { label: '所属范围', name: 'owner', inputType: 'select', data: [] }
          }

          this.search[tabPane.type].isChildren.adv.advSearchOptions.localed = localedOptionsCopy
          this.search[tabPane.type].isChildren.adv.advSearchOptions.custom = deepClone(customOptions)
          this.search[tabPane.type].isChildren.adv.form.custom = deepClone(customForm)
        })
      })
    },
    computed: {
      cardList () {
        return this.$store.state[this.type][this.type + 'List'][this.activeName].list
      },
      count () {
        return this.$store.state[this.type][this.type + 'List'][this.activeName].count
      },
      currentPage () {
        return this.search[this.activeName].pagination.currentPage
      },
      totalPage () {
        return Math.ceil(this.$store.state[this.type][this.type + 'List'][this.activeName].count / 10) || 0
      },
      refreshLeftcard () {
        return this.$store.state.customer.transCache.refreshLeft
      }
    },
    watch: {
      refreshLeftcard () {
        this.advSearch(true)
      }
    },
    methods: {
      // 清空搜索条件
      clearSearchQuery () {
        let currentTab = this.search[this.activeName]
        currentTab.pagination.currentPage = 1
        for (let key in currentTab.isChildren.adv.form) {
          if (key !== 'custom') {
            currentTab.isChildren.adv.form[key] = null
          } else {
            for (let key in currentTab.isChildren.adv.form.custom) {
              currentTab.isChildren.adv.form.custom[key] = null
            }
          }
        }
        for (let key in this.search[this.activeName].isChildren.nomalForm) {
          this.search[this.activeName].isChildren.nomalForm[key] = null
        }
        this.search[this.activeName].isChildren.lastQuery = null
      },
      changeTab (tabName) {
        this.activeName = tabName
        this.loading = true
        this.search.isSearch = true
        this.clearSearchQuery()
        let queryData = {
          menu: tabName,
          page: 1,
          limit: 10
        }
        this.search[this.activeName].isChildren.lastQuery = queryData
        getCustList(this.$store, this.activeName, queryData).then(() => {
          this.loading = false
        })
      },
      turnPage (pageNum) {
        if (this.search.isSearch && pageNum < 2) {
          this.search.isSearch = false
          return
        }
        this.search.isSearch = false
        this.loading = true

        let queryData = Object.assign({}, this.search[this.activeName].isChildren.lastQuery, { page: pageNum })
        getCustList(this.$store, this.activeName, queryData).then(() => {
          this.loading = false
          this.search[this.activeName].pagination.currentPage = pageNum
        })
      },
      // 快捷搜索 - select
      handlerQuickSelect (value) {
        this.loading = true
        this.search.isSearch = true
        this.search[this.activeName].isChildren.nomalForm.value = value
        let query = {
          menu: this.activeName,
          page: 1,
          limit: 10
        }

        if (value) {
          Object.assign(query, (typeof value === 'object') ? value : { status: value })
        }
        if (this.search[this.activeName].isChildren.nomalForm.query) {
          query.combox = this.search[this.activeName].isChildren.nomalForm.query
        }

        this.search[this.activeName].isChildren.lastQuery = query
        getCustList(this.$store, this.activeName, query).then(() => {
          this.loading = false
          this.search[this.activeName].pagination.currentPage = 1
        })
      },
      // 快捷搜索 - input
      handlerQuickSearch (value) {
        this.loading = true
        this.search.isSearch = true
        this.search[this.activeName].isChildren.nomalForm.query = value
        let query = {
          menu: this.activeName,
          page: 1,
          limit: 10
        }
        if (value) {
          query.combox = value
        }
        if (this.search[this.activeName].isChildren.nomalForm.value) {
          let selectValue = this.search[this.activeName].isChildren.nomalForm.value
          Object.assign(query, (typeof selectValue === 'object') ? selectValue : { status: selectValue })
        }

        this.search[this.activeName].isChildren.lastQuery = query
        getCustList(this.$store, this.activeName, query).then(() => {
          this.loading = false
          this.search[this.activeName].pagination.currentPage = 1
        })
      },
      handlerSelectChange (selectObj) {
        let selectName = selectObj.selectName
        let selectValue = selectObj.selectValue

        if (selectName === 'province') {
          this.search[this.activeName].isChildren.adv.form.province = selectValue
        }

        if (selectName === 'city') {
          this.search[this.activeName].isChildren.adv.form.city = selectValue
        }
      },
      advSearch (reset) {
        this.loading = true
        this.search.initSearch = true
        if (reset) {
          this.clearSearchQuery()
        }
        let form = this.search[this.activeName].isChildren.adv.form
        let searchQuery = deepClone(form)
        let custom = searchQuery.custom
        let createTime = form.createTime
        let lastUpdateTime = form.lastUpdateTime
        let notifyTime = form.notifyTime

        // 电话
        if (searchQuery.phone) {
          let tel = searchQuery.phone
          searchQuery['phone.tel'] = tel
          delete searchQuery.phone
        }

        // 创建时间
        if (createTime) {
          if (createTime[0]) {
            searchQuery.createTime_begin_date = getFormatDateTime(createTime[0])
          }
          if (createTime[1]) {
            searchQuery.createTime_end_date = getFormatDateTime(createTime[1])
          }
          delete searchQuery.createTime
        }

        // 更新时间
        if (lastUpdateTime) {
          if (lastUpdateTime[0]) {
            searchQuery.lastUpdateTime_begin_date = getFormatDateTime(lastUpdateTime[0]).substring(0, 16)
          }
          if (lastUpdateTime[1]) {
            searchQuery.lastUpdateTime_end_date = getFormatDateTime(lastUpdateTime[1]).substring(0, 16)
          }
          delete searchQuery.lastUpdateTime
        }

        // 联系时间
        if (notifyTime) {
          if (notifyTime[0]) {
            searchQuery.notifyTime_begin_date = getFormatDateTime(notifyTime[0])
          }
          if (notifyTime[1]) {
            searchQuery.notifyTime_end_date = getFormatDateTime(notifyTime[1])
          }
          delete searchQuery.notifyTime
        }

        let tempObj = {}
        for (let key in searchQuery) {
          if (searchQuery[key] || (searchQuery[key] && searchQuery[key].length !== 0)) {
            tempObj[key] = showFieldDesc(key, searchQuery[key])
            window.alert(key + 'vvvv' + searchQuery[key] + showFieldDesc(key, searchQuery[key]))
          }
        }
        // 自定义字段
        for (let key in custom) {
          searchQuery[key] = custom[key]
        }

        // 自定义字段回显
        console.log('let tempArr = Object.assign(tempArr, advancedSearchBack(custom)')
        delete searchQuery.custom
        this.search[this.activeName].isChildren.adv.badgeList = tempObj
        console.debug(tempObj)

        Object.assign(searchQuery, {
          menu: this.activeName,
          page: 1,
          limit: 10
        })
        getCustList(this.$store, this.activeName, searchQuery).then(() => {
          this.loading = false
          this.search[this.activeName].pagination.currentPage = 1
        })
      },
      removeBadge () {
        this.advSearch(true)
      }
    }
  }
  // 获取客户卡片数据
  function getCustList (store, tabName, query) {
    return store.dispatch('queryCustomerList', query)
  }
</script>
<style lang="stylus" scoped>
</style>
