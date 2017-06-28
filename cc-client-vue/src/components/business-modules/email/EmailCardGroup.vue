<template>
  <card-group-solt
          @handleClick="changeTab"
          :activeName="activeName"
          :tabPanes="tabPanes"
          :cardLoading="loading"
    >
    <template v-for="tabPane in tabPanes" :slot="'search_'+tabPane.type">
      <search v-if="search[tabPane.type].show" :type="tabPane.type">
        <template v-if="search[tabPane.type].isChildren.select" :slot="'select_'+tabPane.type">
          <v-select :selectOptions="mailCategories" @quickSelect="handlerQuickSelect"
                    :form="search[tabPane.type].isChildren.nomalForm"></v-select>
        </template>
        <template v-if="search[tabPane.type].isChildren.nomal" :slot="'inputSearch_'+tabPane.type">
          <input-search :placeHolder="$t('email.pleaseEnter')" @quickSearch="normalSearch"
                        :form="search[tabPane.type].isChildren.nomalForm"></input-search>
        </template>
        <template v-if="search[tabPane.type].isChildren.adv" :slot="'advancedSearch_'+tabPane.type">
          <advanced-search v-if="search[tabPane.type].isChildren.adv" :adv="search[tabPane.type].isChildren.adv"
                           @selectChange="handlerSelectChange" @advSearch="advSearch"></advanced-search>
        </template>
        <template :slot="'advSchBadge_'+tabPane.type">
          <advSchBadge v-if="search[tabPane.type].isChildren.adv.badgeList"
                       :badge="search[tabPane.type].isChildren.adv.badgeList" @removeBadge="removeBadge"></advSchBadge>
        </template>
        <template :slot="'refresh_'+tabPane.type">
          <refresh v-if="search[tabPane.type].isChildren.refresh" @refresh="handleRefresh"></refresh>
        </template>
      </search>
    </template>
    <template slot="pagination" v-if="activeName==='email_all'">
      <pagination
              :customerShow="true"
              :small="search[activeName].pagination.small"
              :currentPage="search[activeName].pagination.currentPage"
              :count="count"
              :type="type"
              :tabType="activeName"
              :totalPage="totalPage"
              @turnPage="turnPage"
              :clearChecked="clearChecked"
      >
      </pagination>
    </template>
    <template v-for="tabPane in tabPanes" :slot="'cardList_'+tabPane.type">
      <email-card
              :cardList="cardList"
              :count="count"
              :type="type"
              :tabType="tabPane.type"
              v-if="!loading"
              @changeCardItem="changeCardItem"
      >
      </email-card>
    </template>
  </card-group-solt>
