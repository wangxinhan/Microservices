<template>
  <div class="customizeFast">
    <div class="f-title">
      <!--自定义快捷搜索-->
      {{$t('customer.CustomerSearch.CustomizeFastSearch')}}
    </div>
    <div class="f-content">
      <div class="deploy">
        <div class="fl">
          <div class="addSearch" @click.stop="addSearch"><i class="el-icon-plus el-icon--right"></i>&nbsp;{{$t('public.add2')}}</div>
        </div>
        <div class="fr">
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
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="kName" :label="$t('customer.CustomerSearch.name')" min-width="200">

        </el-table-column>
        <el-table-column prop="displayName" :label="$t('public.creator')" min-width="80">

        </el-table-column>
        <el-table-column prop="createTime" :label="$t('public.createTime')" min-width="150">

        </el-table-column>
        <el-table-column prop="menuName" :label="$t('public.menu')" min-width="100">

        </el-table-column>
        <el-table-column :label="$t('public.operate')" width="130">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="handleModify(scope.$index, scope.row)">
              {{$t('public.edit')}}
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="handleDelete(scope.$index, scope.row)">
              {{$t('public.delete')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <customize-dialog ref="CustomizeDialog"></customize-dialog>
  </div>
</template>
<script>
  import m7select from '../../public-modules/m7-select/m7-select.vue'
  import customizeDialog from './CustomizeSearchDialog.vue'
  import Pagination from '../../public-modules/card/Pagination'
  export default {
    name: 'CoustomizeFastSearch',
    data () {
      return {
        currentPage: 1,
        pageSize: 10
      }
    },
    methods: {
      turnPage (val) {
        this.currentPage = val
        this.$store.dispatch('queryCustomerQuickSearchList', {limit: 10, page: val})
      },
      addSearch () {
        this.$refs.CustomizeDialog.open()
      },
      handleDelete (index, item) {
        // 删除弹窗提示
        this.$confirm(this.$t('customer.CustomerSearch.deleteCustomerSearchTips', {kName: item.kName}), this.$t('customer.CustomerSearch.confirmDelete'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteCustomerQuickSearch', {kId: item._id})
        })
      },
      handleModify (index, item) {
        this.$refs.CustomizeDialog.open(this.$store.state.customer.quickSearchList.list[index])
      }
    },
    computed: {
      tableData () {
        return this.$store.state.customer.quickSearchList.list
      },
      total () {
        return this.$store.state.customer.quickSearchList.count
      },
      totalPage () {
        return Math.ceil(this.total / this.pageSize)
      }
    },
    components: {
      customizeDialog,
      Pagination,
      m7select
    },
    beforeMount () {
      this.$store.dispatch('queryCustomerQuickSearchList', {limit: 10, page: 1})
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../assets/common.styl"
  .customizeFast
    .f-title
      border-bottom 1px solid $c-border1
      height 39px
      line-height 39px
      padding-left 24px
      background $cf-white
      font-size 18px
      color $cf-gray1
    .f-content
      padding: 15px 20px 0 20px
      .addSearch
        color #1abb9c
        cursor pointer
        line-height 48px
        font-size 14px
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
      .modifybutton
        width 30px
        margin-right 5px
        border none
        height 20px
        font-size 12px
        text-align center

</style>
