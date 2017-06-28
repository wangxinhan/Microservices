<template>
  <div class="si-search">
    <div class="search-wrap">
      <el-input size="small" class="inp-batch-search" :placeholder="$t('sms.enterBatchNumToSearch')" icon="search" :on-icon-click="handleSearchClick" v-model.trim="ruleForm.batchNo">
        <template slot="prepend">
          <el-button class="el-icon-arrow-down" @click.stop="isShowSearchCon"></el-button>
        </template>
      </el-input>
      <span class="search-tip">{{curCount}}/{{count}}{{$t('sms.tiaoJieGuo')}}</span>
      <reFresh @refresh="handleRefresh"></reFresh>
      <el-tooltip class="item" effect="dark" :content="$t('sms.addTempTask')" placement="left">
        <i class="el-icon-plus" @click.stop="goAddTemplate"></i>
      </el-tooltip>
    </div>
    <transition name="fade">
      <div v-if="showCollapse" class="collapse-wrap">
        <div class="imp-task-status-wrap">
          <span>{{$t('sms.importState')}}</span>
          <el-select v-model.trim="ruleForm.impTaskSta" :placeholder="$t('public.pleasePick')" size="small">
            <el-option
              :label="$t('public.all')"
              :value="''">
            </el-option>
            <el-option
              v-for="item in impTaskStatus"
              :label="item.code_name"
              :value="item.code_value">
            </el-option>
          </el-select>
        </div>
        <div class="date-picker-wrap">
          <span>{{$t('public.createTime')}}</span>
          <el-date-picker
            v-model.trim="ruleForm.date"
            type="datetimerange"
            :picker-options="pickerOptions2"
            :editable="boolean"
            :placeholder="$t('sms.choTimeScope')"
            align="right"
            size="small"
            class="date-picker">
          </el-date-picker>
        </div>
        <!--<div class="reset-search-btn">-->
          <!--<el-button @click.stop="resetSearch">{{$t('public.reset')}}</el-button>-->
        <!--</div>-->
      </div>
    </transition>
    <div class="cardlist-wrap">
      <el-menu
        style="min-height: 76px;"
        v-loading="loading"
        :router="active"
        default-active="1" @select="">
        <el-menu-item
          class="card"
          v-for="(item, index) in cardList"
          :index="handleSplit(item.batchNo)"
          :class="{'is-active': $route.path.split('/')[4] === item._id}"
          >
          <div class="card-info">
            <ul>
              <li class="card-info-title">{{item.batchNo}}</li>
              <li><span class="card-info-state" :class="item.flag">{{item.flagName}}</span></li>
            </ul>
          </div>
          <div class="card-time">
            <span>{{item.createTime}}</span>
          </div>
        </el-menu-item>
        <div v-if="count === 0">
          <span class="no-data">
            {{$t('sms.noData')}}
          </span>
        </div>
        <div v-if="isShowMoreBtn && !loading">
          <el-button class="more" @click.stop="moreCardList">
            {{$t('sms.more')}}
          </el-button>
        </div>
      </el-menu>
    </div>
  </div>
