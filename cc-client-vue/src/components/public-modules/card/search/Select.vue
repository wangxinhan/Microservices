<template>
  <el-form :model="formStacked">
   <el-select size="small" class="select" v-model.trim="formStacked.value"  placeholder="全部" @change="handleChange">
    <el-option
      class="ss-el-option"
      v-for="item in selectOptions"
      :label="item.label"
      :value="item.value">
    </el-option>
   </el-select>
  </el-form>
</template>
<script>
  export default {
    name: 'Select',
    data () {
      return {
        loading: false,
        value2: ''
      }
    },
    props: {
      selectOptions: Array,
      form: Object
    },
    methods: {
      handleChange (value) {
        this.$emit('quickSelect', value)
      }
    },
    computed: {
      formStacked () {
        return this.form
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .el-input
    font-size 12px
  .select
  .nomal
    border-radius 4px
  .select
    width 70px
    margin-left 10px
    flex 3
    color #333
</style>
