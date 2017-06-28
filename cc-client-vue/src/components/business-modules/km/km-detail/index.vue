<template>
  <div class="km-detail" v-loading="loading">
    <div class="searc" @keyup.enter="handleIconClick">
      <el-input
        size="small"
        placeholder="请输入关键词"
        icon="search"
        v-model.trim="input2"
        :on-icon-click="handleIconClick">
      </el-input>
    </div>
    <div class="searchResult" v-if="isShow === false">
      <div>
          <div class="km-keyword-search-form find">
            <div class="search" style="float: left">
              <div class="">
                <span>
                  当前搜索关键词： <span class="high">{{input2}}</span>
                </span>
              </div>
            </div>
            <div class="page">
              <span class="fl all">共{{count}}条记录 |</span>
              <span class="currentpage">{{page}}/{{totalPage}}</span>
              <el-pagination small layout="prev, next" :current-page="page" @current-change="dicPageChange" :total="count">
              </el-pagination>
            </div>
          </div>
        </div>
        <div v-for="item in list" class="result">
          <div class="head">
            <h3 v-html="item.title" class="fl" @click="showSearchContent(item)"> </h3>
            <span @click="delText(item)" class="fr">
              <i class="iconfont icon-guanbi"></i>
            </span>
            <span  @click="editText(item)"  class="fr">
              <i class="iconfont icon-beizhu"></i>
            </span>
          </div>
          <p v-html="item.content" class="search-content"></p>
          <p class="detai" v-html="item.catalog"></p>
          <p class="detai" v-html="item.lastTime"></p>
        </div>
    </div>
    <div class="public" v-if="showItem">
      <div class="catalogue-list">
        <span>目录浏览 > {{catalogue}}</span>
      </div>
      <div>
        <div v-show="ok">
          <div class="km-keyword-search-form" v-if="root!=='curupdate'&&hasManage">
            <div class="search">
              <div class="pd">
                <span class="plus" @click.stop="plus">
                  <i class="el-icon-plus"></i>
                  {{$t('public.add')}}
                </span>
                <span class="delete" @click.stop="del">
                  <i class="el-icon-close"></i>
                  {{$t('public.delete')}}
                </span>
              </div>
            </div>
            <div class="page">
              <span class="fl all xxxxxx">共{{tableCount}}条记录 |</span>
              <span class="currentpage">{{tablePage}}/{{tableTotalPage}}</span>
              <el-pagination small layout="prev, next" :current-page="tablePage" @current-change="currentChange" :total="tableCount">
              </el-pagination>
            </div>
          </div>
          <kmTable :recent="recent" @pages="pages" :currentpage="tablePage" :tableData="tableData" :KmType="KmType" @editBtn="editBtnContent" @show="showContent" @multipleSelection="multipleSelection" @addData="addData" :root="root" :hasManage="hasManage"></kmTable>
        </div>
        <div class="new-add" v-if="ifAdd" >
          <km-newAdd @addKm="addContent" @cancel="cancel" :addId="addData"></km-newAdd>
        </div>
        <div class="modification"  v-if="ifEdit">
          <km-modify @edit="editContent" :editdata="editdata" ></km-modify>
        </div>
        <div class="contentDetails" v-if="ifContent">
          <h2 class="content-title" v-html="title"></h2>
          <div class="content" v-html="replaceKeyWord(ItemContent,input2)">
          </div>
          <div class="file">
            <a style="padding-right: 15px;" v-for="(one,index) in attached" :href="download(one,index)" target="_blank" download><i class="icon iconfont icon-fujian"></i>{{one}}</a>
          </div>
          <div class="back">
            <el-button type="primary" @click="back()">{{$t('public.getback')}}</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import KmTable from 'components/business-modules/km/km-detail/KmTable.vue'
  import KmNewAdd from 'components/business-modules/km/km-detail/KmNewAdd.vue'
  import KmModify from 'components/business-modules/km/km-detail/KmModify.vue'
  import {deepClone, isHasFunc} from '../../../../utils/m7Utils.js'
  import {qiniu7moorKmDomain} from '../../../../utils/qiniuUtils.js'
  export default {
    name: 'kmDetail',
    data () {
      return {
        loading: true,
        ok: true,
        ifEdit: false,
        ifAdd: false,
        ifContent: false,
        ItemContent: [],
        editdata: '',
        title: '',
        isSearchDetail: false,
        delContent: '',
        addId: '',
        tableData: '',
        catalogue: '',
        page: 1,
        totalPage: 1,
        input2: '',
        isShow: true,
        showItem: true,
        list: [],
        count: '0',
        message: '200 ok!',
        tablePage: 1,
        tableTotalPage: 1,
        tableCount: 0,
        attached: '',
        qiniu7moorKmDomain: qiniu7moorKmDomain,
        isSearch: false,
        root: 'curupdate',
        hasManage: false
      }
    },
    watch: {
      backTable (to, from) {
        this.ifEdit = false
        this.ifAdd = false
        this.ok = true
        this.ifContent = false
      },
      refreshRight () {
        let to = this.$route
        this.input2 = ''
        this.isShow = true
        this.showItem = true
        this.ifEdit = false
        this.ifContent = false
        this.ifAdd = false
        this.ok = true
        // 搜索后单击标题显示详情，右侧刷新时赋值false
        this.isSearchDetail = false
        if (to.path.split('/')[4] === 'curupdate') {
          this.root = 'curupdate'
          this.catalogue = ''
          this.recentList()
        } else {
          this.root = ''
          to.params.kmId && this.queryItemList()
          to.params.kmId && this.changeCatalogue()
        }
      },
      refreshPage () {
        this.tablePage = 1
      }
//      $route (to, from) {
//        if (to.path.split('/')[2] === 'km') {
//
//          }
//        }
//      }
    },
    computed: {
      refreshRight () {
        return this.$store.state.km.refreshRight
      },
      refreshPage () {
        return this.$store.state.km.refreshPage
      },
      backTable () {
        return this.$store.state.km.backTable
      },
      recent () {
        return this.$store.state.km.recentList
      },
      KmType () {
        return this.$route.path.split('/')[3]
      }
    },
    methods: {
      // 修改当前位置
      changeCatalogue (flag, id) {
        let data = {
          kmType: this.KmType
        }
        this.$store.dispatch('queryCatalogList', data).then(() => {
          let catalogTree = this.$store.state.km.catalogTree
          let _id = this.$route.params.kmId
          if (flag === 'search') {
            _id = id
          }
          if (_id === '0') {
            this.catalogue = ''
            return
          }
          for (let i = 0; i < catalogTree.length; i++) {
            let catalog = catalogTree[i]
            if (catalog._id === _id) {
              this.catalogue = catalog.name
              break
            } else {
              let childs1 = catalog.childs
              for (let i = 0; i < childs1.length; i++) {
                let child1 = childs1[i]
                if (child1._id === _id) {
                  this.catalogue = catalog.name + ' > ' + child1.name
                  break
                } else {
                  let childs2 = child1.childs
                  for (let i = 0; i < childs2.length; i++) {
                    let child2 = childs2[i]
                    if (child2._id === _id) {
                      this.catalogue = catalog.name + ' > ' + child1.name + ' > ' + child2.name
                      break
                    }
                  }
                }
              }
            }
          }
          this.loading = false
        })
      },
      replaceKeyWord (html, keyWord) {
        if (keyWord) {
          let reg = new RegExp(keyWord, 'g')
          html = html.replace(reg, '<strong style="color:red; cursor: pointer">' + keyWord + '</strong>')
        }
        return html
      },
      download (one, index) {
        return this.qiniu7moorKmDomain + index + '?attname=' + one
      },
      queryItemList () {
        if (this.tablePage < 1 || this.tablePage === '' || this.tablePage == null) {
          this.tablePage = 1
        }
        let data = {
          cid: this.$route.params.kmId,
          kmType: this.KmType,
          id: 'dd',
          page: this.tablePage
        }
        this.$emit('addData', data)
        let obj = {}
        this.loading = true
        return this.$store.dispatch('queryItemList', data).then(() => {
          let itemList = this.$store.state.km.itemList
          console.log(itemList + 'index')
          let totalPage = Math.ceil(itemList.count / 10)
          totalPage = totalPage || 1
          let recentList = itemList.list
//          let current = ''
//          if (recentList[0] != null) {
//            let agents = this.$store.state.session.dicMap.agents
//            for (let key in agents) {
//              if (agents[key]._id === recentList[0].publisher) {
//                current = agents[key].displayName
//              }
//            }
//          }
          let arr = []
          for (let i = 0; i < recentList.length; i++) {
            obj = {
              title: recentList[i].title,
              name: this.getDisplayName(recentList[i].publisher),
              date: recentList[i].lastTime,
              clickrate: recentList[i].hits,
              _id: recentList[i]._id,
              cid: recentList[i].cid,
              kmType: recentList[i].kmType
            }
            arr.push(obj)
          }
          this.tableData = arr
//          let list = {
//            page: this.tablePage,
//            totalPage: totalPage,
//            count: itemList.count
//          }
          this.tableCount = itemList.count
          this.tableTotalPage = totalPage
//          this.$emit('pages', list)
          this.loading = false
        })
      },
      getDisplayName (id) {
        let agents = this.$store.state.session.dicMap.agents
        let displayName = ''
        agents.forEach((val, index, arr) => {
          if (arr[index]._id === id) {
            displayName = arr[index].displayName
          }
        })
        return displayName
      },
      editText (item) {
        this.isShow = true
        this.showItem = true
        item.kmType = this.KmType
        this.isSearch = true
        this.editBtnContent(item)
      },
      delText (item) {
        this.$confirm('确认要删除吗?', '操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            _id: item._id,
            kmType: this.KmType
          }
          this.$store.dispatch('delItem', data).then(() => {
            this.handleIconClick()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      currentChange (currentPage) {
        this.tablePage = currentPage
      },
      dicPageChange (currentPage) {
        this.page = currentPage
        this.search(currentPage)
      },
      pages (pages) {
        this.tablePage = pages.page
        this.tableTotalPage = pages.totalPage
        this.tableCount = pages.count
      },
      onSubmit () {
        console.log('submit!')
      },
      search (page) {
        if (page == null) {
          page = this.page
        }
        let data = {
          key: this.input2,
          page: page,
          kmType: this.KmType
        }
        this.$store.dispatch('queryKmDic', data).then(() => {
          let list = this.$store.state.km.kmDic.list
          this.count = this.$store.state.km.kmDic.count
          this.totalPage = Math.ceil(this.count / 10)
          this.totalPage = this.totalPage || 1
          this.list = deepClone(list)
          for (let k = 0; k < list.length; k++) {
//            let data = {
//              kmType: this.KmType
//            }
//            this.$store.dispatch('queryCatalogList', data).then(() => {
            let catalogTree = this.$store.state.km.catalogTree
            let _id = list[k].cid
            for (let i = 0; i < catalogTree.length; i++) {
              let catalog = catalogTree[i]
              if (catalog._id === _id) {
                this.list[k].catalog = '所属目录：目录浏览 > ' + catalog.name
                break
              } else {
                let childs1 = catalog.childs
                for (let i = 0; i < childs1.length; i++) {
                  let child1 = childs1[i]
                  if (child1._id === _id) {
                    this.list[k].catalog = '所属目录：目录浏览 > ' + catalog.name + ' > ' + child1.name
                  } else {
                    let childs2 = child1.childs
                    for (let i = 0; i < childs2.length; i++) {
                      let child2 = childs2[i]
                      if (child2._id === _id) {
                        this.list[k].catalog = '所属目录：目录浏览 > ' + catalog.name + ' > ' + child1.name + ' > ' + child2.name
                        break
                      } else {
                        this.list[k].catalog = '所属目录：目录浏览'
                      }
                    }
                  }
                }
              }
            }
//            this.loading = false
//            })
          }
        })
      },
      plus () {
        this.ok = false
        this.ifAdd = true
        this.ifEdit = false
        this.ifContent = false
      },
      addContent () {
        this.ifAdd = false
        this.ok = true
        this.ifEdit = false
        this.ifContent = false
        if (this.$route.path.split('/')[4] === 'curupdate') {
          this.root = 'curupdate'
          this.recentList()
        } else {
          this.root = ''
          this.$route.params.kmId && this.queryItemList()
        }
      },
      addData (addData) {
        this.addId = addData
      },
      cancel () {
        this.ifAdd = false
        this.ok = true
        this.ifEdit = false
        this.ifContent = false
      },
      editBtnContent (row) {
        this.catalogue += row.title + '修改'
        this.ifEdit = true
        this.ok = false
        this.ifAdd = false
        this.ifContent = false
        this.editdata = row
      },
      editContent (editdata) {
        this.ifEdit = false
        this.ifAdd = false
        this.ok = true
        this.ifContent = false
        this.queryItemList()
        if (this.isSearch === true) {
          this.handleIconClick()
          this.isSearch = false
        } else {
          this.$store.commit('km/REFRESH_RIGHT', Math.random())
        }
      },
      showContent (row) {
        this.ifEdit = false
        this.ifAdd = false
        this.ok = false
        this.title = row.title
        let data = {
          _id: row._id,
          kmType: row.kmType,
          flag: 'view'
        }
        let ItemEditdata = {}
        this.$store.dispatch('showItemEdit', data).then(() => {
          ItemEditdata = this.$store.state.km.ItemEditdata
          this.ifContent = true
          this.ItemContent = ItemEditdata.row.content
          this.attached = ItemEditdata.row.attachs
          if (this.$route.path.split('/')[4] === 'curupdate') {
            this.showCatalogue(ItemEditdata.row.catalog._id)
          }
          this.catalogue += ' > ' + ItemEditdata.row.title
        })
      },
      showSearchContent (row) {
        this.ifEdit = false
        this.ifAdd = false
        this.ok = false
        this.isShow = true
        this.showItem = true
        this.title = row.title
        let data = {
          _id: row._id,
          kmType: this.KmType,
          flag: 'view'
        }
        let ItemEditdata = {}
        this.$store.dispatch('showItemEdit', data).then(() => {
          ItemEditdata = this.$store.state.km.ItemEditdata
          this.ifContent = true
          this.catalogue = row.catalog.split('所属目录：目录浏览 > ')[1] + ItemEditdata.row.title
          this.ItemContent = ItemEditdata.row.content
          this.attached = ItemEditdata.row.attachs
          this.isSearchDetail = true
        })

        this.changeCatalogue('search', row._id)
      },
      back () {
        this.ifEdit = false
        this.ifAdd = false
        this.ok = true
        this.ifContent = false
        this.$store.commit('km/REFRESH_RIGHT', Math.random())
        if (this.isSearchDetail) {
          this.showItem = false
          this.isShow = false
          this.isSearchDetail = false
        }
      },
      multipleSelection (multipleSelection) {
        this.delContent = multipleSelection
      },
      del () {
        if (this.delContent.length === 0) {
          return
        }
        this.$confirm('确认要删除吗?', '操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let val = this.delContent
          for (let i = 0; i < val.length; i++) {
            let data = {
              _id: val[i]._id,
              kmType: val[i].kmType
            }
            this.$store.dispatch('delItem', data).then(() => {
              this.queryItemList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
          }
        }).catch(() => {
//          console.log(index)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleIconClick () {
        if (this.input2) {
          this.isShow = false
          this.showItem = false
          this.search()
        }
      },
      recentList () {
        let data = {
          kmType: this.KmType
        }
        this.$store.dispatch('queryRecentList', data).then(() => {
          this.loading = false
        })
      },
      showCatalogue (_id) {
        let catalogTree = this.$store.state.km.catalogTree
        for (let i = 0; i < catalogTree.length; i++) {
          let catalog = catalogTree[i]
          if (catalog._id === _id) {
            this.catalogue = catalog.name + '>'
            break
          } else {
            let childs1 = catalog.childs
            for (let i = 0; i < childs1.length; i++) {
              let child1 = childs1[i]
              if (child1._id === _id) {
                this.catalogue = catalog.name + '>' + child1.name + '>'
                break
              } else {
                let childs2 = child1.childs
                for (let i = 0; i < childs2.length; i++) {
                  let child2 = childs2[i]
                  if (child2._id === _id) {
                    this.catalogue = catalog.name + '>' + child1.name + '>' + child2.name + '>'
                    break
                  }
                }
              }
            }
          }
        }
      }
    },
    beforeMount () {
      this.isShow = true
      this.showItem = true
      if (this.$route.path.split('/')[4] === 'curupdate') {
        this.root = 'curupdate'
        this.recentList()
      } else {
        this.root = ''
        this.$route.params.kmId && this.changeCatalogue()
      }
      if (isHasFunc('func_km_config', this.$store.state.session.user)) {
        this.hasManage = true
      }
    },
    components: {
      KmTable,
      KmNewAdd,
      KmModify
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../../../assets/common.styl";
  .km-detail
    margin-left 428px
    width calc(100vw - 492px)
    .file
      padding-top 5px
    .result
      .head
        margin 24px 0 8px 0
        height 20px
        h3
          font-size 14px
          cursor pointer
          color $cf-gray2
          font-weight 700
        .iconfont
          cursor pointer
          font-size 12px
        .icon-guanbi
          color #ff6b6b
        .icon-beizhu
          color #1abb9c
          margin-right 16px
      p
        font-size 12px
        color $cf-gray3
        line-height 22px
        margin-top 10px
      .detai
        color $cf-gray4
    .find
      height 40px
      border none
      padding 10px 0 0 0
      .high
        color #f00
    .searc
      height 50px
      line-height 50px
      border-bottom 1px solid #eeeff2
      padding 0 26px 0 20px
    .public
      padding-bottom 20px
      height calc(100vh - 146px)
      overflow-y auto
    .searchResult
      padding 16px 26px 0 36px
      height calc(100vh - 180px)
      overflow-y auto
  .catalogue-list
    color $cf-gray2
    font-size 14px
    font-weight 500
    margin-bottom 22px
  .km-keyword-search-form
    height 36px
    padding 9px 14px
    color $cf-gray1
    border 1px solid #dddddd
    border-bottom none
    .search
      float left
      .pd
        display inline-block
        float left
        line-height 36px
        color #1abb9c
        span
          margin-right 20px
          cursor pointer
        .delete
          color #ff6b6b
    .page
      float right
      height 36px
      line-height 36px
      .all
        margin 0px 6px 0 0
      .currentpage
        float left
      .el-pagination
        float left
        padding 7px 5px
        color $cf-gray5
  .open
    display none
  .close
    display block
  .contentDetails
    color $cf-gray3
    .content-title
      color $cf-gray1
      font-size 18px
      text-align center
      margin-bottom 32px
    .content
      font-size 12px
      line-height 28px
    .back
      margin-top 28px
      margin-bottom 100px
</style>
