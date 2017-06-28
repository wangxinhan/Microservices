<template>
<div :class="['merge', isDailog ? 'merge-dailog' : '', custType==='call'?'merge-call__dailog':'', searchShow ? '':'merge-serach__dailog', jumpMerge ? 'merge-serach__dailog':'']" v-if="!loading">
  <div class="sear" v-if="searchShow">
    <div class="search">
      <el-input size="small" :placeholder="$t('public.pleaseEnter')" v-model.trim="input" @keyup.native.enter="getSearchWord" icon="search" @click="getSearchWord">
        <el-select size="small" v-model.trim="select.searchType" slot="prepend" :placeholder="$t('public.pleasePick')" >
          <el-option label="名称" value="displayName"></el-option>
          <el-option label="电话" value="phone"></el-option>
          <el-option label="邮箱" value="email"></el-option>
          <el-option label="微信" value="weixin"></el-option>
        </el-select>
      </el-input>
    </div>

    <span
      class="page"
      v-if="count>1">
        <span class="result" v-if="count>0">共{{count}}条记录 | </span>
        {{trunPage}}/{{Math.ceil(count/10)}}
         <el-button
                :disabled="!isPre"
                type='text'
                @click="trunPages('pre')">
                &lt;
         </el-button>
         <el-button
            :disabled="!isNext"
            type='text'
            @click="trunPages('next')">
            &gt;
          </el-button>
    </span>
  </div>
  <div class="tip" v-if="isresult === false">
    <p>请输入条件进行搜索</p>
  </div>
  <div v-if="isresult===true && !loading" v-loading="tableData.length<0">
    <el-table :data="tableData"
    highlight-current-row
    stripe>
        <el-table-column
        v-if = "tableData.length>0"
        width="55">
          <template scope="scope">
            <el-radio size="small" class="radio"  @click.native.prevent="getRow(scope.$index, tableData)" v-model.trim="radio" :label="scope.$index">{{labelBlank}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="客户名">
        </el-table-column>
        <el-table-column prop="phone" label="电话">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" >
        </el-table-column>
    </el-table>
  </div>
  <span class="wrapper">
    <el-button v-if="!searchShow" @click.native.stop="closeDialog">取消</el-button>
    <el-button class="save-btn" @click.native.prevent="submit">保存</el-button>
  </span>
</div>
</template>
<script>
  import { isEmpty } from 'lodash'
  import * as types from '../../../store/modules/webchat/mutation-types.js'
  export default {
    name: 'Merge',
    data () {
      return {
        radio: -1,
        trunPage: 1,
        loading: true,
        isresult: true,
        isShowHearder: false,
        tableData: [],
        custType: '', // 判断业务类型
        multipleSelection: [],
        input: '',
        mergeCustomer: null,
        count: 0,
        labelBlank: ''
      }
    },
    props: {
      custInfo: Object,
      isDailog: Boolean,
      isDalog: Boolean,
      jumpMerge: Boolean,
      select: {
        type: Object,
        default: function () {
          return {
            searchType: 'displayName',
            searchWord: ''
          }
        }
      },
      bindCustomer: {
        type: Object,
        default: function () {
          return {
            searchShow: true,
            custObj: null,
            form: null
          }
        }
      }
    },
    computed: {
      tableCust () {
        if (this.bindCustomer) {
          return this.bindCustomer.custObj
        }
      },
      isPre () {
        return this.trunPage > 1
      },
      isNext () {
        return this.trunPage < this.count / 10
      },
      searchShow () {
        if (!this.bindCustomer) {
          return true
        } else {
          return this.bindCustomer.searchShow
        }
      }
    },
    methods: {
      submit () {
        if (this.mergeCustomer) {
          this.$store.dispatch('queryCustomerInfo', { _id: this.mergeCustomer._id }).then(customer => {
            this.mergeCustomer.custInfo = customer
            this.$emit('change-merge', this.mergeCustomer)
          })
        } else {
          this.$message({
            message: '请选择客户',
            type: 'warning'
          })
        }
      },
      closeDialog () {
        this.$emit('closeDialog')
      },
      getRow (index, rows) {
        this.radio = +index
        this.mergeCustomer = rows[index]
      },
      getSearchWord (page) {
        if (isNaN(page)) page = 1
        let form = {
          field: this.select.searchType,
          combox: this.input,
          page: page,
          limit: 10
        }
        this.getData(form)
      },
      getData (form) {
        this.$store.dispatch('queryCustomerByPopup', form).then(val => {
          this.$set(this, 'radio', -1)
          this.$set(this, 'mergeCustomer', null)
          this.renderData(val)
        })
      },
      trunPages (pageTag) {
        if (pageTag === 'pre') {
          if (this.trunPage > 1) {
            this.trunPage = this.trunPage - 1
            this.getSearchWord(this.trunPage)
          }
        } else {
          if (this.trunPage < this.count / 10) {
            this.trunPage = +this.trunPage + 1
            this.getSearchWord(this.trunPage)
          }
        }
      },
      renderData (val) {
        this.loading = true
        this.count = val.count
        if (this.custType === 'webchat') {
          val.count = this.count
          let info = {
            autoCustName: this.$store.state.webchat.autoCust[this.$route.path.split('/')[4]].autoCustName,
            autoCustPhone: this.$store.state.webchat.autoCust[this.$route.path.split('/')[4]].autoCustPhone,
            autoCustObj: val,
            autoCustLength: val.list.length || 0
          }
          this.$store.commit(types.AUTO_CUST_INFO, {sessionId: this.$route.path.split('/')[4], data: info})
        }
        this.tableData = val.list.map(table => {
          let phone = table.phone && table.phone.map(va => {
            return va.tel
          }) + ''
          let email = table.email && table.email.map(v => {
            return v.email
          }) + ''
          return {
            _id: table._id,
            name: table.name,
            phone: phone,
            custInfo: table,
            email: email
          }
        })
        this.loading = false
      }
    },
    watch: {
      isDalog (cur, pre) {
        if (cur) {
          initTable(this)
        } else {
          this.$set(this, 'tableData', [])
          this.$set(this, 'count', 0)
          this.$set(this, 'input', '')
          this.$set(this, 'radio', -1)
          this.$set(this, 'mergeCustomer', null)
          this.select && this.$set(this.select, 'searchType', 'displayName')
          this.bindCustomer && this.$set(this.bindCustomer, 'form', {})
        }
      }
    },
    beforeMount () {
      this.loading = true
      initTable(this)
      this.loading = false
    }
  }
  function initTable (vm) {
    let bc = vm.bindCustomer
    if (bc && !isEmpty(bc.form)) {
      vm.custType = 'webchat'
      if (bc.form.custType === 'call') {
        vm.custType = bc.custType
        delete bc.custType
      }
      vm.$set(vm, 'input', bc.form.combox)
      vm.$set(vm.select, 'searchType', bc.form.field)
      vm.getData(bc.form)
    }

    if (vm.$route.path.split('/')[3] === 'cdr_call') {
      vm.$set(vm, 'input', vm.$route.path.split('/')[5])
      vm.$set(vm.select, 'searchType', 'phone')
      vm.getSearchWord(1)
    }
    if (bc && !isEmpty(bc.custObj)) {
      vm.renderData(bc.custObj)
    }
  }
</script>
<style lang="stylus" scoped>
  .merge
    overflow-y auto
    height 85%
    padding 30px 30px 0 30px
    .tip
      border 1px solid #ddd
      border-top none
      background #fafafa
      height 74px
      line-height 74px
      text-align center
      color #ddd
    h4
      color #ddd
      font-size 14px
      margin-bottom 16px
      font-weight normal
    .sear
      display flex
      justify-content space-between
      align-items center
      height 48px
      border 1px solid #ddd
      span
        display inline-block
      .page
        color #ddd
        margin-right 16px
      .search
        width 300px
        display inline-block
        margin-left 16px
        .el-select
          width 86px
          margin-left 2px
  .wrapper
    margin-top 14px
    display block
    float right
  .cancel,.save-btn
    border 1px solid #7bcdd2
    color #fff
  .save-btn
    background #1abb9c
  // 取消按钮为浅蓝色 ，现在统一风格暂时使用白色
  // .cancel
  //   background #7bcdd2
  .merge-dailog
    height 388px
  .merge-call__dailog
    height 90%
  .merge-serach__dailog
    height 320px
</style>
