<template>
  <div class="c-group">
    <el-tabs v-model="activeName" :active-name="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="tabPane in tabPanes" :label="tabPane.name" :name="tabPane.type" :class="{tabheight: activeName === 'cdr_call' || activeName === 'webchat_todo' || activeName === 'email_todo'}">
        <slot :name="'search_'+tabPane.type" v-if="tabPane.type===activeName"></slot>
        <div class="card-list" v-if="tabPane.type===activeName" v-loading="cardLoading" :element-loading-text="$t('public.loadingText')">
          <slot :name="'cardList_'+tabPane.type"></slot>
        </div>
      </el-tab-pane>
      <div class="">
        <slot name="pagination"></slot>
      </div>
    </el-tabs>
    <!--<div class="pagination">-->
      <!--<slot name="pagination"></slot>-->
    <!--</div>-->
  </div>
</template>
<script>
  export default {
    name: 'CardGroup',
    data () {
      return {
      }
    },
    props: {
      tabPanes: Array, // 对应业务模块的卡片 tab
      activeName: String, // 默认点击 tab
      cardLoading: Boolean
    },
    methods: {
      handleClick (tab, event) {
        let paths = this.$route.path.split('/')
        this.$router.push(`/index/${paths[2]}`)
        this.$emit('handleClick', tab.name)
      }
    },
    beforeMount () {
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common"
.c-group
  position relative
  .el-tab-pane
    display flex
    flex-flow column
    height calc(100vh - 128px)
    background #fafafa
  .card-list
    flex 1
    overflow auto
    background #fff
  .pagination
    position absolute
    top 7px
    right 0px
    height 36px
    white-space nowrap
  .paginationNew
    position: absolute;
    bottom: -36px;
    height: 35px;
    width: 339px;
    margin-left: 1px;
    box-shadow: 0px -4px 6px -4px rgba(0,0,0,0.2);
    background: #fff;
    white-space: nowrap;
  .tabheight
    height calc(100vh - 92px)
</style>
