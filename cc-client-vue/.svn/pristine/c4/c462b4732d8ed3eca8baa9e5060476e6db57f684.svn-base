<template>
   <login></login>
</template>
<script>
export default {
  name: 'login-index',
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  beforeCreate: function () {
//    this.$options.components.login = require('./oem/login-demo.vue')
    let flag = this.$store.state.oemFlag
    if (flag === '') {
      this.$options.components.login = require('./login-kf.vue')
    }
  },
  methods: {
  },
  beforeMount () {
  }
}
</script>
<!--<style lang="stylus" id="oem_7moor">-->
  <!--.oem-7moor-->
    <!--display none-->
<!--</style>-->
