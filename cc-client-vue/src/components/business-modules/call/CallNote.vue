<template>
  <div>
    <i class="icon iconfont icon-gengxinkehu" @click.stop="callNote = true"></i>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('public.addRemarks')" v-model="callNote" >
      <span>
        <el-input size="small" type="textarea" v-model.trim="customerNote"></el-input>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="callNote = false" size="small">{{$t('public.cancel')}}</el-button>
        <el-button type="primary" size="small" @click.stop="saveCdrMemo">{{$t('public.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getStrLength } from '../../../utils/m7Utils.js'
  export default {
    name: 'callNote',
    data () {
      return {
        callNote: false,
        customerNote: this.comments || ''
      }
    },
    props: {
      callId: String,
      comments: String
    },
    methods: {
      saveCdrMemo () {
        this.callNote = false
        let data = {}
        data.CALL_SHEET_ID = this.callId
        data.memo = this.customerNote
        if (getStrLength(data.memo) > 700) {
          this.$message.error(this.$t('call.limitChineseCharacters'))
          return
        }
        let routeArry = this.$route.path.split('/')
        let tabType = routeArry[3]
        let lastData = {data: data, type: tabType}
        this.$store.dispatch('saveCdrMemo', lastData)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  div
    display inline-block
  i
    color #18BB9B
</style>
