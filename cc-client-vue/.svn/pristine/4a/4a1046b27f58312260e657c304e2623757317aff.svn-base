<template>
  <span v-if="!loading">
    {{queues}}
  </span>
</template>
<script>
  export default {
    name: 'queues',
    data () {
      return {
        loading: true
      }
    },
    props: ['id', 'exten'],
    /**
     * [props 该组件所需要的参数]
     * 通话状态ID
     */
    computed: {
      queues () {
        let queues = this.$store.state.session.dicMap.queues
        let current = ''
        for (let i in queues) {
          if (queues[i]._id === this.id || queues[i].Exten === this.exten) {
            current = queues[i].DisplayName
            break
          }
        }
        return current
      }
    },
    beforeMount () {
      this.$store.dispatch('getCache', {type: 'queues'}).then(() => {
        this.loading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
</style>
