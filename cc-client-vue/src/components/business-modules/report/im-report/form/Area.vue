<template>
  <div class="area">
    <div class="top">
      <affix :label="$t('report.imReportSourceFromAreaSearch')"></affix>
      <div class="search">
        <template>
          <date-time type="other" :query="query"></date-time>
        </template>
        <span class="inquiry fr find" @click.stop="search">{{$t('public.search2')}}</span>
        <div class="clear"></div>
      </div>
      <affix :label="$t('report.imReportSourceFromAreaTop10')"></affix>
      <div class="export">
        <span class="inquiry fr" @click.stop="exportXls">{{$t('report.exportXls')}}</span>
        <span class="inquiry fr pdf" @click.sotp="exportPdf">{{$t('report.exportPDF')}}</span>
      </div>
    </div>
    <div :id="id">
      <el-row class="map">
        <el-col :span="12"><div id="ImsourceMap"></div></el-col>
        <el-col :span="12">
          <div class="top-title">{{$t('report.imReportSourceFromRank')}}</div>
            <el-row class="source-bar" v-for="(i, index) in top">
              <el-col :span="2"  v-bind:class="[index < 3 ? colorClass : '']">{{index+1}}</el-col>
              <el-col :span="4">{{i.name}}</el-col>
              <el-col :span="12" class="top-all">
                <div  v-bind:style="{ backgroundColor: i.color, width: i.width }" class="top-short">
                </div>
              </el-col>
              <el-col :span="4">{{i.data}}</el-col>
            </el-row>
        </el-col>
      </el-row>
      <div class="tab">
        <report-table :data="tableData" :config="headOptions.Config"></report-table>
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
</template>
<script>
  import affix from '../../../../ui-modules/affix/Affix.vue'
  import Highcharts from 'highcharts/highmaps'
  import data from '../../../../../../node_modules/highcharts/modules/data.js'
  import cnAllChina from '../../../../../utils/cn-china-by-peng8.js'
  import dateTime from '../../base/datetime.vue'
  import reportTable from '../../base/reportTable.vue'
  import { deepClone } from '../../../../../utils/m7Utils.js'
  import { exportReportPdf, formatDateQuery, searchTime, checkTime } from '../../../../../utils/reportUtils.js'
  data(Highcharts)
  Highcharts.setOptions({
    lang: {
      drillUpText: '返回 > {series.name}'
    }
  })
  export default {
    name: 'area',
    data () {
      return {
        id: 'im_report_session_area',
        title: this.$t('report.imReportSourceFromArea'),
        loading: false,
        query: {},
        dialogVisible: false,
        colorClass: 'colorClass',
        top10Colors: ['#985fac', '#ee596f', '#f48c4d', '#7acdd1', '#7acdd1', '#7acdd1', '#7acdd1', '#7acdd1', '#7acdd1', '#7acdd1'],
        headOptions: { Config: [], data: [] },
        serverData: []
      }
    },
    components: {
      affix,
      dateTime,
      reportTable
    },
    computed: {
      tableData () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let data = deepClone(this.serverData)

        return data
      },
      top () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let data = deepClone(this.serverData)
        data.sort((a, b) => b.sessionCount - a.sessionCount)
        data = data.slice(0, 10)

        return data.map((item, index) => ({
          width: data[0].sessionCount > 0 ? Math.round(80 * item.sessionCount / data[0].sessionCount) + '%' : 0,
          color: this.top10Colors[index],
          name: item.area,
          data: item.sessionCount
        }))
      },
      searchIndex () {
        if (!this.serverData || this.serverData.length === 0) {
          return []
        }

        let data = deepClone(this.serverData)

        return data.map(item => ({ name: item.area, data: item.sessionCount }))
      }
    },
    methods: {
      renderMap () {
        let datakey = this.searchIndex
        let mapdata = Highcharts.geojson(cnAllChina)
        mapdata.forEach(function (item) {
          item.name = item.properties['cn-name']
          item.value = 0
          for (var j = 0; j < datakey.length; j++) {
            if (datakey[j].name.match(item.name)) {
              item.value = datakey[j].data
              break
            }
          }
        })
        let option = {
          chart: {
            plotBackgroundColor: '#fff',
            events: {
            }
          },
          tooltip: {
            useHTML: true,
            formatter: function () {
              return '<div style="width:;">' + '搜索指数<br /><span style="display:inline-block;width: 10px;height: 10px;border-radius: 50%;background-color:#1bb194;"></span>' + this.point.name + ':' + this.point.value + '</div>'
            }
          },
          credits: {
            href: 'javascript:goHome()',
            text: ''
          },
          title: {
            text: ''
          },
          subtitle: {
            text: this.$t('report.imReportSourceFromAreaSearchIndex') + ':',
            floating: true,
            align: 'left',
            y: 446,
            style: {
              fontSize: '12px'
            }
          },
          crop: true,
          legend: {
            x: 60,
            layout: 'align',
            align: 'left',
            verticalAlign: 'bottom'
          },
          colorAxis: {
            min: 0,
            minColor: '#77c5c9',
            maxColor: '#1bb194'
          },
          mapNavigation: {
            enabled: true,
            enableMouseWheelZoom: false,
            enableDoubleClickZoom: false,
            buttonOptions: {
              verticalAlign: 'bottom'
            }
          },
          plotOptions: {
            map: {
              borderColor: '#fff',
              nullColor: '#77c5c9'
            }
          },
          series: [{
            data: mapdata,
            name: '中国',
            color: '#77c5c9',
            dataLabels: {
              enabled: false
//              format: '{point.properties.cn-name}'
            },
            states: {
              hover: {
                color: '#1bb194',
                borderColor: '#fff'
              }
            }
          }]
        }
        Highcharts.mapChart(document.getElementById('ImsourceMap'), option)
      },
      search () {
        let data = {
          reportType: this.id,
          account: this.$store.state.session.user.account,
          query: { reportType: this.id }
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
          this.renderMap()
          this.loading = false
        })
      },
      exportXls () {
        let data = {
          Method: 'exportImSourceAnalyse',
          Query: {
            reportType: this.id,
            includeSubordinate: this.includeSubordinate,
            user: this.$store.state.session.user._id
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
        exportReportPdf({title: '来源地区报表' + searchTime(this.query), id: this.id})
      }
    },
    beforeMount () {
      this.$nextTick(() => {
        this.search()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .area
    .map
      padding 0 26px
    .top-title
      padding-top 50px
      margin-bottom 16px
    .source-bar
      padding 4px 0
    .top-all
      height 20px
    .top-short
      height 7px
      margin-top 5px
    .colorClass
      color #985fac
    .deploy
      .tex
      .te
        cursor pointer
      .set
        margin-right 10px
        position relative
        top 2px
</style>
