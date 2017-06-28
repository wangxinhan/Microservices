<template>
  <div class="wrap">
    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.callOverview')}}</span></h3>-->
    <affix :label="$t('monitor.callOverview')" style="margin-top: 36px;">
      <el-row>
        <el-col :span="12" class="callsum-wrap">
          <div class="callsum">{{$t('monitor.todayIncomingNum')+ '：'+ phoneAccountCalls.inCalls}}</div>
          <highcharts :options="optionsCallin"></highcharts>
        </el-col>
        <el-col :span="12" class="callsum-wrap">
          <div class="callsum">{{$t('monitor.todayOutboundNum')}}：{{phoneAccountCalls.outCalls}}</div>
          <highcharts :options="optionsCallout"></highcharts>
        </el-col>
      </el-row>
    </affix>

    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.serviceNumberProportionAnalysisChart')}}</span></h3>-->
    <affix :label="$t('monitor.serviceNumberProportionAnalysisChart')">
      <div>
        <div class="clear10"></div>
        <div class="chart-tip fr" ><span class="color-sum circle fl">&nbsp;&nbsp;</span>{{$t('monitor.totalCall')}}<span class="ratio">接听数/呼叫总数（接听率）</span></div>
        <div class="chart-tip fr"><span class="color-complete circle fl">&nbsp;&nbsp;</span>{{$t('monitor.connetcCallNum')}}</div>
        <div class="clear10"></div>
      </div>
      <div v-for="item in phoneServiceNos" class="server">
        <el-row :gutter="20">
          <el-col :span="5" class="a">{{$t('monitor.serviceNum')}}: &nbsp;&nbsp;{{item.serviceNo}}<span></span></el-col>
          <el-col :span="14">
            <el-progress :text-inside="true" :stroke-width="7" :percentage="item.perInComplete" :show-text="bol"></el-progress>
          </el-col>
          <el-col :span="3" class="all">{{item.perDisplay + '  (' + item.perInComplete+ '%)'}}</el-col>
          <div class="clear10"></div>
        </el-row>
      </div>
    </affix>

    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.multiChannelProportionAnalysisChart')}}</span></h3>-->
    <affix :label="$t('monitor.multiChannelProportionAnalysisChart')">
      <div>
        <div class="clear10"></div>
        <div class="chart-tip fr" ><span class="color-sum circle fl">&nbsp;&nbsp;</span>会话总数<span class="ratio finish">完成会话数/会话总数（完成率）</span></div>
        <div class="chart-tip fr"><span class="color-complete circle fl listen">&nbsp;&nbsp;</span>完成会话数</div>
        <div class="clear10"></div>
      </div>
      <div v-for="item in multiChannel" class="channel">
        <el-row :gutter="20">
          <el-col :span="5" class="a">接入号:&nbsp;&nbsp;{{item.name}}<span></span></el-col>
          <el-col :span="14">
            <el-progress :text-inside="true" :stroke-width="7" :percentage="item.perInComplete" :show-text="bol"></el-progress>
          </el-col>
          <el-col :span="2" class="all">{{item.perDisplay + '  (' + item.perInComplete + '%)'}}</el-col>
          <div class="clear10"></div>
        </el-row>
      </div>
    </affix>

    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.hour24SegmentInboundIcon')}}</span></h3>-->
    <affix :label="$t('monitor.hour24SegmentInboundIcon')">
      <div>
        <div class="clear10"></div>
        <div class="chart-tip fr" ><span class="color-sum circle fl ">&nbsp;&nbsp;</span>呼入总数<span class="ratio">接通数/呼入总数（接听率）</span></div>
        <div class="chart-tip fr"><span class="color-complete24 circle fl">&nbsp;&nbsp;</span>接通数</div>
        <div class="clear10"></div>
      </div>
      <el-row>
        <highcharts :options="options24in"></highcharts>
      </el-row>
    </affix>

    <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('monitor.hour24SegmentCallIcon')}}</span></h3>-->
    <affix :label="$t('monitor.hour24SegmentCallIcon')">
      <div>
        <div class="clear10"></div>
        <div class="chart-tip fr" ><span class="color-sum circle fl">&nbsp;&nbsp;</span>{{$t('monitor.outCallSum')}}<span class="ratio">接通数数/呼入总数（接听率）</span></div>
        <div class="chart-tip fr"><span class="color-complete24 circle fl">&nbsp;&nbsp;</span>{{$t('monitor.connetcCallNum')}}</div>
        <div class="clear10"></div>
      </div>
      <el-row>
        <highcharts :options="options24out"></highcharts>
      </el-row>
    </affix>

  </div>
