<template>
  <div class="km-tree">
    <div class="recent-update" @click.stop="recent">
          <i class="iconfont icon-zxgx"></i>
          <span class="title">{{$t('km.recentUpdate')}}</span>
    </div>
    <div class="catalogue">
      <div class="tree-box">
        <ul class="tree" v-loading="loading">
         <item class="item" :kmType="KmType" :model="treeDataLimit" :hasManage="hasManage"></item>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import item from 'components/business-modules/km/km-search/item.vue'
  import {deepClone, isHasFunc} from '../../../../utils/m7Utils.js'
  export default {
    name: 'kmTree',
    props: ['KmType'],
    data () {
      return {
        loading: true,
        treeData: {
          name: '目录浏览',
          childs: [
          ],
          _id: '0'
        },
        dialogAddFormVisible: false,
        maxlimit: 3,
        hasManage: false
      }
    },
    computed: {
      refreshTree () {
        return this.$store.state.km.refreshTree
      },
      treeDataLimit () {
        let treeData = deepClone(this.treeData)
        if (this.KmType === 'inner') {
          for (var i = 0; i < treeData.childs.length; i++) {
            var item = treeData.childs[i]
            if (item.childs && item.childs.length !== 0) {
              for (var m = 0; m < item.childs.length; m++) {
                var item1 = item.childs[m]
                if (item1.childs && item1.childs.length !== 0) {
                  for (var n = 0; n < item1.childs.length; n++) {
                    treeData.childs[i].childs[m].childs[n].childs = []
                    treeData.childs[i].childs[m].childs[n].oparateBtn = true
                  }
                }
              }
            }
          }
        }
        if (this.KmType === 'outer') {
          for (let i = 0; i < treeData.childs.length; i++) {
            let item = treeData.childs[i]
            if (item.childs.length !== 0) {
              treeData.childs[i].childs = []
            }
            treeData.childs[i].oparateBtn = true
          }
        }
        return treeData
      }
    },
    methods: {
      recent () {
//        let data = {
//          kmType: this.KmType
//        }
        this.$router.push('/index/km/' + this.KmType + '/curupdate')
        this.$store.commit('km/REFRESH_RIGHT', Math.random())
//        this.$store.dispatch('queryRecentList', data).then(() => {
//          this.$router.push('/index/km/' + this.KmType + '/curupdate')
//        })
      },
      fetchData () {
        let data = {
          kmType: this.KmType
        }
        this.$store.dispatch('queryCatalogList', data).then(() => {
          this.loading = false
          let treedata = this.$store.state.km.catalogTree
//          let i = 0
//          for (; i < treedata.length; i++) {
//            this.treeData.childs.push(treedata[i])
//          }
          this.treeData.childs = treedata
        })
      }
    },
    watch: {
      'refreshTree': 'fetchData'
    },
    components: {
      item
    },
    beforeMount () {
      if (isHasFunc('func_km_config', this.$store.state.session.user)) {
        this.hasManage = true
      }
      this.fetchData()
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../../assets/common.styl";
  .km-tree
    height calc(100vh - 146px)
    overflow scroll
    padding-top 8px
    .recent-update
      margin-left 21px
      .iconfont
        color #1abb9c
        font-size 24px
    .catalogue
      margin 14px 0px 0px 16px
      color $cf-gray5
      .cata-head
        margin-bottom 10px
        .cata-icon
          width 23px
          height 23px
          border-radius 23px
          border 1px solid #1abb9c
          display inline-block
          .icon-chakanxinxi
            color #1abb9c
            line-height 25px
            padding 3px
        .cata-name
          font-size 16px
      .tree-box
        margin-left 4px
        .addbn,.add
          display inline
  .title
    display inline-block
    font-size 14px
    color $cf-gray2
    font-weight 700
    cursor pointer
    vertical-align top
    padding-top  4px
</style>
