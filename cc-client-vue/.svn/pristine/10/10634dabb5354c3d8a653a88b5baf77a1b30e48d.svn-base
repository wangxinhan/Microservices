<template>
  <card-group-solt
    @handleClick="changeTab"
    :activeName="activeName"
    :tabPanes="tabPanes"
    class="card-ques"
    :cardLoading="loading">
    <template v-for="tabPane in tabPanes" :slot="'search_'+tabPane.type">
      <search :type="tabPane.type" :refreshTime="refreshLeftCard">
        <template :slot="'subMenu_'+tabPane.type">
          <el-tabs v-model.trim="subMenu" class="questionSubTab" @tab-click="changeSubTab">
            <el-tab-pane :label="subTabPane.name" :name="subTabPane.type" v-for="subTabPane in subTabPanes"></el-tab-pane>
          </el-tabs>
        </template>
        <template :slot="'inputSearch_'+tabPane.type">
          <input-search @quickSearch="nomalSearch"
                        :placeHolder="search.placeHolder"
                        :form="search[tabPane.type].isChildren.nomalForm">

          </input-search>
        </template>
        <template :slot="'advancedSearch_'+tabPane.type">
          <advanced-search v-if="search[tabPane.type].isChildren.adv"
                           :adv="search[tabPane.type].isChildren.adv"
                           :badge="search[tabPane.type].isChildren.adv.badgeList"
                           @selectChange="selectChange"
                           @advSearch="advSearch"
                           @getBatchNoByTime="getBatchNoByTime">

          </advanced-search>
        </template>
        <template :slot="'refresh_'+tabPane.type">
          <refresh v-if="search[tabPane.type].isChildren.refresh" @refresh="handleRefresh"></refresh>
        </template>
        <template :slot="'advSchBadge_'+tabPane.type">
          <advSchBadge v-if="search[tabPane.type].isChildren.adv.badgeList" :badge="search[tabPane.type].isChildren.adv.badgeList" @removeBadge="removeBadge"></advSchBadge>
        </template>
        <template v-if="search[tabPane.type].isChildren.selfExport" :slot="'export_'+tabPane.type">
          <export v-if="authority.export && search[tabPane.type].isChildren.selfExport" @export="exportQues"></export>
        </template>
        <template v-if="search[tabPane.type].isChildren.delete" :slot="'delete_'+tabPane.type">
          <delete v-if="authority.delete && search[tabPane.type].isChildren.delete" @delete="deleteQues"></delete>
        </template>
        <template v-if="search[tabPane.type].isChildren.assign" :slot="'assign_'+tabPane.type">
          <assign v-if="authority.assign && search[tabPane.type].isChildren.assign" @assign="assignBtn"></assign>
        </template>
      </search>
      <assign-questionnaire
      :isAssignDialog="isAssignDialog"
      :count="totalAssignCount"
      @assignSubmit="assignSave"
      >
      </assign-questionnaire>
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
      <question-card
        :cardList="cardList"
        :count="count"
        :type="type"
        :tabType="tabPane.type"
        :condition = search[activeName].isChildren.adv.form
        @changeCardItem="changeCardItem"
        >
      </question-card>
    </template>
  </card-group-solt>
