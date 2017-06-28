<template>
  <span v-if="!loading">
    {{agentName}}
  </span>
</template>
<script>
  export default {
    name: 'agent',
    data () {
      return {
        loading: true
      }
    },
    props: {
    /**
     * [props 该组件所需要的参数]
     * 座席ID
     * 是否显示座席工号
     */
      id: String,
      isNum: Boolean,
      isnull: Boolean
    },
    computed: {
      agentName () {
        let agents = this.$store.state.session.dicMap.agents
        let current = ''
        for (let i in agents) {
          if (this.id === 'NA') {
            return '无归属'
          }
          if (agents[i]._id === this.id) {
            current = this.isNum ? agents[i].displayName + '[' + agents[i].loginName + ']' : agents[i].displayName
            break
          } else if (this.id === 'NA') {
            return '无归属'
          }
          if (this.isnull) {
            current = '无归属'
          }
        }
        return current
      }
    },
    methods: {
      fetchData () {
        this.$store.dispatch('getCache', {type: 'agents'}).then(() => {
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
