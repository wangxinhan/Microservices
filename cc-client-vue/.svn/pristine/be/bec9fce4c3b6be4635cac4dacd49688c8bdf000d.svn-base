<template>
  <!--customerShow 属性为true时显示 为true的情况在客户卡片列表 条数小于10条不显示分页，只显示总条数-->
  <div class="paginationNew" v-if="customerShow">
    <div class="page card-page page-new">
      <span v-if="!num" class="card-num">共{{resetCount}}条</span>
      <!--<span class="line" v-if="!num && count>9"></span>-->
      <!--<span>{{current || 1}}/{{totalPage ||1}}</span>-->
      <el-pagination
        v-if="count > 10"
        class="pagination-m7 fr pageNew"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-size="pageSize || 10"
        layout="pager"
        :small="true"
        :total="count"
      >
      </el-pagination>
    </div>
  </div>
  <!--customerShow 属性为false时显示 质检-->
  <div class="page" v-else-if="!customerShow">
    <span v-if="!num">共{{resetCount}}条</span>
    <span class="line" v-if="!num"></span>
    <span>{{current || 1}}/{{totalPage ||1}}</span>
    <el-pagination
      class="pagination-m7"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-size="pageSize||10"
      layout="prev,next"
      :small="true"
      :total="count"
    >
    </el-pagination>
  </div>
</template>
<script>
  /**
   * Pagination 分页组件
   * @author yangjiao
   * @path components/public-modules/card/Pagination.vue
   *
   * @property {Boolean} customerShow - true显示第一个 卡片列表最下面的分页显示 有页码 false 显示第二个 卡片列表切换的右侧，无页码
   * @property {Boolean} small - 分页组件的小大
   * @property {Number} currentPage - 当前页数
   * @property {Number} count - 总条数，默认为0
   * @property {String} type - 当前是在哪个模块  例如客户 工单  短信
   * @property {String} tabType - 当前所在的哪个列表下  如 全部 联系计划 我的客户
   * @property {Number} totalPage - 总页数
   * @property {Number} num - 报表传值，不显示总条数
   * @example
   *  <pagination
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
   */
  export default {
    name: 'Pagination',
    methods: {
      handleCurrentChange (val) {
        this.currPage = val
        this.$emit('turnPage', val)
      }
    },
    props: {
      customerShow: Boolean,
      small: Boolean,
      currentPage: Number,
      count: {
        type: Number,
        default: 0
      },
      type: String,
      tabType: String,
      totalPage: Number,
      num: Number,
      pageSize: Number
    },
    computed: {
      current () {
        return this.currentPage
      },
      resetCount () {
        let count = this.count || 0
        return count
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
.paginationNew
  position: absolute;
  bottom: -36px;
  min-height: 36px;
  width: 339px;
  margin-left: 1px;
  box-shadow: 0px -4px 6px -4px rgba(0,0,0,0.2);
  background: #fff;
  border-right 1px solid $c-border1
  -webkit-font-smoothing: antialiased;
.page
  display flex
  color $cf-gray1
.page-new
  display block
.card-page
  padding-top: 6px
.card-num
  padding-left: 5px
  float left
.pagination-m7
  background-color transparent
  padding 2px 0px
  padding-right 5px
.pageNew
  float right
  text-align right
.line
  margin 6px 5px
  height 12px
  border 1px solid $c-border1
span
  display inline-block
  line-height 28px
.el-pagination--small
  float right
  display inline-block
</style>
