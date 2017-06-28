<template>
  <el-col :span="36" class="comment">
    <div class="add-ramark" @click.stop="showRemarkDiv">
      <i class="iconfont icon-beizhu"></i><span @click="showRemarkDiv">{{$t('public.addRemarks')}}</span>
    </div>
    <div v-show="isshow">
      <!--<header>-->
        <!--<h3>{{$t('business.businessRemark')}}</h3>-->
      <!--</header>-->
      <main style="padding-top: 5px;">
        <el-form label-position="top" :model="ruleForm"  ref="ruleForm"  class="approval-form">
          <b-textarea v-on:tellme="tellme" type="textarea" :label="''" :default="defalut" require="required" :id="'backInfo'" :clear="clear"></b-textarea>
        </el-form>
        <div class="wrapper">
          <el-button type="primary" @click.stop="excuteBusinessComentAction" class="ui-pass">{{$t('public.save')}}</el-button>
          <el-button @click.stop="cancel" type="warning" class="ui-back">{{$t('public.cancel')}}</el-button>
        </div>
      </main>
    </div>
  </el-col>
</template>
<script>
  import BTextarea from './base/Btextarea.vue'
  import {getCurrentDateTime} from '../../../../utils/m7Utils'
  import * as types from '../../../../store/modules/business/mutation-types.js'
  export default {
    name: 'businessComment',
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
        isshow: false,
        clear: ''
      }
    },
    methods: {
      tellme (val) {
        Object.assign(this.form, val)
      },
      cancel () {
        this.isshow = false
      },
      excuteBusinessComentAction () {
        let self = this
        for (let i in this.form) {
          if (this.form[i] === false) {
            return
          }
        }
        this.$store.dispatch('addBusinessBackInfo', this.form).then(() => {
          self.isshow = false
//          this.$emit('event', {event: 'commentAction', data: {_id: this.business._id, customer: this.business.customer}})
          let data = {
            'businessId': self.business._id,
            'step': self.business.step,
            'action': 'comment',
            'excuteData': {
              'backInfo': self.form.backInfo
            },
            'time': getCurrentDateTime(),
            'master': self.$store.state.session.user._id
          }
          self.$store.commit(types.ADD_BUSINESS_ACTION_HISTORY, {data})
        })
      },
      showRemarkDiv () {
        this.isshow = true
        this.clear = Math.random()
      }
    },
    beforeMount () {
    }
  }
</script>
<style lang="stylus" scoped>
  @import '../../../../assets/common.styl'
  .el-button
    padding 6px 0
  .comment
    padding 20px 0 0
  header
    padding 10px 0
    text-align center
    h3
      display inline-block
      color $cf-gray1
  main
    .el-col
      margin-top 20px
    &:after
      content ''
      display block
      clear both
    .wrapper
      float right
      margin-top 5px
      .ui-pass
        background-color #7bcdd2
        border 1px solid #7bcdd2
      .ui-back, .ui-pass
        width 90px
        @extend .font12
  .add-ramark
    cursor pointer
    width 150px
    color $cf-gray1
    .iconfont
      fontsize 20px
      margin-right 5px
      color #1bbc9b
</style>
