<template>
  <div>
    <card-group-solt
          @handleClick="changeTab"
          :activeName="activeName"
          :tabPanes="tabPanes"
          loading="true">
    <template v-for="tabPane in tabPanes" :slot="'search_'+tabPane.type">
      <!--全部-->
      <search v-if="search[tabPane.type].show" :type="tabPane.type">
        <template v-if="search[tabPane.type].isChildren.nomal" :slot="'inputSearch_'+tabPane.type">
          <input-search :placeHolder="$t('webchat.pleaseEnter')" @quickSearch="handlerQuickSearch"
                        :form="search[tabPane.type].isChildren.nomalForm"></input-search>
        </template>
        <template v-if="search[tabPane.type].isChildren.adv" :slot="'advancedSearch_'+tabPane.type">
          <advanced-search v-if="search[tabPane.type].isChildren.adv" :adv="search[tabPane.type].isChildren.adv"
                           @advSearch="advSearch" @selectChange="handlerSelectChange"></advanced-search>
        </template>
        <template :slot="'refresh_'+tabPane.type">
          <refresh v-if="search[tabPane.type].isChildren.refresh" @refresh="handleRefresh"></refresh>
        </template>
        <template :slot="'advSchBadge_'+tabPane.type">
          <advSchBadge v-if="search[tabPane.type].isChildren.adv.badgeList"
                       :badge="search[tabPane.type].isChildren.adv.badgeList" @removeBadge="removeBadge"></advSchBadge>
        </template>
        <template v-if="search[tabPane.type].isChildren.selfExport" :slot="'export_'+tabPane.type">
          <export v-if="search[tabPane.type].isChildren.selfExport" @export="exportWebchat"></export>
        </template>
      </search>

      <!--处理中-->
      <search v-if="search[tabPane.type].todoShow" :type="tabPane.type">
        <template v-if="search[tabPane.type].isChildren.select" :slot="'select_'+tabPane.type" class="">
          <span class="font12 ">会话上限</span>
          <el-select size="small" class="chat_limit" v-model.trim="webchatLimit.value" placeholder="全部" @change="handleChange">
            <el-option
                    v-for="item in webchatLimit.options"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template v-if="search[tabPane.type].isChildren.adv" :slot="'advancedSearch_'+tabPane.type">
          <time-search class="time_search" v-if="search[tabPane.type].isChildren.adv"
                       :adv="search[tabPane.type].isChildren.adv" @timeSearch="timeSearch" @inviteInfo="inviteInfo" :resetSearch="resetTimeSearch"></time-search>
        </template>
        <template :slot="'advSchBadge_'+tabPane.type">
          <advSchBadge v-if="search[tabPane.type].isChildren.adv.badgeList"
                       :badge="search[tabPane.type].isChildren.adv.badgeList" @removeBadge="removeBadge"></advSchBadge>
        </template>
      </search>
    </template>
    <template slot="pagination" v-if="activeName==='webchat_all'">
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
      <div class="loading" v-loading="loading" v-if="loading" element-loading-text="数据加载中"></div>
      <webchat-card
              :cardList="cardList"
              :count="count"
              :type="type"
              :tabType="tabPane.type"
              v-if="!loading"
              :clearChecked="clearChecked"
              @changeCardItem="changeCardItem"
      >
      </webchat-card>
    </template>
  </card-group-solt>
    <pop-drag-conversation v-if="popConversationInfo.open" :conversationInfo="popConversationInfo" @close="closePopConversation"></pop-drag-conversation>
  </div>
