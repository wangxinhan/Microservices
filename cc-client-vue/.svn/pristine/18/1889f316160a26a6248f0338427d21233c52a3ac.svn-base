<template>
  <div  class="bus-card" v-if="!cardloading">
    <el-menu
      @select="handleSelect"
      :router="active"
      class="el-menu-vertical-demo">
      <el-menu-item class="card" style="padding:0 10px" v-for="(item, index) in cardListRender" :index="handleSplit(item._id, item.customer)" :class="{'is-active': $route.path.split('/')[4] === item._id}">
        <!--<div class="card">-->
          <label class="fake-checkbox" :class="{'visible': batch.isBatchShow}" v-on:click.stop="">
            <input type="checkbox" :value="item._id" v-model.trim="item.checked" @change="checkThis(item.checked)">
            <span></span>
            <i class="fake-label"></i>
          </label>
      <span class="icon">
        <customer-avatar
          :status="item.cust_status"
          :size="20"
          :isRead="item.isRead"
          :type="tabType"
          >
        </customer-avatar>
      </span>
          <div class="call">
            <p :class="{ deleteCus: item.noName }">{{item.noName ? $t('business.hasRemoveCus'): item.name}}</p>
            <div class="status">
              <span class="name">{{ item.agentBefore }}</span>
              <span class="el-icon-more">></span>
              <span class="receive" v-if="tabType !== 'business_undeal'">{{item.agentAfter}}</span>
              <a  href="javascript:;" class="receive tasktome" v-if="tabType === 'business_undeal'" @click.stop="setTaskToMe(item._id)">{{$t('business.received')}}</a>
            </div>
          </div>
          <div class="time">
            <p>{{ item.createTime.split(' ')[0] }}</p>
            <span class="b-type">{{item.businessType}}</span>
            <span :class="item.businessStep.type" class="res">{{ item.businessStep.name }}</span>
          </div>
        <!--</div>-->
      </el-menu-item>
    </el-menu>
    <no-record v-if="cardListRender && cardListRender.length<=0"></no-record>
    <!-- 批处理-->
    <div class="batch_cover" v-show="batch.isBatchShow"></div>
    <div class="batch_btm" v-show="batch.isBatchShow"></div>
    <div class="batch" :class="{'show': batch.isBatchShow}">
      <el-checkbox v-model.trim="batch.allChecked" @change="checkAll()">{{$t('public.checkAll')}}</el-checkbox>
      <card-batch v-if="batch.operator"
                  :tabType="tabType"
                  :batchOperator="batch"
                  @exportExcel="exportExcel"
                  @deleteTip="deleteTip"
                  @checkNone="checkNone"
        ></card-batch>
    </div>
  </div>
