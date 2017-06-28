<template>
  <span id="fileDown"><iframe></iframe></span>
</template>
<script type='text/javascript'>
export default({
  data () {
    return {
    }
  },
  computed: {
    fileDown () {
      return this.$store.state.fileDown
    },
    sessionId () {
      return this.$store.state.session.sessionId
    },
    url () {
      if (this.fileDown.path) {
        let newUrl = this.fileDown.isSession ? this.fileDown.path + '&sessionId=' + this.sessionId : this.fileDown.path
        return newUrl
      }
    }
  },
  watch: {
    // url 变化 再次执行
    url: 'addIframe'
  },
  methods: {
    addIframe () {
      let pane = document.getElementById('fileDown')
      pane.removeChild(pane.childNodes[0])
      let iframe = document.createElement('iframe')
      iframe.setAttribute('src', this.url)
      pane.appendChild(iframe)
    }
  }
})
</script>
<style lang='stylus' scoped>
  #fileDown
    display none
</style>
