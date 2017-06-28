<template>
  <div class="update customer-dialog assign">
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('customer.assignCustomer')" v-model.trim="dialogVisible" size="tiny" v-if="isAssignDialog">
      <p class="tip">{{$t('customer.assignTip')}}</p>
      <p class="alResult" v-if="restCount >= 0" v-html="$t('customer.assignNormal', { count, assignedCount, restCount })">
      </p>
      <p class="alResult" v-if="restCount < 0" v-html="$t('customer.assignOver', { count, assignedCount, restCount: -restCount })">
      </p>
      <agent-assign ref="agentAssign" :count="count" treeWidth="230" @assign-change="handleAssignChange">
      </agent-assign>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="cancel">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click.stop="submit">{{$t('public.save')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import AgentAssign from '../../public-modules/agent-assign/AgentAssign.vue'
  export default {
    name: 'AssignCustomer',
    data () {
      return {
        isAgentSelectShow: false,
        dialogVisible: false,
        agentCount: []
      }
    },
    props: {
      isAssignDialog: {
        type: Boolean,
        default: false
      },
      count: {
        type: Number,
        default: 0
      }
    },
    components: {
      AgentAssign
    },
    methods: {
      cancel () {
        this.$emit('cancelAndSubmit', {
          type: 'cancel',
          bool: false
        })
        this.$refs.agentAssign.$emit('resetAgent')
      },
      submit () {
        let count = 0
        this.agentCount.map(obj => {
          count += obj.count
        })
        if (count > this.count) {
          this.$message({
            message: this.$t('customer.assignOverTipWithCount', { count: this.count }),
            type: 'warning'
          })
          return
        }

        this.$emit('cancelAndSubmit', {
          type: 'submit',
          bool: false,
          owners: this.agentCount.map(obj => ({ owner: obj.agent, count: obj.count }))
        })
        this.$refs.agentAssign.$emit('resetAgent')
      },
      handleAssignChange (agentCount) {
        this.agentCount = agentCount
      }
    },
    computed: {
      restCount () {
        return this.count - this.assignedCount
      },
      assignedCount () {
        let count = 0
        for (let i = 0; i < this.agentCount.length; i++) {
          count += this.agentCount[i].count
        }

        return count
      }
    },
    watch: {
      isAssignDialog (cur, old) {
        this.dialogVisible = cur
      },
      dialogVisible (cur, old) {
        if (cur === false) {
          this.$emit('cancelAndSubmit', {
            type: 'close',
            bool: false
          })
          this.$refs.agentAssign.$emit('resetAgent')
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
   @import "../../../assets/common.styl"
  .assign
    .el-dialog
    .el-dialog--tiny
      width 690px
      .tip
        height 36px
        line-height 36px
        padding-left 16px
        color $cf-gray4
        background $c-back
      .alResult
        margin 10px 0
        padding-left 16px
        color $cf-gray0
        .assignedCount
          color #2ab34b
        .restCount
          color #ec5973
</style>
