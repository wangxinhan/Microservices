<template>
    <el-form label-position="top" :rules="rules" ref="form" :model="form" class="padding-b">
      <el-form-item :label="label" :prop="rulesValue()">
        <el-checkbox-group v-model="form.value">
          <el-checkbox :label="option.key" v-for="option in options" :disabled="disabled">{{option.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
</template>
<script>
  import {getCache} from '../../../../../utils/m7Utils.js'
  export default {
    name: 'BCheckbox',
    props: {
      span: Number,
      label: String,
      default: {type: ''},
      id: String,
      disabled: {type: '', default: false},
      dic: {type: ''},
      require: String
    },
    data () {
      return {
        loading: true,
        form: {
          value: []
        },
        rules: {
          value: [
            {type: 'array', required: true, message: this.$t('validate.required'), trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      options () {
        let dic = getCache('options', this.dic)
        if (dic) {
          return dic.options
        } else {
          return '未配置'
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
      if (this.default[0] !== '') {
        this.form.value = this.default
      }
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
