<!--导入群发短信 详情（右侧）-->
<template>
  <div class="si-detail" v-loading="loading">
    <el-tabs v-model.trim="activeName" @tab-click="handleClick" v-if="!loading">
      <!--导入数据  tab-->
      <el-tab-pane :label="$t('sms.importData')" name="trueDataState">
        <div class="table-wrap">
        <div class="deploy">
          <Pagination
            class="fr"
            :small="true"
            :currentPage="currentPage"
            :count="countImport"
            @turnPage="handleCurrentChangeImport"
            :totalPage="Math.ceil(countImport/pageSize)"
          >
          </Pagination>
        </div>
          <el-table
            v-if="!trueDateLoading"
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="num"
              :label="$t('sms.phoneNum')"
              width="150">
            </el-table-column>
            <el-table-column
              prop="content"
              :label="$t('sms.content')"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="signDisplay"
              :label="$t('sms.sign')"
              width="150">
            </el-table-column>
            <el-table-column
              prop="statusName"
              :label="$t('sms.smsState')"
              width="150">
            </el-table-column>
          </el-table>
          <div style="height: 200px;" v-if="trueDateLoading" v-loading="trueDateLoading">
          </div>
        </div>
        <div class="btn-wrap">
          <el-button class="send-btn" @click.stop="smsCountImportToSend" type="text">{{$t('sms.submitSend')}}</el-button>
        </div>
      </el-tab-pane>
      <!--错误数据  tab-->
      <el-tab-pane :label="$t('sms.errorData')" name="falseDataState">
        <div class="table-wrap">
          <div class="deploy">
            <Pagination
              class="fr"
              :small="true"
              :currentPage="currentPage2"
              :count="countInvalid"
              @turnPage="handleCurrentChange"
              :totalPage="Math.ceil(countInvalid/pageSize)"
            >
            </Pagination>
          </div>
          <el-table
            v-if="!falseDateLoading"
            :data="tableDataInvalid"
            stripe
            style="width: 100%">
            <el-table-column
              prop="num"
              :label="$t('sms.phoneNum')"
              width="150">
            </el-table-column>
            <el-table-column
              prop="content"
              :label="$t('sms.content')"
              :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
              prop="signDisplay"
              :label="$t('sms.sign')"
              width="150">
            </el-table-column>
            <el-table-column
              prop="reason"
              :label="$t('sms.errorReason')"
              width="150">
            </el-table-column>
          </el-table>
          <div style="height: 200px" v-if="falseDateLoading" v-loading="falseDateLoading">
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import Pagination from '../../../public-modules/card/Pagination'
  import {getCache} from '../../../../utils/m7Utils.js'
  export default {
    name: 'siDetail',
    data () {
      return {
        activeName: 'trueDataState',  //   tab  name
        loading: true,
        falseDateLoading: false,
        trueDateLoading: false,
        smsStatus: '',
        pageSize: 10,
        currentPage: 1,
        currentPage2: 1,
        id: ''
      }
    },
    methods: {
//        tab切换
      handleClick (tab, event) {
        if (tab.name === 'trueDataState') {
          this.currentPage = 1
          this.searchTrueData()
        } else if (tab.name === 'falseDataState') {
          this.currentPage2 = 1
          this.searchFalseData()
        }
      },
//       查询导入数据方法
      searchTrueData () {
        if (!this.id) {
          return
        }
        this.trueDateLoading = true
        this.$store.dispatch('queryTaskImport', {batchNo: this.id, page: this.currentPage}).then(() => {
          this.trueDateLoading = false
        })
      },
//       查询错误数据方法
      searchFalseData () {
        if (!this.id) {
          return
        }
        this.falseDateLoading = true
        this.$store.dispatch('queryTaskInvalid', {batchNo: this.id, page: this.currentPage2, limit: this.pageSize}).then(() => {
          this.falseDateLoading = false
        })
      },
//      分页查询 导入数据分页
      handleCurrentChangeImport (val) {
        this.currentPage = val
        this.searchTrueData()
      },
//      分页查询 错误数据分页
      handleCurrentChange (val) {
        this.currentPage2 = val
        this.searchFalseData()
      },
//      初始化数据
      fetchSmsImportData () {
        this.loading = true
        this.activeName = 'trueDataState'
        this.id = this.$route.path.split('/')[5]
        if (!this.id) {
          this.loading = false
          return
        }
        this.$store.dispatch('queryTaskImport', {batchNo: this.id, page: this.currentPage}).then(() => {
          this.loading = false
        })
      },
//      提交发送
      smsCountImportToSend () {
        if (!this.id) {
          return
        }
        if (this.tableData.length === 0) {
          this.$message({
            type: 'info',
            message: this.$t('sms.canNotSubmit')
          })
          return
        }
        this.$store.dispatch('smsCountImportToSend', {batchNo: this.id}).then(req => {
          if (!req.hasImport) {
            this.$confirm(this.$t('sms.importSMSSubmitConfirm'), this.$t('public.tip'), {
              confirmButtonText: this.$t('public.confirm'),
              cancelButtonText: this.$t('public.cancel'),
              type: 'warning'
            }).then(() => {
              let reqType = req.type
              this.$store.dispatch('smsImportSend', {batchNo: this.id, type: reqType}).then(req => {
                if (req.success) {
                  this.currentPage = 1
                  this.searchTrueData()
                  this.$message({
                    type: 'success',
                    message: this.$t('sms.sendSuccess')
                  })
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: this.$t('sms.cancelSend')
              })
            })
          } else {
            let reqType = req.type
            this.$store.dispatch('smsImportSend', {batchNo: this.id, type: reqType}).then(req => {
              if (req.success) {
                this.currentPage = 1
                this.searchTrueData()
                this.$message({
                  type: 'success',
                  message: this.$t('sms.sendSuccess')
                })
              }
            })
          }
        })
      }
    },
    watch: {
      $route (to, form) {
        if (to.path.split('/')[2] === 'sms') {
          this.fetchSmsImportData()
        }
      }
    },
    computed: {
//        重构导入数据数据
      tableData () {
        let data = this.$store.state.sms.taskImport.list
        for (var i in data) {
          let smsStatusId = data[i].m7Status
          let stateData = this.smsStatus
          for (var j in stateData) {
            if (stateData[j].code_value === smsStatusId) {
              data[i].statusName = stateData[j].code_name
            }
          }
        }
        return data
      },
      countImport () {
        return this.$store.state.sms.taskImport.count
      },
//      错误数据
      tableDataInvalid () {
        let dataInvalid = this.$store.state.sms.taskInvalid.list
        return dataInvalid
      },
      countInvalid () {
        return this.$store.state.sms.taskInvalid.count
      }
    },
    beforeMount () {
      this.fetchSmsImportData()
      this.smsStatus = getCache('smsStatus')
    },
    components: {
      Pagination
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl"
  .si-detail
    margin-left 341px
    height calc(100vh - 116px)
    padding-bottom 20px
    overflow auto
    .btn-wrap
      text-align right
      padding 16px 20px
      .send-btn
        display inline-block
        width 110px
        height 30px
        font-size 12px
        line-height 30px
        text-align center
        color #fff
        padding 0
        background $c-main
    .table-wrap
      padding 0 20px
      margin-top 16px
      .deploy
        height 48px
        line-height 48px
        border 1px solid #ebebeb
        border-bottom none
        padding-left 14px
        .fr
          padding-top 10px
          height 38px
</style>
