<template>
  <el-select size="small" id="ownerSelect" class="select" :style="{width: widthSize+'px'}" v-model.trim="custOwner" filterable :placeholder="placeholder" :disabled="isNotAllowEdit" @change="handleChange" @visible-change="handleVisibleChange">
    <el-option
      v-for="item in optionsOwners"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled">
    </el-option>
  </el-select>
</template>
<script>
/**
 * 客户归属修改权限控制：
 * a."禁止修改客户归属"优先级最高，若没打开该开关，按数据权限控制
 * b.有“所有人”数据权限的座席可以修改无归属的客户，否则通过“弹屏可修改无归属的客户”权限来控制
 * c."新增客户默认为无归属"权限只对应系统中单个客户的增加
 * d.只要有“所有人”权限的用户才可以把归属改为“无归属”。
 */
  import { getCache } from '../../../utils/m7Utils.js'
  import { filterUserByScope, filterCategoryByManager, filterAllCategory, isNotAllowEditOwner, isDefaultNoOwner, isAllowPopupEditNoOwnerCustomer } from '../../../utils/customerUtils.js'
  export default {
    name: 'CustomerOwnerSelect',
    data () {
      return {
        optionsOwners: [],
        custOwner: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      categoryId: {
        type: String,
        default: null
      },
      owner: {
        type: String,
        default: null
      },
      widthSize: Number,
      ownerRange: {
        type: String,
        default: 'all'
      }
    },
    computed: {
      isAllowPopupEdit () {
        return isAllowPopupEditNoOwnerCustomer(this.$store.state.session.user)
      },
      isNotAllowEdit () {
        // 有传入值，是更新客户的信息的情况
        if (this.categoryId !== null && this.owner !== null) {
          let user = this.$store.state.session.user
          let scope = user.scope.customer
          // 禁止修改客户归属
          if (isNotAllowEditOwner(user)) {
            return true
          }

          // 无归属的客户，有'所有人'数据权限或弹屏时有'弹屏可修改无归属的客户'权限的才能修改
          if (this.categoryId === 'NA' && this.owner === 'NA') {
            if (scope === 'all' || this.isAllowPopupEdit) {
              return false
            }
            return true
          }

          // 有归属的客户，数据权限为all或者所属人是我或我的下属或为公海管理员能修改
          let category = getCache('custCategorys', this.categoryId)
          if (user.moduleUsers.customer === 'all' || user.moduleUsers.customer.indexOf(this.owner) !== -1 || (category && category.managers.indexOf(user._id) !== -1)) {
            return false
          }

          return true
        }
        // 没有传入值，新建客户
        return false
      },
      isDefaultNoOwner () {
        return isDefaultNoOwner(this.$store.state.session.user)
      }
    },
    methods: {
      handleChange (value) {
        let arr = value.split('|')
        let category = arr[0]
        let categoryId = arr[1]
        let owner = arr[2]
        if ((categoryId === this.categoryId || (categoryId === 'NA' && this.categoryId !== 'NA')) && owner === this.owner) {
          return
        }
        if ((!categoryId || (categoryId === 'NA' && owner !== 'NA')) && categoryId && this.categoryId !== 'NA') {
          categoryId = this.categoryId
        }

        let data = {
          category,
          categoryId,
          owner
        }
        this.$emit('ownerChange', data)
      },
      handleVisibleChange (visible) {
        this.$emit('visible-change', visible)
      },
      getCustOwner () {
        if (this.ownerRange === 'category') {
          return '1|NA|NA'
        }
        // 若传入值
        if (this.categoryId !== null && this.owner !== null) {
          // 无归属
          if (this.categoryId === 'NA' && this.owner === 'NA') {
            return '1|NA|NA'
          }
          // 公海
          let category = 1
          if (this.categoryId === this.owner) {
            for (let i = 0; i < this.optionsOwners.length; i++) {
              let val = this.optionsOwners[i].value
              let categoryId = val.split('|')[1]
              if (this.categoryId === categoryId) {
                category = val.split('|')[0]
                break
              }
            }

            return `${category}|${this.categoryId}|${this.owner}`
          }

          // 座席
          return `|NA|${this.owner}`
        }

        // 没有传入值
        // 新增客户默认为无归属
        if (this.isDefaultNoOwner) {
          return '1|NA|NA'
        }

        // 当前登录座席
        return `|NA|${this.$store.state.session.user._id}`
      }
    },
    beforeMount () {
      Promise.all([
        this.$store.dispatch('getCache', { type: 'custCategorys' }),
        this.$store.dispatch('getCache', { type: 'agents' })
      ]).then(([custCategorysCache, agents]) => {
        let user = this.$store.state.session.user
        let scope = user.scope.customer
        let owners = []
        // 无归属options
        let NA = { label: this.$t('customer.noOwner'), value: '1|NA|NA' }
        // 启用的座席id
        let enableAgentIds = []
        // 启用的座席options
        let _enableAgents = []
        agents.map(agent => {
          if (agent.status === 'enable') {
            enableAgentIds.push(agent._id)
            _enableAgents.push({ label: `${agent.displayName}[${agent.exten}]`, value: `|NA|${agent._id}` })
          }
          // 客户所属座席如果被停用也添加到options，但不可选
          if (this.owner && this.owner !== 'NA' && agent._id === this.owner && agent.status !== 'enable') {
            _enableAgents.push({ label: `${agent.displayName}[${agent.exten}] (${this.$t('public.disabled')})`, value: `|NA|${agent._id}`, disabled: true })
          }
        })
        // 根据数据权限获取的座席
        let scopeAgents = filterUserByScope()
        // 所有的公海
        let allCategory = filterAllCategory()
        // 客户所属公海
        let custCategory
        if (this.owner && this.owner !== 'NA' && this.categoryId && this.categoryId !== 'NA' && this.owner === this.categoryId) {
          custCategory = allCategory.filter(category => category._id === this.categoryId)[0]
        }
        // 客户所属公海是否在根据管理权限获取的公海中
        let isCustCategoryInManager = false
        // 根据管理权限获取的公海
        let managerCategory = filterCategoryByManager()
        // 根据管理权限获取的公海options
        let _managerCategory = []
        managerCategory.map(category => {
          _managerCategory.push({ label: category.displayName, value: `${category.category}|${category._id}|${category._id}` })
          if (custCategory && category._id === custCategory._id) {
            isCustCategoryInManager = true
          }
        })
        // 客户所属公海不在根据管理权限获取的公海中也添加到options，但不可选
        if (custCategory && !isCustCategoryInManager) {
          managerCategory.push(custCategory)
          _managerCategory.push({ label: custCategory.displayName, value: `${custCategory.category}|${custCategory._id}|${custCategory._id}`, disabled: true })
        }
        if (this.ownerRange === 'category') {
          owners = [{ label: this.$t('customer.noOwner'), value: '1|NA|NA' }, ..._managerCategory]
        } else {
          if (this.categoryId === null && this.owner === null) {
            // 新建客户
            owners = [{ label: this.$t('customer.noOwner'), value: '1|NA|NA' }, ..._managerCategory, ..._enableAgents]
          } else {
            // 编辑客户
            // 如果不允许修改，options放入所有，来保证正确显示所属人
            if (this.isNotAllowEdit) {
              let _allCategory = allCategory.map(category => ({ label: category.displayName, value: `${category.category}|${category._id}|${category._id}` }))
              let _allAgents = agents.map(agent => ({ label: `${agent.displayName}[${agent.exten}]`, value: `|NA|${agent._id}` }))
              owners = [NA, ..._allCategory, ..._allAgents]
            } else {
              // 允许修改
              let _uids = scopeAgents.map(agent => agent._id)
              let _categoryIds = managerCategory.map(category => category._id)
              if (scope === 'all' || this.isAllowPopupEdit) {
                _uids.push('NA')
              }
              if (scope === 'all') {
                owners = [{ label: this.$t('customer.noOwner'), value: '1|NA|NA' }]
              } else if (this.categoryId === 'NA' && this.owner === 'NA') {
                owners = [{ label: this.$t('customer.noOwner'), value: '1|NA|NA', disabled: true }]
              }

              if (_uids.indexOf(this.owner) !== -1 || _categoryIds.indexOf(this.owner) !== -1) {
                if (_managerCategory.length > 0) {
                  owners = [...owners, ..._managerCategory]
                }
                if (scopeAgents.length > 0) {
                  owners = [...owners, ..._enableAgents]
                }
              }
            }
          }
        }

        this.optionsOwners = owners
        this.custOwner = this.getCustOwner()
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .select
    width 100%
</style>
