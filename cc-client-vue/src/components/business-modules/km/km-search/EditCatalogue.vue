<template>
  <div class="editCataForm" @click.stop="stop">
    <i class="icon iconfont icon-beizhu" @click.stop="dialogEditFormVisible = true"></i>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('km.editCataInformation')" v-model.trim="dialogEditFormVisible" size="tiny" @open="open" @close="close">
      <el-form label-position="top" :model="formStacked" class="demo-form-stacked" ref="formStacked" :rules="rules">
        <el-form-item :label="$t('km.catalogueBelongTo')">
          <el-select size="small" v-if="isShowSleect" v-model="formStacked.type" :placeholder="$t('km.viewCategory')">
            <el-option
              v-for="item in typeOptions"
              :label="item.n"
              :value="item.k"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('km.catalogueName')" prop="name">
          <el-input size="small" v-model.trim="formStacked.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('km.cataSort')" prop="order">
          <el-input size="small" v-model.trim.number="formStacked.order" class="sort"></el-input>
          <span class="sort-description">{{$t('km.sortDescription')}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="dialogEditFormVisible = false">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" @click="editCatalog">{{$t('public.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {checkform} from '../../../../utils/validate.js'
  export default {
    name: 'EditCatalogue',
    props: {
      model: Object,
      kmType: String
    },
    data () {
      var validateNumber = (rule, value, callback) => {
        let match = checkform(value, 'Number3')
        if (match) {
          callback(new Error(this.$t(match)))
        } else {
          callback()
        }
      }
      return {
        dialogEditFormVisible: false,
        formStacked: {
          name: this.model.name,
          order: this.model.order,
          type: this.model.pid
        },
        formLabelWidth: '120px',
        isShowSleect: false,
        rules: {
          order: [
            {required: true, message: this.$t('validate.required')},
            {required: true, validator: validateNumber, trigger: 'blur'}
          ],
          name: [
            {required: true, message: this.$t('validate.required')}
          ]
        }
      }
    },
    computed: {
      typeOptions: function () {
        // console.dir(this.model)
        // let tree = this.model.childs
        let catalogTree = this.$store.state.km.catalogTree
        let tree = [{
          name: this.$t('km.catalogLook'),
          childs: catalogTree,
          _id: '0'
        }]
        let options = []
        let self = this
//        手动重新整理目录结构  只展示前三层目录
        for (let i = 0; i < tree.length; i++) {
          if (tree[i]._id === self.model._id) {
            continue
          }
          let obj = {k: tree[i]._id, n: tree[i].name}
          options.push(obj)
          if (tree[i].childs && tree[i].childs.length > 0) {
            for (let j = 0; j < tree[i].childs.length; j++) {
              if (tree[i].childs[j]._id === self.model._id) {
                continue
              }
              let obj = {k: tree[i].childs[j]._id, n: '·' + tree[i].childs[j].name}
              options.push(obj)
              if (tree[i].childs[j].childs && tree[i].childs[j].childs.length > 0) {
                for (let k = 0; k < tree[i].childs[j].childs.length; k++) {
                  if (tree[i].childs[j].childs[k]._id === self.model._id) {
                    continue
                  }
                  let obj = {k: tree[i].childs[j].childs[k]._id, n: '··' + tree[i].childs[j].childs[k].name}
                  options.push(obj)
//                  if (tree[i].childs[j].childs[k].childs && tree[i].childs[j].childs[k].childs.length > 0) {
//                    for (let n = 0; n < tree[i].childs[j].childs[k].childs.length; n++) {
//                      if (tree[i].childs[j].childs[k].childs[n]._id === self.model._id) {
//                        continue
//                      }
//                      let obj = {k: tree[i].childs[j].childs[k].childs[n]._id, n: '···' + tree[i].childs[j].childs[k].childs[n].name}
//                      options.push(obj)
//                    }
//                  }
                }
              }
            }
          }
        }
//        let getTree = function (_childs) {
//          for (let i = 0; i < _childs.length; i++) {
//            let t = _childs[i]
//            if (t._id === self.model._id) {
//              continue
//            }
//            let obj = {k: t._id, n: t.name}
//            options.push(obj)
//            if (t.childs && t.childs.length > 0) {
//              getTree(t.childs)
//            }
//          }
//        }
//        getTree(tree)
        if (this.kmType === 'outer') {
          options = [{k: tree[0]._id, n: tree[0].name}]
        }
        return options
      }
    },
    methods: {
      stop () {
        // 阻止冒泡
      },
      open () {
        this.formStacked = {
          name: this.model.name,
          order: this.model.order,
          type: this.model.pid
        }
        this.isShowSleect = true
      },
      close () {
        this.isShowSleect = false
      },
      addCata () {
        this.formStacked.region = ''
        this.dialogAddFormVisible = true
      },
      editCatalog () {
        this.$refs.formStacked.validate((valid) => {
          if (valid) {
            this.dialogEditFormVisible = false
            this.$emit('updateCatalog', this.formStacked)
          } else {
          }
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl";
  .sort-description
    font-size: 12px
    color: $cf-gray3
  .editCataForm
    display inline
    padding-right 5px
    .icon-beizhu
      padding 0px 6px
  .sort
    width 20%
    float left
    margin-top 2px
</style>

