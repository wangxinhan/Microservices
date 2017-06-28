<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="CALL_NO_SHOW" label="主叫号码" width="">
    </el-table-column>
    <el-table-column prop="CALLED_NO_SHOW" label="被叫号码" width="">
    </el-table-column>
    <el-table-column prop="DISPOSAL_AGENT" label="接听座席" width="">
    </el-table-column>
    <el-table-column prop="CONNECT_TYPE" label="呼叫类型" width="">
    </el-table-column>
    <el-table-column prop="ERROR_MEMO" label="呼入技能组" width="">
    </el-table-column>
    <el-table-column prop="INVESTIGATE" label="满意度" width="">
    </el-table-column>
    <el-table-column prop="OFFERING_TIME" label="呼叫时间" width="">
    </el-table-column>
    <el-table-column prop="GRADE_TIME" label="质检时间" width="">
    </el-table-column>
    <el-table-column prop="CALL_TIME_LENGTH" label="通话时长" width="">
    </el-table-column>
    <el-table-column prop="GRADE_USER" label="质检人员" width="">
    </el-table-column>
    <el-table-column prop="LABELS" label="通话标签" width="">
    </el-table-column>
    <el-table-column prop="SQ_LABEL" label="服务质量标签" width="">
    </el-table-column>
    <el-table-column label="评级" width="">
      <template scope="scope">
        <span v-if="scope.row.GRADE_AMOUNT > 94.5">优秀</span>
        <span v-if="scope.row.GRADE_AMOUNT > 79.5 && scope.row.GRADE_AMOUNT < 94.4">合格</span>
        <span v-if="scope.row.GRADE_AMOUNT > 59.5 && scope.row.GRADE_AMOUNT < 79.4">提醒</span>
        <span v-if="scope.row.GRADE_AMOUNT < 59.4">不合格</span>
      </template>
    </el-table-column>
    <el-table-column prop="GRADE_AMOUNT" label="质检得分" width="">
    </el-table-column>
    <el-table-column
      v-for="item in configList"
      :prop="item.order"
      :label="item.name + '__'+ item.fatal"
      width=""
      :render-header="renderContent"
    >
    </el-table-column>
    <el-table-column prop="COMMENTS" label="点评内容" width="">
    </el-table-column>
    <el-table-column  label="操作" width="100">
      <template scope="scope">
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
        msg: 1111
      }
    },
    props: ['configList', 'tableData', 'template'],
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
      },
      renderContent (h, {column, $index}, item) {
        let arr = column.label.split('__')
        let none = 'none'
        if (arr[1] === 'true') {
          none = 'inline-block'
        }
        return (
          h('div', {
            class: {
              myheader: true
            }
          }, [
            h('span', {
              domProps: {
                innerHTML: arr[0]
              }
            }, [
            ]),
            h('i', {
              style: {
                display: none
              },
              class: {
                iconfont: true,
                icon: true,
                circle: true
              },
              attrs: {
                title: '致命项，如分数低于60则总分为0'
              },
              domProps: {
                innerHTML: '&#xe64d;'
              }
            }, [
            ])
          ])
        )
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
        font-size 14px
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
