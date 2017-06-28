<template>
  <div class="new-add">
    <div>{{$t('km.title')}}</div>
    <el-input size="small"
      value=""
      v-model.trim="input"
      class="title-input">
    </el-input>
    <quillPublic :editdata="editdata" @submitContent="submitContent" @kmFile="kmFile"></quillPublic>
    <div class="button">
      <el-button @click.stop="cancel">{{$t('public.cancel')}}</el-button>
      <el-button type="primary" @click.stop="submit">{{$t('km.submit')}}</el-button>
    </div>
  </div>
</template>
<script>
  import quillPublic from 'components/business-modules/km/km-detail/QuillPublic.vue'
  export default {
    name: 'kmNewAdd',
    props: ['addId'],
    data () {
      return {
        input: '',
        subContent: '',
        attachs: {},
        editdata: []
      }
    },
    methods: {
      cancel () {
        this.input = ''
        this.subContent = ''
        this.$emit('cancel')
      },
      submit () {
        let route = this.$route.params
        if (this.input === '') {
          this.$message.error('标题不能为空')
          return
        }
        if (!this.subContent.content) {
          this.$message.error('内容不能为空')
          return
        }
        let data = {
          title: this.input,
          content: this.subContent.content,
          kmType: route.kmType,
          fileId: this.subContent.fileId,
          attachs: this.attachs,
          cid: route.kmId || ''
        }
        this.$store.dispatch('saveItem', data).then(rep => {
          if (rep.success) {
            this.$emit('addKm')
            this.$message.success(this.$t('km.issueSuccess'))
          } else {
            this.$message.error(this.$t('km.issueFail'))
          }
        })
      },
      submitContent (submitContent) {
        this.subContent = submitContent
      },
      kmFile (kmFile) {
        let attach = {}
        for (let i = 0; i < kmFile.length; i++) {
          let id = kmFile[i].id.split('.')[2]
          let key = ''
          let split = id.split('/')
          for (let i = 1; i <= split.length - 1; i++) {
            if (i < split.length - 1) {
              key += split[i] + '/'
            } else {
              key += split[i]
            }
          }
          attach[key] = kmFile[i].name
        }
        this.attachs = attach
      }
    },
    components: {
      quillPublic
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl";
  .new-add
    color $cf-gray1
    .title-input
      width 390px
      margin 7px 0 20px
      input
        color #252525
    .button
      margin-bottom 100px
      text-align right
      .cancel, .submit
        background-color #7bcdd2
        width 90px
        color #fff
        margin-right 20px
      .submit
        background-color #1abb9c
        margin-right 0
  .close
    display none
  .open
    display block
</style>
