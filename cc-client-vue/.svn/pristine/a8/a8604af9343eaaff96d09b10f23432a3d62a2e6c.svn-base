<template>
  <div v-if="!cardloading"  class="question-card" v-loading="loading" :element-loading-text="$t('public.loadingText')">
    <el-menu
      @select="handleSelect"
      :router="active"
      class="el-menu-vertical-demo">
      <el-menu-item class="card"
                    style="padding:0 10px;"
                    v-for="(item, index) in cardListRender"
                    :index="handleSplit(item._id)"
                    :class="{'is-active': $route.path.split('/')[4] === item._id}">
          <div class="tempName">
            <div class="tempNamewarp" :alt="item.tempName">
              {{item.tempName}}
            </div>
          </div>
          <div class="call">
            <div>
              <span class="name">{{ item.name }}</span>
              <span class="phone">{{ item.phone }}</span>
            </div>
            <p class="ownerName">{{ item.displayOwner }}</p>
            <div class="status">
              <span class="b-type" :class="'b-'+item.status">
                {{item.statusName}}
              </span>
              <span class="b-time" v-if="item.notifyTime">
                <i class="el-icon-time"></i>
                {{
                  item.notifyTime.split(' ')[0].split('-')[1]+
                  '-'+item.notifyTime.split(' ')[0].split('-')[2]+
                  ' '+item.notifyTime.split(' ')[1].substring(0,5)
                }}
              </span>
            </div>
          </div>
      </el-menu-item>
    </el-menu>
    <no-record v-if="cardListRender && cardListRender.length<=0"></no-record>
  </div>
</template>
<script>
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import NoRecord from 'components/public-modules/card/NoRecord'
  export default {
    name: 'BusinessCard',
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
      tabType: String,
      loading: Boolean,
      condition: Object
    },
    data () {
      return {
        active: true, // 是否使用路由
        cardloading: true,
        checked: false,
        finish: 'b-step',
        noName: false
      }
    },
    computed: {
      cardListRender () {
        return this.cardList
      }
    },
    methods: {
      name (name) {
        let noName
        if (!name) {
          noName = true
        } else {
          noName = false
        }
        return noName
      },
      // 按照 卡片的_id不同设置不同路由
      handleSplit (index) {
        return '/index/' + this.type + '/' + this.tabType + '/' + index
      },
      handleSelect (index) {
        this.$emit('changeCardItem')
      }
    },
    components: {
      CustomerAvatar,
      NoRecord
    },
    beforeMount () {
      let self = this
      Promise.all([this.$store.dispatch('getCache', {type: 'agents'})]).then(function () {
        self.cardloading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common.styl"
.question-card
  height 100%
  overflow auto
.el-menu-item
  height auto
  line-height inherit
  padding 0
  background-color #fff
.is-active
  background-color red
.el-menu-item.is-active
  background-color #e8f5fc
.card:hover
.card:active
  background-color #e8f5fc
  label
    visibility visible
.el-checkbox
  visibility hidden
.e-ch-show
  visibility visible
.card
  width 100%
  box-sizing border-box
  padding 0 10px
  height 80px
  border-bottom 1px solid #efeef3
  display flex
  cursor pointer
  align-items center
  span
    display inline-block
  .icon
    flex 0 0 46px
    height 46px
    line-height: 46px;
    border-radius 50%
    position relative
    margin  0 12px 0 0
    i
      display inline-block
      width 22px
      height 22px
      position absolute
      top 30px
      left 26px
      background #0f0
  .call
    display inline-block
    font-size 0px
    .ownerName
      height 22px
      font-size 12px
      color $cf-gray3
    span
      display inline-block
      color $cf-gray0
      font-size 12px
      border-radius 3px
    .name
      display inline-block
      max-width 100px
      font-size 14px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
    .phone
      margin-left 10px
      max-width 110px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      height 20px
      line-height 23px
      box-sizing border-box
    .status
      overflow hidden
      display flex
      .receive
        width 60px
        @extend .ellipsis
      .tasktome
        color #1abb9c
        font-weight bold
      .b-type
        text-align center
        padding 0px 10px
        color #fff
        height 20px
        line-height 20px
        margin-right 10px
      .b-uncomplete
        background #f5a522
        max-width: 100px
        text-overflow: ellipsis
        overflow: hidden
      .b-uncomfirm
        background #e37470
        max-width: 100px
        text-overflow: ellipsis
        overflow: hidden
      .b-complete
        background #7acdd1
        max-width: 100px
        text-overflow: ellipsis
        overflow: hidden
      .b-confirm
        background #e37470
        max-width: 100px
        text-overflow: ellipsis
        overflow: hidden
      .b-time
        background #7ccdd1
        padding 0 5px
        line-height 22px
        color #fff
      .el-icon-time
        margin-right 0
      .finish
        background #ccc
  .tempName
    width 60px
    height 60px
    background #65c3df
    border-radius 50%
    box-sizing border-box
    text-align center
    color #fff
    margin-right 15px
    padding 0 10px
    font-size 12px
    .tempNamewarp
      text-align center
      word-wrap break-word
      white-space normal
      position relative
      transform translate(0, -50%)
      max-height 60px
      max-width 60px
      overflow hidden
      top 50%
</style>
