<template>
  <div class="mask" v-if="masking.show">
    <!--<div class="icon dload" v-if="masking.type === 'common'"></div>-->
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'mask',
    data () {
      return {
      }
    },
    computed: {
      masking () {
        return this.$store.state.masking
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../assets/common.styl'
  .mask
    width 100%
    height 100%
    position fixed
    background-color rgba(0,0,0,0)
    z-index 1000
    top 0
  /*.dload{*/
    /*animation:myprofadein 1s infinite alternate;*/
    /*-webkit-animation:myprofadein 1s infinite alternate;*/
    /*animation-timing-function:cubic-bezier(0.42,0,0.58,1);*/
    /*-webkit-animation-timing-function:cubic-bezier(0.42,0,0.58,1);*/
  /*}*/
  /*.icon*/
    /*box-size(26px,29px)*/
    /*background url(img/logo.png) no-repeat*/
    /*background-size 26px auto*/
    /*margin 13px 19px*/
    /*position absolute*/
    /*left 0*/
    /*top 0*/
    /*text-transform capitalize*/
  /*@keyframes myprofadein{*/
    /*from {opacity: 0;}*/
    /*to {opacity: 1;}*/
  /*}*/
  /*.icon-login*/
    /*box-size(82px,91px)*/
    /*background url(img/logo.png) no-repeat*/
    /*background-size 82px auto*/
    /*margin-left -41px*/
    /*position absolute*/
    /*left 50%*/
    /*top 40px*/
    /*text-transform capitalize*/
</style>
