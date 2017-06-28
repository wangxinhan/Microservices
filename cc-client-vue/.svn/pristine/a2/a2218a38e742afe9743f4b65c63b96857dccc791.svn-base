<template>
  <div class="km-keyword-search-form">
      <div class="search">
        <div class="pd">
          <span class="plus" @click="plus">
            <i class="el-icon-plus"></i>
            {{$t('public.add')}}11{{tableData}}
          </span>
          <span class="delete">
            <i class="el-icon-close"></i>
            {{$t('public.delete')}}
          </span>
        </div>
        <el-input size="small" :placeholder="$t('km.keywordSearch')" style="width: 250px;">
          <el-button slot="prepend" icon="search"></el-button>
        </el-input>
      </div>
      <div class="page">
        <span class="currentpage">2/132</span>
        <el-pagination small layout="prev, next">
        </el-pagination>
      </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        props: ['tableData'],
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {
      onSubmit () {
        console.log('submit!')
      },
      plus () {
        this.click = !this.click
        console.log(this.click)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl";
  .km-keyword-search-form
    height 36px
    padding 9px 14px
    color $cf-gray1
    border 1px solid #dddddd
    border-bottom none
    .search
      float left
      color $cf-gray1
      .pd
        display inline-block
        float left
        line-height 36px
        span
          margin-right 20px
          cursor pointer
    .page
      float right
      .currentpage
        display inline-block
        float left
        line-height 36px
      .el-pagination
        float left
        padding 7px 5px
</style>
