<template>
  <div class="addCataForm" @click.stop="stop">
    <i class="icon iconfont icon-zhankai" @click.stop="addCata"></i>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('km.addCataInformation')" v-model.trim="dialogAddFormVisible" size="tiny">
      <label > {{$t('km.catalogueName')}}</label>
      <el-input size="small" class="demo-form-stacked" v-model.trim="catalogue"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="dialogAddFormVisible = false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click.stop="confirmName">{{$t('public.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'AddCatalogue',
    data () {
      return {
        dialogAddFormVisible: false,
        catalogue: '',
        formLabelWidth: '120px'
      }
    },
    props: {
      pid: String,
      kmType: String
    },
    methods: {
      stop () {
        return false
      },
      addCata () {
        this.catalogue = ''
        this.dialogAddFormVisible = true
      },
      confirmName () {
        if (this.catalogue === '') {
          this.$message.error(this.$t('km.catalogueNameCantBeEmpty'))
          return
        } else if (this.catalogue.length > 25) {
          this.$message.error(this.$t('km.catalogueNameTooLong'))
          return
        }
        let data = {
          name: this.catalogue,
          pid: this.pid,
          order: 0,
          kmType: this.kmType
        }
        this.$store.dispatch('addCatalog', data).then((rep) => {
          if (rep.success) {
            this.$message(this.$t('km.addCatalogueSuccess'))
            this.$store.commit('km/REFRESH_TREE', Math.random())
            this.$emit('addNewCatalogue', this.catalogue)
            this.dialogAddFormVisible = false
          } else if (rep.code === '1001') {
            this.dialogAddFormVisible = true
          }
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .addCataForm
    display inline
    padding-right 0
    .icon-zhankai
      padding 0px 6px
  .sort
    width 130px
    float left
</style>

