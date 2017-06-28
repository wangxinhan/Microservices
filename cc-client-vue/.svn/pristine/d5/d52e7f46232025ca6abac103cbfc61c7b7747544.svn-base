<template>
  <div v-if="!loading" class="customer-slot">
    <div class="innerwrap" v-if="custType==='one'">
      <!-- 这个判断为了数据同步，customer有值了才加载该数据 -->
      <template v-if="customer">
      <div class="un-remark-warp">
        <div class="cust-type">
            <customer-avatar :status="sta" :size="44"></customer-avatar>
        </div>
        <div class="cust-main">
          <div class="c_info">
            <div class="name">
              <h3>{{custName}}</h3>
              <div class="source">
                  <span class="icon">
                    <edit-customer-info
                      :currentBusinessObj = "currentBusinessObj"
                      :custInfo="customer"
                      :callScreen = 'callScreen'
                    ></edit-customer-info>
                  </span>
                  <span class="icon">
                    <show-customer-info
                    :custInfo="customer"
                    :callScreen="callScreen"
                      ></show-customer-info>
                  </span>
                  <span class="icon " v-if = "isUnbunding" @click.stop="deleteCustomerImRelation">
                       <i class="iconfont icon__i icon-quxiaoguanlian"></i>
                  </span>
              </div>
            </div>
            <div class="status">
              <el-dropdown trigger="click" @command="setStatus">
                  <span class="type">
                   <span :class="[callScreen? 'type-dailog': '']">
                     {{custStatus}}
                   </span>
                   <i class="el-icon-arrow-down" v-if="isAllowEditStatus&&status"></i>
                  </span>
                <el-dropdown-menu slot="dropdown" v-if="isAllowEditStatus&&status">
                  <el-dropdown-item :command="index" v-for="(sta, index) in status">{{sta}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown trigger="click" @command="setSource">
                  <span class="type">
                    {{custSource}} <i class="el-icon-arrow-down" v-if="isAllowEditSource&&source.length>0"></i>
                  </span>
                <el-dropdown-menu slot="dropdown" v-if="isAllowEditSource&&source.length>0 ">
                  <el-dropdown-item :command="sou.key"  v-for="(sou, index) in source"> {{sou.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="contact">
            <span :class="['info', phone.tel && phone.tel.length===0 ? 'disable':'']">
              <phone :phone="call" ></phone>
            </span>
            <span :class="['info', phone.tel && phone.tel.length===0 ? 'disable':'']" v-if="!isSMS">
              <phone :phone="phone"></phone>
            </span>
              <span :class="['info', email.length===0 ? 'disable':'']">
              <email :email="email"></email>
            </span>
            <span class="agent">
              <img :src="imgUrl" :alt="custOwner" />
            </span>
            <div class="agent-name" v-if="!isOwnerSelectShow" @click.stop="handlechangeOwnerClick">
               <span class="agent-name__span">{{custOwner}}</span>
               <span class="agent-name_i"><i class="el-icon-arrow-down" v-if="isAllowEditOwner"></i></span>
            </div>
            <customer-owner-select ref="ownerSelect" :widthSize="120" v-if="isOwnerSelectShow" :placeholder="$t('public.pleasePick')" :categoryId="customer ? customer.categoryId: null" :owner="customer ? customer.owner: null" @ownerChange="handleOwnerChange" @visible-change="handleOwnerVisibleChange">
            </customer-owner-select>
          </div>
        </div>
      </div>
        <div class="remark" ><span>{{title || '无'}}</span></div>
      </template>
    </div>
    <div v-else-if="custType==='business-del'">
      <div class="innerwrap-new" v-if="!loading">
        <div class="cust-type">
            <customer-avatar :status="'status10'" :size="36"></customer-avatar>
          </div>
        <div class="c_info c_bus">
          <div class="name business-del-name">
            <h3>该工单定位的客户已删除</h3>
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <div :class="['innerwrap-new', autoCustLength >= 0 &&currentBusinessObj.type==='webchat'?'innerwrap-new__webchat':'']">
        <div class="cust-type">
          <customer-avatar :status="'status10'" :size="36"></customer-avatar>
        </div>
        <div :class="['c-webchat__wapper', currentBusinessObj.type!=='webchat'?'c-info__wapper':'']">
          <div class="c_info c_bus">
            <div :class="['name']">
              <h3>未定位客户</h3>
            </div>
            <div class="status customer-dialog">
              <div v-if="currentBusinessObj.type==='call'&& autoCustLength<=0">
                <el-tooltip content="新增客户" placement="bottom">
                  <a class="text"  @click.stop="isDealog('addCustomerInfo')">
                    <i class="el-icon-plus"></i>
                  </a>
                </el-tooltip>
                <el-tooltip content="选择已存在的客户" placement="bottom">
                  <a class="text selec" @click.stop="isDealog('megerCustomerInfo')">
                    <i class="iconfont icon-dakailianjie"></i>
                  </a>
                </el-tooltip>
              </div>
              <div v-if="currentBusinessObj.type !=='call'">
                <el-tooltip content="新增客户" placement="bottom">
                  <a class="text"  @click.stop="isDealog('addCustomerInfo')">
                    <i class="el-icon-plus"></i>
                  </a>
                </el-tooltip>
                <el-tooltip content="选择已存在的客户" placement="bottom">
                  <a class="text selec" @click.stop="isDealog('megerCustomerInfo')">
                    <i class="iconfont icon-dakailianjie"></i>
                  </a>
                </el-tooltip>
              </div>
              <el-dialog modal-append-to-body lock-scroll top="10%" :title="customerInfo.title"  v-model.trim="customerInfo.isdealog" v-if="customerInfo.isdealog">
                 <add-customer
                   :isTag="false"
                   :isBlight = "false"
                   :labelValue = "customerInfo.labelValue"
                   :labelTitle = "customerInfo.title"
                   :reSize = "true"
                   :isDalog = "customerInfo.isdealog"
                   :isDailog = "true"
                   :currentBusinessObj="currentBusinessObj"
                   :custInfo="customer"
                   :isTitle="isTitle"
                   :select="select"
                   :bindCustomer="bindCustomer"
                   @addCustomer="addCustomer"
                   @merge="mergeCustomer"
                   @changeCustomeLabelValue="changeCustomeLabelValue"
                   @closeDialog="closeDialog"
                   ></add-customer>
               </el-dialog>
            </div>
          </div>
        <el-form  v-if="currentBusinessObj.type === 'webchat'" :inline="true" ref="form" label-position="left"  class="webchat_customer">
            <el-form-item prop="date1" label="名称:">
              <el-input size="mini" v-model.trim="autoCustName" placeholder="获取消息中的名称,自动填充到客户中" ></el-input>
            </el-form-item>
            <el-form-item prop="date2" label="电话:">
              <el-input size="mini" v-model.trim="autoCustPhone" placeholder="获取消息中的电话,自动填充到客户中" ></el-input>
            </el-form-item>
            <el-form-item prop="date2" class="webchat_customer__lastform" label="联系人:">
              <el-input size="mini"  v-model.trim="autoCustPerson" placeholder="录入联系人,自动填充到客户中"></el-input>
            </el-form-item>
            <span class="search_span">
              <i class="iconfont icon-sousuo" @click.stop="isDealog('bindExistCustomers')"></i>
            </span>
        </el-form>
        <div v-if="autoCustLength > 0 && currentBusinessObj.type === 'call'" class="exist_custom phone-wrap">号码<span class="phone-num">{{checkHideNum(callPhoneNum)}}</span>定位到多个客户,点击<a class="" @click.stop="isDealog('bindExistCustomers2')">选择一个客户</a></span></div>
        <div v-if="autoCustLength === 0 && currentBusinessObj.type === 'webchat'" class="exist_custom">已有0位客户相匹配</div>
          <div v-if="autoCustLength > 0 && currentBusinessObj.type !== 'call'" class="exist_custom"><span>已有</span><span>{{autoCustLength}}</span><span>位客户相匹配,请<a class="" @click.stop="isDealog('bindExistCustomers2')">绑定已存在客户</a></span></div>
         </div>
      </div>
    </template>
  </div>
</template>
<script>
  import Phone from './Phone'
  import Email from './Email'
  import EditCustomerInfo from './EditCustomerInfo'
  import ShowCustomerInfo from './ShowCustomerInfo'
  import addCustomer from '../../business-modules/customer/AddCustomer.vue'
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import CustomerOwnerSelect from '../../business-modules/customer/CustomerOwnerSelect.vue'
  import * as webchatTypes from '../../../store/modules/webchat/mutation-types.js'
  import { showFieldDesc, isNotAllowEditStatus, isNotAllowEditSource, isNotAllowEditOwner, isAllowPopupEditNoOwnerCustomer } from '../../../utils/customerUtils.js'
  import { isHasFunc, getCache, checkHideTel } from '../../../utils/m7Utils.js'
  import { isEmpty } from 'lodash'
  export default {
    name: 'CustomerSlot',
    data () {
      return {
        customerInfo: {
          isdealog: false,
          labelValue: 3,
          title: ''
        },
        isMerge: true,
        isAdd: true,
        customerClickType: 'addCus',
        value: '',
        loading: true,
        status: null,
        source: [],
        agents: [],
        custCategorys: [],
        type1: 'call',
        type2: 'talk',
        isSMS: true,
        isOwnerSelectShow: false,
        imgUrl: require('./img/agent.png'),
        isTitle: true,
        bindCustomer: {  // 绑定已存在客户的数据
          searchShow: true,
          custObj: {},
          form: {}
        },
        // replayData 定位到的客户信息
        autoCustPerson: '',
        callPhoneNum: ''
      }
    },
    props: {
      select: String,
      customer: {
        default: null,
        type: Object
      },
      custType: String,
      // 判断在线咨询和邮件解绑客户组件的显示
      isUnbunding: {
        type: Boolean,
        default: false
      },
      currentBusinessObj: Object,
      callScreen: Boolean
    },
    computed: {
      isRemarkTooltip () {
        let height = this.$el.querySelector('.customer-slot .remark span').offsetHeight
        return height > 15
      },
      isAllowPopupEdit () {
        return isAllowPopupEditNoOwnerCustomer(this.$store.state.session.user)
      },
      isAllowEditStatus () {
        return !isNotAllowEditStatus(this.$store.state.session.user)
      },
      isAllowEditSource () {
        return !isNotAllowEditSource(this.$store.state.session.user)
      },
      isAllowEditOwner () {
        let user = this.$store.state.session.user
        let scope = user.scope.customer
        // 禁止修改归属
        if (isNotAllowEditOwner(user)) {
          return false
        }
        // 无归属的客户，有'所有人'数据权限或弹屏时有'弹屏可修改无归属的客户'权限的才能修改
        if (this.customer.categoryId === 'NA' && this.customer.owner === 'NA') {
          if (scope === 'all' || this.isAllowPopupEdit) {
            return true
          }
          return false
        }

        // 有归属的客户，数据权限为all或者所属人是我或我的下属或为公海管理员能修改
        let category = getCache('custCategorys', this.customer.categoryId)
        if (user.moduleUsers.customer === 'all' || (user.moduleUsers.customer && user.moduleUsers.customer.indexOf(this.customer.owner) !== -1) || (category && category.managers && category.managers.indexOf(user._id) !== -1)) {
          return true
        }

        return false
      },
      isAllowChoseNoOwner () {
        return this.$store.state.session.user.scope.customer === 'all'
      },
      custSource () {
        if (this.customer) {
          for (let i = 0; i < this.source.length; i++) {
            if (this.source[i].key === this.customer.custsource1) {
              return this.source[i].name
            }
          }
          return this.$t('customer.noSource')
        }
        return '客户来源'
      },
      custName () {
        if (this.custType === 'one') {
          return this.customer ? this.customer.name : '客户名称'
        } else {
          return '未定位客户'
        }
      },
      custStatus () {
        let cs = this.customer && this.status ? this.status[this.customer.status] : '客户状态'
        if (this.status[this.customer.status]) {
          return cs
        } else {
          return '该状态已删除'
        }
      },
      sta () {
        return this.customer && this.customer.status
      },
      custOwner () {
        if (this.customer) {
          for (let i = 0; i < this.agents.length; i++) {
            if (this.agents[i]._id === this.customer.owner) {
              this.imgUrl = this.agents[i].im_icon ? this.agents[i].im_icon + '?imageView2/1/w/96/h/96' : require('./img/agent.png')
              return this.agents[i].displayName
            } else {
              this.imgUrl = require('./img/agent.png')
            }
          }
          for (let i = 0; i < this.custCategorys.length; i++) {
            if (this.custCategorys[i]._id === this.customer.categoryId) {
              return this.custCategorys[i].cName
            }
          }
        }
        return '无归属'
      },
      phone () {
        if (this.customer) {
          let phone = {
            tel: this.customer.phone || [],
            type: 'tlak'
          }
          return phone
        } else {
          return {
            tel: [],
            type: 'tlak'
          }
        }
      },
      call () {
        if (this.customer) {
          let call = {
            tel: this.customer.phone || [],
            type: 'call'
          }
          return call
        } else {
          return {
            tel: [],
            type: 'call'
          }
        }
      },
      email () {
        return this.customer && this.customer.email ? this.customer.email : []
      },
      title () {
        return this.customer ? this.customer.title : '努力加载中'
      },
      autoCustPhone: {
        get () {
          if (this.currentBusinessObj.type === 'webchat' && this.$store.state.webchat.autoCust[this.currentBusinessObj.callId]) {
            return this.$store.state.webchat.autoCust[this.currentBusinessObj.callId].autoCustPhone
          }
        },
        set (value) {
          if (this.currentBusinessObj.type === 'webchat' && this.$store.state.webchat.autoCust[this.currentBusinessObj.callId]) {
            return this.$store.commit(webchatTypes.SET_AUTOCUSTPHONE_VAL, {sessionId: this.currentBusinessObj.callId, data: value})
          }
        }
      },
      autoCustName: {
        get () {
          if (this.currentBusinessObj.type === 'webchat' && this.$store.state.webchat.autoCust[this.currentBusinessObj.callId]) {
            return this.$store.state.webchat.autoCust[this.currentBusinessObj.callId].autoCustName
          }
        },
        set (value) {
          if (this.currentBusinessObj.type === 'webchat' && this.$store.state.webchat.autoCust[this.currentBusinessObj.callId]) {
            return this.$store.commit(webchatTypes.SET_AUTOCUSTNAME_VAL, {sessionId: this.currentBusinessObj.callId, data: value})
          }
        }
      },
      autoCustLength () {
        let type = this.currentBusinessObj.type
        if (type === 'webchat' && this.$store.state.webchat.autoCust[this.currentBusinessObj.callId]) {
          return this.$store.state.webchat.autoCust[this.currentBusinessObj.callId].autoCustLength || 0
        } else if (type === 'email') {
          if (this.$store.state.email.autoCust && this.$store.state.email.autoCust.autoCustLength) {
            return this.$store.state.email.autoCust.autoCustLength
          } else {
            return 0
          }
        } else if (type === 'call') {
          let callArr = this.$route.path.split('/')
          let callSheetId = callArr[4]
          let callType = callArr[3]
          let currentObj = this.$store.state.call.current[callType]
          let phoneNum = ''
          if (currentObj) {
            let callInfo = currentObj.callInfo
            if (callInfo) {
              phoneNum = callInfo.QUICK_QUERY_NUM
            }
          }
          this.callPhoneNum = phoneNum
          if (this.$store.state.call.autoCust && this.$store.state.call.autoCust[callSheetId] && this.$store.state.call.autoCust[callSheetId].autoCustLength) {
            return this.$store.state.call.autoCust[callSheetId].autoCustLength
          } else {
            return 0
          }
        }
      },
      autoCustObj () {
        let type = this.currentBusinessObj.type
        if (type === 'webchat' && this.$store.state.webchat.autoCust[this.currentBusinessObj.callId]) {
          return this.$store.state.webchat.autoCust[this.currentBusinessObj.callId].autoCustObj
        } else if (type === 'email') {
          return this.$store.state.email.autoCust.autoCustObj
        } else if (type === 'call') {
          let callSheetId = this.$route.path.split('/')[4]
          if (this.$store.state.call.autoCust && this.$store.state.call.autoCust[callSheetId] && this.$store.state.call.autoCust[callSheetId].autoCustObj) {
            return this.$store.state.call.autoCust[callSheetId].autoCustObj
          } else {
            return {}
          }
        }
      }
    },
    components: {
      Phone,
      Email,
      EditCustomerInfo,
      CustomerAvatar,
      addCustomer,
      ShowCustomerInfo,
      CustomerOwnerSelect
    },
    methods: {
      deleteCustomerImRelation () {
        this.$emit('unbundling')
        this.customerInfo.isdealog = false
      },
      addCustomer (form) {
        this.customerInfo.isdealog = true
        this.$store.dispatch('addCustomer', form).then((val) => {
          if (val.success) {
            form.customerInfo = val.data
            this.$emit('addCustomer', form)
            this.customerInfo.isdealog = false
          }
        })
      },
      mergeCustomer (val) {
        this.$emit('merged', val)
        if (this.customer) {
          this.customerInfo.isdealog = false
        }
      },
      checkHideNum (num) {
        return checkHideTel(num, this.$store.state.session.user)
      },
      isDealog (flag) {
        this.customerInfo.isdealog = true
        if (flag === 'addCustomerInfo') {
          this.customerInfo.title = '新增客户'
          this.customerInfo.labelValue = 3
          this.isTitle = true
          this.bindCustomer.searchShow = true
          let arr = this.$route.path.split('/')
          let type = arr[2]
          if (type === 'webchat') {
            this.$emit('autoPerson', this.autoCustPerson)
          }
        } else if (flag === 'bindExistCustomers') {
          this.customerInfo.title = '绑定已存在客户'
          this.customerInfo.labelValue = 6
          this.isTitle = false
          this.bindCustomer.searchShow = false

          if (this.autoCustPhone && !this.autoCustName) {
            this.bindCustomer.form = {'field': 'phone', 'combox': this.autoCustPhone, 'page': 1, 'limit': 10}
          }
          if (this.autoCustName && !this.autoCustPhone) {
            this.bindCustomer.form = {'field': 'displayName', 'combox': this.autoCustName, 'page': 1, 'limit': 10}
          }
          if (this.autoCustPhone && this.autoCustName) {
            this.bindCustomer.form = {'field': 'webchat', 'displayName': this.autoCustName, 'combox': this.autoCustPhone, 'page': 1, 'limit': 10}
          }
          if (!this.autoCustPhone && !this.autoCustName) {
            if (this.$route.path.split('/')[2] === 'webchat') {
              this.customerInfo.isdealog = false
              let info = {
                autoCustName: this.$store.state.webchat.autoCust[this.$route.path.split('/')[4]].autoCustName,
                autoCustPhone: this.$store.state.webchat.autoCust[this.$route.path.split('/')[4]].autoCustPhone,
                autoCustObj: {},
                autoCustLength: 0
              }
              this.$store.commit(webchatTypes.AUTO_CUST_INFO, {sessionId: this.$route.path.split('/')[4], data: info})
            }
          }
          if (this.callScreen) {
            this.bindCustomer.form = {'field': 'phone', 'combox': this.newPhoneNum, 'page': 1, 'limit': 10}
          }
        } else if (flag === 'bindExistCustomers2') {
          this.customerInfo.title = '绑定已存在客户'
          this.customerInfo.labelValue = 6
          this.isTitle = false
          if (this.$route.path.split('/')[2] === 'call') {
            this.bindCustomer.searchShow = true
            this.bindCustomer.form = {'field': 'phone', 'combox': this.callPhoneNum, 'custType': 'call', 'page': 1, 'limit': 10}
          } else {
            this.bindCustomer.searchShow = false
          }
          if (!this.autoCustPhone && !this.autoCustName) {
            if (this.$route.path.split('/')[2] === 'webchat') {
              this.customerInfo.isdealog = false
              let info = {
                autoCustName: this.$store.state.webchat.autoCust[this.$route.path.split('/')[4]].autoCustName,
                autoCustPhone: this.$store.state.webchat.autoCust[this.$route.path.split('/')[4]].autoCustPhone,
                autoCustObj: {},
                autoCustLength: 0
              }
              this.$store.commit(webchatTypes.AUTO_CUST_INFO, {sessionId: this.$route.path.split('/')[4], data: info})
            }
          }
          this.bindCustomer.custObj = this.autoCustObj
        } else if (flag === 'megerCustomerInfo') {
          this.customerInfo.title = '选择已存在客户'
          this.customerInfo.labelValue = 6
          this.isTitle = true
          this.bindCustomer.form = null
          this.bindCustomer.custObj = null
          this.bindCustomer.searchShow = true
        }
      },
      changeCustomeLabelValue (label) {
        this.customerInfo.labelValue = label.labelValue
        this.customerInfo.title = label.title
      },
      // TODO 座席权限控制和公海
      fetchData () {
        this.loading = true
        let p1 = this.$store.dispatch('getCache', { type: 'custTmpls' })
        let p2 = this.$store.dispatch('getCache', { type: 'agents' })
        let p3 = this.$store.dispatch('getCache', { type: 'custCategorys' })
        let p4 = this.$store.dispatch('getCache', { type: 'options', id: 'd7b9c68a-b50f-21d1-d5fd-41ea93f5f49c' })
        Promise.all([p1, p2, p3, p4]).then(([custTmpls, agents, custCategorys]) => {
          this.status = !isEmpty(custTmpls[0].status) ? custTmpls[0].status : null
          this.source = custTmpls[0].source || []
          this.agents = agents || []
          this.custCategorys = custCategorys
          this.loading = false
        })
      },
      setStatus (command) {
        let data = {
          _id: this.customer._id,
          status: command
        }
        this.$store.dispatch('updateCustomerStatus', data).then(() => {
          this.loading = false
        })
      },
      setSource (command) {
        let data = {
          _id: this.customer._id,
          custsource1: command
        }
        this.$store.dispatch('updateCustomerSource', data).then(() => {
          this.loading = false
        })
      },
      handlechangeOwnerClick () {
        if (this.isAllowEditOwner) {
          this.isOwnerSelectShow = true
          let fun = (event) => {
            if (event.target.parentElement.parentElement.id !== 'ownerSelect') {
              this.isOwnerSelectShow = false
              document.body.removeEventListener('click', fun)
            }
          }

          document.body.addEventListener('click', fun)
        }
      },
      handleOwnerChange (obj) {
        this.isOwnerSelectShow = false
        let data = Object.assign({}, { _id: this.customer._id }, obj)
        this.$store.dispatch('updateCustomerOwner', data).then(() => {})
      },
      handleOwnerVisibleChange (visible) {
        if (!visible) {
          let fun = (event) => {
            if (event.target.parentElement.parentElement.id !== 'ownerSelect') {
              this.isOwnerSelectShow = false
              document.body.removeEventListener('click', fun)
            }
          }

          document.body.addEventListener('click', fun, { once: true })
        }
      },
      setOwner (command) {
        this.loading = true
        let category = command.split('|')[0]
        let categoryId = command.split('|')[1]
        let owner = command.split('|')[2]
        this.imgUrl = showFieldDesc('imgUrl', owner)
        let data = {
          _id: this.customer._id,
          category,
          categoryId,
          owner
        }
        this.$store.dispatch('updateCustomerOwner', data).then(() => {
          this.loading = false
        })
      },
      closeDialog (value) {
        this.customerInfo.isdealog = value
      }
    },
    beforeMount () {
      if (isHasFunc('func_sort_phone_bar_send_sms', this.$store.state.session.user)) {
        this.isSMS = false
      }
      this.fetchData()
    }
  }
</script>
<style lang="stylus" scoped>
@import '../../../assets/common.styl'
.un-remark-warp
  display flex
  flex-wrap wrap
  .cust-main
    flex 1
.customer-slot
  padding-top 17px
  box-sizing border-box
  line-height 12px
  height 96px
  .cust-type
    display inline-block
    padding-top 23px
    margin-right 12px
  .c_info
    display inline-block
    margin-bottom 4px
    .name
      margin-bottom 7px
      display flex
      color $cf-level3
      align-items center
      white-space nowrap
      h3
        font-size 18px
        @extend .ellipsis
        max-width 14em
        display inline-block
        color $cf-gray1
    .business-del-name
      display block
      h3
        line-height 56px
    .status
      font-weight 400
      .el-dropdown
        padding-right 20px
      a
        color #71ccba
        i
          margin-right 4px
      .selec
        margin-left 16px
      .type
        display inline-block
        line-height 13px
        cursor pointer
        color #000
       .type-dailog
          display inline-block
          max-width 6em
          @extend .ellipsis
    .source
      display inline
      width 105px
      margin-left 10px
      .icon
        display inline-block
        border 1px solid  $c-main
        width 22px
        height 22px
        line-height 22px
        border-radius 12px
        margin-left 4px
        cursor pointer
        .icon__i
          margin-left 4px
  .contact
    float right
    box-sizing border-box
    display flex
    align-items center
    .agent-name
      display flex
      align-items center
      font-weight 300
      .agent-name__span
        display inline-block
        max-width 6em
        margin-right 5px
        @extend .ellipsis
      .agent-name__i
        display inline-block
  .agent
  .info
    display inline-block
    box-size(36px)
    border-radius 19px
    margin-right 10px
    float right
    overflow hidden
    img
      box-size(38px)
      border-radius 19px
  .info
    cursor pointer
    border 1px solid  $c-main
  .disable
    border 1px solid  #d3d3d3
.iconfont
  font-size 14px
  color #71ccba
.remark
  max-height 30px
  font-size 12px
  color $cf-gray1
  line-height 15px
  margin-left 72px
  max-width 90%
  overflow auto
  word-break break-all
.webchat_customer
  display flex
  .el-form-item
    flex 1
    margin 0 0 0 10px
    &:first-child
      margin-left 0
  .search_span
    display inline-block
    width 24px
    height 24px
    line-height 24px
    text-align center
    background #1abb9c
    margin 7px 0 0 4px
    border-radius 3px
    i
      font-size 16px
      color #fff
.exist_custom
  line-height 28px
  span
    width auto
.phone-wrap
  color #999
.phone-num
  color #7bcdd2
.innerwrap-new
  display flex
  align-items center
  min-height 60px
  max-height 88px
  .c-webchat__wapper
    flex 1
  .cust-type
    margin-right 15px
    padding-top 2px
  .c_info
    display flex
    align-items center
    margin-bottom 0
    .name
      margin-bottom 0
    .status
      .text
        margin-left 8px
        display inline-block
        height 22px
        width 22px
        border 1px solid $c-main
        border-radius 12px
        text-align center
        float left
        i
          font-size 12px
          margin 0 auto
          line-height 24px
// 用于未知客户内容居中  出在线咨询外
  .c-info__wapper
    margin-top -4px
  .innerwrap-new__webchat
    .cust-type
      margin-top -30px
</style>
