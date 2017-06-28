<template>
  <div class="email-card" :class="{'email-all': tabType !== 'email_todo'}">
    <el-menu
        :default-active = "defaultActive"
        @select="handleSelect"
        :router="active"
        class="el-menu-vertical-demo">
      <el-menu-item style="padding: 0" v-for="(item, index) in cardListRender" :index="handleSplit(item._id)" :class="{'is-active': $route.path.split('/')[4] === item._id}">
        <div class="card">
          <template v-if="tabType === 'email_todo'">
            <!--<div class="cust-type" >-->
            <label class="fake-checkbox" :class="{'visible': batch.isBatchShow}" v-on:click.stop="">
              <input type="checkbox" :value="item._id" v-model.trim="item.checked" @change="checkThis(item.checked)">
              <span></span>
              <i class="fake-label"></i>
            </label>

            <span class="ct">
               <customer-avatar
                 :status="item.cust_status"
                 :size="20"
                 :queueNum="item.leakNum">
               </customer-avatar>
            </span>
            <!--</div>-->
            <div class="info">
              <ul class="email_card_todo_ul">
                <li v-if="item.subject" class="email_info_subject font14"><h4 class="ellipsis" :title="item.subject">{{ item.subject }}</h4></li>
                <li v-if="item.from.addr" class="email_info_from"><span class="ellipsis" :title="(item.custName?item.custName:item.from.name) + '<' + item.from.addr + '>'">{{item.custName?item.custName:item.from.name}}<{{item.from.addr}}></span></li>
                <li v-if="item.to.addr" class="email_info_addr"><span class="ellipsis" :title="'来自<' + item.to.addr + '>'">来自<{{item.to.addr}}></span></li>
                <li v-if="item.categoryText" class="email_info_other"><span class="ellipsis" :title="item.categoryText">{{item.categoryText}}</span></li>
              </ul>
            </div>
            <div class="remark">
              <ul>
                <li class="date_time_star">
                  <i class="el-icon-star-on" v-if="item.mailMarks && item.mailMarks.starMark ==='mark'"></i>
                  <span class="ellipsis">{{ item.chatTime }}</span>
                </li>
              </ul>
            </div>
          </template>
          <template v-else>
            <!--<div class="cust-type" >-->
            <span class="ct">
               <customer-avatar
                :size="20"
                :queueNum="item.leakNum"
                :status="item.cust_status">
               </customer-avatar>
            </span>
            <!--</div>-->
            <div class="info">
              <ul class="email_card_all_ul">
                <li v-if="item.subject" class="email_info_subject font14"><h4 class="ellipsis" :title="item.subject">{{ item.subject }}</h4></li>
                <li><span class="ellipsis" :title="(item.custName?item.custName:item.from.name) + '<' + item.from.addr + '>'">{{item.custName?item.custName:item.from.name}}<{{item.from.addr}}></span></li>
                <li v-if="item.to.addr" class="email_info_addr"><span class="ellipsis" :title="'来自<' + item.to.addr + '>'">来自<{{item.to.addr}}></span></li>
                <li v-if="item.agentName" class="email_info_other"><span class="ellipsis" :title="item.agentName">{{$t('email.handlePeople')}}{{ item.agentName }}</span></li>
              </ul>
            </div>
            <div class="remark">
              <ul>
                <li class="date">
                  <div class="date_time_star">
                    <i class="el-icon-star-on" v-if="item.mailMarks && item.mailMarks.starMark ==='mark'"></i>
                    <span class="ellipsis">{{item.chatTime}}</span>
                  </div>
                </li>
                <li><span class="ellipsis" :title="item.categoryText">{{item.categoryText}}</span></li>
                <li v-if="item.status === 'undeal'"><span class="status_undeal card_statu_li clearfix">待处理</span></li>
                <li v-if="item.status === 'deal'"><span class="status_deal card_statu_li clearfix">处理中</span></li>
                <li v-if="item.status === 'finish'"><span class="status_finish card_statu_li clearfix">已解决</span></li>
              </ul>
            </div>
          </template>
        </div>
      </el-menu-item>
    </el-menu>
    <no-record v-if="cardList && cardList.length<=0"></no-record>
    <!-- 批处理-->
    <div class="batch_cover" v-show="batch.isBatchShow"></div>
    <div class="batch_btm" v-show="batch.isBatchShow"></div>
    <div class="batch" :class="{'show': batch.isBatchShow}">
      <!--结束对话框-->
      <el-checkbox v-model.trim="batch.allChecked" @change="checkAll()">{{$t('public.checkAll')}}</el-checkbox>
      <card-batch v-if="batch.operator"
                  :tabType="tabType"
                  :batchOperator="batch"
                  @checkNone="checkNone"
                  @showFinishPopup="showFinishPopup"
      ></card-batch>
    </div>
    <end-session-box :info="batchFinish" @endSession="endSessionFun" @changeEndSiFlag="changeEndSessionFlag"></end-session-box>
  </div>
