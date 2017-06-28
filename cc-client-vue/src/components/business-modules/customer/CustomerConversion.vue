<template>
  <div class="conversion customer-dialog">
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('customer.batchTransCustmoer')" v-model.trim="covVisible" v-if="isCusCvDialog" size="tiny">
    <div class="c-content">
      <span class="c-point" v-html="$t('customer.batchTransCustmoerWarn')">
      </span>
      <span class="c-count">{{$t('customer.batchTransCustmoerCount', {count})}}</span>
      <customer-owner-select
        :placeholder="$t('public.pleasePick')"
        :status = "'status0'"
        :ownerRange = "'category'"
        @ownerChange = "ownerChange"
        class="c-input"
      ></customer-owner-select>
      <span slot="footer" class="c-footer">
        <el-button class="cancel" @click.stop="cancel">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" class="c-footer__submit" @click.stop="submit">{{$t('public.save')}}</el-button>
      </span>
    </div>
    </el-dialog>
  </div>
</template>
<script>
  import CustomerOwnerSelect from './CustomerOwnerSelect'
  export default {
    name: 'CustomerConversion',
    data () {
      return {
        covVisible: false
      }
    },
    props: {
      isCusCvDialog: {
        type: Boolean,
        default: false
      },
      count: {
        type: Number,
        default: 0
      }
    },
    components: {
      CustomerOwnerSelect
    },
    methods: {
      cancel () {
        this.$emit('cancelAndSubmit', {
          type: 'cancel',
          bool: false,
          categoryId: null
        })
      },
      submit () {
        this.$emit('cancelAndSubmit', {
          type: 'submit',
          bool: false,
          categoryId: this.categoryId
        })
      },
      ownerChange (data) {
        this.categoryId = data.categoryId
      }
    },
    watch: {
      isCusCvDialog (cur, old) {
        this.covVisible = cur
      },
      covVisible (cur, old) {
        if (cur === false) {
          this.$emit('cancelAndSubmit', {
            type: 'close',
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
  .c-content
    padding 0 20px 20px 20px
    .c-point
      color: $cf-blue
    .c-input
      width 50%
    .c-count
      display block
      margin-bottom 5px
      color $cf-gray0
    .c-footer
      display block
      text-align center
      margin-top 24px
      .el-button
        height 30px
        line-height 9px
</style>
