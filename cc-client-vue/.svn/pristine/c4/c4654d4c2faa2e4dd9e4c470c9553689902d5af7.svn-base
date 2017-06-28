<template>
  <div class="assign">
    <div class="selecSate">
      <div class="selec">
        <div class="input-group">
          <span>{{$t('public.pickAgent')}}：</span>
          <agent-tree-select ref="agentTree" class="agent-tree" @agent-change="handleAgentChange">
          </agent-tree-select>
        </div>
        <div class="btn-group">
          <span class="auto" @click.stop="autoAssign">{{$t('public.autoAssign')}}</span>
          <span class="rest" @click.stop="reset">{{$t('public.reset')}}</span>
        </div>
      </div>
      <div class="scResult">
        <span class="count" v-if="checkedAgents.length===0">{{$t('public.noAgent')}}</span>
        <div class="resu" v-if="checkedAgents.length!==0">
          <p>{{$t('public.hasPickAgentWithCount', { count: checkedAgents.length })}}
            <span class="fr clea" @click="clear">{{$t('public.clear')}}</span>
          </p>
          <el-row >
            <el-col :span="6" v-for="(item, index) in checkedAgents" class="fl result">
              <span class="agent-name">{{item.displayName}}</span>
              <el-input size="small" class="an-count" v-model.trim="agentCount[item._id]" type="number" min="0" @change="handleAgentCountChange(item._id)">
              </el-input>
              <i class="iconfont icon-guanbi" @click= "dele(index)"></i>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import AgentTreeSelect from '../agent-tree/AgentTreeSelect.vue'
  export default {
    name: 'AssignCustomer',
    data () {
      return {
        checkedAgents: [],
        agentCount: {}
      }
    },
    props: {
      count: {
        type: Number,
        default: 0
      }
    },
    components: {
      AgentTreeSelect
    },
    methods: {
      // 自动分配
      autoAssign () {
        let num = Math.floor(this.count / this.checkedAgents.length)
        for (let key in this.agentCount) {
          this.agentCount[key] = num
        }
        let restCount = this.count - num * this.checkedAgents.length
        for (let key in this.agentCount) {
          if (restCount === 0) {
            break
          }
          this.agentCount[key]++
          restCount--
        }
      },
      // 点击重置时触发
      reset () {
        for (let key in this.agentCount) {
          this.agentCount[key] = 0
        }
      },
      // 清除
      clear () {
        this.checkedAgents = []
        this.agentCount = {}
        this.$emit('resetAgent')
      },
      // 删除
      dele (index) {
        let _id = this.checkedAgents[index]._id
        this.$emit('deleteAgent', _id)
        this.$set(this.agentCount, _id, 0)
        this.checkedAgents.splice(index, 1)
        if (this.checkedAgents.length === 0) {
          this.$emit('resetAgent')
        }
      },
      getAgentMaxCount (id) {
        let count = 0
        for (let key in this.agentCount) {
          if (key !== id) {
            count += parseInt(this.agentCount[key])
          }
        }
        return this.count - count
      },
      handleAgentChange (checkedAgents) {
        this.checkedAgents = checkedAgents
        let ids = checkedAgents.map(agent => agent._id)
        for (let i = 0; i < ids.length; i++) {
          let id = ids[i]
          if (!this.agentCount[id]) {
            this.$set(this.agentCount, id, 0)
          }
        }

        for (let key in this.agentCount) {
          if (ids.indexOf(key) === -1) {
            this.$set(this.agentCount, key, 0)
            delete this.agentCount[key]
          }
        }
      },
      // 座席分配数量更改
      handleAgentCountChange (id) {
        if (this.agentCount[id] < 0) {
          this.$set(this.agentCount, id, 0)
        }
      }
    },
    computed: {
      restCount () {
        return this.count - this.assignedCount
      },
      assignedCount () {
        let count = 0
        for (let key in this.agentCount) {
          count += parseInt(this.agentCount[key])
        }
        return count
      }
    },
    watch: {
      assignedCount () {
        let agents = []
        for (let key in this.agentCount) {
          if (this.agentCount[key]) {
            agents.push({ agent: key, count: parseInt(this.agentCount[key]) })
          }
        }
        this.$emit('assign-change', agents)
      }
    },
    beforeMount () {
      this.$on('resetAgent', () => {
        this.$refs.agentTree.$emit('resetAgent')
      })
      this.$on('deleteAgent', (_id) => {
        this.$refs.agentTree.$emit('deleteAgent', _id)
      })
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common"
.assign
  .selecSate
    padding 0 12px 0 16px
    .scResult
      border-top 1px solid #e6e6e6
      padding-top 16px
      padding-left 16px
      margin-top 10px
      min-height 248px
      .count
      .resu
        p
        color #999
      .el-row
        height 210px
        font-size 12px
        margin-top 1em
        overflow-y auto
      .result
        display flex
        align-items center
        margin-bottom 1em
        .agent-name
          display inline-block
          width 4em
          color #a3a3a3
          @extend .ellipsis
        .el-input
          width 60px
          height 24px
        .icon-guanbi
          font-size 12px
          color #adadad
          margin-left 10px
      .clea
        cursor pointer
      .resu
        p
          height 20px
          line-height 20px
          span
            color #73cfba
      ul
        li
          margin 10px 30px 0 0
          font-size 12px
          color #b8b8b8
          .iconfont
            font-size 14px
          input
            width 56px
            border 1px solid #e6e6e6
            font-size 12px
            padding 5px 10px
    .selec
      color #d4d4d4
      display flex
      align-items center
      justify-content space-between
      .agent-tree
        width 216px
        display inline-block
      .auto
        margin-right 14px
        color #1abb9c
      .auto
      .rest
        cursor pointer
</style>