</template>
<script>
  import CardGroupSolt from 'components/public-modules/card'
  import WebchatCard from './WebchatCard'
  import PopDragConversation from 'components/public-modules/popups/PopDragConversation'
  import Search from '../../public-modules/card/search'
  //  import Select from '../../public-modules/card/search/Select'
  import InputSearch from '../../public-modules/card/search/InputSearch'
  import AdvancedSearch from '../../public-modules/card/search/AdvancedSearch'
  import AdvSchBadge from '../../public-modules/card/search/AdvSchBadge'
  import Pagination from '../../public-modules/card/Pagination'
  import {deepClone, getFormatDateTime} from '../../../utils/m7Utils'
  import TimeSearch from './TimeSearch.vue'
  import Refresh from '../../ui-modules/icon/Refresh'
  import Export from '../../ui-modules/icon/Export'
  import { isEmpty } from 'lodash'
  import * as types from '../../../store/modules/webchat/mutation-types.js'
  export default {
    name: 'WebchatCardGroup',
    props: {
      currentTabType: String
    },
    watch: {
      currentTabType: 'changeTabType',
      $route (to, form) {
        if (to.path.split('/')[2] === 'webchat') {
          this.activeName = to.path.split('/')[3]
        } else {
          return
        }
      }
    },
    data () {
      return {
        loading: true,
        activeName: this.$route.params.tabType || 'webchat_todo',
        type: 'webchat',
        resetTimeSearch: false,
        clearChecked: '',
        search: {
          isAdvSearch: false, // 是否在高级搜索
          isSearch: false,
          skillQueues: [], // 技能组
          webchatFinish: [], // 完成类型
          webchatSeoSource: [], // 搜索来源
          webchatCSR: [], // 满意类型
          searchQuery: {}, // 保存高级搜索条件用于导出
          webchat_todo: {
            searchCard: 'wtSearchCard',
            show: false,
            todoShow: true,
            pagination: {
              small: true,
              currentPage: 1
            },
            isChildren: {
              lastQuery: null,
              rel: false,
              select: true,
              nomal: true,
              refresh: false,
              selfExport: false,
              adv: {
                form: {},
                advSearchOptions: {
                  localed: [],
                  custom: []
                },
                badgeList: {}
              }
            }
          },
          webchat_all: {
            searchCard: 'waSearchCard',
            show: true,
            todoShow: false,
            pagination: {
              small: true,
              currentPage: 1
            },
            isChildren: {
              lastQuery: null,
              rel: false,
              select: true,
              nomal: true,
              refresh: true,
              selfExport: true,
              nomalForm: {query: ''},
              adv: {
                form: {
                  sName: '',
                  ownercom: '',
                  user: '',
                  ownerdep: '',
                  status: '',
                  finishKey: '',
                  toPeer: '',
                  platform: '',
                  seoKeywords: '',
                  appraiseKey: '',
                  manualTime: null,
                  createTime: null,
                  beginTime: null,
                  endTime: null,
                  area: '',
                  seoSource: '',
                  mKeyword: '',
                  msgCountType: '',
                  msgCount: '',
                  showInvite: false
                },
                advSearchOptions: {
                  localed: [],
                  custom: []
                },
                badgeList: {}
              }
            }
          }
        },
        card: {
          webchat_todo: {
            count: ''
          },
          webchat_all: {
            count: ''
          }
        },
        webchatLimit: {
          value: '',
          options: []
        },
        popConversationInfo: {
          name: '',
          open: false
        }
      }
    },
    beforeMount () {
      let data = {
        page: 1,
        limit: 10
      }
      let that = this
      this.search[this.activeName].isChildren.lastQuery = data
      getWebchatList(this.$store, this.activeName, data).then(() => {
        that.loading = false
        that.$store.commit(types.CHANGE_LOAD_STATUS, {})
      })

      // 高级搜索
      Promise.all([
        this.$store.dispatch('getCache', { type: 'mailQueues' }),
        this.$store.dispatch('getCache', { type: 'channelDic' })
      ]).then(([mailQueues]) => {
        let skillQueues = [{ label: this.$t('public.all'), value: '' }, ...mailQueues.map(item => ({ label: item.DisplayName, value: `${item.Exten}__${item.DisplayName}` }))]

        let seoSources = this.getChannelDicByType('webchatSeoSource')
        let webchatSeoSource = [{ label: this.$t('public.all'), value: '' }, ...seoSources.map(item => ({ label: item.name, value: `${item.key}__${item.name}` }))]

        let finishTypes = getFinishType(this.getChannelDicByType('webchat'))
        let webchatFinish = [{ label: this.$t('public.all'), value: '' }, ...finishTypes, {label: this.$t('webchat.addBlack'), value: `add_black__${this.$t('webchat.addBlack')}`}]

        let webchatCSRS = this.getChannelDicByType('webchatCSR')
        let webchatCSR = [{ label: this.$t('public.all'), value: '' }, ...webchatCSRS.map(item => ({ label: item.name, value: `${item.key}__${item.name}` }))]

        let localedOptions = [
          {label: this.$t('webchat.userName'), name: 'sName', inputType: 'input'},
          {label: this.$t('webchat.master'), name: 'ownercom', inputType: 'owner'},
          {
            label: this.$t('public.state'),
            name: 'status',
            inputType: 'select',
            data: [
              {label: this.$t('webchat.webchatAll'), value: ''},
              {label: this.$t('webchat.undeal'), value: `undeal__${this.$t('webchat.undeal')}`},
              {label: this.$t('webchat.received'), value: `deal__${this.$t('webchat.received')}`},
              {label: this.$t('webchat.closed'), value: `finish__${this.$t('webchat.closed')}`},
              {label: this.$t('webchat.transfer'), value: `changePeer__${this.$t('webchat.transfer')}`}
            ]
          },
          {label: this.$t('webchat.processResult'), name: 'finishKey', inputType: 'select', data: webchatFinish},
          {label: this.$t('public.queues'), name: 'toPeer', inputType: 'select', data: skillQueues},
          {
            label: this.$t('webchat.satisfactioEvaluation'),
            name: 'appraiseKey',
            inputType: 'select',
            data: webchatCSR
          },
          {
            label: this.$t('webchat.platformSource'),
            name: 'platform',
            inputType: 'select',
            data: [
              {label: this.$t('webchat.webchatAll'), value: ''},
              {label: this.$t('webchat.websiteCon'), value: `pc__${this.$t('webchat.websiteCon')}`},
              {label: this.$t('webchat.wapCon'), value: `wap__${this.$t('webchat.wapCon')}`},
              {label: this.$t('webchat.appCon'), value: `sdk__${this.$t('webchat.appCon')}`},
              {label: this.$t('webchat.weChatCon'), value: `weixin__${this.$t('webchat.weChatCon')}`}
            ]
          },
          {label: this.$t('webchat.are'), name: 'area', inputType: 'input'},
          {label: this.$t('webchat.searchForSource'), name: 'seoSource', inputType: 'select', data: webchatSeoSource},
          {label: this.$t('webchat.seoKeywords'), name: 'seoKeywords', inputType: 'input'},
          {label: this.$t('webchat.laborTime'), name: 'manualTime', inputType: 'time', data: []},
          {label: this.$t('public.createTime'), name: 'createTime', inputType: 'time', data: []},
          {label: this.$t('webchat.sessionContent'), name: 'mKeyword', inputType: 'input'},
          {label: this.$t('webchat.takeTime'), name: 'beginTime', inputType: 'time', data: []},
          {label: this.$t('public.endTime'), name: 'endTime', inputType: 'time', data: []},
          {label: this.$t('webchat.msgNum'), inputType: 'radioInput', radioName: 'msgCountType', inputName: 'msgCount', data: []},
          {label: '', name: 'showInvite', inputType: 'checkbox', data: [{label: this.$t('webchat.activeSession'), value: `showInvite__${this.$t('webchat.activeSession')}`}]}
        ]
        this.search.webchat_all.isChildren.adv.advSearchOptions.localed = deepClone(localedOptions)
      })
      this.initLimitNum()
    },
    methods: {
      changeCardItem () {
        this.$emit('changeCardItem')
      },
      changeTabType () {
        this.activeName = this.currentTabType
      },
      timeSearch (data) {
        this.resetTimeSearch = false
        this.loading = true
        let searchQuery = deepClone(data)
        let tempObj = this.advSearchBack(searchQuery)
        if (data.visitorsReply || data.unReply || data.clientReply) {
          this.$store.dispatch('updateTimeSearchState', true).then(() => {
            this.$router.push({path: '/index/webchat/webchat_todo'})
          })
        }
        this.search[this.activeName].isChildren.adv.badgeList = tempObj
        this.search[this.activeName].isChildren.lastQuery = searchQuery
        getWebchatList(this.$store, this.activeName, searchQuery).then(() => {
          this.loading = false
        })
      },
      handleChange (option) {
        this.$store.dispatch('updateCurrentUser', {'imDealCount': option.toString()})
      },
      changeTab (tabName) {
        this.search.isSearch = true
        if (tabName === 'webchat_todo' && this.activeName !== tabName) {
          this.clearSearchQuery()
        }
        this.activeName = tabName
        this.$emit('tabChange', tabName)
        this.$router.push({path: '/index/webchat/' + tabName})
        if (tabName === 'webchat_todo') {
//          this.removeBadge()   //  高级搜索下抢接会话时   抢接会话直接跳转路由，导致高级搜索的条件没有删掉
          // 如果初始化过,就不必再初始化了
          if (this.$store.state.webchat.webchatList.webchat_todo.init) {
            return
          }
        }
        this.loading = true
        let data = {
          page: 1,
          limit: 10
        }
        getWebchatList(this.$store, this.activeName, data).then(() => {
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
        getWebchatList(this.$store, this.activeName, queryData).then(() => {
          this.loading = false
        })
      },
      handlerQuickSearch (sName) {
        this.search.isSearch = true
        this.search.isAdvSearch = false
        this.loading = true
        this.search[this.activeName].isChildren.nomalForm.query = sName
        let query = {
          page: 1,
          limit: 10,
          sName: sName
        }
        this.search[this.activeName].pagination.currentPage = 1
        this.search[this.activeName].isChildren.lastQuery = query
        getWebchatList(this.$store, this.activeName, query).then(() => {
          this.loading = false
        })
      },
      advSearch (reset) {
        this.search.isSearch = true
        this.search.isAdvSearch = true
        if (reset) {
          this.clearSearchQuery()
        }
        let form = this.search[this.activeName].isChildren.adv.form
        let searchQuery = deepClone(form)
        let manualTime = form.manualTime
        let createTime = form.createTime
        let beginTime = form.beginTime
        let endTime = form.endTime

        // 消息数验证
        if (searchQuery.msgCountType || searchQuery.msgCount) {
          if (!searchQuery.msgCountType || !searchQuery.msgCount) {
            this.$message.error('请选择消息条数判断或者填写消息条数')
            return
          }
        }

        // 人工时间
        if (manualTime) {
          if (manualTime[0]) {
            searchQuery.manualTimeBegin = getFormatDateTime(manualTime[0])
          }
          if (manualTime[1]) {
            searchQuery.manualTimeEnd = getFormatDateTime(manualTime[1])
          }
          delete searchQuery.manualTime
        }

        // 创建时间
        if (createTime) {
          if (createTime[0]) {
            searchQuery.createTimeBegin = getFormatDateTime(createTime[0])
          }
          if (createTime[1]) {
            searchQuery.createTimeEnd = getFormatDateTime(createTime[1])
          }
          delete searchQuery.createTime
        }

        // 开始时间
        if (beginTime) {
          if (beginTime[0]) {
            searchQuery.beginTimeBegin = getFormatDateTime(beginTime[0])
          }
          if (beginTime[1]) {
            searchQuery.beginTimeEnd = getFormatDateTime(beginTime[1])
          }
          delete searchQuery.beginTime
        }

        // 结束时间
        if (endTime) {
          if (endTime[0]) {
            searchQuery.endTimeBegin = getFormatDateTime(endTime[0])
          }
          if (endTime[1]) {
            searchQuery.endTimeEnd = getFormatDateTime(endTime[1])
          }
          delete searchQuery.endTime
        }

        // 高级查询回显
        let tempObj = this.advSearchBack(searchQuery)
        this.search[this.activeName].isChildren.adv.badgeList = tempObj

        // 结束类型
        if (searchQuery.finishKey) {
          searchQuery.finishKey = {'$in': this.getSubFinishKey(searchQuery.finishKey)}
        }
        Object.assign(searchQuery, {
          page: 1,
          limit: 10
        })
        this.loading = true
        this.search[this.activeName].pagination.currentPage = 1
        this.search[this.activeName].isChildren.lastQuery = searchQuery
        getWebchatList(this.$store, this.activeName, searchQuery).then(() => {
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
          if (searchQuery[key] && key === 'showInvite') {
            tmpObj[key] = this.$t('webchat.activeSession')
          }
        }

        return tmpObj
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
        }
        for (let key in this.search[this.activeName].isChildren.nomalForm) {
          this.search[this.activeName].isChildren.nomalForm[key] = null
        }
        this.search[this.activeName].isChildren.adv.badgeList = null
        for (let key in this.search[this.activeName].isChildren.nomalForm) {
          this.search[this.activeName].isChildren.nomalForm[key] = null
        }
        this.search[this.activeName].isChildren.lastQuery = null
      },
      handleRefresh () {
        if (this.search.isAdvSearch) {
          this.advSearch()
        } else {
          this.handlerQuickSearch(this.search[this.activeName].isChildren.nomalForm.query)
        }
      },
      handlerSelectChange (selectObj) {
        let selectName = selectObj.selectName
        let selectValue = selectObj.selectValue

        if (selectName === 'ownercom' || selectName === 'owner' || selectName === 'ownerdep') {
          this.search[this.activeName].isChildren.adv.form.ownercom = null
          this.search[this.activeName].isChildren.adv.form.owner = null
          this.search[this.activeName].isChildren.adv.form.ownerdep = null
          if (selectObj.selectName === 'owner') {
            this.search[this.activeName].isChildren.adv.form.user = selectValue
          } else {
            this.search[this.activeName].isChildren.adv.form[selectName] = selectValue
          }
        }
      },
      removeBadge () {
        this.advSearch(true)
        this.resetTimeSearch = true
        this.clearChecked = Math.random()
        let that = this
        this.$store.dispatch('updateTimeSearchState', false).then(() => {
          if (that.$route.fullPath.split('/')[3] === 'webchat_todo') {
            that.$router.push({path: '/index/webchat/webchat_todo'})
          }
        })
      },
      // 获取options下所有key
      getSubFinishKey (superKey) {
        let result = [superKey]
        let finishMap = this.getSubFinishMap(superKey)
        let iteratorDic = function (options = []) {
          for (let i = 0; i < options.length; i++) {
            result.push(options[i].key)
            if (options[i].options && options[i].options.length > 0) {
              iteratorDic(options[i].options)
            }
          }
        }
        iteratorDic(finishMap)
        return result
      },
      // 获取options对象
      getSubFinishMap (superKey) {
        let result = []
        let options = this.getChannelDicByType('webchat') || []
        for (let i = 0; i < options.length; i++) {
          if (superKey === options[i].key) {
            result = options[i].options
            break
          }
          let options2 = options[i].options || []
          for (let j = 0; j < options2.length; j++) {
            if (superKey === options2[j].key) {
              result = options2[j].options
              break
            }
            let options3 = options2[j].options || []
            for (let k = 0; k < options3.length; k++) {
              if (superKey === options3[k].key) {
                result = options3[k].options
                break
              }
            }
          }
        }
        return result
      },

      // 导出在线咨询聊天记录
      exportWebchat () {
        let queryBadge = this.search[this.activeName].isChildren.adv.badgeList
        if (!queryBadge || isEmpty(queryBadge.finishKey)) {
          this.$message.error(this.$t('webchat.haveNoDealStatus'))
          return
        }
        let query = deepClone(this.search[this.activeName].isChildren.lastQuery)
        Object.assign(query, {account: this.$store.state.session.account.account})
        let data = {
          Method: 'exportWebchat',
          Query: query
        }
        exportWebchatList(this.$store, data)
      },
      getChannelDicByType (type) {
        let channelDic = this.$store.state.session.dicMap.channelDic
        let result = []
        for (let i = 0; i < channelDic.length; i++) {
          if (channelDic[i].type === type) {
            result = channelDic[i].options
            break
          }
        }
        return result
      },
      initLimitNum () {
        let currentUser = this.$store.state[this.type].currentUser
        let max = parseInt(currentUser.maxImDealCount)
        let min = parseInt(currentUser.minImDealCount)
        if (currentUser.imDealCount < min) {
          currentUser.imDealCount = min
        } else if (currentUser.imDealCount > max) {
          currentUser.imDealCount = max
        }
        this.webchatLimit.value = currentUser.imDealCount
        for (let i = min; i <= max; i++) {
          this.webchatLimit.options.push({label: i, value: i})
        }
      },
      closePopConversation () {
        this.popConversationInfo.open = false
      },
      inviteInfo () {
        let that = this
        this.$store.dispatch('getSessionsByAccount', {pageSize: 10, page: 1}).then((res) => {
          if (res.success) {
            that.popConversationInfo.open = true
          }
        })
      }
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
      tabPanes () {
        let todoNum = parseInt(deepClone(this.$store.state.webchat.todoNum))
        let listCount = this.$store.state.webchat.webchatList.webchat_todo.count
        if (listCount > todoNum) {
          todoNum = listCount
        }
        if (todoNum > 99) {
          todoNum = '99+'
        }
        return [
          {name: this.$t('webchat.webchatTodo') + todoNum, type: 'webchat_todo'},
          {name: this.$t('webchat.webchatAll'), type: 'webchat_all'}
        ]
      }
    },
    components: {
      WebchatCard,
      Search,
      PopDragConversation,
      CardGroupSolt,
      InputSearch,
      AdvancedSearch,
      AdvSchBadge,
      Pagination,
      TimeSearch,
      Refresh,
      Export
    }
  }
  function getFinishType (finishOption) {
    let finishKeys = []
    for (let i = 0; i < finishOption.length; i++) {
      finishKeys.push({label: finishOption[i].name, value: `${finishOption[i].key}__${finishOption[i].name}`})
      let level2 = deepClone(finishOption[i].options)
      if (level2) {
        for (let m = 0; m < level2.length; m++) {
          level2[m].name = finishOption[i].name + '->' + level2[m].name
          finishKeys.push({label: level2[m].name, value: `${level2[m].key}__${level2[m].name}`})
          let level3 = deepClone(level2[m].options)
          if (level3) {
            for (let n = 0; n < level3.length; n++) {
              level3[n].name = level2[m].name + '->' + level3[n].name
              finishKeys.push({label: level3[n].name, value: `${level3[n].key}__${level3[n].name}`})
            }
          }
        }
      }
    }
    return finishKeys
  }
  function exportWebchatList (store, data) {
    return store.dispatch('exportWebchat', data)
  }
  function getWebchatList (store, tabName, data) {
    data.submenu = tabName
    return store.dispatch('queryWebchatList', data)
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .loading
    z-index 1999
    height 500px
  .card_list_select
    max-width 80px
  .time_search
    margin-left auto
    max-width 180px
    margin-right 0px !important
  .chat_limit
    width 70px
  .font12
    margin 0 7px
    color $cf-gray1
</style>
