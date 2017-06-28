<template>
   <div class="contact-paln" v-loading="loading" v-if="refresh==='plan'&&!loading">
      <affix :label="$t('customer.contactPlan.finishedContactPlan')" class="create-cp" v-show="isFinishedPlanShow">
        <div :class="['plan', 'create-cp', isFinishedPlanShow?'create-cp__finish':'']">
           <span class="fini">{{ planTime }}</span>
           <div class="con">
              <p class="deal">{{ planContent }}</p>
              <span @click.stop="cancelDeal">{{ $t('public.cancel') }}</span>
            </div>
        </div>
      </affix>
      <affix :label="editTitle" class="create-cp" v-if="isEditShow">
        <el-form label-position="top" :model="formStacked" class="demo-form-stacked" :rules="rules" ref="formStacked">
          <el-form-item :label="$t('customer.contactPlan.contactPlanContent')" prop="contactContent">
            <el-input size="small" v-model.trim="formStacked.contactContent"></el-input>
          </el-form-item>
          <el-form-item :label="$t('customer.contactPlan.contactPlanTime')" prop="region">
             <el-date-picker size="small"
              v-model.trim="formStacked.region"
              type="datetime"
              :editable="boolean"
              :picker-options="pickerOptions"
              :format="'yyyy-MM-dd HH:mm'"
              :placeholder="$t('public.pickTime')"
              :disabledDate="disabledDate"
              align="left"
              style="width:350px">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click.stop="submitForm" v-if="editType === 'add'">{{ $t('public.save') }}</el-button>
        <el-button type="success" @click.stop="update" v-if="editType === 'edit'">{{ $t('public.update') }}</el-button>
      </affix>
      <affix :label="title" class="create-cp" v-show="isCurrentPlanShow">
        <div :class="['plan', 'create-cp', isCurrentPlanShow?'create-cp__finish':'']">
          <strong @click.stop="deal">
            <el-tooltip class="item" :content="$t('customer.contactPlan.donePlan')" placement="bottom">
              <i class="iconfont icon-wancheng"></i>
            </el-tooltip>
          </strong>
           <span class="time">{{ planTime }}</span>
           <div class="con"><p>{{ planContent }}</p><span @click.stop="edit">{{ $t('public.edit2') }}</span></div>
        </div>
      </affix>
      <affix :label="$t('customer.contactPlan.contactPlanHistory')" class="history-cp">
        <ul class="h-cp-content">
          <time-line :isFirst="index === 0 && item.status === '0'" v-for="(item, index) in linkPlan">
            {{item.createTime.split(' ')[1].substring(0,5)  }}<span  class="date">{{item.createTime.split(' ')[0]}}</span> <span  class="name1"><agent :id="item.userId" :isNum="false"></agent> </span><span class="plan_content">{{item.remark}}</span>
          </time-line>
        </ul>
        <el-row v-if="isLoadMoreShow">
          <el-col class="next-page">
            <div class="btn" @click.stop="loadMore"><i class="iconfont icon-shuaxin"><span>{{$t('public.loadMore')}}</span></i></div>
          </el-col>
        </el-row>
      </affix>
   </div>
