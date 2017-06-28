<template>
  <el-col :span="24" class="back">
    <affix :label="this.$t('business.returnBusiness')">
      <main>
        <el-form label-position="top" :model="ruleForm"  ref="ruleForm"  class="approval-form">
          <b-textarea v-on:tellme="tellme" :label="$t('business.returnReason')" require="required" :id="'backInfo'"></b-textarea>
          <el-button type="primary" @click.stop="excuteBusinessBackAction" class="ui-pass" :disabled="disabledBtn">{{$t('business.cReturnBusiness')}}</el-button>
        </el-form>
      </main>
    </affix>
  </el-col>
</template>
<script>
  import BTextarea from './base/Btextarea.vue'
//  import {getCache} from '../../../../utils/m7Utils.js'
  export default {
    name: 'businessBack',
    props: {
      tabName: String,
      business: Object
    },
    components: {
      BTextarea
    },
    data () {
      return {
        form: {
          _id: this.business._id
        },
        disabledBtn: false
      }
    },
    methods: {
      tellme (val) {
        Object.assign(this.form, val)
      },
      excuteBusinessBackAction () {
        for (let i in this.form) {
          if (this.form[i] === false) {
            return
          }
        }
        this.$emit('event', {event: 'backAction', data: {_id: this.business._id, customer: this.business.customer, form: this.form}})
//        this.disabledBtn = true
//        this.$store.dispatch('excuteBusinessBackAction', this.form).then(() => {
//          self.disabledBtn = false
//          debugger
//        })
      }
    },
    beforeMount () {
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/common.styl'
  .back
    padding 20px 0 0
  header
    text-align center
    padding 10px 0
    h3
      display inline-block
      color $cf-level2
  main
    .el-col
      margin-top 20px
    &:before
      content ''
      clear both
    .ui-pass
      float right
      width 90px
      margin-top 5px
      padding 6px 0
      @extend .font12
      background-color #7bcdd2
      border 1px solid #7bcdd2
</style>
