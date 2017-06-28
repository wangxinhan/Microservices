<template>
  <div class="container">
    <div class="km_search_top">
      <el-autocomplete
              class="autocomplete"
              placeholder="请输入内容"
              :fetch-suggestions="querySearch"
              @keyup.native.enter="handlerSearch(inputVal)"
              @select="handleSelect"
              v-model.trim="inputVal">
      </el-autocomplete>
      <span class="iconfont icon-sousuo" @click.stop="handlerSearch(inputVal)"></span>
      <div class="clearfix">
        <div class="search_tip" v-html="this.$t('webchat.kmSearchNum', { length: count })"></div>
        <div class="search-pagination">
          <pagination
                  :small="paginationInfo.small"
                  :currentPage="paginationInfo.currentPage"
                  :count="count"
                  @turnPage="turnPage"
                  :totalPage="totalPage"
                  >
          </pagination>
        </div>
      </div>
    </div>
    <div class="webchat_kmdic_box">
      <ul class="webchat_kmdic_content">
        <li class="kmdic_li" v-for="list in lists">
          <h6 v-html="list.title"></h6>
          <a @click.stop="kmCopyContent(list.content)" v-html="list.highlight"></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script type="text/javascript">
  import * as types from '../../../store/modules/webchat/mutation-types.js'
  import Pagination from '../../public-modules/card/Pagination'
  export default {
    name: 'WebchatKmSearch',
    props: {
      searchData: Object
    },
    data () {
      return {
        restaurants: [],
        state1: '',
        inputVal: '',
        lists: [],
        paginationInfo: {
          small: true,
          currentPage: 1
        },
        popoShow: false,
        count: 0
      }
    },
    methods: {
      querySearch (queryString, cb) {
        var results = queryString ? this.restaurants.filter(this.createFilter(queryString)) : this.restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handlerSearch (value) {
        let self = this
        this.$store.dispatch('queryWholeKmDic', {'kmType': 'outer', 'key': value, 'page': 1, limit: 10}).then(() => {
          self.lists = self.$store.state.km.wholeKmDic.list
          self.lists.forEach((item) => {
            item.value = item.key
          })
          self.lists = self.$store.state.km.wholeKmDic.list
          if (self.lists.length) {
            self.count = self.$store.state.km.wholeKmDic.count
            self.totalPage = Math.ceil(self.$store.state.km.wholeKmDic.count / 10) || 0
          } else {
            self.count = 0
            self.totalPage = 0
          }
        })
      },
      handleSelect (item) {
        let self = this
        this.$store.dispatch('queryWholeKmDic', {'kmType': 'outer', 'key': item.key, 'page': 1, limit: 10}).then(() => {
          self.lists = self.$store.state.km.wholeKmDic.list
          self.lists.forEach((item) => {
            item.value = item.key
          })
          if (self.lists.length) {
            self.count = self.$store.state.km.wholeKmDic.count
            self.totalPage = Math.ceil(self.$store.state.km.wholeKmDic.count / 10) || 0
          } else {
            self.count = 0
            self.totalPage = 0
          }
        })
      },
      kmCopyContent (value) {
        let data = {
          value: '',
          random: ''
        }
        data.random = Math.random()
        data.value = value
        this.$store.commit(types.COPY_IMSEARCH_VALUE, data)
      },
      changeSearch () {
        this.inputVal = this.searchData.serachDate
        this.handlerSearch(this.inputVal)
      },
      turnPage (pageNum) {
        let value = this.inputVal
        let self = this
        this.$store.dispatch('queryWholeKmDic', {'kmType': 'outer', 'key': value, 'page': pageNum, limit: 10}).then(() => {
          self.lists = self.$store.state.km.wholeKmDic.list
          self.count = self.$store.state.km.wholeKmDic.count
          self.totalPage = Math.ceil(self.$store.state.km.wholeKmDic.count / 10) || 0
        })
      }
    },
    watch: {
      'searchData.serachDate': 'changeSearch'
    },
    computed: {
      flag () {
        if (this.searchData.searcgFlag) {
          return this.searchData.searcgFlag
        } else {
          return ''
        }
      }
    },
    components: {
      Pagination
    },
    beforeMount () {
      let self = this
      this.$store.dispatch('queryKmHotWords', {'kmType': 'outer'}).then(() => {
        self.restaurants = self.$store.state.km.kmHotwords.list
        self.count = 0
        self.totalPage = 0
      })
    },
    mounted () {
      this.changeSearch()
    }
  }
</script>
<style lang="stylus" scoped>
  .container
    height calc(100% - 60px)
    border-top none
    overflow-x auto
    overflow-y auto
  .autocomplete
    width 100%
  .km_search_top
    padding 0 16px
    position relative
    .autocomplete
      margin 14px 0
  .icon-sousuo
    position absolute
    width 24px
    height 24px
    font-size 24px
    top 16px
    right 20px
    color #ccc
    cursor pointer
    padding-left 4px
    background #fff
  .search-pagination
    float right
    width 140px
  .search_tip
    color #b8b8b8
    width 150px
    float left
    margin-top 4px
  .search_tip>span
    color #e86b64
  .webchat_kmdic_content
    padding-top 10px
    .kmdic_li
      padding 6px 18px
      font-size 12px
      line-height 18px
      color #262635
    .kmdic_li:hover
      background-color #e6f2fd
</style>
