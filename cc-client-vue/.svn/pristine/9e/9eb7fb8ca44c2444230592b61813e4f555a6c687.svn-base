<template>
  <div class="add" :class="[callScreen?'call-screen-add':'',callBackAdd?'show-callback-add':'']">
  <el-form :model="form" :class="{'is-merge': isMergeCustomer}" :rules="rules" ref="form" label-position="top">
  <el-row :gutter="20">
  <el-col :span="12" v-if="showItem.name"><div class="grid-content bg-purple">
    <el-form-item :label="showItem.name" :prop="noUpdate.name ? null : 'name'">
      <el-input size="small" v-model.trim="form.name" class="a" :disabled="noUpdate.name"></el-input>
    </el-form-item>
  </div></el-col>
  <el-col :span="12"><div class="grid-content bg-purple">
    <el-form-item :label="$t('customer.custStatus')" prop="status">
      <customer-status-select :placeholder="$t('public.pleasePick')" :status="custInfo ? custInfo.status : null" @statusChange="handleStatusChange">
      </customer-status-select>
    </el-form-item>
  </div></el-col>
  </el-row>
  <el-row v-if="showItem.title">
    <el-col :span="24"><div class="grid-content bg-purple">
      <el-form-item :label="showItem.title" :prop="noUpdate.title?null:'title'">
        <el-input size="small" type="textarea" v-model.trim="form.title" :disabled="noUpdate.title"></el-input>
      </el-form-item>
    </div></el-col>
  </el-row>
  <el-row :gutter="20" v-if="showItem.phone">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item :label="showItem.phone"  prop="phone">
        <el-input size="small" @change="submit($event, true)" v-model.trim="phone[0].tel"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="15"><div class="grid-content bg-purple">
      <el-form-item :label="showItem.phoneMemo">
        <el-input size="small" @change="submit($event, true)" v-model.trim="phone[0].memo"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="1" style="padding-left: 3px"><div class="grid-content bg-purple">
        <span class="push" @click="add_phone"><i class="el-icon-plus"></i></span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20" v-for="(phon,index) in phone" v-if="index !== 0" >
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item>
        <el-input size="small" @change="submit($event, true)"  v-model.trim="phon.tel"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="15"><div class="grid-content bg-purple">
      <el-form-item>
        <el-input size="small" @change="submit($event, true)" v-model.trim="phon.memo"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="1" style="padding-left: 3px"><div class="grid-content bg-purple">
        <span class="push del" @click="del_phone(index)"><i class="el-icon-minus"></i></span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20" v-if="showItem.email">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item :label="showItem.email" prop="email">
        <el-input size="small" @change="submit($event, true)" v-model.trim="email[0].email"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="15"><div class="grid-content bg-purple">
      <el-form-item :label="showItem.emailMemo">
        <el-input size="small" @change="submit($event, true)" v-model.trim="email[0].memo"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="1" style="padding-left: 3px"><div class="grid-content bg-purple">
        <span class="push" @click="add_email"><i class="el-icon-plus"></i></span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20" v-for="(emai,index) in email" v-if="index !== 0">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item>
        <el-input size="small" @change="submit($event, true)" v-model.trim = "emai.email"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="15"><div class="grid-content bg-purple">
      <el-form-item>
        <el-input @change="submit($event, true)" size="small" v-model.trim = "emai.memo"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="1" style="padding-left: 3px"><div class="grid-content bg-purple">
        <span class="push del" @click="del_email(index)"><i class="el-icon-minus"></i></span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20" v-if="showItem.weixin">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item :label="showItem.weixin" prop="weixin">
        <el-input @change="submit($event, true)" size="small" v-model.trim="weixin[0].num"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="15">
      <div class="grid-content bg-purple">
        <el-form-item :label="showItem.weixinMemo">
          <el-input size="small" @change="submit($event, true)" v-model.trim="weixin[0].memo"></el-input>
        </el-form-item>
      </div>
    </el-col>
    <el-col :span="1" style="padding-left: 3px"><div class="grid-content bg-purple">
        <span class="push" @click="add_weixin"><i class="el-icon-plus"></i></span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20" v-for="(a,index) in weixin" v-if="index !== 0">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item>
        <el-input size="small" @change="submit($event, true)" v-model.trim = "a.num"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="15"><div class="grid-content bg-purple">
      <el-form-item>
        <el-input size="small" @change="submit($event, true)" v-model.trim = "a.memo"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="1" style="padding-left: 3px"><div class="grid-content bg-purple">
        <span class="push del" @click="del_weixin(index)"><i class="el-icon-minus"></i></span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="16">
      <div class="grid-content bg-purple" v-if="showItem.province">
        <el-form-item :label="$t('public.provinceCity')" :prop="noUpdate.province?null:'province'">
          <area-linkage
            :disabled="noUpdate.province"
            :provinceName="'province'"
            :provinceValue="province"
            :cityName="'city'"
            :cityValue="city"
            @provinceChange="handleProvinceChange"
            @cityChange="handleCityChange"
          ></area-linkage>
        </el-form-item>
      </div>
    </el-col>
    <el-col :span="8"><div class="grid-content bg-purple" v-if="showItem.address">
      <el-form-item :label="showItem.address" :prop="noUpdate.address?null:'address'">
        <el-input size="small" v-model.trim="form.address" :disabled="noUpdate.address"></el-input>
      </el-form-item>
    </div></el-col>
  </el-row>
      <el-row :gutter="20">
        <el-col :span="12"><div class="grid-content bg-purple" v-if="showItem.note">
          <el-form-item :label="showItem.note" :prop="noUpdate.note?null:'note'">
            <el-input size="small" class="a" v-model.trim="form.note" :disabled="noUpdate.note"></el-input>
          </el-form-item>
        </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple" v-if="showItem.web">
          <el-form-item :label="showItem.web" :prop="noUpdate.web?null:'web'">
            <el-input size="small" class="a" v-model.trim="form.web" :disabled="noUpdate.web"></el-input>
          </el-form-item>
        </div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-form-item :label="$t('customer.dataSource')">
            <customer-source-select :placeholder="$t('public.pleasePick')" :source="custInfo ? custInfo.custsource1 : null" @sourceChange="handleSourceChange">
            </customer-source-select>
          </el-form-item>
        </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-form-item :label="$t('customer.customerOwner')">
            <customer-owner-select :placeholder="$t('public.pleasePick')" :categoryId="custInfo? custInfo.categoryId: null" :owner="custInfo ? custInfo.owner: null" @ownerChange="handleOwnerChange">
            </customer-owner-select>
          </el-form-item>
        </div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content bg-purple">
          <el-form-item :label="$t('customer.attach')">
            <el-upload
              :action="uploadUrl"
              :data="uploadData"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :file-list="fileList">
              <el-button size="small" type="primary">{{$t('public.clickUpload')}}</el-button>
              <div class="el-upload__tip" slot="tip">{{$t('public.uploadSizeDes')}}</div>
            </el-upload>
          </el-form-item>
        </div></el-col>
      </el-row>
        <legend v-if="optionsCustomFields.length>0" style="width: 475px;margin-bottom: 12px;font-size:14px;">{{$t('customer.customField')}}</legend>
        <el-form-item v-for="item in optionsCustomFields" :label="item.label" :prop="noUpdate[item.name] ? null : item.name">
          <el-input size="small" v-if="item.inputType==='input' && item.validateType !== 'Number'" v-model.trim="form[item.name]" :disabled="noUpdate[item.name]"></el-input>

          <el-input size="small" v-if="item.inputType==='input' && item.validateType === 'Number'" v-model="form[item.name]" :disabled="noUpdate[item.name]"></el-input>

          <el-input size="small" type="textarea" v-if="item.inputType==='textarea'" v-model.trim="form[item.name]" :disabled="noUpdate[item.name]"></el-input>

          <el-select size="small" v-if="item.inputType==='select'" v-model.trim="form[item.name]" :placeholder="$t('public.pleasePick')" :disabled="noUpdate[item.name]">
            <el-option v-if="item.inputType==='select'"
              v-for="item2 in item.data"
              :label="item2.label"
              :value="item2.value">
            </el-option>
          </el-select>

          <el-date-picker size="small" v-if="item.inputType==='date'"
                          v-model.trim="form[item.name]"
                          type="date"
                          :placeholder="$t('public.pleasePick')"
                          align="right"
                          :editable="isEditable"
                          :disabled="noUpdate[item.name]">
          </el-date-picker>

          <div v-if="item.inputType==='checkbox'">
            <el-checkbox-group  v-model.trim="form[item.name]">
              <el-checkbox v-if="item.inputType==='checkbox'"
                           v-for="item2 in item.data"
                           :label="item2.value"
                          :disabled="noUpdate[item.name]">
                {{item2.label}}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <div v-if="item.inputType==='radio'">
            <el-radio-group  v-model.trim="form[item.name]">
              <el-radio size="small" v-if="item.inputType==='radio'"
                           v-for="item2 in item.data"
                           :label="item2.value"
                          :disabled="noUpdate[item.name]">
                {{item2.label}}
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="submit" class="save">{{$t('public.save')}}</el-button>
          <el-button type="primary" @click.stop="addCdrBlackList(tel)" class="save addBlackList" v-if="isBlight">{{$t('webchat.addBlack')}}</el-button>
          <el-button type="primary" @click.stop="callBackAddCust" class="save addBlackList" v-if="callBackAdd">{{$t('public.getback')}}</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/javascript">
  import AreaLinkage from '../../ui-modules/area-linkage/AreaLinkage.vue'
  import CustomerStatusSelect from './CustomerStatusSelect.vue'
  import CustomerSourceSelect from './CustomerSourceSelect.vue'
  import CustomerOwnerSelect from './CustomerOwnerSelect.vue'
  import { deepClone, getCurrentDate, checkHideTel } from '../../../utils/m7Utils'
  import { sortCustomFields, isHideTel } from '../../../utils/customerUtils.js'
  import uuid from 'uuid'
  import { qiniuUploadUrl, qiniu7moorDomain } from '../../../utils/qiniuUtils'
  import * as globalTypes from '../../../store/mutation-types.js'
  export default{
    name: 'AddCus',
    props: {
      editCustType: {
        type: String,
        default: 'add'
      },
      custInfo: Object,
      currentBusinessObj: Object,
      isBlight: {
        type: Boolean,
        default: false
      },
      tel: String,
      // 客户合并模块的时候展示合并预览样式调整控制
      isMergeCustomer: Boolean,
      callScreen: Boolean,
      callBackAdd: Boolean
    },
    data () {
      return {
        uploadUrl: qiniuUploadUrl,
        uploadData: {},
        isEditable: false,
        // 格式化时间数组，让其通过校验
        dateIdArr: [],
        attachs: [],
        form: { _id: null, dbType: null, name: null, status: null, title: null, province: null, city: null, address: null, note: null, web: null, custsource1: null, categoryId: null, owner: null, email: [], weixin: [], phone: [], attachs: [] },
        showItem: {
          name: ''
        },
        rules: {
          status: [
            { required: true, message: this.$t('public.pleaseInput') + this.$t('customer.custStatus'), trigger: 'change' }
          ]
        },
        noUpdate: { name: false, title: false, province: false, address: false, note: false, web: false },
        optionsCustomFields: [],
        value: '',
        phone: [{ memo: '', tel: '' }],
        email: [{ memo: '', email: '' }],
        weixin: [{ memo: '', num: '' }]
      }
    },
    computed: {
      isHideTel () {
        return isHideTel(this.$store.state.session.user)
      },
      province () {
        if (this.custInfo && this.custInfo.fields) {
          for (let i = 0; i < this.custInfo.fields.length; i++) {
            let field = this.custInfo.fields[i]
            if (field.k === 'province') {
              return field.v
            }
          }
        }
        return null
      },
      city () {
        if (this.custInfo && this.custInfo.fields) {
          for (let i = 0; i < this.custInfo.fields.length; i++) {
            let field = this.custInfo.fields[i]
            if (field.k === 'city') {
              return field.v
            }
          }
        }
        return null
      },
      fileList () {
        return this.attachs.map(attach => ({ name: attach.name, url: `${qiniu7moorDomain}${attach.id}` }))
      }
    },
    components: {
      AreaLinkage,
      CustomerOwnerSelect,
      CustomerSourceSelect,
      CustomerStatusSelect
    },
    methods: {
      hideTel (tel) {
        return checkHideTel(tel, this.$store.state.session.user)
      },
      /**
       * 通话模块加入黑名单
       * @param {[type]} phoneNum [description]
       */
      addCdrBlackList (phoneNum) {
        let numPattern = new RegExp(/^((\d{11,12})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/)
        if (!numPattern.test(phoneNum)) {
          this.$message.error(this.$t('call.phoneNumNoRight'))
          return false
        }
        this.$confirm(this.$t('call.blackListConfirm'), this.$t('public.tip'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then(() => {
          let data = {}
          let user = this.$store.state.session.user
          data.PBX = user.pbx
          data.Account = user.account
          data.BlackNum = phoneNum
          data.Type = '1'
          let displayName = user.displayName
          let exten = user.exten
          data.Memo = this.$t('customer.memo', {displayName, exten})
          let routeArry = this.$route.path.split('/')
          let tabType = routeArry[3]
          let lastData = {data: data, type: tabType}
          this.$store.dispatch('saveBlackList', lastData)
        })
      },
      parseForm () {
        let form = {}
        let phone, weixin, email
        phone = deepClone(this.phone.filter(obj => !!obj.tel))
        weixin = deepClone(this.weixin.filter(obj => !!obj.num))
        email = deepClone(this.email.filter(obj => !!obj.email))
        form = deepClone(this.form)
        form.dbType = this.$store.state.session.dicMap.custTmpls[0]._id
        form.attachs = deepClone(this.attachs)
        // 编辑客户时， 如果号码是被隐藏的且没进行修改的话，取隐藏之前的值 tempTel
        // 反之去编辑之后的值， 添加的没被隐藏可直接存储
        phone = deepClone(phone.map((val) => {
          if (val.tempTel && val.tel.indexOf('*') > -1) {
            val.tel = val.tempTel
          }
          delete val.tempTel
          return val
        }))
        form.phone = phone
        form.email = email
        form.weixin = weixin
        form.type = this.currentBusinessObj.type

        if (form.owner === this.$store.state.session.sessionId) {
          form.tabType = this.currentBusinessObj.tabType
        } else {
          if (form.type === 'customer') {
            form.tabType = 'customer_all'
          } else {
            form.tabType = this.currentBusinessObj.tabType
          }
        }
        form.callId = this.currentBusinessObj.callId
        form.dealSrc = this.currentBusinessObj.dealSrc

        if (this.editCustType === 'update') {
          for (let key in this.noUpdate) {
            if (this.noUpdate[key]) {
              if (this.dateIdArr.indexOf(key) !== -1) {
                form[key] = new Date(this.custInfo[key])
              } else {
                form[key] = this.custInfo[key]
              }
            }
          }
        }
        return form
      },
      parseDate (form) {
        for (let i = 0; i < this.optionsCustomFields.length; i++) {
          let field = this.optionsCustomFields[i]
          if (field.inputType === 'date' && form[field.name] instanceof Date) {
            let date = form[field.name]
            let year = date.getFullYear()
            let month = date.getMonth()
            month = month + 1 > 9 ? month + 1 : '0' + (month + 1)
            let day = date.getDate()
            day = day > 9 ? day : '0' + day
            form[field.name] = `${year}-${month}-${day}`
          }
        }
        return form
      },
      /**
       * [submit description]
       * @param  {[type]} vutFlag [如果为true, 则不需要提交请求]
       * @return {[type]}         [description]
       */
      submit (ev, vutFlag) {
        let form = this.parseForm()
        this.form = deepClone(form)
        for (let i = 0; i < this.dateIdArr.length; i++) {
          if (this.form[this.dateIdArr]) {
            this.form[this.dateIdArr] = new Date(this.form[this.dateIdArr])
          }
        }
        if (vutFlag) {
          return false
        }
        this.$nextTick(() => {
          this.$refs.form.validate((valid) => {
            if (valid) {
              form = this.parseDate(form)
              if (this.editCustType === 'add') {
                if (this.currentBusinessObj.type === 'call') {
                  this.$store.dispatch('callLocationCustomer2Add', form).then(() => {
                    this.$emit('editCust', form)
                  })
                } else {
                  this.$emit('editCust', form)
                }
              } else {
                this.$emit('editCust', form)
              }
            } else {
              this.$message({
                type: 'error',
                message: this.$t('public.pleaseEnterRequireItem')
              })
              return false
            }
          })
        })
      },
      callBackAddCust () {
        this.$emit('callBackAddCust', true)
      },
      handleRemove (file, fileList) {
        let flag = false
        this.$confirm(this.$t('customer.deleteCustomerAttachMessage'), this.$t('customer.deleteCustomerAttach'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then((v) => {
          flag = true
          let id = file.url.replace(qiniu7moorDomain, '')
          let attachs = this.attachs.filter(attach => attach.id !== id)
          let data = {
            attachs,
            fildId: id
          }
          if (this.custInfo) {
            data._id = this.custInfo._id
          }
          return this.$store.dispatch('delCustomerAttach', data).then(() => {
            this.attachs = attachs
          })
        }).catch((err) => {
          if (err === 'cancel') {
            this.attachs = deepClone(this.attachs)
          }
        })
        if (!flag) {
          this.attachs = deepClone(this.attachs)
        }
      },
      handlePreview (file) {
        this.$store.commit(globalTypes.SET_FILEDOWNLOAD, { path: `${file.url}?attname=${file.name}`, isSession: false })
      },
      handleSuccess (response, file, fileList) {
        let fileUrl = response.key
        let trueName = file.name
        let uploadFile = { id: fileUrl, name: file.name, type: 'other', isNew: 1 }
        let imgTypes = ['jpg', 'jpeg', 'gif', 'png', 'bmp']
        let suffix = trueName.substring(trueName.lastIndexOf('.') + 1)
        suffix = suffix.toLowerCase()
        if (imgTypes.indexOf(suffix) !== -1) {
          uploadFile.type = 'img'
        }
        this.attachs.push(uploadFile)
      },
      beforeUpload (file) {
        if (file.size > 10 * 1024 * 1024) {
          this.$message.error(this.$t('customer.attachSizeOverLimit'))
          this.attachs = deepClone(this.attachs)
          return false
        }

        return this.$store.dispatch('getImTestQiniuToken').then(response => {
          if (response.uptoken) {
            this.uploadData.token = response.uptoken
          }
          this.uploadData.key = generateUploadResourceKey(this.$store)
        })
      },
      handleProvinceChange (obj) {
        this.form.province = obj.value
      },
      handleCityChange (obj) {
        this.form.city = obj.value
      },
      handleStatusChange (value) {
        this.form.status = value
      },
      handleSourceChange (value) {
        this.form.custsource1 = value
      },
      handleOwnerChange (obj) {
        Object.assign(this.form, obj)
      },
      add_weixin () {
        this.weixin.push({memo: '', weixin: ''})
      },
      add_email () {
        this.email.push({memo: '', email: ''})
      },
      add_phone () {
        this.phone.push({momo: '', tel: ''})
      },
      del_phone (index) {
        this.phone.splice(index, 1)
      },
      del_weixin (index) {
        this.weixin.splice(index, 1)
      },
      del_email (index) {
        this.email.splice(index, 1)
      }
    },
    watch: {
      custInfo () {
        this.phone = [{ memo: '', tel: '' }]
        this.email = [{ memo: '', email: '' }]
        this.weixin = [{ memo: '', num: '' }]

        let customForm = Object.assign({}, this.form)

        for (let key in customForm) {
          if (this.custInfo) {
            customForm[key] = deepClone(this.custInfo[key])
            if (key === 'phone' && this.custInfo[key] && this.custInfo[key].length !== 0) {
              if (this.isHideTel) {
                let phone = deepClone(this.custInfo[key])
                this[key] = phone.map(obj => {
                  obj.realTel = obj.tel
                  obj.tempTel = obj.tel
                  obj.tel = this.hideTel(obj.tel)
                  return obj
                })
              } else {
                this[key] = deepClone(this.custInfo[key])
              }
            }
            if (key === 'email' || key === 'weixin') {
              if (this.custInfo[key] && this.custInfo[key].length !== 0) {
                this[key] = deepClone(this.custInfo[key])
              }
            }
            if (key === 'attachs') {
              this[key] = deepClone(this.custInfo[key]) || []
            }

            if (this.dateIdArr.length > 0 && this.dateIdArr.indexOf(key) !== -1) {
              customForm[key] = new Date(this.custInfo[key])
            }
          }
        }
        this.form = customForm
      }
    },
    beforeMount () {
      Promise.all([
        this.$store.dispatch('getCache', { type: 'custCategorys' }),
        this.$store.dispatch('getCache', { type: 'custTmpls' }),
        this.$store.dispatch('getCache', { type: 'agents' }),
        this.$store.dispatch('getCache', { type: 'options', id: 'd7b9c68a-b50f-21d1-d5fd-41ea93f5f49c' })
      ]).then(([custCategorysCache, custTmpls, agents, provinceCache]) => {
        let custTmpl = custTmpls[0]
        let customForm = Object.assign({}, this.form)
        // 固定的显示字段
        let stableFields = custTmpl.stable_fields
        stableFields.forEach(ele => {
          this.showItem[ele.name] = ele.value
          if (ele.name === 'phone' || ele.name === 'weixin' || ele.name === 'email') {
            this.showItem[ele.name + 'Memo'] = ele.value + this.$t('public.remark')
          }
          if (ele.required === 'required') {
            this.rules[ele.name] = [{required: true, message: this.$t('public.pleaseInput') + ele.value, trigger: 'blur'}]
            if (ele.name === 'phone') {
              this.rules[ele.name][0].validator = validatePhone
            }
            if (ele.name === 'weixin') {
              this.rules[ele.name][0].validator = validateWeixin
            }
            if (ele.name === 'email') {
              this.rules[ele.name][0].validator = validateEmail
            }
            if (ele.name === 'province') {
              this.rules[ele.name][0].trigger = 'change'
            }
          }
          // (!this.custInfo || this.custInfo[customField._id]) 把该语句修改为 this.custInfo[customField._id]
          if (this.editCustType === 'update' && ele.noupdate === true && this.custInfo[ele.value]) {
            this.$set(this.noUpdate, ele.name, true)
          }
        })
        let dateIdArr = []
        // 自定义字段
        let sortedCustomFields = sortCustomFields(custTmpl.custom_fields)
        let optionsCustomFields = []
        sortedCustomFields.forEach(customField => {
          let option = { label: customField.name, name: customField._id }
          if (customField.type === 'single') {
            option.inputType = 'input'
          } else if (customField.type === 'multi') {
            option.inputType = 'textarea'
          } else if (customField.type === 'number') {
            option.inputType = 'input'
            option.validateType = 'Number'
          } else if (customField.type === 'dropdown') {
            option.inputType = 'select'
            option.data = []
            for (let key in customField.choices) {
              option.data.push({ label: customField.choices[key], value: key })
            }
          } else if (customField.type === 'checkbox' || customField.type === 'radio') {
            option.inputType = customField.type
            option.data = []
            for (let key in customField.choices) {
              option.data.push({ label: customField.choices[key], value: key })
            }
          } else {
            option.inputType = customField.type
          }

          optionsCustomFields.push(option)
          if (customField.type === 'checkbox') {
            customForm[customField._id] = []
          } else {
            customForm[customField._id] = ''
          }

          if (customField.required === 'required') {
            let rule = [{ required: true, message: this.$t('public.pleaseInput') + customField.name, trigger: 'blur' }]
            if (customField.type === 'checkbox') {
              rule[0].type = 'array'
              rule[0].trigger = 'change'
            }
            if (customField.type === 'date') {
              rule[0].type = 'date'
              rule[0].trigger = 'change'
              dateIdArr.push(customField._id)
            }
            if (customField.type === 'dropdown' || customField.type === 'radio') {
              rule[0].trigger = 'change'
            }
            this.$set(this.rules, customField._id, rule)
          }
          if (customField.type === 'number') {
            let numberRule = { validator: validateNumber, message: customField.name + this.$t('customer.shouldBeNumber'), tigger: 'blur' }
            if (this.rules[customField._id]) {
              this.rules[customField._id].push(numberRule)
            } else {
              this.$set(this.rules, customField._id, [numberRule])
            }
          }
          // (!this.custInfo || this.custInfo[customField._id]) 把该语句修改为 this.custInfo[customField._id]
          if (this.editCustType === 'update' && customField.noupdate === true && this.custInfo[customField._id]) {
            this.$set(this.noUpdate, customField._id, true)
          }
          if (this.noUpdate[customField._id] && Array.isArray(this.custInfo[customField._id]) && this.custInfo[customField._id].length === 0) {
            this.$set(this.noUpdate, customField._id, false)
          }
        })

        // form初始值
        for (let key in customForm) {
          if (this.custInfo && this.custInfo[key]) {
            customForm[key] = deepClone(this.custInfo[key])
            if (key === 'phone' && this.custInfo[key].length !== 0) {
              if (this.isHideTel) {
                let phone = deepClone(this.custInfo[key])
                this[key] = phone.map(obj => {
                  obj.realTel = obj.tel
                  obj.tempTel = obj.tel
                  obj.tel = this.hideTel(obj.tel)
                  return obj
                })
              } else {
                this[key] = deepClone(this.custInfo[key])
              }
            }
            if (key === 'email' || key === 'weixin' || key === 'attachs') {
              if (this.custInfo[key].length !== 0) {
                this[key] = deepClone(this.custInfo[key])
              }
            }
            if (dateIdArr.length > 0 && this.dateIdArr.indexOf(key) !== -1) {
              customForm[key] = new Date(this.custInfo[key])
            }
          }
        }
        this.form = customForm
        this.dateIdArr = dateIdArr
        this.optionsCustomFields = optionsCustomFields
        this.loading = false
      })
    }
  }
  function generateUploadResourceKey (store) {
    let date = getCurrentDate()
    let today = new Date()
    let time = today.getTime()
    let key = store.state.session.user.account + '/customer/' + date + '/' + time + '/' + uuid.v1()
    return key
  }
  function validatePhone (rule, value, callback) {
    if (!value || value.length === 0 || !value[0].tel) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  }
  function validateWeixin (rule, value, callback) {
    if (!value || value.length === 0 || !value[0].num) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  }
  function validateEmail (rule, value, callback) {
    if (!value || value.length === 0 || !value[0].email) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  }
  function validateNumber (rule, value, callback) {
    if (value && /^[\d]+\.?\d*$/.test(value)) {
      callback()
    } else {
      callback(new Error(rule.message))
    }
  }
</script>
<style lang="stylus" scoped>
  .el-button--primary
    width 60px
    height 24px
    padding 0
  .el-form-item
    margin-bottom 10px
  .add
    overflow-x hidden
    padding-top 15px
    height calc(100% - 60px)
    box-sizing border-box
    .el-checkbox-group
      .el-checkbox
        margin-right 10px
    .is-merge
      padding  0 10px 0 0
  .el-form
    padding 0 50px
    margin-bottom 20px
    .save
      background #1abb9c
      width 88px
      border none
      height 30px
      font-size 14px
      float right
  .push
    font-size 18px
    color #1abb9c
    display inline-block
    font-weight 700
    margin-top 25px
    cursor pointer
  .del
    color red
    margin-top 8px
  .el-form .save.addBlackList
    margin-right 20px
    background #7bcdd2
  .call-screen-add,.show-callback-add
    max-height 400px
  .el-checkbox-group
  .el-radio-group
    white-space normal
    .el-checkbox
      margin -10px 0 0 0
      height 28px
</style>
