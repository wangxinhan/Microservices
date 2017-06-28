<template>
  <div class="workbench-planninglist">
    <div class="workbench-title">
      {{ $t("public.contactPlan") }}
    </div>
    <div class="workbench-planninglist-content">
      <ul class="planninglist-table">
        <li v-for="list in this.planningListNew" >
          <div class="planninglist-time">
            <span class="planninglist-icon" v-bind:class="list.result.type"></span><span class="planninglist-time-right">{{list.time}}</span>
          </div>
          <div class="planninglist-customer" @click.stop="plan(list._id,list.customer)">
            {{list.customer}}
          </div>
          <div class="planninglist-remark" v-text="list.remark">
          </div>
        </li>
      </ul>
      <div v-if="planningListNew.length === 0" class="no-plan">暂无联系计划</div>
    </div>
  </div>
</template>
<script>
  //    import Workbench from './components/workbench/workbench.vue'
  import {getNotifyDate} from '../../../utils/customerUtils.js'
  export default {
    name: 'workbenchplanninglist',
    props: ['planningList'],
    data () {
      return {
      }
    },
    computed: {
      planningListNew () {
        let arr = []
        this.planningList.forEach(function (item) {
          let obj = {}
          obj.time = item.time
          obj.remark = item.remark
          obj.customer = item.customer
          obj._id = item._id
          obj.result = getNotifyDate(item.time)
          arr.push(obj)
        })
        return arr
      }
    },
    methods: {
      plan (_id, name) {
        this.$router.push({path: '/index/customer/customer_plan/' + _id, query: {custName: name}})
        this.$store.commit('customer/REFRESH_LEFT', Math.random())
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import '../../../assets/common.styl'
  @import "styl/_workbench.styl"
  .workbench-planninglist
    float  left
    width  calc(45% - 12px)
    margin  5px
    border  1px solid #e7e7eb
    height  380px
    background  #fff
  .workbench-planninglist-content
    height calc(100% - 48px)
    overflow auto
  .workbench-planninglist-content li
    height  31px
    color $cf-gray3

  .planninglist-table
    padding  25px 25px 15px
    font-size  12px
    line-height  12px
    li
      &:last-of-type
        .planninglist-icon:after
          content  ""
          width  0
          height  0
  .planninglist-table div
    @extend .ellipsis
    height  inherit

  .planninglist-icon
    display  block
    width  13px
    height  13px
    border-radius  50%
    position  absolute
    float  left
  .planninglist-icon:after
    content  ""
    display  block
    position  absolute
    width  1px
    height  16px
    left  6px
    top  14px
    background-color  #e8e8e8
  .today-action
    background-color #f4a524
  .overdue
    background-color #fd7777
  .usable
    background-color #999
  .planninglist-time-right
    width 100%
    padding-left 22px
    @extend .ellipsis
    float left
  .planninglist-time
    width 35%
    padding-right  15px
    position  relative
    float  left
    box-sizing  border-box
    @extend .ellipsis
  .planninglist-customer
    width 20%
    padding-right  15px
    float  left
    box-sizing  border-box
    cursor pointer
    color #0062b8
    @extend .ellipsis
  .planninglist-remark
    width 45%
    float  left
    @extend .ellipsis
  .no-plan
    color #c0c0c0
    padding-left 20px
  </style>
