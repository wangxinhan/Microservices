<template>
    <div class="card">
      <!--<el-checkbox @change="showAllCheckbox" :class="{'e-ch-show':showCard}" v-model="checked"></el-checkbox>-->
      <span class="icon">
        <customer-avatar
                :status="item.cust_status"
                :isRead="item.isRead"
                :size="20"
                :type="tabType"
        >
        </customer-avatar>
      </span>
      <div class="call">
        <p :class="{ deleteCus: noName }">{{name}}</p>
        <div class="status">
          <span class="name">{{ agentBefore }}
          </span>
          <span class="el-icon-more">></span>
          <span class="receive" v-if="tabType !== 'business_undeal'" @click="setTaskToMe">{{ agentAfter }}</span>
          <span class="receive tasktome" v-if="tabType === 'business_undeal'" @click="setTaskToMe">{{ agentAfter }}</span>
        </div>
      </div>
      <div class="time">
        <p>{{ item.createTime.split(' ')[0] }}</p>
        <span class="b-type">{{businessType}}</span>
        <span :class="finish" class="res">{{ businessStep }}</span>
      </div>
    </div>
</template>
<script type="text/javascript">
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  export default {
    name: 'business',
    props: {
      item: Object,
      tabType: String
    },
    components: {
      CustomerAvatar
    },
    data () {
      return {
        loading: true,
        checked: false,
        isCheckbox: false,
        finish: 'b-step',
        noName: false
      }
    },
    watch: {

    },
    computed: {
      showCard () {
        return this.$store.state.showCard
      },
      name () {
        let nameCus = this.item.name
        if (!nameCus) {
          nameCus = this.$t('business.hasRemoveCus')
          this.noName = true
        } else {
          this.noName = false
        }
        return nameCus
      },
      businessType () {
        let businessFlows = this.$store.state.session.dicMap.businessFlow
        if (!businessFlows) {
          return ''
        }
        for (let i = 0; i < businessFlows.length; i++) {
          if (businessFlows[i]._id === this.item.flow) {
            return businessFlows[i].name
          }
        }
      },
      businessStep () {
        let businessFlows = this.$store.state.session.dicMap.businessFlow
        if (!businessFlows) {
          return ''
        }
        let flow = null
        for (let i = 0; i < businessFlows.length; i++) {
          if (businessFlows[i]._id === this.item.flow) {
            flow = businessFlows[i]
          }
        }
        if (this.item.status !== 'complete') {
          this.finish = 'b-step'
        } else {
          this.finish = 'finish'
        }
        let steps = flow ? flow.steps : []
        for (let i = 0; i < steps.length; i++) {
          var stepsItem = steps[i]
          if (stepsItem._id === this.item.step) {
            return stepsItem.name
          }
        }
        return this.item.step
      },
      agentBefore () {
        let agent = this.$store.state.session.dicMap.agents
        if (!agent) {
          return ''
        }
        for (let i = 0; i < agent.length; i++) {
          if (agent[i]._id === this.item.createUser) {
            return agent[i].displayName
          }
        }
      },
      agentAfter () {
        let agent = this.$store.state.session.dicMap.agents
        if (!agent) {
          return ''
        }
        for (let i = 0; i < agent.length; i++) {
          if (agent[i]._id === this.item.master) {
            return agent[i].displayName
          }
        }
        if (this.tabType === 'business_all') {
          return ''
        }
        if (this.tabType === 'business_undeal') {
          return this.$t('business.received')
        }
      }
    },
    methods: {
      setTaskToMe () {
        this.$store.dispatch('setTaskToMe', this.item._id)
        this.$store.dispatch('refreshUndealNum')
      }
    }

  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl";
  .card:hover
    >.el-checkbox
      visibility visible
  .el-checkbox
      visibility hidden
  .e-ch-show
      visibility visible
  .card
    width 100%
    box-sizing border-box
    padding 0 10px
    height 76px
    border-bottom 1px solid #efeef3
    display flex
    cursor pointer
    align-items center
    span
      display inline-block
    .icon
      flex 0 0 46px
      height 46px
      line-height: 46px;
      border-radius 50%
      position relative
      margin  0 16px 0 10px
      i
        display inline-block
        width 22px
        height 22px
        position absolute
        top 30px
        left 26px
        background #0f0
    .call
      width 155px
      display inline-block
      font-size 0px
      p
        font-size 14px
        color #999
        font-weight 500
      .deleteCus
        color #f00
        text-decoration line-through
      span
        display inline-block
        color #999
        font-size 14px
        border-radius 3px
      .status
        margin-top 10px
        width 150px
        overflow hidden
        display flex
        .name
          width 60px
          @extend .ellipsis
        .el-icon-more
          margin-left 8px
          font-weight bold
        .receive
          width 60px
          @extend .ellipsis
        .tasktome
          color #1abb9c
          font-weight bold
    .time
      flex 4
      font-size 14px
      text-align right
      p
        margin-top 4px
        color #b8b8b8
        font-size 12px
      span
        line-height 14px
        padding 4px 0
        color #fff
        text-align center
        margin-top 10px
        border-radius 3px
      .res
        @extend .ellipsis
        width 84px
        padding 4px 0
      .b-type
        @extend .ellipsis
        width 64px
        padding 4px 0
        background #7bcdd2
      .b-step
        background #f5a623
      .finish
        background #ccc
  .card:hover
  .card:active
    background-color #e8f5fc
</style>
