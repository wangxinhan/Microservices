<template>
<div class="customer-dialog">
  <div class="block text" @click="toggle">
    <i class="iconfont icon-chakanxinxi"></i>
  </div>
  <div v-if="!loading" class="cust_info" v-bind:class="{ 'layout' : isShow, 'layin': !isShow, 'screen-top':callScreen}">
    <span :id="callScreen?'close_custom_detail':''" class="el-icon-close" @click="close"></span><h4>客户信息</h4>
    <table>
      <tbody>
        <tr>
          <td class="label">{{ custInfo.phoneAlias }}</td>
          <td>
            <span class="c-phone-or-email" v-for="phone in custInfo.phone">
              <span>{{ hideTel(phone.tel) }}</span>
              <span v-if="phone.area">({{phone.area}})</span>
              <span v-if="phone.memo">({{phone.memo}})</span>
            </span>
          </td>
        </tr>
        <tr>
          <td class="label">{{ custInfo.emailAlias }}</td>
          <td>
            <span class="c-phone-or-email"
                  v-for="email in custInfo.email">
                <span v-if="email.email">
                  {{email.email}}
                </span>
                <span v-if="email.memo">
                  ({{email.memo}})
                </span>
            </span>
          </td>
        </tr>
        <tr v-for="field in formatFields">
          <td class="label">{{field.n}}</td>
          <td>{{field.desc || (Array.isArray(field.v) ? field.v.join(',') : field.v)}}</td>
        </tr>
        <tr>
          <td class="label">创建时间</td>
          <td>{{custInfo.createTime}}</td>
        </tr>
        <tr>
          <td class="label">最近更新时间</td>
          <td>{{custInfo.lastUpdateTime}}</td>
        </tr>
        <tr>
          <td class="label">最近联系时间</td>
          <td>{{custInfo.lastContactTime}}</td>
        </tr>
        <tr>
          <td class="label">附件</td>
          <td class="attach" v-for="attach in custInfo.attachs">
            <a class='a-img' href="#" v-if="attach.type === 'img'" @click.stop="handleAttachImgClick(attach.id)">
              <img :src="qiniu7moorDomain+attach.id+'?imageView2/1/w/50'" :title="attach.name" class="img-rounded" style="margin-right:10px;margin-bottom:10px;width:50px;max-height: 50px;">
            </a>
            <a class="a-name" href="#" @click.stop="handleAttachClick(attach.id, attach.name, attach.type)">{{attach.name}}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <big-image :imgInfo="bigImage" @closeImageDialog="closeBigImage" :callScreen="callScreen"></big-image>
</div>
</template>
<script>
import { checkHideTel } from '../../../utils/m7Utils.js'
import { showFieldDesc } from '../../../utils/customerUtils.js'
import { qiniu7moorDomain } from '../../../utils/qiniuUtils'
import BigImage from 'components/public-modules/bigImage/BigImage'
export default {
  name: 'ShowCustomerInfo',
  data () {
    return {
      loading: true,
      isShow: false,
      qiniu7moorDomain: qiniu7moorDomain,
      bigImage: {
        bigImageShow: false,
        url: ''
      }
    }
  },
  props: {
    custInfo: Object,
    callScreen: Boolean
  },
  components: {
    BigImage
  },
  methods: {
    toggle () {
      this.isShow = !this.isShow
    },
    close () {
      this.isShow = false
    },
    hideTel (tel) {
      return checkHideTel(tel, this.$store.state.session.user)
    },
    handleAttachImgClick (id) {
      this.bigImage.url = qiniu7moorDomain + id
      this.bigImage.bigImageShow = true
    },
    closeBigImage () {
      this.bigImage.bigImageShow = false
      this.bigImage.url = ''
    },
    handleAttachClick (id, name, type) {
      let path = `${qiniu7moorDomain}${id}?attname=${name}`
      if (type === 'app') {
        path = `/fileDownload?fileId=${id}`
      }
      this.$store.commit('SET_FILEDOWNLOAD', { path, isSession: false })
    }
  },
  computed: {
    formatFields () {
      return this.custInfo.fields ? this.custInfo.fields.map(field => {
        if (field.t === 'dropdown' || field.t === 'radio' || field.t === 'checkbox') {
          field.desc = showFieldDesc('field', field.t, field.k, field.v)
        } else if (field.k === 'taskId' || field.k === 'taskCalled' || field.k === 'sex' || field.k === 'province') {
          field.desc = showFieldDesc(field.k, field.v)
        } else if (field.k === 'city') {
          field.desc = showFieldDesc('city', field.v, this.custInfo.province)
        } else {
          // field.desc = showFieldDesc('html', field.v)
        }
        return field
      }) : []
    }
  },
  beforeMount () {
    Promise.all([
      this.$store.dispatch('getCache', { type: 'custCategorys' }),
      this.$store.dispatch('getCache', { type: 'custTmpls' }),
      this.$store.dispatch('getCache', { type: 'agents' }),
      this.$store.dispatch('getCache', { type: 'options', id: 'd7b9c68a-b50f-21d1-d5fd-41ea93f5f49c' })
    ]).then(() => {
      this.loading = false
    })
  }
}
</script>
<style lang="stylus" scoped>
@import '../../../assets/common.styl'
.text
    text-align center
.layout
  transition transform 0.35s
  box-shadow 0 3px 6px rgba(0, 0, 0, .3)
  animation movelayout .4s
  @keyframes movelayout
    0%
      width 300px
    100%
      width 610px

.layin
  width:0px
  transition transform 0.35s
.block
  width 100%
  height 100%
.cust_info
  position fixed
  z-index 1998
  right 0
  top 54px
  bottom 0
  background #fff
  overflow-y auto
  overflow-x hidden
  cursor auto
  .el-icon-close
    float right
    width 14px
    margin-right 20px
    font-size 14px
    color $cf-gray5
    line-height 40px
    cursor pointer
  h4
    display block
    color $cf-gray1
    border-bottom 1px solid $c-border1
    text-indent 20px
    line-height 42px
  table
    color $cf-gray3
    width 570px
    margin 20px
    font-size 12px
    box-sizing border-box
    tr
      td
        max-width 430px
        word-break break-all
        white-space normal
        .c-phone-or-email
          display flex
          span
            margin-left 8px
      td.label
        width 120px
        padding-right 10px
      .attach
        display flex
        flex-direction column
        justify-content space-between
        .a-img
          flex 1
        .a-name
          flex 1

.iconfont
  font-size 14px
  color #1abb9c
.screen-top
  top 56px
</style>
