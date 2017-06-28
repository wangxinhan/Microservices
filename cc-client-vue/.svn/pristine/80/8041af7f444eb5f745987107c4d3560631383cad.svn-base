<template>
  <div class="questionHistory" v-loading="loading">
    <el-row v-if="!loading" class="block-col-2">
      <el-col :span="13" class="til">
        <span class="clock">
          <i class="iconfont icon-zongshichang"></i>
        </span>
        共{{count}}条沟通记录
      </el-col>
    <!-- 录音和备注弹窗开始 -->
      <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('call.listenAudio')" v-model.trim="listent" size="tiny">
        <audio controls="" :src ="recordUrl" __audio_auto_play=""></audio>
      </el-dialog>
      <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('public.editComments')" v-model.trim="edit" size="tiny">
        <span slot="footer" class="dialog-footer">
          <el-button @click="edit = false">{{$t('public.cancel')}}</el-button>
          <el-button type="primary" @click="">{{$t('public.confirm')}}</el-button>
        </span>
      </el-dialog>
    <!-- 录音和备注弹窗结束 -->
      <el-col :span="24" class="line">
        <ul class="border">
        <template v-for="con in cons" >
          <li v-if="con.detail==1" class="treat">
            <span class="ico" :class="con.sclass">
              <strong class="iconfont" :class="con.type"></strong>
            </span>
            <h3>
              {{con.sort}}
              <agent :id="con.agent" :isNum="false"></agent>
              <template v-if="con.recordFile">
                <span class="time" @click.stop="popup(con.recordServer, con.recordFile)">
                  <span class="play">
                    <strong class="pla"></strong>
                  </span>
                </span>
              </template>
              <span>
                <call-type :code="con.contentType"></call-type>
              </span>
            </h3>
            <p>
              <call-status :status="con.status"></call-status>
            </p>
          </li>
          <li v-if="con.detail==2" class="treat">
            <span class="bac"></span>
            <i></i>
            <h3 class="date"><span>{{con.sort}}</span>{{con.status}}
            </h3>
          </li>
          </li>
        </template>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import CallStatus from 'components/public-modules/cache/CallStatus.vue'
  import CallType from 'components/public-modules/cache/CallType'
  import Agent from '../../public-modules/cache/Agent'
  export default {
    data () {
      return {
        count: 0,
        time: [{type: '', name: this.$t('public.all')}, {type: 'week', name: this.$t('public.last7Days')}, {type: 'month', name: this.$t('public.last1Month')}, {type: 'month3', name: this.$t('public.last3Month')}],
        listent: false,
        recordUrl: '',
        recordFile: '',
        edit: false,
        callScreen: false,
        loading: true,
        _id: ''
      }
    },
    components: {
      CallStatus,
      CallType,
      Agent
    },
    computed: {
      questionHistory () {
        return this.$store.state.questionnaire.current.history
      },
      historyCount () {
        return this.$store.state.questionnaire.current.historyCount
      }
    },
    methods: {
      fetchData (data) {
        if (!data) {
          data = {
            _id: this.cid
          }
        }
        return this.$store.dispatch('showActiveHistory', data).then(() => {
          let valArr = this.questionHistory
          let indexArr = []
          let newArr = []
          let newVal = {}
          valArr.forEach((item, index, array) => { // 将数据重新分组
            newVal[item.OFFERING_TIME.split(' ')[0]] = newVal[item.OFFERING_TIME.split(' ')[0]] || []
            newVal[item.OFFERING_TIME.split(' ')[0]].push(item)
          })

          for (let key in newVal) {
            newArr.push(newVal[key])
            indexArr.push(key)
          }
//          this.count = this.historyCount
          this.count = valArr.length
          let i = 0
          let j = 0
          let cons = []
          for (; i < indexArr.length; i++) {
            let obj = {}
            for (j = 0; j < newArr[i].length; j++) {
              let item = newArr[i][j]
              let creatDate = item.OFFERING_TIME.split(' ')[0]
              obj = {
                sort: `${item.OFFERING_TIME.split(' ')[1].substring(0, 5)}  `,
                status: item.STATUS,
                date: creatDate,
                contentType: item.CONNECT_TYPE,
                agent: item.DISPOSAL_AGENT,
                recordFile: item.RECORD_FILE_NAME,
                recordServer: item.FILE_SERVER,
                sclass: item.STATUS, // 是灰色还是彩色，业务状态
                type: 'icon-waihu', // 业务类型icon判断
                detail: 1,
                callType: item.type
              }
              cons.push(obj)
            }
            let is = indexArr[i].split('-')
            obj = {
              sort: `${is[1]}/`,
              status: is[2],
              detail: 2
            }
            cons.push(obj)
          }
          this.cons = cons
          this.loading = false
        })
      },
      loadMore () {
        let data = {
          customer: this.cid,
          date: this.filterTime,
          type: this.filterType,
          businessType: '',
          page: ++this.nextPage,
          limit: 10
        }
        this.fetchData(data)
      },
      popup (server, file) {
        let local = window.location.href
        if (local.indexOf('https') > -1) { // 更换录音访问地址头
          let userPbx = this.$store.state.session.user.pbx
          let pbxList = this.$store.state.session.dicMap.pbx
          for (let i = 0; i < pbxList.length; i++) {
            if (pbxList[i]._id === userPbx) {
              if (server) {
                if (pbxList[i].assDomain) {
                  server = pbxList[i].assDomain
                }
              }
            }
          }
        }
        this.recordUrl = server + '/' + file
        this.listent = true
      }
    },
    props: {
      cid: String,
      refresh: String
    },
    watch: {
      refresh (cur, old) {
        if (cur === 'history') {
          this.fetchData()
        }
      }
    },
    created () {
      if (this.refresh === 'history') {
        this.fetchData(null)
      }
    }
  }
