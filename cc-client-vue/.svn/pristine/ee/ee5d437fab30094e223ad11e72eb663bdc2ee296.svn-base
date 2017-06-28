<template>
  <el-dialog modal-append-to-body lock-scroll top="10%" class="customer-dialog header-option" :title="options.ReportName + ' 表头显示配置'" v-model.trim="visiable">
    <el-row :gutter="15">
      <el-col :span="12">
        <span class="no-drag" v-for="element in noDrag">{{element.displayname}}</span>
        <draggable :list="options.Config" :options="{group:'people'}" @start="drag=true" @end="drag=false">
          <div class="drag" v-for="element in options.Config" :key="element.id">
            <el-checkbox class="onehead" label="" v-model.trim="element.show"></el-checkbox><div class="move">{{element.displayname}}</div>
          </div>
        </draggable>
      </el-col>
      <el-col :span="12">
        <dl>
          <dt>
            <h6>个性化的表头显示顺序</h6>
          </dt>
          <dd>
            左侧的每一个表头项可以上下拖拽，用来设定表头显示的顺序，排在上面的统计项将显示在表格的前面。
          </dd>
          <br><br>
          <dt>
            <h6>屏蔽掉您不关心的数据</h6>
          </dt>
          <dd>
            每一个表头项后面会有一个复选框，根据您的关注点来自由选择报表中要显示的统计项。
          </dd>
        </dl>
      </el-col>
      <el-col :span="24">
        <el-button @click="cancel" class="button">取消</el-button>
        <el-button @click="save" class="btn">保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
  import draggable from 'vuedraggable'
  import {deepClone} from '../../../../utils/m7Utils.js'
  export default {
    name: 'headerOptions',
    props: {
      show: Boolean,
      type: String,
      option: Object,
      noDrag: {type: Array, default: []}
    },
    data () {
      return {
      }
    },
    components: {
      draggable
    },
    computed: {
      visiable () {
        return this.show
      },
      options () {
        return this.option
      }
    },
    methods: {
      save () {
        for (let i = 0; i < this.options.Config.length; i++) {
          this.options.Config[i].name = this.options.Config[i].name + '@' + this.options.Config[i].displayname
        }
        // 静态表头
        let headersStatic = deepClone(this.noDrag)
        for (let i = 0; i < this.noDrag; i++) {
          headersStatic[i].name = headersStatic[i].name + '@' + headersStatic[i].displayname
        }
        let data = {reportType: this.type, reportName: this.options.ReportName, headers: this.options.Config}
        data.headers = headersStatic.concat(data.headers)
        if (this.type === 'im_monitor_agent') {
          this.$store.dispatch('saveTableHeader', data).then(() => {
            this.$emit('close', 'save')
          })
          this.open2()
        } else {
          this.$store.dispatch('saveReportTableHeader', data).then(() => {
            this.$emit('close', 'save')
          })
          this.open2()
        }
      },
      open2 () {
        this.$message({
          message: '配置显示表头成功',
          type: 'success'
        })
      },
      cancel () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .no-drag
    display inline-block
    margin-left 10px
    &:first-child
      margin-left 0
  .onehead
    cursor pointer
  .move
    cursor move
    margin-left 8px
  .drag
    display flex
    margin-top 8px
    line-height 20px
    color #1a1a1a
  .el-row
    padding 26px
    .el-col-24
      text-align center
      margin-top 40px
      .btn
        background #1abb9c
        width 110px
        color #fff
      .button
        background #7ccdd1
        width 110px
        color #fff
    dt
      h6
        color #00c7d1
        line-height 2
        font-size 12px
    dd
      color #00c7d1
      font-size 12px
      line-height 18px
</style>
