<template>
  <div class="km" v-if="!loading">
    <template>
      <el-tabs v-model="activeName" :active-name="activeName" @tab-click="handleClick" class="el-tabs-km">
        <el-tab-pane name="inner"  :label="$t('km.kmInside')">
          <div v-if="activeName ==='inner'">
            <kmSearch :KmType="'inner'" @recentUpdate="recentUpdate"></kmSearch>
            <transition name="fade" mode="out-in">
              <router-view>
              </router-view>
            </transition>
          </div>
        </el-tab-pane>
        <el-tab-pane name="outer"  :label="$t('km.kmOutside')">
          <div v-if="activeName ==='outer'">
            <kmSearch :KmType="'outer'"  @recentUpdate="recentUpdate"></kmSearch>
           <transition name="fade" mode="out-in">
              <router-view>
              </router-view>
            </transition>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>
<script>
  import kmSearch from 'components/business-modules/km/km-search/index.vue'
  import kmDetail from 'components/business-modules/km/km-detail/index.vue'
  export default {
    name: 'KM',
    data () {
      return {
        activeName: 'inner',
        loading: true,
        addContent: '',
        recent: []
      }
    },
    methods: {
      recentUpdate (recentUpdate) {
        this.recent = recentUpdate
      },
      handleClick (type) {
        this.activeName = type.name
        this.$router.push('/index/km/' + type.name + '/curupdate')
        this.$store.commit('km/REFRESH_RIGHT', Math.random())
      }
    },
    components: {
      kmSearch,
      kmDetail
    },
    activated () {
      if (this.$route.path.split('/').length !== 5) {
        this.$router.push('/index/km/blank')
      }
    },
    beforeMount () {
      this.$router.push('/index/km/inner/curupdate')
      let self = this
      Promise.all([this.$store.dispatch('getCache', {type: 'agents'})]).then(function () {
        self.loading = false
      })
    }
  }
</script>
<style lang="stylus" scoped>
  @import "../../../assets/common.styl";
  .km
    height calc(100vh - 53px)
    background-color #fff
</style>
