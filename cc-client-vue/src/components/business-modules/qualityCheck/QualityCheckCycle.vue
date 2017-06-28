<template>
  <!--质检查询周期-->
  <div class="qualityCheckCycle" v-if="qualityCheckCloaycleding">
    <div class="top">
      <affix :label="$t('qualityCheck.qualityCheckCycle')"></affix>
      <el-form :model="ruleForm" ref="ruleForm">
        <div class="temp-search-wrap">
          <span class="demonstration">周期:</span>
          <el-select size="small" v-model="ruleForm.checkedCycle" @change="changeCycle" :placeholder="$t('public.pleasePick')">
            <el-option
              :label="$t('public.all')"
              :value="''">
            </el-option>
            <el-option
              v-for="item in queryQualityCheckedCycle"
              :label="item.cycleName"
              :value="item._id">
            </el-option>
          </el-select>
        </div>
        <div class="temp-search-wrap">
          <span class="demonstration">开始周期:</span>
          <el-select size="small" v-model="ruleForm.qualityChecked_start_cycle" :placeholder="$t('public.pleasePick')">
            <el-option
              v-for="item in cycleSonArray"
              :label="item.cycleSonName"
              :value="item.cycleSonId">
            </el-option>
          </el-select>
        </div>
        <div class="temp-search-wrap">
          <span class="demonstration">质检模板:</span>
          <el-select size="small" v-model="ruleForm.checkedTableTitle" @change="changeFloor" :placeholder="$t('public.pleasePick')">
            <el-option
              :label="$t('public.all')"
              :value="''">
            </el-option>
            <el-option
              v-for="item in queryQualityCheckedtabletitle"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </div>
        <div class="temp-search-wrap">
          <span class="demonstration">座席:</span>
          <el-autocomplete
            class="quality-agents-select-option"
            v-model="ruleForm.agentsName"
            :fetch-suggestions="querySearch"
            @select="agentSelect"
            size="small"
            placeholder="请输入内容"
          ></el-autocomplete>
        </div>
        <div class="temp-search-wrap">
          <span class="demonstration">结束周期:</span>
          <el-select size="small" v-model="ruleForm.qualityChecked_end_cycle" :placeholder="$t('public.pleasePick')">
            <el-option
              v-for="item in cycleSonArray"
              :label="item.cycleSonName"
              :value="item.cycleSonId">
            </el-option>
          </el-select>
        </div>
        <div class="temp-search-wrap">
          <span class="demonstration">层级:</span>
          <el-select size="small" v-model="ruleForm.qualityChecked_floors" :placeholder="$t('public.pleasePick')">
            <el-option
              v-for="item in floor"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </el-form>
      <!--已选座席 标签显示框-->
      <div class="choosed-agent-wrap" v-if="agentTags.length">
        <div class="choosed-agent-tip">已选择{{agentTags.length}}名座席</div>
        <div class="choosed-agent-clear" @click="clearAgentsTags">清空</div>
        <div style="clear:both;">
          <div class="choosed-agent" v-for="(item, $index) in agentTags">
            <span class="choosed-agent-name">{{item}}</span><i class="el-icon-close del" @click="delCurrentAgentTag($index)"></i>
          </div>
        </div>
      </div>
      <!--查询按钮-->
      <div class="sub">
        <span class="search" @click= "query">{{$t('public.search2')}}</span>
      </div>
      <affix :label="$t('public.searchResult')"></affix>
    </div>
    <!--图表展示  线形图和柱形图-->
    <div v-if="isShowQcReportHighChats">
      <highcharts :options="highchartsDefaultOptions"></highcharts>
    </div>
    <!--表格展示-->
    <div class="table-wrap" v-if="cycleCheckTableLoading">
      <el-table :data="tableData" v-loading="!cycleCheckTableLoading">
        <el-table-column label="座席">
          <template scope="scope">
            <div>
              {{tableData[scope.$index].agentName}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="周期" min-width="220">
          <template scope="scope">
            <div v-for="item in tableData[scope.$index].agentData">
              {{item.cyclename}}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="ruleForm.qualityChecked_floors === 1" label="被监控数" width="90">
          <template scope="scope">
            <div v-for="item in tableData[scope.$index].agentData">
              {{item.monitorcount}}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="ruleForm.qualityChecked_floors === 1" label="非关键错误未通过录音数" width="90">
          <template scope="scope">
            <div v-for="item in tableData[scope.$index].agentData">
              {{item.uncurxnum}}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="ruleForm.qualityChecked_floors === 1" label="关键错误准确率" width="90">
          <template scope="scope">
            <div v-for="item in tableData[scope.$index].agentData">
              {{item['cruxerrorrate' + 'Done']}}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="ruleForm.qualityChecked_floors === 1" label="非关键错误准确率" width="90">
          <template scope="scope">
            <div v-for="item in tableData[scope.$index].agentData">
              {{item['uncruxerrorrate' + 'Done']}}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="ruleForm.qualityChecked_floors === 1" label="准确率" width="90">
          <template scope="scope">
            <div v-for="item in tableData[scope.$index].agentData">
              {{item['accrate' + 'Done']}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="items in qualityCheckedtitleExtendArray"
          :label="items.title"
          min-width="90">
          <template scope="scope">
            <div v-for="item in tableData[scope.$index].agentData">
              {{item[items.content + 'Done']}}
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="ruleForm.qualityChecked_floors === 1" label="整体" width="90">
          <template scope="scope">
            <div v-for="item in tableData[scope.$index].agentData">
              {{item['all_1_cent' + 'Done']}}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import { colorConfigArr } from '../../../utils/reportUtils.js'
  import Affix from '../../ui-modules/affix/Affix.vue'
  export default {
    name: 'qualityCheckCycle',
    data () {
      return {
        agents: [],
        restaurants: [], //  座席搜索联想时用
        qualityCheckCloaycleding: false,
        cycleCheckTableLoading: false,
        isShowQcReportHighChats: false, //  是否显示图表
        //  搜索条件
        ruleForm: {
          agentsName: '',
          checkedCycle: '',
          checkedTableTitle: '',
          qualityChecked_floors: '',
          qualityChecked_start_cycle: '',
          qualityChecked_end_cycle: ''
        },
        agentTags: [],
        queryQualityCheckedtabletitle: [],
        choosedQueryQualityCheckedtabletitleConfig: [],
        queryQualityCheckedCycle: [],
        floor: [],
        cycleSonArray: [],
        tableData: [],
        qualityCheckedtitleExtendArray: [],
        highchartsDefaultOptions: {
          chart: { type: '', animation: false },
          colors: colorConfigArr,
          xAxis: {
            categories: [],
            title: {
              enabled: true,
              text: '',
              style: { fontWeight: 'normal' }
            }
          },
          yAxis: {
            gridLineColor: '#e6e6e6',
            allowDecimals: false,
            title: { text: '' },
            showEmpty: false
          },
          title: { text: '' },
          legend: { align: 'center', verticalAlign: 'top', y: 30 },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}{point.valueSuffix}%</b><br/>',
            shared: true
          },
          credits: { enabled: false },
          series: []
        }
      }
    },
    methods: {
//        按条件查询
      query () {
        this.cycleCheckTableLoading = false
        let data = {}
        data.selectedAgent = []
        this.qualityCheckedtitleExtendArray = []
        for (let i in this.agentTags) {
          for (let j in this.agents) {
            if (this.agentTags[i] === this.agents[j].displayName) {
              data.selectedAgent.push(this.agents[j]._id)
            }
          }
        }
        data.QA_SPECIALIST = ''
        data.qualityChecked_cycle = this.ruleForm.checkedCycle
        data.qualityChecked_start_cycle = this.ruleForm.qualityChecked_start_cycle
        data.qualityChecked_end_cycle = this.ruleForm.qualityChecked_end_cycle
        data.qualityChecked_table = this.ruleForm.checkedTableTitle
        data.qualityChecked_floors = this.ruleForm.qualityChecked_floors.toString()
        if (!data.qualityChecked_cycle) {
          this.$message.error('请选择您要查询的周期！')
          return
        }
        if (!data.qualityChecked_table) {
          this.$message.error('请选择您要查询的模板！')
          return
        }
        let startcycle = data.qualityChecked_start_cycle
        let endcycle = data.qualityChecked_end_cycle
        if (parseInt(startcycle.substr(35, startcycle.length)) > parseInt(endcycle.substr(35, endcycle.length))) {
          this.$message.error('您的开始周期大于结束周期！')
          return
        }
        //  发送请求
        this.$store.dispatch('queryCycleReport', data).then(res => {
          if (res.success) {
//              通过层级找出 对应的表头
            let extendTitleArray = this.makeupqualityCheckedtitle(this.ruleForm.qualityChecked_floors, this.choosedQueryQualityCheckedtabletitleConfig)
            let extendConfigArray = []
            for (let rellistone in res.list[0]) {
              if (rellistone.substr(0, 11) === 'config_name' && rellistone.split(/-/g).length === this.ruleForm.qualityChecked_floors) {
                extendConfigArray.push(rellistone)
              }
            }
            for (let i = 0; i < extendTitleArray.length; i++) {
              this.qualityCheckedtitleExtendArray.push({title: extendTitleArray[i], content: extendConfigArray[i]})
            }
//          把相同座席的数据整合到一起
            let newArray = []
            let hasFind = true
            for (let i = 0; i < res.list.length; i++) {
              hasFind = true
              for (let j = 0; j < newArray.length; j++) {
                if (res.list[i].DISPOSAL_AGENT === newArray[j].agentId) {
                  newArray[j].agentData.push(res.list[i])
                  hasFind = false
                }
              }
              if (hasFind) {
                newArray.push({agentId: res.list[i].DISPOSAL_AGENT, agentData: [res.list[i]]})
              }
            }
//            得到 整体 这套数据  对应的数据求平均数
            for (let i = 0; i < newArray.length; i++) {
              let allcount = {}
              allcount.cyclename = '整体'
              for (let j = 0; j < newArray[i].agentData.length; j++) {
                for (let rellistone in newArray[i].agentData[j]) {
                  if (rellistone.substr(0, 11) === 'config_name' && rellistone.split(/-/g).length === this.ruleForm.qualityChecked_floors) {
                    if (typeof (allcount[rellistone]) === 'number') {
                      allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                    } else {
                      allcount[rellistone] = 0
                      allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                    }
                  } else if (rellistone === 'monitorcount') {
                    if (typeof (allcount[rellistone]) === 'number') {
                      allcount[rellistone] += parseInt(newArray[i].agentData[j][rellistone])
                    } else {
                      allcount[rellistone] = 0
                      allcount[rellistone] += parseInt(newArray[i].agentData[j][rellistone])
                    }
                  } else if (rellistone === 'all_1_cent') {
                    if (typeof (allcount[rellistone]) === 'number') {
                      allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                    } else {
                      allcount[rellistone] = 0
                      allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                    }
                  } else if (rellistone === 'accrate') {
                    if (newArray[i].agentData[j][rellistone] === '-') {
                      allcount[rellistone] = '-'
                    } else {
                      if (typeof (allcount[rellistone]) === 'number') {
                        allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                      } else {
                        allcount[rellistone] = 0
                        allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                      }
                    }
                  } else if (rellistone === 'uncruxerrorrate') {
                    if (newArray[i].agentData[j][rellistone] === '-') {
                      allcount[rellistone] = '-'
                    } else {
                      if (typeof (allcount[rellistone]) === 'number') {
                        allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                      } else {
                        allcount[rellistone] = 0
                        allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                      }
                    }
                  } else if (rellistone === 'uncurxnum') {
                    if (newArray[i].agentData[j][rellistone] === '-') {
                      allcount[rellistone] = '-'
                    } else {
                      if (typeof (allcount[rellistone]) === 'number') {
                        allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                      } else {
                        allcount[rellistone] = 0
                        allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                      }
                    }
                  } else if (rellistone === 'cruxerrorrate') {
                    if (newArray[i].agentData[j][rellistone] === '-') {
                      allcount[rellistone] = '-'
                    } else {
                      if (typeof (allcount[rellistone]) === 'number') {
                        allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                      } else {
                        allcount[rellistone] = 0
                        allcount[rellistone] += parseFloat(newArray[i].agentData[j][rellistone])
                      }
                    }
                  }
                }
              }
              for (let allcountOne in allcount) {
                if (allcountOne !== 'monitorcount' && allcountOne !== 'uncurxnum' && allcountOne !== 'cyclename') {
                  if (allcount[allcountOne] !== '-') {
                    allcount[allcountOne] = allcount[allcountOne] / newArray[i].agentData.length
                  }
                }
              }
              newArray[i].agentData.push(allcount)
            }
//          将数据  转为坐席名字  转成百分数
            for (let i = 0; i < newArray.length; i++) {
              for (let j = 0; j < this.agents.length; j++) {
                if (newArray[i].agentId === this.agents[j]._id) {
                  newArray[i].agentName = this.agents[j].displayName + '[' + this.agents[j].exten + ']'
                }
              }
              for (let k = 0; k < newArray[i].agentData.length; k++) {
                for (let agentDataOne in newArray[i].agentData[k]) {
                  if (agentDataOne !== 'monitorcount' && agentDataOne !== 'uncurxnum' && agentDataOne !== 'cyclename') {
                    if (newArray[i].agentData[k][agentDataOne] !== '-') {
                      newArray[i].agentData[k][agentDataOne + 'Done'] = (newArray[i].agentData[k][agentDataOne] * 100).toFixed(2) + '%'
                    } else {
                      newArray[i].agentData[k][agentDataOne + 'Done'] = '-'
                    }
                  }
                }
              }
            }
            this.tableData = newArray  //  将数据渲染到表格
            this.cycleCheckTableLoading = true
            //  图表数据渲染  只在层级为1的情况下 显示图表
            if (this.ruleForm.qualityChecked_floors === 1) {
              this.isShowQcReportHighChats = true
              let seriesArray = []
              let ydata = []
              let xArray = []
              if (startcycle === endcycle) {
                seriesArray.push({
                  name: '整体',
                  data: ydata
                })
                for (let j = 0; j < this.agents.length; j++) {
                  for (let i = 0, len = res.list.length; i < len; i++) {
                    if (res.list[i].DISPOSAL_AGENT === this.agents[j]._id) {
                      xArray.push(this.agents[j].displayName + '[' + this.agents[j].exten + ']')
                      ydata.push(parseFloat((res.list[i]['all_1_cent'] * 100).toFixed(2)))
                    }
                  }
                }
                this.generateQcReportHighChats(xArray, seriesArray, 'quality_check_report')
              } else {
                let cycle = []
                let json = {}
                for (let i = 0, len = res.list.length; i < len; i++) {
                  if (!json[res.list[i].cycle_section]) {
                    cycle.push(res.list[i].cycle_section)
                    xArray.push(res.list[i].cyclename)
                    json[res.list[i].cycle_section] = 1
                  }
                  if (!json[res.list[i].DISPOSAL_AGENT]) {
                    let agentData = {}
                    for (let n = 0; n < this.agents.length; n++) {
                      if (res.list[i].DISPOSAL_AGENT === this.agents[n]._id) {
                        agentData = this.agents[n]
                      }
                    }
                    seriesArray.push({
                      name: agentData.displayName + '[' + agentData.exten + ']',
                      data: [],
                      valueName: res.list[i].DISPOSAL_AGENT
                    })
                    json[res.list[i].DISPOSAL_AGENT] = 1
                  }
                }
                for (let i = 0; i < cycle.length; i++) {
                  for (let m = 0; m < seriesArray.length; m++) {
                    let ishas = false
                    for (let j = 0; j < res.list.length; j++) {
                      if ((res.list[j].DISPOSAL_AGENT === seriesArray[m].valueName) && (res.list[j].cyclename === xArray[i])) {
                        ishas = true
                        seriesArray[m].data.push(parseFloat((res.list[j]['all_1_cent'] * 100).toFixed(2)))
                        break
                      }
                    }
                    if (ishas === false) {
                      seriesArray[m].data.push(100)
                    }
                  }
                }
                this.generateQcReportHighChats(xArray, seriesArray, 'quality_check_report_multiple')
              }
            } else {
              this.isShowQcReportHighChats = false
            }
          }
        })
      },
      //  处理图表数据
      generateQcReportHighChats (xArray, seriesArray, xName) {
        let titleText = ''
        let labels = {}
        let type = 'line'
        if (xName === 'quality_check_report') {
          titleText = '单周期质检报表'
          type = 'column'
        }
        if (xName === 'quality_check_report_multiple') {
          titleText = '多周期质检报表'
          type = 'line'
        }
        if (xArray.length > 15) {
          labels = {
            rotation: -45,
            align: 'right',
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        }
        this.highchartsDefaultOptions.chart.type = type
        this.highchartsDefaultOptions.title.text = titleText
        this.highchartsDefaultOptions.xAxis.categories = xArray
        this.highchartsDefaultOptions.xAxis.labels = labels
        this.highchartsDefaultOptions.series = seriesArray
      },
//      通过层级和模板 得到 自定义表头
      makeupqualityCheckedtitle (floors, templte) {
        let dataArray = []
        for (let templteone = 0; templteone < templte.length; templteone++) {
          if (floors === 1) {
            dataArray.push(templte[templteone].value)
          }
          for (let qcone = 0; qcone < templte[templteone].child.length; qcone++) {
            if (floors === 1) { break }
            let op1child = templte[templteone].child[qcone]
            if (floors === 2) {
              dataArray.push(op1child.value)
            }
            for (let qctwo = 0; qctwo < op1child.child.length; qctwo++) {
              if (floors === 2) { break }
              let op2child = op1child.child[qctwo]
              if (floors === 3) {
                dataArray.push(op2child.value)
              }
              for (let qcthree = 0; qcthree < op2child.child.length; qcthree++) {
                if (floors === 3) { break }
                let op3child = op2child.child[qcthree]
                if (floors === 4) {
                  dataArray.push(op3child.value)
                }
                for (let qcfour = 0; qcfour < op3child.child.length; qcfour++) {
                  if (floors === 4) { break }
                  let op4child = op3child.child[qcfour]
                  if (floors === 5) {
                    dataArray.push(op4child.value)
                  }
                  for (let qcfive = 0; qcfive < op4child.child.length; qcfive++) {
                    if (floors === 5) { break }
                    let op5child = op4child.child[qcfive]
                    if (floors === 6) {
                      dataArray.push(op5child.value)
                    }
                    for (let qcsix = 0; qcsix < op5child.child.length; qcsix++) {
                      if (floors === 6) { break }
                      let op6child = op5child.child[qcsix]
                      if (floors === 7) {
                        dataArray.push(op6child.value)
                      }
                      for (let qcseven = 0; qcseven < op6child.child.length; qcseven++) {
                        if (floors === 7) { break }
                        let op7child = op6child.child[qcseven]
                        if (floors === 8) {
                          dataArray.push(op7child.value)
                        }
                        for (let qceight = 0; qceight < op7child.child.length; qceight++) {
                          if (floors === 8) { break }
                          let op8child = op7child.child[qceight]
                          if (floors === 9) {
                            dataArray.push(op8child.value)
                          }
                          for (let qcnine = 0; qcnine < op8child.child.length; qcnine++) {
                            if (floors === 9) { break }
                            let op9child = op8child.child[qcnine]
                            dataArray.push(op9child.value)
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return dataArray
      },
//      选择周期 二级联动
      changeCycle (value) {
        this.cycleSonArray = []
        this.ruleForm.qualityChecked_start_cycle = ''
        this.ruleForm.qualityChecked_end_cycle = ''
        let chooseCycleData = {}
        for (let i in this.queryQualityCheckedCycle) {
          if (value === this.queryQualityCheckedCycle[i]._id) {
            chooseCycleData = this.queryQualityCheckedCycle[i]
            console.log(JSON.stringify(chooseCycleData))
          }
        }
        console.log(chooseCycleData.cycleBegins)
        let intervals = this.constructCycleInterval(chooseCycleData.cycleBegins, chooseCycleData.cycleEnds, chooseCycleData.cycleInterval)
        console.log(intervals)
        let linkStr = ''
        for (let i = 0; i < intervals; i++) {
          if (chooseCycleData.cycleInterval === 'null' || chooseCycleData.cycleInterval === null) {
            linkStr = '_M_'
          } else if (chooseCycleData.cycleInterval === 1) {
            linkStr = '_D_'
          } else if (chooseCycleData.cycleInterval === 7) {
            linkStr = '_W_'
          } else {
            linkStr = '_' + chooseCycleData.cycleInterval + 'D_'
          }
          let cycleSonName = chooseCycleData.cycleName + linkStr + Number(i + 1)
          let cycleSonId = value + i
          let cycleSonObj = {
            cycleSonName: cycleSonName,
            cycleSonId: cycleSonId
          }
          this.cycleSonArray.push(cycleSonObj)
        }
        this.ruleForm.qualityChecked_start_cycle = this.cycleSonArray[0].cycleSonId
        this.ruleForm.qualityChecked_end_cycle = this.cycleSonArray[0].cycleSonId
      },
//      周期二级联动 求周期 级数
      constructCycleInterval (begin, end, interval) {
        if (interval === null || interval === 'null') {
          let bDate = begin.substring(5, 7)
          let eDate = end.substring(5, 7)
          let cycleStep = Number(bDate) - Number(eDate) + 1
          return cycleStep
        } else {
          let bDate = new Date(Date.parse(begin + ' 00:00:00'))
          let eDate = new Date(Date.parse(end + ' 00:00:00'))
          let timeMarkStart = bDate.getTime()
          let timeMarkEnd = eDate.getTime()
          let cycleStep = Math.ceil((timeMarkEnd - timeMarkStart) / (86400000 * interval))
          return cycleStep
        }
      },
//      质检模板 二级联动 层级
      changeFloor (value) {
        this.floor = []
        this.ruleForm.qualityChecked_floors = ''
        let qctable = []
        for (let i in this.queryQualityCheckedtabletitle) {
          if (value === this.queryQualityCheckedtabletitle[i]._id) {
            qctable = this.queryQualityCheckedtabletitle[i].config
            this.choosedQueryQualityCheckedtabletitleConfig = this.queryQualityCheckedtabletitle[i].config
          }
        }
        console.log(qctable)
        let temFloor = 1
        for (let qctb1 in qctable) {
          let op1child = qctable[qctb1]
          for (let qcone = 0; qcone < op1child.child.length; qcone++) {
            if (temFloor < 2) { temFloor = 2 }
            let op2child = op1child.child[qcone]
            for (let qctwo = 0; qctwo < op2child.child.length; qctwo++) {
              if (temFloor < 3) { temFloor = 3 }
              let op3child = op2child.child[qctwo]
              for (let qcthree = 0; qcthree < op3child.child.length; qcthree++) {
                if (temFloor < 4) { temFloor = 4 }
                let op4child = op3child.child[qcthree]
                for (let qcfour = 0; qcfour < op4child.child.length; qcfour++) {
                  if (temFloor < 5) { temFloor = 5 }
                  let op5child = op4child.child[qcfour]
                  for (let qcfive = 0; qcfive < op5child.child.length; qcfive++) {
                    if (temFloor < 6) { temFloor = 6 }
                    let op6child = op5child.child[qcfive]
                    for (let qcsix = 0; qcsix < op6child.child.length; qcsix++) {
                      if (temFloor < 7) { temFloor = 7 }
                      let op7child = op6child.child[qcsix]
                      for (let qcseven = 0; qcseven < op7child.child.length; qcseven++) {
                        if (temFloor < 8) { temFloor = 8 }
                        let op8child = op7child.child[qcseven]
                        for (let qceight = 0; qceight < op8child.child.length; qceight++) {
                          if (temFloor < 9) { temFloor = 9 }
                          let op9child = op8child.child[qceight]
                          for (let qcnine = 0; qcnine < op9child.child.length; qcnine++) {
                            if (temFloor < 10) { temFloor = 10 }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        let temFloorNum = 0
        for (let i = 0; i < temFloor; i++) {
          temFloorNum = 1 + i
          this.floor.push(temFloorNum)
        }
        this.ruleForm.qualityChecked_floors = this.floor[0]
      },
//        座席联想搜索 选择事件
      agentSelect () {
        for (let i in this.agentTags) {
          if (this.agentTags[i] === this.ruleForm.agentsName) {
            this.$message.error('您已选择该座席')
            return
          }
        }
        this.agentTags.push(this.ruleForm.agentsName)
      },
//      清空已选座席
      clearAgentsTags () {
        this.agentTags = []
      },
      delCurrentAgentTag (index) {
        this.agentTags.splice(index, 1)
      },
//      座席联想搜索==============================
      querySearch (queryString, cb) {
        let restaurants = this.restaurants
        let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0)
        }
      },
      loadRestaurants () {
        let data = []
        let agentsDatas = this.agents
        for (let k in agentsDatas) {
          data.push({value: agentsDatas[k].displayName})
        }
        return data
      }
//      ==============================================
    },
    components: {
      Affix
    },
    beforeMount () {
      let p1 = this.$store.dispatch('getCache', {type: 'agents'})
      let p2 = this.$store.dispatch('queryQualityCheckedtabletitle', {idle: ''})
      let p3 = this.$store.dispatch('queryQualityCheckedCycle', {idle: ''})
      Promise.all([p1, p2, p3]).then(() => {
        this.agents = this.$store.state.session.dicMap.agents
        this.restaurants = this.loadRestaurants()
        this.queryQualityCheckedtabletitle = this.$store.state.qualityCheck.queryQualityCheckedtabletitle
        this.queryQualityCheckedCycle = this.$store.state.qualityCheck.queryQualityCheckedCycle
        this.qualityCheckCloaycleding = true
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .qualityCheckCycle
    height calc(100vh - 96px)
    padding 0 20px
    overflow scroll
    .temp-search-wrap
      display inline-block
      width 290px
      margin-right 90px
      margin-bottom 20px
      .demonstration
        width 56px
        display inline-block
        text-align right
      .el-autocomplete
      .el-select
        width 230px
    .choosed-agent-wrap
      margin-left 56px
      border-top 1px solid #d3d3d3
      .choosed-agent-tip
        float left
        font-size 14px
        color #999
        margin 10px 0
      .choosed-agent-clear
        float right
        font-size 14px
        color #4ec5ad
        padding 10px
        cursor pointer
      .choosed-agent
        margin 0px 60px 10px 0
        display inline-block
        .choosed-agent-name
          font-size 14px
          color #b8b8b8
        .del
          font-size 14px
          margin-left 16px
          color #b8b8b8
          cursor pointer
    .ui-affix
      padding-bottom 0
      margin-top 40px
    .sub
      text-align right
      margin-top 30px
      .search
        display inline-block
        width 108px
        height 30px
        color #fff
        text-align center
        line-height 30px
        border-radius 2px
        cursor pointer
        background #1abb9c
    .table-wrap
      padding-bottom 20px
      .deploy
        height 48px
        line-height 48px
        color #989898
        border 1px solid #ebebeb
        border-bottom none
        padding-left 14px
        margin-top 30px
        .page-wrap
          float right
          .el-pagination
            line-height 30px
            margin 12px 10px 0
</style>
