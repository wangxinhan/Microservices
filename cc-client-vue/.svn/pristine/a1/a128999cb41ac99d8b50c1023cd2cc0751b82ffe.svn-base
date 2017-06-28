<template>
  <div>
    <i class="wrap icon iconfont icon-ivr"  @click="ivr = true"></i>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('cti.TransferIVR')" v-model.trim="ivr" class="ivr">
      <template>
        <el-table :data="ivrData" stripe style="width: 100%">
          <el-table-column prop="DisplayName" :label="$t('cti.IVRMenuName')"></el-table-column>
          <el-table-column inline-template :label="$t('public.operate')">
          <span>
            <el-button @click="phoneIvrMenu($index)" type="text">{{$t('cti.turnMenu')}}</el-button>
          </span>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'TurnIvr',
    props: ['ivrData', 'isCloseIvrMenu'],
    data () {
      return {
        ivr: false
      }
    },
    watch: {
      'isCloseIvrMenu': 'closeIvrMenu'
    },
    methods: {
      phoneIvrMenu (index) {
        let num = this.ivrData[index].Exten
        let displayName = this.ivrData[index].DisplayName
        this.$store.dispatch('phoneToMenu', {exten: num, displayName: displayName})
      },
      closeIvrMenu () {
        if (!this.isCloseIvrMenu) { // 挂断通话的时候关掉弹窗
          this.ivr = false
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  div
    width 100%
    height 100%
  .wrap
    color #1abb9c
  .ivr
    text-align left
</style>
