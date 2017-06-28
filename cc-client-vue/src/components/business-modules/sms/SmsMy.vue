<!--我的短信：1.通过搜索条件  查询我发送的短信-->
<template>
  <div class="smsMy" v-if="!loading">
    <affix :label="$t('sms.mySmsSearch')"></affix>
    <!--搜索条件 start==================================-->
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
    <el-row>
      <div class="part">
        <span class="demonstration">{{$t('sms.timeScope')}}:</span>
        <el-date-picker size="small"
          class="date-choose"
          v-model="ruleForm.date"
          type="datetimerange"
          :editable="false"
          :picker-options="pickerOptions2"
          :placeholder="$t('sms.choTimeScope')"
          align="right">
        </el-date-picker>
      </div>
      <div class="part">
        <span class="demonstration">{{$t('sms.sendPhoneNum')}}:</span>
        <el-input size="small" class="phone-num" v-model="ruleForm.num"></el-input>
      </div>
      <div class="part">
        <span class="demonstration">{{$t('sms.smsState')}}:</span>
        <el-select size="small" class="status-choose" v-model="ruleForm.m7Status" :placeholder="$t('public.pleasePick')">
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
        <el-select size="small" class="sign-choose" v-model="ruleForm.sign" :placeholder="$t('public.pleasePick')">
          <el-option
            :label="$t('public.all')"
            :value="''">
          </el-option>
          <el-option
            class="sms-my-sign-select-option"
            v-for="item in smsSign"
            :label="item.name"
            :value="item.subcode">
          </el-option>
        </el-select>
      </div>
      <div class="submit">
        <el-button class="btn1" @click.stop="resetForm">{{$t('public.reset')}}</el-button>
        <el-button class="btn2" @click.stop="searchMySms">{{$t('public.search2')}}</el-button>
      </div>
    </el-row>
    </el-form>
    <!--搜索条件  end================================-->
    <affix :label="$t('sms.smsSearchList')"></affix>
    <div class="tables">
      <div class="caption">
        <span style="font-size:14px;">{{$t('sms.smsWenxintishi')}}<span>66</span>{{$t('sms.smsWenxintishiqian')}}</span>
          <Pagination
            class="fr"
            :small="true"
            :currentPage="currentPage"
            :count="count"
            @turnPage="handleCurrentChange"
            :totalPage="Math.ceil(count/pageSize)"
          >
          </Pagination>
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
            <el-tooltip class="item my-sms-con-tip" effect="dark" :content="tableData[scope.$index].content" :openDelay="200" transition="fade-leave" placement="left-start">
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
    name: 'smsMy',
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
//        搜索条件数据初始化
        smsStatus: '',
        smsSendingStatus: '',
        smsSign: '',
//        分页数据相关
        pageSize: 10,
        currentPage: 1,
//        搜索条件数据双向绑定
        ruleForm: {
          sign: '',
          date: '',
          num: '',
          m7Status: ''
        },
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
//      查询短信功能
      searchMySms () {
        this.currentPage = 1
        this.searchSms()
      },
//        分页查询
      handleCurrentChange (val) {
        this.currentPage = val
        this.searchSms()
      },
//      查询功能
      searchSms  () {
        this.tableLoading = true
        let data = {'pageSize': this.pageSize, 'page': this.currentPage}
        data.m7Status = this.ruleForm.m7Status
        data.sign = this.ruleForm.sign
        data.num = this.ruleForm.num
        data.smsSendingStatus = this.smsSendingStatus
        let notifyTime = this.ruleForm.date
        if (notifyTime) {
          if (notifyTime[0]) {
            data.BEGIN_TIME = getFormatDateTime(notifyTime[0])
          }
          if (notifyTime[1]) {
            data.END_TIME = getFormatDateTime(notifyTime[1])
          }
        }
        this.$store.dispatch('queryMySms', data).then(() => {
          this.tableLoading = false
        })
      }
    },
    computed: {
//        表单数据
      tableData () {
        let data = this.$store.state.sms.mySms.list
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
        return this.$store.state.sms.mySms.count
      }
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'my') {
          this.searchMySms()
        }
      }
    },
    beforeMount () {
      this.smsSendingStatus = this.$store.state.session.account.smsSendingStatus
      let data = {'pageSize': 10, 'page': 1}
      data.smsSendingStatus = this.smsSendingStatus
      let p1 = this.$store.dispatch('getCache', {type: 'agents'})
      let p2 = this.$store.dispatch('getCache', {type: 'smsSign'})
      let p3 = this.$store.dispatch('queryMySms', data)
      Promise.all([p1, p2, p3]).then(() => {
        this.agents = this.$store.state.session.dicMap.agents
        this.smsSign = this.$store.state.session.dicMap.smsSign
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
  .smsMy
    .tables
      padding 16px 20px 0 20px
      .caption
        color #00c7d1
        height 48px
        line-height 48px
        padding-left 14px
        border 1px solid #ddd
        border-bottom none
        .fr
          padding-top 10px
          height 38px
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
    .part
      display inline-block
      margin-bottom 20px
    .demonstration
      display inline-block
      width 70px
      text-align right
      margin-left 20px
      color $cf-gray1
    .sign-choose
    .date-choose
      width 360px
    .phone-num
    .status-choose
      width 200px
    .title
      color #999
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
  .sms-my-sign-select-option
    max-width 360px
    height auto
    word-wrap break-word
    white-space normal
</style>
