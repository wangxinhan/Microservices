<!--短信模板管理-->
<template>
  <div class="smsTemplate" v-if="isShowSmsTemplate">
    <affix :label="$t('sms.smsTempSearch')"></affix>
    <!--搜索条件 start========================================================-->
    <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
      <div class="temp-search-wrap">
        <span class="demonstration">{{$t('sms.timeScope')}}:</span>
        <el-date-picker size="small"
          class="el-input-time"
          v-model.trim="ruleForm.date"
          type="datetimerange"
          :editable="boolean"
          :picker-options="pickerOptions2"
          :placeholder="$t('sms.choTimeScope')"
          align="right">
        </el-date-picker>
      </div>
      <div class="temp-search-wrap">
        <span class="demonstration">{{$t('sms.tempTitle')}}:</span>
        <el-input size="small" class="el-input-title" v-model.trim="ruleForm.name"></el-input>
      </div>
      <div class="submit">
        <el-button class="btn1" @click.stop="resetForm">{{$t('public.reset')}}</el-button>
        <el-button class="btn2" @click.stop="searchSmsTemplateForFirstPage">{{$t('public.search2')}}</el-button>
      </div>
    </el-form>
    <!--搜索条件 end========================================================-->
    <affix :label="$t('sms.smsTempSearchResult')"></affix>
    <div class="bao-bei">
      <el-button class="bao-bei-btn" @click.stop="smsTempEditShow">{{$t('sms.baobeiSmsTemp')}}</el-button>
    </div>
    <!--报备 短信模板 start========================================================-->
    <el-dialog modal-append-to-body lock-scroll top="10%" class="edit-sms-temp-wrap" :title="$t('sms.editSmsTemp')" v-model.trim="isSmsTempEditShow" size="small" :show-close="false" @close="editTempDialogClose">
      <div class="edit-sms-temp">
          <div class="edit-sms-temp-left">
            <el-form :model="ruleFormBaoBei" ref="ruleFormBaoBei" class="demo-ruleForm">
            <div class="edit-sms-temp-line">
              <span class="title-temp">{{$t('sms.tempTitle')}}</span>
              <input type="text" class="title-inp" v-model.trim="ruleFormBaoBei.title" :placeholder="$t('sms.pleaseInpTitle')">
            </div>
            <div class="edit-sms-temp-line">
              <span class="title-temp line-height-x">{{$t('sms.tempCon')}}</span>
              <textarea class="content-inp" name="content" v-model.trim="ruleFormBaoBei.content" @keyup="editTempChange" :placeholder="$t('public.pleaseEnter')"></textarea>
            </div>
            <div class="edit-sms-temp-line">
              <div class="edit-sms-temp-line-tip">
                <p>{{$t('sms.tempTip1')}}</p>
                <p class="edit-sms-temp-line-special-tip">{{$t('sms.tempTip2')}}</p>
                <p>{{$t('sms.tempTip3')}}</p>
                <p>{{$t('sms.tempTip4')}}</p>
              </div>
            </div>
            <div class="edit-sms-temp-line">
              <span class="title-temp">{{$t('sms.tempSign')}}</span>
              【<input type="text" name="sign" class="sign-inp" v-model.trim="ruleFormBaoBei.sign" @keyup="editTempChange($event)" :placeholder="$t('sms.pleaseInpSign')">】
            </div>
            <div class="edit-sms-temp-line">
              <div style="color: #4c4c4c;" v-if="isShowTextCount" v-html="$t('sms.reciprocalNum', {difference : difference, textCount : textCount})"></div>
              <div style="color: #4c4c4c;" v-if="splitCount > 1" v-html="$t('sms.smsPagingNum', {splitCount : splitCount})"></div>
            </div>
            <div class="edit-sms-temp-line">
              <p class="title-temp">{{$t('sms.tempType')}}</p>
              <div class="radio-wrap">
                <el-radio size="small" class="radio" v-model.trim="ruleFormBaoBei.templateType" label="1">{{$t('sms.smsMessage')}}</el-radio>
                <el-radio size="small" class="radio" v-model.trim="ruleFormBaoBei.templateType" label="2">{{$t('sms.smsYanZheng')}}</el-radio>
                <el-radio size="small" class="radio" v-model.trim="ruleFormBaoBei.templateType" label="3">{{$t('sms.smsSale')}}</el-radio>
              </div>
            </div>
            <div class="edit-sms-temp-line">
              <el-button class="edit-sms-temp-submit" @click.stop="postSmsTemplate">{{$t('sms.smsTempSubmit')}}</el-button>
            </div>
            </el-form>
          </div>
        <div class="edit-sms-temp-right">
          <div class="show_sms_tmpl_box">
            <span v-if="ruleFormBaoBei.sign">【</span>
            <span>{{ruleFormBaoBei.sign}}</span>
            <span v-if="ruleFormBaoBei.sign">】</span>&nbsp;&nbsp;
            <span>{{ruleFormBaoBei.content}}</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="closeSmsTempEdit">{{$t('sms.smsTempClose')}}</el-button>
      </div>
    </el-dialog>
    <!--报备 短信模板 end========================================================-->
    <div class="tables">
      <div class="deploy">
          <Pagination
            class="fr"
            :small="true"
            :currentPage="currentPage"
            :count="count"
            :pageSize="pageSize"
            @turnPage="handleCurrentChange"
            :totalPage="Math.ceil(count/pageSize)"
          >
          </Pagination>
      </div>
      <!-- 搜索结果  表格 start========================================================-->
      <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="num" :label="$t('sms.tempNum')" width="120">
        </el-table-column>
        <el-table-column prop="name" :label="$t('sms.tempTitle')" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="templateTypeCon" :label="$t('sms.tempType')" width="120">
        </el-table-column>
        <el-table-column prop="signCon" :label="$t('sms.tempSign')" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('sms.time')" width="180">
        </el-table-column>
        <el-table-column prop="" :label="$t('sms.smsState')" width="170">
          <template scope="scope">
            <div>
              <span>{{tableData[scope.$index].statusCon}}</span>
              <el-tooltip v-if="tableData[scope.$index].status === 2" class="item" effect="dark" :content="tableData[scope.$index].reason" placement="left-start">
                <el-button type="text" size="small">【{{$t('sms.reason')}}】</el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column  :label="$t('sms.operate')" width="150">
          <template scope="scope">
            <el-badge :is-dot="true" :hidden="!tableData[scope.$index].unreadAdminMessage" class="sms_temp_search item">
              <el-button type="text" @click.stop="showSmsTempDetail(scope.$index, tableData)" size="small">{{$t('sms.searchToLook')}}</el-button>
            </el-badge>
            <el-button type="text" v-if="tableData[scope.$index].status === 1" @click.stop="stopUseSmsTemplateToCheck(scope.$index, tableData)" size="small">{{$t('sms.stop')}}</el-button>
            <el-button type="text" v-if="tableData[scope.$index].status === 4" @click.stop="reUseSmsTemplateToCheck(scope.$index, tableData)" size="small">{{$t('sms.reuse')}}</el-button>
            <el-button type="text" v-if="tableData[scope.$index].status === 2" @click.stop="delSmsTempFromTable(scope.$index, tableData)" size="small">{{$t('sms.del')}}</el-button>
            <el-button type="text" v-if="tableData[scope.$index].status === 2" @click.stop="smsTempEditShowFromTable(scope.$index, tableData)" size="small">{{$t('sms.edit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 搜索结果  表格 end========================================================-->
      <!-- 查看  表格内 详细信息 start========================================================-->
      <el-dialog modal-append-to-body lock-scroll top="10%" class="sms-temp-detail-wrap" :title="$t('sms.smsDetailInfo')" v-model.trim="isShowSmsTempDetail" size="small" :show-close="false" @close="showSmsTempDetailDialogClose">
        <div class="sms-temp-detail-con-wrap">
          <div class="sms-temp-detail-top">
            <el-row>
              <el-col :span="3"><div>{{$t('sms.tempTitle')}}：</div></el-col>
              <el-col :span="4">{{smsTempDetail.name}}</el-col>
              <el-col :span="3" :offset="1"><div>{{$t('sms.tempSign')}}：</div></el-col>
              <el-col :span="5">{{smsTempDetail.signCon}}</el-col>
              <el-col :span="3" :offset="1"><div>{{$t('sms.tempType')}}：</div></el-col>
              <el-col :span="4">{{smsTempDetail.templateTypeCon}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="3"><div>{{$t('sms.smsCont')}}：</div></el-col>
              <el-col :span="21"><div class="sms-detail-con">{{smsTempDetail.content}}</div></el-col>
            </el-row>
          </div>
          <div class="sms-temp-detail-down">
            <div style="margin: 10px 0;" v-if="isShowAddAnswerState">
              <el-input size="small"
                type="textarea"
                :rows="3"
                :placeholder="$t('public.pleaseEnter')"
                v-model.trim="addSmsTemplateToCheckMessagesCon"
                resize="none">
              </el-input>
              <el-button class="add-answer" @click.stop="addSmsTemplateToCheckMessages(smsTempDetail._id)">{{$t('sms.answer')}}</el-button>
              <el-button class="add-answer" @click.stop="cancelSmsTemplateToCheckMessages">{{$t('public.cancel')}}</el-button>
            </div>
            <el-button :disabled="smsTempDetail.status === 1 || smsTempDetail.status === 4" v-if="!isShowAddAnswerState" class="add-answer" @click.stop="isShowAddAnswerState = true">{{$t('sms.addAnswer')}}</el-button>
            <div class="sms_template_replay_box_li" v-for="item in smsTempDetailMessages">
              <div style="margin-bottom: 3px;">{{item.time}}</div>
              <div style="color: #666;"><span v-if="item.from === 'admin'">{{$t('sms.smsYeWuGuWen')}}:</span><span v-if="item.from !== 'admin'">{{$t('sms.me')}}:</span><span>{{item.content}}</span></div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.stop="closeShowSmsTempDetail">{{$t('sms.smsTempClose')}}</el-button>
        </div>
      </el-dialog>
      <!-- 查看  表格内 详细信息 end========================================================-->
    </div>
  </div>
</template>
<script>
  import affix from '../../ui-modules/affix/Affix.vue'
  import Pagination from '../../public-modules/card/Pagination'
  import {getFormatDateTime, getCurrentDateTime} from '../../../utils/m7Utils.js'
  export default {
    name: 'smsTemplate',
    props: {
      refresh: String
    },
    data () {
      return {
        loading: false,
        boolean: false,
//        整个页面的 v-if锁
        isShowSmsTemplate: false,
//        报备短信模板状态
        isSmsTempEditShow: false,
//        查看dialog状态
        isShowSmsTempDetail: false,
//        查看dialog中  添加回复按钮状态
        isShowAddAnswerState: false,
//        编辑短信模板 计数显隐
        isShowTextCount: false,
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
//        搜索条件
        ruleForm: {
          date: '',
          name: ''
        },
//        报备短信模板内容
        ruleFormBaoBei: {
          title: '',
          content: '',
          sign: '',
          templateType: '',
          _id: ''
        },
        textCount: 280,
        difference: 278,
        smsSplitBaseNum: 66,
        splitCount: 1,
        pageSize: 5,
        currentPage: 1,
        smsTemplateToCheckStatus: [],  //   短信模板状态
        smsTemplateType: [],    //   短信模板类型
        smsSign: [],
        smsTempDetail: {},
        smsTempDetailMessages: [],   //   查看详情时  聊天记录
        addSmsTemplateToCheckMessagesCon: '',
        isEditOrAddTemp: ''
      }
    },
    methods: {
//      重置搜索条件
      resetForm () {
        for (let i in this.ruleForm) {
          this.ruleForm[i] = ''
        }
      },
//      查询按钮
      searchSmsTemplateForFirstPage () {
        this.currentPage = 1
        this.searchSmsTemplateToCheck()
      },
//      查询
      searchSmsTemplateToCheck () {
        this.loading = true
        let data = {'pageSize': this.pageSize, 'page': this.currentPage}
        let notifyTime = this.ruleForm.date
        if (notifyTime) {
          if (notifyTime[0]) {
            data.BEGIN_TIME = getFormatDateTime(notifyTime[0])
          }
          if (notifyTime[1]) {
            data.END_TIME = getFormatDateTime(notifyTime[1])
          }
        }
        data.name = this.ruleForm.name
        data.status = {'$ne': 3}
        this.$store.dispatch('getCache', {type: 'smsSign', loadFromServer: true}).then(() => {
          this.smsSign = this.$store.state.session.dicMap.smsSign
          this.$store.dispatch('querySmsTemplateToCheck', data).then(() => {
            this.loading = false
          })
        })
      },
//      分页查询
      handleCurrentChange (val) {
        this.currentPage = val
        this.searchSmsTemplateToCheck()
      },
//      页面加载 控制v-if
      searchSmsTemplateBefore () {
        this.currentPage = 1
        this.isShowSmsTemplate = false
        let data = {'pageSize': this.pageSize, 'page': this.currentPage}
        let notifyTime = this.ruleForm.date
        if (notifyTime) {
          if (notifyTime[0]) {
            data.BEGIN_TIME = getFormatDateTime(notifyTime[0])
          }
          if (notifyTime[1]) {
            data.END_TIME = getFormatDateTime(notifyTime[1])
          }
        }
        data.name = this.ruleForm.name
        data.status = {'$ne': 3}
        this.$store.dispatch('querySmsTemplateToCheck', data).then(() => {
          this.isShowSmsTemplate = true
        })
      },
//      报备短信mb
      smsTempEditShow () {
        this.isEditOrAddTemp = 'addNewTempState'
        this.isSmsTempEditShow = true
      },
//      报备短信mb 表格中 点击编辑
      smsTempEditShowFromTable (index, rows) {
        this.isEditOrAddTemp = 'editTempState'
        let data = rows[index]
        this.ruleFormBaoBei.title = data.name
        this.ruleFormBaoBei.content = data.content
        this.ruleFormBaoBei.sign = data.signCon
        this.ruleFormBaoBei.templateType = data.templateType
        this.ruleFormBaoBei._id = data._id
        this.isSmsTempEditShow = true
      },
//      关闭报备模板窗口 清空数据
      closeSmsTempEdit () {
        this.isSmsTempEditShow = false
        for (let i in this.ruleFormBaoBei) {
          this.ruleFormBaoBei[i] = ''
        }
        this.isShowTextCount = false
      },
//      点击dialog外部关闭时 清除数据
      editTempDialogClose () {
        this.closeSmsTempEdit()
      },
//      提交 编辑短信模板
      postSmsTemplate () {
        let data = {}
        data.name = this.ruleFormBaoBei.title
        data.content = this.ruleFormBaoBei.content
        data.signToCheck = this.ruleFormBaoBei.sign
        data.templateType = this.ruleFormBaoBei.templateType
        data._id = this.ruleFormBaoBei._id
        if (!data.name || data.name.trim() === '') {
          return this.$message.error(this.$t('sms.pleWriteTitle'))
        }
        if (!data.content || data.content.trim() === '') {
          return this.$message.error(this.$t('sms.pleWriteCon'))
        }
        if (!data.signToCheck || data.signToCheck.trim() === '') {
          return this.$message.error(this.$t('sms.pleWriteSign'))
        }
        if (!data.templateType) {
          return this.$message.error(this.$t('sms.pleChooseTemp'))
        }
        data = this.dataCorrection(data)
        data.name = this.delSpecialChar(data.name)
        data.content = this.delSpecialChar(data.content)
        data.signToCheck = this.delSpecialChar(data.signToCheck)
        if (this.isEditOrAddTemp === 'addNewTempState') {
          data.account = this.$store.state.session.account.account
          if (!data.account) {
            return this.$message.error(this.$t('sms.undefindAccount'))
          }
          this.$store.dispatch('postSmsTemplate', data).then(response => {
            if (response) {
              this.$message.success(this.$t('sms.successAddBaoBeiTemp'))
              this.searchSmsTemplateForFirstPage()
              this.closeSmsTempEdit()
            } else {
              this.$message.error(this.$t('sms.sorryAddBaoBeiTemp'))
            }
          })
        }
        if (this.isEditOrAddTemp === 'editTempState') {
          this.$store.dispatch('updateSmsTemplateToCheck', data).then(response => {
            if (response) {
              this.$message.success(this.$t('sms.successEditBaoBeiTemp'))
              this.searchSmsTemplateForFirstPage()
              this.closeSmsTempEdit()
            } else {
              this.$message.error(this.$t('sms.sorryEditBaoBeiTemp'))
            }
          })
        }
      },
//      处理字符串
      dataCorrection (data) {
        data.content = data.content.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\s/g, '').replace(/\[/g, '').replace(/\]/g, '')
        let sign = data.signToCheck
        sign = sign.replace(/【/g, '').replace(/】/g, '')
        data.signToCheck = '【' + sign + '】'
        return data
      },
//      将英文引号等转换成中文 去掉特殊字符
      delSpecialChar (content) {
        content = content.replace(/\\'/g, "'")
        content = content.replace(/\\"/g, '"')
        let contentarr = content.split('"')
        let str = ''
        let str2 = ''
        for (var j = 0; j < contentarr.length - 1; j++) {
          str += contentarr[j] + (j % 2 ? '”' : '“')
        }
        str += contentarr[j]
        contentarr = str.split("'")
        for (var m = 0; m < contentarr.length - 1; m++) {
          str2 += contentarr[m] + (m % 2 ? '’' : '‘')
        }
        str2 += contentarr[m]
        let reg1 = new RegExp('<[^<]*>', 'gi')
        str2 = str2.replace(reg1, '')
        let reg2 = new RegExp('</', 'gi')
        str2 = str2.replace(reg2, '')
        if (str2.substr(str2.length - 1, 1) === '\\' && str2.substr(str2.length - 2, 2) !== '\\\\') {
          str2 = str2 + '\\'
        }
        return str2
      },
//      编辑模板  input change 计算输入字数
      editTempChange (event) {
        this.isShowTextCount = true
        this.ruleFormBaoBei.content = this.ruleFormBaoBei.content.replace(/\r\n/g, '').replace(/\n/g, '').replace(/\s/g, '').replace(/\[/g, '').replace(/\]/g, '')
        let brackets = this.ruleFormBaoBei.content.match(/{\d+?}/g)
        let bracketsLen = 0
        if (brackets) {
          for (let i = 0; i < brackets.length; i++) {
            bracketsLen += brackets[i].length
          }
        }
        let difference = this.textCount - 2 - this.ruleFormBaoBei.content.length + bracketsLen - this.ruleFormBaoBei.sign.length
        if (difference <= 0) {
          if (event.target.name === 'content') {
            this.ruleFormBaoBei.content = this.ruleFormBaoBei.content.substring(0, this.textCount - 2 - this.ruleFormBaoBei.sign.length + bracketsLen)
          } else {
            this.ruleFormBaoBei.sign = this.ruleFormBaoBei.sign.substring(0, this.textCount - 2 - this.ruleFormBaoBei.content.length + bracketsLen)
          }
          difference = 0
        }
        this.difference = difference
        if (this.textCount - this.difference > this.smsSplitBaseNum) {
          this.splitCount = Math.ceil((this.textCount - this.difference) / this.smsSplitBaseNum)
        } else {
          this.splitCount = 1
        }
      },
//      删除短信模板
      delSmsTempFromTable (index, rows) {
        this.$confirm(this.$t('sms.sureDelTemp'), this.$t('public.tip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then(() => {
          let dataId = rows[index]._id
          this.$store.dispatch('cancelSmsTemplateToCheck', {_id: dataId}).then(req => {
            if (req) {
              this.searchSmsTemplateForFirstPage()
              this.$message.success(this.$t('sms.successDel'))
            } else {
              this.$message.error(this.$t('sms.failDel'))
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('sms.cancelDel')
          })
        })
      },
//      停用短信模板
      stopUseSmsTemplateToCheck (index, rows) {
        let data = {}
        data._id = rows[index]._id
        data.status = 4
        data.index = index
        this.$store.dispatch('changeSmsTemplateToCheckStatus', data).then(req => {
          if (req) {
            this.$message.success(this.$t('sms.stopSuccess'))
          } else {
            this.$message.error(this.$t('sms.stopFail'))
          }
        })
      },
//      启用短信模板
      reUseSmsTemplateToCheck (index, rows) {
        let data = {}
        data._id = rows[index]._id
        data.status = 1
        data.index = index
        this.$store.dispatch('changeSmsTemplateToCheckStatus', data).then(req => {
          if (req) {
            this.$message.success(this.$t('sms.reuseSuccess'))
          } else {
            this.$message.error(this.$t('sms.reuseFail'))
          }
        })
      },
//      点击 表单中 查看
      showSmsTempDetail (index, rows) {
//        let id = rows[index]._id
        let data = {}
        data.id = rows[index]._id
        data.index = index
        this.$store.dispatch('querySmsTemplateToCheckMessage', data).then(response => {
          if (response.success) {
            if (response.list) {
              this.smsTempDetailMessages = response.list.reverse()
            }
            this.smsTempDetail = rows[index]
            this.isShowSmsTempDetail = true
          } else {
            this.$message.error(this.$t('sms.searchFail'))
          }
        })
      },
//      查看》回复消息
      addSmsTemplateToCheckMessages (id) {
        let data = {}
        data.from = this.$store.state.session.account.account
        data.content = this.addSmsTemplateToCheckMessagesCon
        data.time = getCurrentDateTime()
        data._id = id
        this.$store.dispatch('addSmsTemplateToCheckMessages', data).then(res => {
          if (res.success) {
            this.smsTempDetailMessages.unshift(data)
            this.cancelSmsTemplateToCheckMessages()
          } else {
            this.$message.error(this.$t('sms.answerFail'))
          }
        })
      },
//      查看》回复消息》取消回复
      cancelSmsTemplateToCheckMessages () {
        this.isShowAddAnswerState = false
        this.addSmsTemplateToCheckMessagesCon = ''
      },
//      关闭查看弹窗
      closeShowSmsTempDetail () {
        this.cancelSmsTemplateToCheckMessages()
        this.isShowSmsTempDetail = false
      },
      showSmsTempDetailDialogClose () {
        this.closeShowSmsTempDetail()
      },
//      模板类型 匹配
      getTemplateTypeName (tplTypeId) {
        let tpls = this.smsTemplateType
        for (let i = 0; i < tpls.length; i++) {
          if (tpls[i].code_value === tplTypeId) {
            return tpls[i].code_name
          }
        }
        return this.$t('sms.weizhi')
      },
//      状态 匹配
      getTemplateToCheckStatusName (status) {
        let stat = this.smsTemplateToCheckStatus
        for (let i = 0; i < stat.length; i++) {
          if (Number(stat[i].code_value) === status) {
            return stat[i].code_name
          }
        }
        return this.$t('sms.weizhi')
      },
//      签名 匹配
      getTemplateToCheckSignName (id) {
        let signs = this.smsSign
        for (let i = 0; i < signs.length; i++) {
          if (signs[i]._id === id) {
            return signs[i].name
          }
        }
        return this.$t('sms.weizhi')
      }
    },
    computed: {
//        重构表单数据
      tableData () {
        let data = this.$store.state.sms.smsTemplateToCheck.list
        for (var i in data) {
          data[i].templateTypeCon = this.getTemplateTypeName(data[i].templateType)
          data[i].statusCon = this.getTemplateToCheckStatusName(data[i].status)
          if (data[i].sign) {
            data[i].signCon = this.getTemplateToCheckSignName(data[i].sign)
          } else {
            data[i].signCon = data[i].signToCheck
          }
          let message = data[i].messages || []
          let msgArray = []
          if (message.length) {
            for (var j = 0; j < message.length; j++) {
              if (message[j].from === 'admin') {
                msgArray.push(message[j])
              }
            }
          }
          data[i].reason = this.$t('sms.weizhiReason')
          if (msgArray.length) {
            let _reason = msgArray[0]
            for (let m = 0; m < msgArray.length; m++) {
              if (_reason.time < msgArray[m].time) {
                _reason = msgArray[m]
              }
            }
            data[i].reason = _reason.content
          }
        }
        return data
      },
      count () {
        return this.$store.state.sms.smsTemplateToCheck.count
      }
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'template') {
          this.searchSmsTemplateForFirstPage()
        }
      }
    },
    beforeMount () {
      let p1 = this.$store.dispatch('getCache', {type: 'smsTemplateType'})
      let p2 = this.$store.dispatch('getCache', {type: 'smsTemplateToCheckStatus'})
      let p3 = this.$store.dispatch('getCache', {type: 'smsSign'})
      Promise.all([p1, p2, p3]).then(() => {
        this.smsTemplateType = this.$store.state.session.dicMap.smsTemplateType
        this.smsTemplateToCheckStatus = this.$store.state.session.dicMap.smsTemplateToCheckStatus
        this.smsSign = this.$store.state.session.dicMap.smsSign
        this.searchSmsTemplateBefore()
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
  .smsTemplate
    .tables
      padding 16px 20px 0 20px
      .item
        margin-right 10px
      .deploy
        height 48px
        line-height 48px
        border 1px solid #ebebeb
        border-bottom none
        padding-left 14px
        .fr
          padding-top 10px
          height 38px
      .sms-temp-detail-wrap
        word-break break-all
        .sms-temp-detail-con-wrap
          max-height 400px
          overflow-y auto
          .sms-temp-detail-top
            padding 15px 10px
            background-color #fafafa
            border-bottom 1px solid #f3f3f3
            .el-row
              margin-bottom 10px
              .sms-detail-con
                height 90px
                border 1px solid #ccc
                border-radius 6px
                padding 5px
                overflow-y auto
          .sms-temp-detail-down
            .add-answer
              margin 10px 0
              display inline-block
              width 110px
              height 30px
              font-size 12px
              line-height 30px
              text-align center
              color #fff
              padding 0
              background #1abb9c
              border 1px solid #1abb9c
            .sms_template_replay_box_li
              border 1px solid #d3d3d3
              padding 10px 5px
              border-radius 5px
              color $cf-gray1
              margin-bottom 11px
              word-break break-all
    .ui-affix
      padding-bottom 0
    .submit
      text-align right
      float right
      /*margin 20px 0 0 40px*/
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
    .temp-search-wrap
      display inline-block
      margin-bottom 20px
      .el-input-time
        width 370px
      .el-input-title
        width 300px
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
    .bao-bei
      text-align right
      .bao-bei-btn
       font-size 12px
       line-height 30px
       text-align center
       color #fff
       padding 0 10px
       background #1abb9c
       border 1px solid #1abb9c
    .edit-sms-temp-wrap
      .edit-sms-temp
        overflow hidden
        min-height 370px
        min-width 602px
        .edit-sms-temp-left
          float left
          width 300px
          .edit-sms-temp-line
            margin-bottom 10px
            font-size 12px
            .title-temp
              color $cf-gray1
              margin-right 10px
              display inline-block
            .line-height-x
              float left
              margin-right 14px
            .content-inp
              width 206px
              height 120px
              border 1px solid #ddd
              border-radius 4px
              resize none
            .sign-inp
            .title-inp
              width 202px
              height 24px
              padding 0 4px
              border 1px solid #ddd
              border-radius 2px
            .radio-wrap
              padding 10px 0
            .edit-sms-temp-submit
              display inline-block
              width 110px
              height 30px
              font-size 12px
              line-height 30px
              text-align center
              color #fff
              padding 0
              background #1abb9c
              border 1px solid #1abb9c
            .edit-sms-temp-line-tip
              margin-left 58px
              color $cf-gray3
              .edit-sms-temp-line-special-tip
                color red
        .edit-sms-temp-right
          float right
          width 300px
          height 370px
          background url(img/sms_template.png)
          background-size auto 370px
          background-repeat no-repeat
          position relative
          background-position 60px 0
          .show_sms_tmpl_box
            position absolute
            left 70px
            top 72px
            width 158px
            height 234px
            overflow-y auto
            word-break break-all
</style>
