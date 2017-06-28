<template>
  <div>
    <i class="iconfont icon-pingjia"  @click="investigate = true"></i>
    <el-dialog modal-append-to-body lock-scroll top="10%" :title="$t('cti.trunSatiTable')" v-model.trim="investigate" class="investigate">
      <template>
        <el-table :data="investData" stripe style="width: 100%">
          <el-table-column prop="DisplayName" :label="$t('cti.satiSearch')"></el-table-column>
          <el-table-column inline-template :label="$t('public.operate')">
          <span>
            <el-button @click="phoneInvestigate($index)" type="text">{{$t('cti.trunSearch')}}</el-button>
          </span>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'investigate',
    props: ['investData', 'isCloseInvestigate'],
    data () {
      return {
        investigate: false
      }
    },
    watch: {
      'isCloseInvestigate': 'closeInvestigate'
    },
    methods: {
      phoneInvestigate (index) {
        let num = this.investData[index].Exten
        this.$store.dispatch('phoneInvestigate', num)
      },
      closeInvestigate () {
        if (!this.isCloseInvestigate) { // 挂断通话的时候关掉弹窗
          this.investigate = false
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  div
    width 100%
    height 100%
  .investigate
    text-align left
</style>

