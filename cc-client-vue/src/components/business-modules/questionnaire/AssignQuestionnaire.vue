<template>
  <div class="update questionnaire-dialog assign">
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('questionnaire.assignQues')" v-model.trim="dialogVisible" size="tiny">
      <p class="alResult">{{$t('questionnaire.assignTip', {count})}}
        <el-input style="width: 65px" size="small" v-model.trim="assignCount"></el-input> {{$t('questionnaire.assignUnit')}}
      </p>
      <p class="alResult" v-html="$t('questionnaire.unassignTip', { restCount })">
      </p>
      <agent-assign ref="agentAssign" :count="assignCount" treeWidth="230" @assign-change="handleAssignChange">
      </agent-assign>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="submit">{{$t('public.save')}}</el-button>
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
        agentCount: [],
        assignCount: 0
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
        this.$emit('assignSubmit', {
          type: 'cancel',
          bool: false
        })
        this.$refs.agentAssign.$emit('resetAgent')
      },
      submit () {
        this.$emit('assignSubmit', {
          type: 'submit',
          bool: false,
          assignCount: this.assignCount,
          owners: this.agentCount.map(obj => ({ owner: obj.agent, count: obj.count }))
        })
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
          count += parseInt(this.agentCount[i].count)
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
          this.$emit('assignSubmit', {
            type: 'cancel',
            bool: false
          })
          this.$refs.agentAssign.$emit('resetAgent')
        } else {
          this.assignCount = this.count
        }
        this.agentCount = []   // 重置分配
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .assign
    .el-dialog
    .el-dialog--tiny
      width 690px
      .tip
        height 36px
        font-size 12px
        line-height 36px
        padding-left 16px
        color #b6b6b6
        background #f7f7f7
      .alResult
        font-size 12px
        margin 10px 0 18px 0
        padding-left 16px
        color #999
        .assignedCount
          color #2ab34b
        .restCount
          color #ec5973
</style>
