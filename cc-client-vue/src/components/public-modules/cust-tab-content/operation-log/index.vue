<template>
<div class="change-log">
  <div v-loading="loading" v-if="refresh==='changeLog'">
    <el-row class="filter-tab">
      <el-col :span="10" class="til">
      <span class="clock">
        <i class="iconfont icon-zongshichang"></i>
      </span>
        {{$t('customer.changeLogCount', { count })}}
      </el-col>
      <el-col :span="14">
        <div class="right">
          <el-button type="text" class="refre" :loading="loading" @click.stop="refreshBtn"><i v-if="!loading" class="iconfont icon-shuaxin"></i></el-button>
          <el-dropdown trigger="click" @command="handleCommandTime" class="opration" menu-align="start">
          <span class="el-dropdown-link">
            {{$t('customer.changeLogUser', { count })}}: <span class="ellipsis filter-time-name">{{filterTimeName}}</span><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in agents" :command="item.type">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" @command="handleCommandType" menu-align="start">
          <span class="el-dropdown-link">
          {{$t('public.type')}}: <span>{{filterTypeName}}</span><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in businessType" :command="item.type">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <ul>
          <template v-for="con in cons" >
            <li v-if="con.detail==1" class="treat">
              <span class="bac">{{con.time}}</span>
              <p>{{con.sort}}</p>
              <h3>{{con.status}}</h3>
            </li>
            <li v-if="con.detail==2" class="treat">
              <span class="bac d-bac"></span>
              <i></i>
              <h3 class="date"><span>{{con.sort}}</span>{{con.status}}</h3>
            </li>
          </template>
        </ul>
      </el-col>
    </el-row>
    <el-row v-if="isLoadMoreShow">
      <el-col class="next-page">
        <div class="btn" @click.stop="loadMore"><i class="iconfont icon-shuaxin"><span>{{$t('public.loadMore')}}</span></i></div>
      </el-col>
    </el-row>
  </div>
  <!--通话标签的操作日志-->
  <div v-if="labelOperaHistory">
    <el-row>
      <el-col :span="24">
        <ul class="lable-history-wrap">
          <template v-for="item in newLabelOpearHistory" >
            <li class="treat" v-if="item.detail === 1">
              <span class="bac d-bac">{{item.time}}</span>
              <span class="public-padding label-operatior">{{getAgentName(item.operator)}}</span>&nbsp;
              <span class="public-padding" v-if="item.opertaion ==='add'">{{$t('call.hadAddLabel')}}</span>
              <span class="public-padding" v-else-if="item.opertaion ==='delete'">{{$t('call.hadDelLabel')}}</span>
              <span class="public-padding" v-else>{{$t('call.hadRecoverLabel')}}</span>&nbsp;[
              <span class="public-padding label-color" v-if="item.opertaion === 'recover'">{{getRecoverName(item.name)}}</span>
              <span class="public-padding label-color" v-else>{{item.name[0]}}</span>]
            </li>
            <li class="treat" v-if="item.detail === 2">
              <span class="bac d-bac"></span>
              <i></i>
              <h3 class="date"><span>{{item.sort}}</span>{{item.status}}</h3>
            </li>
          </template>
        </ul>
      </el-col>
    </el-row>
  </div>