</script>
<style lang="stylus" scoped>
.questionHistory
  height calc(100vh - 175px)
  overflow-y auto
.right
  float right
  text-align right
  margin-right 10px
.icon-beizhu
  font-size 12px
  color #8bcef5
.null
  color #d4d4d4
.el-row
  margin 0 auto
.clock
  display inline-block
  position  relative
  top  1px
  width 14px
  height 16px
  line-height 16px
  margin-right 8px
  .iconfont
    font-size 14px
.el-dropdown-link
  color #4ec5ab
.el-button
  /*padding  0*/
  span
    display inline-block
    width  14px
    height 14px
    background #f00
.til
  color #999
  font-size 12px
  margin-left 10px
.line
  border-top 1px solid #eeeff2
  padding-top  30px
  margin-top  14px
  .treat
    position relative
    padding 0px 0 0 38px
    margin-left 56px
    border-left 1px solid #d3d3d3
    font-size 0
    min-height 54px
    i
      position absolute
      display inline-block
      width 32px
      border-bottom 1px solid #e6e6e6
      top 24px
      left 6px
    img
      position relative
      top -4px
      margin 0 4px
    span
      display inline-block
    .bac
      height 12px
      width 54px
      background #fff
      margin 4px 0
      position absolute
      left -48px
      top 14px
      &:before
        content ""
        width 12px
        height 12px
        display inline-block
        float right
        border-radius 6px
        background-color #d3d3d3
    .ico
      width: 32px
      height: 32px
      line-height 32px
      position: absolute
      z-index 10
      left: -16px
      top: 4px
      border-radius 50%
      border 1px solid #d4d4d4
      color #d4d4d4
      text-align center
      background #fff
      .iconfont
        font-size 20px
        font-weight normal
    .note
      color #f3a720
      border-color #f3a720
    .callin
      color #44b7b2
      border-color #44b7b2
    .callout
      color #44b7b2
      border-color #44b7b2
    .webchat
      color #44b7b2
      border-color #44b7b2
    .email
      color #d498e9
      border-color #d498e9
    .buss
      color #e3746b
      border-color #e3746b
    .geton
      border-color #f6b549
      .iconfont
        color #f6b549
    .finish
      border-color #bbb
      .iconfont
        color #bbb
    .by
      border-color #e3746f
      .iconfont
        color #e3746f
    .goline
      border-color #b3b3b3
      .iconfont
        color #b3b3b3
    .get_on
      border-color #45b6b0
      top 22px
      .iconfont
        color #45b6b0
    .last
      background-color #fff
      background-position right top
      height 22px
      top 20px
    p
     font-size 12px
     color #b0b0b0
    .notes
      display inline-block
      width calc(100% - 400px)
      .write
        width 14px
        height 14px
        position relative
        top 2px
        cursor pointer
      .memo
        padding 3px 10px
        margin-left 8px
        color #fff
        background #65bef2
        border-radius 2px
        position relative
        top 2px
        width calc(100% - 50px)
        &:before
          content ''
          width 0px
          height 0px
          border 6px solid transparent
          border-right-color #65bef2
          position absolute
          left -12px
          top 5px
    h3
      display: inline-block
      padding: 4px 0
      width: 340px
      font-size 14px
      color #333
      /*text-overflow:ellipsis
      overflow:hidden
      white-space: nowrap*/
      span
        display: inline-block
        position: relative
        font-weight: normal
      .time
        bottom: 2px
        border-radius: 4px
        padding: 4px
        background: #7bcdd2
        font-size: 12px
        color: #fff
        margin-left: 26px
        .play
          width: 14px
          height:14px
          line-height 14px
          border 1px solid #fff
          border-radius 50%
          .pla
            display inline-block
            width 0
            height 0
            border 4px solid #fff
            border-color:transparent transparent transparent #fff;
            /*margin-left 5px*/
            /*margin-top 3px*/
            position relative
            top 0px
            left 6px
      .succes
        margin-left:18px
        width: 20px
        height: 20px
        top: 2px
        .iconfont
          font-size 20px
          color #5cbfba
    .date
      color #fff
      height 24px
      width 70px
      line-height 24px
      background #d4d4d4
      text-align center
      border-radius 8px
      margin-top 12px
      span
        font-size 18px
  li
    &:first-child
      border-left 0
      &:before
        content ""
        width 1px
        height 60px
        display inline-block
        position absolute
        top 35px
        left 0
        background-color #d3d3d3
    &:last-child
      margin-bottom: 60px
      height: 20px
</style>
