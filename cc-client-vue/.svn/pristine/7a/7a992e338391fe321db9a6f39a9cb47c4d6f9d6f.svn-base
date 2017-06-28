<template>
  <div>
    <!-- <el-menu
      :default-active="defaultActive"
      @select="handleSelect"
      :router="active"
      class="el-menu-vertical-demo">
      <el-menu-item style="padding: 0" v-for="(item, index) in cardList" :index="handleSplit(item._id, item.CUSTOMER_ID)" :class="{'is-active': $route.path.split('/')[4] === item._id}">
        <call-card
          :item="item"
          :tabType="tabType"
          class="card"
          >
        </call-card>
      </el-menu-item>
    </el-menu> -->


    <call-card
      :cardList="cardList"
      :tabType="tabType"
      :type="type"
      class="card"
      >
    </call-card>
  </div>
</template>
<script>
  import CallCard from './CallCard.vue'
  export default {
    name: 'Card',
    /**
     * [props 该组件所需要的参数]
     * @type {
     *   cardList    相关业务的crad数组
     *   type        业务类型
     *   count       卡片条数
     * }
     */
    props: {
      cardList: Array,
      tabType: String,
      type: String
    },
    data () {
      return {
        active: true, // 是否使用路由
        customer: {}
      }
    },
    computed: {
      defaultActive () {
        let _idObj = this.cardList
        if (_idObj) {
          if (_idObj.length > 0) {
            let _id = _idObj[0]._id
            let custmoerId = _idObj[0].CUSTOMER_ID
            return '/index/' + this.type + '/' + this.tabType + '/' + _id + '/' + custmoerId
          }
        }
      }
    },
    methods: {
      // 按照 卡片的_id不同设置不同路由
      handleSplit (index, custmoerId, obj) {
        return '/index/' + this.type + '/' + this.tabType + '/' + index + '/' + custmoerId
      },
      handleSelect (index) {
      }
    },
    components: {
      CallCard
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .el-menu-item
    height auto
    line-height inherit
</style>

