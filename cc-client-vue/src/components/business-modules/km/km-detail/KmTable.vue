<template>
  <el-table ref="table"
    :data="tableData3"
    style="width: 100%"
    @selection-change="handleSelectionChange"
    >
    <el-table-column
      type="selection"
      v-if="root!=='curupdate'"
      width="50">
    </el-table-column>
    <el-table-column
      inline-template
      min-width="200"
      :label="$t('km.kPointTitle')">
      <div class="titlecolor" @click="handleContent($index, row)">{{ row.title }}</div>
    </el-table-column>
    <el-table-column
      prop="name"
      :label="$t('km.editor')"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
      prop="date"
      width="180"
      :label="$t('km.updateTime')">
    </el-table-column>
    <el-table-column
      prop="clickrate"
      :label="$t('km.clickRate')">
    </el-table-column>
    <el-table-column
      :context="_self"
      inline-template
      v-if="root!=='curupdate'&&hasManage"
      :label="$t('public.operate')">
      <template scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, tableData4)"
          type="text"
          size="small">
        </el-button>
      </template>
      <div>
        <i class="icon iconfont icon-beizhu" @click="handleEdit($index, row)"></i>
        <i class="icon iconfont icon-guanbi" @click="handleDelete($index, tableData3)"></i>
      </div>
    </el-table-column>
  </el-table>
</template>
<script>
  export default {
    props: ['data', 'KmType', 'tableData', 'currentpage', 'recent', 'root', 'hasManage'],
    data () {
      return {
        tableData3: [],
        multipleSelection: []
      }
    },
    watch: {
//      $route (to, from) {
//        if (to.path.split('/')[4] === 'curupdate') {
//          this.queryRecentList()
//        } else {
//          to.params.kmId && this.queryItemList()
//        }
//      },
      tableData (val1, val2) {
        this.tableData3 = val1
//        this.searchData(val1)
      },
      currentpage (val1, val2) {
        this.queryItemList()
      },
      recent () {
        this.queryRecentList()
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.multipleSelection = val
        this.$emit('multipleSelection', this.multipleSelection)
      },
      handleEdit (index, row) {
        this.$emit('editBtn', row)
      },
      handleContent (index, row) {
        this.$emit('show', row)
      },
      handleDelete (index, row) {
        let currenTitle = row[index].title.substring(0, 15)
        this.$confirm(`确认要删除 ${currenTitle} 吗?`, '操作', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            _id: row[index]._id,
            kmType: this.KmType,
            session: this.$store.state.session
          }
          this.$store.dispatch('delItem', data).then(() => {
            row.splice(index, 1)
            this.queryItemList()
          })

          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
        })
      },
      queryItemList () {
        if (this.currentpage < 1 || this.currentpage === '' || this.currentpage == null) {
          this.currentpage = 1
        }
        let data = {
          cid: this.$route.params.kmId,
          kmType: this.KmType,
          id: 'dd',
          page: this.currentpage
        }
        this.$emit('addData', data)
        let obj = {}
        return this.$store.dispatch('queryItemList', data).then(() => {
          let itemList = this.$store.state.km.itemList
          console.log(itemList + 'ssss')
          let totalPage = Math.ceil(itemList.count / 10)
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
          this.tableData3 = arr
          let list = {
            page: this.currentpage,
            totalPage: totalPage,
            count: itemList.count
          }
          this.$emit('pages', list)
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
      queryRecentList () {
        let recentList = this.recent
//        let current = ''
//        if (recentList[0] != null) {
//          let agents = this.$store.state.session.dicMap.agents
//          for (let i in agents) {
//            if (agents[i]._id === recentList[0].publisher) {
//              current = agents[i].displayName
//            }
//          }
//        }
        let obj = {}
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
        this.tableData3 = arr
      },
      searchData (val1) {
        if (val1 != null) {
          console.dir(val1)
          let arr = []
          let list = val1
          for (let i = 0; i < list.length; i++) {
            let obj = {
              title: list[i].title,
              name: '',
              date: '',
              clickrate: '',
              _id: list[i]._id,
              cid: list[i].cid
            }
            arr.push(obj)
          }
          this.tableData3 = arr
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .el-table
    color #a6a6a6
    .icon-beizhu
      color #1abb9c
      margin-right 11px
      cursor pointer
    .icon-guanbi
      color #ff6b6b
      cursor pointer
  .titlecolor
    color #1abb9c
    cursor pointer
</style>
