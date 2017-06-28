<template>
  <span v-if="!loading">
    {{mailStatus}}
  </span>
</template>
<script>
  export default {
    name: 'mailStatus',
    data () {
      return {
        loading: true
      }
    },
    props: ['codeValue'],
    /**
     * [props 该组件所需要的参数]
     * 通话状态ID
     */
    computed: {
      mailStatus () {
        let mailStatus = this.$store.state.session.dicMap.mailStatus
        let current = ''
        for (let i in mailStatus) {
          if (mailStatus[i].code_value === this.codeValue) {
            current = mailStatus[i].code_name
            break
          }
        }
        return current
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', {type: 'mailStatus'}).then(() => {
        this.loading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
</style>
