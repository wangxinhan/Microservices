<template>
    <el-form label-position="top" :rules="rules" ref="form" :model="form" class="padding-b">
      <el-form-item :label="label" :prop="rulesValue()" :required="this.require === 'required' ? true:false">
        <el-date-picker size="small"
                v-model.trim="form.value"
                type="date"
                :editable="boolean"
                :placeholder="$t('business.chooseDate')"
                :disabled="disabled">
        </el-date-picker>
      </el-form-item>
    </el-form>
</template>
<script>
  export default {
    name: 'Bdate',
    props: {
      label: String,
      default: {type: '', default: ''},
      id: String,
      disabled: {type: '', default: false},
      require: String
    },
    data () {
      let validate1 = (rule, value, callback) => {
        if (value === '' || value === undefined) {
          callback(new Error(this.$t('validate.required')))
        } else {
          callback()
        }
      }
      return {
        form: {
          value: this.default
        },
        boolean: false,
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
          let value = ''
          if (newV.value) {
            value = newV.value.getFullYear() + '-' + (newV.value.getMonth() + 1) + '-' + newV.value.getDate()
          }
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
