<template>
  <div class="customizeListQuery">
    <div class="f-title">
      <!--撞单查询-->
      {{$t('customer.HitSingleQuery')}}
    </div>
    <div class="f-content">
      <div class="tables">
        <div class="deploy">
          <div class="input-search">
            <input-search :placeHolder="search.placeHolder" :form="search['customer_all'].isChildren.nomalForm" @quickSearch="handlerQuickSearch"></input-search>
          </div>
          <div class="search-pagination">
            <Pagination
              :small="true"
              :currentPage="currentPage"
              :count="total"
              @turnPage="turnPage"
              :totalPage="totalPage"
            >
            </Pagination>
          </div>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" v-loading = "tableLoading">
          <el-table-column prop="name" label="客户名称" min-width="200">

          </el-table-column>
          <el-table-column prop="owner" label="所属人" min-width="80">
            <template scope="scope">
              <agent :id="scope.row.owner" :isNum="false" :isnull="true"></agent>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<div class="input-search">-->
        <!--<input-search :placeHolder="search.placeHolder" :form="search['customer_all'].isChildren.nomalForm" @quickSearch="handlerQuickSearch"></input-search>-->
      <!--</div>-->
      <!--<div class="main-form">-->
        <!--<el-table :data="tableData" stripe style="width: 100%" v-loading = "tableLoading">-->
          <!--<el-table-column prop="name" label="客户名称" min-width="200">-->

          <!--</el-table-column>-->
          <!--<el-table-column prop="owner" label="所属人" min-width="80">-->
            <!--<template scope="scope">-->
              <!--<agent :id="scope.row.owner" :isNum="false" :isnull="true"></agent>-->
            <!--</template>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
        <!--<div class="footer">-->
          <!--<span class="fl">查询结果：{{total}}</span>-->
          <!--<el-pagination-->
            <!--class="fr"-->
            <!--@current-change="handleCurrentChange"-->
            <!--:current-page="currentPage"-->
            <!--:page-size="pageSize"-->
            <!--:total="total"-->
            <!--layout=" prev, pager, next"-->
          <!--&gt;</el-pagination>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script>
  import InputSearch from '../../public-modules/card/search/InputSearch'
  import Agent from '../../public-modules/cache/Agent.vue'
  import Pagination from '../../public-modules/card/Pagination'
  /**
   * CoustomizelistQuery  撞单查询列表组件
   * @author yangjiao
   * @path components/business-modules/customer/CoustomizelistQuery.vue
   * @methods
   * getList 回调数据 获取列表 总条数
   * handleCurrentChange 点击页码触发的事件
   * handlerQuickSearch 搜索功能
   */
  export default {
    name: 'CoustomizeFastSearch',
    data () {
      return {
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        agents: [],
        total: 0,
        tableLoading: false,
        searchValue: '',
        search: {
          isSearch: false,
          placeHolder: this.$t('customer.enterNameOrPhoneForQuery'),
          customer_all: {
            pagination: {
              small: true,
              currentPage: 1
            },
            show: true,
            isChildren: {
              rel: true,
              nomal: true,
              nomalForm: { value: '', query: '' }
            }
          }
        }
      }
    },
    computed: {
      totalPage () {
        return Math.ceil(this.total / this.pageSize) || 0
      }
    },
    methods: {
      getList (resp) {
        this.tableData = resp.list
        this.tableLoading = false
        this.total = resp.count
      },
      turnPage (val) {
        this.currentPage = val
        this.tableLoading = true
        this.$store.dispatch('queryCustomerHitList', {limit: 10, page: val, combox: this.searchValue}).then(resp => {
          this.getList(resp)
        })
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.tableLoading = true
        this.$store.dispatch('queryCustomerHitList', {limit: 10, page: val, combox: this.searchValue}).then(resp => {
          this.getList(resp)
        })
      },
      // 快捷搜索 - input
      handlerQuickSearch (value) {
        this.search.isSearch = true
        this.currentPage = 1
        this.searchValue = value
        this.tableLoading = true
        this.$store.dispatch('queryCustomerHitList', {limit: 10, page: 1, combox: value}).then(resp => {
          this.getList(resp)
        })
      }
    },
    components: {
      InputSearch,
      Agent,
      Pagination
    },
    beforeMount () {
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../assets/common.styl"
  .search-pagination
    float right
  .customizeListQuery
    .tables
      padding: 15px 20px 0 20px;
      .deploy
        height 50px
        border 1px solid #e7e7eb
        border-bottom none
        padding-left 10px
        .page
          margin-top 10px
        .el-pagination
          padding 0
    .el-dialog
      .scoring
        text-align center
        color #fff
        margin-top 40px
        span
          display inline-block
          padding 10px 26px
          border-radius 4px
          cursor pointer
        .off
          background #7bcdd2
        .save
          background #1abb9c
          margin-left 40px
      .el-row
        margin-top 12px
        color #8f8f8f
        .el-col-7
        .el-col-11
          line-height 36px
        .el-col-13
          .totalScore
            color #7bcdd2
  .customizeListQuery
    .f-title
      border-bottom 1px solid $c-border1
      height 39px
      line-height 39px
      padding-left 24px
      background $cf-white
      font-size 18px
      color $cf-gray1
    .f-content
      height calc(100vh - 96px)
      overflow-y auto
      .input-search
        width 300px
        margin-bottom 10px
        margin-left -10px
        float left
        padding-top 10px
      .main-form
        .modifybutton
          width 30px
          margin-right 5px
          border none
          height 20px
          font-size 14px
          text-align center
        .footer
          margin-top 4px
</style>
