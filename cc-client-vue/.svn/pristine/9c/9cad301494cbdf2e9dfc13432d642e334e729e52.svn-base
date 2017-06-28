<template>
  <div class="agent-tree">
    <span class="del-arrow"></span>
    <el-popover ref="popover-tree" placement="bottom-start" visible-arrow="false" trigger="click">
      <el-input size="small" slot="reference" v-model="inputValue" :placeholder="$t('public.pickAgentTip')" icon="close" :on-icon-click="handleInputIconClick">
      </el-input>
      <el-tree
        class="a-tree"
        ref="tree"
        node-key="_id"
        :data="optionData"
        show-checkbox
        accordion
        default-expand-all
        :filter-node-method="filterNode"
        @check-change="handleCheckChange">
      </el-tree>
    </el-popover>
  </div>
</template>
<script>
  export default {
    name: 'AgentTreeSelect',
    data () {
      return {
        inputValue: '',
        optionData: [],
        checkedAgents: []
      }
    },
    watch: {
      inputValue (val) {
        this.$refs.tree.filter(val)
      }
    },
    methods: {
      resetAgent () {
        this.$refs.tree.setCheckedKeys([])
      },
      deleteAgent (key) {
        this.$refs.tree.setChecked(key, false)
      },
      handleInputIconClick () {
        this.inputValue = ''
      },
      filterNode (value, data) {
        if (!value) return true
        return data.type === 'agent' && (data.label.indexOf(value) !== -1 || data.pinyin.indexOf(value) !== -1)
      },
      handleCheckChange (data, isChecked) {
        if (data.type === 'agent') {
          if (isChecked) {
            this.checkedAgents.push({ _id: data._id, displayName: data.label.split(' ')[0], exten: data.label.split(' ')[1] })
          } else {
            this.checkedAgents = this.checkedAgents.filter(agent => agent._id !== data._id)
          }
          this.$emit('agent-change', this.checkedAgents)
        }
      }
    },
    beforeMount () {
      Promise.all([
        this.$store.dispatch('getCache', { type: 'depts' }),
        this.$store.dispatch('getCache', { type: 'agents' })
      ]).then(([depts, agents]) => {
        let optionData = []
        dealDept(depts, optionData, '')
        dealAgent(agents, optionData[0].children)
        let noDeptAgents = agents.filter(agent => agent.status === 'enable' && !agent.deptId).map(agent => ({ _id: agent._id, type: 'agent', label: `${agent.displayName} ${agent.exten}`, pinyin: agent.pinyin }))
        optionData[0].children.push(...noDeptAgents)
        setDeptAgentCount(optionData[0])
        this.optionData = optionData
        this.$on('resetAgent', () => {
          this.resetAgent()
        })
        this.$on('deleteAgent', (_id) => {
          this.deleteAgent(_id)
        })
      })
    }
  }
  function dealDept (depts, arr, key) {
    for (let i = 0; i < depts.length; i++) {
      let dept = depts[i]
      if (dept.pId === key) {
        let obj = {
          _id: dept._id,
          type: 'dept',
          label: dept.name,
          order: dept.order,
          children: []
        }
        arr.push(obj)
        dealDept(depts, obj.children, dept._id)
      }
    }
  }
  function dealAgent (agents, arr) {
    if (!arr) {
      return
    }
    for (let i = 0; i < arr.length; i++) {
      dealAgent(agents, arr[i].children)
      let deptAgents = agents.filter(agent => agent.status === 'enable' && agent.deptId === arr[i]._id)
      deptAgents = deptAgents.map(agent => ({ _id: agent._id, type: 'agent', label: `${agent.displayName} ${agent.exten}`, pinyin: agent.pinyin }))
      arr[i].children.push(...deptAgents)
    }
  }

  function setDeptAgentCount (obj) {
    if (!obj.children && obj.type === 'agent') {
      return 1
    }

    let count = 0
    for (let i = 0; i < obj.children.length; i++) {
      count += setDeptAgentCount(obj.children[i])
    }

    obj.label = `${obj.label} (${count})`
    return count
  }
</script>
<style lang="stylus" scoped>
.el-checkbox
  padding-right 0
.a-tree
  max-height 300px
  min-width 190px
  overflow-y auto
</style>
