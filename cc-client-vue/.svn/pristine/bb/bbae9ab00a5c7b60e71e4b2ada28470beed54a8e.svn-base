<template>
  <el-dialog class="opc" modal-append-to-body lock-scroll v-model.trim="imgInfo.bigImageShow" :modal="callScreen?false:true" size="full">
    <div class="img_box" @click="changeShow">
      <img :src="imgInfo.url"/>
    </div>
  </el-dialog>
</template>
<script type="text/javascript">
  export default {
    name: 'bigImage',
    data () {
      return {
      }
    },
    props: {
      imgInfo: Object,
      callScreen: Boolean
    },
    methods: {
      changeShow (value) {
        this.$emit('closeImageDialog', value)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .el-dialog__header
    border 0
  .img_box
    width 100%
    height 100%
    overflow hidden
    position fixed
    top 0
    left 0
    display flex
    text-align center
    align-items center
    img
      max-width calc(100vw - 80px)
      max-height calc(100vh - 20px)
      margin 0 auto
</style>
