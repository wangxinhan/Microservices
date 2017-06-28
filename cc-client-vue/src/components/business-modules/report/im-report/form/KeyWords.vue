<template>
  <div class="keywords" v-loading="loading">
    <div class="top">
      <affix :label="$t('report.imReportSourceFromKeywordsSearch')"></affix>
      <div class="search">
        <template>
          <date-time type="other" :query="query"></date-time>
        </template>
        <span class="inquiry fr find" @click.stop="search()">{{$t('public.search2')}}</span>
        <div class="clear"></div>
      </div>
      <affix :label="$t('report.seoKeywords')"></affix>
      <div class="export">
        <span class="inquiry fr" @click.stop="exportXls">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" @click.sotp="exportPdf">{{$t('report.exportPDF')}}</span>
      </div>
      <div :id="id">
        <table class="pank">
          <tr>
            <td>{{$t('report.imReportSourceFromRank')}}</td>
            <td>{{$t('report.seoKeywords')}}</td>
            <td>{{$t('report.totalSessionCount')}}</td>
          </tr>
          <tr v-for="(item, index) in top">
            <td :style="[index < 3 ? {color: item.color} : '']">{{ index+1 }}</td>
            <td v-html="item._id"></td>
            <td>
              <span class="number">{{ item.sessionCount }} </span>
              <div class="line" :style="{width: item.width, color: item.color}"></div>
            </td>
          </tr>
        </table>
        <affix :label="$t('report.seoKeywordsList')"></affix>
        <div class="tab">
          <div class="deploy">
            <span class="tex">共{{ countNum }}条记录</span>
            <div class="search-pagination">
              <pagination
                      :small="paginationRecord.small"
                      :currentPage="paginationRecord.currentPage"
                      :count="countRecord"
                      @turnPage="turnPageRecord"
                      :totalPage="totalPageRecord"
                      :num = paginationRecord.num
                      >
              </pagination>
            </div>
          </div>
          <report-table :data="tableData" :config="headOptions.Config"> </report-table>
        </div>
      </div>
      <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('report.reportExportHelp')" v-model="dialogVisible" size="tiny">
        <span>{{$t('report.reportExportTipTitle')}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{$t('public.cancel')}}</el-button>
          <el-button type="primary" @click="confirm">{{$t('public.confirm')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import affix from '../../../../ui-modules/affix/Affix.vue'
  import dateTime from '../../base/datetime.vue'
  import reportTable from '../../base/reportTable.vue'
  import { deepClone } from '../../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, searchTime, checkTime } from '../../../../../utils/reportUtils.js'
  import Pagination from '../../../../public-modules/card/Pagination'
  export default {
    name: 'keywords',
    data () {
      return {
        id: 'im_report_session_seoKeywords',
        title: this.$t('report.imReportSourceFromKeywords'),
        loading: false,
        query: {},
        page: 1,
        dialogVisible: false,
        seoSource: '',
        colorClass: 'colo',
        top10Colors: ['#985fac', '#ee596f', '#f48c4d', '#7acdd1', '#7acdd1', '#7acdd1', '#7acdd1', '#7acdd1', '#7acdd1', '#7acdd1'],
        headOptions: { Config: [], data: [] },
        serverData: [],
        paginationRecord: {
          small: 'small',
          currentPage: 1,
          num: 20
        },
        countRecord: 0,
        totalPageRecord: 1,
        countNum: 0
      }
    },
    components: {
      affix,
      dateTime,
      reportTable,
      Pagination
    },
    computed: {
      tableData () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let data = deepClone(this.serverData)

        data.forEach(item => {
          item.seoKeywords = item._id
        })

        return data
      }
    },
    methods: {
      countRecord () {
      },
      search (page) {
        let data = {
          reportType: this.id,
          account: this.$store.state.session.user.account,
          query: { reportType: this.id, seoSource: this.seoSource },
          page: page || 1,
          limit: 20
        }
        let query = formatDateQuery(deepClone(this.query))
        if (query.timeType === 'other') {
          let message = checkTime(query.StartTime, query.EndTime, true, true) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        Object.assign(data.query, query)
        this.loading = true
        this.$store.dispatch('queryImSessionFromReport', data).then(() => {
          // 表头
          this.headOptions = deepClone(this.$store.state.report.im.sessionFromReport[this.id].tableHeader) || this.headOptions

          this.serverData = deepClone(this.$store.state.report.im.sessionFromReport[this.id].data) || this.serverData
          let count = this.$store.state.report.im.sessionFromReport.im_report_session_seoKeywords.count || 0
          if (count) {
            this.countNum = count
            this.totalPageRecord = Math.ceil(count / 20)
            this.countRecord = count / 2
          }
          if (!page || page === 1) {
            let data = deepClone(this.serverData)
            data = data.slice(0, 10)

            this.top = data.map((item, index) => ({
              _id: item._id,
              width: data[0].sessionCount > 0 ? Math.round(80 * item.sessionCount / data[0].sessionCount) + '%' : 0,
              color: this.top10Colors[index],
              sessionCount: item.sessionCount
            }))
          }
          this.loading = false
        })
      },
      turnPageRecord (pageNum) {
        this.paginationRecord.currentPage = pageNum
        this.search(pageNum)
      },
      exportXls () {
        let data = {
          Method: 'exportImSourceAnalyse',
          Query: {
            reportType: this.id,
            includeSubordinate: this.includeSubordinate,
            user: this.$store.state.session.user._id,
            seoSourceSearch: this.seoSource
          }
        }
        let query = formatDateQuery(deepClone(this.query))
        if (query.timeType === 'other') {
          let message = checkTime(query.StartTime, query.EndTime, true, true) // 校验类型与时间
          if (message !== true) {
            this.$message.error(this.$t(message))
            return
          }
        }
        Object.assign(data.Query, query)
        this.$store.dispatch('exportImSessionFromReport', data)
      },
      exportPdf () {
        this.dialogVisible = true
      },
      confirm () {
        this.dialogVisible = false
        exportReportPdf({title: '关键字报表' + searchTime(this.query), id: this.id})
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', { type: 'seoSource' }).then(seoSource => {
        this.seoSourceOptions = seoSource.map(source => ({ label: source.name, value: source.id }))
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .keywords
    .tab
      .search-pagination
        float right
        margin-top 10px
        line-height 18px
      .tex
        display inline-block
    .top
      .el-row
        margin 20px 0
        .colo
          color #985fac
      .pank
        width 100%
        padding 20px
        margin-left 20px
        tr
          td
            line-height 24px
            &:nth-child(1)
              width 10%
            &:nth-child(2)
              width 50%
            &:nth-child(3)
              width 40%
        .line
          display inline-block
          margin-bottom 4px
          height 5px
          background: #f00
        .number
          display inline-block
          width 60px
      .sear
        margin-left 0
        margin-top 16px
      .skill
        margin 16px 0px 10px 16px
        .ski
          margin-right 20px
</style>
