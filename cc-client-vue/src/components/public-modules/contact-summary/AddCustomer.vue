<template>
<div>
  <i class="el-icon-plus" @click="addCustomer = true">新增客户</i>

  <el-dialog modal-append-to-body lock-scroll top="10%" title="新增客户" v-model.trim="addCustomer">
    <div class="edit">
    <el-form :model="custForms" ref="form" label-position="top">
  <el-row :gutter="20">
  <el-col :span="12"><div class="grid-content bg-purple">
    <el-form-item label="客户名称" prop="name">
      <el-input size="small" v-model.trim="custForms.name" class="a"></el-input>
      {{custForms.name}}
    </el-form-item>
  </div></el-col>
  <el-col :span="12"><div class="grid-content bg-purple">
    <el-form-item label="客户状态">
      <el-select size="small" v-model.trim="custForms.status" :placeholder="$t('public.pleasePick')">
        <el-option
          v-for="item2 in optionsStatus"
          :label="item2.label"
          :value="item2.value">
        </el-option>
      </el-select>
    </el-form-item>
  </div></el-col>
  </el-row>
  <el-row>
    <el-col :span="24"><div class="grid-content bg-purple">
      <el-form-item label="备注">
        <el-input size="small" v-model.trim="custForms.note"></el-input>
      </el-form-item>
    </div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item label="联系电话">
        <div v-for="phone in custForms.phone">
          <el-input size="small"
           v-model.trim="custForms.phone" :value="phone.tel"></el-input>
          {{phone.tel}}

        </div>
              </el-form-item>
    </div></el-col>
    <el-col :span="15"><div class="grid-content bg-purple">
      <el-form-item label="联系电话备注">
        <el-input size="small" v-for="phone in custForms.phone" v-model.trim="phone.memo"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="1"><div class="grid-content bg-purple">
        <span class="icon-zhankai iconfont push"></span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item label="邮箱">
        <el-input size="small"
          v-for="email in custForms.email" v-model.trim="email.email"
        ></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="15"><div class="grid-content bg-purple">
      <el-form-item label="邮箱备注">
        <el-input size="small"
          v-for="email in custForms.email" v-model.trim="email.memo"
        ></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="1"><div class="grid-content bg-purple">
        <span class="icon-zhankai iconfont push"></span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item label="微信">
        <el-input size="small"
          v-if="custForms.weixin && custForms.weixin.length === 0" v-model.trim="custForms.weixin"
        ></el-input>
        <el-input size="small"
          v-for="weixin in custForms.weixin" v-model.trim="weixin.weixin"
        ></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="15"><div class="grid-content bg-purple">
      <el-form-item label="微信备注">
        <el-input size="small"
          v-for="weixin in custForms.weixin" v-model.trim="weixin.memo"
        ></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="1"><div class="grid-content bg-purple">
        <span class="icon-zhankai iconfont push" @click="add"></span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20" v-for="(a,index) in weChat">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item>
        <el-input size="small"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="15"><div class="grid-content bg-purple">
      <el-form-item>
        <el-input size="small"></el-input>
      </el-form-item>
    </div></el-col>
    <el-col :span="1"><div class="grid-content bg-purple">
        <span class="push del" @click="del(index)">-</span>
    </div></el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item label="省">
        <el-select size="small" v-model.trim="value2" clearable placeholder="请选择" class="el-dropdown-link">
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value" class="el-dropdown-link">
          </el-option>
        </el-select>
      </el-form-item>
    </div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item label="市">
        <el-select size="small" v-model.trim="value1" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      </el-form-item>
    </div></el-col>
    <el-col :span="8"><div class="grid-content bg-purple">
      <el-form-item label="公司地址">
        <el-input size="small" placeholder="请输入地址 " v-model.trim="custForms.address"></el-input>
      </el-form-item>
    </div></el-col>
  </el-row>


      <el-row :gutter="20">
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-form-item label="备注">
            <el-input size="small" class="a"></el-input>
          </el-form-item>
        </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-form-item label="企业网址">
            <el-input size="small" v-model.trim="custForms.web"></el-input>
          </el-form-item>
        </div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-form-item label="数据来源">
            <el-select size="small" v-model.trim="custForms.custsource1" clearable placeholder="请选择">
              <el-option
                v-for="item in optionsSources"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-form-item label="归属">
            <el-select size="small" v-model.trim="custForms.owner" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-form-item label="附件(大小不超过10M)">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-form-item>
        </div></el-col>
      </el-row>
        <legend style="width: 475px;margin-bottom: 12px;font-size:12px;">自定义字段</legend>

          <el-form-item>
            <el-button type="primary" @click="submit" class="save">保存</el-button>
          </el-form-item>
    </el-form>
  </div>
  </el-dialog>