</template>
<script>
  import Affix from '../../../ui-modules/affix/Affix.vue'
  import TimeLine from '../../../ui-modules/timeLine/TimeLine.vue'
  import Agent from '../../cache/Agent.vue'
  function getLinkPlan (store, data) {
//    let data = {
//      customerId: id
//    }
    return store.dispatch('queryCustomerContactPlanHistory', data)
  }
  function getAfterDate (num) {
    let date = new Date()
    date.setHours(9)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    date.setDate(date.getDate() + num)
    return date
  }
  export default {
    name: 'ContactPlan',
    data () {
      return {
        loading: true,
        lcaFre: 'plan',
        formStacked: {
          contactContent: '',
          region: ''
        },
        boolean: false,
        rules: {
          contactContent: [
            { required: true, message: this.$t('customer.contactPlan.pleaseEnterContactPlanContent'), trigger: 'blur' }
          ],
          region: [
            { required: true, type: 'date', message: this.$t('customer.contactPlan.pleasePickTime'), trigger: 'change' }
          ]
        },
        isLoadMoreShow: false,
        linkPlan: [],
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() + 86400000 < Date.now()
          },
          shortcuts: [{
            text: this.$t('public.afterHalfHour'),
            onClick (picker) {
              let date = new Date()
              date.setMinutes(date.getMinutes() + 30)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.afterOneHour'),
            onClick (picker) {
              let date = new Date()
              date.setHours(date.getHours() + 1)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.tomorrow'),
            onClick (picker) {
              let date = getAfterDate(1)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.afterTomorrow'),
            onClick (picker) {
              let date = getAfterDate(2)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.after3Days'),
            onClick (picker) {
              let date = getAfterDate(3)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.after14Days'),
            onClick (picker) {
              let date = getAfterDate(14)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('public.after30Days'),
            onClick (picker) {
              let date = getAfterDate(30)
              picker.$emit('pick', date)
            }
          }]
        },
        accountId: '',
        userId: '',
        data: {
          userId: '',
          remark: '',
          notifyTime: '',
          customerId: null,
          _id: ''
        },
        isShow: true,
        currentPlan: null,
        finishedPlan: null,
        title: this.$t('public.contactPlan'),
        isFinishedPlanShow: false,
        isEditShow: true,
        isCurrentPlanShow: false,
        editType: 'add',
        actionData: {
          customerId: this.cid,
          page: 1,
          limit: 20
        }
      }
    },
    computed: {
      planContent () {
        return this.currentPlan ? this.currentPlan.remark : ''
      },
      planTime () {
        return this.currentPlan ? this.currentPlan.notifyTime : ''
      }
    },
    methods: {
      getFormatDateTime (date) {
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDate()
        let hour = date.getHours()
        let minites = date.getMinutes()
        month = month + 1 > 9 ? month + 1 : '0' + (month + 1)
        day = day > 9 ? day : '0' + day
        hour = hour > 9 ? hour : '0' + hour
        minites = minites > 9 ? minites : '0' + minites
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minites
      },
      fetchData () {
//        this.loading = true
        getLinkPlan(this.$store, this.actionData).then(res => {
          this.linkPlan = this.linkPlan.concat(res.list)
          if (res.list.length < 20) {
            this.isLoadMoreShow = false
          } else {
            this.isLoadMoreShow = true
          }
          if (res.list.length > 0 && res.list[0].status === '0') {
            this.currentPlan = res.list[0]
            this.isEditShow = false
            this.isCurrentPlanShow = true
            this.formStacked.contactContent = this.planContent
            this.formStacked.region = new Date(this.planTime)
          } else {
            this.isEditShow = true
            this.isCurrentPlanShow = false
            this.isShow = true
            this.formStacked.contactContent = ''
            this.formStacked.region = ''
            this.editTitle = this.$t('customer.contactPlan.newContactPlan')
          }
          this.loading = false
        })
      },
      loadMore () {
        this.actionData.page++
        this.fetchData()
      },
      submitForm (ev) {
        this.$refs.formStacked.validate((valid) => {
          if (valid) {
            let remark = this.formStacked.contactContent
            let time = this.formStacked.region
            let notifyTime = this.getFormatDateTime(time)
            let data = {
              accountId: this.accountId,
              userId: this.userId,
              remark,
              notifyTime,
              customerId: this.cid
            }
            if (remark.length > 140) {
              this.$message.error('不能超过140个字符')
            }
            this.$store.dispatch('addCustomerContactPlan', data).then(resp => {
              this.linkPlan = resp.list
              this.currentPlan = resp.list[0]
              this.isCurrentPlanShow = true
              this.isEditShow = false
              this.isFinishedPlanShow = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      edit () {
        this.isCurrentPlanShow = false
        this.isEditShow = true
        this.editType = 'edit'
        this.editTitle = this.$t('public.contactPlan')
      },
      update () {
        this.$refs.formStacked.validate((valid) => {
          if (valid) {
            let remark = this.formStacked.contactContent
            let time = this.formStacked.region
            let notifyTime = this.getFormatDateTime(time)
            let data = {
              _id: this.currentPlan._id,
              accountId: this.accountId,
              userId: this.userId,
              remark,
              notifyTime,
              customerId: this.cid
            }
            if (remark.length > 140) {
              this.$message.error('不能超过140个字符')
              return
            }
            this.$store.dispatch('updateCustomerContactPlan', data).then(resp => {
              this.linkPlan = this.linkPlan.map(plan => {
                if (plan._id === data._id) {
                  plan.remark = data.remark
                  plan.notifyTime = data.notifyTime
                }
                return plan
              })
              this.currentPlan = this.linkPlan[0]
              this.isCurrentPlanShow = true
              this.isEditShow = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      deal () {
        let data = {
          _id: this.cid,
          actionId: this.currentPlan._id,
          notifyTime: '',
          action: '',
          status: '1'
        }
        this.$store.dispatch('dealCustomerContactPlan', data).then(resp => {
          this.linkPlan = resp.list
          this.isFinishedPlanShow = true
          this.isEditShow = true
          this.isCurrentPlanShow = false
          this.formStacked.contactContent = ''
          this.formStacked.region = ''
          this.editType = 'add'
          this.editTitle = this.$t('customer.contactPlan.nextContactPlan')
        })
      },
      cancelDeal () {
        let data = {
          _id: this.cid,
          actionId: this.currentPlan._id,
          notifyTime: this.planTime,
          action: this.planContent,
          status: '0'
        }
        this.$store.dispatch('dealCustomerContactPlan', data).then(resp => {
          this.linkPlan = resp.list
          this.isFinishedPlanShow = false
          this.isEditShow = false
          this.isCurrentPlanShow = true
        })
      }
    },
    props: {
      cid: String,
      refresh: String
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'plan') {
          this.actionData.page = 1
          this.linkPlan = []
          this.loading = true
          this.fetchData()
        }
      }
    },
    components: {
      Affix,
      TimeLine,
      Agent
    },
    beforeMount () {
      this.accountId = this.$store.state.session.user.account
      this.userId = this.$store.state.session.user._id
      if (this.refresh === 'plan' && this.cid) {
        this.loading = true
        this.fetchData()
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '../../../../assets/common.styl'
.contact-paln
  .plan
    .con
      display flex
      p
        flex 1
        font-size 12px
        color $cf-gray0
        margin 0 0 0 28px
        font-size 12px
        vertical-align top
      .deal
        text-decoration line-through
        margin-left 0
        color $cf-gray4
      span
        color $c-main
        width 120px
        text-align right
        font-size 12px
        cursor pointer
    .time
      line-height 20px
      text-align center
      display inline-block
      margin-left 3px
      color $cf-gray4
    .fini
      color $cf-gray5
    strong
      display inline-block
      width 22px
      height 22px
      position relative
      top 7px
      cursor pointer
      .iconfont
        font-size 18px
        color #4fccae
  .create-cp
    margin-bottom 30px
    .el-form-item
      color #c1c1c1
      margin-bottom 12px
      &:last-child
        margin-bottom 0px
    .el-button
      width 90px
      float right
      padding 7px 0
      font-size 12px
      background-color #1abb9c
      border 1px solid #1abb9c
  .history-cp
    .h-cp-content
      &:before
        content ""
        clear both
      li
        margin-top 12px
        color #666
        display flex
        .name1
          color #75ced6
          margin 0 10px
        .date
          margin 0 12px
        .plan_content
          display inline-block
          flex 1
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          vertical-align top
      .first
        margin-top 0
  .btn
    cursor pointer
    margin 0 auto
    width 130px
    color #fff
    text-align center
    background-color #1ebc9b
    line-height 30px
    height 30px
    border-radius 5px
    .icon-shuaxin
      display inline-block
      span
        font-size 12px
        float right
        padding-left 5px
  .next-page
    margin-top 20px
  .create-cp__finish
    margin-bottom 0
</style>
