<template>
  <div class="wrap" :class="!callScreen?'business-history-table':''">
    <affix :label="$t('business.businessHistory')">
      <el-row>
        <el-col class="history-business-num" :span="24">
          {{$t('business.countRecord', {count: tableData.count})}}
        </el-col>
        <div style="padding:0 50px;">
          <el-col :span="24" class="history-wrap" v-for="item in tableData.list">
            <div class="history-title clearfix">
              <a href="javascript:;" @click.stop="businessDetail(item._id)">{{item.businessTypeName}}<span v-if="item.number">&nbsp;(ID:{{item.number}})</span></a><span class="state process" v-if="!item.dispose">进行中</span><span class="state finish" v-else>已完成</span>
            </div>
            <div class="history-content">
              <div class="left">
                <p class="business-name">创建工单</p>
                <p class="agent">{{item.agentName}}</p>
                <p>{{item.createTime}}</p>
              </div>
              <div class="center">
                <div class="business-name arrow-icon">
                  <span v-for="i in 20" class="dot"></span>
                  <span class="arrow"></span>
                </div>
              </div>
              <div class="right">
                <p class="business-name">{{item.disposeDisplay}}</p>
                <p class="agent">{{item.masterName ? item.masterName: "----"}}&nbsp;</p>
                <p>{{item.lastUpdateTime}}</p>
              </div>
            </div>
          </el-col>
        </div>
        <el-col :span="24" class="next-page" v-if="isLoadMoreShow">
          <div class="btn" @click.stop="loadMore"><i class="iconfont icon-shuaxin"><span>{{$t('public.loadMore')}}</span></i></div>
        </el-col>
      </el-row>
    </affix>
    <el-dialog modal-append-to-body lock-scroll :top="!callScreen?'10%':''" :title="$t('business.businessHistoryDetail')" v-model="detailShow" :size="callScreen?'full':''" :modal="callScreen?false:true" @close="off">
      <business :busId="busId" :showHistory="true" v-if="detailShow" v-on:event="businessEvent"></business>
    </el-dialog>
  </div>
</template>
<script>
  import affix from '../../ui-modules/affix/Affix.vue'
  import business from '../../public-modules/cust-tab-content/business/index.vue'
  export default {
    name: 'BusinessHistoryTable',
    data () {
      return {
        isLoadMoreShow: false,
        data: {
          customer: this.cid,
          type: 'business',
          page: 1,
          limit: 20
        },
        tableData: {
          count: 0,
          list: []
        },
        loading: true,
        busId: '',
        detailShow: false
      }
    },
    props: {
      cid: String,
      callScreen: Boolean
    },
    computed: {
      refreshHistoryTable () {
        return this.$store.state.business.transCache.refreshCustomerBusinessHistory
      }
    },
    watch: {
      refreshHistoryTable () {
        if (this.refreshHistoryTable.customer === this.cid && this.loading) {
          this.data.page = 1
          this.tableData.list = []
          this.loading = false
          this.fetchData()
        }
      }
    },
    components: {
      affix,
      business
    },
    methods: {
      loadMore () {
        this.data.page++
        this.fetchData()
      },
      businessEvent (eventData) {
        if (eventData.event !== 'changeBusinessMaster') {
          this.$store.dispatch('getBusinessDetailById', {_id: this.busId})
        }
        this.$store.commit('business/REFRESH_CUSTOMER_BUSINESS_HISTORY', this.cid)
      },
      fetchData () {
        this.data.customer = this.cid
        this.$store.dispatch('queryCustomerBusinessHistory', this.data).then(val => {
          this.tableData.count = val.count
          if (val.list.length < 20) {
            this.isLoadMoreShow = false
          } else {
            this.isLoadMoreShow = true
          }
          this.tableData.list = this.tableData.list.concat(val.list)
          this.loading = true
        })
      },
      businessDetail (id) {
        this.$store.dispatch('getBusinessDetailById', {_id: id}).then((res) => {
          if (res) {
            this.detailShow = true
            this.busId = id
          } else {
            this.detailShow = false
          }
        }).catch(() => {
          this.detailShow = false
        })
      },
      off () {
        this.detailShow = false
      }
    },
    beforeMount () {
      this.data.page = 1
      this.tableData.list = []
      this.fetchData()
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common.styl"
.wrap
  padding 15px 0 0
.history-business-num
  font-size 12px
  color $cf-gray4
  padding-bottom 20px
.history-title
  padding-bottom 10px
  a
    max-width 280px
    float left
    @extend .ellipsis
    span
      color #000
    &:hover
      text-decoration: underline
      span
        color #71ccba
.history-wrap
  background-color #f1f1f1
  padding 12px 10px
  margin 0 0 20px
  border-radius 5px
  &:hover
    background-color #e8f5fd
.state
  float right
  font-size 14px
.finish
  color $cf-gray4
.process
  color #3eccd0
.history-content
  display flex
  justify-content center
  padding 0 120px
  p
    color $cf-gray3
    font-size 12px
    padding-bottom 1px
    max-width 150px
    @extend .ellipsis
  .business-name
    font-size 14px
    color $cf-gray2
    font-weight 600
    padding-bottom 6px
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
      float right
      font-size 12px
      padding-left 5px
.number
  display inline-block
  padding-left 6px
.arrow-icon
  width 175px
  display flex
  margin-top 6px
  justify-content space-between
  padding-right 10px
  span
    display block
  .dot
    width 4px
    height 4px
    border-radius 2px
    background #9b9b9b
  .arrow
    margin-top -3px
    width 6px
    height 6px
    border-top 2px solid #9b9b9b
    border-right 2px solid #9b9b9b
    transform rotate(45deg)
</style>