</template>
<script type="text/javascript">
  import CustomerAvatar from 'components/ui-modules/customer-avatar/CustomerAvatar'
  import CardBatch from 'components/public-modules/card/CardBatch'
  import { formatShortTime, deepClone } from '../../../utils/m7Utils.js'
  import EndSessionBox from '../../public-modules/ImEndSessionBox/EndSessionBox'
  import NoRecord from 'components/public-modules/card/NoRecord'
  export default {
    name: 'EmailCard',
    props: {
      cardList: Array,
      type: String,
      tabType: String,
      clearChecked: String
    },
    watch: {
      // clearChecked 变化 再次执行
      clearChecked: 'checkNone',
      // cardList 变化 再次执行
      cardList () {
        this.defaultActive = this.$route.path
        this.checkNone()
      },
      $route (to, form) {
        if (to.path.split('/')[2] === 'webchat') {
          this.defaultActive = to.path
        }
      }
    },
    components: {
      CustomerAvatar,
      CardBatch,
      EndSessionBox,
      NoRecord
    },
    data () {
      return {
        loading: true,
        checked: false,
        isCheckbox: false,
        noName: false,
        categoryId: '',
        agentId: '',
        active: true, // 是否使用路由
        batch: {
          batchItem: [],
          allChecked: false,
          isBatchShow: false,
          checkedCount: 0,
          operator: [
            {name: 'public.finish', class: 'icon-wancheng1', action: 'showFinishPopup'}
          ]
        },
        batchFinish: {
          isActiveOne: '999',
          isActiveTwo: '999',
          isActiveThree: '999',
          endOptionsUl: [],
          majorstwo: [],
          majorsthree: [],
          endSessionActive: [],
          endSessionFlag: false,
          dialogTableVisible: false,
          endSessionLength: 0
        }
      }
    },
    computed: {
      cardListRender () {
        for (let i = 0; i < this.cardList.length; i++) {
          let item = this.cardList[i]
          item.categoryText = this.categoryText(item)
          item.agentName = this.agentName(item)
          item.chatTime = this.chatTime(item)
        }
        return this.cardList
      },
      showCard () {
        return this.$store.state.showCard
      }
    },
    methods: {
      showAllCheckbox (event) {
        this.$store.commit('showCard', this.checked)
      },
      handleSplit (index) {
        return '/index/' + this.type + '/' + this.tabType + '/' + index
      },
      handleSelect (index) {
        this.$emit('changeCardItem')
      },
      categoryText (item) {
        let result = ''
        let categoryList = this.$store.getters.dicMap.mailCategorys || []
        for (var i = 0; i < categoryList.length; i++) {
          if (categoryList[i]._id === item.category) {
            result = categoryList[i].categoryName
          }
        }
        return result
      },
      agentName (item) {
        let result = ''
        let agentList = this.$store.getters.dicMap.agents || []
        for (var i = 0; i < agentList.length; i++) {
          if (agentList[i]._id === item.agent) {
            result = agentList[i].displayName
          }
        }
        return result
      },
      chatTime (item) {
        let shortTime = formatShortTime(item.createTime)
        return shortTime.name
      },
      getChecked () { // 单选获取数组
        return this.cardList.filter(item => item.checked).map((item) => {
          return {_id: item._id, sid: item.from.addr}
        })
      },
      checkThis (checked, event) { // 单个选中传送数组和展示批量
        let checkedArr = this.getChecked()
        let isBatchShow = checkedArr.length > 0
        this.batch.allChecked = checkedArr.length === this.$store.state.email.todoNum
        this.batch.batchItem = checkedArr
        this.batch.isBatchShow = isBatchShow
        this.batch.checkedCount = checkedArr.length
      },
      checkAll () { // 全选&取消全选
        this.batch.isBatchShow = this.batch.allChecked
        this.cardList.forEach((item) => {
          item.checked = this.batch.allChecked
        })
        this.batch.batchItem = this.getChecked()
        this.batch.checkedCount = this.batch.allChecked ? this.$store.state.email.todoNum : 0
      },
      checkNone () {
        this.batch.allChecked = false
        this.batch.batchItem = []
        this.batch.isBatchShow = false
        this.cardList.forEach((item) => {
          item.checked = false
        })
      },
      showFinishPopup () {
        getChannelDic(this.$store).then((res) => {
          let _dics = []
          res.forEach((item) => {
            if (item.type === 'email') {
              _dics = item.options || []
            }
          })
          if (_dics.length === 0) {
            this.$message.error(this.$t('email.isNullByFinishKey'))
            return
          }
          let two = false
          let three = false
          this.batchFinish.endSessionLength = 1
          _dics.forEach((item) => {
            if (!item.options) {
              item.options = []
            } else if (item.options.length) {
              two = true
            }
            item.options.forEach((secondItem) => {
              if (!secondItem.options) {
                secondItem.options = []
              } else if (secondItem.options.length) {
                three = true
              }
            })
          })
          if (two) {
            this.batchFinish.endSessionLength = 2
            if (three) {
              this.batchFinish.endSessionLength = 3
            }
          }
          this.batchFinish.endOptionsUl = _dics
          this.batchFinish.dialogTableVisible = true
          this.batchFinish.majorstwo = []
          this.batchFinish.majorsthree = []
          this.batchFinish.endSessionActive = []
          this.batchFinish.isActiveOne = ''
        })
      },
//      cascadeDisplay (data, flag, index) {
//        let that = this
//        if (flag === 'one') {
//          that.batchFinish.endOptionsUl.forEach(function (d) {
//            if (d.name === data) {
//              that.batchFinish.endSessionFlag = false
//              that.batchFinish.majorstwo = d.options
//              that.batchFinish.isActiveOne = index
//              that.batchFinish.majorsthree = []
//              that.batchFinish.isActiveTwo = ''
//              that.batchFinish.isActiveThree = ''
//              if (that.batchFinish.majorstwo.length) {
//                that.batchFinish.endSessionFlag = false
//              } else {
//                that.batchFinish.endSessionFlag = true
//              }
//              that.batchFinish.endSessionActive[0] = index
//            }
//          })
//        }
//        if (flag === 'two') {
//          that.batchFinish.majorstwo.forEach(function (d) {
//            if (d.name === data) {
//              that.batchFinish.majorsthree = d.options
//              that.batchFinish.isActiveTwo = index
//              that.batchFinish.isActiveThree = ''
//              if (that.batchFinish.majorsthree.length) {
//                that.batchFinish.endSessionFlag = false
//              } else {
//                that.batchFinish.endSessionFlag = true
//              }
//              that.batchFinish.endSessionActive[1] = index
//            }
//          })
//        }
//        if (flag === 'three') {
//          that.batchFinish.majorsthree.forEach(function (d) {
//            if (d.name === data) {
//              that.batchFinish.isActiveThree = index
//              that.batchFinish.endSessionFlag = true
//              that.batchFinish.endSessionActive[2] = index
//            }
//          })
//        }
//      },
      endSessionFun (flag) {
        if (flag) {
          if (this.batchFinish.endSessionFlag === false) {
            this.$message.error('请选择结束会话分类')
            return
          } else {
            let arr = this.batchFinish.endSessionActive
            let actName = ''
            let finishKey = ''
            if (arr.length > 2) {
              let one = arr[0]
              let two = arr[1]
              let three = arr[2]
              actName = this.batchFinish.endOptionsUl[one].options[two].options[three].name
              finishKey = this.batchFinish.endOptionsUl[one].options[two].options[three].key
            } else if (arr.length === 2) {
              let one = arr[0]
              let two = arr[1]
              actName = this.batchFinish.endOptionsUl[one].options[two].name
              finishKey = this.batchFinish.endOptionsUl[one].options[two].key
            } else {
              let one = arr[0]
              actName = this.batchFinish.endOptionsUl[one].name
              finishKey = this.batchFinish.endOptionsUl[one].key
            }
            let data = {
              finishReason: actName,
              finishKey: finishKey,
              finishiArr: deepClone(this.batch.batchItem)
            }
            finishSession(this.$store, data).then(() => {
              this.$router.replace({path: '/index/email'})
            })
            this.batchFinish.dialogTableVisible = false
            this.batchFinish.endSessionActive = []
            this.batchFinish.endSessionFlag = false
            this.checkNone()
          }
        } else {
          this.batchFinish.endSessionFlag = false
          this.batchFinish.dialogTableVisible = false
        }
      },
      changeEndSessionFlag (value) {
        this.batchFinish.endSessionFlag = value
      }
    },
    beforeMount () {}
  }
  function finishSession (store, data) {
    return store.dispatch('finishEmailSession', data)
  }
  function getChannelDic (store) {
    return store.dispatch('getCache', {type: 'channelDic'})
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common.styl"
.el-menu-item
  color #999
  [class^="el-icon-"]
    margin-right 5px
.email-card
  height 100%
.el-menu-item
  height auto
  line-height inherit
  padding 0
.is-active
  background-color red
.el-menu-item.is-active
  background-color #e8f5fc
.el-menu-item.is-active
  .card
    background-color #e8f5fc
.card:hover
  background-color #e8f5fc
.card
  width 100%
  height 92px
  border-bottom 1px solid $c-border1
  background-color #fff
  display flex
  cursor pointer
  padding-left 10px
  box-sizing border-box
  .el-checkbox
    visibility hidden
  .e-ch-show
    visibility visible
  .ct
    display inline-block
    display inline-block
    box-sizing border-box
    padding-top 26px
    margin-right 10px
  .info
    flex 9
    display flex
    align-items center
    max-width 160px
    ul
      li
        h4
          color $cf-gray1
          font-weight 500
        span
          color $cf-gray3
  .remark
    flex 3
    ul
      float right
      margin-right 14px
      li
        float right
        margin-top 10px
        text-align right
        width 100%
        .date_time_star
          position relative
          display inline-block
          box-sizing border-box
          padding-left 24px
          .el-icon-star-on
            color #f2cc47
            position absolute
            left 0
          .ellipsis
            display inline-block
  .date
    color #999

  .info
    ul
      width 100%
      li
        width 100%
        .ellipsis
          width 100%
          display inline-block
.card_statu_li
  display inline-block
  width 64px
  height 22px
  line-height 22px
  color #fff
  background #7ccdd1
  text-align center
  border-radius 4px
.status_finish
  background #cdcdcd
.status_undeal
  background #F4A622
.status_deal
  background #7ccdd1
.el-icon-star-on
  color #f2cc47
.diction-subject
    background #F9F7FC
    border 1px solid #e6e6e6
    height 148px
    overflow-y auto
    background #fff
.active
  background #e8f5fc
.tableVisibleBtn
  display inline-block
.tableVisibleBtnBox
  clear both
  text-align center
  padding-top 10px
.diction-subject
  background #F9F7FC
  border 1px solid #e6e6e6
  height 148px
  overflow-y auto
  background #fff
.dic_item_desc_session
  margin-top 8px
  text-align left
  font-weight bold
  cursor pointer
  height 20px
  line-height 20px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  position relative
.dic_item_desc_arrow
  position absolute
  right 10px
.dic_item_desc_text
  width 100%
  height 100%
  padding-left 10px
  box-sizing border-box
.dic_item_desc_radio
  position absolute
  display inline-block
  width 100%
  height 100%
  opacity 0
  cursor pointer
.card:hover
.card:active
  background-color #e8f5fc
  label
    visibility visible
label
  visibility hidden
label.visible
  visibility visible
.email_card_todo_ul
  .email_info_other
    span
      color #6bbaec!important
.fake-checkbox
  span
    top 8px
.email_info_from
    margin: -2px 0 4px;
</style>
