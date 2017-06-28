<template>
  <div>
    <el-menu
      @select="handleSelect"
      :router="active"
      class="el-menu-vertical-demo">
      <el-menu-item style="padding: 0" v-for="(item, index) in cardList" :index="handleSplit(item._id)" :class="{'is-active': $route.path.split('/')[4] === item._id}">
        <webchat-card
          :item="item"
          class="card"
          :tabType="tabType"
        >
        </webchat-card>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import WebchatCard from './WebChatCard.vue'
  export default {
    name: 'WebchatCardList',
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
      type: String,
      tabType: String
    },
    data () {
      return {
        active: true // 是否使用路由
      }
    },
    computed: {
//      defaultActive () {
//        let _idObj = this.cardList
//        if (_idObj) {
//          if (_idObj.length > 0) {
//            let _id = _idObj[0]._id
//            return '/index/' + this.type + '/' + this.tabType + '/' + _id
//          }
//        }
//      }
    },
    methods: {
      // 按照 卡片的_id不同设置不同路由
      handleSplit (index) {
        return '/index/' + this.type + '/' + this.tabType + '/' + index
      },
      handleSelect (index) {
        console.log('select list card')
      }
    },
    components: {
      CustomerAvatar,
      WebchatCard
    },
    beforeMount () {
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common.styl"
.el-menu-item
  height auto
  line-height inherit
  padding 0
.is-active
  background-color red
.el-menu-item.is-active
  background-color #e8f5fc
</style>
