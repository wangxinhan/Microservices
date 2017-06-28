<template>
  <el-select size="small" class="select"
             v-model.trim="custStatus"
             :placeholder="placeholder"
             :disabled="isNotAllowEdit"
             @change="handleChange">
    <el-option
      v-for="item in optionsStatus"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
  import { isNotAllowEditStatus } from '../../../utils/customerUtils.js'
  export default {
    name: 'CustomerStatusSelect',
    data () {
      return {
        optionsStatus: [],
        custStatus: ''
      }
    },
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      status: {
        type: String,
        default: null
      }
    },
    computed: {
      isNotAllowEdit () {
        return this.status !== null ? isNotAllowEditStatus(this.$store.state.session.user) : false
      }
    },
    methods: {
      handleChange (value) {
        this.$emit('statusChange', value)
      }
    },
    beforeMount () {
      Promise.all([
        this.$store.dispatch('getCache', { type: 'custTmpls' })
      ]).then(([custTmpls]) => {
        let custTmpl = custTmpls[0]
        let statuses = []
        let isStatusOption = false
        for (let key in custTmpl.status) {
          statuses.push({ label: custTmpl.status[key], value: key })
        }
        for (let key in custTmpl.status) {
          if (this.status === key) {
            isStatusOption = true
            break
          }
        }
        if (this.status && !isStatusOption) {
          statuses.push({ label: '该状态已被删除', value: this.status })
        }
        this.optionsStatus = statuses
        this.custStatus = this.status || 'status0'
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .select
    width 100%
</style>
