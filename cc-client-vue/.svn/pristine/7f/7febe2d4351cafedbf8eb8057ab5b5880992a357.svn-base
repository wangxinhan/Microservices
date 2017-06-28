<template>
      <el-form label-position="top" :rules="rules" ref="form" :model="form" class="padding-b">
        <el-form-item :label="label" prop="value">
          <el-input size="small" v-model.trim.number="form.value" :disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
</template>
<script>
//  import {checkform} from '../../../../../utils/validate.js'
  export default {
    name: 'Bnumber',
    props: {
      label: String,
      default: {type: '', default: ''},
      id: String,
      disabled: {type: '', default: false},
      require: String
    },
    data () {
      let self = this
      let validate1 = (rule, value, callback) => {
        if (self.require !== 'no') {
          if (value === '') {
            callback(new Error(self.$t('validate.required')))
          }
        }
        if (typeof value === 'number' || value === '') {
          callback()
        } else {
          callback(new Error('必须为数字'))
        }
      }
      return {
        form: {
          value: this.default ? this.default - 0 : ''
        },
        rules: {
          value: [
            {validator: validate1, trigger: 'blur'}
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
          this.$refs.form.validate((valid) => {
            if (valid) {
            } else {
              value = false
            }
          })
          self.$emit('tellme', {[self.id]: value})
        }
      }
    },
    methods: {
      rulesValue () {
        if (this.require === 'no') {
        } else {
          this.rules.value[0].required = true
        }
      }
    },
    beforeMount () {
      this.rulesValue()
    },
    mounted () {
      let value = this.form.value
      let self = this
      this.$refs.form.validate((valid) => {
        if (valid) {
        } else {
          value = false
        }
      })
      self.$emit('tellme', {[self.id]: value})
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../../assets/common.styl";
  .padding-b
    padding-bottom $padding5
</style>
