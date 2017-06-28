<template>
  <card-group-solt
  @handleClick="changeTab"
  :activeName="activeName"
  :tabPanes="tabPanes"
  :cardLoading="loading">
    <template v-for="tabPane in tabPanes" :slot="'search_'+tabPane.type">
      <search :type="tabPane.type">
        <template :slot="'select_'+tabPane.type">
          <v-select :selectOptions="search[tabPane.type].isChildren.select" :form="search[tabPane.type].isChildren.nomalForm" @quickSelect="handlerQuickSelect"></v-select>
        </template>
        <template :slot="'inputSearch_'+tabPane.type">
          <input-search :placeHolder="search.placeHolder" :form="search[tabPane.type].isChildren.nomalForm" @quickSearch="handlerQuickSearch"></input-search>
        </template>
        <template :slot="'advancedSearch_'+tabPane.type">
          <advanced-search
            v-if="search[tabPane.type].isChildren.adv"
            :type="type" :adv="search[tabPane.type].isChildren.adv"
            @selectChange="handlerSelectChange"
            @advSearch="advSearch">
          </advanced-search>
        </template>
        <template :slot="'dropdownSelect_'+tabPane.type">
          <dropdown-menu :newEmptySeat="newEmptySeat"></dropdown-menu>
        </template>
        <template :slot="'advSchBadge_'+tabPane.type">
          <advSchBadge v-if="search[tabPane.type].isChildren.adv.badgeList" :badge="search[tabPane.type].isChildren.adv.badgeList" @removeBadge="removeBadge"></advSchBadge>
        </template>
        <template :slot="'CustRefresh_'+tabPane.type">
          <refresh v-if="search[tabPane.type].isChildren.refresh" @refresh="handleRefresh"></refresh>
        </template>
      </search>
    </template>

    <template v-for="tabPane in tabPanes" :slot="'cardList_'+tabPane.type">
      <customer-card
              :cardList="cardList"
              :count="count"
              :type="type"
              :tabType="tabPane.type"
              :clearChecked="clearChecked"
              :condition="search[activeName].isChildren.lastQuery"
              v-if="tabPane.type===activeName"
              @changeCardItem="changeCardItem"
      >
      </customer-card>
    </template>
    <template slot="pagination">
      <pagination
        :customerShow="true"
        :small="true"
        :currentPage="currentPage"
        :count="count"
        :type="type"
        :tabType="activeName"
        @turnPage="turnPage"
        :totalPage="totalPage"
      >
      </pagination>
    </template>
  </card-group-solt>

