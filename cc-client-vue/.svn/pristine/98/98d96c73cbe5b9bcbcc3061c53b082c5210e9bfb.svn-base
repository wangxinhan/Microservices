<template>
  <div class="interface">
      <ul v-if = "urls.length">
        <li v-for= "page in urls" @click="active=page._id" :class="{active:active===page._id}" :title="page.name" class="fl">
          <strong>{{page.name}}</strong>
          <span @click="open(page.url, page.name)">
            <i class="icon-duijie iconfont"></i>
          </span>
        </li>
        <li class="fr last"><a href="javascript:;" @click="getToken"><i class="iconfont icon-shuaxin"></i></a></li>
      </ul>
      <ul v-else>
        <li>{{$t('public.noInterFace')}}</li>
      </ul>
      <div class="page">
        <iframe  v-for= "page in urls" v-show="active===page._id" :src="page.url.indexOf('?')>0 ?
        page.url+ ur.displayName+'&loginExten='+ur.exten
        : page.url+'?loginName='+ur.displayName+'&loginExten='+ur.exten+'&token='+token.token+'&tokenId='+token.tokenId"></iframe>
      </div>
  </div>
</template>
<script>
  import {deepClone} from '../../../utils/m7Utils.js'
 // console.log(session.user.displayName)
 // 生成客户页面对接校验所需token
  function getToken (store, data) {
    return store.dispatch('getToken', data)
  }
  export default({
    name: 'interface',
    data () {
      return {
        active: '',
        postData: {
          loginName: this.$store.state.session.user.exten,
          password: this.$store.state.session.user.password
        },
        token: '',
        message1: '',
        btn: false,
        urls: ''
      }
    },
    methods: {
      cli () {
        this.btn = !this.btn
      },
      getToken () {
        getToken(this.$store, this.postData).then((token) => {
          this.token = this.$store.state.session.user.userToken
        })
      },
      open (url, name) {
        if (this.btn === false) {
          this.btn = true
        }
        let tUrl = ''
        tUrl = url ? url.indexOf('?') > 0 ? url + this.ur.displayName + '&loginExten=' + this.ur.exten
          : url + '?loginName=' + this.ur.displayName + '&loginExten=' + this.ur.exten + '&token=' + this.token.token + '&tokenId=' + this.token.tokenId : ''
        let dragMess = {url: tUrl, name: name, open: true}
        this.$store.commit('SET_DRAGPOP', dragMess)
      }
    },
    computed: {
      ur () {
        return this.$store.state.session.user
      }
    },
    beforeMount () {
      getToken(this.$store, this.postData).then((token) => {
        this.token = token
      })
      this.$store.dispatch('getCache', {type: 'urls'}).then(() => {
        this.urls = deepClone(this.$store.state.session.dicMap.urls)
        this.urls.forEach(function (item) {
          item.url = item.url.replace('http://', '//')
        })
        this.active = this.$store.state.session.dicMap.urls[0] ? this.$store.state.session.dicMap.urls[0]._id : ''
      })
    }
  })
</script>
<style lang="stylus" scoped>
  .interface
    height calc(100vh - 53px)
    height -webkit-calc(100vh - 53px)
    height -moz-calc(100vh - 53px)
    ul
      width 100%
      height 40px
      border-bottom 1px solid #ccc
      .last
        margin-right 20px
        color #1abb9c
      li
        height 38px
        font-size 14px
        cursor pointer
        line-height 40px
        color #1a1a1a
        padding 0 8px
        .iconfont
          font-size 14px
          font-weight bold
          color #999
        a
          .iconfont
            color #1abb9c
            font-size 18px
            display block
      .active
        color #1abb9c
        border-bottom 3px solid #1abb9c
        .iconfont
          color #1abb9c
    .page
      width calc(100vw - 65px)
      width -webkit-calc(100vw - 65px)
      width -moz-calc(100vw - 65px)
      height calc(100vh - 52px - 40px)
      height -webkit-calc(100vh - 52px - 40px)
      height -moz-calc(100vh - 52px - 40px)
      overflow hidden
      position relative
      background #fff
      iframe
        position absolute
        width 100%
        height 100%
        border none
        overflow auto
        display block

</style>
