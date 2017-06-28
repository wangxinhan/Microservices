<template>
  <el-row :gutter="20" class="padding-b">
    <el-col :span="24/cascade">
      <el-form label-position="top" :rules="rules" ref="form1" :model="form1">
        <el-form-item :label="options?options.headers[0]:''"  :prop="rulesValue(1)">
          <el-select size="small"  v-model.trim="form1.value1" :placeholder="$t('business.chooseDate')" @change="change1" :disabled="disabled" class="width-full">
            <el-option value="" label="--请选择--"></el-option>
            <el-option v-if='options && options.options' v-for="(item, index) in options.options" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24/cascade">
      <el-form label-position="top" :rules="rules" ref="form2" :model="form2" v-if="cascade === '2'||cascade === '3'">
        <el-form-item :label="options?options.headers[1]: ''"  :prop="rulesValue(2)">
          <el-select size="small"  v-model.trim="form2.value2" :placeholder="$t('business.chooseDate')" @change="change2" :disabled="disabled" class="width-full">
            <el-option value="" label="--请选择--"></el-option>
            <el-option v-if='options && options.options' v-for="(item, index) in subordinate1" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24/cascade">
      <el-form label-position="top" :rules="rules" ref="form3" :model="form3" v-if="cascade === '3'">
        <el-form-item :label="options?options.headers[2]:''"   :prop="rulesValue(3)">
          <el-select size="small"  v-model.trim="form3.value3" :placeholder="$t('business.chooseDate')" @change="change3" :disabled="disabled" class="width-full">
            <el-option value="" label="--请选择--"></el-option>
            <el-option v-if='options && options.options' v-for="(item, index) in subordinate2" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
  import {getCache} from '../../../../../utils/m7Utils.js'
  export default {
    name: 'BSelect',
    props: {
      label: String,
      default: {type: ''},
      id: String,
      dic: {type: ''},
      disabled: {type: '', default: false},
      require: String,
      showOut: {type: ''}
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
        subordinate1: [],
        subordinate2: [],
        form1: {
          value1: this.default[0]
        },
        form2: {
          value2: this.default[1]
        },
        form3: {
          value3: this.default[2]
        },
        rules: {
          value1: [
            {validator: validate1, required: true, trigger: 'change'}
          ],
          value2: [
            {validator: validate1, required: true, trigger: 'change'}
          ],
          value3: [
            {validator: validate1, required: true, trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      change1 (key) {
        let value = key
        if (this.require === 'required') {
          this.$refs.form1.validate((valid) => {
            if (valid) {
            } else {
              value = false
            }
          }, this.form1.value1)
        }
        this.$emit('tellme', {[this.id]: value})
        this.form2.value2 = ''
        this.form3.value3 = ''
        if (this.cascade > 1) {
          if (this.require === 'required') {
            this.$emit('tellme', {[this.id + '_1']: false})
          } else {
            this.$emit('tellme', {[this.id + '_1']: ''})
          }
        }
        if (this.cascade > 2) {
          if (this.require === 'required') {
            this.$emit('tellme', {[this.id + '_2']: false})
          } else {
            this.$emit('tellme', {[this.id + '_2']: ''})
          }
        }
        if (!this.options) {
          return
        }
        for (let i = 0; i < this.options.options.length; i++) {
          let item = this.options.options[i]
          if (item.key === key) {
            this.subordinate1 = item.options || []
            break
          } else {
            this.subordinate1 = []
          }
        }
        this.subordinate2 = []
      },
      change2 (key) {
        let value = key
        if (this.require === 'required') {
          this.$refs.form2.validate((valid) => {
            if (valid) {
            } else {
              value = false
            }
          })
        }
        this.$emit('tellme', {[this.id + '_1']: value})
        this.form3.value3 = ''
        if (this.cascade > 2) {
          if (this.require === 'required') {
            this.$emit('tellme', {[this.id + '_2']: false})
          } else {
            this.$emit('tellme', {[this.id + '_2']: ''})
          }
        }
        if (this.subordinate1 === []) {
          return
        }
        for (let i = 0; i < this.subordinate1.length; i++) {
          let item = this.subordinate1[i]
          if (item.key === key) {
            this.subordinate2 = item.options || []
            break
          } else {
            this.subordinate2 = []
          }
        }
      },
      change3 (key) {
        let value = key
        if (this.require === 'required') {
          this.$refs.form3.validate((valid) => {
            if (valid) {
            } else {
              value = false
            }
          })
        }
        this.$emit('tellme', {[this.id + '_2']: value})
      },
      rulesValue (n) {
        if (this.require === 'required') {
          return 'value' + n
        } else {
          return ''
        }
      }
    },
    computed: {
      options () {
        return getCache('options', this.dic)
      },
      cascade () {
        let dic = getCache('options', this.dic)
        if (dic) {
          return dic.cascade.toString()
        } else {
          return '未配置'
        }
      }
    },
    watch: {
//      'showOut': function () {
//        if (this.require === 'required') {
//          this.$refs.form1.validate((valid) => {
//            if (valid) {
//              this.$emit('tellme', {[this.id]: this.form1.value1})
//            } else {
//              this.$emit('tellme', {[this.id]: false})
//            }
//          })
//        }
//      }
    },
    beforeMount () {

    },
    mounted () {
      this.$nextTick(() => {
        this.form1.value1 = this.default[0]
        this.change1(this.default[0])
        if (this.cascade > 1) {
          this.form2.value2 = this.default[1]
          this.change2(this.default[1])
        }
        if (this.cascade > 2) {
          this.form3.value3 = this.default[2]
          this.change3(this.default[2])
        }
      })
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../../assets/common.styl";
  .padding-b
    padding-bottom 8px
  .width-full
    width 100%
</style>