</div>
</template>
<script type="text/javascript">
  import {deepClone} from '../../../utils/m7Utils'
  export default{
    name: 'AddCustomerInfo',
    data () {
      return {
        loading: true,
        custForms: {attachs: [], owner: ''},
        addCustomer: false,
        form: {
          name: '',
          region: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入客户名称', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择客户状态', trigger: 'blur' }
          ]
        },
        optionsStatus: [],
        optionsSources: [],
        status: '',
        weChat: []
      }
    },
    props: {
      currentBusinessObj: Object
    },
    methods: {
      submit (ev) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 新增客户
            let reqData = deepClone(this.custForms)
            reqData.tabType = this.currentBusinessObj.tabType
            reqData.type = this.currentBusinessObj.type
            reqData.callId = this.currentBusinessObj.callId
            reqData.dealSrc = this.currentBusinessObj.dealSrc
            this.$store.dispatch('addCustomer', reqData).then(() => {
              this.$emit('addCustomerSuccess')
              this.addCustomer = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      add () {
        this.weChat.push(1)
      },
      del (index) {
        this.weChat.splice(index, 1)
      }
    },
    beforeMount () {
      Promise.all([
        this.$store.dispatch('getCache', { type: 'custCategorys' }),
        this.$store.dispatch('getCache', { type: 'custTmpls' }),
        this.$store.dispatch('getCache', { type: 'options', id: 'd7b9c68a-b50f-21d1-d5fd-41ea93f5f49c' })
      ]).then(([custCategorysCache, custTmpls, provinceCache]) => {
        let custTmpl = custTmpls[0]
        this.custForms.dbType = custTmpl._id
        let statuses = [{ label: this.$t('public.all'), value: '' }]
        for (let key in custTmpl.status) {
          statuses.push({ label: custTmpl.status[key], value: key })
        }
        let sources = [{ label: this.$t('public.all'), value: '' }, ...custTmpl.source.map(source => ({ label: source.name, value: source.key }))]
//        this.custForms = Object.assign({}, this.custForm)
        this.optionsStatus = statuses
        this.optionsSources = sources
        // 固定的显示字段
        let stableFields = custTmpl.stable_fields
        stableFields.forEach(ele => {
          if (ele.name === 'phone' || ele.name === 'weixin' || ele.name === 'email') {
            this.custForms[ele.name] = []
          } else {
            this.custForms[ele.name] = ''
          }
        })
        this.loading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
  legend
    display block
    width 100%
    padding 0
    margin-bottom 20px
    font-size 18px
    line-height 40px
    color #333333
    border 0
    border-bottom 1px solid #e5e5e5
  .text
    text-align center
  .iconfont
    font-size 14px
    color #1abb9c
  .edit
    left 20px
    overflow-y auto
    height calc(100vh - 112px)
    padding 30px 0 80px 0
  .el-form
    padding 0 50px
    margin-bottom 80px
    .save
      background #1abb9c
      width 110px
      border none
      height 36px
      font-size 14px
      margin-right 0
      position absolute
      right 0px
  .push
    font-size 24px
    color #1abb9c
    display inline-block
    margin-top 26px
  .del
    margin-top 4px
</style>