</template>
<script>
//  let outCallLstNum = '呼出未接通：' + (outCalls - outComplete) + ' (' + outCallLst + '%)';
//  let outCallCptNum = '呼出接通：' + outComplete + ' (' + outCallCpt + '%)';
  import affix from './../../ui-modules/affix/Affix.vue'
  export default {
    name: 'app',
    data () {
      return {
        bol: false,
        optionsCallin: {
          chart: {
            type: 'pie',
            style: {overflow: 'visible', width: '100%'},
            animation: false
          },
          credits: {enabled: false},
          tooltip: {
            enabled: false
          },
          plotOptions: {
            pie: {
              allowPointSelect: false,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                color: '#999'
              },
              showInLegend: true
            },
            series: {animation: false}
          },
          legend: {
            enabled: false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'bottom',
            symbolRadius: 5,
            symbolHeight: 10,
            symbolWidth: 10,
            x: -20,
            y: 0,
            borderWidth: 0,
            width: 140,
            itemStyle: {borderRadius: '50%', fontWeight: '100'},
            floating: false,
            useHTML: true
          },
          title: {
            text: ''
          },
          colors: [
            '#65c3df',
            '#d398e8'
          ],
          series: [{
            type: 'pie',
            data: []
          }]
        },
        optionsCallout: {
          chart: {
            type: 'pie',
            style: {overflow: 'visible', width: '100%'},
            animation: false
          },
          credits: {enabled: false},
          tooltip: {
            enabled: false
          },
          plotOptions: {
            pie: {
              allowPointSelect: false,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                color: '#999'
              },
              showInLegend: true
            },
            series: {animation: false}
          },
          legend: {
            enabled: false,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'bottom',
            symbolRadius: 5,
            symbolHeight: 10,
            symbolWidth: 10,
            x: -20,
            y: 0,
            borderWidth: 0,
            width: 140,
            itemStyle: {borderRadius: '50%', fontWeight: '100'},
            floating: false,
            useHTML: true
          },
          title: {
            text: ''
          },
          colors: [
            '#65c3df',
            '#d398e8'
          ],
          series: [{
            type: 'pie',
            data: []
          }]
        },
        options24in: {
          chart: {
            type: 'column',
            animation: false
          },
          xAxis: {
            categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
          },
          yAxis: {
            gridLineColor: '#e6e6e6',
            allowDecimals: false,
            title: {
              text: ''
            }
          },
          title: {
            text: ''
          },
          legend: {
            enabled: false
          },
          tooltip: {
            style: {
              color: '#fff',
              fontSize: '12px',
              padding: '8px'
            },
            formatter: function () {
              return '呼入总数: ' + this.point.stackTotal + '<br/>' +
                this.series.name + ': ' + this.y + '<br/>'
            },
            backgroundColor: 'rgba(50, 50, 50, 0.85)',
            borderColor: 'rgba(50, 50, 50, 0.85)'
          },
          colors: [
            '#eee',
            '#7ccdd1'
          ],
          plotOptions: {
            column: {
              stacking: 'normal'
            },
            series: {animation: false}
          },
          credits: {enabled: false},
          series: [
          ]
        },
        options24out: {
          chart: {
            type: 'column',
            animation: false
          },
          xAxis: {
            categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
          },
          yAxis: {
            gridLineColor: '#e6e6e6',
            allowDecimals: false,
            title: {
              text: ''
            }
          },
          title: {
            text: ''
          },
          legend: {
            enabled: false
          },
          tooltip: {
            style: {
              color: '#fff',
              fontSize: '12px',
              padding: '8px'
            },
            formatter: function () {
              return '呼入总数: ' + this.point.stackTotal + '<br/>' +
                this.series.name + ': ' + this.y + '<br/>'
            },
            backgroundColor: 'rgba(50, 50, 50, 0.85)',
            borderColor: 'rgba(50, 50, 50, 0.85)'
          },
          colors: [
            '#eee',
            '#7ccdd1'
          ],
          plotOptions: {
            column: {
              stacking: 'normal'
            },
            series: {animation: false}
          },
          credits: {enabled: false},
          series: []
        }
      }
    },
    computed: {
      multiChannel () {
        let data = this.$store.state.monitor.table.MultiChannel
        let array = []
        for (var i in data) {
          let item = data[i]
          let name = item.name + '(' + this.$t('monitor.' + item.platform) + ')'
          let perInComplete = Math.round((item.closeSession / item.accessSession) * 100)
          if (item.accessSession === 0) {
            perInComplete = 100
          }
          let perDisplay = item.closeSession + '/' + item.accessSession
          array.push({name, perDisplay, perInComplete})
        }
        return array
      },
      phoneServiceNos () {
        let data = this.$store.state.cti.globalLet.phone_serviceNos
        let array = []
        for (var i in data) {
          let item = data[i]
          let serviceNo = item.serviceNo
          if (item.displayName !== '') {
            serviceNo = item.serviceNo + '(' + item.displayName + ')'
          }
          let perInComplete = Math.round((item.inComplete / item.inCalls) * 100)
          if (item.inCalls === 0) {
            perInComplete = 100
          }
          let perDisplay = item.inComplete + '/' + item.inCalls
          array.push({serviceNo, perDisplay, perInComplete})
        }
        return array
      },
      phoneAccountCalls () {
        let data = this.$store.state.cti.globalLet.phone_accountCalls
        let array = []
        for (let i in data) {
          let item = data[i]
          data[i].missIn = item.inCalls - item.inComplete
          data[i].missOut = item.outCalls - item.outComplete
          let inCallCpt, inCallLst
          let perInComplete = Math.round((item.inComplete / item.inCalls) * 100)
          inCallCpt = perInComplete
          inCallLst = (100 - perInComplete)
          if (item.inCalls === 0) {
            inCallCpt = 100
            inCallLst = 0
          }
          let outCallCpt, outCallLst
          let perOutComplete = Math.round((item.outComplete / item.outCalls) * 100)
          outCallCpt = perOutComplete
          outCallLst = (100 - perOutComplete)
          if (item.outCalls === 0) {
            outCallCpt = 100
            outCallLst = 0
          }
          Object.assign(data[i], {inCallCpt, inCallLst, outCallCpt, outCallLst})
          let inCallSumArray = item.inCallsPerHour.split(',')
          let inCallCptArray = item.inCompletePerHour.split(',')
          let inCallLstArray = []
          let outCallSumArray = item.outCallsPerHour.split(',')
          let outCallCptArray = item.outCompletePerHour.split(',')
          let outCallLstArray = []
          for (let j = 0; j < 24; j++) {
            inCallLstArray[j] = inCallSumArray[j] - inCallCptArray[j]
            inCallCptArray[j] = Number(inCallCptArray[j])
            outCallLstArray[j] = outCallSumArray[j] - outCallCptArray[j]
            outCallCptArray[j] = Number(outCallCptArray[j])
          }
          Object.assign(data[i], {inCallCptArray, inCallLstArray, outCallCptArray, outCallLstArray})
          array.push(data[i])
        }
        if (array.length !== 0) {
          this.optionsCallin.series[0].data = [
            [this.$t('monitor.callIncoming') + array[0].inComplete, array[0].inCallCpt],
            [this.$t('monitor.noConnectedIncoming') + array[0].missIn, array[0].inCallLst]
          ]
          this.optionsCallout.series[0].data = [
            [this.$t('monitor.callOut') + array[0].outComplete, array[0].outCallCpt],
            [this.$t('monitor.noConnectedOutbound') + array[0].missOut, array[0].outCallLst]
          ]
          this.options24in.series = [
            {name: '未接通', data: array[0].inCallLstArray},
            {name: '接通', data: array[0].inCallCptArray}
          ]
          this.options24out.series = [
            {name: '未接通', data: array[0].outCallLstArray},
            {name: '接通', data: array[0].outCallCptArray}
          ]
          return array[0]
        } else {
          return {inCalls: 0, outCalls: 0}
        }
      }
    },
    components: {
      affix
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../assets/common.styl';
  .a
    color #989898
    @extend .ellipsis
  .channel
  .server
    padding-left 20px
  .el-progress-bar__inner
    color #d398ea
  .all
    fontSize 12px
    color #989898
  .el-col-14
    margin-top 5px
  .wrap
    padding 0 25px 10px
    overflow auto
    .title
      color #000
      margin 28px 0 18px 0
      font-weight normal
      position relative
      .sign
        position relative
        width 12px
        height 12px
        background #7ccdd1
        display inline-block
        z-index 3
      .text
        position relative
        display inline-block
        padding 0 8px 0 10px
        background #fff
        z-index 3
      &:after
        content ""
        display inline-block
        width 100%
        left 0
        border-bottom 1px dashed #a6a6a6
        position absolute
        top 12px
  .clear10
    clear both
    height 10px
  .circle
    display inline-block
    height 7px
    width 28px
    margin 6px 10px 0 0
  .ratio
    margin-left 30px
    margin-right 78px
  .finish
    margin-right 50px
  .color-complete
    background #7acdd1
  .listen
    background #d398ea
  .color-sum
    background #e5e9f2
  .chart-tip
    padding-right 30px
    color #b6b6b6
  .color-complete24
    background #7ccdd1
  .callsum
  .todaycallsum
    text-align center
    padding-bottom: 10px
  .callsum-wrap
    position relative
</style>
