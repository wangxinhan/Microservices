   <template>
  <div class="workbench-business">
    <div class="workbench-title">
      {{ $t("workbench.businessSum") }}
    </div>
    <div class="workbench-business-content">
      <div class="workbench-business-wait" @click="undealBusiness">
        <p><span>{{data.waiting}}</span><br>{{ $t("workbench.businessWait") }}</p>
      </div>
      <el-row>
        <el-col :span="12">
          <div class="workbench-business-today">
          <p><span>{{data.todayDeal}}</span><br>{{ $t("workbench.businessDay") }}</p>
        </div></el-col>
        <el-col :span="12">
          <div class="workbench-business-month">
            <p><span>{{data.monthDeal}}</span><br>{{ $t("workbench.businessMonth") }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'workbenchbusiness',
    props: ['data'],
    methods: {
      undealBusiness () {
        this.$router.push({path: '/index/business', query: {active: 'business_my'}})
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "styl/_workbench";
  @import "../../../assets/common";
  .workbench-business
    float left
    width calc(25% - 12px)
    margin 5px
    bors(1px,#e7e7eb)
    height 357px
    background #fff
  .workbench-business-wait
    width 135px
    height 135px
    bors(2px,#ff6b6b)
    border-radius 50%
    margin 30px auto 0
    color #ff6b6b
    &:hover
      cursor pointer
  .workbench-business-today
    width 98px
    height 98px
    float right
    margin-right 6px
    bors(2px,#7ccdd2)
    border-radius 50%
    color #7ccdd2
  .workbench-business-month
    width 98px
    height 98px
    float left
    margin-left 6px
    bors(2px,#d9a3eb)
    border-radius 50%
    color #d9a3eb
  .workbench-business-wait p
    width 100%
    font-size 16px
    text-align center
    line-height 20px
    margin-top 45px
  .workbench-business-wait span
    font-size 38px
    text-align center
  .workbench-business-today p
  .workbench-business-month p
    width 100%
    font-size 14px
    text-align center
    line-height 20px
    margin-top 25px
  .workbench-business-today span
  .workbench-business-month span
    font-size 34px
    text-align center
</style>
