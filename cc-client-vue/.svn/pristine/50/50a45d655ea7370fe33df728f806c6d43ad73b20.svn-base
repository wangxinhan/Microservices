<script src="../../../../../build/webpack.base.conf.js"></script>
<template>
  <div class="modify">
    <div class="m-head">
      <el-row :gutter="20">
        <el-col :span="12">
          <div>
            <div class="subtitle">{{$t('km.parentCatalogue')}}</div>
            <el-select size="small" v-model.trim="value7" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in options"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <div class="subtitle">{{$t('km.title')}}</div>
            <el-input size="small"
              v-model.trim="input"
              >
            </el-input>
          </div>
        </el-col>
      </el-row>
    </div>
    <quillPublic :editdata="content" :itemId="itemId" :attachs="attachs"  @kmFile="kmFile" @submitContent="submitContent"></quillPublic>
    <div class="button">
      <el-button v-on:click="cancel">{{$t('public.cancel')}}</el-button>
      <el-button type="primary" v-on:click="submit">{{$t('km.submit')}}</el-button>
    </div>
  </div>
</template>
<script>
  import quillPublic from 'components/business-modules/km/km-detail/QuillPublic.vue'
  import {qiniu7moorKmDomain} from '../../../../utils/qiniuUtils.js'
  export default {
    name: 'KmModify',
    props: {
      editdata: Object
    },
    data () {
      return {
        options: [],
        value7: '',
        input: '',
        content: [],
        attachs: [],
        kmFiles: [],
        itemId: '',
        fileId: '',
        selected: '',
        qiniu7moorKmDomain: qiniu7moorKmDomain
      }
    },
    methods: {
      cancel () {
        this.$emit('edit')
      },
      kmFile (kmFile) {
        this.kmFiles = kmFile
      },
      submit () {
        let attachs = {}
        let kmFiles = this.kmFiles
        for (let i = 0; i < kmFiles.length; i++) {
          let ids = kmFiles[i].id
          let name = kmFiles[i].name
          let id = ids.split('.')[2]
          let key1 = ''
          let split1 = id.split('/')
          for (let i = 1; i <= split1.length - 1; i++) {
            if (i < split1.length - 1) {
              key1 += split1[i] + '/'
            } else {
              key1 += split1[i]
            }
          }
          attachs[key1] = name
//          attachs['a'] = name
        }
        if (this.content.fileId != null) {
          this.fileId = this.content.fileId
        }
        console.log(attachs)
        if (this.input === '') {
          this.$message.error('标题不能为空')
          return
        }
        let data = {
          _id: this.editdata._id,
          title: this.input,
          content: this.content.content,
          kmType: this.editdata.kmType,
          fileId: this.fileId,
          attachs: attachs,
          cid: this.value7
        }
        console.log('++++++++++++++++updateItem+++++++++++++++++++++')
        this.$store.dispatch('updateItem', data).then(() => {
          this.$emit('edit')
        })
      },
      submitContent (submitContent) {
        this.content = submitContent
      }
    },
    computed: {
    },
    components: {
      quillPublic
    },
    mounted () {
      let data = {
        _id: this.editdata._id,
        kmType: this.editdata.kmType
      }
      let ItemEditdata = {}
      this.$store.dispatch('showItemEdit', data).then(() => {
        ItemEditdata = this.$store.state.km.ItemEditdata
        let title = ItemEditdata.row.title
        this.input = title
        this.content.content = ItemEditdata.row.content
        this.itemId = ItemEditdata.row._id
        this.fileId = ItemEditdata.row.fileId
        let obj = ItemEditdata.row.attachs
        let keys = Object.keys(obj)
        for (let i = 0; i < keys.length; i++) {
          let id = this.qiniu7moorKmDomain + '/' + keys[i] + '?attname=' + obj[keys[i]]
          let attach = {
            id: id,
            name: obj[keys[i]]
          }
          this.attachs.push(attach)
        }
      })
      let data1 = {
        kmType: this.editdata.kmType
      }
      let self = this
      this.$store.dispatch('queryCatalogList', data1).then(() => {
        let catalogTree = this.$store.state.km.catalogTree

        let tree = [{
          name: self.$t('km.catalogLook'),
          childs: catalogTree,
          _id: '0'
        }]
        for (let i = 0; i < tree.length; i++) {
          if (tree[i]._id === self.editdata._id) {
            continue
          }

          let obj = {value: tree[i]._id, label: tree[i].name}
          if (tree[i]._id !== '0') {
            self.options.push(obj)
          }
          if (tree[i].childs && tree[i].childs.length > 0) {
            for (let j = 0; j < tree[i].childs.length; j++) {
              if (tree[i].childs[j]._id === self.editdata._id) {
                continue
              }
              let obj = {value: tree[i].childs[j]._id, label: '·' + tree[i].childs[j].name}
              self.options.push(obj)
              if (tree[i].childs[j].childs && tree[i].childs[j].childs.length > 0) {
                for (let k = 0; k < tree[i].childs[j].childs.length; k++) {
                  if (tree[i].childs[j].childs[k]._id === self.editdata._id) {
                    continue
                  }
                  let obj = {value: tree[i].childs[j].childs[k]._id, label: '··' + tree[i].childs[j].childs[k].name}
                  self.options.push(obj)
                  if (tree[i].childs[j].childs && tree[i].childs[j].childs[k].childs.length > 0) {
                    for (let f = 0; f < tree[i].childs[j].childs[k].childs.length; f++) {
                      if (tree[i].childs[j].childs[k].childs[f]._id === self.editdata._id) {
                        continue
                      }
                      let obj = {value: tree[i].childs[j].childs[k].childs[f]._id, label: '···' + tree[i].childs[j].childs[k].childs[f].name}
                      self.options.push(obj)
                    }
                  }
                }
              }
            }
          }
        }
        for (let i = 0; i < catalogTree.length; i++) {
          if (this.editdata.cid === catalogTree[i]._id) {
            this.selected = catalogTree[i].name
            this.value7 = catalogTree[i]._id
          }
          let childs = catalogTree[i].childs
          for (let j = 0; j < childs.length; j++) {
            if (this.editdata.cid === childs[j]._id) {
              this.selected = childs[j].name
              this.value7 = childs[j]._id
            }
            let child = childs[j].childs
            for (let k = 0; k < child.length; k++) {
              if (this.editdata.cid === child[k]._id) {
                this.selected = child[k].name
                this.value7 = child[k]._id
              }
            }
          }
        }

//        for (let i = 0; i < catalogTree.length; i++) {
//          let option = [
//          ]
//          option.label = catalogTree[i].name
//          option.value = catalogTree[i]._id
//          if (this.editdata.cid === catalogTree[i]._id) {
//            this.selected = catalogTree[i].name
//            this.value7 = catalogTree[i]._id
//          }
//          let childs = catalogTree[i].childs
//          this.options.push(option)
//          for (let j = 0; j < childs.length; j++) {
//            let option = []
//            option.label = childs[j].name
//            option.value = childs[j]._id
//            if (this.editdata.cid === childs[j]._id) {
//              this.selected = childs[j].name
//              this.value7 = childs[j]._id
//            }
//            let child = childs[j].childs
//            this.options.push(option)
//            for (let k = 0; k < child.length; k++) {
//              let option = [
//              ]
//              option.label = child[k].name
//              option.value = child[k]._id
//              if (this.editdata.cid === child[k]._id) {
//                this.selected = child[k].name
//                this.value7 = child[k]._id
//              }
//              this.options.push(option)
//            }
//          }
//        }
      })
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl";
  .m-head
    margin-bottom 20px
  .modify
    color #a6a6a6
    .subtitle
      padding-bottom 7px
      color $cf-gray1
    .button
      margin-bottom 100px
      text-align right
      .cancel, .submit
        background-color #7bcdd2
        margin-right 20px
        width 90px
        color #fff
      .submit
        background-color #1abb9c
        margin-right 0
</style>