</template>
<script>
  import reFresh from 'components/ui-modules/icon/Refresh.vue'
  import {getCache, getFormatDateTime} from '../../../../utils/m7Utils.js'
  export default {
    name: 'siSearch',
    props: {
      refresh: String
    },
    data () {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: this.$t('sms.thisOneWeek'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.$t('sms.thisOneMonth'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.$t('sms.thisThreeMonth'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        loading: false,
        boolean: false,
//        双向绑定的搜索数据
        ruleForm: {
          date: '',
          impTaskSta: '',
          batchNo: ''
        },
//        option为接口参数
        option: {
          index: 1,
          pageSize: 10
        },
        active: true,
        pageTotal: '',
        impTaskStatus: [],
        showCollapse: false,
        cardList: [],
        count: '',
        curCount: '',
        isShowMoreBtn: true
      }
    },
    methods: {
//        重置查询条件
      resetSearch () {
        this.ruleForm.date = ''
        this.ruleForm.impTaskSta = ''
      },
//      查询条件 展示 隐藏按钮
      isShowSearchCon () {
        this.showCollapse = !this.showCollapse
        this.resetSearch()
      },
//        搜索功能
      handleSearch () {
        this.loading = true
        this.isShowMoreBtn = true
        let data = {
          query: {
            flag: this.ruleForm.impTaskSta,
            batchNo: this.ruleForm.batchNo
          },
          queryType: 'import_mass_sms',
          option: {
            index: this.option.index,
            pageSize: this.option.pageSize
          }
        }
        let notifyTime = this.ruleForm.date
        if (notifyTime) {
          if (notifyTime[0]) {
            let createTimeStart = getFormatDateTime(notifyTime[0])
            data.query.createTime_begin_date = createTimeStart.substr(0, 10)
            data.query.createTime_begin_time = createTimeStart.substr(11, 5)
          }
          if (notifyTime[1]) {
            let createTimeEnd = getFormatDateTime(notifyTime[1])
            data.query.createTime_end_date = createTimeEnd.substr(0, 10)
            data.query.createTime_end_time = createTimeEnd.substr(11, 5)
          }
        }
        let self = this
        this.$store.dispatch('querySmsImportTask', data).then(() => {
          self.count = self.$store.state.sms.smsImportTask.count
          self.pageTotal = Math.ceil(self.count / self.option.pageSize)
          self.curCount = self.option.pageSize * this.option.index
          if (self.curCount >= self.count) {
            self.curCount = self.count
            self.isShowMoreBtn = false
          }
          self.cardList = self.cardList.concat(self.$store.state.sms.smsImportTask.list)
          for (var i in self.cardList) {
            let cardListFlag = self.cardList[i].flag
            let impTaskStatus = this.impTaskStatus
            for (var j in impTaskStatus) {
              if (impTaskStatus[j].code_value === cardListFlag) {
                self.cardList[i].flagName = impTaskStatus[j].code_name
              }
            }
          }
          self.loading = false
        })
      },
//      点击搜索
      handleSearchClick () {
        this.option.index = 1
        this.cardList = []
        this.handleSearch()
      },
//      点击刷新
      handleRefresh () {
        this.option.index = 1
        this.cardList = []
        this.handleSearch()
      },
//      点击查看更多
      moreCardList () {
        this.option.index += 1
        if (this.option.index > this.pageTotal) {
          this.option.index = this.pageTotal
          return
        }
        this.handleSearch()
      },
//       按照 卡片的_id不同设置不同路由
      handleSplit (index) {
        return '/index/sms/import/task/' + index
      },
//      添加模板任务
      goAddTemplate () {
        this.$router.push({path: '/index/sms/import/addTemplate'})
      }
    },
    computed: {
      refreshLeft () {
        return this.$store.state.sms.refreshLeft
      }
    },
    components: {
      reFresh
    },
    watch: {
//        tab切换 加载数据
//      refresh (cur, old) {
//        if (cur === 'import') {
//          this.handleSearchClick()
//        }
//      }
      refreshLeft (cur, pre) {
        cur === 'refreshLeft' ? this.handleRefresh() : ''
        this.$store.commit('sms/REFRESH_LEFT', '')
      }
    },
    beforeMount () {
//        搜索条件预加载
      this.impTaskStatus = getCache('impTaskStatus')
      this.handleSearchClick()
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../../assets/common.styl"
  .si-search::-webkit-scrollbar
    display none
  .si-search
    width 340px
    height calc(100vh - 95px)
    overflow-y scroll
    float left
    border-right 1px solid #d3d3d3
    .search-wrap
      padding 9px 0 10px 10px
      /*padding-right 0px*/
      border-bottom 1px solid $c-border1
      .inp-batch-search
        width 180px
        font-size 12px
      .search-tip
        color $cf-gray1
        margin-left 4px
      .el-tooltip.item.el-icon-plus
        float right
        font-size 16px
        color $c-main
        float right
        margin 6px 8px 0 0
        cursor pointer
      .icon-refresh
        float right
        margin-top 6px
        margin-right 12px
    .fade-enter-active
    .fade-leave-active
      transition opacity .5s
    .fade-enter
    .fade-leave-to
      opacity 0
    .collapse-wrap
      padding 10px
      background-color #fbfdff
      color $cf-gray1
      position relative
      .date-picker-wrap
        margin-top 10px
        .date-picker
          width 230px
          margin-left 10px
      .imp-task-status-wrap
        .el-select
          width 230px
          margin-left 10px
      .reset-search-btn
        position absolute
        right 20px
        top 30px
        .el-button
          display inline-block
          width 66px
          height 20px
          font-size 12px
          line-height 20px
          text-align center
          color #fff
          padding 0
          background #7ccdd1
          border 1px solid #7ccdd1
    .cardlist-wrap
      height calc(100vh - 146px)
      width 100%
      /*padding-bottom 20px*/
      overflow auto
      .more
        margin 12px 0  20px 20px
        width 300px
        height 30px
        line-height 30px
        font-size 12px
        text-align center
        color #fff
        padding 0
        background #1aba9c
        border 1px solid #1aba9c
      .el-menu-item
        height auto
        line-height inherit
        padding 0 0 10px 0
        background-color #fff
      .no-data
        display block
        padding 12px 10px 0
        height 76px
        background-color #fff
        color #43d5dd
      .el-menu-item.is-active
        background-color #e8f5fc
      .card:hover
      .card:active
        background-color $c-card
      .card
        height 60px
        width 100%
        border-bottom 1px solid $c-border1
        background-color #fff
        display flex
        cursor pointer
        .card-info
          flex 8
          display flex
          .card-info-title
            font-size 12px
            font-weight bolder
            color #000
            margin-top 6px
            margin-bottom 6px
          .card-info-state
            padding 3px 10px
            border-radius 4px
            text-align center
            color #fff
            font-size 12px
          .finish
            background-color #7bcdd2
          .failure
            background-color #e3746f
          .import
          .start
          .process
            background-color #f5a623
        .card-time
          flex 4
          display flex
          padding 5px 10px 0 0
          color $cf-gray4
</style>
