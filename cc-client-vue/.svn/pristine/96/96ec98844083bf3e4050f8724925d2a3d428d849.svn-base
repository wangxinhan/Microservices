<template>
  <div class="quality_result" v-if="!loading">
    <div class="top">
      <affix :label="$t('qualityCheck.qualityResult2')"></affix>
      <!--<div class="tem">-->
        <!--<span class="temp">{{$t('qualityCheck.taskName')}}：</span>-->
         <!--<el-select size="small" v-model.trim="form.TASK_ID" filterable :placeholder="$t('qualityCheck.taskNameSearch')">-->
          <!--<el-option-->
            <!--v-for="item in taskList"-->
            <!--:label="item.TASK_NAME"-->
            <!--:value="item._id">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</div>-->
      <div class="templa">
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
        <div v-if="template.QUALITY_TYPE!=='qualityWebchat'">
          <el-form :inline="true" :model="callForm" :rules="rules" ref="callForm"  class="demo-form-inline">
            <div class="pad">
              <span class="temp">{{$t('public.callTime')}}：</span>
              <el-date-picker size="small"
                v-model="callForm.callTime"
                :editable="boolean"
                type="datetimerange"
                :picker-options="pickerOptions2"
                :placeholder="$t('public.timeRanges')"
                align="right"
                @change="callTimeChange">
              </el-date-picker>
              <el-radio-group v-model.trim="ruleForm.radio2" v-for="item in items1">
                <el-radio size="small"
                  :label="item.lable">
                  {{item.text}}
                </el-radio>
              </el-radio-group>
              <span class="templ">{{$t('qualityCheck.callingNumber')}}：</span>
              <el-form-item label="" prop="CALL_NO" style="margin-top: -3px;">
                <el-input size="small" v-model.trim="callForm.CALL_NO" :placeholder="$t('qualityCheck.pleaseEnterCallingNum')"></el-input>
              </el-form-item>
              <span class="templ">{{$t('public.satisfaction')}}：</span>
              <el-select size="small" v-model.trim="callForm.INVESTIGATE" filterable :placeholder="$t('public.satisfaction')">
                <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
                <el-option
                  v-for="item in satisfactionList"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="pad">
              <span class="temp">{{$t('qualityCheck.checkTime')}}：</span>
              <el-date-picker size="small"
                v-model.trim="callForm.GRADE_TIME"
                type="datetimerange"
                :picker-options="pickerOptions2"
                :placeholder="$t('public.timeRanges')"
                :editable="boolean"
                align="right"
                @change="'gradeTimeChange'">
              </el-date-picker>
              <span class="templ">{{$t('qualityCheck.calledNumber')}}：</span>
              <el-form-item label="" prop="CALLED_NO" style="margin-top: -3px;">
                <el-input size="small" placeholder="请输入被叫号码" v-model.trim="callForm.CALLED_NO"></el-input>
              </el-form-item>
              <span class="templ">{{$t('call.callType')}}：</span>
              <el-select size="small" v-model="callForm.CONNECT_TYPE" multiple filterable :placeholder="$t('webchat.webchatAll')">
                <el-option
                  v-for="item in callTypeList"
                  :label="item.code_name"
                  :value="item.code_value">
                </el-option>
              </el-select>
            </div>
            <div>
              <div class="pad">
                <span class="temp">{{$t('call.callTime')}}：</span>
                <el-form-item label="" prop="CALL_TIME_LENGTH_BEGIN" style="margin-top: -3px;height:36px;width:150px">
                  <el-input size="small" placeholder="" v-model.trim="callForm.CALL_TIME_LENGTH_BEGIN">
                    <template slot="append">{{$t('public.seconds')}}</template>
                  </el-input>
                </el-form-item>
                <span class="to">{{$t('public.to')}}</span>
                <el-form-item label="" prop="CALL_TIME_LENGTH_END" style="margin-top: -3px;height:36px;width:150px">
                  <el-input size="small" placeholder="" v-model.trim="callForm.CALL_TIME_LENGTH_END">
                    <template slot="append">{{$t('public.seconds')}}</template>
                  </el-input>
                </el-form-item>
              </div>
              <el-row>
                <div  v-if="template.type === 'pass'" class="pad">
                  <span class="temp">{{$t('qualityCheck.viewTheWay')}}：</span>
                  <el-select size="small" v-model.trim="callForm.amount" placeholder="全部">
                    <el-option value="" :label="'--'+$t('webchat.webchatAll')+'--'"></el-option>
                    <el-option :label="$t('qualityCheck.passed')" value='yes'></el-option>
                    <el-option :label="$t('qualityCheck.noPassed')" value='no'></el-option>
                    <el-option :label="$t('qualityCheck.notInvolving')" value='dont'></el-option>
                  </el-select>
                  <span class="templ">{{$t('qualityCheck.showNumThelaters')}}：</span>
                  <el-select size="small" v-model.trim="floors" :placeholder="$t('webchat.webchatAll')">
                    <el-option :label="i" :value="i" v-for="i in floorsOption"></el-option>
                  </el-select>
                </div>
                <div v-else class="tem">
                  <span class="temp">{{$t('qualityCheck.singleScore')}}：</span>
                  <el-select size="small" v-model.trim="callForm.GRADE_CONFIG" :placeholder="$t('webchat.webchatAll')" @change="configChange">
                    <el-option value="" :label="'--'+$t('public.pleasePick')+'--'"></el-option>
                    <el-option
                      v-for="item in configList"
                      :label="item.name"
                      :value="item.order">
                    </el-option>
                  </el-select>
                  <el-form-item style="margin-top: -3px;width:120px;" prop="GRADE_MIN" >
                    <el-input size="small" :placeholder="GRADE_P" v-model.trim="callForm.GRADE_MIN">
                      <template slot="append">{{$t('public.minutes')}}</template>
                    </el-input>
                  </el-form-item>
                  <span class="to">{{$t('public.to')}}</span>
                  <el-form-item style="margin-top: -3px;width:120px;" prop="GRADE_MAX">
                    <el-input size="small" :placeholder="GRADE_P" v-model.trim="callForm.GRADE_MAX">
                      <template slot="append">{{$t('public.minutes')}}</template>
                    </el-input>
                  </el-form-item>
                </div>
              </el-row>
            </div>
            <div class="pad">
              <span class="temp">{{$t('public.queues')}}：</span>
              <el-select size="small" v-model="callForm.ERROR_MEMO" multiple filterable :placeholder="$t('qualityCheck.skillGroupSearch')">
                <el-option
                  v-for="item in callQueueList"
                  :label="item.DisplayName"
                  :value="item.Exten">
                </el-option>
              </el-select>
            </div>
            <div class="tem">
              <span class="temp">{{$t('call.callRingSeat')}}：</span>
              <el-select size="small" v-model="callForm.DISPOSAL_AGENT" multiple filterable :placeholder="$t('public.pickAgentTip1')">
                <el-option
                  v-for="item in callAgentList"
                  :label="item.displayName + '[' + item.exten + ']'"
                  :value="item._id">
                </el-option>
              </el-select>
              <el-checkbox v-model="callForm.includeSubordinate">{{$t('public.includeUnderAgent')}}</el-checkbox>
            </div>
            <div class="tem" v-if="template.type !== 'pass'">
              <span class="temp">{{$t('qualityCheck.qualityRating')}}：</span>
              <el-select size="small" v-model.trim="callForm.LEVEL" filterable :placeholder="$t('webchat.webchatAll')">
                <el-option value="" :label="'--'+$t('public.pleasePick')+'--'"></el-option>
                <el-option :label="$t('qualityCheck.excellent')" value='A'></el-option>
                <el-option :label="$t('qualityCheck.qualified')" value='B'></el-option>
                <el-option :label="$t('qualityCheck.remind')" value='C'></el-option>
                <el-option :label="$t('qualityCheck.unqualified')" value='D'></el-option>
              </el-select>
            </div>
            <div class="tem">
              <span class="temp">{{$t('qualityCheck.qualityControlPersonnel')}}：</span>
              <el-select size="small" v-model="callForm.GRADE_USER" multiple filterable :placeholder="$t('public.pickAgentTip1')">
                <el-option
                  v-for="item in callAgentList"
                  :label="item.displayName + '[' + item.exten + ']'"
                  :value="item._id">
                </el-option>
              </el-select>
            </div>
            <div class="tem">
              <span class="temp" style="width: 100px; ">{{$t('qualityCheck.callLabelSort')}}：</span>
              <label-select @labelSelect="labelSelect" :resetSelect="resetSelect"></label-select>
            </div>
            <div class="tem">
              <span class="temp">{{$t('call.SQLabel')}}：</span>
              <el-select size="small" v-model.trim="callForm.SQ_LABEL" filterable :placeholder="'--'+$t('webchat.webchatAll')+'--'+':'">
                <el-option :label="'--'+$t('webchat.webchatAll')+'--'" value=""></el-option>
                <el-option
                        v-for="item in getSQLabel"
                        :label="item.name"
                        :value="item._id"
                        >
                </el-option>
              </el-select>
            </div>
          </el-form>
          <div class="sub">
            <span class="rest" @click="rest">{{$t('public.reset')}}</span>
            <span class="search" @click="query">{{$t('public.search2')}}</span>
          </div>
          <affix :label="$t('public.searchResult')"></affix>
          <div class="sub export">
            <span class="search" @click="ran">{{$t('qualityCheck.paiming')}}</span>
            <span class="search" @click="expor">{{$t('report.exportXls')}}</span>
          </div>
        </div>
      </div>
      <div v-if="template.QUALITY_TYPE==='qualityWebchat'">
        <el-form :inline="true" :model="form" :rules="rules" ref="form"  class="demo-form-inline">
          <div class="tem">
            <span class="temp">{{$t('webchat.takeTime')}}：</span>
            <el-date-picker size="small"
              v-model="form.claimTime"
              :editable="boolean"
              type="datetimerange"
              :picker-options="pickerOptions2"
              :placeholder="$t('public.timeRanges')"
              align="right"
              @change="claimTimeChange">
            </el-date-picker>
            <span class="templ">{{$t('public.satisfaction')}}：</span>
            <el-select size="small" v-model.trim="form.appraiseKey" filterable :placeholder="$t('webchat.webchatAll')">
              <el-option value="" :label="'--'+$t('webchat.webchatAll')+'--'"></el-option>
              <el-option
                v-for="item in appraiseList"
                :label="item.name"
                :value="item.key"
                >
              </el-option>
            </el-select>
            <span class="fanishType">{{$t('qualityCheck.endTheSessionType')}}：</span>
            <el-select size="small" v-model.trim="form.finishKey" filterable :placeholder="$t('webchat.webchatAll')">
              <el-option value="" :label="'--'+$t('webchat.webchatAll')+'--'"></el-option>
              <el-option
                v-for="item in finishReasonList"
                :label="item.name"
                :value="item.key"
                >
              </el-option>
            </el-select>
          </div>
          <div class="tem">
            <span class="temp">{{$t('qualityCheck.checkTime')}}：</span>
            <el-date-picker size="small"
              v-model.trim="form.checkTime"
              :editable="boolean"
              type="datetimerange"
              :picker-options="pickerOptions2"
              :placeholder="$t('public.timeRanges')"
              align="right"
              @change="checkTimeChange">
            </el-date-picker>
            <span class="templ">{{$t('qualityCheck.qualityRating')}}：</span>
            <el-select size="small" v-model.trim="form.LEVEL" filterable placeholder="">
              <el-option value="" :label="'--'+$t('webchat.webchatAll')+'--'"></el-option>
              <el-option :label="$t('qualityCheck.excellent')" value='A'></el-option>
              <el-option :label="$t('qualityCheck.qualified')" value='B'></el-option>
              <el-option :label="$t('qualityCheck.remind')" value='C'></el-option>
              <el-option :label="$t('qualityCheck.unqualified')" value='D'></el-option>
            </el-select>
          </div>
          <div class="tem">
            <span class="temp">{{$t('webchat.msgNum')}}：</span>
            <el-radio-group v-model.trim="form.msgCountType">
              <el-radio size="small" label="gt" >{{$t('webchat.moreThan')}}</el-radio>
              <el-radio size="small" label="lt" >{{$t('webchat.lessThan')}}</el-radio>
              <el-radio size="small" label="eq" >{{$t('webchat.equal')}}</el-radio>
            </el-radio-group>
            <el-form-item style="margin-top: -3px;" prop="msgCount">
              <el-input size="small" v-model.trim="form.msgCount" :placeholder="$t('public.pleaseEnter')"></el-input>
            </el-form-item>
          </div>
          <div class="tem">
            <span class="temp">{{$t('qualityCheck.singleScore')}}：</span>
            <el-select size="small" v-model="form.GRADE_CONFIG" @change="configChange">
              <el-option value="" :label="'--'+$t('public.pleasePick')+'--'"></el-option>
              <el-option
                v-for="item in configList"
                :label="item.name"
                :value="item.order">
              </el-option>
            </el-select>
            <el-form-item style="margin-top: -3px;height:36px;margin-bottom: 0" prop="GRADE_MIN">
              <el-input size="small" :placeholder="GRADE_P" v-model="form.GRADE_MIN" style="width:120px">
                <template slot="append">{{$t('public.minutes')}}</template>
              </el-input>
            </el-form-item>
            <span class="to">{{$t('public.to')}}</span>
            <el-form-item style="margin-top: -3px;height:36px" prop="GRADE_MAX">
              <el-input size="small" :placeholder="GRADE_P" v-model="form.GRADE_MAX" style="width:120px">
                <template slot="append">{{$t('public.minutes')}}</template>
              </el-input>
            </el-form-item>
          </div>
          <div class="tem">
            <span class="temp">{{$t('public.queues')}}：</span>
            <el-select size="small" v-model.trim="form.toPeer" multiple filterable :placeholder="$t('qualityCheck.skillGroupSearch')">
              <el-option
                v-for="item in queueList"
                :label="item.DisplayName"
                :value="item.Exten">
              </el-option>
            </el-select>
          </div>
          <div class="tem">
            <span class="temp">{{$t('public.agent')}}：</span>
            <el-select size="small" v-model.trim="form.user" multiple filterable :placeholder="$t('public.pickAgentTip1')">
              <el-option
                v-for="item in agentList"
                :label="item.displayName"
                :value="item._id"
                >
                <span >{{ item.displayName }}</span>
                <span >[<span>{{ item.exten }}</span>]</span>
              </el-option>
            </el-select>
          </div>
          <div class="tem">
            <span class="temp">{{$t('qualityCheck.qualityControlPersonnel')}}：</span>
            <el-select size="small" v-model.trim="form.grade_user" multiple filterable :placeholder="$t('public.pickAgentTip1')">
              <el-option
                v-for="item in agentList"
                :label="item.displayName"
                :value="item._id"
                >
                <span >{{ item.displayName }}</span>
                <span >[<span>{{ item.exten }}</span>]</span>
              </el-option>
            </el-select>
          </div>
        </el-form>
        <div class="sub">
          <span class="rest" @click="rest">{{$t('public.reset')}}</span>
          <span class="search" @click="query">{{$t('public.search2')}}</span>
        </div>
        <h3 class="title"><span class="sign"></span><span class="text">{{$t('public.searchResult')}}</span></h3>
        <div class="sub export">
          <span class="search" @click="ran">{{$t('qualityCheck.paiming')}}</span>
          <span class="search" @click="expor">{{$t('report.exportXls')}}</span>
        </div>
      </div>
      </div>
    <div>
      <el-dialog :title="$t('qualityCheck.webchatQualityInfo')" v-model.trim="webchatDialogShow" size="tiny" class="score" @close="off">
        <webchat-grade :currentGrade = "this.currentGrade" :currentItem = "this.currentItem" :template = "this.template" @off="off" @handle="handle" @saveGrade="saveGrade"></webchat-grade>
      </el-dialog>
      <big-image :imgInfo="bigImage" @closeImageDialog="closeBigImage"></big-image>
    </div>
    <div class="tables">
      <div class="deploy">
             <div class="search-pagination" v-if="template.QUALITY_TYPE ==='qualityWebchat'">
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
      <el-table :data="tableData" style="width: 100%" v-if="template.QUALITY_TYPE==='qualityWebchat'">
          <el-table-column prop="sName" :label="$t('public.customerName')" width="">
          </el-table-column>
          <el-table-column prop="userName" :label="$t('public.handleAgent')" width="">
          </el-table-column>
          <el-table-column prop="beginTime" :label="$t('webchat.claimTime')" width="">
          </el-table-column>
          <el-table-column prop="queueName" :label="$t('public.queues')" width="">
          </el-table-column>
          <el-table-column prop="totalMsgCount" :label="$t('webchat.msgNum')" width="">
          </el-table-column>
          <el-table-column prop="qtime" :label="$t('qualityCheck.qualityTime')" width="">
          </el-table-column>
          <el-table-column prop="gradeUserName" :label="$t('qualityCheck.qualityUser')" width="">
          </el-table-column>
          <el-table-column label="评级" width="">
            <template scope="scope">
              <span v-if="scope.row.GRADE_AMOUNT > 94.5">{{$t('qualityCheck.excellent')}}</span>
              <span v-if="scope.row.GRADE_AMOUNT > 79.5 && scope.row.GRADE_AMOUNT < 94.4">{{$t('qualityCheck.qualified')}}</span>
              <span v-if="scope.row.GRADE_AMOUNT > 59.5 && scope.row.GRADE_AMOUNT < 79.4">{{$t('qualityCheck.remind')}}</span>
              <span v-if="scope.row.GRADE_AMOUNT < 59.4">{{$t('qualityCheck.unqualified')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="GRADE_AMOUNT" :label="$t('qualityCheck.qualityGrade')" width="">
          </el-table-column>
          <el-table-column
            v-for="item in configList"
            :prop="item.order"
            :label="item.name + '__'+ item.fatal"
            :render-header="renderContent"
            width=""
            >
          </el-table-column>
          <el-table-column  :label="$t('public.operate')" width="100">
            <template scope="scope">
              <el-button type="text" @click="look(scope.row.grade_comments)" size="small" >{{$t('qualityCheck.viewLog')}}</el-button>
              <el-button type="text" @click="looklog(scope.row._id)" size="small" >{{$t('qualityCheck.viewLook')}}</el-button>
              <el-button type="text" @click="againGrade(scope.row)" size="small" v-if="scope.row.grade_user === $store.state.session.user._id">{{$t('qualityCheck.againGrade')}}</el-button>
            </template>
          </el-table-column>
      </el-table>
      <!-- 通话质检pass表格组件 -->
      <pass-table :configList="this.configList" :tableData="tableData" :template="template" :floors="floors"
                  @handle="handle" @down="down" @look="look" @looklog="looklog" v-else-if="template.type==='pass'">
      </pass-table>
      <!-- 通话质检score表格组件 -->
      <score-table :configList="this.configList" :tableData="tableData" :template="template"  @down="down" @look="look" @handle="handle" @looklog="looklog" v-else></score-table>
    </div>
    <el-dialog modal-append-to-body lock-scroll top="10%" v-model.trim="isLis" :title="$t('qualityCheck.ListenToTheRecording')" @close="offAudio">
      <audio controls="controls" autoplay preload="auto" v-bind:src="this.audioListen" class="audio-dialog" id="qualityed-audio"></audio>
    </el-dialog>
    <el-dialog modal-append-to-body lock-scroll top="10%" v-model.trim="isLook" :title="$t('qualityCheck.viewLog')">
      <span class="conte">{{$t('km.content')}}</span>
      <p class="cont">
        {{content}}
      </p>
    </el-dialog>
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
        <el-dialog modal-append-to-body lock-scroll top="10%" v-model.trim="isRan" :title="$t('qualityCheck.paiming')">
          <div class="find">
            <span class="temp">{{$t('public.disposeAgent')}}：</span>
              <el-select size="small" v-model.trim="rank.RANKING_AGENT" multiple filterable :placeholder="$t('public.pleasePick')">
                <el-option
                  v-for="item in agentList"
                  :label="item.displayName"
                  :value="item._id"
                >
                <span >{{ item.displayName }}</span>
                <span >[<span>{{ item.exten }}</span>]</span>
                </el-option>
              </el-select>
            <el-checkbox v-model.trim="rank.includeSubordinate">{{$t('public.includeUnderAgent')}}</el-checkbox>
            <span class="search fr" @click="findRank">{{$t('public.search2')}}</span>
          </div>
          <el-table :data="rankingList" style="width: 100%">
            <el-table-column
              v-for="item in rankingHeadList"
              :prop="item.order"
              :label="item.name"
              width=""
              >
            </el-table-column>
          </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import Pagination from '../../public-modules/card/Pagination'
  import {deepClone, getDateTime, getFormatDateTime} from '../../../utils/m7Utils.js'
  import {getQualityCheckConfigs} from '../../../utils/webchat.js'
  import {checkform} from '../../../utils/validate.js'
  import WebchatGrade from './Check/WebchatGrade'
  import BigImage from '../../public-modules/bigImage/BigImage'
  import PassTable from './Check/PassTable'
  import ScoreTable from './Check/ScoreTable'
  import LabelSelect from '../../public-modules/phone-bar/LabelSelect.vue'
  import Affix from '../../ui-modules/affix/Affix.vue'
  export default {
    name: 'quality_result',
    data () {
      let self = this
      let validate1 = (rule, value, callback) => {
        if (value !== '') {
          let match = checkform(value, 'Number3')
          if (match) {
            callback(new Error(this.$t('qualityCheck.pleaseEnterNum')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      let validateLimit = (rule, value, callback) => {
        if (value !== '') {
          if (parseInt(value) > self.GRADE_P.split('-')[1]) {
            callback(new Error(this.$t('qualityCheck.PleaseEnterTheCorrectScoreRange')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      let validate2 = (rule, value, callback) => {
        let item = null
        if (self.template.QUALITY_TYPE === 'qualityWebchat') {
          item = self.form
        } else {
          item = self.callForm
        }
        if (item.GRADE_MAX !== '' && item.GRADE_MIN !== '') {
          if (parseInt(item.GRADE_MAX) < item.GRADE_MIN) {
            callback(new Error(this.$t('qualityCheck.PleaseEnterTheCorrectScoreRange')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      let validateCallLength = (rule, value, callback) => {
        let item = self.callForm
        if (item.CALL_TIME_LENGTH_BEGIN !== '' && item.CALL_TIME_LENGTH_END !== '') {
          if (parseInt(item.CALL_TIME_LENGTH_END) < item.CALL_TIME_LENGTH_BEGIN) {
            callback(new Error(this.$t('qualityCheck.PleaseEnterTheCorrectCallDurationRrange')))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        floors: 1,
        floorsOption: [],
        webchatDialogShow: false,
        rank: {
          RANKING_AGENT: [],
          includeSubordinate: false
        },
        value: '',
        boolean: false,
        labelType: 'single',
        labelDataCache: [],
        labelData: {},
        isShow: false,
        isLis: false,
        isLook: false,
        isRan: false,
        content: '',
        audioListen: '',
        rules: {
          GRADE_MIN: [
            {validator: validate1, trigger: 'blur'},
            {validator: validateLimit, trigger: 'blur'},
            {validator: validate2, trigger: 'blur'}
          ],
          GRADE_MAX: [
            {validator: validate1, trigger: 'blur'},
            {validator: validateLimit, trigger: 'blur'},
            {validator: validate2, trigger: 'blur'}
          ],
          msgCount: [
            {validator: validate1, trigger: 'blur'}
          ],
          CALL_NO: [
            {validator: validate1, trigger: 'blur'}
          ],
          CALLED_NO: [
            {validator: validate1, trigger: 'blur'}
          ],
          CALL_TIME_LENGTH_BEGIN: [
            {validator: validate1, trigger: 'blur'},
            {validator: validateCallLength, trigger: 'blur'}
          ],
          CALL_TIME_LENGTH_END: [
            {validator: validate1, trigger: 'blur'},
            {validator: validateCallLength, trigger: 'blur'}
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
        recordList: [],
        finishReasonList: [],
        agentList: [],
        callTypeList: [],
        callAgentList: [],
        appraiseList: [],
        callQueueList: [],
        queueList: [],
        resetSelect: false,
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
        currentId: '',
        template: {
        },
        getWebchatCache: false,
        getCallCache: false,
        taskList: [],
        form: {
          TASK_ID: '',
          toPeer: [],
          user: [],
          grade_user: [],
          LEVEL: '',
          GRADE_CONFIG: '',
          GRADE_MIN: '',
          GRADE_MAX: '',
          appraiseKey: '',
          claimTime: '',
          finishKey: '',
          msgCount: '',
          msgCountType: '',
          checkTime: ''
        },
        callForm: {
          callTime: '',
          DISPOSAL_AGENT: [],
          CONNECT_TYPE: [],
          CALLED_NO: '',
          CALL_NO: '',
          GRADE_TIME: '',
          INVESTIGATE: '',
          LEVEL: '',
          CALL_TIME_LENGTH_BEGIN: '',
          CALL_TIME_LENGTH_END: '',
          GRADE_CONFIG: '',
          GRADE_MIN: '',
          GRADE_MAX: '',
          GRADE_AMOUNT: '',
          GRADE_USER: [],
          ERROR_MEMO: [],
          includeSubordinate: false,
          amount: '',
          multiFirst: '',
          multiTwo: '',
          multiThree: '',
          SQ_LABEL: ''
        },
        GRADE_P: '0-100',
        paginationRecord: {
          small: false,
          currentPage: 1
        },
        currentItem: {},
        bigImage: {
          bigImageShow: false,
          url: ''
        },
        title: '',
        loading: true
      }
    },
    components: {
      Pagination,
      PassTable,
      ScoreTable,
      WebchatGrade,
      BigImage,
      LabelSelect,
      Affix
    },
    methods: {
      off () {
        this.webchatDialogShow = false
        this.$store.commit('webchat/QUALITY_QUERY_WEBCHAT_HISTORY_CLEAR')
        this.callDialogShow = false
      },
      labelSelect (data) { // 子组件外抛出来的表单
        this.resetSelect = false
        this.callForm.multiFirst = data.multiFirst
        this.callForm.multiTwo = data.multiTwo
        this.callForm.multiThree = data.multiThree
      },
      offAudio () {
        let play = document.getElementById('qualityed-audio')
        if (play) {
          play.pause()
        }
      },
      saveGrade (gradeObj) {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          let data = deepClone(gradeObj)
          data._id = this.currentItem._id
          data.comments = gradeObj.COMMENT
          data.grade_data = gradeObj.obj
          data.grade_data['COMMENTS'] = gradeObj.COMMENTS
          data.grade_data['GRADE_AMOUNT'] = gradeObj.grade
          data.grade_data['type'] = 'grade'
          let self = this
          this.$store.dispatch('saveWebchatSessionGrade', data).then((res) => {
            self.webchatDialogShow = false
            self.query()
          })
        }
      },
      againGrade (data) {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          let item = {}
          for (let i = 0; i < this.$store.state.qualityCheck.queryGradeList.sessionList.length; i++) {
            if (this.$store.state.qualityCheck.queryGradeList.sessionList[i]._id === data._id) {
              item = deepClone(this.$store.state.qualityCheck.queryGradeList.sessionList[i])
              if (!item.beginTime) {
                item.beginTime = ''
              }
              if (!item.totalMsgCount) {
                item.totalMsgCount = 0
              }
              if (item.sourceName && item.sName) {
                item.custName = item.sName
              }
              if (!item.sourceName) {
                item.sourceName = item.sName
              }
              if (item.firstReplyTime) {
                item.firstTime = getFormatDateTime(new Date(item.firstReplyTime))
              }
              item.userName = data.userName
              break
            }
          }
          this.webchatDialogShow = true
          let self = this
          self.currentItem = item
          self.currentGrade = data
        }
      },
      claimTimeChange (value) {
        if (!value) {
          this.form.claimTime = ''
          this.form.beginTimeBegin = ''
          this.form.beginTimeEnd = ''
        }
      },
      checkTimeChange (value) {
        if (!value) {
          this.form.checkTime = ''
          this.form.CHECK_BEGIN_TIME = ''
          this.form.CHECK_END_TIME = ''
        }
      },
      callTimeChange (value) {
        if (!value) {
          this.callForm.callTime = ''
          this.callForm.BEGIN_TIME = ''
          this.callForm.END_TIME = ''
        }
      },
      gradeTimeChange (value) {
        if (!value) {
          this.callForm.GRADE_TIME = ''
          this.callForm.CHECK_BEGIN_TIME = ''
          this.callForm.CHECK_END_TIME = ''
        }
      },
      rest () {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          for (let i in this.form) {
            if (typeof this.form[i] === 'object' && i !== 'claimTime' && i !== 'checkTime') {
              this.form[i] = []
            } else {
              this.form[i] = ''
            }
          }
        } else {
          for (let i in this.callForm) {
            if (typeof this.callForm[i] === 'object' && i !== 'callTime' && i !== 'GRADE_TIME') {
              this.callForm[i] = []
            } else {
              this.callForm[i] = ''
            }
          }
          this.floors = ''
        }
        this.GRADE_P = '0-100'
        this.resetSelect = true
      },
      findRank () {
        this.rank.TEMPLATE = this.template._id
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.$store.dispatch('agentChatRanking', this.rank).then(() => {
//          self.rankingList = []
//          self.rankingList = self.$store.state.qualityCheck.agentRanking.rankingagenthtml
          })
        } else {
          this.$store.dispatch('agenCalltRanking', this.rank).then(() => {
          })
        }
      },
      expor () {
        let data = {}
        let self = this
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          data.Method = 'exportWebchatQualityCheckList'
          if (this.form.claimTime && this.form.claimTime[0] !== null) {
            this.form.beginTimeBegin = getDateTime(this.form.claimTime[0])
          }
          if (this.form.claimTime && this.form.claimTime[1] !== null) {
            this.form.beginTimeEnd = getDateTime(this.form.claimTime[1])
          }
          if (this.form.checkTime && this.form.checkTime[0] !== null) {
            this.form.CHECK_BEGIN_TIME = getDateTime(this.form.checkTime[0])
          }
          if (this.form.checkTime && this.form.checkTime[1] !== null) {
            this.form.CHECK_END_TIME = getDateTime(this.form.checkTime[1])
          }
          let query = deepClone(this.form)
          query.TEMPLATE = this.template._id
          query.dataDB = this.$store.state.session.account.dataDB
          delete query.pageSize
          delete query.page
          delete query.checkTime
          delete query.claimTime
          data.Query = query
          this.$refs.form.validate((valid) => {
            if (valid) {
              self.$store.dispatch('exportQualityCheckResultExcel', data)
            } else {
              self.$message.error(self.$t('message.excelConditionError'))
            }
          })
        } else {
          if (this.template.type === 'pass') {
            this.$message.error(this.$t('qualityCheck.passTemNoexcelFun'))
            return
          }
          data.Method = 'exportQualityCheckList'
          if (this.callForm.callTime && this.callForm.callTime[0] !== null) {
            this.callForm.BEGIN_TIME = getDateTime(this.callForm.callTime[0])
          }
          if (this.callForm.callTime && this.callForm.callTime[1] !== null) {
            this.callForm.END_TIME = getDateTime(this.callForm.callTime[1])
          }
          if (this.callForm.GRADE_TIME && this.callForm.GRADE_TIME[0] !== null) {
            this.callForm.CHECK_BEGIN_TIME = getDateTime(this.callForm.GRADE_TIME[0])
          }
          if (this.callForm.GRADE_TIME && this.callForm.GRADE_TIME[1] !== null) {
            this.callForm.CHECK_END_TIME = getDateTime(this.callForm.GRADE_TIME[1])
          }
          let query = deepClone(this.callForm)
          delete query.page
          delete query.pageSize
          query.dataDB = this.$store.state.session.account.dataDB
          query.floors = this.floors
          query.TEMPLATE = this.template._id
          query.labelType = 'single'
          data.Query = query
          this.$refs.callForm.validate((valid) => {
            if (valid) {
              self.$store.dispatch('exportQualityCheckResultExcel', data)
            } else {
              self.$message.error(self.$t('message.excelConditionError'))
            }
          })
        }
      },
      handle (value) {
        this.$store.dispatch('recordListenLog', {CALL_SHEET_ID: value._id}).then((res) => {
          this.isLis = true
          this.audioListen = value.path
          let play = document.getElementById('qualityed-audio')
          if (play) {
            play.play()
          }
        })
      },
      down () {
        console.log(this.$t('qualityCheck.download'))
      },
      look (value) {
        this.isLook = true
        this.content = value
      },
      looklog (_id) {
        this.paginationRecord.currentPage = 1
        this.countRecord = 0
        this.totalPageRecord = 0
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.queryRecordWebchatSessionLog(_id, 1)
          this.isShow = true
        } else {
          this.isShow = true
          this.queryRecordCallListenLog(_id, 1)
        }
      },
      turnPageRecord (pageNum) {
        this.paginationRecord.currentPage = pageNum
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.queryRecordWebchatSessionLog(this.currentId, pageNum)
        } else {
          this.queryRecordCallListenLog(this.currentId, pageNum)
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
      ran () {
        let self = this
        this.rank = {
          RANKING_AGENT: [],
          includeSubordinate: false
        }
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.$store.dispatch('agentChatRanking', {TEMPLATE: this.template._id}).then(() => {
            self.rankingHeadList = self.$store.state.qualityCheck.agentRanking.rankingagenthead
//          self.rankingList = self.$store.state.qualityCheck.agentRanking.rankingagenthtml
            self.isRan = true
          })
        } else {
          this.$store.dispatch('agenCalltRanking', {TEMPLATE: this.template._id}).then(() => {
            self.rankingHeadList = self.$store.state.qualityCheck.agentRanking.rankingagenthead
            self.isRan = true
          })
        }
      },
      configChange (value) {
        this.form.GRADE_MIN = ''
        this.form.GRADE_MAX = ''
        this.callForm.GRADE_MIN = ''
        this.callForm.GRADE_MAX = ''
        if (value === '') {
          this.GRADE_P = '0-100'
          return
        }
        for (let i = 0; i < this.configList.length; i++) {
          let item = this.configList[i]
          if (item.order === value) {
            this.GRADE_P = '0-' + item.weight
            break
          }
        }
      },
      change (index) {
        this.$store.commit('qualityCheck/CLEAR_LIST')
        this.template = this.items[index]
        this.rest()
        let configs = deepClone(this.template.config)
        this.configList = getQualityCheckConfigs(configs)
        if (this.items[index].QUALITY_TYPE === 'qualityWebchat') {
          if (this.getWebchatCache === false) {
            this.renderWebchatCache()
          }
        } else {
          if (this.getCallCache === false) {
            this.renderCallCache()
          }
          if (this.template.type === 'pass') {
            let arr = []
            let renderForm = function (config) {
              config.forEach(item => {
                arr.push(item.name.split('-').length)
                if (item.child && item.child.length > 0) {
                  renderForm(item.child)
                }
              })
            }
            renderForm(this.template.config)
            this.floorsOption = Math.max.apply(null, arr)
            this.floors = 1
          }
        }
        this.queryQualityCheckList(1)
      },
      fetchData () {
        let self = this
        this.$store.dispatch('getCache', {type: 'qualityCheckTemplates'}).then((res) => {
          self.items = res
          self.template = res[0]
          self.value = 0
          self.change(0)
          let configs = deepClone(self.template.config)
          self.configList = getQualityCheckConfigs(configs)
          self.$store.dispatch('getCache', {type: 'qualityTasks'}).then((res) => {
            res.forEach((item) => {
              if (item.hide === true) {
                self.taskList.push(item)
              }
            })
          })
        })
      },
      query () {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.form.page = 1
          this.pagination.currentPage = 1
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.queryQualityCheckList(1)
            } else {
            }
          })
        } else {
          this.callForm.page = 1
          this.paginationCall.currentPage = 1
          this.$refs.callForm.validate((valid) => {
            if (valid) {
              this.queryQualityCheckList(1)
            } else {
            }
          })
        }
      },
      queryQualityCheckList (page) {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.form.TEMPLATE = this.template._id
          this.form.pageSize = 10
          this.form.page = page
          if (this.form.claimTime && this.form.claimTime[0] !== null) {
            this.form.beginTimeBegin = getDateTime(this.form.claimTime[0])
          }
          if (this.form.claimTime && this.form.claimTime[1] !== null) {
            this.form.beginTimeEnd = getDateTime(this.form.claimTime[1])
          }
          if (this.form.checkTime && this.form.checkTime[0] !== null) {
            this.form.CHECK_BEGIN_TIME = getDateTime(this.form.checkTime[0])
          }
          if (this.form.checkTime && this.form.checkTime[1] !== null) {
            this.form.CHECK_END_TIME = getDateTime(this.form.checkTime[1])
          }
          let data = deepClone(this.form)
          data.maxGrade = this.GRADE_P.split('0-')[1]
          this.$store.dispatch('queryQualityCheckList', data).then((res) => {
          })
        } else {
          this.callForm.TEMPLATE = this.template._id
          this.callForm.pageSize = 10
          this.callForm.page = page
          if (this.callForm.callTime && this.callForm.callTime[0] !== null) {
            this.callForm.BEGIN_TIME = getDateTime(this.callForm.callTime[0])
          }
          if (this.callForm.callTime && this.callForm.callTime[1] !== null) {
            this.callForm.END_TIME = getDateTime(this.callForm.callTime[1])
          }
          if (this.callForm.GRADE_TIME && this.callForm.GRADE_TIME[0] !== null) {
            this.callForm.CHECK_BEGIN_TIME = getDateTime(this.callForm.GRADE_TIME[0])
          }
          if (this.callForm.GRADE_TIME && this.callForm.GRADE_TIME[1] !== null) {
            this.callForm.CHECK_END_TIME = getDateTime(this.callForm.GRADE_TIME[1])
          }
          let data = deepClone(this.callForm)
          delete data.GRADE_TIME
          if (this.template.type === 'pass') {
            delete data.GRADE_CONFIG
            delete data.GRADE_MIN
            delete data.GRADE_MAX
          } else {
            delete data.amount
            if (data.GRADE_AMOUNT) {
              let checkLevel = data.GRADE_AMOUNT
              delete data.GRADE_AMOUNT
              data.GRADE_AMOUNT = JSON.parse(checkLevel)
            }
          }
          this.$store.dispatch('queryQualityCheckList', data).then((res) => {
          })
        }
      },
      turnPage (pageNum) {
        if (this.template.QUALITY_TYPE === 'qualityWebchat') {
          this.form.page = pageNum
          this.pagination.currentPage = pageNum
        } else {
          this.callForm.page = pageNum
          this.paginationCall.currentPage = pageNum
        }
        this.queryQualityCheckList(pageNum)
      },
      renderCallCache () {
        this.getCallCache = true
        let self = this
        this.$store.dispatch('getCache', {type: 'callType'}).then((res) => {
          self.callTypeList = res
        })
        this.$store.dispatch('getCache', {type: 'agents'}).then((res) => {
          res.forEach((item) => {
            item.labelCall = item.displayName + '【' + item.exten + '】'
          })
          self.callAgentList = res
          self.agentList = res
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
      renderContent (h, {column, $index}, item) {
        let arr = column.label.split('__')
        let none = 'none'
        if (arr[1] === 'true') {
          none = 'inline-block'
        }
        return (
          h('div', {
            class: {
              myheader: true
            }
          }, [
            h('span', {
              domProps: {
                innerHTML: arr[0]
              }
            }, [
            ]),
            h('i', {
              style: {
                display: none
              },
              class: {
                iconfont: true,
                icon: true,
                circle: true
              },
              attrs: {
                title: this.$t('qualityCheck.importTip')
              },
              domProps: {
                innerHTML: '&#xe64d;'
              }
            }, [
            ])
          ])
        )
      },
      renderWebchatCache () {
        this.getWebchatCache = true
        let self = this
        this.$store.dispatch('getCache', {type: 'agents'}).then((res) => {
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
        this.$store.dispatch('getCache', {type: 'mailQueues'}).then((res) => {
          self.queueList = res
        })
        let configs = deepClone(this.template.config)
        this.configList = getQualityCheckConfigs(configs)
      }
    },
    beforeMount () {
      this.fetchData()
      this.loading = false
    },
    computed: {
      tableData () {
        return this.$store.state.qualityCheck.queryGradeList.list
      },
      count () {
        return this.$store.state.qualityCheck.queryGradeList.count
      },
      totalPage () {
        return Math.ceil(this.$store.state.qualityCheck.queryGradeList.count / 10) || 0
      },
      rankingList () {
        return this.$store.state.qualityCheck.agentRanking.rankingagenthtml
      },
      getSQLabel () {
        let sqLabels = this.$store.state.session.dicMap.sqLabels
        if (!sqLabels) { // 若取到了便不再发送请求
          return this.$store.dispatch('getCache', {type: 'sqLabels'}).then((req) => {
            return req
          })
        } else {
          return sqLabels
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .quality_result
    .score
      .el-dialog
        width 840px
  .search-pagination
    float right
  .quality_result
    height calc(100vh - 90px)
    padding 0 20px
    overflow scroll
    .el-input
      width inherit
    .tables
      padding-bottom 20px
    .el-dialog
      .find
        margin-bottom 20px
      .conte
        color #c1c1c1
      .el-input
        width inherit
      .el-checkbox
        color #bfbfbf
        margin-left 10px
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
        background #1abb9c
    .el-form
      margin-top 20px
      .el-checkbox
        margin-left 32px
      span
        display inline-block
        text-align right
      .fanishType
        width 128px
      .temp
        width 100px
        color $cf-gray1
      .to
        width 24px
        text-align left
        color #bfbfbf
        margin-top 6px
      .templ
        width 90px
        color $cf-gray1
    .deploy
      height 48px
      border 1px solid #e7e7eb
      border-bottom none
      padding-left 14px
      .page
        margin-top 10px
      .el-pagination
        padding 0
    .cell
      .el-button
        margin-left 0px
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
    .export
      margin 20px 0
    .tem
      padding-bottom 5px
      .el-row
        margin-top 16px
        line-height 36px
        .el-input
          width 100%
        .el-col-2
          width 72px
        .el-col-1
          width 20px
          margin-left 6px
    .templa
      padding-bottom 0px
      .temp
        margin-left 0
        color $cf-gray1
    .el-radio-group
      margin 10px 10px 0 0px
    .el-radio
      margin 0 0 6px 20px
    .ui-affix
      padding-bottom 0
      margin-top 40px
  .audio-dialog
    width 300px
  .pad
    padding-bottom 5px
</style>
