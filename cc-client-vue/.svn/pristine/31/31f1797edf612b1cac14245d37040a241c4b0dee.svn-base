<!--下载导入模板 上传短信模板-->
<template>
  <div class="si-add-template">
    <h2>{{$t('sms.impTempMassSend')}}</h2>
    <div class="wrap">
      <div class="btn-wrap">
        <el-button class="temp-download">
          <a href="../../../../static/template/sms_template_tmpl-zh.xls" download>{{$t('sms.downLoadSmsTemp')}}</a>
        </el-button>
        <!--饿了么上传组件-->
        <el-upload
          class="temp-upload"
          :action="uploadUrl"
          accept=".xls,.xlsx"
          :data="uploadHeaders"
          :with-credentials="true"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :show-file-list="false">
          <el-button size="small" type="primary">{{$t('sms.impTempMassSend')}}</el-button>
        </el-upload>
      </div>
      <div class="instructions">
        <p>{{$t('sms.introduce')}}:</p>
        <p>{{$t('sms.imptips1')}}</p>
        <p>{{$t('sms.imptips2')}}</p>
        <p>{{$t('sms.imptips3')}}</p>
        <p>{{$t('sms.imptips4')}}</p>
        <p>{{$t('sms.imptips5')}}</p>
        <p>{{$t('sms.imptips6')}}</p>
        <p>{{$t('sms.imptips7')}}</p>
        <p>{{$t('sms.imptips8')}}</p>
        <p>{{$t('sms.imptips9')}}</p>
        <div class="img-wrap">
          <img src="../img/sms_template_import_eg.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'siAddTemplate',
    data () {
      return {
        uploadUrl: '/importAction',
        uploadHeaders: {
          action: 'importTemplateSms',
          sessionId: this.$store.state.session.sessionId
        }
      }
    },
    methods: {
//        上传前 配置上传参数
      beforeUpload (file) {
        this.uploadHeaders.key = 'file'
        this.uploadHeaders.name = file.name
        let arr = file.name.split('.')
        let arrType = ['xls', 'xlsx']
        if (arrType.indexOf(arr[arr.length - 1]) !== -1) {
          return true
        } else {
          this.$message.error(this.$t('sms.uploadFileWrong'))
          return false
        }
      },
//      上传成功
      handleSuccess (response, file, fileList) {
        this.$message.success(this.$t('sms.importTaskSubmited'))
        this.$store.commit('sms/REFRESH_LEFT', 'refreshLeft')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl"
  .si-add-template
    margin-left 341px
    height calc(100vh - 116px)
    padding-bottom 20px
    h2
      line-height 49px
      padding-left 20px
      font-size 14px
      color $cf-gray1
      border-bottom 1px solid #d9d9d9
    .el-tabs__nav
      line-height 59px
    .wrap
      height calc(100vh - 202px)
      overflow auto
      padding 20px
      .btn-wrap
        padding-bottom 10px
        overflow hidden
        .temp-download
          float left
          background-color #7bcdd2
          border 1px solid #7bcdd2
          font-size 12px
          padding 6px
          a
            color #fff
        .temp-upload
          float left
          display inline-block
          margin-left 20px
          .temp-upload-btn
            background-color #1abb9c
            border 1px solid #1abb9c
            color #fff
            font-size 12px
            padding 6px
      .instructions
        clear both
        font-size 12px
        line-height 22px
        color $cf-blue
      .img-wrap
        text-align center
</style>
