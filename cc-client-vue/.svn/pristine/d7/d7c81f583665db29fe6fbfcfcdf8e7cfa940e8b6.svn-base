<template>
  <div>
    <div class="content">{{$t('km.content')}}</div>
    <div class="file-upload">
      <el-upload
        :action="uploadUrl"
        :data=uploadHeaders
        name="upload"
        accept=".doc,.docx,.xls,.xlsx"
        :on-preview="handlePreview"
        :with-credentials="true"
        :on-success="handleSuccess"
        :before-upload="beforeUploadfile"
        :on-remove="handleRemove"
        :default-file-list="fileList">
        <em class="add-file">{{$t('km.addFile')}}</em>
        {{$t('km.fileDescription')}}
      </el-upload>
    </div>
    <div class="quill">
      <quill-editor ref="editor" :editdata="editdata" @submitContent="submitContent"></quill-editor>
    </div>
    <div class="attachment-upload">
      <el-form label-position="right" :rules="rules" ref="form" :model="form">
        <el-form-item label="上传附件" :prop="rulesValue()">
          <el-button type="text" class="iconfont icon-fujian" id="uploadKmFile" :disabled="disabled"></el-button><span class="upload-size">（大小不超过10M）</span>
          <div v-for="(file, index) in form.kmFile" v-if="form.kmFile.length">
            <a :href="file.id+'?attname='+file.name" download>{{file.name}}</a>
            <el-button @click="deleteFile(file.id, index)" :disabled="disabled">{{$t('public.delete')}}</el-button>
          </div>
          <input type="hidden" v-model.trim="form.kmFile"/>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import quillEditor from 'components/business-modules/km/km-detail/QuillEditor.vue'
  import {uploadTo7moorKmDomain, uploadTo7moorKmImgDomain} from '../../../../utils/qiniuUtils'
  import {getCurrentDate} from '../../../../utils/m7Utils'
  import uuid from 'uuid'
  export default {
    name: 'QuillPublic',
    props: {
      editdata: Array,
      attachs: {type: Array, attachs: []},
      itemId: String
    },
    data () {
      let validate1 = (rule, value, callback) => {
        if (value.length === 0 || value === undefined) {
          callback(new Error(this.$t('validate.required')))
        } else {
          callback()
        }
      }
      return {
        uploadUrl: '/kmUpload',
        uploadHeaders: {
          type: 'undefined',
          module: '',
          sessionId: this.$store.state.session.sessionId
        },
        subContent: [],
        form: {
          kmFile: this.attachs
        },
        rules: {
          kmFile: [
            {validator: validate1, required: true, trigger: 'change'}
          ]
        }
      }
    },
    watch: {
      form: {
        deep: true,
        handler: function (newV, oldV) {
        }
      }
    },
    methods: {
      beforeUploadfile (file) {
        let arr = file.name.split('.')
        let arrType = ['doc', 'docx', 'xls', 'xlsx']
        if (arrType.indexOf(arr[arr.length - 1]) !== -1) {
          if (file.size > 2 * 1024 * 1024) {
            this.$message.error(this.$t('km.attachSizeOverLimit2'))
            return false
          } else {
            return true
          }
        } else {
          this.$message.error('上传的文件不匹配')
          return false
        }
      },
      handleSuccess (response, file, fileList) {
        let split = response.filePath.split('/')
        let length = split.length - 1 // 线上环境不能写死2，而是最后一级
        let obj = {
          fileName: split[length],
          trueName: response.fileName
        }
        this.$store.dispatch('uploadDoc', obj).then((val) => {
          let uploadDoc = this.$store.state.km.uploadDoc
          if (uploadDoc) {
            this.editdata.content = uploadDoc.html
            this.editdata.fileId = uploadDoc.fileId
            this.subContent.fileId = uploadDoc.fileId
            this.subContent.content = uploadDoc.html
            this.$refs.editor.content = uploadDoc.html
            console.log(uploadDoc.fileId)
            this.$emit('submitContent', this.subContent)
          }
        })
      },
      submitContent (submitContent) {
        this.subContent.content = submitContent
        this.$emit('submitContent', this.subContent)
      },
      rulesValue () {
        if (this.require === 'required') {
          return 'kmFile'
        } else {
          return ''
        }
      },
      initUploadKmFile (ev) {
        let account = this.$store.state.session.user.account
        let that = this
        let filters = {}
        let fileAdded = function (up, files) {
          console.log('fileAdd')
        }
        let beforeUpload = function (up, file) {
          console.log('beforeUpload')
        }
        let uploadProgress = function (up, file) {
          console.log('uploadProgress')
        }
        let uploadComplete = function () {
          that.$emit('kmFile', that.form.kmFile)
          console.log('uploadComplete')
        }
        let fileUploaded = function (up, file, info) {
          let domain = up.getOption('domain')
          let res = JSON.parse(info)
          let sourceLink = domain + res.key // 获取上传成功后的文件的Url
          let obj = {
            name: file.name,
            id: sourceLink
          }
          if (that.form.kmFile) {
            that.form.kmFile.push(obj)
          } else {
            that.form.kmFile = []
            that.form.kmFile.push(obj)
          }
        }
        let error = function (up, err, errTip) {
          if (err.code === -600) {
            that.$message.error('最大上传文件为10M')
          }
          console.log('uploadError ' + errTip)
        }
        let key = function (up, file) {
          let date = getCurrentDate()
          let today = new Date()
          let time = today.getTime()
          let key = account + '/km/' + date + '/' + time + '/' + uuid.v1()
          return key
        }
        uploadTo7moorKmDomain(this.$store.state.session.user._id, 'uploadKmFile', filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploaded, error, key)
      },
      initUploadImageFile () {
        let account = this.$store.state.session.user.account
        let self = this
        let fileAdded = function (up, files) {
          console.log('fileAdd')
        }
        let beforeUpload = function (up, file) {
          console.log('beforeUpload1')
        }
        let uploadProgress = function (up, file) {
          console.log('uploadProgress1')
        }
        let uploadComplete = function (up, file) {
          console.log('uploadComplete1')
        }
        let fileUploaded = function (up, file, info) {
          let domain = up.getOption('domain')
          let res = JSON.parse(info)
          let sourceLink = domain + res.key // 获取上传成功后的文件的Url
          if (!self.$refs.editor.content) {
            self.$refs.editor.content = ''
          }
          self.$refs.editor.content += `<img src="${sourceLink}">`
        }
        let error = function (up, err, errTip) {
          if (errTip) {
            self.$message.error(errTip)
          }
          console.log('uploadError ' + errTip)
        }
        let key = function (up, file) {
          let date = getCurrentDate()
          let today = new Date()
          let time = today.getTime()
//          let fileName = file.name
//          let fileSuffix = ''
//          if (fileName) {
//            fileSuffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
//          }
          let key = account + '/km/' + date + '/' + time + '/' + uuid.v1()
          return key
        }
        let filters = {
          mime_types: [
            {title: 'Image files', extensions: 'jpg,jpeg,gif,png,bmp'}
          ]
        }
        uploadTo7moorKmImgDomain(this.$store.state.session.user._id, 'kmUploadImageFile', filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploaded, error, key)
      },
      deleteFile (fileId, index) {
        let _id = fileId.split('.')[2]
        let key = ''
        let split = _id.split('/')
        for (let i = 1; i <= split.length - 1; i++) {
          if (i < split.length - 1) {
            key += split[i] + '/'
          } else {
            key += split[i]
          }
        }
        let kmFile = this.form.kmFile
        let attach = {}
        for (let i = 0; i < kmFile.length; i++) {
          let id1 = kmFile[i].id.split('.')[2]
          let key1 = ''
          let split1 = id1.split('/')
          for (let i = 1; i <= split1.length - 1; i++) {
            if (i < split1.length - 1) {
              key1 += split1[i] + '/'
            } else {
              key1 += split1[i]
            }
          }
          if (key1 !== key) {
            attach[key1] = kmFile[i].name
          }
        }
        console.log(attach)
        let data = {
          _id: this.itemId,
          attachs: attach,
          delId: key
        }
        this.$emit('kmFile', this.form.kmFile)
        this.$store.dispatch('delAttach', data).then((res) => {
          this.form.kmFile.splice(index, 1)
        })
      },
      initAttachs () {
        for (let i = 0; i < this.attachs.length; i++) {
          let attach = this.attachs[i]
          let obj = {
            name: attach.split(':')[1],
            id: attach.split(':')[0]
          }
          this.form.kmFile.push(obj)
        }
      }
    },
    create () {
      this.initAttachs()
    },
    mounted () {
      this.initUploadKmFile()
      let value = this.form.kmFile
      if (this.require === 'required') {
        this.$refs.form.validate((valid) => {
          if (valid) {
          } else {
            value = false
          }
        })
      }
      let btn = document.getElementsByClassName('ql-kmUpLoadFile')[0]
      let name = btn.className
      btn.className = name + ' iconfont icon-tupianicon'
      btn.id = 'kmUploadImageFile'
      this.initUploadImageFile()
      this.$emit('tellme', {[this.id]: value})
    },
    components: {
      quillEditor
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl";
  .content
    color $cf-gray1
    padding-bottom 5px
  .file-upload
    .el-upload
      color $cf-gray3
      width auto
      .add-file
        font-style normal
        color #1abb9c
  .quill
    margin 10px 0 10px
  .attachment-upload
    margin-bottom 30px
    .icon-dakailianjie
      color #1abb9c
      padding-left 15px
  .upload-size
    color $cf-gray3
    font-size 12px
</style>