</div>
</template>
<script>
  import { getCache } from '../../../../utils/m7Utils.js'
  export default {
    name: 'changeLog',
    data () {
      return {
        loading: true,
        businessType: [
          { type: '', name: this.$t('public.all') },
          { type: 'add', name: this.$t('customer.changeLogType.add') },
          { type: 'import', name: this.$t('customer.changeLogType.import') },
          { type: 'update', name: this.$t('customer.changeLogType.update') },
          { type: 'updateStatus', name: this.$t('customer.changeLogType.updateStatus') },
          { type: 'updateOwner', name: this.$t('customer.changeLogType.updateOwner') },
          { type: 'updateSource', name: this.$t('customer.changeLogType.updateSource') },
          { type: 'assign', name: this.$t('customer.changeLogType.assign') },
          { type: 'batchUpdateStatus', name: this.$t('customer.changeLogType.batchUpdateStatus') },
          { type: 'claim', name: this.$t('customer.changeLogType.claim') },
          { type: 'autoAssignPool', name: this.$t('customer.changeLogType.autoAssignPool') },
          { type: 'recyclePool', name: this.$t('customer.changeLogType.recyclePool') },
          { type: 'changePool', name: this.$t('customer.changeLogType.changePool') },
          { type: 'updateSysStatus', name: this.$t('customer.changeLogType.updateSysStatus') },
          { type: 'mergeCust', name: this.$t('customer.changeLogType.mergeCust') }
        ],
        agents: [
          { type: '', name: this.$t('public.all') },
          { type: 'system', name: this.$t('public.system') }
        ],
        filterTime: '',
        filterType: '',
        cons: [],
        count: 0,
        data: {
          cid: this.cid,
          limit: 10,
          page: 1
        },
        changeLog: '',
        isLoadMoreShow: false
      }
    },
    props: {
      cid: String,
      refresh: String,
      labelOperaHistory: Array
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'changeLog') {
          let data = {
            cid: this.cid,
            limit: 10,
            page: 1
          }
          this.filterType = ''
          this.filterTime = ''
          this.data = data
          this.fetchData()
        }
      }
    },
    computed: {
      filterTypeName () {
        let that = this
        return this.businessType.filter(val => {
          return val.type === that.filterType
        })[0].name
      },
      filterTimeName () {
        let that = this
        return this.agents.filter(val => {
          return val.type === that.filterTime
        })[0].name
      },
      newLabelOpearHistory () { // 对数据进行分日期显示处理
        let list = this.labelOperaHistory
        let changeLog = {}
        list.forEach((log) => {
          let date = log.operateTime.split(' ')[0]
          let time = log.operateTime.split(' ')[1]
          time = `${time.split(':')[0]}:${time.split(':')[1]}`
          let datetime = `${date} ${time}`
          let formatLog = {
            date,
            time,
            datetime,
            operator: log.operator,
            opertaion: log.opertaion,
            name: log.name
          }
          if (changeLog[date]) {
            changeLog[date].push(formatLog)
          } else {
            changeLog[date] = []
            changeLog[date].push(formatLog)
          }
        })
        let valArr = []
        let indexArr = []
        for (let key in changeLog) {
          valArr.push(changeLog[key])
          indexArr.push(key)
        }
        let i = 0
        let j = 0
        let newData = []
        for (; i < indexArr.length; i++) {
          let obj = {}
          for (j = 0; j < valArr[i].length; j++) {
            obj = { // 一天中的所有记录
              time: valArr[i][j].time,
              operator: valArr[i][j].operator,
              name: valArr[i][j].name,
              opertaion: valArr[i][j].opertaion,
              detail: 1
            }
            newData.push(obj)
          }
          let is = indexArr[i].split('-')
          obj = { // 不同的月日
            time: '&nbsp;',
            sort: `${is[1]}/`,
            status: is[2],
            detail: 2
          }
          newData.push(obj)
        }
        return newData
      }
    },
    methods: {
      handleCommandTime (command) {
        this.filterTime = command
        this.fileContactHistory()
      },
      handleCommandType (command) {
        this.filterType = command
        this.fileContactHistory()
      },
      getAgentName (id) {
        let obj = getCache('agents', id)
        if (obj) {
          return obj.displayName
        } else {
          return ''
        }
      },
      getRecoverName (name) {
        let nameStr = ''
        for (let m = 0; m < name.length; m++) {
          nameStr += name[m] + '、'
        }
        return nameStr.substring(0, nameStr.length - 1)
      },
      initDataByCid () {
        if (this.cid && this.refresh === 'changeLog') {
          let data = {
            cid: this.cid,
            limit: 10,
            page: 1
          }
          this.data = data
          this.fetchData()
          this.nextPage = 1
        }
      },
      refreshBtn () {
        this.data.page = 1
        this.fetchData()
      },
      fileContactHistory () {
        let data = {
          type: this.filterType,
          user: this.filterTime,
          cid: this.cid,
          limit: 10,
          page: 1
        }
        this.data = data
        this.fetchData()
      },
      loadMore () {
        this.data.page++
        this.fetchData(true)
      },
      fetchData (isLoadMore) {
        this.loading = true
        return this.$store.dispatch('queryCustomerChangeLog', this.data).then(resp => {
          let val = resp.changeLog
          this.count = resp.count
          let valArr = []
          let indexArr = []
          let currCount = 0
          for (let key in val) {
            valArr.push(val[key])
            indexArr.push(key)
          }
          let i = 0
          let j = 0
          let cons = []
          for (; i < indexArr.length; i++) {
            let obj = {}
            for (j = 0; j < valArr[i].length; j++) {
              let content = valArr[i][j].content.split('|').reduce((to, from) => {
                return to + from
              })
              let change = this.$t(valArr[i][j].desc)
              obj = {
                time: valArr[i][j].time,
                sort: `${valArr[i][j].user} ${change}`,
                status: content,
                detail: 1
              }
              cons.push(obj)
            }
            let is = indexArr[i].split('-')
            obj = {
              time: '&nbsp;',
              sort: `${is[1]}/`,
              status: is[2],
              detail: 2
            }
            cons.push(obj)
          }

          if (isLoadMore) {
            let lastObj = this.cons[this.cons.length - 1]
            let hasDate = false
            for (let i = 0; i < cons.length; i++) {
              if (cons[i].sort === lastObj.sort && cons[i].status === lastObj.status) {
                hasDate = true
                break
              }
            }
            if (hasDate) {
              this.cons.pop()
            }
            this.cons.push(...cons)
          } else {
            this.cons = cons
          }
          this.cons.map(con => {
            if (con.detail === 1) {
              currCount++
            }
          })
          if (currCount < this.count) {
            this.isLoadMoreShow = true
          } else {
            this.isLoadMoreShow = false
          }

          this.loading = false
        })
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'agents' }).then(agents => {
        agents.map(agent => {
          this.agents.push({
            type: agent._id,
            name: agent.displayName + '[' + agent.exten + ']'
          })
        })
        this.initDataByCid()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/common.styl'
  .change-log
    height 100%
    .filter-tab
      /*margin 0 0 30px -56px*/
      padding 0 12px 12px
      &:before
        content ''
        height 1px
        width calc(100% + 40px)
        position absolute
        top 29px
        left -20px
        border-bottom 1px solid $c-border1
      .til
        color cf-gray3
      .right
        float right
        .opration
          margin-right 8px
        .el-dropdown-link
          color #1bbc9b
          cursor pointer
    .lable-history-wrap
      height 320px
      overflow auto
    ul
      padding 0 20px
    .refre
      color #1bbc9b
      display inline-block
      padding 0 12px 0 0
      .iconfont
        font-size 14px
    .treat
      position relative
      padding 18px 0 0 40px
      margin-left 56px
      border-left 1px solid #d3d3d3
      .public-padding
        padding-top 10px
      .label-color
        color #7bcdd2
        padding 0 4px
      i
        position absolute
        display inline-block
        width 30px
        border-bottom 1px solid #e6e6e6
        top @width
        left 8px
      img
        position relative
        top -4px
        margin 0 4px
      span
        display inline-block
      .bac
        font-size 12px
        width 62px
        height 14px
        position absolute
        top 30px
        left -56px
        margin-top 2px
        color #808080
        &:before
          content ""
          width 12px
          height 12px
          display inline-block
          float right
          border-radius 6px
          background-color $c-border1
      .d-bac
        top 22px
      .last
        background-color $cf-white
        background-position right top
        height 22px
        top 20px
      p
       font-size 12px
       color $cf-gray3
      h3
        font-size 14px
        margin-top 3px
        color $cf-gray0
        .blu
          color #86d1d5
        .re
          color #ddafee
      .date
        color $cf-white
        height 24px
        width 70px
        line-height 24px
        margin-top 0
        background #66bdc7
        text-align center
        border-radius 8px
        span
          font-size 18px
    li
      &:first-child
        border-left 0
        &:before
          content ""
          width 1px
          height 60px
          display inline-block
          position absolute
          top 35px
          left 0
          background-color #d3d3d3
      &:last-child
        min-height 20px
        margin-bottom 60px
  .clock
    display inline-block
    position  relative
    top  1px
    width 14px
    height 16px
    line-height 16px
    margin-right 8px
    .iconfont
      font-size 16px
  .filter-time-name
    display inline-block
    max-width 5em
    text-overflow ellipsis
    overflow hidden
    white-space nowrap
    vertical-align bottom
  .btn
    cursor pointer
    margin 0 auto
    width 130px
    color #fff
    text-align center
    background-color #1ebc9b
    line-height 30px
    height 30px
    border-radius 5px
    .icon-shuaxin
      display inline-block
      span
        font-size 12px
        float right
        padding-left 5px
  .next-page
    margin-bottom 20px
  .label-operatior
    max-width 8em
    text-overflow ellipsis
    overflow hidden
    white-space nowrap
    vertical-align bottom
</style>
