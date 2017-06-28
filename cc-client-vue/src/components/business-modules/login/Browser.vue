<template>
  <el-dialog
    modal-append-to-body
    :close-on-click-modal=isfetch
    :close-on-press-escape=isfetch
    :show-close=isfetch
    lock-scroll top="10%"
    class= "dislog-login dislog-browser" title="提示" v-model.trim="browser">
    <p>很抱歉，您正在使用的浏览器无法完全支<br>持我们的页面。建议您使用以下浏览器的<br>最新版本：</p>
    <a target="_blank" href="http://www.google.cn/intl/zh-CN/chrome/" class="ico icoChrome" title="谷歌Chrome浏览器"></a>
    <div slot="footer" class="dialog-footer">
      <a target="_blank" href="http://www.google.cn/intl/zh-CN/chrome/"><el-button type="primary" >下载谷歌浏览器</el-button></a>
      <el-button v-if="isfetch" @click.native="browser = false">还是用这个浏览器打开</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    name: 'Browser',
    data () {
      return {
        browser: !(/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)),
        isfetch: window.fetch || false
      }
    }
  }
</script>
<style lang="stylus" scoped>
</style>
