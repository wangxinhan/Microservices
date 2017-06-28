<template>
  <card-group-solt
    @handleClick="changeTab"
    :activeName="activeName"
    :tabPanes="tabPanes"
    :cardLoading="loading"
    >
    <template v-for="tabPane in tabPanes" :slot="'search_'+tabPane.type">
      <search v-if="tabPane.type !== 'cdr_call'" :type="tabPane.type">
        <template :slot="'select_'+tabPane.type">
          <v-select :selectOptions="search[tabPane.type].isChildren.quickSelect" @quickSelect="quickSelect" :form="search[tabPane.type].isChildren.nomalForm"></v-select>
        </template>
        <template :slot="'inputSearch_'+tabPane.type">
          <input-search :placeHolder="$t('call.enterCallnumOrCallednumForQuery')" @quickSearch="inputSearch" :form="search[tabPane.type].isChildren.nomalForm"></input-search>
        </template>
        <template :slot="'advancedSearch_'+tabPane.type">
          <advanced-search  @selectChange="handlerSelectChange" v-if="search[tabPane.type].isChildren.adv" :adv="search[tabPane.type].isChildren.adv" :isClear = 'isClear' @advSearch="advSearch"></advanced-search>
        </template>
        <template :slot="'refresh_'+tabPane.type">
          <refresh v-if="search[tabPane.type].isChildren.refresh" @refresh="handleRefresh"></refresh>
        </template>
        <template :slot="'advSchBadge_'+tabPane.type">
          <advSchBadge v-if="search[tabPane.type].isChildren.adv.badgeList" :badge="search[tabPane.type].isChildren.adv.badgeList" @removeBadge="removeBadge"></advSchBadge>
        </template>
      </search>
    </template>
    <template slot="pagination" v-if="activeName && activeName!='cdr_call'">
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
      <call-card
        v-if="activeName && activeName!='cdr_call'"
        :cardList="cardList"
        :type="type"
        :tabType="tabPane.type"
        :clearChecked="clearChecked"
        :condition = "search[activeName].isChildren.adv.condition"
        @changeCardItem="changeCardItem"
      >
      </call-card>
      <call-card
        @changeCardItem="changeCardItem"
        :cardList="cardList"
        :type="type"
        :tabType="tabPane.type"
        v-else
      >
      </call-card>
    </template>
  </card-group-solt>

</template>
<script>
  import CardGroupSolt from 'components/public-modules/card'
  import CallCard from './CallCard'
  import Search from '../../public-modules/card/search'
  import Select from '../../public-modules/card/search/Select'
  import InputSearch from '../../public-modules/card/search/InputSearch'
  import AdvancedSearch from '../../public-modules/card/search/AdvancedSearch'
  import Pagination from '../../public-modules/card/Pagination'
  import Refresh from '../../ui-modules/icon/Refresh'
  import {getFormatDateTime, deepClone} from '../../../utils/m7Utils'
  import AdvSchBadge from '../../public-modules/card/search/AdvSchBadge'
