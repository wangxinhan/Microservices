<template>
  <span v-if="!loading">
    {{callStatus}}
  </span>
</template>
<script>
  export default {
    name: 'callstatus',
    data () {
      return {
        loading: true
      }
    },
    props: {
      status: String
    },
    computed: {
      callStatus () {
        let callState = this.$store.state.session.dicMap.callStatus
        let current = ''
        for (let i in callState) {
          if (callState[i].code_value === this.status) {
            current = callState[i].code_name
            break
          }
        }
        return current
      }
    },
    methods: {
      fetchData () {
        this.$store.dispatch('getCache', {type: 'callStatus'}).then(() => {
          this.loading = false
        })
      }
    },
    /**
     * [props 该组件所需要的参数]
     * 通话状态ID
     */
    beforeMount () {
      this.fetchData()
    }
  }
</script>
<style lang="stylus" scoped>
</style>
