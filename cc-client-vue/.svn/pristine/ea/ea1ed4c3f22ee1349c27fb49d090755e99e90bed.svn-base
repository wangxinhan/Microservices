<template>
  <div class="update customer-dialog">
    <el-dialog modal-append-to-body lock-scroll top="10%" title="修改状态" v-model.trim="dialogVisible" v-if="isUpStaDialog" size="tiny">
      <div class="u-content">
        <span class="u-count">您选择的客户共计{{count}}个</span>
        <customer-status-select
          :placeholder="'请选择'"
          :status = "''"
          @statusChange = "getStatus"
          class = "u-input"
        ></customer-status-select>
        <span slot="footer" class="u-footer">
          <el-button class="cancel" @click.stop="cancel">取 消</el-button>
          <el-button type="primary" class="u-footer__submit" @click.stop="submit">保 存</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import CustomerStatusSelect from './CustomerStatusSelect'
  export default {
    name: 'UpdateStatusDialog',
    data () {
      return {
        dialogVisible: false,
        status: null
      }
    },
    props: {
      isUpStaDialog: {
        type: Boolean,
        default: false
      },
      count: {
        type: Number,
        default: 0
      }
    },
    components: {
      CustomerStatusSelect
    },
    methods: {
      cancel () {
        this.$emit('cancelAndSubmit', {
          type: 'cancel',
          bool: false,
          status: null
        })
      },
      submit () {
        this.$emit('cancelAndSubmit', {
          type: 'submit',
          bool: false,
          status: this.status
        })
      },
      getStatus (val) {
        this.status = val
      }
    },
    watch: {
      isUpStaDialog (cur, old) {
        this.dialogVisible = cur
      },
      dialogVisible (cur, old) {
        if (cur === false) {
          this.$emit('cancelAndSubmit', {
            type: 'cancel',
            bool: false,
            status: null
          })
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import "../../../assets/common.styl"
.update
  .u-content
    .u-count
      display block
      margin-bottom 15px
      color $cf-gray0
    .u-input
      width 50%
    .u-footer
      margin-top 20px
      display block
      text-align center
      .el-button
        height 30px
        line-height 9px
</style>