//  import customerApi from '../../../store/api/customer'
  export default {
    name: 'CallCardGroup',
    props: {
      currentTabType: String
    },
    watch: {
      currentTabType: 'changeTabType',
      $route (to, from) {
        if (to.path.split('/')[3] === 'cdr_call') {
          this.activeName = 'cdr_call'
          if (to.path.split('/')[4] === 'add') {
            return
          }
          let callSheetId = this.$route.path.split('/')[4]
          let callInfo = null
          let list = this.$store.state.call.callList.cdr_call.list || JSON.parse(window.sessionStorage.callList || '[]')
          if (callSheetId) {
            this.$store.commit('call/SET_READ', callSheetId)
            this.$store.commit('call/COUNT_UNREAD_CDR')
          }
          if (!list || list.length === 0) {
            this.$router.push('/index/call/cdr_call')
            return
          }
          for (let i = 0; i < list.length; i++) {
            if (list[i]._id === callSheetId) {
              callInfo = list[i]
            }
          }
          if (this.$store.state.call.transCache.megNum) { // popIframe
            return
          }
          let tel = ''
          if (callInfo) {
            tel = callInfo.CALL_NO
            this.custType = callInfo.CUSTOMER_TYPE
            if (this.custType === 'unk') {
              this.tabActiveName = ''
              this.$router.push('/index/call/cdr_call/add/' + tel + '/3/' + callInfo._id + '?flag=add')
            } else if (this.custType === 'one') {
              this.tabActiveName = 'business'
            } else if (this.custType === 'multi') {
              this.$router.push('/index/call/cdr_call/add/' + tel + '/6/' + callInfo._id + '?flag=add')
            }
          }
        } else {
          return false
        }
      }
    },
    data () {
      return {
        loading: true,
        activeName: this.$route.params.tabType || 'cdr_call',
        type: 'call',
        clearChecked: '',
        temporaryCom: '',
        custType: '',
        temporaryDep: '',
        temporaryAgent: '',
        search: {
          isAdvSearch: false,
          cdr_call: {
            show: false,
            pagination: {
              small: true,
              currentPage: 1
            },
            isChildren: {
              rel: false,
              select: true,
              nomal: true,
              adv: {}
            }
          },
          cdr_my: {
            show: true,
            pagination: {
              small: true,
              currentPage: 1
            },
            isChildren: {
              rel: false,
              select: true,
              nomal: true,
              nomalForm: {query: '', flow: '', value: ''},
              quickSelect: [],
              inputSearch: {
                phoneNum: ''
              },
              refresh: true,
              adv: {
                form: {
                  CALL_NO: '',
                  CALLED_NO: '',
                  CONNECT_TYPE: '',
                  ownercom: '',
                  DISPOSAL_AGENT: '',
                  ownerdep: '',
                  STATUS: '',
                  ERROR_MEMO: '',
                  INVESTIGATE: '',
                  CUSTOMER_NAME: '',
                  CALL_TIME_LENGTH_BEGIN: '',
                  CALL_TIME_LENGTH_END: '',
                  QUEUE_TIME_LENGTH_BEGIN: '',
                  QUEUE_TIME_LENGTH_END: '',
                  KEY_TAG: '',
                  multiFirst: '',
                  multiTwo: '',
                  multiThree: '',
                  SQ_LABEL: '',
                  OFFERING_TIME: null
                },
                // todo multiFirst multiTwo multiThree
                advSearchOptions: {
                  localed: [
                  ],
                  custom: [
                  ]
                },
                badgeList: {},
                condition: {}
              }
            }
          },
          cdr_all: {
            show: true,
            pagination: {
              small: true,
              currentPage: 1
            },
            isChildren: {
              rel: true,
              select: true,
              nomal: true,
              nomalForm: {query: '', flow: '', value: ''},
              quickSelect: [],
              inputSearch: {
                phoneNum: ''
              },
              refresh: true,
              adv: {
                form: {
                  CALL_NO: '',
                  CALLED_NO: '',
                  CONNECT_TYPE: '',
                  ownercom: '',
                  DISPOSAL_AGENT: '',
                  ownerdep: '',
                  STATUS: '',
                  ERROR_MEMO: '',
                  INVESTIGATE: '',
                  CUSTOMER_NAME: '',
                  CALL_TIME_LENGTH_BEGIN: '',
                  CALL_TIME_LENGTH_END: '',
                  QUEUE_TIME_LENGTH_BEGIN: '',
                  QUEUE_TIME_LENGTH_END: '',
                  KEY_TAG: '',
                  multiFirst: '',
                  multiTwo: '',
                  multiThree: '',
                  SQ_LABEL: '',
                  OFFERING_TIME: null
                },
                // todo multiFirst multiTwo multiThree
                advSearchOptions: {
                  localed: [
                  ],
                  custom: [
                  ]
                },
                badgeList: {},
                condition: {}
              }
            }
          }
        },
        card: {
          cdr_call: {
            count: ''
          },
          cdr_my: {
            count: ''
          },
          cdr_all: {
            count: ''
          }
        },
        isClear: false
      }
    },
    components: {
      CallCard,
      Search,
      'v-select': Select,
      CardGroupSolt,
      InputSearch,
      AdvancedSearch,
      Pagination,
      Refresh,
      AdvSchBadge
    },
    methods: {
      changeCardItem () {
        this.$emit('changeCardItem')
      },
      changeTabType () {
        this.activeName = this.currentTabType
      },
      clearSearchQuery () {
        let currentTab = this.search[this.activeName]
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
        this.$emit('tabChange', tabName)
        this.loading = true
        this.clearSearchQuery()
        this.search[this.activeName].isChildren.adv.badgeList = {}
        this.search[this.activeName].pagination.currentPage = 1
        getCallList(this.$store, this.activeName, 1).then(() => {
          this.loading = false
          if (tabName) {
            this.$router.push({path: '/index/call/' + tabName})
          }
        })
      },
      turnPage (pageNum) {
        let form = this.search[this.activeName].isChildren.adv.form
        this.search[this.activeName].pagination.currentPage = pageNum
        this.loading = true
        getCallList(this.$store, this.activeName, pageNum, form).then(() => {
          this.loading = false
          if (this.$route.params.tabType) {
            this.$router.push({ path: '/index/call/' + this.$route.params.tabType })
          }
        })
      },
      handlerSelectChange (selectObj) {
        let selectName = selectObj.selectName
        let currentTab = this.search[this.activeName]
//        this.search[this.activeName].isChildren.adv.badgeList = {} // 清除高级搜索项
        this.search.isAdvSearch = false
        if (selectName === 'owner' || selectName === 'ownercom' || selectName === 'ownerdep') {
          if (selectObj.selectName === 'owner') {
            currentTab.isChildren.adv.form.DISPOSAL_AGENT = null
            currentTab.isChildren.adv.form.ownercom = null
            currentTab.isChildren.adv.form.ownerdep = null
            currentTab.isChildren.adv.form.DISPOSAL_AGENT = selectObj.selectValue
          } else {
            currentTab.isChildren.adv.form.DISPOSAL_AGENT = null
            currentTab.isChildren.adv.form.ownercom = null
            currentTab.isChildren.adv.form.ownerdep = null
            currentTab.isChildren.adv.form[selectObj.selectName] = selectObj.selectValue
          }
        }
        if (selectName === 'multiCallLabel') {
          currentTab.isChildren.adv.form.multiFirst = selectObj.selectValue.multiFirst
          currentTab.isChildren.adv.form.multiTwo = selectObj.selectValue.multiTwo
          currentTab.isChildren.adv.form.multiThree = selectObj.selectValue.multiThree
        }
      },
      advSearch (clearBadge) {
        this.loading = true
        let self = this
        let form = this.search[this.activeName].isChildren.adv.form
        if (form.QUICK_QUERY_NUM) {
          delete form.QUICK_QUERY_NUM
        }
        let tempArr = {}
        let searchQuery = deepClone(form)
        if (clearBadge === true) {
          self.search.isAdvSearch = false
          self.isClear = true
          self.search[self.activeName].isChildren.nomalForm.value = ''
          // 清空高级搜索选项
          for (let key in form) {
            if (key === 'custom') {
              form.custom = {}
            } else {
              form[key] = null
            }
          }
          searchQuery = {}
          this.search[this.activeName].isChildren.adv.badgeList = {}
          this.search[this.activeName].isChildren.adv.form = {
            CALL_NO: '',
            CALLED_NO: '',
            CONNECT_TYPE: '',
            ownercom: '',
            DISPOSAL_AGENT: '',
            ownerdep: '',
            STATUS: '',
            ERROR_MEMO: '',
            INVESTIGATE: '',
            CUSTOMER_NAME: '',
            CALL_TIME_LENGTH_BEGIN: '',
            CALL_TIME_LENGTH_END: '',
            QUEUE_TIME_LENGTH_BEGIN: '',
            QUEUE_TIME_LENGTH_END: '',
            KEY_TAG: '',
            multiFirst: '',
            multiTwo: '',
            multiThree: '',
            SQ_LABEL: '',
            OFFERING_TIME: null
          }
        } else {
          self.search.isAdvSearch = true
          self.isClear = false
          if (form.STATUS !== null && form.STATUS !== '') {
            self.search[self.activeName].isChildren.nomalForm.value = form.STATUS
          }
          let custom = searchQuery.custom
          // delete searchQuery.createTime
          for (let key in searchQuery) { // 搜索条件
            if (searchQuery[key] && key !== 'custom') {
              tempArr[key] = searchQuery[key]
            }
          }
          for (let i in custom) {
            searchQuery[i] = custom[i]
          }
          delete searchQuery.custom
          // 去除普通搜索的条件
          for (let key in this.search[this.activeName].isChildren.nomalForm) {
            this.search[this.activeName].isChildren.nomalForm[key] = null
          }
          // this.search[this.activeName].isChildren.nomalForm = {}
        }
        Promise.all([
          this.$store.dispatch('getCache', { type: 'callType' }),
          this.$store.dispatch('getCache', { type: 'callStatus' }),
          this.$store.dispatch('getCache', { type: 'queues' }),
          this.$store.dispatch('getCache', { type: 'investigate' }),
          this.$store.dispatch('getCache', { type: 'sqLabels' })
        ]).then(([callType, callStatus, queues, investigate, sqLabels]) => {
          for (let i in tempArr) {
            if (i === 'CONNECT_TYPE') {
              for (let j = 0; j < callType.length; j++) {
                if (callType[j].code_value === tempArr[i]) {
                  tempArr[i] = callType[j].code_name
                  break
                }
              }
            } else if (i === 'STATUS') {
              for (let j = 0; j < callStatus.length; j++) {
                if (callStatus[j].code_value === tempArr[i]) {
                  tempArr[i] = callStatus[j].code_name
                  break
                }
              }
            } else if (i === 'ERROR_MEMO') {
              for (let j = 0; j < queues.length; j++) {
                if (queues[j].Exten === tempArr[i]) {
                  tempArr[i] = queues[j].DisplayName
                  break
                }
              }
            } else if (i === 'INVESTIGATE') {
              for (let j = 0; j < investigate.length; j++) {
                if (investigate[j].value === tempArr[i]) {
                  tempArr[i] = investigate[j].name
                  break
                }
              }
            } else if (i === 'CUSTOMER_NAME') {
              if (tempArr[i] === true || tempArr[i] === 'true') {
                tempArr[i] = this.$t('public.locatedCustomer')
              }
            } else if (i === 'SQ_LABEL') {
              for (let j = 0; j < sqLabels.length; j++) {
                if (sqLabels[j]._id === tempArr[i]) {
                  tempArr[i] = sqLabels[j].name
                  break
                }
              }
            } else if (i === 'CALL_TIME_LENGTH_BEGIN' || i === 'CALL_TIME_LENGTH_END') {
              if (tempArr.CALL_TIME_LENGTH) {
                tempArr.CALL_TIME_LENGTH += ' ' + tempArr[i]
              } else {
                tempArr.CALL_TIME_LENGTH = tempArr[i]
              }
              delete tempArr[i]
            } else if (i === 'QUEUE_TIME_LENGTH_BEGIN' || i === 'QUEUE_TIME_LENGTH_END') {
              if (tempArr.QUEUE_TIME_LENGTH) {
                tempArr.QUEUE_TIME_LENGTH += ' ' + tempArr[i]
              } else {
                tempArr.QUEUE_TIME_LENGTH = tempArr[i]
              }
              delete tempArr[i]
            } else if (i === 'KEY_TAG') {
              if (tempArr[i] === true || tempArr[i] === 'true') {
                tempArr[i] = this.$t('public.yes')
              } else {
                tempArr[i] = this.$t('public.no')
              }
            } else if (i === 'OFFERING_TIME' && Array.isArray(tempArr[i])) {
              if (!tempArr[i] || tempArr[i].length === 0) {
                delete tempArr[i]
                continue
              }
              if (tempArr[i][0] === null && tempArr[i][1] === null) {
                delete tempArr[i]
                continue
              }
              if (tempArr[i][0]) {
                tempArr[i] = getFormatDateTime(form[i][0])
              }
              if (tempArr[i][1]) {
                tempArr[i] += ' ' + getFormatDateTime(form[i][1])
              }
            } else if (i === 'ownercom') {
              if (tempArr[i].match(/__/)) {
                self.temporaryCom = tempArr[i]
                form.ownercom = tempArr[i].substr(0, tempArr[i].indexOf('__'))
                tempArr[i] = tempArr[i].substr(tempArr[i].indexOf('__') + 2)
              } else {
                tempArr[i] = self.temporaryCom.substr(self.temporaryCom.indexOf('__') + 2)
              }
            } else if (i === 'ownerdep') {
              if (tempArr[i].match(/__/)) {
                self.temporaryDep = tempArr[i]
                form.ownerdep = tempArr[i].substr(0, tempArr[i].indexOf('__'))
                tempArr[i] = tempArr[i].substr(tempArr[i].indexOf('__') + 2)
              } else {
                tempArr[i] = self.temporaryDep.substr(self.temporaryDep.indexOf('__') + 2)
              }
            } else if (i === 'DISPOSAL_AGENT') {
              if (tempArr[i].match(/__/)) {
                self.temporaryAgent = tempArr[i]
                form.DISPOSAL_AGENT = tempArr[i].substr(0, tempArr[i].indexOf('__'))
                tempArr[i] = tempArr[i].substr(tempArr[i].indexOf('__') + 2)
              } else {
                tempArr[i] = self.temporaryAgent.substr(self.temporaryAgent.indexOf('__') + 2)
              }
            } else if (i === 'multiFirst') {
              if (tempArr[i].match(/__/)) {
                self.temporaryCom = tempArr[i]
                form.multiFirst = tempArr[i].substr(0, tempArr[i].indexOf('__'))
                tempArr[i] = tempArr[i].substr(tempArr[i].indexOf('__') + 2)
              } else {
                tempArr[i] = self.temporaryCom.substr(self.temporaryCom.indexOf('__') + 2)
              }
            } else if (i === 'multiTwo') {
              if (tempArr[i].match(/__/)) {
                self.temporaryCom = tempArr[i]
                form.multiTwo = tempArr[i].substr(0, tempArr[i].indexOf('__'))
                tempArr[i] = tempArr[i].substr(tempArr[i].indexOf('__') + 2)
              } else {
                tempArr[i] = self.temporaryCom.substr(self.temporaryCom.indexOf('__') + 2)
              }
            } else if (i === 'multiThree') {
              if (tempArr[i].match(/__/)) {
                self.temporaryCom = tempArr[i]
                form.multiThree = tempArr[i].substr(0, tempArr[i].indexOf('__'))
                tempArr[i] = tempArr[i].substr(tempArr[i].indexOf('__') + 2)
              } else {
                tempArr[i] = self.temporaryCom.substr(self.temporaryCom.indexOf('__') + 2)
              }
            }
          }
          this.search[this.activeName].isChildren.adv.badgeList = tempArr
          this.search[this.activeName].isChildren.adv.condition = form
          this.search[this.activeName].pagination.currentPage = 1
          getCallList(this.$store, this.activeName, 1, form).then(() => {
            this.loading = false
            if (this.$route.params.tabType) {
              this.$router.push({ path: '/index/call/' + this.$route.params.tabType })
            }
          })
        })
      },
      quickSelect (value) {
        this.loading = true
        if (this.search.isAdvSearch && value === null) {
          return
        }
        this.search.isAdvSearch = false
        let form = {
          CALL_NO: '',
          CALLED_NO: '',
          CONNECT_TYPE: '',
          ownercom: '',
          DISPOSAL_AGENT: '',
          ownerdep: '',
          STATUS: '',
          ERROR_MEMO: '',
          INVESTIGATE: '',
          CUSTOMER_NAME: '',
          CALL_TIME_LENGTH_BEGIN: '',
          CALL_TIME_LENGTH_END: '',
          QUEUE_TIME_LENGTH_BEGIN: '',
          QUEUE_TIME_LENGTH_END: '',
          KEY_TAG: '',
          multiFirst: '',
          multiTwo: '',
          multiThree: '',
          SQ_LABEL: '',
          OFFERING_TIME: null
        }
//        let form = this.search[this.activeName].isChildren.adv.form
        form.STATUS = value
        this.search[this.activeName].isChildren.adv.form.STATUS = value
        this.search[this.activeName].pagination.currentPage = 1
        getCallList(this.$store, this.activeName, 1, form).then(() => {
          this.loading = false
          if (this.$route.params.tabType) {
            this.$router.push({ path: '/index/call/' + this.$route.params.tabType })
          }
        })
      },
      inputSearch (phoneNum) {
        this.loading = true
        let form = {
          CALL_NO: '',
          CALLED_NO: '',
          CONNECT_TYPE: '',
          ownercom: '',
          DISPOSAL_AGENT: '',
          ownerdep: '',
          STATUS: '',
          ERROR_MEMO: '',
          INVESTIGATE: '',
          CUSTOMER_NAME: '',
          CALL_TIME_LENGTH_BEGIN: '',
          CALL_TIME_LENGTH_END: '',
          QUEUE_TIME_LENGTH_BEGIN: '',
          QUEUE_TIME_LENGTH_END: '',
          KEY_TAG: '',
          multiFirst: '',
          multiTwo: '',
          multiThree: '',
          SQ_LABEL: '',
          OFFERING_TIME: null
        }
//        let form = this.search[this.activeName].isChildren.adv.form
        this.search[this.activeName].pagination.currentPage = 1
        this.search[this.activeName].isChildren.adv.form.QUICK_QUERY_NUM = phoneNum
        form.QUICK_QUERY_NUM = phoneNum
        getCallList(this.$store, this.activeName, 1, form).then(() => {
          this.loading = false
          if (this.$route.params.tabType) {
            this.$router.push({ path: '/index/call/' + this.$route.params.tabType })
          }
        })
      },
      removeBadge () {
        this.advSearch(true)
        this.clearChecked = Math.random()
      },
      handleRefresh () {
        this.loading = true
        this.search[this.activeName].pagination.currentPage = 1
        let form = this.search[this.activeName].isChildren.adv.form
        getCallList(this.$store, this.activeName, 1, form).then(() => {
          this.loading = false
        })
      }
    },
    computed: {
      cardList () {
        if (this.activeName) {
          return this.$store.state.call.callList[this.activeName].list
        } else {
          return ''
        }
      },
      count () {
        if (this.activeName) {
          return this.$store.state.call.callList[this.activeName].count
        } else {
          return ''
        }
      },
      tabPanes () {
        let cdrCallNum = this.$store.state.call.unReadCdr
        let newNum = ''
        if (cdrCallNum && cdrCallNum > 0) {
          newNum = cdrCallNum
        }
        return [
          {name: this.$t('call.cdrCall') + newNum, type: 'cdr_call'},
          {name: this.$t('call.cdrMy'), type: 'cdr_my'},
          {name: this.$t('call.cdrAll'), type: 'cdr_all'}
        ]
      },
      totalPage () {
        return Math.ceil(this.$store.state[this.type][this.type + 'List'][this.activeName].count / 10) || 0
      }
    },
    beforeMount () {
      Promise.all([
        this.$store.dispatch('getCache', { type: 'callType' }),
        this.$store.dispatch('getCache', { type: 'callStatus' }),
        this.$store.dispatch('getCache', { type: 'queues' }),
        this.$store.dispatch('getCache', { type: 'investigate' }),
        this.$store.dispatch('getCache', { type: 'sqLabels' })
      ]).then(([callType, callStatus, queues, investigate, sqLabels]) => {
        this.search.cdr_my.isChildren.quickSelect = generateNewKeyValue(callStatus, ['code_name', 'code_value'], ['label', 'value'], this.$t('public.all'))
        this.search.cdr_my.isChildren.adv.advSearchOptions.localed = [
          {label: this.$t('public.calling'), name: 'CALL_NO', inputType: 'input'},
          {label: this.$t('public.called'), name: 'CALLED_NO', inputType: 'input'},
          {label: this.$t('call.callType'), name: 'CONNECT_TYPE', inputType: 'select', data: generateNewKeyValue(callType, ['code_name', 'code_value'], ['label', 'value'], this.$t('public.all'))},
          {label: this.$t('public.callStatus'), name: 'STATUS', inputType: 'select', data: generateNewKeyValue(callStatus, ['code_name', 'code_value'], ['label', 'value'], this.$t('public.all'))},
          {label: this.$t('public.queues'), name: 'ERROR_MEMO', inputType: 'select', data: generateNewKeyValue(queues, ['DisplayName', 'Exten'], ['label', 'value'], this.$t('public.all'))},
          {label: this.$t('public.satisfaction'), name: 'INVESTIGATE', inputType: 'select', data: generateNewKeyValue(investigate, ['name', 'value'], ['label', 'value'], this.$t('public.all'))},
          {label: this.$t('public.locationCustomer'), name: 'CUSTOMER_NAME', inputType: 'select', data: [{label: this.$t('public.all'), value: ''}, {label: this.$t('public.unknownCustomer'), value: this.$t('public.unknownCustomer')}, {label: this.$t('public.locatedCustomer'), value: 'true'}, {label: this.$t('public.locatedCustomers'), value: this.$t('public.locatedCustomers')}]},
          {label: this.$t('public.callTime'), name: 'OFFERING_TIME', inputType: 'time'},
          {label: this.$t('call.sign'), name: 'KEY_TAG', inputType: 'select', data: [{label: this.$t('public.all'), value: ''}, {label: this.$t('public.yes'), value: 'true'}, {label: this.$t('public.no'), value: 'false'}]},
          {label: this.$t('call.callTime'), name: 'CALL_TIME_LENGTH_BEGIN', inputType: 'rangeInput', validateType: 'Number3'},
          {label: this.$t('call.callTime'), name: 'CALL_TIME_LENGTH_END', inputType: 'rangeInput', validateType: 'Number3'},
          {label: this.$t('call.queueLen'), name: 'QUEUE_TIME_LENGTH_BEGIN', inputType: 'rangeInput', validateType: 'Number3'},
          {label: this.$t('call.queueLen'), name: 'QUEUE_TIME_LENGTH_END', inputType: 'rangeInput', validateType: 'Number3'},
          {label: this.$t('public.callLabel'), inputType: 'multi'},
          {label: this.$t('call.SQLabel'), name: 'SQ_LABEL', inputType: 'select', data: generateNewKeyValue(sqLabels, ['name', '_id'], ['label', 'value'], this.$t('public.all'))}
        ]
        this.search.cdr_all.isChildren.quickSelect = generateNewKeyValue(callStatus, ['code_name', 'code_value'], ['label', 'value'], this.$t('public.all'))
        this.search.cdr_all.isChildren.adv.advSearchOptions.localed = [
          {label: this.$t('public.calling'), name: 'CALL_NO', inputType: 'input'},
          {label: this.$t('public.called'), name: 'CALLED_NO', inputType: 'input'},
          {label: this.$t('call.callType'), name: 'CONNECT_TYPE', inputType: 'select', data: generateNewKeyValue(callType, ['code_name', 'code_value'], ['label', 'value'], this.$t('public.all'))},
          {label: this.$t('call.callRingSeat'), name: 'ownercom', inputType: 'owner'},
          {label: this.$t('public.callStatus'), name: 'STATUS', inputType: 'select', data: generateNewKeyValue(callStatus, ['code_name', 'code_value'], ['label', 'value'], this.$t('public.all'))},
          {label: this.$t('public.queues'), name: 'ERROR_MEMO', inputType: 'select', data: generateNewKeyValue(queues, ['DisplayName', 'Exten'], ['label', 'value'], this.$t('public.all'))},
          {label: this.$t('public.satisfaction'), name: 'INVESTIGATE', inputType: 'select', data: generateNewKeyValue(investigate, ['name', 'value'], ['label', 'value'], this.$t('public.all'))},
          {label: this.$t('public.locationCustomer'), name: 'CUSTOMER_NAME', inputType: 'select', data: [{label: this.$t('public.all'), value: ''}, {label: this.$t('public.unknownCustomer'), value: this.$t('public.unknownCustomer')}, {label: this.$t('public.locatedCustomer'), value: 'true'}, {label: this.$t('public.locatedCustomers'), value: this.$t('public.locatedCustomers')}]},
          {label: this.$t('public.callTime'), name: 'OFFERING_TIME', inputType: 'time'},
          {label: this.$t('call.sign'), name: 'KEY_TAG', inputType: 'select', data: [{label: this.$t('public.all'), value: ''}, {label: this.$t('public.yes'), value: 'true'}, {label: this.$t('public.no'), value: 'false'}]},
          {label: this.$t('call.callTime'), name: 'CALL_TIME_LENGTH_BEGIN', inputType: 'rangeInput', validateType: 'Number3'},
          {label: this.$t('call.callTime'), name: 'CALL_TIME_LENGTH_END', inputType: 'rangeInput', validateType: 'Number3'},
          {label: this.$t('call.queueLen'), name: 'QUEUE_TIME_LENGTH_BEGIN', inputType: 'rangeInput', validateType: 'Number3'},
          {label: this.$t('call.queueLen'), name: 'QUEUE_TIME_LENGTH_END', inputType: 'rangeInput', validateType: 'Number3'},
          {label: this.$t('public.callLabel'), inputType: 'multi'},
          {label: this.$t('call.SQLabel'), name: 'SQ_LABEL', inputType: 'select', data: generateNewKeyValue(sqLabels, ['name', '_id'], ['label', 'value'], this.$t('public.all'))}
        ]
        if (this.$route.params.tabType !== 'cdr_call') {
          getCallList(this.$store, this.activeName).then(() => {
            this.loading = false
          })
        } else { // 来电之后跳转卡片 去掉loading
          this.loading = false
        }
      })
    }
  }
  function getCallList (store, tabName, pageNum, queryCondition) {
    return store.dispatch('getCache', {type: 'custTmpls'})
      .then((custTmpls) => {
        // let data = {}
        if (!queryCondition) {
          queryCondition = {}
        }
        let condition = deepClone(queryCondition)
        let offerTime = queryCondition.OFFERING_TIME
        if (Array.isArray(offerTime) && offerTime.length === 2) {
          if (offerTime[0] && offerTime[1]) { // condition.OFFERING_TIME = {} 的时候，后台查询没有数据
            condition.OFFERING_TIME = {}
            if (offerTime[0] instanceof Date) {
              condition.OFFERING_TIME.$gte = getFormatDateTime(offerTime[0])
            }
            if (offerTime[1] instanceof Date) {
              condition.OFFERING_TIME.$lte = getFormatDateTime(offerTime[1])
            }
          } else {
            condition.OFFERING_TIME = null
          }
        } else {
          condition.OFFERING_TIME = null
        }
        condition.page = pageNum || 1
        condition.pageSize = 10
        condition.type = tabName
        if (tabName === 'cdr_my') {
          condition.DISPOSAL_AGENT = store.state.session.user._id
        }
        let custom = queryCondition.custom
        for (let key in custom) {
          condition[key] = custom[key]
        }
        delete condition.custom
        return store.dispatch('queryCallList', condition)
      })
  }
  function generateNewKeyValue (list, oldKeys, newKeys, label) {
    let result = []
    if (!Array.isArray(list) || !Array.isArray(oldKeys) || !Array.isArray(newKeys) || oldKeys.length !== newKeys.length) {
      return result
    }
    if (label) {
      result = [{label: label, value: ''}]
    }
    for (let i = 0; i < list.length; i++) {
      let item = {}
      for (let j = 0; j < oldKeys.length; j++) {
        let oldKey = oldKeys[j]
        let newKey = newKeys[j]
        item[newKey] = list[i][oldKey]
      }
      result.push(item)
    }
    return result
  }
</script>
<style lang="stylus" scoped>
</style>
