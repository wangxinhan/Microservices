<template>
  <div>
    <i  class="iconfont icon-zhuanjie3" @click="showDialog"></i>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('cti.trunCall')" v-model="showTransferDialog" class="transfer" @close="closeModal">
      <template>
          <div>
          <div class="search-top">
              <template>
                <el-select size="small" name="extenInput" @change="changeTransfer" v-model="exten" filterable :placeholder="$t('cti.enterKeyNum')">
                  <el-option
                    v-for="peer in peers"
                    :label="peer.DisplayName"
                    :value="peer.exten">
                  </el-option>
                </el-select>
              </template>
            <span class="search-btn" @click="softphonebarTransfer">{{$t('cti.Transfer')}}</span>
          </div>
          <div class="container">
            <p>{{$t('cti.TransferQueen')}}</p>
            <ul class="tree">
              <li class="" v-for="(item, index) in transferData">
                <div class="box1">
                  <div :class="item.children.length ? '' : 'subpadding'" @click.stop="togglePop2(index)" :index="index">
                    <span v-if="item.children.length"><i :class="openPop2.index===index&&openPop2.isOn ? 'el-icon-minus' : 'el-icon-plus'"></i></span>
                    <span class="cata-name">{{item.queueName}} </span>
                    <span>(</span>
                    <span class="number">{{item.idleAgentCount}}</span>
                    <span>{{$t('cti.OnlineNum')}})</span>
                    <i class="icon iconfont icon-zhuanjie1" @click="phoneTransfer($event, item.queueId,'skillgroup')"></i>
                  </div>
                </div>
                <ul v-show="openPop2.index === index && openPop2.isOn === true" v-if="item.children.length">
                  <li v-for="item in item.children">
                    <span class="cata-name display-name">{{item.DisplayName}}[{{item.exten}}]</span>
                    <i class="icon iconfont icon-zhuanjie1" @click="phoneTransfer($event, item.exten,'skillgroup')"></i>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'transfer',
    props: ['transferData', 'peers', 'showTransferDialog', 'isCloseTransfer'],
    data () {
      return {
        exten: '',
        transfer: false,
        open: {
          index: -1,
          isOn: false
        },
        openPop1: {
          index: -1,
          isOn: false
        },
        openPop2: {
          index: -1,
          isOn: false
        }
      }
    },
    watch: {
      'isCloseTransfer': 'closeTransfer'
    },
    methods: {
      toggle1 (index) {
        if (index === this.open.index) {
          this.open.isOn = !this.open.isOn
        } else {
          this.open.index = index
          this.open.isOn = true
        }
      },
      togglePop1: function (index) {
        if (index === this.openPop1.index) {
          this.openPop1.isOn = !this.openPop1.isOn
        } else {
          this.openPop1.index = index
          this.openPop1.isOn = true
        }
      },
      togglePop2: function (index) {
        if (index === this.openPop2.index) {
          this.openPop2.isOn = !this.openPop2.isOn
        } else {
          this.openPop2.index = index
          this.openPop2.isOn = true
        }
      },
      phoneTransfer: function (event, phoneNum, mode) {
        event.stopPropagation()
        this.$store.dispatch('phoneTransfer', {phoneNum: phoneNum, mode: mode})
      },
      softphonebarTransfer: function () {
        let inputnode = document.getElementsByName('extenInput')[0]
        let inputVal = ''
        if (inputnode) {
          inputVal = inputnode.value
        }
        if (/^\d+$/.test(this.$data.exten)) {
          let phoneNum = '9' + this.$data.exten
          this.$store.dispatch('phoneTransfer', {phoneNum: phoneNum, mode: 'number'})
        } else if (/^\d+$/.test(inputVal)) { // 所选的内容不是下拉框中的选项时
          let phoneNum = '9' + inputVal
          this.$store.dispatch('phoneTransfer', {phoneNum: phoneNum, mode: 'number'})
        } else {
          this.$message.error(this.$t('cti.agentNumberError'))
        }
      },
      showDialog () {
        this.$store.commit('SHOWTRANSFERDIALOG', true)
      },
      closeModal () {
        this.$store.commit('SHOWTRANSFERDIALOG', false)
      },
      closeTransfer () {
        if (!this.isCloseTransfer) { // 挂断通话的时候关掉弹窗
          this.$store.commit('SHOWTRANSFERDIALOG', false)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  div
    width 100%
    height 100%
  .container
    color #1a1a1a
  .transfer
    text-align left
  .search-input
    border 0
    width 94%
    height 100%
    float left
  .search-wrap
    float left
    border 1px solid #ddd
    height 30px
    border-radius 2px
    width 85%
    padding 0 1%
  .search-btn
    float right
    width 10%
    height 30px
    background #1abc9b
    border-radius 2px
    color #fff
    line-height 30px
    text-align center
    float right
  .search-top:after
    content ""
    display block
    clear both
  .icon-zhuanjie1
    color #1abb9c
    float right
  .tree>li:hover
    background #E8F5FC
    ul>li
      background #fff
  .tree>li ul>li:hover
    background #E8F5FC
  .number
    color: #1abc9b
  .display-name
    padding-left 20px
  .search-top
    position relative
  .search-top>div
    width 88%
  .search-btn
    position absolute
    top 0
    right 0
  .tree
    max-height 300px
    overflow auto
</style>