</template>
<script>
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import CardBatch from 'components/public-modules/card/CardBatch'
  import NoRecord from 'components/public-modules/card/NoRecord'
  import * as gtypes from '../../../store/mutation-types'
  import { isHasFunc } from '../../../utils/m7Utils.js'
  export default {
    name: 'BusinessCard',
    /**
     * [props 该组件所需要的参数]
     * @type {
     *   cardList    相关业务的crad数组
     *   type        业务类型
     *   count       卡片条数
     * }
     */
    props: {
      cardList: Array,
      type: String,
      tabType: String,
      loading: Boolean,
      condition: Object,
      clearChecked: String
    },
    data () {
      return {
        active: true, // 是否使用路由
        cardloading: true,
        batch: {
          batchItem: [],
          allChecked: false,
          isBatchShow: false,
          checkedCount: 0,
          operator: [
          ]
        },
        checked: false,
        finish: 'b-step',
        noName: false
      }
    },
    computed: {
      cardListRender () {
        for (let i = 0; i < this.cardList.length; i++) {
          let item = this.cardList[i]
          item.noName = this.name(item.name)
          item.businessType = this.businessType(item.flow)
          item.agentAfter = this.agentAfter(item.master)
          item.agentBefore = this.agentBefore(item.createUser)
          item.businessStep = this.businessStep(item.flow, item.status, item.step)
        }
        return this.cardList
      }
    },
    methods: {
      setTaskToMe (id) {
        this.$store.dispatch('setTaskToMe', id).then(() => {
          this.$store.dispatch('refreshUndealNum')
          this.$store.commit('business/REFRESH_LEFT', Math.random())
          this.$router.push({path: '/index/business'})
        })
      },
      businessType (flow) {
        let businessFlows = this.$store.state.session.dicMap.businessFlow
        if (!businessFlows) {
          return ''
        }
        for (let i = 0; i < businessFlows.length; i++) {
          if (businessFlows[i]._id === flow) {
            return businessFlows[i].name
          }
        }
      },
      businessStep (flowId, status, step) {
        let businessStep = {name: '', type: ''}
        let businessFlows = this.$store.state.session.dicMap.businessFlow
        if (!businessFlows) {
          return businessStep
        }
        let flow = null
        for (let i = 0; i < businessFlows.length; i++) {
          if (businessFlows[i]._id === flowId) {
            flow = businessFlows[i]
          }
        }
        if (status !== 'complete' && status !== 'cancel') {
          businessStep.type = 'b-step'
        } else {
          businessStep.type = 'finish'
        }
        let steps = flow ? flow.steps : []
        for (let i = 0; i < steps.length; i++) {
          var stepsItem = steps[i]
          if (stepsItem._id === step) {
            businessStep.name = stepsItem.name
          }
        }
        return businessStep
      },
      agentAfter (master) {
        let agent = this.$store.state.session.dicMap.agents
        if (!agent) {
          return ''
        }
        for (let i = 0; i < agent.length; i++) {
          if (agent[i]._id === master) {
            return agent[i].displayName
          }
        }
        if (this.tabType === 'business_all') {
          return ''
        }
      },
      agentBefore (createUser) {
        let agent = this.$store.state.session.dicMap.agents
        if (!agent) {
          return ''
        }
        for (let i = 0; i < agent.length; i++) {
          if (agent[i]._id === createUser) {
            return agent[i].displayName
          }
        }
      },
      name (name) {
        let noName
        if (!name) {
          noName = true
        } else {
          noName = false
        }
        return noName
      },
      // 按照 卡片的_id不同设置不同路由
      handleSplit (index, customerId) {
        return '/index/' + this.type + '/' + this.tabType + '/' + index + '/' + (customerId || 'no-customer')
      },
      handleSelect (index) {
        this.$store.commit('business/REFRESH_BUS_RIGHT', Math.random())
        if (this.tabType === 'business_my') {
          this.$store.dispatch('readBusiness', {_id: index.split('/')[4]}).then(() => {
            this.$store.dispatch('refreshUndealNum')
          })
          this.$store.commit('business/CHANGE_READ_STATUS', index.split('/')[4])
        }
        this.$emit('changeCardItem')
      },
      getChecked () { // 单选获取数组
        return this.cardList.filter(item => item.checked).map(item => item._id)
      },
      checkThis (checked, event) { // 单个选中传送数组和展示批量
        let checkedArr = this.getChecked()
        let isBatchShow = checkedArr.length > 0
        this.batch.allChecked = checkedArr.length === this.$store.state.business.businessList.count
        this.batch.batchItem = checkedArr
        this.batch.isBatchShow = isBatchShow
        this.batch.checkedCount = checkedArr.length
      },
      checkAll () { // 全选&取消全选
        this.batch.isBatchShow = this.batch.allChecked
        this.cardList.forEach((item) => {
          item.checked = this.batch.allChecked
        })
        this.batch.checkedCount = this.batch.allChecked ? this.$store.state.business.businessList.count : 0
      },
      checkNone (self) {
        let that
        if (self && self.$refs) {
          that = self
        } else {
          that = this
        }
        that.batch.allChecked = false
        that.batch.batchItem = []
        that.batch.isBatchShow = false
        that.cardList.forEach((item) => {
          item.checked = false
        })
      },
      exportExcel () {
        // 高级搜索条件
        let data = {}
        if (this.batch.allChecked) {
          data = this.$store.state.business.businessCondition
        } else {
          data = {_id: {$in: this.batch.batchItem}}
          data.flow = this.condition.flow
        }
        if (!data.flow) {
          this.$store.commit(gtypes.SET_ERROR, 'business.exportErrorMsg')
        } else {
          this.$store.dispatch('exportBusiness', data).then(() => {
            this.checkNone()
          })
        }
      },
      deleteTip () {
        let self = this
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.deleteBus(self)
        }).catch(() => {
        })
      },
      deleteBus (self) {
        let data = {}
        if (self.batch.allChecked) {
          data = this.$store.state.business.businessCondition
//          if (!data.flow) {
//            self.$store.commit(gtypes.SET_ERROR, 'business.exportErrorMsg')
//            return
//          }
        } else {
          data = {_id: {$in: self.batch.batchItem}}
          data.flow = self.condition.flow
        }
//        if (!data.flow) {
//          self.$store.commit(gtypes.SET_ERROR, 'business.exportErrorMsg')
//        } else {
        self.$store.dispatch('deleteBusiness', data).then(() => {
          self.$router.replace({path: '/index/business/'})
          self.$store.commit('business/REFRESH_LEFT', Math.random())
          self.$store.dispatch('refreshUndealNum')
          self.checkNone(self)
        })
//        }
      },
      transferData (condition) {
        let data = {}
        for (let j in condition) {
          if (j === 'custom') {
            for (let i in condition.custom) {
              if (condition.custom[i] && condition.custom[i].length > 0) {
                data[i] = condition.custom[i]
              }
            }
          } else if (condition[j] && condition[j].length > 0) {
            data[j] = condition[j]
          }
        }
        if (this.tabType === 'business_undeal') {
          data.master = ''
        }
        if (this.tabType === 'business_my') {
          data.master = this.$store.state.session.user._id
        }
        return data
      }
    },
    watch: {
      // clearChecked 变化 再次执行
      clearChecked: 'checkNone'
    },
    components: {
      CustomerAvatar,
      CardBatch,
      NoRecord
    },
    beforeMount () {
      let self = this
      Promise.all([this.$store.dispatch('getCache', {type: 'businessFlow'}), this.$store.dispatch('getCache', {type: 'agents'})]).then(function () {
        self.cardloading = false
      })
      if (isHasFunc('func_task_delete', this.$store.state.session.user)) {
        this.batch.operator.push({name: 'public.delete', class: 'iconfont icon-shanchu', action: 'deleteTip'})
      }
      if (isHasFunc('func_task_export', this.$store.state.session.user)) {
        this.batch.operator.push({name: 'public.export', class: 'icon-daochu1', action: 'exportExcel'})
      }
    }
  }
