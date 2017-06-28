<template>
<div v-if="!loading">
  <div v-if="custType.type==='customer'">
  <div v-if="custType.type==='customer'">
  <div class="loading"
    v-loading="loading"
    element-loading-text="拼命加载中"
    v-if="loading">
  </div>
  <div v-if="customer" class="summary" style="position:inherit">
    <el-col :span="24" class="innerwrap">
      <div class="c_info">
        <div class="cust-type">
          <span class="ct"></span>
        </div>
        <div class="name">
          <h3>{{ customer.name }}</h3>
          <div class="source">
            <span>
              <edit-customer-info></edit-customer-info>
            </span>
            <span>
              <show-customer-info></show-customer-info>
            </span>
            <span>
              <i class="iconfont icon-quxiaoguanlian"></i>
            </span>
          </div>
        </div>
        <div class="status">
          <el-dropdown trigger="click">
            <span class="type">
              {{ status[customer.status] }}<i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for=" sta in status ">{{sta}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click">
            <span class="type">
              来源渠道<i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="contact">
          <span class="info">
            <phone :type1="type1"></phone>
          </span>
          <span class="info">
            <phone :type2="type2"></phone>
          </span>
          <span class="info">
            <email></email>
          </span>
          <span class="agent">
            <img src="./img/agent.png" alt="agent_name" />
          </span>
          <el-dropdown trigger="click">
            <span class="type">
              王金龙7008<i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </div>
    </el-col>
    <div class="remark">{{ customer.title }}</div>
    <fun-tab
      :customer="custType"
    ></fun-tab>
  </div>
  </div>
  <div v-else>
    <div class="summary">
      <el-col :span="24" class="innerwrap">
        <div class="loading" v-if="loading">
          Loading...
        </div>
        <div v-if="customer" class="content">
          <div class="c_info">
            <div class="cust-type">
              <span class="ct"></span>
            </div>
            <div class="name">
              <h3>{{ customer.name }}</h3>
              <div class="source">
            <span>
              <edit-customer-info></edit-customer-info>
            </span>
            <span>
              <show-customer-info></show-customer-info>
            </span>
            <span>
              <i class="iconfont icon-quxiaoguanlian"></i>
            </span>
              </div>
            </div>
            <div class="status">
              <el-dropdown trigger="click">
            <span class="type">
              金牌客户<i class="el-icon-arrow-down"></i>
            </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>黄金糕</el-dropdown-item>
                  <el-dropdown-item>狮子头</el-dropdown-item>
                  <el-dropdown-item>螺蛳粉</el-dropdown-item>
                  <el-dropdown-item>双皮奶</el-dropdown-item>
                  <el-dropdown-item>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown trigger="click">
            <span class="type">
              来源渠道<i class="el-icon-arrow-down"></i>
            </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>黄金糕</el-dropdown-item>
                  <el-dropdown-item>狮子头</el-dropdown-item>
                  <el-dropdown-item>螺蛳粉</el-dropdown-item>
                  <el-dropdown-item>双皮奶</el-dropdown-item>
                  <el-dropdown-item>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="contact">
          <span class="info">
            <phone :type1="type1"></phone>
          </span>
          <span class="info">
            <phone :type2="type2"></phone>
          </span>
          <span class="info">
            <email></email>
          </span>
          <span class="agent">
            <img src="./img/agent.png" alt="agent_name" />
          </span>
            <el-dropdown trigger="click">
            <span class="type">
              王金龙7008<i class="el-icon-arrow-down"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
      </el-col>
      <div class="remark">{{ remark }}</div>
      <fun-tab
              :customer="custType"
              ></fun-tab>
    </div>
    </div>
  </div>
</div>
</template>
<script>
  import Phone from './Phone'
  import Email from './Email'
  import FunTab from './FunTab'
  import EditCustomerInfo from './EditCustomerInfo'
  import ShowCustomerInfo from './ShowCustomerInfo'

  function getCustDetail (store, _id, type, tabType) {
    let data = {_id: _id, type: type, tabType: tabType}
    return store.dispatch('queryCustomerInfo', data)
  }
  function getCallDetail (store, _id, type) {
    let data = {data: _id, type: type}
    return store.dispatch('getSelectedCallInfo', data)
  }
  function getBusDetail (store, _id, type) {
    let data = {data: {_id: _id}, type: type}
    return store.dispatch('getBusinessDetailById', data)
  }
  export default {
    name: 'ContactSummary',
    data () {
      return {
        remark: '美团是中国大陆地区第一个精品团购形式的类Groupon电子商务网站。美团网在全国各个地级市都设有分站，全国基本覆盖，每天推出几款超低折扣的本地精品消费的团购服务。 网站由人人网、饭否等网站的创始人王兴于2010年1月建立，2010年3月4日正式上线',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        loading: true,
        status: null,
        custType: null,
        customer: null,
        type1: 'call',
        type2: 'talk'
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'fetchData'
    },
    components: {
      Phone,
      FunTab,
      Email,
      EditCustomerInfo,
      ShowCustomerInfo
    },
    created () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        let path = this.$route.path.split('/')
        let type = path[2]
        let tabType = path[3]
        let _id = path[4]
        this.custType = {
          type: type,
          tabType: tabType,
          _id: _id
        }
        type === 'customer' && getCustDetail(this.$store, _id, type, tabType).then((val) => {
          this.$store.dispatch('getCache', {type: 'custTmpls'}).then(custTmpls => {
            this.loading = false
            this.customer = this.$store.state[type].current[tabType].currentCustomer[_id] || this.$store.state[type].current[tabType].currentCustomer
            this.status = custTmpls[0].status
          })
        })
        if (type !== 'customer') {
          this.loading = false
        }
        type === 'business' && getBusDetail(this.$store, _id, type).then((val) => {
          this.$store.dispatch('getCache', {type: 'custTmpls'}).then(custTmpls => {
            this.loading = false
          })
        })
        type === 'call' && getCallDetail(this.$store, _id, tabType).then((val) => {
          this.$store.dispatch('getCache', {type: 'custTmpls'}).then(custTmpls => {
            this.loading = false
            let customerId = path[5]
            // 通话类型
            let relType = this.$store.state[type].current[tabType].callInfo.relocationCustomerType
            if (relType === 'one') {
              this.customer = this.$store.state[type].current[tabType].currentCustomer[customerId] || this.$store.state[type].current[tabType].currentCustomer
            } else if (relType === 'multi') {
              this.customer = {
                name: '匹配多用户'
              }
            } else if (relType === 'deleted') {
              this.customer = {
                name: '已删除用户'
              }
            } else if (relType === 'none') {
              this.customer = {
                name: '未知用户'
              }
            }
            this.status = custTmpls[0].status
          })
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '../../../assets/common.styl'
.loading
  height: 100vh
.summary:before
  content ""
  height 1px
  width 100%
  background-color $c-border1
  posa(265px,492px)
  display block
.summary
  border-bottom 1px solid $c-border1
  padding 15px 20px 0
  background-color $c-back
  .innerwrap
    display flex
    justify-content space-between
  .c_info
    float left
    max-width 49%
    height 76px
    flex 15
    .cust-type
      float left
      .ct
        display inline-block
        box-size(76px)
        margin 0 auto
        background-color $cf-white
        background-image url("./img/status0.png")
        background-size 76px
        border-radius 38px
    .name
      display flex
      height 60%
      margin-left 15px + 76px
      color $cf-level3
      align-items center
      white-space nowrap
      h3
        display inline
    .status
      height 40%
      margin-left 15px + 76px
      line-height 30px
      .el-dropdown
        padding-right 20px
    .source
      display inline
      width 105px
      margin-left 10px
      span
        display inline-block
        border 1px solid  $c-main
        width 22px
        height 22px
        line-height 22px
        text-align center
        border-radius 12px
        margin-left 4px
        cursor pointer
      // background url("./img/operation.png") no-repeat center 5px
      //  background-size 12px auto
      // span:nth-child(2)
      //   background-position center -14px
      // span:nth-child(3)
      //   background-size 16px auto
     //   background-position center -49px
.iconfont
  font-size 14px
  color #1abb9c
.contact
  width 340px
  max-width 49%;
  height 76px
  float right
  box-sizing border-box

  display flex
  align-items center
  span.agent
  span.info
    display inline-block
    box-size(46px)
    border-radius 23px
    margin-right 5px
    float right
    img
      box-size(48px)
  span.info
    border-radius 24px
    cursor pointer
    border 1px solid  $c-main
  //   background url("./img/icon.png") no-repeat center 13px
  //   background-size 22px auto
  // span.info:nth-child(2)
  //   background-position center -27px
  // span.info:nth-child(3)
  //   background-position center -64px
  div
    display inline-block
    float right
.remark
  float left
  width 100%
  height 48px
  overflow hidden
  padding 10px 0 0
  color $cf-level2
  line-height 24px
.type
  cursor pointer
  color $cf-level2
  .el-icon-arrow-down
    padding-left 5px
</style>
