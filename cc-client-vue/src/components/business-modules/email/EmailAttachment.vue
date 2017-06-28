<template>
  <div class="attachment_li clearfix">
    <span :class="className"></span>
    <div class="attachment_li_span">
      <span class="attachment_name" :title="fileName">{{fileName}}</span>
      <span class="attachment_download">
        <a class="iconfont icon-xiazai" :href="fileUrl" :download="fileName"></a>
      </span>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'EmailAttachment',
    props: {
      fileName: String,
      fileUrl: String
    },
    computed: {
      className () {
        let types = this.fileName.split('.')
        let fileNameNew = types[types.length - 1]
        let className = ''
        if (fileNameNew === 'bmp' || fileNameNew === 'png' || fileNameNew === 'gif' || fileNameNew === 'jpg' || fileNameNew === 'jpeg') {
          className = 'attachment_img iconfont icon-youjianxiangqingtupian'
        } else if (fileNameNew === 'zip' || fileNameNew === 'rar' || fileNameNew === '7z' || fileNameNew === 'cab' || fileNameNew === 'iso') {
          className = 'attachment_img iconfont icon-youjianxiangqingzip'
        } else if (fileNameNew === 'docx' || fileNameNew === 'doc') {
          className = 'attachment_img iconfont icon-youjianxiangqingword'
        } else if (fileNameNew === 'xls' || fileNameNew === 'xlsx') {
          className = 'attachment_img iconfont icon-youjianxiangqingExcle'
        } else if (fileNameNew === 'pdf') {
          className = 'attachment_img iconfont icon-youjianxiangqingpdf'
        } else if (fileNameNew === 'ppt' || fileNameNew === 'pps' || fileNameNew === 'pptx') {
          className = 'attachment_img iconfont icon-youjianxiangqingPPT'
        } else {
          className = 'attachment_img iconfont icon-youjianxiangqingweizhi'
        }
        return className
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .attachment_li
    line-height 40px
    height 40px
    background #f0f0f0
    float left
    margin 0 10px 10px 0
    .attachment_li_span
      display inline-block
      height 40px
      line-height 40px
    .attachment_img
      float left
      display inline-block
      height 40px
      width 40px
      color #fff
      font-size 40px
    .icon-youjianxiangqingtupian
      background #eeb958
    .icon-youjianxiangqingzip
      background #ed9b5a
    .icon-youjianxiangqingword
      background #539eff
    .icon-youjianxiangqingExcle
      background #1bbb9e
    .icon-youjianxiangqingpdf
      background #ee5771
    .icon-youjianxiangqingPPT
      background #ee7559
    .icon-youjianxiangqingweizhi
      background #4ba7cd
  .attachment_name
    margin-left 6px
    margin-left 6px
    width 90px
    overflow hidden
    display inline-block
    white-space nowrap
    text-overflow ellipsis
    text-align left
  .attachment_download
    display inline-block
    vertical-align top
    margin-right 6px
</style>