</template>
<script>
  import CardGroupSolt from 'components/public-modules/card'
  import CustomerCard from './CustomerCard.vue'
  import Search from '../../public-modules/card/search'
  import Select from '../../public-modules/card/search/Select'
  import InputSearch from '../../public-modules/card/search/InputSearch'
  import DropdownMenu from '../../public-modules/card/search/DropdownMenu.vue'
  import AdvancedSearch from '../../public-modules/card/search/AdvancedSearch'
  import Pagination from '../../public-modules/card/Pagination'
  import Refresh from '../../ui-modules/icon/Refresh'
  import AdvSchBadge from '../../public-modules/card/search/AdvSchBadge'
  import { deepClone, getFormatDateTime } from '../../../utils/m7Utils'
  import { sortCustomFields } from '../../../utils/customerUtils.js'
  export default {
    name: 'CustCardGroup',
    data () {
      return {
        activeName: this.$route.params.tabType || 'customer_my',
        type: 'customer',
        clearChecked: '',
        newEmptySeat: false,
        tabPanes: [
          {name: this.$t('customer.customerMy'), type: 'customer_my'},
          {name: this.$t('customer.customerPlan'), type: 'customer_plan'},
          {name: this.$t('customer.customerAll'), type: 'customer_all'}
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
              refresh: true,
              nomalForm: { value: '', query: '' },
              adv: {
                form: { categoryId: null, status: null, name: null, phone: null, actionType: [], custsource1: null, province: null, city: null, lastUpdateTime: null, createTime: null, batchNo: null, notifyTime: null, custom: {} },
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
              refresh: true,
              nomalForm: { value: '', query: '' },
              adv: {
                form: { categoryId: null, status: null, name: null, phone: null, actionType: [], custsource1: null, province: null, city: null, lastUpdateTime: null, createTime: null, batchNo: null, notifyTime: null, custom: {} },
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
              refresh: true,
              nomalForm: { value: '', query: '' },
              adv: {
                form: { categoryId: null, status: null, name: null, phone: null, actionType: [], custsource1: null, province: null, city: null, lastUpdateTime: null, createTime: null, batchNo: null, notifyTime: null, ownercom: null, owner: null, ownerdep: null, custom: {} },
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
        },
        loading: true
      }
    },
    components: {
      CustomerCard,
      Search,
      'v-select': Select,
      CardGroupSolt,
      InputSearch,
      DropdownMenu,
      AdvancedSearch,
      Refresh,
      Pagination,
      AdvSchBadge
    },
    beforeMount () {
      let queryData = {
        menu: this.activeName,
        page: 1,
        limit: 10
      }
      // 当从工作台第一次跳转过来时 ，使用相关客户id去查询客户列表
      if (this.$route.query.custName) {
        queryData._id = this.$route.params.id
      }
      this.search[this.activeName].isChildren.lastQuery = queryData

      getCustList(this.$store, this.activeName, queryData).then(() => {
        this.loading = false
      })

      // 快捷搜索初始化 - select
      this.quickSearchInit()
      // 高级搜索
      this.advSearchInit()
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
      // 当值发生改变刷新左侧列表
      refreshLeftcard () {
        return this.$store.state.customer.transCache.refreshLeft
      },
      quickSearchList () {
        return this.$store.state.customer.quickSearchList
      }
    },
    watch: {
      $route (to, from) {
        if (to.params.tabType && from.path === '/index/customer/add') {
          this.activeName = to.path.split('/')[3]
          let query = {
            menu: this.activeName,
            page: 1,
            limit: 10
          }
          this.search[this.activeName].isChildren.lastQuery = query
          this.loading = true
          getCustList(this.$store, this.activeName, query).then(() => {
            this.loading = false
          })
        }
      },
      refreshLeftcard () {
        if (this.$route.query.custName) {
          // 工作台跳转客户刷新card
          this.activeName = this.$route.params.tabType
          this.handlerQuickSearch(this.$route.query.custName)
          this.search[this.activeName].isChildren.nomalForm.query = ''
        } else {
          let searchQuery = this.search[this.activeName].isChildren.lastQuery
          getCustList(this.$store, this.activeName, searchQuery).then(() => {
            this.loading = false
          })
        }
      },
      quickSearchList: {
        handler: function (current) {
          // 快捷搜索 - select
          this.$store.dispatch('getCache', { type: 'custTmpls' }).then((custTmpls) => {
            if (custTmpls.length <= 0) { // 新开的账户，没有数据
              this.$data.newEmptySeat = true
              return
            } else {
              this.$data.newEmptySeat = false
            }
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
              current.list.forEach(quickSearchTmpl => {
                if (quickSearchTmpl.menu === tabPane.type) {
                  quickSelect.push({ label: quickSearchTmpl.kName, value: quickSearchTmpl.query })
                }
              })
              this.search[tabPane.type].isChildren.select = quickSelect
            })
          })
        },
        deep: true
      }
    },
    methods: {
      changeCardItem () {
        this.$emit('changeCardItem')
      },
      handleRefresh () {
        this.advSearch()
      },
      // 清空搜索条件
      clearSearchQuery () {
        let currentTab = this.search[this.activeName]
        currentTab.pagination.currentPage = 1
        for (let key in currentTab.isChildren.adv.form) {
          if (key !== 'custom') {
            if (Array.isArray(currentTab.isChildren.adv.form[key])) {
              currentTab.isChildren.adv.form[key] = []
            } else {
              currentTab.isChildren.adv.form[key] = null
            }
          } else {
            for (let key in currentTab.isChildren.adv.form.custom) {
              if (Array.isArray(currentTab.isChildren.adv.form.custom[key])) {
                currentTab.isChildren.adv.form.custom[key] = []
              } else {
                currentTab.isChildren.adv.form.custom[key] = null
              }
            }
          }
        }
        this.search[this.activeName].isChildren.adv.badgeList = null
        for (let key in this.search[this.activeName].isChildren.nomalForm) {
          this.search[this.activeName].isChildren.nomalForm[key] = null
        }
        this.search[this.activeName].isChildren.lastQuery = null
      },
      // 切换tab 我的客户 联系计划 全部模块时更新相关tab的展示列表
      changeTab (tabName) {
        this.activeName = tabName
        this.loading = true
        this.search.isSearch = true
        // 清空搜索条件
        this.clearSearchQuery()
        let queryData = {
          menu: tabName,
          page: 1,
          limit: 10
        }
        this.search[this.activeName].isChildren.lastQuery = queryData
        // 请求客户列表
        getCustList(this.$store, this.activeName, queryData).then(() => {
          this.loading = false
        })
      },
      // 卡片列表翻页刷新列表
      turnPage (pageNum) {
        if (this.search.isSearch && pageNum < 2) {
          this.search.isSearch = false
          return
        }
        this.search.isSearch = false
        this.loading = true

        let queryData = Object.assign({}, this.search[this.activeName].isChildren.lastQuery, { page: pageNum })
        this.search[this.activeName].pagination.currentPage = pageNum
        getCustList(this.$store, this.activeName, queryData).then(() => {
          this.loading = false
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
        for (let key in query) {
          if (query[key] instanceof Object && !(query[key] instanceof Array)) {
            let date = {}
            for (let datekey in query[key]) {
              if (datekey === 'JGx0') {
                date['$lt'] = query[key][datekey]
              } else if (datekey === 'JGd0') {
                date['$gt'] = query[key][datekey]
              }
            }
            query[key] = date
          }
        }
        this.search[this.activeName].pagination.currentPage = 1
        this.search[this.activeName].isChildren.lastQuery = query
        getCustList(this.$store, this.activeName, query).then(() => {
          this.loading = false
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
          if (this.$route.query.custName) {
            query._id = this.$route.path.split('/')[4].split('?')[0]
          } else {
            query.combox = value
          }
        }
        if (this.search[this.activeName].isChildren.nomalForm.value) {
          let selectValue = this.search[this.activeName].isChildren.nomalForm.value
          Object.assign(query, (typeof selectValue === 'object') ? selectValue : { status: selectValue })
        }
        this.search[this.activeName].pagination.currentPage = 1
        this.search[this.activeName].isChildren.lastQuery = query
        getCustList(this.$store, this.activeName, query).then(() => {
          this.loading = false
        })
      },
      /**
       * [handlerSelectChange description]
       * @param  {[type]} selectObj [
       * selectName 传给后台的属性名
       * selectValue.value  选中的值 => 传给后台
       * selectValue.label 选中的label =>回显的字符串
       * ]
       * @return {[type]}           [description]
       */
      handlerSelectChange (selectObj) {
        let selectName = selectObj.selectName
        let selectValue = selectObj.selectValue

        // 省市的数据拼接
        if (selectName === 'province' || selectName === 'city') {
          this.search[this.activeName].isChildren.adv.form[selectName] = selectValue.value ? `${selectValue.value}__${selectValue.label}` : ''
        }

        // 公海的数据处理
        if (selectName === 'ownercom' || selectName === 'owner' || selectName === 'ownerdep') {
          this.search[this.activeName].isChildren.adv.form.ownercom = null
          this.search[this.activeName].isChildren.adv.form.owner = null
          this.search[this.activeName].isChildren.adv.form.ownerdep = null
          this.search[this.activeName].isChildren.adv.form[selectName] = selectValue
        }
      },
      /**
       * [advSearchBack 高级搜索回显]
       * @param  {[type]} searchQuery [需要回显的参数]
       * @return {[type]}             [description]
       */
      advSearchBack (searchQuery) {
        let tmpObj = {}
        for (let key in searchQuery) {
          let value = searchQuery[key]
          if (value && typeof value === 'string') {
            if (value.match(/__/)) {
              let valSplit = value.split('__')
              tmpObj[key] = valSplit[1]
              searchQuery[key] = valSplit[0]
            } else {
              tmpObj[key] = value
            }
          }
          if (value && Array.isArray(value) && value.length > 0) {
            let tmpArr = []
            let tmpArr2 = []
            for (let i = 0; i < value.length; i++) {
              let valSplit = value[i].split('__')
              tmpArr.push(valSplit[1])
              tmpArr2.push(valSplit[0])
            }
            tmpObj[key] = tmpArr.join(' ')
            searchQuery[key] = tmpArr2
          }
        }

        return tmpObj
      },
      /**
       * [advSearch 高级搜索]
       * @param  {[type]} reset [判断是否重置高级搜索参数]
       * @return {[type]}       [description]
       */
      advSearch (reset) {
        this.loading = true
        this.search.initSearch = true
        if (reset) {
          this.clearSearchQuery()
        }
        let form = this.search[this.activeName].isChildren.adv.form
        let searchQuery = deepClone(form)
        // 处理deepClone导致Date对象丢失
        for (let key in form.custom) {
          if (form.custom[key] instanceof Date) {
            searchQuery.custom[key] = new Date(form.custom[key].getTime())
          }
        }
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

        // 是否建立联系计划
        if (searchQuery.actionType.length > 0) {
          searchQuery.actionType = searchQuery.actionType[0]
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

        // 自定义字段
        for (let key in custom) {
          // 处理自定义字段中的日期
          if (custom[key] instanceof Date) {
            searchQuery[key] = getFormatDateTime(custom[key]).split(' ')[0]
            continue
          } else {
            searchQuery[key] = custom[key]
          }
        }
        delete searchQuery.custom

        let tempObj = this.advSearchBack(searchQuery)
        this.search[this.activeName].isChildren.adv.badgeList = tempObj

        Object.assign(searchQuery, {
          menu: this.activeName,
          page: 1,
          limit: 10
        })
        this.search[this.activeName].pagination.currentPage = searchQuery.page
        this.search[this.activeName].isChildren.lastQuery = searchQuery
        getCustList(this.$store, this.activeName, searchQuery).then(() => {
          this.loading = false
        })
      },
      /**
       * [removeBadge description]
       * 移除高级搜索的回显项
       * @return {[type]} [description]
       */
      removeBadge () {
        this.advSearch(true)
        this.clearChecked = Math.random() + ''
      },
      // 高级搜索初始化数据
      advSearchInit () {
        Promise.all([
          this.$store.dispatch('getCache', { type: 'custCategorys' }),
          this.$store.dispatch('getCache', { type: 'custTmpls' })
        ]).then(([custCategorysCache, custTmpls]) => {
          if (custTmpls.length <= 0) { // 新开的账户，没有数据
            this.$data.newEmptySeat = true
            return
          } else {
            this.$data.newEmptySeat = false
          }
          let custTmpl = custTmpls[0]
          let statuses = [{ label: this.$t('public.all'), value: '' }]
          for (let key in custTmpl.status) {
            statuses.push({ label: custTmpl.status[key], value: `${key}__${custTmpl.status[key]}` })
          }
          let sources = [{ label: this.$t('public.all'), value: '' }, ...custTmpl.source.map(source => ({ label: source.name, value: `${source.key}__${source.name}` }))]
          let custCategorys = [{ label: this.$t('public.all'), value: '' }, ...custCategorysCache.map(category => ({ label: category.cName, value: `${category._id}__${category.cName}` }))]

          let localedOptions = [
            { label: this.$t('customer.categorySource'), name: 'categoryId', inputType: 'select', data: custCategorys },
            { label: this.$t('customer.custStatus'), name: 'status', inputType: 'select', data: statuses },
            { label: this.$t('business.customerName'), name: 'name', inputType: 'input' },
            { label: this.$t('customer.custCall'), name: 'phone', inputType: 'input' },
            { label: this.$t('customer.hasContactPlan'), name: 'actionType', inputType: 'checkbox', data: [{ label: this.$t('public.yes'), value: `date__${this.$t('customer.hasContactPlan')}` }] },
            { label: this.$t('customer.dataSource'), name: 'custsource1', inputType: 'select', data: sources },
            { label: this.$t('public.provinceCity'), inputType: 'area', provinceName: 'province', provinceValue: this.search[this.activeName].isChildren.adv.form.province, cityName: 'city', cityValue: this.search[this.activeName].isChildren.adv.form.city },
            { label: this.$t('km.updateTime'), name: 'lastUpdateTime', inputType: 'time' },
            { label: this.$t('public.createTime'), name: 'createTime', inputType: 'time' },
            { label: this.$t('customer.contactPlan.contactPlanTime'), name: 'notifyTime', inputType: 'time' },
            { label: this.$t('customer.importBatch'), name: 'batchNo', inputType: 'input' }
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
                option.data.push({ label: customField.choices[key], value: `${key}__${customField.choices[key]}` })
              }
            } else if (customField.type === 'checkbox' || customField.type === 'radio') {
              option.inputType = customField.type
              option.data = []
              for (let key in customField.choices) {
                option.data.push({ label: customField.choices[key], value: `${key}__${customField.choices[key]}` })
              }
            } else {
              option.inputType = customField.type
            }

            customOptions.push(option)
            if (customField.type === 'checkbox') {
              customForm[customField._id] = []
            } else if (customField.type === 'date') {
              customForm[customField._id] = ''
            } else {
              customForm[customField._id] = null
            }
          })

          this.tabPanes.forEach(tabPane => {
            let localedOptionsCopy = deepClone(localedOptions)
            if (tabPane.type === 'customer_all') {
              localedOptionsCopy[10] = { label: this.$t('customer.owner'), name: 'owner', inputType: 'owner' }
            }

            this.search[tabPane.type].isChildren.adv.advSearchOptions.localed = localedOptionsCopy
            this.search[tabPane.type].isChildren.adv.advSearchOptions.custom = deepClone(customOptions)
            this.search[tabPane.type].isChildren.adv.form.custom = deepClone(customForm)
          })
        })
      },
      // 快捷搜索初始化模块
      quickSearchInit () {
        Promise.all([
          this.$store.dispatch('getCache', { type: 'custTmpls' }),
          this.$store.dispatch('getCache', { type: 'quickSearchTmpls' })
        ]).then(([custTmpls, quickSearchTmpls]) => {
          if (custTmpls.length <= 0) { // 新开的账户，没有数据
            this.$data.newEmptySeat = true
            return
          } else {
            this.$data.newEmptySeat = false
          }
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
      }
    }
  }
  /**
   * /
   * @param  {[type]} store   [vue store模块]
   * @param  {[type]} tabName [对应卡片模块 1我的客户 2联系计划 3全部]
   * @param  {[type]} query   [description]
   * @return {[type]}         [description]
   */
  function getCustList (store, tabName, query) {
    return store.dispatch('queryCustomerList', query)
  }
</script>
