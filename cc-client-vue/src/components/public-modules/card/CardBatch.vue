<template>
<div>
  <span class="option" v-for="item in batch.operator" @click="handlerClick(item.action)">
    <i :class="item.class"></i>{{$t(item.name)}}
  </span>
  <span class="count">{{$t('public.already')}}<b>{{ batch.checkedCount }}</b>{{$t('public.term')}} <i class="el-icon-close"  @click="checkNone()"></i></span>
</div>
</template>
<script type="text/javascript">
  /**
   * CardBatch 卡片列表批处理组件
   * @author liujing
   * @path components/public-modules/card/CardBatch.vue
   *
   * @property {Object} batchOperator - 当前业务下的批量操作
   * @property {string} tabType - 当前业务
   *
   * @example
   *  <card-batch v-if="batchOperator"
      :tabType="tabType"
      :batchOperator="[
              {
                name: 'public.export',
                class: 'icon-daochu1',
                action: 'exportExcel'
              },
              {
                name: 'public.exportTask',
                class: 'icon-piliang',
                action: 'exportTask'
              }
            ]"
      @exportExcel="exportExcel"
      @exportTask="exportTask"
      @checkNone="checkNone"
      ></card-batch>
   */
  export default {
    name: 'CardBatch',
    props: {
      tabType: String,
      batchOperator: Object
    },
    data () {
      return {
        loading: true,
        checked: false,
        isCheckbox: false,
        isCall: true,
        value: '',
        callStatus: '',
        visible: false
      }
    },
    computed: {
      batch () {
        let temp = this.batchOperator
        for (let i = 0; i < temp.operator.length; i++) { // 饿了么组件不需要iconfont
          temp.operator[i].class = temp.operator[i].class === 'iconfont icon-shanchu' ? temp.operator[i].class : temp.operator[i].class + ' iconfont'
        }
        return temp
      }
    },
    methods: {
      handlerClick (action) { // 每一个批量动作
        this.$emit(action)
        if (action === this.deteleAction) {
          this.visible = false
        }
      },
      checkNone () { // X关闭
        this.$emit('checkNone')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .batch
    display none
    align-items center
    width calc(100vw - 65px - 10px)
    height 60px
    padding-left 10px
    background rgba(255,255,255,0.9)
    position fixed
    z-index 1990
    border-top 1px solid #d5d5d5
    right 0
    bottom 0
    box-shadow 1px 3px 12px rgba(0,0,0,0.1)
    font-size 14px
    color $cf-level3
</style>
