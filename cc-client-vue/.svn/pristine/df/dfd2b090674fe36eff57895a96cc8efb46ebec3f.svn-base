<template>
    <el-dialog modal-append-to-body lock-scroll custom-class="endSessionDialog" :class="dialogSize(info.endSessionLength)" top="10%" :title="$t('webchat.endSessionTitle')" v-model.trim="info.dialogTableVisible" :close-on-click-modal="false">
      <el-row>
        <el-col class="diction-subject" :span="24/info.endSessionLength">
          <div class="channel_dic_list">
            <div v-for="(department, index) in info.endOptionsUl" :class="{active: info.isActiveOne === index}" class="dic_item_desc_session" @click="changeMajorOne(department.name,'one', index)">
              <span class="dic_item_desc_arrow" v-if="department.options.length">&gt;</span>
              <div class="dic_item_desc_text ellipsis">{{department.name}}</div>
            </div>
          </div>
        </el-col>
        <el-col class="diction-subject" :span="24/info.endSessionLength" v-if="info.endSessionLength > 1">
          <div class="channel_dic_list" v-if="info.majorstwo.length">
            <div v-for="(major, index) in info.majorstwo" :class="{active: info.isActiveTwo === index}" class="dic_item_desc_session" @click="changeMajorOne(major.name,'two', index)">
              <span class="dic_item_desc_arrow" v-if="major.options.length">&gt;</span>
              <div class="dic_item_desc_text ellipsis">{{major.name}}</div>
            </div>
          </div>
        </el-col>
        <el-col class="diction-subject" :span="24/info.endSessionLength" v-if="info.endSessionLength > 2">
          <div class="channel_dic_list" v-if="info.majorsthree.length">
            <div  v-for="(majorthre, index) in info.majorsthree" :class="{active: info.isActiveThree === index}" class="dic_item_desc_session" @click="changeMajorOne(majorthre.name, 'three', index)">
              <div class="dic_item_desc_text ellipsis">{{majorthre.name}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-input v-if="info.isWebChat" class="remark" type="textarea" placeholder="备注" v-model.trim="info.remark"></el-input>
      <div class="tableVisibleBtnBox clearfix">
        <el-button class="tableVisibleBtn" @click="endSessionChat()" size="small">{{$t('public.cancel')}}</el-button>
        <el-button class="tableVisibleBtn" type="primary" @click="endSessionChat(true, false, info.remark)" size="small">{{$t('public.save')}}</el-button>
      </div>
    </el-dialog>
</template>
<script type="text/javascript">
  export default {
    name: 'EndSessionBox',
    props: {
      info: Object
    },
    methods: {
      changeMajorOne (data, flag, index) {
        if (flag === 'one') {
          this.info.endOptionsUl.forEach(d => {
            if (d.name === data) {
              this.info.endSessionActive = []
              this.info.endSessionFlag = false
              this.info.majorstwo = d.options || []
              this.info.majorsthree = []
              this.info.isActiveOne = index
              this.info.isActiveTwo = ''
              this.info.isActiveThree = ''
              if (this.info.majorstwo.length) {
                this.info.endSessionFlag = false
              } else {
                this.changeFlag(true)
              }
              this.info.endSessionActive[0] = index
            }
          })
        }
        if (flag === 'two') {
          this.info.majorstwo.forEach(d => {
            if (d.name === data) {
              if (this.info.endSessionActive.length > 2) {
                this.info.endSessionActive.remove(2)
              }
              this.info.majorsthree = d.options || []
              this.info.isActiveTwo = index
              this.info.isActiveThree = ''
              if (this.info.majorsthree.length) {
                this.info.endSessionFlag = false
              } else {
                this.changeFlag(true)
              }
              this.info.endSessionActive[1] = index
            }
          })
        }
        if (flag === 'three') {
          this.info.majorsthree.forEach(d => {
            if (d.name === data) {
              this.info.isActiveThree = index
              this.changeFlag(true)
              this.info.endSessionActive[2] = index
            }
          })
        }
      },
      endSessionChat (value, addClack, remark) {
        this.$emit('endSession', value, addClack, remark)
      },
      changeFlag (value) {
        this.$emit('changeEndSiFlag', value)
      },
      dialogSize (num) {
        if (num === 1) {
          return 'end-dialog-one'
        } else if (num === 2) {
          return 'end-dialog-two'
        } else if (num === 3) {
          return 'end-dialog-three'
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl"
  .diction-subject
    border 1px solid $c-border1
    height 148px
    overflow-y auto
    background #fff
  .dic_item_desc_session
    margin-top 8px
    text-align left
    font-weight bold
    cursor pointer
    height 20px
    line-height 20px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    position relative
  .dic_item_desc_arrow
    position absolute
    right 10px
  .dic_item_desc_text
    width 100%
    height 100%
    padding 0 18px
    box-sizing border-box
  .tableVisibleBtnBox
    clear both
    text-align center
    padding-top 10px
  .tableVisibleBtn
    display inline-block
  .active
    background #e8f5fc
  .remark
    margin-top 20px
</style>
