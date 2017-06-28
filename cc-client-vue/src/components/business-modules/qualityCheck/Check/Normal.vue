<template>
  <div class="normal">
    <div class="top">
      <!--<h3 class="title"><span class="sign"></span><span class="text">查询条件</span></h3>-->
      <affix :label="'查询条件'"></affix>
      <div class="tem">
        <span class="temp">{{$t('qualityCheck.qualityTemplate')}}：</span>
        <el-radio-group v-model.trim="value" @change="change" v-if="items.length!==0">
          <el-radio size="small"
            :label="index" v-for="(item, index) in items" >
              {{item.name}}
              <span v-if="item.QUALITY_TYPE==='qualityWebchat'">{{$t('qualityCheck.webchat')}}</span>
              <span v-else>{{$t('qualityCheck.call')}}</span>
          </el-radio>
        </el-radio-group>
        <span v-else>{{$t('qualityCheck.pleaseExployModel')}}</span>
      </div>
      <div v-if="items.length!==0">
        <div class="sear" v-if="template.QUALITY_TYPE==='qualityWebchat'">
        <span class="temp">{{$t('qualityCheck.condition')}}：</span>
          <el-form :inline="true" :model="chatForm" :rules="rules" ref="chatForm"  class="demo-form-inline">
            <el-row>
              <span style="margin-right: 24px">{{$t('public.agent')}}：</span>
              <el-select size="small" v-model.trim="chatForm.user" filterable :placeholder="$t('public.pleasePick')">
                <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
                <el-option
                  v-for="item in agentList"
                  :label="item.displayName"
                  :value="item._id"
                  >
                  <span >{{ item.displayName }}</span>
                  <span >[<span>{{ item.exten }}</span>]</span>
                </el-option>
              </el-select>
              <span>{{$t('webchat.endType')}}:</span>
              <el-select size="small" v-model.trim="chatForm.finishKey" filterable :placeholder="$t('public.all')">
                <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
                <el-option
                  v-for="item in finishReasonList"
                  :label="item.name"
                  :value="item.key"
                  >
                </el-option>
              </el-select>
              <span>{{$t('public.satisfaction')}}:</span>
              <el-select size="small" v-model.trim="chatForm.appraiseKey" filterable :placeholder="$t('public.all')">
                <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
                <el-option
                  v-for="item in appraiseList"
                  :label="item.name"
                  :value="item.key"
                  >
                </el-option>
              </el-select>
            </el-row>
            <el-row>
              <span class="takeTime">{{$t('webchat.takeTime')}}：</span>
              <el-date-picker size="small"
                v-model.trim="chatForm.beginTime"
                type="datetimerange"
                :picker-options="pickerOptions2"
                :placeholder="$t('public.timeRanges')"
                :editable="boolean"
                align="right"
                @change=timeChange>
              </el-date-picker>
              <span>{{$t('webchat.msgNum')}}:</span>
              <el-radio-group v-model.trim="chatForm.msgCountType">
                <el-radio size="small" label="gt" >{{$t('webchat.moreThan')}}</el-radio>
                <el-radio size="small" label="lt" >{{$t('webchat.lessThan')}}</el-radio>
                <el-radio size="small" label="eq" >{{$t('webchat.equal')}}</el-radio>
              </el-radio-group>
              <el-form-item prop="msgCount">
                <el-input size="small" v-model.trim="chatForm.msgCount" :placeholder="$t('public.pleaseEnter')"></el-input>
              </el-form-item>
            </el-row>
          </el-form>
          <div class="sub">
            <span class="rest" @click="rest">{{$t('public.reset')}}</span>
            <span class="search" @click="query">{{$t('public.search2')}}</span>
          </div>
          </el-form>
        </div>
        <div class="sear" v-else>
        <p style="margin-bottom: 20px;color:#1a1a1a">{{$t('public.searchBadge')}}</p>
          <el-row :gutter="20" style="padding-bottom: 0px">
            <el-col :span="20">
              <el-form :inline="true" :model="callForm" :rules="rules" ref="callForm"  class="demo-form-inline">
                <div class="padding">
                  <el-form-item :label="$t('public.callTime')+':'">
                    <el-date-picker size="small"
                      v-model.trim="callForm.beginTime"
                      type="datetimerange"
                      :picker-options="pickerOptions2"
                      :placeholder="$t('public.timeRanges')"
                      align="right"
                      :editable="boolean"
                      @change=callTimeChange>
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item :label="$t('call.callType')+':'">
                    <el-select size="small" v-model.trim="callForm.CONNECT_TYPE" filterable :placeholder="$t('webchat.webchatAll')">
                      <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
                      <el-option
                        v-for="item in callTypeList"
                        :label="item.code_name"
                        :value="item.code_value"
                        >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="padding">
                  <el-form-item :label="$t('qualityCheck.callAgent')+':'">
                    <el-select size="small" v-model.trim="callForm.DISPOSAL_AGENT" filterable :placeholder="'--'+$t('webchat.webchatAll')+'--'">
                      <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
                      <el-option
                        v-for="item in callAgentList"
                        :label="item.labelCall"
                        :value="item._id"
                        >
                        <span >{{ item.displayName }}</span>
                        <span >[<span>{{ item.exten }}</span>]</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('public.queues')+':'">
                    <el-select size="small" v-model.trim="callForm.ERROR_MEMO" filterable :placeholder="$t('webchat.webchatAll')">
                      <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
                      <el-option
                        v-for="item in callQueueList"
                        :label="item.DisplayName"
                        :value="item.Exten"
                        >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="padding check-padding">
                  <el-form-item :label="$t('qualityCheck.callingNumber')+':'" prop="CALL_NO">
                    <el-input size="small" v-model.trim="callForm.CALL_NO" :placeholder="$t('public.pleaseEnter')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('qualityCheck.calledNumber')+':'" prop="CALLED_NO" class="called">
                    <el-input size="small" v-model.trim="callForm.CALLED_NO" :placeholder="$t('public.pleaseEnter')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('public.satisfaction')+':'">
                    <el-select size="small" v-model.trim="callForm.INVESTIGATE" filterable :placeholder="'--'+$t('webchat.webchatAll')+'--'+':'">
                      <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
                      <el-option
                        v-for="item in satisfactionList"
                        :label="item.name"
                        :value="item.value"
                        >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="check-padding">
                  <el-form-item :label="$t('call.callTime')+':'" prop="CALL_TIME_LENGTH_BEGIN">
                    <div class="condition-form">
                      <el-input size="small" placeholder="" v-model.trim="callForm.CALL_TIME_LENGTH_BEGIN">
                        <template slot="append">{{$t('public.seconds')}}</template>
                      </el-input>
                    </div>
                  </el-form-item>
                  <span style="display: inline-block"></span>
                  <el-form-item :label="$t('public.to')" prop="CALL_TIME_LENGTH_END" class="to">
                    <div class="condition-form">
                      <el-input size="small" placeholder="" v-model.trim="callForm.CALL_TIME_LENGTH_END">
                        <template slot="append">{{$t('public.seconds')}}</template>
                      </el-input>
                    </div>
                  </el-form-item>
                </div>
                <div class="padding">
                  <el-form-item :label="$t('qualityCheck.callLabelSort')+':'">
                    <el-col class="label-select-wrap">
                      <label-select @labelSelect="labelSelect" :resetSelect="resetSelect"></label-select>
                    </el-col>
                  </el-form-item>
                </div>
              </el-form>
            </el-col>
          </el-row>
          <div class="sub">
            <span class="rest" @click="rest">{{$t('public.reset')}}</span>
            <span class="search" @click="query">{{$t('public.search2')}}</span>
          </div>
        </div>
      </div>
      <!--<h3 class="title"><span class="sign"></span><span class="text">{{$t('public.searchResult')}}</span></h3>-->
      <affix :label="$t('public.searchResult')"></affix>
      <!-- 通话质检 -->
      <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('qualityCheck.callQualityInfo')" v-model.trim="callDialogShow" size="tiny" class="score" @close="off" :close-on-click-modal="false">
        <call-grade :currentItemCall = "this.currentItemCall"  :currentGrade = "0"  :template = "this.template" @saveGrade="saveGrade" :qcResectLabel="qcResectLabel" @off="off" @handle="handle" :refreshCallGrade="refreshCallGrade"></call-grade>
      </el-dialog>
      <!-- 在线客服质检 -->
      <el-dialog  modal-append-to-body lock-scroll top="10%"  :title="$t('qualityCheck.webchatQualityInfo')" v-model.trim="webchatDialogShow" size="tiny" class="score" @close="off">
        <webchat-grade :currentItem = "this.currentItem" :currentGrade = "0" :template = "this.template" @off="off" @saveGrade="saveGrade"></webchat-grade>
      </el-dialog>
      <big-image :imgInfo="bigImage" @closeImageDialog="closeBigImage"></big-image>
    </div>
    <div class="tables">
      <div class="deploy">
        <div class="search-pagination" v-if="template.QUALITY_TYPE==='qualityWebchat'">
          <pagination
                  :small="pagination.small"
                  :currentPage="pagination.currentPage"
                  :count="count"
                  @turnPage="turnPage"
                  :totalPage="totalPage"
                  >
          </pagination>
        </div>
        <div class="search-pagination" v-else>
          <pagination
            :small="pagination.small"
            :currentPage="paginationCall.currentPage"
            :count="count"
            @turnPage="turnPage"
            :totalPage="totalPage"
          >
          </pagination>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" v-show="this.template.QUALITY_TYPE!=='qualityWebchat'">
        <el-table-column prop="CUSTOMER_NAME" :label="$t('public.locationCustomer')" width="">
        </el-table-column>
        <el-table-column prop="CALL_NO_SHOW" :label="$t('qualityCheck.callingNumber')" width="">
        </el-table-column>
        <el-table-column prop="CALLED_NO_SHOW" :label="$t('qualityCheck.calledNumber')" width="">
        </el-table-column>
        <el-table-column prop="CONNECT_TYPE_show" :label="$t('call.callType')" width="">
        </el-table-column>
        <el-table-column prop="STATUS_show" :label="$t('qualityCheck.answerState')" width="">
        </el-table-column>
        <el-table-column prop="DISPOSAL_AGENT_show" :label="$t('call.callRingSeat')" width="">
        </el-table-column>
        <el-table-column prop="QUEUE_NAME" :label="$t('call.skillGroup')" width="">
        </el-table-column>
        <el-table-column prop="INVESTIGATE_show" :label="$t('public.satisfaction')" width="">
        </el-table-column>
        <el-table-column prop="OFFERING_TIME" :label="$t('public.callTime')" width="">
        </el-table-column>
        <el-table-column prop="CALL_TIME_LENGTH_show" :label="$t('call.callTime')" width="">
        </el-table-column>
        <el-table-column  :label="$t('public.operate')" width="">
          <template scope="scope2">
            <el-button @click="handle(scope2.row)" type="text" size="small">{{$t('qualityCheck.grade')}}</el-button>
            <br>
            <el-button type="text" @click="look(scope2.row._id)" size="small" >{{$t('qualityCheck.viewLook')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData" style="width: 100%" v-show="this.template.QUALITY_TYPE==='qualityWebchat'">
        <el-table-column prop="sName" :label="$t('public.customerName')" width="">
        </el-table-column>
        <el-table-column prop="userName" :label="$t('public.handleAgent')" width="">
        </el-table-column>
        <el-table-column prop="beginTime" :label="$t('webchat.claimTime')" width="">
        </el-table-column>
        <el-table-column prop="toPeerName" :label="$t('public.queues')" width="">
        </el-table-column>
        <el-table-column prop="satisfaction" :label="$t('public.satisfaction')" width="">
        </el-table-column>
        <el-table-column prop="chatDuration" :label="$t('webchat.dialogueDuration')" width="">
        </el-table-column>
        <el-table-column prop="totalMsgCount" :label="$t('webchat.msgNum')" width="">
        </el-table-column>
        <el-table-column  :label="$t('public.operate')" width="">
          <template scope="scope">
            <el-button @click="handle(scope.row)" type="text" size="small">{{$t('qualityCheck.grade')}}</el-button>
            <el-button type="text" @click="look(scope.row._id)" size="small" >{{$t('qualityCheck.viewLook')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="looklog">
        <el-dialog modal-append-to-body lock-scroll top="10%" v-model.trim="isShow" :title="title">
          <div class="tables">
          <div class="deploy">
            <div class="search-pagination">
              <pagination
                      :small="paginationRecord.small"
                      :currentPage="paginationRecord.currentPage"
                      :count="countRecord"
                      @turnPage="turnPageRecord"
                      :totalPage="totalPageRecord"
                      >
              </pagination>
            </div>
          </div>
          <el-table :data="recordList" style="width: 100%">
            <el-table-column prop="user" :label="listenpp" width="">
            </el-table-column>
            <el-table-column prop="" label="" width="">
            </el-table-column>
            <el-table-column prop="time" :label="listenTime" width="">
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import Pagination from '../../../public-modules/card/Pagination'
  import {deepClone, getDateTime} from '../../../../utils/m7Utils.js'
  import {checkform} from '../../../../utils/validate.js'
  import item from './item'
  import WebchatGrade from './WebchatGrade'
  import BigImage from '../../../public-modules/bigImage/BigImage'
  import CallGrade from './CallGrade'
  import LabelSelect from '../../../public-modules/phone-bar/LabelSelect.vue'
  import Affix from '../../../ui-modules/affix/Affix.vue'
  export default {
    name: 'normal',
    data () {
      let validate1 = (rule, value, callback) => {
        if (value !== '') {
          let match = checkform(value, 'Number3')
          if (match) {
            callback(new Error(this.$t('qualityCheck.pleaseEnterRightNum')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      let validate2 = (rule, value, callback) => {
        if (value !== '') {
          let match = checkform(value, 'Number3')
          if (match) {
            callback(new Error(this.$t('qualityCheck.pleaseEnterPositiveInteger')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        value: '',
        boolean: false,
        isSave: false,
        currentIndex: 0,
        webchatDialogShow: false,
        callDialogShow: false,
        qcResectLabel: false,
        currentItem: {},
        currentItemCall: {},
        chatForm: {
          beginTime: '',
          finishKey: '',
          user: '',
          appraiseKey: '',
          msgCount: '',
          msgCountType: ''
        },
        webchatCustData: {},
        chatInfo: {},
        callForm: {
          beginTime: '',
          CONNECT_TYPE: '',
          DISPOSAL_AGENT: '',
          ERROR_MEMO: '',
          CALLED_NO: '',
          CALL_NO: '',
          INVESTIGATE: '',
          multiFirst: '',
          multiTwo: '',
          multiThree: '',
          singleLabel: '',
          CALL_TIME_LENGTH_BEGIN: '',
          CALL_TIME_LENGTH_END: ''
        },
        template: {},
        isShow: false,
        title: '',
        listenTime: '',
        listenpp: '',
        rules: {
          CALL_NO: [
            {validator: validate1, trigger: 'blur'}
          ],
          CALLED_NO: [
            {validator: validate1, trigger: 'blur'}
          ],
          CALL_TIME_LENGTH_BEGIN: [
            {validator: validate2, trigger: 'blur'}
          ],
          CALL_TIME_LENGTH_END: [
            {validator: validate2, trigger: 'blur'}
          ],
          msgCount: [
            {validator: validate2, trigger: 'blur'}
          ]
        },
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
        refreshCallGrade: '',
        recordList: [],
        finishReasonList: [],
        agentList: [],
        labelType: 'single',
        labelDataCache: [],
        labelData: {},
        configList: [],
        callTypeList: [],
        callAgentList: [],
        callQueueList: [],
        appraiseList: [],
        satisfactionList: [],
        items: [],
        pagination: {
          small: false,
          currentPage: 1
        },
        paginationCall: {
          small: false,
          currentPage: 1
        },
        paginationRecord: {
          small: false,
          currentPage: 1
        },
        currentId: '',
        getCallCache: false,
        getWebchatCache: false,
        bigImage: {
          bigImageShow: false,
          url: ''
        },
        resetSelect: false
      }
    },
    components: {
      // history,
      item,
      Pagination,
      WebchatGrade,
      CallGrade,
      BigImage,
      LabelSelect,
      Affix
    },
    methods: {
      labelSelect (data) { // 子组件外抛出来的表单
        this.resetSelect = false
        this.callForm.multiFirst = data.multiFirst
        this.callForm.multiTwo = data.multiTwo
        this.callForm.multiThree = data.multiThree
      },
      saveGrade (gradeObj, SQlabel) {
        this.isSave = true
        this.$store.commit('deleteGraded/qualityCheck', this.currentIndex)
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          let data = deepClone(gradeObj)
          data._id = this.currentItem._id
          data.TEMPLATE = this.template._id
          data.values = gradeObj.obj
          let self = this
          this.$store.dispatch('saveWebchatSheetGrade', {data, currentItem: this.currentItem}).then((res) => {
            self.webchatDialogShow = false
            this.$store.commit('deleteGraded/qualityCheck', 1)
            if (self.tempList.length <= 0) {
              self.$message.success(this.$t('qualityCheck.allRatingFinish'))
            } else {
              self.$message.success(this.$t('qualityCheck.rateSuccessNext'))
              this.handle(self.tempList[0])
            }
          })
        } else if (this.template.type === 'pass') {
          let data = {}
          data.CALL_SHEET_ID = this.currentItemCall.CALL_SHEET_ID
          gradeObj.config.amount = gradeObj.grade.amount
          data.QUALITY_GRADE = gradeObj.config
          data.COMMENTS = gradeObj.grade.COMMENT
          let GRADE_DATA = {}
          GRADE_DATA._id = this.currentItemCall._id
          GRADE_DATA.OFFERING_TIME = this.currentItemCall.OFFERING_TIME
          GRADE_DATA.DISPOSAL_AGENT = this.currentItemCall.DISPOSAL_AGENT
          GRADE_DATA.CALL_NO = this.currentItemCall.CALL_NO
          GRADE_DATA.CALLED_NO = this.currentItemCall.CALLED_NO
          GRADE_DATA.CONNECT_TYPE = this.currentItemCall.CONNECT_TYPE
          GRADE_DATA.ERROR_MEMO = this.currentItemCall.ERROR_MEMO
          GRADE_DATA.CALL_TIME_LENGTH = this.currentItemCall.CALL_TIME_LENGTH
          GRADE_DATA.FILE_SERVER = this.currentItemCall.FILE_SERVER
          GRADE_DATA.RECORD_FILE_NAME = this.currentItemCall.RECORD_FILE_NAME
          GRADE_DATA.INVESTIGATE = this.currentItemCall.INVESTIGATE
          GRADE_DATA.GRADE_AMOUNT = gradeObj.config
          GRADE_DATA.COMMENTS = gradeObj.COMMENT
          GRADE_DATA.TEMPLATE = this.template._id
          GRADE_DATA.SQ_LABEL = SQlabel
          data.GRADE_DATA = GRADE_DATA
          data.SQ_LABEL = SQlabel
          let self = this
          this.$store.dispatch('saveCallShellGrade', {data}).then((res) => {
            self.callDialogShow = false
            self.qcResectLabel = false
            this.$store.commit('deleteGraded/qualityCheck', 1)
            if (self.tempList.length <= 0) {
              self.$message.success(this.$t('qualityCheck.allRatingFinish'))
            } else {
              self.$message.success(this.$t('qualityCheck.rateSuccessNext'))
              this.handle(self.tempList[0])
            }
          })
        } else {
          let data = {}
          data.CALL_SHEET_ID = this.currentItemCall.CALL_SHEET_ID
          data.QUALITY_GRADE = gradeObj.grade
          data.COMMENTS = gradeObj.COMMENT
          let GRADE_DATA = {}
          GRADE_DATA._id = this.currentItemCall._id
          GRADE_DATA.OFFERING_TIME = this.currentItemCall.OFFERING_TIME
          GRADE_DATA.DISPOSAL_AGENT = this.currentItemCall.DISPOSAL_AGENT
          GRADE_DATA.CALL_NO = this.currentItemCall.CALL_NO
          GRADE_DATA.CALLED_NO = this.currentItemCall.CALLED_NO
          GRADE_DATA.CONNECT_TYPE = this.currentItemCall.CONNECT_TYPE
          GRADE_DATA.ERROR_MEMO = this.currentItemCall.ERROR_MEMO
          GRADE_DATA.CALL_TIME_LENGTH = this.currentItemCall.CALL_TIME_LENGTH
          GRADE_DATA.FILE_SERVER = this.currentItemCall.FILE_SERVER
          GRADE_DATA.RECORD_FILE_NAME = this.currentItemCall.RECORD_FILE_NAME
          GRADE_DATA.INVESTIGATE = this.currentItemCall.INVESTIGATE
          GRADE_DATA.GRADE_AMOUNT = gradeObj.grade
          GRADE_DATA.COMMENTS = gradeObj.COMMENT
          GRADE_DATA.TEMPLATE = this.template._id
          GRADE_DATA.SQ_LABEL = SQlabel
          data.SQ_LABEL = SQlabel
          for (let i in gradeObj.obj) {
            GRADE_DATA[i] = gradeObj.obj[i]
          }
          data.GRADE_DATA = GRADE_DATA

          let self = this
          this.$store.dispatch('saveCallGradeForScore', {data}).then((res) => {
            self.callDialogShow = false
            self.qcResectLabel = false
            // 删除tempList评价完的那个
            this.$store.commit('deleteGraded/qualityCheck', 1)
            if (self.tempList.length <= 0) {
              self.$message.success(this.$t('qualityCheck.allRatingFinish'))
            } else {
              self.$message.success(this.$t('qualityCheck.rateSuccessNext'))
              this.handle(self.tempList[0])
            }
          })
        }
      },
      getMoreQualityCheckCallSheet () {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.chatForm.menuId = 'quality_check_query'
          delete this.chatForm.cdrId
          if (this.chatForm.beginTime && this.chatForm.beginTime[0] !== null) {
            this.chatForm.beginTimeBegin = getDateTime(this.chatForm.beginTime[0])
          }
          if (this.chatForm.beginTime && this.chatForm.beginTime[1] !== null) {
            this.chatForm.beginTimeEnd = getDateTime(this.chatForm.beginTime[1])
          }
          if (this.chatForm.beginTimeEnd === '' && this.chatForm.beginTimeBegin === '') {
            this.chatForm.beginTime = ''
          }
          this.chatForm.pageSize = 10
          let form = deepClone(this.chatForm)
          this.$store.dispatch('getMoreQualityCheckCallSheet', {data: form, tempList: this.tempList, type: 'webchat'})
        } else {
          this.callForm.cdrId = 'quality_check_query'
          if (this.callForm.beginTime && this.callForm.beginTime[0] !== null) {
            this.callForm.BEGIN_TIME = getDateTime(this.callForm.beginTime[0])
          }
          if (this.callForm.beginTime && this.callForm.beginTime[1] !== null) {
            this.callForm.END_TIME = getDateTime(this.callForm.beginTime[1])
          }
          this.callForm.pageSize = 10
          let form = deepClone(this.callForm)
          this.$store.dispatch('getMoreQualityCheckCallSheet', {data: form, tempList: this.tempList, type: 'call'})
        }
      },
      closeBigImage () {
        this.bigImage.bigImageShow = false
        this.bigImage.url = ''
      },
      shwoBigImage (data) {
        if (this.qualityCheck) {
          return
        }
        this.bigImage.url = data
        this.bigImage.bigImageShow = true
      },
      look (_id) {
        this.paginationRecord.currentPage = 1
        this.countRecord = 0
        this.totalPageRecord = 0
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.queryRecordWebchatSessionLog(_id, 1)
        } else {
          this.queryRecordCallListenLog(_id, 1)
        }
      },
      queryRecordWebchatSessionLog (_id, page) {
        this.currentId = _id
        this.title = this.$t('qualityCheck.onlineWebchatLog')
        this.listenpp = this.$t('qualityCheck.checkPeople')
        this.listenTime = this.$t('qualityCheck.checkTime1')
        this.$store.dispatch('queryRecordWebchatSessionLog', {'sessionId': _id, 'page': page, 'pageSize': 10}).then(() => {
          this.recordList = this.$store.state.qualityCheck.recordList.list
          this.countRecord = this.$store.state.qualityCheck.recordList.count
          this.totalPageRecord = Math.ceil(this.$store.state.qualityCheck.recordList.count / 10) || 0
          this.isShow = true
        })
      },
      queryRecordCallListenLog (_id, page) {
        this.currentId = _id
        this.title = this.$t('qualityCheck.callQualityLookLog')
        this.listenpp = this.$t('qualityCheck.checkPeople')
        this.listenTime = this.$t('qualityCheck.checkTime1')
        this.$store.dispatch('queryRecordCallListenLog', {'CALL_SHEET_ID': _id, 'page': page, 'pageSize': 10}).then(() => {
          this.recordList = this.$store.state.qualityCheck.recordList.list
          this.countRecord = this.$store.state.qualityCheck.recordList.count
          this.totalPageRecord = Math.ceil(this.$store.state.qualityCheck.recordList.count / 10) || 0
          this.isShow = true
        })
      },
      off () {
        this.webchatDialogShow = false
        this.callDialogShow = false
        this.qcResectLabel = false
        let play = document.getElementById('quality-autoplay')
        if (play) {
          play.pause()
        }
        this.$store.commit('webchat/QUALITY_QUERY_WEBCHAT_HISTORY_CLEAR')
        if (this.isSave === true) {
          this.query()
        }
      },
      rest () {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          for (let i in this.chatForm) {
            this.chatForm[i] = ''
          }
        } else {
          for (let i in this.callForm) {
            this.callForm[i] = ''
          }
          this.resetSelect = true
        }
      },
      handle (data) {
        this.currentIndex = 0
        for (let i = 0; i < this.tempList.length; i++) {
          if (this.tempList[i]._id === data._id) {
            this.currentIndex = i
            break
          }
        }
        var num = this.tempList.length - this.currentIndex
        if (num < 5) {
          setTimeout(this.getMoreQualityCheckCallSheet, 1000)
        }
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.webchatDialogShow = true
          let self = this
          self.currentItem = data
        } else {
          this.callDialogShow = true
          this.qcResectLabel = true
          this.$store.dispatch('queryBusiness', {callId: data._id, customer: data.CUSTOMER_ID}).then((res) => {
            data.audio = this.recordFileName(data.FILE_SERVER, data.RECORD_FILE_NAME)
            if (res && res.length > 0) {
              data.busHistory = [res[0]]
            } else {
              data.busHistory = []
            }
            this.currentItemCall = data
            this.refreshCallGrade = Math.random()
          })
        }
      },
      change (index) {
        this.template = this.items[index]
        if (this.items[index].QUALITY_TYPE === 'qualityWebchat') {
          if (this.getWebchatCache === false) {
            this.renderWebchatCache()
          }
          this.getQualityCheckWebchatSession()
        } else {
          if (this.getCallCache === false) {
            this.renderCallCache()
          }
          this.getNormalCallsheetData()
        }
      },
      recordFileName (server, name) {
        let local = window.location.href
        if (local.indexOf('https') > -1) { // 更换录音访问地址头
          let userPbx = this.$store.state.session.user.pbx
          let pbxList = this.$store.state.session.dicMap.pbx
          for (let i = 0; i < pbxList.length; i++) {
            if (pbxList[i]._id === userPbx) {
              if (server) {
                if (pbxList[i].assDomain) {
                  server = pbxList[i].assDomain
                }
              }
            }
          }
        }
        return server + '/' + name
      },
      timeChange (value) {
        if (!value) {
          this.chatForm.beginTimeBegin = ''
          this.chatForm.beginTimeEnd = ''
          this.chatForm.begin = ''
        }
      },
      callTimeChange (value) {
        if (!value) {
          this.callForm.beginTime = ''
          this.callForm.BEGIN_TIME = ''
          this.callForm.END_TIME = ''
        }
      },
      fetchData () {
        let self = this
        this.$store.dispatch('getCache', {type: 'qualityCheckTemplates'}).then((res) => {
          self.items = res
          self.value = 0
          self.template = res[0]
          self.change(0)
        })
      },
      renderCallCache () {
        this.getCallCache === true
        let self = this
        this.$store.dispatch('getCache', {type: 'callType'}).then((res) => {
          self.callTypeList = res
        })
        this.$store.dispatch('getCache', {type: 'agents'}).then((res) => {
          res.forEach((item) => {
            item.labelCall = item.displayName + '【' + item.exten + '】'
          })
          self.callAgentList = res
        })
        this.$store.dispatch('getCache', {type: 'queues'}).then((res) => {
          self.callQueueList = res
        })
        this.$store.dispatch('getCache', {type: 'options'}).then((res) => {
          let _dics = []
          for (let i = 0; i < res.length; i++) {
            var obj = res[i]
            if (obj.name === this.$t('qualityCheck.satisfactionSurveyOptions')) {
              _dics = obj.options || []
              break
            }
          }
          let satisfactionList = []
          for (var n = 0; n < _dics.length; n++) {
            satisfactionList.push({name: _dics[n].name, value: _dics[n].options[0].name})
          }
          self.satisfactionList = satisfactionList
        })
      },
      renderWebchatCache () {
        this.getWebchatCache === true
        let self = this
        this.$store.dispatch('getCache', {type: 'agents'}).then((res) => {
          self.agentTempList = res
          self.agentList = res
        })
        this.$store.dispatch('getCache', {type: 'channelDic'}).then((dics) => {
          let _dics = []
          for (var i = 0; i < dics.length; i++) {
            let obj = dics[i]
            if (obj.type === 'webchat') {
              _dics = obj.options || []
              break
            }
          }
          let finishKeys = []
          for (let i = 0; i < _dics.length; i++) {
            finishKeys.push(_dics[i])
            let level2 = deepClone(_dics[i].options)
            if (level2) {
              for (let m = 0; m < level2.length; m++) {
                level2[m].name = _dics[i].name + '->' + level2[m].name
                finishKeys.push(level2[m])
                var level3 = deepClone(level2[m].options)
                if (level3) {
                  for (var n = 0; n < level3.length; n++) {
                    level3[n].name = level2[m].name + '->' + level3[n].name
                    finishKeys.push(level3[n])
                  }
                }
              }
            }
          }
          finishKeys.push({name: this.$t('webchat.addBlack'), value: 'add_black'})
          self.finishReasonList = finishKeys
        })
        this.$store.dispatch('getCache', {type: 'channelDic'}).then((dics) => {
          for (var i = 0; i < dics.length; i++) {
            let obj = dics[i]
            if (obj.type === 'webchatCSR') {
              self.appraiseList = obj.options || []
              break
            }
          }
        })
      },
      getQualityCheckWebchatSession () {
        this.chatForm.menuId = 'quality_check_query'
        if (this.chatForm.beginTime && this.chatForm.beginTime[0] !== null) {
          this.chatForm.beginTimeBegin = getDateTime(this.chatForm.beginTime[0])
        }
        if (this.chatForm.beginTime && this.chatForm.beginTime[1] !== null) {
          this.chatForm.beginTimeEnd = getDateTime(this.chatForm.beginTime[1])
        }
        if (this.chatForm.beginTimeEnd === '' && this.chatForm.beginTimeBegin === '') {
          this.chatForm.beginTime = ''
        }
        this.chatForm.pageSize = 10
        this.$store.dispatch('webchatSearch', this.chatForm).then((res) => {
        })
      },
      getNormalCallsheetData () {
        this.callForm.cdrId = 'quality_check_query'
        if (this.callForm.beginTime && this.callForm.beginTime[0] !== null) {
          this.callForm.BEGIN_TIME = getDateTime(this.callForm.beginTime[0])
        }
        if (this.callForm.beginTime && this.callForm.beginTime[1] !== null) {
          this.callForm.END_TIME = getDateTime(this.callForm.beginTime[1])
        }
        this.callForm.pageSize = 10
        let data = deepClone(this.callForm)
        this.$store.dispatch('normalCallSearch', data).then((res) => {
        })
      },
      query () {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.callForm.page = 1
          this.pagination.currentPage = 1
          this.$refs.chatForm.validate((valid) => {
            if (valid) {
              this.getQualityCheckWebchatSession()
              this.isSave = false
            }
          })
        } else {
          this.callForm.page = 1
          this.paginationCall.currentPage = 1
          this.$refs.callForm.validate((valid) => {
            if (valid) {
              if (this.callForm.CALL_TIME_LENGTH_BEGIN && this.callForm.CALL_TIME_LENGTH_END && this.callForm.CALL_TIME_LENGTH_BEGIN >= this.callForm.CALL_TIME_LENGTH_END) {
                this.$message.error(this.$t('qualityCheck.PleaseEnterTheCorrectCallDurationRrange'))
                return
              }
              this.getNormalCallsheetData()
              this.isSave = false
            } else {
            }
          })
        }
      },
      turnPage (pageNum) {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.chatForm.page = pageNum
          this.pagination.currentPage = pageNum
          this.getQualityCheckWebchatSession()
        } else {
          this.callForm.page = pageNum
          this.paginationCall.currentPage = pageNum
          this.getNormalCallsheetData()
        }
      },
      turnPageRecord (pageNum) {
        this.paginationRecord.currentPage = pageNum
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.queryRecordWebchatSessionLog(this.currentId, pageNum)
        } else {
          this.queryRecordCallListenLog(this.currentId, pageNum)
        }
      }
    },
    beforeMount () {
      this.fetchData()
    },
    computed: {
      count () {
        return this.$store.state.qualityCheck.searchList.count
      },
      totalPage () {
        return Math.ceil(this.$store.state.qualityCheck.searchList.count / 10) || 0
      },
      tableData () {
        return this.$store.state.qualityCheck.searchList.list
      },
      singleLabelChange () {
        return this.$store.state.qualityCheck.singleLabelChange
      },
      tempList () {
        return this.$store.state.qualityCheck.tempList
      }
    },
    watch: {
      singleLabelChange () {
        this.isSave = true
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .search-pagination
    float right
  .normal
    height calc(100vh - 158px)
    padding 20px 20px 0
    overflow scroll
    .ui-affix
      padding-bottom 0
      margin-top 20px
    .tables
      padding-bottom 30px
    .el-dialog
      .scoring
        text-align center
        color #fff
        margin-top 40px
        span
          display inline-block
          padding 10px 26px
          border-radius 4px
          cursor pointer
        .off
          background #7bcdd2
        .save
          background #1abb9c
          margin-left 40px
      .el-row
        margin-top 12px
        color #8f8f8f
        .el-col-7
        .el-col-11
          line-height 36px
        .el-col-13
          .totalScore
            color #7bcdd2
    .chatMsgCon
      border-bottom 1px solid #eeeff3
    .chat_msg
      padding 14px
      box-sizing border-box
      overflow auto
      height calc( 100vh - 342px + 92px)
    .chat_item
      position relative
      width 70%
      padding-left 50px
    .chat_user_info
      position absolute
      left 0
      top 6px
      .chat_time
           margin -4px 0 0 -5px
    .chat_user_img
      border-radius 50%
      width 40px
      height 40px
      overflow hidden
      background url("../../../public-modules/contact-summary/img/agent.png") no-repeat 50% 50%
      background-size 40px auto
      img
        background #fff
    .chat_time
      color #9A9A9A
      width 60px
      line-height 16px
      text-align center
    .chat_content
      max-width 90%
      padding 10px
      position relative
      margin-left 14px
      border-radius 6px
      background #7ACDD1
      display inline-block
      color #fff
      .chat_img
        max-width 100px
      .send_status
        position absolute
        width 26px
        height 26px
        border-radius 50%
        left -30px
        top 50%
        margin-top -13px
      .send_status.process
        background url('../../webchat/img/webchat_send.gif') no-repeat
        background-size 26px 26px
      .send_status.failure
        color red
        text-align center
        line-height 24px
        font-size 24px
      .chat_content_text
        word-break break-all
    .chat_content_arrow
      position absolute
      left -6px
      width 0
      height 0
      border-top 6px solid transparent
      border-bottom 6px solid transparent
      border-right 6px solid #7ACDD1
    .chat_user_info_out
      position absolute
      right 0
      top -2px
      .chat_time
        position absolute
        right -5px
        top 46px
    .chat_item.out
      padding 0 50px 0 0
      float right
      .chat_user_img
        border-radius 50%
        width 40px
        height 40px
        float right
      .chat_content
        float right
        background #F2F2F2
        margin 0 14px 0 0
        color #000
    .chat_content_arrow_out
      position absolute
      right -6px
      width 0
      height 0
      border-top 6px solid transparent
      border-bottom 6px solid transparent
      border-left 6px solid #F2F2F2
    .chat_item.system
      text-align center
      padding 0
      width 100%
      .chat_content
        display inline-block
        width auto
        height 26px
        border-radius: 13px
        text-align center
        display inline-block
        padding 0
        line-height 26px
        background #f2f2f2
        color #000
    .chat_msg_con
      textarea
        resize none
    .el-form-item
      margin 0
    .replyMsg
      float right
    .msg_do
      margin 0 10px 0
      float left
      color #bbb
    .fontSize
      min-width 20px
    .fontSize
      li
        line-height 28px
    .upload
      display inline-block
      width 22px
    .blacklist_con
      resize none
    .other_msg
      padding-top 5px
      .iconfont
        font-size 18px
        cursor pointer
      .iconfont:hover
        color $c-main
      .icon-zhishikujiansuo
        font-size 20px
    .upload
      width 20px
    .chat_info
      padding-top 2px
      .chat_info_todo
      .chat_info_all
        padding 0 14px
        box-sizing border-box
    .chat_info_li_title , .chat_auxiliary_title,.chat_info_all i
      color #b8b8b8
      font-style normal
    .chat_info_li_con , .chat_auxiliary_from
      color #999
      float right
    .chat_info_li_remarks
      resize none
      font-size 12px
      box-sizing border-box
      width 100%
      margin-top 6px
      border-radius 4px
      padding 6px 10px
    .el-tree
      border none
    .quickreplay_custome_title
      span
        float right
        font-size 12px
        line-height 20px
        cursor pointer
    .quickreplay_li
      .edit_del
        position absolute
        right 4px
        top 0
    .quickRe
      display none
      color #71ccba
      float right
      margin-right 4px
      cursor pointer
    .quickReLi
      width 100%
      position relative
      box-sizing border-box
      padding 2px 0 2px 20px
      color #808080
    .quickReLi:before
      content '\ '
      background #7dccd1
      width 4px
      height 4px
      position absolute
      left 10px
      top 6px
    .quickReBox
      position absolute
      right 0
      top 0
    .quickReLi:hover
      padding-right 40px
      .quickRe
        display inline-block
    .quickreplay_custom_con
      li
        margin-bottom 4px
        position relative
    .quickreplay_custom_con
      li
        i
          line-height 16px
    .quickreplay_box
      .el-tree
        .is-leaf
          display none
    .color
      color #1f2d3d
    .quickreplay_box
      color #a7a7a7
    .popover1
      .quickReLi:before
        display none
    .popover1
      .quickReLi
        padding-left 18px
    .transfer_li
      color #989898
      height 16px
      padding 3px 0
      cursor pointer
    .transfer_li:hover
      background #e8f5fc
      .transfer_btn
        display inline-block
    .transfer_btn
      display none
      color $c-main
      cursor pointer
      float right
      margin-right 6px
    .transfer_li_ul .transfer_li
      padding-left 18px
    .msg_li
      min-height 62px
      margin-bottom 20px
    .msg_li.system_li
      height 24px
      margin 10px 0
    .transfer_li_box
      position relative
    .transfer_group_btn
      position absolute
      top 4px
      right 0
    .box1:hover
      .transfer_group_btn
        display inline-block
    .box1:hover
      .transfer_li
        background #e8f5fc
    .send_msg_form
      position relative
      textarea
        width 100%
        border none
        box-sizing border-box
        resize none
    .font12
      font-size 12px
    .font14
      font-size 14px
    .font16
      font-size 16px
    .font18
      font-size 18px
    .font20
      font-size 20px
    .suggest
      width 308px
      background #fff
      bors(1px,#eee)
    .client_msg
      height 36px
    .chat_info_all
      padding-top 18px
    .transfer_li_ul
      .transfer_li
        .cata-name
          display inline-block
          width 100%
    .cursor_li
      cursor pointer
    .webchat_todo_conbox
      .basic_info
        padding-top 14px
        max-height calc( 100vh - 330px)
        box-sizing border-box
        overflow auto
        h3
          margin-bottom 10px
    .wxend
      text-align center
      padding 5px
      display block
      z-index 10000
      color #999
    .historyDivied
      color grey
      text-align center
    .popover1 .tree,.popover2 .tree
      overflow-y auto
      max-height 200px
      font-size 12px
    .quickreplay_box
      .quickBoxTit
        padding 0 0 8px
      .quickreplay_custome_title
        padding 14px 0 8px
      .tree
        padding-left 10px
        .cursor_li
          padding 2px 0
        .quickReLi:before
          top 8px
    .chat_info,.chat_info_all
      h3
        color #666
      .chat_info_li
        margin-bottom 4px
        padding-right 4px
        box-sizing border-box
      .chat_info_li:last-child
        margin-bottom 10px
      .chat_info_li.chat_info_li_title
        display inline-block
    .chat_info_all
      height calc( 100vh - 286px)
      h3
        padding-bottom 16px
    .chat_info_ul
      margin-bottom 10px
      span
        float right
    .popover1_inpit
    .popover2_input
      background-color #fff
      border-radius 4px
      border 1px solid #c0ccda
      color #1f2d3d
      display block
      font-size inherit
      height 36px
      line-height 1
      padding 3px 10px
      width 100%
      box-sizing border-box
    .icon-tishi
      color red
    .chat_content.image
      img
        cursor pointer
    .img_action_kmsearch
      display none
    .webchat_todo_conbox
      .chat_item.in
        .chat_text_con
          .chat_content
            position relative
            max-width 360px
            transition padding-right 0.2s ease
            .img_action_kmsearch
              color #E8F5FC
              position absolute
              right 6px
              bottom 10px
              display none
              transition 0.2s ease
              opacity 0
              cursor pointer
          .chat_content:hover
            padding-right 30px
            .img_action_kmsearch
              display block
              animation mymove 0.2s 0.05s forwards
    /*.call-detail table*/
      /*border 1px solid #ddd*/
      /*width 100%*/
      /*tr*/
        /*height 40px*/
        /*border-bottom 1px solid #e0e6ed*/
        /*td*/
          /*padding 10px*/
      /*tr:nth-of-type(even) td*/
        /*background #fafafa*/
      /*tr:nth-of-type(odd):hover td*/
        /*background #e0e6ed*/
    /*.call-detail table tr:nth-last-child(1)*/
      /*border-bottom none*/
    .remarks
      border-radius 3px
      width 100%
      margin-top 9px
      box-sizing border-box
      color #999
      padding 4px 6px
      background #fafafa
      border 1px solid #ddd
    .detail-wrap
      margin 20px 34px 0 34px
      color $cf-level2
    .icon
      cursor pointer
    .deploy
      height 48px
      border 1px solid #e7e7eb
      border-bottom none
      padding-left 14px
      .page
        margin-top 10px
      .el-pagination
        padding 0
    .top
      .el-radio
        margin 0 0 6px 20px
      .temp
        color $cf-gray1
        display inline-block
        margin-bottom 20px
      .sear
        margin-top 20px
        .el-row
          padding-bottom 20px
          span
            color #666
            display inline-block
            margin-left 20px
          .temp
            color $cf-gray1
            margin-left 0
          .takeTime
            margin-left 20px
        .el-input
          width inherit
          margin-left 10px
      .el-select
        margin-left 10px
      .sub
        text-align right
        .rest
        .search
          display inline-block
          width 108px
          height 30px
          background #72c7e3
          color #fff
          text-align center
          line-height 30px
          border-radius 2px
          cursor pointer
        .search
          background #1abb9c
          margin-left 24px
    .title
      color #999
      margin 28px 0 18px 0
      font-weight normal
      position relative
      line-height 16px
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
        top 50%
  .icon-tixingweizhi
    display inline-block
    font-size 12px
    color #1abb9c
    line-height 14px
    height 14px
    width 14px
    text-align center
    border-radius 50%
    border 1px solid #1abb9c
  .padding
   padding-bottom 5px
  .check-padding
    padding-bottom 5px
  .condition-form
    width 100px
    height 36px
  .normal .top .sear .label-select-wrap .select-wrap
    margin-left 10px
</style>
