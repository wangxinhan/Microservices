<!--全部短信：通过搜索条件  查询全部短信-->
<template>
  <div class="smsAll" v-if="!loading">
    <affix :label="$t('sms.allSmsSearch')"></affix>
    <!--搜索条件 start==================================-->
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
    <el-row>
      <div class="part">
        <span class="demonstration">{{$t('sms.timeScope')}}:</span>
        <el-date-picker size="small"
          class="choose-date"
          v-model="ruleForm.date"
          type="datetimerange"
          :picker-options="pickerOptions2"
          :placeholder="$t('sms.choTimeScope')"
          :editable="false"
          align="right">
        </el-date-picker>
      </div>
      <div class="part">
        <span class="demonstration">{{$t('sms.sendPhoneNum')}}:</span>
        <el-input size="small" class="btn" v-model="ruleForm.phone"></el-input>
      </div>
      <div class="part">
        <span class="demonstration">{{$t('sms.smsState')}}:</span>
        <el-select size="small" v-model="ruleForm.desc" :placeholder="$t('public.pleasePick')">
          <el-option
            :label="$t('public.all')"
            :value="''">
          </el-option>
          <el-option
            v-for="item in smsStatus"
            :label="smsSendingStatus === 'showAll' ? item.code_name : item.code_name_display"
            :value="item.code_value">
          </el-option>
        </el-select>
      </div>
      <div class="part">
        <span class="demonstration">{{$t('sms.smsSign')}}:</span>
        <el-select size="small" class="choose-sign" v-model="ruleForm.region" :placeholder="$t('public.pleasePick')">
          <el-option
            :label="$t('public.all')"
            :value="''">
          </el-option>
          <el-option
            class="sms-all-sign-select-option"
            v-for="item in smsSign"
            :label="item.name"
            :value="item.subcode">
          </el-option>
        </el-select>
      </div>
      <div class="part">
        <span class="demonstration">{{$t('sms.sendAgents')}}:</span>
        <el-select size="small" v-model="ruleForm.createUser" :placeholder="$t('public.pleasePick')">
          <el-option
            :label="$t('public.all')"
            :value="''">
          </el-option>
          <el-option
            class="sms-all-agents-select-option"
            v-for="item in agents"
            :label="item.displayName"
            :value="item._id">
          </el-option>
        </el-select>
      </div>
      <div class="submit">
        <el-button class="btn1" @click.stop="resetForm">{{$t('public.reset')}}</el-button>
        <el-button class="btn2" @click.stop="searchAllSms">{{$t('public.search2')}}</el-button>
      </div>
    </el-row>
    </el-form>
    <!--搜索条件  end================================-->
    <affix :label="$t('sms.allSearchList')"></affix>
    <div class="export-excel">
      <el-button class="export-excel-btn" @click.stop="exportAllSmsExcel">{{$t('sms.exportExcel')}}</el-button>
    </div>
    <div class="tables">
      <div class="deploy">
        <span class="tip"><i class="iconfont icon-tixingweizhi"></i></span>
        <el-tooltip class="item" effect="dark" :content="$t('sms.smsWenxintishi') + 66 + $t('sms.smsWenxintishiqian')" placement="right">
          <span class="te">{{$t('sms.searchIntroduce')}}</span>
        </el-tooltip>
          <Pagination
            class="fr"
            :small="true"
            :currentPage="currentPage"
            :count="count"
            @turnPage="handleCurrentChange"
            :totalPage="Math.ceil(count/pageSize)"
          >
          </Pagination>
        <!-- <div class="page-wrap">
          <span class="fl all">{{$t('sms.gong')}}{{count || 0}}{{$t('sms.tiaoJiLu')}}&nbsp;|&nbsp;</span>
          <span class="currentpage">{{currentPage}}/{{Math.ceil(count/pageSize) || 1}}</span>
          <el-pagination
            small
            :page-size="10"
            layout=" prev, next"
            class="fr"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :total="count">
          </el-pagination>
        </div> -->
      </div>
      <!--表格===============================================-->
      <el-table :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="num" :label="$t('sms.sendPhoneNum')" width="140">
        </el-table-column>
        <el-table-column prop="agentsData" :label="$t('sms.sendAgents')" width="130">
        </el-table-column>
        <el-table-column prop="submitTime" :label="$t('sms.sendTime')" width="190">
        </el-table-column>
        <el-table-column prop="m7StatusName" :label="$t('sms.smsState')" width="110">
        </el-table-column>
        <el-table-column prop="splitCount" :label="$t('sms.splitNum')" width="90">
        </el-table-column>
        <el-table-column prop="signDisplay" :label="$t('sms.sign')" width="140">
        </el-table-column>
        <el-table-column :label="$t('sms.content')" width="">
          <template scope="scope">
            <el-tooltip class="con-tooltip" effect="dark" :content="tableData[scope.$index].content" :openDelay="200" transition="fade-leave" placement="left-start">
              <span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;padding-top: 6px;display: inline-block;max-width: 200px;">{{tableData[scope.$index].content}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column  :label="$t('sms.operate')" width="70">
          <template scope="scope">
            <el-button type="text" @click.stop="showSmsDetail(scope.$index, tableData)" size="small">{{$t('sms.searchToLook')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--表格==============================================================================-->
      <!--点击查看  dialog 短信详情    start  ===============================================-->
      <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('sms.smsDetailInfo')" v-model="dialogSmsDetailVisible" size="small">
        <el-row style="margin-bottom: 10px;">
          <el-col :span="3"><div>{{$t('sms.sendPhoneNum')}}:</div></el-col>
          <el-col :span="4"><div>{{smsDetail.num}}</div></el-col>
          <el-col :span="3"><div>{{$t('sms.sendTime')}}:</div></el-col>
          <el-col :span="6"><div>{{smsDetail.submitTime}}</div></el-col>
          <el-col :span="3"><div>{{$t('sms.splitNum')}}:</div></el-col>
          <el-col :span="5"><div>{{smsDetail.splitCount}}</div></el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="3"><div>{{$t('public.callStatus')}}:</div></el-col>
          <el-col :span="4"><div>{{smsDetail.m7StatusName}}</div></el-col>
          <el-col :span="3"><div>{{$t('sms.sendAgents')}}:</div></el-col>
          <el-col :span="6"><div>{{smsDetail.agentsData}}</div></el-col>
          <el-col :span="3"><div>{{$t('sms.smsSign')}}:</div></el-col>
          <el-col :span="5"><div>{{smsDetail.signDisplay}}</div></el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="3"><div>{{$t('sms.chanState')}}:</div></el-col>
          <el-col :span="21"><div>{{smsDetail.by_errordescription}}</div></el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;">
          <el-col :span="3"><div>{{$t('sms.smsCont')}}:</div></el-col>
          <el-col :span="21"><div>{{smsDetail.content}}</div></el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click.stop="dialogSmsDetailVisible = false">{{$t('sms.close')}}</el-button>
        </div>
      </el-dialog>
      <!--点击查看  dialog 短信详情    end   ===============================================-->
    </div>
  </div>
</template>
<script>
  import affix from '../../ui-modules/affix/Affix.vue'
  import Pagination from '../../public-modules/card/Pagination'
  import {getCache, getFormatDateTime} from '../../../utils/m7Utils.js'
  export default {
    name: 'smsAll',
    props: {
      refresh: String
    },
    data () {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: this.$t('sms.thisOneWeek'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.$t('sms.thisOneMonth'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: this.$t('sms.thisThreeMonth'),
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        loading: true,
        tableLoading: false,
//        分页数据相关
        pageSize: 10,
        currentPage: 1,
//        搜索条件数据双向绑定
        ruleForm: {
          region: '',
          date: '',
          phone: '',
          desc: '',
          createUser: ''
        },
//        搜索条件数据初始化
        smsStatus: [],
        smsSendingStatus: '',
        smsSign: [],
        agents: [],
//        查看短信详情开关
        dialogSmsDetailVisible: false,
//        短信详情信息初始化
        smsDetail: {}
      }
    },
    methods: {
//        点击查看
      showSmsDetail (index, rows) {
        this.dialogSmsDetailVisible = true
        this.smsDetail = rows[index]
      },
//      重置搜索条件
      resetForm () {
        for (let i in this.ruleForm) {
          this.ruleForm[i] = ''
        }
      },
//     查询所有短信
      searchAllSms () {
        this.currentPage = 1
        this.searchSms()
      },
//      分页查询
      handleCurrentChange (val) {
        this.currentPage = val
        this.searchSms()
      },
//     查询短信
      searchSms () {
        this.tableLoading = true
        let data = {'pageSize': this.pageSize, 'page': this.currentPage}
        data.num = this.ruleForm.phone
        data.smsSendingStatus = this.smsSendingStatus
        data.m7Status = this.ruleForm.desc
        data.sign = this.ruleForm.region
        data.createUser = this.ruleForm.createUser
        let notifyTime = this.ruleForm.date
        if (notifyTime) {
          if (notifyTime[0]) {
            data.BEGIN_TIME = getFormatDateTime(notifyTime[0])
          }
          if (notifyTime[1]) {
            data.END_TIME = getFormatDateTime(notifyTime[1])
          }
        }
        this.$store.dispatch('queryAllSms', data).then(() => {
          this.tableLoading = false
        })
      },
//      导出Excel
      exportAllSmsExcel () {
        let data = {}
        let dataQuery = {}
        dataQuery.num = this.ruleForm.phone
        dataQuery.m7Status = this.ruleForm.desc
        dataQuery.sign = this.ruleForm.region
        dataQuery.createUser = this.ruleForm.createUser
        let notifyTime = this.ruleForm.date
        if (notifyTime) {
          if (notifyTime[0]) {
            dataQuery.BEGIN_TIME = getFormatDateTime(notifyTime[0])
          }
          if (notifyTime[1]) {
            dataQuery.END_TIME = getFormatDateTime(notifyTime[1])
          }
        }
        dataQuery.accountId = this.$store.state.session.account.account
        dataQuery.smsSendingStatus = this.smsSendingStatus
        dataQuery.DISPOSAL_AGENT = ''
        data.Method = 'exportAllSmsExcel'
        data.Query = dataQuery
        console.log(JSON.stringify(data))
        this.$store.dispatch('exportAllSms', data).then(() => {
        })
      }
    },
    computed: {
//        重构表单数据
      tableData () {
        let data = this.$store.state.sms.allSms.list
        for (var i in data) {
          let agentsId = data[i].createUser
          let agentsDatas = this.agents
          for (var k in agentsDatas) {
            if (agentsDatas[k]._id === agentsId) {
              data[i].agentsData = agentsDatas[k].displayName
            }
          }
//          let smsStatusId = data[i].m7Status
//          let stateData = this.smsStatus
//          for (var j in stateData) {
//            if (stateData[j].code_value === smsStatusId) {
//              data[i].statusName = stateData[j].code_name
//            }
//          }
        }
        return data
      },
      count () {
        return this.$store.state.sms.allSms.count
      }
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'all') {
          this.searchAllSms()
        }
      }
    },
    beforeMount () {
//    搜索条件预加载
      let p1 = this.$store.dispatch('getCache', {type: 'agents'})
      let p2 = this.$store.dispatch('getCache', {type: 'smsSign'})
      Promise.all([p1, p2]).then(() => {
        let agents = this.$store.state.session.dicMap.agents
        this.agents = agents
        let smsSign = this.$store.state.session.dicMap.smsSign
        this.smsSign = smsSign
        this.smsSendingStatus = this.$store.state.session.account.smsSendingStatus
        this.smsStatus = getCache('smsStatus')
        if (this.smsSendingStatus !== 'showAll') {
          this.smsStatus = this.smsStatus.filter(item => {
            if (item.code_value !== 'deliver' && item.code_value !== 'undeliver') {
              return item
            }
          })
        }
        this.loading = false
      })
    },
    components: {
      affix,
      Pagination
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .smsAll
    .el-pagination
      padding 0
    .tables
      padding 16px 20px 0 20px
      .deploy
        height 48px
        line-height 48px
        color #1a1a1a
        border 1px solid #e7e7eb
        border-bottom none
        padding-left 14px
        .fr
          padding-top 10px
          height 38px
        .tex
        .te
          cursor pointer
          &:hover
            color #1abb9c
        .set
          margin-right 10px
          position relative
          top 2px
        .iconfont
          font-size 10px
          color #27c0a4
        .tip
          display inline-block
          height 16px
          width 16px
          border 1px solid #27c0a4
          text-align center
          line-height 14px
          border-radius 50%
          margin-right 10px
          position relative
          top -1px
    .ui-affix
      padding-bottom 0
    .submit
      text-align right
      margin 20px 0
      .btn1
      .btn2
        display inline-block
        width 110px
        height 30px
        font-size 12px
        line-height 30px
        text-align center
        color #fff
        padding 0
        background #7ccdd1
        border 1px solid #7ccdd1
      .btn2
        background #1abb9c
        border 1px solid #1abb9c
    .el-input
      width inherit
      width 194px
    .part
      margin-bottom 20px
      display inline-block
    .choose-date
    .choose-sign
      width 360px
    .demonstration
      display inline-block
      width 70px
      text-align right
      margin-left 20px
      color $cf-gray1
    .title
      color $cf-gray1
      margin 20px 0 18px 0
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
        border-bottom 1px dashed #999
        position absolute
        top 12px
    .export-excel
      text-align right
      .export-excel-btn
        font-size 12px
        line-height 30px
        text-align center
        color #fff
        padding 0 10px
        background #1abb9c
        border 1px solid #1abb9c
  .sms-all-sign-select-option
  .sms-all-agents-select-option
    max-width 360px
    height auto
    word-wrap break-word
    white-space normal
  .sms-all-agents-select-option
    max-width 194px
</style>
