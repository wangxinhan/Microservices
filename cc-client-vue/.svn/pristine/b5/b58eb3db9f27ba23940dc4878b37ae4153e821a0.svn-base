<template>
  <div class="deleteCataForm" @click.stop="stop">
    <i class="icon iconfont icon-guanbi" @click.stop="deleteCata"></i>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('public.tip')" v-model.trim="dialogDeleteFormVisible" size="tiny">
      <span>{{$t('km.ifDeleteCata')}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="dialogDeleteFormVisible = false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click.stop="confirmDelete">{{$t('public.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'DeleteCatalogue',
    data () {
      return {
        dialogDeleteFormVisible: false,
        formStacked: {
          name: '',
          region: '',
          type: ''
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      stop () {
        // 阻止冒泡
      },
      deleteCata () {
        this.dialogDeleteFormVisible = true
      },
      confirmDelete () {
        this.dialogDeleteFormVisible = false
        this.$emit('deleteCatalogue')
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .deleteCataForm
    display inline
    padding-right 0
    .icon-zhankai
      padding 0px 6px
  .sort
    width 130px
    float left
</style>

