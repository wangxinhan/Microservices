<template>
      <el-form label-position="top" :rules="rules" ref="form" :model="form" class="padding-b">
        <el-form-item :label="label" :prop="rulesValue()">
          <el-input size="small" v-model.trim="form.value" type="textarea" :disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
</template>
<script>
  export default {
    name: 'Btextarea',
    props: {
      label: String,
      default: {type: '', default: ''},
      id: String,
      disabled: {type: '', default: false},
      require: String,
      clear: ''
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
      },
      clear () {
        this.form.value = ''
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
