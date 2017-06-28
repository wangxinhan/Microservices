<template>
  <el-form label-position="top" :rules="rules" ref="form" :model="form" class="padding-b">
    <el-form-item :label="label" :prop="rulesValue()">
      <el-button class="iconfont icon-fujian" :id="btnId" :disabled="disabled" type="text"></el-button>
      <div v-for="(file, index) in form.busFile" v-if="form.busFile.length">
        <a :href="qiniu7moorDomain+file.id+'?attname='+file.name" download>{{file.name}}</a>
        <el-button @click="deleteFile(file.id, index)" :disabled="disabled">{{$t('public.delete')}}</el-button>
      </div>
      <input type="hidden" v-model.trim="form.busFile"/>
    </el-form-item>
  </el-form>
</template>
<script>
  import {uploadTo7moorDomain, qiniu7moorDomain} from '../../../../../utils/qiniuUtils'
  import {getCurrentDate} from '../../../../../utils/m7Utils'
  import uuid from 'uuid'
  export default {
    name: 'Bfile',
    props: {
      label: String,
      default: {type: Array, default: []},
      disabled: {type: '', default: false},
      id: String,
      require: String
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
        btnId: uuid.v1(),
        form: {
          busFile: this.default
        },
        rules: {
          busFile: [
            {validator: validate1, required: true, trigger: 'change'}
          ]
        },
        qiniu7moorDomain: qiniu7moorDomain
      }
    },
    watch: {
      form: {
        deep: true,
        handler: function (newV, oldV) {
          let value = newV.busFile
          let self = this
          if (this.require === 'required') {
            this.$refs.form.validate((valid) => {
              if (valid) {
              } else {
                value = false
              }
            })
          }
          self.$emit('tellme', {[self.id]: value})
        }
      }
    },
    methods: {
      rulesValue () {
        if (this.require === 'required') {
          return 'busFile'
        } else {
          return ''
        }
      },
      initUploadBusFile (ev) {
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
          console.log('uploadComplete')
        }
        let fileUploaded = function (up, file, info) {
          let res = JSON.parse(info)
          let obj = {
            name: file.name,
            type: file.type,
            id: res.key
          }
          that.form.busFile.push(obj)
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
          let fileName = file.name
          let fileSuffix = ''
          if (fileName) {
            fileSuffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length)
          }
          let key = account + '/business/' + date + '/' + time + '/' + uuid.v1() + fileSuffix
          return key
        }
        uploadTo7moorDomain(this.$store.state.session.user._id, this.btnId, filters, fileAdded, beforeUpload, uploadProgress, uploadComplete, fileUploaded, error, key)
      },
      deleteFile (fileId, index) {
        let data = {
          _id: '',
          field: this.id,
          fileId: fileId
        }
        this.$store.dispatch('delBusAttach', data).then((res) => {
          this.form.busFile.splice(index, 1)
        })
      }
    },
    mounted () {
      this.initUploadBusFile()
      let value = this.form.busFile
      if (this.require === 'required') {
        this.$refs.form.validate((valid) => {
          if (valid) {
          } else {
            value = false
          }
        })
      }
      this.$emit('tellme', {[this.id]: value})
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../../assets/common.styl";
  .padding-b
    padding-bottom $padding5
</style>