</template>
<script>
  import CardGroupSolt from 'components/public-modules/card'
  import QuestionCard from './QuestionCard'
  import Search from '../../public-modules/card/search'
  import InputSearch from '../../public-modules/card/search/InputSearch'
  import AdvancedSearch from '../../public-modules/card/search/AdvancedSearch'
  import Pagination from '../../public-modules/card/Pagination'
  import Refresh from '../../ui-modules/icon/Refresh'
  import AdvSchBadge from '../../public-modules/card/search/AdvSchBadge'
  import Export from '../../ui-modules/icon/Export'
  import Delete from '../../ui-modules/icon/Delete'
  import Assign from '../../ui-modules/icon/Assign'
  import AssignQuestionnaire from './AssignQuestionnaire'
  import {deepClone, getDateTime, trimObjEmptyValue} from '../../../utils/m7Utils'
  import { MessageBox, Message } from 'element-ui'
  export default {
    name: 'QuestionCardGroup',
    data () {
      return {
        loading: true,
        isAssignDialog: false,
        totalAssignCount: 0,
        activeName: this.$route.params.tabType || 'questionnaire_my',
        type: 'questionnaire',
        dialogVisible: false,
        subMenu: 'all',
        tabPanes: [
          {name: this.$t('questionnaire.myQuestionnaire'), type: 'questionnaire_my'},
          {name: this.$t('questionnaire.allQuestionnaire'), type: 'questionnaire_all'}
        ],
        subTabPanes: [
          {name: this.$t('public.all'), type: 'all'},
          {name: this.$t('questionnaire.unComplete'), type: 'uncomplete'},
          {name: this.$t('questionnaire.unConfirm'), type: 'unconfirm'},
          {name: this.$t('questionnaire.complete'), type: 'complete'}
        ],
        search: {
          isAdvSearch: false,
          isSearch: false, // 是否正在执行搜索
          advSearchCondition: {}, // 高级搜索的查询条件展示
          placeHolder: this.$t('questionnaire.phonePlaceHolding'),
          questionnaire_all: {
            searchCard: 'buSearchCard',
            show: true,
            pagination: {
              small: true,
              currentPage: 1
            },
            isChildren: {
              rel: false,
              refresh: true,
              select: [],
              nomal: true,
              selfExport: false,
              delete: false,
              assign: false,
              nomalForm: {phone: '', query: ''},
              adv: {
                form: {name: null, ownercom: null, owner: null, ownerdep: null, phone: null, createTime: [], lastUpdateTime: [], assignStatus: null, temp_id: null, result: null, batchNo: null, batchRemark: null},
                advSearchOptions: {
                  localed: [
                    {label: this.$t('questionnaire.name'), name: 'name', inputType: 'input'},
                    {label: this.$t('questionnaire.phone'), name: 'phone', inputType: 'input'},
                    {label: this.$t('public.createTime'), name: 'createTime', inputType: 'time'},
                    {label: this.$t('questionnaire.lastUpdateTime'), name: 'lastUpdateTime', inputType: 'time'},
                    {label: this.$t('questionnaire.assignStatus'), name: 'assignStatus', inputType: 'select', data: [{label: '请选择', value: ''}, {label: '未分配', value: 'unassigned__未分配'}, {label: '已分配', value: 'assigned__已分配'}]},
                    {label: this.$t('questionnaire.owner'), name: 'owner', inputType: 'owner'},
                    {label: this.$t('questionnaire.tempId'), name: 'temp_id', inputType: 'select', data: []},
                    {label: this.$t('questionnaire.result'), name: 'result', inputType: 'select', data: []},
                    {label: this.$t('questionnaire.batchNo'), name: 'batchNo', inputType: 'select', multiple: true, filterable: true, allowCreate: true, remoteMethod: 'getBatchNoByTime', data: []},
                    {label: this.$t('questionnaire.batchRemark'), name: 'batchRemark', inputType: 'input', multiple: true, filterable: true, allowCreate: true, remoteMethod: 'getBatchRemarkByTime', data: []}
                  ],
                  custom: [
                  ]
                },
                badgeList: {}
              }
            }
          },
          questionnaire_my: {
            searchCard: 'bmSearchCard',
            show: true,
            pagination: {
              small: true,
              currentPage: 1
            },
            isChildren: {
              rel: false,
              refresh: true,
              nomal: true,
              selfExport: false,
              delete: false,
              assign: false,
              nomalForm: {phone: '', query: ''},
              adv: {
                form: {name: null, phone: null, createTime: [], lastUpdateTime: [], temp_id: null, result: null, batchNo: null, batchRemark: null},
                advSearchOptions: {
                  localed: [
                    {label: this.$t('questionnaire.name'), name: 'name', inputType: 'input'},
                    {label: this.$t('questionnaire.phone'), name: 'phone', inputType: 'input'},
                    {label: this.$t('public.createTime'), name: 'createTime', inputType: 'time'},
                    {label: this.$t('questionnaire.lastUpdateTime'), name: 'lastUpdateTime', inputType: 'time'},
                    {label: this.$t('questionnaire.tempId'), name: 'temp_id', inputType: 'select', data: []},
                    {label: this.$t('questionnaire.result'), name: 'result', inputType: 'select', data: []},
                    {label: this.$t('questionnaire.batchNo'), name: 'batchNo', inputType: 'select', data: [], multiple: true, filterable: true, allowCreate: true, remoteMethod: 'getBatchNoByTime'},
                    {label: this.$t('questionnaire.batchRemark'), name: 'batchRemark', inputType: 'input', data: [], multiple: true, filterable: true, allowCreate: true, remoteMethod: 'getBatchRemarkByTime'}
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
      this.loading = true
      let searchData = {
        queryType: this.activeName
      }
      this.search[this.activeName].isChildren.refresh = true
      this.search[this.activeName].isChildren.selfExport = false
      this.search[this.activeName].isChildren.delete = this.activeName !== 'questionnaire_my'
      this.search[this.activeName].isChildren.assign = false
      getQuesTmpls(this.$store).then(() => {
        this.tabPanes.forEach((tabPane) => {
          this.search[tabPane.type].isChildren.adv.advSearchOptions.localed.forEach((item) => {
            if (item.name === 'temp_id') {
              item.data = this.quesTmpls
            }
          })
        })
        getQuestionList(this.$store, searchData).then(() => {
          this.loading = false
        })
      })
    },
    watch: {
      'refreshLeftCard': 'refreshLeft'
    },
    computed: {
      cardList () {
        return this.$store.state[this.type][this.type + 'List'].list
      },
      refreshLeftCard () {
        return this.$store.state.questionnaire.refreshLeft
      },
      count () {
        return this.$store.state[this.type][this.type + 'List'].count
      },
      totalPage () {
        return Math.ceil(this.$store.state[this.type][this.type + 'List'].count / 10) || 0
      },
      quesTmpls () {
        let tmpls = []
        let quesTmpls = this.$store.state.session.dicMap.questionnaireTemp
        if (quesTmpls) {
          quesTmpls.forEach(ele => {
            tmpls.push({label: ele.name, value: ele._id + '__' + ele.name})
          })
        }
        return tmpls
      },
      authority () {
        let result = {delete: false, assign: false, export: false}
        let auths = this.$store.state.session.user.funcIds
        if (auths.indexOf('func_questionnaire_delete') !== -1) {
          result.delete = true
        }
        if (auths.indexOf('func_questionnaire_assign') !== -1) {
          result.assign = true
        }
        if (auths.indexOf('func_questionnaire_export') !== -1) {
          result.export = true
        }
        return result
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
            if (key === 'batchNo') {
              currentTab.isChildren.adv.form[key] = []
            } else {
              currentTab.isChildren.adv.form[key] = null
            }
          } else {
            currentTab.isChildren.adv.form[key] = {}
          }
        }
        for (let key in this.search[this.activeName].isChildren.nomalForm) {
          this.search[this.activeName].isChildren.nomalForm[key] = null
        }
        let items = this.search[this.activeName].isChildren.adv.advSearchOptions.localed
        for (let i = 0; i < items.length; i++) {
          if (items[i].name === 'batchNo') {
            items[i].data = []
          }
        }
        this.search[this.activeName].isChildren.adv.badgeList = null
      },
      changeTab (tabName) {
        this.activeName = tabName
        let self = this
        self.loading = true
        this.search[this.activeName].isChildren.refresh = true
        if (this.subMenu === 'unconfirm' || this.subMenu === 'uncomplete') {
          this.search[this.activeName].isChildren.assign = this.activeName !== 'questionnaire_my'
        }

        if (this.subMenu === 'complete') {
          this.search[this.activeName].isChildren.selfExport = true
        } else {
          this.search[this.activeName].isChildren.selfExport = false
        }

        this.search[this.activeName].isChildren.delete = this.activeName !== 'questionnaire_my'
        // 清空搜索中的查询条件
        this.clearSearchQuery()
        let queryData = {
          queryData: {},
          page: 1,
          limit: 10,
          queryType: this.activeName
        }
        let queryType = getCurrentQueryType(this.subMenu, this.activeName)
        queryData.queryType = queryType
        this.$router.push({ path: '/index/questionnaire' })
        getQuestionList(this.$store, queryData).then(() => {
          this.loading = false
        })
      },
      changeSubTab (tab) {
        let subTabName = tab.name
        this.subMenu = subTabName
        this.loading = true
        if (subTabName === 'all') {
          this.search[this.activeName].isChildren.refresh = true
          this.search[this.activeName].isChildren.selfExport = false
          this.search[this.activeName].isChildren.delete = this.activeName !== 'questionnaire_my'
          this.search[this.activeName].isChildren.assign = false
        } else if (subTabName === 'uncomplete') {
          this.search[this.activeName].isChildren.refresh = true
          this.search[this.activeName].isChildren.selfExport = false
          this.search[this.activeName].isChildren.delete = this.activeName !== 'questionnaire_my'
          this.search[this.activeName].isChildren.assign = this.activeName !== 'questionnaire_my'
        } else if (subTabName === 'unconfirm') {
          this.search[this.activeName].isChildren.refresh = true
          this.search[this.activeName].isChildren.selfExport = false
          this.search[this.activeName].isChildren.delete = this.activeName !== 'questionnaire_my'
          this.search[this.activeName].isChildren.assign = this.activeName !== 'questionnaire_my'
        } else if (subTabName === 'complete') {
          this.search[this.activeName].isChildren.refresh = true
          this.search[this.activeName].isChildren.selfExport = true
          this.search[this.activeName].isChildren.delete = this.activeName !== 'questionnaire_my'
          this.search[this.activeName].isChildren.assign = false
        }

        // 清空搜索中的查询条件
        this.clearSearchQuery()
        let queryData = {
          querydata: {}
        }
        let queryType = getCurrentQueryType(subTabName, this.activeName)
        queryData.queryType = queryType
        let that = this
        getQuestionList(this.$store, queryData).then(() => {
          that.loading = false
        })
      },
      exportQues () {
        if (!this.search[this.activeName].isChildren.adv.form.temp_id) {
          this.$message.error(this.$t('questionnaire.noTempId'))
          return false
        }
        let querydata = {}
        let form = this.search[this.activeName].isChildren.adv.form
        querydata = processAdvQuery(querydata, form, {})
        querydata.status = 'complete'
        if (querydata.createTime_begin_date) {
          querydata.createTime = {}
          querydata.createTime['$gte'] = querydata.createTime_begin_date
          querydata.createTime_begin_date = ''
        }
        if (querydata.createTime_end_date) {
          if (!querydata.createTime) querydata.createTime = {}
          querydata.createTime['$lte'] = querydata.createTime_end_date
          querydata.createTime_end_date = ''
        }

        if (querydata.lastUpdateTime_begin_date) {
          querydata.lastUpdateTime = {}
          querydata.lastUpdateTime['$gte'] = querydata.lastUpdateTime_begin_date
          querydata.lastUpdateTime_begin_date = ''
        }
        if (querydata.lastUpdateTime_end_date) {
          if (!querydata.lastUpdateTime) querydata.lastUpdateTime = {}
          querydata.lastUpdateTime['$lte'] = querydata.lastUpdateTime_end_date
          querydata.lastUpdateTime_end_date = ''
        }

        if (this.activeName === 'questionnaire_my') {
          querydata.owner = this.$store.state.session.user._id
        }
        trimObjEmptyValue(querydata)
        this.$store.dispatch('exportQues', querydata)
      },
      deleteQues () {
        let form = this.search[this.activeName].isChildren.adv.form
        let queryData = {}
        if (this.search.isAdvSearch) {
          queryData = processAdvQuery(queryData, form, {})
        } else {
          queryData = this.search[this.activeName].isChildren.nomalForm
        }
        if (this.subMenu === 'unconfirm') {
          queryData.status = 'confirm'
        } else if (this.subMenu === 'all') {
          queryData.status = null
        } else {
          queryData.status = this.subMenu
        }
        this.$store.dispatch('getQuesCount', queryData).then((response) => {
          MessageBox.confirm(this.$t('questionnaire.deleteQuesMessageWithLength', {length: response.count}), this.$t('questionnaire.deleteQuesConfirm'), {
            confirmButtonText: this.$t('public.confirm'),
            cancelButtonText: this.$t('public.cancel'),
            type: 'warning'
          }).then((v) => {
            this.$store.dispatch('deleteQues', queryData).then(() => {
              Message.success({
                message: this.$t('questionnaire.deleteQuesSuccess')
              })
              this.$router.push({ path: '/index/questionnaire' })
            })
          }).catch((err) => {
            if (err === 'cancel') {}
          })
        })
      },
      assignBtn () {
        this.isAssignDialog = true
        this.totalAssignCount = this.$store.state.questionnaire.questionnaireList.count
      },
      /**
       * @param assignCount 指的是输入框里填入的数值
       * @param owners 指的是所有座席的值集合
       */
      assignSave (query) {
        if (query.type === 'cancel') {
          this.isAssignDialog = false
          return
        }
        let owners = query.owners
        let assignCount = query.assignCount
        let totalCount = this.$store.state.questionnaire.questionnaireList.count
        if (assignCount > totalCount) {
          this.$message({message: this.$t('questionnaire.assignFailTips2', {num: totalCount}), type: 'error'})
          return
        }
        let assignTotalNum = 0
        owners.forEach((owner) => {
          let num = owner.count
          if (num && parseInt(num) > 0) {
            assignTotalNum += parseInt(num, 10)
          }
        })

        if (assignTotalNum > assignCount) {
          this.$message({message: this.$t('questionnaire.assignFailTips2', {num: assignCount}), type: 'error'})
          return
        }
        let form = this.search[this.activeName].isChildren.adv.form
        let queryData = {}
        if (this.search.isAdvSearch) {
          queryData = processAdvQuery(queryData, form, {})
        } else {
          queryData = this.search[this.activeName].isChildren.nomalForm
        }
        queryData.status = this.subMenu === 'unconfirm' ? 'confirm' : this.subMenu
        let data = {owners: owners, total: totalCount, query: queryData}
        this.$store.dispatch('saveQuesAssign', data).then((res) => {
          if (res.success) {
            this.isAssignDialog = false
            this.handleRefresh()
          }
        })
      },
//      changeButtonShow (newValue) {
//        console.log(newValue)
//        this.search[this.activeName].isChildren.refresh = true
//        this.search[this.activeName].isChildren.selfExport = false
//        this.search[this.activeName].isChildren.delete = newValue !== 'questionnaire_my'
//        this.search[this.activeName].isChildren.assign = false
//      },
      selectChange (selectObj) {
        let selectName = selectObj.selectName
        let selectValue = selectObj.selectValue
        // 问卷模板类型改变
        if (selectName === 'temp_id') {
          let tmplId = selectValue.substr(0, selectValue.indexOf('__'))
          getQuesTmplResults(this.$store, tmplId).then((tmpl) => {
            if (!tmpl) {
              return
            }
            let qstatus = tmpl.qstatus || {success: this.$t('questionnaire.successStatus'), invalid: this.$t('questionnaire.invalidStatus'), noAnswer: this.$t('questionnaire.noAnswerStatus'), imparity: this.$t('questionnaire.imparityStatus'), other: this.$t('questionnaire.otherStatus')}
            let qstatusSelectData = []
            for (let key in qstatus) {
              let item = {label: qstatus[key], value: key + '__' + qstatus[key]}
              qstatusSelectData.push(item)
            }
            this.search[this.activeName].isChildren.adv.advSearchOptions.localed.forEach((item) => {
              if (item.name === 'result') {
                this.search[this.activeName].isChildren.adv.form.result = null
                item.data = qstatusSelectData
              }
            })
          })
        } else if (selectName === 'ownercom' || selectName === 'owner' || selectName === 'ownerdep') {
          this.search[this.activeName].isChildren.adv.form.ownercom = null
          this.search[this.activeName].isChildren.adv.form.owner = null
          this.search[this.activeName].isChildren.adv.form.ownerdep = null
          this.search[this.activeName].isChildren.adv.form[selectName] = selectValue
        }
      },
      getBatchNoByTime () {
        let searchQuery = {}
        let form = this.search[this.activeName].isChildren.adv.form
        if (form.createTime && form.createTime.length > 0 && form.createTime[0] !== null) {
          searchQuery.start = getDateTime(form.createTime[0])
        }
        if (form.createTime && form.createTime.length > 1 && form.createTime[1] !== null) {
          searchQuery.end = getDateTime(form.createTime[1])
        }
        this.$store.dispatch('getBatchNoByTime', searchQuery).then(res => {
          this.search[this.activeName].isChildren.adv.advSearchOptions.localed.forEach((item) => {
            if (item.name === 'batchNo') {
              item.data = res.data.map(obj => ({label: obj.batchNo, value: obj.batchNo}))
            }
          })
        })
      },
      nomalSearch (value, pageNum) {
        this.search.isSearch = true
        let self = this
        self.loading = true

        this.search[this.activeName].isChildren.adv.badgeList = {} // 清除高级搜索项
        this.search.isAdvSearch = false

        this.search[self.activeName].isChildren.nomalForm.phone = value
        let querydata = deepClone(this.search[self.activeName].isChildren.nomalForm)
        delete querydata.query
        querydata.page = pageNum || 1
        let queryType = getCurrentQueryType(this.subMenu, this.activeName)
        getQuestionList(this.$store, {querydata, queryType}).then(() => {
          self.loading = false
          self.search[self.activeName].pagination.currentPage = pageNum || 1
        })
      },
      refreshLeft () {
        if (this.$store.state.questionnaire.refreshLeft !== '') {
          this.handleRefresh()
        }
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
      },
      advSearch (clearBadge, pageNum) {
        this.search.isSearch = true
        let self = this
        self.loading = true
        let form = this.search[this.activeName].isChildren.adv.form
        let tempArr = {}
        let searchQuery = {}
        if (clearBadge === true) {
          self.search.isAdvSearch = false
          // 清空高级搜索选项
          for (let key in form) {
            if (key === 'custom') {
              form.custom = {}
            } else {
              if (key === 'batchNo') {
                form[key] = []
              } else {
                form[key] = null
              }
            }
          }
          let items = this.search[this.activeName].isChildren.adv.advSearchOptions.localed
          for (let i = 0; i < items.length; i++) {
            if (items[i].name === 'batchNo') {
              items[i].data = []
            }
          }
          searchQuery = {}
        } else {
          self.search.isAdvSearch = true
          searchQuery = processAdvQuery(searchQuery, form, tempArr)
          // 去除普通搜索的条件
          for (let key in this.search[this.activeName].isChildren.nomalForm) {
            this.search[this.activeName].isChildren.nomalForm[key] = null
          }
        }
        this.search[this.activeName].isChildren.adv.badgeList = tempArr
        searchQuery.page = pageNum || 1
        let queryType = getCurrentQueryType(this.subMenu, this.activeName)
        this.search[self.activeName].pagination.currentPage = pageNum || 1
        getQuestionList(this.$store, {querydata: searchQuery, queryType: queryType}).then(() => {
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
      }
    },
    components: {
      QuestionCard,
      Search,
      CardGroupSolt,
      InputSearch,
      AdvancedSearch,
      Pagination,
      Refresh,
      AdvSchBadge,
      Delete,
      Export,
      Assign,
      AssignQuestionnaire,
      'v-delete': Delete
    }
  }

  function getQuesTmpls (store) {
    return store.dispatch('getQuesTmpls')
  }

  function getQuesTmplResults (store, value) {
    return store.dispatch('getCache', {type: 'questionnaireTemp', id: value})
  }
  // 获取问卷卡片数据
  function getQuestionList (store, searchData) {
    return store.dispatch('quesList', searchData)
  }
  function getCurrentQueryType (subTab, activeName) {
    let queryType = ''
    switch (subTab) {
      case 'all':
        if (activeName === 'questionnaire_my') {
          queryType = 'questionnaire_my'
        } else {
          queryType = 'questionnaire_all'
        }
        break
      case 'uncomplete':
        if (activeName === 'questionnaire_my') {
          queryType = 'my_questionnaire_uncomplete'
        } else {
          queryType = 'questionnaire_uncomplete'
        }
        break
      case 'unconfirm':
        if (activeName === 'questionnaire_my') {
          queryType = 'my_questionnaire_unconfirm'
        } else {
          queryType = 'questionnaire_unconfirm'
        }
        break
      case 'complete':
        if (activeName === 'questionnaire_my') {
          queryType = 'my_questionnaire_complete'
        } else {
          queryType = 'questionnaire_complete'
        }
        break
      default :
        queryType = 'questionnaire_my'
        break
    }
    return queryType
  }
  function processAdvQuery (searchQuery, form, tempArr) {
    searchQuery = deepClone(form)
    let custom = searchQuery.custom
    // deepClone后createtiem里日期消失
    if (form.createTime && form.createTime.length > 0 && form.createTime[0] !== null) {
      searchQuery.createTime_begin_date = getDateTime(form.createTime[0])
    }
    if (form.createTime && form.createTime.length > 1 && form.createTime[1] !== null) {
      searchQuery.createTime_end_date = getDateTime(form.createTime[1])
    }
    if (form.lastUpdateTime && form.lastUpdateTime.length > 0 && form.lastUpdateTime[0] !== null) {
      searchQuery.lastUpdateTime_begin_date = getDateTime(form.lastUpdateTime[0])
    }
    if (form.lastUpdateTime && form.lastUpdateTime.length > 1 && form.lastUpdateTime[1] !== null) {
      searchQuery.lastUpdateTime_end_date = getDateTime(form.lastUpdateTime[1])
    }
    let batchNo = searchQuery.batchNo
    let batchNos = ''
    if (batchNo) {
      batchNo.forEach(one => {
        batchNos += one + ';'
      })
    }
    delete searchQuery.createTime
    delete searchQuery.lastUpdateTime
    searchQuery.batchNo = batchNos
    for (let key in searchQuery) { // 搜索条件
      if (searchQuery[key] && key !== 'custom') {
        tempArr[key] = searchQuery[key]
        if (key === 'temp_id' || key === 'result' || key === 'assignStatus' || key === 'owner' || key === 'ownercom' || key === 'ownerdep') {
          tempArr[key] = searchQuery[key].substr(searchQuery[key].indexOf('__') + 2)
          searchQuery[key] = searchQuery[key].substr(0, searchQuery[key].indexOf('__'))
        }
      }
    }
    for (let i in custom) {
      searchQuery[i] = custom[i]
    }
    delete searchQuery.custom
    return searchQuery
  }
</script>
<style lang="stylus" scoped>
</style>
