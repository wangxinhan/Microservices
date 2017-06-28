<template>
  <span v-if="!loading">
    {{callTypeName}}
  </span>
</template>
<script>
  export default {
    name: 'callType',
    data () {
      return {
        loading: true
      }
    },
    props: ['code'],
    /**
     * [props 该组件所需要的参数]
     * 通话状态ID
     */
    computed: {
      callTypeName () {
        let callType = this.$store.state.session.dicMap.callType
        let current = ''
        for (let i in callType) {
          if (callType[i].code_value === this.code) {
            current = callType[i].code_name
            break
          }
        }
        return current
      }
    },
    methods: {
      fetchData () {
        this.$store.dispatch('getCache', {type: 'callType'}).then(() => {
          this.loading = false
        })
      }
    },
    beforeMount () {
      this.fetchData()
    }
  }
</script>
<style lang="stylus" scoped>
</style>
