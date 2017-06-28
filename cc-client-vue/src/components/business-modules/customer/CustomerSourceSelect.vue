<template>
  <el-select size="small" class="select"
              v-model="custSource"
              :placeholder="placeholder"
              :disabled="isNotAllowEdit"
              :no-match-text="$t('customer.noSource')"
              :no-data-text="$t('customer.noSource')"
              @change="handleChange">
    <el-option
      v-for="item in optionsSource"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
  import { isNotAllowEditSource } from '../../../utils/customerUtils.js'
  export default {
    name: 'CustomerSourceSelect',
    data () {
      return {
        optionsSource: [],
        custSource: null
      }
    },
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      source: {
        type: String,
        default: null
      }
    },
    computed: {
      isNotAllowEdit () {
        return this.source !== null ? isNotAllowEditSource(this.$store.state.session.user) : false
      }
    },
    methods: {
      handleChange (value) {
        this.$emit('sourceChange', value)
      }
    },
    beforeMount () {
      Promise.all([
        this.$store.dispatch('getCache', { type: 'custTmpls' })
      ]).then(([custTmpls]) => {
        let custTmpl = custTmpls[0]
        let sources = [{ label: this.$t('customer.noSource'), value: '' }, ...custTmpl.source.map(source => ({ label: source.name, value: source.key }))]
        if (this.source) {
          let isSourceInOptions
          for (let i = 0; i < sources.length; i++) {
            if (sources[i].value === this.source) {
              isSourceInOptions = true
              break
            }
          }
          if (!isSourceInOptions) {
            sources.push({ label: '该来源已删除', value: this.source })
          }
        }
        this.optionsSource = sources
        this.custSource = this.source || ''
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .select
    width 100%
</style>
