<template>
  <div class="reportTime">
    <el-row :gutter="12">
      <el-col :span="2">
        时间：
      </el-col>
      <el-col :span="3">
        <el-select size="small" v-model.trim="form.timeType" placeholder="" @change="typeChange">
          <el-option
            v-for="item in reportType"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <div v-if="this.form.timeType !== this.type">
        <el-col :span="3">
          <el-select size="small" v-model.trim="form.yearReport" placeholder="年" @change="yearChange">
            <el-option
              v-for="item in yearData"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" v-if="this.form.timeType === 'day' || this.form.timeType === 'month'">
          <el-select size="small" v-model.trim="form.monthReport" placeholder="月" @change="monthChange">
            <el-option
              v-for="item in monthData"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" v-if="this.form.timeType === 'day'">
          <el-select size="small" v-model.trim="form.dayReport" placeholder="日">
        <el-option
          v-for="item in dayData"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
        </el-col>
      </div>
      <div class="" v-if="this.form.timeType === this.type">
        <el-date-picker size="small"
          class="date"
          v-model.trim="otherTimes.beginDate"
          type="date"
          :editable="boolean"
          placeholder="开始日期"
          >
        </el-date-picker>
        <el-time-select
          class="time"
          v-if="openTime"
          size="small"
          v-model.trim="otherTimes.beginTime"
          :picker-options="optionsCurrent"
          :editable="boolean"
          placeholder="开始时间">
        </el-time-select>
        <el-date-picker size="small"
          class="date"
          v-model.trim="otherTimes.endDate"
          type="date"
          :editable="boolean"
          placeholder="结束日期">
        </el-date-picker>
        <el-time-select
          class="time"
          size="small"
          v-if="openTime"
          :editable="boolean"
          v-model.trim="otherTimes.endTime"
          :picker-options="optionsCurrent"
          placeholder="结束时间">
        </el-time-select>
      </div>
    </el-row>
  </div>
</template>
<script>
  import {getDateTime} from '../../../../utils/m7Utils.js'
  export default {
    name: 'datetime',
    props: {
      query: '',
      type: '', // 传值other other_half_hour
      initShow: {type: String, default: 'day'}
    },
    data () {
      return {
        openTime: '',
        boolean: false,
        optionsCurrent: '',
        options30: {
          start: '00:00',
          step: '00:30',
          end: '23:30'
        },
        options60: {
          start: '00:00',
          step: '01:00',
          end: '23:30'
        },
        reportType: [{label: this.$t('report.year'), value: 'year'}, {label: this.$t('report.month'), value: 'month'}, {label: this.$t('report.day'), value: 'day'}, {label: this.$t('report.other'), value: this.type}],
        year: [2010, (new Date()).getFullYear() + 1],
        form: {
          timeType: '',
          yearReport: '',
          monthReport: '',
          dayReport: ''
        },
        otherTimes: {beginTime: '', endTime: '', beginDate: '', endDate: ''}
      }
    },
    computed: {
      yearData () {
        let arr = []
        for (var i = this.year[0]; i < this.year[1]; i++) {
          arr.push({label: i + '年', value: i})
        }
        return arr
      },
      monthData () {
        let arr = []
        for (var i = 1; i < 13; i++) {
          arr.push({label: i + '月', value: i})
        }
        return arr
      },
      dayData () {
        let day = new Date(this.form.yearReport, this.form.monthReport, 0)
        let dayCount = day.getDate()
        let arr = []
        for (var i = 1; i < dayCount + 1; i++) {
          arr.push({label: i + '日', value: i})
        }
        return arr
      }
    },
    watch: {
      form: {
        deep: true,
        handler: function (newV) {
          if (newV.timeType !== 'other') {
            Object.assign(this.query, newV)
//            this.$emit('tellme', newV)
          } else {
            Object.assign(this.query, {timeType: this.form.timeType, StartTime: '', EndTime: ''})
//            this.$emit('tellme', )
          }
        }
      },
      otherTimes: {
        deep: true,
        handler: function (newV) {
          let start = getDateTime(newV.beginDate ? newV.beginDate : '', 'date')
          let end = getDateTime(newV.endDate ? newV.endDate : '', 'date')
          if (this.form.timeType === 'other_half_hour') {
            start += (' ' + newV.beginTime)
            end += (' ' + newV.endTime)
          }
          Object.assign(this.query, {timeType: this.form.timeType, StartTime: start, EndTime: end, normalStartTime: newV.beginDate, normalEndTime: newV.endDate})
//          this.$emit('tellme', )
        }
      }
    },
    methods: {
      typeChange (index) {
        if (!this.form.yearReport) {
          if (index !== this.type) {
            this.form.yearReport = (new Date()).getFullYear()
            this.form.monthReport = (new Date()).getMonth() + 1
            this.form.dayReport = (new Date()).getDate()
          } else {
            this.otherTime = {beginTime: '', endTime: '', beginDate: '', endDate: ''}
          }
        }
      },
      yearChange (index) {
        this.form.monthReport = this.monthData[0].value
        this.form.dayReport = this.dayData[0].value
      },
      monthChange () {
        this.form.dayReport = this.dayData[0].value
      },
      dayChange () {},
      options () {
        if (this.type === 'other') {
          this.openTime = false
        }
        if (this.type === 'other_half_hour') {
          this.openTime = true
          return this.options30
        }
      }
    },
    beforeMount () {
      if (!this.type) {
        this.reportType.pop()
      } else if (this.type === 'noDay') {
        this.reportType.pop()
        this.reportType.pop()
      }
      this.form.timeType = this.initShow
      this.typeChange(this.initShow)
      this.optionsCurrent = this.options()
    }
  }
</script>
<style lang="stylus" scoped>
  .date
    width 120px
  .time
    width 105px
  .el-row
    padding-left 18px
  .el-col-2
    margin-top 8px
    width 58px

</style>
