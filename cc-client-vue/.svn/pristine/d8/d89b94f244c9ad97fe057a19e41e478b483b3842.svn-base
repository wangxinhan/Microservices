<template>
  <div class="verification_box">
    <div class="verification_ul">
      <div class="verification_li" v-for="(text, index) in inputData">
        <span>{{text}}</span>
        <span class="delete_email iconfont icon-guanbi" @click="deleteText(index)"></span>
      </div>
      <input v-if="validate === 'Email'" v-model.trim="inputText" @blur="addText" @keyup.enter="addText" type="text" :placeholder="placeholder"/>
    </div>
  </div>
</template>
<script>
  import {checkform} from '../../../utils/validate'
  import * as m7Utils from '../../../utils/m7Utils.js'
  export default {
    name: 'InputTag',
    props: {
      placeholder: String,
      inputData: Array,
      validate: String
    },
    data () {
      return {
        inputText: ''
      }
    },
    methods: {
      deleteText (index) {
        if (index > -1) {
          this.inputData.splice(index, 1)
          this.$emit('inputChange', this.inputData)
        }
      },
      addText () {
        let val = m7Utils.deepClone(this.inputText)
        if (!val.trim()) {
          return
        }
        let match = checkform(val, this.validate)
        if (match) {
          this.$message.error(this.$t(match))
        } else {
          this.inputData.push(val)
          this.inputText = ''
          this.$emit('inputChange', this.inputData)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .verification_box
    width 100%
    box-sizing border-box
    border 1px solid #e7e7e7
    border-radius 2px
    min-height 28px
    padding 4px 6px 0
    background #fff
  input
    width 160px
    border none
    background transparent
    display inline-block
    vertical-align middle
    margin 0 4px 4px 0
  .verification_li
    background #D1F6F8
    position relative
    padding-right 16px
    float left
    line-height 18px
    margin 0 4px 4px 0
    .delete_email
      float left
      color $c-main
      font-size 12px
      position absolute
      line-height 20px
      right 0
      top 0
      cursor pointer
  .verification_ul
    display block
    overflow hidden
    max-height 42px
</style>
