<template>
  <li>
    <div
      @dblclick="changeType"
      v-on:click.stop="backTable"
      >
      <router-link
        :to="setPath"
        :class="isFolder ? '' : 'subpadding'" class="cata"
        tag="div"
        >
        <span v-if="isFolder" @click.stop="toggle" class="cata-icon" style="font-size: 12px"><i :class="open ? 'el-icon-minus' : 'el-icon-plus'"></i></span>
        <span class="cata-name">
          <i class="icon iconfont icon-wenjian"></i>
          <i class="icon iconfont icon-chakanxinxi"></i>
          <span class="cata-warp directory-browsing">{{model.name}}</span>
        </span>
        <li class="add" v-if="hasManage">
            <div v-if="!model.oparateBtn" class="addbn"><AddCatalogue @addNewCatalogue="addchild" :pid="model._id" :kmType="kmType"></AddCatalogue></div>
            <div v-if="dialogEditFormVisible&&model._id!=='0'" class="editbn"><EditCatalogue :model="model" @updateCatalog = "updateChild" :kmType="kmType"></EditCatalogue></div>
            <div v-if="dialogDeleteFormVisible&&model._id!=='0'" class="deletebn"><DeleteCatalogue @deleteCatalogue = "deletecata"></DeleteCatalogue></div>
        </li>
      </router-link>
    </div>
    <ul v-show="open" v-if="isFolder" class="subcata">
      <item
        class="item"
        v-for="model in model.childs"
        :model="model"
        :kmType="kmType"
        :hasManage="hasManage"
       ></item>
    </ul>
  </li>
</template>
<script>
  import EditCatalogue from 'components/business-modules/km/km-search/EditCatalogue.vue'
  import AddCatalogue from 'components/business-modules/km/km-search/AddCatalogue.vue'
  import DeleteCatalogue from 'components/business-modules/km/km-search/DeleteCatalogue.vue'
  export default {
    name: 'item',
    data () {
      return {
        backT: false,
        open: this.model._id === '0',
        dialogAddFormVisible: true,
        dialogEditFormVisible: true,
        dialogDeleteFormVisible: true,
        ifdelete: true
      }
    },
    props: {
      model: Object,
      kmType: {
        type: String,
        default: 'innder'
      },
      hasManage: Boolean
    },
    computed: {
      getId () {
        return this.$route.path
      },
      isFolder () {
        return this.model.childs && this.model.childs.length
      },
      setPath () {
        let urlObj = this.model._id === '0' ? {path: this.getId} : {path: '/index/km/' + this.kmType + '/' + this.model._id}
        return urlObj
      }
    },
    methods: {
      bindData () {
        this.Type = this.KmType
      },
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        }
      },
      backTable () {
        this.backT = !this.backT
        this.$store.commit('km/REFRESH_PAGE', Math.random())
        this.$store.commit('km/REFRESH_RIGHT', Math.random())
        this.$store.commit('km/BACK_TABLE', this.backT)
      },
      changeType: function () {
        if (!this.isFolder) {
          this.$set(this.model, 'childs', [])
          this.open = true
        }
      },
      editcata: function () {
        this.dialogFormVisible = true
      },
      addchild: function (name) {
        this.open = true
        if (name !== '') {
//          let data = {
//            name: name,
//            pid: this.model._id,
//            order: 0,
//            kmType: this.kmType
//          }
//          this.$store.dispatch('addCatalog', data).then((rep) => {
//            if (rep.success) {
//              this.$message(this.$t('km.addCatalogueSuccess'))
//              this.$store.commit('km/REFRESH_TREE', Math.random())
//            } else if (rep.code === '1001') {
//            }
//          })

        }
      },
      updateChild: function (catalogItem) {
        let data = {
          _id: this.model._id,
          name: catalogItem.name,
          pid: catalogItem.type,
          order: catalogItem.order,
          kmType: this.kmType
        }
        this.$store.dispatch('updateCatalog', data).then((res) => {
          if (res.success) {
            this.$message(this.$t('km.updateCatalogueSuccess'))
            this.$store.commit('km/REFRESH_TREE', Math.random())
            this.$store.commit('km/REFRESH_RIGHT', Math.random())
          }
        })
        this.open = true
      },
      deletecata: function () {
        if (this.isFolder !== 0) {
          this.$message.error(this.$t('km.hasSubCata'))
        } else {
          let data = {
            id: this.model._id,
            kmType: this.model.kmType,
            session: this.$store.state.session
          }
          this.$store.dispatch('delCatalog', data).then(() => {
            this.$store.commit('km/REFRESH_TREE', Math.random())
          })
        }
      }
    },
    created () {
      this.bindData()
    },
    components: {
      EditCatalogue,
      AddCatalogue,
      DeleteCatalogue
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl";
  .icon-wenjian
    color #26bea1
    padding-right 4px
  .icon-chakanxinxi
    display none
  .editbn,.addbn,.deletebn
    display inline
  .editbn,.addbn
    color #1abb9c
  .deletebn
    color #ff6b6b
  .cata
    line-height 30px
    padding-right 6px
    font-size 14px
    position relative
    cursor pointer
    color $cf-gray2
    font-weight 700
    span
      .el-icon-minus,.el-icon-plus
        border 1px solid $cf-gray5
        padding 1px
        color $cf-gray5
        margin-right 5px
    .cata-warp
      display inline-block
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
      max-width 180px
      position absolute
  .add
    float right
  .subpadding
    padding-left 36px
  .tree>.item>a>.cata:first-child
    .cata-icon
      display none
      font-size 12px
    .cata-name
      font-size 16px
      .icon-wenjian
        display none
      .icon-chakanxinxi
        display inline-block
        width 23px
        height 23px
        line-height 23px
        text-align center
        border-radius 23px
        border 1px solid #1abb9c
        color #1abb9c
        margin-right 3px
    .add
      .editbn,.deletebn
        display none
  .router-link-active
    background #eee
  .subcata
    padding-left 24px
    .item
      .cata
        .cata-warp
          font-size 12px
          font-weight 400
          color $cf-gray1
</style>
