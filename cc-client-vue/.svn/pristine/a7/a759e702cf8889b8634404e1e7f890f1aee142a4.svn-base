<template>
    <right class="questionnaire">
      <template slot="card">
        <CardGroup @changeCardItem="changeCardItem"></CardGroup>
      </template>
      <template slot="detail">
        <div v-loading="rLoading" :element-loading-text="$t('public.loadingModuleText')" v-show="rLoading" style="height: 600px">
        </div>
        <transition name="fade" mode="out-in" @before-enter="beforeEnter" @enter="beforeEnter">
          <router-view></router-view>
        </transition>
      </template>
    </right>
</template>
<script>
  import right from 'components/ui-modules/right-layout/RightLayout'
  import CardGroup from './QuestionCardGroup.vue'
  export default {
    name: 'questionnaire',
    data () {
      return {
        rLoading: false,
        loadResource: false
      }
    },
    components: {
      right,
      CardGroup
    },
    methods: {
      changeCardItem () {
        if (!this.loadResource) {
          this.rLoading = true
        }
      },
      beforeEnter () {
        this.loadResource = true
        this.rLoading = false
      }
    },
    beforeMount () {
      this.loadResource = true
//      this.$store.dispatch('quesList', {queryType: 'questionnaire_my'}).then(() => {
//        let _id = this.$store.state.questionnaire.questionnaireList.questionnaire_my.list[0]._id
//        this.$store.dispatch('showQuestionnaireDetail', {_id})
//      })
    }
  }
</script>
<style lang="stylus" scoped>
  .questionnaire
    height: calc(100vh - 53px);
</style>
