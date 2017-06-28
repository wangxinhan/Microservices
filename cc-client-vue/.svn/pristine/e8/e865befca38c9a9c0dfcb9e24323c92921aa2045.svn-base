<template>
  <el-form label-position="top" :rules="rules" ref="form" :model="form" class="padding-b">
    <el-form-item :label="label" :prop="rulesValue()">
      <el-radio-group v-model.trim="form.value">
        <el-radio size="small" :label="option.key" v-for="option in options" :disabled="disabled">{{option.name}}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
<script>
  import {getCache} from '../../../../../utils/m7Utils.js'
  export default {
    name: 'Bradio',
    props: {
      span: Number,
      label: String,
      default: {type: ''},
      id: String,
      dic: {type: ''},
      disabled: {type: '', default: false},
      require: String
    },
    data () {
      return {
        form: {
          value: this.default
        },
        rules: {
          value: [
            {required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      form: {
        deep: true,
        handler: function (newV, oldV) {
          let value = newV.value
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
    computed: {
      options () {
        let dic = getCache('options', this.dic)
        if (dic) {
          return dic.options
        } else {
          return ''
        }
      }
    },
    methods: {
      rulesValue () {
        if (this.require === 'required') {
          return 'value'
        } else {
          return ''
        }
      }
    },
    mounted () {
      let value = this.form.value
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
</script>
<style lang="stylus" scoped>
  @import "../../../../../assets/common.styl";
  .padding-b
    padding-bottom $padding5
</style>
