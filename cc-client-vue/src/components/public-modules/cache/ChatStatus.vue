<template>
  <span v-if="!loading">
    {{chatStatus}}
  </span>
</template>
<script>
  export default {
    name: 'chatStatus',
    data () {
      return {
        loading: true
      }
    },
    props: ['value'],
    /**
     * [props 该组件所需要的参数]
     * 通话状态ID
     */
    computed: {
      chatStatus () {
        let chatStatus = this.$store.state.session.dicMap.chatStatus
        let current = ''
        for (let i in chatStatus) {
          if (chatStatus[i].code_value === this.value) {
            current = chatStatus[i].code_name
            break
          }
        }
        return current
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', {type: 'chatStatus'}).then(() => {
        this.loading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
</style>
