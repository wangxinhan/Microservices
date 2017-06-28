<template>
  <div class="sj" v-if="!bloon">
    <h3>{{$t('public.prompt_title')}}
      <span @click="close">×</span>
    </h3>
    <div class="wrapp">
      <p>
        <img src="./images/waring_03.png" />
        <span>{{$t('public.prompt')}}</span>
      </p>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default({
    data () {
      return {
        bloon: false
      }
    },
    methods: {
      close () {
        this.bloon = true
        window.sessionStorage.setItem('passover', true)
      }
    },
    beforeMount () {
      this.bloon = !!window.sessionStorage.getItem('passover')
    }
  })
</script>
<style lang="stylus" scoped>
  .sj
    border-radius  6px
    box-shadow  0 5px 10px rgba(0, 0, 0, 0.2)
    background-color  #fff
    width 350px
    height 0px
    position absolute
    z-index 9999999999
    right 10px
    bottom 0
    overflow hidden
    animation move 2s 0.5s
    animation-fill-mode forwards
    @keyframes move
      0%
        bottom 0px
      10%
        bottom 10px
      100%
        bottom 10px
        height 120px
    h3
      padding 0px 16px 0 12px
      font-size 14px
      background-color  #f5f5f5
      height 36px
      line-height 36px
      color #9a9a9a
      margin 0
      span
        float right
        cursor pointer
        color #ccc
        font-weight bold
        font-size 20px
        &:hover
          color #666
.wrapp
  padding 12px 14px
  p
    padding-right 0
    color #797979
    font-size 12px
    img
      display inline-block
      vertical-align top
      margin-top 8px
      margin-left 4px
    span
      display inline-block
      width 240px
      line-height 20px
      margin-left 14px
</style>
