<template>
  <div class="owner-tree">
    <span class="del-arrow"></span>
    <el-popover ref="popover-tree" v-model.trim="popoverVisable" placement="bottom-start" visible-arrow="false" trigger="click">
      <el-input size="small" slot="reference" v-model.trim="inputValue" @focus="handleInputFocus" :placeholder="$t('public.pickAgentTip')">
      </el-input>
      <el-tree
        class="a-tree"
        ref="tree"
        node-key="_id"
        :data="optionData"
        :default-expanded-keys="defaultExpandedKeys"
        accordion
        :highlight-current="true"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick">
      </el-tree>
    </el-popover>
  </div>
</template>
<script>
  import { filterAllCategory } from '../../../utils/customerUtils.js'
  export default {
    name: 'OwnerTreeSelect',
    data () {
      return {
        inputValue: '',
        defaultExpandedKeys: ['common'],
        optionData: [],
        popoverVisable: false
      }
    },
    props: {
      businessType: {
        type: String,
        default: ''
      },
      owner: {
        type: String,
        default: ''
      },
      name: {type: String, default: ''}
    },
    watch: {
      inputValue (val) {
        this.$refs.tree.filter(val)
        if (val === '') {
          this.$emit('owner-reset', this.name)
          this.expandNode()
        }
      },
      owner (curr, prev) {
        if (curr === '') {
          this.$emit('resetValue')
        }
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1 || (data.pinyin && data.pinyin.indexOf(value) !== -1)
      },
      expandNode () {
        this.$refs.tree.root.childNodes.map(childNode => {
          if (childNode.data._id === 'common') {
            childNode.expanded = true
          } else {
            childNode.expanded = false
          }
        })
      },
      handleInputFocus () {
        if (this.inputValue) {
          this.$refs.tree.filter()
        }
        this.expandNode()
      },
      handleNodeClick (data) {
        if (!data.type) {
          return
        }
        this.popoverVisable = false
        this.inputValue = data.displayName || data.label
        data.name = this.name
        this.$emit('owner-change', data)
      }
    },
    beforeMount () {
      Promise.all([
        this.$store.dispatch('getCache', { type: 'depts' }),
        this.$store.dispatch('getCache', { type: 'agents' }),
        this.$store.dispatch('getCache', { type: 'custCategorys' })
      ]).then(([depts, agents, custCategorysCache]) => {
        let optionData = []
        let custCategorys = filterAllCategory()
        let commonOption = {
          _id: 'common',
          label: '常用',
          children: [
            { _id: 'myself', type: 'ownercom', label: '我自己' },
            { _id: 'my-subordinates', type: 'ownercom', label: '我和我的下属' },
            { _id: 'my-department', type: 'ownercom', label: '我的部门' },
            { _id: 'my-subordinates-dept', type: 'ownercom', label: '我和我的下属部门' }
          ]
        }
        let noOwner = { _id: 'NA', type: 'owner', label: '无归属' }
        let _custCategorys = custCategorys.map(category => ({ _id: category._id, type: 'owner', label: category.displayName, displayName: category.cName }))
        let _agents = agents.map(agent => ({ _id: agent._id, type: 'owner', label: `${agent.displayName}[${agent.exten}]`, displayName: agent.displayName, pinyin: agent.pinyin }))
        let customerOwners = [noOwner, ..._custCategorys, ..._agents]
        let otherOwners = [noOwner, ..._agents]
        let ownerOption = {
          _id: 'owner',
          label: this.businessType === 'customer' ? '归属' : '同事',
          children: this.businessType === 'customer' ? customerOwners : otherOwners
        }
        let _depts = depts.filter(dept => dept.pId !== '')
        _depts = _depts.map(dept => ({ _id: dept._id, type: 'ownerdep', label: dept.name }))
        let deptOption = {
          _id: 'dept',
          label: '部门',
          children: _depts
        }

        optionData.push(...[commonOption, ownerOption, deptOption])
        this.optionData = optionData
        this.$on('resetValue', () => {
          this.inputValue = ''
        })
      })
    }
  }
</script>
<style lang="stylus" scoped>
.a-tree
  max-height 460px
  min-width 190px
  overflow-y auto
</style>
