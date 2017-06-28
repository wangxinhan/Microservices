<template>
  <div class="verification_box_attach">
    <div class="verification_ul">
      <div class="verification_li" v-for="(item, index) in inputData">
        <span>{{item.name}}</span>
        <span class="delete_email iconfont icon-guanbi" @click="deleteText(index)"></span>
      </div>
      <div class="attach_upload_progress clearfix" v-if="uploadProgress.flag">
        <span class="progress_title">{{uploadProgress.progress}}%</span>
        <div class="progress_img">
          <span class="progress_img_span" :style="'width:' + uploadProgress.progress + '%'"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AttachInputTag',
    props: {
      inputData: Array,
      uploadProgress: Object
    },
    methods: {
      deleteText (index) {
        this.$confirm(this.$t('email.ifDeleteAttach'), this.$t('public.operate'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }).then(() => {
          if (index > -1) {
            this.inputData.splice(index, 1)
            this.$emit('inputChange', this.inputData)
          }
        }).catch(() => {})
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .verification_box_attach
    width 100%
    box-sizing border-box
    border 1px solid #e7e7e7
    border-radius 2px
    min-height 28px
    padding 4px 6px 0
    overflow-y auto
    background #fff
  input
    width 160px
    border none
    background transparent
    display inline-block
    vertical-align middle
    margin 0 4px 4px 0
  .verification_li
    background #D1F6F8
    position relative
    padding-right 16px
    float left
    line-height 18px
    margin 0 4px 4px 0
    .delete_email
      float left
      color red
      font-size 12px
      position absolute
      line-height 20px
      right 2px
      top 2px
      cursor pointer
  .attach_upload_progress
    width 100px
    height 18px
    float left
    margin 0 4px 3px 0
    overflow hidden
  .progress_title,.progress_img
    display inline-block
    width 100%
    color #808080
  .progress_title
    height 13px
    text-align center
  .progress_img
    background #bbb
    height 5px
    float left
    overflow hidden
  .progress_img_span
    height 10px
    float left
    background #1ABA9D
    display inline-block
  .verification_ul
    display block
    overflow-y auto
    max-height 42px
</style>