</template>
<script>
  import CardGroupSolt from 'components/public-modules/card'
  import EmailCard from './EmailCard'
  import Search from '../../public-modules/card/search'
  import Select from '../../public-modules/card/search/Select'
  import InputSearch from '../../public-modules/card/search/InputSearch'
  import AdvancedSearch from '../../public-modules/card/search/AdvancedSearch'
  import AdvSchBadge from '../../public-modules/card/search/AdvSchBadge'
  import Pagination from '../../public-modules/card/Pagination'
  import Refresh from '../../ui-modules/icon/Refresh'
  import {deepClone, getFormatDateTime} from '../../../utils/m7Utils'
  export default {
    name: 'EmailCardGroup',
    props: {
      currentTabType: String
    },
    data () {
      return {
        loading: true,
        activeName: this.$route.params.tabType || 'email_todo',
        type: 'email',
        search: {
          isAdvSearch: false, // 是否在高级搜索
          isSearch: false,
          mailCategorys: [],
          serviceEmails: [],
          email_todo: {
            searchCard: 'etSearchCard',
            show: false,
            pagination: {
              small: true,
              currentPage: 1
            },
            isChildren: {
              rel: false,
              select: [],
              nomal: true,
              adv: {},
              refresh: false
            }
          },
          email_all: {
            searchCard: 'eaSearchCard',
            show: true,
            pagination: {
              small: true,
              currentPage: 1
            },
            isChildren: {
              lastQuery: null,
              rel: false,
              select: [],
              nomal: true,
              nomalForm: {query: '', value: ''},
              refresh: true,
              adv: {
                form: {
                  fromAddr: '',
                  subject: '',
                  custName: '',
                  createTime: [],
                  lastReceiveTime: [],
                  toAddr: '',
                  category: '',
                  status: '',
                  ownercom: '',
                  agent: '',
                  ownerdep: ''
                },
                advSearchOptions: {
                  localed: []
                },
                badgeList: {}
              }
            }
          }
        }
      }
    },
    watch: {
      currentTabType: 'changeTabType'
    },
    beforeMount () {
      fetchMailList(this.$store, this.activeName, {idle: '', type: 'email_todo'}).then(() => {
        this.loading = false
      })

      // 高级搜索初始化
      Promise.all([
        this.$store.dispatch('getCache', {type: 'serviceEmails'}),
        this.$store.dispatch('getCache', {type: 'mailCategorys'})
      ]).then(([serviceEmails, mailCategorys]) => {
        let serviceEmailData = serviceEmails.map(serviceEmail => ({ label: serviceEmail.email, value: serviceEmail.email }))
        this.search.mailCategorys = mailCategorys
        let localedOptions = [
          {label: this.$t('email.customerEmailAddress'), name: 'fromAddr', inputType: 'input'},
          {label: this.$t('email.emailSubject'), name: 'subject', inputType: 'input'},
          {label: this.$t('business.customerName'), name: 'custName', inputType: 'input'},
          {label: this.$t('public.createTime'), name: 'createTime', inputType: 'time'},
          {label: this.$t('email.lastReceiveTime'), name: 'lastReceiveTime', inputType: 'time'},
          {label: this.$t('email.customerServiceMailbox'), name: 'toAddr', inputType: 'select', data: serviceEmailData},
          {label: this.$t('email.categorySelect'), name: 'category', inputType: 'select', data: []},
          {
            label: this.$t('public.state'),
            name: 'status',
            inputType: 'select',
            data: [
              {label: this.$t('public.all'), value: ''},
              {label: this.$t('public.solved'), value: `finish__${this.$t('public.solved')}`},
              {label: this.$t('email.emailTodo'), value: `deal__${this.$t('email.emailTodo')}`},
              {label: this.$t('webchat.webchatTodo'), value: `undeal__${this.$t('webchat.webchatTodo')}`}
            ]
          },
          {label: this.$t('business.master'), name: 'ownercom', inputType: 'owner'}
        ]

        this.search.email_all.isChildren.adv.advSearchOptions.localed = localedOptions
      })
    },
    computed: {
      cardList () {
        return this.$store.state[this.type][this.type + 'List'][this.activeName].list
      },
      count () {
        return this.$store.state[this.type][this.type + 'List'][this.activeName].count
      },
      totalPage () {
        return Math.ceil(this.$store.state[this.type][this.type + 'List'][this.activeName].count / 10) || 0
      },
      mailCategories () {
        let categoryList = this.search.mailCategorys || []
        let options = [{label: this.$t('public.all'), value: ''}]
        for (let i = 0; i < categoryList.length; i++) {
          options.push({label: categoryList[i].categoryName, value: categoryList[i]._id})
        }
        return options
      },
      tabPanes () {
        let todoNum = this.$store.state.email.todoNum
        if (todoNum > 99) {
          todoNum = '99+'
        }
        return [
          {name: this.$t('email.emailTodo') + todoNum, type: 'email_todo'},
          {name: this.$t('email.emailAll'), type: 'email_all'}
        ]
      }
    },
    methods: {
      changeCardItem () {
        this.$emit('changeCardItem')
      },
      changeTabType () {
        this.activeName = this.currentTabType
      },
      changeTab (tabName) {
        this.clearSearchQuery()
        this.activeName = tabName
        this.search.isSearch = true
        this.$router.push({path: '/index/email/'})
        if (this.activeName === 'email_todo' && this.$store.state.email.emailList.email_todo.init) {
          return
        }
        this.loading = true
        let queryData = {
          query: '',
          page: 1,
          limit: 10
        }
        this.search[this.activeName].isChildren.lastQuery = queryData
        fetchMailList(this.$store, this.activeName, queryData).then(() => {
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
        this.search[this.activeName].pagination.currentPage = pageNum
        let queryData = Object.assign({}, this.search[this.activeName].isChildren.lastQuery, { page: pageNum })
        fetchMailList(this.$store, this.activeName, queryData).then(() => {
          this.loading = false
        })
      },

      // 高级搜索相关
      handlerQuickSelect (value) {
        this.loading = true
        this.search.isSearch = true
        this.search[this.activeName].isChildren.nomalForm.value = value

        let formData = this.search[this.activeName].isChildren.nomalForm
        let queryData = deepClone({category: formData.value, query: formData.query})

        Object.assign(queryData, {
          page: 1,
          limit: 10,
          emailType: this.activeName
        })

        this.search[this.activeName].pagination.currentPage = 1
        this.search[this.activeName].isChildren.lastQuery = queryData
        fetchMailList(this.$store, this.activeName, queryData).then(() => {
          this.loading = false
        })
      },
      // 处理高级搜索中的下拉框改变
      handlerSelectChange (selectObj) {
        let selectName = selectObj.selectName
        let selectValue = selectObj.selectValue
        let currentTab = this.search[this.activeName]
//        this.search[this.activeName].isChildren.adv.badgeList = {} // 清除高级搜索项
        this.search.isAdvSearch = false
        if (selectName === 'owner' || selectName === 'ownercom' || selectName === 'ownerdep') {
          currentTab.isChildren.adv.form.ownercom = null
          currentTab.isChildren.adv.form.owner = null
          currentTab.isChildren.adv.form.ownerdep = null
          if (selectObj.selectName === 'owner') {
            currentTab.isChildren.adv.form.agent = selectObj.selectValue
          } else {
            currentTab.isChildren.adv.form[selectObj.selectName] = selectObj.selectValue
          }
        }
        if (selectName === 'toAddr') {
          let mailCategorys = this.search.mailCategorys || []
          let resultCategories = []
          for (let i = 0; i < mailCategorys.length; i++) {
            let category = mailCategorys[i]
            if (selectValue === category.relateMailAddr) {
              resultCategories.push({ label: category.categoryName, value: `${category._id}__${category.categoryName}` })
            }
          }
          currentTab.isChildren.adv.advSearchOptions.localed.forEach((item) => {
            if (item.name === 'category') {
              currentTab.isChildren.adv.form.category = []
              item.data = resultCategories
            }
          })
        }
      },
      // 搜索相关
      removeBadge () {
        this.advSearch(true)
      },
      advSearch (reset) {
        this.search.isSearch = true
        this.loading = true
        if (reset) {
          this.clearSearchQuery()
        }

        let form = this.search[this.activeName].isChildren.adv.form
        let searchQuery = deepClone(form)
        let createTime = form.createTime
        let lastReceiveTime = form.lastReceiveTime

        // 收发件人地址
        if (searchQuery.fromAddr) {
          searchQuery['from.addr'] = searchQuery.fromAddr
          delete searchQuery.fromAddr
        }
        if (searchQuery.toAddr) {
          searchQuery['to.addr'] = searchQuery.toAddr
          delete searchQuery.toAddr
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

        // 最后接受时间
        if (lastReceiveTime) {
          if (lastReceiveTime[0]) {
            searchQuery.lastReceiveTime_begin_date = getFormatDateTime(lastReceiveTime[0])
          }
          if (lastReceiveTime[1]) {
            searchQuery.lastReceiveTime_end_date = getFormatDateTime(lastReceiveTime[1])
          }
          delete searchQuery.lastReceiveTime
        }

        let tempObj = this.advSearchBack(searchQuery)
        this.search[this.activeName].isChildren.adv.badgeList = tempObj

        Object.assign(searchQuery, {
          page: 1,
          limit: 10
        })
        this.search[this.activeName].pagination.currentPage = 1
        this.search[this.activeName].isChildren.lastQuery = searchQuery
        fetchMailList(this.$store, this.activeName, searchQuery).then(() => {
          this.loading = false
        })
      },
      advSearchBack (searchQuery) {
        let tmpObj = {}
        for (let key in searchQuery) {
          if (searchQuery[key] && typeof searchQuery[key] === 'string') {
            if (searchQuery[key].match(/__/)) {
              tmpObj[key] = searchQuery[key].substr(searchQuery[key].indexOf('__') + 2)
              searchQuery[key] = searchQuery[key].substr(0, searchQuery[key].indexOf('__'))
            } else {
              tmpObj[key] = searchQuery[key]
            }
          }
          if (searchQuery[key] && Array.isArray(searchQuery[key]) && searchQuery[key].length > 0) {
            let tmpArr = []
            let tmpArr2 = []
            for (let i = 0; i < searchQuery[key].length; i++) {
              tmpArr.push(searchQuery[key][i].substr(searchQuery[key].indexOf('__') + 2))
              tmpArr2.push(searchQuery[key][i].substr(0, searchQuery[key].indexOf('__')))
            }
            tmpObj[key] = tmpArr
            searchQuery[key] = tmpArr2
          }
        }

        return tmpObj
      },
      normalSearch (value) {
        this.search.isSearch = true
        this.loading = true
        this.search.isAdvSearch = false
        this.search[this.activeName].isChildren.nomalForm.query = value

        let query = {
          emailType: this.activeName,
          page: 1,
          limit: 10
        }
        if (value) {
          query.query = value
        }
        if (this.search[this.activeName].isChildren.nomalForm.value) {
          let selectValue = this.search[this.activeName].isChildren.nomalForm.value
          Object.assign(query, (typeof selectValue === 'object') ? selectValue : { category: selectValue })
        }

        this.search[this.activeName].pagination.currentPage = 1
        this.search[this.activeName].isChildren.lastQuery = query
        fetchMailList(this.$store, this.activeName, query).then(() => {
          this.loading = false
        })
      },
      clearSearchQuery () {
        let currentTab = this.search[this.activeName]
        currentTab.pagination.currentPage = 1
        for (let key in currentTab.isChildren.adv.form) {
          if (Array.isArray(currentTab.isChildren.adv.form[key])) {
            currentTab.isChildren.adv.form[key] = []
          } else {
            currentTab.isChildren.adv.form[key] = null
          }
          this.search[this.activeName].isChildren.adv.badgeList = null
          for (let key in this.search[this.activeName].isChildren.nomalForm) {
            this.search[this.activeName].isChildren.nomalForm[key] = null
          }
        }
      },
      handleRefresh () {
        if (this.search.isAdvSearch) {
          this.advSearch()
        } else {
          this.normalSearch(this.search[this.activeName].isChildren.nomalForm.query)
        }
      }
    },
    components: {
      EmailCard,
      Search,
      'v-select': Select,
      CardGroupSolt,
      InputSearch,
      AdvancedSearch,
      Pagination,
      AdvSchBadge,
      Refresh
    }
  }
  function fetchMailList (store, tabType, data) {
    data.type = tabType
    return store.dispatch('queryEmailList', data)
  }
</script>
<style lang="stylus" scoped>
</style>
