<template>
    <div class="nomal">
      <el-input
        size="small"
        :placeholder="placeHolder"
        icon="search"
        @keyup.native.enter="handlerClick"
        v-model.trim="nomalForm.query"
        :on-icon-click="handlerClick">
      </el-input>
    </div>
</template>
<script>
    export default {
      name: 'InputSearch',
      props: {
        placeHolder: String,
        form: Object
      },
      data () {
        return {
          input: ''
        }
      },
      methods: {
        handlerClick () {
          this.$emit('quickSearch', this.nomalForm.query)
        },
        handlerChange (inputText) {
          this.input = inputText
        }
      },
      computed: {
        nomalForm () {
          return this.form
        }
      }
    }
</script>
<style lang="stylus" scoped>
@import "../../../../assets/common"
.nomal
  margin 0 33px 0 10px
  flex 8
  .n-btn
    i
      font-size 18px
      color #ccc
</style>