</script>
<style type="text/stylus" lang="stylus" scoped >
@import "../../../assets/common.styl"
.bus-card
  height 100%
.el-menu-item
  height auto
  line-height inherit
  padding 0
  background-color #fff
.is-active
  background-color red
.el-menu-item.is-active
  background-color #e8f5fc
.card:hover
.card:active
  background-color #e8f5fc
  label
    visibility visible
.el-checkbox
  visibility hidden
.e-ch-show
  visibility visible
label
  visibility hidden
label.visible
  visibility visible
.card
  width 100%
  box-sizing border-box
  padding 0 5px
  height 60px
  border-bottom 1px solid #efeef3
  display flex
  cursor pointer
  align-items center
  span
    display inline-block
  .icon
    flex 0 0 40px
    height 40px
    line-height: 40px;
    border-radius 50%
    position relative
    margin  0 10px 0 0
    i
      display inline-block
      width 22px
      height 22px
      position absolute
      top 30px
      left 26px
      background #0f0
  .call
    width 118px
    display inline-block
    font-size 0px
    p
      font-size 14px
      color #000
      width 180px
      @extend .ellipsis
      font-weight 500
    .deleteCus
      color #f00
      text-decoration line-through
    span
      display inline-block
      color $cf-gray4
      font-size 12px
      border-radius 3px
    .status
      margin-top 10px
      width 150px
      height 14px
      overflow hidden
      display flex
      span
        line-height 14px
        color $cf-gray3
      .name
        max-width 45px
        @extend .ellipsis
      .el-icon-more
        margin 0 5px
        font-weight bold
        line-height 14px
      .receive
        max-width 45px
        @extend .ellipsis
      .tasktome
        color #1abb9c
        font-weight bold
        display inline-block
        line-height 14px
        font-size 12px
        &:hover
          text-decoration: underline
  .time
    flex 4
    font-size 12px
    text-align right
    p
      margin-top 9px
      color $cf-gray4
      font-size 12px
    span
      line-height 14px
      padding 4px 0
      color #fff
      text-align center
      margin-top 5px
      border-radius 3px
    .res
      @extend .ellipsis
      width 56px
      padding 4px
    .b-type
      @extend .ellipsis
      width 56px
      padding 4px
      background #7bcdd2
      margin-right 8px
    .b-step
      background #f5a623
    .finish
      background #ccc
</style>
