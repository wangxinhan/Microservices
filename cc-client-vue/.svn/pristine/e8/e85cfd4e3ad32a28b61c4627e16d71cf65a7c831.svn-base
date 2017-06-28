<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="item in tableHeader"
        :prop="item.prop"
        :label="item.label"
        width=""
        v-if="item.label!== '操作'"
      >
      </el-table-column>
      <el-table-column
        v-for="item in tableHeader"
        :prop="item.prop"
        :label="item.label"
        width=""
        v-if="item.label=== '操作'"
        >
        <template scope="scope" >
          <el-button @click="handle(scope.row)" type="text" size="small">听取录音</el-button>
          <el-button type="text" @click="down" size="small" ><a v-bind:href="recordFileName(scope.row.FILE_SERVER,scope.row.RECORD_FILE_NAME)" download>下载录音</a></el-button>
          <el-button type="text" @click="look(scope.row.COMMENTS)" size="small" >查看备注</el-button>
          <el-button type="text" @click="looklog(scope.row._id)" size="small" >试听日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        msg: 1111,
        tableHeaderBefore: [
          {prop: 'CALL_NO_SHOW', label: '主叫号码'},
          {prop: 'CALLED_NO_SHOW', label: '被叫号码'},
          {prop: 'DISPOSAL_AGENT', label: '接听座席'},
          {prop: 'CONNECT_TYPE', label: '呼叫类型'},
          {prop: 'ERROR_MEMO', label: '呼入技能组'},
          {prop: 'INVESTIGATE', label: '满意度'},
          {prop: 'OFFERING_TIME', label: '呼叫时间'},
          {prop: 'GRADE_TIME', label: '质检时间'},
          {prop: 'CALL_TIME_LENGTH', label: '通话时长'},
          {prop: 'GRADE_USER', label: '质检人员'},
          {prop: 'LABELS', label: '通话标签'},
          {prop: 'SQ_LABEL', label: '服务质量标签'}
        ],
        tableHeaderAfter: [
          {prop: 'COMMENTS', label: '点评内容'},
          {prop: 'amount', label: '整体'},
          {prop: '', label: '操作'}
        ]
      }
    },
    props: ['configList', 'tableData', 'template', 'floors'],
    methods: {
      handle (value) {
        let path = this.recordFileName(value.FILE_SERVER, value.RECORD_FILE_NAME)
        this.$emit('handle', {_id: value._id, path: path})
      },
      down () {
        this.$emit('down')
      },
      look (value) {
        this.$emit('look', value)
      },
      looklog (value) {
        this.$emit('looklog', value)
      },
      recordFileName (server, name) {
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
        return server + '/' + name
      }
    },
    computed: {
      tableHeader () {
        let arr = []
        let floors = this.floors
        let renderForm = function (config) {
          config.forEach(item => {
            if (item.name.split('-').length <= floors) {
              arr.push({prop: item.name, label: item.value})
            }
            if (item.child && item.child.length > 0) {
              renderForm(item.child)
            }
          })
        }
        renderForm(this.configList)

        return this.tableHeaderBefore.concat(arr, this.tableHeaderAfter)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .search-pagination
    float right
  .quality_result
    height calc(100vh - 106px)
    padding 0 20px
    overflow scroll
    .el-input
      width inherit
    .tables
      padding-bottom 20px
    .el-dialog
      .find
        margin-bottom 20px
      .conte
        color #c1c1c1
      .el-input
        width inherit
      .el-checkbox
        color #bfbfbf
        margin-left 10px
      .search
        display inline-block
        width 108px
        height 30px
        background #72c7e3
        color #fff
        text-align center
        line-height 30px
        border-radius 2px
        cursor pointer
        background #1abb9c
    .temp
      display inline-block
      width 70px
      color #979797
      .cont
        background #f7f7f7
        height 100px
        margin-top 8px
        padding 10px
        font-size 12px
        line-height 24px
        color #b4b4b4
    .deploy
      height 48px
      line-height 48px
      color #989898
      border 1px solid #ebebeb
      border-bottom none
      padding-left 14px
      margin-top 16px
      .el-pagination
        padding 0
    .cell
      .el-button
        margin-left 0px
    .sub
      text-align right
      margin-top 30px
      .rest
      .search
        display inline-block
        width 108px
        height 30px
        background #72c7e3
        color #fff
        text-align center
        line-height 30px
        border-radius 2px
        cursor pointer
      .search
        background #1abb9c
        margin-left 24px
    .export
      margin-top 20px
    .tem
      margin-top 20px
      color #bfbfbf
      .el-row
        margin-top 16px
        line-height 36px
        .el-input
          width 100%
        .el-col-2
          width 72px
        .el-col-1
          width 20px
          margin-left 6px
    .el-radio-group
      margin-top 10px
    .el-radio
      margin 0 0 6px 20px
      .el-checkbox
        color #bfbfbf
        margin-left 10px
      .temp
        display inline-block
        width 70px
      .templ
        display inline-block
        width 70px
        margin-left 10px
      .mark
        margin-left 28px
        color #979797
      .el-date-editor
        width 360px
      .el-input-group
        width 160px
    .title
      color #999
      margin 28px 0 18px 0
      font-weight normal
      position relative
      .sign
        position relative
        width 12px
        height 12px
        background #7ccdd1
        display inline-block
        z-index 3
      .text
        position relative
        display inline-block
        padding 0 8px 0 10px
        background #fff
        z-index 3
      &:after
        content ""
        display inline-block
        width 100%
        left 0
        border-bottom 1px dashed #999
        position absolute
        top 12px
</style>
