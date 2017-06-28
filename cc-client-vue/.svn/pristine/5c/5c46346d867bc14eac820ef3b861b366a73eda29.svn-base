<template>
  <div class="customizeExport">
    <div class="f-title">
      <!--导出任务列表-->
      {{$t('customer.exportTaskList')}}
      <!--刷新-->
      <span @click.stop="freshSearch" class="refresh"><i class="iconfont icon-shuaxin"></i></span>

    </div>
    <div class="tables">
      <div class="deploy">
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
        <el-table-column prop="createTime" label="创建时间" min-width="200">

        </el-table-column>
        <el-table-column prop="flag" label="导出进度" min-width="80">

        </el-table-column>
        <el-table-column label="操作" width="130">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              v-if = "scope.row.flag === '完成'">
              <!--@click.native.prevent="handleDownLoad(scope.$index, scope.row)">-->
              <!--下载-->
              <a :href="handleDownLoad(scope.$index, scope.row)" download>{{$t('public.download')}}</a>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--<div class="f-content">-->
      <!--<div class="main-form">-->
        <!--<el-table :data="tableData" stripe style="width: 100%" v-loading = "tableLoading">-->
          <!--<el-table-column prop="createTime" label="创建时间" min-width="200">-->

          <!--</el-table-column>-->
          <!--<el-table-column prop="flag" label="导出进度" min-width="80">-->

          <!--</el-table-column>-->
          <!--<el-table-column label="操作" width="130">-->
            <!--<template scope="scope">-->
              <!--<el-button-->
                <!--type="text"-->
                <!--size="small"-->
                <!--v-if = "scope.row.flag === '完成'">-->
                <!--&lt;!&ndash;@click.native.prevent="handleDownLoad(scope.$index, scope.row)">&ndash;&gt;-->
                <!--&lt;!&ndash;下载&ndash;&gt;-->
                <!--<a :href="handleDownLoad(scope.$index, scope.row)" download>{{$t('public.download')}}</a>-->
              <!--</el-button>-->
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
    <!--</div>-->
  </div>
</template>
<script>
  /**
   * CoustomizeExport 导出任务列表组件
   * @author yangjiao
   * @path components/business-modules/customer/CoustomizeExport.vue
   * @methods
   * getList 回调数据 导出进度处理成中文，对应字段包含 export 正在导出 finish 完成 download 已下载
   * handleCurrentChange 点击页码触发的事件
   * freshSearch 点击刷新触法的事件
   * handleDownLoad 下载事件
   */
  import Pagination from '../../public-modules/card/Pagination'
  export default {
    name: 'CoustomizeExport',
    data () {
      return {
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        tableLoading: false,
        total: 0
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
        this.tableData.forEach((item, index) => {
          item.flag = this.$t(`customer.${item.flag}`)
        })
        this.total = resp.count
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.tableLoading = true
        this.$store.dispatch('queryCustomerExportTaskList', {limit: 10, page: val}).then(resp => {
          this.getList(resp)
        })
      },
      turnPage (val) {
        this.currentPage = val
        this.tableLoading = true
        this.$store.dispatch('queryCustomerExportTaskList', {limit: 10, page: val}).then(resp => {
          this.getList(resp)
        })
      },
      freshSearch () {
        this.tableLoading = true
        this.$store.dispatch('queryCustomerExportTaskList', {limit: 10, page: this.currentPage}).then(resp => {
          this.getList(resp)
        })
      },
      handleDownLoad (index, item) {
        return item.path
      }
    },
    components: {
      Pagination
    },
    beforeMount () {
      this.tableLoading = true
      this.$store.dispatch('queryCustomerExportTaskList', {limit: 10, page: 1}).then(resp => {
        this.getList(resp)
      })
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../assets/common.styl"
  .search-pagination
    float right
  .customizeExport
    .tables
      padding: 15px 20px 0 20px;
      .deploy
        height 48px
        color #989898
        border 1px solid #ebebeb
        border-bottom none
        padding-left 14px
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
  .customizeExport
    .f-title
      border-bottom 1px solid $c-border1
      height 39px
      line-height 39px
      background $cf-white
      padding-left 24px
      font-size 18px
      color $cf-gray1
      .refresh
        width 70px
        border none
        height 31px
        font-size 20px
        color $c-main
        cursor pointer
        position absolute
        right -30px
        .icon-shuaxin
          font-size 20px
    .f-content
      height calc(100vh - 96px)
      padding-right 5.5%
      overflow-y auto
      margin 10px 0 0 30px
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
